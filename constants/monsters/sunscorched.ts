import { Monster, MonsterType, SkillName } from '@/types';

export const sunscorchedMonsters: Monster[] = [
    // --- 55-90 Tier (Max Hit ~12) ---
    {
        id: 'sand_scrabbler', name: 'Sand Scrabbler', level: 55, maxHp: 50, attack: 45, strength: 50, defence: 50,
        stabDefence: 55, slashDefence: 50, crushDefence: 45, rangedDefence: 40, magicDefence: 30,
        iconUrl: 'scarab-beetle',
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 20000, aggressive: true, attackStyle: 'stab', customMaxHit: 11,
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'animal_fat', chance: "1/5", minQuantity: 1, maxQuantity: 1 }
        ],
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'dune_stalker', name: 'Dune Stalker', level: 62, maxHp: 65, attack: 55, strength: 58, defence: 55,
        stabDefence: 50, slashDefence: 60, crushDefence: 45, rangedDefence: 55, magicDefence: 40,
        iconUrl: 'sand-snake',
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 25000, aggressive: true, attackStyle: 'slash', customMaxHit: 12,
        mainDrops: [
            { itemId: 'steel_square_shield', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_med_helm', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_med_helm', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_beef', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/15", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'iron_dagger', chance: "1/30", minQuantity: 1, maxQuantity: 1 }
        ],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'oasis_croc', name: 'Oasis Croc', level: 68, maxHp: 80, attack: 60, strength: 65, defence: 60,
        stabDefence: 65, slashDefence: 60, crushDefence: 70, rangedDefence: 55, magicDefence: 45,
        iconUrl: 'croc-sword',
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush', customMaxHit: 12,
        mainDrops: [
            { itemId: 'steel_chainbody', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_square_shield', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_tuna', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'waterskin', chance: "1/8", minQuantity: 1, maxQuantity: 1, doses: 4 },
            { itemId: 'aqua_rune', chance: "1/20", minQuantity: 10, maxQuantity: 30 },
            { itemId: 'leather_boots', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 10, maxQuantity: 25 }
        ],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'canyon_basilisk', name: 'Canyon Basilisk', level: 75, maxHp: 90, attack: 68, strength: 70, defence: 70,
        stabDefence: 75, slashDefence: 70, crushDefence: 65, rangedDefence: 70, magicDefence: 60,
        iconUrl: 'basilisk',
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'stab', customMaxHit: 12,
        mainDrops: [
            { itemId: 'mithril_chainbody', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_med_helm', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_ore', chance: "1/16", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_emerald', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_full_helm', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/20", minQuantity: 5, maxQuantity: 15 }
        ],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'sunstone_scorpion', name: 'Sunstone Scorpion', level: 82, maxHp: 100, attack: 75, strength: 78, defence: 80,
        stabDefence: 85, slashDefence: 75, crushDefence: 70, rangedDefence: 70, magicDefence: 65,
        iconUrl: 'scorpion',
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'stab', customMaxHit: 12,
        poisonsOnHit: { chance: 0.25, damage: 4 },
        mainDrops: [
            { itemId: 'arachnid_chitin', chance: "1/1", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'adamantite_square_shield', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_med_helm', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_med_helm', chance: "1/512", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunstone', chance: "1/2048", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'gem_table', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'weapon_poison_weak', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_ore', chance: "1/25", minQuantity: 1, maxQuantity: 2, noted: true }
        ],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'desert_nomad', name: 'Desert Nomad', level: 88, maxHp: 85, attack: 80, strength: 82, defence: 75,
        stabDefence: 70, slashDefence: 80, crushDefence: 65, rangedDefence: 75, magicDefence: 60,
        iconUrl: 'arabian-helmet',
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 50000, aggressive: false, attackStyle: 'slash', customMaxHit: 12,
        mainDrops: [
            { itemId: 'adamantite_chainbody', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_square_shield', chance: "1/512", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'waterskin', chance: "1/4", minQuantity: 1, maxQuantity: 1, doses: 4 },
            { itemId: 'steel_scimitar', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coins', chance: "1/5", minQuantity: 150, maxQuantity: 300 },
            { itemId: 'mithril_arrow', chance: "1/20", minQuantity: 5, maxQuantity: 20 },
            { itemId: 'steel_arrow', chance: "1/15", minQuantity: 10, maxQuantity: 30 }
        ],
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
    },

    // --- 90-120 Tier (Max Hit ~24) ---
    {
        id: 'blazing_efreeti', name: 'Blazing Efreeti', level: 95, maxHp: 110, attack: 1, magic: 90, strength: 1, defence: 85,
        stabDefence: 70, slashDefence: 70, crushDefence: 70, rangedDefence: 85, magicDefence: 95,
        iconUrl: 'ifrit',
        types: [MonsterType.Elemental, MonsterType.Demon], attackSpeed: 4, respawnTime: 90000, aggressive: true, attackStyle: 'magic', customMaxHit: 22,
        fireImmunity: true,
        mainDrops: [
            { itemId: 'adamantite_square_shield', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_chainbody', chance: "1/512", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_rune', chance: "1/1", minQuantity: 50, maxQuantity: 100 },
            { itemId: 'uncut_ruby', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_platelegs', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'coins', chance: "1/6", minQuantity: 600, maxQuantity: 1200 },
            { itemId: 'brimstone', chance: "1/10", minQuantity: 1, maxQuantity: 2 }
        ],
        guaranteedDrops: [{ itemId: 'ashes', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'sand_wyrm', name: 'Sand Wyrm', level: 105, maxHp: 180, attack: 95, strength: 100, defence: 100,
        stabDefence: 110, slashDefence: 90, crushDefence: 120, rangedDefence: 80, magicDefence: 70,
        iconUrl: 'sand-worm',
        types: [MonsterType.Dragon], attackSpeed: 6, respawnTime: 180000, aggressive: true, attackStyle: 'crush', customMaxHit: 24,
        mainDrops: [
            { itemId: 'runic_med_helm', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_med_helm', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'dragon_bones', chance: "1/1", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_bar', chance: "1/10", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'nexus_rune', chance: "1/25", minQuantity: 10, maxQuantity: 25 },
            { tableId: 'gem_table', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_platelegs', chance: "1/128", minQuantity: 1, maxQuantity: 1 }
        ],
        guaranteedDrops: [],
    },
    {
        id: 'temple_guardian', name: 'Temple Guardian', level: 115, maxHp: 150, attack: 100, strength: 105, defence: 120,
        stabDefence: 130, slashDefence: 130, crushDefence: 110, rangedDefence: 100, magicDefence: 80,
        iconUrl: 'mummy-head',
        types: [MonsterType.Undead, MonsterType.Armored], attackSpeed: 5, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash', customMaxHit: 24,
        mainDrops: [
            { itemId: 'runic_chainbody', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_square_shield', chance: "1/45", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_diamond', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_ring', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'amulet_of_strength', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coins', chance: "1/5", minQuantity: 500, maxQuantity: 2500 }
        ],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 }],
    },
];