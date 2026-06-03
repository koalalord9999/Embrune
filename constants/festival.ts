export interface TriviaQuestion {
    question: string;
    choices: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
}

export const FESTIVAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
    {
        question: "What is the name of the ancient deity worshipped in the Sanctity catacombs beneath Oakhaven?",
        choices: [
            "The Ember Warden",
            "The Hollow Saint",
            "The Pale Shepherd",
            "The Root Mother",
        ],
        correctIndex: 2,
        explanation: "The Pale Shepherd is the forgotten deity of the old catacombs. Pilgrims once left offerings of wax at its altar.",
    },
    {
        question: "Which Oakhaven craftsman is credited with forging the first iron gate of the North Gate?",
        choices: [
            "Durnwall the Elder",
            "Brandic Ashford",
            "Sven the Tanner",
            "Elara's grandfather, Colt",
        ],
        correctIndex: 0,
        explanation: "Durnwall the Elder smelted the original North Gate iron in the year 312 of the Embrune calendar, according to the town records.",
    },
    {
        question: "What event caused the great flood that shaped the Oakhaven lake basin?",
        choices: [
            "A dam collapse upstream on the Ashmore River",
            "A failed weather ritual by the Mages of Meadowdale",
            "A landslide that redirected the Greyvein tributary",
            "A volcanic eruption in the Sunscorched Wastes",
        ],
        correctIndex: 2,
        explanation: "A catastrophic landslide redirected the Greyvein tributary into the valley, forming the lake basin over several decades.",
    },
    {
        question: "In the old Embrune harvest festivals, lanterns were traditionally made from which plant?",
        choices: [
            "Feywood bark",
            "Dried gourds",
            "Wicker and tallow",
            "Frost pine cones",
        ],
        correctIndex: 1,
        explanation: "Hollow dried gourds were the traditional lantern vessel long before the wax-and-paper style became common.",
    },
    {
        question: "What is the name of the pass that connects the Oakhaven valley to the Silverhaven trade road?",
        choices: [
            "The Copperback Pass",
            "Thornfall Gap",
            "Mira's Crossing",
            "The Greyvein Bridge",
        ],
        correctIndex: 0,
        explanation: "The Copperback Pass is named for the copper-bearing rock formations that run through the hillside along the road.",
    },
    {
        question: "What ancient tree is said to guard the western entrance of Oakhaven, its roots rumored to move at night?",
        choices: [
            "The Whispering Willow",
            "The Sentinel Oak",
            "The Nightshade Birch",
            "The Emberheart Elm",
        ],
        correctIndex: 1,
        explanation: "The Sentinel Oak is a massive, centuries‑old tree whose roots are said to shift subtly, keeping watch over travelers entering from the west.",
    },
    {
        question: "Which river runs beneath the Festival grounds, feeding the Oakhaven Lake and the nightly lantern floats?",
        choices: [
            "River Lumen",
            "Greyvein Tributary",
            "Silverstream",
            "Cinder Creek",
        ],
        correctIndex: 0,
        explanation: "River Lumen flows silently underground, its clear waters harvested for the nightly lantern displays.",
    },
    {
        question: "During the harvest moon, a special market appears in Oakhaven selling rare items. What is this market called?",
        choices: [
            "Moonlit Bazaar",
            "Twilight Exchange",
            "Starlight Fair",
            "Midnight Emporium",
        ],
        correctIndex: 2,
        explanation: "The Starlight Fair appears only under the harvest moon, offering exotic goods from distant lands.",
    },
    {
        question: "Which legendary blacksmith is credited with forging the ceremonial lanterns used in the festival?",
        choices: [
            "Thoren Ironhand",
            "Mira Goldforge",
            "Elda Steelweaver",
            "Korin Emberbrand",
        ],
        correctIndex: 3,
        explanation: "Korin Emberbrand crafted the first lanterns using a secret alloy that glows without flame.",
    },
    {
        question: "What hidden message is etched on the base of the central festival bonfire stone?",
        choices: [
            "In unity we rise",
            "The light guides the lost",
            "From ash we are reborn",
            "May blessings fall upon us",
        ],
        correctIndex: 2,
        explanation: "The inscription \"From ash we are reborn\" reminds villagers of renewal each year.",
    },
    {
        question: "Which folk song is traditionally sung by the children as they release the lanterns?",
        choices: [
            "The Lantern’s Lullaby",
            "Oakhaven’s Whisper",
            "Song of the Rising Flame",
            "Melody of the Meadow",
        ],
        correctIndex: 0,
        explanation: "\"The Lantern’s Lullaby\" has been passed down for generations, its verses counting the rising lights.",
    },
    {
        question: "A rare mushroom known as the Glowcap appears only during the festival. Where does it grow?",
        choices: [
            "Beneath the festival tents",
            "On the western cliffs",
            "In the marshes near the lake",
            "Inside the lantern gourd patches",
        ],
        correctIndex: 3,
        explanation: "Glowcaps sprout in the gourd patches, their bioluminescence matching the lanterns.",
    },
    {
        question: "What is the name of the mischievous sprite said to hide the festival tickets?",
        choices: [
            "Pip the Pixie",
            "Flicker the Spriggan",
            "Nimble Nix",
            "Twitch the Trickster",
        ],
        correctIndex: 1,
        explanation: "Flicker the Spriggan loves to play tricks, often swapping tickets for trinkets.",
    },
    {
        question: "Which historic battle is commemorated during the fireworks display?",
        choices: [
            "The Siege of Emberhold",
            "The Battle of Silverridge",
            "The Clash of the Crimson Dawn",
            "The Defense of Oakhaven",
        ],
        correctIndex: 3,
        explanation: "The Defense of Oakhaven was a pivotal moment when villagers repelled invaders with lantern fire.",
    },
    {
        question: "What secret ingredient is added to the festival ale to give it a faint glow?",
        choices: [
            "Glowing hop petals",
            "Firefly honey",
            "Luminescent barley",
            "Star dust malt",
        ],
        correctIndex: 0,
        explanation: "Glowing hop petals harvested at dusk infuse the ale with a gentle shimmer.",
    },
    {
        question: "Which old map shows the original layout of the lantern festival grounds before the expansion?",
        choices: [
            "The Cartographer’s Folio",
            "The Old Lantern Ledger",
            "The Dawn Sketch",
            "The Ember Archive",
        ],
        correctIndex: 2,
        explanation: "The Dawn Sketch, discovered in the town archives, depicts the modest beginnings of the grounds.",
    },
];

export interface GourdLootEntry {
    type: 'festival_ticket' | 'item';
    itemId?: string;
    minTickets?: number;
    maxTickets?: number;
    weight: number;
    logMessage: string;
}

export const GOURD_LOOT_TABLE: GourdLootEntry[] = [
    { type: 'festival_ticket', minTickets: 10, maxTickets: 20, weight: 50, logMessage: "A modest haul of tickets falls from the gourd!" },
    { type: 'festival_ticket', minTickets: 21, maxTickets: 35, weight: 30, logMessage: "A decent stack of tickets spills out!" },
    { type: 'festival_ticket', minTickets: 36, maxTickets: 50, weight: 14, logMessage: "A generous pile of tickets pours from the gourd!" },
    { type: 'item', itemId: 'festival_pie', weight: 3, logMessage: "A fresh festival pie tumbles out of the gourd!" },
    { type: 'item', itemId: 'festival_cake', weight: 2, logMessage: "A beautifully decorated festival cake emerges!" },
    { type: 'item', itemId: 'lantern_whistle', weight: 1, logMessage: "Something gleams inside... a rare Lantern Whistle! Incredible luck!" },
];
