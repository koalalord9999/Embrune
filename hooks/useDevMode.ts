
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useUIState } from './useUIState';
import { REGIONS, MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { POI, Region, Monster, MonsterType, SkillName, SpellElement, PlayerType } from '../types';

// Import all monster file objects for the monster editor
import { beasts } from '../constants/monsters/beasts';
import { humanoids } from '../constants/monsters/humanoids';
import { dragons } from '../constants/monsters/dragons';
import { undead } from '../constants/monsters/undead';
import { elemental } from '../constants/monsters/elemental';
import { demon } from '../constants/monsters/demon';
import { armored } from '../constants/monsters/armored';
import { vampire } from '../constants/monsters/vampire';


interface DevModeDependencies {
    initialState: any;
    devModeOverride?: boolean;
    isInCombat: boolean;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    // Persisted dev settings state
    xpMultiplier: number;
    setXpMultiplier: (multiplier: number) => void;
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isPlayerInvisible: boolean;
    setIsPlayerInvisible: (isInvisible: boolean) => void;
    isAutoBankOn: boolean;
    setIsAutoBankOn: (isOn: boolean) => void;
    isGodModeOn: boolean;
    setIsGodModeOn: (isOn: boolean) => void;
}

// Helper to format an object into a single line string.
const formatObjectToOneLine = (obj: any): string => {
    if (obj === null) return 'null';
    if (typeof obj !== 'object') {
        if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
        return String(obj);
    }

    if (Array.isArray(obj)) {
        return `[${obj.map(formatObjectToOneLine).join(', ')}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
        let formattedValue;
        if (key === 'skill' && typeof value === 'string') {
            formattedValue = `SkillName.${value}`;
        } else {
            formattedValue = formatObjectToOneLine(value);
        }
        return `${key}: ${formattedValue}`;
    });
    return `{ ${entries.join(', ')} }`;
};


const formatObjectToCodeString = (obj: any): string => {
    const formatValue = (value: any, level: number, key?: string): string => {
        const indent = ' '.repeat(level * 4);
        const closingIndent = ' '.repeat((level - 1) * 4);

        if (key === 'skill' && typeof value === 'string') {
            return `SkillName.${value}`;
        }

        switch (typeof value) {
            case 'string':
                return `'${value.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
            case 'number':
            case 'boolean':
                return String(value);
            case 'object':
                if (value === null) return 'null';

                if (Array.isArray(value)) {
                    if (value.length === 0) return '[]';

                    if (key === 'activities') {
                        return `[\n${value.map(v => `${indent}${formatObjectToOneLine(v)}`).join(',\n')}\n${closingIndent}]`;
                    }

                    if (value.every(item => typeof item === 'string')) {
                        return `[${value.map(v => `'${v}'`).join(', ')}]`;
                    }

                    return `[\n${value.map(v => `${indent}${formatValue(v, level + 1)}`).join(',\n')}\n${closingIndent}]`;
                }

                const keys = Object.keys(value);
                if (keys.length === 0) return '{}';

                const entries = keys.map(k => {
                    return `${indent}${k}: ${formatValue(value[k], level + 1, k)}`;
                }).join(',\n');
                return `{\n${entries}\n${closingIndent}}`;
            default:
                return String(value);
        }
    };

    return formatValue(obj, 1);
};

