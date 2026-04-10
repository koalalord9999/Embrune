import * as N from '../../constants/musicScore';

/**
 * FOUTHIA SUITE
 * A consolidated collection of tracks for the desert city of Fouthia.
 * Punjabi/Indian style — sitar, tabla, tanpura. Hot winds and exotic spice.
 * Uses Raga Kafi-inspired intervals for authentic feel.
 */

// 1. DUST & DEVOTION (Region Default)
export const generateDustAndDevotion = (): string => {
    const BPM = 105;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Raga-inspired progression using D minor with flat 2nd (Eb) and flat 7th (C)
    const chords = [
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.Eb2, bass: N.Eb1, melody: [N.Eb3, N.G3, N.Bb3] },
        { root: N.G2, bass: N.G1, melody: [N.G3, N.Bb3, N.D4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.Eb4, N.G4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.Bb2, bass: N.Bb1, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.D4, N.F4] },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 20);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Tanpura drone — the hypnotic, ever-present foundation
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:tanpura|freq:${N.D2}|dur:6.0|vol:0.4\n`;
                score += `${t}:instr:tanpura|freq:${N.A1}|dur:6.0|vol:0.3\n`;
            }

            // Tabla rhythm — the Punjabi heartbeat
            if (step === 0 || step === 8) {
                score += `${t}:instr:tabla|freq:${chord.bass}|dur:0.2|vol:0.55\n`;
            }
            if (step === 4 || step === 12) {
                score += `${t}:instr:tabla|freq:${chord.bass * 1.5}|dur:0.15|vol:0.4\n`;
            }
            // Syncopated tabla fills
            if (phrase === 3 && (step === 6 || step === 14)) {
                score += `${t}:instr:tabla|freq:${chord.bass * 2}|dur:0.1|vol:0.5\n`;
            }

            // Sitar melody — the exotic lead
            if (step === 0) {
                score += `${t}:instr:sitar|freq:${chord.melody[0]}|dur:0.4|vol:0.5\n`;
            }
            if (step === 6 && phrase % 2 === 0) {
                score += `${t}:instr:sitar|freq:${chord.melody[2]}|dur:0.3|vol:0.45\n`;
            }
            if (step === 10) {
                const note = (phrase % 2 === 0) ? chord.melody[1] : chord.melody[2];
                score += `${t}:instr:sitar|freq:${note}|dur:0.35|vol:0.45\n`;
            }
            // Ornamental sitar flourish at phrase ends
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:sitar|freq:${chord.melody[0] * 2}|dur:0.2|vol:0.55\n`;
            }

            // Stage 1+: Marimba adding percussive color
            if (stage >= 1) {
                if (step % 4 === 2) {
                    score += `${t}:instr:marimba|freq:${chord.root}|dur:0.2|vol:0.35\n`;
                }
            }

            // Stage 2+: Fretless bass — deepening the groove
            if (stage >= 2) {
                if (step === 0) {
                    score += `${t}:instr:fretless_bass|freq:${chord.bass}|dur:0.5|vol:0.4\n`;
                }
            }

            // Stage 3: Spectral flute — the distant desert wind
            if (stage >= 3) {
                if (step === 4 && phrase === 0) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[2]}|dur:1.0|vol:0.3\n`;
                }
                if (step === 12 && phrase === 2) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[1]}|dur:0.8|vol:0.25\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 2. SCORPION'S DEN (The Sand Serpent Inn)
export const generateScorpionsDen = (): string => {
    const BPM = 120;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Aggressive minor with chromatic tension
    const chords = [
        N.D3, N.Eb3, N.G2, N.A2, N.D3, N.F2, N.Bb2, N.A2
    ];

    for (let bar = 0; bar < 72; bar++) {
        const root = chords[bar % 8];
        const prevRoot = chords[(bar - 1 + 8) % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Heavy tabla — fast, aggressive
            if (step === 0 || step === 4 || step === 8 || step === 12) {
                score += `${t}:instr:tabla|freq:${root / 2}|dur:0.15|vol:0.55\n`;
            }
            if (step % 2 === 1 && step > 8 && phrase === 3) {
                score += `${t}:instr:tabla|freq:${root}|dur:0.1|vol:0.5\n`; // rapid fill
            }

            // Fretless bass — menacing undertone
            if (step === 0 || step === 8) {
                score += `${t}:instr:fretless_bass|freq:${root / 2}|dur:0.4|vol:0.5\n`;
            }

            // Sitar — aggressive riffs
            if (step === 2 || step === 6 || step === 10) {
                score += `${t}:instr:sitar|freq:${root * 2}|dur:0.2|vol:0.5\n`;
            }
            if (phrase === 3 && (step === 13 || step === 15)) {
                score += `${t}:instr:sitar|freq:${root * 3}|dur:0.15|vol:0.55\n`;
            }

            // Stage 1+: Lute adding grit
            if (stage >= 1) {
                if (step === 4 || step === 12) {
                    score += `${t}:instr:lute|freq:${root}|dur:0.2|vol:0.45\n`;
                }
                if (phrase % 2 === 1 && step === 8) {
                    score += `${t}:instr:lute|freq:${prevRoot * 1.5}|dur:0.15|vol:0.4\n`;
                }
            }

            // Stage 2+: Marimba — dangerous energy
            if (stage >= 2) {
                if (step % 4 === 0) {
                    score += `${t}:instr:marimba|freq:${root}|dur:0.15|vol:0.4\n`;
                }
            }

            // Stage 3: Staccato strings — the mercenaries closing in
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

// 3. SILK & CINDER (The Bazaar)
export const generateSilkAndCinder = (): string => {
    const BPM = 115;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Bright, bustling, exotic market energy
    const chords = [
        { root: N.D3, melody: [N.D4, N.Fs4, N.A4] },
        { root: N.G2, melody: [N.G3, N.Bb3, N.D4] },
        { root: N.C3, melody: [N.C4, N.Eb4, N.G4] },
        { root: N.F2, melody: [N.F3, N.A3, N.C4] },
        { root: N.Bb2, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.Eb2, melody: [N.Eb3, N.G3, N.Bb3] },
        { root: N.A2, melody: [N.A3, N.D4, N.F4] },
        { root: N.D3, melody: [N.D4, N.Fs4, N.A4] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Tabla keeping the bustling market beat
            if (step === 0 || step === 4 || step === 8) {
                score += `${t}:instr:tabla|freq:${chord.root / 2}|dur:0.15|vol:0.5\n`;
            }
            if (step === 12 || (phrase === 3 && step === 14)) {
                score += `${t}:instr:tabla|freq:${chord.root}|dur:0.1|vol:0.45\n`;
            }

            // Harpsichord — coins and clinking goods
            if (step % 4 === 0) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 2}|dur:0.2|vol:0.3\n`;
            }
            if (step % 8 === 3) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 3}|dur:0.1|vol:0.25\n`;
            }

            // Sitar — the hawker's exotic call
            if (step === 0 || step === 6) {
                score += `${t}:instr:sitar|freq:${chord.melody[0]}|dur:0.3|vol:0.45\n`;
            }
            if (phrase % 2 === 1 && step === 10) {
                score += `${t}:instr:sitar|freq:${chord.melody[2]}|dur:0.25|vol:0.4\n`;
            }
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:sitar|freq:${chord.melody[1] * 2}|dur:0.2|vol:0.5\n`;
            }

            // Stage 1+: Marimba — wooden stalls and swaying canvas
            if (stage >= 1) {
                if (step === 2 || step === 10) {
                    score += `${t}:instr:marimba|freq:${chord.root}|dur:0.2|vol:0.4\n`;
                }
            }

            // Stage 2+: Ocarina — the snake charmer
            if (stage >= 2) {
                if (step === 4 && phrase === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.4\n`;
                }
                if (step === 12 && phrase === 2) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.4|vol:0.35\n`;
                }
            }

            // Stage 3: Lute — a wandering bard in the crowd
            if (stage >= 3) {
                if (step === 0 && phrase === 1) {
                    score += `${t}:instr:lute|freq:${chord.root}|dur:0.3|vol:0.4\n`;
                }
                if (step === 8 && phrase === 3) {
                    score += `${t}:instr:lute|freq:${chord.melody[0]}|dur:0.25|vol:0.35\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 4. WHISPERS IN THE SAND (Desert Shrine)
export const generateWhispersInTheSand = (): string => {
    const BPM = 55;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Meditative, spiritual — the desert spirits
    const progression = [
        N.D2, N.A1, N.Bb1, N.F2, N.D2, N.G2, N.Eb2, N.D2
    ];

    for (let bar = 0; bar < 64; bar++) {
        const root = progression[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Tanpura — the eternal drone of the desert
            if (step === 0 && phrase === 0) {
                score += `${t}:instr:tanpura|freq:${N.D2}|dur:8.0|vol:0.45\n`;
                score += `${t}:instr:tanpura|freq:${N.A1}|dur:8.0|vol:0.35\n`;
            }

            // Choir — the desert spirits whispering
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${root}|dur:5.0|vol:0.4\n`;
            }

            // Stage 1+: Sitar — slow, meditative plucks
            if (stage >= 1) {
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? root * 2 : root * 1.5;
                    score += `${t}:instr:sitar|freq:${note}|dur:1.5|vol:0.4\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:sitar|freq:${root * 3}|dur:1.0|vol:0.35\n`;
                }
            }

            // Stage 2+: Celesta — stars above the desert
            if (stage >= 2) {
                if (step === 0 && phrase >= 2) {
                    score += `${t}:instr:celesta|freq:${root * 4}|dur:2.0|vol:0.3\n`;
                }
            }

            // Stage 3: Tabla — a single, distant heartbeat
            if (stage >= 3) {
                if (step === 0 && phrase === 0) {
                    score += `${t}:instr:tabla|freq:${root / 2}|dur:0.3|vol:0.35\n`;
                }
                if (step === 8 && phrase === 2) {
                    score += `${t}:instr:tabla|freq:${root}|dur:0.2|vol:0.3\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

export const DUST_AND_DEVOTION_SCORE = generateDustAndDevotion();
export const SCORPIONS_DEN_SCORE = generateScorpionsDen();
export const SILK_AND_CINDER_SCORE = generateSilkAndCinder();
export const WHISPERS_IN_THE_SAND_SCORE = generateWhispersInTheSand();
