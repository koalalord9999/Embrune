import React, { useCallback } from 'react';
// FIX: Import Equipment type.
import { InventorySlot, PlayerSkill, SkillName, ActiveCraftingAction, Item, CraftingContext, POIActivity, EquipmentSlot, PlayerQuestState, Spell, Equipment, ActiveBuff, DialogueResponse, DialogueCheckRequirement, WeaponType, EquipmentStats, BonfireActivity, WorldState, ItemId } from '../types';
import { ITEMS, FLETCHING_RECIPES, HERBLORE_RECIPES, HERBS, INVENTORY_CAPACITY, rollOnLootTable, LootRollResult, FIREMAKING_RECIPES, QUESTS, COOKING_RECIPES, SMELTING_RECIPES, GEM_CUTTING_RECIPES, REGIONS, RENDERING_RECIPES, FIRE_FLASK_DATA, MISC_FURNACE_RECIPES } from '../constants';
import { POIS } from '../data/pois';
// FIX: Import ContextMenuOption from its source file instead of re-exporting from useUIState.
import { MakeXPrompt, useUIState, ConfirmationPrompt } from './useUIState';
import { useNavigation } from './useNavigation';
import { useSoundEngine } from './useSoundEngine';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'gold_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

interface CraftingHandlers {
    handleCooking: (recipeId: string, quantity?: number) => void;
    // FIX: Corrected typo from onSmelt to handleSmelting and added handleStokeBonfire
    handleSmelting: (barType: BarType, quantity: number) => void;
    handleStokeBonfire: (logId: string, bonfireId: string, quantity: number) => void;
    handleJewelryCrafting: (itemId: ItemId, quantity: number) => void;
}

