import { DialogueNode } from '../../types';

export const KAELEN_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Hail, adventurer! The Spire stands as a testament to those who hunt the darkness. Are you here to join our ranks, or do you have business in the shop?",
        responses: [
            { 
                text: "I'm looking for a Slayer task.", 
                next: 'check_task_status',
            },
            { 
                text: "I'd like to see the Slayer rewards.", 
                actions: [{ type: 'slayer_open_shop' }] 
            },
            { 
                text: "I would like to reset my current task.", 
                check: { requirements: [{ type: 'slayer_task', status: 'none', operator: 'ne' }] },
                next: 'reset_task_intro'
            },
            { text: "Just passing through." }
        ]
    },
    reset_task_intro: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "A reset? It is a costly endeavor, adventurer. Reorienting the Spire's resources for a new hunt will require a payment of 20 Slayer Credits.",
        responses: [
            { text: "I have the credits. Please reset my task.", next: 'reset_task_check' },
            { text: "Never mind." }
        ]
    },
    reset_task_check: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Let me check our records...",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_credits', amount: 20 }],
                    successNode: 'reset_task_confirm',
                    failureNode: 'reset_task_failed'
                }
            }
        ]
    },
    reset_task_confirm: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Are you absolutely certain? This will completely clear your current assignment. You will be free to seek a new hunt from whichever master you choose.",
        responses: [
            { 
                text: "Yes, reset it.", 
                actions: [{ type: 'slayer_reset_task', masterId: 'kaelen' }] 
            },
            { text: "No, I'll stick with it." }
        ]
    },
    reset_task_failed: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "The Spire doesn't work on charity, friend. Realigning our trackers is expensive business. Come back when you've actually earned the 20 credits required.",
        responses: [
            { text: "My apologies." }
        ]
    },
    check_task_status: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Let me see...",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'none' }],
                    successNode: 'assign_task',
                    failureNode: 'has_task_check'
                }
            }
        ]
    },
    assign_task: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "I've got just the thing for someone of your standing. Ready for your assignment?",
        responses: [
            { 
                text: "Yes, assign me a task.", 
                actions: [{ type: 'slayer_get_task', masterId: 'kaelen' }] 
            },
            { text: "Maybe later." }
        ]
    },
    has_task_check: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Wait...",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'complete' }],
                    successNode: 'task_complete',
                    failureNode: 'has_active_task'
                }
            }
        ]
    },
    task_complete: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Excellent work! You've cleared your previous bounty. Ready for another?",
        responses: [
            { 
                text: "Yes, give me a new task.", 
                actions: [{ type: 'slayer_get_task', masterId: 'kaelen' }] 
            },
            { text: "Not right now." }
        ]
    },
    has_active_task: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "You're already on a hunt, friend.",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'active', masterId: 'ravindra' }],
                    successNode: 'ravindra_task_too_hard',
                    failureNode: 'kaelen_task_progress'
                }
            }
        ]
    },
    ravindra_task_too_hard: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "I see Ravindra has you running ragged in the desert. That master doesn't know the meaning of 'moderation'. If it's too much for you, I can give you something easier.",
        responses: [
            { 
                text: "Yes, please. This task is too hard.", 
                next: 'confirm_easier_task'
            },
            { text: "I'll manage, thanks." }
        ]
    },
    confirm_easier_task: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "Are you sure? I can assign you a simpler task, but it will reset your current task streak to zero. You'll be back at square one for milestone rewards.",
        responses: [
            { 
                text: "I'm sure. Reset my streak and give me an easier task.", 
                actions: [{ type: 'slayer_reset_task', masterId: 'kaelen' }] 
            },
            { text: "On second thought, I'll stick with my current task." }
        ]
    },
    kaelen_task_progress: {
        npcName: 'Kaelen',
        npcIcon: '/assets/npcChatHeads/kaelen.png',
        text: "You haven't finished your current assignment yet. Get back out there and show those monsters what a real Slayer is made of!",
        responses: [
            { text: "I'm on it." }
        ]
    }
};

