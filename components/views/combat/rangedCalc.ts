
import { CombatStance, WeaponType, ActiveBuff, Monster, SkillName, MonsterStatusEffect, InventorySlot } from '../../../types';
import { ITEMS, AMMO_TIER_LEVELS } from '../../../constants';
import { calculateAccuracy, DamageCalculationResult } from './combatUtils';

export const calculateRangedDamage = (
    playerStats: any,
    monster: Monster,
    combatStance: CombatStance,
    getEffectiveLevel: (skill: SkillName) => number,
    playerMaxHit: number,
    activeBuffs: ActiveBuff[],
    weaponSlot: InventorySlot | null,
    ammoSlot: InventorySlot | null
): DamageCalculationResult => {
    // Ammo Checks
    if (!ammoSlot || ammoSlot.quantity <= 0) {
        return { error: "You have no ammo equipped!", damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }
    const weaponData = weaponSlot ? ITEMS[weaponSlot.itemId] : null;
    const ammoData = ITEMS[ammoSlot.itemId];
    if (!weaponData) {
        return { error: "You have no weapon equipped!", damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }
    if (weaponData.equipment?.weaponType === WeaponType.Bow && ammoData?.equipment?.weaponType !== WeaponType.Arrow) {
        return { error: "You can only fire arrows with a bow.", damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }
    if (weaponData.equipment?.weaponType === WeaponType.Crossbow && ammoData?.equipment?.weaponType !== WeaponType.Bolt) {
        return { error: "You can only fire bolts with a crossbow.", damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
    }
    if (weaponData.equipment?.ammoTier) {
        const weaponMaxTier = AMMO_TIER_LEVELS[weaponData.equipment.ammoTier];
        const ammoTier = AMMO_TIER_LEVELS[ammoData.material as string];
        if (ammoTier > weaponMaxTier) {
            return { error: `Your ${weaponData.name} cannot fire ${ammoData.name}.`, damage: 0, xpGains: {}, successfulHit: false, isMaxHit: false, statusEffectsToApply: [] };
        }
    }

    // Damage Calculation
    let successfulHit = false;
    let playerDamage = 0;
    const xpGains: Partial<Record<SkillName, number>> = {};
    const statusEffectsToApply: MonsterStatusEffect[] = [];

    let effectiveRanged = getEffectiveLevel(SkillName.Ranged);
    if (combatStance === CombatStance.RangedAccurate) effectiveRanged += 3;
    
    const accuracyBuff = activeBuffs.find(b => b.type === 'accuracy_boost' && (b.style === 'ranged' || b.style === 'all'));
    const totalRangedAttack = effectiveRanged + playerStats.rangedAttack;
    const totalMonsterRangedDefence = monster.defence + monster.rangedDefence;
    const accuracy = calculateAccuracy(totalRangedAttack, totalMonsterRangedDefence, accuracyBuff?.value);
    
    if (Math.random() < accuracy) { 
        playerDamage = Math.floor(Math.random() * (playerMaxHit + 1));
        successfulHit = true;
    }
    
    const flatDamageBuff = activeBuffs.find(b => b.type === 'flat_damage' && (b.style === 'all' || b.style === 'ranged'));
    if (flatDamageBuff && successfulHit) {
        playerDamage += flatDamageBuff.value;
    }
    
    const damageOnHitBuff = activeBuffs.find(b => b.type === 'damage_on_hit' && (b.style === 'all' || b.style === 'ranged'));
    if (damageOnHitBuff && successfulHit) {
        playerDamage += damageOnHitBuff.value;
    }

    const isMax = successfulHit && playerDamage > 0 && playerDamage === playerMaxHit && playerMaxHit >= 2;

    if (playerDamage > 0) {
        xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + Math.round(playerDamage * 1.33);
        if (combatStance === CombatStance.RangedDefence) { 
            xpGains[SkillName.Ranged] = (xpGains[SkillName.Ranged] || 0) + playerDamage * 2; 
            xpGains[SkillName.Defence] = (xpGains[SkillName.Defence] || 0) + playerDamage * 2; 
        } else {
            xpGains[SkillName.Ranged] = (xpGains[SkillName.Ranged] || 0) + playerDamage * 4;
        }
    }

    const weaponPoison = weaponSlot?.statsOverride?.poisoned;
    const ammoPoison = ammoSlot?.statsOverride?.poisoned;
    const equipmentPoison = ammoPoison || weaponPoison;
    const potionPoisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit' && (b.style === 'all' || b.style === 'ranged'));
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
    if (poisonToApply && successfulHit && Math.random() < poisonToApply.chance) {
        statusEffectsToApply.push({ type: 'poison', damagePerTick: poisonToApply.damage, ticksApplied: 0 });
    }

    return {
        damage: playerDamage,
        xpGains,
        successfulHit,
        isMaxHit: isMax,
        statusEffectsToApply,
        ammoConsumed: true,
        animationOptions: { arrowType: ammoData.material, type: 'ranged' }
    };
};
