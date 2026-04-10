import * as N from '../../constants/musicScore';

/**
 * MEADOWDALE SUITE
 * A consolidated collection of tracks for the Meadowdale region.
 */

// 1. MEADOWDALE BREEZE (City Default / Pastoral)
export const generateMeadowdaleBreeze = (): string => {
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
        // Variation
        { root: N.C3, bass: N.C2, melody: [N.E4, N.G4, N.C5] },
        { root: N.E2, bass: N.E1, melody: [N.G3, N.B3, N.E4] },
        { root: N.F2, bass: N.F1, melody: [N.A3, N.C4, N.F4] },
        { root: N.G2, bass: N.G1, melody: [N.B3, N.D4, N.G4] },
    ];

    for (let bar = 0; bar < 64; bar++) {
        const chord = chords[bar % 8];
        const stage = Math.floor(bar / 16);
        const subphrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);
            
            // Core Rhythm & Bass - Break it up sometimes
            if (step === 0 && subphrase !== 3) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.4\n`;
            } else if (subphrase === 3 && step === 8) {
                score += `${t}:instr:timpani|freq:${chord.bass}|dur:0.5|vol:0.5\n`; // syncopated hit
            }

            if (step === 0) {
                score += `${t}:instr:strings_legato|freq:${chord.root}|dur:2.5|vol:0.35\n`;
            }

            // Stage 0+: Brass intro, but moves around
            if (stage <= 1) {
                if (step === 0) {
                    score += `${t}:instr:epic_brass|freq:${chord.melody[0]}|dur:1.0|vol:0.35\n`;
                }
                if (step === 8) {
                    const note = (bar % 2 === 0) ? chord.melody[1] : chord.melody[2];
                    score += `${t}:instr:epic_brass|freq:${note}|dur:0.8|vol:0.3\n`;
                }
                if (subphrase === 3 && step === 12) {
                    score += `${t}:instr:epic_brass|freq:${chord.melody[1]}|dur:0.4|vol:0.4\n`;
                }
            }

            // Stage 1+: Harp arpeggios but shifting patterns
            if (stage >= 1) {
                if (step % 2 === 0) {
                    // Pattern goes up and down
                    const arpIdx = (step / 2 + subphrase) % chord.melody.length;
                    score += `${t}:instr:concert_harp|freq:${chord.melody[arpIdx]}|dur:0.4|vol:0.35\n`;
                }
            }

            // Stage 2+: Ocarina melody that "sings" longer notes
            if (stage >= 2) {
                if (step === 4) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[2]}|dur:0.8|vol:0.45\n`;
                } else if (subphrase % 2 === 1 && step === 10) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[1]}|dur:0.5|vol:0.4\n`;
                } else if (subphrase === 3 && step === 14) {
                    score += `${t}:instr:ocarina|freq:${chord.melody[0] * 2}|dur:0.5|vol:0.5\n`;
                }
            }

            // Stage 3: French horn counter-melody
            if (stage >= 3) {
                if (step === 2 || step === 10) {
                    score += `${t}:instr:french_horn|freq:${chord.melody[0] * 0.5}|dur:1.0|vol:0.4\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 2. THE RUSTY FLAGON (Tavern / Lively)
