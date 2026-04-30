import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const BONEMARSH_POIS: Record<string, POI> = {
    bonemarsh_threshold: {
        id: "bonemarsh_threshold",
        name: "Bonemarsh Threshold",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1200,
        description: "The cobblestone path crumbles into deep, sucking mud. The air turns thick with the scent of stagnant water.",
        connections: [
            "respite_approach_bonemarsh",
            "bonemarsh_fens_entrance",
            "bonemarsh_weald_entrance",
            "bonemarsh_bogs_entrance",
        ],
    },
    bonemarsh_fens_entrance: {
        id: "bonemarsh_fens_entrance",
        name: "Sinking Fens",
        regionId: "the_bonemarsh",
        x: 1350,
        y: 1250,
        description: "The ground here is extremely unstable. You must step carefully from root to root.",
        activities: [
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
        ],
        connections: ["bonemarsh_threshold", "bonemarsh_fens_mud"],
    },
    bonemarsh_fens_mud: {
        id: "bonemarsh_fens_mud",
        name: "Muddy Basin",
        regionId: "the_bonemarsh",
        x: 1300,
        y: 1300,
        description: "A wide, shallow basin of brown water. Bones protrude from the sludge.",
        connections: [
            "bonemarsh_fens_entrance",
            "bonemarsh_fens_swamp",
            "bonemarsh_fens_clearing",
        ],
    },
    bonemarsh_fens_clearing: {
        id: "bonemarsh_fens_clearing",
        name: "Sunken Clearing",
        regionId: "the_bonemarsh",
        x: 1250,
        y: 1350,
        description: "A patch of relatively dry land in the fens.",
        activities: [
            {
                type: "skilling",
                id: "marsh_fishing_1",
                name: "Murky Waters",
                skill: SkillName.Fishing,
                requiredLevel: 40,
                loot: [
                    {
                        itemId: "raw_lobster",
                        chance: 1,
                        xp: 90,
                    },
                ],
                resourceCount: {
                    min: 3,
                    max: 7,
                },
                respawnTime: 60000,
                gatherTime: 2500,
                requiredTool: ToolType.OceanBoxTrap,
            },
        ],
        connections: ["bonemarsh_fens_mud"],
    },
    bonemarsh_fens_swamp: {
        id: "bonemarsh_fens_swamp",
        name: "Deep Swamp",
        regionId: "the_bonemarsh",
        x: 1300,
        y: 1350,
        description: "The water is waist-deep here. Movement is agonizingly slow.",
        activities: [
            {
                type: "combat",
                monsterId: "bone_scavenger",
            },
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
        ],
        connections: ["bonemarsh_fens_mud", "bonemarsh_fens_deep"],
    },
    bonemarsh_fens_deep: {
        id: "bonemarsh_fens_deep",
        name: "The Gurgling Pit",
        regionId: "the_bonemarsh",
        x: 1350,
        y: 1400,
        description: "The mud bubbles violently, releasing toxic gas into the air.",
        activities: [
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
            {
                type: "combat",
                monsterId: "marshlight_wraith",
            },
        ],
        connections: ["bonemarsh_fens_swamp", "bonemarsh_fens_ruin"],
    },
    bonemarsh_fens_ruin: {
        id: "bonemarsh_fens_ruin",
        name: "Drowned Architecture",
        regionId: "the_bonemarsh",
        x: 1300,
        y: 1450,
        description: "The top arches of a massive stone structure poke out of the muck.",
        connections: ["bonemarsh_fens_deep", "bonemarsh_barrow_approach"],
    },
    bonemarsh_barrow_approach: {
        id: "bonemarsh_barrow_approach",
        name: "Barrow Excavation",
        regionId: "the_bonemarsh",
        x: 1350,
        y: 1500,
        description: "The swamp recedes slightly, revealing an ancient, terrifying stonework tunnel.",
        connections: [
            "bonemarsh_fens_ruin",
            "hollowed_barrow_entrance",
            "bonemarsh_mire_crossroads",
        ],
    },
    bonemarsh_weald_entrance: {
        id: "bonemarsh_weald_entrance",
        name: "The Whispering Weald",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1250,
        description: "Twisted, pale trees grow here. Their leaves rustle even when there is no wind.",
        activities: [
            {
                type: "skilling",
                id: "marsh_willow_1",
                name: "Whispering Willow",
                skill: SkillName.Woodcutting,
                requiredLevel: 35,
                loot: [
                    {
                        itemId: "willow_logs",
                        chance: 1,
                        xp: 67,
                    },
                ],
                resourceCount: {
                    min: 4,
                    max: 8,
                },
                respawnTime: 60000,
                gatherTime: 2500,
            },
        ],
        connections: ["bonemarsh_threshold", "bonemarsh_weald_path_1"],
    },
    bonemarsh_weald_path_1: {
        id: "bonemarsh_weald_path_1",
        name: "Hollow Roots",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1300,
        description: "The roots of the dead trees are hollow and echo with strange noises.",
        activities: [
            {
                type: "combat",
                monsterId: "marsh_lurker",
            },
        ],
        connections: [
            "bonemarsh_weald_entrance",
            "bonemarsh_mire_watcher_hut",
            "bonemarsh_sunken_obelisk",
        ],
    },
    bonemarsh_mire_watcher_hut: {
        id: "bonemarsh_mire_watcher_hut",
        name: "Mire-Watcher's Hut",
        regionId: "the_bonemarsh",
        x: 1450,
        y: 1350,
        description: "A small shack built on stilts above the muck. A dim lantern hangs from the porch.",
        activities: [
            {
                type: "npc",
                name: "Old Man Kaelen",
                icon: "scholar",
                startNode: "kaelen_greeting",
                dialogue: {
                    kaelen_greeting: {
                        npcName: "Old Man Kaelen",
                        npcIcon: "scholar",
                        text: "Watch your step, traveler. The marsh has a way of swallowing the unwary.",
                        responses: [
                            {
                                text: "What are you doing out here?",
                                next: "kaelen_purpose",
                            },
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                    kaelen_purpose: {
                        npcName: "Old Man Kaelen",
                        npcIcon: "scholar",
                        text: "I watch the spirits. They've been restless lately, ever since the Rift started widening.",
                        responses: [
                            {
                                text: "Spirits?",
                                next: "kaelen_spirits",
                            },
                        ],
                    },
                    kaelen_spirits: {
                        npcName: "Old Man Kaelen",
                        npcIcon: "scholar",
                        text: "The Risen Shamblers... they aren't just corpses. They're echoes of the island's past.",
                        responses: [
                            {
                                text: "Interesting.",
                            },
                        ],
                    },
                },
            },
        ],
        connections: ["bonemarsh_weald_path_1"],
    },
    bonemarsh_sunken_obelisk: {
        id: "bonemarsh_sunken_obelisk",
        name: "Sunken Obelisk",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1400,
        description: "A massive stone spire sticking out of the mud at a 45-degree angle. Glowing runes pulse faintly.",
        activities: [
            {
                type: "combat",
                monsterId: "marshlight_wraith",
            },
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
        ],
        connections: ["bonemarsh_weald_path_1", "bonemarsh_mire_crossroads"],
    },
    bonemarsh_mire_crossroads: {
        id: "bonemarsh_mire_crossroads",
        name: "The Dead Intersection",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1450,
        description: "The mud here is littered with rusted armor and broken weaponry.",
        connections: [
            "bonemarsh_sunken_obelisk",
            "bonemarsh_barrow_approach",
            "bonemarsh_mire_core",
        ],
    },
    bonemarsh_mire_core: {
        id: "bonemarsh_mire_core",
        name: "Heart of the Mire",
        regionId: "the_bonemarsh",
        x: 1400,
        y: 1550,
        description: "A terrifyingly quiet circular basin. Nothing moves here.",
        activities: [
            {
                type: "skilling",
                id: "marsh_mining_1",
                name: "Exposed Adamantite",
                skill: SkillName.Mining,
                requiredLevel: 70,
                loot: [
                    {
                        itemId: "adamantite_ore",
                        chance: 1,
                        xp: 95,
                    },
                ],
                resourceCount: {
                    min: 2,
                    max: 4,
                },
                respawnTime: 90000,
                gatherTime: 3500,
            },
            {
                type: "combat",
                monsterId: "bog_shamble",
            },
            {
                type: "combat",
                monsterId: "marsh_lurker",
            },
        ],
        connections: ["bonemarsh_mire_crossroads"],
    },
    bonemarsh_bogs_entrance: {
        id: "bonemarsh_bogs_entrance",
        name: "The Acid Bogs",
        regionId: "the_bonemarsh",
        x: 1450,
        y: 1200,
        description: "The water here takes on a sickening green tint, burning your skin slightly upon contact.",
        activities: [
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
        ],
        connections: ["bonemarsh_threshold", "bonemarsh_bogs_path_1"],
    },
    bonemarsh_bogs_path_1: {
        id: "bonemarsh_bogs_path_1",
        name: "Noxious Stepping Stones",
        regionId: "the_bonemarsh",
        x: 1500,
        y: 1250,
        description: "Flat rocks jut out of the acidic water, providing the only safe path forward.",
        connections: ["bonemarsh_bogs_entrance", "bonemarsh_bogs_island_1"],
    },
    bonemarsh_bogs_island_1: {
        id: "bonemarsh_bogs_island_1",
        name: "Caustic Isle",
        regionId: "the_bonemarsh",
        x: 1550,
        y: 1300,
        description: "A small, barren island surrounded by bubbling toxic water.",
        activities: [
            {
                type: "skilling",
                id: "marsh_herb_1",
                name: "Bog-Rot Stonebloom",
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
                respawnTime: 200000,
                gatherTime: 4000,
            },
        ],
        connections: [
            "bonemarsh_bogs_path_1",
            "bonemarsh_bogs_path_2",
            "bonemarsh_bogs_detour",
        ],
    },
    bonemarsh_bogs_detour: {
        id: "bonemarsh_bogs_detour",
        name: "Dead End Pool",
        regionId: "the_bonemarsh",
        x: 1600,
        y: 1250,
        description: "A cul-de-sac of sheer cliffs dropping into a pool of green acid.",
        activities: [
            {
                type: "combat",
                monsterId: "bone_scavenger",
            },
            {
                type: "combat",
                monsterId: "marshlight_wraith",
            },
        ],
        connections: ["bonemarsh_bogs_island_1"],
    },
    bonemarsh_bogs_path_2: {
        id: "bonemarsh_bogs_path_2",
        name: "The Corroded Bridge",
        regionId: "the_bonemarsh",
        x: 1550,
        y: 1350,
        description: "An old wooden bridge that is slowly dissolving into the mist.",
        connectionRequirements: {
            bonemarsh_bogs_island_2: {
                skill: SkillName.Agility,
                level: 50,
                xp: 200,
                description: "The bridge is too rotten to walk on normally. You'll need to jump between the support beams.",
                actionText: "Leap across beams",
            },
        },
        connections: ["bonemarsh_bogs_island_1", "bonemarsh_bogs_island_2"],
    },
    bonemarsh_bogs_island_2: {
        id: "bonemarsh_bogs_island_2",
        name: "The Festering Ground",
        regionId: "the_bonemarsh",
        x: 1500,
        y: 1400,
        description: "The soil here is hot to the touch and smells like sulfur.",
        activities: [
            {
                type: "combat",
                monsterId: "marsh_lurker",
            },
        ],
        connections: ["bonemarsh_bogs_path_2", "bonemarsh_bogs_end"],
    },
    bonemarsh_bogs_end: {
        id: "bonemarsh_bogs_end",
        name: "The Sinkhole",
        regionId: "the_bonemarsh",
        x: 1550,
        y: 1450,
        description: "A massive, perfectly circular hole where the swamp drains deep into the earth.",
        activities: [
            {
                type: "skilling",
                id: "marsh_mining_2",
                name: "Corroded Titanium",
                skill: SkillName.Mining,
                requiredLevel: 85,
                loot: [
                    {
                        itemId: "titanium_ore",
                        chance: 1,
                        xp: 125,
                    },
                ],
                resourceCount: {
                    min: 1,
                    max: 1,
                },
                respawnTime: 400000,
                gatherTime: 4000,
            },
            {
                type: "combat",
                monsterId: "bog_shamble",
            },
            {
                type: "combat",
                monsterId: "risen_shambler",
            },
        ],
        connections: ["bonemarsh_bogs_island_2"],
    },
};
