import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../../types';

interface ActivityLogProps {
    logs: string[];
    chatMessages: Message[];
    onSendMessage: (message: string) => void;
    isDialogueActive?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, chatMessages, onSendMessage, isDialogueActive = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        if (containerRef.current && !isMinimized) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, chatMessages, isMinimized]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(chatInput);
        setChatInput('');
    };

    return (
        <div className={`activity-log-wrapper bg-black/70 border-2 border-gray-600 rounded-lg p-3 transition-all duration-300 ease-in-out ${isMinimized ? 'h-12 flex-shrink-0' : 'h-64'} flex flex-col`}>
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
                <h4 className="text-yellow-300 font-semibold">Activity & Chat</h4>
                <button onClick={() => setIsMinimized(v => !v)} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-lg font-bold border border-gray-500 flex items-center justify-center">
                    {isMinimized ? '+' : '-'}
                </button>
            </div>
            {!isMinimized && !isDialogueActive && (
                <div ref={containerRef} className="flex-grow overflow-y-auto pr-1 animate-fade-in min-h-0">
                    <div className="space-y-1">
                        {logs.map((log, index) => (
                            <p key={`log-${index}`} className="text-sm text-gray-300 leading-tight">
                                {log}
                            </p>
                        ))}
                        {chatMessages.map((m, index) => (
                            <p key={`chat-${index}`} className="text-sm text-zinc-100 leading-tight">
                                <span className="font-bold text-emerald-400">{m.username}: </span>
                                {m.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}
            {!isMinimized && !isDialogueActive && (
                <form onSubmit={handleSendMessage} className="flex mt-2">
                    <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100"
                        placeholder="Type /pm username message..."
                    />
                    <button type="submit" className="ml-2 bg-emerald-600 px-3 py-1 rounded text-sm">Send</button>
                </form>
            )}
        </div>
    );
};

export default ActivityLog;
