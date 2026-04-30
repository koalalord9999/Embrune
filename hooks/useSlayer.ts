import { useState, useCallback } from 'react';
import { PlayerSlayerTask, SkillName, PlayerQuestState, QuestId, InventorySlot, ItemId, MonsterId } from '../types';
import { MONSTERS } from '../constants';

interface SlayerDependencies {
    addLog: (message: string) => void;
    addXp: (skill: SkillName, amount: number) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean; }) => void;
    combatLevel: number;
    slayerLevel: number;
    slayerCredits: number;
    slayerTaskStreak: number;
    setSlayerCredits: (credits: number) => void;
    setSlayerTaskStreak: (streak: number) => void;
    setActiveShopId: (shopId: string | null) => void;
}

// Monsters that should NEVER be assigned as slayer tasks (bosses, uniques, non-combat entities)
const NEVER_ASSIGN: string[] = [
    'the_earth_render', 'blight_imp', 'arcane_wyvern', 'grave_revenant_lord',
    'training_dummy', 'tutorial_rat', 'tavern_rat',
    'adventurer', 'warrior', 'wizard', 'woman', 'yeoman', 'man', 'farmer',
    'avatar_of_sorcery', 'avatar_of_the_hunt', 'avatar_of_war',
];

// Quest-locked monsters: can only be assigned if the player meets the quest requirement
const QUEST_LOCKED_MONSTERS: Record<string, { questId: QuestId; status?: 'completed' | 'in_progress'; stage?: number }> = {
    'chasm_crawler': { questId: 'depths_of_despair' as QuestId, status: 'in_progress', stage: 1 },
    'spire_sentry': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'mana_wisp': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'lesser_crystal_construct': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'arcane_familiar': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'runic_guardian': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'spire_spellweaver': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'greater_mana_wisp': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'enchanted_tome': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'frosthide_dragon': { questId: 'the_frozen_gate' as QuestId, status: 'completed' },
    'greater_crystal_construct': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'arcane_elemental': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
    'spire_justicar': { questId: 'the_arcane_awakening' as QuestId, stage: 8 },
};

interface SlayerMasterConfig {
    name: string;
    minQuantity: number;
    maxQuantity: number;
    requiredSlayerLevel: number;
    creditsPerTask: number;
    // [minCombatLevel, maxMonsterLevel] pairs, sorted highest combat first
    combatTiers: [number, number][];
    // Pool configuration
    pool:
    | { type: 'standard'; minLevel: number; maxLevel: number }
    | { type: 'sourced'; minLevelForNonSourced: number; lowCombatSources?: ('respite' | 'slayer')[] };
}

const SLAYER_MASTERS: Record<string, SlayerMasterConfig> = {
    kaelen: {
        name: 'Kaelen',
        minQuantity: 15,
        maxQuantity: 35,
        requiredSlayerLevel: 1,
        creditsPerTask: 5,
        combatTiers: [[40, 75], [30, 60], [20, 45], [0, 45]],
        pool: { type: 'standard', minLevel: 1, maxLevel: 75 },
    },
    ravindra: {
        name: 'Ravindra',
        minQuantity: 50,
        maxQuantity: 100,
        requiredSlayerLevel: 40,
        creditsPerTask: 10,
        combatTiers: [[40, 115], [0, 70]],
        pool: { type: 'standard', minLevel: 60, maxLevel: 115 },
    },
    thorne: {
        name: 'Thorne',
        minQuantity: 75,
        maxQuantity: 150,
        requiredSlayerLevel: 50,
        creditsPerTask: 15,
        combatTiers: [[50, 9999], [0, 70]],
        pool: { type: 'sourced', minLevelForNonSourced: 115, lowCombatSources: ['respite'] },
    },
};


