/**
 * Quest: The Great Hunt (Main Quest - Ranged Path)
 * =======================================================
 *
 * Grand Narrative & Master's Revelation:
 * --------------------------------------
 * Following the player's initial communion with the divine in "The Saint's First Step," they are sought out
 * by Fenris, a grizzled, one-eyed master hunter who makes his home in the shadows of the Wyrmwood Grove.
 * This is the ultimate trial of the Ranged path, a 2-3 hour journey that spans the entire world.
 *
 * The Twist: Fenris is the mortal vessel for the God of the Hunt. He is seeking a successor to bear the
 * Hunter's Mark. To pass, the player must not just kill, but master the three domains of the wild.
 *
 * --- Stage 1: The Predator's Descent (Frostfang Peaks) ---
 * NPC: **Eira the Cold-Eyed**.
 * Gate: Eira will not acknowledge a 'human' scent. You must become part of the pack before you can
 * challenge the Alpha.
 *
 * Sub-Journey: The Crafting of the Wolf-Masking Oil
 * 1. Journey to the Wyrmwood Grove to find 'Frozen Nightshade' (only blooms in shadows).
 * 2. Hunt a 'Great Plains Bear' in the Sunbright Plains for its 'Primal Fat'.
 * 3. Return to Frostfang to mix the oil at the 'Altar of the Pack'.
 *
 * The Trial: Survival in the Howling Cavern.
 * The player must stay in the cavern for 5 minutes (game time) without a fire. If they use fire, the wolves
 * attack and the trial resets. This tests the player's endurance and patience.
 *
 * --- Stage 2: The Prey's Harmony (Sunbright Plains) ---
 * NPC: **Solas the Sighted**.
 * Gate: The Elder Glimmerhorn is protected by a 'Solar Veil'—a reflection of pure light that shatters
 * ordinary arrows. Only Moon-Glass can pierce it.
 *
 * Sub-Journey: The Forging of Moon-Glass Arrows
 * 1. Mine 'Raw Moonstone' from the Salt Flats specifically during the 'Night' cycle.
 * 2. Seek out a 'Spirit-Infused Willow' in the Silverhaven Forest for the shafts.
 * 3. Defeat a 'Cursed Archer' in the Sunken Labyrinth to obtain 'Spectral String'.
 *
 * The Trial: The Harmony of the Chimes.
 * A complex tracking puzzle where the player must place chimes in a 3x3 grid across the plains,
 * matching the wind's frequency. Getting it wrong scares the stag away for a time.
 *
 * --- Stage 3: The Sky's Ascension (Sunscorched Wastes) ---
 * NPC: **Kael the Desert Ghost**.
 * Gate: The 'Vortex of the Roc' is a zone of lethal heat and 100mph winds. Without the 'Wind-Walker's
 * Mantle', the player is pushed back or killed instantly.
 *
 * Sub-Journey: The Weaving of the Wind-Walker's Mantle
 * 1. Hunt a 'Steam Dragon' in the Volcanic Steam Vents for 'Heat-Resistant Hide'.
 * 2. Gather 'Oasis Silk' from the hidden Oasis—a location that only appears in mirages unless the
 *    player has 'High Perception' or a specific map.
 * 3. Retrieve 'Eagle Down' from the Gale-Swept Peaks.
 *
 * The Trial: The Thermal Trap and the Mesa Climb.
 * Instead of a simple fight, the player must gather volatile sulfur from geysers (dangerous timing),
 * set the trap, and then complete a timed 'Climbing' agility course to pluck the feather from the
 * Roc's wing as it struggles in the updraft.
 *
 * --- The Rite of the Smolder & The Revelation ---
 * Returning to Fenris, the player is exhausted but enlightened. Fenris reveals his true nature.
 * He doesn't just give the lure; he consumes the scents, and his humanity along with it.
 *
 * --- The Grand Hunt: The Descent of the God ---
 * A three-phase battle at the Hunter's Blind.
 * - Phase 1: Range Duel.
 * - Phase 2: Domain Shift (environment changes between Ice, Plains, and Desert).
 * - Phase 3: The Interlock (aiming for the Avatar's own arrows).
 */
import { Quest, SkillName } from '../../types';

