import { useState, useCallback } from 'react';
import { PlayerQuestState } from '../types';
import { QUESTS } from '../data/quests';

export const useQuests = (initialData: { playerQuests: PlayerQuestState[], lockedPois: string[] }) => {
    const [playerQuests, setPlayerQuests] = useState<PlayerQuestState[]>(initialData.playerQuests);
    const [lockedPois, setLockedPois] = useState<string[]>(initialData.lockedPois);

    const startQuest = useCallback((questId: string, addLog: (message: string) => void) => {
        const questData = QUESTS[questId];
        if (!questData) return;

        setPlayerQuests(quests => {
            if (quests.some(q => q.questId === questId)) {
                return quests;
            }
            addLog(`New quest started: ${questData.name}`);
            return [...quests, { questId, currentStage: 0, progress: 0, isComplete: false }];
        });
    }, []);

    const resetQuest = useCallback((questId: string, addLog: (message: string) => void) => {
        const questData = QUESTS[questId];
        if (questData && playerQuests.some(q => q.questId === questId)) {
            setPlayerQuests(quests => quests.filter(q => q.questId !== questId));
            addLog(`DEV: Reset quest '${questData.name}'.`);
        } else {
            addLog(`DEV: Quest '${questData?.name || questId}' not active or not found.`);
        }
    }, [playerQuests]);
    
    return { playerQuests, setPlayerQuests, lockedPois, setLockedPois, startQuest, resetQuest };
};