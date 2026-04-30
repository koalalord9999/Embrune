import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const fouthiaPois: Record<string, POI> = {
    fouthia_north_gate: {
        id: "fouthia_north_gate",
        name: "Fouthia North Gate",
        description: "This gate looks towards a range of dark, volcanic mountains. A hot wind blows from the north.",
        connections: ["fouthia_garrison_road", "vsv_entrance"],
        activities: [
            {
                type: "npc",
                name: "Fouthian Guard",
                icon: "desert-helmet",
                attackableMonsterId: "fouthian_guard",
            },
        ],
        regionId: "fouthia",
        type: "internal",
        x: 250,
        y: 50,
        eX: -42,
        eY: 1256,
    },
    fouthia_southeast_gate: {
        id: "fouthia_southeast_gate",
        name: "Fouthia South-East Gate",
        description: "A gate of sun-bleached wood and rusted iron, leading out into the blinding Salt Flats.",
        connections: ["salt_flats_northwest_passage", "fouthia_main_street"],
        activities: [
            {
                type: "npc",
                name: "Fouthian Guard",
                icon: "desert-helmet",
                attackableMonsterId: "fouthian_guard",
            },
        ],
        regionId: "fouthia",
        type: "internal",
        x: 450,
        y: 450,
        eX: -42,
        eY: 1256,
    },
    fouthia_west_gate: {
        id: "fouthia_west_gate",
        name: "Fouthia West Gate",
        description: "The western gate opens to a vast, shimmering desert, said to hide the ruins of a Sunken City.",
        connections: ["fouthia_back_alleys", "sunscorched_wastes_entrance"],
        activities: [
            {
                type: "npc",
                name: "Fouthian Guard",
                icon: "desert-helmet",
                attackableMonsterId: "fouthian_guard",
            },
        ],
        regionId: "fouthia",
        type: "internal",
        x: 50,
        y: 250,
        eX: -42,
        eY: 1256,
    },
    fouthia_main_street: {
        id: "fouthia_main_street",
        name: "Main Street",
        description: "The dusty main street leading from the gate to the town square. Buildings are made of sandstone and weathered wood.",
        connections: ["fouthia_southeast_gate", "fouthia_square"],
        activities: [
            {
                type: "npc",
                name: "Weary Traveler",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Weary Traveler",
                        npcIcon: "person",
                        text: "Welcome to Fouthia. Keep an eye on your coin purse and an eye on your waterskin.\n\nThe Sand Serpent Inn is the only place to get a drink that isn't half sand.\n\nDon't wander out into the Salt Flats at night. The things that crawl out there... they're not natural.\n\nThe town guard does their best, but they're outnumbered by the bandits in the surrounding wastes.\n\nWater is more valuable than gold out here. Don't waste a drop.\n\nThat alchemist, Zafira, can brew a potion for just about anything. Heatstroke, scorpion venom... you name it.\n\nThe bazaar is the heart of this town. You can find anything there, if you've got the coin.\n\nI heard whispers of a great 'Sunken City' far to the west, but who'd be mad enough to look for it?\n\nThe Scorched Peaks to the north are said to be home to fire drakes and other nasty creatures.\n\nIf you're looking for trouble, you'll find it in the back alleys. Or it'll find you.\n\nThis town was built on an old oasis. The well in the square is the only reason we're still here.\n\nThe armorer, Khalid, knows how to make gear that won't cook you alive in your own armor.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                attackableMonsterId: "man",
                pickpocket: {
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
        ],
        regionId: "fouthia",
        x: 350,
        y: 350,
        type: "internal",
    },
    fouthia_square: {
        id: "fouthia_square",
        name: "Fouthia Square",
        description: "The heart of the town, centered around a deep stone well. It is surprisingly busy, a hub of activity in the desolate wastes.",
        connections: [
            "fouthia_main_street",
            "fouthia_bazaar",
            "fouthia_garrison_road",
            "fouthia_back_alleys",
            "fouthia_bank",
            "fouthia_general_store",
            "fouthia_shrine",
        ],
        activities: [
            {
                type: "water_source",
                name: "Draw Water from Well",
            },
            {
                type: "npc",
                name: "Townsfolk",
                icon: "woman-elf-face",
                dialogue: {
                    start: {
                        npcName: "Townsfolk",
                        npcIcon: "woman-elf-face",
                        text: "Welcome to Fouthia. Keep an eye on your coin purse and an eye on your waterskin.\n\nThe Sand Serpent Inn is the only place to get a drink that isn't half sand.\n\nDon't wander out into the Salt Flats at night. The things that crawl out there... they're not natural.\n\nThe town guard does their best, but they're outnumbered by the bandits in the surrounding wastes.\n\nWater is more valuable than gold out here. Don't waste a drop.\n\nThat alchemist, Zafira, can brew a potion for just about anything. Heatstroke, scorpion venom... you name it.\n\nThe bazaar is the heart of this town. You can find anything there, if you've got the coin.\n\nI heard whispers of a great 'Sunken City' far to the west, but who'd be mad enough to look for it?\n\nThe Scorched Peaks to the north are said to be home to fire drakes and other nasty creatures.\n\nIf you're looking for trouble, you'll find it in the back alleys. Or it'll find you.\n\nThis town was built on an old oasis. The well in the square is the only reason we're still here.\n\nThe armorer, Khalid, knows how to make gear that won't cook you alive in your own armor.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                attackableMonsterId: "woman",
                pickpocket: {
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
        ],
        regionId: "fouthia",
        x: 250,
        y: 250,
        type: "internal",
    },
    fouthia_shrine: {
        id: "fouthia_shrine",
        name: "Desert Shrine",
        description: "A small, humble shrine made of sandstone, dedicated to the spirits of the desert.",
        connections: ["fouthia_square"],
        activities: [
            {
                type: "npc",
                name: "Altar",
                icon: "altar",
                dialogue: {
                    start: {
                        npcName: "Altar",
                        npcIcon: "altar",
                        text: "You feel a divine presence. Your prayer may be answered here.",
                        responses: [
                            {
                                text: "Pray",
                                actions: [
                                    {
                                        type: "restore_prayer",
                                    },
                                ],
                            },
                            {
                                text: "Leave",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "fouthia",
        x: 200,
        y: 200,
        type: "internal",
    },
    fouthia_bazaar: {
        id: "fouthia_bazaar",
        name: "The Bazaar",
        description: "A crowded, open-air market where merchants hawk exotic goods from beneath canvas awnings.",
        connections: ["fouthia_square", "the_sand_serpent_inn"],
        activities: [
            {
                type: "thieving_stall",
                id: "fouthia_bazaar_water_stall",
                name: "Steal from Water Stall",
                lootTableId: "thieving_stall_water",
            },
            {
                type: "thieving_stall",
                id: "fouthia_bazaar_spice_stall",
                name: "Steal from Spice Stall",
                lootTableId: "thieving_stall_spices",
            },
            {
                type: "npc",
                name: "Merchant",
                icon: "/assets/npcChatHeads/merchant_theron.png",
                dialogue: {
                    start: {
                        npcName: "Merchant",
                        npcIcon: "/assets/npcChatHeads/merchant_theron.png",
                        text: "Welcome to Fouthia. Keep an eye on your coin purse and an eye on your waterskin.\n\nThe Sand Serpent Inn is the only place to get a drink that isn't half sand.\n\nDon't wander out into the Salt Flats at night. The things that crawl out there... they're not natural.\n\nThe town guard does their best, but they're outnumbered by the bandits in the surrounding wastes.\n\nWater is more valuable than gold out here. Don't waste a drop.\n\nThat alchemist, Zafira, can brew a potion for just about anything. Heatstroke, scorpion venom... you name it.\n\nThe bazaar is the heart of this town. You can find anything there, if you've got the coin.\n\nI heard whispers of a great 'Sunken City' far to the west, but who'd be mad enough to look for it?\n\nThe Scorched Peaks to the north are said to be home to fire drakes and other nasty creatures.\n\nIf you're looking for trouble, you'll find it in the back alleys. Or it'll find you.\n\nThis town was built on an old oasis. The well in the square is the only reason we're still here.\n\nThe armorer, Khalid, knows how to make gear that won't cook you alive in your own armor.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                pickpocket: {
                    lootTableId: "pickpocket_merchant_table",
                },
            },
        ],
        regionId: "fouthia",
        x: 350,
        y: 250,
        type: "internal",
    },
    fouthia_garrison_road: {
        id: "fouthia_garrison_road",
        name: "Garrison Road",
        description: "The road leading to the north gate and the town barracks. The guards here look particularly on edge.",
        connections: ["fouthia_square", "fouthia_north_gate", "fouthia_barracks"],
        activities: [],
        regionId: "fouthia",
        x: 250,
        y: 150,
        type: "internal",
    },
    fouthia_back_alleys: {
        id: "fouthia_back_alleys",
        name: "Back Alleys",
        description: "A maze of narrow, sandy alleys. A good place to find trouble, or avoid it.",
        connections: [
            "fouthia_square",
            "fouthia_west_gate",
            "fouthia_armorer",
            "fouthia_alchemist",
            "fouthia_rooftop_access",
        ],
        activities: [
            {
                type: "thieving_pilfer",
                id: "fouthia_house_1",
                name: "Locked House",
            },
            {
                type: "thieving_pilfer",
                id: "fouthia_house_2",
                name: "Locked House",
            },
            {
                type: "ground_item",
                id: "fouthia_alleys_knife",
                itemId: "knife",
                resourceCount: 1,
                respawnTimer: 300000,
            },
        ],
        regionId: "fouthia",
        x: 150,
        y: 250,
        type: "internal",
    },
    fouthia_bank: {
        id: "fouthia_bank",
        name: "Bank of Embrune",
        description: "A fortified sandstone building. Your items are safe from bandits and sandstorms here.",
        connections: ["fouthia_square"],
        activities: [
            {
                type: "npc",
                name: "Banker Zahra",
                icon: "/assets/npcChatHeads/banker_astrid.png",
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
                        npcName: "Banker Zahra",
                        npcIcon: "/assets/npcChatHeads/banker_astrid.png",
                        text: "Welcome to the Bank of Embrune, Fouthia branch. Your items are safe from sand and thieves with us.",
                        responses: [
                            {
                                text: "I'd like to access my bank.",
                                next: "access_bank",
                            },
                            {
                                text: "Just looking around, thank you.",
                            },
                        ],
                    },
                    access_bank: {
                        npcName: "Banker Zahra",
                        npcIcon: "/assets/npcChatHeads/banker_astrid.png",
                        text: "Of course. Please, step up to the counter.",
                        responses: [
                            {
                                text: "Access my vault.",
                                actions: [
                                    {
                                        type: "open_bank",
                                    },
                                ],
                            },
                            {
                                text: "Not right now.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "fouthia",
        x: 200,
        y: 300,
        type: "internal",
    },
    fouthia_general_store: {
        id: "fouthia_general_store",
        name: "Wanderer's Wares",
        description: "A general store catering to desert travelers, selling waterskins, tools, and basic supplies.",
        connections: ["fouthia_square"],
        activities: [
            {
                type: "shop",
                shopId: "fouthia_general",
            },
        ],
        regionId: "fouthia",
        x: 300,
        y: 200,
        type: "internal",
    },
    the_sand_serpent_inn: {
        id: "the_sand_serpent_inn",
        name: "The Sand Serpent Inn",
        description: "A shady-looking inn, popular with mercenaries and travelers with loose morals.",
        connections: ["fouthia_bazaar"],
        activities: [
            {
                type: "quest_board",
            },
            {
                type: "npc",
                name: "Barkeep Zale",
                icon: "/assets/npcChatHeads/barkeep_grimley.png",
                dialogue: {
                    start: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "Welcome to The Sand Serpent. We've got the strongest cactus wine and the softest sand-beds in Fouthia. What'll it be?",
                        responses: [
                            {
                                text: "A glass of your finest.",
                                next: "buy_drink_intro",
                            },
                            {
                                text: "I'd like to rent a room.",
                                next: "rent_room_intro",
                            },
                        ],
                    },
                    buy_drink_intro: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "An excellent choice! Knocks the dust from your throat. That'll be 5 coins.",
                        responses: [
                            {
                                text: "Here you go.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 5,
                                        },
                                    ],
                                    successNode: "buy_drink_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 5,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "beer",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "A bit steep for me.",
                            },
                        ],
                    },
                    buy_drink_success: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "Cheers!",
                        responses: [],
                    },
                    buy_drink_fail: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "Sorry, you don't have enough coin for that.",
                        responses: [],
                    },
                    rent_room_intro: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "A wise choice. A night out of the wind does wonders for your health. A room for the night is 20 coins.",
                        responses: [
                            {
                                text: "I'll take it.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 20,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 20,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                            {
                                text: "I prefer sleeping with the sand-scorpions.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Zale",
                        npcIcon: "/assets/npcChatHeads/barkeep_grimley.png",
                        text: "Wise choice. Sleep well.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "fouthia",
        x: 400,
        y: 250,
        type: "internal",
    },
    fouthia_barracks: {
        id: "fouthia_barracks",
        name: "Fouthia Barracks",
        description: "A small, functional barracks. The few guards here seem overworked and weary.",
        connections: ["fouthia_garrison_road"],
        activities: [
            {
                type: "npc",
                name: "Captain Omar",
                icon: "/assets/npcChatHeads/guard_captain_elara.png",
                dialogue: {
                    start: {
                        npcName: "Captain Omar",
                        npcIcon: "/assets/npcChatHeads/guard_captain_elara.png",
                        text: "The Salt Flats are unforgiving, and the bandits are relentless. We do what we can to keep this town safe, but we're always looking for capable hands. Check the quest board if you're looking for work.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "slayer_master",
                name: "Ravindra",
                icon: "desert-helmet",
                masterId: "ravindra",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Slayer Gear",
                        shopId: "respite_slayer_gear",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "The sun bleaches the bones of the weak. Only the strong survive the wastes. Why have you come to the Barracks?",
                        responses: [
                            {
                                text: "I'm seeking a worthy challenge. (Slayer Task)",
                                check: {
                                    requirements: [
                                        {
                                            type: "skill",
                                            skill: SkillName.Slayer,
                                            level: 40,
                                        },
                                    ],
                                    successNode: "check_task_status",
                                    failureNode: "too_weak",
                                },
                            },
                            {
                                text: "I'd like to see your Slayer rewards.",
                                actions: [
                                    {
                                        type: "slayer_open_shop",
                                    },
                                ],
                            },
                            {
                                text: "I would like to reset my current task.",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_task",
                                            status: "none",
                                            operator: "ne",
                                        },
                                    ],
                                },
                                next: "reset_task_intro",
                            },
                            {
                                text: "Just looking around.",
                            },
                        ],
                    },
                    reset_task_intro: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "You wish to abandon your hunt? The desert has no patience for those who can't finish what they started. If you want a fresh assignment, it will cost you 20 credits for the breach of contract.",
                        responses: [
                            {
                                text: "I have the credits. Reset my task.",
                                next: "reset_task_check",
                            },
                            {
                                text: "I'll finish my hunt.",
                            },
                        ],
                    },
                    reset_task_check: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Checking your record...",
                        responses: [
                            {
                                text: "(Continue)",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_credits",
                                            amount: 20,
                                        },
                                    ],
                                    successNode: "reset_task_confirm",
                                    failureNode: "reset_task_failed",
                                },
                            },
                        ],
                    },
                    reset_task_confirm: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Hmph. Speak truthfully—are you sure? I will wipe your current slate so you can find a more 'suitable' target.",
                        responses: [
                            {
                                text: "Yes, reset it.",
                                actions: [
                                    {
                                        type: "slayer_reset_task",
                                        masterId: "ravindra",
                                    },
                                ],
                            },
                            {
                                text: "Actually, I'll stay the course.",
                            },
                        ],
                    },
                    reset_task_failed: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "You haven't even spilled enough blood to earn a reset. The wastes are unforgiving, and so am I. Get back out there or find the 20 credits you owe me.",
                        responses: [
                            {
                                text: "Understood.",
                            },
                        ],
                    },
                    too_weak: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Move along. The desert is no place for a novice. Come back when you have attained at least level 40 Slayer. Until then, you are just food for the vultures.",
                        responses: [
                            {
                                text: "Fair enough.",
                            },
                        ],
                    },
                    check_task_status: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Let's see if you're as tough as you look.",
                        responses: [
                            {
                                text: "(Continue)",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_task",
                                            status: "none",
                                        },
                                    ],
                                    successNode: "assign_task",
                                    failureNode: "has_task_check",
                                },
                            },
                        ],
                    },
                    assign_task: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "I have several threats that need... neutralizing. Are you prepared for a real hunt?",
                        responses: [
                            {
                                text: "Assign me a task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "ravindra",
                                    },
                                ],
                            },
                            {
                                text: "I need to prepare first.",
                            },
                        ],
                    },
                    has_task_check: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Checking your record...",
                        responses: [
                            {
                                text: "(Continue)",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_task",
                                            status: "complete",
                                        },
                                    ],
                                    successNode: "task_complete",
                                    failureNode: "has_active_task",
                                },
                            },
                        ],
                    },
                    task_complete: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Hmph. You survived. Not bad. Here are your credits—you earned them.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "slayer_complete_task",
                                        masterId: "ravindra",
                                    },
                                ],
                                next: "ravindra_new_task_prompt",
                            },
                        ],
                    },
                    ravindra_new_task_prompt: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Ready for something harder, or did that one break you?",
                        responses: [
                            {
                                text: "Give me another task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "ravindra",
                                    },
                                ],
                            },
                            {
                                text: "I've had enough for now.",
                            },
                        ],
                    },
                    has_active_task: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "You're already on a hunt.",
                        responses: [
                            {
                                text: "(Continue)",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_task",
                                            status: "active",
                                            masterId: "kaelen",
                                        },
                                    ],
                                    successNode: "kaelen_task_insult",
                                    failureNode: "ravindra_task_progress",
                                },
                            },
                        ],
                    },
                    kaelen_task_insult: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Kaelen's petty chores won't make you a master. Finish what you started before you come seeking real glory from me.",
                        responses: [
                            {
                                text: "I will.",
                            },
                        ],
                    },
                    ravindra_task_progress: {
                        npcName: "Ravindra",
                        npcIcon: "desert-helmet",
                        text: "Why are you back? Your task isn't finished. The desert doesn't offer second chances—finish the job or let the sands claim you.",
                        responses: [
                            {
                                text: "I'm going.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "fouthia",
        x: 200,
        y: 150,
        type: "internal",
    },
    fouthia_armorer: {
        id: "fouthia_armorer",
        name: "Desert Armorer",
        description: "A smithy specializing in lighter armor suitable for the heat. The forge burns day and night.",
        connections: ["fouthia_back_alleys"],
        activities: [
            {
                type: "shop",
                shopId: "fouthia_armorer",
            },
            {
                type: "furnace",
            },
            {
                type: "anvil",
            },
            {
                type: "npc",
                name: "Khalid the Armorer",
                icon: "/assets/npcChatHeads/valerius_the_master_smith.png",
                dialogue: {
                    start: {
                        npcName: "Khalid the Armorer",
                        npcIcon: "/assets/npcChatHeads/valerius_the_master_smith.png",
                        text: "Need armor that won't cook you in your own skin? You've come to the right forge. Heavy plate is for the fools in the green lands. Here, we value lightness and breathability.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "fouthia",
        x: 100,
        y: 200,
        type: "internal",
    },
    fouthia_alchemist: {
        id: "fouthia_alchemist",
        name: "Zafira's Remedies",
        description: "A small shop filled with the scent of strange desert herbs and bubbling concoctions.",
        connections: ["fouthia_back_alleys"],
        activities: [
            {
                type: "shop",
                shopId: "fouthia_alchemist",
            },
            {
                type: "npc",
                name: "Zafira the Alchemist",
                icon: "/assets/npcChatHeads/herbalist_anise.png",
                dialogue: {
                    start: {
                        npcName: "Zafira the Alchemist",
                        npcIcon: "/assets/npcChatHeads/herbalist_anise.png",
                        text: "*Zafira cackles, stirring a bubbling, purple concoction.* Careful where you step! Some of my experiments are a bit... energetic. Looking for a potion? Or perhaps something with a bit more... KABOOM?",
                        responses: [
                            {
                                text: "Just browsing, thanks.",
                                next: "browse",
                            },
                            {
                                text: "What's that you're making?",
                                next: "making",
                            },
                        ],
                    },
                    browse: {
                        npcName: "Zafira the Alchemist",
                        npcIcon: "/assets/npcChatHeads/herbalist_anise.png",
                        text: "Suit yourself! Just don't touch anything. Or do! Spontaneous combustion is a leading cause of scientific discovery, you know!",
                        responses: [],
                    },
                    making: {
                        npcName: "Zafira the Alchemist",
                        npcIcon: "/assets/npcChatHeads/herbalist_anise.png",
                        text: "This? Oh, this is just a little something to help the guards' arrows go... farther. And louder. And brighter! It's mostly brimstone and wishful thinking.",
                        responses: [],
                    },
                },
                startNode: "start",
                questTopics: ["the_sorcerers_trial"],
                conditionalGreetings: [
                    {
                        text: "Anya sent you for a lesson in 'controlled demolition'? HA! Let's see if you have the stomach for it.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_sorcerers_trial",
                                    status: "in_progress",
                                    stage: 6,
                                },
                            ],
                        },
                    },
                    {
                        text: "Where's my Wyvern Claw? I can't build a containment unit out of thin air and good intentions!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_sorcerers_trial",
                                    status: "in_progress",
                                    stage: 7,
                                },
                            ],
                        },
                    },
                    {
                        text: "The claw is perfect. Now I just need the fuel. Ten pieces of Brimstone, and keep the smell to yourself!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_sorcerers_trial",
                                    status: "in_progress",
                                    stage: 9,
                                },
                            ],
                        },
                    },
                    {
                        text: "Don't just stand there holding that core! It's twitchy! Go show it the Forge, the Deep, and the Salt!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_sorcerers_trial",
                                    status: "in_progress",
                                    stage: 11,
                                },
                            ],
                        },
                    },
                    {
                        text: "I can tell by looking at you that you've undergone some patience yourself. I hope you feel like you're ready to EXPLODE! Or not? It doesn't really matter.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_sorcerers_trial",
                                    status: "in_progress",
                                    stage: 12,
                                },
                                {
                                    type: "items",
                                    items: [
                                        {
                                            itemId: "tempered_core",
                                            quantity: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        regionId: "fouthia",
        x: 100,
        y: 300,
        type: "internal",
    },
    fouthia_rooftop_access: {
        id: "fouthia_rooftop_access",
        name: "Rooftop Access",
        description: "A rickety ladder leans against a sandstone wall, leading up to the sun-baked rooftops.",
        connections: ["fouthia_back_alleys"],
        activities: [
            {
                type: "start_agility_course",
                name: "Start Fouthia Rooftop Run (Lvl 35)",
                courseId: "fouthia_rooftop_run",
            },
        ],
        regionId: "fouthia",
        x: 160,
        y: 230,
        type: "internal",
    },
};
