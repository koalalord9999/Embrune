import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const IRONMAW_POIS: Record<string, POI> = {
    ironmaw_gate: {
        id: "ironmaw_gate",
        name: "Ironmaw Gate",
        regionId: "ironmaw",
        x: 1400,
        y: 825,
        description: "A massive iron-bound gate built into the living rock of the mountain. Guards in blackened plate-mail stand watch.",
        connections: ["ironmaw_plaza", "respite_approach_ironmaw"],
        activities: [
            {
                type: "npc",
                name: "Scout Lira",
                icon: "guard",
                dialogue: {
                    start: {
                        npcName: "Scout Lira",
                        npcIcon: "guard",
                        text: "Watch yourself if you're heading east into the Thornveil. The Canopy Stalkers don't give warnings, and the Jungle Serpents have venom that'll turn your blood to sludge.",
                        responses: [
                            {
                                text: "I'll be careful.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        type: "internal",
        eX: 1400,
        eY: 825,
    },
    ironmaw_plaza: {
        id: "ironmaw_plaza",
        name: "Foundry Plaza",
        regionId: "ironmaw",
        x: 1475,
        y: 800,
        description: "The primary hub of Ironmaw. The air is thick with the scent of coal-smoke and hot metal. A clockwork elevator rumbles in the background.",
        activities: [
            {
                type: "npc",
                name: "Overseer Rorik",
                icon: "person",
                pickpocket: { lootTableId: "pickpocket_merchant_table" },
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Overseer Rorik",
                        npcIcon: "person",
                        text: "The cliffs here are practically made of ore. You'll never run short of iron or coal.\n\nForgemaster Thalric can smith things most smiths won't even attempt. All slayer gear, no questions.\n\nThe Thornveil starts just past the east trail. Beautiful canopy. Horrible things underneath it.\n\nScout Lira patrols the border every day. She's seen things in there that would curl your toes.\n\nThis town started as a mining camp. We just never left.\n\nHerbalist Wynn brews the best combat potions on the island. Expensive, but worth it.\n\nIf you're heading north to the Ridge, stock up. There's no supplies past the treeline.\n\nThe Canopy Stalkers in the Thornveil drop from the trees. Look up, always.\n\nMiner Gretchen says there are tunnels beneath this place that go deeper than anyone's mapped.\n\nThe forge fires never go out here. There's always someone smelting.\n\nBring a Broad-bladed Sword if you're going after Leaf Beasts. Regular swords just bounce off.\n\nSome of the ore veins here yield three or four times what you'd get on the mainland.\n\nThe Thornback Beetles have armor like plate mail. Use a warhammer on them.\n\nI heard a Jungle Serpent took out two slayers last week. Venom's no joke.\n\nThis is the last stop for supplies before the real wilds. Stock up.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Ironmaw Miner",
                icon: "person",
                pickpocket: { lootTableId: "pickpocket_dwarf_table" },
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Ironmaw Miner",
                        npcIcon: "person",
                        text: "Another day, another ton of iron. At least the pay is steady.\n\nHeard they found a vein of pure silver in the lower levels. Overseers are keeping it quiet, though.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "thieving_stall",
                id: "ironmaw_dwarven_stall",
                name: "Steal from Dwarven Supply Stall",
                lootTableId: "thieving_stall_dwarven"
            },
        ],
        connections: [
            "ironmaw_gate",
            "ironmaw_exchange",
            "ironmaw_foundry_row",
            "ironmaw_mine_staircase",
            "ironmaw_general_store",
            "ironmaw_workers_row",
        ],
        type: "internal",
    },
    ironmaw_exchange: {
        id: "ironmaw_exchange",
        name: "Ironmaw Exchange",
        regionId: "ironmaw",
        x: 1450,
        y: 775,
        description: "A high-security bank and trade hall where the mountain's bounty is weighed, assayed, and stored.",
        activities: [
            {
                type: "npc",
                name: "Banker Grimstone",
                icon: "person",
                actions: [
                    {
                        label: "Bank",
                        action: "open_bank",
                    },
                    {
                        label: "Deposit Backpack",
                        action: "deposit_backpack",
                    },
                    {
                        label: "Deposit Equipment",
                        action: "deposit_equipment",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Banker Grimstone",
                        npcIcon: "person",
                        text: "Welcome to the Exchange. Your assets are as secure as the mountain itself. What do you need?",
                        responses: [
                            {
                                text: "I'd like to access my vault.",
                                next: "access_bank",
                            },
                            {
                                text: "Just looking.",
                            },
                        ],
                    },
                    access_bank: {
                        npcName: "Banker Grimstone",
                        npcIcon: "person",
                        text: "Of course. Right this way.",
                        responses: [
                            {
                                text: "Yes, open it.",
                                actions: [
                                    {
                                        type: "open_bank",
                                    },
                                ],
                            },
                            {
                                text: "Not now.",
                            },
                        ],
                    },
                },
                pickpocket: { lootTableId: "pickpocket_knight_table" },
                startNode: "start",
            },
        ],
        connections: ["ironmaw_plaza", "ironmaw_mining_rail"],
        type: "internal",
    },
    ironmaw_foundry_row: {
        id: "ironmaw_foundry_row",
        name: "Foundry Row",
        regionId: "ironmaw",
        x: 1575,
        y: 800,
        description: "A street lined with smaller workshops and the massive intakes for the main foundry.",
        connections: [
            "ironmaw_plaza",
            "ironmaw_foundry",
            "ironmaw_smithy",
            "ironmaw_tavern",
        ],
        type: "internal",
    },
    ironmaw_foundry: {
        id: "ironmaw_foundry",
        name: "Great Cinder Foundry",
        regionId: "ironmaw",
        x: 1600,
        y: 775,
        description: "Ironmaw's industrial powerhouse. It uses the mountain's internal volcanic heat to smelt tons of ore daily.",
        activities: [
            {
                type: "furnace",
            },
            {
                type: "npc",
                name: "Forgemaster Thalric",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Forgemaster Thalric",
                        npcIcon: "person",
                        text: "I can smith things most smiths on the mainland won't even attempt. All slayer gear, no questions asked. You bring the materials and the coin, I bring the heat.",
                        responses: [
                            {
                                text: "What do you specialize in?",
                                next: "specialization",
                            },
                        ],
                    },
                    specialization: {
                        npcName: "Forgemaster Thalric",
                        npcIcon: "person",
                        text: "Broad-bladed swords for the Thornveil beasts, and reinforced plate for the Rift horrors. If it needs to be tough, it needs to be forged in the Cinder Foundry.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["ironmaw_foundry_row", "ironmaw_housing_upper"],
        type: "internal",
    },
    ironmaw_smithy: {
        id: "ironmaw_smithy",
        name: "The Maw's Anvil",
        regionId: "ironmaw",
        x: 1600,
        y: 825,
        description: "A specialized forge where master smiths work with processed scoria and high quality metals.",
        activities: [
            {
                type: "anvil",
            },
            {
                type: "shop",
                shopId: "respite_smithy",
            },
        ],
        connections: ["ironmaw_foundry_row"],
        type: "internal",
    },
    ironmaw_housing_upper: {
        id: "ironmaw_housing_upper",
        name: "Upper Tier Bunks",
        regionId: "ironmaw",
        x: 1575,
        y: 750,
        description: "Housing for overseers and master craftsmen. The air filters here actually work.",
        connections: ["ironmaw_foundry"],
        activities: [
            { type: "thieving_pilfer", id: "ironmaw_house_u1", name: "Overseer's Quarters" },
            { type: "thieving_pilfer", id: "ironmaw_house_u2", name: "Master Smith's Home" },
        ],
        type: "internal",
    },
    ironmaw_mine_staircase: {
        id: "ironmaw_mine_staircase",
        name: "The Great Stair",
        regionId: "ironmaw",
        x: 1475,
        y: 775,
        description: "A massive, winding stone staircase that descends hundreds of feet into the lower city.",
        connections: [
            "ironmaw_plaza",
            "ironmaw_mine_entrance",
            "ironmaw_housing_lower",
        ],
        type: "internal",
    },
    ironmaw_mine_entrance: {
        id: "ironmaw_mine_entrance",
        name: "Ironmaw Main Shaft",
        regionId: "ironmaw",
        x: 1475,
        y: 725,
        description: "The primary descent into the deep mines. Slayers use this as a staging ground before entering the lower tunnels.",
        connections: ["ironmaw_mine_staircase", "ironmaw_mining_rail"],
        activities: [
            {
                type: "npc",
                name: "Miner Gretchen",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Miner Gretchen",
                        npcIcon: "person",
                        text: "There's tunnels beneath this place that go deeper than anyone's mapped. Some say they go all the way to the Abyssal Expanse. Me? I just follow the ore veins.",
                        responses: [
                            {
                                text: "Is it dangerous down there?",
                                next: "danger",
                            },
                        ],
                    },
                    danger: {
                        npcName: "Miner Gretchen",
                        npcIcon: "person",
                        text: "If the cave-ins don't get you, the things that live in the dark will. Always carry a spare torch, and never mine alone.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        type: "internal",
    },
    ironmaw_mining_rail: {
        id: "ironmaw_mining_rail",
        name: "The Ore Rail",
        regionId: "ironmaw",
        x: 1425,
        y: 725,
        description: "A functional rail system for transporting ore. Narrow catwalks run alongside the tracks.",
        connections: ["ironmaw_mine_entrance", "ironmaw_exchange"],
        type: "internal",
    },
    ironmaw_housing_lower: {
        id: "ironmaw_housing_lower",
        name: "Miner's Warrens",
        regionId: "ironmaw",
        x: 1500,
        y: 750,
        description: "Densely packed housing units carved into the rock face. The constant hum of mining provides a continuous backdrop to life here.",
        connections: ["ironmaw_mine_staircase"],
        activities: [
            { type: "thieving_pilfer", id: "ironmaw_house_l1", name: "Miner's Bunk" },
            { type: "thieving_pilfer", id: "ironmaw_house_l2", name: "Cave Dwelling" },
            { type: "thieving_pilfer", id: "ironmaw_house_l3", name: "Stalactite Shack" },
        ],
        type: "internal",
    },
    ironmaw_tavern: {
        id: "ironmaw_tavern",
        name: "The Gilded Vein Tavern",
        regionId: "ironmaw",
        x: 1625,
        y: 800,
        description: "A dimly lit, rowdy establishment favored by off-duty miners. The stories are as dark as the ale.",
        activities: [
            {
                type: "shop",
                shopId: "respite_tavern",
            },
            {
                type: "npc",
                name: "Barkeep Brunt",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "Welcome to the Gilded Vein. Best ale in Ironmaw, and the only place you can get a room without an overseer's permit. What'll it be?",
                        responses: [
                            {
                                text: "I'll take an ale (40 gold).",
                                next: "buy_ale",
                            },
                            {
                                text: "I need a room (150 gold).",
                                next: "rent_room",
                            },
                            {
                                text: "Just passing through.",
                            },
                        ],
                    },
                    buy_ale: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "Dark as the mines and twice as thick. 40 gold.",
                        responses: [
                            {
                                text: "I'll take it.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 40,
                                        },
                                    ],
                                    successNode: "buy_ale_success",
                                    failureNode: "buy_fail",
                                },
                            },
                            {
                                text: "No thanks.",
                            },
                        ],
                    },
                    buy_ale_success: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "Here you go. It'll put hair on your chest.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 40,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "beer",
                                        quantity: 1,
                                    },
                                ],
                            },
                        ],
                    },
                    rent_room: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "It's a bit loud with the mining rails nearby, but it's a solid bed. 150 gold.",
                        responses: [
                            {
                                text: "I'll take the room (150 gold).",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 150,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_fail",
                                },
                            },
                            {
                                text: "I'll pass.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "Sleep well. The morning shift starts at five bells.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 150,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                        ],
                    },
                    buy_fail: {
                        npcName: "Barkeep Brunt",
                        npcIcon: "person",
                        text: "No coin, no service. That's the mountain law.",
                        responses: [
                            {
                                text: "Right.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["ironmaw_foundry_row"],
        type: "internal",
    },
    ironmaw_general_store: {
        id: "ironmaw_general_store",
        name: "Ironmaw Depot",
        regionId: "ironmaw",
        x: 1525,
        y: 775,
        description: "A cluttered storehouse selling essential mining equipment, masks, and rations.",
        activities: [
            {
                type: "shop",
                shopId: "respite_general",
            },
            {
                type: "npc",
                name: "Herbalist Wynn",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Herbalist Wynn",
                        npcIcon: "person",
                        text: "The Thornveil is a treasure trove of reagents, but it's a death trap for the unprepared. I brew the best anti-venoms and combat potions this side of the Rift. Interested?",
                        responses: [
                            {
                                text: "I'll take a Super Antipoison (4) (1500 gold).",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 1500,
                                        },
                                    ],
                                    successNode: "buy_antipoison_success",
                                    failureNode: "buy_antipoison_fail",
                                },
                            },
                            {
                                text: "Tell me about anti-venom.",
                                next: "antivenom",
                            },
                            {
                                text: "Just looking.",
                            },
                        ],
                    },
                    buy_antipoison_success: {
                        npcName: "Herbalist Wynn",
                        npcIcon: "person",
                        text: "A wise choice. This will keep your heart beating when the serpents strike. Use it sparingly.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 1500,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "super_antipoison_4",
                                        quantity: 1,
                                    },
                                ],
                            },
                        ],
                    },
                    buy_antipoison_fail: {
                        npcName: "Herbalist Wynn",
                        npcIcon: "person",
                        text: "Quality reagents don't grow on trees—well, some do, but they're dangerous to harvest. 1500 gold or no deal.",
                        responses: [
                            {
                                text: "I'll come back later.",
                            },
                        ],
                    },
                    antivenom: {
                        npcName: "Herbalist Wynn",
                        npcIcon: "person",
                        text: "The Jungle Serpents have a neurotoxin that slows your heart. My brew counteracts it, but it's expensive to make. Stock up before you head east.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["ironmaw_plaza"],
        type: "internal",
    },
    ironmaw_workers_row: {
        id: "ironmaw_workers_row",
        name: "Workers' Row",
        regionId: "ironmaw",
        x: 1525,
        y: 825,
        description: "A long, soot-stained street where the lowest-tier workers of the mountain reside in cramped, shared housing.",
        connections: ["ironmaw_plaza"],
        activities: [
            { type: "thieving_pilfer", id: "ironmaw_house_w1", name: "Shared Bunkhouse" },
            { type: "thieving_pilfer", id: "ironmaw_house_w2", name: "Coal Sifter's Hovel" },
            { type: "thieving_pilfer", id: "ironmaw_house_w3", name: "Gritty Flat" },
            { type: "thieving_pilfer", id: "ironmaw_house_w4", name: "Dark Alcove" },
        ],
        type: "internal",
    },
};