export const RAVINDRA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "The sun bleaches the bones of the weak. Only the strong survive the wastes. Why have you come to the Barracks?",
        responses: [
            { 
                text: "I'm seeking a worthy challenge. (Slayer Task)", 
                check: {
                    requirements: [{ type: 'skill', skill: 'Slayer' as any, level: 40 }],
                    successNode: 'check_task_status',
                    failureNode: 'too_weak'
                }
            },
            { 
                text: "I'd like to see your Slayer rewards.", 
                actions: [{ type: 'slayer_open_shop' }] 
            },
            { 
                text: "I would like to reset my current task.", 
                check: { requirements: [{ type: 'slayer_task', status: 'none', operator: 'ne' }] },
                next: 'reset_task_intro'
            },
            { text: "Just looking around." }
        ]
    },
    reset_task_intro: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "You wish to abandon your hunt? The desert has no patience for those who can't finish what they started. If you want a fresh assignment, it will cost you 20 credits for the breach of contract.",
        responses: [
            { text: "I have the credits. Reset my task.", next: 'reset_task_check' },
            { text: "I'll finish my hunt." }
        ]
    },
    reset_task_check: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Checking your record...",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_credits', amount: 20 }],
                    successNode: 'reset_task_confirm',
                    failureNode: 'reset_task_failed'
                }
            }
        ]
    },
    reset_task_confirm: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Hmph. Speak truthfully—are you sure? I will wipe your current slate so you can find a more 'suitable' target.",
        responses: [
            { 
                text: "Yes, reset it.", 
                actions: [{ type: 'slayer_reset_task', masterId: 'ravindra' }] 
            },
            { text: "Actually, I'll stay the course." }
        ]
    },
    reset_task_failed: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "You haven't even spilled enough blood to earn a reset. The wastes are unforgiving, and so am I. Get back out there or find the 20 credits you owe me.",
        responses: [
            { text: "Understood." }
        ]
    },
    too_weak: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Move along. The desert is no place for a novice. Come back when you have attained at least level 40 Slayer. Until then, you are just food for the vultures.",
        responses: [
            { text: "Fair enough." }
        ]
    },
    check_task_status: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Let's see if you're as tough as you look.",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'none' }],
                    successNode: 'assign_task',
                    failureNode: 'has_task_check'
                }
            }
        ]
    },
    assign_task: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "I have several threats that need... neutralizing. Are you prepared for a real hunt?",
        responses: [
            { 
                text: "Assign me a task.", 
                actions: [{ type: 'slayer_get_task', masterId: 'ravindra' }] 
            },
            { text: "I need to prepare first." }
        ]
    },
    has_task_check: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Checking your record...",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'complete' }],
                    successNode: 'task_complete',
                    failureNode: 'has_active_task'
                }
            }
        ]
    },
    task_complete: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Hmph. You survived. Not bad. Ready for something harder, or did that one break you?",
        responses: [
            { 
                text: "Give me another task.", 
                actions: [{ type: 'slayer_get_task', masterId: 'ravindra' }] 
            },
            { text: "I've had enough for now." }
        ]
    },
    has_active_task: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "You're already on a hunt.",
        responses: [
            {
                text: "(Continue)",
                check: {
                    requirements: [{ type: 'slayer_task', status: 'active', masterId: 'kaelen' }],
                    successNode: 'kaelen_task_insult',
                    failureNode: 'ravindra_task_progress'
                }
            }
        ]
    },
    kaelen_task_insult: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Kaelen's petty chores won't make you a master. Finish what you started before you come seeking real glory from me.",
        responses: [
            { text: "I will." }
        ]
    },
    ravindra_task_progress: {
        npcName: 'Ravindra',
        npcIcon: 'desert-helmet',
        text: "Why are you back? Your task isn't finished. The desert doesn't offer second chances—finish the job or let the sands claim you.",
        responses: [
            { text: "I'm going." }
        ]
    }
};
