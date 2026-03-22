import * as NOTES from '../../constants/musicScore';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

/**
 * Permanent baked score for the Grand Style (Silverhaven).
 * 150 BPM, Nostalgic RPG / Medieval Fantasy Style.
 * Features a structured A/B melody, marching snares, and lute arpeggios.
 */
export const getGrandScore = (track: MusicTrackMetadata): string => {
    // Note: We ignore the track parameter for seeding to maintain this 
    // specific handcrafted "Silverhaven" nostalgic motif.
    const baseBpm = 150;
    const beat = 60000 / baseBpm;
    const stepMs = beat / 4; // 16th note grid
    const totalDuration = 240000; // 4 mins
    let score = "";

    // "Medieval Fantasy Epic" Progression: i - VI - III - VII in minor (Dm - Bb - F - C)
    const progression = [
        [NOTES.D2, NOTES.F2, NOTES.A2],   // Dm
        [NOTES.Bb1, NOTES.D2, NOTES.F2],  // Bb
        [NOTES.F1, NOTES.A1, NOTES.C2],   // F
        [NOTES.C2, NOTES.E2, NOTES.G2]    // C
    ];

    let currentTime = 0;
    let stepCount = 0;

    while (currentTime < totalDuration) {
        const bar = Math.floor(stepCount / 16);
        const beatInBar = Math.floor((stepCount % 16) / 4);
        const subStep = stepCount % 4;
        const currentChord = progression[bar % progression.length];

        // --- SECTION LOGIC ---
        // 8 bars per section (128 steps)
        const section = Math.floor(stepCount / 128); 
        const isIntro = section === 0;
        const isA = section % 4 === 1;
        const isB = section % 4 === 2;
        const isBreakdown = section % 4 === 3;

        // --- LAYER 1: MARCHING RHYTHM (Nostalgic RPG feel) ---
        // Deep drum (Timpani/Bass drum) on beats 1 and 3
        if ((beatInBar === 0 || beatInBar === 2) && subStep === 0 && !isBreakdown) {
            score += `${Math.floor(currentTime)}:noise:brown|dur:0.3|vol:0.12|filter:200|decay:0.2\n`;
            score += `${Math.floor(currentTime)}:osc:sine|freq:${NOTES.D1}|dur:0.2|vol:0.15|decay:0.15\n`;
        }

        // Marching Snare (Classic MIDI style)
        const snareVol = isBreakdown ? 0.0 : 0.08;
        if (snareVol > 0) {
            if ((beatInBar === 1 || beatInBar === 3) && subStep === 0) {
                // Main snare hit
                score += `${Math.floor(currentTime)}:noise:white|dur:0.15|vol:${snareVol}|filter:3000|decay:0.1\n`;
            } else if (subStep === 2 && (beatInBar === 1 || beatInBar === 3)) {
                // Syncopated hit
                score += `${Math.floor(currentTime)}:noise:white|dur:0.05|vol:${snareVol * 0.4}|filter:3000|decay:0.05\n`;
            } else if (beatInBar === 3 && subStep > 0 && bar % 2 === 1) {
                // Drum roll at end of phrase
                score += `${Math.floor(currentTime)}:noise:white|dur:0.04|vol:${snareVol * 0.5}|filter:3000|decay:0.04\n`;
            }
        }

        // --- LAYER 2: "HARPSICHORD/LUTE" ARPEGGIOS ---
        // Constant 8th notes
        if (stepCount % 2 === 0 && !isIntro) {
            const arpVol = 0.04;
            const noteIndex = (stepCount / 2) % 3;
            // Up and down arpeggio
            let arpNote = currentChord[noteIndex];
            if ((stepCount / 2) % 6 >= 3) {
                 arpNote = currentChord[2 - noteIndex];
            }
            // Filtered square for plucked string
            score += `${Math.floor(currentTime)}:osc:square|freq:${arpNote * 2}|dur:0.15|vol:${arpVol}|filter:1200|attack:0.01|decay:0.1\n`;
        }

        // --- LAYER 3: WARM PAD / CHOIR ---
        if (subStep === 0 && beatInBar === 0 && !isBreakdown) {
            const padVol = 0.03;
            score += `${Math.floor(currentTime)}:osc:sine|freq:${currentChord[0] * 2}|dur:2.0|vol:${padVol}|filter:800|attack:0.5|decay:1.5\n`;
            score += `${Math.floor(currentTime)}:osc:sine|freq:${currentChord[1] * 2}|dur:2.0|vol:${padVol}|filter:800|attack:0.5|decay:1.5\n`;
            score += `${Math.floor(currentTime)}:noise:brown|dur:2.0|vol:0.01|filter:600|attack:0.5|decay:1.5\n`; 
        }

        // --- LAYER 4: THE CATCHY MELODY ---
        let melNote = 0;
        let melVol = 0;
        let instr = "sine"; 
        let filter = 2000;
        let attack = 0.05;
        let decay = 0.5;

        if (isIntro && subStep === 0) {
            // Fanfare intro (Brass-like)
            instr = "triangle";
            filter = 3000;
            melVol = 0.08;
            attack = 0.02;
            
            // Fanfare rhythm
            if (beatInBar === 0) melNote = currentChord[0] * 4; 
            else if (beatInBar === 1) melNote = currentChord[2] * 4; 
            else if (beatInBar === 2) melNote = currentChord[1] * 4; 
            else if (beatInBar === 3) melNote = currentChord[2] * 4; 
            decay = 0.3;
        } 
        else if (isA) {
            // "Flute/Ocarina" adventurous bouncy melody
            instr = "sine";
            melVol = 0.08;
            filter = 1500;
            
            const motifStep = stepCount % 16;
            if (motifStep === 0) { melNote = currentChord[2] * 4; decay = 0.4; }      
            else if (motifStep === 4) { melNote = currentChord[1] * 4; decay = 0.2; } 
            else if (motifStep === 6) { melNote = currentChord[0] * 4; decay = 0.2; } 
            else if (motifStep === 8) { melNote = currentChord[2] * 4; decay = 0.4; } 
            else if (motifStep === 12) {                                              
                if (bar % 2 === 1) { melNote = currentChord[2] * 8; decay = 0.2; } 
                else { melNote = currentChord[1] * 4; decay = 0.4; }
            }
        }
        else if (isB) {
            // "Brass/Strings" soaring epic melody
            instr = "triangle";
            melVol = 0.07;
            filter = 2500;
            attack = 0.1;
            
            const motifStep = stepCount % 16;
            if (motifStep === 0) { melNote = currentChord[0] * 4; decay = 1.0; } 
            else if (motifStep === 8) { melNote = currentChord[1] * 4; decay = 0.8; } 
            else if (motifStep === 12) { melNote = currentChord[2] * 4; decay = 0.4; } 
            else if (motifStep === 14) { melNote = currentChord[1] * 4; decay = 0.2; } 
        }

        if (melNote > 0) {
            score += `${Math.floor(currentTime)}:osc:${instr}|freq:${melNote}|dur:${decay}|vol:${melVol}|filter:${filter}|attack:${attack}|decay:${decay}\n`;
            if (instr === "sine") {
                score += `${Math.floor(currentTime)}:osc:triangle|freq:${melNote}|dur:${decay}|vol:${melVol * 0.3}|filter:1000|attack:${attack}|decay:${decay}\n`;
            } else if (instr === "triangle") {
               score += `${Math.floor(currentTime)}:osc:sine|freq:${melNote}|dur:${decay}|vol:${melVol * 0.6}|filter:800|attack:${attack}|decay:${decay}\n`;
            }
        }

        currentTime += stepMs;
        stepCount++;
    }

    return score;
};
