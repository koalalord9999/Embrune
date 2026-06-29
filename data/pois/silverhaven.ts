import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const silverhavenPois: Record<string, POI> = {
    silverhaven_gates: {
        id: "silverhaven_gates",
        name: "Silverhaven Gates",
        description: "The magnificent main gates of the capital city, Silverhaven. The walls are high and well-guarded.",
        connections: ["silverhaven_outskirts", "silverhaven_square"],
        activities: [],
        regionId: "silverhaven",
        type: "internal",
        x: 675,
        y: 1825,
        eX: 675,
        eY: 1825,
    },
    silverhaven_square: {
        id: "silverhaven_square",
        name: "Silverhaven Square",
        description: "The bustling heart of the capital. A grand fountain depicting a silver dragon dominates the square. Paths lead to the city's various districts.",
        connections: [
            "silverhaven_gates",
            "silverhaven_trade_district",
            "silverhaven_artisans_quarter",
            "silverhaven_docks",
            "silverhaven_residential_district",
            "silverhaven_castle_approach",
            "silverhaven_temple",
        ],
        activities: [
            {
                type: "npc",
                name: "Town Crier",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_crier_table",
                },
                dialogue: {
                    start: {
                        npcName: "Town Crier",
                        npcIcon: 'person',
                        text: "Hear ye, hear ye! All bounties must be registered with Slayer Master Kaelen at the Spire!\n\nHear ye, hear ye! Iron prices are up, due to the troubles in the south!\n\nHear ye, hear ye! The ferry to the Isle of Whispers departs daily from the docks! Passage is at your own risk!",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
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
                    lootTableId: "pickpocket_silverhaven_citizen",
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
                    lootTableId: "pickpocket_silverhaven_citizen",
                },
            },
            {
                type: "npc",
                name: "Citizen",
                icon: "person",
                pickpocket: {
                    lootTableId: "pickpocket_silverhaven_citizen",
                },
                dialogue: {
                    start: {
                        npcName: "Citizen",
                        npcIcon: "person",
                        text: "Welcome to Silverhaven, the heart of the kingdom!\n\nIf you want to hunt the most dangerous beasts, you must speak with Kaelen, the Slayer Master, at the Spire.\n\nThe Grand Bank here is the most secure place in the world to store your valuables.\n\nThe Gilded Hammer Armory sells the finest plate armor, but it'll cost you a mountain of gold.\n\nThe ferry to the Isle of Whispers leaves from the docks. A one-way trip, for some.\n\nI saw a strange, lighter-than-air ship moored at the top of the Slayer's Spire. Wonder where it goes.\n\nThe trade district is the best place to sell your goods. Merchants from all over the world come here.\n\nThe city guard is always on alert. The threats from the Salt Flats and the Isle are very real.\n\nHistorian Pallas knows more about the old kingdom than any book. His office is in the trade district.\n\nThey say the Sunken Labyrinth on the Isle was a temple to a forgotten god of the deep.\n\nThe fish market at the docks has the freshest catches from the Great Sea.\n\nThe artisans in their quarter can craft almost anything, provided you have the right materials.\n\nThe Royal Castle looms over the city. I wonder what the King is like.\n\nThe Salt Flats are a desolate wasteland, but I hear they're rich in strange minerals.\n\nOnly slayers of high renown are permitted to use the blimp service. It's a fast way to travel to dangerous lands.\n\nBe careful in the residential district. Some of the nobles are... particular.\n\nI heard a merchant complaining his shipment from Oakhaven was seized by bandits on the King's Road.\n\nThe smiths here can work with the rarest metals, like Adamantite and whatever that 'runic' stuff is.\n\nThe air smells of salt and industry here. A far cry from the forests and fields.\n\nYou want to make a name for yourself? Slaying a rare beast is the quickest way to do it.\n\nThe whispers from the Isle... some say they can drive a man mad.\n\nThe Crystal Scuttlers in the Salt Flats have shells harder than steel.\n\nThe ancient sentinels in the Labyrinth are said to be indestructible.\n\nThere's an old woman in the residential district who lost a precious heirloom. She's been heartbroken for weeks.\n\nThe Town Crier always has the latest news and bounties. It pays to listen to him.\n\nIf you're looking for high-level runes, the monsters on the Isle of Whispers are your best bet.\n\nThe alchemists here are always buying rare herbs and monster parts.\n\nDon't wander into the sewers. They say something... ancient... lives down there.\n\nThe view from the top of the Slayer's Spire is breathtaking.\n\nSilverhaven is a city of opportunity, but also of great danger. Tread carefully.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "silverhaven",
        x: 625,
        y: 1875,
        type: "internal",
    },
    silverhaven_temple: {
        id: "silverhaven_temple",
        name: "Silverhaven Grand Temple",
        description: "A magnificent temple of white marble and silver. The air resonates with a holy power.",
        connections: ["silverhaven_square"],
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
        regionId: "silverhaven",
        x: 650,
        y: 1900,
        type: "internal",
    },
    silverhaven_trade_district: {
        id: "silverhaven_trade_district",
        name: "Trade District",
        description: "A wide avenue lined with opulent shops and the imposing structure of the Grand Bank of Embrune.",
        connections: [
            "silverhaven_square",
            "silverhaven_bank",
            "silverhaven_general_store",
        ],
        activities: [
            {
                type: "thieving_stall",
                id: "silverhaven_trade_district_gem_stall",
                name: "Steal from Gem Stall",
                lootTableId: "thieving_stall_gem",
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
                    lootTableId: "pickpocket_silverhaven_citizen",
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
                    lootTableId: "pickpocket_silverhaven_citizen",
                },
            },
            {
                type: "npc",
                name: "Merchant Theron",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_merchant_table",
                },
                startNode: "theron_default",
                questTopics: ["missing_shipment"],
            },
            {
                type: "npc",
                name: "Historian Pallas",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_adventurer_table",
                },
                dialogue: {
                    start: {
                        npcName: "Historian Pallas",
                        npcIcon: 'person',
                        text: "Ah, the King's Road. A marvel of engineering from the old kingdom. Paved with stones from the Gale-Swept Peaks, they say.\n\nThe Sunken Labyrinth on the Isle of Whispers? It predates the kingdom, perhaps even humanity. It was a temple to a forgotten god of the deep. Some say its builders never left.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
            {
                type: "npc",
                name: "Guard",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_guard_table",
                },
                attackableMonsterId: "guard",
                dialogue: {
                    start: {
                        npcName: "Guard",
                        npcIcon: 'person',
                        text: "Welcome to Silverhaven, the heart of the kingdom!\n\nIf you want to hunt the most dangerous beasts, you must speak with Kaelen, the Slayer Master, at the Spire.\n\nThe Grand Bank here is the most secure place in the world to store your valuables.\n\nThe Gilded Hammer Armory sells the finest plate armor, but it'll cost you a mountain of gold.\n\nThe ferry to the Isle of Whispers leaves from the docks. A one-way trip, for some.\n\nI saw a strange, lighter-than-air ship moored at the top of the Slayer's Spire. Wonder where it goes.\n\nThe trade district is the best place to sell your goods. Merchants from all over the world come here.\n\nThe city guard is always on alert. The threats from the Salt Flats and the Isle are very real.\n\nHistorian Pallas knows more about the old kingdom than any book. His office is in the trade district.\n\nThey say the Sunken Labyrinth on the Isle was a temple to a forgotten god of the deep.\n\nThe fish market at the docks has the freshest catches from the Great Sea.\n\nThe artisans in their quarter can craft almost anything, provided you have the right materials.\n\nThe Royal Castle looms over the city. I wonder what the King is like.\n\nThe Salt Flats are a desolate wasteland, but I hear they're rich in strange minerals.\n\nOnly slayers of high renown are permitted to use the blimp service. It's a fast way to travel to dangerous lands.\n\nBe careful in the residential district. Some of the nobles are... particular.\n\nI heard a merchant complaining his shipment from Oakhaven was seized by bandits on the King's Road.\n\nThe smiths here can work with the rarest metals, like Adamantite and whatever that 'runic' stuff is.\n\nThe air smells of salt and industry here. A far cry from the forests and fields.\n\nYou want to make a name for yourself? Slaying a rare beast is the quickest way to do it.\n\nThe whispers from the Isle... some say they can drive a man mad.\n\nThe Crystal Scuttlers in the Salt Flats have shells harder than steel.\n\nThe ancient sentinels in the Labyrinth are said to be indestructible.\n\nThere's an old woman in the residential district who lost a precious heirloom. She's been heartbroken for weeks.\n\nThe Town Crier always has the latest news and bounties. It pays to listen to him.\n\nIf you're looking for high-level runes, the monsters on the Isle of Whispers are your best bet.\n\nThe alchemists here are always buying rare herbs and monster parts.\n\nDon't wander into the sewers. They say something... ancient... lives down there.\n\nThe view from the top of the Slayer's Spire is breathtaking.\n\nSilverhaven is a city of opportunity, but also of great danger. Tread carefully.",
                        responses: [],
                    },
                },
                startNode: "start",
                dialogueType: "random",
            },
        ],
        regionId: "silverhaven",
        x: 675,
        y: 1875,
        type: "internal",
    },
    silverhaven_general_store: {
        id: "silverhaven_general_store",
        name: "Silverhaven General Store",
        description: "A well-stocked store with a variety of goods for the aspiring adventurer.",
        connections: ["silverhaven_trade_district"],
        activities: [
            {
                type: "shop",
                shopId: "silverhaven_general",
            },
        ],
        regionId: "silverhaven",
        x: 700,
        y: 1875,
        type: "internal",
    },
    silverhaven_bank: {
        id: "silverhaven_bank",
        name: "Grand Bank of Embrune",
        description: "The central bank of the region. Your gold is safest here.",
        connections: ["silverhaven_trade_district"],
        activities: [
            {
                type: "npc",
                name: "Banker Cassian",
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
                        npcName: "Banker Cassian",
                        npcIcon: 'person',
                        text: "Welcome to the Grand Bank of Embrune. How can we serve your financial needs today?",
                        responses: [
                            {
                                text: "I'd like to use my bank vault.",
                                next: "access_bank",
                            },
                            {
                                text: "Just looking around, thank you.",
                            },
                        ],
                    },
                    access_bank: {
                        npcName: "Banker Cassian",
                        npcIcon: 'person',
                        text: "Of course, your vault is ready for you. Shall I open it?",
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
                                text: "No, that's all for now.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "thieving_lockpick",
                id: "sh_bank_chest_1",
                targetName: "Vault Box",
                lootTableId: "thieving_dungeon_chest_elite",
            },
        ],
        regionId: "silverhaven",
        x: 675,
        y: 1850,
        type: "internal",
    },
    silverhaven_artisans_quarter: {
        id: "silverhaven_artisans_quarter",
        name: "Artisan's Quarter",
        description: "The sounds of hammers and saws fill the air here. Master craftsmen offer their services and wares here.",
        connections: [
            "silverhaven_square",
            "silverhaven_smithy",
            "silverhaven_arcane_wares",
        ],
        activities: [
            {
                type: "thieving_stall",
                id: "silverhaven_artisans_quarter_weapon_stall",
                name: "Steal from Weapon Stall",
                lootTableId: "thieving_stall_weapon",
            },
            {
                type: "shop",
                shopId: "silverhaven_crafting",
            },
            {
                type: "anvil",
            },
            {
                type: "spinning_wheel",
            },
            {
                type: "npc",
                name: "Artisan",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_yeoman_table",
                },
                attackableMonsterId: "yeoman",
                dialogue: {
                    start: {
                        npcName: "Artisan",
                        npcIcon: 'person',
                        text: "Strange noises echo down from the peaks on a clear night... like a hammer on an anvil, but with a clearer ring than any metal I know.\n\nSome old prospectors talk of a recluse up in the mountains, a smith who shuns cities. Probably just a story to scare off claim-jumpers.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "silverhaven",
        x: 575,
        y: 1800,
        type: "internal",
    },
    silverhaven_arcane_wares: {
        id: "silverhaven_arcane_wares",
        name: "Silverhaven Arcane Wares",
        description: "A shop filled with the scent of old parchment and strange herbs. The air crackles with magical energy.",
        connections: ["silverhaven_artisans_quarter"],
        activities: [
            {
                type: "thieving_stall",
                id: "silverhaven_arcane_wares_herb_stall",
                name: "Steal from Herb Stall",
                lootTableId: "thieving_stall_herb",
            },
            {
                type: "thieving_stall",
                id: "silverhaven_arcane_wares_potion_stall",
                name: "Steal from Potion Stall",
                lootTableId: "thieving_stall_potion",
            },
            {
                type: "shop",
                shopId: "silverhaven_magic_shop",
            },
            {
                type: "bookbinding_workbench",
            },
            {
                type: "npc",
                name: "Archmage Theron",
                icon: "wizard-face",
                startNode: "theron_default",
                questTopics: ["the_arcane_awakening"],
                conditionalGreetings: [
                    {
                        text: "Hmm... the patterns are frayed... the resonance is... unstable... *Theron looks up, startled.* Oh! Apologies, I was lost in thought. A fine day for trade, is it not? Though... I sense you have an affinity for the arcane yourself.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "not_started",
                                },
                                {
                                    type: "skill",
                                    skill: SkillName.Magic,
                                    level: 40,
                                },
                                {
                                    type: "quest",
                                    questId: "capitals_call",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                    {
                        text: "You've returned! I can feel it... the Weave is calm. Tell me, did you succeed?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 9,
                                },
                            ],
                        },
                    },
                    {
                        text: "The Cascade is reaching its peak! You must be at the spire's apex. Do not fail!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 8,
                                },
                            ],
                        },
                    },
                    {
                        text: "How goes the investigation on the Isles? The Magus Spire holds the key to this disturbance.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 7,
                                },
                            ],
                        },
                    },
                    {
                        text: "You have the dampener? The Skyship Captain at the docks is waiting for it. Every moment counts!",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 6,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you returned to Durin with the components for the dampener? He awaits them at the Dwarven Outpost.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 5,
                                },
                            ],
                        },
                    },
                    {
                        text: "The components for the dampener won't gather themselves. Your task is out in the world, not here in my shop.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 4,
                                },
                            ],
                        },
                    },
                    {
                        text: "You should be on your way to the Dwarven Outpost to speak with the smith, Durin. He is our only hope for reaching the isles.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 3,
                                },
                            ],
                        },
                    },
                    {
                        text: "Why are you back here? I told you to speak with the Skyship Captain at the Silverhaven Docks.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 2,
                                },
                            ],
                        },
                    },
                    {
                        text: "Have you taken the readings from the three altars yet? Time is of the essence.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 0,
                                },
                            ],
                        },
                    },
                    {
                        text: "Thank you again for your help, hero. The Arcane Weave is stable.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    theron_default: {
                        npcName: "Archmage Theron",
                        npcIcon: "wizard-face",
                        text: "Hmm... The weave of magic is a delicate thing. One must always be vigilant.",
                        responses: [],
                    },
                },
            },
            {
                type: "thieving_lockpick",
                id: "sh_arcane_chest_1",
                targetName: "Runic Cabinet",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        regionId: "silverhaven",
        x: 575,
        y: 1825,
        type: "internal",
    },
    silverhaven_smithy: {
        id: "silverhaven_smithy",
        name: "The Gilded Hammer",
        description: "The finest smithy in the land. The heat from the grand furnace is immense.",
        connections: ["silverhaven_artisans_quarter"],
        activities: [
            {
                type: "furnace",
            },
            {
                type: "shop",
                shopId: "gilded_hammer_armory",
            },
            {
                type: "npc",
                name: "Master Smith Gideon",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_adventurer_table",
                },
                dialogue: {
                    start: {
                        npcName: "Master Smith Gideon",
                        npcIcon: 'person',
                        text: "This city has the finest forges, but some say the greatest smith of our age isn't in a city at all.\n\nI once heard a tale of an old master named Borin Stonehand who retired to the Gale-Swept Peaks. They say he perfected the art of the warhammer, forging weapons that could shatter stone like glass.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "thieving_lockpick",
                id: "sh_smithy_chest_1",
                targetName: "Smith's Chest",
                lootTableId: "thieving_dungeon_chest_high",
            },
        ],
        regionId: "silverhaven",
        x: 550,
        y: 1800,
        type: "internal",
    },
    silverhaven_docks: {
        id: "silverhaven_docks",
        name: "Silverhaven Docks",
        description: "The smell of salt and fish hangs in the air. Ships from distant lands are moored at the long wooden piers.",
        connections: ["silverhaven_square", "silverhaven_fish_market"],
        activities: [
            {
                type: "thieving_stall",
                id: "silverhaven_docks_fish_stall",
                name: "Steal from Fish Stall",
                lootTableId: "thieving_stall_fish",
            },
            {
                type: "npc",
                name: "Ferryman Silas",
                icon: 'person',
                dialogue: {
                    start: {
                        npcName: "Ferryman Silas",
                        npcIcon: 'person',
                        text: "Ready to leave the isle? Or perhaps venture somewhere new?",
                        responses: [
                            {
                                text: "Take the ferry to the Isle of Whispers. (10 coins)",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 10,
                                        },
                                    ],
                                    successNode: "travel_whispers_success",
                                    failureNode: "travel_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 10,
                                    },
                                    {
                                        type: "teleport",
                                        poiId: "port_wreckage_docks",
                                    },
                                ],
                            },
                            {
                                text: "Nowhere for now, thanks.",
                            },
                        ],
                    },
                    travel_whispers_success: {
                        npcName: "Ferryman Silas",
                        npcIcon: 'person',
                        text: "All aboard for the Isle of Whispers! Don't say I didn't warn ya...",
                        responses: [],
                    },
                    travel_fail: {
                        npcName: "Ferryman Silas",
                        npcIcon: 'person',
                        text: "Sorry, friend. Passage ain't free. Come back when you have the coin.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Skyship Captain",
                icon: 'person',
                startNode: "captain_default",
                questTopics: ["the_arcane_awakening"],
                conditionalGreetings: [
                    {
                        text: "Back from the Isles? The magical storms are still raging. Need passage back?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 8,
                                },
                            ],
                        },
                    },
                    {
                        text: "Back from the Isles? The magical storms are still raging. Need passage back?",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 7,
                                },
                            ],
                        },
                    },
                    {
                        text: "Back from the mountains? I hope you have good news. The turbulence is getting worse.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 6,
                                },
                            ],
                        },
                    },
                    {
                        text: "State your business. The skies are rough today, so make it quick.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "in_progress",
                                    stage: 2,
                                },
                            ],
                        },
                    },
                    {
                        text: "The hero of the hour! The skies have been calm and clear ever since your venture. If you ever need a ride back to the isles, it's on the house.",
                        check: {
                            requirements: [
                                {
                                    type: "quest",
                                    questId: "the_arcane_awakening",
                                    status: "completed",
                                },
                            ],
                        },
                    },
                ],
                dialogue: {
                    captain_default: {
                        npcName: "Skyship Captain",
                        npcIcon: 'person',
                        text: "The skies call, but they're a fickle mistress. Where are you looking to go?",
                        responses: [],
                    },
                },
            },
            {
                type: "ground_item",
                id: "silverhaven_docks_bait",
                itemId: "fishing_bait",
                resourceCount: 3,
                respawnTimer: 60000,
            },
        ],
        regionId: "silverhaven",
        x: 575,
        y: 1925,
        type: "internal",
    },
    silverhaven_fish_market: {
        id: "silverhaven_fish_market",
        name: "Fish Market",
        description: "Fishermen hawk their latest catches. The ground is slick with seawater.",
        connections: ["silverhaven_docks"],
        activities: [
            {
                type: "shop",
                shopId: "silverhaven_fishing",
            },
            {
                type: "ground_item",
                id: "silverhaven_market_kelp",
                itemId: "redwater_kelp",
                resourceCount: 1,
                respawnTimer: 180000,
            },
        ],
        regionId: "silverhaven",
        x: 550,
        y: 1900,
        type: "internal",
    },
    silverhaven_residential_district: {
        id: "silverhaven_residential_district",
        name: "Residential District",
        description: "A quieter area with well-kept houses. Citizens go about their daily lives.",
        connections: ["silverhaven_square", "the_gilded_goblet"],
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
                    lootTableId: "pickpocket_silverhaven_citizen",
                },
            },
            {
                type: "npc",
                name: "Elfaria",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_knight_table",
                },
                attackableMonsterId: "knight",
                startNode: "elfaria_default_heirloom",
                questTopics: ["lost_heirloom"],
            },
            {
                type: "thieving_pilfer",
                id: "silverhaven_house_1",
                name: "Locked Manor",
            },
            {
                type: "thieving_pilfer",
                id: "silverhaven_house_2",
                name: "Locked Townhouse",
            },
            {
                type: "thieving_pilfer",
                id: "silverhaven_house_3",
                name: "Locked Villa",
            },
            {
                type: "thieving_pilfer",
                id: "silverhaven_house_4",
                name: "Locked Estate",
            },
        ],
        regionId: "silverhaven",
        x: 625,
        y: 1825,
        type: "internal",
    },
    the_gilded_goblet: {
        id: "the_gilded_goblet",
        name: "The Gilded Goblet",
        description: "An upscale tavern popular with wealthy merchants and off-duty guards. The ale is expensive, but potent.",
        connections: ["silverhaven_residential_district"],
        activities: [
            {
                type: "quest_board",
            },
            {
                type: "cooking_range",
            },
            {
                type: "npc",
                name: "Barkeep Sterling",
                icon: 'person',
                dialogue: {
                    start: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "Welcome to The Gilded Goblet. We serve the finest spirits in the capital. What's your pleasure?",
                        responses: [
                            {
                                text: "A pint of your best.",
                                next: "buy_drink_intro",
                            },
                            {
                                text: "I'd like to rent a room.",
                                next: "rent_room_intro",
                            },
                        ],
                    },
                    buy_drink_intro: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "An excellent choice. This is Dragon's Breath Stout, imported from the Dwarven Outpost. Smooth, with a fiery finish. 10 coins.",
                        responses: [
                            {
                                text: "Here you go.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 10,
                                        },
                                    ],
                                    successNode: "buy_drink_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 10,
                                    },
                                    {
                                        type: "give_item",
                                        itemId: "beer",
                                        quantity: 1,
                                    },
                                ],
                            },
                            {
                                text: "A bit rich for my blood.",
                            },
                        ],
                    },
                    buy_drink_success: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "Enjoy. And try not to breathe fire on the drapes.",
                        responses: [],
                    },
                    buy_drink_fail: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "Perhaps a water, then? It's free.",
                        responses: [],
                    },
                    rent_room_intro: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "We have the finest rooms in the city. Feather beds, clean sheets... a world away from the straw pallets in the countryside. A night's rest can cost you 50 coins.",
                        responses: [
                            {
                                text: "I'll take it.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 50,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_drink_fail",
                                },
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 50,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                            {
                                text: "I think I'll find somewhere cheaper.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Sterling",
                        npcIcon: 'person',
                        text: "Excellent. The room at the top of the stairs is yours. Sleep well.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Retired Royal Guard",
                icon: 'person',
                pickpocket: {
                    lootTableId: "pickpocket_knight_table",
                },
                attackableMonsterId: "knight",
                dialogue: {
                    start: {
                        npcName: "Retired Royal Guard",
                        npcIcon: 'person',
                        text: "This city isn't as safe as it looks. The walls keep out the monsters, but the real threats are often inside. Keep your wits about you.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Merchant",
                icon: 'person',
                dialogue: {
                    start: {
                        npcName: "Merchant",
                        npcIcon: 'person',
                        text: "Welcome to Silverhaven, the heart of the kingdom!\n\nIf you want to hunt the most dangerous beasts, you must speak with Kaelen, the Slayer Master, at the Spire.\n\nThe Grand Bank here is the most secure place in the world to store your valuables.\n\nThe Gilded Hammer Armory sells the finest plate armor, but it'll cost you a mountain of gold.\n\nThe ferry to the Isle of Whispers leaves from the docks. A one-way trip, for some.\n\nI saw a strange, lighter-than-air ship moored at the top of the Slayer's Spire. Wonder where it goes.\n\nThe trade district is the best place to sell your goods. Merchants from all over the world come here.\n\nThe city guard is always on alert. The threats from the Salt Flats and the Isle are very real.\n\nHistorian Pallas knows more about the old kingdom than any book. His office is in the trade district.\n\nThey say the Sunken Labyrinth on the Isle was a temple to a forgotten god of the deep.\n\nThe fish market at the docks has the freshest catches from the Great Sea.\n\nThe artisans in their quarter can craft almost anything, provided you have the right materials.\n\nThe Royal Castle looms over the city. I wonder what the King is like.\n\nThe Salt Flats are a desolate wasteland, but I hear they're rich in strange minerals.\n\nOnly slayers of high renown are permitted to use the blimp service. It's a fast way to travel to dangerous lands.\n\nBe careful in the residential district. Some of the nobles are... particular.\n\nI heard a merchant complaining his shipment from Oakhaven was seized by bandits on the King's Road.\n\nThe smiths here can work with the rarest metals, like Adamantite and whatever that 'runic' stuff is.\n\nThe air smells of salt and industry here. A far cry from the forests and fields.\n\nYou want to make a name for yourself? Slaying a rare beast is the quickest way to do it.\n\nThe whispers from the Isle... some say they can drive a man mad.\n\nThe Crystal Scuttlers in the Salt Flats have shells harder than steel.\n\nThe ancient sentinels in the Labyrinth are said to be indestructible.\n\nThere's an old woman in the residential district who lost a precious heirloom. She's been heartbroken for weeks.\n\nThe Town Crier always has the latest news and bounties. It pays to listen to him.\n\nIf you're looking for high-level runes, the monsters on the Isle of Whispers are your best bet.\n\nThe alchemists here are always buying rare herbs and monster parts.\n\nDon't wander into the sewers. They say something... ancient... lives down there.\n\nThe view from the top of the Slayer's Spire is breathtaking.\n\nSilverhaven is a city of opportunity, but also of great danger. Tread carefully.",
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
        regionId: "silverhaven",
        x: 625,
        y: 1800,
        type: "internal",
    },
    silverhaven_castle_approach: {
        id: "silverhaven_castle_approach",
        name: "Castle Approach",
        description: "A grand, tree-lined avenue leading north towards the Royal Castle. A tall, slender tower stands to the east.",
        connections: [
            "silverhaven_square",
            "silverhaven_slayers_spire",
            "silverhaven_castle_grounds",
            "silverhaven_rooftop_access",
        ],
        activities: [],
        regionId: "silverhaven",
        x: 525,
        y: 1875,
        type: "internal",
    },
    silverhaven_slayers_spire: {
        id: "silverhaven_slayers_spire",
        name: "Slayer's Spire",
        description: "A tall tower dedicated to the elite monster hunters of the realm. At its peak, a strange, lighter-than-air vessel is moored.",
        connections: ["silverhaven_castle_approach"],
        activities: [
            {
                type: "slayer_master",
                name: "Kaelen",
                icon: 'person',
                masterId: "kaelen",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Slayer Gear",
                        shopId: "respite_slayer_gear",
                    },
                ],
                dialogue: {
                    start: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Hail, adventurer! The Spire stands as a testament to those who hunt the darkness. Are you here to join our ranks, or do you have business in the shop?",
                        responses: [
                            {
                                text: "I'm looking for a Slayer task.",
                                next: "check_task_status",
                            },
                            {
                                text: "I'd like to see the Slayer rewards.",
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
                                text: "Just passing through.",
                            },
                        ],
                    },
                    reset_task_intro: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "A reset? It is a costly endeavor, adventurer. Reorienting the Spire's resources for a new hunt will require a payment of 20 Slayer Credits.",
                        responses: [
                            {
                                text: "I have the credits. Please reset my task.",
                                next: "reset_task_check",
                            },
                            {
                                text: "Never mind.",
                            },
                        ],
                    },
                    reset_task_check: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Let me check our records...",
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
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Are you absolutely certain? This will completely clear your current assignment. You will be free to seek a new hunt from whichever master you choose.",
                        responses: [
                            {
                                text: "Yes, reset it.",
                                actions: [
                                    {
                                        type: "slayer_reset_task",
                                        masterId: "kaelen",
                                    },
                                ],
                            },
                            {
                                text: "No, I'll stick with it.",
                            },
                        ],
                    },
                    reset_task_failed: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "The Spire doesn't work on charity, friend. Realigning our trackers is expensive business. Come back when you've actually earned the 20 credits required.",
                        responses: [
                            {
                                text: "My apologies.",
                            },
                        ],
                    },
                    check_task_status: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Let me see...",
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
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "I've got just the thing for someone of your standing. Ready for your assignment?",
                        responses: [
                            {
                                text: "Yes, assign me a task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "kaelen",
                                    },
                                ],
                            },
                            {
                                text: "Maybe later.",
                            },
                        ],
                    },
                    has_task_check: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Wait...",
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
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Excellent work! You've cleared your previous bounty. Here are your credits.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "slayer_complete_task",
                                        masterId: "kaelen",
                                    },
                                ],
                                next: "kaelen_new_task_prompt",
                            },
                        ],
                    },
                    kaelen_new_task_prompt: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Ready for another?",
                        responses: [
                            {
                                text: "Yes, give me a new task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "kaelen",
                                    },
                                ],
                            },
                            {
                                text: "Not right now.",
                            },
                        ],
                    },
                    has_active_task: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "You're already on a hunt, friend.",
                        responses: [
                            {
                                text: "(Continue)",
                                check: {
                                    requirements: [
                                        {
                                            type: "slayer_task",
                                            status: "active",
                                            masterId: "ravindra",
                                        },
                                    ],
                                    successNode: "ravindra_task_too_hard",
                                    failureNode: "kaelen_task_progress",
                                },
                            },
                        ],
                    },
                    ravindra_task_too_hard: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "I see Ravindra has you running ragged in the desert. That master doesn't know the meaning of 'moderation'. If it's too much for you, I can give you something easier.",
                        responses: [
                            {
                                text: "Yes, please. This task is too hard.",
                                next: "confirm_easier_task",
                            },
                            {
                                text: "I'll manage, thanks.",
                            },
                        ],
                    },
                    confirm_easier_task: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Are you sure? I can assign you a simpler task, but it will reset your current task streak to zero. You'll be back at square one for milestone rewards.",
                        responses: [
                            {
                                text: "I'm sure. Reset my streak and give me an easier task.",
                                actions: [
                                    {
                                        type: "slayer_reset_task",
                                        masterId: "kaelen",
                                    },
                                ],
                            },
                            {
                                text: "On second thought, I'll stick with my current task.",
                            },
                        ],
                    },
                    kaelen_task_progress: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "You haven't finished your current assignment yet. Get back out there and show those monsters what a real Slayer is made of!",
                        responses: [
                            {
                                text: "I'm on it.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Slayer's Blimp to Respite",
                icon: 'person',
                startNode: "blimp_intro",
                dialogue: {
                    blimp_intro: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "The blimp is fueled and ready for the long flight to Slayer's Respite. However, maintaining such a vessel is expensive work. A contribution of 1,800 coins is required for the journey. Are you ready to depart?",
                        responses: [
                            {
                                text: "I have the coins. Let's go.",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 1800,
                                        },
                                        {
                                            type: "skill",
                                            skill: SkillName.Slayer,
                                            level: 50,
                                        },
                                    ],
                                    successNode: "depart_success",
                                    failureNode: "depart_fail",
                                },
                            },
                            {
                                text: "Not today.",
                            },
                        ],
                    },
                    depart_success: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "Excellent. Secure your gear and prepare for takeoff. We'll have you at Duskwatch Landing in no time.",
                        responses: [
                            {
                                text: "(Board the Blimp)",
                                actions: [
                                    {
                                        type: "blimp_travel",
                                        destinationPoiId: "duskwatch_landing",
                                        cost: 1800,
                                    },
                                ],
                            },
                        ],
                    },
                    depart_fail: {
                        npcName: "Kaelen",
                        npcIcon: 'person',
                        text: "I'm afraid you don't meet the requirements for this journey. Ensure you have the 1,800 coins for fuel and have reached Slayer level 50.",
                        responses: [
                            {
                                text: "My apologies.",
                            },
                        ],
                    },
                },
            },
        ],
        regionId: "silverhaven",
        x: 525,
        y: 1825,
        type: "internal",
    },
    silverhaven_castle_grounds: {
        id: "silverhaven_castle_grounds",
        name: "Silverhaven Castle Grounds",
        description: "The immaculate grounds of the Royal Castle. Powerful adventurers patrol the area.",
        connections: ["silverhaven_castle_approach"],
        activities: [
            {
                type: "npc",
                name: "Adventurer",
                icon: "adventurer",
                pickpocket: {
                    lootTableId: "pickpocket_adventurer_table",
                },
                attackableMonsterId: "adventurer",
                dialogue: {
                    start: {
                        npcName: "Adventurer",
                        npcIcon: "adventurer",
                        text: "Best be on your way. Only authorized personnel beyond this point.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Adventurer",
                icon: "adventurer",
                pickpocket: {
                    lootTableId: "pickpocket_adventurer_table",
                },
                attackableMonsterId: "adventurer",
                dialogue: {
                    start: {
                        npcName: "Adventurer",
                        npcIcon: "adventurer",
                        text: "Stop loitering.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Adventurer",
                icon: "adventurer",
                pickpocket: {
                    lootTableId: "pickpocket_adventurer_table",
                },
                attackableMonsterId: "adventurer",
                dialogue: {
                    start: {
                        npcName: "Adventurer",
                        npcIcon: "adventurer",
                        text: "Seen any dragons lately?",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Yeoman",
                icon: "yeoman-archer",
                pickpocket: {
                    lootTableId: "pickpocket_yeoman_table",
                },
                attackableMonsterId: "yeoman",
                dialogue: {
                    start: {
                        npcName: "Yeoman",
                        npcIcon: "yeoman-archer",
                        text: "Keeping the castle grounds free of weeds is hard work, I wish they would hire another Master Farmer like myself to help with this task.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Knight",
                icon: "knight-helmet",
                pickpocket: {
                    lootTableId: "pickpocket_knight_table",
                },
                attackableMonsterId: "knight",
                dialogue: {
                    start: {
                        npcName: "Knight",
                        npcIcon: "knight-helmet",
                        text: "For the King!",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Knight",
                icon: "knight-helmet",
                pickpocket: {
                    lootTableId: "pickpocket_knight_table",
                },
                attackableMonsterId: "knight",
                dialogue: {
                    start: {
                        npcName: "Knight",
                        npcIcon: "knight-helmet",
                        text: "Watch your step.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        regionId: "silverhaven",
        x: 475,
        y: 1875,
        type: "internal",
    },
    silverhaven_rooftop_access: {
        id: "silverhaven_rooftop_access",
        name: "Rooftop Access",
        description: "A discreet ladder behind a statue leads up to the city's rooftops.",
        connections: ["silverhaven_castle_approach"],
        activities: [
            {
                type: "start_agility_course",
                name: "Start Castle Run (Lvl 70)",
                courseId: "silverhaven_castle_run",
            },
        ],
        regionId: "silverhaven",
        x: 550,
        y: 1850,
        type: "internal",
    },
};
