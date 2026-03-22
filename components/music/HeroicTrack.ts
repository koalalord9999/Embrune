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

        // --- SECTION LOGIC (16 bars per section) ---
        // 175 BPM = ~22 seconds per 16 bars.
        const section = Math.floor(bar / 16);
        const isIntro = section === 0;
        const isVerse = section === 1 || section === 4;
        // Combine Breakdown and Build to tighten the lull
        const isBreakdownBuild = section === 2 || section === 5;
        const isDrop = section === 3 || section >= 6;

        const isBreakdown = isBreakdownBuild && (bar % 16 < 8); // First 8 bars = atmospheric
        const isBuild = isBreakdownBuild && (bar % 16 >= 8); // Last 8 bars = drum roll riser
        const buildBar = bar % 8; // 0 to 7 within the build
        
        const sectionProgress = (bar % 16) / 16; 

        // --- LAYER 1: DYNAMIC DRUMS ---
        let drumRoll = false;
        let drumVol = 0.2;
        let kickPattern = false;
        let snarePattern = false;
        let snareVol = 0.25;

        // Build Up Logic (1, 2, 4, 8 hit pattern)
        if (isBuild) {
            if (buildBar < 2) {
                drumRoll = subStep === 0; // Quarter notes
            } else if (buildBar < 4) {
                drumRoll = subStep === 0 || subStep === 2; // 8th notes
                drumVol = 0.25;
            } else if (buildBar < 6) {
                drumRoll = true; // 16th notes
                drumVol = 0.3;
            } else if (buildBar === 6) {
                drumRoll = true; // 16th notes louder
                drumVol = 0.35;
            } else if (buildBar === 7) {
                // Gap / Pre-Drop Fill
                if (beatInBar < 2) {
                    drumRoll = true;
                    drumVol = 0.4;
                } else if (beatInBar === 3 && subStep === 2) {
                    score += `${Math.floor(currentTime)}:noise:white|dur:0.4|vol:0.4|filter:5000|attack:0.01|decay:0.3\n`; // Crack
                }
            }

            if (drumRoll) {
                score += `${Math.floor(currentTime)}:noise:brown|dur:0.1|vol:${drumVol}|filter:200|decay:0.1\n`; // Fast kick
                score += `${Math.floor(currentTime)}:noise:white|dur:0.1|vol:${drumVol * 0.5}|filter:4000|decay:0.1\n`; // Fast snare
            }
        } else if (isDrop) {
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
            score += `${Math.floor(currentTime)}:noise:brown|dur:0.2|vol:0.35|filter:${kickFilter}|decay:0.2\n`; 
            score += `${Math.floor(currentTime)}:osc:sine|freq:${NOTES.E1}|dur:0.15|vol:0.3|decay:0.15\n`;
        }

        if (snarePattern) {
            score += `${Math.floor(currentTime)}:noise:white|dur:0.2|vol:${snareVol}|filter:4000|attack:0.01|decay:0.15\n`;
        }

        // Drop Cymbals
        if (isDrop) {
            if (subStep % 2 === 0) { 
                score += `${Math.floor(currentTime)}:noise:white|dur:0.05|vol:0.04|filter:8000|attack:0.01|decay:0.05\n`;
            }
            if (bar % 8 === 0 && beatInBar === 0 && subStep === 0) { 
                score += `${Math.floor(currentTime)}:noise:white|dur:2.5|vol:0.12|filter:7000|attack:0.01|decay:2.0\n`;
            }
        }

        // --- LAYER 2: DRIVING BASS / BUILD CHORDS ---
        if (!isBreakdownBuild && stepCount % 2 === 0) { 
            const bassFilter = isIntro ? 300 + (sectionProgress * 500) : 800; 
            const bassVol = isVerse ? 0.12 : 0.18;
            score += `${Math.floor(currentTime)}:osc:square|freq:${root / 2}|dur:0.15|vol:${bassVol}|filter:${bassFilter}|q:8|attack:0.01|decay:0.1\n`;
        }
        
        if (isDrop && (stepCount % 16 === 7 || stepCount % 16 === 10)) {
            score += `${Math.floor(currentTime)}:osc:square|freq:${root}|dur:0.1|vol:0.1|filter:1200|q:5|attack:0.01|decay:0.1\n`;
        }

        // Build Chords
        if (isBuild && drumRoll && buildBar < 7) {
            // Ascending chord stab to match the drum roll
            let buildNote = root * 2;
            if (buildBar >= 2) buildNote = currentChord[1] * 2;
            if (buildBar >= 4) buildNote = currentChord[2] * 2;
            if (buildBar >= 6) buildNote = root * 4;

            score += `${Math.floor(currentTime)}:osc:square|freq:${buildNote}|dur:0.1|vol:0.05|filter:1500|attack:0.01|decay:0.1\n`;
            score += `${Math.floor(currentTime)}:osc:triangle|freq:${buildNote}|dur:0.1|vol:0.08|filter:3000|attack:0.01|decay:0.1\n`;
        }

        // --- LAYER 3: ATMOSPHERIC PADS & CHORDS ---
        if (isIntro || isVerse || isBreakdown) {
            if (stepCount % 2 === 0) {
                const arpNote = currentChord[(stepCount / 2) % 3];
                score += `${Math.floor(currentTime)}:osc:sine|freq:${arpNote * 2}|dur:0.2|vol:0.05|filter:2000|attack:0.05|decay:0.2\n`;
            }
        }

        if (isDrop && subStep === 0 && (beatInBar === 0 || beatInBar === 2)) {
            currentChord.forEach(f => {
                score += `${Math.floor(currentTime)}:osc:triangle|freq:${f}|dur:0.8|vol:0.08|filter:2000|attack:0.05|decay:0.7\n`;
            });
        }

        if (isBreakdown && subStep === 0 && beatInBar === 0) {
             currentChord.forEach(f => {
                score += `${Math.floor(currentTime)}:osc:sine|freq:${f}|dur:4.0|vol:0.06|filter:800|attack:1.0|decay:3.0\n`;
            });
        }

        // --- LAYER 4: HUGE ANTHEM MELODY ---
        let melNote = 0;
        let melVol = isDrop ? 0.14 : 0.08; 
        
        if (isDrop || isVerse) {
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
        }

        if (melNote > 0) {
            let dur = (subStep === 2) ? 0.3 : 0.7; 
            score += `${Math.floor(currentTime)}:osc:triangle|freq:${melNote}|dur:${dur}|vol:${melVol}|filter:3000|q:2|attack:0.05|decay:${dur}\n`;
            if (isDrop) {
                score += `${Math.floor(currentTime)}:osc:square|freq:${melNote}|dur:${dur}|vol:${melVol * 0.4}|filter:2000|attack:0.05|decay:${dur}\n`;
            }
            score += `${Math.floor(currentTime)}:osc:sine|freq:${melNote / 2}|dur:${dur}|vol:${melVol * 0.5}|filter:800|attack:0.05|decay:${dur}\n`;
        }

        currentTime += stepMs;
        stepCount++;
    }

    return score;
};

export const HEROIC_SCORE = generateHeroicScore();