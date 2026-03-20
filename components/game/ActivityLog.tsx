import React, { useEffect, useRef, useState } from 'react';
import { Message, LogEntry } from '../../types';

interface ActivityLogProps {
    logs: (LogEntry | string)[];
    chatMessages: Message[];
    onSendMessage: (message: string) => void;
    isDialogueActive?: boolean;
    username: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, chatMessages, onSendMessage, isDialogueActive = false, username }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [selectedTab, setSelectedTab] = useState<'All' | 'Game' | 'Public' | 'Private' | 'Clan' | 'Trade'>('All');

    useEffect(() => {
        if (containerRef.current && !isMinimized) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, chatMessages, isMinimized, selectedTab]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(chatInput);
        setChatInput('');
    };

    const handleMessageClick = (sender: string) => {
        if (sender !== username) {
            setChatInput(`/pm ${sender} `);
        }
    };

    // Combine and sort logs and chatMessages
    const combinedLogs = [
        ...logs.map(log => {
            return { ...log, type: 'log' as const };
        }),
        ...chatMessages.map(msg => {
            const isPM = msg.isPM || msg.message.startsWith('(PM)');
            let displayMessage = msg.message;
            let displayUsername = msg.username;
            
            // If it's a PM, parse the sender/recipient
            if (isPM) {
                // Example PM message: "(PM) From PlayerName: Hello" or "(PM) To PlayerName: Hello"
                const match = msg.message.match(/^\(PM\) (From|To) (.*?): (.*)$/);
                if (match) {
                    const [_, direction, targetName, content] = match;
                    displayUsername = `${direction} ${targetName}`;
                    displayMessage = content;
                }
            }

            return { 
                message: displayMessage, 
                timestamp: msg.timestamp || Date.now(), 
                type: 'chat' as const,
                username: displayUsername,
                originalUsername: msg.username,
                isPM
            };
        })
    ].sort((a, b) => a.timestamp - b.timestamp);

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const filteredLogs = combinedLogs.filter(entry => {
        if (selectedTab === 'All') return true;
        if (selectedTab === 'Game') return entry.type === 'log';
        if (selectedTab === 'Public') return entry.type === 'chat' && !entry.isPM;
        if (selectedTab === 'Private') return entry.type === 'chat' && entry.isPM;
        if (selectedTab === 'Clan') return entry.type === 'chat' && !entry.isPM;
        if (selectedTab === 'Trade') return entry.type === 'chat' && !entry.isPM;
        return true;
    });

    return (
        <div className={`activity-log-wrapper bg-black/70 border-2 border-gray-600 rounded-lg p-2 transition-all duration-300 ease-in-out ${isMinimized ? 'h-10 flex-shrink-0' : 'h-[200px]'} flex flex-col`}>
            <div className="flex justify-between items-center flex-shrink-0 mb-1">
                <div className="flex items-center gap-1">
                    {['All', 'Game', 'Public', 'Private', 'Clan', 'Trade'].map(label => (
                        <button 
                            key={label} 
                            onClick={() => setSelectedTab(label as any)}
                            className={`px-2 py-0.5 text-xs rounded ${selectedTab === label ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsMinimized(v => !v)} className="w-5 h-5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold border border-gray-500 flex items-center justify-center">
                    {isMinimized ? '+' : '-'}
                </button>
            </div>
            {!isMinimized && !isDialogueActive && (
                <>
                    <div ref={containerRef} className="flex-grow overflow-y-auto pr-1 animate-fade-in min-h-0">
                        <div className="space-y-1">
                            {filteredLogs.map((entry, index) => (
                                <p key={`entry-${index}`} className={`text-sm leading-tight ${entry.type === 'chat' ? 'text-zinc-100' : 'text-gray-300'}`}>
                                    <span className="text-gray-500 mr-1">[{formatTimestamp(entry.timestamp)}]</span>
                                    {entry.type === 'chat' && (
                                        <span 
                                            className={`font-bold cursor-pointer ${
                                                entry.isPM 
                                                    ? 'text-pink-400' // Pink for PMs
                                                    : entry.originalUsername === username 
                                                        ? 'text-yellow-500' // Gold for me
                                                        : 'text-emerald-400' // Green for others
                                            }`}
                                            onClick={() => handleMessageClick(entry.originalUsername || entry.username)}
                                        >
                                            {entry.username}: 
                                        </span>
                                    )}
                                    <span className={entry.isPM ? 'text-pink-400' : ''}>
                                        {entry.message}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {!isMinimized && !isDialogueActive && (
                <form onSubmit={handleSendMessage} className="flex mt-1">
                    <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-sm text-zinc-100"
                        placeholder="Type /pm username message..."
                    />
                    <button type="submit" className="ml-2 bg-emerald-600 px-3 py-0.5 rounded text-sm">Send</button>
                </form>
            )}
        </div>
    );
};

export default ActivityLog;
