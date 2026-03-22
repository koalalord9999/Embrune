import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getIndustrialScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 

    // Fine-tuning based on region ID
    let bpm = 124;
    let leadType: 'square' | 'sawtooth' | 'triangle' = 'square';
    let energyLevel = 0.5;

    if (track.id === 'dwarven_outpost') {
        bpm = 132;
        energyLevel = 0.8;
    } else if (track.id === 'sanctity') {
        bpm = 90;
        leadType = 'triangle';
        energyLevel = 0.3;
    }

    const beat = 60000 / bpm;
    const stepMs = beat / 4; 
    const progression = [
        [NOTES.A2, NOTES.C3, NOTES.E3], // A Minor
        [NOTES.F2, NOTES.A2, NOTES.C3], // F Major
        [NOTES.G2, NOTES.B2, NOTES.D3], // G Major
        [NOTES.E2, NOTES.G2, NOTES.B2]  // E Minor
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

        // --- LAYER 1: MECHANICAL PERCUSSION ---
        if (subStep === 0) {
            // Kick-like pulse
            if (beatInBar === 0 || beatInBar === 2) {
                const kickVol = isPeak ? 0.04 : 0.02;
                score += `${t}:noise:brown|dur:0.1|vol:${kickVol}|filter:150|decay:0.1\n`;
            }
            // Clank/Snare on 2 and 4
            if ((beatInBar === 1 || beatInBar === 3) && energyLevel > 0.4) {
                const clankVol = isPeak ? 0.02 : 0.01;
                score += `${t}:noise:white|dur:0.05|vol:${clankVol}|filter:1200|decay:0.04\n`;
                if (track.id === 'dwarven_outpost') {
                     score += `${t}:osc:square|freq:${NOTES.Cs6}|dur:0.02|vol:${clankVol * 0.5}|decay:0.02\n`;
                }
            }
        }

        // --- LAYER 2: DRIVING BASS ---
        if (subStep % 2 === 0 && !isOutro && (isDev || isPeak)) {
            const bassVol = isPeak ? 0.03 : 0.015;
            const bassNote = step % 8 === 0 ? root / 2 : root;
            score += `${t}:osc:sawtooth|freq:${bassNote}|dur:0.15|vol:${bassVol}|filter:600|attack:0.01|decay:0.1\n`;
        }

        // --- LAYER 3: GRITTY MELODY/RIFF ---
        let melodyChance = isPeak ? 0.8 : isDev ? 0.5 : energyLevel * 0.3;
        if (isOutro) melodyChance = 0.1;

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && subStep === 2))) {
            const nRng = rng();
            const noteIndex = Math.floor(nRng * currentChord.length);
            let note = currentChord[noteIndex] * 2;
            if (isPeak && nRng > 0.8) note *= 2;

            const leadVol = isPeak ? 0.025 : 0.015;
            const filt = isPeak ? 2500 : 1500;
            score += `${t}:osc:${leadType}|freq:${note}|dur:0.3|vol:${leadVol}|filter:${filt}|attack:0.01|decay:0.2\n`;
        }
    }
    return score;
};