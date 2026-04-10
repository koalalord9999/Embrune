import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Message } from '../types';

export const useChat = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const pusherRef = useRef<Pusher | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());
  const blockedUsersRef = useRef<Set<string>>(blockedUsers);
  const lastPmSender = useRef<string | null>(null);

  useEffect(() => {
    blockedUsersRef.current = blockedUsers;
  }, [blockedUsers]);

  const getBackendUrl = () => {
    let url = import.meta.env.VITE_BACKEND_URL || window.location.origin;
    if (url && !url.startsWith('http') && !url.startsWith('https') && !url.startsWith('/')) {
      return `https://${url}`;
    }
    return url;
  };

  useEffect(() => {
    pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || '',
      authEndpoint: `${getBackendUrl()}/.netlify/functions/pusher-auth`,
      auth: {
        params: { username }
      }
    });

    const globalChannel = pusherRef.current.subscribe('embrune-chat');
    globalChannel.bind('new-message', (data: Message) => {
      if (blockedUsersRef.current.has(data.username) || (data.sender && blockedUsersRef.current.has(data.sender))) return;
      setMessages((prev) => [...prev, { ...data, timestamp: data.timestamp || Date.now() }]);
    });

    const privateChannel = pusherRef.current.subscribe(`embrune-pm-${username}`);
    privateChannel.bind('new-message', (data: Message) => {
      if (blockedUsersRef.current.has(data.username) || (data.sender && blockedUsersRef.current.has(data.sender))) return;
      if (data.sender && data.sender !== username) {
        lastPmSender.current = data.sender;
      }
      setMessages((prev) => [...prev, { ...data, isPM: true, type: 'private', timestamp: data.timestamp || Date.now() }]);
    });

    const presenceChannel = pusherRef.current.subscribe('presence-embrune');
    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const onlineUsernames = Object.keys(members.members).filter(m => !!m);
      setMessages((prev) => [...prev, { 
        username: 'System', 
        message: `Currently online: ${onlineUsernames.join(', ')}`, 
        type: 'system', 
        timestamp: Date.now() 
      }]);
    });

    return () => {
      pusherRef.current?.unsubscribe('embrune-chat');
      pusherRef.current?.unsubscribe(`embrune-pm-${username}`);
      pusherRef.current?.unsubscribe('presence-embrune');
    };
  }, [username]);

  const sendMessage = async (username: string, input: string) => {
    if (!input.trim()) return;

    if (input === '/online') {
      const presenceChannel = pusherRef.current?.channel('presence-embrune') as any;
      if (presenceChannel?.members?.members) {
        const members = Object.keys(presenceChannel.members.members).filter(m => !!m);
        setMessages(prev => [...prev, { username: 'System', message: `Online players: ${members.join(', ')}`, type: 'system', timestamp: Date.now() }]);
      } else {
        setMessages(prev => [...prev, { username: 'System', message: `Online players: could not fetch.`, type: 'system', timestamp: Date.now() }]);
      }
      return;
    }

    if (input.startsWith('/block ')) {
      const targetUser = input.slice(7).trim();
      if (targetUser) {
        setBlockedUsers(prev => new Set([...prev, targetUser]));
        setMessages(prev => [...prev, { username: 'System', message: `You have blocked ${targetUser}.`, type: 'system', timestamp: Date.now() }]);
      }
      return;
    }

    if (input.startsWith('/unblock ')) {
      const targetUser = input.slice(9).trim();
      if (targetUser) {
        setBlockedUsers(prev => {
          const next = new Set(prev);
          next.delete(targetUser);
          return next;
        });
        setMessages(prev => [...prev, { username: 'System', message: `You have unblocked ${targetUser}.`, type: 'system', timestamp: Date.now() }]);
      }
      return;
    }

    let finalInput = input;
    if (finalInput.startsWith('/r ')) {
      if (!lastPmSender.current) {
        setMessages(prev => [...prev, { username: 'System', message: `No one has sent you a PM yet.`, type: 'system', timestamp: Date.now() }]);
        return;
      }
      finalInput = `/pm ${lastPmSender.current} ${finalInput.slice(3)}`;
    }

    let type = 'global';
    let recipient = undefined;
    let messageContent = finalInput;

    if (finalInput.startsWith('/pm ')) {
      const match = finalInput.match(/^\/pm "([^"]+)" (.*)$/) || finalInput.match(/^\/pm ([^ ]+) (.*)$/);
      if (match) {
        recipient = match[1];
        messageContent = match[2];
        type = 'private';
      }
    }

    try {
      const response = await fetch(`${getBackendUrl()}/.netlify/functions/chat`, {
        method: 'POST',
        body: JSON.stringify({ username, message: messageContent, type, recipient }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send message:', response.status, errorText);
        alert(`Failed to send message: ${errorText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Check console.');
    }
  };

  const announceLogin = async (username: string) => {
    try {
      await fetch(`${getBackendUrl()}/.netlify/functions/chat`, {
        method: 'POST',
        body: JSON.stringify({ username, message: `${username} has logged in.`, type: 'system' }),
      });
    } catch (error) {
      console.error('Error announcing login:', error);
    }
  };

  const announceLogout = async (username: string) => {
    try {
      await fetch(`${getBackendUrl()}/.netlify/functions/chat`, {
        method: 'POST',
        body: JSON.stringify({ username, message: `${username} has logged out.`, type: 'system' }),
      });
    } catch (error) {
      console.error('Error announcing logout:', error);
    }
  };

  return { messages, sendMessage, announceLogin, announceLogout, blockedUsers };
};
