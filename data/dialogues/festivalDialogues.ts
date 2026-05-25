import { DialogueNode } from '../../types';

export const ELDER_BRANDIC_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Elder Brandic',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Greetings, young traveler. I have watched seventy-two seasons of the Lantern Festival in Oakhaven, and yet the sight of these lights floating into the night sky never fails to warm my old bones. What would you like to know of our history?",
        responses: [
            { text: "Tell me about the lanterns we use.", next: "gourds" },
            { text: "Who forged the beautiful North Gate?", next: "north_gate" },
            { text: "What is this about catacombs under Oakhaven?", next: "pale_shepherd" },
            { text: "Enjoy the festival, Elder." }
        ]
    },
    gourds: {
        npcName: 'Elder Brandic',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Ah, today everyone uses wax and paper. But in the old Embrune harvest festivals, long before the modern style, our lanterns were traditionally crafted from dried gourds! We would hollow them out and place a simple tallow candle inside to guide the spirits of the harvest. You can still see them at the Gourd Patch.",
        responses: [
            { text: "Fascinating. Tell me something else.", next: "start" }
        ]
    },
    north_gate: {
        npcName: 'Elder Brandic',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Ah, the sturdy North Gate of Oakhaven! The first iron gate was forged by Durnwall the Elder back in the year 312 of the Embrune calendar. It was a masterpiece of smelting and blacksmithing, designed to withstand the cold winds and protect our artisans from outside threats.",
        responses: [
            { text: "Amazing craftsmanship. Tell me more.", next: "start" }
        ]
    },
    pale_shepherd: {
        npcName: 'Elder Brandic',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Shh... speak softly of such things. Deep beneath our peaceful town, in the old Sanctity catacombs, lies the altar of the forgotten deity known as the Pale Shepherd. Centuries ago, silent pilgrims would wander those dark tunnels to leave humble offerings of wax at its feet, hoping for guidance through life's shadows.",
        responses: [
            { text: "That is quite mysterious. Thank you, Elder.", next: "start" }
        ]
    }
};

export const PIP_GOURD_CARVER_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Pip the Gourd Carver',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Hey! Watch the blade, it's razor-sharp! I'm trying to carve out a traditional design here. People think paper lanterns are all the rage, but hollowing out a dried gourd is a true art form!",
        responses: [
            { text: "How did you learn this art?", next: "carving" },
            { text: "Where do you get your gourds?", next: "patch" },
            { text: "Keep up the good work!" }
        ]
    },
    carving: {
        npcName: 'Pip the Gourd Carver',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "My master says the trick is not to carve too deep. One slip, and you ruin the structural integrity of the shell! The smell of fresh wood shavings and dried pulp is what Oakhaven is all about. True craftsmanship is in our blood.",
        responses: [
            { text: "I see. Let's talk about something else.", next: "start" }
        ]
    },
    patch: {
        npcName: 'Pip the Gourd Carver',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Just down the path at the Gourd Patch! The soil there is incredibly rich. We harvest them in autumn, dry them out over winter, and then they're ready to be carved or smashed for the festival! Have you tried smashing one today?",
        responses: [
            { text: "Not yet, I'll go check it out.", next: "start" }
        ]
    }
};

export const CELIA_WISHMAKER_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Celia the Wishmaker',
        npcIcon: 'woman-elf-face',
        text: "Welcome to the plaza! Isn't the glow from the lanterns absolutely enchanting? I've already thrown a coin into the wishing well today, and I'm planning to launch my own lantern soon.",
        responses: [
            { text: "Tell me about the wishing well.", next: "wishing_well" },
            { text: "Do you know how the lake basin was formed?", next: "lake_flood" },
            { text: "May your wishes come true." }
        ]
    },
    wishing_well: {
        npcName: 'Celia the Wishmaker',
        npcIcon: 'woman-elf-face',
        text: "The Oakhaven wishing well is said to be connected to ancient underground waterways. If you are patient and sincere, the waters will bring you great fortune. Just be sure to toss a coin in and make your request!",
        responses: [
            { text: "Interesting. Let's chat more.", next: "start" }
        ]
    },
    lake_flood: {
        npcName: 'Celia the Wishmaker',
        npcIcon: 'woman-elf-face',
        text: "Oh, it is a dramatic tale! The Oakhaven lake basin wasn't always here. A massive landslide redirected the Greyvein tributary valley, completely flooding the lowland over several decades. It shaped the beautiful shoreline we enjoy today during our walks.",
        responses: [
            { text: "Wow, nature is powerful. What else?", next: "start" }
        ]
    }
};

