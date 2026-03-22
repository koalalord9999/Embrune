import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getEerieScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 
    
    const bpm = 60; // Very slow
    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    const progression = [
        [NOTES.C2, NOTES.Fs2, NOTES.G2], // Dissonant tritone
        [NOTES.Eb2, NOTES.G2, NOTES.Ab2], // Minor second clash
        [NOTES.B1, NOTES.D2, NOTES.F2]   // Diminished
    ];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        
        const isIntro = phase < 0.2;
        const isDev = phase >= 0.2 && phase < 0.5;
        const isPeak = phase >= 0.5 && phase < 0.8;
        const isOutro = phase >= 0.8;

        const currentChord = progression[bar % progression.length];
        const root = currentChord[0];

        // --- LAYER 1: GHOSTLY WHISPERS (NOISE) ---
        if (step % 16 === 0) {
            const noiseVol = isPeak ? 0.01 : 0.005;
            score += `${t}:noise:white|dur:6|vol:${noiseVol}|filter:4000|attack:3|decay:3\n`;
        }

        // --- LAYER 2: HEARTBEAT (BASS) ---
        if (subStep === 0 && (beatInBar === 0 || (beatInBar === 0 && step % 4 === 1))) {
            const heartVol = 0.02;
            // Double thump
            score += `${t}:osc:sine|freq:${root / 4}|dur:0.15|vol:${heartVol}|attack:0.01|decay:0.1\n`;
            score += `${t + 200}:osc:sine|freq:${root / 4}|dur:0.2|vol:${heartVol * 0.8}|attack:0.01|decay:0.15\n`;
        }

        // --- LAYER 3: UNSETTLING PADS ---
        if (step % 32 === 0 && (isDev || isPeak)) {
            const padVol = isPeak ? 0.01 : 0.006;
            currentChord.forEach((f, i) => {
                const pitchShift = (rng() - 0.5) * 2; // Slight detune
                score += `${t + (i * 50)}:osc:sine|freq:${f + pitchShift}|dur:10.0|vol:${padVol}|filter:300|attack:5.0|decay:5.0\n`;
            });
        }

        // --- LAYER 4: SPORADIC DISSONANCE ---
        let melodyChance = isPeak ? 0.4 : isDev ? 0.2 : 0.05;
        if (isOutro) melodyChance = 0.1;

        if (rng() < melodyChance && (step % 8 === 0)) {
            const nRng = rng();
            let note = currentChord[Math.floor(nRng * currentChord.length)] * 4;
            if (nRng > 0.8) note *= 1.05946; // Shift up by one semitone for dissonance

            const leadVol = isPeak ? 0.015 : 0.01;
            score += `${t}:osc:triangle|freq:${note}|dur:3.0|vol:${leadVol}|filter:800|attack:1.5|decay:1.5\n`;
        }
    }
    return score;
};