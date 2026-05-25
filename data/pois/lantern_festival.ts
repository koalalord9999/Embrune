import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';
import {
    ELDER_BRANDIC_DIALOGUE,
    PIP_GOURD_CARVER_DIALOGUE,
    CELIA_WISHMAKER_DIALOGUE,
    ALPIN_SMELTER_DIALOGUE,
    PILGRIM_TESSA_DIALOGUE,
    FISHERMAN_RONALD_DIALOGUE
} from '../dialogues/festivalDialogues';

export const lanternFestivalPois: Record<string, POI> = {
    oakhaven_festival_entrance: {
        id: "oakhaven_festival_entrance",
        name: "Oakhaven Festival Entrance",
        description: "A simple stone archway marking the entrance to a quiet town plaza.",
        connections: ["oakhaven_market", "mira_pavilion", "trivia_kiosk"],
        activities: [
            {
                type: "npc",
                name: "Pip the Gourd Carver",
                icon: "/assets/npcChatHeads/artisan.png",
                startNode: "start",
                dialogue: PIP_GOURD_CARVER_DIALOGUE,
            },
            {
                type: "npc",
                name: "Merry Pilgrim Tessa",
                icon: "woman-elf-face",
                startNode: "start",
                dialogue: PILGRIM_TESSA_DIALOGUE,
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "person",
                        text: CIVILLIAN_DIALOGUE.lantern_festival.join("\n\n"),
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 350,
        y: 125,
    },
    mira_pavilion: {
        id: "mira_pavilion",
        name: "Mira's Pavilion",
        description: "A quiet, bare wooden gazebo in the corner of the clearing.",
        connections: [
            "oakhaven_festival_entrance",
            "gourd_patch",
            "grand_lantern_plaza",
        ],
        activities: [
            {
                type: "npc",
                name: "Event Host Mira",
                icon: "/assets/npcChatHeads/mira.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Welcome, traveller! The Oakhaven Lantern Festival is a celebration like no other. Earn Festival Tickets from the games around the grounds and spend them right here at my stall.\n\nCome back during the festival — the whole plaza comes alive with lanterns and music!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "Welcome, traveller! The Oakhaven Lantern Festival is in full swing! Earn Festival Tickets from the games around the grounds and spend them right here at my stall. You'll need Festival Tokens to play most of the games, which I sell for 100 coins each.",
                        responses: [
                            {
                                text: "Let me browse your stall.",
                                actions: [
                                    {
                                        type: "shop",
                                        shopId: "lantern_festival_shop",
                                    },
                                ],
                            },
                            {
                                text: "I'd like to buy some Festival Tokens.",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                    ],
                                },
                                next: "buy_tokens",
                            },
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                    buy_tokens: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "I sell Festival Tokens for 100 coins each. How many would you like to buy?",
                        responses: [
                            {
                                text: "Buy 1 Festival Token (100 coins)",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 100,
                                        },
                                    ],
                                    successNode: "buy_confirm_1",
                                    failureNode: "not_enough_coins",
                                },
                            },
                            {
                                text: "Buy 5 Festival Tokens (500 coins)",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 500,
                                        },
                                    ],
                                    successNode: "buy_confirm_5",
                                    failureNode: "not_enough_coins",
                                },
                            },
                            {
                                text: "Buy 10 Festival Tokens (1000 coins)",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 1000,
                                        },
                                    ],
                                    successNode: "buy_confirm_10",
                                    failureNode: "not_enough_coins",
                                },
                            },
                            {
                                text: "Nevermind.",
                                next: "start",
                            },
                        ],
                    },
                    buy_confirm_1: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "Here is your Festival Token. Have fun at the games!",
                        responses: [
                            {
                                text: "Thanks!",
                                actions: [
                                    {
                                        type: "buy_festival_tokens",
                                        quantity: 1,
                                    },
                                ],
                                next: "start",
                            },
                        ],
                    },
                    buy_confirm_5: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "Here are 5 Festival Tokens. Have fun at the games!",
                        responses: [
                            {
                                text: "Thanks!",
                                actions: [
                                    {
                                        type: "buy_festival_tokens",
                                        quantity: 5,
                                    },
                                ],
                                next: "start",
                            },
                        ],
                    },
                    buy_confirm_10: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "Here are 10 Festival Tokens. Have fun at the games!",
                        responses: [
                            {
                                text: "Thanks!",
                                actions: [
                                    {
                                        type: "buy_festival_tokens",
                                        quantity: 10,
                                    },
                                ],
                                next: "start",
                            },
                        ],
                    },
                    not_enough_coins: {
                        npcName: "Event Host Mira",
                        npcIcon: "/assets/npcChatHeads/mira.png",
                        text: "You don't seem to have enough coins for that amount. Come back when you have a bit more gold!",
                        responses: [
                            {
                                text: "Okay.",
                                next: "start",
                            },
                        ],
                    },
                },
                actions: [
                    {
                        type: "shop",
                        label: "Browse Festival Stall",
                        shopId: "lantern_festival_shop",
                    },
                ],
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 375,
        y: 75,
    },
    trivia_kiosk: {
        id: "trivia_kiosk",
        name: "Trivia Kiosk",
        description: "A vacant information board with no notices posted.",
        connections: ["oakhaven_festival_entrance", "grand_lantern_plaza"],
        activities: [
            {
                type: "npc",
                name: "Trivia Master Lin",
                icon: "/assets/npcChatHeads/trivia_master_lin.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Welcome! The trivia kiosk is currently offline. Please come back during the Oakhaven Lantern Festival (May 25th - mid-June) to test your knowledge and earn tickets!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Trivia Master Lin",
                        npcIcon: "/assets/npcChatHeads/trivia_master_lin.png",
                        text: "Ah, a sharp mind! Test your knowledge of Embrune's history for Festival Tickets. Only one question per day, so make it count!",
                        responses: [
                            {
                                text: "I'll try a question.",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "festival_playable",
                                            gameId: "trivia",
                                        },
                                    ],
                                    successNode: "confirm_play",
                                    failureNode: "already_played",
                                },
                            },
                            {
                                text: "Maybe another time.",
                            },
                        ],
                    },
                    confirm_play: {
                        npcName: "Trivia Master Lin",
                        npcIcon: "/assets/npcChatHeads/trivia_master_lin.png",
                        text: "Excellent! You only get one attempt per day. Are you ready to test your knowledge?",
                        responses: [
                            {
                                text: "Start Kiosk",
                                actions: [
                                    {
                                        type: "start_trivia",
                                    },
                                ],
                            },
                            {
                                text: "Not yet.",
                            },
                        ],
                    },
                    already_played: {
                        npcName: "Trivia Master Lin",
                        npcIcon: "/assets/npcChatHeads/trivia_master_lin.png",
                        text: "You have already attempted today's question. The kiosk is locked until tomorrow!",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 375,
        y: 125,
    },
    grand_lantern_plaza: {
        id: "grand_lantern_plaza",
        name: "Grand Lantern Plaza",
        description: "A quiet courtyard where local townspeople occasionally sit. A large masterwork lantern stands in the center of the plaza.",
        connections: [
            "trivia_kiosk",
            "mira_pavilion",
            "launch_platform",
            "lake_boardwalk",
        ],
        activities: [
            {
                type: "npc",
                name: "Elder Brandic",
                icon: "/assets/npcChatHeads/artisan.png",
                startNode: "start",
                dialogue: ELDER_BRANDIC_DIALOGUE,
            },
            {
                type: "npc",
                name: "Celia the Wishmaker",
                icon: "woman-elf-face",
                startNode: "start",
                dialogue: CELIA_WISHMAKER_DIALOGUE,
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "woman-elf-face",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "woman-elf-face",
                        text: CIVILLIAN_DIALOGUE.lantern_festival.join("\n\n"),
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 400,
        y: 100,
    },
    launch_platform: {
        id: "launch_platform",
        name: "Launch Platform",
        description: "A scenic viewpoint looking out over Oakhaven valley.",
        connections: ["grand_lantern_plaza", "ring_toss_pavilion"],
        activities: [
            {
                type: "npc",
                name: "Ritch",
                icon: "/assets/npcChatHeads/ritch.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Hey there! The launch platform is currently closed. Come back during the Oakhaven Lantern Festival (May 25th - mid-June) when we launch lanterns into the night sky!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Ritch",
                        npcIcon: "/assets/npcChatHeads/ritch.png",
                        text: "Aha, fancy yourself a lantern launcher, do ya? Step right up! Hit the peak zone and I'll make it worth your while in tickets.",
                        responses: [
                            {
                                text: "Let's launch!",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "festival_playable",
                                            gameId: "lantern",
                                        },
                                    ],
                                    successNode: "confirm_play",
                                    failureNode: "already_played",
                                },
                            },
                            {
                                text: "Not right now.",
                            },
                        ],
                    },
                    confirm_play: {
                        npcName: "Ritch",
                        npcIcon: "/assets/npcChatHeads/ritch.png",
                        text: "Alright, grab a standard paper lantern. Ready to feed the flame and wait for the perfect thermal draft?",
                        responses: [
                            {
                                text: "Launch Lantern!",
                                actions: [
                                    {
                                        type: "launch_lantern",
                                    },
                                ],
                            },
                            {
                                text: "Wait, not yet.",
                            },
                        ],
                    },
                    already_played: {
                        npcName: "Ritch",
                        npcIcon: "/assets/npcChatHeads/ritch.png",
                        text: "We only prepare one lantern launch per customer per day, friend. Safety code and all! Come back tomorrow.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 450,
        y: 100,
    },
    ring_toss_pavilion: {
        id: "ring_toss_pavilion",
        name: "Ring Toss Pavilion",
        description: "An empty grassy spot beside the path.",
        connections: ["launch_platform", "high_striker_pillar"],
        activities: [
            {
                type: "npc",
                name: "Stall Host Jin",
                icon: "/assets/npcChatHeads/stall_host_jin.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Hello! The Ring Toss pavilion is closed for the season. See you during the Oakhaven Lantern Festival (May 25th - mid-June)!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Stall Host Jin",
                        npcIcon: "/assets/npcChatHeads/stall_host_jin.png",
                        text: "A grid of 5x5 pegs stands before you, along with a basket of golden rings. Ready to toss some rings and try your luck? It costs 1 Festival Token for 1 ring, or 3 Festival Tokens for 5 rings!",
                        responses: [
                            {
                                text: "Play 1 Ring (1 Token)",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "festival_token",
                                                    quantity: 1,
                                                },
                                            ],
                                        },
                                    ],
                                    successNode: "play_1_confirm",
                                    failureNode: "need_tokens",
                                },
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "festival_token",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "Play 5 Rings (3 Tokens)",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "festival_token",
                                                    quantity: 3,
                                                },
                                            ],
                                        },
                                    ],
                                    successNode: "play_5_confirm",
                                    failureNode: "need_tokens",
                                },
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "festival_token",
                                        quantity: 3,
                                    },
                                ],
                            },
                            {
                                text: "No thanks.",
                            },
                        ],
                    },
                    play_1_confirm: {
                        npcName: "Stall Host Jin",
                        npcIcon: "/assets/npcChatHeads/stall_host_jin.png",
                        text: "Here is your ring. Show me your best throw!",
                        responses: [
                            {
                                text: "Start Ring Toss",
                                actions: [
                                    {
                                        type: "play_ring_toss",
                                        rings: 1,
                                    },
                                ],
                            },
                        ],
                    },
                    play_5_confirm: {
                        npcName: "Stall Host Jin",
                        npcIcon: "/assets/npcChatHeads/stall_host_jin.png",
                        text: "Here are your 5 rings. Show me your best throws!",
                        responses: [
                            {
                                text: "Start Ring Toss",
                                actions: [
                                    {
                                        type: "play_ring_toss",
                                        rings: 5,
                                    },
                                ],
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Stall Host Jin",
                        npcIcon: "/assets/npcChatHeads/stall_host_jin.png",
                        text: "You don't have enough Festival Tokens to play! You can purchase them from Event Host Mira for 100 coins each.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 400,
        y: 125,
    },
    high_striker_pillar: {
        id: "high_striker_pillar",
        name: "High Striker Pillar",
        description: "A simple boundary marker post at the edge of the grounds.",
        connections: ["ring_toss_pavilion", "lake_boardwalk"],
        activities: [
            {
                type: "npc",
                name: "Strongman Brokk",
                icon: "/assets/npcChatHeads/strongman_brokk.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Sorry, buddy! The high striker is packed away. Come back during the Oakhaven Lantern Festival (May 25th - mid-June) to test your strength!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Strongman Brokk",
                        npcIcon: "/assets/npcChatHeads/strongman_brokk.png",
                        text: "RING THE BELL! Hit the mallet and we'll see what you're made of. It costs 2 Festival Tokens to play. Win big tickets if you strike true!",
                        responses: [
                            {
                                text: "Give it a swing (2 Tokens)",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "festival_token",
                                                    quantity: 2,
                                                },
                                            ],
                                        },
                                    ],
                                    successNode: "play_confirm",
                                    failureNode: "need_tokens",
                                },
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "festival_token",
                                        quantity: 2,
                                    },
                                ],
                            },
                            {
                                text: "Not today.",
                            },
                        ],
                    },
                    play_confirm: {
                        npcName: "Strongman Brokk",
                        npcIcon: "/assets/npcChatHeads/strongman_brokk.png",
                        text: "Alright, let's see how much strength you've got!",
                        responses: [
                            {
                                text: "Start Game",
                                actions: [
                                    {
                                        type: "play_high_striker",
                                    },
                                ],
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Strongman Brokk",
                        npcIcon: "/assets/npcChatHeads/strongman_brokk.png",
                        text: "You need 2 Festival Tokens to swing the hammer, buddy! Go see Mira for tokens.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 450,
        y: 150,
    },
    lake_boardwalk: {
        id: "lake_boardwalk",
        name: "Lake Boardwalk",
        description: "A peaceful walkway overlooking the river.",
        connections: [
            "grand_lantern_plaza",
            "high_striker_pillar",
            "rolling_logs_pond",
        ],
        activities: [
            {
                type: "npc",
                name: "Fisherman Ronald",
                icon: "person",
                startNode: "start",
                dialogue: FISHERMAN_RONALD_DIALOGUE,
            },
            {
                type: "npc",
                name: "Alpin the Smelter",
                icon: "/assets/npcChatHeads/artisan.png",
                startNode: "start",
                dialogue: ALPIN_SMELTER_DIALOGUE,
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "person",
                        text: CIVILLIAN_DIALOGUE.lantern_festival.join("\n\n"),
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 450,
        y: 125,
    },
    rolling_logs_pond: {
        id: "rolling_logs_pond",
        name: "Rolling Logs Pond",
        description: "A peaceful pond with a few natural reeds growing.",
        connections: ["lake_boardwalk", "whack_a_lantern_booth"],
        activities: [
            {
                type: "npc",
                name: "Instructor Kenji",
                icon: "/assets/npcChatHeads/instructor_kenji.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Balance cannot be rushed. The rolling logs pond is closed until the Oakhaven Lantern Festival (May 25th - mid-June).",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Instructor Kenji",
                        npcIcon: "/assets/npcChatHeads/instructor_kenji.png",
                        text: "Balance is the art of stillness in motion. Step onto the log, stay centered, and earn your tickets. It costs 1 Festival Token to participate.",
                        responses: [
                            {
                                text: "Step onto the log (1 Token)",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "festival_token",
                                                    quantity: 1,
                                                },
                                            ],
                                        },
                                    ],
                                    successNode: "play_confirm",
                                    failureNode: "need_tokens",
                                },
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "festival_token",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "Maybe later.",
                            },
                        ],
                    },
                    play_confirm: {
                        npcName: "Instructor Kenji",
                        npcIcon: "/assets/npcChatHeads/instructor_kenji.png",
                        text: "Excellent. Remember to adjust your weight carefully.",
                        responses: [
                            {
                                text: "Start Game",
                                actions: [
                                    {
                                        type: "play_log_balance",
                                    },
                                ],
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Instructor Kenji",
                        npcIcon: "/assets/npcChatHeads/instructor_kenji.png",
                        text: "You need 1 Festival Token to attempt the logs pond. Speak to Mira to buy some.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 500,
        y: 125,
    },
    whack_a_lantern_booth: {
        id: "whack_a_lantern_booth",
        name: "Whack a Lantern Booth",
        description: "A simple wooden counter beside the path.",
        connections: ["rolling_logs_pond", "gourd_patch"],
        activities: [
            {
                type: "npc",
                name: "Booth Host Hana",
                icon: "/assets/npcChatHeads/booth_host_hana.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "The booth is locked! Come back during the Oakhaven Lantern Festival (May 25th - mid-June) to play Whack-a-Lantern!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Booth Host Hana",
                        npcIcon: "/assets/npcChatHeads/booth_host_hana.png",
                        text: "Click as many lanterns as you can before the time runs out! But watch out — hit a red one and it's all over! It costs 2 Festival Tokens to play.",
                        responses: [
                            {
                                text: "Play (2 Tokens)",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "festival_token",
                                                    quantity: 2,
                                                },
                                            ],
                                        },
                                    ],
                                    successNode: "play_confirm",
                                    failureNode: "need_tokens",
                                },
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "festival_token",
                                        quantity: 2,
                                    },
                                ],
                            },
                            {
                                text: "Not right now.",
                            },
                        ],
                    },
                    play_confirm: {
                        npcName: "Booth Host Hana",
                        npcIcon: "/assets/npcChatHeads/booth_host_hana.png",
                        text: "Grab the hammer and get ready to smash!",
                        responses: [
                            {
                                text: "Start Game",
                                actions: [
                                    {
                                        type: "play_whack_lantern",
                                    },
                                ],
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Booth Host Hana",
                        npcIcon: "/assets/npcChatHeads/booth_host_hana.png",
                        text: "You need 2 Festival Tokens to play Whack-a-Lantern. Mira can sell you some.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 500,
        y: 100,
    },
    gourd_patch: {
        id: "gourd_patch",
        name: "Gourd Patch",
        description: "A small, tilled garden bed waiting for the next planting season.",
        connections: ["whack_a_lantern_booth", "mira_pavilion"],
        activities: [
            {
                type: "npc",
                name: "Patch Keeper",
                icon: "/assets/npcChatHeads/patch_keeper.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "Welcome to the gourd patch. The festival pumpkins are still growing! Come back during the Oakhaven Lantern Festival (May 25th - mid-June) to smash some gourds!",
                        check: {
                            requirements: [
                                {
                                    type: "festival_active",
                                    value: false,
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Patch Keeper",
                        npcIcon: "/assets/npcChatHeads/patch_keeper.png",
                        text: "These gourds are grown ripe and ready for smashin'! One smash per day — what's inside is a surprise. Could be a modest haul, could be something truly special.",
                        responses: [
                            {
                                text: "I'll smash a gourd.",
                                check: {
                                    requirements: [
                                        {
                                            type: "festival_active",
                                            value: true,
                                        },
                                        {
                                            type: "festival_playable",
                                            gameId: "gourd",
                                        },
                                    ],
                                    successNode: "confirm_smash",
                                    failureNode: "already_played",
                                },
                            },
                            {
                                text: "I'll come back later.",
                            },
                        ],
                    },
                    confirm_smash: {
                        npcName: "Patch Keeper",
                        npcIcon: "/assets/npcChatHeads/patch_keeper.png",
                        text: "Alright, grab that wooden mallet. One swing, one smash! Ready?",
                        responses: [
                            {
                                text: "Smash it!",
                                actions: [
                                    {
                                        type: "smash_gourd",
                                    },
                                ],
                                next: "smash_result",
                            },
                            {
                                text: "Wait, let me prepare.",
                            },
                        ],
                    },
                    already_played: {
                        npcName: "Patch Keeper",
                        npcIcon: "/assets/npcChatHeads/patch_keeper.png",
                        text: "You've already smashed a gourd today, friend. Give the others a chance! Come back tomorrow.",
                        responses: [
                            {
                                text: "Goodbye.",
                            },
                        ],
                    },
                    smash_result: {
                        npcName: "Patch Keeper",
                        npcIcon: "/assets/npcChatHeads/patch_keeper.png",
                        text: "CRASH! That gourd shattered clean open. Check your activity log to see what surprise was waiting inside!",
                        responses: [
                            {
                                text: "Thanks!",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 450,
        y: 75,
    },
};
