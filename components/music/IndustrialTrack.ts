import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getIndustrialScore = (track: MusicTrackMetadata): string => {
    // Generate a robust seed based on the track ID string
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- CHAOS SEEDING: CORE PARAMETERS ---
    // Driving, rhythmic tempo: 95 - 135 bpm
    const bpm = 95 + Math.floor(rng() * 41);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Dynamic Scale Selection (Functional/Gritty)
    const progressions = [
        [NOTES.A2, NOTES.C3, NOTES.E3], // A Minor
        [NOTES.F2, NOTES.A2, NOTES.C3], // F Major
        [NOTES.G2, NOTES.B2, NOTES.D3], // G Major
        [NOTES.E2, NOTES.G2, NOTES.B2], // E Minor
        [NOTES.D2, NOTES.F2, NOTES.A2], // D Minor
    ];
    const currentProgression = progressions[Math.floor(rng() * progressions.length)];

    // Dynamic Instrument Selection
    const leadInstruments = ['epic_brass', 'harpsichord', 'marimba', 'piano_forte', 'synth_lead'];
    const padInstruments = ['strings_staccato', 'french_horn', 'strings_legato'];
    const bassInstruments = ['timpani', 'fretless_bass'];
    
    const leadInstr = leadInstruments[Math.floor(rng() * leadInstruments.length)];
    const padInstr = padInstruments[Math.floor(rng() * padInstruments.length)];
    const bassInstr = bassInstruments[Math.floor(rng() * bassInstruments.length)];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.1;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentChord = progressions[bar % progressions.length];
        const root = currentChord[0];

        // --- LAYER 1: MECHANICAL PULSE (Kick/Noise) ---
        if (subStep === 0) {
            if (beatInBar === 0 || beatInBar === 2) {
                const kickVol = isPeak ? 0.3 : 0.15;
                score += `${t}:instr:timpani|freq:${root / 4}|dur:0.2|vol:${kickVol}\n`;
            }
            if (beatInBar === 1 || beatInBar === 3) {
                 const snareVol = isPeak ? 0.05 : 0.02;
                 score += `${t}:noise:white|dur:0.05|vol:${snareVol}|filter:1200|decay:0.04\n`;
            }
        }

        // --- LAYER 2: CHUGGING RHYTHM (Bass/Strings) ---
        if (subStep % 2 === 0 && !isOutro && (isPeak || step % 16 < 8)) {
            const bassVol = isPeak ? 0.4 : 0.25;
            const note = step % 8 === 0 ? root / 2 : root;
            score += `${t}:instr:${bassInstr}|freq:${note}|dur:0.15|vol:${bassVol}\n`;
        }

        // --- LAYER 3: BRASS/PAD ACCENTS ---
        if (step % 8 === 4 && (isPeak || !isIntro)) {
             const padVol = isPeak ? 0.35 : 0.2;
             score += `${t}:instr:${padInstr}|freq:${root}|dur:0.8|vol:${padVol}\n`;
        }

        // --- LAYER 4: DRIVING RIFF ---
        let melodyChance = isPeak ? 0.8 : isIntro ? 0.2 : 0.5;
        if (isOutro) melodyChance = 0.1;

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && subStep === 2))) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * 2;
            if (isPeak && nRng > 0.8) note *= 2;

            const leadVol = isPeak ? 0.45 : 0.3;
            score += `${t}:instr:${leadInstr}|freq:${note}|dur:0.4|vol:${leadVol}\n`;
        }
    }
    return score;
};