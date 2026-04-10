import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getDesolateScore = (track: MusicTrackMetadata): string => {
    // Generate a robust seed based on the track ID string
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- CHAOS SEEDING: CORE PARAMETERS ---
    // Slower, heavy tempo: 60 - 85 bpm
    const bpm = 60 + Math.floor(rng() * 26);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Dynamic Scale Selection (Mostly Minor/Dark)
    const progressions = [
        [NOTES.E2, NOTES.G2, NOTES.B2], // E Minor
        [NOTES.A1, NOTES.C2, NOTES.E2], // A Minor
        [NOTES.D2, NOTES.F2, NOTES.A2], // D Minor
        [NOTES.B1, NOTES.D2, NOTES.F2], // B Diminished
        [NOTES.Cs2, NOTES.E2, NOTES.G2], // C# Minor
    ];
    const currentProgression = progressions[Math.floor(rng() * progressions.length)];

    // Dynamic Instrument Selection
    const leadInstruments = ['spectral_flute', 'concert_harp', 'celesta', 'tubular_bells', 'music_box', 'ocarina'];
    const padInstruments = ['spectral_pad', 'choir_aahs', 'strings_legato'];
    const bassInstruments = ['fretless_bass', 'strings_legato', 'timpani'];
    
    const leadInstr = leadInstruments[Math.floor(rng() * leadInstruments.length)];
    const padInstr = padInstruments[Math.floor(rng() * padInstruments.length)];
    const bassInstr = bassInstruments[Math.floor(rng() * bassInstruments.length)];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.15;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentChord = progressions[(bar % progressions.length + Math.floor(rng() * progressions.length)) % progressions.length];
        const root = currentChord[0];

        // --- LAYER 1: AMBIENT WIND ---
        if (step % 32 === 0) {
            const windVol = isIntro ? 0.005 : isPeak ? 0.012 : 0.008;
            score += `${t}:noise:white|dur:8|vol:${windVol}|filter:800|attack:4|decay:4\n`;
        }

        // --- LAYER 2: DEEP BASS PULSE ---
        if (subStep === 0 && beatInBar % 2 === 0 && !isOutro) {
            const bassVol = isPeak ? 0.3 : 0.2;
            if (beatInBar === 0) {
                score += `${t}:instr:${bassInstr}|freq:${root / 2}|dur:6.0|vol:${bassVol}\n`;
            }
        }

        // --- LAYER 3: HAUNTING PADS ---
        if (step % 16 === 0 && !isOutro) {
            const padVol = isPeak ? 0.12 : 0.08;
            currentChord.forEach((f, i) => {
                const offset = i * 20;
                score += `${t + offset}:instr:${padInstr}|freq:${f}|dur:4.0|vol:${padVol}\n`;
            });
        }

        // --- LAYER 4: LONELY MELODY ---
        let melodyChance = isPeak ? 0.7 : isIntro ? 0.1 : 0.4;
        if (isOutro) melodyChance = 0.2;

        const canPlayMelody = (step % 8 === 0) || (isPeak && step % 4 === 2);
        if (rng() < melodyChance && canPlayMelody) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * (nRng > 0.7 ? 4 : 2);
            
            const leadVol = isPeak ? 0.4 : 0.25;
            score += `${t}:instr:${leadInstr}|freq:${note}|dur:2.0|vol:${leadVol}\n`;
            
            // Occasional "echo"
            if (isPeak && rng() > 0.6) {
                score += `${t + 400}:instr:${leadInstr}|freq:${note}|dur:1.0|vol:${leadVol * 0.5}\n`;
            }
        }
    }
    return score;
};
