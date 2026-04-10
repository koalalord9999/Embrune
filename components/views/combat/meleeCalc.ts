
import { CombatStance, WeaponType, ActiveBuff, Monster, SkillName, MonsterStatusEffect, InventorySlot, MonsterType } from '../../../types';
import { calculateAccuracy, DamageCalculationResult } from './combatUtils';

export const calculateMeleeDamage = (
    playerStats: any,
    monster: Monster,
    combatStance: CombatStance,
    getEffectiveLevel: (skill: SkillName) => number,
    playerMaxHit: number,
    activeBuffs: ActiveBuff[],
    weaponSlot: InventorySlot | null,
    playerWeapon: { type: WeaponType }
): DamageCalculationResult => {
    let successfulHit = false;
    let playerDamage = 0;
    const xpGains: Partial<Record<SkillName, number>> = {};
    const statusEffectsToApply: MonsterStatusEffect[] = [];

    let effectiveAttack = getEffectiveLevel(SkillName.Attack);
    if (combatStance === CombatStance.Accurate) effectiveAttack += 3;

    let playerAttackStyle: 'stab' | 'slash' | 'crush' = 'crush';
    switch (playerWeapon.type) {
        case WeaponType.Dagger: playerAttackStyle = 'stab'; break;
        case WeaponType.Sword: playerAttackStyle = 'slash'; break;
        case WeaponType.Scimitar: playerAttackStyle = 'slash'; break;
        case WeaponType.Axe: playerAttackStyle = 'slash'; break;
        case WeaponType.Battleaxe: playerAttackStyle = 'slash'; break;
        case WeaponType.Mace: playerAttackStyle = 'crush'; break;
        case WeaponType.Warhammer: playerAttackStyle = 'crush'; break;
        case WeaponType.Unarmed: playerAttackStyle = 'crush'; break;
        case WeaponType.Staff: playerAttackStyle = 'crush'; break;
        case WeaponType.Whip: playerAttackStyle = 'slash'; break;
        case WeaponType.Greatsword: playerAttackStyle = 'slash'; break;
        case WeaponType.Spear: playerAttackStyle = 'stab'; break;
    }

    let attackBonus = 0;
    let monsterDefenceBonus = 0;
    switch (playerAttackStyle) {
        case 'stab':
            attackBonus = playerStats.stabAttack;
            monsterDefenceBonus = monster.stabDefence;
            break;
        case 'slash':
            attackBonus = playerStats.slashAttack;
            monsterDefenceBonus = monster.slashDefence;
            break;
        case 'crush':
            attackBonus = playerStats.crushAttack;
            monsterDefenceBonus = monster.crushDefence;
            break;
    }
    const totalAttack = effectiveAttack + attackBonus;
    const totalMonsterDefence = monster.defence + monsterDefenceBonus;

    const accuracyBuff = activeBuffs.find(b => b.type === 'accuracy_boost' && (b.style === 'melee' || b.style === 'all'));
    let accuracy = calculateAccuracy(totalAttack, totalMonsterDefence, accuracyBuff?.value);

    let finalMaxHit = playerMaxHit;
    if (playerWeapon.type === WeaponType.Mace && monster.types?.includes(MonsterType.Armored)) {
        accuracy *= 1.15;
        finalMaxHit = Math.floor(finalMaxHit * 1.15);
    }

    if (Math.random() < Math.min(1.0, accuracy)) {
        playerDamage = Math.floor(Math.random() * (finalMaxHit + 1));
        successfulHit = true;
    }

    const flatDamageBuff = activeBuffs.find(b => b.type === 'flat_damage' && (b.style === 'all' || b.style === 'melee'));
    if (flatDamageBuff && successfulHit) {
        playerDamage += flatDamageBuff.value;
    }

    const damageOnHitBuff = activeBuffs.find(b => b.type === 'damage_on_hit' && (b.style === 'all' || b.style === 'melee'));
    if (damageOnHitBuff && successfulHit) {
        playerDamage += damageOnHitBuff.value;
    }

    const isMax = successfulHit && playerDamage > 0 && playerDamage === finalMaxHit && finalMaxHit >= 2;

    if (playerDamage > 0) {
        xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + Math.round(playerDamage * 1.33);
        if (combatStance === CombatStance.Accurate) xpGains[SkillName.Attack] = (xpGains[SkillName.Attack] || 0) + playerDamage * 4;
        else if (combatStance === CombatStance.Aggressive) xpGains[SkillName.Strength] = (xpGains[SkillName.Strength] || 0) + playerDamage * 4;
        else if (combatStance === CombatStance.Defensive) xpGains[SkillName.Defence] = (xpGains[SkillName.Defence] || 0) + playerDamage * 4;
    }

    const weaponPoison = weaponSlot?.statsOverride?.poisoned;
    const potionPoisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit' && (b.style === 'all' || b.style === 'melee'));
    let poisonToApply: { chance: number, damage: number } | null = null;
    if (weaponPoison) {
        poisonToApply = { chance: weaponPoison.chance, damage: weaponPoison.damage };
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
        animationOptions: { type: playerAttackStyle }
    };
};
