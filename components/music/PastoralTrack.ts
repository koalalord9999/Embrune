import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getPastoralScore = (track: MusicTrackMetadata): string => {
    // Generate a robust seed based on the track ID string
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- CHAOS SEEDING: CORE PARAMETERS ---
    // Dynamic tempo: 80 - 120 bpm
    const bpm = 80 + Math.floor(rng() * 41);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Dynamic Scale Selection
    const scales = [
        [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.Fs4, NOTES.G4], // Major
        [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.Cs4, NOTES.D4, NOTES.E4, NOTES.Fs4, NOTES.G4], // Lydian (Bright)
        [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.D4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.B4], // Major Pentatonic
        [NOTES.F3, NOTES.G3, NOTES.A3, NOTES.Bb3, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.F4], // Mixolydian (Relaxed)
    ];
    const scale = scales[Math.floor(rng() * scales.length)];

    // Dynamic Instrument Selection
    const leadInstruments = ['ocarina', 'spectral_flute', 'concert_harp', 'celesta', 'piano_forte'];
    const padInstruments = ['strings_legato', 'choir_aahs', 'spectral_pad'];
    const bassInstruments = ['fretless_bass', 'strings_legato'];
    
    const leadInstr = leadInstruments[Math.floor(rng() * leadInstruments.length)];
    const padInstr = padInstruments[Math.floor(rng() * padInstruments.length)];
    const bassInstr = bassInstruments[Math.floor(rng() * bassInstruments.length)];

    // Variations for specific zones (Legacy support + extra spice)
    let extraNoiseVol = 1.0;
    if (track.id === 'wilderness') extraNoiseVol = 2.0;

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isIntro = phase < 0.2;
        const isOutro = phase >= 0.8;

        const currentRoot = scale[bar % 4];

        // --- LAYER 1: AMBIENCE ---
        if (step % 32 === 0) { 
            const vol = 0.003 * extraNoiseVol;
            score += `${t}:noise:white|dur:8|vol:${vol}|filter:5000|attack:4|decay:4\n`;
        }

        // --- LAYER 2: DEEP BASS ---
        if (subStep === 0 && beatInBar === 0 && !isOutro) {
            const bassVol = isPeak ? 0.35 : (isIntro ? 0.15 : 0.25);
            score += `${t}:instr:${bassInstr}|freq:${currentRoot / 2}|dur:4.0|vol:${bassVol}\n`;
        }

        // --- LAYER 3: ETHEREAL PADS ---
        if (step % 16 === 0 && !isIntro && !isOutro) {
            const chord = [scale[bar % 4], scale[(bar + 2) % scale.length], scale[(bar + 4) % scale.length]];
            const padVol = isPeak ? 0.12 : 0.08;
            chord.forEach((f, i) => {
                score += `${t + (i * 20)}:instr:${padInstr}|freq:${f}|dur:4.0|vol:${padVol}\n`;
            });
        }
        
        // --- LAYER 4: GENERATIVE MELODY ---
        let melodyChance = isPeak ? 0.85 : isIntro ? 0.3 : 0.6;
        if (isOutro) melodyChance = 0.2;

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && step % 2 === 0))) {
            const noteRng = rng();
            const noteIndex = Math.floor(noteRng * scale.length);
            let note = scale[noteIndex];
            
            // Octave jumps in peak
            if (isPeak && noteRng > 0.6) note *= 2;
            
            const leadVol = isPeak ? 0.45 : 0.3;
            score += `${t}:instr:${leadInstr}|freq:${note}|dur:0.8|vol:${leadVol}\n`;
        }
    }

    return score;
};