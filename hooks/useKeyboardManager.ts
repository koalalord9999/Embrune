import { useEffect, useRef, useCallback } from 'react';
import { ActivePanel } from '../types';
import { Keybindings } from './useUIState';

export type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

interface KeyboardManagerProps {
    keybindings: Keybindings;
    isBusy: boolean;
    onTravel: (direction: Direction) => void;
    onAction: (index: number, isShiftPressed: boolean) => void;
    onPanelSwitch: (panel: ActivePanel) => void;
    onEsc?: () => void;
    onSlash?: () => void;
    onR?: () => void;
}

export const useKeyboardManager = ({ keybindings, isBusy, onTravel, onAction, onPanelSwitch, onEsc, onSlash, onR }: KeyboardManagerProps) => {
    const keysPressed = useRef<Set<string>>(new Set());

    const resolveTravel = useCallback((): Direction | null => {
        const up = keysPressed.current.has(keybindings.move_n);
        const down = keysPressed.current.has(keybindings.move_s);
        const left = keysPressed.current.has(keybindings.move_w);
        const right = keysPressed.current.has(keybindings.move_e);

        // Count how many travel keys are pressed
        const count = [up, down, left, right].filter(Boolean).length;
        if (count === 0 || count > 2) return null;

        // Exactly 1 or 2 keys
        if (up && left) return 'NW';
        if (up && right) return 'NE';
        if (down && left) return 'SW';
        if (down && right) return 'SE';

        // If 2 keys are pressed but they are opposite (Up+Down or Left+Right), count would be 2 but no diagonal case matches.
        // User wants to ignore invalid inputs.
        if (count === 2) return null;

        if (up) return 'N';
        if (down) return 'S';
        if (left) return 'W';
        if (right) return 'E';
        return null;
    }, [keybindings]);

    const resolveAction = useCallback((key: string, code: string) => {
        if (key === keybindings.action_1 || code === `Digit${keybindings.action_1}`) return 0;
        if (key === keybindings.action_2 || code === `Digit${keybindings.action_2}`) return 1;
        if (key === keybindings.action_3 || code === `Digit${keybindings.action_3}`) return 2;
        if (key === keybindings.action_4 || code === `Digit${keybindings.action_4}`) return 3;
        if (key === keybindings.action_5 || code === `Digit${keybindings.action_5}`) return 4;
        if (key === keybindings.action_6 || code === `Digit${keybindings.action_6}`) return 5;
        if (key === keybindings.action_7 || code === `Digit${keybindings.action_7}`) return 6;
        if (key === keybindings.action_8 || code === `Digit${keybindings.action_8}`) return 7;
        if (key === keybindings.action_9 || code === `Digit${keybindings.action_9}`) return 8;
        return null;
    }, [keybindings]);

    const resolvePanel = useCallback((key: string, code: string): ActivePanel | null => {
        if (key === keybindings.panel_combat) return 'combat';
        if (key === keybindings.panel_skills) return 'skills';
        if (key === keybindings.panel_quests) return 'quests';
        if (key === keybindings.panel_inventory) return 'inventory';
        if (key === keybindings.panel_equipment) return 'equipment';
        if (key === keybindings.panel_prayer) return 'prayer';
        if (key === keybindings.panel_spells) return 'spellbook';
        if (key === keybindings.panel_music) return 'sound';
        if (key === keybindings.panel_settings) return 'settings';
        // Handle Backquote specifically via code if needed, but key works too
        if (key === keybindings.panel_dev || code === keybindings.panel_dev) return 'dev';
        return null;
    }, [keybindings]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onEsc?.();
                return;
            }

            // Check for panels first to handle dev panel bypass
            const targetPanel = resolvePanel(e.key, e.code);
            if (targetPanel === 'dev') {
                e.preventDefault();
                onPanelSwitch('dev');
                return;
            }

            if (isBusy) return;

            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

            if (e.key === '/') {
                onSlash?.();
                return;
            }

            if (e.key === 'r') {
                onR?.();
                return;
            }

            keysPressed.current.add(e.key);

            // Check for actions (1-9)
            const actionIdx = resolveAction(e.key, e.code);
            if (actionIdx !== null) {
                // Prevent default for number keys to avoid chatbox focus (if handled elsewhere)
                e.preventDefault();
                onAction(actionIdx, e.shiftKey);
                return;
            }

            // Check for travel
            const travelDir = resolveTravel();
            if (travelDir !== null) {
                onTravel(travelDir);
                return;
            }

            // Check for other panel switches
            if (targetPanel !== null) {
                e.preventDefault();
                onPanelSwitch(targetPanel);
                return;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key);
        };

        const handleBlur = () => {
            keysPressed.current.clear();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isBusy, onTravel, onAction, resolveTravel, resolveAction]);
};
