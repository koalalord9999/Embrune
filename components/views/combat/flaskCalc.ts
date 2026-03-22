import { ActiveBuff, Monster, SkillName, MonsterStatusEffect, InventorySlot } from '../../../types';
import { ITEMS, FIRE_FLASK_DATA } from '../../../constants';
import { calculateAccuracy, DamageCalculationResult } from './combatUtils';

export const calculateFlaskDamage = (
    playerStats: any,
    monster: Monster,
    getEffectiveLevel: (skill: SkillName) => number,
    playerMaxHit: number,
    weaponSlot: InventorySlot | null,
    ammoSlot: InventorySlot | null
): DamageCalculationResult => {
    if (ammoSlot?.itemId !== 'fire_pot_lit') {
        return { error: "You need a lit fire pot equipped in your ammo slot to throw these flasks.", damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }

    let successfulHit = false;
    let playerDamage = 0;
    const xpGains: Partial<Record<SkillName, number>> = {};
    const statusEffectsToApply: MonsterStatusEffect[] = [];
    let logMessage: string | undefined;

    // Flasks use Ranged for accuracy
    let effectiveRanged = getEffectiveLevel(SkillName.Ranged);
    const totalRangedAttack = effectiveRanged + playerStats.rangedAttack;
    const totalMonsterRangedDefence = monster.defence + monster.rangedDefence;
    const accuracy = calculateAccuracy(totalRangedAttack, totalMonsterRangedDefence);
    
    if (Math.random() < accuracy) {
        playerDamage = Math.floor(Math.random() * (playerMaxHit + 1));
        successfulHit = true;
    }
    
    const isXFlask = weaponSlot?.statsOverride?.isXFlask === true;

    if (successfulHit && playerDamage > 0) {
        if (monster.fireImmunity && !isXFlask) {
            playerDamage = -Math.ceil(playerDamage / 2);
            logMessage = "The monster absorbs the flames, healing itself!";
        } else if (monster.fireImmunity && isXFlask) {
            playerDamage = Math.ceil(playerDamage / 2);
            logMessage = "The flask's mixture burns through the monster's fire immunity!";
        } else if (monster.fireWeakness && weaponSlot?.itemId && FIRE_FLASK_DATA[weaponSlot.itemId]) {
            playerDamage = Math.ceil(playerDamage * (1 + monster.fireWeakness));
        }
    }
    
    const isMax = successfulHit && playerDamage > 0 && playerDamage === playerMaxHit && playerMaxHit >= 2;
    
    if (playerDamage > 0) {
        xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + Math.round(playerDamage * 1.33);
        xpGains[SkillName.Firemaking] = (xpGains[SkillName.Firemaking] || 0) + playerDamage * 2;
    } else if (playerDamage < 0) {
        // Monster absorbed the damage, but we still reward a tiny bit of experience for the attempt
        xpGains[SkillName.Firemaking] = (xpGains[SkillName.Firemaking] || 0) + 1;
    }

    if (weaponSlot && (successfulHit || playerDamage > 0) && !(monster.fireImmunity && !isXFlask)) {
        const flaskData = FIRE_FLASK_DATA[weaponSlot.itemId];
        if (flaskData) {
            const firemakingLevel = getEffectiveLevel(SkillName.Firemaking);
            const firemakingBonus = Math.floor(firemakingLevel / 30);
            let maxDamagePerTick = flaskData.baseDot + firemakingBonus;

            if (monster.fireImmunity && isXFlask) {
                maxDamagePerTick = Math.ceil(maxDamagePerTick / 2);
            } else if (monster.fireWeakness) {
                maxDamagePerTick = Math.ceil(maxDamagePerTick * (1 + monster.fireWeakness));
            }
            
            statusEffectsToApply.push({ type: 'burn', maxDamagePerTick: maxDamagePerTick, ticksRemaining: 5 });
        }
    }

    return {
        damage: playerDamage,
        xpGains,
        successfulHit,
        isMaxHit: isMax,
        statusEffectsToApply,
        ammoConsumed: true,
        animationOptions: { element: 'fire', type: 'magic', spellTier: 3 },
        logMessage,
    };
};