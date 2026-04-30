

import { InventorySlot, WeightedDrop, ItemId } from '../types';
import { THIEVING_POCKET_TARGETS } from './loot/thievingPocket';
import { THIEVING_CONTAINER_TARGETS } from './loot/thievingTables';
import { THIEVING_STALL_TARGETS, THIEVING_STALL_LOOT_TABLES } from './loot/thievingStalls';
import { HERBLORE_RECIPES } from './herblore';

interface LootTableItem {
    itemId?: string;
    tableId?: string;
    chance: number | string | 'filler'; // A weight, percentage, or 'filler' to hit the total
    minQuantity?: number;
    maxQuantity?: number;
    noted?: boolean;
}

export interface LootRollResult {
    itemId: ItemId;
    quantity: number;
    noted: boolean;
}

type LootTable = LootTableItem[];

const TABLE_TOTAL_WEIGHT = 10000;

const parseChanceValue = (chance: number | string | 'filler'): number => {
    if (chance === 'filler') return 0; // Handled separately
    if (typeof chance === 'number') return chance;
    if (typeof chance === 'string') {
        const parts = chance.split('/');
        if (parts.length === 2) {
            const numerator = parseFloat(parts[0]);
            const denominator = parseFloat(parts[1]);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                // If it looks like a fraction (e.g. 1/32), we treat it as a fraction of 10,000
                return (numerator / denominator) * TABLE_TOTAL_WEIGHT;
            }
        }
        const numericValue = parseFloat(chance);
        return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
};

