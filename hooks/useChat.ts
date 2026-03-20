import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Message } from '../types';

export const useChat = (username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || '',
    });

    const globalChannel = pusherRef.current.subscribe('embrune-chat');
    globalChannel.bind('new-message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, timestamp: data.timestamp || Date.now() }]);
    });

    const privateChannel = pusherRef.current.subscribe(`embrune-pm-${username}`);
    privateChannel.bind('new-message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, timestamp: data.timestamp || Date.now() }]);
    });

    return () => {
      pusherRef.current?.unsubscribe('embrune-chat');
      pusherRef.current?.unsubscribe(`embrune-pm-${username}`);
    };
  }, [username]);

  const sendMessage = async (username: string, input: string) => {
    if (!input.trim()) return;

    let type = 'global';
    let recipient = undefined;
    let messageContent = input;

    if (input.startsWith('/pm ')) {
      const match = input.match(/^\/pm "([^"]+)" (.*)$/) || input.match(/^\/pm ([^ ]+) (.*)$/);
      if (match) {
        recipient = match[1];
        messageContent = match[2];
        type = 'private';
      }
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/.netlify/functions/chat`, {
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

  return { messages, sendMessage };
};
