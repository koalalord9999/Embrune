import * as N from '../../constants/musicScore';

const generateSeaShantyScore = (): string => {
    const BPM = 120;
    const BEAT_MS = 60000 / BPM;
    const STEP_MS = BEAT_MS / 4; // 16th note grid
    const STAGE_LENGTHS = [4, 4, 8, 8, 16, 16, 8, 4];
    const TOTAL_BARS = STAGE_LENGTHS.reduce((a, b) => a + b, 0);
    const TOTAL_DURATION_MS = TOTAL_BARS * 16 * STEP_MS;

    // Pre-calculate which stage each bar belongs to
    const barToStage: number[] = [];
    STAGE_LENGTHS.forEach((len, idx) => {
        for (let i = 0; i < len; i++) barToStage.push(idx + 1);
    });

    let score = "";

    const progA = ['Dm', 'Gm', 'Dm', 'A'];
    const progB = ['Bb', 'F', 'C', 'Dm'];
    const chordMap = {
        'Dm': [N.D4, N.F4, N.A4], 'Gm': [N.G3, N.Bb3, N.D4], 'A': [N.A3, N.Cs4, N.E4],
        'Bb': [N.Bb3, N.D4, N.F4], 'F': [N.F3, N.A3, N.C4], 'C': [N.C4, N.E4, N.G4],
    };
    const bassMap = {
        'Dm': [N.D2, N.A2], 'Gm': [N.G2, N.D3], 'A': [N.A2, N.E3],
        'Bb': [N.Bb2, N.F3], 'F': [N.F2, N.C3], 'C': [N.C3, N.G3],
    };

    // --- Melody Variations ---
    // Simple 2-bar phrases, repeated to make 4 bars
    const melodyA_simple = [N.A4, null, null, null, N.D5, null, null, null, N.C5, null, N.A4, null, N.A4, null, null, null, N.G4, null, null, null, N.E4, null, N.G4, null, N.A4, null, N.G4, null, null, null, null, null,];
    // FIX: Added missing 'N.' prefix for note constants.
    const melodyB_simple = [N.F4, null, null, null, N.A4, null, N.C5, null, N.Bb4, null, N.A4, null, N.G4, null, null, null, N.F4, null, null, null, N.G4, null, N.A4, null, N.G4, null, N.F4, null, N.E4, null, null, null,];

    // Full 4-bar complex phrases
    const melodyA_complex = [N.A4, null, N.A4, null, N.D5, null, N.D5, null, N.C5, null, N.A4, N.G4, N.A4, null, null, null, N.G4, null, N.F4, null, N.E4, N.F4, N.G4, null, N.A4, null, N.G4, null, null, null, null, null, N.A4, null, N.A4, null, N.D5, null, N.D5, null, N.C5, null, N.A4, N.G4, N.A4, null, null, null, N.G4, null, N.E4, null, N.C4, null, N.D4, N.D4, N.D4, null, N.D4, null, null, null, null, null,];
    const melodyB_complex = [N.F4, null, N.F4, null, N.A4, null, N.C5, null, N.Bb4, null, N.A4, N.G4, N.A4, null, null, null, N.G4, null, N.F4, null, N.G4, N.A4, N.A4, null, N.G4, null, N.F4, N.E4, null, null, null, null, N.F4, null, N.F4, null, N.A4, null, N.C5, null, N.Bb4, null, N.A4, N.G4, N.A4, null, null, null, N.A4, N.G4, N.F4, N.E4, N.D4, null, N.D4, null, N.D4, null, N.D4, null, null, null, null, null,];

    // New alternate melodies (4 bars each)
    const melodyA_alt_1 = [N.A4, null, null, null, null, null, null, null, N.G4, null, null, null, null, null, null, null, N.F4, null, null, null, null, null, null, null, N.E4, null, null, null, null, null, null, null, N.A4, null, null, null, null, null, null, null, N.G4, null, null, null, null, null, null, null, N.F4, null, null, null, null, null, null, null, N.D4, null, null, null, null, null, null, null,];
    const melodyB_alt_1 = [N.F4, null, null, null, null, null, null, null, N.A4, null, null, null, null, null, null, null, N.G4, null, null, null, null, null, null, null, N.F4, null, null, null, null, null, null, null, N.F4, null, null, null, null, null, null, null, N.C5, null, null, null, null, null, null, null, N.Bb4, null, null, null, null, null, null, null, N.A4, null, null, null, null, null, null, null,];
    const melodyA_alt_2 = [N.A4, null, N.A4, null, N.G4, null, N.A4, null, N.D5, null, null, null, N.C5, null, null, null, N.A4, null, N.G4, null, N.F4, null, null, null, N.E4, null, N.F4, null, N.G4, null, null, null, N.A4, null, N.A4, null, N.G4, null, N.A4, null, N.D5, null, null, null, N.C5, null, null, null, N.A4, null, N.G4, null, N.E4, null, null, null, N.D4, null, null, null, N.D4, null, null, null,];
    // FIX: Added missing 'N.' prefix for note constants.
    const melodyB_alt_2 = [N.F4, null, N.F4, null, N.G4, null, N.A4, null, N.C5, null, null, null, N.Bb4, null, null, null, N.A4, null, N.G4, null, N.F4, null, null, null, N.E4, null, N.F4, null, N.E4, null, null, null, N.F4, null, N.F4, null, N.G4, null, N.A4, null, N.C5, null, null, null, N.Bb4, null, null, null, N.A4, null, N.G4, null, N.A4, null, null, null, N.D4, null, null, null, N.D4, null, null, null,];

    const melodyC_bridge = [N.C5, null, N.Bb4, N.A4, N.G4, null, N.A4, N.Bb4, N.A4, null, N.G4, N.F4, N.E4, null, N.F4, N.G4, N.A4, N.G4, N.F4, N.E4, N.D4, null, N.E4, N.F4, N.E4, null, N.D4, null, N.D4, null, null, null,];

    const descantA = [N.D5, N.C5, N.Bb4, N.A4];
    const descantB = [N.F5, N.E5, N.D5, N.C5];

    const getHarmonyNote = (note: number | null) => {
        if (note === null) return null;
        const scale = [N.D4, N.E4, N.F4, N.G4, N.A4, N.Bb4, N.C5, N.D5];
        const octave = Math.floor(Math.log2(note / N.C4));
        const normalizedNote = note / Math.pow(2, octave);
        let closestScaleNoteIndex = -1, minDiff = Infinity;
        for (let i = 0; i < scale.length; i++) { const diff = Math.abs(scale[i] - normalizedNote); if (diff < minDiff) { minDiff = diff; closestScaleNoteIndex = i; } }
        if (closestScaleNoteIndex !== -1) { const harmonyNoteIndex = (closestScaleNoteIndex - 2 + scale.length) % scale.length; return scale[harmonyNoteIndex] * Math.pow(2, octave); }
        return note / 1.5;
    };

    let currentTime = 0;
    let stepCount = 0;

    while (currentTime < TOTAL_DURATION_MS) {
        const bar = Math.floor(stepCount / 16);
        const stage = barToStage[bar] || STAGE_LENGTHS.length;

        let currentStepMs = STEP_MS;
        let codaFade = 1.0;
        if (stage >= STAGE_LENGTHS.length) {
            // Coda progress for the very last stage
            const stageStartBar = STAGE_LENGTHS.slice(0, stage - 1).reduce((a, b) => a + b, 0);
            const barsSinceStageStart = bar - stageStartBar;
            const stageLen = STAGE_LENGTHS[stage - 1];
            const codaProgress = (barsSinceStageStart + (stepCount % 16) / 16) / stageLen;

            currentStepMs = STEP_MS * (1 + codaProgress * 1.5);
            codaFade = 1.0 - codaProgress;
        }

        const t = Math.floor(currentTime);
        const stepInBar = stepCount % 16;
        const beatInBar = Math.floor(stepInBar / 4);
        const sectionPhrase = bar % 16;
        const isPartA = sectionPhrase < 8;

        const progression = isPartA ? progA : progB;
        const chordName = progression[beatInBar];
        const chord = chordMap[chordName as keyof typeof chordMap];
        const bass = bassMap[chordName as keyof typeof bassMap];

        let baseVolume = codaFade;
        if (baseVolume <= 0.001) { currentTime += currentStepMs; stepCount++; continue; }

        // Percussion (Stage 1+)
        if (stage >= 1) {
            if (stepCount % 8 === 0 || stepCount % 8 === 4) { const percVol = (stage === 1 ? 0.15 : 0.25) * baseVolume; if (percVol > 0.01) score += `${t}:instr:timpani|freq:${N.D1}|dur:0.1|vol:${percVol}\n`; }
            if (stepCount % 8 === 2 || stepCount % 8 === 6) { const percVol = (stage === 1 ? 0.05 : 0.1) * baseVolume; if (percVol > 0.01) score += `${t}:instr:marimba_staccato|freq:${N.A3}|dur:0.05|vol:${percVol}\n`; }
            if (stage >= 7 && (stepCount % 4 === 1 || stepCount % 4 === 3)) { const percVol = 0.02 * baseVolume; if (percVol > 0.001) score += `${t}:instr:celesta|freq:${N.D6}|dur:0.02|vol:${percVol}\n`; }
        }

        // Bassline (Stage 1+)
        if (stage >= 1) {
            if (stepCount % 8 === 0) score += `${t}:instr:bass_staccato|freq:${bass[0]}|dur:0.1|vol:${0.3 * baseVolume}\n`;
            if (stepCount % 8 === 4) score += `${t}:instr:bass_staccato|freq:${bass[1]}|dur:0.1|vol:${0.25 * baseVolume}\n`;
        }

        // Arpeggiated Chords (Stage 3+)
        if (stage >= 3) {
            const subStepInBeat = stepCount % 4;
            const arpeggioNote = chord[subStepInBeat % chord.length];
            const harmonyVol = (stage === 3 ? 0.04 : 0.07) * baseVolume;
            if (harmonyVol > 0.01) score += `${t}:instr:harpsichord|freq:${arpeggioNote}|dur:0.1|vol:${harmonyVol}\n`;
        }

        // Melody & Harmonies
        let melody: (number | null)[] = [];
        let melodyPhraseLength = 64; // Default to 4 bars
        if (stage === 2) { melody = isPartA ? melodyA_simple : melodyB_simple; melodyPhraseLength = 32; } // 2-bar phrases
        else if (stage === 3) { melody = isPartA ? melodyA_complex : melodyB_alt_1; }
        else if (stage === 4) { melody = isPartA ? melodyA_alt_2 : melodyB_complex; }
        else if (stage === 5 || stage === 7 || stage === 8) { melody = isPartA ? melodyA_complex : melodyB_complex; }
        else if (stage === 6) { melody = isPartA ? melodyA_complex : melodyC_bridge; melodyPhraseLength = 32; }

        if (melody.length > 0) {
            // FIX: Corrected melody playback logic to loop through phrases correctly
            const melodyStep = stepCount % melodyPhraseLength;
            const melodyNote = melody[melodyStep % melody.length];
            if (melodyNote) {
                let melodyVol = (stage === 2 ? 0.12 : stage === 3 ? 0.14 : 0.16) * baseVolume;
                if (melodyVol > 0.01) {
                    score += `${t}:instr:brass_staccato|freq:${melodyNote}|dur:0.08|vol:${melodyVol}\n`;
                }
                if (stage >= 4) {
                    const harmonyNote = getHarmonyNote(melodyNote);
                    if (harmonyNote) { const harmonyVol = melodyVol * 0.5; if (harmonyVol > 0.01) score += `${t}:instr:french_horn|freq:${harmonyNote}|dur:0.15|vol:${harmonyVol}\n`; }
                }
                if (stage >= 5) {
                    const highHarmonyVol = melodyVol * 0.3;
                    if (highHarmonyVol > 0.01) score += `${t}:instr:french_horn|freq:${melodyNote * 2}|dur:0.1|vol:${highHarmonyVol}\n`;
                }
            }
        }

        // Descant (Stage 6-7)
        if (stage === 6 || stage === 7) {
            if (stepInBar % 4 === 0) {
                const descantNote = isPartA ? descantA[beatInBar] : descantB[beatInBar];
                if (descantNote) { const descantVol = 0.15 * baseVolume; if (descantVol > 0.01) score += `${t}:instr:strings_legato|freq:${descantNote}|dur:0.3|vol:${descantVol}\n`; }
            }
        }

        currentTime += currentStepMs;
        stepCount++;
    }

    return score;
};

export const GENERATED_SCORE = generateSeaShantyScore();