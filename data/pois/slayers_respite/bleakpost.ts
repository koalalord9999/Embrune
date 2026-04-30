import { POI, SkillName, ToolType } from '../../../types';
import { CIVILLIAN_DIALOGUE } from '../../../constants/dialogue';
import { RESPITE_CIVILIAN_DIALOGUE } from '../../dialogues/respiteDialogues';

export const BLEAKPOST_POIS: Record<string, POI> = {
    bleakpost_gate: {
        id: "bleakpost_gate",
        name: "Bleakpost Main Gate",
        regionId: "bleakpost",
        x: 550,
        y: 1175,
        description: "A stark, unyielding gate of iron and stone. Beyond lies the untamed north.",
        connections: ["bleakpost_courtyard", "respite_approach_bleakpost"],
        activities: [],
        type: "internal",
        eX: 600,
        eY: 1200,
    },
    bleakpost_courtyard: {
        id: "bleakpost_courtyard",
        name: "Bleakpost Courtyard",
        regionId: "bleakpost",
        x: 600,
        y: 1200,
        description: "The ground is hard-packed earth. Soldiers and slayers move with purpose here.",
        activities: [
            {
                type: "npc",
                name: "Bleakpost Guard",
                icon: "guard-alt",
                pickpocket: { lootTableId: "pickpocket_guard_table" },
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Bleakpost Guard",
                        npcIcon: "guard-alt",
                        text: RESPITE_CIVILIAN_DIALOGUE.bleakpost.join('\n\n'),
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Wounded Slayer",
                icon: "person",
                pickpocket: { lootTableId: "pickpocket_warrior_table" },
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Wounded Slayer",
                        npcIcon: "person",
                        text: "Just let me rest... that Marsh Stalker nearly had me.\n\nDon't go south without a sturdy shield. The shadows there bite back.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "thieving_stall",
                id: "bleakpost_water_stall",
                name: "Steal from Bleakpost Water Supply",
                lootTableId: "thieving_stall_water"
            },
        ],
        connections: [
            "bleakpost_gate",
            "bleakpost_bank",
            "thorne_lodge",
            "bleakpost_barracks",
            "bleakpost_well",
            "bleakpost_shrine",
            "bleakpost_tenements",
        ],
        type: "internal",
    },
    thorne_lodge: {
        id: "thorne_lodge",
        name: "Thorne's Research Lodge",
        regionId: "bleakpost",
        x: 575,
        y: 1225,
        description: "A cluttered building filled with preserved specimens and complex anatomical sketches. Thorne himself is usually buried in paperwork or trophies.",
        activities: [
            {
                type: "slayer_master",
                masterId: "thorne",
                name: "Thorne",
                icon: "beard",
                dialogue: {
                    start: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Fascinating! The way the void energy oscillates in these specimens... Oh, you're still here. If you want to be useful, provide me with more field data. I have plenty of 'research' for a slayer of your... caliber.",
                        responses: [
                            {
                                text: "I'm looking for a research assignment (Slayer Task).",
                                next: "check_task_status",
                            },
                            {
                                text: "I'd like to see the research requisition (Slayer Rewards).",
                                actions: [
                                    {
                                        type: "slayer_open_shop",
                                    },
                                ],
                            },
                            {
                                text: "I need to scrap my current research (Reset Task).",
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
                                text: "Just observing.",
                            },
                        ],
                    },
                    reset_task_intro: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Scrapping an active session? Such a waste of potential data. Reallocating my sensors isn't free, you know. It'll cost you 20 Slayer Credits to cover the administrative overhead.",
                        responses: [
                            {
                                text: "I have the credits. Wipe the data.",
                                next: "reset_task_check",
                            },
                            {
                                text: "On second thought, I'll continue.",
                            },
                        ],
                    },
                    reset_task_check: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Verifying your credit balance...",
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
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Are you absolutely sure? The existing biological markers will be purged. You'll have to start your observations from scratch with a new master.",
                        responses: [
                            {
                                text: "Yes, purge the session.",
                                actions: [
                                    {
                                        type: "slayer_reset_task",
                                        masterId: "thorne",
                                    },
                                ],
                            },
                            {
                                text: "No, keep it.",
                            },
                        ],
                    },
                    reset_task_failed: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "My research isn't a charity. You don't have the 20 credits required for such an operation. Come back when you've done some actual field work.",
                        responses: [
                            {
                                text: "Understood.",
                            },
                        ],
                    },
                    check_task_status: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Consulting the field logs...",
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
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "The data from the Abyssal Expanse is incomplete. I need a specimen that can withstand... higher pressures. Are you ready to participate in this 'data collection'?",
                        responses: [
                            {
                                text: "Yes, assign me a task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "thorne",
                                    },
                                ],
                            },
                            {
                                text: "Not just yet.",
                            },
                        ],
                    },
                    has_task_check: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Wait, my logs show an active observation window...",
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
                                    successNode: "complete_task",
                                    failureNode: "current_task",
                                },
                            },
                        ],
                    },
                    current_task: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "You haven't finished your current assignment! My research requires consistency. Return only when the specimen quota has been met and the results are conclusive.",
                        responses: [
                            {
                                text: "I'm on it.",
                            },
                        ],
                    },
                    complete_task: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Excellent! The biological feedback from that encounter is... enlightening. The void oscillation patterns are exactly as I hypothesized. Here are your credits.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "slayer_complete_task",
                                        masterId: "thorne",
                                    },
                                ],
                                next: "new_task_prompt",
                            },
                        ],
                    },
                    new_task_prompt: {
                        npcName: "Thorne",
                        npcIcon: "beard",
                        text: "Now then, my sensors are picking up more anomalies across the island. Shall I calibrate another research objective for you?",
                        responses: [
                            {
                                text: "Yes, assign me a new task.",
                                actions: [
                                    {
                                        type: "slayer_get_task",
                                        masterId: "thorne",
                                    },
                                ],
                            },
                            {
                                text: "Not right now, Thorne.",
                            },
                        ],
                    },
                },
                startNode: "start",
                actions: [
                    {
                        type: "shop",
                        label: "Buy Slayer Gear",
                        shopId: "respite_slayer_gear",
                    },
                ],
            },
        ],
        connections: ["bleakpost_courtyard", "bleakpost_watchtower_west"],
        type: "internal",
    },
    bleakpost_bank: {
        id: "bleakpost_bank",
        name: "Bleakpost Vault",
        regionId: "bleakpost",
        x: 625,
        y: 1200,
        description: "A secure point for slayers to store their findings before heading into the rift.",
        activities: [
            {
                type: "npc",
                name: "Banker Hrothgar",
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
                        npcName: "Banker Hrothgar",
                        npcIcon: "person",
                        text: "Your trophies are safe in the vault. We don't care how much blood is on them, so long as the gold is real. What can I do for you?",
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
                        npcName: "Banker Hrothgar",
                        npcIcon: "person",
                        text: "Of course. The mechanism is a bit stiff, but it holds. Ready?",
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
                                text: "Not yet.",
                            },
                        ],
                    },
                },
                pickpocket: { lootTableId: "pickpocket_knight_table" },
                startNode: "start",
            },
        ],
        connections: [
            "bleakpost_courtyard",
            "bleakpost_east_exit",
            "bleakpost_training_ground",
        ],
        type: "internal",
    },
    bleakpost_barracks: {
        id: "bleakpost_barracks",
        name: "Bleakpost Barracks",
        regionId: "bleakpost",
        x: 600,
        y: 1250,
        description: "Simple, utilitarian housing for the outpost's defenders.",
        activities: [
            {
                type: "npc",
                name: "Sgt. Hallow",
                icon: "soldier",
                dialogue: {
                    start: {
                        npcName: "Sgt. Hallow",
                        npcIcon: "soldier",
                        text: "Straighten your back, slayer! The Rift doesn't care about your fatigue. You either train until you're perfect, or you become a specimen for Thorne.",
                        responses: [
                            {
                                text: "How do I use the Gauntlet?",
                                next: "gauntlet_info",
                            },
                        ],
                    },
                    gauntlet_info: {
                        npcName: "Sgt. Hallow",
                        npcIcon: "soldier",
                        text: "The Gauntlet course to the east is designed to break you. You'll need Level 70 Agility just to survive the first lap. If you can't handle the heat, stay in the mess hall.",
                        responses: [
                            {
                                text: "I'll keep that in mind.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Exhausted Recruit",
                icon: "person",
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Exhausted Recruit",
                        npcIcon: "person",
                        text: "I thought I was a good fighter back home... here, I'm just bait.\n\nSgt. Hallow never sleeps. I'm convinced he's made of iron.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            { type: "thieving_pilfer", id: "bleakpost_room_b1", name: "Officer's Room" },
            { type: "thieving_pilfer", id: "bleakpost_room_b2", name: "Soldier's Bunk 1" },
            { type: "thieving_pilfer", id: "bleakpost_room_b3", name: "Soldier's Bunk 2" },
            { type: "thieving_pilfer", id: "bleakpost_room_b4", name: "Supply Closet" },
        ],
        connections: [
            "bleakpost_courtyard",
            "bleakpost_mess_hall",
            "bleakpost_infirmary",
            "bleakpost_provisioner",
            "bleakpost_south_exit",
        ],
        type: "internal",
    },
    bleakpost_mess_hall: {
        id: "bleakpost_mess_hall",
        name: "The Last Drop (Bleakpost)",
        regionId: "bleakpost",
        x: 625,
        y: 1275,
        description: "A smaller branch of the Duskwatch tavern. The atmosphere is quiet and grim.",
        activities: [
            {
                type: "shop",
                shopId: "respite_tavern",
            },
            {
                type: "npc",
                name: "Barkeep Taggart",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "Welcome to The Last Drop. If you're looking for a drink or a bed, you've come to the right place—assuming you've got the coin to back it up. Supplies are thin and slayers are many.",
                        responses: [
                            {
                                text: "I'll take a beer.",
                                next: "buy_beer",
                            },
                            {
                                text: "I need a room.",
                                next: "rent_room",
                            },
                            {
                                text: "Just observing.",
                            },
                        ],
                    },
                    buy_beer: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "It's nasty, warm, and probably half marsh-water, but it's the only brew on this side of the island. 50 gold and it's yours.",
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
                                    successNode: "buy_beer_success",
                                    failureNode: "buy_beer_fail",
                                },
                            },
                            {
                                text: "Nevermind.",
                            },
                        ],
                    },
                    buy_beer_success: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "Here. Try not to think about the taste too much.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 50,
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
                    buy_beer_fail: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "Come back when you've got the gold. I don't run a charity.",
                        responses: [
                            {
                                text: "My mistake.",
                            },
                        ],
                    },
                    rent_room: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "Rooms are hard to come by with all these slayers rotating in and out. I can muster one up, but it'll cost you 200 gold. Take it or leave it.",
                        responses: [
                            {
                                text: "I'll take the room (200 gold).",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 200,
                                        },
                                    ],
                                    successNode: "rent_room_success",
                                    failureNode: "buy_beer_fail",
                                },
                            },
                            {
                                text: "Too rich for my blood.",
                            },
                        ],
                    },
                    rent_room_success: {
                        npcName: "Barkeep Taggart",
                        npcIcon: "person",
                        text: "It's yours for the night. Try to ignore the snoring through the walls.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 200,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                        ],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Mika",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Mika",
                        npcIcon: "person",
                        text: "I'm supposed to head out to the Marsh tomorrow. Do you think it's as bad as they say?",
                        responses: [
                            {
                                text: "It's worse.",
                                next: "mika_scared",
                            },
                            {
                                text: "You'll be fine.",
                                next: "mika_reassured",
                            },
                        ],
                    },
                    mika_scared: {
                        npcName: "Mika",
                        npcIcon: "person",
                        text: "Oh... maybe I should have stayed in Silverhaven. But the pay here is just so much better.",
                        responses: [],
                    },
                    mika_reassured: {
                        npcName: "Mika",
                        npcIcon: "person",
                        text: "Thanks. I've been practicing my block. I hope it's enough.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Old Barnaby",
                icon: "person",
                dialogueType: "random",
                dialogue: {
                    start: {
                        npcName: "Old Barnaby",
                        npcIcon: "person",
                        text: "The fish in the Marsh have too many eyes, but they taste like butter if you cook 'em right.\n\nCaught a three-headed eel yesterday. Thorne paid a pretty penny for it.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["bleakpost_barracks"],
        type: "internal",
    },
    bleakpost_provisioner: {
        id: "bleakpost_provisioner",
        name: "Bleakpost Quartermaster",
        regionId: "bleakpost",
        x: 575,
        y: 1275,
        description: "Dain manages the incoming supplies and outgoing monster parts.",
        activities: [
            {
                type: "shop",
                shopId: "respite_general",
            },
            {
                type: "npc",
                name: "Quartermaster Dain",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Quartermaster Dain",
                        npcIcon: "person",
                        text: "Supplies are tight, but for a slayer with credits, I can always find a little extra. What do you need?",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            { type: "thieving_pilfer", id: "bleakpost_room_p1", name: "Proprietor's Backroom" },
        ],
        connections: ["bleakpost_barracks", "bleakpost_infirmary"],
        type: "internal",
    },
    bleakpost_watchtower_west: {
        id: "bleakpost_watchtower_west",
        name: "Marsh Watch",
        regionId: "bleakpost",
        x: 550,
        y: 1225,
        description: "Guarding against threats emerging from the Bonemarsh.",
        connections: ["thorne_lodge"],
        activities: [
            {
                type: "npc",
                name: "Tracker Sienna",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Tracker Sienna",
                        npcIcon: "person",
                        text: "Keep your eyes on the treeline. The Marsh Stalkers don't attack from the front. They wait until you're tired, then they strike from the muck.",
                        responses: [
                            {
                                text: "How do I spot them?",
                                next: "spot_stalkers",
                            },
                        ],
                    },
                    spot_stalkers: {
                        npcName: "Tracker Sienna",
                        npcIcon: "person",
                        text: "Look for the bubbles. And the smell of rotting sulfur. If the marsh goes silent, they're already behind you.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
        ],
        type: "internal",
    },
    bleakpost_training_ground: {
        id: "bleakpost_training_ground",
        name: "The Gauntlet Course",
        regionId: "bleakpost",
        x: 650,
        y: 1200,
        description: "A grueling training course for elite slayers. Level 70 Agility required to pass.",
        activities: [
            {
                type: "agility_obstacle",
                obstacleId: "bleakpost_gauntlet",
                name: "Bleakpost Gauntlet",
                skill: SkillName.Agility,
                requiredLevel: 70,
                xp: 500,
                actionText: "Run the Gauntlet",
            },
        ],
        connections: ["bleakpost_bank"],
        type: "internal",
    },
    bleakpost_infirmary: {
        id: "bleakpost_infirmary",
        name: "Field Hospital",
        regionId: "bleakpost",
        x: 550,
        y: 1250,
        description: "Providing critical care for those who survive the rift.",
        activities: [
            {
                type: "npc",
                name: "Healer Selene",
                icon: "first-aid",
                dialogue: {
                    start: {
                        npcName: "Healer Selene",
                        npcIcon: "first-aid",
                        text: "Try not to bleed on the floor. I'm running low on bandages as it is. Patching you up properly costs 750 gold to restock my supplies. Take it or leave it.",
                        responses: [
                            {
                                text: "I need healing (750 gold).",
                                check: {
                                    requirements: [
                                        {
                                            type: "coins",
                                            amount: 750,
                                        },
                                    ],
                                    successNode: "heal_success",
                                    failureNode: "heal_fail",
                                },
                            },
                            {
                                text: "I'll manage.",
                            },
                        ],
                    },
                    heal_success: {
                        npcName: "Healer Selene",
                        npcIcon: "first-aid",
                        text: "Hold still. This might sting... a lot.",
                        responses: [
                            {
                                text: "(Continue)",
                                actions: [
                                    {
                                        type: "take_coins",
                                        amount: 750,
                                    },
                                    {
                                        type: "heal",
                                        amount: "full",
                                    },
                                ],
                            },
                        ],
                    },
                    heal_fail: {
                        npcName: "Healer Selene",
                        npcIcon: "first-aid",
                        text: "My supplies aren't free, slayer. Come back when you have the coin, or when you're done bleeding out—whichever happens first.",
                        responses: [
                            {
                                text: "Understood.",
                            },
                        ],
                    },
                },
                startNode: "start",
            },
        ],
        connections: ["bleakpost_provisioner", "bleakpost_barracks"],
        type: "internal",
    },
    bleakpost_shrine: {
        id: "bleakpost_shrine",
        name: "Shrine of the Fallen",
        regionId: "bleakpost",
        x: 575,
        y: 1200,
        description: "A somber monument to those who never returned from Thorne's tasks.",
        activities: [
            {
                type: "npc",
                name: "Monk Aldric",
                icon: "person",
                dialogue: {
                    start: {
                        npcName: "Monk Aldric",
                        npcIcon: "person",
                        text: "This island is a wound on the world, and we are the salt. Pray for those who fell, for they are the only ones truly at peace here.",
                        responses: [
                            {
                                text: "Is there any hope?",
                                next: "hope",
                            },
                        ],
                    },
                    hope: {
                        npcName: "Monk Aldric",
                        npcIcon: "person",
                        text: "Hope is a luxury for the mainland. Here, we have only resolve. Keep your faith, or the Rift will find the cracks in your soul.",
                        responses: [],
                    },
                },
                startNode: "start",
            },
            {
                type: "npc",
                name: "Statue of the Fallen",
                icon: "angel-statue",
            },
        ],
        connections: ["bleakpost_courtyard"],
        type: "internal",
    },
    bleakpost_south_exit: {
        id: "bleakpost_south_exit",
        name: "Bleakpost South Trail",
        regionId: "bleakpost",
        x: 600,
        y: 1350,
        description: "The trail leading back towards the marshes and Duskwatch.",
        connections: ["bleakpost_barracks", "respite_outer_sw2"],
        activities: [],
        type: "internal",
        eX: 600,
        eY: 1200,
    },
    bleakpost_east_exit: {
        id: "bleakpost_east_exit",
        name: "Bleakpost East Trail",
        regionId: "bleakpost",
        x: 675,
        y: 1250,
        description: "Leads towards the Shattered Coast and the eastern biomes.",
        connections: ["bleakpost_bank", "respite_approach_bonemarsh_sw"],
        activities: [],
        type: "internal",
        eX: 600,
        eY: 1200,
    },
    bleakpost_well: {
        id: "bleakpost_well",
        name: "Outpost Well",
        regionId: "bleakpost",
        x: 625,
        y: 1225,
        description: "The outpost's only source of water besides the murky marsh runoff.",
        activities: [
            {
                type: "water_source",
                name: "Bleakpost Well",
            },
        ],
        connections: ["bleakpost_courtyard"],
        type: "internal",
    },
    bleakpost_tenements: {
        id: "bleakpost_tenements",
        name: "Bleakpost Tenements",
        regionId: "bleakpost",
        x: 625,
        y: 1175,
        description: "A row of stone dwellings built against the inner wall. They house the few civilians brave enough to live this far north.",
        connections: ["bleakpost_courtyard"],
        activities: [
            { type: "thieving_pilfer", id: "bleakpost_house_t1", name: "Sturdy Stone House" },
            { type: "thieving_pilfer", id: "bleakpost_house_t2", name: "Cramped Dwelling" },
            { type: "thieving_pilfer", id: "bleakpost_house_t3", name: "Weathered Home" },
        ],
        type: "internal",
    },
};
