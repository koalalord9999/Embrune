import { Item, EquipmentSlot, WeaponType } from '../../types';

export const misc: Item[] = [
    // Currency
    { id: 'coins', itemNum: 1, name: 'Coins', description: 'Shiny gold coins.', stackable: true, value: 1, iconUrl: 'coins', material: 'gold' },
    { id: 'agility_voucher', itemNum: 2, name: 'Agility Voucher', description: 'A voucher proving your agility. Can be traded for pieces of the Weightless outfit.', stackable: true, value: 0, iconUrl: 'angel-wings', material: 'gold' },
    { id: 'agility_paste', itemNum: 3, name: 'Agility Paste', description: 'A thick paste made from a secret formula. Used in creating Stamina potions.', stackable: true, value: 120, iconUrl: 'goo-spurt' },
    { id: 'beer_glass', itemNum: 4, name: 'Beer Glass', description: 'An empty beer glass.', stackable: false, value: 1, iconUrl: 'beer-stein' },
    { id: 'ashes', itemNum: 5, name: 'Ashes', description: 'A pile of ashes.', stackable: false, value: 1, iconUrl: 'powder' },
    { id: 'seeds', itemNum: 6, name: 'Seeds', description: "A random assortment of seeds, maybe I can turn them in somewhere? (But not yet)", stackable: true, value: 10, iconUrl: 'plant-seed' },
    { id: 'waterskin', itemNum: 7, name: 'Waterskin', description: 'A skin for carrying water. Can be filled at a water source or from a cactus.', stackable: false, value: 15, iconUrl: 'waterskin', material: 'leather', consumable: { healAmount: 1 }, doseable: true, maxDoses: 4 },

    // Food Ingredients & Containers
    { id: 'apple', itemNum: 8, name: 'Apple', description: 'A crisp green apple.', stackable: false, value: 3, iconUrl: 'shiny-apple', consumable: { healAmount: 2 }, material: 'uncut-emerald' },
    { id: 'tomato', itemNum: 9, name: 'Tomato', description: 'A ripe red tomato.', stackable: false, value: 5, iconUrl: 'tomato', material: 'raw-meat' },
    { id: 'cheese', itemNum: 10, name: 'Cheese', description: 'A wheel of cheese.', stackable: false, value: 10, iconUrl: 'cheese-wedge', consumable: { healAmount: 3 }, material: 'raw-fish' },
    { id: 'red_berries', itemNum: 11, name: 'Red Berries', description: 'A handful of mixed berries.', stackable: false, value: 5, iconUrl: 'berries-bowl', consumable: { healAmount: 2 }, material: 'raw-meat' },
    { id: 'pineapple', itemNum: 12, name: 'Pineapple', description: 'A prickly tropical fruit.', stackable: false, value: 20, iconUrl: 'pineapple', material: 'gold' },
    { id: 'pineapple_chunks', itemNum: 13, name: 'Pineapple Chunks', description: 'Sliced pineapple, ready for cooking.', stackable: false, value: 20, iconUrl: 'pineapple', consumable: { healAmount: 2 }, material: 'gold' },

    // Quest & Key Items
    { id: 'frostfang_key', itemNum: 14, name: 'Frostfang Key', description: 'A key made of enchanted ice that radiates a biting cold. It is used to unlock the Frozen Gate in the Frostfang Peaks.', stackable: false, value: 0, iconUrl: 'boss-key', material: 'aquatite' },
    { id: 'arcane_resonator', itemNum: 15, name: 'Arcane Resonator', description: 'A device given by Archmage Theron to measure arcane energy at runic altars.', stackable: false, value: 0, iconUrl: 'orb-wand' },
    { id: 'gust_reading', itemNum: 16, name: 'Gust Reading', description: 'A charged reading from the Gust Altar.', stackable: false, value: 0, iconUrl: 'wind-slap', material: 'rune-gust' },
    { id: 'stone_reading', itemNum: 17, name: 'Stone Reading', description: 'A charged reading from the Stone Altar.', stackable: false, value: 0, iconUrl: 'stone-block', material: 'rune-stone' },
    { id: 'aqua_reading', itemNum: 18, name: 'Aqua Reading', description: 'A charged reading from the Aqua Altar.', stackable: false, value: 0, iconUrl: 'water-splash', material: 'rune-aqua' },
    { id: 'resonance_dampener', itemNum: 19, name: 'Resonance Dampener', description: 'A complex dwarven device designed to stabilize a skyship against magical turbulence.', stackable: false, value: 0, iconUrl: 'gear-hammer' },
    { id: 'elaras_signet', itemNum: 20, name: "Elara's Signet", description: 'A signet ring bearing the crest of the Oakhaven Guard. Given to you by the Captain.', stackable: false, value: 0, iconUrl: 'fire-gem', material: 'silver' },
    { id: 'rusty_iron_sword', itemNum: 21, name: 'Rusty Iron Sword', description: 'An old, corroded sword. It feels strangely balanced despite the rust.', stackable: false, value: 1, iconUrl: 'gladius', equipment: { slot: EquipmentSlot.Weapon, stabAttack: 1, slashAttack: 1, crushAttack: -2, rangedAttack: 0, magicAttack: 0, stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0, strengthBonus: 1, rangedStrength: 0, magicDamageBonus: 0, weaponType: WeaponType.Sword, speed: 3 }, material: 'iron' },
    { id: 'lost_heirloom', itemNum: 22, name: 'Lost Heirloom', description: 'An old but beautifully crafted silver necklace. It looks like it would be very important to someone.', stackable: false, value: 0, iconUrl: 'necklace' },
    { id: 'stolen_caravan_goods', itemNum: 23, name: 'Stolen Caravan Goods', description: 'A crate of valuable goods, stolen from a Silverhaven merchant.', stackable: false, value: 0, iconUrl: 'wooden-crate' },
    { id: 'strange_key_loop', itemNum: 24, name: 'Strange Key Loop', description: 'Half of a strange, ancient key.', stackable: false, value: 1000, iconUrl: 'key' },
    { id: 'strange_key_tooth', itemNum: 25, name: 'Strange Key Tooth', description: 'The other half of a strange, ancient key.', stackable: false, value: 1000, iconUrl: 'key' },
    { id: 'strange_key', itemNum: 26, name: 'Strange Key', description: 'A key pulsating with a faint energy. It must unlock something important.', stackable: false, value: 2500, iconUrl: 'star-key' },
    { id: 'ancient_gear', itemNum: 27, name: 'Ancient Gear', description: 'A strange, intricate gear from an ancient sentinel. It hums with a faint power.', stackable: false, value: 1000, iconUrl: 'gear-hammer' },
    { id: 'sirens_hair', itemNum: 28, name: "Siren's Hair", description: 'A lock of long, beautiful hair that seems to shimmer with its own light. It hums a faint, enchanting melody.', stackable: false, value: 0, iconUrl: 'yarn' },
    { id: 'slimy_egg_shells', itemNum: 29, name: 'Slimy Egg Shells', description: 'Fragments of a large, leathery egg. They are covered in swamp slime.', stackable: false, value: 1, iconUrl: 'egg-eye' },
    { id: 'serpents_egg', itemNum: 30, name: "Serpent's Egg", description: 'A large, leathery egg, surprisingly intact. It feels warm to the touch.', stackable: false, value: 0, iconUrl: 'dinosaur-egg' },
    { id: 'treasure_chest', itemNum: 31, name: 'Treasure Chest', description: 'A waterlogged chest, sealed tight. Opening it might reveal valuable treasures.', stackable: false, value: 500, iconUrl: 'chest', consumable: { special: 'treasure_chest' } },
    { id: 'goblin_champion_scroll', itemNum: 32, name: 'Goblin Champion Scroll', description: 'A rare scroll dropped by a goblin champion. A sign of great prowess.', stackable: false, value: 0, iconUrl: 'scroll-unfurled' },
    { id: 'reinforced_bridge_cable', itemNum: 33, name: 'Reinforced Bridge Cable', description: 'An incredibly strong cable, specially crafted to repair a bridge.', stackable: false, value: 0, iconUrl: 'rope-coil' },
    { id: 'reinforced_bridge_supports', itemNum: 34, name: 'Reinforced Bridge Supports', description: 'Sturdy wooden supports crafted from Yew logs by a master woodworker.', stackable: false, value: 0, iconUrl: 'wood-beam', material: 'wood-yew' },
    { id: 'torn_bandit_insignia', itemNum: 35, name: 'Torn Bandit Insignia', description: 'A piece of cloth bearing the mark of a coiled serpent.', stackable: false, value: 0, iconUrl: 'snake-totem' },

    // Pouches
    { id: 'grimy_coin_pouch', itemNum: 36, name: 'Grimy Coin Pouch', description: "A small, dirty pouch that jingles slightly. It's too grimy to open by hand.", stackable: false, value: 50, iconUrl: 'money-stack' },
    { id: 'clean_coin_pouch', itemNum: 37, name: 'Clean Coin Pouch', description: 'A clean pouch, ready to be opened.', stackable: false, value: 0, iconUrl: 'money-stack', consumable: { givesCoins: { min: 20, max: 150 } } },

    // Fletching Components
    { id: 'arrow_shaft', itemNum: 38, name: 'Arrow Shaft', description: 'A straight, headless arrow shaft.', stackable: true, value: 1, iconUrl: 'arrow-top-left', material: 'wood-normal' },
    { id: 'headless_arrow', itemNum: 39, name: 'Headless Arrow', description: 'An arrow shaft with feathers attached. It just needs a tip.', stackable: true, value: 1, iconUrl: 'arrow-flights', material: 'wood-normal' },
    { id: 'bronze_arrowtips', itemNum: 40, name: 'Bronze Arrowtips', description: 'Bronze shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 2, iconUrl: 'arrowhead', material: 'bronze' },
    { id: 'iron_arrowtips', itemNum: 41, name: 'Iron Arrowtips', description: 'Iron shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 6, iconUrl: 'arrowhead', material: 'iron' },
    { id: 'steel_arrowtips', itemNum: 42, name: 'Steel Arrowtips', description: 'Steel shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 12, iconUrl: 'arrowhead', material: 'steel' },
    { id: 'mithril_arrowtips', itemNum: 43, name: 'Mithril Arrowtips', description: 'Mithril shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 25, iconUrl: 'arrowhead', material: 'mithril' },
    { id: 'adamantite_arrowtips', itemNum: 44, name: 'Adamantite Arrowtips', description: 'Adamantite shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 40, iconUrl: 'arrowhead', material: 'adamantite' },
    { id: 'runic_arrowtips', itemNum: 45, name: 'Runic Arrowtips', description: 'Runic metal shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 200, iconUrl: 'arrowhead', material: 'runic' },
    { id: 'shortbow_u', itemNum: 46, name: 'Shortbow (u)', description: 'An unstrung shortbow. It needs a bow string.', stackable: false, value: 15, iconUrl: 'bow-arrow', material: 'wood-normal' },
    { id: 'longbow_u', itemNum: 47, name: 'Longbow (u)', description: 'An unstrung longbow. It needs a bow string.', stackable: false, value: 20, iconUrl: 'bow-string', material: 'wood-normal' },
    { id: 'oak_shortbow_u', itemNum: 48, name: 'Oak Shortbow (u)', description: 'An unstrung oak shortbow.', stackable: false, value: 30, iconUrl: 'bow-arrow', material: 'wood-oak' },
    { id: 'oak_longbow_u', itemNum: 49, name: 'Oak Longbow (u)', description: 'An unstrung oak longbow.', stackable: false, value: 40, iconUrl: 'bow-string', material: 'wood-oak' },
    { id: 'willow_shortbow_u', itemNum: 50, name: 'Willow Shortbow (u)', description: 'An unstrung willow shortbow.', stackable: false, value: 60, iconUrl: 'bow-arrow', material: 'wood-willow' },
    { id: 'willow_longbow_u', itemNum: 51, name: 'Willow Longbow (u)', description: 'An unstrung willow longbow.', stackable: false, value: 80, iconUrl: 'bow-string', material: 'wood-willow' },
    { id: 'feywood_shortbow_u', itemNum: 52, name: 'Feywood Shortbow (u)', description: 'An unstrung shortbow made from magical feywood.', stackable: false, value: 100, iconUrl: 'bow-arrow', material: 'wood-feywood' },
    { id: 'feywood_longbow_u', itemNum: 53, name: 'Feywood Longbow (u)', description: 'An unstrung longbow made from magical feywood.', stackable: false, value: 120, iconUrl: 'bow-string', material: 'wood-feywood' },
    { id: 'yew_shortbow_u', itemNum: 54, name: 'Yew Shortbow (u)', description: 'An unstrung yew shortbow.', stackable: false, value: 150, iconUrl: 'bow-arrow', material: 'wood-yew' },
    { id: 'yew_longbow_u', itemNum: 55, name: 'Yew Longbow (u)', description: 'An unstrung yew longbow.', stackable: false, value: 200, iconUrl: 'bow-string', material: 'wood-yew' },
    { id: 'silver_amulet_u', itemNum: 56, name: 'Silver Amulet (u)', description: 'An unstrung silver amulet. It needs a string.', stackable: false, value: 780, iconUrl: 'gem-pendant', material: 'silver' },

    // Herblore Items
    // Herblore Secondaries
    { id: 'spider_eggs', itemNum: 57, name: 'Spider Eggs', description: 'A clutch of spider eggs.', stackable: false, value: 5, iconUrl: 'spider-alt' },
    { id: 'boar_tusk', itemNum: 58, name: 'Boar Tusk', description: 'A sharp tusk from a wild boar.', stackable: false, value: 15, iconUrl: 'ivory-tusks' },
    { id: 'golem_core_shard', itemNum: 59, name: 'Golem Core Shard', description: 'A glowing shard from a golem. Can be created by smashing a Golem Core.', stackable: true, value: 50, iconUrl: 'crystal-cluster' },
    { id: 'redwater_kelp', itemNum: 60, name: 'Redwater Kelp', description: 'A strange, magical kelp that grows in reddish water.', stackable: false, value: 20, iconUrl: 'algae' },
    { id: 'consecrated_dust', itemNum: 61, name: 'Consecrated Dust', description: 'A pinch of shimmering, holy dust.', stackable: false, value: 80, iconUrl: 'powder' },
    { id: 'glimmerhorn_dust', itemNum: 62, name: 'Glimmerhorn Dust', description: 'The ground-up antler of a mystical beast.', stackable: false, value: 30, iconUrl: 'powder' },
    { id: 'cave_slime_globule', itemNum: 63, name: 'Cave Slime Globule', description: 'A viscous globule from a cave slime.', stackable: false, value: 10, iconUrl: 'gooey-molecule' },
    { id: 'bloodroot_tendril', itemNum: 64, name: 'Bloodroot Tendril', description: 'A strange, gnarled root that bleeds red.', stackable: false, value: 40, iconUrl: 'root-tip' },
    { id: 'frost_berries', itemNum: 65, name: 'Frost Berries', description: 'Pale berries, cold to the touch.', stackable: false, value: 25, iconUrl: 'berries-bowl' },
    { id: 'wyrmscale_dust', itemNum: 66, name: "Wyrmscale Dust", description: 'Dust from a wyrm\'s scale. It feels warm.', stackable: false, value: 150, iconUrl: 'powder' },
    { id: 'spiked_toad_skin', itemNum: 67, name: 'Spiked Toad Skin', description: 'The tough, warty skin of a giant toad, covered in sharp barbs.', stackable: false, value: 70, iconUrl: 'animal-hide' },
    { id: 'unicorn_horn_dust', itemNum: 68, name: 'Unicorn Horn Dust', description: 'The ground-up horn of a unicorn. It has potent anti-poison properties.', stackable: false, value: 250, iconUrl: 'powder' },
    // New Non-Dust Items
    { id: 'glimmerhorn_antler', itemNum: 69, name: 'Glimmerhorn Antler', description: 'A mystical antler from a Glimmerhorn Stag. Can be ground into dust.', stackable: false, value: 25, iconUrl: 'deer-head' },
    { id: 'serpent_scale', itemNum: 70, name: 'Serpent Scale', description: 'A tough, iridescent scale from a Bog Serpent. Can be ground into dust.', stackable: false, value: 120, iconUrl: 'energy-shield' },
    { id: 'unicorn_horn', itemNum: 71, name: 'Unicorn Horn', description: 'The horn of a unicorn. It has potent anti-poison properties. Can be ground into dust.', stackable: false, value: 200, iconUrl: 'ivory-tusks' },
    { id: 'wyrmscale', itemNum: 72, name: 'Wyrmscale', description: "A thick scale from a powerful wyrm. It feels warm. Can be ground into dust.", stackable: false, value: 120, iconUrl: 'energy-shield' },
    { id: 'glimmer_thread_fiber', itemNum: 73, name: 'Glimmer Thread Fibers', description: 'A tuft of fur from a Glimmerhorn Stag, it seems a bit mystical and suprisingly strong.', stackable: false, value: 10, iconUrl: 'wire-coil' },

    // Dungeon Maps
    { id: 'goblin_dungeon_map', itemNum: 74, name: 'Goblin Dungeon Map', description: 'A crudely drawn map of the goblin warrens.', stackable: false, value: 500, iconUrl: 'treasure-map', mappable: { regionId: 'goblin_dungeon', mapTitle: 'Goblin Dungeon' } },
    { id: 'sunken_labyrinth_map', itemNum: 75, name: 'Sunken Labyrinth Map', description: 'A waterlogged map of the ancient labyrinth.', stackable: false, value: 1500, iconUrl: 'treasure-map', mappable: { regionId: 'sunken_labyrinth', mapTitle: 'Sunken Labyrinth' } },
    { id: 'magus_spire_map', itemNum: 76, name: 'Magus Spire Map', description: 'A map drawn on shimmering crystal film, showing the layout of the spire.', stackable: false, value: 2500, iconUrl: 'treasure-map', mappable: { regionId: 'magus_spire', mapTitle: 'Magus Spire' } },

    // NEW QUEST ITEMS
    { id: 'blighted_soil', itemNum: 77, name: 'Blighted Soil', description: "A sample of soil from near Fitzwilliam's petunias. It feels unnaturally cold.", stackable: false, value: 0, iconUrl: 'ground-sprout' },
    { id: 'broken_barrow_key', itemNum: 78, name: 'Broken Barrow Key', description: 'Two halves of an ancient, broken key. It feels heavy with purpose.', stackable: false, value: 0, iconUrl: 'key', material: 'uncut-emerald' },
    { id: 'reforged_barrow_key', itemNum: 79, name: 'Reforged Barrow Key', description: "A sturdy steel key, masterfully reforged. It hums with a faint energy.", stackable: false, value: 0, iconUrl: 'key', material: 'emerald' },
    { id: 'heart_of_the_mountain', itemNum: 80, name: 'Heart of the Mountain', description: 'The crystalline core of The Earth-Render. It hums with immense terrestrial energy.', stackable: false, value: 0, iconUrl: 'mineral-heart', material: 'diamond' },
    { id: 'attuned_locus', itemNum: 81, name: 'Attuned Locus', description: 'A device from Archmage Theron, designed to commune with divine energies.', stackable: false, value: 0, iconUrl: 'orbital-rays', material: 'rune-astral' },
    { id: 'fragment_of_verdant_verse', itemNum: 82, name: 'Fragment of Verdant Verse', description: 'A recording of a divine echo, stored within your Attuned Locus. The energy is unintelligible on its own.', stackable: false, value: 0, iconUrl: 'scroll-unfurled', material: 'rune-verdant' },
    { id: 'fragment_of_nexus_verse', itemNum: 83, name: 'Fragment of Nexus Verse', description: 'A recording of a divine echo, stored within your Attuned Locus. The energy is unintelligible on its own.', stackable: false, value: 0, iconUrl: 'scroll-unfurled', material: 'rune-nexus' },
    { id: 'fragment_of_hex_verse', itemNum: 84, name: 'Fragment of Hex Verse', description: 'A recording of a divine echo, stored within your Attuned Locus. The energy is unintelligible on its own.', stackable: false, value: 0, iconUrl: 'scroll-unfurled', material: 'rune-hex' },
    { id: 'celestial_verse', itemNum: 85, name: 'Celestial Verse', description: 'The combined verses of the divine echoes, forming a piece of profound lore.', stackable: false, value: 0, iconUrl: 'book-cover', material: 'gold' },
];