import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const CINDERFORGE_DEPTHS_POIS: Record<string, POI> = {
    cinderforge_entrance: {
        id: "cinderforge_entrance",
        name: "Cinderforge Entrance",
        regionId: "cinderforge_depths",
        x: 1050,
        y: 1950,
        description: "The gateway to the volcanic deeps. A steady draft of sulfurous air pulls you deeper into the scorched darkness.",
        connections: [
            "cinderforge_steam_tunnels",
            "cinderforge_maintenance_shaft",
            "scorched_magma_cathedral",
        ],
    },
    cinderforge_maintenance_shaft: {
        id: "cinderforge_maintenance_shaft",
        name: "Upper Maintenance Shaft",
        regionId: "cinderforge_depths",
        x: 980,
        y: 1980,
        description: "A narrow, soot-covered crawlway intended for those servicing the ancient forge vents.",
        connections: ["cinderforge_entrance", "cinderforge_vent_control_room"],
    },
    cinderforge_vent_control_room: {
        id: "cinderforge_vent_control_room",
        name: "Vent Control Room",
        regionId: "cinderforge_depths",
        x: 920,
        y: 2020,
        description: "Rusty levers and cracked dials line the walls. Some of the levers still hiss with escaping pressure.",
        activities: [
            {
                type: "combat",
                monsterId: "ember_demon",
            },
            {
                type: "thieving_lockpick",
                id: "cinderforge_control_stash",
                targetName: "Foreman's Locker",
                lootTableId: "thieving_dungeon_chest_mid",
            },
        ],
        connections: ["cinderforge_maintenance_shaft"],
    },
    cinderforge_steam_tunnels: {
        id: "cinderforge_steam_tunnels",
        name: "Hissing Steam Tunnels",
        regionId: "cinderforge_depths",
        x: 1120,
        y: 1980,
        description: "Condensation drips from the ceiling, boiling the instant it hits the floor. Visibility is low.",
        activities: [
            {
                type: "combat",
                monsterId: "ember_demon",
            },
        ],
        connections: [
            "cinderforge_entrance",
            "cinderforge_vent_chamber",
            "cinderforge_sulfur_pit",
        ],
    },
    cinderforge_vent_chamber: {
        id: "cinderforge_vent_chamber",
        name: "The Gilded Whistle",
        regionId: "cinderforge_depths",
        x: 1180,
        y: 1940,
        description: "A wide natural chamber where air pressure creates a haunting whistle through the cracks in the obsidian.",
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
            "cinderforge_steam_tunnels",
            "cinderforge_broken_scoria_path",
        ],
    },
    cinderforge_sulfur_pit: {
        id: "cinderforge_sulfur_pit",
        name: "Yellow-Glass Pit",
        regionId: "cinderforge_depths",
        x: 1080,
        y: 2050,
        description: "The ground here is fragile, composed of cooled sulfur and volcanic glass. It crumbles underfoot.",
        activities: [
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
            {
                type: "skilling",
                id: "cinderforge_sulfur_mining",
                name: "Sulfur Crystals",
                skill: SkillName.Mining,
                requiredLevel: 50,
                loot: [
                    {
                        itemId: "coal",
                        chance: 1,
                        xp: 50,
                    },
                ],
                resourceCount: {
                    min: 3,
                    max: 6,
                },
                respawnTime: 60000,
                gatherTime: 2500,
            },
        ],
        connections: [
            "cinderforge_steam_tunnels",
            "cinderforge_magma_shore",
            "cinderforge_ash_clogged_vent",
        ],
    },
    cinderforge_ash_clogged_vent: {
        id: "cinderforge_ash_clogged_vent",
        name: "Ash-Clogged Vent",
        regionId: "cinderforge_depths",
        x: 1020,
        y: 2100,
        description: "A dead-end vent filled to the brim with fine volcanic ash. Slayers often sift through it for lost artifacts.",
        activities: [
            {
                type: "skilling",
                id: "cinderforge_ash_sifting",
                name: "Sift through Ash",
                skill: SkillName.Mining,
                requiredLevel: 45,
                loot: [
                    {
                        itemId: "bucket_of_sand",
                        chance: 1,
                        xp: 15,
                    },
                ],
                resourceCount: {
                    min: 5,
                    max: 15,
                },
                respawnTime: 20000,
                gatherTime: 1000,
            },
        ],
        connections: ["cinderforge_sulfur_pit"],
    },
    cinderforge_broken_scoria_path: {
        id: "cinderforge_broken_scoria_path",
        name: "Broken Scoria Path",
        regionId: "cinderforge_depths",
        x: 1250,
        y: 1900,
        description: "A jagged path made of porous lava rock. Parts of the floor have collapsed into the void below.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: [
            "cinderforge_vent_chamber",
            "cinderforge_ash_crawl",
            "cinderforge_obsidian_arch",
            "cinderforge_scoria_overhang",
        ],
    },
    cinderforge_scoria_overhang: {
        id: "cinderforge_scoria_overhang",
        name: "Scoria Overhang",
        regionId: "cinderforge_depths",
        x: 1210,
        y: 1840,
        description: "A natural balcony overlooking the steam-filled tunnels below. The view is both beautiful and terrifying.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: ["cinderforge_broken_scoria_path"],
    },
    cinderforge_ash_crawl: {
        id: "cinderforge_ash_crawl",
        name: "The Ash Crawl",
        regionId: "cinderforge_depths",
        x: 1320,
        y: 1850,
        description: "A narrow tunnel choked with hot ash. You must stay low to avoid the worst of the heat.",
        activities: [
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
        ],
        connections: [
            "cinderforge_broken_scoria_path",
            "cinderforge_catacombs_entrance",
        ],
    },
    cinderforge_catacombs_entrance: {
        id: "cinderforge_catacombs_entrance",
        name: "Smothered Catacombs",
        regionId: "cinderforge_depths",
        x: 1380,
        y: 1800,
        description: "A forgotten network of tombs where high-ranking slayers of old were interred in the heat of the mountain.",
        activities: [
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
        ],
        connections: ["cinderforge_ash_crawl", "cinderforge_catacombs_depths"],
    },
    cinderforge_catacombs_depths: {
        id: "cinderforge_catacombs_depths",
        name: "Catacomb Depths",
        regionId: "cinderforge_depths",
        x: 1450,
        y: 1750,
        description: "The air here is deathly still. Dust Fiends have claimed the sarcophagi as their own.",
        activities: [
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
            {
                type: "combat",
                monsterId: "dust_fiend",
            },
            {
                type: "thieving_lockpick",
                id: "catacomb_chest",
                targetName: "Dichroic Urn",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        connections: ["cinderforge_catacombs_entrance"],
    },
    cinderforge_obsidian_arch: {
        id: "cinderforge_obsidian_arch",
        name: "The Obsidian Arch",
        regionId: "cinderforge_depths",
        x: 1400,
        y: 1950,
        description: "A natural archway of razor-sharp black glass. It marks the transition to the deeper forge levels.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: [
            "cinderforge_broken_scoria_path",
            "cinderforge_magma_river_north",
        ],
    },
    cinderforge_magma_shore: {
        id: "cinderforge_magma_shore",
        name: "Magma Shore",
        regionId: "cinderforge_depths",
        x: 1100,
        y: 2150,
        description: "The air temperature spikes as you approach the molten river flowing through the cavern's center.",
        activities: [
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: [
            "cinderforge_sulfur_pit",
            "cinderforge_magma_bridge_west",
            "cinderforge_low_shore_path",
        ],
    },
    cinderforge_low_shore_path: {
        id: "cinderforge_low_shore_path",
        name: "Low Shore Trail",
        regionId: "cinderforge_depths",
        x: 1050,
        y: 2220,
        description: "A path that dips dangerously close to the surface of the magma river. The heat singes your hair.",
        activities: [
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: ["cinderforge_magma_shore"],
    },
    cinderforge_magma_bridge_west: {
        id: "cinderforge_magma_bridge_west",
        name: "The Scorched Span (West)",
        regionId: "cinderforge_depths",
        x: 1200,
        y: 2200,
        description: "A precarious bridge of black rock. The magma below bubbles and spits with violent intensity.",
        activities: [
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: ["cinderforge_magma_shore", "cinderforge_bridge_nexus"],
        connectionRequirements: {
            cinderforge_bridge_nexus: {
                skill: SkillName.Agility,
                level: 52,
                xp: 400,
                description: "The bridge has partially collapsed. You'll need to leap across the floating debris.",
                actionText: "Leap Across Debris",
            },
        },
    },
    cinderforge_magma_river_north: {
        id: "cinderforge_magma_river_north",
        name: "Magma Shore (North)",
        regionId: "cinderforge_depths",
        x: 1450,
        y: 2050,
        description: "A wide beach of volcanic sand bordering the slow-moving river of liquid fire.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "skilling",
                id: "cinderforge_sand_collecting",
                name: "Volcanic Sand",
                skill: SkillName.Mining,
                requiredLevel: 50,
                loot: [
                    {
                        itemId: "bucket_of_sand",
                        chance: 1,
                        xp: 20,
                    },
                ],
                resourceCount: {
                    min: 10,
                    max: 20,
                },
                respawnTime: 30000,
                gatherTime: 1500,
            },
        ],
        connections: [
            "cinderforge_obsidian_arch",
            "cinderforge_magma_bridge_east",
            "cinderforge_obsidian_spire_base",
        ],
    },
    cinderforge_obsidian_spire_base: {
        id: "cinderforge_obsidian_spire_base",
        name: "Obsidian Spire Base",
        regionId: "cinderforge_depths",
        x: 1550,
        y: 1980,
        description: "A massive monolith of volcanic glass rises into the ceiling here. A spiral path has been carved into its side.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: ["cinderforge_magma_river_north", "cinderforge_spire_ascent"],
    },
    cinderforge_spire_ascent: {
        id: "cinderforge_spire_ascent",
        name: "The Glass Spiral",
        regionId: "cinderforge_depths",
        x: 1600,
        y: 1900,
        description: "You climb high above the magma river. The heat rises with you, trapped against the ceiling.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: [
            "cinderforge_obsidian_spire_base",
            "cinderforge_spire_summit",
        ],
    },
    cinderforge_spire_summit: {
        id: "cinderforge_spire_summit",
        name: "Spire Summit",
        regionId: "cinderforge_depths",
        x: 1650,
        y: 1850,
        description: "The highest point in the cavern. A small shrine to an ancient smith-god overlooks the forge.",
        activities: [
            {
                type: "thieving_lockpick",
                id: "spire_offering",
                targetName: "Obsidian Casket",
                lootTableId: "thieving_dungeon_chest_elite",
            },
        ],
        connections: ["cinderforge_spire_ascent"],
    },
    cinderforge_magma_bridge_east: {
        id: "cinderforge_magma_bridge_east",
        name: "The Scorched Span (East)",
        regionId: "cinderforge_depths",
        x: 1400,
        y: 2150,
        description: "The eastern half of the bridge is heavily encrusted with obsidian. It looks more stable than the west.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: ["cinderforge_magma_river_north", "cinderforge_bridge_nexus"],
    },
    cinderforge_bridge_nexus: {
        id: "cinderforge_bridge_nexus",
        name: "The Fire-Flecked Pillar",
        regionId: "cinderforge_depths",
        x: 1300,
        y: 2250,
        description: "A massive central pillar that supports the intersection of several natural spans over the magma.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: [
            "cinderforge_magma_bridge_west",
            "cinderforge_magma_bridge_east",
            "cinderforge_obsidian_throat",
            "cinderforge_middle_pump_room",
        ],
    },
    cinderforge_middle_pump_room: {
        id: "cinderforge_middle_pump_room",
        name: "Middle Pump Room",
        regionId: "cinderforge_depths",
        x: 1425,
        y: 2275,
        description: "Ancient hydraulic pumps groan as they move liquid scoria through the mountain. The vibrations are deafening.",
        activities: [
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: [
            "cinderforge_bridge_nexus",
            "cinderforge_magma_cooling_tanks",
        ],
    },
    cinderforge_magma_cooling_tanks: {
        id: "cinderforge_magma_cooling_tanks",
        name: "Magma Cooling Tanks",
        regionId: "cinderforge_depths",
        x: 1500,
        y: 2350,
        description: "Massive vats where magma is slowly tempered before being used in the forge. The air is slightly more breathable here.",
        activities: [
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
            {
                type: "combat",
                monsterId: "gelatinous_abomination",
            },
        ],
        connections: ["cinderforge_middle_pump_room"],
    },
    cinderforge_obsidian_throat: {
        id: "cinderforge_obsidian_throat",
        name: "The Obsidian Throat",
        regionId: "cinderforge_depths",
        x: 1350,
        y: 2350,
        description: "A narrow, smooth-walled tunnel that feels like it was cut with a hot blade. It slopes steeply downward.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: ["cinderforge_bridge_nexus", "cinderforge_cooling_sanctum"],
    },
    cinderforge_cooling_sanctum: {
        id: "cinderforge_cooling_sanctum",
        name: "The Cooling Sanctum",
        regionId: "cinderforge_depths",
        x: 1250,
        y: 2450,
        description: "An ancient hall where the heat is lessened by mysterious carvings in the stone that pulse with cold blue energy.",
        activities: [
            {
                type: "combat",
                monsterId: "howling_terror",
            },
            {
                type: "combat",
                monsterId: "howling_terror",
            },
        ],
        connections: [
            "cinderforge_obsidian_throat",
            "cinderforge_obsidian_seam",
            "cinderforge_inner_vault",
            "cinderforge_crystal_grotto",
        ],
    },
    cinderforge_crystal_grotto: {
        id: "cinderforge_crystal_grotto",
        name: "Crystal Grotto",
        regionId: "cinderforge_depths",
        x: 1350,
        y: 2500,
        description: "A hidden pocket of the cavern where volcanic gases have crystallized into beautiful, dangerous shards.",
        activities: [
            {
                type: "skilling",
                id: "grotto_crystal_mining",
                name: "Rare Geodes",
                skill: SkillName.Mining,
                requiredLevel: 60,
                loot: [
                    {
                        itemId: "uncut_ruby",
                        chance: 1,
                        xp: 120,
                    },
                ],
                resourceCount: {
                    min: 2,
                    max: 4,
                },
                respawnTime: 300000,
                gatherTime: 4000,
            },
        ],
        connections: ["cinderforge_cooling_sanctum"],
    },
    cinderforge_obsidian_seam: {
        id: "cinderforge_obsidian_seam",
        name: "Deep Obsidian Seam",
        regionId: "cinderforge_depths",
        x: 1150,
        y: 2400,
        description: "A wall of pure obsidian, glistening with trapped light. Slayers often come here to harvest material for enchanted gear.",
        activities: [
            {
                type: "skilling",
                id: "cinderforge_final_mining",
                name: "High-Grade Obsidian",
                skill: SkillName.Mining,
                requiredLevel: 55,
                loot: [
                    {
                        itemId: "brimstone",
                        chance: 1,
                        xp: 80,
                    },
                ],
                resourceCount: {
                    min: 5,
                    max: 10,
                },
                respawnTime: 120000,
                gatherTime: 3000,
            },
            {
                type: "combat",
                monsterId: "stone_guardian",
            },
        ],
        connections: ["cinderforge_cooling_sanctum"],
    },
    cinderforge_inner_vault: {
        id: "cinderforge_inner_vault",
        name: "The Scoria Vault",
        regionId: "cinderforge_depths",
        x: 1275,
        y: 2550,
        description: "The innermost chamber of the depths. The machinery here is ancient and functional, though its original purpose is lost.",
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
        connections: ["cinderforge_cooling_sanctum", "cinderforge_heart"],
    },
    cinderforge_heart: {
        id: "cinderforge_heart",
        name: "The Eternal Forge",
        regionId: "cinderforge_depths",
        x: 1250,
        y: 2650,
        description: "A massive, heat-damped anvil sits at the center of a circular platform. The magma below provides infinite heat for the greatest of slayers.",
        activities: [
            {
                type: "furnace",
            },
            {
                type: "anvil",
            },
            {
                type: "thieving_lockpick",
                id: "cinderforge_final_chest",
                targetName: "Ornate Scoria Chest",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        connections: ["cinderforge_inner_vault"],
    },
};
