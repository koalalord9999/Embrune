import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getMysticScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 
    
    const bpm = 96;
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    const progression = [
        [NOTES.G2, NOTES.B2, NOTES.D3, NOTES.Fs3], // G Major 7 (Lydian feel)
        [NOTES.A2, NOTES.Cs3, NOTES.E3, NOTES.G3], // A Dominant 7
        [NOTES.C3, NOTES.E3, NOTES.G3, NOTES.B3],  // C Major 7
        [NOTES.D3, NOTES.Fs3, NOTES.A3, NOTES.Cs4] // D Major 7
    ];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.15;
        const isDev = phase >= 0.15 && phase < 0.45;
        const isPeak = phase >= 0.45 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentChord = progression[bar % progression.length];
        
        // --- LAYER 1: ETHEREAL PADS ---
        if (step % 32 === 0) {
            const padVol = isPeak ? 0.012 : 0.008;
            currentChord.forEach((f, i) => {
                score += `${t + (i * 100)}:osc:sine|freq:${f}|dur:8.0|vol:${padVol}|filter:400|attack:4.0|decay:4.0\n`;
            });
        }

        // --- LAYER 2: SHIMMER ARPEGGIO ---
        if ((isDev || isPeak) && !isOutro) {
            const arpIndex = step % currentChord.length;
            const note = currentChord[arpIndex] * (step % 32 >= 16 ? 4 : 2);
            const arpVol = isPeak ? 0.012 : 0.006;
            score += `${t}:osc:sine|freq:${note}|dur:0.4|vol:${arpVol}|filter:2000|attack:0.05|decay:0.3\n`;
        }

        // --- LAYER 3: CRYSTAL CHIMES ---
        if (isPeak && rng() < 0.15 && step % 8 === 0) {
            const chimeNote = currentChord[Math.floor(rng() * currentChord.length)] * 8;
            score += `${t}:osc:sine|freq:${chimeNote}|dur:0.8|vol:0.01|filter:8000|attack:0.01|decay:0.7\n`;
        }

        // --- LAYER 4: SOFT MELODY ---
        let melodyChance = isPeak ? 0.6 : isDev ? 0.3 : 0.1;
        if (isOutro) melodyChance = 0.05;

        if (rng() < melodyChance && (step % 8 === 0 || (isPeak && subStep === 2))) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * 2;
            
            const leadVol = isPeak ? 0.02 : 0.012;
            score += `${t}:osc:triangle|freq:${note}|dur:1.5|vol:${leadVol}|filter:1200|attack:0.4|decay:1.0\n`;
        }
    }
    return score;
};

