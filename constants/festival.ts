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
