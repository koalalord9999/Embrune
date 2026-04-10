import { CombatStance, ActiveBuff, Monster, SkillName, MonsterStatusEffect, InventorySlot, Spell, SpellElement } from '../../../types';
import {  ITEMS  } from '../../../constants';
import { calculateAccuracy, DamageCalculationResult } from './combatUtils';

export const calculateMagicDamage = (
    spell: Spell,
    playerStats: any,
    monster: Monster,
    combatStance: CombatStance,
    getEffectiveLevel: (skill: SkillName) => number,
    activeBuffs: ActiveBuff[],
    currentElementalWeakness: SpellElement | null,
    weaponSlot: InventorySlot | null,
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean,
    visibleMagicLevel: number
): DamageCalculationResult => {
    // Prerequisite checks
    if (visibleMagicLevel < spell.level) {
        return { error: `Your Magic level is too low to cast ${spell.name}.`, damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }
    const equippedStaff = weaponSlot ? ITEMS[weaponSlot.itemId] : null;
    const providedRune = equippedStaff?.equipment?.providesRune ? equippedStaff.equipment.providesRune : null;
    const runesNeeded = spell.runes.filter(r => r.itemId !== providedRune);
    if (!hasItems(runesNeeded)) {
        return { error: `You don't have enough runes to cast ${spell.name}.`, damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }

    // Damage Calculation
    let successfulHit = false;
    let playerDamage = 0;
    const xpGains: Partial<Record<SkillName, number>> = {};
    const statusEffectsToApply: MonsterStatusEffect[] = [];
    let logMessage: string | undefined;

    xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + spell.xp;

    let effectiveMagic = getEffectiveLevel(SkillName.Magic);
    let totalMagicAttack = (effectiveMagic * 2) + playerStats.magicAttack;
    let damageMultiplier = 1.0;

    if (currentElementalWeakness && spell.element === currentElementalWeakness) {
        totalMagicAttack *= 3;
        damageMultiplier = 2.0;
        logMessage = "Your spell hits a weak point!";
    }
    
    const totalMonsterMagicDefence = monster.defence + monster.magicDefence;
    const accuracy = calculateAccuracy(totalMagicAttack, totalMonsterMagicDefence);
    
    const baseMaxHit = spell.maxHit ?? 0;
    const magicBuff = activeBuffs.find(b => b.type === 'magic_damage_boost');
    const buffBonus = magicBuff ? (magicBuff.value / 100) : 0;
    const bonus = 1 + (playerStats.magicDamageBonus / 100) + buffBonus;
    const maxHit = Math.floor(baseMaxHit * bonus * damageMultiplier);

    if (Math.random() < accuracy) { 
        successfulHit = true;
        playerDamage = Math.floor(Math.random() * (maxHit + 1));
    }
    
    if (successfulHit && playerDamage > 0 && spell.element === 'fire') {
        if (monster.fireImmunity) {
            playerDamage = -Math.ceil(playerDamage / 2);
            logMessage = "The monster's fiery nature absorbs some of your spell, healing it!";
        } else if (monster.fireWeakness) { // Can be positive or negative
            playerDamage = Math.ceil(playerDamage * (1 + monster.fireWeakness));
            if (monster.fireWeakness > 0) {
                 logMessage = "The monster is weak to fire!";
            } else if (monster.fireWeakness < 0) {
                 logMessage = "The monster resists the fire!";
            }
        }
    }
    
    const isMax = successfulHit && playerDamage > 0 && playerDamage === maxHit && maxHit >= 2;

    if (playerDamage > 0) {
        xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + playerDamage * 1.33;
        if (combatStance === CombatStance.DefensiveAutocast) {
            xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + playerDamage * 1;
            xpGains[SkillName.Defence] = (xpGains[SkillName.Defence] || 0) + playerDamage * 1;
        } else {
            xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + playerDamage * 2;
        }
    }

    if (successfulHit) {
         const equipmentPoison = weaponSlot?.statsOverride?.poisoned;
         const potionPoisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit');
         let poisonToApply: { chance: number, damage: number } | null = null;
         if (equipmentPoison) {
            poisonToApply = { chance: equipmentPoison.chance, damage: equipmentPoison.damage };
         }
         if (potionPoisonBuff) {
            const potionPoison = { chance: potionPoisonBuff.chance ?? 0.25, damage: potionPoisonBuff.value };
             if (!poisonToApply || potionPoison.damage > poisonToApply.damage) {
                 poisonToApply = potionPoison;
             }
         }
         if (poisonToApply && Math.random() < poisonToApply.chance) {
            statusEffectsToApply.push({ type: 'poison', damagePerTick: poisonToApply.damage, ticksApplied: 0 });
         }
    }
    
    const spellTier = spell.level > 80 ? 5 : spell.level > 60 ? 4 : spell.level > 40 ? 3 : spell.level > 20 ? 2 : 1;
    
    return {
        damage: playerDamage,
        xpGains,
        successfulHit,
        isMaxHit: isMax,
        statusEffectsToApply,
        logMessage,
        animationOptions: { type: 'magic', spellTier, element: spell.element }
    };
};