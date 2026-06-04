import React, { useCallback } from 'react';
import { DialogueAction, DialogueCheckRequirement, WorldState, InventorySlot, BankTab, ActivePanel, POIActivity, DialogueResponse, SkillName, ActiveTutorialState, LogEntry, ItemId, MonsterId } from '../types';
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
import { useSlayer } from './useSlayer';
import { isFestivalActive } from '../utils/festivalDates';
import { FESTIVAL_TRIVIA_QUESTIONS, GOURD_LOOT_TABLE } from '../constants/festival';

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
    bankLogic: any;
}

export const useDialogueActions = (deps: DialogueActionDependencies) => {
    const { quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session, slayer, bankLogic } = deps;
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
                        const masterMatch = req.masterId ? task.masterId === req.masterId : true;
                        const result = task.isComplete && masterMatch;
                        return operator === 'eq' ? result : !result;
                    }

                    return false;
                }
                case 'festival_active': {
                    return isFestivalActive() === req.value;
                }
                case 'festival_playable': {
                    const lastPlayed = (questLogic as any).getQuestVariable(`last_played_${req.gameId}`) ?? 0;
                    const today = Math.floor(Date.now() / 86400000);
                    return lastPlayed < today;
                }
            }
            return true;
        });
    }, [inv, char, worldState, quests.playerQuests, questLogic, slayer]);

    const validateDialogueActions = useCallback((actions: DialogueAction[]): { success: boolean, error?: string } => {
        let tempInv = [...inv.inventory];
        let tempCoins = inv.coins;

        for (const action of actions) {
            switch (action.type) {
                case 'give_item': {
                    const itemData = ITEMS[action.itemId];
                    if (!itemData) continue;
                    const isNoted = !!action.noted;

                    if (isNoted || itemData.stackable) {
                        const stackIndex = tempInv.findIndex(i => i?.itemId === action.itemId && !!i.noted === isNoted);
                        if (stackIndex === -1) {
                            const emptySlotIndex = tempInv.findIndex(slot => slot === null);
                            if (emptySlotIndex === -1) return { success: false, error: "Your inventory is full." };
                            tempInv[emptySlotIndex] = { itemId: action.itemId, quantity: action.quantity, noted: isNoted || undefined };
                        } else {
                            const existing = tempInv[stackIndex]!;
                            tempInv[stackIndex] = { ...existing, quantity: existing.quantity + action.quantity };
                        }
                    } else {
                        for (let i = 0; i < action.quantity; i++) {
                            const emptySlotIndex = tempInv.findIndex(slot => slot === null);
                            if (emptySlotIndex === -1) return { success: false, error: "Your inventory is full." };
                            tempInv[emptySlotIndex] = { itemId: action.itemId, quantity: 1, noted: false };
                        }
                    }
                    break;
                }
                case 'take_item': {
                    const itemData = ITEMS[action.itemId];
                    const itemName = itemData ? itemData.name : 'item';
                    if (action.quantity === 'all') {
                        tempInv = tempInv.map(i => i?.itemId === action.itemId ? null : i);
                    } else {
                        const amountNeeded = action.quantity;
                        let found = 0;
                        // Count across all slots (same as hasItems)
                        found = tempInv.reduce((acc, slot) => (slot && slot.itemId === action.itemId && !slot.noted) ? acc + slot.quantity : acc, 0);

                        if (found < amountNeeded) return { success: false, error: `You do not have ${amountNeeded > 1 ? amountNeeded + 'x ' : ''}${itemName}.` };

                        // Simulate removal
                        let remainingToRemove = amountNeeded;
                        for (let i = 0; i < tempInv.length && remainingToRemove > 0; i++) {
                            const slot = tempInv[i];
                            if (slot && slot.itemId === action.itemId && !slot.noted) {
                                const toRemove = Math.min(slot.quantity, remainingToRemove);
                                if (slot.quantity === toRemove) tempInv[i] = null;
                                else tempInv[i] = { ...slot, quantity: slot.quantity - toRemove };
                                remainingToRemove -= toRemove;
                            }
                        }
                    }
                    break;
                }
                case 'give_coins':
                    tempCoins += action.amount;
                    break;
                case 'take_coins':
                    if (tempCoins < action.amount) return { success: false, error: "You do not have enough coins." };
                    tempCoins -= action.amount;
                    break;
                case 'instant_heat_temper':
                    if (tempCoins < 15000) return { success: false, error: "You don't have enough coins." };
                    tempCoins -= 15000;
                    break;
                case 'blimp_travel':
                    if (action.cost && tempCoins < action.cost) return { success: false, error: `You need ${action.cost} coins to use the blimp.` };
                    if (action.cost) tempCoins -= action.cost;
                    break;
                case 'buy_festival_tokens': {
                    const cost = action.quantity * 100;
                    if (tempCoins < cost) return { success: false, error: "You do not have enough coins." };
                    tempCoins -= cost;
                    const stackIndex = tempInv.findIndex(i => i?.itemId === 'festival_token' && !i.noted);
                    if (stackIndex === -1) {
                        const emptySlotIndex = tempInv.findIndex(slot => slot === null);
                        if (emptySlotIndex === -1) return { success: false, error: "Your inventory is full." };
                        tempInv[emptySlotIndex] = { itemId: 'festival_token', quantity: action.quantity, noted: false };
                    } else {
                        const existing = tempInv[stackIndex]!;
                        tempInv[stackIndex] = { ...existing, quantity: existing.quantity + action.quantity };
                    }
                    break;
                }
            }
        }
        return { success: true };
    }, [inv.inventory, inv.coins]);

    const handleDialogueAction = useCallback((actions: DialogueAction[]) => {
        for (const action of actions) {
            let success = true;
            switch (action.type) {
                case 'give_item': {
                    inv.modifyItem(action.itemId as ItemId, action.quantity, false, { bypassAutoBank: true, noted: action.noted });
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
                    } else {
                        inv.modifyItem(action.itemId, -quantity, true, { nameOverride: action.nameOverride });
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
                case 'deposit_backpack':
                    bankLogic.handleDepositBackpack(ui.activeBankTabId);
                    break;
                case 'deposit_equipment':
                    bankLogic.handleDepositEquipment(ui.activeBankTabId);
                    break;
                case 'shop':
                    ui.setActiveShopId(action.shopId);
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
                    starterItems.forEach(item => inv.modifyItem(item.id as ItemId, item.qty, true, { bypassAutoBank: true }));
                    addLog("You have completed your training and received a starter pack!");

                    questLogic.forceCompleteQuest('embrune_101');
                    break;
                }
                case 'set_quest_combat_reward': {
                    setWorldState(ws => ({ ...ws, pendingQuestCombatReward: { itemId: action.itemId as ItemId, quantity: action.quantity } }));
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
                        inv.modifyItem(hide.hideId as ItemId, -hide.quantity, true);
                        inv.modifyItem(hide.leatherId as ItemId, hide.quantity, false, { bypassAutoBank: true });
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
                case 'instant_heat_temper':
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
                case 'slayer_complete_task':
                    slayer.completeTask(action.masterId);
                    break;
                case 'slayer_reset_task':
                    slayer.resetTask(action.masterId);
                    break;
                case 'slayer_open_shop':
                    slayer.openSlayerShop();
                    break;
                case 'blimp_travel': {
                    if (action.cost) {
                        inv.modifyItem('coins', -action.cost);
                    }
                    session.setCurrentPoiId(action.destinationPoiId);
                    addLog(`The blimp whisks you away to your destination: ${action.destinationPoiId.replace(/_/g, ' ')}.`);
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'record_game_played': {
                    const today = Math.floor(Date.now() / 86400000);
                    (questLogic as any).setQuestVariable(`last_played_${action.gameId}`, today);
                    break;
                }
                case 'start_trivia': {
                    const randomIndex = Math.floor(Math.random() * FESTIVAL_TRIVIA_QUESTIONS.length);
                    (questLogic as any).setQuestVariable('trivia_question_index', randomIndex);
                    (questLogic as any).setQuestVariable('trivia_answered', 0);
                    ui.setActiveFestivalMinigame('trivia');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'wait_draft': {
                    ui.setActiveFestivalMinigame('lantern_launch');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'launch_lantern': {
                    ui.setActiveFestivalMinigame('lantern_launch');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'smash_gourd': {
                    const today = Math.floor(Date.now() / 86400000);
                    (questLogic as any).setQuestVariable('last_played_gourd', today);

                    const roll = Math.floor(Math.random() * 100) + 1;
                    let selectedEntry = GOURD_LOOT_TABLE[0];
                    let cumulative = 0;
                    for (const entry of GOURD_LOOT_TABLE) {
                        cumulative += entry.weight;
                        if (roll <= cumulative) {
                            selectedEntry = entry;
                            break;
                        }
                    }

                    if (selectedEntry.type === 'festival_ticket') {
                        const min = selectedEntry.minTickets ?? 10;
                        const max = selectedEntry.maxTickets ?? 20;
                        const tickets = Math.floor(Math.random() * (max - min + 1)) + min;
                        (questLogic as any).setQuestVariable('gourd_smash_result', `tickets:${tickets}`);
                    } else if (selectedEntry.itemId) {
                        (questLogic as any).setQuestVariable('gourd_smash_result', `item:${selectedEntry.itemId}`);
                    }
                    ui.setActiveFestivalMinigame('smash_gourd');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'play_log_balance': {
                    ui.setActiveFestivalMinigame('log_balance');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'play_whack_lantern': {
                    ui.setActiveFestivalMinigame('whack_lantern');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'play_high_striker': {
                    ui.setActiveFestivalMinigame('high_striker');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'buy_festival_tokens': {
                    const cost = action.quantity * 100;
                    inv.modifyItem('coins', -cost, true);
                    inv.modifyItem('festival_token', action.quantity, false, { bypassAutoBank: true });
                    addLog(`You purchase ${action.quantity} Festival Token${action.quantity > 1 ? 's' : ''} for ${cost} coins.`);
                    break;
                }
                case 'play_skeeball': {
                    ui.setActiveFestivalMinigame('skeeball');
                    ui.setActiveDialogue(null);
                    break;
                }
                case 'play_balloon_pop': {
                    ui.setActiveFestivalMinigame('balloon_pop');
                    ui.setActiveDialogue(null);
                    break;
                }
            }

            if (!success) {
                break; // Stop processing subsequent actions in this chain.
            }
        }
    }, [quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session.currentPoiId, slayer, bankLogic]);

    const isLocked = React.useRef(false);
    const { isDialogueProcessing, setIsDialogueProcessing } = ui;

    const onResponse = useCallback((response: DialogueResponse): { success: boolean, error?: string } => {
        if (!ui.activeDialogue || isLocked.current || isDialogueProcessing) return { success: true };

        isLocked.current = true;
        setIsDialogueProcessing(true);

        const checkResult = response.check ? handleDialogueCheck(response.check.requirements) : true;

        if (response.check && response.check.successNode !== undefined) {
            if (checkResult) {
                if (response.actions) {
                    const validation = validateDialogueActions(response.actions);
                    if (!validation.success) {
                        addLog(validation.error!);
                        return { success: false, error: validation.error };
                    }
                    handleDialogueAction(response.actions);
                }
                if (response.check.successNode) {
                    setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.check.successNode! } : null);
                } else {
                    setActiveDialogue(null);
                }
            } else {
                if (response.failureActions) {
                    const validation = validateDialogueActions(response.failureActions);
                    if (!validation.success) {
                        addLog(validation.error!);
                        return { success: false, error: validation.error };
                    }
                    handleDialogueAction(response.failureActions);
                }
                if (response.check.failureNode) {
                    setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.check.failureNode! } : null);
                } else if (response.check.failureNode === '') {
                    setActiveDialogue(null);
                }
            }
        } else {
            if (response.actions) {
                const validation = validateDialogueActions(response.actions);
                if (!validation.success) {
                    addLog(validation.error!);
                    return { success: false, error: validation.error };
                }
                handleDialogueAction(response.actions);
            }
            if (response.next) {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.next! } : null);
            } else {
                setActiveDialogue(null);
            }
        }
        setTimeout(() => {
            isLocked.current = false;
            setIsDialogueProcessing(false);
        }, 150);

        return { success: true };
    }, [ui.activeDialogue, isDialogueProcessing, handleDialogueCheck, validateDialogueActions, handleDialogueAction, addLog, setActiveDialogue, setIsDialogueProcessing]);

    return { handleDialogueAction, handleDialogueCheck, onResponse };
};