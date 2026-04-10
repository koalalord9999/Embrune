import { useState, useCallback } from 'react';
import { PlayerSlayerTask, SkillName, PlayerQuestState, QuestId, InventorySlot } from '../types';
import {  MONSTERS  } from '../constants';

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

interface SlayerAssignment {
    monsterId: string;
    questReq?: {
        questId: QuestId;
        status?: 'completed' | 'in_progress';
        stage?: number;
    };
}

const SLAYER_MONSTERS_BY_LEVEL: Record<number, SlayerAssignment[]> = {
    1: [
        { monsterId: 'giant_rat' }, { monsterId: 'cow' }, { monsterId: 'chicken' },
        { monsterId: 'goblin' }, { monsterId: 'spider' },
    ],
    10: [
        { monsterId: 'cloaked_bandit' }, { monsterId: 'highwayman' }, { monsterId: 'wild_boar' }, { monsterId: 'wolf' },
        { monsterId: 'deranged_botanist' },
    ],
    20: [
        { monsterId: 'harpy' }, { monsterId: 'mountain_goat' }, { monsterId: 'bear' },
        { monsterId: 'young_hill_giant' }, { monsterId: 'fey_sprite' }, { monsterId: 'treant_sapling' },
        { monsterId: 'glimmerhorn_stag' }, { monsterId: 'forest_spirit' },
    ],
    30: [
        { monsterId: 'swamp_horror' }, { monsterId: 'salt_flat_skitterer' }, { monsterId: 'salt_leaper' },
        { monsterId: 'sand_scrabbler' }, { monsterId: 'salt_preserved_vulture' }, { monsterId: 'fouthian_guard' },
        { monsterId: 'sunscale_serpent' },
    ],
    40: [
        { monsterId: 'sunstone_golem' }, { monsterId: 'bog_serpent' }, { monsterId: 'jungle_stalker' }, { monsterId: 'abyssal_leech' },
        { monsterId: 'brine_elemental' }, { monsterId: 'crystalline_tortoise' }, { monsterId: 'tidal_crawler' }, { monsterId: 'siren' },
        { monsterId: 'plains_lion' },
        { monsterId: 'chasm_crawler', questReq: { questId: 'depths_of_despair', status: 'in_progress', stage: 1 } },
    ],
    50: [
        { monsterId: 'fire_fiend' }, { monsterId: 'sunken_zombie' },
        { monsterId: 'spire_sentry', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'mana_wisp', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'lesser_crystal_construct', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'arcane_familiar', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    60: [
        { monsterId: 'abyssal_knight' }, { monsterId: 'dune_stalker' }, { monsterId: 'oasis_croc' },
        { monsterId: 'ice_imp' },
        { monsterId: 'runic_guardian', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    70: [
        { monsterId: 'greater_incubus' }, { monsterId: 'skeletal' }, { monsterId: 'grave_revenant' }, { monsterId: 'ancient_sentinel' },
        { monsterId: 'water_weird' }, { monsterId: 'temple_spirit' }, { monsterId: 'rime_coated_serpent' },
        { monsterId: 'tundra_stalker' }, { monsterId: 'the_abyssal_warden' }, { monsterId: 'yeti' },
        { monsterId: 'ice_troll' }, { monsterId: 'ice_elemental' }, { monsterId: 'glacial_wyrm' },
        { monsterId: 'temple_guardian' }, { monsterId: 'blazing_efreeti' },
        { monsterId: 'spire_spellweaver', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'greater_mana_wisp', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'enchanted_tome', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'grove_dragon'}, { monsterId: 'frosthide_dragon', questReq: { questId: 'the_frozen_gate', status: 'completed' } },
    ],
    85: [ 
        { monsterId: 'succubus' }, { monsterId: 'arcane_wyvern', questReq: { questId: 'the_arcane_awakening', stage: 8} },
        { monsterId: 'greater_crystal_construct', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'arcane_elemental', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'spire_justicar', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    100: [
        { monsterId: 'emberscale_dragon' }, { monsterId: 'deathscythe' }, { monsterId: 'corrupted_grove_dragon' },
    ],
};

// Regional monsters for Ravindra's bias (Sunscorched Wastes, Salt Flats, Volcanic Steam Vents)
const RAVINDRA_REGIONAL_MONSTERS: string[] = [
    // Sunscorched Wastes
    'sand_scrabbler', 'dune_stalker', 'sunstone_scorpion', 'desert_nomad', 'canyon_basilisk', 'oasis_croc', 'sand_wyrm',
    // Salt Flats
    'salt_flat_skitterer', 'salt_leaper', 'salt_preserved_vulture', 'brine_elemental', 'crystalline_tortoise',
    'crystal_scuttler', 'mirage_weaver', 'salt_cryst_golem', 'salt_wraith', 'ancient_ammonite',
    // Volcanic Steam Vents
    'fire_fiend', 'magma_imp', 'lesser_incubus', 'greater_incubus', 'succubus',
    'emberscale_dragon', 'deathscythe', 'blazing_efreeti',
    // Fouthia
    'sunscale_serpent',
];

interface SlayerMasterConfig {
    name: string;
    minQuantity: number;
    maxQuantity: number;
    maxTaskCountMultiplier: number;
    regionalBias?: string[];
    requiredSlayerLevel: number;
    creditsPerTask: number;
}

const SLAYER_MASTERS: Record<string, SlayerMasterConfig> = {
    kaelen: {
        name: 'Kaelen',
        minQuantity: 10,
        maxQuantity: 40,
        maxTaskCountMultiplier: 1,
        requiredSlayerLevel: 1,
        creditsPerTask: 5,
    },
    ravindra: {
        name: 'Ravindra',
        minQuantity: 50,
        maxQuantity: 100,
        maxTaskCountMultiplier: 2,
        regionalBias: RAVINDRA_REGIONAL_MONSTERS,
        requiredSlayerLevel: 40,
        creditsPerTask: 10,
    },
};


const getAssignableMonsters = (combatLevel: number, playerQuests: PlayerQuestState[], masterId: string = 'kaelen', maxCombatLevelOverride?: number): string[] => {
    let available: string[] = [];
    const master = SLAYER_MASTERS[masterId];
    
    // Determine the effective combat level for monster selection
    const effectiveCombatLevel = maxCombatLevelOverride !== undefined ? Math.min(combatLevel, maxCombatLevelOverride) : combatLevel;

    for (const level in SLAYER_MONSTERS_BY_LEVEL) {
        if (effectiveCombatLevel >= parseInt(level)) {
            const assignments = SLAYER_MONSTERS_BY_LEVEL[level as any];
            for (const assignment of assignments) {
                if (assignment.questReq) {
                    const playerQuest = playerQuests.find(q => q.questId === assignment.questReq!.questId);
                    if (!playerQuest) continue;

                    if (assignment.questReq.status === 'completed') {
                        if (!playerQuest.isComplete) continue;
                    } else if (assignment.questReq.status === 'in_progress') {
                        if (playerQuest.isComplete) continue; 
                        if (assignment.questReq.stage !== undefined && playerQuest.currentStage < assignment.questReq.stage) {
                            continue;
                        }
                    } else if (assignment.questReq.stage !== undefined) { // New logic for just checking stage
                        if (playerQuest.currentStage < assignment.questReq.stage && !playerQuest.isComplete) {
                            continue;
                        }
                    }
                }
                available.push(assignment.monsterId);
            }
        }
    }
    
    if (available.length === 0) {
        available = SLAYER_MONSTERS_BY_LEVEL[1].map(a => a.monsterId);
    }
    
    // Apply regional bias: add extra copies of regional monsters so they're picked more often
    if (master?.regionalBias) {
        const regionalAvailable = available.filter(id => master.regionalBias!.includes(id));
        // Add 3 extra copies of each regional monster to heavily bias the pool
        for (let i = 0; i < 3; i++) {
            available = available.concat(regionalAvailable);
        }
    }
    
    return available;
};


export const useSlayer = (initialTask: PlayerSlayerTask | null, playerQuests: PlayerQuestState[], deps: SlayerDependencies) => {
    const [slayerTask, setSlayerTask] = useState<PlayerSlayerTask | null>(initialTask);
    const { addLog, addXp, modifyItem, combatLevel, slayerLevel, slayerCredits, slayerTaskStreak, setSlayerCredits, setSlayerTaskStreak, setActiveShopId } = deps;

    const getTask = useCallback((masterId: string = 'kaelen', bypassStreakReset: boolean = false, maxCombatLevelOverride?: number) => {
        const master = SLAYER_MASTERS[masterId] ?? SLAYER_MASTERS.kaelen;
        
        // Reset streak if transitioning to a lower level master (easier task)
        if (!bypassStreakReset && slayerTask && slayerTask.masterId !== masterId) {
            const currentMaster = SLAYER_MASTERS[slayerTask.masterId] || SLAYER_MASTERS.kaelen;
            if (master.requiredSlayerLevel < currentMaster.requiredSlayerLevel) {
                setSlayerTaskStreak(0);
                addLog(`You ask ${master.name} for an easier mission. Your task streak has been reset to 0.`);
            }
        }

        const assignable = getAssignableMonsters(combatLevel, playerQuests, masterId, maxCombatLevelOverride);
        const monsterId = assignable[Math.floor(Math.random() * assignable.length)];
        const monster = MONSTERS[monsterId];
        
        let requiredCount: number;
        if (monster.maxTaskCount) {
            const [min, max] = monster.maxTaskCount;
            requiredCount = Math.floor(Math.random() * (max - min + 1)) + min;
            requiredCount = Math.floor(requiredCount * master.maxTaskCountMultiplier);
        } else {
            requiredCount = Math.floor(master.minQuantity + Math.random() * (master.maxQuantity - master.minQuantity + 1)) + Math.floor(combatLevel / 5);
        }

        const newTask: PlayerSlayerTask = {
            monsterId,
            requiredCount,
            progress: 0,
            isComplete: false,
            masterId,
        };
        setSlayerTask(newTask);
        addLog(`${master.name} assigns you a task: kill ${requiredCount} ${monster.name}s.`);
    }, [addLog, combatLevel, playerQuests, slayerTask]);

    const handleSlayerMasterInteraction = useCallback((masterId: string = 'kaelen') => {
        const master = SLAYER_MASTERS[masterId] ?? SLAYER_MASTERS.kaelen;
        if (slayerLevel < master.requiredSlayerLevel) {
            addLog(`${master.name} looks you over dismissively. "Come back when you have reached Slayer level ${master.requiredSlayerLevel}. You are not ready for the hunts I offer."`);
            return;
        }

        if (!slayerTask) {
            getTask(masterId);
        } else if (slayerTask.isComplete) {
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
                modifyItem('coins', coinReward);
            }
            
            setSlayerTask(null);
            // Chain into getting a new task from this master
            getTask(masterId, true);
        } else {
            const monster = MONSTERS[slayerTask.monsterId];
            const remaining = slayerTask.requiredCount - slayerTask.progress;
            addLog(`${master.name} tells you: "You still need to slay ${remaining} more ${monster.name}s."`);
        }
    }, [slayerTask, getTask, addLog, modifyItem, slayerCredits, slayerTaskStreak, setSlayerCredits, setSlayerTaskStreak, slayerLevel]);

    const resetTask = useCallback((masterId: string) => {
        if (!slayerTask) return;
        
        const master = SLAYER_MASTERS[masterId] || SLAYER_MASTERS.kaelen;
        const currentMaster = SLAYER_MASTERS[slayerTask.masterId] || SLAYER_MASTERS.kaelen;

        // "Easier task" reset (no cost, resets streak)
        if (master.requiredSlayerLevel < currentMaster.requiredSlayerLevel) {
            setSlayerTaskStreak(0);
            setSlayerTask(null);
            addLog(`${master.name} sighs. "Fine, I'll give you something simpler. Your streak has been reset."`);
            getTask(masterId, true, 20); // Force level 1-20 range for easier tasks
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

    return {
        slayerTask,
        setSlayerTask,
        handleSlayerMasterInteraction,
        checkKill,
        resetTask,
        expandTask,
        shrinkTask,
        openSlayerShop,
        slayerCredits,
        slayerTaskStreak,
        setSlayerCredits,
        setSlayerTaskStreak,
    };
};
