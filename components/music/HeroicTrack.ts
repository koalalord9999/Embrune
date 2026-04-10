import * as NOTES from '../../constants/musicScore';

/**
 * Permanent baked score for the Heroic Style (Embrune Theme).
 * 175 BPM, "Hard Hitting Epic Banger" Title Theme.
 * Features an EDM-style dynamic structure to maximize the drop impact.
 */
const generateHeroicScore = () => {
    const baseBpm = 175;
    const beat = 60000 / baseBpm;
    const stepMs = beat / 4; // 16th note grid
    const totalDuration = 240000; // 4 mins
    let score = "";

    // Epic Metal/Rock inspired progression: Em - C - Am - D
    const progression = [
        [NOTES.E2, NOTES.G2, NOTES.B2],  // Em
        [NOTES.C2, NOTES.E2, NOTES.G2],  // C
        [NOTES.A1, NOTES.C2, NOTES.E2],  // Am
        [NOTES.D2, NOTES.Fs2, NOTES.A2], // D
    ];

    let currentTime = 0;
    let stepCount = 0;

    while (currentTime < totalDuration) {
        const bar = Math.floor(stepCount / 16);
        const beatInBar = Math.floor((stepCount % 16) / 4);
        const subStep = stepCount % 4;
        const currentChord = progression[bar % progression.length];
        const root = currentChord[0];

        // --- SECTION LOGIC (Phase-based evolution) ---
        // 175 BPM = ~22 seconds per 16 bars.
        const barInSection = bar % 16;
        const isIntro = bar < 16;
        const isPhase1 = bar >= 16 && bar < 56; // Original Feel
        const isPhase2 = bar >= 56 && bar < 96; // Arpeggio Evolution
        const isPhase3 = bar >= 96 && bar < 136; // Harmonic Elevation
        const isPhase4Climax = bar >= 136 && bar < 168; // Final Climax
        const isOutro = bar >= 168;

        // Sub-section logic within phases
        const isVerse = (isPhase1 && barInSection < 8) || (isPhase2 && barInSection < 8) || (isPhase3 && barInSection < 8);
        const isDrop = (isPhase1 && barInSection >= 8) || (isPhase2 && barInSection >= 8) || (isPhase3 && barInSection >= 8) || isPhase4Climax;
        const isBuild = isDrop && barInSection < 12 && barInSection >= 8; // First 4 bars of drop are build-up
        const isFullDrop = isDrop && !isBuild;

        const t = Math.floor(currentTime);

        // --- LAYER 1: DYNAMIC DRUMS ---
        let drumRoll = false;
        let drumVol = 0.2;
        let kickPattern = false;
        let snarePattern = false;
        let snareVol = 0.25;

        // Build Up Logic (1, 2, 4, 8 hit pattern)
        if (isBuild) {
            const buildBar = barInSection - 8;
            if (buildBar < 1) {
                drumRoll = subStep === 0; // Quarter notes
            } else if (buildBar < 2) {
                drumRoll = subStep === 0 || subStep === 2; // 8th notes
                drumVol = 0.25;
            } else if (buildBar < 3) {
                drumRoll = true; // 16th notes
                drumVol = 0.3;
            } else {
                drumRoll = true; // 16th notes louder
                drumVol = 0.35;
            }

            if (drumRoll) {
                score += `${t}:noise:brown|dur:0.1|vol:${drumVol}|filter:200|decay:0.1\n`; // Fast kick
                score += `${t}:noise:white|dur:0.1|vol:${drumVol * 0.5}|filter:4000|decay:0.1\n`; // Fast snare
            }
        } else if (isFullDrop) {
            kickPattern = (beatInBar === 0 && subStep === 0) ||
                (beatInBar === 1 && subStep === 2) ||
                (beatInBar === 2 && subStep === 0) ||
                (beatInBar === 3 && subStep === 2);
            snarePattern = (beatInBar === 1 || beatInBar === 3) && subStep === 0;
            snareVol = 0.3;
        } else if (isVerse || isIntro) {
            kickPattern = (beatInBar === 0 && subStep === 0) || (beatInBar === 2 && subStep === 0);
            if (isVerse) {
                snarePattern = beatInBar === 2 && subStep === 0; // Half-time chill snare
                snareVol = 0.2;
            }
        }

        if (kickPattern) {
            const kickFilter = isIntro ? 100 : 150;
            score += `${t}:noise:brown|dur:0.2|vol:0.35|filter:${kickFilter}|decay:0.2\n`;
            score += `${t}:instr:timpani|freq:${NOTES.E1}|dur:0.2|vol:0.4\n`;
        }

        if (snarePattern) {
            score += `${t}:noise:white|dur:0.2|vol:${snareVol}|filter:4000|attack:0.01|decay:0.15\n`;
        }

        // Drop Cymbals
        if (isFullDrop) {
            if (subStep % 2 === 0) {
                score += `${t}:noise:white|dur:0.05|vol:0.04|filter:8000|attack:0.01|decay:0.05\n`;
            }
            if (bar % 8 === 0 && beatInBar === 0 && subStep === 0) {
                score += `${t}:noise:white|dur:2.5|vol:0.12|filter:7000|attack:0.01|decay:2.0\n`; // Crash
            }
        }

        // --- LAYER 2: DRIVING BASS / ARP ---
        if (!isIntro && !isOutro && stepCount % 2 === 0) {
            const bassVol = isVerse ? 0.2 : 0.3;
            score += `${t}:instr:synth_lead|freq:${root / 2}|dur:0.15|vol:${bassVol}\n`;
        }

        // Phase 2+ INTENSE ARPEGGIOS
        if ((isPhase2 || isPhase3 || isPhase4Climax) && !isIntro && !isOutro) {
            const arpNote = currentChord[(stepCount % 4) % 3];
            const arpVol = isFullDrop ? 0.15 : 0.1;
            score += `${t}:instr:synth_lead|freq:${arpNote * 4}|dur:0.1|vol:${arpVol}\n`;
        }

        // --- LAYER 3: ATMOSPHERIC PADS & CHORDS ---
        if (isIntro || isVerse || isOutro) {
            if (stepCount % 2 === 0) {
                const arpNote = currentChord[(stepCount / 2) % 3];
                score += `${t}:instr:synth_lead|freq:${arpNote * 2}|dur:0.15|vol:0.15\n`;
            }
        }

        if (isFullDrop && subStep === 0 && (beatInBar === 0 || beatInBar === 2)) {
            currentChord.forEach(f => {
                score += `${t}:instr:strings_legato|freq:${f}|dur:0.6|vol:0.35\n`;
            });
        }

        // Fixed Spectral Pad: High Shimmer Only
        if ((isIntro || isOutro) && subStep === 0 && beatInBar === 0) {
            currentChord.forEach(f => {
                // Shifted Up 2 Octaves and lowered volume to avoid drowning
                score += `${t}:instr:spectral_pad|freq:${f * 4}|dur:0.3|vol:0.1\n`;
            });
        }

        // --- LAYER 4: ANTHEM MELODY & HARMONIES ---
        let melNote = 0;
        let harmonyNote = 0;
        let melVol = isFullDrop ? 0.35 : 0.25;

        if (isFullDrop || isVerse) {
            const isA = bar % 8 < 4;
            if (isA) {
                if (beatInBar === 0 && subStep === 0) melNote = currentChord[0] * 4;
                else if (beatInBar === 1 && subStep === 0) melNote = currentChord[1] * 4;
                else if (beatInBar === 2 && subStep === 0) melNote = currentChord[2] * 4;
                else if (beatInBar === 3 && subStep === 0) melNote = currentChord[2] * 4;
                else if (beatInBar === 3 && subStep === 2) melNote = currentChord[1] * 4;
            } else {
                if (beatInBar === 0 && subStep === 0) melNote = currentChord[2] * 4;
                else if (beatInBar === 1 && subStep === 2) melNote = currentChord[0] * 8;
                else if (beatInBar === 2 && subStep === 2) melNote = currentChord[1] * 4;
                else if (beatInBar === 3 && subStep === 0) melNote = currentChord[0] * 4;
            }

            // Phase 3+ HARMONIES
            if ((isPhase3 || isPhase4Climax) && melNote > 0) {
                harmonyNote = melNote * 1.5; // Perfect 5th harmony
            }
        }

        if (melNote > 0) {
            let dur = (subStep === 2) ? 0.2 : 0.5;
            score += `${t}:instr:synth_lead|freq:${melNote}|dur:${dur}|vol:${melVol}\n`;

            if (harmonyNote > 0) {
                score += `${t}:instr:synth_lead|freq:${harmonyNote}|dur:${dur}|vol:${melVol * 0.5}\n`;
            }

            if (isFullDrop) {
                score += `${t}:instr:strings_staccato|freq:${melNote * 2}|dur:0.1|vol:${melVol * 0.9}\n`;
            }
        }

        currentTime += stepMs;
        stepCount++;
    }

    return score;
};

export const HEROIC_SCORE = generateHeroicScore();