const getAssignableMonsters = (combatLevel: number, slayerLevel: number, playerQuests: PlayerQuestState[], masterId: string = 'kaelen'): string[] => {
    const master = SLAYER_MASTERS[masterId] ?? SLAYER_MASTERS.kaelen;

    // Determine max monster level from combat tiers (sorted highest combat first)
    let maxMonsterLevel = 0;
    for (const [minCombat, maxLevel] of master.combatTiers) {
        if (combatLevel >= minCombat) {
            maxMonsterLevel = maxLevel;
            break;
        }
    }

    // Check if player is in the "low combat" bracket for sourced masters (Thorne)
    const isLowCombat = master.pool.type === 'sourced'
        && master.combatTiers.length > 1
        && combatLevel < master.combatTiers[0][0];

    const available: string[] = [];

    for (const monsterId in MONSTERS) {
        const monster = MONSTERS[monsterId];

        // Skip blacklisted monsters
        if (NEVER_ASSIGN.includes(monsterId)) continue;

        // Skip monsters above the tiered level cap
        if (monster.level > maxMonsterLevel) continue;

        // Check slayer level requirement
        if (monster.slayerLevel && slayerLevel < monster.slayerLevel) continue;

        // Check quest locks
        const questLock = QUEST_LOCKED_MONSTERS[monsterId];
        if (questLock) {
            const playerQuest = playerQuests.find(q => q.questId === questLock.questId);
            if (!playerQuest) continue;
            if (questLock.status === 'completed' && !playerQuest.isComplete) continue;
            if (questLock.status === 'in_progress' && playerQuest.isComplete) continue;
            if (questLock.stage !== undefined && playerQuest.currentStage < questLock.stage && !playerQuest.isComplete) continue;
        }

        // Pool-specific filtering
        if (master.pool.type === 'standard') {
            // Exclude [respite] and [slayer] sourced monsters
            if (monster.source) continue;
            // Check level range
            if (monster.level < master.pool.minLevel) continue;
        } else if (master.pool.type === 'sourced') {
            if (monster.source) {
                // Low combat: only allow specific source types
                if (isLowCombat && master.pool.lowCombatSources && !master.pool.lowCombatSources.includes(monster.source)) {
                    continue;
                }
            } else {
                // Non-sourced monsters: only include if above the threshold
                if (monster.level < master.pool.minLevelForNonSourced) continue;
            }
        }

        available.push(monsterId);
    }

    // Fallback: if no monsters found, assign basic low-level monsters
    if (available.length === 0) {
        return Object.keys(MONSTERS).filter(id => {
            const m = MONSTERS[id];
            return m.level <= 10 && !m.source && !NEVER_ASSIGN.includes(id);
        });
    }

    return available;
};



