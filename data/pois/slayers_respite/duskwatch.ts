import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';

export const DUSKWATCH_POIS: Record<string, POI> = {
    duskwatch_plaza: {
        id: "duskwatch_plaza",
        name: "Duskwatch Plaza",
        regionId: "duskwatch",
        x: 1000,
        y: 1000,
        description: "The beating heart of Duskwatch. A massive statue of the first Guildmaster overlooks the bustling cobblestone square.",
        activities: [
            {
                type: "npc",
                name: "Archivist Maren",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Archivist Maren",
                        npcIcon: "person",
                        text: "Welcome to the Plaza. That statue? It's the First Guildmaster. They say he was the only one who truly understood what the Abyssal Rift was... and why it's here. If you're interested in the archives, you'll have to wait. I'm busy cataloging the latest findings from the Barrow.",
                        responses: [
                            {
                                text: "What happened to the archives?",
                                next: "archives",
                            },
                            {
                                text: "Good luck with that.",
                            },
                        ],
                    },
                    archives: {
                        npcName: "Archivist Maren",
                        npcIcon: "person",
                        text: "Lost. Most of them, anyway. When the Rift first opened, the feedback pulse wiped half of our records. Now we're pieceing it back together, one monster trophy at a time.",
                        responses: [
                            {
                                text: "I see.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Duskwatch Citizen",
                icon: "person",
                dialogueType: "random",
                pickpocket: {
                    lootTableId: "pickpocket_man_woman_table",
                },
                dialogue: {
                    start: {
                        npcName: "Duskwatch Citizen",
                        npcIcon: "person",
                        text: "Welcome to Duskwatch. If you've come this far, you must be serious about the craft.\n\nThe Bonemarsh to the southwest... don't go in without salt. The slugs there will dissolve your boots.\n\nThorne at Bleakpost doesn't suffer fools. But his tasks pay better than anyone else's.\n\nThe Gaze Fiends in the Barrow can petrify you with a look. A reflective shield is mandatory.\n\nThis island draws monsters the way a flame draws moths. Nobody knows why, exactly.\n\nThe Abyssal Rift in the north... they say reality itself is torn there. Bring a Slayer's Lantern.\n\nSky Captain Vance can charter you a flight back to Silverhaven if you need supplies.\n\nIronmaw has the best mining camp on the island. Dense veins of iron and coal.\n\nThe Scorched Hollow sounds bad, and it is. Ember Demons and worse down there.\n\nI once saw a Frost Wyvern fly over the ridge. Nearly froze the watchtower solid.\n\nThe Slayer's Guild built this town as a containment measure. The monsters keep coming.\n\nArchivist Maren says the island wasn't always this dangerous. Something changed underground.\n\nThe Thornveil to the east is beautiful, in a terrifying sort of way. Don't touch the vines.\n\nProvisioner Holt knows every trail on this island. If you're lost, ask him.\n\nSome slayers retire here. Brennan at the tavern has been on this island longer than anyone.\n\nThe Shattered Coast has the best fishing, but the Tide Hunters won't leave you alone.\n\nBe mindful of the volcanic vents in the Cinderforge. You can tell they're active by the haze.\n\nBleakpost is rough living, but it's closer to the action. Most veterans end up there.\n\nDon't underestimate the Corpse Blooms in the Barrow. They grow back faster than you'd think.\n\nThe Frostspine Drakes aren't proper slayer creatures, but they'll kill you just the same.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "thieving_stall",
                id: "duskwatch_bakery_stall",
                name: "Steal from Duskwatch Bakery",
                lootTableId: "thieving_stall_bakery",
            },
        ],
        connections: [
            "duskwatch_harbor_walk",
            "duskwatch_trade_lane",
            "duskwatch_guild_street",
            "duskwatch_south_square",
            "duskwatch_tavern",
        ],
        type: "internal",
    },
    duskwatch_harbor_walk: {
        id: "duskwatch_harbor_walk",
        name: "Harbor Walk",
        regionId: "duskwatch",
        x: 925,
        y: 1000,
        description: "A wide boardwalk smelling of salt and ozone. It connects the blimp pads to the traditional sea docks.",
        connections: [
            "duskwatch_plaza",
            "duskwatch_landing",
            "duskwatch_docks",
            "duskwatch_west_gate",
        ],
        activities: [
            {
                type: "thieving_stall",
                id: "duskwatch_fish_stall",
                name: "Steal from Fresh Catch Fish Stall",
                lootTableId: "thieving_stall_fish",
            },
        ],
        type: "internal",
    },
    duskwatch_landing: {
        id: "duskwatch_landing",
        name: "Duskwatch Landing",
        regionId: "duskwatch",
        x: 950,
        y: 1025,
        description: "The primary blimp landing pad. Massive iron hooks and thick ropes secure the vessels against the constant winds.",
        activities: [
            {
                type: "npc",
                name: "Return to Silverhaven",
                icon: "person",
                startNode: "blimp_return",
                dialogue: {
                    blimp_return: {
                        npcName: "Vance",
                        npcIcon: "person",
                        text: "Heading back to the capital? The winds are favorable today. We can have you back at the Spire in no time, free of charge for a fellow slayer.",
                        responses: [
                            {
                                text: "Yes, I'm ready to return.",
                                actions: [
                                    {
                                        type: "blimp_travel",
                                        destinationPoiId: "silverhaven_slayers_spire",
                                    },
                                ],
                            },
                            {
                                text: "Not yet.",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Sky Captain Vance",
                icon: "person",
                startNode: "vance",
                dialogue: {
                    vance: {
                        npcName: "Sky Captain Vance",
                        npcIcon: "person",
                        text: "Welcome to Duskwatch. Watch your step, the winds here can pluck a man right off the platform. What brings you to the Edge of the World?",
                        responses: [
                            {
                                text: "What is this place?",
                                next: "vance_where",
                            },
                            {
                                text: "Show me your supplies.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_general",
                                    },
                                ],
                            },
                            {
                                text: "Any advice for a new slayer?",
                                next: "vance_what_to_do",
                            },
                        ],
                    },
                    vance_where: {
                        npcName: "Sky Captain Vance",
                        npcIcon: "person",
                        text: "This is Slayer's Respite. The Guild's primary containment and training ground. If it's too big or too weird for the mainland, it ends up here.",
                        responses: [
                            {
                                text: "Good to know.",
                                next: "vance",
                            },
                        ],
                    },
                    vance_what_to_do: {
                        npcName: "Sky Captain Vance",
                        npcIcon: "person",
                        text: "Keep your blade sharp and your eyes open. And if you hear a low humming sound? That's the Rift. Run.",
                        responses: [
                            {
                                text: "What kind of equipment should I bring?",
                                next: "vance_equipment",
                            },
                        ],
                    },
                    vance_equipment: {
                        npcName: "Sky Captain Vance",
                        npcIcon: "person",
                        text: "Armor is good, but mobility is better. And don't forget the tools—Slayer's Lanterns, salt, mirrors... the Guildhall has what you need.",
                        responses: [
                            {
                                text: "Thanks, Vance.",
                            },
                        ],
                    },
                },
            },
        ],
        connections: ["duskwatch_harbor_walk"],
        type: "internal",
    },
    duskwatch_docks: {
        id: "duskwatch_docks",
        name: "Sea Otter Docks",
        regionId: "duskwatch",
        x: 925,
        y: 1075,
        description: "Old wooden piers used by the local fishing fleet and supply barges.",
        activities: [
            {
                type: "npc",
                name: "Dockmaster Elms",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Dockmaster Elms",
                        npcIcon: "person",
                        text: "Careful on those planks, they're slicker than a marsh eel. I'm expecting a shipment of Broad-bladed swords from Ironmaw any day now. If you're looking for work, check with the Guildhall.",
                        responses: [
                            {
                                text: "Seen anything interesting lately?",
                                next: "seen",
                            },
                            {
                                text: "I'll be careful.",
                            },
                        ],
                    },
                    seen: {
                        npcName: "Dockmaster Elms",
                        npcIcon: "person",
                        text: "Saw a shadow under the water yesterday. Too big for a fish, too fast for a boat. I think something's migration through the Shattered Coast.",
                        responses: [
                            {
                                text: "Internalizing that...",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_harbor_walk", "duskwatch_shadow_alley"],
        type: "internal",
    },
    duskwatch_tavern: {
        id: "duskwatch_tavern",
        name: "The Last Drop Tavern",
        regionId: "duskwatch",
        x: 950,
        y: 975,
        description: "A rowdy seaside tavern where slayers drown their fears. The ale is strong and the stories are taller.",
        activities: [
            {
                type: "npc",
                name: "Barkeep Orin",
                icon: "person",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Drinks/Food",
                        shopId: "respite_tavern",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Barkeep Orin",
                        npcIcon: "person",
                        text: "Welcome to The Last Drop. The ale is cold and the beds are... mostly clean. What's your poison?",
                        responses: [
                            {
                                text: "Let me see what you have.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_tavern",
                                    },
                                ],
                            },
                            {
                                text: "I'd like to rent a room (150 gold).",
                                next: "rent_room",
                            },
                            {
                                text: "Just a drink for now.",
                            },
                        ],
                    },
                    rent_room: {
                        npcName: "Barkeep Orin",
                        npcIcon: "person",
                        text: "Room's yours. Try to ignore the screaming from the docks, it's just the gulls. Or the monsters. Probably the gulls.",
                        responses: [
                            {
                                text: "I'll take it (150 gold).",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 150,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "rent_room_fail",
                                },
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Orin",
                        npcIcon: "person",
                        text: "Sleep well. You'll need it.",
                        responses: [
                            {
                                text: "Thanks.",
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
                    rent_room_fail: {
                        npcName: "Barkeep Orin",
                        npcIcon: "person",
                        text: "No coin, no bed. The docks are free, if you don't mind the damp.",
                        responses: [
                            {
                                text: "Fine.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Old Man Brennan",
                icon: "person",
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Old Man Brennan",
                        npcIcon: "person",
                        text: "I was a slayer once. Before the Gaze Fiends took my sight. Now I just listen to the wind. It's got an angry sound lately.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_plaza"],
        type: "internal",
    },
    duskwatch_guild_street: {
        id: "duskwatch_guild_street",
        name: "Guild Street",
        regionId: "duskwatch",
        x: 1000,
        y: 950,
        description: "A clean, well-lit street lined with administrative buildings and guild-sanctioned housing.",
        connections: ["duskwatch_plaza", "duskwatch_bank", "duskwatch_lodge"],
        type: "internal",
    },
    duskwatch_bank: {
        id: "duskwatch_bank",
        name: "Duskwatch Bank",
        regionId: "duskwatch",
        x: 975,
        y: 925,
        description: "A heavily fortified building housing the wealth and trophies of the local Slayer's Guild.",
        activities: [
            {
                type: "npc",
                name: "Teller Harth",
                icon: "person",
                actions: [
                    {
                        label: "Access Vault",
                        action: "open_bank",
                    },
                    {
                        label: "Deposit All",
                        action: "deposit_backpack",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Teller Harth",
                        npcIcon: "person",
                        text: "Welcome to the Vaults. Your trophies and gold are safer here than anywhere else on the island. How can I help you today?",
                        responses: [
                            {
                                text: "I'd like to access my vault.",
                                next: "processing",
                            },
                            {
                                text: "Deposit everything into storage.",
                                next: "deposit_confirm",
                            },
                            {
                                text: "Deposit all equipped gear.",
                                next: "deposit_equipment_confirm",
                            },
                            {
                                text: "Just checking my balance.",
                            },
                        ],
                    },
                    processing: {
                        npcName: "Teller Harth",
                        npcIcon: "person",
                        text: "Of course. Let me just consult the ledger and verify your guild standing... [He flips through a massive, iron-bound book]",
                        responses: [
                            {
                                text: "Take your time.",
                                next: "opening",
                            },
                        ],
                    },
                    opening: {
                        npcName: "Teller Harth",
                        npcIcon: "person",
                        text: "Everything seems to be in order. Let me just get the keys for the inner vault... [He pulls a heavy iron ring from his belt]",
                        responses: [
                            {
                                text: "Open the vault.",
                                actions: [
                                    {
                                        type: "open_bank",
                                    },
                                ],
                            },
                        ],
                    },
                    deposit_confirm: {
                        npcName: "Teller Harth",
                        npcIcon: "person",
                        text: "Ready to unload your pack? I'll have the porters move everything to your vault immediately.",
                        responses: [
                            {
                                text: "Yes, deposit everything.",
                                actions: [
                                    {
                                        type: "deposit_backpack",
                                    },
                                ],
                            },
                            {
                                text: "Wait, not yet.",
                                next: "start",
                            },
                        ],
                    },
                    deposit_equipment_confirm: {
                        npcName: "Teller Harth",
                        npcIcon: "person",
                        text: "Want to strip down and store your gear? I'll make sure it's polished and oiled while you're away.",
                        responses: [
                            {
                                text: "Yes, deposit my equipment.",
                                actions: [
                                    {
                                        type: "deposit_equipment",
                                    },
                                ],
                            },
                            {
                                text: "Wait, not yet.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_guild_street"],
        type: "internal",
    },
    duskwatch_lodge: {
        id: "duskwatch_lodge",
        name: "Slayer's Guildhall",
        regionId: "duskwatch",
        x: 1000,
        y: 900,
        description: "A massive stone building decorated with the heads of monsters. Senior slayers coordinate local operations here.",
        activities: [
            {
                type: "npc",
                name: "Elder Slayer Valen",
                icon: "person",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Slayer Gear",
                        shopId: "respite_slayer_gear",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Elder Slayer Valen",
                        npcIcon: "person",
                        text: "You have the look of someone who's seen the Rift and didn't blink. I was the same, once. Now I mostly coordinate the thinning of the herds. Need gear? Or advice?",
                        responses: [
                            {
                                text: "I need better equipment.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_slayer_gear",
                                    },
                                ],
                            },
                            {
                                text: "Tell me about your squad.",
                                next: "squad",
                            },
                            {
                                text: "I'm ready for anything.",
                            },
                        ],
                    },
                    squad: {
                        npcName: "Elder Slayer Valen",
                        npcIcon: "person",
                        text: "My squad... they were the best. We went into the Abyssal Rift when it first opened. Only I came back. I keep their names on the wall in the back. Keeps me grounded.",
                        responses: [
                            {
                                text: "I'm sorry.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_guild_street", "duskwatch_north_gate"],
        type: "internal",
    },
    duskwatch_trade_lane: {
        id: "duskwatch_trade_lane",
        name: "Trade Lane",
        regionId: "duskwatch",
        x: 1050,
        y: 1000,
        description: "The primary commercial artery of the city. Shopkeepers and artisans shout for your attention.",
        connections: [
            "duskwatch_plaza",
            "duskwatch_market",
            "duskwatch_provisioner",
            "duskwatch_smithy",
        ],
        type: "internal",
    },
    duskwatch_market: {
        id: "duskwatch_market",
        name: "Common Market",
        regionId: "duskwatch",
        x: 1075,
        y: 1000,
        description: "Dozens of stalls selling exotic monster parts, rare wood, and hardened scoria.",
        activities: [
            {
                type: "npc",
                name: "Trader Kym",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Trader Kym",
                        npcIcon: "person",
                        text: "Trophies! I buy all kinds of monster bits. Teeth, scales, eyes—if it came off something dangerous, I've got a price for it. What've you got?",
                        responses: [
                            {
                                text: "Let's trade.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_general",
                                    },
                                ],
                            },
                            {
                                text: "What's the most valuable thing you've bought?",
                                next: "valuable",
                            },
                        ],
                    },
                    valuable: {
                        npcName: "Trader Kym",
                        npcIcon: "person",
                        text: "A Dragon's heart, still warm. Came from the Cinderforge. Sold it to a mage for enough gold to buy a small fleet. Of course, that was before the taxes.",
                        responses: [
                            {
                                text: "Impressive.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_trade_lane", "duskwatch_east_gate"],
        type: "internal",
    },
    duskwatch_provisioner: {
        id: "duskwatch_provisioner",
        name: "Holt's Provisions",
        regionId: "duskwatch",
        x: 1025,
        y: 975,
        description: "A high-end supply store specializing in long-term expedition gear and high-calorie rations.",
        activities: [
            {
                type: "npc",
                name: "Holt",
                icon: "person",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Provisions",
                        shopId: "respite_general",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Holt",
                        npcIcon: "person",
                        text: "If you're heading into the Thornveil, you'll need more than just a sharp sword. You'll need food that doesn't spoil and gear that doesn't rust. I've got both.",
                        responses: [
                            {
                                text: "Show me your supplies.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_general",
                                    },
                                ],
                            },
                            {
                                text: "Any advice for the Thornveil?",
                                next: "advice",
                            },
                        ],
                    },
                    advice: {
                        npcName: "Holt",
                        npcIcon: "person",
                        text: "Don't touch the purple vines. They don't just sting, they paralyze. And always, ALWAYS watch the canopy.",
                        responses: [
                            {
                                text: "Got it.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["duskwatch_trade_lane"],
        type: "internal",
    },
    duskwatch_smithy: {
        id: "duskwatch_smithy",
        name: "The Iron Grasp",
        regionId: "duskwatch",
        x: 1075,
        y: 975,
        description: "The roar of the furnace is constant here. Master smiths craft the specialized gear slayers depend on.",
        activities: [
            {
                type: "npc",
                name: "Forgemaster Hagar",
                icon: "person",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Equipment",
                        shopId: "respite_smithy",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Forgemaster Hagar",
                        npcIcon: "person",
                        text: "The furnace never cools, and neither do I. If you want gear that won't shatter when an Obsidian Golem hits it, you're in the right place.",
                        responses: [
                            {
                                text: "Show me your wares.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "respite_smithy",
                                    },
                                ],
                            },
                            {
                                text: "What's the best steel on the island?",
                                next: "steel",
                            },
                        ],
                    },
                    steel: {
                        npcName: "Forgemaster Hagar",
                        npcIcon: "person",
                        text: "Ironmaw Steel. Folded a thousand times and quenched in marsh-salt. It's the only thing that holds an edge against the Rift-touched.",
                        responses: [
                            {
                                text: "Good to know.",
                                next: "start",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "anvil",
            },
        ],
        connections: ["duskwatch_trade_lane"],
        type: "internal",
    },
    duskwatch_eastern_apartments: {
        id: "duskwatch_eastern_apartments",
        name: "Eastbank Housing",
        regionId: "duskwatch",
        x: 1075,
        y: 1025,
        description: "Tall, cramped apartment buildings where the city's craftsmen and laborers reside. There seems to be a one way shortcut going to the market.",
        connections: ["duskwatch_market", "duskwatch_back_alleys"],
        activities: [
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_e1",
                name: "Apartment 1A",
            },
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_e2",
                name: "Apartment 1B",
            },
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_e3",
                name: "Overseer's Flat",
            },
        ],
        type: "internal",
    },
    duskwatch_south_square: {
        id: "duskwatch_south_square",
        name: "South Square",
        regionId: "duskwatch",
        x: 1000,
        y: 1050,
        description: "A secondary hub near the marsh gate. It is more sparsely populated and smells of damp earth.",
        connections: [
            "duskwatch_plaza",
            "duskwatch_south_gate",
            "duskwatch_back_alleys",
            "duskwatch_shadow_alley",
        ],
        type: "internal",
    },
    duskwatch_back_alleys: {
        id: "duskwatch_back_alleys",
        name: "The Back Alleys",
        regionId: "duskwatch",
        x: 1050,
        y: 1050,
        description: "A tangled maze of laundry lines and small dwellings. Children run between the legs of passing travelers.",
        connections: ["duskwatch_south_square", "duskwatch_eastern_apartments"],
        activities: [
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_b1",
                name: "Cramped Dwelling",
            },
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_b2",
                name: "Worker's Shanty",
            },
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_b3",
                name: "Tangled Home",
            },
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_b4",
                name: "Small Hovel",
            },
        ],
        type: "internal",
    },
    duskwatch_north_gate: {
        id: "duskwatch_north_gate",
        name: "Duskwatch North Gate",
        regionId: "duskwatch",
        x: 1000,
        y: 875,
        description: "A massive gate reinforced with cold-iron. It leads towards the Frostspine Ridge.",
        connections: ["duskwatch_lodge", "respite_road_n1"],
        type: "internal",
        eX: 1000,
        eY: 1000,
    },
    duskwatch_south_gate: {
        id: "duskwatch_south_gate",
        name: "Duskwatch South Gate",
        regionId: "duskwatch",
        x: 1000,
        y: 1125,
        description: "The gate is often slick with mud from the marsh. It leads south into the heart of the island.",
        connections: ["duskwatch_south_square", "respite_road_s1"],
        type: "internal",
        eX: 1000,
        eY: 1000,
    },
    duskwatch_west_gate: {
        id: "duskwatch_west_gate",
        name: "Duskwatch West Gate",
        regionId: "duskwatch",
        x: 875,
        y: 1000,
        description: "Overlooks the Shattered Coast. The sound of crashing waves is deafening.",
        connections: ["respite_road_w1", "duskwatch_harbor_walk"],
        type: "internal",
        eX: 1000,
        eY: 1000,
    },
    duskwatch_east_gate: {
        id: "duskwatch_east_gate",
        name: "Duskwatch East Gate",
        regionId: "duskwatch",
        x: 1125,
        y: 1000,
        description: "Leads towards the dense jungles of the Thornveil and the mining town of Ironmaw.",
        connections: ["duskwatch_market", "respite_road_e1"],
        type: "internal",
        eX: 1000,
        eY: 1000,
    },
    duskwatch_shadow_alley: {
        id: "duskwatch_shadow_alley",
        name: "Shadow Alley",
        regionId: "duskwatch",
        x: 975,
        y: 1050,
        description: "A dark, damp alleyway where the city's less savory characters congregate. It's the perfect place for those who wish to remain unseen.",
        connections: ["duskwatch_south_square", "duskwatch_docks"],
        activities: [
            {
                type: "thieving_pilfer",
                id: "duskwatch_house_s1",
                name: "Hidden Den",
            },
            {
                type: "npc",
                name: "Shady Dealer",
                icon: "person",
                pickpocket: {
                    lootTableId: "pickpocket_merchant_table",
                },
                dialogue: {
                    start: {
                        npcName: "Shady Dealer",
                        npcIcon: "person",
                        text: "Looking for something special? I've got things the Guildhall won't let you see... for a price.",
                        responses: [
                            {
                                text: "I'm just passing through.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        type: "internal",
    },
};
