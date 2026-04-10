import * as N from '../../constants/musicScore';

/**
 * SILVERHAVEN SUITE
 * A consolidated collection of tracks for the capital city of Silverhaven.
 * Grand, regal, cosmopolitan — silver dragons, marble walls, and royal authority.
 */

// 1. SILVER CROWN (Region Default)
export const generateSilverCrown = (): string => {
    const BPM = 120;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Dm - Bb - F - C - Dm - Gm - A - Dm (regal minor with triumphant major lifts)
    const chords = [
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.Bb2, bass: N.Bb1, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.G2, bass: N.G1, melody: [N.G3, N.Bb3, N.D4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.Cs4, N.E4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
    ];

    for (let bar = 0; bar < 80; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 20);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Timpani authority — the heartbeat of the kingdom
            if (step === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.5\n`;
            }
            if (phrase === 3 && step === 12) {
                score += `${t}:instr:timpani|freq:${chord.bass * 1.5}|dur:0.3|vol:0.55\n`;
            }

            // Strings legato — the grandeur underpinning everything
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.5|vol:0.4\n`;
            }

            // Harpsichord courtly arpeggios
            if (step % 2 === 0) {
                const arpIdx = (step / 2 + phrase) % chord.melody.length;
                score += `${t}:instr:harpsichord|freq:${chord.melody[arpIdx]}|dur:0.2|vol:0.3\n`;
            }

            // Stage 1+: Epic brass fanfare — the royal herald
            if (stage >= 1) {
                if (step === 0) {
                    score += `${t}:instr:epic_brass|freq:${chord.melody[0]}|dur:0.8|vol:0.4\n`;
                }
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? chord.melody[2] : chord.melody[1];
                    score += `${t}:instr:epic_brass|freq:${note}|dur:0.6|vol:0.35\n`;
                }
            }

            // Stage 2+: French horn counter-melody — nobility
            if (stage >= 2) {
                if (step === 4 && phrase % 2 === 0) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[1]}|dur:0.8|vol:0.3\n`;
                }
                if (phrase === 3 && step === 10) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[0]}|dur:0.5|vol:0.35\n`;
                }
            }

            // Stage 3: Full orchestra climax
            if (stage >= 3) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:strings_staccato|freq:${chord.melody[2]}|dur:0.15|vol:0.45\n`;
                }
                if (step === 8) {
                    score += `${t}:instr:concert_harp|freq:${chord.melody[1]}|dur:0.3|vol:0.35\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 2. VELVET & VENOM (The Gilded Goblet — upscale tavern)
export const generateVelvetAndVenom = (): string => {
    const BPM = 115;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Cm - Ab - Eb - Bb - Fm - G - Cm - Bb (sophisticated minor jazz feel)
    const chords = [
        { root: N.C3, melody: [N.C4, N.Eb4, N.G4] },
        { root: N.Ab2, melody: [N.Ab3, N.C4, N.Eb4] },
        { root: N.Eb2, melody: [N.Eb3, N.G3, N.Bb3] },
        { root: N.Bb2, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.F2, melody: [N.F3, N.Ab3, N.C4] },
        { root: N.G2, melody: [N.G3, N.B3, N.D4] },
        { root: N.C3, melody: [N.C4, N.Eb4, N.G4] },
        { root: N.Bb2, melody: [N.Bb3, N.D4, N.F4] },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Harpsichord — classy rhythmic backbone
            if (step === 0 || step === 6 || step === 10) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 2}|dur:0.2|vol:0.35\n`;
            }
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:harpsichord|freq:${chord.root * 3}|dur:0.15|vol:0.3\n`;
            }

            // Fretless bass walking line — smooth and sophisticated
            if (step === 0) {
                score += `${t}:instr:fretless_bass|freq:${chord.root / 2}|dur:0.5|vol:0.5\n`;
            }
            if (step === 8) {
                const walk = phrase % 2 === 0 ? chord.root / 1.5 : chord.root / 2;
                score += `${t}:instr:fretless_bass|freq:${walk}|dur:0.4|vol:0.4\n`;
            }

            // Stage 1+: Piano — elegant melodic phrases
            if (stage >= 1) {
                if (step === 0 || step === 8) {
                    score += `${t}:instr:piano_forte|freq:${chord.melody[2]}|dur:0.4|vol:0.4\n`;
                }
                if (step === 4 && phrase % 2 === 1) {
                    score += `${t}:instr:piano_forte|freq:${chord.melody[1]}|dur:0.3|vol:0.35\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:piano_forte|freq:${chord.melody[0] * 2}|dur:0.2|vol:0.45\n`;
                }
            }

            // Stage 2+: Strings — the velvet
            if (stage >= 2) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.0|vol:0.3\n`;
                }
            }

            // Stage 3: French horn — the venom (subtle power beneath luxury)
            if (stage >= 3) {
                if (step === 4) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[0]}|dur:0.8|vol:0.3\n`;
                }
                if (phrase === 1 && step === 10) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[1]}|dur:0.5|vol:0.25\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 3. SALT & SIRENS (Silverhaven Docks)
