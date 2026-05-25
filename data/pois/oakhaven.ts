import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const oakhavenPois: Record<string, POI> = {
    oakhaven_north_gate: {
        id: "oakhaven_north_gate",
        name: "Oakhaven North Gate",
        description: "Sturdy wooden gates mark the entrance to the town of Oakhaven. The scent of sawdust and tanning leather hangs in the air.",
        connections: ["oakhaven_road_2", "oakhaven_square"],
        activities: [],
        regionId: "oakhaven",
        type: "internal",
        x: 250,
        y: 0,
        eX: 1000,
        eY: 1800,
        unlockRequirement: {
            type: "quest",
            questId: "bandit_toll",
            stage: 1,
        },
    },
    oakhaven_west_gate: {
        id: "oakhaven_west_gate",
        name: "Oakhaven West Gate",
        description: "This gate leads out to the old King's Road, a once-major trade artery that has fallen into disuse. A guard eyes the road warily.",
        connections: ["oakhaven_crafting_district", "kings_road_west_1"],
        activities: [
            {
                type: "npc",
                name: "Guard Captain Elara",
                icon: "/assets/npcChatHeads/guard_captain_elara.png",
                pickpocket: {
                    lootTableId: "pickpocket_guard_table",
                },
                attackableMonsterId: "guard",
                startNode: "elara_default",
                questTopics: ["capitals_call", "scales_of_the_swamp"],
                conditionalGreetings: [
                    {
                        text: "You're back. Did you find him? Do you have proof?",
                        check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 2 }] }
                    }
                ]
            },
        ],
        regionId: "oakhaven",
        type: "internal",
        x: 0,
        y: 150,
        eX: 1000,
        eY: 1800,
    },
    oakhaven_square: {
        id: "oakhaven_square",
        name: "Oakhaven Square",
        description: "The center of the crafting town. A serene-looking wishing well sits in the middle of the square. Roads lead to the gates and various districts.",
        connections: [
            "oakhaven_north_gate",
            "oakhaven_market",
            "oakhaven_crafting_district",
            "oakhaven_tavern_street",
            "oakhaven_bank",
            "oakhaven_chapel",
        ],
        activities: [
            {
                type: "wishing_well",
            },
            {
                type: "water_source",
                name: "Collect Water",
            },
            {
                type: "npc",
                name: "Man",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Man",
                        npcIcon: "person",
                        text: "Heard the goblins in the mines are getting bolder. Nasty little creatures.\n\nThat Old Man Fitzwilliam... complains about everything, but he has a good heart.\n\nThe road south to Oakhaven is dangerous. Full of bandits, they say.\n\nThey say the Whispering Woods got their name 'cause the trees themselves are alive... others say it's just the wind.\n\nSome say a great treasure is buried in the swamps to the east... others say it's just mud and monsters.\n\nThe smithy is always busy. Valerius is a master of his craft.\n\nLooking for work? The board in The Rusty Flagon sometimes has odd jobs.\n\nThe mountains to the north are treacherous. Full of harpies and worse, I hear.\n\nA feywood log is worth a pretty penny, but getting them is the tricky part. The woods are... strange.\n\nHave you seen the ranch west of town? McGregor's got the fattest cows and the fluffiest sheep.\n\nThe capital city, Silverhaven... they say the walls are made of pure silver. Don't believe a word of it, but it's a sight to see.\n\nSomething about the stones in the ancient clearings... they hum with a strange energy.\n\nThere are altars hidden all over the world. Places of great power for those who know how to use them.\n\nCareful with those runes. Magic is a fickle thing, and powerful.\n\nSome say a witch lives deep in the Murkwallow Swamp. I wouldn't go looking for her.\n\nThe Serpent's Coil... a maze of mangroves and monsters. Only the foolish or the brave go there.\n\nThe Isle of Whispers... it's a place of ghosts and forgotten gods. Not many who sail there come back.\n\nThe salt flats to the west were once a great sea. Now it's just... salt. And strange creatures.\n\nLooking for adventure? You've come to the right place. Just try not to get killed.\n\nDon't forget to check your map if you get lost! It can save your skin.\n\nAlways carry a tinderbox. You never know when you'll need a warm fire.\n\nA good shield can be the difference between a close call and a long walk back from your respawn point.\n\nDifferent monsters are weak to different attack styles. Stab, slash, or crush... it pays to know which to use.\n\nI saw an adventurer once, wearing armor that shimmered like water. Must have cost a fortune.\n\nBurying bones is a good way to train your Prayer skill. It's a bit grim, but effective.\n\nSome folks say the strongest weapons can't be smithed, but are dropped by powerful monsters.\n\nAlways check the quest board in a new town. It's the best way to earn some coin and a bit of renown.\n\nDon't underestimate a good meal. A well-cooked fish can save your life in a pinch.\n\nThat banker in the town square seems a bit stern, but your items are safe with him.\n\nIf you see something glowing, it's either very valuable or very dangerous. Sometimes both.\n\nI've heard tales of a reclusive smith in the mountains who can forge mighty warhammers.\n\nThe world is full of secrets. Keep your eyes open, and you might find something amazing.\n\nSome potions can boost your skills temporarily. Very useful for tough tasks.\n\nDon't forget to train your Defence. It's no use hitting hard if you can't take a punch.\n\nThe further you travel from the main cities, the more dangerous the world becomes.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                attackableMonsterId: "man",
                pickpocket: {
                    lootTableId: "pickpocket_oakhaven_citizen",
                },
            },
            {
                type: "npc",
                name: "Woman",
                icon: "woman-elf-face",
                dialogue: {
                    start: {
                        npcName: "Woman",
                        npcIcon: "woman-elf-face",
                        text: "Heard the goblins in the mines are getting bolder. Nasty little creatures.\n\nThat Old Man Fitzwilliam... complains about everything, but he has a good heart.\n\nThe road south to Oakhaven is dangerous. Full of bandits, they say.\n\nThey say the Whispering Woods got their name 'cause the trees themselves are alive... others say it's just the wind.\n\nSome say a great treasure is buried in the swamps to the east... others say it's just mud and monsters.\n\nThe smithy is always busy. Valerius is a master of his craft.\n\nLooking for work? The board in The Rusty Flagon sometimes has odd jobs.\n\nThe mountains to the north are treacherous. Full of harpies and worse, I hear.\n\nA feywood log is worth a pretty penny, but getting them is the tricky part. The woods are... strange.\n\nHave you seen the ranch west of town? McGregor's got the fattest cows and the fluffiest sheep.\n\nThe capital city, Silverhaven... they say the walls are made of pure silver. Don't believe a word of it, but it's a sight to see.\n\nSomething about the stones in the ancient clearings... they hum with a strange energy.\n\nThere are altars hidden all over the world. Places of great power for those who know how to use them.\n\nCareful with those runes. Magic is a fickle thing, and powerful.\n\nSome say a witch lives deep in the Murkwallow Swamp. I wouldn't go looking for her.\n\nThe Serpent's Coil... a maze of mangroves and monsters. Only the foolish or the brave go there.\n\nThe Isle of Whispers... it's a place of ghosts and forgotten gods. Not many who sail there come back.\n\nThe salt flats to the west were once a great sea. Now it's just... salt. And strange creatures.\n\nLooking for adventure? You've come to the right place. Just try not to get killed.\n\nDon't forget to check your map if you get lost! It can save your skin.\n\nAlways carry a tinderbox. You never know when you'll need a warm fire.\n\nA good shield can be the difference between a close call and a long walk back from your respawn point.\n\nDifferent monsters are weak to different attack styles. Stab, slash, or crush... it pays to know which to use.\n\nI saw an adventurer once, wearing armor that shimmered like water. Must have cost a fortune.\n\nBurying bones is a good way to train your Prayer skill. It's a bit grim, but effective.\n\nSome folks say the strongest weapons can't be smithed, but are dropped by powerful monsters.\n\nAlways check the quest board in a new town. It's the best way to earn some coin and a bit of renown.\n\nDon't underestimate a good meal. A well-cooked fish can save your life in a pinch.\n\nThat banker in the town square seems a bit stern, but your items are safe with him.\n\nIf you see something glowing, it's either very valuable or very dangerous. Sometimes both.\n\nI've heard tales of a reclusive smith in the mountains who can forge mighty warhammers.\n\nThe world is full of secrets. Keep your eyes open, and you might find something amazing.\n\nSome potions can boost your skills temporarily. Very useful for tough tasks.\n\nDon't forget to train your Defence. It's no use hitting hard if you can't take a punch.\n\nThe further you travel from the main cities, the more dangerous the world becomes.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                attackableMonsterId: "woman",
                pickpocket: {
                    lootTableId: "pickpocket_oakhaven_citizen",
                },
            },
            {
                type: "npc",
                name: "Craftsman",
                icon: "/assets/npcChatHeads/artisan.png",
                pickpocket: {
                    lootTableId: "pickpocket_craftsman_table",
                },
                dialogue: {
                    start: {
                        npcName: "Craftsman",
                        npcIcon: "/assets/npcChatHeads/artisan.png",
                        text: "Welcome to Oakhaven, the craftiest town in the kingdom!\n\nIf you need tools or thread, the Artisan Supplies shop has the best selection.\n\nTanner Sven can turn any hide into workable leather, for a small fee of course.\n\nThe Carved Mug has the best boar stew this side of the capital.\n\nLooking for herbs? Elara's Apothecary is the place to go. She knows all the local flora.\n\nThe King's Road to the west used to be a major trade route. Now, the bridge is out and it's full of highwaymen.\n\nBronn the Retired Adventurer in the tavern has some wild stories. Half of them might even be true.\n\nThey say the harpies in the Gale-Swept Peaks have feathers sharp as steel. Might be useful for fletching.\n\nI've heard you can find yew trees high up in the mountains, but it's a dangerous climb.\n\nThe local wishing well is said to grant good fortune to those who are patient.\n\nNeed to make potions? You'll need a pestle and mortar to grind your ingredients. The supply shop has them.\n\nThe woods to the west are full of boars and bears. Good for hunting, if you're brave enough.\n\nSome say the gems found in the mines have magical properties when enchanted.\n\nI saw a strange, shimmering stag in the hills. It vanished before I could get a closer look.\n\nThe wood from the Feywood is said to be naturally magical. Bows made from it are incredibly powerful.\n\nWatch out for the swamp monsters. They're slow, but they hit like a falling rock.\n\nGuard Captain Elara is worried about the capital. Says the roads need to be secured.\n\nIf you're a ranger, you'll want to visit Oakhaven. We have the best fletching supplies.\n\nMaking your own armor from hides is a great way to save coin.\n\nThe Sunken Lands are a dangerous place. Full of horrors and ancient ruins.\n\nSome of the local fishermen talk of a hidden pond, teeming with fish, up in the hills.\n\nThe local guard are always looking for brave souls to clear out the bandit camps.\n\nYou can make your own bowstrings by spinning flax on a spinning wheel. There's one in McGregor's barn, and another in Silverhaven.\n\nA good crushing weapon is best for dealing with armored foes, like those golems I've heard about.\n\nThe local artisans can teach you a lot about crafting, for the right price.\n\nThe ruins in the Tanglewood are said to be haunted by spirits of the forest.\n\nNeed gold for jewelry? You'll have to find a gold mine. They're not common around here.\n\nThe best trout are in the clearwater streams, not the murky rivers.\n\nA retired adventurer told me a goblin king's weakness is his love for treasure. A well-placed bribe, perhaps?\n\nWatch out for the giant hornets in the western woods. Their sting is no joke.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "oakhaven",
        x: 250,
        y: 150,
        type: "internal",
    },
    oakhaven_chapel: {
        id: "oakhaven_chapel",
        name: "Oakhaven Chapel",
        description: "A modest wooden chapel. The scent of incense hangs in the air.",
        connections: ["oakhaven_square"],
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
        regionId: "oakhaven",
        x: 275,
        y: 125,
        type: "internal",
    },
    oakhaven_market: {
        id: "oakhaven_market",
        name: "Oakhaven Market",
        description: "A bustling market street lined with various stalls. The general store is just off the main thoroughfare.",
        connections: ["oakhaven_square", "oakhaven_general_store", "oakhaven_festival_entrance"],
        activities: [
            {
                type: "thieving_stall",
                id: "oakhaven_market_bakery_stall",
                name: "Steal from Bakery Stall",
                lootTableId: "thieving_stall_bakery",
            },
            {
                type: "thieving_stall",
                id: "oakhaven_market_fur_stall",
                name: "Steal from Fur Stall",
                lootTableId: "thieving_stall_fur",
            },
        ],
        regionId: "oakhaven",
        x: 300,
        y: 150,
        type: "internal",
    },
    oakhaven_crafting_district: {
        id: "oakhaven_crafting_district",
        name: "Crafting District",
        description: "The sound of work fills the air here. Tanning racks and workbenches line the street, leading to various artisan shops.",
        connections: [
            "oakhaven_square",
            "oakhaven_crafting_supplies",
            "tanner_svens_shop",
            "oakhaven_west_gate",
            "oakhaven_herblore_shop",
            "oakhaven_artisans_quarter",
        ],
        activities: [],
        regionId: "oakhaven",
        x: 200,
        y: 150,
        type: "internal",
    },
    oakhaven_artisans_quarter: {
        id: "oakhaven_artisans_quarter",
        name: "Oakhaven Artisan's Quarter",
        description: "A quieter section of the district where master craftsmen have their workshops. The smell of oiled wood and hemp rope is strong here.",
        connections: [
            "oakhaven_crafting_district",
            "oakhaven_woodworkers_shop",
            "oakhaven_rooftop_access",
        ],
        activities: [
            {
                type: "npc",
                name: "Finn the Rope-maker",
                icon: "/assets/npcChatHeads/finn_the_rope_maker.png",
                startNode: "finn_default",
            },
        ],
        regionId: "oakhaven",
        x: 200,
        y: 225,
        type: "internal",
    },
    oakhaven_tavern_street: {
        id: "oakhaven_tavern_street",
        name: "Tavern Street",
        description: "A quieter residential side street leading to the local tavern.",
        connections: ["oakhaven_square", "the_carved_mug"],
        activities: [
            {
                type: "thieving_pilfer",
                id: "oakhaven_house_1",
                name: "Locked House",
            },
            {
                type: "thieving_pilfer",
                id: "oakhaven_house_2",
                name: "Locked House",
            },
        ],
        regionId: "oakhaven",
        x: 250,
        y: 175,
        type: "internal",
    },
    oakhaven_general_store: {
        id: "oakhaven_general_store",
        name: "Oakhaven General Store",
        description: "A well-stocked store with a variety of goods for the aspiring adventurer.",
        connections: ["oakhaven_market"],
        activities: [
            {
                type: "shop",
                shopId: "oakhaven_general",
            },
        ],
        regionId: "oakhaven",
        x: 350,
        y: 150,
        type: "internal",
    },
    oakhaven_crafting_supplies: {
        id: "oakhaven_crafting_supplies",
        name: "Artisan Supplies",
        description: "A shop selling all manner of tools and materials for crafting.",
        connections: ["oakhaven_crafting_district"],
        activities: [
            {
                type: "shop",
                shopId: "oakhaven_crafting",
            },
        ],
        regionId: "oakhaven",
        x: 175,
        y: 125,
        type: "internal",
    },
    oakhaven_herblore_shop: {
        id: "oakhaven_herblore_shop",
        name: "The Verdant Vial",
        description: "A shop filled with the scent of strange and wonderful herbs. Vials of colorful liquids line the shelves.",
        connections: ["oakhaven_crafting_district"],
        activities: [
            {
                type: "shop",
                shopId: "oakhaven_herblore",
            },
            {
                type: "npc",
                name: "Herbalist Anise",
                icon: "/assets/npcChatHeads/herbalist_anise.png",
                dialogue: {
                    start: {
                        npcName: "Herbalist Anise",
                        npcIcon: "/assets/npcChatHeads/herbalist_anise.png",
                        text: "Welcome to my little shop. If you need anything for potion-making, you've come to the right place.\n\nThe key to a good potion is properly prepared ingredients. A pestle and mortar is a must-have for any aspiring herbalist.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
                questTopics: ["petunia_problems", "scales_of_the_swamp"],
                conditionalGreetings: [
                    {
                        text: "Ah, the adventurer heading into the deep swamp. I have what you need, but it won't be cheap.",
                        check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 1 }] }
                    }
                ]
            },
        ],
        regionId: "oakhaven",
        x: 200,
        y: 125,
        type: "internal",
    },
    tanner_svens_shop: {
        id: "tanner_svens_shop",
        name: "Tanner Sven's",
        description: "The smell of cured hides is strong here. Sven works diligently at his tanning rack.",
        connections: ["oakhaven_crafting_district"],
        activities: [
            {
                type: "npc",
                name: "Tanner Sven",
                icon: "/assets/npcChatHeads/tanner_sven.png",
                startNode: "start",
                dialogue: {
                    start: {
                        npcName: "Tanner Sven",
                        npcIcon: "/assets/npcChatHeads/tanner_sven.png",
                        text: "You bring the hide, I'll make it leather. For a price, of course. Got anything for me?",
                        responses: [
                            {
                                text: "Tan all hides in inventory.",
                                actions: [
                                    {
                                        type: "tan_all_hides",
                                    },
                                ],
                            },
                            {
                                text: "I'll come back later.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        x: 175,
        y: 175,
        type: "internal",
    },
    oakhaven_woodworkers_shop: {
        id: "oakhaven_woodworkers_shop",
        name: "Alaric's Fine Woods",
        description: "The workshop of the master woodworker, Alaric. The air is rich with the scent of sawdust and wood varnish.",
        connections: ["oakhaven_artisans_quarter"],
        activities: [
            {
                type: "npc",
                name: "Alaric the Woodworker",
                icon: "/assets/npcChatHeads/artisan.png",
                startNode: "alaric_default",
            },
        ],
        regionId: "oakhaven",
        x: 175,
        y: 225,
        type: "internal",
    },
    the_carved_mug: {
        id: "the_carved_mug",
        name: "The Carved Mug",
        description: "A cozy tavern filled with the warmth of a large cooking range and the smell of roasting meats.",
        connections: ["oakhaven_tavern_street"],
        activities: [
            {
                type: "quest_board",
            },
            {
                type: "cooking_range",
            },
            {
                type: "npc",
                name: "Barkeep Freya",
                icon: "/assets/npcChatHeads/barkeep_freya.png",
                dialogue: {
                    start: {
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "Welcome to The Carved Mug. We've got the best ale and the softest beds in Oakhaven. What can I get for you?",
                        responses: [
                            {
                                text: "A pint of your finest.",
                                next: "buy_drink_intro",
                            },
                            {
                                text: "I'd like to rent a room.",
                                next: "rent_room_intro",
                            },
                        ],
                    },
                    buy_drink_intro: {
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "An excellent choice! Warms the soul after a long day of crafting, eh? That'll be 3 coins.",
                        responses: [
                            {
                                text: "Here you go.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 3,
                                        },
                                    ],
                                    successNode: "buy_drink_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 3,
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
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "Cheers!",
                        responses: [],
                    },
                    buy_drink_fail: {
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "Sorry, you don't have enough coin for that.",
                        responses: [],
                    },
                    rent_room_intro: {
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "Wise adventurer. A good night's sleep in a proper bed does wonders for your health. A room for the night is 15 coins.",
                        responses: [
                            {
                                text: "I'll take it.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 15,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 15,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                            {
                                text: "I think I'll rough it.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Freya",
                        npcIcon: "/assets/npcChatHeads/barkeep_freya.png",
                        text: "Wonderful. Sleep well!",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Bronn the Retired Adventurer",
                icon: "/assets/npcChatHeads/bronn_the_retired_adventurer.png",
                startNode: "default_dialogue",
                questTopics: ["an_echo_of_battle", "art_of_the_warhammer", "scales_of_the_swamp"],
                conditionalGreetings: [
                    {
                        text: "Headed to the Serpent's Coil? You'll need more than just a sharp blade.",
                        check: {
                            requirements: [
                                { type: "quest", questId: "scales_of_the_swamp", status: "in_progress", stage: 1 }
                            ]
                        }
                    },
                    {
                        text: "Have you come to turn in a bounty?",
                        check: {
                            requirements: [
                                {
                                    type: "items",
                                    items: [
                                        {
                                            itemId: "goblin_champion_scroll",
                                            quantity: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        text: "Thank you again, my friend. It's... quieter now. In my head.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you uncovered any information about the barrow?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 1,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you uncovered any information about the barrow?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 0,
                                },
                            ],
                        },
                    },
                    {
                        text: "The barrow seal is weakening. I knew it. What are you waiting for? Take the key to Valerius!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 2,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you reforged the key yet?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 3,
                                },
                            ],
                        },
                    },
                    {
                        text: "You have the reforged key? Then what are you doing here? Get to the barrow!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 5,
                                },
                            ],
                        },
                    },
                    {
                        text: "The seal is broken? Don't keep it waiting. End this.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 6,
                                },
                            ],
                        },
                    },
                    {
                        text: "You've returned, what news do you have?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 7,
                                },
                            ],
                        },
                    },
                    {
                        text: "Still here? Valerius isn't getting any younger. You'll find him at the smithy in Meadowdale.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "art_of_the_warhammer",
                                    status: "in_progress",
                                    stage: 0,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you forged that warhammer yet? The anvil awaits!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "art_of_the_warhammer",
                                    status: "in_progress",
                                    stage: 1,
                                },
                            ],
                        },
                    },
                    {
                        text: "Let's see that hammer you've made, then. Show it to me.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "art_of_the_warhammer",
                                    status: "in_progress",
                                    stage: 2,
                                },
                            ],
                        },
                    },
                    {
                        text: "(Bronn finishes his mug of ale with a troubled look on his face) Ahhh, hello again adventurer... Nice to see a proper smith around here. How's the hammer holding up?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "art_of_the_warhammer",
                                    status: "completed",
                                },
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "not_started",
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    bronn_take_scroll: {
                        npcName: "Bronn the Retired Adventurer",
                        npcIcon: "/assets/npcChatHeads/bronn_the_retired_adventurer.png",
                        text: "A scroll? Let me see that... Whoa, what an extraordinary find! I found this mace back in my heyday—it's yours if you'll let me take that scroll off your hands.",
                        responses: [
                            {
                                text: "It's a deal.",
                                actions: [
                                    {
                                        type: "take_item",
                                        itemId: "goblin_champion_scroll",
                                        quantity: 1,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "goblin_crusher",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "Maybe another time.",
                            },
                        ],
                    },
                    default_dialogue: {
                        npcName: "Bronn the Retired Adventurer",
                        npcIcon: "/assets/npcChatHeads/bronn_the_retired_adventurer.png",
                        text: "Another pint, barkeep! What's an old soldier to do but drink and remember?",
                        responses: [
                            {
                                text: "About that bounty... I found this scroll held by a goblin champion.",
                                next: "bronn_take_scroll",
                                check: {
                                    requirements: [
                                        {
                                            type: "items",
                                            items: [
                                                {
                                                    itemId: "goblin_champion_scroll",
                                                    quantity: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "oakhaven",
        x: 275,
        y: 175,
        type: "internal",
    },
    oakhaven_bank: {
        id: "oakhaven_bank",
        name: "Bank of Embrune",
        description: "A sturdy, well-guarded building. Your items will be safe here.",
        connections: ["oakhaven_square"],
        activities: [
            {
                type: "npc",
                name: "Banker Astrid",
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
                        npcName: "Banker Astrid",
                        npcIcon: "/assets/npcChatHeads/banker_astrid.png",
                        text: "Bank of Embrune, Oakhaven branch. How may I assist you?",
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
                        npcName: "Banker Astrid",
                        npcIcon: "/assets/npcChatHeads/banker_astrid.png",
                        text: "Certainly. We offer secure storage for all your valuable items. Would you like to view your vault?",
                        responses: [
                            {
                                text: "Yes.",
                                actions: [
                                    {
                                        type: "open_bank",
                                    },
                                ],
                            },
                            {
                                text: "No, thank you.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "oakhaven",
        x: 225,
        y: 175,
        type: "internal",
    },
    oakhaven_rooftop_access: {
        id: "oakhaven_rooftop_access",
        name: "Rooftop Access",
        description: "A stack of lumber and discarded barrels provides a convenient way up to the rooftops of the crafting district.",
        connections: ["oakhaven_artisans_quarter"],
        activities: [
            {
                type: "start_agility_course",
                name: "Start Artisan's Run (Lvl 12)",
                courseId: "oakhaven_artisans_run",
            },
        ],
        regionId: "oakhaven",
        x: 225,
        y: 200,
        type: "internal",
    },
};
