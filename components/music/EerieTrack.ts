import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getEerieScore = (track: MusicTrackMetadata): string => {
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- ATMOSPHERIC SEEDING ---
    const bpm = 45 + Math.floor(rng() * 15);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Dissonant Scale Segments (Augmented, Diminished, and Minor 2nd clashes)
    const progressions = [
        [NOTES.C2, NOTES.Fs2, NOTES.G2, NOTES.B2], // Tritone + Maj7
        [NOTES.Eb2, NOTES.E2, NOTES.Ab2, NOTES.A2], // Chromatic cluster
        [NOTES.B1, NOTES.D2, NOTES.F2, NOTES.Ab2], // Diminished 7th
        [NOTES.Cs2, NOTES.D2, NOTES.F2, NOTES.Gs2], // Phrygian Dominant flavor
    ];
    const currentProgression = progressions[Math.floor(rng() * progressions.length)];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.15;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentRoot = currentProgression[bar % currentProgression.length];

        // --- LAYER 1: THE VOID (Ghostly Whispers & Static) ---
        if (step % 24 === 0) {
            const noiseVol = isPeak ? 0.015 : 0.008;
            // Shifting noise floor
            score += `${t}:noise:white|dur:8|vol:${noiseVol}|filter:3000|attack:4|decay:4\n`;
            if (isPeak && step % 48 === 0) {
                // High frequency "static hiss"
                score += `${t}:noise:white|dur:2|vol:${noiseVol * 0.5}|filter:9000|attack:1|decay:1\n`;
            }
        }

        // --- LAYER 2: THE STALKING HEARTBEAT (Deep Low End) ---
        if (subStep === 0 && beatInBar % 2 === 0 && !isOutro) {
            const heartVol = 0.35;
            const bassFreq = currentRoot / 4;
            score += `${t}:instr:fretless_bass|freq:${bassFreq}|dur:0.2|vol:${heartVol}\n`;
            score += `${t + 250}:instr:fretless_bass|freq:${bassFreq * 1.01}|dur:0.3|vol:${heartVol * 0.6}\n`; // Double beat with slight detune

            // HESITANT FOOTSTEPS (Subtle Timpani)
            // Irregular, hesitant walk feels like being followed
            if ((step % 13 === 0 || step % 17 === 0) && !isIntro) {
                const stepVol = 0.2 + (rng() * 0.1);
                score += `${t + 400}:instr:timpani|freq:${currentRoot / 8}|dur:0.1|vol:${stepVol}\n`;
            }
        }

        // --- LAYER 3: SPECTRAL MIST (Ethereal Pads) ---
        if (step % 32 === 0 && !isIntro) {
            const padVol = isPeak ? 0.12 : 0.08;
            // Layer multiple pads for a complex, non-static atmosphere
            score += `${t}:instr:spectral_pad|freq:${currentRoot}|dur:12.0|vol:${padVol}\n`;
            if (isPeak) {
                score += `${t + 100}:instr:choir_aahs|freq:${currentRoot * 1.5}|dur:8.0|vol:${padVol * 0.6}\n`;
            }
        }

        // --- LAYER 4: SCARE HITS & DISSONANT PIERCES ---
        // Suddenly loud, sharp events to keep user on edge
        if (isPeak && step % 64 === 12 && rng() > 0.4) {
            const scareFreq = currentProgression[Math.floor(rng() * 4)] * 4;
            score += `${t}:instr:tubular_bells|freq:${scareFreq}|dur:3.0|vol:0.5\n`;
            score += `${t + 50}:instr:crystal_bell|freq:${scareFreq * 2}|dur:0.5|vol:0.4\n`;
        }

        // The "Thin Wall" Melody (Sparse, detuned notes)
        let melodyChance = isPeak ? 0.4 : isIntro ? 0.02 : 0.2;
        if (isOutro) melodyChance = 0.1;

        if (rng() < melodyChance && (step % 8 === 0)) {
            const nRng = rng();
            let note = currentProgression[Math.floor(nRng * currentProgression.length)];
            
            // Octave variety
            if (nRng > 0.7) note *= 8; // High pierce
            else if (nRng > 0.3) note *= 4; // Mid lead
            else note *= 2; // Low eerie lead

            // Sudden dissonance (Sliding out of tune)
            const drift = 1.0 + (rng() * 0.05 - 0.025);
            
            // Choose between breathy flute or fragile music box
            const instr = nRng > 0.5 ? 'spectral_flute' : 'music_box';
            const leadVol = isPeak ? 0.35 : 0.2;
            
            score += `${t}:instr:${instr}|freq:${note * drift}|dur:2.5|vol:${leadVol}\n`;
            
            // Shadow note (unison but slightly delayed and detuned)
            if (isPeak && rng() > 0.6) {
                score += `${t + 500}:instr:${instr}|freq:${note * 0.99}|dur:2.0|vol:${leadVol * 0.5}\n`;
            }
        }
    }
    return score;
};