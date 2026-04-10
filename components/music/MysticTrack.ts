import * as NOTES from '../../constants/musicScore';
import { mulberry32, xmur3 } from '../../utils/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getMysticScore = (track: MusicTrackMetadata): string => {
    // Generate a robust seed based on the track ID string
    const seed = xmur3(track.id)();
    const rng = mulberry32(seed);
    
    let score = "";
    const totalDuration = 240000; 

    // --- CHAOS SEEDING: CORE PARAMETERS ---
    // Dreamy, whimsical tempo: 40 - 80 bpm
    const bpm = 40 + Math.floor(rng() * 41);
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    // Magical Scales: Focus on Lydian (bright magic) or Whole Tone (dreamy/otherworldly)
    const scales = [
        [NOTES.C3, NOTES.D3, NOTES.E3, NOTES.Fs3, NOTES.G3, NOTES.A3, NOTES.B3], // C Lydian
        [NOTES.F3, NOTES.G3, NOTES.A3, NOTES.B3, NOTES.C4, NOTES.D4, NOTES.E4], // F Lydian
        [NOTES.C3, NOTES.D3, NOTES.E3, NOTES.Fs3, NOTES.Gs3, NOTES.As3], // Whole Tone (Floaty)
        [NOTES.D3, NOTES.E3, NOTES.Fs3, NOTES.A3, NOTES.B3, NOTES.D4], // Major Pentatonic
    ];
    const scale = scales[Math.floor(rng() * scales.length)];

    // Whimsical Instrument Palette
    const leadInstruments = ['celesta', 'music_box', 'ocarina', 'concert_harp', 'spectral_flute'];
    const padInstruments = ['spectral_pad', 'choir_aahs', 'strings_legato'];
    const accentInstruments = ['crystal_bell', 'celesta', 'music_box'];
    
    const leadInstr = leadInstruments[Math.floor(rng() * leadInstruments.length)];
    const padInstr = padInstruments[Math.floor(rng() * padInstruments.length)];
    const accentInstr = accentInstruments[Math.floor(rng() * accentInstruments.length)];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.15;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const root = scale[bar % scale.length];

        // --- LAYER 1: HARMONIC SWELLS (The Magic) ---
        if (step % 24 === 0) {
            const padVol = isPeak ? 0.15 : 0.08;
            // Dual-layer swells for depth
            score += `${t}:instr:${padInstr}|freq:${root}|dur:8.0|vol:${padVol}\n`;
            if (isPeak) {
                score += `${t + 50}:instr:choir_aahs|freq:${root * 1.5}|dur:6.0|vol:0.06\n`;
            }
        }

        // --- LAYER 2: WHIMSICAL TRILLS & ARPEGGIOS ---
        // Instead of single notes, play fast "magical" runs
        if (rng() < 0.2 && step % 8 === 0 && !isOutro) {
            const runLength = 3 + Math.floor(rng() * 4);
            const runStep = stepMs / 2;
            for (let i = 0; i < runLength; i++) {
                const note = scale[(bar + i) % scale.length] * 2;
                const vol = 0.25 * (1 - (i / runLength)); // Fade the run out
                score += `${t + (i * runStep)}:instr:${leadInstr}|freq:${note}|dur:0.5|vol:${vol.toFixed(2)}\n`;
            }
        }

        // --- LAYER 3: STELLAR ACCENTS (Tinkling chimes) ---
        // Randomized, high-pitched "twinkles"
        if (rng() < 0.12 && !isOutro) {
            const twinkleNote = scale[Math.floor(rng() * scale.length)] * 4; // Very high pitch
            const delay = rng() * stepMs;
            score += `${t + delay}:instr:${accentInstr}|freq:${twinkleNote}|dur:1.0|vol:0.2\n`;
        }

        // --- LAYER 4: FLOATING MELODY ---
        let melodyChance = isPeak ? 0.75 : isIntro ? 0.2 : 0.5;
        if (isOutro) melodyChance = 0.15;

        // Skip around whimsically
        if (rng() < melodyChance && (step % 3 === 0)) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * scale.length);
            let note = scale[noteIndex] * 2;
            
            // Random octave jumps for whimsy
            if (nRng > 0.85) note *= 2;
            if (nRng < 0.1) note /= 2;
            
            const leadVol = isPeak ? 0.35 : 0.22;
            score += `${t}:instr:${leadInstr}|freq:${note}|dur:1.5|vol:${leadVol}\n`;

            // Magical Echoes
            if (nRng > 0.6) {
                 score += `${t + 600}:instr:${leadInstr}|freq:${note}|dur:0.8|vol:${leadVol * 0.4}\n`;
            }
        }

        // --- LAYER 5: HEARTBEAT OF THE WOODS ---
        if (step % 16 === 0 && !isOutro) {
            score += `${t}:instr:timpani|freq:${root / 4}|dur:0.2|vol:0.15\n`;
        }
    }
    return score;
};
