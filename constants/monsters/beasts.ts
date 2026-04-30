import { Monster, MonsterType, SkillName, MonsterId } from '@/types';

export const beasts: Monster[] = [
    {
        id: 'abyssal_leech' as MonsterId, name: 'Abyssal Leech', level: 42, maxHp: 55, attack: 38, strength: 40, defence: 40,
        stabDefence: 20, slashDefence: 20, crushDefence: 20, rangedDefence: 25, magicDefence: 25,
        iconUrl: 'leeching-worm',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'raw_lobster', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'hex_rune', chance: "1/4", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'raw_eel', chance: "1/8", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 2, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'ancient_ammonite' as MonsterId, name: 'Ancient Ammonite', level: 48, maxHp: 110, attack: 40, strength: 45, defence: 55,
        stabDefence: 60, slashDefence: 60, crushDefence: 65, rangedDefence: 55, magicDefence: 30,
        iconUrl: 'ammonite',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ancient_fossil', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'anima_rune', chance: "1/10", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'uncut_diamond', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 20, maxQuantity: 40 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 5, respawnTime: 180000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bear' as MonsterId, name: 'Bear', level: 18, maxHp: 35, attack: 16, strength: 18, defence: 15,
        stabDefence: 12, slashDefence: 10, crushDefence: 15, rangedDefence: 8, magicDefence: 5,
        iconUrl: 'bear-head',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'bear_pelt', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rich_animal_fat', chance: '1/3', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 2, maxQuantity: 8 },
            { itemId: 'raw_beef', chance: "1/4", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'oak_logs', chance: "1/8", minQuantity: 1, maxQuantity: 3, noted: true },
            { tableId: 'herb_table', chance: "1/32" },
            { itemId: 'bronze_med_helm', chance: "1/64", minQuantity: 1, maxQuantity: 1 }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 40000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bog_mite' as MonsterId, name: 'Bog Mite', level: 26, maxHp: 45, attack: 20, strength: 22, defence: 25,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'mite',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/3", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'hex_rune', chance: "1/5", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'astral_rune', chance: "1/20", minQuantity: 2, maxQuantity: 4 },
            { tableId: 'affinity_robes_table', chance: "1/150", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 25000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'bog_serpent' as MonsterId, name: 'Bog Serpent', level: 40, maxHp: 120, attack: 35, strength: 38, defence: 35,
        stabDefence: 25, slashDefence: 30, crushDefence: 28, rangedDefence: 20, magicDefence: 15,
        iconUrl: 'sea-serpent',
        guaranteedDrops: [
            { itemId: 'serpent_scale', minQuantity: 1, maxQuantity: 3 },
            { itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 },
        ],
        mainDrops: [
            { itemId: 'slimy_egg_shells', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'flux_rune', chance: "1/10", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'verdant_rune', chance: "1/12", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'nexus_rune', chance: "1/25", minQuantity: 1, maxQuantity: 4 },
            { itemId: 'passage_rune', chance: "1/30", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'serpents_egg', chance: "1/60", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/60", minQuantity: 1, maxQuantity: 2 },
            { tableId: 'affinity_robes_table', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'rich_animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 90000, aggressive: true, attackStyle: 'slash',
        specialAttacks: [
            { name: 'Venom Spit', chance: 0.25, effect: 'poison', damage: 6, poisonChance: 0.5 },
        ],
    },
    {
        id: 'chasm_crawler' as MonsterId, name: 'Chasm Crawler', level: 48, maxHp: 55, attack: 40, strength: 42, defence: 45,
        stabDefence: 40, slashDefence: 30, crushDefence: 35, rangedDefence: 25, magicDefence: 20,
        iconUrl: 'insect-jaws',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coal', chance: "1/5", minQuantity: 3, maxQuantity: 9, noted: true },
            { itemId: 'mithril_ore', chance: "1/20", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'stone_rune', chance: "1/4", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'chicken' as MonsterId, name: 'Chicken', level: 2, maxHp: 3, attack: 1, customMaxHit: 0, strength: 1, defence: 1,
        stabDefence: -15, slashDefence: -15, crushDefence: -15, rangedDefence: -15, magicDefence: -10,
        iconUrl: 'chicken',
        guaranteedDrops: [
            { itemId: 'raw_chicken', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 1, maxQuantity: 20 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'eggs', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 10000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'cow' as MonsterId, name: 'Cow', level: 2, maxHp: 8, attack: 1, strength: 2, defence: 2,
        stabDefence: -10, slashDefence: -10, crushDefence: -10, rangedDefence: -10, magicDefence: -10,
        iconUrl: 'cow',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cowhide', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tallow', chance: '1/20', minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 15000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'crystal_grazer' as MonsterId, name: 'Crystal Grazer', level: 43, maxHp: 60, attack: 30, strength: 30, defence: 40,
        stabDefence: 35, slashDefence: 35, crushDefence: 35, rangedDefence: 30, magicDefence: 30,
        iconUrl: 'bison',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'crystal_shard', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'resonating_crystal', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'rune_essence', chance: "1/10", minQuantity: 5, maxQuantity: 15, noted: true },
            { itemId: 'mithril_ore', chance: "1/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'fishing_bait', chance: "1/5", minQuantity: 5, maxQuantity: 15 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 40000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'crystal_scuttler' as MonsterId, name: 'Crystal Scuttler', level: 40, maxHp: 65, attack: 32, strength: 30, defence: 45,
        stabDefence: 45, slashDefence: 45, crushDefence: 50, rangedDefence: 40, magicDefence: 25,
        iconUrl: 'trilobite',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'scuttler_shell_fragment', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'crystalline_chitin', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'binding_rune', chance: "1/8", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'mithril_dagger', chance: "1/64" }
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 50000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'crystal_hydra' as MonsterId, name: 'Crystal Hydra', level: 100, maxHp: 150, attack: 1, magic: 90, customMaxHit: 14, strength: 50, defence: 100,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -80,
        iconUrl: 'hydra',
        guaranteedDrops: [
            { itemId: 'dragon_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'crystal_shard', minQuantity: 5, maxQuantity: 10 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/2', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aether_rune', chance: "1/3", minQuantity: 15, maxQuantity: 30 },
            { tableId: 'gem_table', chance: "1/8", minQuantity: 1, maxQuantity: 1, noted: true },
            { tableId: 'robes_of_power_table', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tome_of_the_arcane', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/8", minQuantity: 2, maxQuantity: 4, noted: true },
            { itemId: 'cooked_shark', chance: "1/1", minQuantity: 2, maxQuantity: 4 },
            { itemId: 'rune_essence', chance: "1/1", minQuantity: 100, maxQuantity: 125, noted: true }
        ],
        types: [MonsterType.Beast, MonsterType.Elemental], attackSpeed: 4, respawnTime: 60000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Shattering Roar', chance: 0.3, effect: 'stat_drain_multi', skills: [{ skill: SkillName.Defence, value: -3 }, { skill: SkillName.Magic, value: -3 }] }],
    },
    {
        id: 'crystalline_spider' as MonsterId, name: 'Crystalline Spider', level: 62, maxHp: 70, attack: 1, magic: 52, customMaxHit: 9, strength: 30, defence: 60,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'spider-alt',
        guaranteedDrops: [{ itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'crystal_shard', chance: '1/2', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'astral_rune', chance: '1/5', minQuantity: 3, maxQuantity: 8 },
            { itemId: 'rune_essence', chance: '1/3', minQuantity: 10, maxQuantity: 25, noted: true },
            { itemId: 'cooked_tuna', chance: '1/4', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'runic_dagger', chance: '1/64', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_silk', chance: '1/5', minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'spider_eggs', chance: '1/8', minQuantity: 1, maxQuantity: 3, noted: true }
        ],
        types: [MonsterType.Beast, MonsterType.Elemental], attackSpeed: 4, respawnTime: 28000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'crystalline_tortoise' as MonsterId, name: 'Crystalline Tortoise', level: 38, maxHp: 70, attack: 30, strength: 25, defence: 50,
        stabDefence: 40, slashDefence: 40, crushDefence: 45, rangedDefence: 35, magicDefence: 20,
        iconUrl: 'tortoise',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'hex_rune', chance: "1/12", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'uncut_diamond', chance: "1/500", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "1/80", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: "1/10", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'mithril_pickaxe', chance: "1/64" }
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 6, respawnTime: 60000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'deep_lurker' as MonsterId, name: 'Deep Lurker', level: 51, maxHp: 70, attack: 45, strength: 50, defence: 45,
        stabDefence: 30, slashDefence: 35, crushDefence: 32, rangedDefence: 25, magicDefence: 20,
        iconUrl: 'sea-serpent',
        mainDrops: [
            { itemId: 'rich_animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_eel', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'nexus_rune', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aether_rune', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_ore', chance: "1/15", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'fishing_bait', chance: "1/5", minQuantity: 10, maxQuantity: 20 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 90000, aggressive: true, attackStyle: 'slash'
    },
    {
        id: 'giant_clam' as MonsterId, name: 'Giant Clam', level: 45, maxHp: 50, attack: 35, strength: 30, defence: 60,
        stabDefence: 100, slashDefence: 100, crushDefence: 100, rangedDefence: 80, magicDefence: 5,
        iconUrl: 'sewed-shell',
        guaranteedDrops: [
            { itemId: 'raw_tuna', minQuantity: 1, maxQuantity: 2, noted: true },
        ],
        mainDrops: [
            { itemId: 'rich_animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'eldritch_pearl', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'gem_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_tuna', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'fishing_bait', chance: "1/8", minQuantity: 10, maxQuantity: 20 }
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 8, respawnTime: 75000, aggressive: false, attackStyle: 'crush', alwaysDrops: true,
    },
    {
        id: 'giant_crab' as MonsterId, name: 'Giant Crab', level: 9, maxHp: 25, attack: 8, strength: 8, defence: 12,
        stabDefence: 15, slashDefence: 15, crushDefence: 12, rangedDefence: 10, magicDefence: 0,
        iconUrl: 'crab',
        guaranteedDrops: [
            { itemId: 'giant_crab_meat', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'giant_crab_claw', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'giant_hornet' as MonsterId, name: 'Giant Hornet', level: 14, maxHp: 22, attack: 1, ranged: 15, strength: 7, defence: 12,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 15, magicDefence: 10,
        iconUrl: 'wasp-sting',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/2", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'feathers', chance: "1/4", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'bobby_pin', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_arrow', chance: "1/25", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: "1/20" }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 2, respawnTime: 25000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
    },
    {
        id: 'giant_toad' as MonsterId, name: 'Giant Toad', level: 15, maxHp: 23, attack: 7, strength: 14, defence: 8,
        stabDefence: 8, slashDefence: 8, crushDefence: 10, rangedDefence: 5, magicDefence: 5,
        iconUrl: 'frog',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'hex_rune', chance: "1/10", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'spiked_toad_skin', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/25", minQuantity: 1, maxQuantity: 3 },
            { tableId: 'herb_table', chance: "1/20" },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 1, maxQuantity: 5 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'giant_rat' as MonsterId, name: 'Giant Rat', level: 2, maxHp: 5, attack: 1, strength: 2, defence: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'rat',
        guaranteedDrops: [
            { itemId: 'rat_tail', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4' },
            { itemId: 'fishing_bait', chance: "1/8", minQuantity: 1, maxQuantity: 4 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 20000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'giant_spider' as MonsterId, name: 'Giant Spider', level: 7, maxHp: 15, attack: 3, strength: 5, defence: 5,
        stabDefence: 2, slashDefence: 2, crushDefence: 2, rangedDefence: 4, magicDefence: 0,
        iconUrl: 'spider-face',
        guaranteedDrops: [
            { itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'raw_beef', chance: '1/3', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'oak_logs', chance: "1/10", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'bear_pelt', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_med_helm', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: "1/32" },
            { itemId: 'bronze_dagger', chance: "1/64", minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'glimmerhorn_stag' as MonsterId, name: 'Glimmerhorn Stag', level: 16, maxHp: 20, attack: 10, strength: 15, defence: 15,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 5, magicDefence: 0,
        iconUrl: 'stag-head',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmer_thread_fiber', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'glimmerhorn_antler', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'fey_dust', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/32" },
            { itemId: 'iron_arrow', chance: "1/64", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 2, maxQuantity: 6 }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.0625, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 35000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'gloom_weaver' as MonsterId, name: 'Gloom Weaver', level: 54, maxHp: 65, attack: 1, magic: 50, strength: 25, defence: 40,
        stabDefence: 35, slashDefence: 35, crushDefence: 35, rangedDefence: 40, magicDefence: 40,
        iconUrl: 'spider-face',
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'magic',
        poisonsOnHit: { chance: 0.25, damage: 6 },
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_eye', chance: '1/5', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'spider_silk', chance: '1/3', minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'mithril_sword', chance: '1/32' },
            { itemId: 'mithril_kiteshield', chance: '1/40' },
            { itemId: 'adamantite_dagger', chance: '1/64' },
            { itemId: 'adamantite_scimitar', chance: '1/100' },
            { itemId: 'verdant_rune', chance: '1/10', minQuantity: 5, maxQuantity: 15 },
        ],
        alwaysDrops: true,
    },
    {
        id: 'harpy' as MonsterId, name: 'Harpy', level: 22, maxHp: 35, attack: 1, ranged: 20, strength: 10, defence: 20,
        stabDefence: 12, slashDefence: 12, crushDefence: 10, rangedDefence: 15, magicDefence: 5,
        iconUrl: 'harpy',
        guaranteedDrops: [
            { itemId: 'feathers', minQuantity: 10, maxQuantity: 30 },
            { itemId: 'gust_rune', minQuantity: 10, maxQuantity: 20 },
        ],
        mainDrops: [
            { itemId: 'harpy_talon', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'harpy_feather', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 40000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    {
        id: 'hydra_hatchling' as MonsterId, name: 'Hydra Hatchling', level: 59, maxHp: 70, attack: 1, ranged: 55, strength: 30, defence: 50,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 45, magicDefence: 45,
        iconUrl: 'hydra-shot',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rich_animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_arrow', chance: "1/2", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'aqua_rune', chance: "1/3", minQuantity: 30, maxQuantity: 50 },
            { itemId: 'mithril_bar', chance: "1/20", minQuantity: 1, maxQuantity: 2, noted: true },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Dragon], attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'ranged',
    },
    {
        id: 'jungle_stalker' as MonsterId, name: 'Jungle Stalker', level: 41, maxHp: 80, attack: 42, strength: 45, defence: 35,
        stabDefence: 35, slashDefence: 40, crushDefence: 30, rangedDefence: 25, magicDefence: 15,
        iconUrl: 'saber-toothed-cat-head',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/3", minQuantity: 15, maxQuantity: 30 },
            { itemId: 'nexus_rune', chance: "1/8", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'raw_beef', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 100000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'mountain_goat' as MonsterId, name: 'Mountain Goat', level: 18, maxHp: 30, attack: 15, strength: 18, defence: 16,
        stabDefence: 10, slashDefence: 10, crushDefence: 12, rangedDefence: 8, magicDefence: 5,
        iconUrl: 'ram',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'stone_rune', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'iron_ore', chance: "1/12", minQuantity: 1, maxQuantity: 1, noted: true },
            { tableId: 'herb_table', chance: "1/25" }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'salt_flat_skitterer' as MonsterId, name: 'Salt Flat Skitterer', level: 32, maxHp: 48, attack: 25, strength: 28, defence: 30,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 18, magicDefence: 8,
        iconUrl: 'spider-bot',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/6", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'mithril_dagger', chance: "1/64" },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 5, maxQuantity: 10 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 28000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'salt_leaper' as MonsterId, name: 'Salt Leaper', level: 35, maxHp: 55, attack: 28, strength: 30, defence: 32,
        stabDefence: 25, slashDefence: 25, crushDefence: 30, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'frog',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/5", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'gust_rune', chance: "1/8", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'crystalline_chitin', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_med_helm', chance: "1/64" },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 5, maxQuantity: 15 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'salt_preserved_vulture' as MonsterId, name: 'Salt-Preserved Vulture', level: 34, maxHp: 50, attack: 26, strength: 28, defence: 30,
        stabDefence: 22, slashDefence: 22, crushDefence: 25, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'vulture',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 5, maxQuantity: 15 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/5", minQuantity: 12, maxQuantity: 22 },
            { itemId: 'rock_salt', chance: "1/6", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'raw_chicken', chance: "1/8", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'mithril_arrow', chance: "1/25", minQuantity: 5, maxQuantity: 15 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 35000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'swamp_horror' as MonsterId, name: 'Swamp Horror', level: 41, maxHp: 60, attack: 22, strength: 25, defence: 25,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 15, magicDefence: 10,
        iconUrl: 'lizardman',
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "3/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'yew_logs', chance: "1/6", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: "2/5", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'hex_rune', chance: "7/20", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 3, maxQuantity: 7 },
            { tableId: 'affinity_robes_table', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_tuna', chance: "1/15", minQuantity: 1, maxQuantity: 3, noted: true }
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 60000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'tavern_rat' as MonsterId, name: 'Giant Rat', level: 5, maxHp: 7, attack: 3, strength: 4, defence: 3,
        stabDefence: 4, slashDefence: 2, crushDefence: 3, rangedDefence: 1, magicDefence: -10,
        iconUrl: 'rat',
        guaranteedDrops: [
            { itemId: 'rat_tail', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 20000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'tidal_crawler' as MonsterId, name: 'Tidal Crawler', level: 38, maxHp: 80, attack: 30, strength: 32, defence: 35,
        stabDefence: 45, slashDefence: 45, crushDefence: 40, rangedDefence: 30, magicDefence: 10,
        iconUrl: 'trilobite',
        mainDrops: [
            { itemId: 'rich_animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'nexus_rune', chance: "1/6", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'hex_rune', chance: "1/8", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'raw_eel', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'mithril_arrow', chance: "1/32", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'affinity_robes_table', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 70000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'treant_sapling' as MonsterId, name: 'Treant Sapling', level: 17, maxHp: 38, attack: 15, strength: 18, defence: 15,
        stabDefence: 5, slashDefence: 20, crushDefence: 20, rangedDefence: 10, magicDefence: 5,
        iconUrl: 'evil-tree',
        fireWeakness: 0.5,
        guaranteedDrops: [
            { itemId: 'willow_logs', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'enchanted_bark', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bloodroot_tendril', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "9/50", minQuantity: 4, maxQuantity: 8 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 1 / 32, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast], attackSpeed: 6, respawnTime: 50000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'tutorial_rat' as MonsterId, name: 'Tutorial Rat', level: 1, maxHp: 5, attack: 1, customMaxHit: 1, strength: 1, defence: 1,
        stabDefence: -50, slashDefence: -50, crushDefence: -50, rangedDefence: -50, magicDefence: -50,
        iconUrl: 'rat',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 10000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'unicorn' as MonsterId, name: 'Unicorn', level: 20, maxHp: 40, attack: 10, magic: 15, strength: 10, defence: 20,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 20, magicDefence: 25,
        iconUrl: 'unicorn',
        guaranteedDrops: [
            { itemId: 'unicorn_horn', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'beast_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "3/20", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'fey_dust', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'anima_rune', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/20" }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 1 / 16, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 300000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'wild_boar' as MonsterId, name: 'Wild Boar', level: 11, maxHp: 22, attack: 7, strength: 10, defence: 10,
        stabDefence: 4, slashDefence: 4, crushDefence: 6, rangedDefence: 2, magicDefence: 0,
        iconUrl: 'boar-tusks',
        guaranteedDrops: [
            { itemId: 'raw_boar_meat', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'boar_hide', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'boar_tusk', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', chance: "1/2", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'fishing_bait', chance: "1/8", minQuantity: 1, maxQuantity: 5 },
            { tableId: 'herb_table', chance: "1/32" },
            { itemId: 'bronze_arrow', chance: "1/32", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'oak_logs', chance: "1/15", minQuantity: 1, maxQuantity: 1, noted: true },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'wolf' as MonsterId, name: 'Wolf', level: 15, maxHp: 25, attack: 14, strength: 15, defence: 12,
        stabDefence: 8, slashDefence: 12, crushDefence: 6, rangedDefence: 10, magicDefence: 4,
        iconUrl: 'wolf-head',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wolf_pelt', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'animal_fat', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: "1/8", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'frost_berries', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/12", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: "1/32" }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 30000, aggressive: true, attackStyle: 'slash',
    },
];