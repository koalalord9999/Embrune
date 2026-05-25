import { Quest, SkillName } from '../../types';

export const scalesOfTheSwamp: Quest = {
    id: 'scales_of_the_swamp' as any, // Cast as any here to avoid cyclic type error before it's registered in index.ts
    name: "Scales of the Swamp",
    description: "Captain Elara has uncovered more about the Serpent Bandits and their leader, the Coilmaster. Journey into the murky depths of the Serpent's Coil to find him.",
    startHint: "Speak to Guard Captain Elara at the Oakhaven West Gate.",
    isHidden: true,
    playerStagePerspectives: [
        "Elara wants me to find the Coilmaster. I should speak to Bronn at The Carved Mug to learn what I'm up against.",
        "Bronn warned me about the swamp's ecology. I need to visit Herbalist Anise to get supplies before I enter.",
        "I'm prepared. I need to travel to the Serpent's Coil Entrance and venture into the murky delta.",
        "The swamp is a maze. I need to find tracks or signs of the bandits to lead me to the Nesting Ground.",
        "I found tracks leading to a Bandit Scout. I must figure out how to get past him without raising the whole camp.",
        "The scout let me pass. I need to follow the submerged causeway deeper into the swamp toward the Sunken Temple.",
        "I've reached the Sunken Temple. Garath Voss, the Coilmaster, is waiting for me. I must confront him.",
        "I have resolved the situation with Garath Voss. I must return to Captain Elara at the Oakhaven West Gate with the proof."
    ],
    completionSummary: "I tracked the Coilmaster, Garath Voss, to a sunken temple in the Serpent's Coil. He claimed the Serpent Bandits sabotaged the bridge to expose secret royal convoys moving under the cover of night. I brought his evidence to Elara, who is now reporting this up the chain to Silverhaven. The extortion network remains, but a much larger investigation has begun.",
    stages: [
        {
            description: "Speak to Bronn at The Carved Mug to gather intel on the Serpent Bandits.",
            requirement: { type: 'talk', poiId: 'the_carved_mug', npcName: 'Bronn the Retired Adventurer' }
        },
        {
            description: "Visit Herbalist Anise in Oakhaven to acquire protection for the swamp.",
            requirement: { type: 'talk', poiId: 'oakhaven_herblore_shop', npcName: 'Herbalist Anise' }
        },
        {
            description: "Travel to the Serpent's Coil entrance and venture into the murky delta.",
            requirement: { type: 'talk', poiId: 'serpents_coil_entrance', npcName: 'Venture Deeper' }
        },
        {
            description: "Navigate the dense mangroves to locate the Serpent Nesting Ground.",
            requirement: { type: 'talk', poiId: 'mangrove_thicket_west', npcName: 'Muddy Tracks' }
        },
        {
            description: "Confront or bypass the Bandit Scout guarding the deeper swamp.",
            requirement: { type: 'talk', poiId: 'mangrove_thicket_west', npcName: 'Bandit Scout' }
        },
        {
            description: "Follow the submerged causeway to discover the Sunken Temple.",
            requirement: { type: 'talk', poiId: 'sunken_temple_approach', npcName: 'Submerged Causeway' }
        },
        {
            description: "Confront the Coilmaster, Garath Voss, and secure proof of his operations.",
            requirement: { type: 'talk', poiId: 'sunken_temple_altar', npcName: 'Garath Voss' }
        },
        {
            description: "Return to Captain Elara at the Oakhaven West Gate with the evidence.",
            requirement: { type: 'talk', poiId: 'oakhaven_west_gate', npcName: 'Guard Captain Elara' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Agility, amount: 5000 }, { skill: SkillName.Thieving, amount: 3000 }],
        coins: 5000,
    },
    requirements: {
        quests: ['capitals_call'],
        skills: [
            { skill: SkillName.Agility, level: 30 },
            { skill: SkillName.Thieving, level: 45 }
        ],
        notes: ["Bring Antipoison or prepare for high-damage environments.", "High agility will help bypass traps in the swamp."]
    },
    dialogueEntryPoints: [
        {
            npcName: 'Guard Captain Elara',
            response: {
                text: "I've been adventuring for a while, have you found any more leads on the Serpent Bandits?",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'not_started' }], successNode: 'elara_scales_intro', failureNode: '' }
            }
        },
        {
            npcName: 'Guard Captain Elara',
            response: {
                text: "I have news about the Coilmaster.",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 7 }], successNode: 'elara_scales_return', failureNode: '' }
            }
        },
        {
            npcName: 'Bronn the Retired Adventurer',
            response: {
                text: "Captain Elara mentioned you know about the Serpent Bandits.",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 0 }], successNode: 'bronn_scales_prep', failureNode: '' }
            }
        },
        {
            npcName: 'Herbalist Anise',
            response: {
                text: "Bronn said you could help me prepare for the Serpent's Coil.",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 1 }], successNode: 'anise_scales_prep', failureNode: '' }
            }
        },
        {
            npcName: 'Venture Deeper',
            response: {
                text: "(Enter the murky delta)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 2 }, { type: 'variable', name: 'swamp_ward_burned', value: 1, operator: 'eq' }], successNode: 'venture_deeper_node', failureNode: 'venture_deeper_no_burn' }
            }
        },
        {
            npcName: 'Muddy Tracks',
            response: {
                text: "(Inspect the tracks)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 3 }], successNode: 'muddy_tracks_node', failureNode: '' }
            }
        },
        {
            npcName: 'Bandit Scout',
            response: {
                text: "(Approach the Scout)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 4 }], successNode: 'scout_encounter', failureNode: '' }
            }
        },
        {
            npcName: 'Submerged Causeway',
            response: {
                text: "(Follow the causeway)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 5 }], successNode: 'causeway_node', failureNode: '' }
            }
        },
        {
            npcName: 'Garath Voss',
            response: {
                text: "(Approach Garath Voss)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 6 }], successNode: 'voss_encounter', failureNode: '' }
            }
        }
    ],
    // The dialog nodes handle the heavy narrative lifting.
    dialogue: {
        elara_scales_intro: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "You have excellent timing. Yes, we do. A merchant named Corvin Aldrecht staggered into the gate an hour ago. He was extorted by them on the southern road. But he heard something—a voice coordinating them. A man they call the Coilmaster.",
            responses: [
                { text: "The Serpent Bandits?", next: 'elara_scales_lore_bandits' },
                { text: "Is the merchant going to live?", next: 'elara_scales_lore_aldrecht' },
                { text: "Get to the point.", next: 'elara_scales_briefing_1' }
            ],
            conditionalResponses: []
        },
        elara_scales_lore_bandits: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "They operate out of the Serpent's Coil. Most assume they're simple highwaymen, but Bronn warned me they are a remnant of something older. They control the deep terrain. The 'Coilmaster' is their leader—a title we haven't heard in sixty years.",
            responses: [
                { text: "Is the merchant going to live?", next: 'elara_scales_lore_aldrecht' },
                { text: "What do you need me to do?", next: 'elara_scales_briefing_1' }
            ]
        },
        elara_scales_lore_aldrecht: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "He'll survive. But he was stripped of a year's wages just for safe passage. He said the bandits didn't act like thugs; they acted like soldiers. Coordinated. Disciplined. Led by a single, precise voice.",
            responses: [
                { text: "The Serpent Bandits?", next: 'elara_scales_lore_bandits' },
                { text: "What do you need me to do?", next: 'elara_scales_briefing_1' }
            ]
        },
        elara_scales_briefing_1: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "They are deep in the Serpent's Coil. They aren't just brigands, they're structured like a military legion. I can't send my guards into that terrain, but you... you've survived worse. I need you to find this Coilmaster.",
            responses: [
                { text: "What do I bring back?", next: 'elara_scales_briefing_2' }
            ]
        },
        elara_scales_briefing_2: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "Proof of who leads them, if you can get it cleanly. A name, a document, a seal. The Serpent's Coil is lethal. Speak to Bronn in the tavern if you want to know what you're up against, or Herbalist Anise for supplies. They might keep you alive. Good luck.",
            responses: [
                { text: "I'll find him.", actions: [{ type: 'start_quest', questId: 'scales_of_the_swamp' as any }] },
                { text: "I need to prepare first." }
            ]
        },

        // Bronn's optional prep path
        bronn_scales_prep: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "The Serpent Bandits. I've been waiting for someone to ask me about them properly. They aren't mere thieves. They are a remnant of something older... and they are patient. They think in decades.",
            responses: [
                { text: "What about the Coilmaster?", next: 'bronn_scales_prep_2' }
            ]
        },
        bronn_scales_prep_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "A title I haven't heard in sixty years. If he exists, he'll lead with an offer. That's how they operate. Don't dismiss it immediately—listen to his reasons. Also, talk to Anise. She knows the ecology, and the ecology is what will kill you first.",
            responses: [
                { text: "Thanks, Bronn.", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // Anise's prep path
        anise_scales_prep: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "You smell of Elara's boot polish and midnight. Going to the Coil? Take this waxy bundle. Burn it when you enter. The murky delta is choked with a toxic fog that will make you walk into sinkholes otherwise. Keep your wits about you.",
            responses: [
                { text: "I'll be careful.", actions: [{ type: 'give_item', itemId: 'swamp_ward_bundle', quantity: 1 }, { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // Stage 2: Venture Deeper
        venture_deeper_no_burn: {
            npcIcon: '/assets/npcChatHeads/venture_deeper.png',
            npcName: 'Venture Deeper',
            text: "(The miasma is too thick to see through. You need to burn the Swamp Ward Bundle before entering.)",
            responses: [
                { text: "(Step back)" }
            ]
        },
        venture_deeper_node: {
            npcIcon: '/assets/npcChatHeads/venture_deeper.png',
            npcName: 'Venture Deeper',
            text: "(The burnt Swamp Ward Bundle's smoke parts the miasma perfectly. You step forward into the deeper swamp.)",
            responses: [
                { text: "(Enter the Swamp)", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // Stage 3: Muddy Tracks
        muddy_tracks_node: {
            npcIcon: '/assets/npcChatHeads/muddy_tracks.png',
            npcName: 'Muddy Tracks',
            text: "(You find deep, fresh footprints in the mud. They are organized, not the chaotic scatter of animals. They lead toward the Nesting Ground.)",
            responses: [
                { text: "(Follow the tracks)", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // The Scout Encounter
        scout_encounter: {
            npcName: 'Bandit Scout',
            npcIcon: '/assets/npcChatHeads/bandit.png',
            text: "(The scout is perfectly still. He does not draw his weapon, but he watches you intensely.)",
            responses: [
                { text: "[Interrogate] I'm here for the Coilmaster.", next: 'scout_interrogate_1' },
                { text: "[Release] (Slowly step back and take the long way around.)", next: 'scout_release_1' }
            ]
        },
        scout_interrogate_1: {
            npcName: 'Bandit Scout',
            npcIcon: '/assets/npcChatHeads/bandit.png',
            text: "That name is not used here... but we both know who you mean. Follow the submerged causeway to the Sunken Temple. Do not step off it. He will know you are coming.",
            responses: [
                {
                    text: "Understood.", actions: [
                        { type: 'set_variable', name: 'scout_path', value: 'interrogated' },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },
        scout_release_1: {
            npcName: 'Bandit Scout',
            npcIcon: '/assets/npcChatHeads/bandit.png',
            text: "(The scout acknowledges your withdrawal. You take the long way around, costing time but avoiding a fight.)",
            responses: [
                {
                    text: "(Leave)", actions: [
                        { type: 'set_variable', name: 'scout_path', value: 'avoided' },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },

        // Stage 5: Submerged Causeway
        causeway_node: {
            npcIcon: '/assets/npcChatHeads/causeway.png',
            npcName: 'Submerged Causeway',
            text: "(The stone path is submerged but solid. It leads directly toward a looming structure in the distance—the Sunken Temple.)",
            responses: [
                { text: "(Follow the causeway)", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // Garath Voss (Coilmaster) Encounter
        voss_encounter: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "You are the one from Oakhaven. My scout said you moved with intelligence. My name is Garath Voss. The outside world calls me the Coilmaster. Come inside.",
            responses: [
                { text: "Why are you attacking the roads?", next: 'voss_explain_roads' },
                { text: "You run the Serpent Bandits.", next: 'voss_explain_bandits' },
                { text: "(Follow him)", next: 'voss_dialogue_1' }
            ]
        },
        voss_explain_roads: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "We do not 'attack' the roads. We regulate them. The kingdom's reach ends where the swamp begins. We provide passage for those who cannot navigate the Coil themselves, and we charge a toll for that service. It is a necessary friction.",
            responses: [
                { text: "You run the Serpent Bandits.", next: 'voss_explain_bandits' },
                { text: "(Follow him)", next: 'voss_dialogue_1' }
            ]
        },
        voss_explain_bandits: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "We are not bandits. We are the stewards of the Coil. This swamp is lethal, and it swallows armies. My people know its currents, its poisons, and its paths. We are organized because survival here demands absolute discipline.",
            responses: [
                { text: "Why are you attacking the roads?", next: 'voss_explain_roads' },
                { text: "(Follow him)", next: 'voss_dialogue_1' }
            ]
        },
        voss_dialogue_1: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "The bridge was sabotaged on my order. But what Elara didn't find was the reason. Three nights prior, an unmarked, armored convoy moved across it at midnight. Sixteen carts. Moving prisoners or contraband for the King, completely off the books.",
            responses: [
                { text: "Are you sure it was the King?", next: 'voss_explain_king' },
                { text: "What was in the carts?", next: 'voss_explain_carts' },
                { text: "You still extort merchants.", next: 'voss_dialogue_2' }
            ]
        },
        voss_explain_king: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "Only someone with royal authority can move sixteen unmarked carts across a guarded bridge without a single record appearing in the road captain's log. My people in Silverhaven confirmed it. It was sanctioned from the very top.",
            responses: [
                { text: "What was in the carts?", next: 'voss_explain_carts' },
                { text: "You still extort merchants.", next: 'voss_dialogue_2' }
            ]
        },
        voss_explain_carts: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "I do not know, and that is what worries me. Carts of that size, moving under maximum security and total secrecy... it is the kind of transport used for human beings who are not traveling voluntarily. Or weapons that shouldn't exist.",
            responses: [
                { text: "Are you sure it was the King?", next: 'voss_explain_king' },
                { text: "You still extort merchants.", next: 'voss_dialogue_2' }
            ]
        },
        voss_dialogue_2: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "Yes. I will not dress it up. Services have a cost. But the question is: is my extortion worse than officially sanctioned, secret royal convoys moving in the night?",
            responses: [
                { text: "[Sympathize] You might be right. But I still need proof to bring to Elara.", next: 'voss_sympathize_1' },
                { text: "[Challenge] Extortion is extortion. I want your confession, or we end this here.", next: 'voss_challenge_1' }
            ]
        },
        voss_sympathize_1: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "(Voss's posture relaxes slightly) You see the larger board. That is rare. The kingdom's structure might still be able to correct itself, if the right pressure is applied.",
            responses: [
                { text: "What kind of proof do you have?", next: 'voss_sympathize_2' }
            ]
        },
        voss_sympathize_2: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "There is a sealed document in the chest. It contains everything I know about the convoys—dates, cargo estimates, and witness names in Silverhaven. Take it to Elara.",
            responses: [
                { text: "Why hand this over so easily?", next: 'voss_sympathize_3' }
            ]
        },
        voss_sympathize_3: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "Because I am tired. And because you are the first person to enter this swamp who was willing to listen rather than just swing a blade. Tell Elara I offer my witnesses in exchange for a negotiated settlement.",
            responses: [
                {
                    text: "I'll take it to her.", actions: [
                        { type: 'set_variable', name: 'scales_resolution', value: 'evidence' },
                        { type: 'give_item', itemId: 'sealed_convoy_document', quantity: 1 },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },
        voss_challenge_1: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "(Voss's tone remains careful, not angry) You would reduce the significance of the convoys to focus on a few extorted merchants? You operate on a very narrow moral compass.",
            responses: [
                { text: "You operate on terror and financial coercion, dressed up as philosophy.", next: 'voss_challenge_2' }
            ]
        },
        voss_challenge_2: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "I have known enough governors to know the difference between crime and governance. But I have no desire to find out which of us is better at fighting in a flooded temple.",
            responses: [
                { text: "Then sign a written confession about the convoys. Hand over your badge.", next: 'voss_challenge_3' }
            ]
        },
        voss_challenge_3: {
            npcName: 'Garath Voss',
            npcIcon: '/assets/npcChatHeads/garath_voss.png',
            text: "In exchange, you tell Elara I cooperated and requested the extortion be addressed through negotiation rather than military action? (He pauses) You have leverage. I will sign.",
            responses: [
                {
                    text: "Deal.", actions: [
                        { type: 'set_variable', name: 'scales_resolution', value: 'confrontation' },
                        { type: 'give_item', itemId: 'voss_signed_testimony', quantity: 1 },
                        { type: 'give_item', itemId: 'bandit_iron_badge', quantity: 1 },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },

        // Return to Elara
        elara_scales_return: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "You're back. Did you find him?",
            responses: [],
            conditionalResponses: [
                {
                    text: "I have a sealed document from Garath Voss.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'evidence', operator: 'eq' }] },
                    next: 'elara_scales_evidence_resolution'
                },
                {
                    text: "I have his signed testimony and a scout's badge.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' }] },
                    next: 'elara_scales_confrontation_resolution'
                }
            ]
        },
        elara_scales_evidence_resolution: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "(Elara breaks the seal and reads the document. Her face pales.) Convoy movements. Witnesses in Silverhaven... He claims the King is moving unmarked carts through the night.",
            responses: [
                { text: "Have you heard anything about these convoys?", next: 'elara_evidence_convoys' },
                { text: "He wants a negotiated settlement.", next: 'elara_evidence_negotiate' }
            ]
        },
        elara_evidence_convoys: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "Only rumors. Late-night riders passing through Oakhaven without stopping. Supply requisitions that don't match the garrison sizes. I thought it was just bureaucratic rot... not this. Not secret prisoners or weapons.",
            responses: [
                { text: "He wants a negotiated settlement.", next: 'elara_evidence_negotiate' }
            ]
        },
        elara_evidence_negotiate: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "A settlement with a bandit who knows royal secrets. This is far above my rank. I will write to the Road Surveyor in Silverhaven. The network remains, but you've done what I asked. Go rest, and keep this quiet.",
            responses: [
                {
                    text: "Understood, Captain.", actions: [
                        { type: 'take_item', itemId: 'sealed_convoy_document', quantity: 1 },
                        { type: 'complete_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },
        elara_scales_confrontation_resolution: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "You forced a confession out of him... (She reads the signed testimony). He admits to the extortion, but he claims he's sabotaging secret royal convoys. He is a different problem than a simple bandit.",
            responses: [
                { text: "Are there actually secret convoys?", next: 'elara_confrontation_convoys' },
                { text: "Why do you need to talk to Bronn?", next: 'elara_confrontation_bronn' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_convoys: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "I'm just a Captain in Oakhaven, but... yes. I've seen riders wearing the King's black insignia moving past the gates long after curfew. No logs. No inspections. If Voss is fighting them, this isn't just crime. It's a shadow war.",
            responses: [
                { text: "Why do you need to talk to Bronn?", next: 'elara_confrontation_bronn' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_bronn: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "Bronn warned me about the 'Coilmaster' title years ago. He knew it was an old mantle, passed down to steward the swamp. If he knew this much about Voss, he might know what the King is moving in those carts.",
            responses: [
                { text: "Are there actually secret convoys?", next: 'elara_confrontation_convoys' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_end: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "I will send this testimony to the Magistrates in Silverhaven. It forces their hand. They have to acknowledge Voss, which means they have to acknowledge the convoys. You did well. Stay sharp, the roads might get dangerous.",
            responses: [
                {
                    text: "Understood, Captain.", actions: [
                        { type: 'take_item', itemId: 'voss_signed_testimony', quantity: 1 },
                        { type: 'take_item', itemId: 'bandit_iron_badge', quantity: 1 },
                        { type: 'complete_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        }
    }
};
