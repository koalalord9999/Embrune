import * as NOTES from '../../constants/musicScore';

/**
 * Static baked score for the Tutorial Area.
 * Format: [ms_offset]:[recipe]
 */
const generateTutorialScore = () => {
    const bpm = 120;
    const beat = 60000 / bpm;
    const totalDuration = 240000; // 4 mins
    let score = "";

    const chords = [
        [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.F4, NOTES.A4, NOTES.C5], [NOTES.G4, NOTES.B4, NOTES.D5], [NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.A3, NOTES.C4, NOTES.E4], [NOTES.F4, NOTES.A4, NOTES.C5], [NOTES.G4, NOTES.B4, NOTES.D5]
    ];

    for (let t = 0; t < totalDuration; t += (beat / 2)) {
        const step = Math.floor(t / (beat / 2));
        const bar = Math.floor(step / 8);
        const beatInBar = Math.floor((step % 8) / 2);
        const subStep = step % 2;
        const progressionIndex = Math.floor(bar / 2) % chords.length;
        const chord = chords[progressionIndex];

        const isIntro = t < 60000;
        const isDevelopment = t >= 60000 && t < 120000;
        const isPeak = t >= 120000 && t < 180000;
        const isOutro = t >= 180000;

        // --- SUBTLE BASS & RHYTHM ---
        if (subStep === 0) {
            const bassNote = chord[0] / 2;
            const bassVol = isOutro ? 0.2 : 0.3; // Fretless bass provides that "little bit of bass"

            score += `${t}:instr:fretless_bass|freq:${bassNote}|dur:0.6|vol:${bassVol}\n`;

            if (isDevelopment || isPeak) {
                // Occasional secondary bass note for depth
                score += `${t}:instr:fretless_bass|freq:${chord[2] / 2}|dur:0.4|vol:${bassVol * 0.5}\n`;
            }
        }

        // --- RHYTHMIC TEXTURE (New Instruments) ---
        if (isDevelopment || isPeak) {
            if (step % 4 === 2) {
                // Introducing the Lute for a more organic, "plucked" feel
                score += `${t}:instr:lute|freq:${chord[1]}|dur:0.3|vol:0.3\n`;
            }
            if (step % 8 === 6) {
                // Adding Concert Harp for high-octave ornamentation
                score += `${t}:instr:concert_harp|freq:${chord[2] * 2}|dur:0.5|vol:0.25\n`;
            }
        }

        // NO SYNTH PADS USED (Removed sine wave pads)

        // --- HIGH TONE MELODY ---
        let shouldPlayMelody = false;
        if (isIntro && subStep === 0 && beatInBar % 2 === 0) shouldPlayMelody = true;
        if (isDevelopment && subStep === 0) shouldPlayMelody = true;
        if (isPeak) shouldPlayMelody = true;
        if (isOutro && step % 16 === 0) shouldPlayMelody = true;

        if (shouldPlayMelody) {
            const noteIndex = (step * 7) % chord.length;
            let note = chord[noteIndex] * 2;

            // Celesta is the primary "high tone" instrument
            const celestaVol = isPeak ? 0.4 : 0.3;
            score += `${t}:instr:celesta|freq:${note}|dur:0.8|vol:${celestaVol}\n`;

            // Crystal Bell provides high-pitched highlights at peak
            if (isPeak && (step % 4 === 0)) {
                score += `${t}:instr:ocarina|freq:${note * 2}|dur:1.5|vol:0.25\n`;
            }

            // Subtle noise for tactile feedback
            score += `${t}:noise:white|dur:0.01|vol:0.005|filter:500|decay:0.01\n`;
        }
    }
    return score;
};

export const TUTORIAL_SCORE = generateTutorialScore();