
export type OscillatorLayer = {
    type: OscillatorType;
    multiplier: number; // For harmonics (1 is base freq, 2 is octave, 1.5 is fifth, etc.)
    detune: number;     // In cents
    volume: number;     // Relative volume of this layer
};

export type ADSR = {
    attack: number;     // seconds
    decay: number;      // seconds
    sustain: number;    // volume (0-1)
    release: number;    // seconds
};

export type FilterConfig = {
    type: BiquadFilterType;
    frequency: number;  // (multiplier of the base note freq, or fixed Hz)
    isFixed: boolean;   // if true, freq is absolute Hz. Else it's multiplier of note freq.
    Q: number;
};

export interface InstrumentDefinition {
    id: string;
    name: string;
    description: string;
    layers: OscillatorLayer[];
    envelope: ADSR;
    filter?: FilterConfig;
}

export interface MusicEvent {
    timeMs: number;
    note: number; // Hz or MIDI-like frequency
    durationMs: number;
    instrumentId: string;
    velocity?: number; // 0-1 (defaults to 1)
}

export interface CodedScore {
    name: string;
    events: MusicEvent[];
}
