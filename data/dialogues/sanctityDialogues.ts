
import { DialogueNode } from '../../types';

export const BROTHER_THADDEUS_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Brother Thaddeus',
        npcIcon: 'priest-hat',
        text: "Blessings upon you, traveler. The light of the Divines shines on this town. May it bring you peace.",
        responses: [
            { text: "What is this place?", next: 'about_sanctity' },
            { text: "Thank you, Brother." }
        ]
    },
    about_sanctity: {
        npcName: 'Brother Thaddeus',
        npcIcon: 'priest-hat',
        text: "This is Sanctity, a bastion of hope against the encroaching darkness of the swamps. We believe in order, worship, and the marriage of technology and faith to create a better world.",
        responses: []
    }
};

export const LIBRARIAN_ANYA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Librarian Anya',
        npcIcon: '/assets/npcChatHeads/librarian_elara.png',
        text: "Welcome to the Sanctity Library. Here, we preserve the holy texts and the history of our founders. Please, keep your voice down.",
        responses: [],
        conditionalResponses: [
            {
                text: "",
                check: { requirements: [{ type: 'quest', questId: 'the_sorcerers_trial', status: 'completed' }], successNode: 'post_quest_start' }
            }
        ]
    },
    post_quest_start: {
        npcName: 'Librarian Anya',
        npcIcon: '/assets/npcChatHeads/librarian_elara.png',
        text: "Ah, the Archmage returns! The library is significantly safer now that the weave has been... adjusted. How can I assist you today?",
        responses: [
            { text: "About that hat... purple, stars, you remember?", next: 'the_hat_joke' }
        ]
    },
    the_hat_joke: {
        npcName: 'Librarian Anya',
        npcIcon: '/assets/npcChatHeads/librarian_elara.png',
        text: "*Anya's expression remains deadpan.* Of course. I've spent the morning consulting the ancient scrolls of Millinery. There was a section on 'The Inherent Folly of Arcane Fashion'. It was quite comprehensive. There is no hat, Archmage. I suggest you spend your time researching something more practical. Like... gravity.",
        responses: [
            { text: "I'll keep looking for it elsewhere then." }
        ]
    }
};

export const INNKEEPER_PHOEBE_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Innkeeper Phoebe',
        npcIcon: '/assets/npcChatHeads/barkeep_freya.png', // Re-use
        text: "Welcome to The Pilgrim's Rest. We offer a quiet place for weary travelers. No spirits, I'm afraid, only milk and water. Clear mind, clear soul.",
        responses: [
            { text: "I'd like a room.", next: 'rent_room' },
            { text: "Just looking around." }
        ]
    },
    rent_room: {
        npcName: 'Innkeeper Phoebe',
        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
        text: "A wise choice. A night of peaceful rest will cost you 12 coins. It will restore you completely.",
        responses: [
            { text: "I'll take it.", check: { requirements: [{ type: 'coins', amount: 12 }], successNode: 'rent_success', failureNode: 'rent_fail' }, actions: [{ type: 'take_coins', amount: 12 }, { type: 'heal', amount: 'full' }] },
            { text: "I'll pass for now." }
        ]
    },
    rent_success: {
        npcName: 'Innkeeper Phoebe',
        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
        text: "Excellent. May your dreams be peaceful.",
        responses: []
    },
    rent_fail: {
        npcName: 'Innkeeper Phoebe',
        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
        text: "I'm sorry, you don't seem to have enough coin.",
        responses: []
    }
};

export const ARTISAN_KAEL_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Artisan Kael',
        npcIcon: '/assets/npcChatHeads/artisan.png', // Re-use
        text: "With faith as my guide and steel as my medium, I shape the future. These anvils ring with hymns to progress. Do you seek to create?",
        responses: []
    }
};

export const GUARD_CASSIA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Guard Cassia',
        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png', // Re-use
        text: "The swamps are a constant threat, but our walls and our faith are strong. We keep watch so the faithful may live in peace.",
        responses: []
    }
};
