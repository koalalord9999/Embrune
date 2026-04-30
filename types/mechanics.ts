import { Item, ItemId } from './index';
import { SkillName } from './enums';

export interface Shop {
    id: string;
    name: string;
    inventory: { itemId: ItemId; quantity: number; priceModifier: number; doses?: number; }[]; // modifier for buying/selling
    currency?: 'coins' | 'agility_voucher' | 'slayer_credits';
    sellingDisabled?: boolean;
}

export interface ShopItemState {
    itemId: ItemId;
    currentStock: number;
    restockProgress: number; // in milliseconds
}

export type ShopStates = Record<string, Record<string, ShopItemState>>; // { [shopId]: { [itemId]: ShopItemState } }

export interface CookingRecipe {
    itemId: ItemId; // The item you get from cooking
    level: number;
    xp: number;
    ingredients: { itemId: ItemId; quantity: number }[];
    burntItemId: ItemId;
    alwaysSucceeds?: boolean;
}

export interface CraftingRecipe {
    itemId: ItemId;
    level?: number;
    xp?: number;
    requiredSkills?: { skill: SkillName; level: number }[];
    xpRewards?: { skill: SkillName; amount: number }[];
    ingredients: { itemId: ItemId; quantity: number }[];
}

export interface JewelryRecipe {
    itemId: ItemId;
    level: number;
    xp: number;
    barType: 'silver_bar' | 'gold_bar';
    barsRequired: number;
    mouldId: ItemId;
    gemId?: ItemId;
}

export interface SkillGuideEntry {
    level: number;
    description: string;
    subDescription?: string;
    titleSuffix?: string;
    itemId?: ItemId;
    /** If true, subDescription is only shown when the player meets the level requirement */
    revealSubAtLevel?: boolean;
    /** If true, titleSuffix is only shown when the player meets the level requirement */
    revealTitleSuffixAtLevel?: boolean;

}

export interface SkillGuideTab {
    id: string;
    label: string;
    entries: SkillGuideEntry[];
}


export interface ActiveCraftingAction {
    recipeId: string;
    // Distinguishes between different types of recipes that might share item IDs
    recipeType: 'smithing-bar' | 'smithing-item' | 'smithing-special' | 'fletching-carve' | 'fletching-string' | 'fletching-headless' | 'fletching-tip' | 'crafting' | 'gem-cutting' | 'spinning' | 'cooking' | 'herblore-unfinished' | 'herblore-finished' | 'jewelry' | 'firemaking-light' | 'firemaking-stoke' | 'milling' | 'dough-making' | 'fletching-stock' | 'fletching-assembly' | 'fletching-feather' | 'consecration' | 'grinding' | 'paste-making' | 'offering' | 'rendering' | 'glassblowing' | 'furnace-misc' | 'flask-mixing';
    totalQuantity: number;
    completedQuantity: number;
    successfulQuantity?: number;
    startTime: number;
    duration: number; // ms per item
    // Optional payload for specific recipe types
    payload?: {
        logId?: string; // for fletching-carve
        unstrungId?: string; // for fletching-string
        tipId?: string; // for fletching-tip
        barType?: 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar' | 'gold_bar'; // for smithing-bar
        uncutId?: string; // for gem-cutting
        cleanHerbId?: string; // for herblore-unfinished
        unfinishedPotionId?: string; // for herblore-finished
        secondaryId?: string; // for herblore-finished
        bonfireId?: string; // for firemaking-stoke
        unfBoltsId?: string; // for fletching-feather
        totalItems?: number;
        prayerCost?: number;
    }
}