export const useSlayer = (initialTask: PlayerSlayerTask | null, playerQuests: PlayerQuestState[], deps: SlayerDependencies) => {
    const [slayerTask, setSlayerTask] = useState<PlayerSlayerTask | null>(initialTask);
    const { addLog, addXp, modifyItem, combatLevel, slayerLevel, slayerCredits, slayerTaskStreak, setSlayerCredits, setSlayerTaskStreak, setActiveShopId } = deps;

    const getTask = useCallback((masterId: string = 'kaelen', bypassStreakReset: boolean = false) => {
        const master = SLAYER_MASTERS[masterId] ?? SLAYER_MASTERS.kaelen;

        // Reset streak if transitioning to a lower level master (easier task)
        if (!bypassStreakReset && slayerTask && slayerTask.masterId !== masterId) {
            const currentMaster = SLAYER_MASTERS[slayerTask.masterId] || SLAYER_MASTERS.kaelen;
            if (master.requiredSlayerLevel < currentMaster.requiredSlayerLevel) {
                setSlayerTaskStreak(0);
                addLog(`You ask ${master.name} for an easier mission. Your task streak has been reset to 0.`);
            }
        }

        const allAssignable = getAssignableMonsters(combatLevel, slayerLevel, playerQuests, masterId);
        const monsterId = allAssignable[Math.floor(Math.random() * allAssignable.length)];

        const monster = MONSTERS[monsterId];

        let requiredCount: number;
        if (monster.maxTaskCount) {
            const [min, max] = monster.maxTaskCount;
            requiredCount = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            requiredCount = Math.floor(master.minQuantity + Math.random() * (master.maxQuantity - master.minQuantity + 1));
        }

        const newTask: PlayerSlayerTask = {
            monsterId: monsterId as MonsterId,
            requiredCount,
            progress: 0,
            isComplete: false,
            masterId,
        };
        setSlayerTask(newTask);
        addLog(`${master.name} assigns you a task: kill ${requiredCount} ${monster.name}s.`);
    }, [addLog, combatLevel, playerQuests, slayerTask]);

    const completeTask = useCallback((masterId: string = 'kaelen') => {
        if (!slayerTask || !slayerTask.isComplete) return;

        const master = SLAYER_MASTERS[slayerTask.masterId] ?? SLAYER_MASTERS.kaelen;

        // Milestone Multipliers
        const newStreak = slayerTaskStreak + 1;
        setSlayerTaskStreak(newStreak);

        let multiplier = 1;
        if (newStreak % 100 === 0) multiplier = 25;
        else if (newStreak % 50 === 0) multiplier = 10;
        else if (newStreak % 10 === 0) multiplier = 5;

        const baseCredits = master.creditsPerTask || 5;
        const awardedCredits = baseCredits * multiplier;
        const totalCredits = slayerCredits + awardedCredits;
        setSlayerCredits(totalCredits);

        // Log completion with credits
        addLog(`You have completed your task. ${awardedCredits} Credits awarded, bringing you to ${totalCredits} credits.`);

        // Original coin reward
        const monster = MONSTERS[slayerTask.monsterId];
        const coinReward = Math.floor(monster.level * slayerTask.requiredCount * 1.5);
        if (coinReward > 0) {
            addLog(`Well done! You've also earned ${coinReward} coins for your efforts.`);
            modifyItem('coins' as ItemId, coinReward);
        }

        setSlayerTask(null);
    }, [slayerTask, slayerTaskStreak, setSlayerTaskStreak, slayerCredits, setSlayerCredits, addLog, modifyItem]);

    const handleSlayerMasterInteraction = useCallback((masterId: string = 'kaelen') => {
        const master = SLAYER_MASTERS[masterId] ?? SLAYER_MASTERS.kaelen;
        if (slayerLevel < master.requiredSlayerLevel) {
            addLog(`${master.name} looks you over dismissively. "Come back when you have reached Slayer level ${master.requiredSlayerLevel}. You are not ready for the hunts I offer."`);
            return;
        }

        if (!slayerTask) {
            getTask(masterId);
        } else if (slayerTask.isComplete) {
            completeTask(masterId);
            // After completing, immediately get a new task if interacting directly
            getTask(masterId, true);
        } else {
            const monster = MONSTERS[slayerTask.monsterId];
            const remaining = slayerTask.requiredCount - slayerTask.progress;
            addLog(`${master.name} tells you: "You still need to slay ${remaining} more ${monster.name}s."`);
        }
    }, [slayerTask, getTask, completeTask, addLog, slayerLevel]);

    const resetTask = useCallback((masterId: string) => {
        if (!slayerTask) return;

        const master = SLAYER_MASTERS[masterId] || SLAYER_MASTERS.kaelen;
        const currentMaster = SLAYER_MASTERS[slayerTask.masterId] || SLAYER_MASTERS.kaelen;

        // "Easier task" reset (no cost, resets streak)
        if (master.requiredSlayerLevel < currentMaster.requiredSlayerLevel) {
            setSlayerTaskStreak(0);
            setSlayerTask(null);
            addLog(`${master.name} sighs. "Fine, I'll give you something simpler. Your streak has been reset."`);
            getTask(masterId, true); // The master's own tiering will handle appropriate difficulty
            return;
        }

        // Paid reset (20 credits, no streak penalty)
        if (slayerCredits < 20) {
            addLog("You don't have enough Slayer Credits to reset your task. (Cost: 20)");
            return;
        }

        setSlayerCredits(slayerCredits - 20);
        setSlayerTask(null);
        addLog(`Task reset for 20 Slayer Credits. You now have ${slayerCredits - 20} credits remaining.`);
    }, [slayerTask, slayerCredits, setSlayerCredits, setSlayerTaskStreak, addLog]);

    const expandTask = useCallback(() => {
        if (!slayerTask || slayerTask.isComplete) return false;
        if (slayerTask.progress > 0) {
            addLog("You can only expand a task before you have started killing the target.");
            return false;
        }

        const newCount = slayerTask.requiredCount * 2;
        setSlayerTask({ ...slayerTask, requiredCount: newCount });
        addLog(`Task expanded! You now need to slay ${newCount} ${MONSTERS[slayerTask.monsterId].name}s.`);
        return true;
    }, [slayerTask, addLog]);

    const shrinkTask = useCallback(() => {
        if (!slayerTask || slayerTask.isComplete) return false;
        if (slayerTask.progress > 0) {
            addLog("You can only shrink a task before you have started killing the target.");
            return false;
        }

        setSlayerTask({ ...slayerTask, requiredCount: 5 });
        addLog(`Task shrunk! You only need to slay 5 ${MONSTERS[slayerTask.monsterId].name}s.`);
        return true;
    }, [slayerTask, addLog]);

    const openSlayerShop = useCallback(() => {
        setActiveShopId('slayer_master_shop');
    }, [setActiveShopId]);

    const checkKill = useCallback((monsterId: string) => {
        if (!slayerTask || slayerTask.isComplete) return;

        let taskMatches = false;
        const taskMonsterId = slayerTask.monsterId;

        // Direct match check
        if (taskMonsterId === monsterId) {
            taskMatches = true;
        } else {
            // Generic type match check
            const genericTypes = ['goblin', 'wyvern', 'golem', 'skeletal', 'wyrm', 'zombie', 'bear', 'wolf', 'spider'];
            for (const type of genericTypes) {
                if (taskMonsterId.includes(type) && monsterId.includes(type)) {
                    taskMatches = true;
                    break;
                }
            }
        }

        if (taskMatches) {
            const monster = MONSTERS[monsterId];
            if (monster) {
                const xpReward = monster.maxHp;
                addXp(SkillName.Slayer, xpReward);
            }

            const newProgress = slayerTask.progress + 1;
            const isComplete = newProgress >= slayerTask.requiredCount;

            if (isComplete) {
                addLog(`You have completed your slayer task! Return to a Slayer Master for a new one.`);
            } else {
                const taskMonsterName = MONSTERS[slayerTask.monsterId]?.name || 'monsters';
                addLog(`Task progress: ${newProgress}/${slayerTask.requiredCount} ${taskMonsterName}s defeated.`);
            }

            setSlayerTask({ ...slayerTask, progress: newProgress, isComplete });
        }
    }, [slayerTask, addLog, addXp]);

    const forceCompleteTask = useCallback(() => {
        if (!slayerTask) return;
        const monster = MONSTERS[slayerTask.monsterId];
        const remaining = slayerTask.requiredCount - slayerTask.progress;
        if (remaining > 0 && monster) {
            const xpReward = monster.maxHp * remaining;
            addXp(SkillName.Slayer, xpReward);
            addLog(`Dev: Force completed slayer task. Awarded ${xpReward} Slayer XP for ${remaining} kills.`);
        }
        setSlayerTask({ ...slayerTask, progress: slayerTask.requiredCount, isComplete: true });
    }, [slayerTask, addXp, addLog]);

    return {
        slayerTask,
        setSlayerTask,
        handleSlayerMasterInteraction,
        completeTask,
        checkKill,
        resetTask,
        expandTask,
        shrinkTask,
        openSlayerShop,
        forceCompleteTask,
        slayerCredits,
        slayerTaskStreak,
        setSlayerCredits,
        setSlayerTaskStreak,
    };
};