export const theGreatHunt: Quest = {
    id: 'the_great_hunt',
    name: "The Great Hunt",
    isHidden: true,
    description: "Fenris, a master hunter in the Wyrmwood Grove, wishes to guide you in a ritual hunt to honor the God of the Hunt and face its divine Avatar.",
    startHint: "Speak to Fenris at the entrance to the Wyrmwood Grove after completing 'The Saint's First Step'.",
    playerStagePerspectives: [
        "Fenris appeared to me like a shadow in the grove. He speaks of a 'Great Hunt' that defines the soul. I must seek out the three Scents of the World.", // 0
        "I found Eira in the Frostfang Peaks. She says I smell too much of 'civilization'. Before she'll guide me, I need to craft an oil to mask my scent. I need ingredients from the grove and the plains.", // 1
        "The Wolf-Masking Oil worked. I survived the cold of the Howling Cavern without a fire, and the pack has accepted me as a challenger. Now for the Alpha Wolf.", // 2
        "The Alpha Wolf died with honor. I have the Pristine Wolf Pelt, but Eira's look tells me this was only the first lap. I must head to the Sunbright Plains to find Solas.", // 3
        "Solas told me about the Solar Veil. My arrows would shatter against the Glimmerhorn. I need to forge Moon-Glass arrows if I ever want to land a shot.", // 4
        "The Moonstone was cold as ice, and the willow wood hums in my hand. With these arrows and the harmony chimes, I can finally challenge the silence of the plains.", // 5
        "Walking with the Elder Glimmerhorn was... spiritual. The Untainted Dust was a gift. Solas's riddle is solved, but Kael in the Wastes awaits. This journey is becoming a pilgrimage.", // 6
        "Kael is nearly a ghost. He says the Roc lives in a vortex of death. I can't even enter the nests without the Wind-Walker's Mantle. I need dragon hide and oasis silk.", // 7
        "The mantle is heavy but holds the wind at bay. I climbed the mesa, set the sulfur trap, and plucked the Perfect Roc Feather from the heart of the storm. Every bone in my body aches.", // 8
        "Fenris has the three scents. But he isn't lighting the lure. He's... becoming it. He says the final scent is my own. I'm terrified, yet I've never felt more ready.", // 9
        "I have defeated the Avatar of the Hunt. Fenris's legacy is now mine. I wear the Hunter's Mark, and the wild of Embrune finally feels like home." // 10
    ],
    completionSummary: "I completed the Great Hunt, a world-spanning ritual that revealed Fenris as the Avatar of the Hunt. By crafting sacred tools and passing the trials of Eira, Solas, and Kael, I proved myself worthy of inheriting the Hunter's Mark and the gift of Protection from Ranged.",
    stages: [
        { description: "Speak to Fenris in the Wyrmwood Grove.", requirement: { type: 'talk', poiId: 'wyrmwood_grove_entrance', npcName: 'Fenris' } }, // 0
        { description: "Gather Frozen Nightshade and Primal Fat to craft Wolf-Masking Oil.", requirement: { type: 'gather', items: [{ itemId: 'wolf_masking_oil', quantity: 1 }] } }, // 1
        { description: "Survive the Howling Cavern and defeat the Alpha Wolf.", requirement: { type: 'gather', items: [{ itemId: 'pristine_wolf_pelt', quantity: 1 }] } }, // 2
        { description: "Find Solas the Sighted in the Sunbright Plains.", requirement: { type: 'talk', poiId: 'sp_whispering_grass', npcName: 'Solas the Sighted' } }, // 3
        { description: "Forge Moon-Glass Arrows from Raw Moonstone, Spirit Willow, and Spectral String.", requirement: { type: 'gather', items: [{ itemId: 'moon_glass_arrows', quantity: 100 }] } }, // 4
        { description: "Place the Harmony Chimes and track the Elder Glimmerhorn Stag.", requirement: { type: 'gather', items: [{ itemId: 'untainted_glimmerhorn_dust', quantity: 1 }] } }, // 5
        { description: "Find Kael the Desert Ghost in the Sunscorched Wastes.", requirement: { type: 'talk', poiId: 'ssw_shifting_sands', npcName: 'Kael the Desert Ghost' } }, // 6
        { description: "Craft the Wind-Walker's Mantle from Steam Dragon Hide and Oasis Silk.", requirement: { type: 'gather', items: [{ itemId: 'wind_walkers_mantle', quantity: 1 }] } }, // 7
        { description: "Set the Thermal Trap and pluck a Perfect Roc Feather from the Mesa.", requirement: { type: 'gather', items: [{ itemId: 'perfect_roc_feather', quantity: 1 }] } }, // 8
        { description: "Return to Fenris with the scents and the Mark of the Hunter.", requirement: { type: 'talk', poiId: 'wyrmwood_grove_entrance', npcName: 'Fenris' } }, // 9
        { description: "Defeat the Avatar of the Hunt in the final coronation.", requirement: { type: 'kill', monsterId: 'avatar_of_the_hunt', quantity: 1 } } // 10
    ],
    rewards: {
        xp: [{ skill: SkillName.Ranged, amount: 25000 }, { skill: SkillName.Slayer, amount: 5000 }],
        coins: 15000,
        // Unlocks Protect from Ranged
    },
};
