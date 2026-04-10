import React, { useCallback } from 'react';
import { POIActivity, SkillName, InventorySlot, PlayerSkill, SkillRequirement, PlayerQuestState, ActiveCraftingAction, WorldState, WeaponType, Equipment } from '../types';
import { ITEMS, INVENTORY_CAPACITY, rollOnLootTable, LootRollResult, FIREMAKING_RECIPES } from '../constants';
import { POIS } from '../data/pois';
import { MakeXPrompt } from './useUIState';

interface UseWorldActionsProps {
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean; }) => void;
    addLog: (message: string) => void;
    coins: number;
    skills: (PlayerSkill & { currentLevel: number; })[];
    addXp: (skill: SkillName, amount: number) => void;
    setClearedSkillObstacles: React.Dispatch<React.SetStateAction<string[]>>;
    playerQuests: PlayerQuestState[];
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    windmillFlour: number;
    setWindmillFlour: React.Dispatch<React.SetStateAction<number>>;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    equipment: Equipment;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useWorldActions = (props: UseWorldActionsProps) => {
    const { hasItems, inventory, modifyItem, addLog, coins, skills, addXp, setClearedSkillObstacles, playerQuests, setMakeXPrompt, windmillFlour, setWindmillFlour, setActiveCraftingAction, setInventory, equipment, setIsResting } = props;

    const handleMilking = useCallback(() => {
        setIsResting(false);
        if (!hasItems([{ itemId: 'bucket', quantity: 1 }])) {
            addLog("You need an empty bucket to milk a cow.");
            return;
        }
        modifyItem('bucket', -1, true);
        modifyItem('bucket_of_milk', 1, false, { bypassAutoBank: true });
        addLog("You milk the cow and fill your bucket.");
    }, [hasItems, modifyItem, addLog, setIsResting]);

    const handleTanning = useCallback((inputId: string, outputId: string, cost: number, quantity: number) => {
        setIsResting(false);
        if (quantity <= 0) return;
        const totalCost = quantity * cost;
        const inputItemName = ITEMS[inputId]?.name ?? 'hides';
        const outputItemName = ITEMS[outputId]?.name ?? 'leather';

        if (coins < totalCost) {
            addLog("You don't have enough coins to tan that many.");
            return;
        }
        if (!hasItems([{ itemId: inputId, quantity }])) {
            addLog(`You don't have enough ${inputItemName}.`);
            return;
        }

        modifyItem('coins', -totalCost);
        modifyItem(inputId, -quantity);
        modifyItem(outputId, quantity, false, { bypassAutoBank: true });
        addLog(`You pay the tanner ${totalCost} coins to turn ${quantity} ${inputItemName} into ${outputItemName}.`);
    }, [coins, hasItems, modifyItem, addLog, setIsResting]);

    const handleWishingWell = useCallback(() => {
        setIsResting(false);
        if (coins < 1) { addLog("You need a coin to toss into the well."); return; }
        modifyItem('coins', -1);
        addLog("You toss a coin into the well and make a wish.");

        const hasPrize = playerQuests.some(q => q.questId === 'ancient_blade' && q.isComplete) || hasItems([{ itemId: 'rusty_iron_sword', quantity: 1 }]) || hasItems([{ itemId: 'iron_sword', quantity: 1 }]);
        if (hasPrize) { addLog("The well remains silent. It seems it has already given you all it can."); return; }

        if (Math.random() <= 1 / 1000) {
            addLog("You hear a faint clink from the bottom of the well... something is different.");
            modifyItem('rusty_iron_sword', 1, false, { bypassAutoBank: true });
        } else {
            addLog("The coin disappears into the depths with a faint splash.");
        }
    }, [hasItems, modifyItem, addLog, playerQuests, coins, setIsResting]);

    const handleClearObstacle = useCallback((fromPoiId: string, toPoiId: string, requirement: SkillRequirement) => {
        setIsResting(false);
        const skill = skills.find(s => s.name === SkillName.Attack); // Fallback to Attack if needed, but the original code had this logic
        const playerSkill = skills.find(s => s.name === requirement.skill);
        if (!playerSkill || playerSkill.currentLevel < requirement.level) {
            addLog(`You need a ${requirement.skill} level of ${requirement.level} to clear this.`);
            return;
        }

        if (requirement.items) {
            if (!hasItems(requirement.items)) {
                addLog("You don't have the required items to do this.");
                return;
            }
            requirement.items.forEach(item => modifyItem(item.itemId, -item.quantity));
        }

        addXp(requirement.skill, requirement.xp);
        addLog(`You use your ${requirement.skill} skill to clear the path! (+${requirement.xp} XP)`);

        const obstacleId = `${fromPoiId}-${toPoiId}`;
        setClearedSkillObstacles(prev => [...prev, obstacleId]);

    }, [skills, addXp, setClearedSkillObstacles, addLog, hasItems, modifyItem, setIsResting]);

    const handleCollectWater = useCallback((activity: Extract<POIActivity, { type: 'water_source' }>) => {
        setIsResting(false);
        const isHoly = (activity as any).isHoly === true;

        const vialCount = inventory.reduce((total, slot) => slot?.itemId === 'vial' ? total + slot.quantity : total, 0);

        if (isHoly) {
            if (vialCount === 0) {
                addLog("You need an empty vial to collect holy water.");
                return;
            }
            const onConfirm = (quantity: number) => {
                if (quantity <= 0) return;
                const vialsToFill = Math.min(quantity, vialCount);
                if (vialsToFill > 0) {
                    modifyItem('vial', -vialsToFill, true);
                    modifyItem('holy_water', vialsToFill, false, { bypassAutoBank: true });
                    addLog(`You fill ${vialsToFill} vial${vialsToFill > 1 ? 's' : ''} with holy water.`);
                }
            };
            if (vialCount === 1) {
                onConfirm(1);
            } else {
                setMakeXPrompt({
                    title: 'Collect Holy Water',
                    max: vialCount,
                    onConfirm
                });
            }
        } else {
            const bucketCount = inventory.filter(slot => slot?.itemId === 'bucket').length;
            const waterskinCount = inventory.filter(slot => slot?.itemId === 'waterskin' && (slot.doses === undefined || slot.doses === 0)).length;
            const totalContainers = vialCount + bucketCount + waterskinCount;

            if (totalContainers === 0) {
                addLog("You don't have any empty containers to fill with water.");
                return;
            }

            const onConfirm = (quantity: number) => {
                if (quantity <= 0) return;

                const vialsToFill = Math.min(quantity, vialCount);
                const bucketsToFill = Math.min(quantity - vialsToFill, bucketCount);
                const waterskinsToFill = Math.min(quantity - vialsToFill - bucketsToFill, waterskinCount);

                if (vialsToFill > 0) {
                    modifyItem('vial', -vialsToFill, true);
                    modifyItem('vial_of_water', vialsToFill, true, { bypassAutoBank: true });
                }
                if (bucketsToFill > 0) {
                    modifyItem('bucket', -bucketsToFill, true);
                    modifyItem('bucket_of_water', bucketsToFill, true, { bypassAutoBank: true });
                }
                if (waterskinsToFill > 0) {
                    setInventory(prevInv => {
                        const newInv = [...prevInv];
                        let filledCount = 0;
                        for (let i = 0; i < newInv.length && filledCount < waterskinsToFill; i++) {
                            const slot = newInv[i];
                            if (slot?.itemId === 'waterskin' && (slot.doses === undefined || slot.doses === 0)) {
                                newInv[i] = { ...slot, doses: 4 };
                                filledCount++;
                            }
                        }
                        return newInv;
                    });
                }

                const logParts = [];
                if (vialsToFill > 0) logParts.push(`${vialsToFill} vial${vialsToFill > 1 ? 's' : ''}`);
                if (bucketsToFill > 0) logParts.push(`${bucketsToFill} bucket${bucketsToFill > 1 ? 's' : ''}`);
                if (waterskinsToFill > 0) logParts.push(`${waterskinsToFill} waterskin${waterskinsToFill > 1 ? 's' : ''}`);

                if (logParts.length > 0) {
                    addLog(`You fill ${logParts.join(' and ')} with water.`);
                }
            };

            if (totalContainers === 1) {
                onConfirm(1);
            } else {
                setMakeXPrompt({
                    title: 'Collect Water',
                    max: totalContainers,
                    onConfirm
                });
            }
        }
    }, [inventory, addLog, modifyItem, setMakeXPrompt, setInventory, setIsResting]);

    const handleCutCactus = useCallback(() => {
        setIsResting(false);
        const slashWeapons = [WeaponType.Sword, WeaponType.Scimitar, WeaponType.Dagger, WeaponType.Axe, WeaponType.Battleaxe];
        const equippedWeapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const hasSlashWeapon = (equippedWeapon && equippedWeapon.equipment?.weaponType && slashWeapons.includes(equippedWeapon.equipment.weaponType)) || hasItems([{ itemId: 'knife', quantity: 1 }]);

        if (!hasSlashWeapon) {
            addLog("You need a knife or a slash weapon to cut this cactus.");
            return;
        }

        let waterskinToFillIndex = -1;
        // Prioritize empty waterskins
        waterskinToFillIndex = inventory.findIndex(slot => slot?.itemId === 'waterskin' && (slot.doses === 0 || slot.doses === undefined));
        // If no empty ones, find a partially filled one
        if (waterskinToFillIndex === -1) {
            waterskinToFillIndex = inventory.findIndex(slot => slot?.itemId === 'waterskin' && slot.doses !== undefined && slot.doses > 0 && slot.doses < 4);
        }

        if (waterskinToFillIndex === -1) {
            addLog("You don't have any waterskins that need filling.");
            return;
        }

        setInventory(prevInv => {
            const newInv = [...prevInv];
            const waterskinSlot = newInv[waterskinToFillIndex];
            if (waterskinSlot) {
                newInv[waterskinToFillIndex] = { ...waterskinSlot, doses: 4 };
            }
            return newInv;
        });

        addLog("You skillfully slice the cactus and fill your waterskin.");
        addXp(SkillName.Woodcutting, 15);
    }, [equipment.weapon, hasItems, inventory, addLog, setInventory, addXp, setIsResting]);

    const handleSandPit = useCallback(() => {
        setIsResting(false);
        if (!hasItems([{ itemId: 'bucket', quantity: 1 }])) {
            addLog("You need an empty bucket to collect sand.");
            return;
        }
        modifyItem('bucket', -1, true);
        modifyItem('bucket_of_sand', 1, false, { bypassAutoBank: true });
        addLog("You fill your bucket with fine sand.");
    }, [hasItems, modifyItem, addLog, setIsResting]);

    const handleCollectFlour = useCallback(() => {
        setIsResting(false);
        if (windmillFlour <= 0) {
            addLog("The windmill's hopper is empty. You need to mill some wheat first.");
            return;
        }
        setWindmillFlour(f => f - 1);
        modifyItem('flour', 1, false, { bypassAutoBank: true });
        addLog("You collect some flour from the hopper.");
    }, [windmillFlour, addLog, hasItems, setWindmillFlour, modifyItem, setIsResting]);

    const handleMillWheat = useCallback(() => {
        setIsResting(false);
        const wheatCount = inventory.reduce((total, slot) => slot?.itemId === 'wheat' ? total + slot.quantity : total, 0);
        if (wheatCount === 0) {
            addLog("You have no wheat to mill.");
            return;
        }

        const onConfirm = (quantity: number) => {
            if (quantity > 0) {
                addLog("You add the wheat to the hopper and start the windmill.");
                setActiveCraftingAction({
                    recipeId: 'flour',
                    recipeType: 'milling',
                    totalQuantity: quantity,
                    completedQuantity: 0,
                    successfulQuantity: 0,
                    startTime: Date.now(),
                    duration: 600,
                });
            }
        };

        if (wheatCount === 1) {
            onConfirm(1);
        } else {
            setMakeXPrompt({
                title: 'Mill Wheat',
                max: wheatCount,
                onConfirm
            });
        }
    }, [inventory, addLog, setMakeXPrompt, setActiveCraftingAction, setIsResting]);

    const handleChurn = useCallback(() => {
        setIsResting(false);
        const milkCount = inventory.filter(s => s?.itemId === 'bucket_of_milk').length;
        if (milkCount === 0) {
            addLog("You don't have any buckets of milk.");
            return;
        }

        const cookingSkill = skills.find(s => s.name === SkillName.Cooking);
        if (!cookingSkill || cookingSkill.currentLevel < 26) {
            addLog("You need a Cooking level of 26 to churn dairy.");
            return;
        }

        const onConfirm = (quantity: number) => {
            const actualQuantity = Math.min(quantity, milkCount);
            if (actualQuantity > 0) {
                addLog("You begin churning the milk into cheese...");
                setActiveCraftingAction({
                    recipeId: 'cheese',
                    recipeType: 'crafting', // Reusing generic crafting type for simplicity
                    totalQuantity: actualQuantity,
                    completedQuantity: 0,
                    successfulQuantity: 0,
                    startTime: Date.now(),
                    duration: 1800, // 1.8s per cheese
                });
            }
        };

        if (milkCount === 1) {
            onConfirm(1);
        } else {
            setMakeXPrompt({
                title: 'Churn Cheese',
                max: milkCount,
                onConfirm
            });
        }
    }, [inventory, skills, addLog, setActiveCraftingAction, setMakeXPrompt, setIsResting]);

    const handleOpenAncientChest = useCallback(() => {
        setIsResting(false);
        if (!hasItems([{ itemId: 'strange_key', quantity: 1 }])) {
            addLog("The chest is locked. It seems to require a strange, ornate key.");
            return;
        }

        const freeSlots = inventory.filter(s => s === null).length;
        if (freeSlots < 5) {
            addLog("You need at least 5 free inventory slots to open this chest.");
            return;
        }

        modifyItem('strange_key', -1, true);
        addLog("You insert the strange key into the ancient chest... it clicks open!");

        // 1. Guaranteed Sunstone
        modifyItem('uncut_sunstone', 1, false);

        // 2. Roll on Master Table
        const result = rollOnLootTable('ancient_chest_master_table');
        if (result) {
            const { itemId, quantity, noted } = typeof result === 'string' ? { itemId: result, quantity: 1, noted: false } : result;

            switch (itemId) {
                case 'sunstone_bonus':
                    // Just the sunstone
                    break;
                case 'pkg_coins_food':
                    modifyItem('coins', 2000, false);
                    modifyItem('cake', 1, false);
                    break;
                case 'pkg_runes':
                    modifyItem('gust_rune', 50, false);
                    modifyItem('aqua_rune', 50, false);
                    modifyItem('stone_rune', 50, false);
                    modifyItem('ember_rune', 50, false);
                    modifyItem('hex_rune', 50, false);
                    modifyItem('binding_rune', 50, false);
                    modifyItem('flux_rune', 10, false);
                    modifyItem('nexus_rune', 10, false);
                    modifyItem('astral_rune', 10, false);
                    modifyItem('verdant_rune', 10, false);
                    modifyItem('passage_rune', 10, false);
                    break;
                case 'pkg_gems':
                    modifyItem('ruby', 2, false);
                    modifyItem('diamond', 2, false);
                    break;
                case 'pkg_bars':
                    modifyItem('runic_bar', 3, false, { noted: true });
                    break;
                case 'pkg_mining':
                    // 50/50 chance for iron ore or coal
                    if (Math.random() < 0.5) {
                        modifyItem('iron_ore', 150, false, { noted: true });
                    } else {
                        modifyItem('coal', 100, false, { noted: true });
                    }
                    break;
                case 'pkg_fishing':
                    modifyItem('raw_swordfish', 5, false, { noted: true });
                    modifyItem('coins', 1000, false);
                    break;
                case 'pkg_adamantite_square_shield':
                    modifyItem('adamantite_square_shield', 1, false);
                    break;
                case 'pkg_key_halves':
                    modifyItem('coins', 750, false);
                    // 50/50 chance for loop or tooth
                    if (Math.random() < 0.5) {
                        modifyItem('strange_key_loop', 1, false);
                    } else {
                        modifyItem('strange_key_tooth', 1, false);
                    }
                    break;
                case 'pkg_runic_armor':
                    // 50/50 chance for platelegs or chainbody
                    if (Math.random() < 0.5) {
                        modifyItem('runic_platelegs', 1, false);
                    } else {
                        modifyItem('runic_chainbody', 1, false);
                    }
                    break;
                default:
                    // It's a real item from a sub-table (like Aquatite)
                    modifyItem(itemId, quantity, false, { bypassAutoBank: false, noted });
                    if (itemId.includes('aquatite')) {
                        addLog("Incredibly lucky! You found a piece of Aquatite armor inside!");
                    }
                    break;
            }
        }

        addLog(`You find a pile of loot inside the chest!`);

    }, [hasItems, modifyItem, addLog, inventory, setIsResting]);

    return {
        handleMilking,
        handleTanning,
        handleWishingWell,
        handleClearObstacle,
        handleCollectWater,
        handleCollectFlour,
        handleMillWheat,
        handleChurn,
        handleOpenAncientChest,
        handleCutCactus,
        handleSandPit,
    };
};