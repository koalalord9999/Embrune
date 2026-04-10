
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';
import { BROTHER_THADDEUS_DIALOGUE, LIBRARIAN_ANYA_DIALOGUE, INNKEEPER_PHOEBE_DIALOGUE, ARTISAN_KAEL_DIALOGUE, GUARD_CASSIA_DIALOGUE } from '../dialogues/sanctityDialogues';

export const sanctityPois: Record<string, POI> = {
    // --- CONNECTING PATHS ---
    swamp_path_east_1: {
        id: 'swamp_path_east_1',
        name: 'Brackish Path',
        description: 'A muddy path leading east from the lonely cabin, away from the worst of the swamp.',
        connections: ['lonely_cabin', 'swamp_path_east_2'],
        activities: [],
        regionId: 'wilderness',
        x: 1350, y: 1500,
    },
    swamp_path_east_2: {
        id: 'swamp_path_east_2',
        name: 'Dry Ground',
        description: 'The path solidifies here. In the distance, you can see the walls of a small, clean-looking town.',
        connections: ['swamp_path_east_1', 'sanctity_west_gate'],
        activities: [],
        regionId: 'wilderness',
        x: 1450, y: 1500,
    },

    // --- GATES (World Map POIs) ---
    sanctity_west_gate: {
        id: 'sanctity_west_gate',
        name: 'Sanctity West Gate',
        description: 'The western gate of Sanctity, facing the swamps. It is well-maintained and watched by a vigilant guard.',
        connections: ['swamp_path_east_2', 'sanctity_slums'],
        activities: [
            {
                type: 'npc',
                name: 'Guard Cassia',
                icon: '/assets/npcChatHeads/guard_captain_elara.png',
                dialogue: GUARD_CASSIA_DIALOGUE,
                startNode: 'start',
                questTopics: ['the_trial_of_war'],
            }
        ],
        regionId: 'sanctity',
        type: 'internal',
        x: 50, y: 250,
        eX: 1650, eY: 1500,
    },
    sanctity_north_gate: {
        id: 'sanctity_north_gate',
        name: 'Sanctity North Gate',
        description: 'The northern gate, leading towards open plains.',
        connections: ['sanctity_north_district', 'sunbright_plains_start'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 250, y: 50,
        eX: 1650, eY: 1500,
    },
    sanctity_east_gate: {
        id: 'sanctity_east_gate',
        name: 'Sanctity East Gate',
        description: 'The eastern gate, facing a grassy field.',
        connections: ['sanctity_east_district', 'wyrmwood_grove_entrance'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 450, y: 250,
        eX: 1650, eY: 1500,
    },
    sanctity_south_gate: {
        id: 'sanctity_south_gate',
        name: 'Sanctity South Gate',
        description: 'The southern gate, leading towards a technologically advanced area.',
        connections: ['sanctity_south_district', 'frostfang_peaks_base'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 250, y: 450,
        eX: 1650, eY: 1500,
    },

    // --- INTERNAL POIs ---
    sanctity_slums: {
        id: 'sanctity_slums',
        name: 'Sanctity Slums',
        description: 'The western part of town has a lingering swampy smell. The houses here are small but tidy.',
        connections: ['sanctity_west_gate', 'sanctity_square'],
        activities: [
            { type: 'thieving_pilfer', id: 'sanctity_house_1', name: 'Locked Shack' },
            { type: 'thieving_pilfer', id: 'sanctity_house_2', name: 'Locked Hovel' },
            { type: 'npc', name: 'Refugee', icon: 'person', dialogue: { start: { npcName: 'Refugee', npcIcon: 'person', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' }
        ],
        regionId: 'sanctity',
        x: 150, y: 250, type: 'internal',
    },
    sanctity_square: {
        id: 'sanctity_square',
        name: 'Sanctity Square',
        description: 'The joyous, holy center of Sanctity. A beautiful fountain depicting a serene angel provides clean water.',
        connections: ['sanctity_slums', 'sanctity_north_district', 'sanctity_east_district', 'sanctity_south_district'],
        activities: [
            { type: 'water_source', name: 'Gather from Holy Fountain', isHoly: true },
            { type: 'npc', name: 'Worshipper', icon: 'woman-elf-face', dialogue: { start: { npcName: 'Worshipper', npcIcon: 'woman-elf-face', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' },
        ],
        regionId: 'sanctity',
        x: 250, y: 250, type: 'internal',
    },
    sanctity_north_district: {
        id: 'sanctity_north_district',
        name: 'Chapel Road',
        description: 'A pristine road leading north towards the grand chapel and the town library.',
        connections: ['sanctity_square', 'sanctity_chapel', 'sanctity_library', 'sanctity_north_gate'],
        activities: [],
        regionId: 'sanctity',
        x: 250, y: 150, type: 'internal',
    },
    sanctity_east_district: {
        id: 'sanctity_east_district',
        name: 'Pilgrim\'s Path',
        description: 'A grassy path leads east towards the inn and the town gate. There is a sense of foreboding in the air.',
        connections: ['sanctity_square', 'sanctity_inn', 'sanctity_east_gate', 'graces_agility_shop'],
        activities: [
            { type: 'npc', name: 'Concerned Citizen', icon: 'person', dialogue: { start: { npcName: 'Concerned Citizen', npcIcon: 'person', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' }
        ],
        regionId: 'sanctity',
        x: 350, y: 250, type: 'internal',
    },
    sanctity_south_district: {
        id: 'sanctity_south_district',
        name: 'Artisan\'s Way',
        description: 'The southern road is paved with smooth, interlocking stones, leading to the artisan\'s quarter.',
        connections: ['sanctity_square', 'sanctity_artisans_quarter', 'sanctity_south_gate'],
        activities: [],
        regionId: 'sanctity',
        x: 250, y: 350, type: 'internal',
    },
    sanctity_chapel: {
        id: 'sanctity_chapel',
        name: 'Grand Chapel of Sanctity',
        description: 'A large, beautiful chapel dedicated to the gods of light and order.',
        connections: ['sanctity_north_district'],
        activities: [
            { type: 'npc', name: 'Brother Thaddeus', icon: 'priest-hat', dialogue: BROTHER_THADDEUS_DIALOGUE, startNode: 'start', questTopics: ['the_saints_first_step'] },
            {
                type: 'npc',
                name: 'Altar',
                icon: 'altar',
                dialogue: {
                    start: {
                        npcName: 'Altar',
                        npcIcon: 'altar',
                        text: 'You feel a divine presence. Your prayer may be answered here.',
                        responses: [
                            { text: 'Pray', actions: [{ type: 'restore_prayer' }] },
                            { text: 'Leave' }
                        ]
                    }
                },
                startNode: 'start'
            },
            {
                type: 'npc',
                name: 'Reliquary Grinder',
                icon: 'grindstone',
                dialogue: {
                    start: {
                        npcName: 'Reliquary Grinder',
                        npcIcon: 'grindstone',
                        text: 'An old stone grinder used for sacred rituals. Select a bone to grind.',
                        responses: [{ text: "Leave" }],
                        conditionalResponses: [
                            {
                                text: 'Grind Consecrated Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_bones' }]
                            },
                            {
                                text: 'Grind Consecrated Big Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_big_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_big_bones' }]
                            },
                            {
                                text: 'Grind Consecrated Dragon Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_dragon_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_dragon_bones' }]
                            },
                            {
                                text: 'Grind Consecrated Frost Dragon Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_frost_dragon_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_frost_dragon_bones' }]
                            }
                        ]
                    }
                },
                startNode: 'start'
            },
            { type: 'ground_item', id: 'sanctity_chapel_vial', itemId: 'vial', resourceCount: 1, respawnTimer: 60000 },
        ],
        regionId: 'sanctity',
        x: 200, y: 100, type: 'internal',
    },
    sanctity_library: {
        id: 'sanctity_library',
        name: 'Sanctity Library',
        description: 'A repository of holy texts and historical records.',
        connections: ['sanctity_north_district'],
        activities: [
            {
                type: 'npc',
                name: 'Librarian Anya',
                icon: '/assets/npcChatHeads/librarian_elara.png',
                dialogue: LIBRARIAN_ANYA_DIALOGUE,
                startNode: 'start',
                questTopics: ['the_sorcerers_trial'],
                conditionalGreetings: [
                    {
                        text: "Archmage. Your achievement will be whispered in these halls for generations to come. The Elemental Shrine in Wyrmwood still resonates with your power; you may return there whenever you wish to face the mirror once more.",
                        check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'completed' }] }
                    },
                    {
                        text: "Welcome to the Sanctity Library. Most seekers come here for the comfort of the holy texts, but I sense you are looking for the raw principles that bind them. I've been observing your progress... are you ready for a challenge that goes beyond these shelves?",
                        check: {
                            requirements: [
                                { type: 'quest_requirements', questId: 'the_sorcerers_trial' },
                                { type: 'quest', questId: 'the_sorcerers_trial', status: 'not_started' }
                            ]
                        }
                    },
                    { text: "The fragments of Intent and Shape are essential for the Rune of Attunement. Have you located them?", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', operator: 'lt', stage: 3 }] } },
                    { text: "The Rune remains inert. It requires the spark of raw elemental fury to wake it.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 4 }] } },
                    { text: "You have channeled the storm! The first pillar is mastered. Speak to me when you are ready for the second.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 5 }] } },
                    { text: "Zafira in Fouthia will teach you what books cannot: the discipline of Controlled Destruction.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', operator: 'gte', stage: 6 }, { type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', operator: 'lt', stage: 13 }] } },
                    { text: "The Core of Controlled Destruction is complete. Now, we turn to the final pillar: Transmutation.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 13 }] } },
                    { text: "A Runic Bar, Shard of True Ice, and a Sunstone. Only they can anchor the spell at the Astral Altar.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 14 }] } },
                    { text: "The ritual must be performed at the apex of the Magus Spire. The astral convergence there is key.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 15 }] } },
                    { text: "You have rewritten reality itself. The Bar of Transmuted Gold is a testament to your mastery. Are you ready for the final trial?", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', stage: 16 }] } },
                    { text: "The three foci—Creation, Destruction, and Transmutation—must be placed at the Elemental Shrine in Wyrmwood.", check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', operator: 'gte', stage: 17 }, { type: 'quest', questId: 'the_sorcerers_trial', status: 'in_progress', operator: 'lt', stage: 20 }] } }
                ]
            }
        ],
        regionId: 'sanctity',
        x: 300, y: 100, type: 'internal',
    },
    sanctity_inn: {
        id: 'sanctity_inn',
        name: 'The Pilgrim\'s Rest',
        description: 'A quiet, clean inn that serves only water and milk. A quest board is posted near the entrance.',
        connections: ['sanctity_east_district'],
        activities: [
            { type: 'quest_board' },
            { type: 'npc', name: 'Innkeeper Phoebe', icon: '/assets/npcChatHeads/barkeep_freya.png', dialogue: INNKEEPER_PHOEBE_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'sanctity',
        x: 400, y: 200, type: 'internal',
    },
    graces_agility_shop: {
        id: 'graces_agility_shop',
        name: "Grace's Garments",
        description: 'A specialty shop selling lightweight gear for the nimble adventurer. They only accept Agility Vouchers.',
        connections: ['sanctity_east_district'],
        activities: [
            { type: 'shop', shopId: 'graces_garments' },
        ],
        regionId: 'sanctity',
        x: 350, y: 300,
        type: 'internal',
    },
    sanctity_artisans_quarter: {
        id: 'sanctity_artisans_quarter',
        name: 'Artisan\'s Quarter',
        description: 'An advanced workshop where technology and faith intersect. Various crafting stations are available.',
        connections: ['sanctity_south_district', 'sanctity_rooftop_access'],
        activities: [
            { type: 'anvil' },
            { type: 'furnace' },
            { type: 'spinning_wheel' },
            { type: 'npc', name: 'Artisan Kael', icon: '/assets/npcChatHeads/artisan.png', dialogue: ARTISAN_KAEL_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'sanctity',
        x: 200, y: 400, type: 'internal',
    },
    sanctity_rooftop_access: {
        id: 'sanctity_rooftop_access',
        name: 'Rooftop Access',
        description: 'A set of scaffolding provides access to the rooftops, offering a breathtaking view of the chapel.',
        connections: ['sanctity_artisans_quarter'],
        activities: [
            { type: 'start_agility_course', name: 'Start Cathedral Climb (Lvl 46)', courseId: 'sanctity_cathedral_climb' },
        ],
        regionId: 'sanctity',
        x: 200, y: 350,
        type: 'internal',
    }
};