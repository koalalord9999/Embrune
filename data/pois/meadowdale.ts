import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const meadowdalePois: Record<string, POI> = {
    meadowdale_south_gate: {
        id: "meadowdale_south_gate",
        name: "Meadowdale South Gate",
        description: "The southern gates of Meadowdale, opening up to the road south. A single guard keeps a lazy watch.",
        connections: ["south_meadow_road", "south_meadow_street"],
        activities: [
            {
                type: "npc",
                name: "Guard",
                icon: "guard",
                pickpocket: {
                    lootTableId: "pickpocket_guard_table",
                },
                attackableMonsterId: "guard",
                dialogue: {
                    start: {
                        npcName: "Guard",
                        npcIcon: "guard",
                        text: "Just keeping an eye on things. Move along.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "meadowdale",
        type: "internal",
        x: 250,
        y: 500,
        eX: 1000,
        eY: 1000,
    },
    meadowdale_north_gate: {
        id: "meadowdale_north_gate",
        name: "Meadowdale North Gate",
        description: "The northern gates of Meadowdale, leading towards the Whispering Woods.",
        connections: ["whispering_woods", "north_meadow_street"],
        activities: [],
        regionId: "meadowdale",
        type: "internal",
        x: 250,
        y: 0,
        eX: 1000,
        eY: 1000,
    },
    meadowdale_east_gate: {
        id: "meadowdale_east_gate",
        name: "Meadowdale East Gate",
        description: "The eastern gates of Meadowdale, facing the direction of the mines.",
        connections: ["stonebreak_mine", "east_meadow_street"],
        activities: [],
        regionId: "meadowdale",
        type: "internal",
        x: 500,
        y: 250,
        eX: 1000,
        eY: 1000,
    },
    meadowdale_west_gate: {
        id: "meadowdale_west_gate",
        name: "Meadowdale West Gate",
        description: "The western gates of Meadowdale, opening up to the farmlands.",
        connections: ["west_meadow_street", "mcgregors_ranch"],
        activities: [],
        regionId: "meadowdale",
        type: "internal",
        x: 0,
        y: 250,
        eX: 1000,
        eY: 1000,
    },
    south_meadow_street: {
        id: "south_meadow_street",
        name: "South Meadow Street",
        description: "The main southern road inside Meadowdale. The cook's kitchen is just off the road here.",
        connections: [
            "meadowdale_south_gate",
            "meadowdale_square",
            "meadowdale_kitchen",
        ],
        activities: [
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
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
        ],
        regionId: "meadowdale",
        x: 250,
        y: 350,
        type: "internal",
    },
    north_meadow_street: {
        id: "north_meadow_street",
        name: "North Meadow Street",
        description: "The main northern road inside Meadowdale, leading past the library, a small magic shop, and the town hall.",
        connections: [
            "meadowdale_north_gate",
            "meadowdale_square",
            "meadowdale_library",
            "town_hall",
            "meadowdale_magic_shop",
        ],
        activities: [
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
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
        ],
        regionId: "meadowdale",
        x: 250,
        y: 150,
        type: "internal",
    },
    east_meadow_street: {
        id: "east_meadow_street",
        name: "East Meadow Street",
        description: "The eastern road of Meadowdale, leading past the smithy and the local inn. A small alley leads to a rooftop access point.",
        connections: [
            "meadowdale_east_gate",
            "meadowdale_square",
            "meadowdale_smithy",
            "the_rusty_flagon",
            "meadowdale_rooftop_access",
        ],
        activities: [
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
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
        ],
        regionId: "meadowdale",
        x: 350,
        y: 250,
        type: "internal",
    },
    west_meadow_street: {
        id: "west_meadow_street",
        name: "West Meadow Street",
        description: "The western road of Meadowdale. A quiet residential street with a small fishing shop.",
        connections: [
            "meadowdale_west_gate",
            "meadowdale_square",
            "meadowdale_fishing_shop",
        ],
        activities: [
            {
                type: "thieving_pilfer",
                id: "meadowdale_house_1",
                name: "Locked House",
            },
            {
                type: "thieving_pilfer",
                id: "meadowdale_house_2",
                name: "Locked House",
            },
            {
                type: "thieving_pilfer",
                id: "meadowdale_house_3",
                name: "Locked House",
            },
            {
                type: "ground_item",
                id: "west_meadow_bobby_pin",
                itemId: "bobby_pin",
                resourceCount: 1,
                respawnTimer: 300000,
            },
            {
                type: "ground_item",
                id: "west_meadow_empty_jug",
                itemId: "empty_jug",
                resourceCount: 1,
                respawnTimer: 120000,
            },
        ],
        regionId: "meadowdale",
        x: 150,
        y: 250,
        type: "internal",
    },
    meadowdale_square: {
        id: "meadowdale_square",
        name: "Meadowdale Square",
        description: "The bustling heart of town. The central fountain gurgles pleasantly. Roads lead out towards the gates, and a grand building to the west houses the bank.",
        connections: [
            "north_meadow_street",
            "east_meadow_street",
            "south_meadow_street",
            "west_meadow_street",
            "meadowdale_bank",
            "meadowdale_chapel",
        ],
        activities: [
            {
                type: "thieving_stall",
                id: "meadowdale_square_bakery_stall",
                name: "Steal from Bakery Stall",
                lootTableId: "thieving_stall_bakery",
            },
            {
                type: "shop",
                shopId: "general_store",
            },
            {
                type: "water_source",
                name: "Collect Water",
            },
            {
                type: "npc",
                name: "Old Man Fitzwilliam",
                icon: 'person',
                startNode: "fitzwilliam_default",
                questTopics: ["goblin_menace", "petunia_problems"],
                conditionalGreetings: [
                    {
                        text: "*You see Old Man Fitzwilliam mumbling to himself about curses* What do you want now? Can't you see I'm having a rough time?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "petunia_problems",
                                    status: "not_started",
                                },
                                {
                                    type: "quest",
                                    questId: "goblin_menace",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    fitzwilliam_default: {
                        npcName: "Old Man Fitzwilliam",
                        npcIcon: 'person',
                        text: "Hmph. What do you want? Can't you see I'm busy being miserable?",
                        responses: [],
                    },
                },
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
                    lootTableId: "pickpocket_man_woman_table",
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
                    lootTableId: "pickpocket_man_woman_table",
                },
            },
            {
                type: "npc",
                name: "Use Blight Ward Potion",
                icon: "sprout",
                questCondition: {
                    questId: "petunia_problems",
                    stages: [3],
                },
                startNode: "petunia_use_potion",
            },
            {
                type: "ground_item",
                id: "meadowdale_square_coins",
                itemId: "coins",
                resourceCount: 1,
                respawnTimer: 60000,
            },
        ],
        regionId: "meadowdale",
        x: 250,
        y: 250,
        type: "internal",
    },
    meadowdale_chapel: {
        id: "meadowdale_chapel",
        name: "Meadowdale Chapel",
        description: "A small but well-maintained place of worship. It is quiet and peaceful here.",
        connections: ["meadowdale_square"],
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
        regionId: "meadowdale",
        x: 300,
        y: 300,
        type: "internal",
    },
    meadowdale_smithy: {
        id: "meadowdale_smithy",
        name: "Meadowdale Smithy",
        description: "The clang of a hammer on an anvil rings out. The air is hot from the roaring furnace.",
        connections: ["east_meadow_street"],
        activities: [
            {
                type: "furnace",
            },
            {
                type: "anvil",
            },
            {
                type: "npc",
                name: "Valerius the Master Smith",
                icon: 'person',
                startNode: "valerius_default",
                questTopics: [
                    "a_smiths_apprentice",
                    "ancient_blade",
                    "an_echo_of_battle",
                    "art_of_the_warhammer",
                ],
                conditionalGreetings: [
                    {
                        text: "Have you brought the Glimmerhorn Dust for the key?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 4,
                                },
                            ],
                        },
                    },
                    {
                        text: "Hello there apprentice, how's your training been?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "an_echo_of_battle",
                                    status: "in_progress",
                                    stage: 2,
                                },
                                {
                                    type: "items",
                                    items: [
                                        {
                                            itemId: "broken_barrow_key",
                                            quantity: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        text: "Thank you for your help with reforging the key for Bronn. It was a masterwork of old.",
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
                        text: "You should probably return to Bronn, now that you've crafted the hammer.",
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
                        text: "Hello adventurer... you look familiar? Bah! it matters not, how can the forge be of assistance?",
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
                        text: "How's that hammer holding up? A fine piece of work, if I do say so myself.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "art_of_the_warhammer",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                    {
                        text: "Finished with the dagger? Let's have a look at your work.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "a_smiths_apprentice",
                                    status: "in_progress",
                                    stage: 3,
                                },
                                {
                                    type: "items",
                                    items: [
                                        {
                                            itemId: "bronze_dagger",
                                            quantity: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        text: "Ah, you have the ore? Good. Let's begin your first lesson.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "a_smiths_apprentice",
                                    status: "in_progress",
                                    stage: 1,
                                },
                            ],
                        },
                    },
                    {
                        text: "Good to see you again, apprentice. Keep practicing at the anvil.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "a_smiths_apprentice",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                    {
                        text: "Ah, you're back. What do you need?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "ancient_blade",
                                    status: "in_progress",
                                    stage: 0,
                                },
                            ],
                        },
                    },
                    {
                        text: "*Valerius is hammering away as you approach* Welcome to the forge adventurer, I'm a little busy right now... Is it something urgent?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "ancient_blade",
                                    status: "not_started",
                                },
                                {
                                    type: "items",
                                    items: [
                                        {
                                            itemId: "rusty_iron_sword",
                                            quantity: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        text: "That old blade I restored for you... it was a fine piece of history.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "ancient_blade",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    valerius_default: {
                        npcName: "Valerius the Master Smith",
                        npcIcon: 'person',
                        text: "Welcome to the forge. If you need something smithed, you've come to the right place. Just don't waste my time.",
                        responses: [],
                    },
                },
            },
        ],
        regionId: "meadowdale",
        x: 350,
        y: 200,
        type: "internal",
    },
    meadowdale_kitchen: {
        id: "meadowdale_kitchen",
        name: "Cook's Kitchen",
        description: "A cozy kitchen with a large cooking range. The smell of baked bread hangs in the air.",
        connections: ["south_meadow_street"],
        activities: [
            {
                type: "cooking_range",
            },
            {
                type: "npc",
                name: "Master Baker Thomas",
                icon: 'person',
                startNode: "thomas_default",
                questTopics: ["the_bakers_apprentice"],
                conditionalGreetings: [
                    {
                        text: "Ah, it's my star apprentice! I am thoroughly impressed by your technique and heart for the craft. From now on, I see you not just as a student, but as a true fellow baker. The ovens are always open to you.",
                        check: {
                            requirements: [
                                { type: 'quest', questId: 'the_bakers_apprentice', status: 'completed' }
                            ]
                        }
                    }
                ],
                dialogue: {
                    thomas_default: {
                        npcName: "Master Baker Thomas",
                        npcIcon: 'person',
                        text: "The secret to a good loaf is all in the hands, lad. And a bit of patience. Meadowdale never goes hungry as long as I'm at the oven!",
                        responses: [],
                    },
                },
            },
        ],
        regionId: "meadowdale",
        x: 200,
        y: 350,
        type: "internal",
    },
    the_rusty_flagon: {
        id: "the_rusty_flagon",
        name: "The Rusty Flagon Inn",
        description: "The air is thick with the smell of stale ale and sawdust. A few patrons murmur quietly in shadowy corners. A cheerful fire crackles in the hearth.",
        connections: ["east_meadow_street"],
        activities: [
            {
                type: "quest_board",
            },
            {
                type: "ladder",
                name: "Go to Cellar",
                direction: "down",
                toPoiId: "tavern_cellar",
                questCondition: {
                    questId: "kill_rats_meadowdale",
                    stages: [],
                },
            },
            {
                type: "npc",
                name: "Barkeep Grimley",
                icon: 'person',
                dialogue: {
                    start: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "Welcome to The Rusty Flagon. What can I get for you?",
                        responses: [
                            {
                                text: "Here for a drink!",
                                next: "buy_drink_intro",
                            },
                            {
                                text: "Looking for a room.",
                                next: "rent_room_intro",
                            },
                        ],
                    },
                    buy_drink_intro: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "You've got good taste! I import the best beer in the region, all the way from Silverhaven. None of that watered-down rubbish you get elsewhere. Fancy a pint? It's only 2 coins.",
                        responses: [
                            {
                                text: "Yes please.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 2,
                                        },
                                    ],
                                    successNode: "buy_drink_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 2,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "beer",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "No thanks, I'm not much of a drinker.",
                            },
                        ],
                    },
                    buy_drink_success: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "Here you are. Enjoy!",
                        responses: [],
                    },
                    buy_drink_fail: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "Sorry, you don't have enough coins for that.",
                        responses: [],
                    },
                    rent_room_intro: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "A wise choice. A good night's rest can make all the difference. I keep this place nice and tidy, you know. Sometimes I even post odd jobs on the adventurer's board to keep it that way.",
                        responses: [
                            {
                                text: "(Continue)",
                                next: "rent_room_confirm",
                            },
                        ],
                    },
                    rent_room_confirm: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "A room for the night will cost you 10 coins. It'll restore your health and make you feel right as rain. What do you say?",
                        responses: [
                            {
                                text: "Yea, sure. I'll take a room.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 10,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 10,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                            {
                                text: "Nah, I like sleeping on the streets.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Grimley",
                        npcIcon: 'person',
                        text: "Excellent choice. Sweet dreams!",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Tavern Regular",
                icon: "person",
                pickpocket: {
                    lootTableId: "pickpocket_tavern_regular",
                },
                dialogue: {
                    start: {
                        npcName: "Tavern Regular",
                        npcIcon: "person",
                        text: "Welcome to Meadowdale! It's a quiet town, mostly. Except for the goblins.\n\nValerius, over at the smithy, taught me everything I know about metal. Which isn't much, but he's a great teacher.\n\nThe library has some fascinating old books. Librarian Elara knows all the local history.\n\nIf you're heading to the Stonebreak Mine, watch your step. The goblins have set up some crude traps.\n\nRancher McGregor's fields to the west are a great source of wool and hides, if you're into that sort of thing.\n\nThe water from the fountain is surprisingly clean. Perfect for filling up your vials.\n\nI saw a strange spirit in the woods to the north. It seemed... sad.\n\nThe Rusty Flagon is a fine establishment, but the ale is a bit watered down, if you ask me.\n\nClerk Augustus in the Town Hall seems stressed. I think the bandits on the southern road are bad for business.\n\nYou'll need both copper and tin to make bronze. The mine has plenty of both.\n\nOld Man Fitzwilliam is a town treasure. A grumpy, complaining treasure.\n\nThe fishing at the Murky Riverbank is decent. Lots of shrimp and sardines.\n\nA friend of mine tried to explore the depths of the mine and said he saw strange, glowing crystals.\n\nThat ancient clearing in the woods gives me the creeps. The stones just... watch you.\n\nI heard a rumor that the goblin king, Grumlok, has a soft spot for shiny things.\n\nBe careful if you see a goblin with a sack. They throw rocks, and they're surprisingly accurate.\n\nYou can find flax growing in the fields by McGregor's ranch. Good for making bowstrings.\n\nValerius is looking for an apprentice. Might be worth talking to him if you're strong of arm.\n\nThe fish in the local river are pretty basic. For the bigger catches, you'll need to travel further afield.\n\nThe guards at the gates don't see much action, thankfully. It's a peaceful town.\n\nNeed a hammer or a knife? The general store in the square should have what you need.\n\nI once found a rusty old sword near the mine. Wonder if it was worth anything.\n\nThe town was founded on older ruins. You can see some of the old stonework in the library's cellar.\n\nIf you're going to cook, use the range in the kitchen building. Much better than an open fire.\n\nThe wind up on the plateau to the north... they say it carries the whispers of the sky gods.\n\nThat's how the Gust Altar got its name, I'd wager.\n\nThe path to the mountains is a treacherous one. Only for seasoned adventurers.\n\nWatch out for giant spiders in the abandoned farmstead to the south. Nasty things.\n\nA simple bronze dagger is a good first weapon to smith. Doesn't take much metal.\n\nI heard a tale of a binding altar somewhere to the west of Oakhaven, a place of foundational magic.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
            {
                type: "npc",
                name: "Warrior",
                icon: "swordman",
                pickpocket: {
                    lootTableId: "pickpocket_warrior_table",
                },
                attackableMonsterId: "warrior",
                dialogue: {
                    start: {
                        npcName: "Warrior",
                        npcIcon: "swordman",
                        text: "Looking for a fight? You've come to the right place. Or the wrong one, depending on how you look at it.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "ground_item",
                id: "rusty_flagon_burnt_food",
                itemId: "burnt_food",
                resourceCount: 1,
                respawnTimer: 300000,
            },
        ],
        regionId: "meadowdale",
        x: 350,
        y: 300,
        type: "internal",
    },
    tavern_cellar: {
        id: "tavern_cellar",
        name: "Tavern Cellar",
        description: "A damp, musty cellar filled with barrels and crates. It smells of spilt ale and rat droppings.",
        connections: ["the_rusty_flagon"],
        activities: [
            {
                type: "ladder",
                name: "Climb Up",
                direction: "up",
                toPoiId: "the_rusty_flagon",
            },
        ],
        regionId: "meadowdale",
        x: 350,
        y: 320,
        type: "internal",
    },
    meadowdale_library: {
        id: "meadowdale_library",
        name: "Meadowdale Library",
        description: "Rows of dusty tomes line the walls, their spines cracked with age. The only sound is the gentle rustle of turning pages. The air smells of old paper and leather.",
        connections: ["north_meadow_street"],
        activities: [
            {
                type: "npc",
                name: "Librarian Alexia",
                icon: 'person',
                dialogue: {
                    start: {
                        npcName: "Librarian Alexia",
                        npcIcon: 'person',
                        text: "Shh! This is a place of learning, not a tavern.\n\nFeel free to browse, but do it quietly. The knowledge of ages rests on these shelves.\n\nThe town was founded on the ruins of an older settlement from before the Age of Kings. No one knows who built the original foundations.\n\nThe road south to Oakhaven used to be a major trade route. Now, with the bandits, it's a shadow of its former self.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
            {
                type: "npc",
                name: "Wizard Elmsworth",
                icon: "wizard-face",
                startNode: "elmsworth_default",
                questTopics: ["magical_runestone_discovery"],
                conditionalGreetings: [
                    {
                        text: "*whisper* Oh! Simply magnificent, the power being called by this spell is simply serendipitous... If only someone was here to help...*whisper* Oh hello there adventurer, might you be interested in helping me with something? It's got me all giddy and excited, but I cannot do it by myself.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "not_started",
                                },
                            ],
                        },
                    },
                    {
                        text: "Still here? Did my teleport fail? Well, anyway, are you ready to try again?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 0,
                                },
                            ],
                        },
                    },
                    {
                        text: "You need to speak with my projection at the teleport location, please return there at once!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 1,
                                },
                            ],
                        },
                    },
                    {
                        text: "Come now, you still have to gather those samples, I know its busy work, but its a very important step of finding out what is causing these readings!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 2,
                                },
                            ],
                        },
                    },
                    {
                        text: "You've returned! Have you brought the samples with you?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 3,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you found the source of the pull? You can hold it up in front of you with the \"Divine\" feature.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 4,
                                },
                            ],
                        },
                    },
                    {
                        text: "You've returned! I assume you found the source of the pull? Tell me, what was it?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 5,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you combined my trinket with those rock chunks yet? Time spent dillydallying could be spent being productive, get a move on!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 6,
                                },
                            ],
                        },
                    },
                    {
                        text: "I felt a hum of magic come from the north, did you combine them?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "magical_runestone_discovery",
                                    status: "in_progress",
                                    stage: 7,
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        regionId: "meadowdale",
        x: 200,
        y: 150,
        type: "internal",
    },
    town_hall: {
        id: "town_hall",
        name: "Town Hall",
        description: "A sturdy, official-looking building. Desks are piled high with scrolls and ledgers. A stern-looking clerk eyes you from behind a tall counter.",
        connections: ["north_meadow_street"],
        activities: [
            {
                type: "npc",
                name: "Clerk Augustus",
                icon: 'person',
                startNode: "augustus_default",
                questTopics: ["bandit_toll"],
                dialogue: {
                    augustus_default: {
                        npcName: "Clerk Augustus",
                        npcIcon: 'person',
                        text: "Welcome to the Meadowdale Town Hall. State your business.",
                        responses: [],
                    },
                },
            },
            {
                type: "ground_item",
                id: "town_hall_cloth",
                itemId: "tattered_cloth",
                resourceCount: 1,
                respawnTimer: 300000,
            },
        ],
        regionId: "meadowdale",
        x: 300,
        y: 150,
        type: "internal",
    },
    meadowdale_bank: {
        id: "meadowdale_bank",
        name: "Bank of Embrune",
        description: "A grand building with polished counters and secure vaults, accessed from the town square. A stern-looking banker watches over the main hall.",
        connections: ["meadowdale_square"],
        activities: [
            {
                type: "npc",
                name: "Banker Theron",
                icon: 'person',
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
                        npcName: "Banker Theron",
                        npcIcon: 'person',
                        text: "Welcome to the Bank of Embrune. Your items are safe with us.",
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
                        npcName: "Banker Theron",
                        npcIcon: 'person',
                        text: "Of course. Here you can deposit or withdraw items from your personal vault. Would you like to access it now?",
                        responses: [
                            {
                                text: "Yes, please.",
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
        regionId: "meadowdale",
        x: 200,
        y: 200,
        type: "internal",
    },
    meadowdale_magic_shop: {
        id: "meadowdale_magic_shop",
        name: "Elmsworth's Embryo Magicks",
        description: "A small shop tucked away near the library, smelling faintly of old parchment and ozone. It offers basic supplies for aspiring mages.",
        connections: ["north_meadow_street"],
        activities: [
            {
                type: "shop",
                shopId: "meadowdale_magic",
            },
            {
                type: "ground_item",
                id: "magic_shop_gust",
                itemId: "gust_rune",
                resourceCount: 5,
                respawnTimer: 60000,
            },
            {
                type: "ground_item",
                id: "magic_shop_binding",
                itemId: "binding_rune",
                resourceCount: 5,
                respawnTimer: 60000,
            },
        ],
        regionId: "meadowdale",
        x: 203,
        y: 106,
        type: "internal",
    },
    meadowdale_fishing_shop: {
        id: "meadowdale_fishing_shop",
        name: "Angler's Repose",
        description: "A quaint fishing shop with a fishing sign. It smells of worms, and other fishing supplies.",
        connections: ["west_meadow_street"],
        activities: [
            {
                type: "shop",
                shopId: "meadowdale_fishing",
            },
        ],
        regionId: "meadowdale",
        x: 150,
        y: 275,
        type: "internal",
    },
};
