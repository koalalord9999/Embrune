import * as N from '../../constants/musicScore';

/**
 * OAKHAVEN SUITE
 * A consolidated collection of tracks for the Oakhaven crafting town.
 * Warm, woody, industrious — sawdust, leather, and hearth fires.
 */

// 1. SAWDUST & AMBITION (Region Default)
export const generateSawdustAndAmbition = (): string => {
    const BPM = 100;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Am - F - C - G - Dm - Am - F - Em (8-bar, warm minor-major)
    const chords = [
        { root: N.A2, bass: N.A1, melody: [N.A3, N.C4, N.E4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.G2, bass: N.G1, melody: [N.G3, N.B3, N.D4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.C4, N.E4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.E2, bass: N.E1, melody: [N.E3, N.G3, N.B3] },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Marimba heartbeat — gives that woody, warm pulse
            if (step === 0) {
                score += `${t}:instr:marimba|freq:${chord.bass}|dur:0.3|vol:0.5\n`;
                score += `${t}:instr:fretless_bass|freq:${chord.root / 2}|dur:0.4|vol:0.45\n`;
            }
            if (step === 8) {
                score += `${t}:instr:marimba|freq:${chord.bass * 1.5}|dur:0.3|vol:0.4\n`;
            }
            // Syncopated marimba on phrase endings
            if (phrase === 3 && step === 12) {
                score += `${t}:instr:marimba|freq:${chord.root}|dur:0.2|vol:0.45\n`;
            }

            // Lute driving rhythm — the crafters working
            if (step === 4 || step === 10) {
                score += `${t}:instr:lute|freq:${chord.root}|dur:0.25|vol:0.5\n`;
            }
            if (phrase % 2 === 1 && step === 14) {
                score += `${t}:instr:lute|freq:${chord.melody[0]}|dur:0.15|vol:0.4\n`;
            }

            // Stage 1+: Ocarina melody — the craftsman's whistle
            if (stage >= 1) {
                if (step === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.45\n`;
                }
                if (step === 6 && phrase % 2 === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.5|vol:0.4\n`;
                }
                if (phrase === 3 && step === 10) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[0] * 2}|dur:0.4|vol:0.5\n`;
                }
            }

            // Stage 2+: Harp arpeggios weaving through — delicate detail work
            if (stage >= 2) {
                if (step % 4 === 0) {
                    const arpIdx = (step / 4 + phrase) % chord.melody.length;
                    score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.3|vol:0.35\n`;
                }
            }

            // Stage 3: Strings swell — the pride of finished craft
            if (stage >= 3) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.0|vol:0.3\n`;
                }
                if (step === 8) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[0]}|dur:0.8|vol:0.25\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 2. THE LAST ROUND (The Carved Mug Tavern)
export const generateTheLastRound = (): string => {
    const BPM = 130;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // G - D - Em - C - G - Bm - C - D (rowdy, major-leaning)
    const chords = [
        N.G2, N.D3, N.E2, N.C3, N.G2, N.B2, N.C3, N.D3
    ];

    for (let bar = 0; bar < 72; bar++) {
        const root = chords[bar % 8];
        const prevRoot = chords[(bar - 1 + 8) % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Stomping bass — rougher than Rusty Flagon
            if (step === 0 || step === 8) {
                score += `${t}:instr:fretless_bass|freq:${root / 2}|dur:0.4|vol:0.55\n`;
            }
            // Marimba "table slap" on the off-beats
            if (step === 4 || step === 12) {
                score += `${t}:instr:marimba|freq:${root}|dur:0.2|vol:0.5\n`;
            }
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:marimba|freq:${root * 2}|dur:0.15|vol:0.6\n`;
            }

            // Lute driving the jig
            if (step === 2 || step === 6 || step === 10) {
                score += `${t}:instr:lute|freq:${root}|dur:0.2|vol:0.6\n`;
            }
            // Wild lute flourish on phrase ends
            if (phrase === 3 && (step === 13 || step === 15)) {
                score += `${t}:instr:lute|freq:${root * 1.5}|dur:0.15|vol:0.55\n`;
            }

            // Stage 1+: Piano joins the rowdiness
            if (stage >= 1) {
                if (step % 4 === 0) {
                    score += `${t}:instr:piano_forte|freq:${root * 2}|dur:0.15|vol:0.35\n`;
                }
                if (phrase % 2 === 1 && step === 8) {
                    score += `${t}:instr:piano_forte|freq:${prevRoot * 3}|dur:0.1|vol:0.4\n`;
                }
            }

            // Stage 2+: Spectral flute solo over the crowd
            if (stage >= 2) {
                if (step === 0 || step === 6) {
                    score += `${t}:instr:spectral_flute|freq:${root * 2}|dur:0.3|vol:0.4\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:spectral_flute|freq:${root * 3}|dur:0.4|vol:0.5\n`;
                }
            }

            // Stage 3: Full rowdy climax — staccato strings like cheering
            if (stage >= 3) {
                if (phrase % 2 === 0 && step === 0) {
                    score += `${t}:instr:strings_staccato|freq:${root * 2}|dur:0.15|vol:0.45\n`;
                    score += `${t}:instr:strings_staccato|freq:${root * 1.5}|dur:0.15|vol:0.4\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 3. OAKHAVEN MARKET
export const generateOakhavenMarket = (): string => {
    const BPM = 108;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // C - Am - F - G - Dm - Em - F - G (bouncy, bright progression)
    const chords = [
        { root: N.C3, melody: [N.C4, N.E4, N.G4] },
        { root: N.A2, melody: [N.A3, N.C4, N.E4] },
        { root: N.F2, melody: [N.F3, N.A3, N.C4] },
        { root: N.G2, melody: [N.G3, N.B3, N.D4] },
        { root: N.D3, melody: [N.D4, N.F4, N.A4] },
        { root: N.E2, melody: [N.E3, N.G3, N.B3] },
        { root: N.F2, melody: [N.F3, N.A3, N.C4] },
        { root: N.G2, melody: [N.G3, N.B3, N.D4] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Harpsichord coins jingling — the sound of commerce
            if (step % 4 === 0) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 2}|dur:0.2|vol:0.3\n`;
            }
            if (step % 8 === 3) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 3}|dur:0.1|vol:0.2\n`;
            }

            // Lute rhythm — merchants calling
            if (step === 0 || step === 6 || step === 10) {
                score += `${t}:instr:lute|freq:${chord.root}|dur:0.25|vol:0.45\n`;
            }
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:lute|freq:${chord.root * 2}|dur:0.2|vol:0.4\n`;
            }

            // Stage 1+: Concert harp arpeggios — goods on display
            if (stage >= 1) {
                if (step % 2 === 0) {
                    const arpIdx = (step / 2 + phrase) % chord.melody.length;
                    score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.3|vol:0.35\n`;
                }
            }

            // Stage 2+: Marimba percussion — lively energy
            if (stage >= 2) {
                if (step === 0 || step === 8) {
                    score += `${t}:instr:marimba|freq:${chord.root / 2}|dur:0.3|vol:0.45\n`;
                }
                if (phrase === 2 && step === 12) {
                    score += `${t}:instr:marimba|freq:${chord.root}|dur:0.2|vol:0.5\n`;
                }
            }

            // Stage 3: Ocarina street performer
            if (stage >= 3) {
                if (step === 4) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.5|vol:0.45\n`;
                }
                if (phrase % 2 === 1 && step === 10) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.4|vol:0.4\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

export const SAWDUST_AND_AMBITION_SCORE = generateSawdustAndAmbition();
export const THE_LAST_ROUND_SCORE = generateTheLastRound();
export const OAKHAVEN_MARKET_SCORE = generateOakhavenMarket();
