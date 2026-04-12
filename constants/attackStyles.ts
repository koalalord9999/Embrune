import { CombatStance, WeaponType } from '../types';

export interface AttackStyleDef {
    name: string;
    stance: CombatStance;
    attackType: 'stab' | 'slash' | 'crush';
    description: string;
}

export const ATTACK_STYLES: Partial<Record<WeaponType, AttackStyleDef[]>> = {
    [WeaponType.Unarmed]: [
        { name: 'Punch', stance: CombatStance.Accurate, attackType: 'crush', description: 'Attack Style: Crush | Trains: Attack' },
        { name: 'Kick', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Defence' },
    ],
    [WeaponType.Dagger]: [
        { name: 'Stab', stance: CombatStance.Accurate, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack' },
        { name: 'Lunge', stance: CombatStance.Aggressive, attackType: 'stab', description: 'Attack Style: Stab | Trains: Strength' },
        { name: 'Slash', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'stab', description: 'Attack Style: Stab | Trains: Defence' },
    ],
    [WeaponType.Sword]: [
        { name: 'Stab', stance: CombatStance.Accurate, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack' },
        { name: 'Lunge', stance: CombatStance.Controlled, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack, Strength & Defence' },
        { name: 'Slash', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'stab', description: 'Attack Style: Stab | Trains: Defence' },
    ],
    [WeaponType.Scimitar]: [
        { name: 'Chop', stance: CombatStance.Accurate, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack' },
        { name: 'Slash', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Lunge', stance: CombatStance.Controlled, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack, Strength & Defence' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Defence' },
    ],
    [WeaponType.Mace]: [
        { name: 'Pound', stance: CombatStance.Accurate, attackType: 'crush', description: 'Attack Style: Crush | Trains: Attack' },
        { name: 'Pummel', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Spike', stance: CombatStance.Aggressive, attackType: 'stab', description: 'Attack Style: Stab | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Defence' },
    ],
    [WeaponType.Warhammer]: [
        { name: 'Pound', stance: CombatStance.Accurate, attackType: 'crush', description: 'Attack Style: Crush | Trains: Attack' },
        { name: 'Pummel', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Defence' },
    ],
    [WeaponType.Battleaxe]: [
        { name: 'Chop', stance: CombatStance.Accurate, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack' },
        { name: 'Hack', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Smash', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Defence' },
    ],
    [WeaponType.Greatsword]: [
        { name: 'Slash', stance: CombatStance.Accurate, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack' },
        { name: 'Crush', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Slice', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Defence' },
    ],
    [WeaponType.Axe]: [
        { name: 'Chop', stance: CombatStance.Accurate, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack' },
        { name: 'Hack', stance: CombatStance.Aggressive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Strength' },
        { name: 'Smash', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Defence' },
    ],
    [WeaponType.Pickaxe]: [
        { name: 'Pick', stance: CombatStance.Accurate, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack' },
        { name: 'Smash', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Block', stance: CombatStance.Defensive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Defence' },
    ],
    [WeaponType.Spear]: [
        { name: 'Lunge', stance: CombatStance.Controlled, attackType: 'stab', description: 'Attack Style: Stab | Trains: Attack, Strength & Defence' },
        { name: 'Swipe', stance: CombatStance.Controlled, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack, Strength & Defence' },
        { name: 'Pound', stance: CombatStance.Controlled, attackType: 'crush', description: 'Attack Style: Crush | Trains: Attack, Strength & Defence' },
    ],
    [WeaponType.Whip]: [
        { name: 'Flick', stance: CombatStance.Accurate, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack' },
        { name: 'Lash', stance: CombatStance.Controlled, attackType: 'slash', description: 'Attack Style: Slash | Trains: Attack, Strength & Defence' },
        { name: 'Deflect', stance: CombatStance.Defensive, attackType: 'slash', description: 'Attack Style: Slash | Trains: Defence' },
    ],
    [WeaponType.Staff]: [
        { name: 'Bash', stance: CombatStance.Accurate, attackType: 'crush', description: 'Attack Style: Crush | Trains: Attack' },
        { name: 'Autocast', stance: CombatStance.Autocast, attackType: 'crush', description: 'Attack Style: Magic | Trains: Magic' },
        { name: 'Pound', stance: CombatStance.Aggressive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Strength' },
        { name: 'Defensive Cast', stance: CombatStance.DefensiveAutocast, attackType: 'crush', description: 'Attack Style: Magic | Trains: Magic & Defence' },
        { name: 'Focus', stance: CombatStance.Defensive, attackType: 'crush', description: 'Attack Style: Crush | Trains: Defence' },
    ],
    [WeaponType.Bow]: [
        { name: 'Accurate', stance: CombatStance.RangedAccurate, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Rapid', stance: CombatStance.RangedRapid, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Longrange', stance: CombatStance.RangedDefence, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged & Defence' },
    ],
    [WeaponType.Crossbow]: [
        { name: 'Accurate', stance: CombatStance.RangedAccurate, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Rapid', stance: CombatStance.RangedRapid, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Longrange', stance: CombatStance.RangedDefence, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged & Defence' },
    ],
    [WeaponType.Thrown]: [
        { name: 'Accurate', stance: CombatStance.RangedAccurate, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Rapid', stance: CombatStance.RangedRapid, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged' },
        { name: 'Longrange', stance: CombatStance.RangedDefence, attackType: 'crush', description: 'Attack Style: Ranged | Trains: Ranged & Defence' },
    ],
};

/**
 * Compact save keys for each weapon type. Kept to 1-2 chars to minimise save size.
 */
export const WEAPON_TYPE_SAVE_KEY: Partial<Record<WeaponType, string>> = {
    [WeaponType.Unarmed]: 'U',
    [WeaponType.Dagger]: 'Dg',
    [WeaponType.Sword]: 'Sw',
    [WeaponType.Scimitar]: 'Sc',
    [WeaponType.Mace]: 'Ma',
    [WeaponType.Axe]: 'Ax',
    [WeaponType.Pickaxe]: 'Pi',
    [WeaponType.Warhammer]: 'Wh',
    [WeaponType.Battleaxe]: 'Ba',
    [WeaponType.Greatsword]: 'Gs',
    [WeaponType.Spear]: 'Sp',
    [WeaponType.Whip]: 'Wi',
    [WeaponType.Staff]: 'St',
    [WeaponType.Bow]: 'Bo',
    [WeaponType.Crossbow]: 'Cb',
    [WeaponType.Thrown]: 'Th',
};

/** Reverse map: save key string -> WeaponType */
export const SAVE_KEY_TO_WEAPON_TYPE: Record<string, WeaponType> = Object.fromEntries(
    (Object.entries(WEAPON_TYPE_SAVE_KEY) as [WeaponType, string][]).map(([wt, key]) => [key, wt])
);
