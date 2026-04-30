
import { Quest, SkillName } from '../../types';

export const aSmithsApprentice: Quest = {
    id: 'a_smiths_apprentice',
    name: "A Smith's Apprentice",
    description: "Valerius the Master Smith is looking for an extra pair of hands to help fulfill a large order of equipment for the Meadowdale guards.",
    startHint: "Speak to Valerius the Master Smith in Meadowdale.",
    playerStagePerspectives: [
        "Valerius needs me to smith 5 Bronze Swords for the guards. He expects me to gather my own materials to complete the job.",
        "I've smithed the swords. Next, I need to smith 5 Bronze Kiteshields at the anvil.",
        "I've smithed the shields. Finally, I need to smith 5 Bronze Full Helms at the anvil.",
        "I've finished smithing all the equipment. I should return it to Valerius."
    ],
    completionSummary: "I helped Valerius the smith by fulfilling an order for the Meadowdale guards. I smithed 5 Bronze Swords, 5 Bronze Kiteshields, and 5 Bronze Full Helms, learning a great deal about the craft in the process.",
    stages: [
        {
            description: "Use the anvil to smith 5 Bronze Swords.",
            requirement: { type: 'smith', itemId: 'bronze_sword', quantity: 5 }
        },
        {
            description: "Use the anvil to smith 5 Bronze Kiteshields.",
            requirement: { type: 'smith', itemId: 'bronze_kiteshield', quantity: 5 }
        },
        {
            description: "Use the anvil to smith 5 Bronze Full Helms.",
            requirement: { type: 'smith', itemId: 'bronze_full_helm', quantity: 5 }
        },
        {
            description: "Show the equipment to Valerius.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Smithing, amount: 1250 }],
        coins: 500
    },
    dialogueEntryPoints: [
        { npcName: 'Valerius the Master Smith', response: { text: "About the equipment...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 3 }], successNode: 'in_progress_a_smiths_apprentice_3_check', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "About the equipment...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 2 }], successNode: 'in_progress_a_smiths_apprentice_2', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "About the equipment...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 1 }], successNode: 'in_progress_a_smiths_apprentice_1', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "About the equipment...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 0 }], successNode: 'in_progress_a_smiths_apprentice_0', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I'm looking for work.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'not_started' }], successNode: 'quest_intro_a_smiths_apprentice', failureNode: '' } } }
    ],
    dialogue: {
        quest_intro_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Help? Hah! You've got the look of someone not afraid of a bit of hard work. This town was built on the sweat of good smiths, but the young folk these days... they'd rather read books in the library. The Captain of the Guard just dropped a huge order on me. The guards' old iron gear is rusted through, and they need basic bronze replacements immediately. I need hands, not books. Interested?",
            responses: [
                { text: "I'm always ready to learn. What do you need?", next: 'details_a_smiths_apprentice' },
                { text: "Sorry, I've got books to read.", next: 'decline_smithing_quest' },
            ],
        },
        decline_smithing_quest: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Hmph. Another one. Go on then, bury your nose in dusty pages. See if a book will stop a goblin's blade. The forge is here if you change your mind.",
            responses: []
        },
        details_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Good. The guards need a set of 5 Bronze Swords, 5 Bronze Kiteshields, and 5 Bronze Full Helms. I'll lend you a spare hammer, but you'll have to source the bronze yourself. Mining copper and tin is a good start. Once you have the bars, bring them to the anvil and shape them into the gear. We'll start with the swords. Show me what you can do.",
            responses: [
                { text: "I'll get to work.", actions: [{ type: 'start_quest', questId: 'a_smiths_apprentice' }, { type: 'give_item', itemId: 'hammer', quantity: 1 }] },
            ],
        },
        a_smiths_apprentice_progress_router: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: '',
            responses: [],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 0 }], successNode: 'in_progress_a_smiths_apprentice_0', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 1 }], successNode: 'in_progress_a_smiths_apprentice_1', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 2 }], successNode: 'in_progress_a_smiths_apprentice_2', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 3 }], successNode: 'in_progress_a_smiths_apprentice_3_check', failureNode: '' } },
            ]
        },
        in_progress_a_smiths_apprentice_0: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "The anvil isn't going to strike itself! Gather the bronze bars and start with the 5 Bronze Swords. Heat, pressure, and a steady hand.",
            responses: []
        },
        in_progress_a_smiths_apprentice_1: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "I saw you finish those swords. Not bad. Now, onto the 5 Bronze Kiteshields. They take more material and a broader strike. Get to it.",
            responses: []
        },
        in_progress_a_smiths_apprentice_2: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Just the 5 Bronze Full Helms left. Shape them well; a guard's life depends on that metal protecting their skull.",
            responses: []
        },
        in_progress_a_smiths_apprentice_3_check: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Have you finished the equipment for the guards?",
            conditionalResponses: [
                { text: "Yes, I have it all here.", check: { requirements: [{ type: 'items', items: [{itemId: 'bronze_sword', quantity: 5}, {itemId: 'bronze_kiteshield', quantity: 5}, {itemId: 'bronze_full_helm', quantity: 5}] }], successNode: 'in_progress_a_smiths_apprentice_3', failureNode: '' } }
            ],
            responses: [
                { text: "I'm still working on it.", next: 'in_progress_a_smiths_apprentice_3_missing' }
            ]
        },
        in_progress_a_smiths_apprentice_3_missing: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Where is the equipment? I need 5 Bronze Swords, 5 Bronze Kiteshields, and 5 Bronze Full Helms. You'll need to mine copper and tin, smelt them into bronze bars, and smith the equipment at the anvil.",
            responses: []
        },
        in_progress_a_smiths_apprentice_3: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Let me see... The swords are balanced, the shields are sturdy, and the helms... decent. They'll protect the guards well enough. You've got a knack for this. Here's something for your trouble. Keep at it.",
            responses: [
                { text: "Thank you for the lesson!", actions: [{ type: 'take_item', itemId: 'bronze_sword', quantity: 5 }, { type: 'take_item', itemId: 'bronze_kiteshield', quantity: 5 }, { type: 'take_item', itemId: 'bronze_full_helm', quantity: 5 }, { type: 'advance_quest', questId: 'a_smiths_apprentice' }] }
            ]
        },
        post_quest_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Good to see you again, apprentice. Remember what I taught you: heat, pressure, and a strong arm. That's all there is to it... mostly. How's the forge treating you?",
            conditionalResponses: [ 
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5 }] }, { type: 'items', items: [{ itemId: 'rusty_iron_sword', quantity: 1 }] }], successNode: 'in_progress_ancient_blade_2', failureNode: '' }},
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5, operator: 'lt'}]}], successNode: 'in_progress_ancient_blade_1', failureNode: ''}},
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5}, { itemId: 'rusty_iron_sword', quantity: -1}]}], successNode: 'only_ore_ancient_blade', failureNode: ''}}
            ],
            responses: []
        }
    }
};
