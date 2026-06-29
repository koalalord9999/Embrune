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
    const inputRef = useRef<HTMLInputElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [selectedTab, setSelectedTab] = useState<'All' | 'Game' | 'Public' | 'Private' | 'Clan' | 'Trade'>('All');

    useEffect(() => {
        if (containerRef.current && !isMinimized) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, chatMessages, isMinimized, selectedTab, isDialogueActive]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

            if (e.key === 'Enter') {
                if (!isInputFocused) {
                    e.preventDefault();
                    setIsMinimized(false);
                    setTimeout(() => inputRef.current?.focus(), 0);
                }
                return;
            }

            if (e.key === '/') {
                if (!isInputFocused) {
                    e.preventDefault();
                    setIsMinimized(false);
                    setChatInput('/');
                    setTimeout(() => inputRef.current?.focus(), 0);
                }
                return;
            }
            if (e.key === 'r') {
                if (!isInputFocused) {
                    e.preventDefault();
                    setIsMinimized(false);
                    setChatInput('/r ');
                    setTimeout(() => inputRef.current?.focus(), 0);
                }
                return;
            }

            if (e.key === 'Escape') {
                if (isInputFocused) {
                    (document.activeElement as HTMLElement).blur();
                }
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

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
            if (typeof log === 'string') {
                return { message: log, timestamp: Date.now(), type: 'log' as const };
            }
            return { ...log, type: 'log' as const };
        }),
        ...chatMessages.map(msg => {
            const isPM = msg.isPM || msg.message.startsWith('(PM)');
            let displayMessage = msg.message;
            let displayUsername = msg.username;

            // If it's a PM, parse the sender/recipient (fallback for old messages)
            if (isPM) {
                const pmMatch = msg.message.match(/^\(PM from (.*?)\): (.*)$/);
                if (pmMatch) {
                    displayUsername = pmMatch[1];
                    displayMessage = pmMatch[2];
                }
            }

            return {
                message: displayMessage,
                timestamp: msg.timestamp || Date.now(),
                type: (msg.type === 'system' ? 'system' : 'chat') as 'chat' | 'system',
                username: displayUsername,
                originalUsername: msg.username,
                isPM,
                sender: msg.sender,
                recipient: msg.recipient
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
        <div className={`activity-log-wrapper bg-black/70 border-2 border-gray-600 rounded-lg p-1.5 transition-all duration-300 ease-in-out font-pixel-rpg ${isMinimized ? 'h-10 flex-shrink-0' : 'h-[200px]'} flex flex-col`}>
            <div className="flex justify-between items-center flex-shrink-0 mb-1">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {['All', 'Game', 'Public', 'Private', 'Clan', 'Trade'].map(label => (
                        <button
                            key={label}
                            onClick={() => setSelectedTab(label as any)}
                            className={`px-1.5 py-0 text-lg rounded ${selectedTab === label ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsMinimized(v => !v)} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-lg font-bold border border-gray-500 flex items-center justify-center">
                    {isMinimized ? '+' : '-'}
                </button>
            </div>
            {!isMinimized && (
                <>
                    <div ref={containerRef} className="flex-grow overflow-y-auto pr-1 animate-fade-in min-h-0">
                        <div className="">
                            {filteredLogs.map((entry, index) => (
                                <p key={`entry-${index}`} className={`text-lg leading-none ${entry.type === 'system' ? 'text-gray-400 italic' :
                                    entry.type === 'chat' ? 'text-zinc-100' : 'text-gray-300'
                                    }`}>
                                    <span className="text-gray-500 mr-2">[{formatTimestamp(entry.timestamp)}]</span>
                                    {entry.type === 'chat' && ('isPM' in entry && entry.isPM) && (
                                        <span
                                            className="font-bold cursor-pointer text-pink-400"
                                            onClick={() => !isDialogueActive && setChatInput(`/pm "${entry.originalUsername || entry.username}" `)}
                                        >
                                            {('sender' in entry && entry.sender === username)
                                                ? `To ${entry.recipient}: `
                                                : `From ${'sender' in entry && entry.sender ? entry.sender : entry.username}: `}
                                        </span>
                                    )}
                                    {entry.type === 'chat' && !('isPM' in entry && entry.isPM) && (
                                        <span
                                            className={`font-bold cursor-pointer ${('originalUsername' in entry && entry.originalUsername === username)
                                                ? 'text-yellow-500' // Gold for me
                                                : 'text-emerald-400' // Green for others
                                                }`}
                                            onClick={() => !isDialogueActive && handleMessageClick(entry.originalUsername || entry.username)}
                                        >
                                            {entry.username}:
                                        </span>
                                    )}
                                    {(() => {
                                        if (entry.type === 'chat' && !entry.isPM) {
                                            const colorMatch = entry.message.match(/^(red|green|blue|yellow|orange|purple):\s?(.*)$/i);
                                            if (colorMatch) {
                                                const color = colorMatch[1].toLowerCase();
                                                const text = colorMatch[2];
                                                const colorMap: Record<string, string> = {
                                                    red: 'text-red-500',
                                                    green: 'text-green-500',
                                                    blue: 'text-blue-500',
                                                    yellow: 'text-yellow-500',
                                                    orange: 'text-orange-500',
                                                    purple: 'text-purple-500'
                                                };
                                                return <span className={colorMap[color]}>{text}</span>;
                                            }
                                        }
                                        return (
                                            <span className={'isPM' in entry && entry.isPM ? 'text-pink-400' : ''}>
                                                {entry.message}
                                            </span>
                                        );
                                    })()}
                                </p>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {!isMinimized && (
                <form onSubmit={handleSendMessage} className="flex mt-1">
                    <input
                        ref={inputRef}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isDialogueActive}
                        tabIndex={isDialogueActive ? -1 : undefined}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-0 text-lg text-zinc-100 disabled:opacity-50"
                        placeholder="Type /pm username message..."
                    />
                    <button type="submit" disabled={isDialogueActive} className="ml-2 bg-emerald-600 px-3 py-0 rounded text-lg font-bold disabled:opacity-50">Send</button>
                </form>
            )}
        </div>
    );
};

export default ActivityLog;
