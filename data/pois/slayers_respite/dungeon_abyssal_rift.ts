import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const ABYSSAL_RIFT_POIS: Record<string, POI> = {
    abyssal_rift_entrance: {
        id: "abyssal_rift_entrance",
        name: "Gateway to the Void",
        regionId: "abyssal_rift",
        x: 1000,
        y: 150,
        description: "You stand at the event horizon. Gravity is merely a suggestion here, and the air hums with the static of a dying reality.",
        connections: [
            "abyssal_rift_threshold",
            "abyssal_rift_shattered_hall",
            "abyssal_rift_void_echo_path",
        ],
    },
    abyssal_rift_shattered_hall: {
        id: "abyssal_rift_shattered_hall",
        name: "The Shattered Hall",
        regionId: "abyssal_rift",
        x: 950,
        y: 100,
        description: "A corridor of stone that seems to be in the process of dissolving into purple mist.",
        activities: [
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
        ],
        connections: ["abyssal_rift_entrance", "abyssal_rift_gravity_well"],
    },
    abyssal_rift_gravity_well: {
        id: "abyssal_rift_gravity_well",
        name: "Gravity Well",
        regionId: "abyssal_rift",
        x: 900,
        y: 50,
        description: "A pit of absolute darkness that pulls at your equipment. You must brace yourself to pass.",
        activities: [
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
        ],
        connections: [
            "abyssal_rift_shattered_hall",
            "abyssal_rift_obsidian_spiral_entry",
        ],
    },
    abyssal_rift_void_echo_path: {
        id: "abyssal_rift_void_echo_path",
        name: "Path of Void Echoes",
        regionId: "abyssal_rift",
        x: 1050,
        y: 100,
        description: "Whispers of your own past self echo from the walls. The ground is made of translucent, glowing crystal.",
        activities: [
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
        ],
        connections: ["abyssal_rift_entrance", "abyssal_rift_whisering_gallery"],
    },
    abyssal_rift_whisering_gallery: {
        id: "abyssal_rift_whisering_gallery",
        name: "The Whispering Gallery",
        regionId: "abyssal_rift",
        x: 1100,
        y: 50,
        description: "A wide, circular chamber where sound travels in impossible loops. Every step you take sounds like a thousand.",
        activities: [
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
        ],
        connections: [
            "abyssal_rift_void_echo_path",
            "abyssal_rift_frozen_echo_gate",
        ],
    },
    abyssal_rift_frozen_echo_gate: {
        id: "abyssal_rift_frozen_echo_gate",
        name: "The Frozen Echo Gate",
        regionId: "abyssal_rift",
        x: 1100,
        y: 0,
        description: "The air temperature drops suddenly. Frost begins to cover the void-twisted stones.",
        activities: [
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
        ],
        connections: [
            "abyssal_rift_whisering_gallery",
            "abyssal_rift_frostspine_reach",
        ],
    },
    abyssal_rift_frostspine_reach: {
        id: "abyssal_rift_frostspine_reach",
        name: "Frostspine Reach",
        regionId: "abyssal_rift",
        x: 1100,
        y: -50,
        description: "A branch of the rift that has bled into the base of the Frostspine mountains. The ice here is black and infused with void essence.",
        activities: [
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
            {
                type: "combat",
                monsterId: "frost_wyvern",
            },
        ],
        connections: [
            "abyssal_rift_frozen_echo_gate",
            "abyssal_rift_glacier_edge",
        ],
    },
    abyssal_rift_glacier_edge: {
        id: "abyssal_rift_glacier_edge",
        name: "Void-Glacier Edge",
        regionId: "abyssal_rift",
        x: 1200,
        y: -50,
        description: "The edge of a subterranean glacier that extends into the abyss. It is beautiful and terrifying.",
        activities: [
            {
                type: "combat",
                monsterId: "frost_wyvern",
            },
            {
                type: "skilling",
                id: "void_ice_mining",
                name: "Starlight Ice",
                skill: SkillName.Mining,
                requiredLevel: 80,
                loot: [
                    {
                        itemId: "titanium_ore",
                        chance: 1,
                        xp: 125,
                    },
                ],
                resourceCount: {
                    min: 2,
                    max: 5,
                },
                respawnTime: 180000,
                gatherTime: 4000,
            },
        ],
        connections: ["abyssal_rift_frostspine_reach"],
    },
    abyssal_rift_obsidian_spiral_entry: {
        id: "abyssal_rift_obsidian_spiral_entry",
        name: "The Obsidian Spiral",
        regionId: "abyssal_rift",
        x: 900,
        y: 0,
        description: "A staircase of black glass that spirals down further into the Rift.",
        activities: [
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
        ],
        connections: ["abyssal_rift_gravity_well", "abyssal_rift_spiral_midpoint"],
    },
    abyssal_rift_spiral_midpoint: {
        id: "abyssal_rift_spiral_midpoint",
        name: "Spiral Midpoint",
        regionId: "abyssal_rift",
        x: 900,
        y: -50,
        description: "You are deep enough now that the entrance is just a pinprick of light far above.",
        activities: [
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
        ],
        connections: [
            "abyssal_rift_obsidian_spiral_entry",
            "abyssal_rift_spiral_bottom",
            "abyssal_rift_shadow_lock",
        ],
    },
    abyssal_rift_shadow_lock: {
        id: "abyssal_rift_shadow_lock",
        name: "The Shadow-Lock",
        regionId: "abyssal_rift",
        x: 900,
        y: -100,
        description: "An ancient mechanism of floating shadows. It requires a specific frequency of light to pass.",
        connections: [
            "abyssal_rift_spiral_midpoint",
            "abyssal_rift_hidden_archive",
        ],
        connectionRequirements: {
            abyssal_rift_hidden_archive: {
                skill: SkillName.Magic,
                level: 75,
                xp: 600,
                description: "The lock responds to a powerful magical pulse.",
                actionText: "Dispel the Shadow-Lock",
            },
        },
    },
    abyssal_rift_hidden_archive: {
        id: "abyssal_rift_hidden_archive",
        name: "Abyssal Archive",
        regionId: "abyssal_rift",
        x: 900,
        y: -150,
        description: "A room filled with tablets that contain the forbidden history of the Slayer's Guild. The air is stagnant.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "archive_casket",
                targetName: "Historian's Casket",
                lootTableId: "thieving_dungeon_chest_master",
            },
            {
                type: "combat",
                monsterId: "ethereal_phantom",
            },
        ],
        connections: ["abyssal_rift_shadow_lock"],
    },
    abyssal_rift_spiral_bottom: {
        id: "abyssal_rift_spiral_bottom",
        name: "Bottom of the Spiral",
        regionId: "abyssal_rift",
        x: 750,
        y: -50,
        description: "The staircase ends here, opening into a vast, star-flecked expanse.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_spiral_midpoint",
            "abyssal_rift_floating_isles_entry",
        ],
    },
    abyssal_rift_floating_isles_entry: {
        id: "abyssal_rift_floating_isles_entry",
        name: "The Inner Void",
        regionId: "abyssal_rift",
        x: 650,
        y: 0,
        description: "A series of floating rock platforms suspended over an infinite drop. One wrong step is death.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_spiral_bottom",
            "abyssal_rift_leap_of_faith",
            "abyssal_rift_void_reach_1",
        ],
    },
    abyssal_rift_leap_of_faith: {
        id: "abyssal_rift_leap_of_faith",
        name: "Leap of Faith",
        regionId: "abyssal_rift",
        x: 550,
        y: 150,
        description: "The platforms here are nearly invisible, flickering in and out of existence.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_floating_isles_entry",
            "abyssal_rift_star_forge_entry",
        ],
        connectionRequirements: {
            abyssal_rift_star_forge_entry: {
                skill: SkillName.Agility,
                level: 80,
                xp: 1000,
                description: "You must time your jumps perfectly as the platforms phase through reality.",
                actionText: "Navigate Phasing Platforms",
            },
        },
    },
    abyssal_rift_star_forge_entry: {
        id: "abyssal_rift_star_forge_entry",
        name: "Entry to the Silent Keep",
        regionId: "abyssal_rift",
        x: 550,
        y: 300,
        description: "The architecture here is alien and monolithic. A great fortress stands silently in the void.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_leap_of_faith",
            "abyssal_rift_keep_outer_wall",
        ],
    },
    abyssal_rift_keep_outer_wall: {
        id: "abyssal_rift_keep_outer_wall",
        name: "Outer Wall of the Silent Keep",
        regionId: "abyssal_rift",
        x: 700,
        y: 300,
        description: "Walls of cold, black stone that absorb all light. There are no mortar lines; it was grown, not built.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_star_forge_entry",
            "abyssal_rift_inner_courtyard",
        ],
    },
    abyssal_rift_inner_courtyard: {
        id: "abyssal_rift_inner_courtyard",
        name: "The Silent Courtyard",
        regionId: "abyssal_rift",
        x: 700,
        y: 250,
        description: "A wide, empty space at the heart of the keep. The only sound is the thrumming of the Rift's power.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
        ],
        connections: [
            "abyssal_rift_keep_outer_wall",
            "abyssal_rift_throne_room_gate",
        ],
    },
    abyssal_rift_void_reach_1: {
        id: "abyssal_rift_void_reach_1",
        name: "Void-Scarred Reach",
        regionId: "abyssal_rift",
        x: 700,
        y: 50,
        description: "A jagged path of rock that appears to be bleeding pure shadow.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
        ],
        connections: [
            "abyssal_rift_floating_isles_entry",
            "abyssal_rift_void_reach_2",
        ],
    },
    abyssal_rift_void_reach_2: {
        id: "abyssal_rift_void_reach_2",
        name: "The Event Horizon Path",
        regionId: "abyssal_rift",
        x: 750,
        y: 100,
        description: "Time seems to slow down here. Your movements feel heavy and sluggish.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
        ],
        connections: ["abyssal_rift_void_reach_1", "abyssal_rift_abyssal_nexus"],
    },
    abyssal_rift_abyssal_nexus: {
        id: "abyssal_rift_abyssal_nexus",
        name: "The Final Nexus",
        regionId: "abyssal_rift",
        x: 750,
        y: 150,
        description: "The core of the Rift where all paths converge before diving into the absolute center.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
        ],
        connections: [
            "abyssal_rift_void_reach_2",
            "abyssal_rift_throne_room_gate",
            "abyssal_rift_void_mining_outpost",
        ],
    },
    abyssal_rift_void_mining_outpost: {
        id: "abyssal_rift_void_mining_outpost",
        name: "Void Mining Outpost",
        regionId: "abyssal_rift",
        x: 750,
        y: 200,
        description: "A small, abandoned outpost where slayers once tried to extract the Rift's energy directly.",
        activities: [
            {
                type: "skilling",
                id: "rift_titanium_mining",
                name: "Master-Grade Titanium",
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
                    min: 6,
                    max: 14,
                },
                respawnTime: 300000,
                gatherTime: 4000,
            },
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
        ],
        connections: ["abyssal_rift_abyssal_nexus"],
    },
    abyssal_rift_throne_room_gate: {
        id: "abyssal_rift_throne_room_gate",
        name: "The Grand Gate",
        regionId: "abyssal_rift",
        x: 650,
        y: 200,
        description: "A massive pair of doors built from the bones of creatures that existed before the stars.",
        activities: [
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
        ],
        connections: [
            "abyssal_rift_inner_courtyard",
            "abyssal_rift_abyssal_nexus",
            "abyssal_rift_heart_of_unmaking",
        ],
    },
    abyssal_rift_heart_of_unmaking: {
        id: "abyssal_rift_heart_of_unmaking",
        name: "Heart of Unmaking",
        regionId: "abyssal_rift",
        x: 600,
        y: 250,
        description: "The absolute center of the Rift. A sphere of pure white light at the center of a black void. It is beautiful, and it is the end of all things.",
        activities: [
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "void_stalker",
            },
            {
                type: "combat",
                monsterId: "shadow_weaver",
            },
            {
                type: "thieving_lockpick",
                id: "final_abyssal_chest",
                targetName: "Voidstar Casket",
                lootTableId: "thieving_dungeon_chest_master",
            },
            {
                type: "runecrafting_altar",
                runeId: "passage_rune",
            },
        ],
        connections: ["abyssal_rift_throne_room_gate"],
    },
};
