export interface DropCondition {
    questId: string;
    status: 'not_started' | 'in_progress' | 'completed';
    stage?: number;
}

import { ItemId } from './ItemIds';

export interface BaseDrop {
    itemId?: ItemId;
    tableId?: string;
    minQuantity?: number;
    maxQuantity?: number;
    noted?: boolean;
    doses?: number;
    questReq?: DropCondition;
    multiRoll?: {
        tableId: string;
        maxRolls: number;
        rollAgainChance: number;
    };
}
export interface GuaranteedDrop extends BaseDrop {}
export interface WeightedDrop extends BaseDrop {
    chance: number | string; // Probability (decimal or fraction string)
}
export interface TertiaryDrop extends BaseDrop {
    chance: number; // Probability
}