export const ALPIN_SMELTER_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Alpin the Smelter',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Ah, nothing like a festival to get a hard-working smelter out of the smithy! The heat of the furnace is nothing compared to the warmth of these festival fires. Are you here to test your strength, traveler?",
        responses: [
            { text: "How is trade coming in?", next: "pass_road" },
            { text: "Do you know about Durnwall the Elder?", next: "durnwall" },
            { text: "Enjoy your day off!" }
        ]
    },
    pass_road: {
        npcName: 'Alpin the Smelter',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "We rely heavily on the Copperback Pass to bring in raw materials and trade goods from the Silverhaven road. It got its name from the copper-bearing rock formations running along the hillside. If you travel that road, keep your eyes on the sparkling stones!",
        responses: [
            { text: "Good to know. Tell me more.", next: "start" }
        ]
    },
    durnwall: {
        npcName: 'Alpin the Smelter',
        npcIcon: '/assets/npcChatHeads/artisan.png',
        text: "Of course! Every apprentice smelter learns of Durnwall the Elder. He was the legendary craftsman who forged the original iron gates of the North Gate in year 312. The iron was so pure and well-tempered that parts of his work still stand strong today.",
        responses: [
            { text: "He sounds like a legend. Let's talk about something else.", next: "start" }
        ]
    }
};

export const PILGRIM_TESSA_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Merry Pilgrim Tessa',
        npcIcon: 'woman-elf-face',
        text: "Blessings of the road upon you, traveler! I have journeyed all the way from the capital, through the rugged Copperback Pass, just to see the Oakhaven lanterns float over the lake. It is even more beautiful than the songs described!",
        responses: [
            { text: "How was the journey through the Pass?", next: "pilgrimage" },
            { text: "What do you think of the lanterns?", next: "lanterns" },
            { text: "Safe travels on your journey." }
        ]
    },
    pilgrimage: {
        npcName: 'Merry Pilgrim Tessa',
        npcIcon: 'woman-elf-face',
        text: "The Copperback Pass is steep and full of loose stone, but the shimmering veins of copper in the cliffs are breathtaking. I met a few other pilgrims along the way. We shared stories of the old days, back when people travelled to the catacombs of the Pale Shepherd.",
        responses: [
            { text: "Tell me more of your thoughts.", next: "start" }
        ]
    },
    lanterns: {
        npcName: 'Merry Pilgrim Tessa',
        npcIcon: 'woman-elf-face',
        text: "The glow is so serene! Paper and wax allow them to float high up, carrying our prayers toward the heavens. But I bought an old hollow gourd lantern from a local carver as well. It has a rustic charm that honors the ancient traditions of Oakhaven.",
        responses: [
            { text: "It truly is beautiful. Let's talk about something else.", next: "start" }
        ]
    }
};

export const FISHERMAN_RONALD_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: 'Fisherman Ronald',
        npcIcon: 'person',
        text: "Aye, the fish are biting tonight! The glowing lanterns reflecting on the water seem to attract them right up to the surface. Best trout you'll ever see, swimming right in the lake basin.",
        responses: [
            { text: "How did this lake basin get here?", next: "flood_basin" },
            { text: "Are you catching anything good?", next: "fishing_lights" },
            { text: "Good luck with the catch!" }
        ]
    },
    flood_basin: {
        npcName: 'Fisherman Ronald',
        npcIcon: 'person',
        text: "My grandfather told me the story. Decades ago, a massive landslide up the valley redirected the entire Greyvein tributary. Water flooded the valley and slowly carved out this perfect lake basin. It created the most fertile fishing grounds in the entire region!",
        responses: [
            { text: "Nature's wonders. Tell me more.", next: "start" }
        ]
    },
    fishing_lights: {
        npcName: 'Fisherman Ronald',
        npcIcon: 'person',
        text: "Oh, absolutely. The clear water here is perfect for nighttime fishing. When the paper lanterns drift overhead, the golden light pierces deep into the water, and you can see the shadows of giant trout swimming near the reeds. It's a magical sight.",
        responses: [
            { text: "Sounds peaceful. Let's talk about something else.", next: "start" }
        ]
    }
};
