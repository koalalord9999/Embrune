import { useState, useCallback } from 'react';
import { LogEntry } from '../types';

export const useActivityLog = (initialLog: (LogEntry | string)[]) => {
    const [activityLog, setActivityLog] = useState<(LogEntry | string)[]>(initialLog);

    const addLog = useCallback((message: string) => {
        const timestamp = Date.now();
        setActivityLog(prev => {
            const regex = /^(.*?)(\s\((\d+)\))?$/;
            
            // Look for a matching message in the last 10 log entries.
            const searchStartIndex = Math.max(0, prev.length - 10);

            for (let i = prev.length - 1; i >= searchStartIndex; i--) {
                const existingLog = prev[i];
                const messageText = typeof existingLog === 'string' ? existingLog : existingLog.message;
                const match = messageText.match(regex);

                if (match) {
                    const baseMessage = match[1];
                    const count = match[3] ? parseInt(match[3], 10) : 1;

                    if (baseMessage === message) {
                        // Match found. Update count, remove old entry, add new one to the end.
                        const newCount = count + 1;
                        const newMessage = `${message} (${newCount})`;
                        
                        const newLogs = [...prev];
                        newLogs.splice(i, 1); // Remove the old entry at its original position
                        newLogs.push({ message: newMessage, timestamp }); // Add the updated entry to the end
                        
                        return newLogs.slice(-125); // Maintain max log size
                    }
                }
            }

            // No match found in the last 10 entries, just append the new message.
            return [...prev.slice(-124), { message, timestamp }];
        });
    }, []);

    return { activityLog, setActivityLog, addLog };
};
