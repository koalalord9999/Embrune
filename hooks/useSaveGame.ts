import { useEffect, useRef } from 'react';
import { saveSlotState } from '../db';
import { minifyGameState } from '../utils/saveMinifier';

export const useSaveGame = (gameState: any, slotId: number) => {
    const isInitialMount = useRef(true);
    const saveTimeoutRef = useRef<number | null>(null);
    const gameStateRef = useRef(gameState);
    const slotIdRef = useRef(slotId);

    // Keep refs updated for the beforeunload listener
    useEffect(() => {
        gameStateRef.current = gameState;
        slotIdRef.current = slotId;
    }, [gameState, slotId]);

    // Handle Alt+F4 / Window Close
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (gameStateRef.current) {
                const minified = minifyGameState(gameStateRef.current);
                const dataStr = JSON.stringify(minified);
                const base64Str = btoa(dataStr);
                localStorage.setItem(`embrune_slot_${slotIdRef.current}`, 's4V' + base64Str);
                // Note: IndexDB (Dexie) is async and usually won't complete here,
                // but localStorage is sync and will act as a fallback.
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = window.setTimeout(() => {
            if (gameState) {
                const minified = minifyGameState(gameState);
                saveSlotState(slotId, minified);
                const dataStr = JSON.stringify(minified);
                const base64Str = btoa(dataStr);
                localStorage.setItem(`embrune_slot_${slotId}`, 's4V' + base64Str);
            }
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                // Force a final save on unmount (e.g., returning to menu)
                if (gameState) {
                    const minified = minifyGameState(gameState);
                    saveSlotState(slotId, minified);
                    const dataStr = JSON.stringify(minified);
                    const base64Str = btoa(dataStr);
                    localStorage.setItem(`embrune_slot_${slotId}`, 's4V' + base64Str);
                }
            }
        };
    }, [gameState, slotId]);
};
