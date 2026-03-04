import React, { useCallback } from 'react';
import { DialogueAction, DialogueCheckRequirement, WorldState, InventorySlot, BankTab, ActivePanel, POIActivity, DialogueResponse, SkillName, ActiveTutorialState } from '../types';
import { INVENTORY_CAPACITY, QUESTS, ITEMS } from '../constants';
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
    setActivityLog: React.Dispatch<React.SetStateAction<string[]>>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    ui: ReturnType<typeof useUIState>;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    session: ReturnType<typeof useGameSession>;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDialogueActions = (deps: DialogueActionDependencies) => {
    const { quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session } = deps;
    const { setActiveDialogue } = ui;

    const handleDialogueCheck = useCallback((requirements: DialogueCheckRequirement[]): boolean => {
        return requirements.every(req => {
            switch (req.type) {
                case 'items':
                    return req.items.every(itemReq => {
                        const totalQuantity = inv.inventory.reduce((acc, slot) => {
                            if (slot && slot.itemId === itemReq.itemId) {
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
                    if (req.property === 'monolithFire') {
                        // Check if fire exists and is not expired
                        const fireExists = !!worldState.monolithFire && worldState.monolithFire.expiresAt > Date.now();
                        return fireExists === req.value;
                    }
                    if (req.property === 'monolithLogType') {
                        const fire = worldState.monolithFire;
                        if (!fire || fire.expiresAt <= Date.now()) return false; // No active fire
                        // Only 'eq' makes sense here
                        return fire.logType === req.value;
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
                case 'variable': {
                    const variableValue = (questLogic as any).getQuestVariable(req.name) ?? 0;
                    switch (req.operator) {
                        case 'eq': return variableValue === req.value;
                        case 'lt': return variableValue < req.value;
                        case 'gte': return variableValue >= req.value;
                        default: return false;
                    }
                }
            }
        });
    }, [inv, char, worldState, quests.playerQuests, questLogic]);

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
                        if (inv.hasItems([{ itemId: action.itemId, quantity: quantity }])) {
                            inv.modifyItem(action.itemId, -quantity, true);
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
                case 'start_destruction_trial_heat': {
                    if (inv.coins < 15000) {
                        addLog("You don't have enough coins.");
                        success = false;
                        break;
                    }
                    inv.modifyItem('coins', -15000, true);
                    inv.modifyItem('unstable_core', -1, true);
                    setWorldState(ws => ({
                        ...ws,
                        destructionTrialProgress: {
                            ...ws.destructionTrialProgress,
                            heat: 'started',
                            heatEndTime: Date.now() + 120000 // 2 minutes
                        }
                    }));
                    addLog("You hand the unstable core and 15,000 coins to Durin. He nods grimly and tells his apprentices to get the tongs. This will take about two minutes.");
                    break;
                }
            }

            if (!success) {
                break; // Stop processing subsequent actions in this chain.
            }
        }
    }, [quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session.currentPoiId]);

    const onResponse = useCallback((response: DialogueResponse) => {
        if (response.check) {
            const checkResult = handleDialogueCheck(response.check.requirements);
            // --- FIX: Handle optional branching nodes in check result ---
            const nextNodeKey = checkResult ? response.check.successNode : response.check.failureNode;
            
            if (checkResult) {
                if (response.actions) {
                    handleDialogueAction(response.actions);
                }
            }

            if (nextNodeKey !== undefined && nextNodeKey !== '') {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: nextNodeKey } : null);
            } else if (nextNodeKey === '') {
                // Do nothing, let the check act as a filter.
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