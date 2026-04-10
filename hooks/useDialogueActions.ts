import React, { useCallback } from 'react';
import { DialogueAction, DialogueCheckRequirement, WorldState, InventorySlot, BankTab, ActivePanel, POIActivity, DialogueResponse, SkillName, ActiveTutorialState, LogEntry } from '../types';
import {  INVENTORY_CAPACITY, QUESTS, ITEMS  } from '../constants';
import { useQuests } from './useQuests';
import { useQuestLogic } from './useQuestLogic';
import { useNavigation } from './useNavigation';
import { useInventory } from './useInventory';
import { useCharacter } from './useCharacter';
import { useWorldActions } from './useWorldActions';
import { useRepeatableQuests } from './useRepeatableQuests';
import { useUIState } from './useUIState';
import { POIS } from '../data/pois';
import { useGameSession } from './useGameSession';
import { useSlayer } from './useSlayer';

const TANNING_RECIPES: Record<string, { leatherId: string; cost: number }> = {
    'cowhide': { leatherId: 'leather', cost: 5 },
    'boar_hide': { leatherId: 'boar_leather', cost: 8 },
    'wolf_pelt': { leatherId: 'wolf_leather', cost: 15 },
    'bear_pelt': { leatherId: 'bear_leather', cost: 25 },
    'grove_hide': { leatherId: 'grove_hide_leather', cost: 40 },
    'frost_hide': { leatherId: 'frost_hide_leather', cost: 60 },
    'emberscale_hide': { leatherId: 'emberscale_hide_leather', cost: 80 },
    'deathscythe_hide': { leatherId: 'deathscythe_hide_leather', cost: 100 },
};

interface DialogueActionDependencies {
    quests: ReturnType<typeof useQuests>;
    questLogic: ReturnType<typeof useQuestLogic>;
    navigation: ReturnType<typeof useNavigation>;
    inv: ReturnType<typeof useInventory>;
    char: ReturnType<typeof useCharacter>;
    worldActions: ReturnType<typeof useWorldActions>;
    addLog: (message: string) => void;
    worldState: WorldState;
    setBank: React.Dispatch<React.SetStateAction<BankTab[]>>;
    setActivityLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    ui: ReturnType<typeof useUIState>;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    session: ReturnType<typeof useGameSession>;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
    slayer: ReturnType<typeof useSlayer>;
}

