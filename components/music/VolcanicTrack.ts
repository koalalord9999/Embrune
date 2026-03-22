import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getVolcanicScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 
    
    const bpm = 112;
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    const progression = [
        [NOTES.C2, NOTES.Db2, NOTES.E2, NOTES.G2], // C Phrygian Dominant fragment
        [NOTES.Db2, NOTES.E2, NOTES.G2, NOTES.Bb2], // Db Diminished
        [NOTES.C2, NOTES.Db2, NOTES.E2, NOTES.G2]
    ];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.1;
        const isDev = phase >= 0.1 && phase < 0.4;
        const isPeak = phase >= 0.4 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentChord = progression[bar % progression.length];
        const root = currentChord[0];

        // --- LAYER 1: LAVA AMBIENCE / ERUPTIONS ---
        if (step % 32 === 0) {
            const heatVol = isPeak ? 0.015 : 0.008;
            score += `${t}:noise:brown|dur:8|vol:${heatVol}|filter:300|attack:4|decay:4\n`;
            
            // Occasional "eruption" swell
            if (isPeak && rng() < 0.2) {
                score += `${t}:noise:brown|dur:2|vol:0.04|filter:150|attack:1.5|decay:0.5\n`;
            }
        }

        // --- LAYER 2: THRASHING BASS ---
        if (subStep % 2 === 0 && !isOutro && (isDev || isPeak)) {
            const bassVol = isPeak ? 0.03 : 0.015;
            const note = (step % 8 < 3) ? root : currentChord[1];
            score += `${t}:osc:sawtooth|freq:${note / 2}|dur:0.2|vol:${bassVol}|filter:400|attack:0.01|decay:0.15\n`;
        }

        // --- LAYER 3: AGGRESSIVE LEAD ---
        let melodyChance = isPeak ? 0.85 : isDev ? 0.5 : 0.2;
        if (isOutro) melodyChance = 0.1;

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && subStep === 1))) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * 2;
            if (isPeak && nRng > 0.7) note *= 2;

            const leadVol = isPeak ? 0.03 : 0.018;
            const filt = isPeak ? 4000 : 2000;
            const type = (isPeak && nRng > 0.5) ? 'sawtooth' : 'triangle';
            score += `${t}:osc:${type}|freq:${note}|dur:0.4|vol:${leadVol}|filter:${filt}|attack:0.01|decay:0.3\n`;
        }
    }
    return score;
};