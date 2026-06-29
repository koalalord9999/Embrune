import { Quest, SkillName } from '../../types';

export const theSaintsFirstStep: Quest = {
    id: 'the_saints_first_step',
    name: "The Saint's First Step",
    description: "Brother Thaddeus of Sanctity wishes to teach you a more devout method of honoring the dead, a process known as Intercession, and introduce you to the three divine aspects.",
    requirements: {
        skills: [{ skill: SkillName.Herblore, level: 5 }]
    },
    startHint: "Speak to Brother Thaddeus in the Grand Chapel of Sanctity.",
    playerStagePerspectives: [
        "Brother Thaddeus has asked me to learn Intercession. I need to 'Use' 5 Big Bones on the Chapel Altar to consecrate them, and then speak with him again.", // 0
        "I have consecrated the bones. Now I must grind them into 100 Sacred Dust using the Reliquary Grinder in the chapel.", // 1
        "I have the Sacred Dust. I should show it to Brother Thaddeus.", // 2
        "Thaddeus told me to seek out Sister Seraphina, a hermit in the Wyrmwood Grove, to obtain Anointing Oil.", // 3
        "I have the marleaf. I should return to Sister Seraphina.", // 4
        "The herbs were grimy. I need to clean them and return to Sister Seraphina.", // 5
        "I have the Anointing Oil. I need to mix it with the Sacred Dust to create Holy Paste.", // 6
        "I've created the Holy Paste. I must now offer all 25 pieces of it at the Chapel Altar.", // 7
        "I have completed the offering and received a vision. I should return to Brother Thaddeus to complete my lesson." // 8
    ],
    completionSummary: "I learned the art of Intercession from Brother Thaddeus, a slow but rewarding method of training Prayer. By consecrating bones, grinding them, and anointing the dust, I created a holy offering. Thaddeus was pleased and spoke of greater trials ahead to commune with the gods themselves.",
    stages: [
        { description: "Consecrate 5 Big Bones, then speak to Brother Thaddeus.", requirement: { type: 'talk', poiId: 'sanctity_chapel', npcName: 'Brother Thaddeus' } }, // 0
        { description: "Grind 5 Consecrated Big Bones into Sacred Dust.", requirement: { type: 'gather', items: [{ itemId: 'sacred_dust', quantity: 100 }] } }, // 1
        { description: "Return to Brother Thaddeus with the Sacred Dust.", requirement: { type: 'talk', poiId: 'sanctity_chapel', npcName: 'Brother Thaddeus' } }, // 2
        { description: "Speak to Sister Seraphina in the Wyrmwood Grove.", requirement: { type: 'talk', poiId: 'wg_secluded_clearing', npcName: 'Sister Seraphina' } }, // 3
        { description: "Gather 5 Grimy Marleaf and return to Sister Seraphina.", requirement: { type: 'talk', poiId: 'wg_secluded_clearing', npcName: 'Sister Seraphina' } }, // 4
        { description: "Clean the 5 Grimy Marleaf and bring them to Sister Seraphina.", requirement: { type: 'talk', poiId: 'wg_secluded_clearing', npcName: 'Sister Seraphina' } }, // 5
        { description: "Create 25 Holy Paste by combining Sacred Dust and Anointing Oil.", requirement: { type: 'gather', items: [{ itemId: 'holy_paste', quantity: 25 }] } }, // 6
        { description: "Offer 25 Holy Paste at the Chapel Altar.", requirement: { type: 'offer', itemId: 'holy_paste', quantity: 25, poiId: 'sanctity_chapel', npcName: 'Altar' } }, // 7
        { description: "Return to Brother Thaddeus.", requirement: { type: 'talk', poiId: 'sanctity_chapel', npcName: 'Brother Thaddeus' } } // 8
    ],
    npcDefs: {
        brother_thaddeus: { npcName: 'Brother Thaddeus', npcIcon: 'priest-hat' },
        sister_seraphina: { npcName: 'Sister Seraphina', npcIcon: 'woman-elf-face' },
    },

    rewards: {
        xp: [{ skill: SkillName.Prayer, amount: 2000 }],
        coins: 1000,
    },
    dialogueEntryPoints: [
        {
            npcName: 'Brother Thaddeus',
            response: {
                text: "I have consecrated the bones.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 0 }], successNode: 'tfs_return_after_consecrate', failureNode: '' }
            }
        },
        {
            npcName: 'Brother Thaddeus',
            response: {
                text: "I wish to learn more about the faith.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'not_started' }], successNode: 'tfs_quest_intro', failureNode: '' }
            }
        },
        {
            npcName: 'Brother Thaddeus',
            response: {
                text: "I have the Sacred Dust.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 2 }], successNode: 'tfs_return_after_grind', failureNode: '' }
            }
        },
        {
            npcName: 'Brother Thaddeus',
            response: {
                text: "I have some questions about the Holy Paste...",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 7 }], successNode: 'tfs_offer_paste', failureNode: '' }
            }
        },
        {
            npcName: 'Brother Thaddeus',
            response: {
                text: "I received a vision at the altar.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 8 }], successNode: 'tfs_thaddeus_final', failureNode: '' }
            }
        },
        {
            npcName: 'Sister Seraphina',
            response: {
                text: "Brother Thaddeus sent me.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 3 }], successNode: 'tfs_seraphina_intro', failureNode: '' }
            }
        },
        {
            npcName: 'Sister Seraphina',
            response: {
                text: "I have the herbs you requested.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 4 }], successNode: 'tfs_seraphina_stage4_router', failureNode: '' }
            }
        },
        {
            npcName: 'Sister Seraphina',
            response: {
                text: "I've cleaned the herbs.",
                check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 5 }], successNode: 'tfs_seraphina_stage5_router', failureNode: '' }
            }
        }
    ],
    dialogue: {
        tfs_quest_intro: {
            npc: 'brother_thaddeus',
            text: "I see a spark in you... a potential for more than simple faith. You honor the dead by burying their bones, a common and respectable practice. But there is a deeper path, a way to truly elevate their sacrifice. A path of Intercession.",
            responses: [
                { text: "Intercession? What's that?", next: 'tfs_explain_intercession_new' },
                { text: "This sounds... like messing with the dead. Is it right?", next: 'tfs_moral_conflict' },
                { text: "Why go to all this trouble? Burying bones works fine.", next: 'tfs_wastefulness_question' }
            ]
        },
        tfs_wastefulness_question: {
            npc: 'brother_thaddeus',
            text: "A practical question. Burying bones is a quick prayer, a shout into the void that is heard. Intercession is a reasoned sermon, a direct conversation with the divine. It is slower, yes, but the understanding it brings is far deeper. It is the difference between asking for a blessing and becoming one.",
            responses: [
                { text: "I see. Tell me more about this 'conversation'.", next: 'tfs_explain_intercession_new' }
            ]
        },
        tfs_moral_conflict: {
            npc: 'brother_thaddeus',
            text: "A thoughtful question. It is not desecration, but elevation. Their struggle in life is over. Through this ritual, their physical remnants—the last echo of their strength—can be used to commune with the divine, to seek guidance and power to protect others.",
            responses: [
                { text: "(Continue)", next: 'tfs_moral_conflict_2' }
            ]
        },
        tfs_moral_conflict_2: {
            npc: 'brother_thaddeus',
            text: "Their sacrifice continues to serve the light. It is the greatest honor we can give them, ensuring their legacy is not buried and forgotten, but a foundation upon which a safer world is built.",
            responses: [
                { text: "I understand. Their sacrifice serves a greater purpose.", next: 'tfs_explain_intercession_new' },
                { text: "I'm still not sure about this.", next: 'tfs_moral_conflict_reassurance' }
            ]
        },
        tfs_moral_conflict_reassurance: {
            npc: 'brother_thaddeus',
            text: "Doubt is the companion of a thinking mind. Trust in the process. The intent is one of honor, not exploitation. This is the path to truly understanding the Divine.",
            responses: [
                { text: "Very well. Tell me about Intercession.", next: 'tfs_explain_intercession_new' }
            ]
        },
        tfs_explain_intercession_new: {
            npc: 'brother_thaddeus',
            text: "Intercession is the first step towards undertaking the Divine Trials. These trials are communions with the three primary aspects of the divine that shape our world. Only by understanding them can one truly walk in the light.",
            responses: [
                { text: "Tell me about these 'aspects'.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_explain_aspects_hub: {
            npc: 'brother_thaddeus',
            text: "They are War, the Hunt, and Sorcery. Each is a pillar of existence, a fundamental truth of our reality. Which would you learn of first?",
            responses: [
                { text: "Tell me of War.", next: 'tfs_lore_war_1' },
                { text: "Tell me of the Hunt.", next: 'tfs_lore_hunt_1' },
                { text: "Tell me of Sorcery.", next: 'tfs_lore_sorcery_1' },
                { text: "Why these three aspects? Are there no other gods?", next: 'tfs_lore_other_gods_1' },
                { text: "What if I fail these trials?", next: 'tfs_lore_fail_1' },
                { text: "I am ready to begin the ritual of Intercession.", next: 'tfs_task_1' }
            ],
            conditionalResponses: [
                {
                    text: "I wish to meditate on these aspects.",
                    check: { requirements: [{ type: 'skill', skill: SkillName.Prayer, level: 25 }], successNode: 'tfs_prayer_meditation', failureNode: '' }
                }
            ]
        },
        tfs_lore_other_gods_1: {
            npc: 'brother_thaddeus',
            text: "An astute question. Many cultures worship other, lesser gods—spirits of the hearth, patrons of a particular craft, and so on. But we believe these are simply facets or interpretations of the three great pillars.",
            responses: [
                { text: "(Continue)", next: 'tfs_lore_other_gods_2' }
            ]
        },
        tfs_lore_other_gods_2: {
            npc: 'brother_thaddeus',
            text: "A god of the forge, for example, is an expression of both War's strength and Sorcery's creation. A god of the harvest is an expression of the Hunt's cycle of life. All divinity flows from these three sources. To understand them is to understand the whole.",
            responses: [
                { text: "I see.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_lore_fail_1: {
            npc: 'brother_thaddeus',
            text: "The gods do not seek perfection, child, but sincerity of effort. Failure is simply another lesson on the path. The trials will test you, but they are not designed to destroy you.",
            responses: [
                { text: "(Continue)", next: 'tfs_lore_fail_2' }
            ]
        },
        tfs_lore_fail_2: {
            npc: 'brother_thaddeus',
            text: "However... those who approach the trials with a dark heart, with intent to corrupt or misuse the divine power... they are not merely turned away. They are broken.",
            responses: [
                { text: "I understand.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_prayer_meditation: {
            npc: 'brother_thaddeus',
            text: "You have a strong connection to the divine. Very well. Close your eyes. I will guide your thoughts. The trials are not contests against mortals, but against Avatars—beings of pure aspect. The God of War is not a man, but the concept of righteous battle made manifest. To face it is to face the ultimate test of your own strength and resolve.",
            responses: [
                { text: "I understand.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_lore_war_1: {
            npc: 'brother_thaddeus',
            text: "The Aspect of War is not the god of mindless slaughter. It is the divine will of Strength, Discipline, and Sacrifice. It is the courage to stand against the dark, the discipline to hold the line when all hope seems lost.",
            responses: [
                { text: "(Continue)", next: 'tfs_lore_war_2' }
            ]
        },
        tfs_lore_war_2: {
            npc: 'brother_thaddeus',
            text: "It is honorable combat that tests a warrior's soul, forging them into a shield for the weak. Great heroes of old, like Pregai who fell at the Forgotten Barrow, embodied this aspect. Their sacrifice was a prayer in steel and blood.",
            responses: [
                { text: "I understand.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_lore_hunt_1: {
            npc: 'brother_thaddeus',
            text: "The Hunt is the sacred cycle. It is the wisdom of the predator and the resilience of the prey. It is the understanding that all life feeds on life, not out of malice, but as part of a divine dance that sustains the world.",
            responses: [
                { text: "(Continue)", next: 'tfs_lore_hunt_2' }
            ]
        },
        tfs_lore_hunt_2: {
            npc: 'brother_thaddeus',
            text: "To honor the Hunt is to respect the wild, to survive by your wits and skill, and to understand your place in the great chain. The hermit Sister Seraphina, whom you will soon meet, embodies this aspect. She lives in harmony with the cycle, a true daughter of the grove.",
            responses: [
                { text: "I understand.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_lore_sorcery_1: {
            npc: 'brother_thaddeus',
            text: "Sorcery is the most volatile aspect. It is the raw power of Creation and the terrifying finality of Destruction. It is the untamed energy of the Arcane Weave that mages struggle to command.",
            responses: [
                { text: "(Continue)", next: 'tfs_lore_sorcery_2' }
            ]
        },
        tfs_lore_sorcery_2: {
            npc: 'brother_thaddeus',
            text: "To serve this aspect is to pursue knowledge relentlessly, to understand the immense responsibility that comes with shaping reality itself. Great mages like Elmsworth and Theron walk this dangerous, yet vital, path.",
            responses: [
                { text: "I understand.", next: 'tfs_explain_aspects_hub' }
            ]
        },
        tfs_task_1: {
            npc: 'brother_thaddeus',
            text: "To begin, you must prove your understanding. Gather 5 Big Bones from the fallen beasts of the world. Then, bring them here to the chapel and 'Use' them on the main altar. This act of consecration is your first true step on the path.",
            responses: [
                { text: "I will consecrate the bones.", actions: [{ type: 'start_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_return_after_consecrate: {
            npc: 'brother_thaddeus',
            text: "Let me see... yes, they radiate with holy energy. You have done well.",
            responses: [
                {
                    text: "What is the next step?",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'consecrated_big_bones', quantity: 5 }] }],
                        successNode: 'tfs_explain_grind',
                        failureNode: 'tfs_fail_consecrate_check'
                    }
                }
            ]
        },
        tfs_fail_consecrate_check: {
            npc: 'brother_thaddeus',
            text: "It seems you do not have all 5 consecrated bones yet. The altar awaits. Remember, 'Use' the bones on the altar itself.",
            responses: []
        },
        tfs_explain_grind: {
            npc: 'brother_thaddeus',
            text: "The next step is to release the essence within. Take all 5 of the consecrated bones to the Reliquary Grinder here in the chapel. It will turn them into 100 units of Sacred Dust. Once you have done that, return to me.",
            responses: [
                { text: "I will grind the bones.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_return_after_grind: {
            npc: 'brother_thaddeus',
            text: "Ah, 100 units of Sacred Dust. Excellent. The next component is Anointing Oil, a blessed liquid that purifies the dust. It can only be brewed by one who lives in harmony with nature, one who understands the Hunt. Seek out Sister Seraphina, a hermit who lives in a secluded part of the Wyrmwood Grove.",
            responses: [
                { text: "I will find her.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        seraphina_default: {
            npc: 'sister_seraphina',
            text: "It is not often I get visitors. State your purpose, but do not disturb the quiet of this grove.",
            responses: []
        },
        tfs_seraphina_intro: {
            npc: 'sister_seraphina',
            text: "Brother Thaddeus sent you? He seeks to prepare you for the trials, then. He understands the power of the chapel, but I understand the power of the wild. To truly know the divine, you must understand the Great Hunt—the endless cycle of life and death that governs all things.",
            responses: [
                { text: "He said you could make Anointing Oil.", next: 'tfs_seraphina_task' }
            ]
        },
        tfs_seraphina_task: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "I can. But you must first prove you respect the earth from which all things grow. Bring me 5 Grimy Marleaf. They grow in dark places, often carried by creatures of the deep. It is a humble task, but a necessary one.",
            responses: [
                { text: "I will gather the herbs.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] },
            ],
            conditionalResponses: [
                {
                    text: "I know a bit about herbs. That Marleaf is going to be burned for its medicinal aroma?",
                    check: { requirements: [{ type: 'skill', skill: SkillName.Herblore, level: 45 }], successNode: 'tfs_seraphina_herblore_skip', failureNode: '' }
                }
            ]
        },
        tfs_seraphina_herblore_skip: {
            npc: 'sister_seraphina',
            text: "Ah, a fellow student of the green-leaf! Your eyes are sharp. Marleaf, a prized herb for its medicinal aroma. Yes, it will be burned, but not in its normal state, first it needs to be crafted into Anointing Oil, which as you are experienced enough already, I'll give you this.",
            responses: [
                { text: "Thank you, Sister.", actions: [{ type: 'give_item', itemId: 'anointing_oil', quantity: 5 }, { type: 'advance_quest', questId: 'the_saints_first_step', quantity: 3 }] }
            ]
        },
        tfs_seraphina_stage4_router: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "Let's see what you've brought...",
            responses: [],
            conditionalResponses: [
                {
                    text: '',
                    check: { requirements: [{ type: 'items', items: [{ itemId: 'clean_marleaf', quantity: 5 }] }], successNode: 'tfs_seraphina_give_oil_from_stage4' }
                },
                {
                    text: '',
                    check: { requirements: [{ type: 'items', items: [{ itemId: 'grimy_marleaf', quantity: 5 }] }], successNode: 'tfs_seraphina_herb_is_grimy' }
                },
                {
                    text: '',
                    check: { requirements: [], successNode: 'tfs_seraphina_still_gathering' }
                }
            ]
        },
        tfs_seraphina_stage5_router: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "Have you cleaned the herbs as I asked?",
            responses: [],
            conditionalResponses: [
                {
                    text: '',
                    check: { requirements: [{ type: 'items', items: [{ itemId: 'clean_marleaf', quantity: 5 }] }], successNode: 'tfs_seraphina_give_oil' }
                },
                {
                    text: '',
                    check: { requirements: [], successNode: 'tfs_seraphina_herb_is_still_grimy' }
                }
            ]
        },
        tfs_seraphina_still_gathering: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "You don't seem to have the herbs I need. I need 5 Grimy Marleaf from the creatures in the dark caves.",
            responses: []
        },
        tfs_seraphina_herb_is_still_grimy: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "The herbs are still grimy. Please clean them before I can prepare the oil.",
            responses: []
        },
        tfs_seraphina_give_oil_from_stage4: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "Ah, you've already cleaned them! Excellent foresight. Here is your Anointing Oil. Use it well. Combine it with your Sacred Dust to create the Holy Paste for your offering.",
            responses: [
                { text: "Thank you, Sister.", actions: [{ type: 'take_item', itemId: 'clean_marleaf', quantity: 5 }, { type: 'give_item', itemId: 'anointing_oil', quantity: 5 }, { type: 'advance_quest', questId: 'the_saints_first_step', quantity: 2 }] }
            ]
        },
        tfs_seraphina_herb_is_grimy: {
            npcName: 'Sister Seraphina',
            npcIcon: 'person',
            text: "They are still covered in grime. You must clean them first before I can use them. It is a simple but important part of the process.",
            responses: [
                { text: "I'll clean them now.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_seraphina_give_oil: {
            npc: 'sister_seraphina',
            text: "Excellent. You show respect for the process. Here is your Anointing Oil. Use it well. Combine it with your Sacred Dust to create the Holy Paste for your offering.",
            responses: [
                { text: "Thank you, Sister.", actions: [{ type: 'take_item', itemId: 'clean_marleaf', quantity: 5 }, { type: 'give_item', itemId: 'anointing_oil', quantity: 5 }, { type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_offer_paste: {
            npcName: 'Brother Thaddeus',
            npcIcon: 'altar',
            text: "Of course pupil, what knowledge do you seek?",
            responses: [
                { text: "What must I do with this paste?", next: 'tfs_offer_what' },
                { text: "Why does this have to be done at this specific altar?", next: 'tfs_offer_why_altar' },
                { text: "Thanks for the information."},
            ]
        },
        tfs_offer_what: {
            npcName: 'Brother Thaddeus',
            npcIcon: 'altar',
            text: "The Holy Paste must be burned upon the altar as an offering. Use the paste on this altar to begin. You will need a tinderbox to light it. The act of offering will grant you great insight.",
            responses: [
                { text: "Return", next: 'tfs_offer_paste' },
                { text: "Why does the offering need to be burned?", next: 'tfs_offer_why_burn' }
            ]
        },
        tfs_offer_why_altar: {
            npcName: 'Brother Thaddeus',
            npcIcon: 'altar',
            text: "This is a consecrated altar, a focal point of divine energy. A simple campfire will not do. Only here can your offering transcend the physical realm and reach the gods.",
            responses: [{ text: "Return", next: 'tfs_offer_paste' }]
        },
        tfs_offer_why_burn: {
            npcName: 'Brother Thaddeus',
            npcIcon: 'altar',
            text: "Fire is a purifying element. By burning the paste, you release the sacred essence from its physical form, sending your prayer to the heavens as fragrant smoke. It is a transformation of matter into spirit.",
            responses: [{ text: "Return", next: 'tfs_offer_paste' }]
        },
        tfs_thaddeus_final: {
            npc: 'brother_thaddeus',
            text: "A vision! Just as the scriptures foretold. You have been acknowledged by the Divines. The three paths you saw are the Divine Trials. You are ready to begin. Each path requires a different master to guide you.",
            responses: [
                { text: "Tell me about the masters.", next: 'tfs_thaddeus_explain_masters' },
                { text: "Thank you, Brother. I am ready.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_thaddeus_explain_masters: {
            npc: 'brother_thaddeus',
            text: "For the Trial of War, seek Lieutenant Cassia at our west gate. For the Trial of the Hunt, find the master hunter Fenris in the Wyrmwood Grove. And for the Trial of Sorcery, speak with Librarian Anya in our library. They will guide you further. Which master do you wish to know more about?",
            responses: [
                { text: "Tell me about Lieutenant Cassia.", next: 'tfs_master_lore_cassia' },
                { text: "Tell me about Fenris of the Hunt.", next: 'tfs_master_lore_fenris' },
                { text: "Tell me about Librarian Anya.", next: 'tfs_master_lore_anya' },
                { text: "Thank you, Brother. I am ready.", actions: [{ type: 'advance_quest', questId: 'the_saints_first_step' }] }
            ]
        },
        tfs_master_lore_cassia: {
            npc: 'brother_thaddeus',
            text: "Lieutenant Cassia is the embodiment of the Warrior aspect. She sees the divine not in prayer, but in the perfect order of a shield wall and the righteous fury of a counter-attack. Her discipline is her devotion. She will not suffer fools.",
            responses: [{ text: "Return to questions.", next: 'tfs_thaddeus_explain_masters' }]
        },
        tfs_master_lore_fenris: {
            npc: 'brother_thaddeus',
            text: "Fenris is a man of the wild. He speaks the language of the wind and the track. He understands the sacred pact between predator and prey. He does not worship the Hunt; he *is* the Hunt. He values skill and respect for nature above all else.",
            responses: [{ text: "Return to questions.", next: 'tfs_thaddeus_explain_masters' }]
        },
        tfs_master_lore_anya: {
            npc: 'brother_thaddeus',
            text: "Anya finds the divine in patterns and knowledge. She sees the hand of Sorcery not in flashy spells, but in the fundamental laws of magic and the great tapestry of fate. Her library is her temple. Approach her with a curious mind.",
            responses: [{ text: "Return to questions.", next: 'tfs_thaddeus_explain_masters' }]
        }
    }
};
