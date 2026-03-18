import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

interface Message {
  username: string;
  message: string;
  sender?: string;
}

export const Chat: React.FC<{ username: string }> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    // Initialize Pusher client
    // NOTE: Use the PUSHER_KEY from your dashboard here
    pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || '',
    });

    // Subscribe to global chat
    const globalChannel = pusherRef.current.subscribe('embrune-chat');
    globalChannel.bind('new-message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Subscribe to private chat
    const privateChannel = pusherRef.current.subscribe(`embrune-pm-${username}`);
    privateChannel.bind('new-message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, message: `(PM) ${data.message}` }]);
    });

    return () => {
      pusherRef.current?.unsubscribe('embrune-chat');
      pusherRef.current?.unsubscribe(`embrune-pm-${username}`);
    };
  }, [username]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let type = 'global';
    let recipient = undefined;
    let messageContent = input;

    if (input.startsWith('/pm ')) {
      const parts = input.split(' ');
      recipient = parts[1];
      messageContent = parts.slice(2).join(' ');
      type = 'private';
    }

    try {
      const response = await fetch('/.netlify/functions/chat', {
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

    setInput('');
  };

  return (
    <div className="flex flex-col h-64 border border-zinc-700 rounded-lg p-4 bg-zinc-900 text-zinc-100">
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {messages.map((m, i) => (
          <div key={i}>
            <span className="font-bold text-emerald-400">{m.username}: </span>
            {m.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1"
          placeholder="Type /pm username message..."
        />
        <button type="submit" className="ml-2 bg-emerald-600 px-3 py-1 rounded">Send</button>
      </form>
    </div>
  );
};
