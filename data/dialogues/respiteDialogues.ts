import { DialogueNode } from '../../types';

export const RESPITE_CIVILIAN_DIALOGUE: Record<string, string[]> = {
    duskwatch: [
        "Welcome to Duskwatch. If you've come this far, you must be serious about the craft.",
        "The Bonemarsh to the southwest... don't go in without salt. The slugs there will dissolve your boots.",
        "Thorne at Bleakpost doesn't suffer fools. But his tasks pay better than anyone else's.",
        "The Gaze Fiends in the Barrow can petrify you with a look. A reflective shield is mandatory.",
        "This island draws monsters the way a flame draws moths. Nobody knows why, exactly.",
        "The Abyssal Rift in the north... they say reality itself is torn there. Bring a Slayer's Lantern.",
        "Sky Captain Vance can charter you a flight back to Silverhaven if you need supplies.",
        "Ironmaw has the best mining camp on the island. Dense veins of iron and coal.",
        "The Scorched Hollow sounds bad, and it is. Ember Demons and worse down there.",
        "I once saw a Frost Wyvern fly over the ridge. Nearly froze the watchtower solid.",
        "The Slayer's Guild built this town as a containment measure. The monsters keep coming.",
        "Archivist Maren says the island wasn't always this dangerous. Something changed underground.",
        "The Thornveil to the east is beautiful, in a terrifying sort of way. Don't touch the vines.",
        "Provisioner Holt knows every trail on this island. If you're lost, ask him.",
        "Some slayers retire here. Brennan at the tavern has been on this island longer than anyone.",
        "The Shattered Coast has the best fishing, but the Tide Hunters won't leave you alone.",
        "Be mindful of the volcanic vents in the Cinderforge. You can tell they're active by the haze.",
        "Bleakpost is rough living, but it's closer to the action. Most veterans end up there.",
        "Don't underestimate the Corpse Blooms in the Barrow. They grow back faster than you'd think.",
        "The Frostspine Drakes aren't proper slayer creatures, but they'll kill you just the same.",
    ],
    ironmaw: [
        "The cliffs here are practically made of ore. You'll never run short of iron or coal.",
        "Forgemaster Thalric can smith things most smiths won't even attempt. All slayer gear, no questions.",
        "The Thornveil starts just past the east trail. Beautiful canopy. Horrible things underneath it.",
        "Scout Lira patrols the border every day. She's seen things in there that would curl your toes.",
        "This town started as a mining camp. We just never left.",
        "Herbalist Wynn brews the best combat potions on the island. Expensive, but worth it.",
        "If you're heading north to the Ridge, stock up. There's no supplies past the treeline.",
        "The Canopy Stalkers in the Thornveil drop from the trees. Look up, always.",
        "Miner Gretchen says there are tunnels beneath this place that go deeper than anyone's mapped.",
        "The forge fires never go out here. There's always someone smelting.",
        "Bring a Broad-bladed Sword if you're going after Leaf Beasts. Regular swords just bounce off.",
        "Some of the ore veins here yield three or four times what you'd get on the mainland.",
        "The Thornback Beetles have armor like plate mail. Use a warhammer on them.",
        "I heard a Jungle Serpent took out two slayers last week. Venom's no joke.",
        "This is the last stop for supplies before the real wilds. Stock up.",
    ],
    bleakpost: [
        "This is the last stop before the real danger begins. Make it count.",
        "Thorne sent three slayers into the Rift last week. Only one came back. He took notes.",
        "The Bonemarsh at night... you can see the Marshlight Wraiths drifting. Don't follow them.",
        "Tracker Sienna knows the swamp better than anyone. If she says don't go somewhere, listen.",
        "Quartermaster Dain runs supplies from Duskwatch. We'd starve without him.",
        "Monk Aldric says this island is cursed. I say it's just really, really dangerous.",
        "The Gauntlet course keeps the slayers sharp. Level 70 minimum, or you'll break something.",
        "The Scorched Hollow is visible from the lookout. On a bad day, you can feel the heat.",
        "Risen Shamblers from the marsh sometimes wander up to the walls. The guards handle it.",
        "If you're going to the Cinderforge, watch for the vent haze. Walk through at the wrong time and you'll cook.",
        "Blighted Spectres deep in the Cinderforge require a nose clamp. The stench alone can kill you.",
        "The Hollowed Barrow entrance is about two miles south through the marsh. Bring salt.",
        "This outpost was built because Duskwatch was too far from the action. Slayers need to be close.",
        "The Last Drop serves the worst ale on the island, but it's the only ale within five miles.",
        "Thorne's Lodge is full of monster sketches and specimen jars. The man's part scientist, part executioner.",
    ],
};

export const THORNE_DIALOGUE: Record<string, DialogueNode> = {
    start: {
        npcName: "Master Thorne", npcIcon: "thorne",
        text: "Ah, another specimen-- I mean, another slayer. Welcome to the Lodge. The island's menagerie grows daily, and I need someone to... thin the herd. What can I do for you?",
        responses: [
            { text: "I'm looking for a task.", actions: [{ type: 'slayer_get_task', masterId: 'thorne' }] },
            { text: "Tell me about this island.", next: 'lore' },
            { text: "What's with all the sketches?", next: 'sketches' },
            { text: "Goodbye.", next: 'exit' }
        ]
    },
    lore: {
        npcName: "Master Thorne", npcIcon: "thorne",
        text: "Slayer's Respite. A natural convergence point for everything reality filter rejects. Drawn to the Abyssal Rift like maggots to a wound. Fascinating, really. We're just here to make sure they don't migrate back to your 'civilized' mainland.",
        responses: [{ text: "I see.", next: 'start' }]
    },
    sketches: {
        npcName: "Master Thorne", npcIcon: "thorne",
        text: "Documentation. Every specimen has a unique kill metric. The way a Frost Wyvern's scales crack... the precise angle to puncture a Shadow Weaver's void-sac. It's not just a hunt, it's a field study. You're my eyes in the deep, slayer. Don't disappoint me.",
        responses: [{ text: "Right...", next: 'start' }]
    },
    exit: { npcName: "Master Thorne", npcIcon: "thorne", text: "Try not to become an andecote in my next journal entry. Happy hunting.", responses: [] }
};