export const generateRustyFlagon = (): string => {
    const BPM = 135; 
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4; 
    let score = "";
    let currentTime = 0;

    const chords = [N.D3, N.C3, N.G2, N.D3, N.F3, N.C3, N.A2, N.D3];

    for (let bar = 0; bar < 80; bar++) {
        const root = chords[bar % 8];
        const prevRoot = chords[(bar - 1 + 8) % 8];
        const stage = Math.floor(bar / 20); 
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);
            
            // Fretless Bass walking
            if (step === 0) {
                score += `${t}:instr:fretless_bass|freq:${Math.min(N.D2, root / 2)}|dur:0.4|vol:0.5\n`;
            }
            if (step === 8) {
                const walk = phrase === 3 ? root / 1.5 : root / 2;
                score += `${t}:instr:fretless_bass|freq:${Math.min(N.D2, walk)}|dur:0.4|vol:0.4\n`;
            }

            if (step === 0 || step === 8 || step === 12) {
                score += `${t}:instr:marimba|freq:${root / 2}|dur:0.3|vol:0.45\n`;
            }

            // Lute driving the rhythm, getting wilder at phrase ends
            if (step === 4 || step === 10) {
                score += `${t}:instr:lute|freq:${root}|dur:0.2|vol:0.6\n`;
            }
            if (phrase === 3 && (step === 12 || step === 14)) {
                score += `${t}:instr:lute|freq:${root * 1.5}|dur:0.2|vol:0.5\n`;
            }

            // Flute Solo
            if (stage >= 1) {
                if (step === 0 || step === 6) {
                    score += `${t}:instr:spectral_flute|freq:${root * 2}|dur:0.3|vol:0.4\n`;
                }
                if (step === 12 && phrase % 2 === 1) {
                    score += `${t}:instr:spectral_flute|freq:${prevRoot * 2.5}|dur:0.4|vol:0.45\n`; // High trill
                }
            }

            // Drunken piano
            if (stage >= 2) {
                if (step % 4 === 2) {
                    const arpNote = root * (1 + ((step % 3) * 0.25)); 
                    score += `${t}:instr:piano_forte|freq:${arpNote}|dur:0.2|vol:0.3\n`;
                }
                if (phrase === 3 && step > 8 && step % 2 === 1) {
                     score += `${t}:instr:piano_forte|freq:${root * 3}|dur:0.1|vol:0.35\n`; // frantic glissando
                }
            }

            // Climax crowd strings
            if (stage >= 3) {
                if (phrase % 2 === 0 && step === 0) {
                    score += `${t}:instr:strings_staccato|freq:${root * 2}|dur:0.2|vol:0.4\n`;
                    score += `${t}:instr:strings_staccato|freq:${root * 1.5}|dur:0.2|vol:0.4\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 3. HALLOWED GROUND (Chapel / Ethereal)
export const generateHallowedGround = (): string => {
    const BPM = 55; 
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4; 
    let score = "";
    let currentTime = 0;

    const progression = [N.A2, N.F2, N.C2, N.E2, N.A2, N.G2, N.D2, N.E2];

    for (let bar = 0; bar < 64; bar++) {
        const root = progression[bar % 8];
        const stage = Math.floor(bar / 16);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);
            
            // Core Pad / Strings
            if (step === 0) {
                score += `${t}:instr:choir_aahs|freq:${root}|dur:6.0|vol:0.45\n`;
                score += `${t}:instr:strings_legato|freq:${root / 2}|dur:4.5|vol:0.3\n`;
            }

            // Tubular Bells change on B section
            if (stage >= 1 && step === 0 && phrase === 0) {
                const bellRoot = (bar % 8 >= 4) ? N.D2 : N.A2;
                score += `${t}:instr:tubular_bells|freq:${bellRoot}|dur:4.0|vol:0.4\n`;
            }

            // Celesta plucks unpredictable ethereal melody
            if (stage >= 1) {
                if (step === 8) {
                    const note = (phrase % 2 === 0) ? root * 2 : root * 1.5;
                    score += `${t}:instr:celesta|freq:${note}|dur:2.0|vol:0.4\n`;
                }
                if (phrase === 3 && step === 12) {
                    score += `${t}:instr:celesta|freq:${root * 3}|dur:1.0|vol:0.35\n`;
                }
            }

            // Massive heavenly swell
            if (stage >= 2) {
                if (step === 0 && phrase >= 2) {
                    score += `${t}:instr:strings_legato|freq:${root * 3}|dur:2.0|vol:0.25\n`;
                    score += `${t}:instr:strings_legato|freq:${root * 4}|dur:2.0|vol:0.2\n`;
                }
            }

            // High flute descant
            if (stage >= 3) {
                if (step === 4 || step === 12) {
                    score += `${t}:instr:spectral_flute|freq:${root * 4}|dur:3.0|vol:0.2\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

// 4. MARKET DAY (Square / Busy)
export const generateMarketDay = (): string => {
    const BPM = 110; 
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4; 
    let score = "";
    let currentTime = 0;

    const progression = [N.C3, N.G2, N.A2, N.F2, N.C3, N.D2, N.G2, N.G2];

    for (let bar = 0; bar < 72; bar++) {
        const root = progression[bar % 8];
        const stage = Math.floor(bar / 18);
        const phrase = bar % 4;

        for (let step = 0; step < 16; step++) {
            const t = currentTime.toFixed(3);
            
            // Harpsichord coins dropping
            if (step % 4 === 0) {
                score += `${t}:instr:harpsichord|freq:${root * 2}|dur:0.2|vol:0.3\n`;
            }
            if (step % 8 === 3) {
                score += `${t}:instr:harpsichord|freq:${root * 3}|dur:0.1|vol:0.25\n`;
            }

            // Lute bouncing
            if (step === 0 || step === 6 || step === 10) {
                score += `${t}:instr:lute|freq:${root}|dur:0.3|vol:0.5\n`;
            }
            if (phrase === 3 && step === 14) {
                 score += `${t}:instr:lute|freq:${root * 2}|dur:0.2|vol:0.4\n`;
            }

            // Market footsteps
            if (stage >= 1) {
                if (step % 2 === 0 && step !== 0) {
                    score += `${t}:instr:strings_staccato|freq:${root / 2}|dur:0.1|vol:0.3\n`;
                }
            }

            // Town guards/merchants brass calls
            if (stage >= 2) {
                if (phrase === 0 && step === 0) {
                    score += `${t}:instr:epic_brass|freq:${root * 2}|dur:0.8|vol:0.4\n`;
                } else if (phrase === 2 && step === 8) {
                    score += `${t}:instr:epic_brass|freq:${root * 1.5}|dur:0.4|vol:0.35\n`;
                }
            }

            // Town bell chimes
            if (stage >= 3) {
                if (phrase % 2 === 0 && step === 0) {
                    score += `${t}:instr:crystal_bell|freq:${root * 4}|dur:1.5|vol:0.35\n`;
                    score += `${t}:instr:timpani|freq:${root / 2}|dur:0.5|vol:0.3\n`;
                }
            }

            currentTime += STEP_MS;
        }
    }
    return score;
};

export const MEADOWDALE_BREEZE_SCORE = generateMeadowdaleBreeze();
export const RUSTY_FLAGON_SCORE = generateRustyFlagon();
export const HALLOWED_GROUND_SCORE = generateHallowedGround();
export const MARKET_DAY_SCORE = generateMarketDay();
