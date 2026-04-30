import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const SHATTERED_COAST_POIS: Record<string, POI> = {
    shattered_coast_trail: {
        id: "shattered_coast_trail",
        name: "Shattered Coast Trail",
        regionId: "the_shattered_coast",
        x: 550,
        y: 850,
        description: "A rugged trail winding down jagged cliffs towards the dark, churning sea. The air is thick with the smell of brine and rot.",
        connections: [
            "respite_approach_coast",
            "shattered_cliff_path_north",
            "shattered_flats_center",
            "respite_outer_w2",
        ],
    },
    shattered_cliff_path_north: {
        id: "shattered_cliff_path_north",
        name: "The Serpent's Spine",
        regionId: "the_shattered_coast",
        x: 500,
        y: 800,
        description: "A narrow stone ridge that resembles the vertebrae of a giant snake. The wind here is relentless.",
        activities: [
            {
                type: "combat",
                monsterId: "coast_prowler",
            },
            {
                type: "combat",
                monsterId: "tide_hunter",
            },
        ],
        connections: ["shattered_coast_trail", "shattered_cliff_lookout"],
    },
    shattered_cliff_lookout: {
        id: "shattered_cliff_lookout",
        name: "Observer's Point",
        regionId: "the_shattered_coast",
        x: 450,
        y: 750,
        description: "A flat shelf of rock providing a clear view of the entire coastline and the Abyssal Expanse to the north.",
        connections: ["shattered_cliff_path_north", "shattered_cliff_bridge"],
    },
    shattered_cliff_bridge: {
        id: "shattered_cliff_bridge",
        name: "Hanging Rope Bridge",
        regionId: "the_shattered_coast",
        x: 400,
        y: 700,
        description: "A precarious bridge made of rotting wood and fraying hemp. It sways violently in the coastal gusts.",
        connectionRequirements: {
            shattered_cliff_eyrie: {
                skill: SkillName.Agility,
                level: 55,
                xp: 250,
                description: "The bridge is missing several planks. You'll need to jump across the gaps while maintaining balance.",
                actionText: "Cross the swaying bridge",
            },
        },
        connections: ["shattered_cliff_lookout", "shattered_cliff_eyrie"],
    },
    shattered_cliff_eyrie: {
        id: "shattered_cliff_eyrie",
        name: "Storm-Crest Eyrie",
        regionId: "the_shattered_coast",
        x: 350,
        y: 650,
        description: "A high peak where scavenger birds build nests from ship wreckage. The sky feels dangerously close.",
        activities: [
            {
                type: "skilling",
                id: "coast_herb_1",
                name: "Cliff-Side Stonebloom",
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
                gatherTime: 2500,
            },
        ],
        connections: ["shattered_cliff_bridge", "shattered_cliff_descent"],
    },
    shattered_cliff_descent: {
        id: "shattered_cliff_descent",
        name: "The Howling Crevice",
        regionId: "the_shattered_coast",
        x: 400,
        y: 600,
        description: "A narrow crack in the cliffside where the wind howls like a wounded beast.",
        activities: [
            {
                type: "combat",
                monsterId: "steam_sprite",
            },
            {
                type: "combat",
                monsterId: "storm_elemental",
            },
        ],
        connections: ["shattered_cliff_eyrie", "shattered_flats_north"],
    },
    shattered_flats_center: {
        id: "shattered_flats_center",
        name: "The Tidal Plains",
        regionId: "the_shattered_coast",
        x: 500,
        y: 900,
        description: "A wide, flat expanse of wet sand and shell fragments. The tide is currently out, revealing the skeletons of many ships.",
        connections: [
            "shattered_coast_trail",
            "shattered_flats_north",
            "shattered_flats_south",
        ],
    },
    shattered_flats_north: {
        id: "shattered_flats_north",
        name: "Galleon Graveyard",
        regionId: "the_shattered_coast",
        x: 450,
        y: 850,
        description: "The hulls of dozen of merchant ships lay shattered here like discarded toys.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "wreck_chest_1",
                targetName: "Sodden Sea Chest",
                lootTableId: "thieving_dungeon_chest_mid",
            },
        ],
        connections: [
            "shattered_flats_center",
            "shattered_cliff_descent",
            "shattered_wreck_leviathan",
        ],
    },
    shattered_wreck_leviathan: {
        id: "shattered_wreck_leviathan",
        name: "The Leviathan's Ribs",
        regionId: "the_shattered_coast",
        x: 350,
        y: 850,
        description: "A colossal ship's frame, now bleached white and resembling the ribs of a Great Whale.",
        activities: [
            {
                type: "combat",
                monsterId: "coast_prowler",
            },
            {
                type: "combat",
                monsterId: "reef_lurker",
            },
            {
                type: "skilling",
                id: "coast_woodcutting_1",
                name: "Aged Driftwood Logs",
                skill: SkillName.Woodcutting,
                requiredLevel: 45,
                loot: [
                    {
                        itemId: "maple_logs",
                        chance: 1,
                        xp: 100,
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
        connections: ["shattered_flats_north"],
    },
    shattered_flats_south: {
        id: "shattered_flats_south",
        name: "Whispering Sands",
        regionId: "the_shattered_coast",
        x: 450,
        y: 950,
        description: "The sand here is strangely fine and white. It seems to hiss as the water recedes.",
        activities: [
            {
                type: "combat",
                monsterId: "coast_prowler",
            },
            {
                type: "combat",
                monsterId: "tide_hunter",
            },
        ],
        connections: ["shattered_flats_center", "shattered_drowned_entrance"],
    },
    shattered_drowned_entrance: {
        id: "shattered_drowned_entrance",
        name: "Cavern Mouth",
        regionId: "the_shattered_coast",
        x: 400,
        y: 1000,
        description: "A massive opening in the cliff base. The water rushes in and out with a rhythmic, booming sound.",
        connections: ["shattered_flats_south", "shattered_drowned_tunnel_1"],
    },
    shattered_drowned_tunnel_1: {
        id: "shattered_drowned_tunnel_1",
        name: "Phosphorescent Hall",
        regionId: "the_shattered_coast",
        x: 350,
        y: 1050,
        description: "Bioluminescent moss coats the walls, casting a dim, pulsating blue light on the flooded floor.",
        activities: [
            {
                type: "combat",
                monsterId: "coast_prowler",
            },
            {
                type: "combat",
                monsterId: "reef_lurker",
            },
        ],
        connections: ["shattered_drowned_entrance", "shattered_drowned_lake"],
    },
    shattered_drowned_lake: {
        id: "shattered_drowned_lake",
        name: "The Sunken Grotto",
        regionId: "the_shattered_coast",
        x: 300,
        y: 1100,
        description: "A vast subterranean lake. Its water is perfectly clear and deathly cold.",
        activities: [
            {
                type: "skilling",
                id: "coast_fishing_2",
                name: "Grotto Prawns",
                skill: SkillName.Fishing,
                requiredLevel: 65,
                loot: [
                    {
                        itemId: "raw_shark",
                        chance: 1,
                        xp: 150,
                    },
                ],
                resourceCount: {
                    min: 5,
                    max: 12,
                },
                respawnTime: 90000,
                gatherTime: 3000,
                requiredTool: ToolType.Harpoon,
            },
        ],
        connections: [
            "shattered_drowned_tunnel_1",
            "shattered_drowned_crevice",
            "shattered_drowned_treasury",
        ],
    },
    shattered_drowned_treasury: {
        id: "shattered_drowned_treasury",
        name: "The Captain's Rest",
        regionId: "the_shattered_coast",
        x: 250,
        y: 1150,
        description: "A dry shelf in the back of the grotto where the remains of an ancient Admiral sit surrounded by glinting treasure.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "coast_chest_2",
                targetName: "Golden Anchor Chest",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        connections: ["shattered_drowned_lake"],
    },
    shattered_drowned_crevice: {
        id: "shattered_drowned_crevice",
        name: "Coral Crevice",
        regionId: "the_shattered_coast",
        x: 250,
        y: 1050,
        description: "A tight squeeze between coral formations that leads deeper into the mountain's roots.",
        connectionRequirements: {
            shattered_drowned_vein: {
                skill: SkillName.Agility,
                level: 60,
                xp: 200,
                description: "The walls are covered in sharp coral. You'll need to navigate the tight space with absolute precision.",
                actionText: "Slide through the crevice",
            },
        },
        connections: ["shattered_drowned_lake", "shattered_drowned_vein"],
    },
    shattered_drowned_vein: {
        id: "shattered_drowned_vein",
        name: "The Salt Lode",
        regionId: "the_shattered_coast",
        x: 200,
        y: 1000,
        description: "An isolated pocket filled with crystalline salt and rare mineral deposits pushed up from the seabed.",
        activities: [
            {
                type: "skilling",
                id: "coast_mining_1",
                name: "Pure Adamantite Deposit",
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
                    min: 3,
                    max: 6,
                },
                respawnTime: 120000,
                gatherTime: 3000,
            },
        ],
        connections: [
            "shattered_drowned_crevice",
            "shattered_drowned_secret_exit",
        ],
    },
    shattered_drowned_secret_exit: {
        id: "shattered_drowned_secret_exit",
        name: "Hidden Sea-Cave",
        regionId: "the_shattered_coast",
        x: 150,
        y: 950,
        description: "A small exit hole that lets out onto a jagged rock platform far out in the surf.",
        activities: [
            {
                type: "skilling",
                id: "coast_mining_titanium",
                name: "Ocean-Tapped Titanium",
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
        ],
        connections: ["shattered_drowned_vein"],
    },
};