// Loot tables define weighted drops. The `rollOnLootTable` function will pick one.
const LOOT_TABLES: Record<string, LootTable> = {
    gem_table: [
        { itemId: 'uncut_sapphire', chance: 60 },
        { itemId: 'uncut_emerald', chance: 25 },
        { itemId: 'uncut_ruby', chance: 12.5 },
        { itemId: 'uncut_diamond', chance: 2.5 },
        { itemId: 'uncut_sunstone', chance: 0.000000000001 },
        { itemId: 'uncut_tenebrite', chance: 0.000000000001 },
    ],
    herb_table: [
        { itemId: 'grimy_guromoot', chance: 25 },
        { itemId: 'grimy_marleaf', chance: 20 },
        { itemId: 'grimy_swiftthistle', chance: 16 },
        { itemId: 'grimy_redfang_leaf', chance: 12 },
        { itemId: 'grimy_suns_kiss', chance: 8 },
        { itemId: 'grimy_bog_nettle', chance: 6 },
        { itemId: 'grimy_gloom_moss', chance: 4 },
        { itemId: 'grimy_windwhisper_bud', chance: 2 },
        { itemId: 'grimy_cinderbloom', chance: 1.5 },
        { itemId: 'grimy_wyrmfire_petal', chance: 1 },
        { itemId: 'grimy_duskshade', chance: 0.75 },
        { itemId: 'grimy_stonebloom', chance: 0.5 },
    ],
    global_gem_and_key_table: [
        { itemId: 'strange_key_loop', chance: '1/200' },
        { itemId: 'strange_key_tooth', chance: '1/200' },
        { itemId: 'talisman_drop', chance: '1/32' },
        { tableId: 'super_rare_table', chance: '1/256' },
        { itemId: 'uncut_emerald', chance: '3/10' }, // ~3000
        { itemId: 'uncut_ruby', chance: '15/100' },  // ~1500
        { itemId: 'uncut_diamond', chance: '4/100' }, // ~400
        { itemId: 'uncut_sapphire', chance: 'filler' }, // Fills the remaining ~4800
    ],
    super_rare_table: [
        // Total table weight is 10,000
        // Resources (4000 total weight)
        { itemId: 'coal', chance: 500, minQuantity: 500, maxQuantity: 2000, noted: true },
        { itemId: 'silver_ore', chance: 1000, minQuantity: 100, maxQuantity: 100, noted: true },
        { itemId: 'yew_logs', chance: 300, minQuantity: 100, maxQuantity: 250, noted: true },
        { itemId: 'adamantite_bar', chance: 200, minQuantity: 5, maxQuantity: 10, noted: true },
        { itemId: 'gold_bar', chance: 400, minQuantity: 50, maxQuantity: 100, noted: true },
        { itemId: 'verdant_rune', chance: 1500, minQuantity: 300, maxQuantity: 300 },
        { itemId: 'astral_rune', chance: 100, minQuantity: 100, maxQuantity: 100 },

        // Adamantite Gear (2500 total weight)
        { itemId: 'sunstone', chance: 500 },
        { itemId: 'adamantite_platebody', chance: 400 },
        { itemId: 'adamantite_platelegs', chance: 400 },
        { itemId: 'adamantite_full_helm', chance: 400 },
        { itemId: 'adamantite_kiteshield', chance: 400 },
        { itemId: 'adamantite_sword', chance: 400 },

        // Runic Gear (1000 total weight)
        { itemId: 'runic_platebody', chance: 250 },
        { itemId: 'runic_platelegs', chance: 250 },
        { itemId: 'runic_sword', chance: 250 },
        { itemId: 'runic_scimitar', chance: 250 },

        // Aquatite Gear (500 total weight)
        { itemId: 'aquatite_platebody', chance: 100 },
        { itemId: 'aquatite_platelegs', chance: 100 },
        { itemId: 'aquatite_full_helm', chance: 100 },
        { itemId: 'aquatite_kiteshield', chance: 100 },
        { itemId: 'aquatite_sword', chance: 100 },

        // Nothing (2000 weight)
        { chance: 2000 },
    ],
    robes_of_power_table: [
        { itemId: 'robe_of_power_hat', chance: 32 },
        { itemId: 'robe_of_power_top', chance: 32 },
        { itemId: 'robe_of_power_bottoms', chance: 32 },
    ],
    mimic_loot_table: [
        { itemId: 'coins', chance: 1, minQuantity: 5000, maxQuantity: 15000 },
        { itemId: 'adamantite_bar', chance: 1, minQuantity: 10, maxQuantity: 20, noted: true },
        { itemId: 'runic_bar', chance: 1, minQuantity: 5, maxQuantity: 10, noted: true },
        { itemId: 'uncut_diamond', chance: 1, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'yew_logs', chance: 1, minQuantity: 100, maxQuantity: 200, noted: true },
        { itemId: 'anima_rune', chance: 1, minQuantity: 25, maxQuantity: 50 },
        { itemId: 'nexus_rune', chance: 1, minQuantity: 25, maxQuantity: 50 },
        { itemId: 'diamond_lockpick', chance: 0.2, minQuantity: 1, maxQuantity: 3 }, // 1 in 5 chance
        { itemId: 'skeleton_key', chance: 0.01, minQuantity: 1, maxQuantity: 1 }, // 1 in 100 chance
    ],
    affinity_robes_table: [
        { itemId: 'affinity_hat', chance: 20 },
        { itemId: 'affinity_top', chance: 20 },
        { itemId: 'affinity_bottoms', chance: 20 },
        { itemId: 'affinity_gloves', chance: 20 },
        { itemId: 'affinity_boots', chance: 20 },
    ],
    ancient_chest_master_table: [
        // Weights based on OSRS Crystal Chest (128 base)
        { itemId: 'pkg_coins_food', chance: '34/128' },
        { itemId: 'pkg_runes', chance: '12/128' },
        { itemId: 'pkg_gems', chance: '12/128' },
        { itemId: 'pkg_bars', chance: '12/128' },
        { itemId: 'pkg_key_halves', chance: '10/128' },
        { itemId: 'pkg_mining', chance: '20/128' },
        { itemId: 'pkg_fishing', chance: '8/128' },
        { itemId: 'pkg_adamantite_square_shield', chance: '2/128' },
        { itemId: 'pkg_runic_armor', chance: '1/128' },
        { itemId: 'sunstone_bonus', chance: '17/128' },

        // Rare slot (1/500)
        { tableId: 'ancient_chest_aquatite_table', chance: '1/500' },
    ],
    ancient_chest_aquatite_table: [
        { itemId: 'aquatite_sword', chance: 1 },
        { itemId: 'aquatite_kiteshield', chance: 1 },
        { itemId: 'aquatite_platebody', chance: 1 },
        { itemId: 'aquatite_platelegs', chance: 1 },
        { itemId: 'aquatite_full_helm', chance: 1 },
    ],
    fishing_casket_table: [
        { itemId: 'coins', chance: 'filler', minQuantity: 20, maxQuantity: 640 },
        { itemId: 'uncut_sapphire', chance: '24/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'uncut_emerald', chance: '16/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'uncut_ruby', chance: '8/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'uncut_diamond', chance: '2/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'verdant_talisman', chance: '8/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'strange_key_loop', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
        { itemId: 'strange_key_tooth', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
    ],
    ...THIEVING_STALL_LOOT_TABLES,
};



const parseChance = (chance: number | string | 'filler'): number => {
    if (chance === 'filler') return 0; // Handled specially in rollOnLootTable
    if (typeof chance === 'number') return chance;
    if (typeof chance === 'string') {
        const parts = chance.split('/');
        if (parts.length === 2) {
            const numerator = parseFloat(parts[0]);
            const denominator = parseFloat(parts[1]);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                // Fractions are relative to the 10,000 standard base
                return (numerator / denominator) * TABLE_TOTAL_WEIGHT;
            }
        }
        const numericValue = parseFloat(chance);
        return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
};

/**
 * Rolls on a loot table and returns an item ID or null.
 * Can return a simple string for basic drops or a detailed object for complex drops.
 * @param tableId The ID of the loot table to roll on.
 * @returns The item details of the dropped item, or null if no item was dropped.
 */
export const rollOnLootTable = (tableId: string): LootRollResult | string | null => {
    const table = LOOT_TABLES[tableId];
    if (!table) {
        console.warn(`Loot table with id "${tableId}" not found.`);
        return null;
    }

    // 1. First, identify if there is a filler and calculate the base weight
    let nonFillerWeight = 0;
    let fillerItem: LootTableItem | null = null;

    for (const item of table) {
        if (item.chance === 'filler') {
            fillerItem = item;
        } else {
            nonFillerWeight += parseChance(item.chance);
        }
    }

    // 2. Determine total weight (Standard is 10k, but we grow if the weights exceed 10k)
    const totalWeight = (fillerItem || table.some(i => typeof i.chance === 'string'))
        ? Math.max(TABLE_TOTAL_WEIGHT, nonFillerWeight)
        : nonFillerWeight;

    const roll = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    // 3. Roll through the entries
    for (const item of table) {
        let currentWeight = 0;
        if (item.chance === 'filler') {
            currentWeight = Math.max(0, TABLE_TOTAL_WEIGHT - nonFillerWeight);
        } else {
            currentWeight = parseChance(item.chance);
        }

        cumulativeWeight += currentWeight;
        if (roll < cumulativeWeight) {
            if (item.tableId) {
                return rollOnLootTable(item.tableId);
            }
            if (!item.itemId) {
                return null;
            }

            if (item.minQuantity || item.maxQuantity || item.noted) {
                const min = item.minQuantity ?? 1;
                const max = item.maxQuantity ?? min;
                const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
                return {
                    itemId: item.itemId as ItemId,
                    quantity: quantity,
                    noted: item.noted ?? false,
                };
            } else {
                return item.itemId as ItemId;
            }
        }
    }

    return null;
};

// Add thieving tables to the main loot table object
for (const [tableId, targetData] of Object.entries(THIEVING_POCKET_TARGETS)) {
    LOOT_TABLES[tableId] = targetData.loot;
}
for (const [tableId, targetData] of Object.entries(THIEVING_CONTAINER_TARGETS)) {
    LOOT_TABLES[tableId] = targetData.loot;
}
for (const [tableId, targetData] of Object.entries(THIEVING_STALL_TARGETS)) {
    LOOT_TABLES[tableId] = targetData.loot;
}