interface UseItemActionsProps {
    addLog: (message: string) => void;
    currentHp: number;
    maxHp: number;
    setCurrentHp: React.Dispatch<React.SetStateAction<number>>;
    currentPrayer: number;
    maxPrayer: number;
    setCurrentPrayer: (updater: React.SetStateAction<number>) => void;
    setRunEnergy: React.Dispatch<React.SetStateAction<number>>;
    applyStatModifier: (skill: SkillName, value: number, baseLevelOnConsumption: number, stackable?: boolean) => void;
    restoreNegativeStatModifiers: (percent: number, base: number) => void;
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
    curePoison: () => void;
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    skills: (PlayerSkill & { currentLevel: number; })[];
    inventory: (InventorySlot | null)[];
    activeBuffs: ActiveBuff[];
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    hasItems: (items: { itemId: ItemId, quantity: number }[]) => boolean;
    modifyItem: (itemId: ItemId, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    addXp: (skill: SkillName, amount: number) => void;
    openCraftingView: (context: CraftingContext) => void;
    itemToUse: { item: InventorySlot, index: number } | null;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    isBusy?: boolean;
    setConfirmationPrompt: (prompt: ConfirmationPrompt | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    startQuest: (questId: string) => void;
    currentPoiId: string;
    playerQuests: PlayerQuestState[];
    isStunned: boolean;
    setActiveDungeonMap: (mapInfo: { regionId: string; mapTitle: string; } | null) => void;
    confirmValuableDrops: boolean;
    valuableDropThreshold: number;
    ui: ReturnType<typeof useUIState>;
    equipment: Equipment;
    onResponse: (response: DialogueResponse) => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    crafting: CraftingHandlers;
    navigation: ReturnType<typeof useNavigation>;
    rangeCooldowns: Record<string, number>;
    setRangeCooldowns: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
    combatSpeedMultiplier: number;
}

const MULTI_BITE_FOODS: Record<string, string> = {
    'cake': '2_3_cake',
    '2_3_cake': 'slice_of_cake',
    'berry_pie': 'half_berry_pie',
    'apple_pie': 'half_apple_pie',
    'meat_pie': 'half_meat_pie',
    'fish_pie': 'half_fish_pie',
    'plain_pizza': 'half_plain_pizza',
    'meat_pizza': 'half_meat_pizza',
    'anchovy_pizza': 'half_anchovy_pizza',
    'pineapple_pizza': 'half_pineapple_pizza',
};

export const useItemActions = (props: UseItemActionsProps) => {
    const { addLog, currentHp, maxHp, setCurrentHp, currentPrayer, maxPrayer, setCurrentPrayer, setRunEnergy, restoreNegativeStatModifiers, applyStatModifier, setInventory, setEquipment, skills, inventory, activeBuffs, activeCraftingAction, setActiveCraftingAction, hasItems, modifyItem, addXp, openCraftingView, itemToUse, setItemToUse, addBuff, curePoison, setMakeXPrompt, startQuest, currentPoiId, playerQuests, isStunned, setActiveDungeonMap, confirmValuableDrops, valuableDropThreshold, ui, equipment, onResponse, handleDialogueCheck, crafting, isBusy, navigation, rangeCooldowns, setRangeCooldowns, worldState, setWorldState, setIsResting, combatSpeedMultiplier } = props;
    const { setActiveDialogue, setContextMenu } = ui;
    const lastFoodEatenTime = React.useRef<number>(0);
    const { playInstrumentNote, getContextTime } = useSoundEngine();

    const handleTeleport = useCallback((
        itemSlot: InventorySlot,
        slotIdentifier: number | keyof Equipment,
        from: 'inventory' | keyof Equipment,
        poiId: string
    ) => {
        const itemData = ITEMS[itemSlot.itemId];
        const charges = itemSlot.charges ?? itemData.charges ?? 0;

        if (charges <= 0) {
            addLog("It has no charges left.");
            return;
        }

        const newCharges = charges - 1;

        // Default to destroying the item unless destroyOnEmpty is explicitly false.
        const destroy = itemData.destroyOnEmpty !== false;

        if (newCharges === 0 && destroy) {
            addLog(`Your ${itemData.name} crumbles to dust, its magic expended.`);
            if (from === 'inventory') {
                const index = slotIdentifier as number;
                setInventory(prev => {
                    const newInv = [...prev];
                    newInv[index] = null;
                    return newInv;
                });
            } else {
                const slotKey = slotIdentifier as keyof Equipment;
                setEquipment(prev => ({ ...prev, [slotKey]: null }));
            }
        } else {
            if (from === 'inventory') {
                const index = slotIdentifier as number;
                setInventory(prev => {
                    const newInv = [...prev];
                    const slot = newInv[index];
                    if (slot) {
                        newInv[index] = { ...slot, charges: newCharges };
                    }
                    return newInv;
                });
            } else {
                const slotKey = slotIdentifier as keyof Equipment;
                setEquipment(prev => {
                    const newEq = { ...prev };
                    const slot = newEq[slotKey];
                    if (slot) {
                        newEq[slotKey] = { ...slot, charges: newCharges };
                    }
                    return newEq;
                });
            }
            addLog(`You rub the ${itemData.name} and feel a magical pull...`);
            if (newCharges === 0) {
                addLog(`The ${itemData.name} has run out of charges.`);
            }
        }

        if (navigation) {
            navigation.handleForcedNavigate(poiId);
        } else {
            console.error("Navigation handler not found in itemActions hook props!");
        }

    }, [setInventory, setEquipment, addLog, navigation]);


    const handleConsume = useCallback((itemId: ItemId, inventoryIndex: number) => {
        if (isStunned) {
            addLog("You are stunned and cannot eat or drink.");
            return;
        }
        const itemData = ITEMS[itemId];
        if (!itemData) return;

        if (['red_whistle', 'blue_whistle', 'green_whistle', 'yellow_whistle'].includes(itemId)) {
            const now = getContextTime();
            if (itemId === 'red_whistle') {
                // 🔴 Red - A minor arpeggio
                playInstrumentNote('ocarina', 587.33, 150, now, 1.0, 'sfx'); // D5
                playInstrumentNote('ocarina', 739.99, 150, now + 0.18, 1.0, 'sfx'); // F#5
                playInstrumentNote('ocarina', 880.00, 250, now + 0.36, 1.0, 'sfx'); // A5
                addLog("You blow your Red Whistle ♪ toot-toot-TOOT!");
            }
            else if (itemId === 'blue_whistle') {
                // 🔵 Blue - F major arpeggio
                playInstrumentNote('ocarina', 440.00, 150, now, 1.0, 'sfx'); // A4
                playInstrumentNote('ocarina', 554.37, 150, now + 0.18, 1.0, 'sfx'); // C#5
                playInstrumentNote('ocarina', 659.25, 250, now + 0.36, 1.0, 'sfx'); // E5
                addLog("You blow your Blue Whistle ♪ toot-toot-TOOT!");
            }
            else if (itemId === 'green_whistle') {
                // 🟢 Green - C major arpeggio
                playInstrumentNote('ocarina', 493.88, 150, now, 1.0, 'sfx'); // B4
                playInstrumentNote('ocarina', 587.33, 150, now + 0.18, 1.0, 'sfx'); // D5
                playInstrumentNote('ocarina', 739.99, 250, now + 0.36, 1.0, 'sfx'); // F#5
                addLog("You blow your Green Whistle ♪ toot-toot-TOOT!");
            }
            else if (itemId === 'yellow_whistle') {
                // 🟡 Yellow - G major arpeggio
                playInstrumentNote('ocarina', 392.00, 150, now, 1.0, 'sfx'); // G4
                playInstrumentNote('ocarina', 493.88, 150, now + 0.18, 1.0, 'sfx'); // B4
                playInstrumentNote('ocarina', 587.33, 250, now + 0.36, 1.0, 'sfx'); // D5
                addLog("You blow your Yellow Whistle ♪ toot-toot-TOOT!");
            }
            return;
        }

        if (itemData.cleanable) {
            const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.currentLevel ?? 1;
            const herbData = HERBS.find(h => h.grimy === itemId);
            if (herbData && herbloreLevel < herbData.level) {
                addLog(`You need a Herblore level of ${herbData.level} to clean this herb.`);
                return;
            }

            setInventory(prevInv => {
                const newInv = [...prevInv];
                newInv[inventoryIndex] = null;
                return newInv;
            });

            modifyItem(itemData.cleanable.cleanItemId as ItemId, 1, true, { bypassAutoBank: true });
            addXp(SkillName.Herblore, itemData.cleanable.xp);
            return;
        }

        if (!itemData.consumable) return;

        if (itemId === 'swamp_ward_bundle') {
            setInventory(prevInv => {
                const newInv = [...prevInv];
                newInv[inventoryIndex] = null;
                return newInv;
            });
            setWorldState(prev => ({
                ...prev,
                questVariables: {
                    ...(prev.questVariables || {}),
                    swamp_ward_burned: 1
                }
            }));
            addLog("You burn the Swamp Ward Bundle. A thick, sweet-smelling smoke surrounds you, parting the miasma.");
            return;
        }

        if (itemData.consumable.curesPoison) {
            curePoison();
        }



        if (itemData.consumable.special === 'treasure_chest') {
            const freeSlots = inventory.filter(s => s === null).length;
            if (freeSlots < 9) {
                addLog("You need at least 9 free inventory slots to open this chest.");
                return;
            }

            modifyItem(itemId, -1, true);
            addLog("You open the treasure chest and find...");

            for (let i = 0; i < 5; i++) {
                const gem = rollOnLootTable('gem_table');
                if (gem) {
                    const gemId = typeof gem === 'string' ? gem : gem.itemId;
                    modifyItem(gemId as ItemId, 1, true, { bypassAutoBank: true, noted: true });
                }
            }

            for (let i = 0; i < 3; i++) {
                const herb = rollOnLootTable('herb_table');
                if (herb) {
                    const herbId = typeof herb === 'string' ? herb : herb.itemId;
                    modifyItem(herbId as ItemId, 1, true, { bypassAutoBank: true, noted: true });
                }
            }

            const mithrilEquipment = Object.values(ITEMS).filter(
                item => item.material === 'mithril' && item.equipment
            );
            if (mithrilEquipment.length > 0) {
                const randomMithrilItem = mithrilEquipment[Math.floor(Math.random() * mithrilEquipment.length)];
                if (randomMithrilItem.id === 'mithril_arrow') {
                    modifyItem(randomMithrilItem.id, 100, true, { bypassAutoBank: true });
                } else {
                    modifyItem(randomMithrilItem.id, 1, true, { bypassAutoBank: true });
                }
            }

            if (Math.random() < 0.01) {
                modifyItem('runic_scimitar', 1, true, { bypassAutoBank: true });
                addLog("Incredibly lucky! You found a Runic Scimitar inside!");
            }

            return;
        }

        if (itemData.consumable.special === 'fishing_casket') {
            modifyItem(itemId, -1, true);
            addLog("You pry open the water-logged casket...");

            const loot = rollOnLootTable('fishing_casket_table');
            if (loot) {
                const { itemId: lootId, quantity, noted } = typeof loot === 'string' ? { itemId: loot, quantity: 1, noted: false } : loot;
                modifyItem(lootId as ItemId, quantity, false, { bypassAutoBank: false, noted });
            } else {
                addLog("The casket was completely empty!");
            }
            return;
        }

        const hasNonHealingEffect = !!(itemData.consumable.statModifiers || itemData.consumable.buffs || itemData.consumable.givesCoins || itemData.consumable.curesPoison || itemData.consumable.potionEffect);

        const isFood = !!itemData.consumable.healAmount && !itemData.doseable && !itemData.consumable.potionEffect;

        if (isFood) {
            const now = Date.now();
            let cooldownTicks = 3;
            if (combatSpeedMultiplier === 2) cooldownTicks = 2;
            else if (combatSpeedMultiplier >= 3) cooldownTicks = 1;

            const cooldownMs = cooldownTicks * 600;
            if (now - lastFoodEatenTime.current < cooldownMs) {
                return;
            }
        }

        if (!isFood && itemData.consumable.healAmount && currentHp >= maxHp && !hasNonHealingEffect) {
            addLog("You are already at full health.");
            return;
        }

        if (isFood) {
            lastFoodEatenTime.current = Date.now();
        }

        if (itemData.consumable.givesCoins) {
            const { min, max } = itemData.consumable.givesCoins;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            modifyItem('coins', amount, true);
            addLog(`You open the pouch and find ${amount} coins.`);
        }

        if (itemData.consumable.healAmount) {
            if (currentHp < maxHp) {
                const healAmount = itemData.consumable.healAmount;
                setCurrentHp(prev => Math.min(maxHp, prev + healAmount));
            }
            if (isFood || currentHp < maxHp) {
                addLog(`You consume the ${itemData.name}.`);
            }
        }
        if (itemData.consumable.potionEffect) {
            if (itemId.startsWith('prayer_potion')) {
                const prayerSkill = skills.find(s => s.name === SkillName.Prayer);
                if (prayerSkill) {
                    const prayerLevel = prayerSkill.level;
                    const restoreAmount = Math.floor(prayerLevel * 0.20) + 10;

                    const actualRestored = Math.min(maxPrayer - currentPrayer, restoreAmount);
                    if (actualRestored > 0) {
                        addLog(`You drink some of the potion and restore ${Math.floor(actualRestored)} prayer points.`);
                    } else {
                        addLog(`You drink some of the potion, but your prayer is already full.`);
                    }
                    setCurrentPrayer(prev => Math.min(maxPrayer, prev + restoreAmount));
                }
            }
            const energyPotionMatch = itemId.match(/^energy_potion/);
            const super_energy_potionMatch = itemId.match(/^super_energy_potion/);
            const stamina_potionMatch = itemId.match(/^stamina_potion/);

            if (energyPotionMatch) {
                setRunEnergy(prev => Math.min(100, prev + 20));
                addLog('You drink some of the potion and restore 20 run energy.');
            } else if (super_energy_potionMatch) {
                setRunEnergy(prev => Math.min(100, prev + 40));
                addLog('You drink some of the potion and restore 40 run energy.');
            } else if (stamina_potionMatch) {
                setRunEnergy(prev => Math.min(100, prev + 40));
                addBuff({
                    type: 'stamina',
                    value: 0, // value is not used, effect is handled by hooks
                    duration: 420000, // 7 minutes
                });
                addLog('You drink some of the potion, restoring 40 run energy and boosting your stamina for 7 minutes.');
            } else if (itemId.startsWith('overload_potion_weak')) {
                const isOverloadActive = activeBuffs.some(b => b.type === 'overload');
                if (isOverloadActive) {
                    addLog('You are already overloaded.');
                    return; // Prevent stacking/re-applying
                }

                if (currentHp <= 20) {
                    addLog('You need more than 20 health to survive the effects of this potion.');
                    return;
                }

                addBuff({
                    type: 'overload',
                    value: 0,
                    duration: 300000, // 5 minutes
                });

                ['Attack', 'Strength', 'Defence', 'Ranged', 'Magic'].forEach(skill => {
                    const skillData = skills.find(s => s.name === skill as SkillName);
                    const baseLevel = skillData ? skillData.level : 1;
                    const boostValue = Math.floor(baseLevel * 0.10 + 3);
                    applyStatModifier(skill as SkillName, boostValue, baseLevel);
                });

                addLog('You drink the overload potion. You feel a sudden, violent surge of power!');
            } else if (itemId.startsWith('battlemasters_draught')) {
                const isAdrenalineActive = activeBuffs.some(b => b.type === 'adrenaline');
                if (isAdrenalineActive) {
                    addLog('You are already coursing with adrenaline.');
                    return;
                }

                addBuff({
                    type: 'adrenaline',
                    value: 0,
                    duration: 120000, // 2 minutes
                });

                addLog('You down the battlemaster\'s draught. Your heart hammers against your ribs as your perception of time slows down!');
            }
        }
        if (itemData.consumable.statModifiers) {
            itemData.consumable.statModifiers.forEach(modifier => {
                let boostValue = 0;
                const skillData = skills.find(s => s.name === modifier.skill);
                const baseLevel = skillData ? skillData.level : 1;

                if (typeof modifier.value === 'number') {
                    boostValue = modifier.value;
                } else if (typeof modifier.percent === 'number' && typeof modifier.base === 'number') {
                    // Floor the total boost value to ensure consistent behavior
                    boostValue = Math.floor(baseLevel * modifier.percent + modifier.base);
                }

                if (boostValue !== 0) {
                    applyStatModifier(modifier.skill, boostValue, baseLevel);
                }
            });
        }
        if (itemData.consumable.buffs) {
            itemData.consumable.buffs.forEach(buff => {
                addBuff(buff);
            });
        }
        if (itemData.consumable.restoresStats) {
            restoreNegativeStatModifiers(itemData.consumable.restoresStats.percent, itemData.consumable.restoresStats.base);
        }

        if (itemData.doseable) {
            const slot = inventory[inventoryIndex];
            if (slot) {
                const currentDoses = slot.doses ?? itemData.initialDoses ?? itemData.maxDoses ?? 4;
                const nextDoses = currentDoses - 1;

                if (nextDoses > 0) {
                    addLog(`You have ${nextDoses} doses of ${itemData.name} left.`);
                } else {
                    addLog(`You have finished the ${itemData.name}.`);
                }

                setInventory(prev => {
                    const newInv = [...prev];
                    const s = newInv[inventoryIndex];
                    if (!s) return prev;

                    if (nextDoses > 0) {
                        // Support for OSRS-style dose-suffixed items (e.g. potion_3 -> potion_2)
                        const baseId = itemData.id.replace(/_\d$/, '');
                        const nextDoseId = `${baseId}_${nextDoses}`;

                        if (ITEMS[nextDoseId]) {
                            newInv[inventoryIndex] = { ...s, itemId: nextDoseId as ItemId, doses: nextDoses };
                        } else {
                            newInv[inventoryIndex] = { ...s, doses: nextDoses };
                        }
                    } else {
                        if (itemData.emptyable) {
                            newInv[inventoryIndex] = { itemId: itemData.emptyable.emptyItemId, quantity: 1 };
                        } else {
                            newInv[inventoryIndex] = { ...s, doses: 0 };
                        }
                    }
                    return newInv;
                });
            }
            return;
        }

        // Logic for standard items and Multi-bite food
        setInventory(prev => {
            const newInv = [...prev];
            const itemSlot = newInv[inventoryIndex];

            if (!itemSlot) return prev;

            const nextBiteItem = MULTI_BITE_FOODS[itemId];

            if (nextBiteItem) {
                newInv[inventoryIndex] = { itemId: nextBiteItem as ItemId, quantity: 1 };
            } else if (itemData.stackable && itemSlot.quantity > 1) {
                newInv[inventoryIndex] = { ...itemSlot, quantity: itemSlot.quantity - 1 };
            } else {
                newInv[inventoryIndex] = null;
            }

            if (itemData.emptyable && !nextBiteItem) {
                const emptyItemId = itemData.emptyable.emptyItemId;
                const emptyItemData = ITEMS[emptyItemId];

                if (emptyItemData.stackable) {
                    const existingStackIndex = newInv.findIndex(i => i && i.itemId === emptyItemId);
                    if (existingStackIndex > -1) {
                        const existingStack = newInv[existingStackIndex]!;
                        newInv[existingStackIndex] = { ...existingStack, quantity: existingStack.quantity + 1 };
                    } else {
                        const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex > -1) {
                            newInv[emptySlotIndex] = { itemId: emptyItemId, quantity: 1 };
                        }
                    }
                } else {
                    const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                    if (emptySlotIndex > -1) {
                        newInv[emptySlotIndex] = { itemId: emptyItemId, quantity: 1 };
                    }
                }
            }
            return newInv;
        });

        if (itemData.emptyable && !MULTI_BITE_FOODS[itemId]) {
            // Side-effect logs for emptying items (handled after state set if needed, or by logic)
            const hasSpace = inventory.some(slot => slot === null) || (ITEMS[itemData.emptyable!.emptyItemId].stackable && inventory.some(i => i?.itemId === itemData.emptyable?.emptyItemId));
            if (!hasSpace) {
                addLog("You drop the empty container as your inventory is full.");
            }
        }

    }, [skills, currentHp, maxHp, setCurrentHp, setInventory, addLog, applyStatModifier, modifyItem, addXp, addBuff, inventory, isStunned, curePoison, currentPrayer, maxPrayer, setCurrentPrayer, setRunEnergy, playInstrumentNote, getContextTime]);

    const handleCurePoisonFromOrb = useCallback(() => {
        const antiPoisonPotions: ItemId[] = ['antipoison_potion_3' as ItemId, 'antipoison_potion_2' as ItemId, 'antipoison_potion_1' as ItemId, 'super_antipoison_3' as ItemId, 'super_antipoison_2' as ItemId, 'super_antipoison_1' as ItemId];
        let potionToUse: { itemId: ItemId, index: number } | null = null;

        for (const potionId of antiPoisonPotions) {
            const inventoryIndex = inventory.findIndex(slot => slot?.itemId === potionId);
            if (inventoryIndex !== -1) {
                potionToUse = { itemId: potionId, index: inventoryIndex };
                break;
            }
        }

        if (potionToUse) {
            handleConsume(potionToUse.itemId, potionToUse.index);
        } else {
            addLog("You do not have an anti-poison potion to cure yourself.");
        }
    }, [inventory, handleConsume, addLog]);

    const handleBuryBones = useCallback((itemId: ItemId, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.buryable) return;
        addXp(SkillName.Prayer, itemData.buryable.prayerXp);
        addLog("You bury the bones and say a prayer.");
        setInventory(prev => {
            const newInv = [...prev];
            newInv[inventoryIndex] = null;
            return newInv;
        });
    }, [addXp, setInventory, addLog]);

