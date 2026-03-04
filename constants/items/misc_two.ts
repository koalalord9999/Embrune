import { Item, EquipmentSlot } from '../../types';

export const misc_two: Item[] = [
    // Junk Items
    { id: 'old_boot', name: 'Old Boot', description: 'A soggy, worn-out boot. Not very useful.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:leather-boot.svg', material: 'burnt' },
    { id: 'broken_arrow', name: 'Broken Arrow', description: 'A snapped arrow shaft. Useless for archery.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:broken-arrow.svg', material: 'wood-normal' },
    { id: 'dull_rock', name: 'Dull Rock', description: 'Just a plain, boring rock.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:rock.svg' },
    { id: 'tattered_cloth', name: 'Tattered Cloth', description: 'A scrap of old, torn cloth.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:ragged-wound.svg' },
    { id: 'rusty_nail', name: 'Rusty Nail', description: 'A bent and rusty nail.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:nail.svg', material: 'bronze' },
    { id: 'empty_jug', name: 'Empty Jug', description: 'An empty clay jug. Could be filled with something.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:jug.svg' },
    { id: 'gnawed_bone', name: 'Gnawed Bone', description: 'A bone that has been chewed on by... something.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:bone-gnawer.svg' },
    { id: 'consecrated_bones', name: 'Consecrated Bones', description: 'Bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', material: 'diamond' },
    { id: 'consecrated_big_bones', name: 'Consecrated Big Bones', description: 'Large bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', material: 'diamond' },
    { id: 'consecrated_dragon_bones', name: 'Consecrated Dragon Bones', description: 'Dragon bones that have been blessed at a holy altar. They radiate a faint light.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:dinosaur-bones.svg', material: 'diamond' },
    { id: 'sacred_dust', name: 'Sacred Dust', description: 'A fine powder made from consecrated bones. Used in holy rituals.', stackable: true, value: 5, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    { id: 'anointing_oil', name: 'Anointing Oil', description: 'A fragrant oil used to sanctify ritual components.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', material: 'potion-prayer' },
    { id: 'holy_paste', name: 'Holy Paste', description: 'A thick paste made from sacred dust and anointing oil. It can be offered at an altar.', stackable: true, value: 200, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'holy_water', name: 'Holy Water', description: 'Water blessed at a holy site. Used in sacred rituals.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', emptyable: { emptyItemId: 'vial' }, material: 'potion-prayer' },
    

    // Herblore Secondaries
    { id: 'wyvern_claw', name: 'Wyvern Claw', description: 'A sharp claw from a Wyvern.', stackable: false, value: 1500, iconUrl: 'https://api.iconify.design/game-icons:animal-claw.svg', material: 'rune-aether' },
    { id: 'imp_ashes', name: 'Imp Ashes', description: 'The volatile, magical ashes left behind by an imp.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:ash.svg', material: 'burnt' },
    { id: 'troll_sweat', name: 'Troll Sweat', description: 'A vial of glistening, pungent sweat from an Ice Troll. Ew.', stackable: false, value: 800, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', material: 'vial-water' },
    { id: 'spectre_essence', name: 'Spectre Essence', description: 'A swirling, ethereal essence captured from a specter.', stackable: false, value: 450, iconUrl: 'https://api.iconify.design/game-icons:ectoplasm.svg', material: 'rune-astral' },
    { id: 'basilisk_eye', name: 'Basilisk Eye', description: 'The petrifying eye of a basilisk. Stares back at you.', stackable: false, value: 600, iconUrl: 'https://api.iconify.design/game-icons:eye-shield.svg', material: 'emerald' },
    { id: 'scorched_scale', name: 'Scorched Scale', description: 'A beasts scale that is permanently hot to the touch.', stackable: false, value: 750, iconUrl: 'https://api.iconify.design/game-icons:energy-shield.svg', material: 'rune-ember' },
    { id: 'frozen_fang', name: 'Frozen Fang', description: 'A fang from a Frostfang creature, perpetually coated in a thin layer of ice.', stackable: false, value: 700, iconUrl: 'https://api.iconify.design/game-icons:animal-skull.svg', material: 'rune-aqua' },
    { id: 'golem_shard', name: 'Golem Shard', description: 'A shard of animated rock from a golem.', stackable: false, value: 300, iconUrl: 'https://api.iconify.design/game-icons:crystal-shard.svg', material: 'rune-stone' },
    { id: 'dryad_branch', name: 'Dryad Branch', description: 'A small, living branch that hums with the life of the forest.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:birch-trees.svg', material: 'wood-willow' },
    { id: 'arachnid_chitin', name: 'Arachnid Chitin', description: 'A hard piece of chitin from a large spider or scorpion.', stackable: false, value: 180, iconUrl: 'https://api.iconify.design/game-icons:insect-jaws.svg', material: 'bronze' },
    { id: 'spider_eye', name: 'Spider Eye', description: 'A glistening, multi-faceted eye from a large spider.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:eye-target.svg', material: 'uncut-ruby' },

    // Slayer Misc Drops
    { id: 'severed_zombie_hand', name: 'Severed Zombie Hand', description: 'A gruesome trophy. It still twitches occasionally.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:zombie-hand.svg' },
    { id: 'salt_crusted_hide', name: 'Salt-Crusted Hide', description: 'A tough, slimy hide covered in abrasive salt crystals.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg', material: 'leather' },
    { id: 'basilisk_scale', name: 'Basilisk Scale', description: 'A stone-like scale from a basilisk. Surprisingly heavy.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:scaly-skin.svg' },
    { id: 'petrifying_eye', name: 'Petrifying Eye', description: 'The eye of a Gaze Fiend. Even severed, its gaze is unsettling.', stackable: false, value: 1000, iconUrl: 'https://api.iconify.design/game-icons:eye-shield.svg' },
    { id: 'infernal_key_fragment', name: 'Infernal Key Fragment', description: 'A piece of a key that radiates a malevolent heat.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:key.svg', material: 'rune-ember' },
    { id: 'wraith_talons', name: 'Wraith Talons', description: 'Sharp, ethereal talons that feel cold to the touch.', stackable: false, value: 300, iconUrl: 'https://api.iconify.design/game-icons:bird-claw.svg' },
    { id: 'ailment_echo', name: 'Ailment Echo', description: 'A crystallized echo of a creature\'s dying scream.', stackable: false, value: 750, iconUrl: 'https://api.iconify.design/game-icons:sound-waves.svg' },
    { id: 'viscous_orb', name: 'Viscous Orb', description: 'A pulsating orb of thick, gelatinous matter.', stackable: false, value: 600, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'flaming_gullet', name: 'Flaming Gullet', description: "The petrified, still-smouldering gullet of an ancient dragon. Can be combined with a Fire-Resistant Shield at level 75 Smithing to create a Dragonfire Shield, or taken to Borin for a fee.", stackable: false, value: 800000, iconUrl: 'https://api.iconify.design/game-icons:beastial-fangs.svg', material: 'rune-ember' },
    // --- Fire Flask Components ---
    { id: 'throwing_flask', name: 'Throwing Flask', description: 'A thin, fragile glass flask, designed to be thrown and shattered.', stackable: true, value: 5, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg' },
    { id: 'rendering_kit', name: 'Rendering Kit', description: 'A kit containing tools for rendering fat into oil.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:toolbox.svg' },
    { id: 'wool_string', name: 'Wool String', description: 'A piece of string made from wool, perfect for a fuse.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/game-icons:thread.svg' },
    { id: 'fire_pot', name: 'Fire Pot', description: 'A pot containing slow-burning tinder. Used to light flasks as you throw them.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:fire-bowl.svg' },
    { id: 'fire_pot_lit', name: 'Lit Fire Pot', description: 'A pot of burning embers. Provides the flame needed to light fire flasks.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:fire-bowl.svg', material: 'rune-ember', equipment: { slot: EquipmentSlot.Ammo, rangedAttack: 0, rangedStrength: 0 } },
    { id: 'x_mix', name: 'X Mix', description: 'A strange, volatile powder sold by Slayer Masters. Alters fire flasks to harm fire-resistant creatures.', stackable: true, value: 15, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },

    // --- Fats (Resources) ---
    { id: 'animal_fat', name: 'Animal Fat', description: 'Fat from a common animal.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'gold' },
    { id: 'tallow', name: 'Tallow', description: 'A harder, more refined animal fat.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'bronze' },
    { id: 'rich_animal_fat', name: 'Rich Animal Fat', description: 'High-quality fat from a large beast.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'copper' },
    { id: 'beast_fat', name: 'Beast Fat', description: 'Fat from a magical creature, humming with energy.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'raw-meat' },
    { id: 'titan_fat', name: 'Titan Fat', description: 'Dense, heavy fat from a giant-kin.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'burnt' },
    { id: 'dragon_fat', name: 'Dragon Fat', description: 'Fat from a dragon. It feels warm to the touch.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:bubbling-bowl.svg', material: 'rune-ember' },
    
    // --- New Fire Flask Crafting Items ---
    { id: 'throwing_flask_fused', name: 'Fused Throwing Flask', description: 'A fragile glass flask with a wick attached.', stackable: true, value: 6, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg' },
    { id: 'refined_grease_flask', name: 'Refined Grease Flask (L)', description: 'A flask of purified grease, ready to be lit.', stackable: true, value: 10, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'animal_fat_flask', name: 'Animal Fat Flask (L)', description: 'A flask of rendered animal fat, ready to be lit.', stackable: true, value: 20, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'tallow_flask', name: 'Tallow Flask (L)', description: 'A flask of flammable tallow, ready to be lit.', stackable: true, value: 35, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'rich_animal_fat_flask', name: 'Rich Animal Fat Flask (L)', description: 'A flask of highly flammable rich animal fat, ready to be lit.', stackable: true, value: 50, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'beast_fat_flask', name: 'Beast Fat Flask (L)', description: 'A flask of magical beast fat that burns with an unnatural flame.', stackable: true, value: 75, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'titan_fat_flask', name: 'Titan Fat Flask (L)', description: 'A flask of dense titan fat that burns for a long time.', stackable: true, value: 100, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },
    { id: 'dragon_fat_flask', name: 'Dragon Fat Flask (L)', description: 'A flask filled with dragon fat, ready to be lit.', stackable: true, value: 200, iconUrl: 'https://api.iconify.design/game-icons:molotov.svg', material: 'rune-ember' },

    // Glassblowing Products
    { id: 'glass_bowl', name: 'Glass Bowl', description: 'A simple glass bowl.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:aquarium.svg', material: 'vial' },
    { id: 'glass_jar', name: 'Glass Jar', description: 'An empty glass jar. Could be used to hold things.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:mason-jar.svg', material: 'vial' },

    // Sorcerer's Trial Items
    { id: 'cracked_runic_tablet', name: 'Cracked Runic Tablet', description: 'A heavy stone tablet covered in arcane symbols. It appears to be part of a larger formula, but it is damaged and incomplete.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:broken-tablet.svg' },
    { id: 'fragment_of_intent', name: 'Fragment of Intent', description: 'A sliver of stone covered in flowing, almost liquid script. It describes the purpose and will behind a spell.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:scroll-unfurled.svg' },
    { id: 'fragment_of_shape', name: 'Fragment of Shape', description: 'A mental imprint of an intricate runic shape, gained from an ancient monolith.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:rune-stone.svg' },
    { id: 'inert_rune_of_attunement', name: 'Inert Rune of Attunement', description: 'A newly crafted rune that lacks a magical charge. It feels cold and dead.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:rune-stone.svg', material: 'rune-stone' },
    { id: 'imprinted_rune_of_attunement', name: 'Imprinted Rune of Attunement', description: 'A rune humming with raw elemental power. It is a testament to mastery over Creation.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:rune-stone.svg', material: 'runic' },
    { id: 'unstable_core', name: 'Unstable Core', description: "A dangerously twitchy core of raw magical energy, contained within a Wyvern Claw. It feels like it could explode at any moment.", stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:nuclear-bomb.svg', material: 'rune-ember' },
    { id: 'tempered_core', name: 'Tempered Core', description: "The unstable energy has been tempered against heat, pressure, and silence. It now hums with a controlled, steady power.", stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:atom.svg', material: 'rune-astral' },
    { id: 'core_of_controlled_destruction', name: 'Core of Controlled Destruction', description: "The once-chaotic energy now sits dormant, waiting for a command. It is a testament to mastery over Destruction.", stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:orbital.svg', material: 'runic' },
];