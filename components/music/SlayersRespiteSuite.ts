import * as N from '../../constants/musicScore';

/**
 * SLAYERS RESPITE SUITE
 * A massive collection of 28+ tracks for the Slayers Respite region.
 * Each track is hand-crafted with specialized generative logic for unique atmospheres.
 */



// --- TOWN TRACKS ---

// 1. THE GUILDMASTER'S PRIDE (Duskwatch Plaza / Grand)
export const generateGuildmastersPride = (): string => {
    const BPM = 95;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const chords = [
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.G2, bass: N.G1, melody: [N.B3, N.D4, N.G4] },
        { root: N.A2, bass: N.A1, melody: [N.C4, N.E4, N.A4] },
        { root: N.F2, bass: N.F1, melody: [N.A3, N.C4, N.F4] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 4];
        const phrase = Math.floor(bar / 4) % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Military Snare / Timpani Foundation
            if (step % 4 === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.4|vol:0.45\n`;
            }
            if (step % 2 === 0 && step !== 0) {
                // Subtle military snare rhythm using high-pass noise or strings staccato
                score += `${t}:instr:strings_staccato|freq:${N.C5}|dur:0.1|vol:0.25\n`;
            }

            // Sweeping Strings Pad
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:3.0|vol:0.35\n`;
            }

            // French Horn Melody - Stately and Bold
            if (step === 0 || step === 6 || step === 10) {
                const note = (step === 0) ? chord.melody[0] : (step === 6) ? chord.melody[1] : chord.melody[2];
                score += `${t}:instr:french_horn|freq:${note}|dur:0.8|vol:0.5\n`;
            }

            // Epic Brass Accents - Only at phrase ends
            if (phrase === 3 && step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.root * 2}|dur:1.5|vol:0.4\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const DUSKWATCH_PLAZA_SCORE = generateGuildmastersPride();

// 2. THE SALTY SPIRIT (Duskwatch Inn / Pastoral-Lively)
export const generateSaltySpirit = (): string => {
    const BPM = 130;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Chord-based progression for variety
    const progression = [
        { root: N.D3, tones: [N.D3, N.F3, N.A3], bass: N.D2 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.A2, tones: [N.A2, N.Cs3, N.E3], bass: N.A1 },
        { root: N.D3, tones: [N.D3, N.F3, N.A3], bass: N.D2 },
        { root: N.F3, tones: [N.F3, N.A3, N.C4], bass: N.F2 },
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.A2, tones: [N.A2, N.Cs3, N.E3], bass: N.A1 },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = progression[bar % 8];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Bouncy Bass - Alternate between root and 5th for that tavern feel
            if (step === 0 || step === 8) {
                const bassNote = (step === 0) ? chord.bass : chord.tones[2] / 2;
                score += `${t}:instr:fretless_bass|freq:${bassNote}|dur:0.3|vol:0.5\n`;
            }

            // Lively Lute Arpeggios - Cycles through chord tones for richness
            if (step % 2 === 0) {
                const note = chord.tones[(step / 2) % 3];
                score += `${t}:instr:lute|freq:${note}|dur:0.2|vol:0.45\n`;
            }

            // Flute Melodies - Now chooses from the chord tones + a higher octave
            if ((step === 2 || step === 10) && phrase % 2 === 1) {
                const fluteNote = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:spectral_flute|freq:${fluteNote}|dur:0.2|vol:0.4\n`;
                // Add a "trill" to the next tone
                score += `${(currentTime + 100).toFixed(3)}:instr:spectral_flute|freq:${fluteNote * 1.2}|dur:0.1|vol:0.35\n`;
            }

            // Percussive "Stomp" - Marimba acting as wood block
            if (step === 4 || step === 12) {
                score += `${t}:instr:marimba|freq:${N.C2}|dur:0.1|vol:0.4\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const DUSKWATCH_INN_SCORE = generateSaltySpirit();

// 3. COIN & SCORIA (Duskwatch Market / Industrial-Busy)
export const generateCoinAndScoria = (): string => {
    const BPM = 110;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.A2, tones: [N.A2, N.C3, N.E3], bass: N.A1 },
        { root: N.F2, tones: [N.F2, N.A2, N.C3], bass: N.F1 },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Harpsichord "Coin Clinks" - Choosing from high chord tones
            if (step % 4 === 0) {
                const note = chord.tones[step % 3] * 4;
                score += `${t}:instr:harpsichord|freq:${note}|dur:0.1|vol:0.3\n`;
            }
            if (step % 8 === 2) {
                score += `${t}:instr:harpsichord|freq:${chord.tones[1] * 6}|dur:0.1|vol:0.2\n`;
            }

            // Steady Marimba Ostinato - Bouncing between tones
            if (step % 2 === 0) {
                const note = chord.tones[step % 2];
                score += `${t}:instr:marimba|freq:${note}|dur:0.2|vol:0.4\n`;
            }

            // Bouncy Cello Bassline (Fretless Bass)
            if (step === 0 || step === 6 || step === 10) {
                score += `${t}:instr:fretless_bass|freq:${chord.bass}|dur:0.3|vol:0.45\n`;
            }

            // Lute - Fragments of a busy melody
            if ((step === 1 || step === 5 || step === 9) && phrase % 2 === 0) {
                const melNote = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:lute|freq:${melNote}|dur:0.2|vol:0.4\n`;
            }

            // Distant Crystal Bell - Sparkle of high-end goods
            if (step === 0 && phrase === 3) {
                score += `${t}:instr:crystal_bell|freq:${chord.root * 8}|dur:1.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const DUSKWATCH_MARKET_SCORE = generateCoinAndScoria();

// 4. IRON VIGIL (Duskwatch Gates / Heroic-Solemn)
export const generateIronVigil = (): string => {
    const BPM = 80;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
        { root: N.A1, tones: [N.A1, N.C2, N.E2], bass: N.A0 },
        { root: N.G1, tones: [N.G1, N.Bb1, N.D2], bass: N.G0 },
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Deep Timpani Rolls
            if (step === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:1.0|vol:0.5\n`;
            }
            if (phrase === 3 && step > 12) {
                // Building roll at end of phrase
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.2|vol:${0.3 + (step - 12) * 0.1}\n`;
            }

            // Long Brass Holds - Using chord tones for richness
            if (step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.root}|dur:4.0|vol:0.4\n`;
                score += `${t}:instr:french_horn|freq:${chord.tones[1]}|dur:4.0|vol:0.35\n`;
                score += `${t}:instr:french_horn|freq:${chord.tones[2]}|dur:4.0|vol:0.3\n`;
            }

            // Solemn Tubular Bells
            if (step === 0 && (phrase === 0 || phrase === 2)) {
                score += `${t}:instr:tubular_bells|freq:${chord.root}|dur:4.0|vol:0.45\n`;
            }

            // Heavy String Stabs
            if (step === 8 || step === 12) {
                score += `${t}:instr:strings_staccato|freq:${chord.root}|dur:0.2|vol:0.35\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const DUSKWATCH_GATES_SCORE = generateIronVigil();

// --- REGION TRACKS ---

// Thornveil
// 5. EMERALD CANOPY (The Thornveil / Pastoral-Jungle)
export const generateEmeraldCanopy = (): string => {
    const BPM = 85;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.F3, tones: [N.F3, N.A3, N.C4], bass: N.F2 },
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
        { root: N.D3, tones: [N.D3, N.F3, N.A3], bass: N.D2 },
        { root: N.Bb2, tones: [N.Bb2, N.D3, N.F3], bass: N.Bb1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Rolling Concert Harp - Cycling through chord tones
            if (step % 2 === 0) {
                const note = chord.tones[step % 3];
                score += `${t}:instr:concert_harp|freq:${note}|dur:0.4|vol:0.35\n`;
            }

            // Ocarina "Bird Calls" - Choosing from high extensions
            if (step === 4 || step === 12) {
                const birdNote = chord.tones[Math.floor(Math.random() * 3)] * 2.5;
                score += `${t}:instr:ocarina|freq:${birdNote}|dur:0.1|vol:0.4\n`;
                score += `${(currentTime + 100).toFixed(3)}:instr:ocarina|freq:${birdNote * 1.1}|dur:0.1|vol:0.35\n`;
            }

            // Soft Marimba Rhythm
            if (step === 0 || step === 10) {
                score += `${t}:instr:marimba|freq:${chord.bass}|dur:0.2|vol:0.3\n`;
            }

            // Gentle Strings Pad
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const THORNVEIL_GEN_SCORE = generateEmeraldCanopy();

// 6. DANCERS OF THE LEAF (Thornveil Canopy / Mystic-Percussive)
export const generateDancersOfTheLeaf = (): string => {
    const BPM = 100;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.A2, tones: [N.A2, N.C3, N.E3], bass: N.A1 },
        { root: N.E2, tones: [N.E2, N.G2, N.B2], bass: N.E1 },
        { root: N.F2, tones: [N.F2, N.A2, N.C3], bass: N.F1 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Fast Tabla Rhythm - Now with tonal variety
            if (step % 4 === 0 || step === 14) {
                score += `${t}:instr:tabla|freq:${chord.bass}|dur:0.15|vol:0.5\n`;
            }
            if (step === 2 || step === 6 || step === 10) {
                score += `${t}:instr:tabla|freq:${chord.root}|dur:0.1|vol:0.4\n`;
            }

            // Spectral Flute Trills - Randomly choosing from high chord tones
            if ((step === 0 || step === 8) && phrase % 2 === 0) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:spectral_flute|freq:${note}|dur:0.4|vol:0.4\n`;
                score += `${(currentTime + 100).toFixed(3)}:instr:spectral_flute|freq:${note * 1.25}|dur:0.2|vol:0.35\n`;
            }

            // Rhythmic Concert Harp
            if (step % 2 === 1) {
                score += `${t}:instr:concert_harp|freq:${chord.tones[step % 3] * 2}|dur:0.1|vol:0.35\n`;
            }

            // Low Woodwind Pad
            if (step === 0) {
                score += `${t}:instr:french_horn|freq:${chord.root / 2}|dur:4.0|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const THORNVEIL_MYSTIC_SCORE = generateDancersOfTheLeaf();

// 7. STRANGLE-ROOT (Inner Thornveil / Mystic-Tense)
export const generateStrangleRoot = (): string => {
    const BPM = 65;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Dissonant, muddy chords
    const progression = [
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
        { root: N.G1, tones: [N.G1, N.Ab1, N.B1], bass: N.G0 },
        { root: N.A1, tones: [N.A1, N.Bb1, N.Cs2], bass: N.A0 },
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Dissonant String Drone
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:4.0|vol:0.3\n`;
                if (phrase % 2 === 1) {
                    score += `${t}:instr:strings_legato|freq:${chord.tones[1]}|dur:4.0|vol:0.2\n`; // Use the minor 2nd clash
                }
            }

            // Deep Wooden Thuds
            if (step === 0 || step === 12) {
                score += `${t}:instr:timpani|freq:${N.C1}|dur:0.2|vol:0.4\n`;
            }

            // Low "Bassoon" Flute
            if (step === 4 || step === 10) {
                score += `${t}:instr:spectral_flute|freq:${chord.tones[Math.floor(Math.random() * 3)]}|dur:1.0|vol:0.35\n`;
            }

            // Eerie Percussion
            if (step % 8 === 6) {
                score += `${t}:instr:marimba|freq:${chord.bass}|dur:0.1|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const THORNVEIL_DEEP_SCORE = generateStrangleRoot();

// Scorched Hollow
// 8. ASH AND EMBER (The Scorched Hollow / Volcanic-Atmospheric)
export const generateAshAndEmber = (): string => {
    const BPM = 60;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C2, tones: [N.C2, N.Eb2, N.G2], bass: N.C1 },
        { root: N.Ab1, tones: [N.Ab1, N.C2, N.Eb2], bass: N.Ab0 },
        { root: N.G1, tones: [N.G1, N.B1, N.D2], bass: N.G0 },
        { root: N.C2, tones: [N.C2, N.Eb2, N.G2], bass: N.C1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Low Heat Drone (Epic Brass + Strings Legato)
            if (step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.root}|dur:4.0|vol:0.3\n`;
                score += `${t}:instr:strings_legato|freq:${chord.bass}|dur:4.0|vol:0.25\n`;
            }

            // Crackling Ash Effect (High chord tones)
            if (step % 2 === 0 && Math.sin(bar * 10 + step) > 0.5) {
                const ashNote = chord.tones[step % 3] * 8;
                score += `${t}:instr:strings_staccato|freq:${ashNote}|dur:0.1|vol:0.15\n`;
            }

            // Mournful French Horn Melody
            if (step === 4 || step === 12) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 1.5;
                score += `${t}:instr:french_horn|freq:${note}|dur:1.5|vol:0.4\n`;
            }

            // Distant Timpani "Eruption"
            if (step === 0 && phrase === 3 && bar % 8 === 7) {
                score += `${t}:instr:timpani|freq:${N.C1}|dur:1.0|vol:0.5\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const SCORCHED_GEN_SCORE = generateAshAndEmber();

// 9. OBSIDIAN HEART (Obsidian Peak / Volcanic-Shimmering)
export const generateObsidianHeart = (): string => {
    const BPM = 105;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C3, tones: [N.C3, N.Eb3, N.G3], bass: N.C2 },
        { root: N.G2, tones: [N.G2, N.Bb2, N.D3], bass: N.G1 },
        { root: N.Eb2, tones: [N.Eb2, N.G2, N.Bb2], bass: N.Eb1 },
        { root: N.Ab2, tones: [N.Ab2, N.C3, N.Eb3], bass: N.Ab1 },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Shimmering Crystal Bells - Randomly choosing from high tones
            if (step % 8 === 0) {
                const bellNote = chord.tones[Math.floor(Math.random() * 3)] * 4;
                score += `${t}:instr:crystal_bell|freq:${bellNote}|dur:1.0|vol:0.4\n`;
            }

            // Glassy Harpsichord Rhythm
            if (step % 2 === 0) {
                const note = chord.tones[step % 3] * 2;
                score += `${t}:instr:harpsichord|freq:${note}|dur:0.1|vol:0.3\n`;
            }

            // Deep Fretless Bass
            if (step === 0 || step === 8) {
                score += `${t}:instr:fretless_bass|freq:${chord.bass}|dur:0.4|vol:0.5\n`;
            }

            // Celesta Melody - Fragile and bright
            if (step === 2 || step === 10) {
                const celNote = chord.tones[Math.floor(Math.random() * 3)] * 5;
                score += `${t}:instr:celesta|freq:${celNote}|dur:0.5|vol:0.35\n`;
            }

            // Strings Pad
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const SCORCHED_SECONDARY_SCORE = generateObsidianHeart();

// 10. FORGE OF THE SUN (Magma Cathedral / Volcanic-Grand)
export const generateForgeOfTheSun = (): string => {
    const BPM = 75;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
        { root: N.A1, tones: [N.A1, N.C2, N.E2], bass: N.A0 },
        { root: N.Bb1, tones: [N.Bb1, N.D2, N.F2], bass: N.Bb0 },
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Heavy "Anvil" Hits (Timpani + Marimba Accent)
            if (step === 0 || step === 12) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.6\n`;
                score += `${t}:instr:marimba|freq:${chord.tones[step % 3] * 4}|dur:0.2|vol:0.4\n`;
            }

            // Resonant Low Choirs
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:4.0|vol:0.45\n`;
            }

            // Epic Brass Swells
            if (step === 0 || step === 8) {
                score += `${t}:instr:epic_brass|freq:${chord.tones[1]}|dur:2.0|vol:0.4\n`;
            }

            // Strings Staccato - Intense heat rhythm
            if (step % 4 === 2) {
                score += `${t}:instr:strings_staccato|freq:${chord.root}|dur:0.2|vol:0.35\n`;
            }

            // Tubular Bells
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:tubular_bells|freq:${chord.root}|dur:4.0|vol:0.4\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const SCORCHED_DEEP_SCORE = generateForgeOfTheSun();

// Bonemarsh
// 11. MIST OF THE FALLEN (The Bonemarsh / Desolate-Swamp)
export const generateMistOfTheFallen = (): string => {
    const BPM = 50;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [N.A2, N.F2, N.E2, N.A2, N.C3, N.G2, N.F2, N.E2];

    for (let bar = 0; bar < 64; bar++) {
        const root = progression[bar % 8];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Mournful Strings (Violin Solo feel)
            if (step === 0 || step === 8) {
                score += `${t}:instr:strings_legato|freq:${root * 2}|dur:3.5|vol:0.4\n`;
            }

            // Ghostly Choirs
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${root}|dur:8.0|vol:0.35\n`;
            }

            // Slow Piano Notes
            if (step % 4 === 2) {
                score += `${t}:instr:piano_forte|freq:${root / 2}|dur:1.0|vol:0.3\n`;
            }

            // High Spectral Flute - The wind in the reeds
            if (step === 4 && phrase === 3) {
                score += `${t}:instr:spectral_flute|freq:${root * 4}|dur:2.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const BONEMARSH_GEN_SCORE = generateMistOfTheFallen();

// 12. KAELEN'S VIGIL (Mire Watcher Hut / Mystic-Introspective)
export const generateKaelensVigil = (): string => {
    const BPM = 55;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
        { root: N.Bb1, tones: [N.Bb1, N.D2, N.F2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Cs2, N.E2], bass: N.A0 },
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Introspective Cello Melody (Fretless Bass)
            if (step === 0 || step === 10) {
                const note = (step === 0) ? chord.root : chord.tones[1];
                score += `${t}:instr:fretless_bass|freq:${note}|dur:0.8|vol:0.45\n`;
            }

            // Celesta Sparkles - Fragile and magical
            if (step % 6 === 0) {
                score += `${t}:instr:celesta|freq:${chord.tones[step % 3] * 4}|dur:0.4|vol:0.35\n`;
            }

            // Gentle Harp Accents
            if (step === 4 || step === 12) {
                score += `${t}:instr:concert_harp|freq:${chord.tones[1] * 2}|dur:0.3|vol:0.4\n`;
            }

            // Soft Choir Pad
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:choir_aahs|freq:${chord.bass}|dur:8.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const BONEMARSH_MYSTIC_SCORE = generateKaelensVigil();

// 13. THE SINKING HEART (Mire Core / Desolate-Deep)
export const generateSinkingHeart = (): string => {
    const BPM = 45;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
        { root: N.C2, tones: [N.C2, N.Eb2, N.Gb2], bass: N.C1 },
        { root: N.Bb1, tones: [N.Bb1, N.D2, N.F2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Cs2, N.E2], bass: N.A0 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Heartbeat Drum (Timpani)
            if (step === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.2|vol:0.45\n`;
                score += `${(currentTime + 200).toFixed(3)}:instr:timpani|freq:${chord.bass}|dur:0.2|vol:0.3\n`;
            }

            // Low String Pad - Suffocating and deep
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.4\n`;
            }

            // Lonely Spectral Flute - Choosing from chord tones
            if (step === 6 && phrase % 2 === 1) {
                const fluteNote = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:spectral_flute|freq:${fluteNote}|dur:2.5|vol:0.3\n`;
            }

            // Gurgling Percussion (Marimba at low freq)
            if (step % 4 === 3) {
                score += `${t}:instr:marimba|freq:${chord.root}|dur:0.1|vol:0.2\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const BONEMARSH_DEEP_SCORE = generateSinkingHeart();

// Shattered Coast
// 14. BRINE & BONE (The Shattered Coast / Pastoral-Coastal)
export const generateBrineAndBone = (): string => {
    const BPM = 75;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
        { root: N.F2, tones: [N.F2, N.A2, N.C3], bass: N.F1 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Wave-like Cello Melody (Fretless Bass)
            if (step % 8 === 0) {
                const note = (step === 0) ? chord.root : chord.tones[2];
                score += `${t}:instr:fretless_bass|freq:${note}|dur:1.5|vol:0.45\n`;
            }

            // Rolling Harp Arpeggios - Cycling through chord
            if (step % 2 === 0) {
                const note = chord.tones[(step / 2) % 3];
                score += `${t}:instr:concert_harp|freq:${note}|dur:0.4|vol:0.35\n`;
            }

            // Soft Timpani - The distant boom of the surf
            if (step === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.35\n`;
            }

            // Strings Legato - Distant horizon
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const COAST_GEN_SCORE = generateBrineAndBone();

// 15. EYRIE'S CALL (Shattered Cliffs / Grand-Coastal)
export const generateEyriesCall = (): string => {
    const BPM = 95;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D3, tones: [N.D3, N.F3, N.A3], bass: N.D2 },
        { root: N.A2, tones: [N.A2, N.C3, N.E3], bass: N.A1 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.D3, tones: [N.D3, N.F3, N.A3], bass: N.D2 },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // High Brass Fanfares - Using chord tones for richness
            if (step === 0 || step === 10) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:epic_brass|freq:${note}|dur:0.8|vol:0.5\n`;
                score += `${t}:instr:french_horn|freq:${note / 2}|dur:0.8|vol:0.4\n`;
            }

            // Fast Rhythmic Violins (Strings Staccato)
            if (step % 2 === 0) {
                const note = chord.tones[step % 3] * 2;
                score += `${t}:instr:strings_staccato|freq:${note}|dur:0.1|vol:0.35\n`;
            }

            // High Wind Effect
            if (step % 4 === 1 && Math.sin(bar + step) > 0) {
                score += `${t}:instr:strings_staccato|freq:${N.C7}|dur:0.2|vol:0.15\n`;
            }

            // Deep Timpani Accents
            if (step === 0 || (phrase === 3 && step === 14)) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.4|vol:0.4\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const COAST_GRAND_SCORE = generateEyriesCall();

// 16. LUSTRE OF THE DEEP (Drowned Lake / Mystic-Underwater)
export const generateLustreOfTheDeep = (): string => {
    const BPM = 60;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.G2, tones: [N.G2, N.Bb2, N.D3, N.F3], bass: N.G1 },
        { root: N.C3, tones: [N.C3, N.Eb3, N.G3, N.Bb3], bass: N.C2 },
        { root: N.F2, tones: [N.F2, N.Ab2, N.C3, N.Eb3], bass: N.F1 },
        { root: N.Bb2, tones: [N.Bb2, N.D3, N.F3, N.Ab3], bass: N.Bb1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Bioluminescent "Pings" (Crystal Bell) - Randomly choosing from high extensions
            if (step % 6 === 0) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 4;
                score += `${t}:instr:crystal_bell|freq:${note}|dur:1.0|vol:0.35\n`;
            }

            // Bubbling Arpeggios (Celesta)
            if (step % 2 === 0) {
                const note = chord.tones[step % 4] * 2;
                score += `${t}:instr:celesta|freq:${note}|dur:0.3|vol:0.3\n`;
            }

            // Muted Bass (Fretless Bass)
            if (step === 0 || step === 10) {
                score += `${t}:instr:fretless_bass|freq:${chord.bass}|dur:1.5|vol:0.4\n`;
            }

            // Distant Sub-Atmospheric Strings
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const COAST_MYSTIC_SCORE = generateLustreOfTheDeep();

// Frostspine Ridge
// 17. GLACIAL BREATH (Frostspine Ridge / Desolate-Cold)
export const generateGlacialBreath = (): string => {
    const BPM = 55;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C3, tones: [N.C3, N.Eb3, N.G3], bass: N.C2 },
        { root: N.Ab2, tones: [N.Ab2, N.C3, N.Eb3], bass: N.Ab1 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.C3, tones: [N.C3, N.Eb3, N.G3], bass: N.C2 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // "Frozen" String Pads - Using chord tones for richness
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.35\n`;
                if (phrase % 2 === 1) {
                    score += `${t}:instr:strings_legato|freq:${chord.tones[1]}|dur:8.0|vol:0.2\n`;
                }
            }

            // Lonely Celesta Melody - Randomly choosing from high extensions
            if (step % 6 === 0 && Math.sin(bar + step) > 0.2) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 4;
                score += `${t}:instr:celesta|freq:${note}|dur:1.0|vol:0.4\n`;
            }

            // High Crystal Bell "Ice Cracks"
            if (step === 10 && phrase === 3) {
                score += `${t}:instr:crystal_bell|freq:${chord.root * 8}|dur:0.5|vol:0.3\n`;
            }

            // Very Low Timpani - The shifting ice
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass / 4}|dur:0.4|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const FROSTSPINE_GEN_SCORE = generateGlacialBreath();

// 18. ECHOES OF THE PEAK (Base Camp / Pastoral-Cold)
export const generateEchoesOfThePeak = (): string => {
    const BPM = 70;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.C3, tones: [N.C3, N.E3, N.G3], bass: N.C2 },
        { root: N.D3, tones: [N.D3, N.Fs3, N.A3], bass: N.D2 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Warm Lute Melody - Choosing from chord tones
            if (step % 4 === 0) {
                const note = chord.tones[step % 3];
                score += `${t}:instr:lute|freq:${note}|dur:0.4|vol:0.45\n`;
            }
            if (step === 10) {
                score += `${t}:instr:lute|freq:${chord.tones[1]}|dur:0.3|vol:0.4\n`;
            }

            // Echoing French Horn - From the peaks
            if (step === 0 && phrase % 2 === 0) {
                const note = chord.tones[2] * 2;
                score += `${t}:instr:french_horn|freq:${note}|dur:2.0|vol:0.35\n`;
                // The "Echo"
                score += `${(currentTime + 1200).toFixed(3)}:instr:french_horn|freq:${note}|dur:1.5|vol:0.2\n`;
            }

            // Soft Marimba Rhythm
            if (step % 2 === 1) {
                score += `${t}:instr:marimba|freq:${N.C4}|dur:0.1|vol:0.2\n`;
            }

            // Gentle Strings Pad
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:8.0|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const FROSTSPINE_PASTORAL_SCORE = generateEchoesOfThePeak();

// 19. DRAGON'S SKELETON (Ancient Peak / Grand-Cold)
export const generateDragonsSkeleton = (): string => {
    const BPM = 85;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
        { root: N.G1, tones: [N.G1, N.Bb1, N.D2], bass: N.G0 },
        { root: N.A1, tones: [N.A1, N.Cs2, N.E2], bass: N.A0 },
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Massive Low Brass Blasts
            if (step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.root}|dur:4.0|vol:0.6\n`;
                score += `${t}:instr:french_horn|freq:${chord.tones[2]}|dur:4.0|vol:0.45\n`;
            }

            // Heavy Orchestral Percussion
            if (step === 0 || step === 4 || step === 8 || step === 12) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.4|vol:0.55\n`;
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:marimba|freq:${chord.tones[2] * 4}|dur:0.2|vol:0.5\n`;
                }
            }

            // Staccato String Rhythms
            if (step % 2 === 0 && step % 4 !== 0) {
                score += `${t}:instr:strings_staccato|freq:${chord.root * 2}|dur:0.1|vol:0.4\n`;
            }

            // High Crystal Bell
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:crystal_bell|freq:${chord.root * 8}|dur:1.0|vol:0.35\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const FROSTSPINE_GRAND_SCORE = generateDragonsSkeleton();

// Abyssal Expanse
// 20. VIOLET HAZE (The Abyssal Expanse / Eerie-Void)
export const generateVioletHaze = (): string => {
    const BPM = 50;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Chromatic/Unnatural progression
    const progression = [
        { root: N.C2, tones: [N.C2, N.Cs2, N.E2, N.G2], bass: N.C1 },
        { root: N.Cs2, tones: [N.Cs2, N.D2, N.F2, N.Ab2], bass: N.Cs1 },
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2, N.A2], bass: N.D1 },
        { root: N.Cs2, tones: [N.Cs2, N.E2, N.G2, N.Bb2], bass: N.Cs1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Pulsing Void Pad (Spectral Pad)
            if (step === 0) {
                score += `${t}:instr:spectral_pad|freq:${chord.root}|dur:8.0|vol:0.4\n`;
            }
            if (step === 8) {
                score += `${t}:instr:spectral_pad|freq:${chord.tones[1]}|dur:4.0|vol:0.3\n`;
            }

            // Fragile Music Box - Randomly choosing from high extensions
            if (step % 6 === 0 && Math.sin(bar * 3 + step) > 0) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 4;
                score += `${t}:instr:music_box|freq:${note}|dur:1.0|vol:0.35\n`;
            }

            // Metallic Percussion (Marimba + Harpsichord)
            if (step % 4 === 3) {
                score += `${t}:instr:marimba|freq:${chord.tones[2]}|dur:0.1|vol:0.25\n`;
                score += `${t}:instr:harpsichord|freq:${chord.tones[3] * 2}|dur:0.1|vol:0.2\n`;
            }

            // Ethereal Choir Whisper
            if (step === 0 && phrase === 2) {
                score += `${t}:instr:choir_aahs|freq:${chord.tones[2]}|dur:4.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const ABYSSAL_GEN_SCORE = generateVioletHaze();


// 21. LOST RESEARCH (Observer's Post / Mystic-Void)
export const generateLostResearch = (): string => {
    const BPM = 65;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.Ab2, N.B2], bass: N.D1 },
        { root: N.Bb1, tones: [N.Bb1, N.D2, N.F2, N.Ab2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Cs2, N.E2, N.G2], bass: N.A0 },
        { root: N.D2, tones: [N.D2, N.F2, N.Ab2, N.B2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Erratic Harpsichord Riffs - Scientific curiosity gone wrong
            if (step % 3 === 0 && Math.sin(bar + step) > -0.5) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 2;
                score += `${t}:instr:harpsichord|freq:${note}|dur:0.15|vol:0.35\n`;
            }

            // Humming Void Pad
            if (step === 0) {
                score += `${t}:instr:spectral_pad|freq:${chord.bass}|dur:6.0|vol:0.3\n`;
                score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:6.0|vol:0.25\n`;
            }

            // Fragile Lead (Spectral Flute)
            if (step === 8 && phrase % 2 === 1) {
                score += `${t}:instr:spectral_flute|freq:${chord.tones[2] * 1.5}|dur:2.0|vol:0.3\n`;
            }

            // Irregular "Click" Percussion
            if (step % 5 === 2) {
                score += `${t}:instr:marimba|freq:${N.C6}|dur:0.05|vol:0.15\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const ABYSSAL_MYSTIC_SCORE = generateLostResearch();

// 22. EVENT HORIZON (Final Approach / Eerie-Void)
export const generateEventHorizon = (): string => {
    const BPM = 40;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C2, tones: [N.C2, N.Db2, N.Eb2, N.Gb2], bass: N.C1 },
        { root: N.B1, tones: [N.B1, N.C2, N.D2, N.F2], bass: N.B0 },
        { root: N.Bb1, tones: [N.Bb1, N.B1, N.Db2, N.Fs2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Bb1, N.C2, N.Eb2], bass: N.A0 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Deep Sub-Bass Hits
            if (step === 0 || step === 12) {
                score += `${t}:instr:timpani|freq:${chord.bass / 2}|dur:0.5|vol:0.5\n`;
            }

            // Ringing Synths
            if (step % 8 === 4) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 10;
                score += `${t}:instr:crystal_bell|freq:${note}|dur:2.0|vol:0.4\n`;
                score += `${t}:instr:celesta|freq:${note * 1.2}|dur:1.5|vol:0.3\n`;
            }

            // Accelerating Marimba Pattern
            const accelStep = (step > 8) ? 1 : 2;
            if (step % accelStep === 0 && step > 0) {
                const note = chord.tones[step % 4] * 2;
                score += `${t}:instr:marimba|freq:${note}|dur:0.1|vol:${0.15 + (step / 16) * 0.2}\n`;
            }

            // Black Hole Pad
            if (step === 0) {
                score += `${t}:instr:spectral_pad|freq:${chord.root}|dur:12.0|vol:0.45\n`;
                score += `${t}:instr:strings_legato|freq:${chord.bass}|dur:12.0|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const ABYSSAL_EERIE_SCORE = generateEventHorizon();

// --- DUNGEON TRACKS ---

// 23. CRYPT WHISPERS (Hollowed Barrow Entrance / Eerie-Dungeon)
export const generateCryptWhispers = (): string => {
    const BPM = 55;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.A2, tones: [N.A2, N.C3, N.E3], bass: N.A1 },
        { root: N.F2, tones: [N.F2, N.Ab2, N.C3], bass: N.F1 },
        { root: N.G2, tones: [N.G2, N.B2, N.D3], bass: N.G1 },
        { root: N.E2, tones: [N.E2, N.G2, N.B2], bass: N.E1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Mournful Choir Pad
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:8.0|vol:0.4\n`;
            }

            // Whispering Spectral Flute
            if (step % 8 === 4) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 4;
                score += `${t}:instr:spectral_flute|freq:${note}|dur:2.0|vol:0.35\n`;
            }

            // Solemn Tubular Bells
            if (step === 0 && (phrase === 0 || phrase === 2)) {
                score += `${t}:instr:tubular_bells|freq:${chord.bass}|dur:4.0|vol:0.45\n`;
            }

            // Low Eerie String Accent
            if (step === 12) {
                score += `${t}:instr:strings_legato|freq:${chord.tones[1] * 1.5}|dur:1.0|vol:0.25\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const BARROW_ENTRY_SCORE = generateCryptWhispers();

// 24. ANCIENT SARCOPHAGUS (Hollowed Barrow Heart / Eerie-Deep)
export const generateAncientSarcophagus = (): string => {
    const BPM = 45;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
        { root: N.Bb1, tones: [N.Bb1, N.Db2, N.F2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Bb1, N.Cs2], bass: N.A0 },
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Deep String Drone
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.bass}|dur:8.0|vol:0.45\n`;
            }

            // Stone Sliding Sound
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:timpani|freq:${N.C1}|dur:4.0|vol:0.4\n`;
            }

            // Low Choir Accent
            if (step === 8) {
                score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:2.0|vol:0.35\n`;
            }

            // Dissonant String Stab
            if (step === 14 && phrase === 3) {
                score += `${t}:instr:strings_staccato|freq:${chord.tones[1]}|dur:0.2|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const BARROW_INNER_SCORE = generateAncientSarcophagus();

// 25. HISS OF THE DEEPS (Cinderforge Entrance / Industrial-Dungeon)
export const generateHissOfTheDeeps = (): string => {
    const BPM = 100;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C2, tones: [N.C2, N.Eb2, N.G2], bass: N.C1 },
        { root: N.G1, tones: [N.G1, N.Bb1, N.D2], bass: N.G0 },
        { root: N.Ab1, tones: [N.Ab1, N.C2, N.Eb2], bass: N.Ab0 },
        { root: N.G1, tones: [N.G1, N.B1, N.D2], bass: N.G0 },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Rhythmic Metal Clanging (Marimba + Timpani Accent)
            if (step % 4 === 0) {
                score += `${t}:instr:marimba|freq:${chord.tones[Math.floor(Math.random() * 3)] * 4}|dur:0.1|vol:0.45\n`;
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.2|vol:0.4\n`;
            }

            // Steam "Hissing" (High-pass Strings Staccato cluster)
            if (step % 8 === 2) {
                score += `${t}:instr:strings_staccato|freq:${N.C7}|dur:0.4|vol:0.25\n`;
                score += `${(currentTime + 50).toFixed(3)}:instr:strings_staccato|freq:${N.Cs7}|dur:0.4|vol:0.2\n`;
            }

            // Deep Forge Pad (Epic Brass)
            if (step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.root}|dur:4.0|vol:0.4\n`;
            }

            // Rhythmic French Horn - The internal machinery
            if (step % 4 === 1) {
                score += `${t}:instr:french_horn|freq:${chord.tones[1] * 1.5}|dur:0.2|vol:0.35\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const FORGE_ENTRY_SCORE = generateHissOfTheDeeps();

// 26. MASTER'S HAMMER (Cinderforge Heart / Industrial-Triumphant)
export const generateMastersHammer = (): string => {
    const BPM = 120;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.F2, N.A2], bass: N.D1 },
        { root: N.A1, tones: [N.A1, N.C2, N.E2], bass: N.A0 },
        { root: N.Bb1, tones: [N.Bb1, N.D2, N.F2], bass: N.Bb0 },
        { root: N.A1, tones: [N.A1, N.Cs2, N.E2], bass: N.A0 },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Massive "Hammer" Hits (Timpani + Marimba + Low Strings)
            if (step === 0 || step === 8) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.4|vol:0.65\n`;
                score += `${t}:instr:marimba|freq:${chord.tones[Math.floor(Math.random() * 3)] * 4}|dur:0.2|vol:0.5\n`;
                score += `${t}:instr:strings_staccato|freq:${chord.bass}|dur:0.2|vol:0.45\n`;
            }

            // Triumphant Brass Fanfares
            if (step === 0 || step === 10 || (phrase === 3 && step === 14)) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 2;
                score += `${t}:instr:epic_brass|freq:${note}|dur:1.0|vol:0.6\n`;
                score += `${t}:instr:french_horn|freq:${note / 2}|dur:1.0|vol:0.5\n`;
            }

            // Industrial Choir Chants
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:4.0|vol:0.4\n`;
            }

            // Fast Rhythmic Harpsichord - Like spinning gears
            if (step % 2 === 0) {
                score += `${t}:instr:harpsichord|freq:${chord.tones[step % 3] * 4}|dur:0.1|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const FORGE_INNER_SCORE = generateMastersHammer();

// 27. SHATTERED REALITY (Abyssal Rift Entrance / Eerie-Void-Dungeon)
export const generateShatteredReality = (): string => {
    const BPM = 50;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.C2, tones: [N.C2, N.Cs2, N.E2, N.G2], bass: N.C1 },
        { root: N.Cs2, tones: [N.Cs2, N.D2, N.F2, N.Ab2], bass: N.Cs1 },
        { root: N.F2, tones: [N.F2, N.Fs2, N.A2, N.C3], bass: N.F1 },
        { root: N.E2, tones: [N.E2, N.F2, N.Ab2, N.B2], bass: N.E1 },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Glitchy Spectral Pad - Pulsing and unstable
            if (step % 8 === 0) {
                score += `${t}:instr:spectral_pad|freq:${chord.root}|dur:4.0|vol:0.4\n`;
                if (Math.sin(bar * 7 + step) > 0.5) {
                    // "Pitch Glitch"
                    score += `${(currentTime + 100).toFixed(3)}:instr:spectral_pad|freq:${chord.tones[1]}|dur:0.1|vol:0.2\n`;
                }
            }

            // Crystalline Bell "Glitches" - Fast, high fragments
            if ((step === 2 || step === 10 || step === 14) && Math.sin(bar + step) > 0.3) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 8;
                score += `${t}:instr:crystal_bell|freq:${note}|dur:0.1|vol:0.35\n`;
            }

            // Fragile Music Box Melody - Choosing from chord tones
            if (step % 6 === 0 && phrase % 2 === 0) {
                const note = chord.tones[Math.floor(Math.random() * 4)] * 3;
                score += `${t}:instr:music_box|freq:${note}|dur:0.8|vol:0.35\n`;
            }

            // Ethereal Choir Whisper
            if (step === 0 && phrase === 3) {
                score += `${t}:instr:choir_aahs|freq:${chord.tones[2] * 1.5}|dur:4.0|vol:0.3\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const RIFT_ENTRY_SCORE = generateShatteredReality();

// 28. THE UNMAKING (Abyssal Rift Heart / Mystic-Void-Dungeon)
export const generateTheUnmaking = (): string => {
    const BPM = 40;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    const progression = [
        { root: N.D2, tones: [N.D2, N.Eb2, N.Fs2], bass: N.D1 },
        { root: N.C2, tones: [N.C2, N.Db2, N.E2], bass: N.C1 },
        { root: N.B1, tones: [N.B1, N.C2, N.D2], bass: N.B0 },
        { root: N.Bb1, tones: [N.Bb1, N.B1, N.Db2], bass: N.Bb0 },
    ];

    for (let bar = 0; bar < 96; bar++) {
        const chord = progression[bar % 4];
        const phrase = bar % 8;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Absolute Silence punctuated by Chaotic Blasts
            if (phrase === 0 || phrase === 4) {
                if (step === 0) {
                    // Massive Orchestral Blast
                    score += `${t}:instr:epic_brass|freq:${chord.root}|dur:2.0|vol:0.65\n`;
                    score += `${t}:instr:choir_aahs|freq:${chord.tones[1] * 1.5}|dur:2.0|vol:0.6\n`;
                    score += `${t}:instr:timpani|freq:${chord.bass / 2}|dur:0.5|vol:0.7\n`;
                }
            }

            // Eerie "Ticking" (Crystal Bell + Harpsichord)
            if (step % 4 === 0) {
                score += `${t}:instr:crystal_bell|freq:${N.C8}|dur:0.05|vol:0.3\n`;
                score += `${t}:instr:harpsichord|freq:${N.C7}|dur:0.05|vol:0.2\n`;
            }

            // Unstable Void Hum (Spectral Pad) - Fades in and out
            if (phrase > 4) {
                if (step === 0) {
                    score += `${t}:instr:spectral_pad|freq:${chord.root}|dur:8.0|vol:${0.2 + (phrase - 4) * 0.05}\n`;
                }
            }

            // Fragile Lead (Music Box) - Fragmented melody
            if (step % 7 === 0 && Math.sin(bar) > 0.5) {
                const note = chord.tones[Math.floor(Math.random() * 3)] * 5;
                score += `${t}:instr:music_box|freq:${note}|dur:0.5|vol:0.4\n`;
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};
export const RIFT_INNER_SCORE = generateTheUnmaking();