    const handleEmptyItem = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.emptyable) return;

        const emptyItemId = itemData.emptyable.emptyItemId;
        const emptyItemData = ITEMS[emptyItemId];
        if (!emptyItemData) return;

        setInventory(prev => {
            const newInv = [...prev];
            const currentSlot = newInv[inventoryIndex];
            if (!currentSlot || currentSlot.itemId !== itemId) return prev;

            newInv[inventoryIndex] = null;

            if (emptyItemData.stackable) {
                const existingStackIndex = newInv.findIndex(i => i && i.itemId === emptyItemId);
                if (existingStackIndex > -1) {
                    const existingStack = newInv[existingStackIndex]!;
                    newInv[existingStackIndex] = { ...existingStack, quantity: existingStack.quantity + 1 };
                } else {
                    newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
                }
            } else {
                newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
            }
            return newInv;
        });

    }, [setInventory]);

    const handleDivine = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.divining) return;

        const targetPoiId = itemData.divining.poiId;
        if (currentPoiId === targetPoiId) {
            addLog("The talisman is inert. You are standing at the altar's location.");
            return;
        }

        const currentPoi = POIS[currentPoiId];
        const targetPoi = POIS[targetPoiId];

        if (!currentPoi || !targetPoi) {
            addLog("The talisman seems confused by your location.");
            return;
        }

        if (currentPoi.connections.includes(targetPoiId)) {
            addLog("The talisman buzzes violently. The altar must be in an adjacent area!");
            return;
        }

        const currentRegion = REGIONS[currentPoi.regionId];
        let startX = currentPoi.x;
        let startY = currentPoi.y;

        if (currentRegion && currentRegion.type === 'city' && currentPoi.type === 'internal') {
            startX = currentRegion.x;
            startY = currentRegion.y;
        }

        const dx = targetPoi.x - startX;
        const dy = targetPoi.y - startY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        let direction = '';
        if (angle > -22.5 && angle <= 22.5) direction = 'East';
        else if (angle > 22.5 && angle <= 67.5) direction = 'South-East';
        else if (angle > 67.5 && angle <= 112.5) direction = 'South';
        else if (angle > 112.5 && angle <= 157.5) direction = 'South-West';
        else if (angle > 157.5 || angle <= -157.5) direction = 'West';
        else if (angle > -157.5 && angle <= -112.5) direction = 'North-West';
        else if (angle > -112.5 && angle <= -67.5) direction = 'North';
        else if (angle > -67.5 && angle <= -22.5) direction = 'North-East';

        addLog(`The talisman hums and pulls you towards the ${direction}.`);
    }, [currentPoiId, addLog]);

    const handleReadMap = useCallback((item: Item) => {
        if (!item.mappable) return;

        if (ui.combatQueue.length > 0) {
            addLog("You can't study a map while in combat!");
            return;
        }

        const currentRegionId = POIS[currentPoiId]?.regionId;
        if (currentRegionId === item.mappable.regionId) {
            setActiveDungeonMap({
                regionId: item.mappable.regionId,
                mapTitle: item.mappable.mapTitle,
            });
        } else {
            addLog("You can only read this map while inside the dungeon it depicts.");
        }
    }, [currentPoiId, setActiveDungeonMap, addLog, ui.combatQueue.length]);

    const handleUseItemOnActivity = useCallback((used: { item: InventorySlot; index: number }, activity: POIActivity) => {
        const { item: usedItem } = used;
        const usedItemData = ITEMS[usedItem.itemId];

        // --- Monolith Puzzle ---
        const MONOLITH_LOGS = ['logs', 'driftwood_logs', 'oak_logs', 'willow_logs', 'maple_logs', 'mahogany_logs', 'yew_logs', 'feywood_logs'];
        if (activity.type === 'npc' && activity.name === 'Empty Fire Pit' && currentPoiId === 'sp_ancient_monolith' && MONOLITH_LOGS.includes(usedItem.itemId)) {
            const fullPitId = (activity as any).id;
            if (!fullPitId || !fullPitId.startsWith('monolith_pit_')) return;
            // The activity ID includes the state now (e.g. monolith_pit_1_empty), we need the base ID
            const pitId = fullPitId.replace('_empty', '');

            if (!hasItems([{ itemId: 'tinderbox', quantity: 1 }])) {
                addLog("You need a tinderbox to light a fire.");
                return;
            }

            const currentFires = worldState.monolithFires || {};
            const existingFire = currentFires[pitId];
            if (existingFire && existingFire.expiresAt > Date.now()) {
                addLog("This fire pit is already burning.");
                return;
            }

            // Grant Firemaking XP
            const fmRecipe = FIREMAKING_RECIPES.find(r => r.logId === usedItem.itemId);
            if (fmRecipe) {
                addXp(SkillName.Firemaking, fmRecipe.xp);
            }

            modifyItem(usedItem.itemId as ItemId, -1);
            setWorldState(ws => ({
                ...ws,
                monolithFires: {
                    ...(ws.monolithFires || {}),
                    [pitId]: {
                        logType: usedItem.itemId,
                        expiresAt: Date.now() + 120000 // 2 minutes
                    }
                }
            }));
            addLog(`You light a small fire in the pit with the ${usedItemData.name}.`);
            return;
        }

        if (activity.type === 'cooking_range' && usedItem.itemId === 'rendering_kit') {
            if (activity.type === 'cooking_range') {
                const now = Date.now();
                const cooldown = rangeCooldowns[currentPoiId];
                if (cooldown && now < cooldown) {
                    const timeLeft = Math.ceil((cooldown - now) / 1000);
                    addLog(`The range has been recently cleaned. More grease needs to settle (Wait ${timeLeft} seconds).`);
                    return;
                }

                // Fill the kit
                setInventory(prev => {
                    const newInv = [...prev];
                    newInv[used.index] = {
                        ...usedItem,
                        filled: 'refined_grease',
                        doses: 4
                    };
                    return newInv;
                });

                // Set cooldown for range
                setRangeCooldowns(prev => ({
                    ...prev,
                    [currentPoiId]: now + 600000
                }));

                addLog("You use the rendering kit to scrape some grease from the range. The kit is now full of refined grease (4 doses).");
                addXp(SkillName.Cooking, 10);
                return;
            }

            /* FIX: Pass 'rendering' context to resolve comparability error */
            openCraftingView({ type: 'rendering' });
            return;
        }

        if (activity.type === 'sand_pit' && usedItem.itemId === 'bucket') {
            setIsResting(false);
            modifyItem('bucket', -1, true);
            modifyItem('bucket_of_sand', 1, false, { bypassAutoBank: true });
            addLog("You scoop some fine sand into your bucket.");
            return;
        }

        const getItemCount = (itemId: string): number => {
            if (ITEMS[itemId]?.stackable || (inventory.find(slot => slot?.itemId === itemId)?.noted)) {
                return inventory.find(slot => slot?.itemId === itemId)?.quantity ?? 0;
            }
            return inventory.filter(slot => slot?.itemId === itemId).length;
        };

        if (activity.type === 'npc' && activity.name === 'Altar') {
            if (usedItem.itemId === 'holy_paste') {
                if (!hasItems([{ itemId: 'tinderbox', quantity: 1 }])) {
                    addLog("You need a tinderbox to light the offering.");
                    return;
                }
                const pasteCount = getItemCount('holy_paste');
                if (pasteCount === 0) {
                    addLog("You don't have any holy paste.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    const actualQuantity = Math.min(quantity, pasteCount);
                    if (actualQuantity > 0) {
                        ui.setActiveCraftingAction({
                            recipeId: 'holy_paste',
                            recipeType: 'offering',
                            totalQuantity: Math.ceil(actualQuantity / 25), // Batches of 5
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 2400, // 2.4s per batch
                            payload: { totalItems: actualQuantity }
                        });
                    }
                };

                if (pasteCount === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: 'Offer Holy Paste',
                        max: pasteCount,
                        onConfirm
                    });
                }
                return;
            }

            const boneMap: Record<string, { consecratedId: string, prayerCost: number, xp: number }> = {
                'bones': { consecratedId: 'consecrated_bones', prayerCost: 1, xp: 3 },
                'big_bones': { consecratedId: 'consecrated_big_bones', prayerCost: 2, xp: 8 },
                'dragon_bones': { consecratedId: 'consecrated_dragon_bones', prayerCost: 5, xp: 50 },
                'frost_dragon_bones': { consecratedId: 'consecrated_frost_dragon_bones', prayerCost: 10, xp: 100 },
            };

            const boneInfo = boneMap[usedItem.itemId];

            if (boneInfo) {
                if (currentPrayer < boneInfo.prayerCost) {
                    addLog("You don't have enough prayer points to do that.");
                    return;
                }

                const boneCount = getItemCount(usedItem.itemId);
                const maxConsecrate = Math.min(
                    boneCount,
                    Math.floor(currentPrayer / boneInfo.prayerCost)
                );

                if (maxConsecrate === 0) {
                    addLog("You don't have enough bones or prayer points.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    if (quantity <= 0) return;
                    const actualQuantity = Math.min(quantity, maxConsecrate);

                    if (actualQuantity > 0) {
                        ui.setActiveCraftingAction({
                            recipeId: usedItem.itemId,
                            recipeType: 'consecration',
                            totalQuantity: actualQuantity,
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 1800,
                            payload: { prayerCost: boneInfo.prayerCost }
                        });
                    }
                };

                if (maxConsecrate === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Consecrate ${ITEMS[usedItem.itemId].name}`,
                        max: maxConsecrate,
                        onConfirm
                    });
                }
                return;
            }
        }

        if (activity.type === 'npc' && activity.name === 'Reliquary Grinder') {
            const grindableMap: Record<string, { dust: string }> = {
                'consecrated_bones': { dust: 'sacred_dust' },
                'consecrated_big_bones': { dust: 'sacred_dust' },
                'consecrated_dragon_bones': { dust: 'sacred_dust' },
                'consecrated_frost_dragon_bones': { dust: 'sacred_dust' },
            };

            const boneInfo = grindableMap[usedItem.itemId];
            if (boneInfo) {
                const boneCount = getItemCount(usedItem.itemId);
                if (boneCount === 0) {
                    addLog("You don't have any of those to grind.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    if (quantity <= 0) return;
                    const actualQuantity = Math.min(quantity, boneCount);

                    if (actualQuantity > 0) {
                        ui.setActiveCraftingAction({
                            recipeId: usedItem.itemId,
                            recipeType: 'grinding',
                            totalQuantity: actualQuantity,
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 1800,
                        });
                    }
                };

                if (boneCount === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Grind ${ITEMS[usedItem.itemId].name}`,
                        max: boneCount,
                        onConfirm
                    });
                }
                return;
            }
        }

        if (activity.type === 'cooking_range' || activity.type === 'bonfire') {
            const recipe = COOKING_RECIPES.find(r => r.ingredients.length === 1 && r.ingredients[0].itemId === usedItem.itemId);
            if (recipe) {
                const maxCookable = inventory.filter(s => s?.itemId === usedItem.itemId).length;
                if (maxCookable > 0) {
                    setMakeXPrompt({
                        title: `Cook ${ITEMS[recipe.itemId].name}`,
                        max: maxCookable,
                        onConfirm: (quantity) => crafting.handleCooking(recipe.itemId, quantity)
                    });
                } else {
                    addLog("You don't have any more to cook.");
                }
                return;
            }
        }

        if (activity.type === 'sand_pit') {
            if (usedItem.itemId === 'bucket') {
                modifyItem('bucket', -1, true);
                modifyItem('bucket_of_sand', 1, false, { bypassAutoBank: true });
                addLog("You shove the bucket into the sand and scoop some out.");
            } else {
                addLog("You need an empty bucket to collect sand.");
            }
            return;
        }

        if (activity.type === 'furnace') {
            const smeltRecipe = SMELTING_RECIPES.find(r => r.ingredients.some(i => i.itemId === usedItem.itemId));
            const miscRecipe = MISC_FURNACE_RECIPES.find(r => r.ingredients.some(i => i.itemId === usedItem.itemId));

            if (smeltRecipe) {
                const maxSmelt = Math.min(
                    ...smeltRecipe.ingredients.map(ing => {
                        const count = inventory.reduce((total, slot) => slot?.itemId === ing.itemId ? total + slot.quantity : total, 0);
                        return Math.floor(count / ing.quantity);
                    })
                );
                if (maxSmelt > 0) {
                    setMakeXPrompt({
                        title: `Smelt ${ITEMS[smeltRecipe.barType].name}`,
                        max: maxSmelt,
                        onConfirm: (quantity) => crafting.handleSmelting(smeltRecipe.barType as BarType, quantity)
                    });
                } else {
                    addLog("You don't have the required ingredients.");
                }
                return;
            } else if (miscRecipe) {
                const maxMisc = Math.min(
                    ...miscRecipe.ingredients.map(ing => {
                        const count = inventory.reduce((total, slot) => slot?.itemId === ing.itemId ? total + slot.quantity : total, 0);
                        return Math.floor(count / ing.quantity);
                    })
                );
                if (maxMisc > 0) {
                    setMakeXPrompt({
                        title: `Smelt ${ITEMS[miscRecipe.itemId].name}`,
                        max: maxMisc,
                        onConfirm: (quantity) => crafting.handleJewelryCrafting(miscRecipe.itemId, quantity)
                    });
                } else {
                    addLog("You don't have the required ingredients.");
                }
                return;
            }
        }

        if (activity.type === 'bonfire' && usedItemData && FIREMAKING_RECIPES.some(r => r.logId === usedItem.itemId)) {
            const logCount = inventory.reduce((total, slot) => slot?.itemId === usedItem.itemId ? total + slot.quantity : total, 0);
            crafting.handleStokeBonfire(usedItem.itemId, (activity as BonfireActivity).uniqueId, logCount);
            return;
        }

        addLog("Nothing interesting happens.");
    }, [inventory, addLog, setMakeXPrompt, crafting, modifyItem, currentPrayer, setCurrentPrayer, addXp, ui, hasItems, openCraftingView, rangeCooldowns, setRangeCooldowns, currentPoiId]);

    const handleUseItemOn = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        try {
            const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;
            const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.currentLevel ?? 1;
            const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
            const usedId = used.item.itemId;
            const targetId = target.item.itemId;
            const usedItemData = ITEMS[usedId];
            const targetItem = ITEMS[targetId];
            const usedSlot = used.item;
            const targetSlot = target.item;
            const usedIndex = used.index;
            const targetIndex = target.index;

            const isXMixFlask = (usedId === 'x_mix' && FIRE_FLASK_DATA[targetId]) || (targetId === 'x_mix' && FIRE_FLASK_DATA[usedId]);
            if (isXMixFlask) {
                const flaskId = FIRE_FLASK_DATA[usedId] ? usedId : targetId;
                const flaskItemData = ITEMS[flaskId];

                const xMixCount = inventory.reduce((total, slot) => slot && slot.itemId === 'x_mix' ? total + slot.quantity : total, 0);
                const flaskCount = inventory.reduce((total, slot) => slot && slot.itemId === flaskId && !slot.statsOverride?.isXFlask ? total + slot.quantity : total, 0);
                const maxBatches = Math.min(xMixCount, flaskCount);

                const onConfirm = (quantity: number) => {
                    const actualQuantity = Math.min(quantity, maxBatches);
                    if (actualQuantity > 0) {
                        setActiveCraftingAction({
                            recipeId: flaskId,
                            recipeType: 'flask-mixing',
                            totalQuantity: actualQuantity,
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 200
                        });
                    }
                };

                if (maxBatches === 1) {
                    onConfirm(1);
                } else if (maxBatches > 1) {
                    setMakeXPrompt({
                        title: `Mix ${flaskItemData.name} (X)`,
                        max: maxBatches,
                        onConfirm
                    });
                } else {
                    addLog("You don't have enough ingredients to mix more flasks.");
                }
                return;
            }

            const isFirePotLighting = (usedId === 'tinderbox' && targetId === 'fire_pot') || (targetId === 'tinderbox' && usedId === 'fire_pot');
            if (isFirePotLighting) {
                const firemakingLevel = skills.find(s => s.name === SkillName.Firemaking)?.currentLevel ?? 1;
                if (firemakingLevel < 1) { addLog("You need a Firemaking level of 1 to light this."); return; }

                // Check for uniqueness
                const hasLitPot = inventory.some(s => s?.itemId === 'fire_pot_lit') || equipment.ammo?.itemId === 'fire_pot_lit';
                if (hasLitPot) {
                    addLog("You already have a lit fire pot. You cannot manage another one.");
                    return;
                }

                modifyItem('fire_pot', -1, true);

                const FIRE_POT_DURATION = 3600000; // 1 hour in ms
                modifyItem('fire_pot_lit', 1, false, { expiresAt: Date.now() + FIRE_POT_DURATION, bypassAutoBank: true });

                addLog("You light the fire pot. It will burn for one hour.");
                return;
            }

            const fatIds = new Set(['animal_fat', 'tallow', 'rich_animal_fat', 'beast_fat', 'titan_fat', 'dragon_fat']);
            if ((usedId === 'rendering_kit' && fatIds.has(targetId)) || (targetId === 'rendering_kit' && fatIds.has(usedId))) {
                addLog("You need a heat source to render fat. Try using this on a cooking range or a bonfire.");
                return;
            }

            if ((targetId === 'molten_glass' && usedId === 'glassblowing_apparatus') || (usedId === 'molten_glass' && targetId === 'glassblowing_apparatus')) {
                /* FIX: Pass 'glassblowing' context to resolve comparability error */
                openCraftingView({ type: 'glassblowing' });
                return;
            }

            // Quest: The Sorcerer's Trial - Fragment and Tablet interactions
            const isTablet = usedId === 'cracked_runic_tablet' || targetId === 'cracked_runic_tablet';
            const isIntent = usedId === 'fragment_of_intent' || targetId === 'fragment_of_intent';
            const isShape = usedId === 'fragment_of_shape' || targetId === 'fragment_of_shape';
            if (isTablet && (isIntent || isShape)) {
                const hasIntent = !!inventory.find(s => s?.itemId === 'fragment_of_intent');
                const hasShape = !!inventory.find(s => s?.itemId === 'fragment_of_shape');

                if (hasIntent && hasShape) {
                    addLog("The runic tablet dances with the fragments, but they do not meld. Something is missing. Possibly a magic touch from someone?");
                } else {
                    addLog("The Runic Tablet wiggles slightly as the fragment is placed upon it. It needs another fragment to be complete.");
                }
                return;
            }
            if (isIntent && isShape) {
                addLog("The two fragments hum with energy as they are brought together, but they do not meld. Something is missing.");
                return;
            }

            if ((usedId === 'rendering_kit' && usedSlot.filled && targetId === 'throwing_flask_fused') || (targetId === 'rendering_kit' && targetSlot.filled && usedId === 'throwing_flask_fused')) {
                const kitSlot = (usedId === 'rendering_kit') ? usedSlot : targetSlot;
                const flaskSlot = (usedId === 'throwing_flask_fused') ? usedSlot : targetSlot;
                const kitIndex = (usedId === 'rendering_kit') ? usedIndex : targetIndex;

                const recipe = RENDERING_RECIPES.find(r => r.fatId === kitSlot.filled);
                if (!recipe) { addLog("The oil in your kit seems unusable."); return; }

                const doses = kitSlot.doses ?? 1;
                const flasks = flaskSlot.quantity;
                const fillAmount = Math.min(doses, flasks);

                modifyItem('throwing_flask_fused' as ItemId, -fillAmount, true);
                modifyItem(recipe.flaskId as ItemId, fillAmount, false, { bypassAutoBank: true });

                const newDoses = doses - fillAmount;
                if (newDoses > 0) {
                    setInventory(prev => {
                        const newInv = [...prev];
                        newInv[kitIndex] = { ...kitSlot, doses: newDoses };
                        return newInv;
                    });
                } else {
                    setInventory(prev => {
                        const newInv = [...prev];
                        newInv[kitIndex] = { itemId: 'rendering_kit', quantity: 1 };
                        return newInv;
                    });
                }

                addLog(`You fill ${fillAmount > 1 ? fillAmount + ' flasks' : 'the flask'} with the flammable oil.`);
                return;
            }

            if ((usedId === 'knife' && targetId === 'ball_of_wool') || (targetId === 'knife' && usedId === 'ball_of_wool')) {
                modifyItem('ball_of_wool' as ItemId, -1, true);
                modifyItem('wool_string' as ItemId, 10, false, { bypassAutoBank: true });
                addXp(SkillName.Fletching, 2);
                addLog("You carefully cut the wool into 10 strings.");
                return;
            }

            if ((usedId === 'wool_string' && targetId === 'throwing_flask') || (targetId === 'wool_string' && usedId === 'throwing_flask')) {
                modifyItem('wool_string' as ItemId, -1, true);
                modifyItem('throwing_flask' as ItemId, -1, true);
                modifyItem('throwing_flask_fused' as ItemId, 1, false, { bypassAutoBank: true });
                addXp(SkillName.Fletching, 1);
                addLog("You attach the string to the flask, creating a fuse.");
                return;
            }

            const isStaminaCrafting = (usedId === 'agility_paste' && targetId === 'super_energy_potion_3') || (targetId === 'agility_paste' && usedId === 'super_energy_potion_3');
            if (isStaminaCrafting) {
                if (herbloreLevel < 51) {
                    addLog("You need a Herblore level of 51 to make this potion.");
                    return;
                }
                modifyItem('agility_paste' as ItemId, -1, true);
                modifyItem('super_energy_potion_3' as ItemId, -1, true);
                modifyItem('stamina_potion_4' as ItemId, 1, false, { bypassAutoBank: true });
                addXp(SkillName.Herblore, 115);
                addLog("You mix the agility paste into the super energy potion to create a stamina potion.");
                return;
            }

            // --- Potion Decanting ---
            if (usedItemData.doseable && targetItem.doseable) {
                const usedBaseId = usedId.replace(/_\d$/, '');
                const targetBaseId = targetId.replace(/_\d$/, '');

                if (usedBaseId === targetBaseId) {
                    const usedDoses = usedSlot.doses ?? usedItemData.initialDoses ?? 3;
                    const targetDoses = targetSlot.doses ?? targetItem.initialDoses ?? 3;
                    const maxDoses = targetItem.maxDoses ?? 4;

                    if (targetDoses >= maxDoses) {
                        addLog("That potion is already full.");
                        return;
                    }

                    const spaceInTarget = maxDoses - targetDoses;
                    const amountToTransfer = Math.min(usedDoses, spaceInTarget);

                    if (amountToTransfer <= 0) return;

                    const newTargetDoses = targetDoses + amountToTransfer;
                    const newUsedDoses = usedDoses - amountToTransfer;

                    const getDoseId = (baseId: string, doses: number) => {
                        const suffixed = `${baseId}_${doses}`;
                        if (ITEMS[suffixed]) return suffixed;
                        return baseId;
                    };

                    setInventory(prev => {
                        const newInv = [...prev];

                        // Update Target
                        const newTargetId = getDoseId(targetBaseId, newTargetDoses);
                        newInv[targetIndex] = { ...targetSlot, itemId: newTargetId as ItemId, doses: newTargetDoses };

                        // Update Used
                        if (newUsedDoses > 0) {
                            const newUsedId = getDoseId(usedBaseId, newUsedDoses);
                            newInv[usedIndex] = { ...usedSlot, itemId: newUsedId as ItemId, doses: newUsedDoses };
                        } else {
                            if (usedItemData.emptyable) {
                                newInv[usedIndex] = { itemId: usedItemData.emptyable.emptyItemId, quantity: 1 };
                            } else {
                                newInv[usedIndex] = null;
                            }
                        }
                        return newInv;
                    });

                    addLog(`You combine the potions.`);
                    return;
                }
            }

            const validMeats: Record<string, number> = {
                'cooked_crab_meat': 5,
                'cooked_herring': 5,
                'cooked_boar_meat': 5,
                'scrambled_eggs': 4,
                'cooked_shrimp': 3,
                'cooked_sardine': 3,
                'cooked_chicken': 3,
                'cooked_beef': 3,
                'rat_kebab_cooked': 3,
                'cooked_anchovy': 3,
            };

            const isSandwichMaking = (usedId === 'bread' && validMeats[targetId]) || (targetId === 'bread' && validMeats[usedId]);
            if (isSandwichMaking) {
                const meatSlot = usedId === 'bread' ? target : used;
                const meatHeal = validMeats[meatSlot.item.itemId];

                modifyItem('bread' as ItemId, -1, true);
                modifyItem(meatSlot.item.itemId as ItemId, -1, true);

                modifyItem('sandwich' as ItemId, 1, false, { bypassAutoBank: true });

                const xpGained = meatHeal * 5;
                addXp(SkillName.Cooking, xpGained);

                addLog(`You make a sandwich and gain ${xpGained} Cooking XP.`);
                return;
            }


            const poisons: Record<string, { id: string; suffix: string; level: number; damage: number }> = {
                'weapon_poison_weak': { id: 'weapon_poison_weak', suffix: '(p)', level: 1, damage: 2 },
                'weapon_poison_strong': { id: 'weapon_poison_strong', suffix: '(p+)', level: 2, damage: 4 },
                'weapon_poison_super': { id: 'weapon_poison_super', suffix: '(p++)', level: 3, damage: 6 }
            };
            const compatibleWeaponTypes = [WeaponType.Dagger, WeaponType.Spear, WeaponType.Arrow, WeaponType.Bolt];

            const poisonInfo = poisons[usedId] || poisons[targetId];
            const weaponSlot = poisons[usedId] ? target : (poisons[targetId] ? used : null);

            const getItemCount = (itemId: string): number => {
                return inventory.reduce((total, slot) => {
                    return slot && slot.itemId === itemId ? total + slot.quantity : total;
                }, 0);
            };

            const isPasteMaking = (usedId === 'anointing_oil' && targetId === 'sacred_dust') || (targetId === 'anointing_oil' && usedId === 'sacred_dust');
            if (isPasteMaking) {
                const oilCount = getItemCount('anointing_oil');
                const dustCount = getItemCount('sacred_dust');
                const maxBatches = Math.min(oilCount, Math.floor(dustCount / 5));
                if (maxBatches < 1) {
                    addLog("You need at least 1 Anointing Oil and 5 Sacred Dust.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    if (isBusy) { addLog("You are busy."); return; }
                    setActiveCraftingAction({
                        recipeId: 'holy_paste',
                        recipeType: 'paste-making',
                        totalQuantity: quantity,
                        completedQuantity: 0,
                        successfulQuantity: 0,
                        startTime: Date.now(),
                        duration: 200
                    });
                };

                if (maxBatches === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: 'Create Holy Paste',
                        max: maxBatches,
                        onConfirm
                    });
                }
                return;
            }

            // --- COOKING PREP LOGIC ---

            // 1. Cake Making (Flour + Cake Tin)
            const isCakePrep = (usedId === 'flour' && targetId === 'cake_tin') || (targetId === 'flour' && usedId === 'cake_tin');
            if (isCakePrep) {
                if (!hasItems([{ itemId: 'eggs', quantity: 1 }, { itemId: 'bucket_of_milk', quantity: 1 }])) {
                    addLog("You need an egg and a bucket of milk to make a cake.");
                    return;
                }

                // Remove ingredients
                modifyItem('flour' as ItemId, -1, true);
                modifyItem('cake_tin' as ItemId, -1, true);
                modifyItem('eggs' as ItemId, -1, true);
                modifyItem('bucket_of_milk' as ItemId, -1, true); // Removes milk
                modifyItem('bucket' as ItemId, 1, false, { bypassAutoBank: true }); // Gives empty bucket back

                modifyItem('uncooked_cake' as ItemId, 1, false, { bypassAutoBank: true });
                addLog("You mix the ingredients into the cake tin.");
                return;
            }

            // 2. Pie Shell (Pie Dough + Pie Dish)
            const isPieShell = (usedId === 'pie_dough' && targetId === 'pie_dish') || (targetId === 'pie_dough' && usedId === 'pie_dish');
            if (isPieShell) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('pie_shell' as ItemId, 1, false, { bypassAutoBank: true });
                addLog("You press the dough into the dish to make a pie shell.");
                return;
            }

            // 3. Uncooked Pie Filling (Fruit/Meat/Fish + Pie Shell)
            const pieFillings: Record<string, string> = {
                'red_berries': 'uncooked_berry_pie',
                'apple': 'uncooked_apple_pie',
                'cooked_meat': 'uncooked_meat_pie', // Generic cooked meat if available
                'cooked_beef': 'uncooked_meat_pie',
                'cooked_chicken': 'uncooked_meat_pie',
                'cooked_trout': 'uncooked_fish_pie', // Example fish
                'cooked_salmon': 'uncooked_fish_pie',
                'cooked_tuna': 'uncooked_fish_pie'
            };

            const isPieShellPresent = usedId === 'pie_shell' || targetId === 'pie_shell';

            if (isPieShellPresent) {
                const fillingId = usedId === 'pie_shell' ? targetId : usedId;
                const shellSlot = usedId === 'pie_shell' ? used : target;
                const fillingSlot = usedId === 'pie_shell' ? target : used;

                if (pieFillings[fillingId]) {
                    const resultPieId = pieFillings[fillingId];

                    setInventory(prevInv => {
                        const newInv = [...prevInv];
                        newInv[shellSlot.index] = null;
                        // Decrease filling stack
                        if (fillingSlot.item.quantity > 1) {
                            newInv[fillingSlot.index] = { ...fillingSlot.item, quantity: fillingSlot.item.quantity - 1 };
                        } else {
                            newInv[fillingSlot.index] = null;
                        }
                        return newInv;
                    });
                    modifyItem(resultPieId as ItemId, 1, false, { bypassAutoBank: true });
                    addLog(`You fill the pie shell with ${ITEMS[fillingId].name}.`);
                    return;
                }
            }

            // 4. Incomplete Pizza (Pizza Base + Tomato)
            const isPizzaBase = (usedId === 'pizza_base' && targetId === 'tomato') || (targetId === 'pizza_base' && usedId === 'tomato');
            if (isPizzaBase) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('incomplete_pizza' as ItemId, 1, false, { bypassAutoBank: true }); // Assuming this ID exists or falls back
                addLog("You add tomato to the pizza base.");
                return;
            }

            // 5. Uncooked Pizza (Incomplete Pizza + Cheese)
            const isIncompletePizza = (usedId === 'incomplete_pizza' && targetId === 'cheese') || (targetId === 'incomplete_pizza' && usedId === 'cheese');
            if (isIncompletePizza) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('uncooked_pizza' as ItemId, 1, false, { bypassAutoBank: true });
                addLog("You add cheese to the pizza.");
                return;
            }

            // 6. Pizza Toppings (Cooked Pizza + Topping)
            const pizzaToppings: Record<string, { result: string, level: number, xp: number }> = {
                'cooked_meat': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_beef': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_boar': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_chicken': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_anchovy': { result: 'anchovy_pizza', level: 55, xp: 39 },
                'pineapple_chunks': { result: 'pineapple_pizza', level: 65, xp: 52 }
            };

            const toppingId = usedId === 'plain_pizza' ? targetId : usedId;
            const baseSlot = usedId === 'plain_pizza' ? used : target;
            const toppingSlot = usedId === 'plain_pizza' ? target : used;

            if ((usedId === 'plain_pizza' || targetId === 'plain_pizza') && pizzaToppings[toppingId]) {
                const recipe = pizzaToppings[toppingId];
                if (cookingLevel < recipe.level) {
                    addLog(`You need a Cooking level of ${recipe.level} to add this topping.`);
                    return;
                }

                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[baseSlot.index] = null;
                    if (toppingSlot.item.quantity > 1) {
                        newInv[toppingSlot.index] = { ...toppingSlot.item, quantity: toppingSlot.item.quantity - 1 };
                    } else {
                        newInv[toppingSlot.index] = null;
                    }
                    return newInv;
                });

                modifyItem(recipe.result as ItemId, 1, false, { bypassAutoBank: true });
                addXp(SkillName.Cooking, recipe.xp);
                addLog(`You add ${ITEMS[toppingId].name} to the pizza.`);
                return;
            }

            // --- END COOKING PREP ---


            if (poisonInfo && weaponSlot) {
                const weaponData = ITEMS[weaponSlot.item.itemId];
                if (weaponData?.equipment?.weaponType && compatibleWeaponTypes.includes(weaponData.equipment.weaponType)) {

                    const baseItemName = weaponData.name;
                    const currentStats = { ...weaponData.equipment, ...weaponSlot.item.statsOverride };
                    const currentPoisonLevel = currentStats.poisoned ? (currentStats.poisoned.damage === 6 ? 3 : currentStats.poisoned.damage === 4 ? 2 : 1) : 0;

                    if (poisonInfo.level <= currentPoisonLevel) {
                        addLog("This is already coated with an equal or stronger poison.");
                        return;
                    }

                    const newNameOverride = `${baseItemName} ${poisonInfo.suffix}`;
                    const newStatsOverride = {
                        ...weaponSlot.item.statsOverride,
                        poisoned: {
                            chance: 0.25,
                            damage: poisonInfo.damage
                        }
                    };

                    const poisonSlot = poisons[usedId] ? used : target;
                    const isAmmo = weaponData.equipment.weaponType === WeaponType.Arrow || weaponData.equipment.weaponType === WeaponType.Bolt;

                    if (isAmmo) {
                        if (weaponSlot.item.quantity < 15) {
                            addLog("You need at least 15 of that ammo to poison them.");
                            return;
                        }
                        modifyItem(weaponSlot.item.itemId as ItemId, -15, true, { noted: weaponSlot.item.noted, nameOverride: weaponSlot.item.nameOverride, statsOverride: weaponSlot.item.statsOverride });

                        setInventory(prev => {
                            const newInv = [...prev];
                            const existingPoisonedStackIndex = newInv.findIndex(slot =>
                                slot &&
                                slot.itemId === weaponSlot.item.itemId &&
                                slot.nameOverride === newNameOverride &&
                                !!slot.noted === !!weaponSlot.item.noted
                            );

                            if (existingPoisonedStackIndex > -1) {
                                newInv[existingPoisonedStackIndex]!.quantity += 15;
                                addLog(`You add 15 more poisoned ${weaponData.name}s to the stack.`);
                                return newInv;
                            }

                            const emptySlotIndex = newInv.findIndex(slot => slot === null);
                            if (emptySlotIndex === -1) {
                                addLog("You don't have enough inventory space to create a new stack of poisoned ammo.");
                                modifyItem(weaponSlot.item.itemId as ItemId, 15, true, { noted: weaponSlot.item.noted });
                                return prev;
                            }
                            newInv[emptySlotIndex] = {
                                itemId: weaponSlot.item.itemId,
                                quantity: 15,
                                noted: weaponSlot.item.noted,
                                nameOverride: newNameOverride,
                                statsOverride: newStatsOverride
                            };
                            addLog(`You poison 15 ${weaponData.name}s.`);
                            return newInv;
                        });
                    } else {
                        setInventory(prev => {
                            const newInv = [...prev];
                            const weaponToUpdate = newInv[weaponSlot.index];
                            if (weaponToUpdate) {
                                newInv[weaponSlot.index] = {
                                    ...weaponToUpdate,
                                    nameOverride: newNameOverride,
                                    statsOverride: newStatsOverride
                                };
                                addLog(`You apply a coat of poison to your ${baseItemName}.`);
                            }
                            return newInv;
                        });
                    }

                    modifyItem(poisonInfo.id as ItemId, -1, true);
                    modifyItem('vial' as ItemId, 1, false, { bypassAutoBank: true });

                    return;
                }
            }

            const isLeatherworking = (usedId === 'needle' && (targetId === 'leather' || targetId === 'boar_leather' || targetId === 'wolf_leather' || targetId === 'bear_leather' || targetId.endsWith('_hide_leather'))) ||
                (targetId === 'needle' && (usedId === 'leather' || usedId === 'boar_leather' || usedId === 'wolf_leather' || usedId === 'bear_leather' || usedId.endsWith('_hide_leather')));

            if (isLeatherworking) {
                openCraftingView({ type: 'leatherworking' });
                return;
            }

            if ((usedId === 'knife' && FLETCHING_RECIPES.carving[targetId]) || (targetId === 'knife' && FLETCHING_RECIPES.carving[usedId]) || (usedId === 'knife' && FLETCHING_RECIPES.stocks.some(r => r.logId === targetId)) || (targetId === 'knife' && FLETCHING_RECIPES.stocks.some(r => r.logId === usedId))) {
                const logId = usedId === 'knife' ? targetId : usedId;
                openCraftingView({ type: 'fletching', logId: logId });
                return;
            }

            const isGemCutting = (usedId === 'chisel' && GEM_CUTTING_RECIPES.some(r => r.uncutId === targetId)) || (targetId === 'chisel' && GEM_CUTTING_RECIPES.some(r => r.uncutId === usedId));
            if (isGemCutting) {
                openCraftingView({ type: 'gem_cutting' });
                return;
            }

            const isDoughMaking = (usedId === 'bucket_of_water' && targetId === 'flour') || (targetId === 'bucket_of_water' && usedId === 'flour');
            if (isDoughMaking) {
                props.openCraftingView({ type: 'dough_making' });
                return;
            }

            const isFiremaking = (usedId === 'tinderbox' && FIREMAKING_RECIPES.some(r => r.logId === targetId)) ||
                (targetId === 'tinderbox' && FIREMAKING_RECIPES.some(r => r.logId === usedId));
            if (isFiremaking) {
                const logId = usedId === 'tinderbox' ? targetId : usedId;
                const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
                if (!recipe) return;

                const firemakingLevel = skills.find(s => s.name === SkillName.Firemaking)?.currentLevel ?? 1;
                if (firemakingLevel < recipe.level) {
                    addLog(`You need a Firemaking level of ${recipe.level} to light these logs.`);
                    return;
                }
                if (!hasItems([{ itemId: logId, quantity: 1 }])) {
                    addLog(`You need some ${ITEMS[logId].name} to light a fire.`);
                    return;
                }

                addLog(`You attempt to light the ${ITEMS[logId].name}...`);
                setActiveCraftingAction({
                    recipeId: logId,
                    recipeType: 'firemaking-light',
                    totalQuantity: 1,
                    completedQuantity: 0,
                    successfulQuantity: 0,
                    startTime: Date.now(),
                    duration: 2400,
                });
                return;
            }

            const isTiaraCrafting = (usedId === 'silver_tiara' && targetItem.divining) || (targetId === 'silver_tiara' && usedItemData.divining);
            if (isTiaraCrafting) {
                const talisman = usedItemData.divining ? usedItemData : targetItem;
                const altarPoiId = talisman.divining!.poiId;
                const altarPoi = POIS[altarPoiId];
                const altarActivity = (altarPoi?.activities ?? []).find(a => a.type === 'runecrafting_altar') as Extract<POIActivity, { type: 'runecrafting_altar' }> | undefined;

                if (currentPoiId !== altarPoiId || !altarActivity) {
                    addLog("You can only infuse a tiara at its corresponding runecrafting altar.");
                    return;
                }

                const runeId = altarActivity.runeId;
                const tiaraItem = Object.values(ITEMS).find(i => i.equipment?.slot === EquipmentSlot.Head && i.equipment.runeType === runeId);

                if (!tiaraItem) {
                    addLog("Something went wrong, could not find the right tiara to create.");
                    return;
                }

                if (hasItems([{ itemId: 'silver_tiara', quantity: 1 }, { itemId: talisman.id, quantity: 1 }])) {
                    modifyItem('silver_tiara' as ItemId, -1, true);
                    modifyItem(talisman.id as ItemId, -1, true);
                    modifyItem(tiaraItem.id as ItemId, 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Runecrafting, 50);
                    addLog(`You infuse the silver tiara with the power of the altar, creating a ${tiaraItem.name}.`);
                }
                return;
            }

            if (used.item.itemId === target.item.itemId && usedItemData.doseable) {
                const maxDoses = usedItemData.maxDoses ?? 4;
                const usedDoses = used.item.doses ?? usedItemData.initialDoses ?? 1;
                const targetDoses = target.item.doses ?? usedItemData.initialDoses ?? 1;

                if (targetDoses >= maxDoses) {
                    addLog("This potion is already full.");
                    return;
                }

                const totalDoses = usedDoses + targetDoses;
                const newTargetDoses = Math.min(maxDoses, totalDoses);
                const newUsedDoses = totalDoses - newTargetDoses;

                setInventory(prev => {
                    const newInv = [...prev];
                    newInv[target.index] = { ...target.item, doses: newTargetDoses };
                    if (newUsedDoses > 0) {
                        newInv[used.index] = { ...used.item, doses: newUsedDoses };
                    } else {
                        newInv[used.index] = { itemId: 'vial', quantity: 1 };
                    }
                    return newInv;
                });
                addLog(`You decant the potions.`);
                return;
            }

            const isKeyCombination = (usedId === 'strange_key_loop' && targetId === 'strange_key_tooth') || (targetId === 'strange_key_loop' && usedId === 'strange_key_tooth');
            if (isKeyCombination) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('strange_key' as ItemId, 1, false, { bypassAutoBank: true });
                addLog("You combine the two key halves to create a strange key.");
                return;
            }

            const isHammeringCore = (usedId === 'hammer' && targetId === 'golem_core') || (targetId === 'hammer' && usedId === 'golem_core');
            if (isHammeringCore) {
                const coreIndex = usedId === 'golem_core' ? used.index : target.index;
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[coreIndex] = null;
                    return newInv;
                });
                modifyItem('golem_core_shard' as ItemId, 10, true, { bypassAutoBank: true });
                addXp(SkillName.Crafting, 25);
                addLog("You carefully smash the golem core, breaking it into 10 smaller shards.");
                return;
            }

            const crushableMap: Record<string, { dust: string }> = {
                'glimmerhorn_antler': { dust: 'glimmerhorn_dust' },
                'serpent_scale': { dust: 'serpent_scale_dust' },
                'unicorn_horn': { dust: 'unicorn_horn_dust' },
                'wyrmscale': { dust: 'wyrmscale_dust' }
            };

            const crushTargetId = (usedId === 'pestle_and_mortar') ? targetId : ((targetId === 'pestle_and_mortar') ? usedId : null);
            if (crushTargetId && crushableMap[crushTargetId]) {
                const recipe = crushableMap[crushTargetId];
                const maxCrushable = getItemCount(crushTargetId);
                if (maxCrushable < 1) {
                    addLog(`You don't have any ${ITEMS[crushTargetId].name} to grind.`);
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (quantity > 0) {
                        modifyItem(crushTargetId as ItemId, -quantity, true);
                        modifyItem(recipe.dust as ItemId, quantity, true, { bypassAutoBank: true });
                        addLog(`You grind ${quantity}x ${ITEMS[crushTargetId].name} into dust.`);
                    }
                };
                if (maxCrushable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Grind ${ITEMS[crushTargetId].name}`,
                        max: maxCrushable,
                        onConfirm
                    });
                }
                return;
            }

            const unfRecipe = HERBLORE_RECIPES.unfinished.find(r => (r.cleanHerbId === usedId && targetId === 'vial_of_water') || (r.cleanHerbId === targetId && usedId === 'vial_of_water'));
            if (unfRecipe) {
                if (herbloreLevel < unfRecipe.level) {
                    addLog(`You need a Herblore level of ${unfRecipe.level} to make this.`);
                    return;
                }
                const cleanHerbCount = getItemCount(unfRecipe.cleanHerbId);
                const vialOfWaterCount = getItemCount('vial_of_water');
                const maxCreatable = Math.min(cleanHerbCount, vialOfWaterCount);
                if (maxCreatable < 1) {
                    addLog("You don't have enough ingredients.");
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (activeCraftingAction) {
                        addLog("You are already busy crafting something else.");
                        return;
                    }
                    if (quantity > 0) {
                        setActiveCraftingAction({
                            recipeId: unfRecipe.unfinishedPotionId,
                            recipeType: 'herblore-unfinished',
                            totalQuantity: quantity, completedQuantity: 0, successfulQuantity: 0,
                            startTime: Date.now(), duration: 800,
                            payload: { cleanHerbId: unfRecipe.cleanHerbId }
                        });
                    }
                };
                if (maxCreatable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Create ${ITEMS[unfRecipe.unfinishedPotionId].name}`,
                        max: maxCreatable,
                        onConfirm
                    });
                }
                return;
            }

            const finRecipe = HERBLORE_RECIPES.finished.find(r => (r.unfinishedPotionId === usedId && r.secondaryId === targetId) || (r.unfinishedPotionId === targetId && r.secondaryId === usedId));
            if (finRecipe) {
                if (finRecipe.finishedPotionId === 'anointing_oil') {
                    const saintsFirstStepQuest = playerQuests.find(q => q.questId === 'the_saints_first_step');
                    if (!saintsFirstStepQuest || (saintsFirstStepQuest.currentStage < 6 && !saintsFirstStepQuest.isComplete)) {
                        addLog("You haven't learned how to make this yet.");
                        return;
                    }
                }
                if (herbloreLevel < finRecipe.level) {
                    addLog(`You need a Herblore level of ${finRecipe.level} to make this.`);
                    return;
                }
                const unfPotionCount = inventory.reduce((count, slot) => slot?.itemId === finRecipe.unfinishedPotionId ? count + (slot.doses ?? 1) : count, 0);
                const secondaryCount = getItemCount(finRecipe.secondaryId);
                const maxCreatable = Math.min(unfPotionCount, secondaryCount);
                if (maxCreatable < 1) {
                    addLog("You don't have enough ingredients.");
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (activeCraftingAction) {
                        addLog("You are already busy crafting something else.");
                        return;
                    }
                    if (quantity > 0) {
                        setActiveCraftingAction({
                            recipeId: finRecipe.finishedPotionId,
                            recipeType: 'herblore-finished',
                            totalQuantity: quantity, completedQuantity: 0, successfulQuantity: 0,
                            startTime: Date.now(), duration: 800,
                            payload: { unfinishedPotionId: finRecipe.unfinishedPotionId, secondaryId: finRecipe.secondaryId }
                        });
                    }
                };
                if (maxCreatable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Create ${ITEMS[finRecipe.finishedPotionId].name}`,
                        max: maxCreatable,
                        onConfirm
                    });
                }
                return;
            }

            const isCleaningPouch = (usedId === 'pouch_cleanser' && targetId === 'grimy_coin_pouch') || (targetId === 'pouch_cleanser' && usedId === 'grimy_coin_pouch');
            if (isCleaningPouch) {
                if (herbloreLevel < 10) {
                    addLog("You need a Herblore level of 10 to use this cleanser properly.");
                    return;
                }
                if (hasItems([{ itemId: 'pouch_cleanser', quantity: 1 }, { itemId: 'grimy_coin_pouch', quantity: 1 }])) {
                    modifyItem('pouch_cleanser' as ItemId, -1, true);
                    modifyItem('grimy_coin_pouch' as ItemId, -1, true);
                    modifyItem('clean_coin_pouch' as ItemId, 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Herblore, 15);
                    addLog("You use the cleanser to scrub the grime off the pouch.");
                }
                return;
            }

            const isStringing = (usedId.endsWith('_amulet_u') && targetId === 'ball_of_wool') || (targetId.endsWith('_amulet_u') && usedId === 'ball_of_wool');
            if (isStringing) {
                const unstrungId = usedId.endsWith('_amulet_u') ? usedId : targetId;
                const strungId = unstrungId.replace('_u', '');
                if (ITEMS[strungId]) {
                    setInventory(prevInv => {
                        const newInv = [...prevInv];
                        newInv[used.index] = null;
                        newInv[target.index] = null;
                        return newInv;
                    });
                    modifyItem(strungId as ItemId, 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Crafting, 5);
                    addLog(`You string the ${ITEMS[unstrungId].name}.`);
                }
                return;
            }

            const isRatKebab = (usedId === 'arrow_shaft' && targetId === 'rat_tail') || (targetId === 'arrow_shaft' && usedId === 'rat_tail');
            if (isRatKebab) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    const ratTailIndex = usedId === 'rat_tail' ? used.index : target.index;
                    const shaftIndex = usedId === 'arrow_shaft' ? used.index : target.index;

                    newInv[ratTailIndex] = null;

                    const shaftSlot = newInv[shaftIndex];
                    if (shaftSlot && shaftSlot.itemId === 'arrow_shaft') {
                        shaftSlot.quantity -= 1;
                        if (shaftSlot.quantity <= 0) {
                            newInv[shaftIndex] = null;
                        }
                    }
                    return newInv;
                });

                modifyItem('rat_kebab_uncooked', 1, false, { bypassAutoBank: true });
                addLog("You skewer the rat tail with the arrow shaft, creating an uncooked kebab.");
                return;
            }

            const startTimedAction = (recipeId: string, recipeType: ActiveCraftingAction['recipeType'], totalQuantity: number, duration: number, payload?: ActiveCraftingAction['payload']) => {
                setActiveCraftingAction({ recipeId, recipeType, totalQuantity, completedQuantity: 0, successfulQuantity: 0, startTime: Date.now(), duration, payload });
            };

            const stringRecipe = FLETCHING_RECIPES.stringing.find(r =>
                (r.unstrungId === usedId && (ITEMS[targetId]?.id === 'bow_string' || ITEMS[targetId]?.id === 'crossbow_string')) ||
                (r.unstrungId === targetId && (ITEMS[usedId]?.id === 'bow_string' || ITEMS[usedId]?.id === 'crossbow_string'))
            );
            if (stringRecipe) {
                const stringType = stringRecipe.unstrungId.includes('crossbow') ? 'crossbow_string' : 'bow_string';
                if ((usedId !== stringType && targetId !== stringType)) {
                    addLog("Nothing interesting happens."); return;
                }
                if (fletchingLevel < stringRecipe.level) { addLog(`You need a Fletching level of ${stringRecipe.level} to string this.`); return; }

                const unstrungBows = inventory.reduce((acc, slot) => (slot && slot.itemId === stringRecipe.unstrungId) ? acc + 1 : acc, 0);
                const bowStrings = inventory.reduce((acc, slot) => (slot && slot.itemId === stringType) ? acc + 1 : acc, 0);
                const quantity = Math.min(unstrungBows, bowStrings);
                if (quantity < 1) { addLog(`You need an unstrung bow and a ${ITEMS[stringType].name}.`); return; }

                startTimedAction(stringRecipe.strungId, 'fletching-string', quantity, 1200, { unstrungId: stringRecipe.unstrungId });
                return;
            }

            if ((usedId === 'arrow_shaft' && targetId === 'feathers') || (targetId === 'arrow_shaft' && usedId === 'feathers')) {
                const recipe = FLETCHING_RECIPES.headless;
                if (fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level} to make these.`); return; }
                const shaftQty = inventory.find(i => i && i.itemId === 'arrow_shaft')?.quantity ?? 0;
                const featherQty = inventory.find(i => i && i.itemId === 'feathers')?.quantity ?? 0;
                const quantity = Math.floor(Math.min(shaftQty, featherQty) / 15);
                if (quantity < 1) { addLog("You need at least 15 shafts and 15 feathers."); return; }
                startTimedAction('headless_arrow', 'fletching-headless', quantity, 600);
                return;
            }

            const tipRecipe = FLETCHING_RECIPES.tipping.find(r => (r.tipId === usedId && targetId === 'headless_arrow') || (r.tipId === targetId && usedId === 'headless_arrow'));
            if (tipRecipe) {
                if (fletchingLevel < tipRecipe.level) { addLog(`You need a Fletching level of ${tipRecipe.level} to attach these.`); return; }
                const tipQty = inventory.find(i => i && i.itemId === tipRecipe.tipId)?.quantity ?? 0;
                const headlessQty = inventory.find(i => i && i.itemId === 'headless_arrow')?.quantity ?? 0;
                const quantity = Math.floor(Math.min(tipQty, headlessQty) / 15);
                if (quantity < 1) { addLog("You need at least 15 tips and 15 headless arrows."); return; }
                startTimedAction(tipRecipe.arrowId, 'fletching-tip', quantity, 600, { tipId: tipRecipe.tipId });
                return;
            }

            const assemblyRecipe = FLETCHING_RECIPES.assembly.find(r => (r.limbsId === usedId && r.stockId === targetId) || (r.limbsId === targetId && r.stockId === usedId));
            if (assemblyRecipe) {
                if (fletchingLevel < assemblyRecipe.level) { addLog(`You need a Fletching level of ${assemblyRecipe.level} to do this.`); return; }
                startTimedAction(assemblyRecipe.unstrungId, 'fletching-assembly', 1, 1800);
                return;
            }

            const featheringRecipe = FLETCHING_RECIPES.feathering.find(r => (r.unfBoltsId === usedId && targetId === 'feathers') || (r.unfBoltsId === targetId && usedId === 'feathers'));
            if (featheringRecipe) {
                if (fletchingLevel < featheringRecipe.level) { addLog(`You need a Fletching level of ${featheringRecipe.level} to do this.`); return; }
                const unfBoltsQty = inventory.find(i => i && i.itemId === featheringRecipe.unfBoltsId)?.quantity ?? 0;
                const feathersQty = inventory.find(i => i && i.itemId === 'feathers')?.quantity ?? 0;
                const maxSets = Math.min(Math.floor(unfBoltsQty / 10), Math.floor(feathersQty / 10));
                if (maxSets < 1) { addLog("You need at least 10 unfinished bolts and 10 feathers."); return; }
                setMakeXPrompt({
                    title: `Fletch ${ITEMS[featheringRecipe.boltsId].name}`,
                    max: maxSets,
                    onConfirm: (quantity) => startTimedAction(featheringRecipe.boltsId, 'fletching-feather', quantity, 600, { unfBoltsId: featheringRecipe.unfBoltsId })
                });
                return;
            }

            addLog("Nothing interesting happens.");
        } finally {
            setItemToUse(null);
        }
    }, [skills, inventory, addLog, setActiveCraftingAction, hasItems, modifyItem, addXp, setMakeXPrompt, activeCraftingAction, currentPoiId, openCraftingView, setInventory, setItemToUse, itemToUse, playerQuests, startQuest, equipment, onResponse, handleDialogueCheck, ui, crafting, isBusy, isStunned, setRunEnergy, navigation, rangeCooldowns, setRangeCooldowns]);

    const handleExamine = useCallback((item: Item, quantity?: number) => {
        let message = `${item.description}`;
        if (quantity !== undefined && quantity >= 10000) {
            message += ` x${quantity.toLocaleString()}`;
        }
        addLog(message);
    }, [addLog]);

    const handleCombine = useCallback((itemId: string, inventoryIndex: number) => {
        console.log(`[useItemActions] handleCombine called for ${itemId} at index ${inventoryIndex}`);
        if (isBusy || isStunned) {
            console.log(`[useItemActions] handleCombine blocked: isBusy=${isBusy}, isStunned=${isStunned}`);
            return;
        }

        if (itemId === 'infernal_key_fragment') {
            const count = inventory.filter(slot => slot?.itemId === 'infernal_key_fragment').reduce((acc, curr) => acc + (curr?.quantity || 1), 0);

            if (count >= 5) {
                modifyItem('infernal_key_fragment' as ItemId, -5, true);
                modifyItem('infernal_key' as ItemId, 1, false, { bypassAutoBank: true });
                addLog("You combine the five fragments into an Infernal Key. The heat is almost unbearable.");
            } else {
                addLog(`You need 5 Infernal Key Fragments to create the Infernal Key. (You have ${count}/5)`);
            }
            return;
        }

        addLog("Nothing interesting happens.");
    }, [isBusy, isStunned, inventory, modifyItem, addLog]);

    return {
        handleConsume,
        handleBuryBones,
        handleEmptyItem,
        handleUseItemOn,
        handleUseItemOnActivity,
        handleDivine,
        handleExamine,
        handleReadMap,
        handleCombine,
        handleCurePoisonFromOrb,
        handleTeleport,
    };
}