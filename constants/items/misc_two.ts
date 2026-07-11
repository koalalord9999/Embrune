import { Item, EquipmentSlot } from '../../types';

export const misc_two: Item[] = [
    // Junk Items
    { id: 'old_boot', itemNum: 86, name: 'Old Boot', description: 'A soggy, worn-out boot. Not very useful.', stackable: false, value: 1, iconUrl: 'leather-boot', material: 'burnt' },
    { id: 'broken_arrow', itemNum: 87, name: 'Broken Arrow', description: 'A snapped arrow shaft. Useless for archery.', stackable: false, value: 0, iconUrl: 'broken-arrow', material: 'wood-normal' },
    { id: 'dull_rock', itemNum: 88, name: 'Dull Rock', description: 'Just a plain, boring rock.', stackable: false, value: 0, iconUrl: 'rock' },
    { id: 'tattered_cloth', itemNum: 89, name: 'Tattered Cloth', description: 'A scrap of old, torn cloth.', stackable: false, value: 1, iconUrl: 'ragged-wound' },
    { id: 'rusty_nail', itemNum: 90, name: 'Rusty Nail', description: 'A bent and rusty nail.', stackable: false, value: 0, iconUrl: 'nail', material: 'bronze' },
    { id: 'empty_jug', itemNum: 91, name: 'Empty Jug', description: 'An empty clay jug. Could be filled with something.', stackable: false, value: 2, iconUrl: 'jug' },
    { id: 'gnawed_bone', itemNum: 92, name: 'Gnawed Bone', description: 'A bone that has been chewed on by... something.', stackable: false, value: 1, iconUrl: 'bone-gnawer' },
    { id: 'consecrated_bones', itemNum: 93, name: 'Consecrated Bones', description: 'Bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 10, iconUrl: 'crossed-bones', material: 'diamond' },
    { id: 'consecrated_big_bones', itemNum: 94, name: 'Consecrated Big Bones', description: 'Large bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 50, iconUrl: 'crossed-bones', material: 'diamond' },
    { id: 'consecrated_dragon_bones', itemNum: 95, name: 'Consecrated Dragon Bones', description: 'Dragon bones that have been blessed at a holy altar. They radiate a faint light.', stackable: false, value: 200, iconUrl: 'dinosaur-bones', material: 'diamond' },
    { id: 'consecrated_frost_dragon_bones', itemNum: 96, name: 'Consecrated Frost Dragon Bones', description: 'Dragon bones that have been blessed at a holy altar. They radiate a faint light.', stackable: false, value: 2500, iconUrl: 'dinosaur-bones', material: 'diamond' },
    { id: 'sacred_dust', itemNum: 97, name: 'Sacred Dust', description: 'A fine powder made from consecrated bones. Used in holy rituals.', stackable: true, value: 5, iconUrl: 'powder' },
    { id: 'anointing_oil', itemNum: 98, name: 'Anointing Oil', description: 'A fragrant oil used to sanctify ritual components.', stackable: false, value: 100, iconUrl: 'potion-ball', material: 'potion-prayer' },
    { id: 'holy_paste', itemNum: 99, name: 'Holy Paste', description: 'A thick paste made from sacred dust and anointing oil. It can be offered at an altar.', stackable: true, value: 200, iconUrl: 'gooey-molecule' },
    { id: 'holy_water', itemNum: 100, name: 'Holy Water', description: 'Water blessed at a holy site. Used in sacred rituals.', stackable: false, value: 5, iconUrl: 'round-potion', emptyable: { emptyItemId: 'vial' }, material: 'potion-prayer' },


    // Herblore Secondaries
    { id: 'wyvern_claw', itemNum: 101, name: 'Wyvern Claw', description: 'A sharp claw from a Wyvern.', stackable: false, value: 1500, iconUrl: 'claw', material: 'rune-aether' },
    { id: 'imp_ashes', itemNum: 102, name: 'Imp Ashes', description: 'The volatile, magical ashes left behind by an imp.', stackable: false, value: 120, iconUrl: 'powder', material: 'burnt' },
    { id: 'troll_sweat', itemNum: 103, name: 'Troll Sweat', description: 'A vial of glistening, pungent sweat from an Ice Troll. Ew.', stackable: false, value: 800, iconUrl: 'potion-ball', material: 'vial-water' },
    { id: 'spectre_essence', itemNum: 104, name: 'Spectre Essence', description: 'A swirling, ethereal essence captured from a specter.', stackable: false, value: 450, iconUrl: 'soul', material: 'rune-astral' },
    { id: 'basilisk_eye', itemNum: 105, name: 'Basilisk Eye', description: 'The petrifying eye of a basilisk. Stares back at you.', stackable: false, value: 600, iconUrl: 'eye-shield', material: 'emerald' },
    { id: 'scorched_scale', itemNum: 106, name: 'Scorched Scale', description: 'A beasts scale that is permanently hot to the touch.', stackable: false, value: 750, iconUrl: 'energy-shield', material: 'rune-ember' },
    { id: 'frozen_fang', itemNum: 107, name: 'Frozen Fang', description: 'A fang from a Frostfang creature, perpetually coated in a thin layer of ice.', stackable: false, value: 700, iconUrl: 'animal-skull', material: 'rune-aqua' },
    { id: 'golem_shard', itemNum: 108, name: 'Golem Shard', description: 'A shard of animated rock from a golem.', stackable: false, value: 300, iconUrl: 'crystal-cluster', material: 'rune-stone' },
    { id: 'dryad_branch', itemNum: 109, name: 'Dryad Branch', description: 'A small, living branch that hums with the life of the forest.', stackable: false, value: 250, iconUrl: 'birch-trees', material: 'wood-willow' },
    { id: 'arachnid_chitin', itemNum: 110, name: 'Arachnid Chitin', description: 'A hard piece of chitin from a large spider or scorpion.', stackable: false, value: 180, iconUrl: 'insect-jaws', material: 'bronze' },
    { id: 'spider_eye', itemNum: 111, name: 'Spider Eye', description: 'A glistening, multi-faceted eye from a large spider.', stackable: false, value: 50, iconUrl: 'eye-target', material: 'uncut-ruby' },

    // Slayer Misc Drops
    { id: 'severed_zombie_hand', itemNum: 112, name: 'Severed Zombie Hand', description: 'A gruesome trophy. It still twitches occasionally.', stackable: false, value: 100, iconUrl: 'severed-hand' },
    { id: 'salt_crusted_hide', itemNum: 113, name: 'Salt-Crusted Hide', description: 'A tough, slimy hide covered in abrasive salt crystals.', stackable: false, value: 250, iconUrl: 'animal-hide', material: 'leather' },
    { id: 'basilisk_scale', itemNum: 114, name: 'Basilisk Scale', description: 'A stone-like scale from a basilisk. Surprisingly heavy.', stackable: false, value: 400, iconUrl: 'scaly-skin' },
    { id: 'petrifying_eye', itemNum: 115, name: 'Petrifying Eye', description: 'The eye of a Gaze Fiend. Even severed, its gaze is unsettling.', stackable: false, value: 1000, iconUrl: 'eye-shield' },
    { id: 'infernal_key_fragment', itemNum: 116, name: 'Infernal Key Fragment', description: 'A piece of a key that radiates a malevolent heat.', stackable: false, value: 0, iconUrl: 'key', material: 'rune-ember', combinable: true },
    { id: 'infernal_key', itemNum: 794, name: 'Infernal Key', description: 'A fully formed key pulsing with a dark, intense heat.', stackable: false, value: 0, iconUrl: 'key', material: 'rune-ember' },
    { id: 'wraith_talons', itemNum: 117, name: 'Wraith Talons', description: 'Sharp, ethereal talons that feel cold to the touch.', stackable: false, value: 300, iconUrl: 'bird-claw' },
    { id: 'ailment_echo', itemNum: 118, name: 'Ailment Echo', description: 'A crystallized echo of a creature\'s dying scream.', stackable: false, value: 750, iconUrl: 'sound-waves' },
    { id: 'viscous_orb', itemNum: 119, name: 'Viscous Orb', description: 'A pulsating orb of thick, gelatinous matter.', stackable: false, value: 600, iconUrl: 'gooey-molecule' },
    { id: 'flaming_gullet', itemNum: 120, name: 'Flaming Gullet', description: "The petrified, still-smouldering gullet of an ancient dragon. Can be combined with a Fire-Resistant Shield at level 75 Smithing to create a Dragonfire Shield, or taken to Borin for a fee.", stackable: false, value: 800000, iconUrl: 'liver', material: 'rune-ember' },
    // --- Fire Flask Components ---
    { id: 'throwing_flask', itemNum: 121, name: 'Throwing Flask', description: 'A thin, fragile glass flask, designed to be thrown and shattered.', stackable: true, value: 5, iconUrl: 'round-potion' },
    { id: 'rendering_kit', itemNum: 122, name: 'Rendering Kit', description: 'A kit containing tools for rendering fat into oil.', stackable: false, value: 15, iconUrl: 'toolbox' },
    { id: 'wool_string', itemNum: 123, name: 'Wool String', description: 'A piece of string made from wool, perfect for a fuse.', stackable: true, value: 1, iconUrl: 'thread' },
    { id: 'fire_pot', itemNum: 124, name: 'Fire Pot', description: 'A pot containing slow-burning tinder. Used to light flasks as you throw them.', stackable: false, value: 20, iconUrl: 'fire-bowl' },
    { id: 'fire_pot_lit', itemNum: 125, name: 'Lit Fire Pot', description: 'A pot of burning embers. Provides the flame needed to light fire flasks.', stackable: false, value: 20, iconUrl: 'fire-bowl', material: 'rune-ember', equipment: { slot: EquipmentSlot.Ammo, rangedAttack: 0, rangedStrength: 0 } },
    { id: 'x_mix', itemNum: 126, name: 'X Mix', description: 'A strange, volatile powder sold by Slayer Masters. Alters fire flasks to harm fire-resistant creatures.', stackable: true, value: 15, iconUrl: 'powder' },

    // --- Fats (Resources) ---
    { id: 'animal_fat', itemNum: 127, name: 'Animal Fat', description: 'Fat from a common animal.', stackable: false, value: 5, iconUrl: 'bubbling-bowl', material: 'gold' },
    { id: 'tallow', itemNum: 128, name: 'Tallow', description: 'A harder, more refined animal fat.', stackable: false, value: 10, iconUrl: 'bubbling-bowl', material: 'bronze' },
    { id: 'rich_animal_fat', itemNum: 129, name: 'Rich Animal Fat', description: 'High-quality fat from a large beast.', stackable: false, value: 15, iconUrl: 'bubbling-bowl', material: 'copper' },
    { id: 'beast_fat', itemNum: 130, name: 'Beast Fat', description: 'Fat from a magical creature, humming with energy.', stackable: false, value: 20, iconUrl: 'bubbling-bowl', material: 'raw-meat' },
    { id: 'titan_fat', itemNum: 131, name: 'Titan Fat', description: 'Dense, heavy fat from a giant-kin.', stackable: false, value: 25, iconUrl: 'bubbling-bowl', material: 'burnt' },
    { id: 'dragon_fat', itemNum: 132, name: 'Dragon Fat', description: 'Fat from a dragon. It feels warm to the touch.', stackable: false, value: 50, iconUrl: 'bubbling-bowl', material: 'rune-ember' },

    // --- New Fire Flask Crafting Items ---
    { id: 'throwing_flask_fused', itemNum: 133, name: 'Fused Throwing Flask', description: 'A fragile glass flask with a wick attached.', stackable: true, value: 6, iconUrl: 'round-potion' },
    { id: 'refined_grease_flask', itemNum: 134, name: 'Refined Grease Flask', description: 'A flask of purified grease, ready to be lit.', stackable: true, value: 10, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'animal_fat_flask', itemNum: 135, name: 'Animal Fat Flask', description: 'A flask of rendered animal fat, ready to be lit.', stackable: true, value: 20, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'tallow_flask', itemNum: 136, name: 'Tallow Flask', description: 'A flask of flammable tallow, ready to be lit.', stackable: true, value: 35, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'rich_animal_fat_flask', itemNum: 137, name: 'Rich Animal Fat Flask', description: 'A flask of highly flammable rich animal fat, ready to be lit.', stackable: true, value: 50, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'beast_fat_flask', itemNum: 138, name: 'Beast Fat Flask', description: 'A flask of magical beast fat that burns with an unnatural flame.', stackable: true, value: 75, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'titan_fat_flask', itemNum: 139, name: 'Titan Fat Flask', description: 'A flask of dense titan fat that burns for a long time.', stackable: true, value: 100, iconUrl: 'molotov', material: 'rune-ember' },
    { id: 'dragon_fat_flask', itemNum: 140, name: 'Dragon Fat Flask', description: 'A flask filled with dragon fat, ready to be lit.', stackable: true, value: 200, iconUrl: 'molotov', material: 'rune-ember' },

    // Glassblowing Products
    { id: 'glass_bowl', itemNum: 141, name: 'Glass Bowl', description: 'A simple glass bowl.', stackable: false, value: 15, iconUrl: 'aquarium', material: 'vial' },
    { id: 'glass_jar', itemNum: 142, name: 'Glass Jar', description: 'An empty glass jar. Could be used to hold things.', stackable: false, value: 15, iconUrl: 'mason-jar', material: 'vial' },

    // Sorcerer's Trial Items
    { id: 'cracked_runic_tablet', itemNum: 143, name: 'Cracked Runic Tablet', description: 'A heavy stone tablet covered in arcane symbols. It appears to be part of a larger formula, but it is damaged and incomplete.', stackable: false, value: 0, iconUrl: 'broken-tablet' },
    { id: 'fragment_of_intent', itemNum: 144, name: 'Fragment of Intent', description: 'A sliver of stone covered in flowing, almost liquid script. It describes the purpose and will behind a spell.', stackable: false, value: 0, iconUrl: 'scroll-unfurled' },
    { id: 'fragment_of_shape', itemNum: 145, name: 'Fragment of Shape', description: 'A mental imprint of an intricate runic shape, gained from an ancient monolith.', stackable: false, value: 0, iconUrl: 'rune-stone' },
    { id: 'inert_rune_of_attunement', itemNum: 146, name: 'Inert Rune of Attunement', description: 'A newly crafted rune that lacks a magical charge. It feels cold and dead.', stackable: false, value: 0, iconUrl: 'rune-stone', material: 'rune-stone' },
    { id: 'imprinted_rune_of_attunement', itemNum: 147, name: 'Imprinted Rune of Attunement', description: 'A rune humming with raw elemental power. It is a testament to mastery over Creation.', stackable: false, value: 0, iconUrl: 'rune-stone', material: 'runic' },
    { id: 'unstable_core', itemNum: 148, name: 'Unstable Core', description: "A dangerously twitchy core of raw magical energy, contained within a Wyvern Claw. It feels like it could explode at any moment.", stackable: false, value: 0, iconUrl: 'nuclear-bomb', material: 'rune-ember' },
    { id: 'tempered_core', itemNum: 149, name: 'Tempered Core', description: "The unstable energy has been tempered against heat, pressure, and silence. It now hums with a controlled, steady power.", stackable: false, value: 0, iconUrl: 'atom', material: 'rune-astral' },
    { id: 'core_of_controlled_destruction', itemNum: 150, name: 'Core of Controlled Destruction', description: "The once-chaotic energy now sits dormant, waiting for a command. It is a testament to mastery over Destruction.", stackable: false, value: 0, iconUrl: 'orbital', material: 'runic' },
    { id: 'shard_of_true_ice', itemNum: 151, name: 'Shard of True Ice', description: 'A piece of ice that never melts. It is cold enough to shatter magical structures.', stackable: false, value: 0, iconUrl: 'crystal-growth', material: 'rune-aqua' },
    { id: 'bar_of_transmuted_gold', itemNum: 152, name: 'Bar of Transmuted Gold', description: 'A bar of pure, magical gold, transmuted from runic metal. A testament to mastery over Transmutation.', stackable: false, value: 0, iconUrl: 'gold-bar', material: 'gold-runic' },

    // Miscellaneous
    { id: 'casket', itemNum: 153, name: 'Casket', description: 'A locked, water-logged casket. It might contain something valuable.', stackable: false, value: 1500, iconUrl: 'locked-chest', material: 'gold', consumable: { special: 'fishing_casket' } },

    // Slayer Shop Dummy Items (Special Actions)
    { id: 'slayer_rune_pack', name: 'Slayer Rune Pack', description: 'Contains 100 Nexus Runes and 500 Gust Runes.', stackable: false, value: 0, iconUrl: 'backpack', hidden: true },
    { id: 'slayer_task_expansion', name: 'Task Expansion', description: 'Doubles your current slayer task count. Can only be used if your task progress is 0.', stackable: false, value: 0, iconUrl: 'expand', hidden: true },
    { id: 'slayer_task_shrink', name: 'Task Shrink', description: 'Sets your current slayer task count to 5. Can only be used if your task progress is 0.', stackable: false, value: 0, iconUrl: 'contract', hidden: true },

    // Scales of the Swamp Quest Items
    { id: 'swamp_ward_bundle', itemNum: 795, name: 'Swamp Ward Bundle', description: 'A waxy bundle prepared by Anise. Burn it to counteract the Coil\'s miasma.', stackable: false, value: 0, iconUrl: 'bindle' },
    { id: 'sealed_convoy_document', itemNum: 796, name: 'Sealed Convoy Document', description: 'A sealed document containing records of unmarked royal convoys on the King\'s Road.', stackable: false, value: 0, iconUrl: 'scroll-unfurled' },
    { id: 'voss_signed_testimony', itemNum: 797, name: 'Signed Testimony', description: 'A written confession and testimony signed by Garath Voss, the Coilmaster.', stackable: false, value: 0, iconUrl: 'tied-scroll' },
    { id: 'bandit_iron_badge', itemNum: 798, name: 'Bandit Iron Badge', description: 'An iron badge worn by the Serpent Bandits\' scouts.', stackable: false, value: 0, iconUrl: 'metal-scale' },
];