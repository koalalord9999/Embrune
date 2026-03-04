
import { Monster, SkillName, MonsterStatusEffect } from '../../../types';

export const calculateAccuracy = (attackStat: number, defenceStat: number, accuracyBoost: number = 0): number => {
    const attackRoll = attackStat + 8;
    const defenceRoll = defenceStat + 8;
    let hitChance = attackRoll > defenceRoll ? 1 - (defenceRoll / (2 * attackRoll)) : attackRoll / (2 * defenceRoll);
    hitChance = Math.max(0.01, Math.min(0.99, hitChance));
    hitChance *= (1 + accuracyBoost / 100); // Apply percentage boost
    return Math.min(1, hitChance);
};

export interface DamageCalculationResult {
    damage: number;
    xpGains: Partial<Record<SkillName, number>>;
    successfulHit: boolean;
    isMaxHit: boolean;
    statusEffectsToApply: MonsterStatusEffect[];
    ammoConsumed?: boolean;
    error?: string;
    animationOptions?: any;
    logMessage?: string;
}