export const generateSaltAndSirens = (): string => {
    const BPM = 105;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Em - C - G - D - Am - Em - Bm - D (adventurous, sea-swept)
    const chords = [
        { root: N.E2, bass: N.E1, melody: [N.E3, N.G3, N.B3] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.G2, bass: N.G1, melody: [N.G3, N.B3, N.D4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.Fs4, N.A4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.C4, N.E4] },
        { root: N.E2, bass: N.E1, melody: [N.E3, N.G3, N.B3] },
        { root: N.B2, bass: N.B1, melody: [N.B3, N.D4, N.Fs4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.Fs4, N.A4] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Fretless bass — the deep ocean swell
            if (step === 0) {
                score += `${t}:instr:fretless_bass|freq:${chord.bass}|dur:0.5|vol:0.5\n`;
            }
            if (step === 8) {
                score += `${t}:instr:fretless_bass|freq:${chord.bass * 1.5}|dur:0.4|vol:0.4\n`;
            }

            // Concert harp waves — the lapping water
            if (step % 4 === 0) {
                const arpIdx = (step / 4 + phrase) % chord.melody.length;
                score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.3|vol:0.35\n`;
            }

            // Lute — creaking rigging and shanty rhythms
            if (step === 2 || step === 10) {
                score += `${t}:instr:lute|freq:${chord.root}|dur:0.2|vol:0.45\n`;
            }
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:lute|freq:${chord.root * 2}|dur:0.15|vol:0.4\n`;
            }

            // Stage 1+: Ocarina — the siren's call / distant gulls
            if (stage >= 1) {
                if (step === 4) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.45\n`;
                }
                if (phrase % 2 === 1 && step === 12) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.5|vol:0.4\n`;
                }
            }

            // Stage 2+: Spectral flute — the mystery of open waters
            if (stage >= 2) {
                if (step === 0 && phrase === 0) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[2]}|dur:1.5|vol:0.35\n`;
                }
                if (step === 8 && phrase === 2) {
                    score += `${t}:instr:spectral_flute|freq:${chord.melody[0] * 2}|dur:1.0|vol:0.3\n`;
                }
            }

            // Stage 3: Strings — the majesty of the harbor
            if (stage >= 3) {
                if (step === 0 && phrase % 2 === 0) {
                    score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.0|vol:0.3\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 4. HYMN OF THE SPIRE (Silverhaven Grand Temple)
export const generateHymnOfTheSpire = (): string => {
    const BPM = 50;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // F - Dm - Bb - C - F - Am - Dm - C (sacred, luminous progression)
    const progression = [
        N.F2, N.D2, N.Bb1, N.C2, N.F2, N.A2, N.D2, N.C2
    ];

    for (let bar = 0; bar < 64; bar++) {
        const root = progression[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Choir — the divine foundation
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${root}|dur:6.0|vol:0.5\n`;
                score += `${t}:instr:strings_legato|freq:${root / 2}|dur:5.0|vol:0.3\n`;
            }

            // Stage 1+: Tubular bells — the temple's voice
            if (stage >= 1 && step === 0 && phrase === 0) {
                const bellNote = (bar % 8 >= 4) ? N.C2 : N.F2;
                score += `${t}:instr:tubular_bells|freq:${bellNote}|dur:4.0|vol:0.45\n`;
            }

            // Stage 1+: Celesta — light through stained glass
            if (stage >= 1) {
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? root * 2 : root * 1.5;
                    score += `${t}:instr:celesta|freq:${note}|dur:2.0|vol:0.4\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:celesta|freq:${root * 3}|dur:1.5|vol:0.35\n`;
                }
            }

            // Stage 2+: High strings — heavenly ascent
            if (stage >= 2) {
                if (step === 0 && phrase >= 2) {
                    score += `${t}:instr:strings_legato|freq:${root * 3}|dur:2.5|vol:0.25\n`;
                    score += `${t}:instr:strings_legato|freq:${root * 4}|dur:2.5|vol:0.2\n`;
                }
            }

            // Stage 3: Spectral flute descant — angels singing
            if (stage >= 3) {
                if (step === 4) {
                    score += `${t}:instr:spectral_flute|freq:${root * 4}|dur:3.0|vol:0.25\n`;
                }
                if (phrase === 1 && step === 12) {
                    score += `${t}:instr:spectral_flute|freq:${root * 3}|dur:2.0|vol:0.2\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 5. THE DRAGON'S SHADOW (Castle Grounds)
export const generateTheDragonsShadow = (): string => {
    const BPM = 90;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Dm - Am - Bb - Gm - Dm - F - C - A (dark, foreboding power)
    const chords = [
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.C4, N.E4] },
        { root: N.Bb2, bass: N.Bb1, melody: [N.Bb3, N.D4, N.F4] },
        { root: N.G2, bass: N.G1, melody: [N.G3, N.Bb3, N.D4] },
        { root: N.D3, bass: N.D2, melody: [N.D4, N.F4, N.A4] },
        { root: N.F2, bass: N.F1, melody: [N.F3, N.A3, N.C4] },
        { root: N.C3, bass: N.C2, melody: [N.C4, N.E4, N.G4] },
        { root: N.A2, bass: N.A1, melody: [N.A3, N.Cs4, N.E4] },
    ];

    for (let bar = 0; bar < 72; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Timpani — heavy, authoritative footfalls of guards
            if (step === 0) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.55\n`;
            }
            if (phrase === 3 && step === 8) {
                score += `${t}:instr:timpani|freq:${chord.bass * 1.5}|dur:0.4|vol:0.5\n`;
            }

            // Strings — ominous, slow-building tension
            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.5|vol:0.4\n`;
            }

            // Epic brass — the dragon heraldry
            if (step === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.melody[0]}|dur:1.0|vol:0.35\n`;
            }
            if (step === 8 && phrase % 2 === 0) {
                score += `${t}:instr:epic_brass|freq:${chord.melody[1]}|dur:0.6|vol:0.3\n`;
            }

            // Stage 1+: French horn — the king's shadow
            if (stage >= 1) {
                if (step === 4) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[2]}|dur:0.8|vol:0.3\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[0]}|dur:0.5|vol:0.35\n`;
                }
            }

            // Stage 2+: Staccato strings — patrolling knights
            if (stage >= 2) {
                if (step % 4 === 0 && phrase !== 3) {
                    score += `${t}:instr:strings_staccato|freq:${chord.melody[1]}|dur:0.15|vol:0.4\n`;
                }
            }

            // Stage 3: Crystal bell — the watchtower warning
            if (stage >= 3) {
                if (step === 0 && phrase === 0) {
                    score += `${t}:instr:crystal_bell|freq:${chord.melody[2] * 2}|dur:1.5|vol:0.35\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 6. HAMMER & THREAD (Artisan's Quarter)
export const generateHammerAndThread = (): string => {
    const BPM = 110;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4;
    let score = "";
    let currentTime = 0;

    // Am - C - Dm - F - Em - G - Am - E (industrious minor with work-like rhythm)
    const chords = [
        { root: N.A2, melody: [N.A3, N.C4, N.E4] },
        { root: N.C3, melody: [N.C4, N.E4, N.G4] },
        { root: N.D3, melody: [N.D4, N.F4, N.A4] },
        { root: N.F2, melody: [N.F3, N.A3, N.C4] },
        { root: N.E2, melody: [N.E3, N.G3, N.B3] },
        { root: N.G2, melody: [N.G3, N.B3, N.D4] },
        { root: N.A2, melody: [N.A3, N.C4, N.E4] },
        { root: N.E2, melody: [N.E3, N.Gs3, N.B3] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);

            // Marimba — the hammer strikes
            if (step === 0 || step === 8) {
                score += `${t}:instr:marimba|freq:${chord.root}|dur:0.25|vol:0.5\n`;
            }
            if (step === 4 || step === 12) {
                score += `${t}:instr:marimba|freq:${chord.root * 1.5}|dur:0.2|vol:0.4\n`;
            }
            // Rhythmic variety on phrase ends
            if (phrase === 3 && step === 14) {
                score += `${t}:instr:marimba|freq:${chord.root * 2}|dur:0.15|vol:0.55\n`;
            }

            // Piano — the loom clicking
            if (step === 2 || step === 10) {
                score += `${t}:instr:piano_forte|freq:${chord.melody[0]}|dur:0.15|vol:0.35\n`;
            }

            // Stage 1+: Lute — the worker's hum
            if (stage >= 1) {
                if (step === 0 || step === 6) {
                    score += `${t}:instr:lute|freq:${chord.root}|dur:0.25|vol:0.45\n`;
                }
                if (phrase % 2 === 1 && step === 12) {
                    score += `${t}:instr:lute|freq:${chord.melody[1]}|dur:0.2|vol:0.4\n`;
                }
            }

            // Stage 2+: Staccato strings — the spinning wheel
            if (stage >= 2) {
                if (step % 4 === 2) {
                    score += `${t}:instr:strings_staccato|freq:${chord.melody[2]}|dur:0.1|vol:0.35\n`;
                }
            }

            // Stage 3: Ocarina — the artisan's satisfaction
            if (stage >= 3) {
                if (step === 4 && phrase === 0) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.6|vol:0.45\n`;
                }
                if (step === 10 && phrase === 2) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.4|vol:0.4\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

export const SILVER_CROWN_SCORE = generateSilverCrown();
export const VELVET_AND_VENOM_SCORE = generateVelvetAndVenom();
export const SALT_AND_SIRENS_SCORE = generateSaltAndSirens();
export const HYMN_OF_THE_SPIRE_SCORE = generateHymnOfTheSpire();
export const DRAGONS_SHADOW_SCORE = generateTheDragonsShadow();
export const HAMMER_AND_THREAD_SCORE = generateHammerAndThread();