export const useDevMode = (deps: DevModeDependencies) => {
    const {
        initialState, devModeOverride = false, isInCombat, ui, addLog,
        xpMultiplier, setXpMultiplier,
        combatSpeedMultiplier, setCombatSpeedMultiplier, isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn, isGodModeOn, setIsGodModeOn
    } = deps;

    const isDevMode = (initialState.username === 'DevKoala') || devModeOverride;

    // Session-based dev settings
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);
    const [isTouchSimulationEnabled, setIsTouchSimulationEnabled] = useState(false);
    const [showAllPois, setShowAllPois] = useState(false);

    const [devPanelState, setDevPanelState] = useState({
        activeTab: 'cheats' as 'cheats' | 'items' | 'teleport' | 'game-manager' | 'monsters' | 'slayer' | 'map-manager',
        itemSearchTerm: '',
        selectedItemId: null as string | null,
        spawnQuantity: 1,
        teleportRegionId: 'silverhaven',
        teleportPoiId: 'silverhaven_square',
        skillToSet: '' as any | '',
        levelToSet: 1,
        coinAmount: 1000000,
    });

    const [monsterData, setMonsterData] = useState<Record<string, Monster>>(() => JSON.parse(JSON.stringify(MONSTERS)));
    const [modifiedMonsters, setModifiedMonsters] = useState<Set<string>>(new Set());
    const latestMonsterDataRef = useRef(monsterData);

    useEffect(() => { latestMonsterDataRef.current = monsterData; }, [monsterData]);

    const updateDevPanelState = useCallback((updates: Partial<typeof devPanelState>) => {
        setDevPanelState(prev => ({ ...prev, ...updates }));
    }, []);

    const onToggleAggro = useCallback(() => {
        if (!isInCombat) return;
        const currentInstanceId = ui.combatQueue[0];
        setConfigAggroIds(prev => {
            if (prev.includes(currentInstanceId)) {
                addLog(`System: Permanent aggro disabled for current monster.`);
                return prev.filter(id => id !== currentInstanceId);
            } else {
                addLog(`System: Permanent aggro enabled for current monster.`);
                return [...prev, currentInstanceId];
            }
        });
    }, [isInCombat, ui.combatQueue, addLog]);

    const onToggleTouchSimulation = useCallback(() => setIsTouchSimulationEnabled(prev => !prev), []);

    const handleCommitMapChanges = useCallback(async () => {
        if (modifiedMonsters.size === 0) {
            addLog("No changes to commit.");
            return;
        }

        const allMonsterFileObjects = {
            'constants/monsters/beasts.ts': beasts, 'constants/monsters/humanoids.ts': humanoids,
            'constants/monsters/dragons.ts': dragons, 'constants/monsters/undead.ts': undead,
            'constants/monsters/elemental.ts': elemental, 'constants/monsters/demon.ts': demon,
            'constants/monsters/armored.ts': armored, 'constants/monsters/vampire.ts': vampire
        };

        const monsterFileMap: Record<string, string> = {};
        for (const [filePath, monsterArray] of Object.entries(allMonsterFileObjects)) {
            monsterArray.forEach(monster => { monsterFileMap[monster.id] = filePath; });
        }

        const newCodeBlocks: { filePath: string; content: string }[] = [];

        // --- MONSTER CHANGES ---
        if (modifiedMonsters.size > 0) {
            const filesToUpdate = new Map<string, { updatedArray: Monster[], isModified: boolean }>();
            Object.entries(allMonsterFileObjects).forEach(([path, arr]) => {
                filesToUpdate.set(path, { updatedArray: JSON.parse(JSON.stringify(arr)), isModified: false });
            });

            modifiedMonsters.forEach(monsterId => {
                const updatedMonsterData = latestMonsterDataRef.current[monsterId];
                const filePath = monsterFileMap[monsterId];

                if (filePath) { // Existing monster
                    const fileData = filesToUpdate.get(filePath);
                    if (fileData) {
                        const index = fileData.updatedArray.findIndex(m => m.id === monsterId);
                        if (index > -1) {
                            fileData.updatedArray[index] = updatedMonsterData;
                            fileData.isModified = true;
                        }
                    }
                } else { // New monster
                    let suggestedPath = 'constants/monsters/beasts.ts';
                    const type = updatedMonsterData.types[0];
                    if (type === MonsterType.Humanoid) suggestedPath = 'constants/monsters/humanoids.ts';
                    else if (type === MonsterType.Dragon) suggestedPath = 'constants/monsters/dragons.ts';
                    else if (type === MonsterType.Undead || type === MonsterType.Elemental) suggestedPath = 'constants/monsters/magicalAndUndead.ts';
                    else if (type === MonsterType.Armored) suggestedPath = 'constants/monsters/armored.ts';
                    else if (type === MonsterType.Vampire) suggestedPath = 'constants/monsters/vampire.ts';
                    else if (type === MonsterType.Demon) suggestedPath = 'constants/monsters/demon.ts';

                    const fileData = filesToUpdate.get(suggestedPath);
                    if (fileData) {
                        fileData.updatedArray.push(updatedMonsterData);
                        fileData.isModified = true;
                    }
                }
            });

            filesToUpdate.forEach((fileData, filePath) => {
                if (fileData.isModified) {
                    fileData.updatedArray.sort((a, b) => a.name.localeCompare(b.name));
                    const variableName = filePath.split('/').pop()!.replace('.ts', '');
                    const imports = `import { Monster, MonsterType, SkillName, SpellElement } from '@/types';\n\n`;
                    let fileContent = imports + `export const ${variableName}: Monster[] = [\n`;
                    const formattedMonsters = fileData.updatedArray.map(monster => {
                        const cleanMonster = JSON.parse(JSON.stringify(monster, (key, value) => (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value));
                        return '    ' + formatObjectToCodeString(cleanMonster);
                    }).join(',\n');
                    fileContent += formattedMonsters + '\n];';
                    newCodeBlocks.push({ filePath, content: fileContent });
                }
            });
        }

        if (newCodeBlocks.length > 0) {
            ui.setExportData({
                data: newCodeBlocks,
                title: "Commit Map & Monster Changes",
                copyButtonText: 'Copy All',
                onCopy: () => {
                    const allContent = newCodeBlocks.map(block => `--- START OF FILE ${block.filePath} ---\n\n${block.content}\n\n--- END OF FILE ${block.filePath} ---`).join('\n\n');
                    navigator.clipboard.writeText(allContent);
                },
                onClose: () => {
                    setModifiedMonsters(new Set());
                    addLog("Changes have been cleared from this session.");
                    ui.closeExportModal();
                }
            });
        } else {
            addLog("No changes to commit.");
        }
    }, [modifiedMonsters, addLog, ui, latestMonsterDataRef]);

    return {
        isDevMode,
        // Persisted state
        xpMultiplier, setXpMultiplier,
        combatSpeedMultiplier, setCombatSpeedMultiplier,
        isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn,
        isGodModeOn, setIsGodModeOn,
        // Session state
        isInstantRespawnOn, setIsInstantRespawnOn,
        instantRespawnCounter, setInstantRespawnCounter,
        configAggroIds,
        isTouchSimulationEnabled, onToggleTouchSimulation,
        showAllPois, setShowAllPois,
        // Dev Panel UI state
        devPanelState, updateDevPanelState,
        handleCommitMapChanges,
        // Other logic
        onToggleAggro,
        isCurrentMonsterAggro: isInCombat && ui.combatQueue.length > 0 && configAggroIds.includes(ui.combatQueue[0]),
        // Monster DB state
        monsterData, setMonsterData, modifiedMonsters, setModifiedMonsters,
    };
};
