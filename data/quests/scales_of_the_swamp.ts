import { type } from 'os';
import { Quest, SkillName } from '../../types';

export const scalesOfTheSwamp: Quest = {
    id: 'scales_of_the_swamp' as any, // Cast as any here to avoid cyclic type error before it's registered in index.ts
    name: "Scales of the Swamp",
    description: "Captain Elara has uncovered more about the Serpent Bandits and their leader, the Coilmaster. Journey into the murky depths of the Serpent's Coil to find him.",
    startHint: "Speak to Guard Captain Elara at the Oakhaven West Gate.",
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
            description: "Follow the submerged causeway at the Sunken Temple Approach to discover the Sunken Temple.",
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
    npcDefs: {
        guard_captain_elara: { npcName: 'Guard Captain Elara', npcIcon: 'person' },
        bronn_the_retired_adventurer: { npcName: 'Bronn the Retired Adventurer', npcIcon: 'person' },
        herbalist_anise: { npcName: 'Herbalist Anise', npcIcon: 'person' },
        bandit_scout: { npcName: 'Bandit Scout', npcIcon: 'person' },
        garath_voss: { npcName: 'Garath Voss', npcIcon: 'person' },
        venture_deeper: { npcName: 'Venture Deeper', npcIcon: 'magnifying-glass' },
        muddy_tracks: { npcName: 'Muddy Tracks', npcIcon: 'magnifying-glass' },
        submerged_causeway: { npcName: 'Submerged Causeway', npcIcon: 'person' },
    },

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
    cleanupQuestVariables: ['scout_path', 'scales_resolution', 'swamp_ward_burned'],
    dialogueEntryPoints: [
        {
            npcName: 'Guard Captain Elara',
            response: {
                text: "I've been adventuring for a while, have you found any more leads on the Serpent Bandits?",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'not_started' }, { type: 'quest', questId: 'capitals_call', status: 'completed' }], successNode: 'elara_scales_intro', failureNode: '' }
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
            npcName: 'Herbalist Anise',
            response: {
                text: "I need another swamp ward bundle.",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 2 }, { type: 'variable', name: 'swamp_ward_burned', value: 1, operator: 'eq' }], successNode: 'anise_lost_ward', failureNode: '' }
            }
        },
        {
            npcName: 'Venture Deeper',
            response: {
                text: "(Enter the murky delta)",
                check: { requirements: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 2 }, { type: 'variable', name: 'swamp_ward_burned', value: 1, operator: 'eq' }], successNode: 'venture_deeper_node', failureNode: 'venture_deeper_no_burn_var' }
            }
        },




    ],
    // The dialog nodes handle the heavy narrative lifting.
    dialogue: {
        elara_scales_intro: {
            npc: 'guard_captain_elara',
            text: "You have excellent timing. Yes, we do. A merchant named Corvin Aldrecht staggered into the gate an hour ago. He was extorted by them on the southern road. But he heard something—a voice coordinating them. A man they call the Coilmaster.",
            responses: [
                { text: "The Serpent Bandits?", next: 'elara_scales_lore_bandits' },
                { text: "Is the merchant going to live?", next: 'elara_scales_lore_aldrecht' },
                { text: "Get to the point.", next: 'elara_scales_briefing_1' }
            ],
            conditionalResponses: []
        },
        elara_scales_lore_bandits: {
            npc: 'guard_captain_elara',
            text: "They operate out of the Serpent's Coil. Most assume they're simple highwaymen, but Bronn warned me they are a remnant of something older. They control the deep terrain. The 'Coilmaster' is their leader—a title we haven't heard in sixty years.",
            responses: [
                { text: "Is the merchant going to live?", next: 'elara_scales_lore_aldrecht' },
                { text: "What do you need me to do?", next: 'elara_scales_briefing_1' }
            ]
        },
        elara_scales_lore_aldrecht: {
            npc: 'guard_captain_elara',
            text: "He'll survive. But he was stripped of a year's wages just for safe passage. He said the bandits didn't act like thugs; they acted like soldiers. Coordinated. Disciplined. Led by a single, precise voice.",
            responses: [
                { text: "The Serpent Bandits?", next: 'elara_scales_lore_bandits' },
                { text: "What do you need me to do?", next: 'elara_scales_briefing_1' }
            ]
        },
        elara_scales_briefing_1: {
            npc: 'guard_captain_elara',
            text: "They are deep in the Serpent's Coil. They aren't just brigands, they're structured like a military legion. I can't send my guards into that terrain, but you... you've survived worse. I need you to find this Coilmaster.",
            responses: [
                { text: "What do I bring back?", next: 'elara_scales_briefing_2' }
            ]
        },
        elara_scales_briefing_2: {
            npc: 'guard_captain_elara',
            text: "Proof of who leads them, if you can get it cleanly. A name, a document, a seal. The Serpent's Coil is lethal. Speak to Bronn in the tavern if you want to know what you're up against, or Herbalist Anise for supplies. They might keep you alive. Good luck.",
            responses: [
                { text: "I'll find him.", actions: [{ type: 'start_quest', questId: 'scales_of_the_swamp' as any }] },
                { text: "I need to prepare first." }
            ]
        },

        // Bronn's optional prep path
        bronn_scales_prep: {
            npc: 'bronn_the_retired_adventurer',
            text: "The Serpent Bandits. I've been waiting for someone to ask me about them properly. They aren't mere thieves. They are a remnant of something older... and they are patient. They think in decades.",
            responses: [
                { text: "What about the Coilmaster?", next: 'bronn_scales_prep_2' }
            ]
        },
        bronn_scales_prep_2: {
            npc: 'bronn_the_retired_adventurer',
            text: "A title I haven't heard in sixty years. If he exists, he'll lead with an offer. That's how they operate. Don't dismiss it immediately—listen to his reasons. Also, talk to Anise. She knows the ecology, and the ecology is what will kill you first.",
            responses: [
                { text: "Thanks, Bronn.", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },

        // Anise's prep path
        anise_scales_prep: {
            npc: 'herbalist_anise',
            text: "You smell of Elara's boot polish and midnight. Going to the Coil? I have what you need—a waxy bundle. Burn it when you enter. The murky delta is choked with a toxic fog that'll walk you straight into a sinkhole otherwise.\n\nIt'll cost you 150 coins. Fresh ingredients don't come free.",
            responses: [
                {
                    text: "150 coins. Fine. (Pay)",
                    check: {
                        requirements: [{ type: 'coins', amount: 150 }],
                        successNode: 'anise_scales_paid',
                        failureNode: 'anise_scales_no_gold'
                    }
                },
                { text: "I don't have that kind of coin right now." }
            ]
        },

        anise_scales_paid: {
            npc: 'herbalist_anise',
            text: "Keep your wits about you. The Coil doesn't forgive foolishness.",
            responses: [
                { text: "I'll be careful.", actions: [{ type: 'take_coins', amount: 150 }, { type: 'give_item', itemId: 'swamp_ward_bundle', quantity: 1 }, { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }] }
            ]
        },
        anise_lost_ward: {
            npc: 'herbalist_anise',
            text: "Another one? Hmph. Fine. I've got one more, but it'll cost you another 150 coins.",
            responses: [
                {
                    text: "150 coins. Fine. (Pay)",
                    check: {
                        requirements: [{ type: 'coins', amount: 150 }],
                        successNode: 'anise_scales_paid_no_advance',
                        failureNode: 'anise_scales_no_gold'
                    }
                },
                { text: "I don't have that kind of coin right now." }
            ]
        },
        anise_scales_paid_no_advance: {
            npc: 'herbalist_anise',
            text: "Keep your wits about you. The Coil doesn't forgive foolishness.",
            responses: [
                { text: "(Continue)", actions: [{ type: 'take_coins', amount: 150 }, { type: 'give_item', itemId: 'swamp_ward_bundle', quantity: 1 }] }
            ]
        },

        anise_scales_no_gold: {
            npc: 'herbalist_anise',
            text: "150 coins. I'm not running a charity. Come back when you have the coin.",
            responses: [
                { text: "(Continue)" }
            ]
        },

        // Stage 2: Venture Deeper
        venture_deeper_start: {
            npc: 'venture_deeper',
            text: "(As you step closer to the swamp entrance, a putrid smell erupts from the gasses. A thick miasma is covering the swamp, Anise mentioned that the Swamp Ward Bundle after being burned, will clear up this foul miasma.)",
            responses: [
                {
                    text: "(Burn the Swamp Ward Bundle)",
                    check: {
                        requirements: [
                            { type: 'items', items: [{ itemId: 'tinderbox', quantity: 1 }, { itemId: 'swamp_ward_bundle', quantity: 1 }] }
                        ],
                        successNode: 'venture_deeper_node',
                        failureNode: 'venture_deeper_no_burn'
                    }
                },
                { text: "(Step back)" }
            ]
        },
        venture_deeper_no_burn: {
            npc: 'venture_deeper',
            text: "(You lack either a Swamp Ward Bundle or a tinderbox to light it.)",
            responses: [
                { text: "(Continue)" }
            ]
        },
        venture_deeper_no_burn_var: {
            npc: 'venture_deeper',
            text: "(The foul miasma's stench is unbearable, it pushes you back and you do not continue.)",
            responses: [
                { text: "(Continue)" }
            ]
        },
        venture_deeper_node: {
            npc: 'venture_deeper',
            text: "(The burnt Swamp Ward Bundle's smoke parts the miasma perfectly. You step forward into the deeper swamp.)",
            responses: [
                {
                    text: "(Continue)",
                    actions: [
                        { type: 'take_item', itemId: 'swamp_ward_bundle', quantity: 1 },
                        { type: 'set_variable', name: 'swamp_ward_burned', value: 1 },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any }
                    ]
                }
            ]
        },

        // Stage 3: Muddy Tracks
        muddy_tracks_node: {
            npc: 'muddy_tracks',
            text: "(You find deep, fresh footprints in the mud. They are organized, not the chaotic scatter of animals. They lead toward the Nesting Ground.)",
            responses: [
                { text: "(Follow the tracks)", actions: [{ type: 'advance_quest', questId: 'scales_of_the_swamp' as any }, { type: 'teleport', poiId: 'serpent_nesting_ground' }] }
            ]
        },

        // The Scout Encounter
        scout_encounter: {
            npc: 'bandit_scout',
            text: "(You spot a figure perched perfectly still in the mangrove canopy. His hand rests lightly on a bone horn. One breath and he could alert the entire swamp. He watches you, waiting for your move.)",
            responses: [
                { text: "[Intimidate] Blow that horn and you won't live to hear it. I'm here for the Coilmaster.", next: 'scout_intimidate' },
                {
                    text: "[Bribe - 500 Coins] We don't need to make this bloody. Take this and forget you saw me.",
                    check: {
                        requirements: [{ type: 'coins', amount: 500 }],
                        successNode: 'scout_bribe',
                        failureNode: 'scout_bribe_fail'
                    }
                },
                { text: "[Withdraw] (Slowly back away into the fog and find a different route.)", next: 'scout_withdraw' }
            ]
        },
        scout_intimidate: {
            npc: 'bandit_scout',
            text: "(The scout's eyes narrow. He gauges your stance, your weapons, and the coldness in your voice. He slowly lowers his hand from the horn.)\n\nThat name is forbidden. But... I was told someone like you might come. Follow the submerged causeway to the Sunken Temple. Do not step off the path, or the swamp will take you.",
            responses: [
                {
                    text: "(Continue)", actions: [
                        { type: 'set_variable', name: 'scout_path', value: 'intimidated' },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any },
                        { type: 'teleport', poiId: 'sunken_temple_approach' }
                    ]
                }
            ]
        },
        scout_bribe: {
            npc: 'bandit_scout',
            text: "(The scout glances at the coin purse. A small smirk breaks his stoic expression as he catches it. He points a finger eastward.)\n\nThe Sunken Temple. Follow the submerged causeway. And friend... keep your weapons sheathed when you arrive.",
            responses: [
                {
                    text: "(Continue)", actions: [
                        { type: 'take_coins', amount: 500 },
                        { type: 'set_variable', name: 'scout_path', value: 'bribed' },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any },
                        { type: 'teleport', poiId: 'sunken_temple_approach' }
                    ]
                }
            ]
        },
        scout_bribe_fail: {
            npc: 'bandit_scout',
            text: "(You reach for your purse, but realize you don't have enough coin. The scout's hand tightens on the horn.)\n\nEmpty promises. Leave now, or I sound the alarm.",
            responses: [
                { text: "(Step back)", next: 'scout_encounter' }
            ]
        },
        scout_withdraw: {
            npc: 'bandit_scout',
            text: "(You keep your hands visible and slowly step back into the thick mist. The scout doesn't move, but his eyes track you until you vanish. Hours pass as you wade through the treacherous deep mud, taking the long way around. Eventually, you emerge at the submerged causeway—the stone path leading toward the Sunken Temple is visible ahead.)",
            responses: [
                {
                    text: "(Follow the causeway)", actions: [
                        { type: 'set_variable', name: 'scout_path', value: 'avoided' },
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any },
                        { type: 'teleport', poiId: 'sunken_temple_approach' }
                    ]
                }
            ]
        },

        // Stage 5: Submerged Causeway
        causeway_node: {
            npc: 'submerged_causeway',
            text: "(The stone path is submerged but solid. It leads directly toward a looming structure in the distance—the Sunken Temple.)",
            responses: [
                {
                    text: "(Follow the causeway)",
                    actions: [
                        { type: 'advance_quest', questId: 'scales_of_the_swamp' as any },
                        { type: 'teleport', poiId: 'sunken_temple_altar' }
                    ]
                }
            ]
        },

        voss_default: {
            npc: 'garath_voss',
            text: "The swamp does not welcome visitors, yet here you are.",
            responses: []
        },
        voss_altar_stage6_greeting: {
            npc: 'garath_voss',
            text: "The swamp has many eyes, traveler. I knew when you entered the mangroves, and I know why you are here. But this altar is too exposed. Let's talk in private.",
            responses: [],
            conditionalResponses: [
                {
                    text: "(Approach)",
                    check: { requirements: [{ type: 'variable', name: 'scout_path', value: 'intimidated', operator: 'eq' }] },
                    next: 'voss_encounter_intimidated'
                },
                {
                    text: "(Approach)",
                    check: { requirements: [{ type: 'variable', name: 'scout_path', value: 'bribed', operator: 'eq' }] },
                    next: 'voss_encounter_bribed'
                },
                {
                    text: "(Approach)",
                    check: { requirements: [{ type: 'variable', name: 'scout_path', value: 'avoided', operator: 'eq' }] },
                    next: 'voss_encounter_avoided'
                }
            ]
        },
        voss_interior_leave: {
            npc: 'garath_voss',
            text: "(Voss gestures toward the passage back to the altar.)\n\nI'll be here when you're ready to talk further. The altar is just back through the passage.",
            responses: [
                { text: "(Return to the Temple Altar)", actions: [{ type: 'teleport', poiId: 'sunken_temple_altar' }] }
            ]
        },
        voss_interior_reenter: {
            npc: 'garath_voss',
            text: "(You squeeze back through the flooded gap in the temple wall, returning to Voss's private chamber.)",
            responses: [
                { text: "(Continue)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_stage7_retrieve: {
            npc: 'garath_voss',
            text: "You're back. Did you lose the proof I gave you? The swamp is unforgiving, but we cannot afford to lose that evidence.",
            responses: [],
            conditionalResponses: [
                {
                    text: "I lost the sealed convoy document.",
                    check: {
                        requirements: [
                            { type: 'variable', name: 'scales_resolution', value: 'evidence', operator: 'eq' },
                            { type: 'items', items: [{ itemId: 'sealed_convoy_document', quantity: 1, operator: 'lt' }] }
                        ]
                    },
                    next: 'voss_reissue_evidence'
                },
                {
                    text: "I lost your signed testimony.",
                    check: {
                        requirements: [
                            { type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' },
                            { type: 'items', items: [{ itemId: 'voss_signed_testimony', quantity: 1, operator: 'lt' }] }
                        ]
                    },
                    next: 'voss_reissue_testimony'
                },
                {
                    text: "I lost the bandit iron badge.",
                    check: {
                        requirements: [
                            { type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' },
                            { type: 'items', items: [{ itemId: 'bandit_iron_badge', quantity: 1, operator: 'lt' }] }
                        ]
                    },
                    next: 'voss_reissue_badge'
                },
                {
                    text: "No, I still have it.",
                    check: {
                        requirements: [
                            { type: 'variable', name: 'scales_resolution', value: 'evidence', operator: 'eq' },
                            { type: 'items', items: [{ itemId: 'sealed_convoy_document', quantity: 1, operator: 'gte' }] }
                        ]
                    },
                    next: 'voss_stage7_still_have'
                },
                {
                    text: "No, I still have it.",
                    check: {
                        requirements: [
                            { type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' },
                            {
                                type: 'items', items: [
                                    { itemId: 'voss_signed_testimony', quantity: 1, operator: 'gte' },
                                    { itemId: 'bandit_iron_badge', quantity: 1, operator: 'gte' }
                                ]
                            }
                        ]
                    },
                    next: 'voss_stage7_still_have'
                }
            ]
        },
        voss_stage7_still_have: {
            npc: 'garath_voss',
            text: "Then why did you crawl back through the mud? The Royal Council is moving secret cargo right under Oakhaven's nose, and you're treating my hideout like a traveler's inn. Take the evidence to Captain Elara, now, before it's too late.",
            responses: [
                { text: "(Return to the Temple Altar)", actions: [{ type: 'teleport', poiId: 'sunken_temple_altar' }] }
            ]
        },
        voss_reissue_evidence: {
            npc: 'garath_voss',
            text: "Here is another copy of the convoy document. Keep it safe this time—our future depends on it getting to Elara.",
            responses: [
                {
                    text: "Thank you.",
                    actions: [
                        { type: 'give_item', itemId: 'sealed_convoy_document', quantity: 1 }
                    ],
                    next: 'voss_interior_leave'
                }
            ]
        },
        voss_reissue_testimony: {
            npc: 'garath_voss',
            text: "Here is another copy of my signed testimony. Keep it safe—it is the only proof of my cooperation.",
            responses: [
                {
                    text: "(Continue)",
                    actions: [
                        { type: 'give_item', itemId: 'voss_signed_testimony', quantity: 1 }
                    ],
                    next: 'voss_interior_leave'
                }
            ]
        },
        voss_reissue_badge: {
            npc: 'garath_voss',
            text: "Here is another scout badge. Keep it hidden—if Oakhaven's guards see you carrying it without my seal, you'll be treated as one of us.",
            responses: [
                {
                    text: "(Continue)",
                    actions: [
                        { type: 'give_item', itemId: 'bandit_iron_badge', quantity: 1 }
                    ],
                    next: 'voss_interior_leave'
                }
            ]
        },


        voss_encounter_intimidated: {
            npc: 'garath_voss',
            text: "My scout told me you put a blade in front of his horn without breaking stride. A blunt instrument, but an effective one. You are direct. I respect that more than you might think. My name is Garath Voss. The outside world calls me the Coilmaster. But we shouldn't speak out in the open like this. Come inside.",
            responses: [
                { text: "I don't trust you.", next: 'voss_not_trust_intimidated' },
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_not_trust_intimidated: {
            npc: 'garath_voss',
            text: "Do you think I care about your trust? Walk away if you want, or follow me. If you want answers about the bandits and the road blocks, they are inside.",
            responses: [
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_encounter_bribed: {
            npc: 'garath_voss',
            text: "My scout sends his regards—and his coin, I suspect, is already spent. You chose the path of least resistance. Practical. My name is Garath Voss. The outside world calls me the Coilmaster. But we shouldn't speak out in the open like this. Come inside.",
            responses: [
                { text: "I don't trust you.", next: 'voss_not_trust_bribed' },
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_not_trust_bribed: {
            npc: 'garath_voss',
            text: "You trusted my scout enough to buy your way in. Why change your tune now? Follow me, or leave. The choice is yours.",
            responses: [
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_encounter_avoided: {
            npc: 'garath_voss',
            text: "My scout tells me you saw him and chose to walk away. To take the long route through the deep mud rather than confront the unknown. Caution or wisdom—I haven't decided which yet. My name is Garath Voss. The outside world calls me the Coilmaster. But we shouldn't speak out in the open like this. Come inside.",
            responses: [
                { text: "I don't trust you.", next: 'voss_not_trust_avoided' },
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_not_trust_avoided: {
            npc: 'garath_voss',
            text: "You waded through miles of deep swamp to get here. It would be a waste to turn back now. I have no ill will toward you. Let us speak in private inside.",
            responses: [
                { text: "(Follow him)", actions: [{ type: 'teleport', poiId: 'sunken_temple_interior' }] }
            ]
        },
        voss_explain_roads_interior: {
            npc: 'garath_voss',
            text: "We do not 'attack' the roads. We regulate them. The kingdom's reach ends where the swamp begins. We provide passage for those who cannot navigate the Coil themselves, and we charge a toll for that service. It is a necessary friction.",
            responses: [
                { text: "You run the Serpent Bandits.", next: 'voss_explain_bandits_interior' },
                { text: "Let's talk about the convoy.", next: 'voss_dialogue_hub' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_explain_bandits_interior: {
            npc: 'garath_voss',
            text: "We are not bandits. We are the stewards of the Coil. This swamp is lethal, and it swallows armies. My people know its currents, its poisons, and its paths. We are organized because survival here demands absolute discipline.",
            responses: [
                { text: "Why are you attacking the roads?", next: 'voss_explain_roads_interior' },
                { text: "Let's talk about the convoy.", next: 'voss_dialogue_hub' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_1: {
            npc: 'garath_voss',
            text: "Watch your head, the ceiling is low. We have much to discuss, but little time.",
            responses: [
                { text: "Elara wants your head. You'd better have a good explanation.", next: 'voss_dialogue_hub' },
                { text: "Why are you attacking the roads?", next: 'voss_explain_roads_interior' },
                { text: "You run the Serpent Bandits.", next: 'voss_explain_bandits_interior' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_hub: {
            npc: 'garath_voss',
            text: "That convoy is the reason we're sitting in this damp tomb. Elara doesn't see the shadow moving behind the border she guards. The sabotage was to stop what was crossing it.",
            responses: [
                { text: "What shadow?", next: 'voss_dialogue_shadow' },
                { text: "Why are you attacking the roads?", next: 'voss_explain_roads_interior' },
                { text: "You run the Serpent Bandits.", next: 'voss_explain_bandits_interior' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_shadow: {
            npc: 'garath_voss',
            text: "Three nights ago, an unmarked, armored convoy crossed that bridge at midnight. Sixteen heavy carts. No flags, no royal colors. But they moved with high-level military escort.",
            responses: [
                { text: "How do you know it wasn't just common smugglers?", next: 'voss_dialogue_smugglers' },
                { text: "What was in those carts?", next: 'voss_dialogue_reason' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_smugglers: {
            npc: 'garath_voss',
            text: "Smugglers don't have the codes to pass Oakhaven's border guards without a log entry. I have informants in Silverhaven's administrative chambers—they confirmed the transport was signed off from the very top. The Royal Council itself.",
            responses: [
                { text: "What was in those carts?", next: 'voss_dialogue_reason' },
                { text: "So you sabotaged the bridge to stop them?", next: 'voss_dialogue_sabotage' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_reason: {
            npc: 'garath_voss',
            text: "That is the question. Sixteen carts of that size, heavily reinforced. My contact says they were moving prisoners or weapons that don't officially exist. If they wanted to hide it from the regional barons, they'd use the night roads.",
            responses: [
                { text: "How do you know it wasn't just common smugglers?", next: 'voss_dialogue_smugglers' },
                { text: "So you sabotaged the bridge to stop them?", next: 'voss_dialogue_sabotage' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_sabotage: {
            npc: 'garath_voss',
            text: "Precisely. It forced them to reroute, giving my scouts time to watch their path. But it also drew Oakhaven's attention. Now, we are both caught in the middle of a shadow war.",
            responses: [
                { text: "You still extort merchants to fund this.", next: 'voss_dialogue_2' },
                { text: "(Leave)", next: 'voss_interior_leave' }
            ]
        },
        voss_dialogue_2: {
            npc: 'garath_voss',
            text: "Yes. I will not dress it up. Services have a cost. But the question is: is my extortion worse than officially sanctioned, secret royal convoys moving in the night?",
            responses: [
                { text: "[Sympathize] You might be right. But I still need proof to bring to Elara.", next: 'voss_sympathize_1' },
                { text: "[Challenge] Extortion is extortion. I want your confession, or we end this here.", next: 'voss_challenge_1' }
            ]
        },
        voss_sympathize_1: {
            npc: 'garath_voss',
            text: "(Voss's posture relaxes slightly) You see the larger board. That is rare. The kingdom's structure might still be able to correct itself, if the right pressure is applied.",
            responses: [
                { text: "What kind of proof do you have?", next: 'voss_sympathize_2' }
            ]
        },
        voss_sympathize_2: {
            npc: 'garath_voss',
            text: "There is a sealed document in the chest. It contains everything I know about the convoys—dates, cargo estimates, and witness names in Silverhaven. Take it to Elara.",
            responses: [
                { text: "Why hand this over so easily?", next: 'voss_sympathize_3' }
            ]
        },
        voss_sympathize_3: {
            npc: 'garath_voss',
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
            npc: 'garath_voss',
            text: "(Voss's tone remains careful, not angry) You would reduce the significance of the convoys to focus on a few extorted merchants? You operate on a very narrow moral compass.",
            responses: [
                { text: "You operate on terror and financial coercion, dressed up as philosophy.", next: 'voss_challenge_2' }
            ]
        },
        voss_challenge_2: {
            npc: 'garath_voss',
            text: "I have known enough governors to know the difference between crime and governance. But I have no desire to find out which of us is better at fighting in a flooded temple.",
            responses: [
                { text: "Then sign a written confession about the convoys. Hand over your badge.", next: 'voss_challenge_3' }
            ]
        },
        voss_challenge_3: {
            npc: 'garath_voss',
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
            npc: 'guard_captain_elara',
            text: "Good, I hope you brought his head with you... Or something else that can prove his innocence.",
            responses: [],
            conditionalResponses: [
                {
                    text: "He gave me this sealed document?",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'evidence', operator: 'eq' }, { type: 'items', items: [{ itemId: 'sealed_convoy_document', quantity: 1, operator: 'gte' }] }] },
                    next: 'elara_scales_evidence_resolution'
                },
                {
                    text: "I have his signed testimony and a scout's badge.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' }, { type: 'items', items: [{ itemId: 'voss_signed_testimony', quantity: 1, operator: 'gte' }, { itemId: 'bandit_iron_badge', quantity: 1, operator: 'gte' }] }] },
                    next: 'elara_scales_confrontation_resolution'
                },
                {   //Confrontation no items
                    text: "Not quite his head... but I have these (rummages through bag) Oh... I seem to have lost them.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' }, { type: 'items', items: [{ itemId: 'voss_signed_testimony', quantity: 1, operator: 'lt' }] }] },
                    next: 'elara_scales_evidence_lost'
                },
                {   //Confrontation no badge
                    text: "Not quite his head... but I have these (rummages through bag) Oh... I seem to have lost them.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'confrontation', operator: 'eq' }, { type: 'items', items: [{ itemId: 'bandit_iron_badge', quantity: 1, operator: 'lt' }] }] },
                    next: 'elara_scales_evidence_lost'
                },
                {   //Evidence no items
                    text: "He gave me a sealed document. (Rustles through bag) I think... I think I lost it.",
                    check: { requirements: [{ type: 'variable', name: 'scales_resolution', value: 'evidence', operator: 'eq' }, { type: 'items', items: [{ itemId: 'sealed_convoy_document', quantity: 1, operator: 'lt' }] }] },
                    next: 'elara_scales_evidence_lost'
                }
            ]
        },
        elara_scales_evidence_resolution: {
            npc: 'guard_captain_elara',
            text: "(Elara breaks the seal and reads the document. Her face pales.) Convoy movements. Witnesses in Silverhaven... He claims the King is moving unmarked carts through the night.",
            responses: [
                { text: "Have you heard anything about these convoys?", next: 'elara_evidence_convoys' },
                { text: "He wants a negotiated settlement.", next: 'elara_evidence_negotiate' }
            ]
        },
        elara_scales_evidence_lost: {
            npc: 'guard_captain_elara',
            text: "Lost them? (Elara sighs deeply) The merchants will think you were careless. Or worse, complicit. You should not have taken a risk like that.",
            responses: [
                { text: "I swear I just had the items... let me go find them.", next: 'elara_scales_restart' }
            ]
        },
        elara_evidence_convoys: {
            npc: 'guard_captain_elara',
            text: "Only rumors. Late-night riders passing through Oakhaven without stopping. Supply requisitions that don't match the garrison sizes. I thought it was just bureaucratic rot... not this. Not secret prisoners or weapons.",
            responses: [
                { text: "He wants a negotiated settlement.", next: 'elara_evidence_negotiate' }
            ]
        },
        elara_evidence_negotiate: {
            npc: 'guard_captain_elara',
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
            npc: 'guard_captain_elara',
            text: "You forced a confession out of him... (She reads the signed testimony). He admits to the extortion, but he claims he's sabotaging secret royal convoys. He is a different problem than a simple bandit.",
            responses: [
                { text: "Are there actually secret convoys?", next: 'elara_confrontation_convoys' },
                { text: "Why do you need to talk to Bronn?", next: 'elara_confrontation_bronn' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_convoys: {
            npc: 'guard_captain_elara',
            text: "I'm just a Captain in Oakhaven, but... yes. I've seen riders wearing the King's black insignia moving past the gates long after curfew. No logs. No inspections. If Voss is fighting them, this isn't just crime. It's a shadow war.",
            responses: [
                { text: "Why do you need to talk to Bronn?", next: 'elara_confrontation_bronn' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_bronn: {
            npc: 'guard_captain_elara',
            text: "Bronn warned me about the 'Coilmaster' title years ago. He knew it was an old mantle, passed down to steward the swamp. If he knew this much about Voss, he might know what the King is moving in those carts.",
            responses: [
                { text: "Are there actually secret convoys?", next: 'elara_confrontation_convoys' },
                { text: "What happens now?", next: 'elara_confrontation_end' }
            ]
        },
        elara_confrontation_end: {
            npc: 'guard_captain_elara',
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
