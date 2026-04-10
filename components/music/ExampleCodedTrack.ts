
import { CodedScore } from '../../types/music';
import * as N from '../../constants/musicScore';

/**
 * Example of a "Coded MIDI" Score.
 * This is fully readable and uses the new Instrument system.
 */
export const FOREST_DANCE: CodedScore = {
    name: "Forest Dance",
    events: [
        // Measure 1: Lute Melody
        { timeMs: 0, note: N.D4, durationMs: 400, instrumentId: 'lute' },
        { timeMs: 200, note: N.F4, durationMs: 200, instrumentId: 'lute' },
        { timeMs: 400, note: N.A4, durationMs: 400, instrumentId: 'lute' },
        { timeMs: 800, note: N.D5, durationMs: 800, instrumentId: 'lute' },
        
        // Background spectral pad
        { timeMs: 0, note: N.D3, durationMs: 2000, instrumentId: 'spectral_pad', velocity: 0.3 },
        { timeMs: 0, note: N.A2, durationMs: 2000, instrumentId: 'spectral_pad', velocity: 0.2 },

        // Measure 2: Crystal Chimes
        { timeMs: 1600, note: N.D5, durationMs: 100, instrumentId: 'crystal_bell' },
        { timeMs: 1800, note: N.F5, durationMs: 100, instrumentId: 'crystal_bell' },
        { timeMs: 2000, note: N.A5, durationMs: 100, instrumentId: 'crystal_bell' },
    ]
};
