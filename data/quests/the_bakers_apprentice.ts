
import { Quest, SkillName } from '../../types';

export const theBakersApprentice: Quest = {
    id: 'the_bakers_apprentice',
    name: "The Baker's Apprentice",
    description: "Master Baker Thomas demands you prove your mastery over the fundamental principles of baking, from sourcing raw materials to executing complex recipes. Failure means scorched reputations.",
    requirements: {
        quests: [],
        skills: [{ skill: SkillName.Cooking, level: 35 }]
    },
    startHint: "Speak to Master Baker Thomas in the Meadowdale Kitchen.",
    playerStagePerspectives: [
        "I need to understand the secrets of ingredient sourcing and dough techniques from Master Thomas.",
        "I need to gather the necessary materials: 10 red berries, a tomato, cheese, and a pie dish.",
        "I must successfully bake a Berry Pie and a Plain Pizza to prove my worth.",
        "The baking is done. I should return to Thomas for the final inspection."
    ],
    completionSummary: "I have successfully navigated the demands of Master Baker Thomas, proving my understanding of the alchemy of baking. I am now a recognized apprentice of the Meadowdale ovens.",
    stages: [
        {
            description: "Listen to Master Thomas's lecture on ingredient sourcing and dough techniques.",
            requirement: { type: 'talk', poiId: 'meadowdale_kitchen', npcName: 'Master Baker Thomas' }
        },
        {
            description: "Gather 3 Red Berries, 1 Tomato, 1 Cheese, and 1 Pie Dish.",
            requirement: {
                type: 'gather',
                items: [
                    { itemId: 'red_berries', quantity: 3 },
                    { itemId: 'tomato', quantity: 1 },
                    { itemId: 'cheese', quantity: 1 },
                    { itemId: 'pie_dish', quantity: 1 }
                ]
            }
        },
        {
            description: "Bake 1 Berry Pie and 1 Plain Pizza.",
            requirement: {
                type: 'gather',
                items: [
                    { itemId: 'berry_pie', quantity: 1 },
                    { itemId: 'plain_pizza', quantity: 1 }
                ]
            }
        },
        {
            description: "Return the finished goods to Master Baker Thomas.",
            requirement: { type: 'talk', poiId: 'meadowdale_kitchen', npcName: 'Master Baker Thomas' }
        }
    ],
    npcDefs: {
        master_baker_thomas: { npcName: 'Master Baker Thomas', npcIcon: 'person' },
    },

    rewards: {
        xp: [{ skill: SkillName.Cooking, amount: 2500 }],
        items: [
            { itemId: 'coins', quantity: 750 },
            { itemId: 'apple_pie', quantity: 2 }
        ]
    },
    dialogueEntryPoints: [
        {
            npcName: 'Master Baker Thomas',
            response: {
                text: "I seek to learn the art of the oven, Master Thomas.",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'the_bakers_apprentice', status: 'not_started' },
                        { type: 'skill', skill: SkillName.Cooking, level: 35 }
                    ],
                    successNode: 'ba_intro_branching',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Master Baker Thomas',
            response: {
                text: "I'm having trouble with the recipes. How do I put these together?",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'the_bakers_apprentice', status: 'in_progress' },
                        { type: 'quest', questId: 'the_bakers_apprentice', status: 'in_progress', stage: 3, operator: 'lt' }
                    ],
                    successNode: 'ba_recipe_help',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Master Baker Thomas',
            response: {
                text: "Tell me about those 'baking secrets' again.",
                check: {
                    requirements: [{ type: 'quest', questId: 'the_bakers_apprentice', status: 'in_progress', stage: 0 }],
                    successNode: 'ba_intro_branching',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Master Baker Thomas',
            response: {
                text: "I have the baked goods for inspection.",
                check: {
                    requirements: [{ type: 'quest', questId: 'the_bakers_apprentice', status: 'in_progress', stage: 3 }],
                    successNode: 'ba_final_inspection',
                    failureNode: ''
                }
            }
        }
    ],
    dialogue: {
        ba_low_level: {
            npc: 'master_baker_thomas',
            text: "The kitchen is a place of precision, not play! Come back when you've at least reached Level 35 in Cooking. I won't have you burning down my bakery.",
            responses: []
        },
        ba_intro_branching: {
            npc: 'master_baker_thomas',
            text: "Speak to me, apprentice. Do you seek the simple path, or do you understand the true alchemy of the oven? What knowledge do you lack? Many think it's just 'heating food', but they are fools.",
            responses: [
                { text: "Where do I find the best ingredients?", next: 'ba_sourcing' },
                { text: "What is the secret to a perfect crust?", next: 'ba_technique' },
                { text: "I'm ready for the work. What is the assignment?", next: 'ba_assignment_start' }
            ]
        },
        ba_sourcing: {
            npc: 'master_baker_thomas',
            text: "Quality is paramount! Cheese isn't 'found' in a crate; it's churned from a bucket of milk at the windmill. Tomatoes? McGregor's Farm or the village shops. And those Red Berries? Only the wild ones from Feywood Forest or the Northern Wilderness will suffice for my recipes. Don't bring me those bruised ones from the roadside!",
            responses: [
                { text: "And the dough?", next: 'ba_technique' },
                { text: "I'll find them. What's next?", next: 'ba_assignment_start' }
            ]
        },
        ba_technique: {
            npc: 'master_baker_thomas',
            text: "Listen closely! The dough for a Pie and the base for a Pizza use the same fundamental ingredients—flour and water—but the technique is worlds apart! Making the dough is like bread, but the handling is different. A Pie requires a folding method in a ceramic Pie Dish, while a Pizza Base demands a flat, crisp execution. If you treat a pizza like bread, it will be a disaster!",
            responses: [
                { text: "Where do I get ingredients?", next: 'ba_sourcing' },
                { text: "I understand. I'm ready to bake.", next: 'ba_assignment_start' }
            ]
        },
        ba_assignment_start: {
            npc: 'master_baker_thomas',
            text: "Fine. Prove you understand the process. Gather 3 Red Berries, a Tomato, some Cheese, and buy a Pie Dish from the shops. Bake a Berry Pie and a Plain Pizza. Flawlessly! If I see a single burnt edge, you'll be scrubbing pots for a month.",
            responses: [
                { text: "I'll get to work.", actions: [{ type: 'start_quest', questId: 'the_bakers_apprentice' }, { type: 'advance_quest', questId: 'the_bakers_apprentice' }] }
            ]
        },
        ba_recipe_help: {
            npc: 'master_baker_thomas',
            text: "Right. You want to know how the equipment works, do you? Like I’m teaching calculus to a truffle pig! Fine. Pay attention.",
            responses: [
                { text: "(Continue)", next: 'ba_recipe_pizza' }
            ]
        },
        ba_recipe_pizza: {
            npc: 'master_baker_thomas',
            text: "For the Pizza: Take the pizza base and apply the tomato evenly to create an incomplete pizza. Then, distribute the cheese across it to create the uncooked pizza. Only then is it ready for the heat!",
            responses: [
                { text: "(Continue)", next: 'ba_recipe_pie' }
            ]
        },
        ba_recipe_pie: {
            npc: 'master_baker_thomas',
            text: "For the Pie: You need the pie dish as your vessel. Combine the red berries and the pie dough inside it to form the uncooked berry pie. It's simple geometry, really.",
            responses: [
                { text: "(Continue)", next: 'ba_recipe_oven' }
            ]
        },
        ba_recipe_oven: {
            npc: 'master_baker_thomas',
            text: "And don't you dare use some roadside fire. My cooking range is the only precision apparatus in Meadowdale worthy of this work. Now get out of my sight!",
            responses: []
        },
        ba_final_inspection: {
            npc: 'master_baker_thomas',
            text: "*Thomas prods the pizza base with a floured finger and sniffs the pie deeply.* ...The hydration is acceptable. The crust has the proper flake. It seems you've actually listened to me. Meadowdale might survive your cooking after all. Take these, and continue your practice.",
            responses: [
                {
                    text: "I'm glad they meet your standards, Master Thomas.",
                    actions: [
                        { type: 'take_item', itemId: 'berry_pie', quantity: 1 },
                        { type: 'take_item', itemId: 'plain_pizza', quantity: 1 },
                        { type: 'advance_quest', questId: 'the_bakers_apprentice' }
                    ]
                }
            ]
        }
    }
};
