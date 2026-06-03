import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

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
                dialogue: {
                    start: {
                        npcName: "Pip the Gourd Carver",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Hey! Watch the blade, it's razor-sharp! I'm trying to carve out a traditional design here. People think paper lanterns are all the rage, but hollowing out a dried gourd is a true art form!",
                        responses: [
                            {
                                text: "How did you learn this art?",
                                next: "carving",
                            },
                            {
                                text: "Where do you get your gourds?",
                                next: "patch",
                            },
                            {
                                text: "Keep up the good work!",
                            },
                        ],
                    },
                    carving: {
                        npcName: "Pip the Gourd Carver",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "My master says the trick is not to carve too deep. One slip, and you ruin the structural integrity of the shell! The smell of fresh wood shavings and dried pulp is what Oakhaven is all about. True craftsmanship is in our blood.",
                        responses: [
                            {
                                text: "I see. Let's talk about something else.",
                                next: "start",
                            },
                        ],
                    },
                    patch: {
                        npcName: "Pip the Gourd Carver",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Just down the path at the Gourd Patch! The soil there is incredibly rich. We harvest them in autumn, dry them out over winter, and then they're ready to be carved or smashed for the festival! Have you tried smashing one today?",
                        responses: [
                            {
                                text: "Not yet, I'll go check it out.",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Merry Pilgrim Tessa",
                icon: "woman-elf-face",
                startNode: "start",
                dialogue: {
                    start: {
                        npcName: "Merry Pilgrim Tessa",
                        npcIcon: "woman-elf-face",
                        text: "Blessings of the road upon you, traveler! I have journeyed all the way from the capital, through the rugged Copperback Pass, just to see the Oakhaven lanterns float over the lake. It is even more beautiful than the songs described!",
                        responses: [
                            {
                                text: "How was the journey through the Pass?",
                                next: "pilgrimage",
                            },
                            {
                                text: "What do you think of the lanterns?",
                                next: "lanterns",
                            },
                            {
                                text: "Safe travels on your journey.",
                            },
                        ],
                    },
                    pilgrimage: {
                        npcName: "Merry Pilgrim Tessa",
                        npcIcon: "woman-elf-face",
                        text: "The Copperback Pass is steep and full of loose stone, but the shimmering veins of copper in the cliffs are breathtaking. I met a few other pilgrims along the way. We shared stories of the old days, back when people travelled to the catacombs of the Pale Shepherd.",
                        responses: [
                            {
                                text: "Tell me more of your thoughts.",
                                next: "start",
                            },
                        ],
                    },
                    lanterns: {
                        npcName: "Merry Pilgrim Tessa",
                        npcIcon: "woman-elf-face",
                        text: "The glow is so serene! Paper and wax allow them to float high up, carrying our prayers toward the heavens. But I bought an old hollow gourd lantern from a local carver as well. It has a rustic charm that honors the ancient traditions of Oakhaven.",
                        responses: [
                            {
                                text: "It truly is beautiful. Let's talk about something else.",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "person",
                        text: "The glow of the lanterns over the lake is absolutely stunning!\n\nI ate three meat pies from the food stalls. No regrets!\n\nHave you tried the ring toss? Jin makes it look easy, but those pegs are slippery!\n\nBrokk is showing off at the high striker again. That bell hasn't stopped ringing all evening.\n\nKenji's log balance pond is harder than it looks. I slipped right in on my first try!\n\nI bought a lovely paper lantern from Mira's stall. I'm going to launch it with my family tonight.\n\nThe music, the lights, the laughter... I wish the Lantern Festival lasted all year!\n\nHana's Whack-a-Lantern game is incredibly addictive. My arm is sore from all the mallet swinging!\n\nMake sure to visit the Gourd Patch! Smashing them open is surprisingly satisfying.\n\nLin's trivia kiosk really tested my brain today. I'm glad I paid attention to Oakhaven's history!\n\nI love seeing the children running around with their small hand-held lanterns.\n\nThe lake breeze at night is chilly, but the warmth of the crowd keeps everyone cozy.\n\nI'm saving up my Festival Tickets for one of those rare souvenir rewards!\n\nDid you see the giant master lantern in the plaza? The carving on it is magnificent.\n\nIt's so wonderful to see everyone from town taking a break to celebrate together.",
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
                dialogue: {
                    start: {
                        npcName: "Elder Brandic",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Greetings, young traveler. I have watched seventy-two seasons of the Lantern Festival in Oakhaven, and yet the sight of these lights floating into the night sky never fails to warm my old bones. What would you like to know of our history?",
                        responses: [
                            {
                                text: "Tell me about the lanterns we use.",
                                next: "gourds",
                            },
                            {
                                text: "Who forged the beautiful North Gate?",
                                next: "north_gate",
                            },
                            {
                                text: "What is this about catacombs under Oakhaven?",
                                next: "pale_shepherd",
                            },
                            {
                                text: "Enjoy the festival, Elder.",
                            },
                        ],
                    },
                    gourds: {
                        npcName: "Elder Brandic",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Ah, today everyone uses wax and paper. But in the old Embrune harvest festivals, long before the modern style, our lanterns were traditionally crafted from dried gourds! We would hollow them out and place a simple tallow candle inside to guide the spirits of the harvest. You can still see them at the Gourd Patch.",
                        responses: [
                            {
                                text: "Fascinating. Tell me something else.",
                                next: "start",
                            },
                        ],
                    },
                    north_gate: {
                        npcName: "Elder Brandic",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Ah, the sturdy North Gate of Oakhaven! The first iron gate was forged by Durnwall the Elder back in the year 312 of the Embrune calendar. It was a masterpiece of smelting and blacksmithing, designed to withstand the cold winds and protect our artisans from outside threats.",
                        responses: [
                            {
                                text: "Amazing craftsmanship. Tell me more.",
                                next: "start",
                            },
                        ],
                    },
                    pale_shepherd: {
                        npcName: "Elder Brandic",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Shh... speak softly of such things. Deep beneath our peaceful town, in the old Sanctity catacombs, lies the altar of the forgotten deity known as the Pale Shepherd. Centuries ago, silent pilgrims would wander those dark tunnels to leave humble offerings of wax at its feet, hoping for guidance through life's shadows.",
                        responses: [
                            {
                                text: "That is quite mysterious. Thank you, Elder.",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Celia the Wishmaker",
                icon: "woman-elf-face",
                startNode: "start",
                dialogue: {
                    start: {
                        npcName: "Celia the Wishmaker",
                        npcIcon: "woman-elf-face",
                        text: "Welcome to the plaza! Isn't the glow from the lanterns absolutely enchanting? I've already thrown a coin into the wishing well today, and I'm planning to launch my own lantern soon.",
                        responses: [
                            {
                                text: "Tell me about the wishing well.",
                                next: "wishing_well",
                            },
                            {
                                text: "Do you know how the lake basin was formed?",
                                next: "lake_flood",
                            },
                            {
                                text: "May your wishes come true.",
                            },
                        ],
                    },
                    wishing_well: {
                        npcName: "Celia the Wishmaker",
                        npcIcon: "woman-elf-face",
                        text: "The Oakhaven wishing well is said to be connected to ancient underground waterways. If you are patient and sincere, the waters will bring you great fortune. Just be sure to toss a coin in and make your request!",
                        responses: [
                            {
                                text: "Interesting. Let's chat more.",
                                next: "start",
                            },
                        ],
                    },
                    lake_flood: {
                        npcName: "Celia the Wishmaker",
                        npcIcon: "woman-elf-face",
                        text: "Oh, it is a dramatic tale! The Oakhaven lake basin wasn't always here. A massive landslide redirected the Greyvein tributary valley, completely flooding the lowland over several decades. It shaped the beautiful shoreline we enjoy today during our walks.",
                        responses: [
                            {
                                text: "Wow, nature is powerful. What else?",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "woman-elf-face",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "woman-elf-face",
                        text: "The glow of the lanterns over the lake is absolutely stunning!\n\nI ate three meat pies from the food stalls. No regrets!\n\nHave you tried the ring toss? Jin makes it look easy, but those pegs are slippery!\n\nBrokk is showing off at the high striker again. That bell hasn't stopped ringing all evening.\n\nKenji's log balance pond is harder than it looks. I slipped right in on my first try!\n\nI bought a lovely paper lantern from Mira's stall. I'm going to launch it with my family tonight.\n\nThe music, the lights, the laughter... I wish the Lantern Festival lasted all year!\n\nHana's Whack-a-Lantern game is incredibly addictive. My arm is sore from all the mallet swinging!\n\nMake sure to visit the Gourd Patch! Smashing them open is surprisingly satisfying.\n\nLin's trivia kiosk really tested my brain today. I'm glad I paid attention to Oakhaven's history!\n\nI love seeing the children running around with their small hand-held lanterns.\n\nThe lake breeze at night is chilly, but the warmth of the crowd keeps everyone cozy.\n\nI'm saving up my Festival Tickets for one of those rare souvenir rewards!\n\nDid you see the giant master lantern in the plaza? The carving on it is magnificent.\n\nIt's so wonderful to see everyone from town taking a break to celebrate together.",
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
                        text: "All the rings have been stolen, and the stall is closed for the rest of the festival, unfortunately.",
                        responses: [
                            {
                                text: "Aww! Do you know when it'll open again?",
                                next: "closed_info",
                            },
                            {
                                text: "I'll come back later!",
                            },
                        ],
                    },
                    closed_info: {
                        npcName: "Stall Host Jin",
                        npcIcon: "/assets/npcChatHeads/stall_host_jin.png",
                        text: "We won't get another shipment of rings until next year's festival.",
                        responses: [
                            {
                                text: "Oh well. I'll come back next year!",
                            },
                            {
                                text: "Thanks anyway.",
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
            "balloon_popper_stall",
        ],
        activities: [
            {
                type: "npc",
                name: "Fisherman Ronald",
                icon: "person",
                startNode: "start",
                dialogue: {
                    start: {
                        npcName: "Fisherman Ronald",
                        npcIcon: "person",
                        text: "Aye, the fish are biting tonight! The glowing lanterns reflecting on the water seem to attract them right up to the surface. Best trout you'll ever see, swimming right in the lake basin.",
                        responses: [
                            {
                                text: "How did this lake basin get here?",
                                next: "flood_basin",
                            },
                            {
                                text: "Are you catching anything good?",
                                next: "fishing_lights",
                            },
                            {
                                text: "Good luck with the catch!",
                            },
                        ],
                    },
                    flood_basin: {
                        npcName: "Fisherman Ronald",
                        npcIcon: "person",
                        text: "My grandfather told me the story. Decades ago, a massive landslide up the valley redirected the entire Greyvein tributary. Water flooded the valley and slowly carved out this perfect lake basin. It created the most fertile fishing grounds in the entire region!",
                        responses: [
                            {
                                text: "Nature's wonders. Tell me more.",
                                next: "start",
                            },
                        ],
                    },
                    fishing_lights: {
                        npcName: "Fisherman Ronald",
                        npcIcon: "person",
                        text: "Oh, absolutely. The clear water here is perfect for nighttime fishing. When the paper lanterns drift overhead, the golden light pierces deep into the water, and you can see the shadows of giant trout swimming near the reeds. It's a magical sight.",
                        responses: [
                            {
                                text: "Sounds peaceful. Let's talk about something else.",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Alpin the Smelter",
                icon: "/assets/npcChatHeads/artisan.png",
                startNode: "start",
                dialogue: {
                    start: {
                        npcName: "Alpin the Smelter",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Ah, nothing like a festival to get a hard-working smelter out of the smithy! The heat of the furnace is nothing compared to the warmth of these festival fires. Are you here to test your strength, traveler?",
                        responses: [
                            {
                                text: "How is trade coming in?",
                                next: "pass_road",
                            },
                            {
                                text: "Do you know about Durnwall the Elder?",
                                next: "durnwall",
                            },
                            {
                                text: "Enjoy your day off!",
                            },
                        ],
                    },
                    pass_road: {
                        npcName: "Alpin the Smelter",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "We rely heavily on the Copperback Pass to bring in raw materials and trade goods from the Silverhaven road. It got its name from the copper-bearing rock formations running along the hillside. If you travel that road, keep your eyes on the sparkling stones!",
                        responses: [
                            {
                                text: "Good to know. Tell me more.",
                                next: "start",
                            },
                        ],
                    },
                    durnwall: {
                        npcName: "Alpin the Smelter",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Of course! Every apprentice smelter learns of Durnwall the Elder. He was the legendary craftsman who forged the original iron gates of the North Gate in year 312. The iron was so pure and well-tempered that parts of his work still stand strong today.",
                        responses: [
                            {
                                text: "He sounds like a legend. Let's talk about something else.",
                                next: "start",
                            },
                        ],
                    },
                },
            },
            {
                type: "npc",
                name: "Festival Goer",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Festival Goer",
                        npcIcon: "person",
                        text: "The glow of the lanterns over the lake is absolutely stunning!\n\nI ate three meat pies from the food stalls. No regrets!\n\nHave you tried the ring toss? Jin makes it look easy, but those pegs are slippery!\n\nBrokk is showing off at the high striker again. That bell hasn't stopped ringing all evening.\n\nKenji's log balance pond is harder than it looks. I slipped right in on my first try!\n\nI bought a lovely paper lantern from Mira's stall. I'm going to launch it with my family tonight.\n\nThe music, the lights, the laughter... I wish the Lantern Festival lasted all year!\n\nHana's Whack-a-Lantern game is incredibly addictive. My arm is sore from all the mallet swinging!\n\nMake sure to visit the Gourd Patch! Smashing them open is surprisingly satisfying.\n\nLin's trivia kiosk really tested my brain today. I'm glad I paid attention to Oakhaven's history!\n\nI love seeing the children running around with their small hand-held lanterns.\n\nThe lake breeze at night is chilly, but the warmth of the crowd keeps everyone cozy.\n\nI'm saving up my Festival Tickets for one of those rare souvenir rewards!\n\nDid you see the giant master lantern in the plaza? The carving on it is magnificent.\n\nIt's so wonderful to see everyone from town taking a break to celebrate together.",
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
        connections: ["whack_a_lantern_booth", "mira_pavilion", "skee_ball_booth"],
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
    skee_ball_booth: {
        id: "skee_ball_booth",
        name: "Lane Roller Booth",
        description: "A wooden frame with holes in it sits behind the Stall manager, it looks very odd.",
        connections: ["gourd_patch"],
        activities: [
            {
                type: "npc",
                name: "Ball Loader Victoria",
                icon: "/assets/npcChatHeads/ball_loader_victoria.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "The booth is locked! Come back during the Oakhaven Lantern Festival (May 25th - mid-June) to play Lane Roller!",
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
                        npcName: "Ball Loader Victoria",
                        npcIcon: "/assets/npcChatHeads/ball_loader_victoria.png",
                        text: "Looking for an exciting minigame testing your skill? Look no further than Lane Roller!",
                        responses: [
                            {
                                text: "Play (1 Tokens)",
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
                        ],
                    },
                    play_confirm: {
                        npcName: "Ball Loader Victoria",
                        npcIcon: "/assets/npcChatHeads/ball_loader_victoria.png",
                        text: "Ready to play Lane Roller!",
                        responses: [
                            {
                                text: "Start Game",
                                actions: [{ type: "play_skeeball" }],
                            },
                            {
                                text: "Cancel",
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Ball Loader Victoria",
                        npcIcon: "/assets/npcChatHeads/ball_loader_victoria.png",
                        text: "You need 1 Festival Tokens to play Lane Roller. Mira can sell you some.",
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
        y: 50,
        connectionRequirements: undefined,
    },
    balloon_popper_stall: {
        id: "balloon_popper_stall",
        name: "Balloon Popper Stall",
        description: "Behind the counter, there is a board filled with balloons, you see some darts with sharp points.",
        connections: ["lake_boardwalk"],
        activities: [
            {
                type: "npc",
                name: "Dart Thrower Kevin",
                icon: "/assets/npcChatHeads/booth_host_hana.png",
                startNode: "start",
                conditionalGreetings: [
                    {
                        text: "The booth is locked! Come back during the Oakhaven Lantern Festival (May 25th - mid-June) to play Balloon Popper!",
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
                        npcName: "Dart Thrower Kevin",
                        npcIcon: "/assets/npcChatHeads/dart_thrower_kevin.png",
                        text: "Pickup and throw darts at the balloons to pop them, earn prizes the more you pop! Want to have a go?",
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
                        npcName: "Dart Thrower Kevin",
                        npcIcon: "/assets/npcChatHeads/dart_thrower_kevin.png",
                        text: "Alright, let me get you some darts!",
                        responses: [
                            {
                                text: "Start Game",
                                actions: [
                                    {
                                        type: "play_balloon_pop",
                                    },
                                ],
                            },
                        ],
                    },
                    need_tokens: {
                        npcName: "Dart Thrower Kevin",
                        npcIcon: "/assets/npcChatHeads/dart_thrower_kevin.png",
                        text: "You need 2 Festival Tokens to play Balloon Popper. Mira can sell you some.",
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
        y: 150,
        connectionRequirements: undefined,
    },
};
