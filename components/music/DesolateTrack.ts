import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getDesolateScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 
    
    const bpm = 80;
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    const progression = [
        [NOTES.E2, NOTES.G2, NOTES.B2], // E Minor
        [NOTES.C2, NOTES.E2, NOTES.G2], // C Major
        [NOTES.D2, NOTES.Fs2, NOTES.A2], // D Major
        [NOTES.A1, NOTES.C2, NOTES.E2]  // A Minor
    ];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.15;
        const isDev = phase >= 0.15 && phase < 0.4;
        const isPeak = phase >= 0.4 && phase < 0.75;
        const isOutro = phase >= 0.75;

        const currentChord = progression[bar % progression.length];
        const root = currentChord[0];

        // --- LAYER 1: AMBIENT WIND ---
        if (step % 32 === 0) {
            const windVol = isIntro ? 0.005 : isPeak ? 0.012 : 0.008;
            score += `${t}:noise:white|dur:8|vol:${windVol}|filter:800|attack:4|decay:4\n`;
        }

        // --- LAYER 2: DEEP BASS PULSE ---
        if (subStep === 0 && beatInBar % 2 === 0 && !isOutro) {
            const bassVol = isPeak ? 0.025 : 0.015;
            if (beatInBar === 0) {
                score += `${t}:osc:sine|freq:${root / 2}|dur:6.0|vol:${bassVol}|attack:2.0|decay:4.0\n`;
            }
        }

        // --- LAYER 3: HAUNTING PADS ---
        if (step % 16 === 0 && (isDev || isPeak)) {
            const padVol = isPeak ? 0.01 : 0.006;
            currentChord.forEach((f, i) => {
                const offset = i * 20;
                score += `${t + offset}:osc:sine|freq:${f}|dur:4.0|vol:${padVol}|filter:400|attack:2.0|decay:2.0\n`;
            });
        }

        // --- LAYER 4: LONELY MELODY ---
        let melodyChance = isPeak ? 0.7 : isDev ? 0.4 : isIntro ? 0.1 : 0.05;
        if (isOutro) melodyChance = 0.2;

        const canPlayMelody = (step % 8 === 0) || (isPeak && step % 4 === 2);
        if (rng() < melodyChance && canPlayMelody) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * (nRng > 0.7 ? 4 : 2);
            
            const leadVol = isPeak ? 0.022 : 0.015;
            const decay = isPeak ? 1.5 : 0.8;
            score += `${t}:osc:triangle|freq:${note}|dur:2.0|vol:${leadVol}|filter:1500|attack:0.1|decay:${decay}\n`;
            
            // Occasional "echo"
            if (isPeak && rng() > 0.5) {
                score += `${t + 300}:osc:triangle|freq:${note}|dur:1.0|vol:${leadVol * 0.4}|filter:1000|attack:0.1|decay:0.5\n`;
            }
        }
    }
    return score;
};

