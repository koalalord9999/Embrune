import * as N from '../../constants/musicScore';

/**
 * SANCTITY SUITE
 * A consolidated collection of tracks for the holy city of Sanctity.
 * Pastoral, sacred, joyous — clean streets, angel fountains, and worship.
 */

// 1. GRACE EVERLASTING (Region Default)
export const generateGraceEverlasting = (): string => {
    const BPM = 88;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // F - C - Dm - Bb - F - Am - Bb - C (luminous, pastoral-sacred)
    const chords = [
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.Bb2, bass: N.Bb1, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.C4, N.E4] },
        { root: N.Bb2, bass: N.Bb1, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Strings — the warm pastoral foundation
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.5|vol:0.4\n`;
            }

            // Concert harp — the angel fountain's gentle cascades
            if (step % 2 === 0) {
                const arpIdx = (step / 2 + phrase) % chord.melody.length;
                score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.35|vol:0.35\n`;
            }

            // Stage 1+: Spectral flute — the breeze through chapel road
            if (stage >= 1) {
                if (step === 4) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[2]}|dur:0.8|vol:0.45\n`;
                }
                if (phrase % 2 === 1 && step === 10) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[1]}|dur:0.6|vol:0.4\n`;
                }
                if (phrase === 3 && step === 14) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[0] * 2}|dur:0.4|vol:0.45\n`;
                }
            }

            // Stage 2+: Choir — the faithful's song rising
            if (stage >= 2) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:choir_aahs|freq:${chord.root}|dur:3.0|vol:0.35\n`;
                }
            }

            // Stage 3: Ocarina descant — a pilgrim's joy
            if (stage >= 3) {
                if (step === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.4\n`;
                }
                if (step === 8 && phrase === 1) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[0] * 2}|dur:0.5|vol:0.45\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 2. STILL WATERS (The Pilgrim's Rest Inn)
export const generateStillWaters = (): string => {
    const BPM = 95;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Am - Em - F - C - Dm - Am - G - Em (contemplative, gentle minor)
    const chords = [
        { root: N.A2, melody: [N.A3, N.C4, N.E4] },
        { root: N.E2, melody: [N.E3, N.G3, N.B3] },
        { root: N.F2, melody: [N.F3, N.A3, N.C4] },
        { root: N.C3, melody: [N.C4, N.E4, N.G4] },
        { root: N.D3, melody: [N.D4, N.F4, N.A4] },
        { root: N.A2, melody: [N.A3, N.C4, N.E4] },
        { root: N.G2, melody: [N.G3, N.B3, N.D4] },
        { root: N.E2, melody: [N.E3, N.G3, N.B3] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Music box — the quiet, intimate warmth of the inn
            if (step === 0 || step === 8) {
                score += `${t}:instr:music_box|freq:${chord.melody[2]}|dur:0.3|vol:0.4\n`;
            }
            if (step === 4) {
                score += `${t}:instr:music_box|freq:${chord.melody[1]}|dur:0.25|vol:0.35\n`;
            }
            if (phrase === 3 && step === 12) {
                score += `${t}:instr:music_box|freq:${chord.melody[0] * 2}|dur:0.2|vol:0.45\n`;
            }

            // Concert harp — water gently flowing
            if (step % 4 === 0) {
                const arpIdx = (step / 4 + phrase) % chord.melody.length;
                score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.3|vol:0.3\n`;
            }

            // Stage 1+: Ocarina — quiet meditation
            if (stage >= 1) {
                if (step === 4 && phrase % 2 === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.4\n`;
                }
                if (phrase === 3 && step === 10) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.4|vol:0.35\n`;
                }
            }

            // Stage 2+: Strings — the deep comfort of rest
            if (stage >= 2) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.0|vol:0.3\n`;
                }
            }

            // Stage 3: Celesta — the sacred sparkle
            if (stage >= 3) {
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? chord.melody[2] : chord.melody[0] * 2;
                    score += `${t}:instr:celesta|freq:${note}|dur:1.0|vol:0.35\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 3. ASHES & ABSOLUTION (Grand Chapel of Sanctity)
export const generateAshesAndAbsolution = (): string => {
    const BPM = 48;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Dm - F - Bb - A - Dm - Gm - C - Dm (dark sacred, gravitas of bone grinding)
    const progression = [
        N.D2, N.F2, N.Bb1, N.A2, N.D2, N.G2, N.C2, N.D2
    ];

    for (let bar = 0; bar < 64; bar++) {
        const root = progression[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Choir — the massive sacred foundation
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${root}|dur:6.0|vol:0.5\n`;
                score += `${t}:instr:strings_legato|freq:${root / 2}|dur:5.0|vol:0.3\n`;
            }

            // Stage 1+: Tubular bells — the chapel's deep resonance
            if (stage >= 1 && step === 0 && phrase === 0) {
                const bellNote = (bar % 8 >= 4) ? N.A2 : N.D2;
                score += `${t}:instr:tubular_bells|freq:${bellNote}|dur:4.5|vol:0.45\n`;
            }

            // Stage 1+: Celesta — candlelight flickering
            if (stage >= 1) {
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? root * 2 : root * 1.5;
                    score += `${t}:instr:celesta|freq:${note}|dur:2.0|vol:0.4\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:celesta|freq:${root * 3}|dur:1.5|vol:0.35\n`;
                }
            }

            // Stage 2+: High strings — ascending prayers
            if (stage >= 2) {
                if (step === 0 && phrase >= 2) {
                    score += `${t}:instr:strings_legato|freq:${root * 3}|dur:2.5|vol:0.25\n`;
                    score += `${t}:instr:strings_legato|freq:${root * 4}|dur:2.5|vol:0.2\n`;
                }
            }

            // Stage 3: Crystal bell + flute — absolution granted
            if (stage >= 3) {
                if (step === 0 && phrase === 0) {
                    score += `${t}:instr:crystal_bell|freq:${root * 4}|dur:2.0|vol:0.35\n`;
                }
                if (step === 8) {
                    score += `${t}:instr:spectral_flute|freq:${root * 4}|dur:3.0|vol:0.2\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

export const GRACE_EVERLASTING_SCORE = generateGraceEverlasting();
export const STILL_WATERS_SCORE = generateStillWaters();
export const ASHES_AND_ABSOLUTION_SCORE = generateAshesAndAbsolution();
