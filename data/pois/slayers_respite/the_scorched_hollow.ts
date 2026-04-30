import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const SCORCHED_HOLLOW_POIS: Record<string, POI> = {
    scorched_hollow_descent: {
        id: "scorched_hollow_descent",
        name: "Scorched Hollow Descent",
        regionId: "the_scorched_hollow",
        x: 950,
        y: 1400,
        description: "The ground abruptly drops away into a massive, heat-shimmering bowl. Blackened stone and rivers of fire dominate the view.",
        connections: [
            "respite_approach_scorched",
            "scorched_rim_trail_west",
            "scorched_rim_trail_east",
            "scorched_center_slope",
        ],
    },
    scorched_rim_trail_west: {
        id: "scorched_rim_trail_west",
        name: "Western Rim Trail",
        regionId: "the_scorched_hollow",
        x: 850,
        y: 1400,
        description: "A narrow path hugging the western cliffside of the hollow. The air is slightly cooler here, but the drop is lethal.",
        connections: ["scorched_hollow_descent", "scorched_obsidian_approach"],
    },
    scorched_rim_trail_east: {
        id: "scorched_rim_trail_east",
        name: "Eastern Rim Trail",
        regionId: "the_scorched_hollow",
        x: 1050,
        y: 1450,
        description: "A wider ledge overlooking the central magma pools. Heat waves distort your vision.",
        connections: ["scorched_hollow_descent", "scorched_sulfur_springs_1"],
    },
    scorched_obsidian_approach: {
        id: "scorched_obsidian_approach",
        name: "Glass Ledge",
        regionId: "the_scorched_hollow",
        x: 800,
        y: 1450,
        description: "The stone underfoot changes to razor-sharp obsidian. Every step sounds like shattering glass.",
        activities: [
            {
                type: "combat",
                monsterId: "cinder_wisp",
            },
            {
                type: "combat",
                monsterId: "cinder_imp",
            },
        ],
        connections: ["scorched_rim_trail_west", "scorched_obsidian_pillars_low"],
    },
    scorched_obsidian_pillars_low: {
        id: "scorched_obsidian_pillars_low",
        name: "Lower Obsidian Pillars",
        regionId: "the_scorched_hollow",
        x: 750,
        y: 1500,
        description: "Massive shards of volcanic glass rise like dark skyscrapers. They hum with trapped thermal energy.",
        activities: [
            {
                type: "skilling",
                id: "scorched_mining_obsidian",
                name: "Raw Obsidian Shard",
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
                    min: 4,
                    max: 8,
                },
                respawnTime: 60000,
                gatherTime: 2500,
            },
        ],
        connections: ["scorched_obsidian_approach", "scorched_obsidian_maze_1"],
    },
    scorched_obsidian_maze_1: {
        id: "scorched_obsidian_maze_1",
        name: "Shifting Glass Maze",
        regionId: "the_scorched_hollow",
        x: 700,
        y: 1550,
        description: "The pillars are so dense here that you lose sight of the horizon. Glints of magma reflect endlessly in the glass.",
        activities: [
            {
                type: "combat",
                monsterId: "magma_slug",
            },
        ],
        connections: [
            "scorched_obsidian_pillars_low",
            "scorched_obsidian_maze_2",
            "scorched_obsidian_hidden_alcove",
        ],
    },
    scorched_obsidian_hidden_alcove: {
        id: "scorched_obsidian_hidden_alcove",
        name: "Glasswork Alcove",
        regionId: "the_scorched_hollow",
        x: 650,
        y: 1500,
        description: "A secluded spot where the glass has formed a natural crystalline cave.",
        activities: [
            {
                type: "skilling",
                id: "scorched_thieving_1",
                name: "Abandoned Scoria Cache",
                skill: SkillName.Thieving,
                requiredLevel: 60,
                lootTableId: "thieving_dungeon_chest_mid",
                loot: [],
                resourceCount: {
                    min: 1,
                    max: 1,
                },
                respawnTime: 60000,
                gatherTime: 2000,
            },
        ],
        connections: ["scorched_obsidian_maze_1"],
    },
    scorched_obsidian_maze_2: {
        id: "scorched_obsidian_maze_2",
        name: "The Razor's Edge",
        regionId: "the_scorched_hollow",
        x: 650,
        y: 1600,
        description: "The path narrows until it is barely a foot wide, suspended over a pool of pure liquid fire.",
        connectionRequirements: {
            scorched_obsidian_peak: {
                skill: SkillName.Agility,
                level: 65,
                xp: 300,
                description: "The ledge is slippery with volcanic soot. You'll need perfect balance to cross.",
                actionText: "Balance across the glass ridge",
            },
        },
        connections: ["scorched_obsidian_maze_1", "scorched_obsidian_peak"],
    },
    scorched_obsidian_peak: {
        id: "scorched_obsidian_peak",
        name: "Obsidian Pinnacle",
        regionId: "the_scorched_hollow",
        x: 600,
        y: 1650,
        description: "The highest point on the western rim. From here, you can see the distant fog of the Shattered Coast.",
        activities: [
            {
                type: "skilling",
                id: "scorched_mining_titanium_1",
                name: "Glass-Encased Titanium",
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
                gatherTime: 5000,
            },
            {
                type: "combat",
                monsterId: "obsidian_golem",
            },
        ],
        connections: ["scorched_obsidian_maze_2", "scorched_western_descent"],
    },
    scorched_western_descent: {
        id: "scorched_western_descent",
        name: "Western Ash-Slide",
        regionId: "the_scorched_hollow",
        x: 650,
        y: 1700,
        description: "A steep slope of cooling ash that allows for a quick (if messy) descent into the basin.",
        connections: ["scorched_obsidian_peak", "scorched_basalt_plaza"],
    },
    scorched_center_slope: {
        id: "scorched_center_slope",
        name: "The Cindered Slope",
        regionId: "the_scorched_hollow",
        x: 900,
        y: 1500,
        description: "The primary descent into the hollow's heart. Every step kicks up a cloud of hot soot.",
        connections: ["scorched_hollow_descent", "scorched_ash_fields_1"],
    },
    scorched_ash_fields_1: {
        id: "scorched_ash_fields_1",
        name: "The Inner Ash Fields",
        regionId: "the_scorched_hollow",
        x: 850,
        y: 1550,
        description: "A vast expanse of gray dust. The remains of a jungle from a thousand years ago stand as petrified, burning pillars.",
        activities: [
            {
                type: "skilling",
                id: "scorched_mining_coal_1",
                name: "Petrified Coal Trunk",
                skill: SkillName.Mining,
                requiredLevel: 30,
                loot: [
                    {
                        itemId: "coal",
                        chance: 1,
                        xp: 50,
                    },
                ],
                resourceCount: {
                    min: 4,
                    max: 10,
                },
                respawnTime: 45000,
                gatherTime: 2000,
            },
        ],
        connections: [
            "scorched_center_slope",
            "scorched_ash_fields_2",
            "scorched_sulfur_springs_2",
        ],
    },
    scorched_ash_fields_2: {
        id: "scorched_ash_fields_2",
        name: "Grey Snow Basin",
        regionId: "the_scorched_hollow",
        x: 800,
        y: 1600,
        description: "Ash falls from the sky here like heavy snow, muffling all sound.",
        activities: [
            {
                type: "combat",
                monsterId: "magma_slug",
            },
            {
                type: "combat",
                monsterId: "char_elemental",
            },
        ],
        connections: ["scorched_ash_fields_1", "scorched_basalt_plaza"],
    },
    scorched_basalt_plaza: {
        id: "scorched_basalt_plaza",
        name: "Basalt Plaza",
        regionId: "the_scorched_hollow",
        x: 850,
        y: 1650,
        description: "A natural formation of hexagonal basalt columns. It looks almost like a man-made courtyard.",
        activities: [
            {
                type: "combat",
                monsterId: "magma_slug",
            },
            {
                type: "combat",
                monsterId: "magma_slug",
            },
            {
                type: "combat",
                monsterId: "char_elemental",
            },
        ],
        connections: [
            "scorched_ash_fields_2",
            "scorched_western_descent",
            "scorched_lava_bridge_1",
            "scorched_magma_vent_hub",
        ],
    },
    scorched_lava_bridge_1: {
        id: "scorched_lava_bridge_1",
        name: "Ancient Stone Bridge",
        regionId: "the_scorched_hollow",
        x: 900,
        y: 1700,
        description: "A massive slab of rock spanning a river of liquid fire. It feels ready to buckle at any moment.",
        connections: ["scorched_basalt_plaza", "scorched_lava_bridge_2"],
    },
    scorched_lava_bridge_2: {
        id: "scorched_lava_bridge_2",
        name: "Lava Archway",
        regionId: "the_scorched_hollow",
        x: 950,
        y: 1750,
        description: "The path passes directly under a natural arch of glowing rock.",
        activities: [
            {
                type: "combat",
                monsterId: "cinder_wisp",
            },
            {
                type: "combat",
                monsterId: "cinder_imp",
            },
        ],
        connections: ["scorched_lava_bridge_1", "scorched_hollow_pass"],
    },
    scorched_hollow_pass: {
        id: "scorched_hollow_pass",
        name: "The Hollow Pass",
        regionId: "the_scorched_hollow",
        x: 1000,
        y: 1800,
        description: "A deep trench carved by ancient lava flows. The walls pulse with a rhythmic, orange light.",
        connections: [
            "scorched_lava_bridge_2",
            "cinderforge_entrance",
            "scorched_magma_cathedral",
        ],
    },
    scorched_magma_cathedral: {
        id: "scorched_magma_cathedral",
        name: "Magma Cathedral",
        regionId: "the_scorched_hollow",
        x: 1050,
        y: 1850,
        description: "A towering cavern where the lava forms massive, glowing curtains. The heat is legendary.",
        activities: [
            {
                type: "furnace",
            },
            {
                type: "anvil",
            },
            {
                type: "combat",
                monsterId: "obsidian_golem",
            },
            {
                type: "combat",
                monsterId: "magma_crawler",
            },
        ],
        connections: ["scorched_hollow_pass", "cinderforge_entrance"],
    },
    scorched_sulfur_springs_1: {
        id: "scorched_sulfur_springs_1",
        name: "Upper Sulfur Springs",
        regionId: "the_scorched_hollow",
        x: 1100,
        y: 1500,
        description: "Pools of boiling, yellow-tinted water emit noxious, eye-watering fumes.",
        activities: [
            {
                type: "skilling",
                id: "scorched_herb_1",
                name: "Heat-Treated Stonebloom",
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
        connections: ["scorched_rim_trail_east", "scorched_sulfur_springs_2"],
    },
    scorched_sulfur_springs_2: {
        id: "scorched_sulfur_springs_2",
        name: "The Boiling Mire",
        regionId: "the_scorched_hollow",
        x: 1000,
        y: 1550,
        description: "The ground here is a mix of hot mud and yellow mineral deposits.",
        activities: [
            {
                type: "combat",
                monsterId: "cinder_wisp",
            },
            {
                type: "combat",
                monsterId: "ash_wraith",
            },
        ],
        connections: [
            "scorched_sulfur_springs_1",
            "scorched_ash_fields_1",
            "scorched_sulfur_pools_deep",
        ],
    },
    scorched_sulfur_pools_deep: {
        id: "scorched_sulfur_pools_deep",
        name: "The Primordial Soup",
        regionId: "the_scorched_hollow",
        x: 1050,
        y: 1600,
        description: "Deep, bubbling vats of emerald-green sludge. Something moves in the depths.",
        activities: [
            {
                type: "skilling",
                id: "scorched_fishing_1",
                name: "Lava-Scale Fishing",
                skill: SkillName.Fishing,
                requiredLevel: 70,
                loot: [
                    {
                        itemId: "raw_shark",
                        chance: 1,
                        xp: 110,
                    },
                ],
                resourceCount: {
                    min: 4,
                    max: 8,
                },
                respawnTime: 60000,
                gatherTime: 2500,
                requiredTool: ToolType.Harpoon,
            },
        ],
        connections: ["scorched_sulfur_springs_2", "scorched_steam_vents_path"],
    },
    scorched_steam_vents_path: {
        id: "scorched_steam_vents_path",
        name: "Scalding Flats",
        regionId: "the_scorched_hollow",
        x: 1100,
        y: 1650,
        description: "Steam jets blast from the ground at irregular intervals. You have to time your sprints carefully.",
        activities: [
            {
                type: "combat",
                monsterId: "magma_slug",
            },
            {
                type: "combat",
                monsterId: "magma_crawler",
            },
            {
                type: "combat",
                monsterId: "ash_wraith",
            },
        ],
        connections: ["scorched_sulfur_pools_deep", "scorched_magma_vent_hub"],
    },
    scorched_magma_vent_hub: {
        id: "scorched_magma_vent_hub",
        name: "The Furnace Crater",
        regionId: "the_scorched_hollow",
        x: 1000,
        y: 1650,
        description: "A natural impact crater that serves as a central vent for the entire valley. The ground itself is red-hot.",
        activities: [
            {
                type: "furnace",
            },
            {
                type: "skilling",
                id: "scorched_mining_adamant",
                name: "Smoldering Adamantite",
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
                    max: 5,
                },
                respawnTime: 90000,
                gatherTime: 3500,
            },
        ],
        connections: [
            "scorched_steam_vents_path",
            "scorched_basalt_plaza",
            "scorched_cinder_overlook",
        ],
    },
    scorched_cinder_overlook: {
        id: "scorched_cinder_overlook",
        name: "Cinder Overlook",
        regionId: "the_scorched_hollow",
        x: 1100,
        y: 1750,
        description: "A high ledge providing a majestic and terrifying view of the Cinderforge entrance.",
        activities: [
            {
                type: "skilling",
                id: "scorched_herblore_2",
                name: "Obsidian-Grown Stonebloom",
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
                respawnTime: 300000,
                gatherTime: 4000,
            },
        ],
        connections: ["scorched_magma_vent_hub"],
    },
};
