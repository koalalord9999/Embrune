import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getVolcanicScore = (track: MusicTrackMetadata): string => {
    // Generate a robust seed based on the track ID string
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- CHAOS SEEDING: CORE PARAMETERS ---
    // Intense, driving tempo: 105 - 145 bpm
    const bpm = 105 + Math.floor(rng() * 41);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Dynamic Scale Selection (Phrygian/Diminished)
    const scales = [
        [NOTES.C2, NOTES.Db2, NOTES.E2, NOTES.G2, NOTES.Ab2, NOTES.Bb2], // Phrygian Dominant
        [NOTES.D2, NOTES.Eb2, NOTES.F2, NOTES.Gb2, NOTES.Ab2, NOTES.A2], // Diminished
        [NOTES.A2, NOTES.Bb2, NOTES.Cs3, NOTES.D3, NOTES.E3, NOTES.F3, NOTES.G3], // Hijaz
    ];
    const scale = scales[Math.floor(rng() * scales.length)];

    // Dynamic Instrument Selection
    const leadInstruments = ['epic_brass', 'french_horn', 'synth_lead', 'piano_forte'];
    const padInstruments = ['strings_staccato', 'choir_aahs', 'strings_legato'];
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

        const currentRoot = scale[bar % scale.length];

        // --- LAYER 1: LAVA AMBIENCE / ERUPTIONS ---
        if (step % 32 === 0) {
            const heatVol = isPeak ? 0.015 : 0.008;
            score += `${t}:noise:brown|dur:8|vol:${heatVol}|filter:300|attack:4|decay:4\n`;
            
            // Occasional "eruption" swell
            if (isPeak && rng() < 0.3) {
                score += `${t}:instr:timpani|freq:${NOTES.C1}|dur:2.0|vol:0.5\n`;
            }
        }

        // --- LAYER 2: THRASHING BASS ---
        if (subStep % 2 === 0 && !isOutro && (isPeak || step % 16 < 8)) {
            const bassVol = isPeak ? 0.4 : 0.25;
            const note = (step % 8 < 3) ? currentRoot / 2 : currentRoot;
            score += `${t}:instr:${bassInstr}|freq:${note}|dur:0.2|vol:${bassVol}\n`;
        }

        // --- LAYER 3: STACCATO STRINGS ---
        if (step % 4 === 1 && isPeak) {
             const chordNote = scale[(bar + 2) % scale.length];
             score += `${t}:instr:strings_staccato|freq:${chordNote}|dur:0.2|vol:0.35\n`;
        }

        // --- LAYER 4: AGGRESSIVE BRASS LEAD ---
        let melodyChance = isPeak ? 0.9 : isIntro ? 0.25 : 0.6;
        if (isOutro) melodyChance = 0.15;

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && subStep === 1))) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * scale.length);
            let note = scale[noteIndex] * (nRng > 0.6 ? 2 : 1);
            if (isPeak && nRng > 0.8) note *= 2;

            const leadVol = isPeak ? 0.5 : 0.35;
            score += `${t}:instr:${leadInstr}|freq:${note}|dur:0.6|vol:${leadVol}\n`;
        }
    }
    return score;
};