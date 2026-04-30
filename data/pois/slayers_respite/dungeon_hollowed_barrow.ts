import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const HOLLOWED_BARROW_POIS: Record<string, POI> = {
    hollowed_barrow_entrance: {
        id: "hollowed_barrow_entrance",
        name: "Hollowed Barrow Entrance",
        regionId: "hollowed_barrow",
        x: 1350,
        y: 1550,
        description: "A dark, gaping hole in the earth leading down into a series of jagged, natural tunnels.",
        connections: [
            "bonemarsh_barrow_approach",
            "hollowed_barrow_collapsed_entry",
        ],
    },
    hollowed_barrow_collapsed_entry: {
        id: "hollowed_barrow_collapsed_entry",
        name: "Collapsed Entryway",
        regionId: "hollowed_barrow",
        x: 1400,
        y: 1600,
        description: "Large stone slabs have fallen from the ceiling. You can hear the scratching of limbs against stone.",
        activities: [
            {
                type: "combat",
                monsterId: "grasping_limb",
            },
        ],
        connections: [
            "hollowed_barrow_entrance",
            "hollowed_barrow_east_crypt",
            "hollowed_barrow_west_alcove",
        ],
    },
    hollowed_barrow_east_crypt: {
        id: "hollowed_barrow_east_crypt",
        name: "Barrow Crypt Passage",
        regionId: "hollowed_barrow",
        x: 1500,
        y: 1650,
        description: "Ancient sarcophagi are built directly into the cave walls here.",
        activities: [
            {
                type: "combat",
                monsterId: "grasping_limb",
            },
        ],
        connections: [
            "hollowed_barrow_collapsed_entry",
            "hollowed_barrow_dead_end_1",
            "hollowed_barrow_central_shaft",
        ],
    },
    hollowed_barrow_dead_end_1: {
        id: "hollowed_barrow_dead_end_1",
        name: "Shattered Burial Chamber",
        regionId: "hollowed_barrow",
        x: 1600,
        y: 1600,
        description: "The path ends where the ceiling has totally caved in. Shattered urns are scattered in the dirt.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "barrow_loot_1",
                targetName: "Cracked Urn",
                lootTableId: "thieving_dungeon_chest_low",
            },
        ],
        connections: ["hollowed_barrow_east_crypt"],
    },
    hollowed_barrow_west_alcove: {
        id: "hollowed_barrow_west_alcove",
        name: "Wet Tunnel",
        regionId: "hollowed_barrow",
        x: 1300,
        y: 1650,
        description: "Muddy water from the marsh above has seeped down, creating a slick and dangerous floor.",
        activities: [
            {
                type: "skilling",
                id: "barrow_herb_1",
                name: "Grave-Rot Fungus",
                skill: SkillName.Herblore,
                requiredLevel: 30,
                loot: [
                    {
                        itemId: "grimy_bog_nettle",
                        chance: 1,
                        xp: 60,
                    },
                ],
                resourceCount: {
                    min: 1,
                    max: 2,
                },
                respawnTime: 120000,
                gatherTime: 2000,
            },
        ],
        connections: [
            "hollowed_barrow_collapsed_entry",
            "hollowed_barrow_secret_crawl",
        ],
    },
    hollowed_barrow_secret_crawl: {
        id: "hollowed_barrow_secret_crawl",
        name: "Small Gaping Hole",
        regionId: "hollowed_barrow",
        x: 1200,
        y: 1600,
        description: "A narrow gap in the stone that seems to lead into a larger chamber beyond.",
        connectionRequirements: {
            hollowed_barrow_hidden_cache: {
                skill: SkillName.Agility,
                level: 45,
                xp: 150,
                description: "The GAP is very narrow and full of sharp stone. You'll need to be careful.",
                actionText: "Squeeze through",
            },
        },
        connections: [
            "hollowed_barrow_west_alcove",
            "hollowed_barrow_hidden_cache",
        ],
    },
    hollowed_barrow_hidden_cache: {
        id: "hollowed_barrow_hidden_cache",
        name: "Sealed Vault",
        regionId: "hollowed_barrow",
        x: 1100,
        y: 1650,
        description: "A vault that was sealed off by a rockfall centuries ago. It remains surprisingly undisturbed.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "barrow_loot_2",
                targetName: "Ancient Satchel",
                lootTableId: "thieving_dungeon_chest_mid",
            },
        ],
        connections: ["hollowed_barrow_secret_crawl"],
    },
    hollowed_barrow_central_shaft: {
        id: "hollowed_barrow_central_shaft",
        name: "Jagged Central Chasm",
        regionId: "hollowed_barrow",
        x: 1400,
        y: 1750,
        description: "The floor has fallen away into a deep chasm. A narrow ledge allows passage to the south.",
        connections: [
            "hollowed_barrow_east_crypt",
            "hollowed_barrow_slug_nest",
            "hollowed_barrow_echoing_hall",
        ],
    },
    hollowed_barrow_slug_nest: {
        id: "hollowed_barrow_slug_nest",
        name: "Slug Nest",
        regionId: "hollowed_barrow",
        x: 1500,
        y: 1800,
        description: "Sticky trails criss-cross the walls, and the air is thick with a mineral scent.",
        activities: [
            {
                type: "combat",
                monsterId: "stonehide_slug",
            },
            {
                type: "combat",
                monsterId: "stonehide_slug",
            },
        ],
        connections: [
            "hollowed_barrow_central_shaft",
            "hollowed_barrow_dead_end_2",
        ],
    },
    hollowed_barrow_dead_end_2: {
        id: "hollowed_barrow_dead_end_2",
        name: "Salt-Encrusted Cul-de-sac",
        regionId: "hollowed_barrow",
        x: 1600,
        y: 1850,
        description: "The tunnel ends in a wall of pure salt and stone. There seems to be a deep vein of coal as well.",
        activities: [
            {
                type: "skilling",
                id: "barrow_mining_1",
                name: "Coal Vein",
                skill: SkillName.Mining,
                requiredLevel: 45,
                loot: [
                    {
                        itemId: "coal",
                        chance: 1,
                        xp: 50,
                    },
                ],
                resourceCount: {
                    min: 6,
                    max: 14,
                },
                respawnTime: 45000,
                gatherTime: 3000,
            },
        ],
        connections: ["hollowed_barrow_slug_nest"],
    },
    hollowed_barrow_echoing_hall: {
        id: "hollowed_barrow_echoing_hall",
        name: "Slayer's Hall",
        regionId: "hollowed_barrow",
        x: 1300,
        y: 1850,
        description: "The cave walls have been roughly flattened here, as if someone once tried to live in these depths.",
        activities: [
            {
                type: "combat",
                monsterId: "gaze_fiend",
            },
        ],
        connections: [
            "hollowed_barrow_central_shaft",
            "hollowed_barrow_deep_nest",
            "hollowed_barrow_zig_zag_1",
        ],
    },
    hollowed_barrow_zig_zag_1: {
        id: "hollowed_barrow_zig_zag_1",
        name: "Twisted Ledge",
        regionId: "hollowed_barrow",
        x: 1200,
        y: 1800,
        description: "A narrow ledge that zig-zags down the side of the internal chasm.",
        connections: ["hollowed_barrow_echoing_hall", "hollowed_barrow_zig_zag_2"],
    },
    hollowed_barrow_zig_zag_2: {
        id: "hollowed_barrow_zig_zag_2",
        name: "Shattered Overlook",
        regionId: "hollowed_barrow",
        x: 1100,
        y: 1900,
        description: "From here, you can see the deeper layers of the island, glowing faintly in the dark.",
        activities: [
            {
                type: "combat",
                monsterId: "gaze_fiend",
            },
            {
                type: "thieving_lockpick",
                id: "barrow_loot_3",
                targetName: "Tilted Chest",
                lootTableId: "thieving_dungeon_chest_mid",
            },
        ],
        connections: ["hollowed_barrow_zig_zag_1", "hollowed_barrow_dead_end_3"],
    },
    hollowed_barrow_dead_end_3: {
        id: "hollowed_barrow_dead_end_3",
        name: "Broken Path",
        regionId: "hollowed_barrow",
        x: 1000,
        y: 1950,
        description: "The path just ends. A massive rockfall has blocked further exploration to the west.",
        connections: ["hollowed_barrow_zig_zag_2"],
    },
    hollowed_barrow_deep_nest: {
        id: "hollowed_barrow_deep_nest",
        name: "The Deep Nest",
        regionId: "hollowed_barrow",
        x: 1350,
        y: 2000,
        description: "The primary nesting ground for the larger creatures dwelling within the barrow.",
        activities: [
            {
                type: "combat",
                monsterId: "ember_demon",
            },
            {
                type: "combat",
                monsterId: "ember_demon",
            },
        ],
        connections: [
            "hollowed_barrow_echoing_hall",
            "hollowed_barrow_root_tangle",
        ],
    },
    hollowed_barrow_root_tangle: {
        id: "hollowed_barrow_root_tangle",
        name: "Underground Overgrowth",
        regionId: "hollowed_barrow",
        x: 1450,
        y: 2050,
        description: "Massive jungle roots have pushed their way through the stone here, creating a tangled maze.",
        activities: [
            {
                type: "combat",
                monsterId: "leaf_beast",
            },
        ],
        connections: ["hollowed_barrow_deep_nest", "hollowed_barrow_root_fork"],
    },
    hollowed_barrow_root_fork: {
        id: "hollowed_barrow_root_fork",
        name: "The Deep Fork",
        regionId: "hollowed_barrow",
        x: 1550,
        y: 2150,
        description: "The roots split into several directions. One leads down, the other deeper into the stone.",
        connections: [
            "hollowed_barrow_root_tangle",
            "hollowed_barrow_root_dead_end",
            "hollowed_barrow_deep_descent",
        ],
    },
    hollowed_barrow_root_dead_end: {
        id: "hollowed_barrow_root_dead_end",
        name: "Smothering Thicket",
        regionId: "hollowed_barrow",
        x: 1650,
        y: 2100,
        description: "The roots are too thick to pass. Strange, glowing spores fill the air.",
        activities: [
            {
                type: "skilling",
                id: "barrow_herb_2",
                name: "Deep-Moss",
                skill: SkillName.Herblore,
                requiredLevel: 70,
                loot: [
                    {
                        itemId: "grimy_stonebloom",
                        chance: 1,
                        xp: 140,
                    },
                ],
                resourceCount: {
                    min: 1,
                    max: 2,
                },
                respawnTime: 120000,
                gatherTime: 3000,
            },
        ],
        connections: ["hollowed_barrow_root_fork"],
    },
    hollowed_barrow_deep_descent: {
        id: "hollowed_barrow_deep_descent",
        name: "Broken Iron Ladder",
        regionId: "hollowed_barrow",
        x: 1450,
        y: 2250,
        description: "An old iron ladder leads further down, but many rungs are missing.",
        connectionRequirements: {
            hollowed_barrow_lower_den: {
                skill: SkillName.Agility,
                level: 50,
                xp: 250,
                description: "You'll have to climb down the wall carefully since the ladder is broken.",
                actionText: "Climb down",
            },
        },
        connections: ["hollowed_barrow_root_fork", "hollowed_barrow_lower_den"],
    },
    hollowed_barrow_lower_den: {
        id: "hollowed_barrow_lower_den",
        name: "Abyssal Den",
        regionId: "hollowed_barrow",
        x: 1350,
        y: 2350,
        description: "A large, dark cavern at the bottom of the barrow. It serves as a lair for the most powerful creatures here.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "thieving_lockpick",
                id: "barrow_loot_4",
                targetName: "Large Iron Chest",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        connections: [
            "hollowed_barrow_deep_descent",
            "hollowed_barrow_broken_bridge",
        ],
    },
    hollowed_barrow_broken_bridge: {
        id: "hollowed_barrow_broken_bridge",
        name: "Collapsed Stone Arch",
        regionId: "hollowed_barrow",
        x: 1450,
        y: 2450,
        description: "A stone bridge that has snapped in the middle, leaving two jagged platforms over a dark pit.",
        connections: [
            "hollowed_barrow_lower_den",
            "hollowed_barrow_ash_pit",
            "hollowed_barrow_final_lair",
        ],
    },
    hollowed_barrow_ash_pit: {
        id: "hollowed_barrow_ash_pit",
        name: "The Ash Pit",
        regionId: "hollowed_barrow",
        x: 1550,
        y: 2500,
        description: "A volcanic vent has filled this side chamber with thick, gray ash.",
        activities: [
            {
                type: "combat",
                monsterId: "ember_demon",
            },
            {
                type: "combat",
                monsterId: "ember_demon",
            },
        ],
        connections: ["hollowed_barrow_broken_bridge"],
    },
    hollowed_barrow_final_lair: {
        id: "hollowed_barrow_final_lair",
        name: "Deep Burial Hub",
        regionId: "hollowed_barrow",
        x: 1350,
        y: 2550,
        description: "The very bottom of the barrow system. The masonry is old, heavy, and crumbling with age.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: ["hollowed_barrow_broken_bridge", "hollowed_barrow_heart"],
    },
    hollowed_barrow_heart: {
        id: "hollowed_barrow_heart",
        name: "The Barrow Heart",
        regionId: "hollowed_barrow",
        x: 1350,
        y: 2650,
        description: "A massive, ancient burial chamber where the air is still and the walls pulse with life.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "barrow_chest_final",
                targetName: "The Eternal Sarcophagus",
                lootTableId: "thieving_dungeon_chest_high",
            },
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
        ],
        connections: [
            "hollowed_barrow_final_lair",
            "hollowed_barrow_blighted_threshold",
        ],
    },
    hollowed_barrow_blighted_threshold: {
        id: "hollowed_barrow_blighted_threshold",
        name: "Threshold of Decay",
        regionId: "hollowed_barrow",
        x: 1450,
        y: 2700,
        description: "A heavy iron door, rusted and cool to the touch, leads deeper into a section of the barrow that smells of sweet rot.",
        connections: [
            "hollowed_barrow_heart",
            "hollowed_barrow_blighted_ossuary_1",
        ],
    },
    hollowed_barrow_blighted_ossuary_1: {
        id: "hollowed_barrow_blighted_ossuary_1",
        name: "The Blighted Ossuary (Level 1)",
        regionId: "hollowed_barrow",
        x: 1550,
        y: 2750,
        description: "The air here is thick with a yellow, choking haze. Faint, translucent shapes drift between the piles of bleached bones.",
        activities: [
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
        ],
        connections: [
            "hollowed_barrow_blighted_threshold",
            "hollowed_barrow_blighted_ossuary_2",
        ],
    },
    hollowed_barrow_blighted_ossuary_2: {
        id: "hollowed_barrow_blighted_ossuary_2",
        name: "The Blighted Ossuary (Level 2)",
        regionId: "hollowed_barrow",
        x: 1650,
        y: 2800,
        description: "The concentration of spectres is higher here. Their moans echo through the lightless halls of the dead.",
        activities: [
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
        ],
        connections: [
            "hollowed_barrow_blighted_ossuary_1",
            "hollowed_barrow_void_touched_tomb",
        ],
    },
    hollowed_barrow_void_touched_tomb: {
        id: "hollowed_barrow_void_touched_tomb",
        name: "Void-Touched Tomb",
        regionId: "hollowed_barrow",
        x: 1750,
        y: 2750,
        description: "A tomb that seems to have been 'cleaned' by the presence of the spectres. The stone is polished and cold.",
        activities: [
            {
                type: "combat",
                monsterId: "blighted_spectre",
            },
            {
                type: "thieving_lockpick",
                id: "ossuary_master_chest",
                targetName: "Tainted Master Sarcophagus",
                lootTableId: "thieving_dungeon_chest_master",
            },
        ],
        connections: ["hollowed_barrow_blighted_ossuary_2"],
    },
};
