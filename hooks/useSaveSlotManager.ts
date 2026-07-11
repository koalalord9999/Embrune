import React, { useState, useEffect, useCallback } from 'react';
import { saveSlotState, loadAllSlots, deleteSlot, loadSlotState } from '../db';
import {  ALL_SKILLS, REPEATABLE_QUEST_POOL, ITEMS, MONSTERS, SPELLS, BANK_CAPACITY, QUESTS  } from '../constants';
import { POIS } from '../data/pois';
import { CombatStance, PlayerSlayerTask, GeneratedRepeatableQuest, InventorySlot, WorldState, Spell, BankTab, ActiveStatModifier, ActiveBuff, PlayerType, Slot, AgilityState } from '../types';
import { useUIState } from './useUIState';
import { inflateGameState } from '../utils/saveInflater';
import { minifyGameState } from '../utils/saveMinifier';
import { isFestivalActive } from '../utils/festivalDates';

/**
 * Quest variable keys that are exclusive to the Oakhaven Lantern Festival.
 * These are purged from the save on login when the festival is not active,
 * since daily-cooldown and minigame state from a prior year is meaningless.
 */
const FESTIVAL_QUEST_VARIABLE_KEYS = [
    'last_played_trivia',
    'last_played_lantern',
    'last_played_gourd',
    'trivia_question_index',
    'trivia_answered',
    'lantern_thermal_draft',
    'gourd_smash_result',
    'ring_toss_peg',
    'ring_toss_rings_left',
];

type GameState = typeof defaultState;

const defaultSettings = {
    showTooltips: true,
    showXpDrops: true,
    confirmValuableDrops: true,
    valuableDropThreshold: 1000,
    showMinimapHealth: false,
    showCombatPlayerHealth: false,
    showCombatEnemyHealth: false,
    showHitsplats: true,
    isOneClickMode: false,
    devSettings: {
        xpMultiplier: 1,
        combatSpeedMultiplier: 1,
        isPlayerInvisible: false,
        isAutoBankOn: false,
        isGodModeOn: false,
    }
};

const defaultState = {
    username: '',
    playerType: PlayerType.Normal,
    skills: ALL_SKILLS,
    inventory: [],
    bank: [{ id: 0, name: 'Main', icon: null, items: [] }] as BankTab[],
    coins: 0,
    equipment: { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null },
    combatStance: CombatStance.Accurate,
    currentHp: 10,
    currentPrayer: 1,
    runEnergy: 100,
    isRunToggled: false,
    isResting: false,
    lastHomeTeleport: 0,
    agilityState: { activeCourseId: null, currentObstacleIndex: 0, lapsCompleted: {} } as AgilityState,
    activePrayers: [] as string[],
    currentPoiId: 'tutorial_entrance',
    playerQuests: [{ questId: 'embrune_101', currentStage: 0, progress: 0, isComplete: false }],
    lockedPois: Object.keys(POIS).filter(id => {
        const poi = POIS[id];
        if (!poi.unlockRequirement) return false;
        if (poi.unlockRequirement.type === 'quest') {
            const req = poi.unlockRequirement;
            // New characters start with 'embrune_101' at stage 0, others not started (-1)
            const stage = req.questId === 'embrune_101' ? 0 : -1;
            const op = req.operator || 'gte';
            const isMet = op === 'gte' ? (stage >= req.stage) : (stage <= req.stage);
            return !isMet;
        }
        return true;
    }),
    clearedSkillObstacles: [],
    bookmarks: [] as string[],
    resourceNodeStates: {},
    monsterRespawnTimers: {},
    groundItems: {},
    repeatableQuestsState: {
        boards: {},
        activePlayerQuest: null,
        nextResetTimestamp: Date.now() + 30 * 60 * 1000,
        completedQuestIds: [],
        boardCompletions: {},
    },
    slayerTask: null as PlayerSlayerTask | null,
    slayerCredits: 0,
    slayerTaskStreak: 0,
    worldState: { windmillFlour: 0, deathMarker: null, bankPlaceholders: false, hpBoost: null, recentlyKilled: [], depletedHouses: [], nextHouseResetTimestamp: 0, dehydrationLevel: 0, unlockedMusicTracks: ['login', 'generated_track_1', 'test_song', 'harp_test'] } as WorldState,
    autocastSpell: null as Spell | null,
    settings: defaultSettings,
    statModifiers: [] as ActiveStatModifier[],
    activeBuffs: [] as ActiveBuff[],
    isDead: false,
};


