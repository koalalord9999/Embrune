import { SkillName, ItemId } from './index';

export type SpellElement = 'wind' | 'water' | 'earth' | 'fire';

export interface Spell {
    id: string;
    name: string;
    description: string;
    level: number;
    runes: { itemId: ItemId, quantity: number }[];
    xp: number;
    type: 'combat' | 'utility-teleport' | 'utility-enchant' | 'utility-alchemy' | 'utility-processing' | 'curse' | 'enhancement';
    maxHit?: number;
    element?: SpellElement;
    targetItems?: (ItemId | 'all')[]; // For enchant, alchemy, processing
    autocastable: boolean;
    castTime?: number; // in game ticks
}