export const useDialogueActions = (deps: DialogueActionDependencies) => {
    const { quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session, slayer } = deps;
    const { setActiveDialogue } = ui;

    const handleDialogueCheck = useCallback((requirements: DialogueCheckRequirement[]): boolean => {
        return requirements.every(req => {
            switch (req.type) {
                case 'items':
                    return req.items.every(itemReq => {
                        const totalQuantity = inv.inventory.reduce((acc, slot) => {
                            if (slot && slot.itemId === itemReq.itemId && !slot.noted) {
                                // If nameOverride is required, check it.
                                if (itemReq.nameOverride) {
                                    if (slot.nameOverride === itemReq.nameOverride) {
                                        return acc + slot.quantity;
                                    }
                                } else {
                                    // If no nameOverride is specified, count any item with this ID.
                                    return acc + slot.quantity;
                                }
                            }
                            return acc;
                        }, 0);
    
                        const operator = itemReq.operator ?? 'gte';
                        switch (operator) {
                            case 'gte': return totalQuantity >= itemReq.quantity;
                            case 'lt': return totalQuantity < itemReq.quantity;
                            case 'eq': return totalQuantity === itemReq.quantity;
                            default: return totalQuantity >= itemReq.quantity;
                        }
                    });
                case 'coins':
                    return inv.coins >= req.amount;
                case 'skill':
                    const skill = char.skills.find(s => s.name === req.skill);
                    if (!skill) return false;
                    const { level } = skill;
                    return level >= req.level;
                case 'world_state':
                    const operator = req.operator ?? 'gte';
                    if (req.property === 'windmillFlour') {
                        if (operator === 'gte') {
                            return worldState.windmillFlour >= req.value;
                        } else { // 'eq'
                            return worldState.windmillFlour === req.value;
                        }
                    }
                    if (req.property === 'monolithFire' || req.property === 'monolithFires') {
                        const fires = worldState.monolithFires || {};
                        const now = Date.now();
                        const anyFireExists = Object.values(fires).some(f => f.expiresAt > now);
                        return anyFireExists === req.value;
                    }
                    if (req.property.startsWith('monolith_pit_')) {
                        const fires = worldState.monolithFires || {};
                        const now = Date.now();
                        const fire = fires[req.property];
                        const exists = !!fire && fire.expiresAt > now;
                        
                        if (req.value === 'feywood_logs') {
                            return exists && fire?.logType === 'feywood_logs';
                        }
                        if (req.value === 'normal_logs') {
                            return exists && fire?.logType !== 'feywood_logs' && fire?.logType !== 'none';
                        }
                        return exists === req.value;
                    }
                    if (req.property === 'monolithLogType') {
                        const fires = worldState.monolithFires || {};
                        const now = Date.now();
                        const hasMatchingLog = Object.values(fires).some(f => f.logType === req.value && f.expiresAt > now);
                        return hasMatchingLog;
                    }
                    return false;
                case 'quest':
                    const playerQuest = quests.playerQuests.find(q => q.questId === req.questId);
                    switch (req.status) {
                        case 'not_started':
                            return !playerQuest;
                        case 'in_progress':
                            let inProgressCheck = !!playerQuest && !playerQuest.isComplete;
                            if (req.stage !== undefined) {
                                // --- FIX: Support gte/lt/eq operators for quest stage comparisons in dialogue ---
                                const op = req.operator ?? 'eq';
                                if (op === 'gte') inProgressCheck = inProgressCheck && playerQuest.currentStage >= req.stage;
                                else if (op === 'lt') inProgressCheck = inProgressCheck && playerQuest.currentStage < req.stage;
                                else if (op === 'eq') inProgressCheck = inProgressCheck && playerQuest.currentStage === req.stage;
                                else inProgressCheck = inProgressCheck && playerQuest.currentStage === req.stage;
                            }
                            return inProgressCheck;
                        case 'completed':
                            return !!playerQuest && playerQuest.isComplete;
                    }
                    return false; // Should not be reached
                // FIX: Added new check type for quest-specific variables.
                // FIX: Added new check type for quest-specific variables.
                case 'variable': {
                    const variableValue = (questLogic as any).getQuestVariable(req.name) ?? 0;
                    switch (req.operator) {
                        case 'eq': return variableValue === req.value;
                        case 'lt': return variableValue < req.value;
                        case 'gte': return variableValue >= req.value;
                        default: return false;
                    }
                }
                case 'quest_requirements': {
                    const questData = QUESTS[req.questId];
                    if (!questData?.requirements) return true;
                    
                    const { skills: reqSkills = [], quests: reqQuests = [] } = questData.requirements;
                    
                    const skillsMet = reqSkills.every(sReq => {
                        const playerSkill = char.skills.find(s => s.name === sReq.skill);
                        return playerSkill && playerSkill.level >= sReq.level;
                    });
                    
                    const questsMet = reqQuests.every(qId => {
                        const playerQuest = quests.playerQuests.find(q => q.questId === qId);
                        return !!playerQuest && playerQuest.isComplete;
                    });
                    
                    return skillsMet && questsMet;
                }
                case 'slayer_credits': {
                    const credits = slayer.slayerCredits;
                    const operator = req.operator ?? 'gte';
                    switch (operator) {
                        case 'gte': return credits >= req.amount;
                        case 'lt': return credits < req.amount;
                        case 'eq': return credits === req.amount;
                        default: return credits >= req.amount;
                    }
                }
                case 'slayer_task': {
                    const task = slayer.slayerTask;
                    const operator = req.operator ?? 'eq';
                    
                    if (req.status === 'none') {
                        return operator === 'eq' ? !task : !!task;
                    }
                    
                    if (!task) return operator === 'ne';

                    if (req.status === 'active') {
                        const masterMatch = req.masterId ? task.masterId === req.masterId : true;
                        const result = !task.isComplete && masterMatch;
                        return operator === 'eq' ? result : !result;
                    }
                    
                    if (req.status === 'complete') {
                        const result = task.isComplete;
                        return operator === 'eq' ? result : !result;
                    }
                    
                    return false;
                }
            }
            return true;
        });
    }, [inv, char, worldState, quests.playerQuests, questLogic, slayer]);

    const handleDialogueAction = useCallback((actions: DialogueAction[]) => {
        for (const action of actions) {
            let success = true;
            switch (action.type) {
                case 'give_item': {
                    inv.modifyItem(action.itemId, action.quantity, false, { bypassAutoBank: true, noted: action.noted });
                    break;
                }
                case 'take_item': {
                    const quantity = action.quantity;
                    if (quantity === 'all') {
                        const totalQuantity = inv.inventory.reduce((acc, slot) => {
                            if (slot && slot.itemId === action.itemId) {
                                return acc + slot.quantity;
                            }
                            return acc;
                        }, 0);

                        if (totalQuantity > 0) {
                            inv.modifyItem(action.itemId, -totalQuantity, true);
                        }
                        // Always succeeds, even if 0 items are taken.
                    } else {
                        if (inv.hasItems([{ itemId: action.itemId, quantity: quantity, nameOverride: action.nameOverride }])) {
                            inv.modifyItem(action.itemId, -quantity, true, { nameOverride: action.nameOverride });
                        } else {
                            const item = ITEMS[action.itemId];
                            const itemName = item ? item.name : 'the required item';
                            const quantityText = quantity > 1 ? `${quantity}x ` : '';
                            addLog(`You do not have ${quantityText}${itemName}.`);
                            success = false;
                        }
                    }
                    break;
                }
                case 'give_coins':
                    inv.modifyItem('coins', action.amount, false);
                    break;
                case 'take_coins':
                    inv.modifyItem('coins', -action.amount, true);
                    break;
                case 'give_xp':
                    char.addXp(action.skill, action.amount);
                    break;
                case 'start_quest':
                    quests.startQuest(action.questId, addLog);
                    break;
                case 'advance_quest':
                    questLogic.completeQuestStage(action.questId, action.quantity ?? 1);
                    break;
                case 'complete_quest':
                    questLogic.forceCompleteQuest(action.questId);
                    break;
                case 'teleport':
                    navigation.handleForcedNavigate(action.poiId);
                    break;
                case 'heal': //This runs when resting at an inn
                    char.setCurrentHp(hp => action.amount === 'full' ? char.maxHp : Math.min(char.maxHp, hp + action.amount));                    
                    char.setRunEnergy(100);
                    if (action.amount === 'full') {
                        addLog("You feel fully rested.");
                    }
                    break;
                case 'restore_prayer':
                    char.setCurrentPrayer(char.maxPrayer);
                    addLog("You pray at the altar and feel your spiritual energy return.");
                    break;
                case 'add_log':
                    addLog(action.message);
                    break;
                case 'restore_stats':
                    char.clearStatModifiers();
                    addLog("Your boosted stats return to normal.");
                    break;
                case 'open_bank':
                    ui.setActivePanel('bank');
                    break;
                case 'start_bank_tutorial': {
                    ui.setActivePanel('bank');
                    // FIX: Using React.createElement instead of JSX in .ts file
                    ui.setActiveTutorial({
                        id: 'bank-tour',
                        currentStepIndex: 0,
                        steps: [
                            { targetId: 'bank-container', description: React.createElement('p', null, "Welcome to the ", React.createElement('span', { className: "text-yellow-400 font-bold" }, "Bank of Embrune"), "! Here you can store your valuables safely. Even if you fall in battle, items kept here remain secure.") },
                            { targetId: 'bank-tabs', description: React.createElement('p', null, "These are your ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Bank Tabs"), ". You can organize your items by dragging them into different tabs. You can have up to 6 tabs!") },
                            { targetId: 'bank-item-grid', description: React.createElement('p', null, "This is the ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Main Vault"), ". It shows all the items in your current tab. Click an item to withdraw it, or drag to reorganize.") },
                            { targetId: 'bank-quantity-toggles', description: React.createElement('p', null, "Choose ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "how many"), " items you want to move at once. Select 1, 5, 10, or 'All'. Use 'X' to set a custom amount.") },
                            { targetId: 'bank-withdraw-mode', description: React.createElement('p', null, "You can withdraw items as physical objects or as ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Bank Notes"), ". Notes stack in your bag, making them easier to carry in bulk!") },
                            { targetId: 'bank-search', description: React.createElement('p', null, "Need to find something specific? Use the ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Search Bar"), " to filter items across all your tabs instantly.") },
                            { targetId: 'bank-deposit-backpack', description: React.createElement('p', null, "Need space? Click this to ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "deposit everything"), " currently in your inventory into the bank.") },
                            { targetId: 'bank-deposit-equipment', description: React.createElement('p', null, "Use this to quickly ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "deposit all equipped items"), ". Great for changing gear sets in a hurry!") },
                            { targetId: 'bank-placeholders', description: React.createElement('p', null, "This padlock icon toggles ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Bank Placeholders"), ". When ON, withdrawing all of an item leaves a slot so your bank stays organized.") },
                            { targetId: 'bank-exit', description: React.createElement('p', null, "That's the basics! Click ", React.createElement('span', { className: "text-yellow-300 font-bold" }, "Exit Bank"), " when you're finished to return to the world.") },
                        ]
                    });
                    break;
                }
                case 'complete_tutorial': {
                    
                    // Wipe everything
                    inv.setInventory(new Array(INVENTORY_CAPACITY).fill(null));
                    inv.setEquipment({ weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null });
                    setBank([{ id: 0, name: 'Main', icon: null, items: [] }]);
                    setActivityLog([]);
                    
                    // Automatically turn in the tutorial repeatable quest if it's active.
                    if (repeatableQuests.activePlayerQuest?.questId === 'tutorial_magic_rat') {
                        repeatableQuests.handleTurnInRepeatableQuest();
                        addLog("Your 'Magical Pest Control' task was automatically turned in.");
                    }

                    // Give starter pack
                    const starterItems = [
                        { id: 'bronze_axe', qty: 1 },
                        { id: 'bronze_pickaxe', qty: 1 },
                        { id: 'tinderbox', qty: 1 },
                        { id: 'hammer', qty: 1 },
                        { id: 'small_fishing_net', qty: 1 },
                        { id: 'cooked_shrimp', qty: 1 },
                        { id: 'bread', qty: 1 },
                        { id: 'bronze_dagger', qty: 1 },
                        { id: 'bronze_sword', qty: 1 },
                        { id: 'wooden_shield', qty: 1 },
                        { id: 'shortbow', qty: 1 },
                        { id: 'bronze_arrow', qty: 50 },
                        { id: 'gust_rune', qty: 50 },
                        { id: 'binding_rune', qty: 50 },
                    ];
                    starterItems.forEach(item => inv.modifyItem(item.id, item.qty, true, { bypassAutoBank: true }));
                    addLog("You have completed your training and received a starter pack!");

                    questLogic.forceCompleteQuest('embrune_101');
                    break;
                }
                case 'set_quest_combat_reward': {
                    setWorldState(ws => ({ ...ws, pendingQuestCombatReward: { itemId: action.itemId, quantity: action.quantity } }));
                    break;
                }
                case 'start_mandatory_combat': {
                    // This creates a unique instance for a quest-spawned monster that does not respawn.
                    const uniqueId = `${session.currentPoiId}:${action.monsterId}:quest`;
                    ui.setCombatQueue([uniqueId]);
                    ui.setIsMandatoryCombat(true);
                    break;
                }
                case 'tan_all_hides': {
                    let totalCost = 0;
                    const hidesToTan: { hideId: string; quantity: number; leatherId: string }[] = [];

                    for (const hideId in TANNING_RECIPES) {
                        const count = inv.inventory.reduce((acc, slot) => 
                            (slot && slot.itemId === hideId && !slot.noted) ? acc + slot.quantity : acc, 0);
                        if (count > 0) {
                            const recipe = TANNING_RECIPES[hideId];
                            totalCost += count * recipe.cost;
                            hidesToTan.push({ hideId, quantity: count, ...recipe });
                        }
                    }
                    
                    if (inv.coins < totalCost) {
                        // This case is handled by the failureNode in the dialogue, but as a safeguard:
                        addLog("You can't afford to tan all your hides.");
                        break;
                    } 

                    inv.modifyItem('coins', -totalCost);
                    let totalTanned = 0;

                    hidesToTan.forEach(hide => {
                        inv.modifyItem(hide.hideId, -hide.quantity, true);
                        inv.modifyItem(hide.leatherId, hide.quantity, false, { bypassAutoBank: true });
                        totalTanned += hide.quantity;
                    });

                    if (totalTanned > 0) {
                        addLog(`You pay Sven ${totalCost} coins to tan ${totalTanned} hides.`);
                    }
                    
                    break;
                }
                 case 'open_make_x_for_grinding': {
                    const { itemId } = action;
                    const count = inv.inventory.filter(slot => slot?.itemId === itemId).length;
                    if (count > 0) {
                        const onConfirm = (quantity: number) => {
                            ui.setActiveCraftingAction({
                                recipeId: itemId,
                                recipeType: 'grinding',
                                totalQuantity: quantity,
                                completedQuantity: 0,
                                successfulQuantity: 0,
                                startTime: Date.now(),
                                duration: 1800,
                            });
                        };
                        if (count === 1) {
                            onConfirm(1);
                        } else {
                            ui.setMakeXPrompt({
                                title: `Grind ${ITEMS[itemId].name}`,
                                max: count,
                                onConfirm,
                            });
                        }
                    }
                    ui.setActiveDialogue(null);
                    break;
                }
                // FIX: Added new action types for quest-specific variable management.
                case 'set_variable': {
                    (questLogic as any).setQuestVariable(action.name, action.value);
                    break;
                }
                case 'increment_variable': {
                    (questLogic as any).incrementQuestVariable(action.name, action.amount);
                    break;
                }
                case 'tst_start_heat_trial_slow': {
                    // Remove ANY existing core to prevent duplication
                    inv.inventory.forEach(slot => {
                        if (slot && slot.itemId === 'unstable_core') {
                            inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        }
                    });
                    setWorldState(ws => ({
                        ...ws,
                        destructionTrialProgress: {
                            ...ws.destructionTrialProgress,
                            heat: 'started',
                            heatEndTime: Date.now() + 120000 // 2 minutes
                        }
                    }));
                    addLog("You hand the unstable core to Durin's apprentices. They carefully place it near the central anvil and begin the work.");
                    break;
                }
                case 'restore_unstable_core': {
                    const playerQuest = quests.playerQuests.find(q => q.questId === 'the_sorcerers_trial');
                    if (playerQuest && playerQuest.currentStage >= 13) {
                        inv.modifyItem('core_of_controlled_destruction', 1, false, { bypassAutoBank: true });
                    } else {
                        const progress = worldState.destructionTrialProgress;
                        const trials = [];
                        if (progress?.heat === 'completed') trials.push('Heat');
                        if (progress?.pressure === 'completed') trials.push('Pressure');
                        if (progress?.silence === 'completed') trials.push('Silence');
                        
                        const nameOverride = trials.length === 0 ? undefined : `Unstable Core (${trials.join(', ')})`;
                        inv.modifyItem('unstable_core', 1, false, { bypassAutoBank: true, nameOverride });
                    }
                    break;
                }
                case 'reset_destruction_trial': {
                    setWorldState(ws => ({
                        ...ws,
                        destructionTrialProgress: {
                            heat: undefined,
                            pressure: undefined,
                            silence: undefined,
                            heatEndTime: undefined,
                            pressureStartTime: undefined,
                            silenceStartTime: undefined
                        }
                    }));
                    inv.modifyItem('unstable_core', 1, false, { bypassAutoBank: true });
                    break;
                }
                case 'instant_heat_temper': {
                    if (inv.coins < 15000) {
                        addLog("You don't have enough coins.");
                        success = false;
                        break;
                    }
                    inv.modifyItem('coins', -15000, true);
                    
                    // Remove ANY existing core to prevent duplication
                    inv.inventory.forEach(slot => {
                        if (slot && slot.itemId === 'unstable_core') {
                            inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        }
                    });

                    setWorldState(ws => {
                        const newProgress = { ...ws.destructionTrialProgress, heat: 'completed' as const };
                        const newState = { ...ws, destructionTrialProgress: newProgress };
                        
                        const trials = [];
                        if (newProgress.heat === 'completed') trials.push('Heat');
                        if (newProgress.pressure === 'completed') trials.push('Pressure');
                        if (newProgress.silence === 'completed') trials.push('Silence');
                        
                        if (newProgress.heat === 'completed' && newProgress.pressure === 'completed' && newProgress.silence === 'completed') {
                            inv.modifyItem('tempered_core', 1, false, { bypassAutoBank: true });
                            addLog("The unstable core has been fully tempered. Durin's apprentices hand you the finished product.");
                        } else {
                            const nameOverride = `Unstable Core (${trials.join(', ')})`;
                            inv.modifyItem('unstable_core', 1, false, { bypassAutoBank: true, nameOverride });
                            addLog("The unstable core has been instantly tempered by Durin's master smiths.");
                        }
                        
                        return newState;
                    });
                    break;
                }
                case 'cleanup_quest_state': {
                    questLogic.cleanupQuestState(action.questId);
                    break;
                }
                case 'light_monolith_fire': {
                    setWorldState(ws => ({
                        ...ws,
                        monolithFires: {
                            ...(ws.monolithFires || {}),
                            [action.pitId]: {
                                logType: action.logType,
                                expiresAt: Date.now() + 120000 // 2 minutes
                            }
                        }
                    }));
                    addLog(`You light the fire pit with ${ITEMS[action.logType]?.name || 'logs'}.`);
                    break;
                }
                case 'show_quest_info': {
                    ui.setActivePanel('quests');
                    ui.setActiveQuestDetail({
                        questId: action.questId,
                        playerQuests: quests.playerQuests,
                        skills: char.skills.map(s => ({ skill: s.name, level: s.level })),
                        combatLevel: char.combatLevel
                    });
                    break;
                }
                case 'slayer_get_task':
                    slayer.handleSlayerMasterInteraction(action.masterId);
                    break;
                case 'slayer_reset_task':
                    slayer.resetTask(action.masterId);
                    break;
                case 'slayer_open_shop':
                    slayer.openSlayerShop();
                    break;
            }

            if (!success) {
                break; // Stop processing subsequent actions in this chain.
            }
        }
    }, [quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session.currentPoiId, slayer]);

    const onResponse = useCallback((response: DialogueResponse) => {
        if (response.check) {
            const checkResult = handleDialogueCheck(response.check.requirements);
            // --- FIX: Handle optional branching nodes in check result ---
            const nextNodeKey = checkResult ? response.check.successNode : response.check.failureNode;
            
            if (checkResult) {
                if (response.actions) {
                    handleDialogueAction(response.actions);
                }
            } else {
                if (response.failureActions) {
                    handleDialogueAction(response.failureActions);
                }
            }

            if (nextNodeKey !== undefined && nextNodeKey !== '') {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: nextNodeKey } : null);
            } else if (nextNodeKey === '') {
                // Do nothing, let the check act as a filter.
            } else if (response.next) {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.next! } : null);
            } else {
                // Default to closing dialogue if no specific branch is provided (e.g. simple visibility gating)
                setActiveDialogue(null);
            }
        } else {
            if (response.actions) {
                handleDialogueAction(response.actions);
            }
            if (response.next) {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.next! } : null);
            } else {
                setActiveDialogue(null);
            }
        }
    }, [handleDialogueCheck, handleDialogueAction, setActiveDialogue]);

    return { handleDialogueAction, handleDialogueCheck, onResponse };
};