/**
 * Merges a loaded save state with the default state to ensure compatibility.
 * This adds any new properties from `defaultState` that might be missing in `loadedState`.
 * @param loadedState The game state loaded from the database or an import.
 * @returns A fully hydrated and safe-to-use game state object.
 */
const hydrateGameState = (loadedState: any): GameState => {
    if (!loadedState || typeof loadedState !== 'object') {
        return { ...defaultState };
    }

    // --- INFLATE MINIFIED SAVES ---
    // Restores pruned data (skill levels, repeatable quest metadata, inventory padding, etc.)
    // Safe to call on old-format saves — it detects and passes through existing fields.
    inflateGameState(loadedState);

    // --- FESTIVAL VARIABLE CLEANUP ---
    // When the Oakhaven Lantern Festival is not active, strip all festival-specific
    // quest variables so stale cooldown/minigame state from prior years doesn't persist.
    if (!isFestivalActive() && loadedState.worldState?.questVariables) {
        FESTIVAL_QUEST_VARIABLE_KEYS.forEach(k => {
            delete loadedState.worldState.questVariables[k];
        });
    }

    // --- MIGRATION LOGIC FOR BURNT FOOD ---
    const defunctBurntItems = new Set([
        'burnt_eggs', 'burnt_shrimp', 'burnt_sardine', 'burnt_herring',
        'burnt_chicken', 'burnt_beef', 'burnt_boar_meat', 'burnt_trout',
        'burnt_pike', 'burnt_eel', 'burnt_tuna', 'burnt_crab_meat',
        'rat_kebab_burnt', 'serpent_omelet_burnt', 'burnt_bread', 'burnt_cake'
    ]);

    const migrateItems = (items: (InventorySlot | null)[]): (InventorySlot | null)[] => {
        return items.map(slot => {
            if (slot && defunctBurntItems.has(slot.itemId)) {
                return { ...slot, itemId: 'burnt_food' };
            }
            return slot;
        });
    };

    if (loadedState.inventory) {
        loadedState.inventory = migrateItems(loadedState.inventory);
    }
    if (loadedState.bank && Array.isArray(loadedState.bank)) {
        loadedState.bank.forEach((tab: BankTab) => {
            if (tab.items) {
                tab.items = migrateItems(tab.items);
            }
        });
    }
    // --- END MIGRATION LOGIC ---

    // Skill hydration: Ensure existing saves get new skills.
    if (loadedState.skills && Array.isArray(loadedState.skills)) {
        const loadedSkillNames = new Set(loadedState.skills.map((s: any) => s.name));
        const missingSkills = ALL_SKILLS.filter(s => !loadedSkillNames.has(s.name));

        if (missingSkills.length > 0) {
            // Add missing skills to the loaded state's skills array before the main hydration merge
            loadedState.skills.push(...missingSkills);
        }
    }

    const hydrated = { ...defaultState, ...loadedState };

    // Deep merge for nested objects
    hydrated.settings = { ...defaultState.settings, ...(loadedState.settings || {}) };
    hydrated.settings.devSettings = { ...defaultState.settings.devSettings, ...(loadedState.settings?.devSettings || {}) };
    hydrated.worldState = { ...defaultState.worldState, ...(loadedState.worldState || {}) };
    hydrated.repeatableQuestsState = { ...defaultState.repeatableQuestsState, ...(loadedState.repeatableQuestsState || {}) };
    hydrated.equipment = typeof loadedState.equipment === 'object' && loadedState.equipment !== null ? { ...defaultState.equipment, ...loadedState.equipment } : defaultState.equipment;
    hydrated.agilityState = { ...defaultState.agilityState, ...(loadedState.agilityState || {}) };

    // Migration for agilityState lapsCompleted
    if (typeof hydrated.agilityState.lapsCompleted === 'number') {
        hydrated.agilityState.lapsCompleted = {};
    }


    // Detect and reset corrupted repeatable quest board data from old saves.
    if (hydrated.repeatableQuestsState.boards) {
        const boards = hydrated.repeatableQuestsState.boards;
        const firstBoardKey = Object.keys(boards)[0];
        if (firstBoardKey) {
            const firstBoard = boards[firstBoardKey];
            if (firstBoard && firstBoard.length > 0) {
                const firstQuest: any = firstBoard[0];
                // Check for the malformed structure by looking for a property that shouldn't be there
                // and the absence of a property that should (`xpReward` object).
                if (firstQuest && firstQuest.hasOwnProperty('finalXpAmount') && !firstQuest.hasOwnProperty('xpReward')) {
                    console.warn("Detected corrupted repeatable quest board data. Resetting boards to prevent crash.");
                    hydrated.repeatableQuestsState.boards = {};
                }
            }
        }
    }

    // Ensure array properties are arrays, falling back to default if they're missing or not arrays.
    const arrayKeys: (keyof GameState)[] = [
        'skills', 'inventory', 'bank', 'playerQuests', 'lockedPois', 
        'clearedSkillObstacles', 'statModifiers', 'activeBuffs', 'activePrayers', 'bookmarks'
    ];
    arrayKeys.forEach(key => {
        const loadedValue = loadedState[key];
        (hydrated as any)[key] = Array.isArray(loadedValue) ? loadedValue : (defaultState as any)[key];
    });
    
    // Ensure object properties are objects
    const objectKeys: (keyof GameState)[] = [
        'resourceNodeStates', 'monsterRespawnTimers', 'groundItems'
    ];
    objectKeys.forEach(key => {
        const loadedValue = loadedState[key];
        (hydrated as any)[key] = typeof loadedValue === 'object' && loadedValue !== null ? loadedValue : (defaultState as any)[key];
    });
    
    // Ensure nullable properties are handled (if they exist in loaded but are undefined, fall back to default)
    hydrated.slayerTask = loadedState.slayerTask === undefined ? defaultState.slayerTask : loadedState.slayerTask;
    hydrated.slayerCredits = loadedState.slayerCredits === undefined ? defaultState.slayerCredits : loadedState.slayerCredits;
    hydrated.slayerTaskStreak = loadedState.slayerTaskStreak === undefined ? defaultState.slayerTaskStreak : loadedState.slayerTaskStreak;
    hydrated.autocastSpell = loadedState.autocastSpell === undefined ? defaultState.autocastSpell : loadedState.autocastSpell;

    // Migration for legacy saves without a playerType
    if (!loadedState.playerType) {
        hydrated.playerType = PlayerType.Cheats;
        console.log("Legacy save detected without playerType. Migrating to Cheats mode.");
    }
    
    hydrated.lastHomeTeleport = loadedState.lastHomeTeleport || 0;

    // Safety check for now-deleted TechDemo mode
    if ((loadedState.playerType as any) === 'TechDemo') {
        hydrated.playerType = PlayerType.Cheats;
        console.warn("Legacy TechDemo save detected. Migrating to Cheats mode to prevent crashes.");
        // Reset location if the techdemo used an exclusive/deleted POI
        if (!POIS[hydrated.currentPoiId]) {
            hydrated.currentPoiId = defaultState.currentPoiId;
        }
    }

    // Ensure all saves have the login music track unlocked.
    if (Array.isArray(hydrated.worldState.unlockedMusicTracks)) {
        if (!hydrated.worldState.unlockedMusicTracks.includes('login')) {
            hydrated.worldState.unlockedMusicTracks.push('login');
        }
        if (!hydrated.worldState.unlockedMusicTracks.includes('test_song')) {
            hydrated.worldState.unlockedMusicTracks.push('test_song');
        }
        if (!hydrated.worldState.unlockedMusicTracks.includes('harp_test')) {
            hydrated.worldState.unlockedMusicTracks.push('harp_test');
        }
    } else {
        hydrated.worldState.unlockedMusicTracks = ['login', 'generated_track_1', 'test_song', 'harp_test'];
    }

    // --- SYNCHRONIZE LOCKED POIS ---
    // Ensure lockedPois matches the current quest progress (respecting new operator prop)
    if (Array.isArray(hydrated.playerQuests) && Array.isArray(hydrated.lockedPois)) {
        Object.values(POIS).forEach(poi => {
            if (poi.unlockRequirement?.type === 'quest') {
                const req = poi.unlockRequirement;
                const playerQuest = hydrated.playerQuests.find(q => q.questId === req.questId);
                const currentStage = playerQuest ? (playerQuest.isComplete ? 999 : playerQuest.currentStage) : -1;
                const op = req.operator || 'gte';
                const isMet = op === 'gte' ? currentStage >= req.stage : currentStage <= req.stage;
                
                if (isMet) {
                    // Should be unlocked
                    hydrated.lockedPois = hydrated.lockedPois.filter(id => id !== poi.id);
                } else if (!hydrated.lockedPois.includes(poi.id)) {
                    // Should be locked
                    hydrated.lockedPois.push(poi.id);
                }
            }
        });
    }

    return hydrated;
};


export const useSaveSlotManager = (ui: ReturnType<typeof useUIState>) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [gameKey, setGameKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const parseAndValidateSave = (data: string): any | null => {
        try {
            if (data.startsWith('s4V')) {
                const base64Data = data.substring(3);
                const jsonString = atob(base64Data);
                const parsed = JSON.parse(jsonString);
                // Validation: V1 uses 'username', V2 uses 'u'
                const isValid = parsed && (parsed.username || (parsed._v === 2 && (parsed.u !== undefined)));
                return isValid ? parsed : null;
            }
            return null;
        } catch (error) {
            console.error("Failed to parse save data:", error);
            return null;
        }
    };

    const refreshSlots = useCallback(async () => {
        const loadedSlots = await loadAllSlots();
        setSlots(loadedSlots);
    }, []);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            // The Dexie upgrade function handles migration automatically.
            // We just need to load the slots.
            await refreshSlots();
            setIsLoading(false);
        };
        initialize();
    }, [refreshSlots]);

    const loadGameForSlot = useCallback(async (slotId: number): Promise<any | null> => {
        let gameState = await loadSlotState(slotId);
        
        if (!gameState) {
            const fallback = localStorage.getItem(`embrune_slot_${slotId}`);
            if (fallback) {
                gameState = parseAndValidateSave(fallback);
            }
        }
        
        if (gameState) {
            setGameKey(k => k + 1);
            return hydrateGameState(gameState);
        }
        return null;
    }, []);

    const createNewCharacter = useCallback(async (slotId: number, username: string, playerType: PlayerType): Promise<any | null> => {
        const matchingSlot = slots.find(s => s.metadata?.username.toLowerCase() === username.toLowerCase());
        if (matchingSlot) {
            ui.setConfirmationPrompt({
                message: `The name "${username}" is already taken by Slot ${matchingSlot.slotId + 1}. Please choose a different name.`,
                onConfirm: () => {}
            });
            return null;
        }
        const newState = { ...defaultState, username, playerType };
        await saveSlotState(slotId, newState);
        await refreshSlots();
        return newState;
    }, [refreshSlots, slots, ui]);

    const deleteCharacter = useCallback(async (slotId: number) => {
        await deleteSlot(slotId);
        localStorage.removeItem(`embrune_slot_${slotId}`);
        await refreshSlots();
    }, [refreshSlots]);

    const exportSlot = useCallback(async (slotId: number) => {
        const gameState = await loadSlotState(slotId);
        if (gameState) {
            try {
                const minified = minifyGameState(gameState);
                const dataStr = JSON.stringify(minified);
                const base64Str = btoa(dataStr);
                const finalExportStr = 's4V' + base64Str;
                ui.setExportData({ data: finalExportStr, title: 'Export Character' });
            } catch (error) {
                console.error("Failed to serialize save data:", error);
            }
        }
    }, [ui]);

    const importData = useCallback((data: string): boolean => {
        const parsedData = parseAndValidateSave(data);
        if (parsedData) {
            const hydratedData = hydrateGameState(parsedData);
            const characterName = hydratedData.username;
            
            // 1. Check for a slot with the same character name
            const matchingSlot = slots.find(s => s.metadata?.username === characterName);
            
            if (matchingSlot) {
                ui.setConfirmationPrompt({
                    message: `A character named "${characterName}" already exists in Slot ${matchingSlot.slotId + 1}. Do you want to overwrite it with this import?`,
                    onConfirm: async () => {
                        await saveSlotState(matchingSlot.slotId, minifyGameState(hydratedData));
                        await refreshSlots();
                    }
                });
                return true;
            }

            // 2. No name match, find first empty slot
            const emptySlot = slots.find(s => !s.data);
            if (emptySlot) {
                ui.setConfirmationPrompt({
                    message: `Import character "${characterName}" into empty Slot ${emptySlot.slotId + 1}?`,
                    onConfirm: async () => {
                        await saveSlotState(emptySlot.slotId, minifyGameState(hydratedData));
                        await refreshSlots();
                    }
                });
                return true;
            }

            // 3. All slots full and no name match
            ui.setConfirmationPrompt({
                message: `All save slots are full. Please delete an existing character before importing "${characterName}".`,
                onConfirm: async () => {
                    // Do nothing, just acknowledging the full status
                }
            });
            return true;
        }
        return false;
    }, [refreshSlots, ui, slots]);
    
    return {
        slots,
        gameKey,
        loadGameForSlot,
        createNewCharacter,
        deleteCharacter,
        exportSlot,
        importData,
        isLoading,
        refreshSlots,
    };
};