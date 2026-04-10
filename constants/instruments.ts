
import { InstrumentDefinition } from '../types/music';

export const PIANO_FORTE: InstrumentDefinition = {
    id: 'piano_forte',
    name: 'Grand Piano',
    description: 'A sharp, percussive piano with rich harmonics.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 1.0 },
        { type: 'triangle', multiplier: 2, detune: 4, volume: 0.15 },
        { type: 'sine', multiplier: 3, detune: 0, volume: 0.05 },
    ],
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.8 },
    filter: { type: 'lowpass', frequency: 1800, isFixed: true, Q: 1 },
};

export const LUTE: InstrumentDefinition = {
    id: 'lute',
    name: 'Wooden Lute',
    description: 'A plucked string instrument with a warm, narrow resonance.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: 0, volume: 0.4 },
        { type: 'triangle', multiplier: 1.002, detune: 8, volume: 0.4 },
    ],
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.4 },
    filter: { type: 'lowpass', frequency: 1200, isFixed: true, Q: 2 },
};

export const SPECTRAL_PAD: InstrumentDefinition = {
    id: 'spectral_pad',
    name: 'Spectral Pad',
    description: 'A lush, evolving pad for ethereal atmospheres.',
    layers: [
        { type: 'sine', multiplier: 1, detune: -10, volume: 0.5 },
        { type: 'sine', multiplier: 1, detune: 10, volume: 0.5 },
        { type: 'triangle', multiplier: 1.5, detune: 0, volume: 0.2 },
        { type: 'sine', multiplier: 2, detune: 0, volume: 0.1 },
    ],
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 2.0 },
    filter: { type: 'lowpass', frequency: 3200, isFixed: true, Q: 0.5 },
};

export const CRYSTAL_BELL: InstrumentDefinition = {
    id: 'crystal_bell',
    name: 'Crystal Bell',
    description: 'A high-pitched, metallic chime.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'sine', multiplier: 2.01, detune: 0, volume: 0.3 },
        { type: 'sine', multiplier: 4.02, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.001, decay: 0.05, sustain: 0.001, release: 1.2 },
};

export const SPECTRAL_FLUTE: InstrumentDefinition = {
    id: 'spectral_flute',
    name: 'Spectral Flute',
    description: 'A breathy, wooden flute sound for emotive leads.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'triangle', multiplier: 1, detune: 10, volume: 0.2 },
    ],
    envelope: { attack: 0.08, decay: 0.2, sustain: 0.6, release: 0.5 },
    filter: { type: 'lowpass', frequency: 1, isFixed: false, Q: 3 }, // Resonant lowpass at note freq
};

export const ORCHESTRAL_STRINGS_LEGATO: InstrumentDefinition = {
    id: 'strings_legato',
    name: 'Symphonic Strings (Legato)',
    description: 'A lush, slow-attacking string section for emotional swells.',
    layers: [
        { type: 'triangle', multiplier: 1,    detune: -8, volume: 0.4 },
        { type: 'triangle', multiplier: 1,    detune: 8,  volume: 0.4 },
        { type: 'sine',     multiplier: 1.01, detune: 0,  volume: 0.3 },
    ],
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.8, release: 0.45 },
    filter: { type: 'lowpass', frequency: 1200, isFixed: true, Q: 0.7 },
};

export const ORCHESTRAL_STRINGS_STACCATO: InstrumentDefinition = {
    id: 'strings_staccato',
    name: 'Symphonic Strings (Staccato)',
    description: 'A sharp, rhythmic string section.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'triangle', multiplier: 2, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.01, release: 0.15 },
    filter: { type: 'lowpass', frequency: 2200, isFixed: true, Q: 1.2 },
};

export const EPIC_BRASS_STACCATO: InstrumentDefinition = {
    id: 'brass_staccato',
    name: 'Epic Brass (Staccato)',
    description: 'A sharp, very short brass punch.',
    layers: [
        { type: 'sawtooth', multiplier: 1,    detune: -2, volume: 0.4 },
        { type: 'square',   multiplier: 1.002, detune: 2,  volume: 0.3 },
    ],
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.1, release: 0.05 },
    filter: { type: 'lowpass', frequency: 1.2, isFixed: false, Q: 2.0 },
};

export const EPIC_BRASS: InstrumentDefinition = {
    id: 'epic_brass',
    name: 'Epic Brass Horn',
    description: 'A powerful, resonant brass sound for triumphant melodies.',
    layers: [
        { type: 'sawtooth', multiplier: 1,    detune: -5, volume: 0.4 },
        { type: 'sawtooth', multiplier: 1.01, detune: 5,  volume: 0.4 },
        { type: 'square',   multiplier: 1.002, detune: 0,  volume: 0.2 },
    ],
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.4 },
    filter: { type: 'lowpass', frequency: 1.4, isFixed: false, Q: 2.5 }, // Resonant multiplier
};

export const CONCERT_HARP: InstrumentDefinition = {
    id: 'concert_harp',
    name: 'Concert Harp',
    description: 'A delicate and clear plucked instrument.',
    layers: [
        { type: 'sine',     multiplier: 1,    detune: 0, volume: 0.7 },
        { type: 'triangle', multiplier: 3,    detune: 0, volume: 0.1 },
        { type: 'sine',     multiplier: 0.5,  detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.002, decay: 0.2, sustain: 0.05, release: 0.35 },
};

export const TIMPANI_DRUM: InstrumentDefinition = {
    id: 'timpani',
    name: 'Orchestral Timpani',
    description: 'A deep, resonant percussive roll and thud.',
    layers: [
        { type: 'sine', multiplier: 0.5, detune: 0, volume: 0.8 },
        { type: 'sine', multiplier: 1,   detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.02, decay: 0.15, sustain: 0.01, release: 0.8 },
    filter: { type: 'lowpass', frequency: 250, isFixed: true, Q: 1.5 },
};

export const CELESTA: InstrumentDefinition = {
    id: 'celesta',
    name: 'Celesta',
    description: 'A soft, tinkling bell-like keyboard instrument.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.8 },
        { type: 'sine', multiplier: 2, detune: 5, volume: 0.2 },
    ],
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.6 },
};

export const MUSIC_BOX: InstrumentDefinition = {
    id: 'music_box',
    name: 'Vintage Music Box',
    description: 'A tiny, fragile metallic plucking sound.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'triangle', multiplier: 2.5, detune: 0, volume: 0.3 },
        { type: 'sine', multiplier: 4, detune: 0, volume: 0.1 },
    ],
    envelope: { attack: 0.001, decay: 0.05, sustain: 0.05, release: 0.4 },
};

export const OCARINA: InstrumentDefinition = {
    id: 'ocarina',
    name: 'Clay Ocarina',
    description: 'A pure, breathy, and hollow whistle note.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.8 },
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2 },
    filter: { type: 'lowpass', frequency: 1500, isFixed: true, Q: 0.5 },
};

export const FRENCH_HORN: InstrumentDefinition = {
    id: 'french_horn',
    name: 'French Horn',
    description: 'A mellow, warm, and broad brass instrument.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: -2, volume: 0.4 },
        { type: 'square', multiplier: 1, detune: 2, volume: 0.4 },
        { type: 'sine', multiplier: 2, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.4 },
    filter: { type: 'lowpass', frequency: 800, isFixed: true, Q: 1.2 },
};

export const CHOIR_AAHS: InstrumentDefinition = {
    id: 'choir_aahs',
    name: 'Choir (Aahs)',
    description: 'An ethereal, vocal-like evolving pad.',
    layers: [
        { type: 'triangle', multiplier: 1, detune: -6, volume: 0.4 },
        { type: 'triangle', multiplier: 1, detune: 6, volume: 0.4 },
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.5, decay: 0.5, sustain: 0.8, release: 1.5 },
    filter: { type: 'lowpass', frequency: 1200, isFixed: true, Q: 3.0 },
};

export const SYNTH_LEAD: InstrumentDefinition = {
    id: 'synth_lead',
    name: 'Retro Synth Lead',
    description: 'A biting, vibrant saw-wave lead for artificial themes.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: -4, volume: 0.5 },
        { type: 'sawtooth', multiplier: 1, detune: 4, volume: 0.5 },
    ],
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.2 },
    filter: { type: 'lowpass', frequency: 4000, isFixed: true, Q: 1.5 },
};

export const FRETLESS_BASS_STACCATO: InstrumentDefinition = {
    id: 'bass_staccato',
    name: 'Fretless Bass (Staccato)',
    description: 'A very dry, tight bass pluck.',
    layers: [
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.8 },
        { type: 'sine', multiplier: 0.5, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.05 },
    filter: { type: 'lowpass', frequency: 300, isFixed: true, Q: 1.2 },
};

export const FRETLESS_BASS: InstrumentDefinition = {
    id: 'fretless_bass',
    name: 'Fretless Bass',
    description: 'A deep, smooth, and slightly plucky bass.',
    layers: [
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.7 },
        { type: 'sine', multiplier: 0.5, detune: 0, volume: 0.3 },
    ],
    envelope: { attack: 0.02, decay: 0.4, sustain: 0.2, release: 0.3 },
    filter: { type: 'lowpass', frequency: 400, isFixed: true, Q: 1.0 },
};

export const MARIMBA_STACCATO: InstrumentDefinition = {
    id: 'marimba_staccato',
    name: 'Marimba (Staccato)',
    description: 'A very short, percussive marimba hit.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.4 },
    ],
    envelope: { attack: 0.001, decay: 0.05, sustain: 0.01, release: 0.05 },
    filter: { type: 'lowpass', frequency: 2000, isFixed: true, Q: 0.5 },
};

export const MARIMBA: InstrumentDefinition = {
    id: 'marimba',
    name: 'Wooden Marimba',
    description: 'A hollow, wooden mallet percussion instrument.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.6 },
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.4 },
    ],
    envelope: { attack: 0.005, decay: 0.25, sustain: 0.01, release: 0.3 },
    filter: { type: 'lowpass', frequency: 2000, isFixed: true, Q: 0.5 },
};

export const HARPSICHORD: InstrumentDefinition = {
    id: 'harpsichord',
    name: 'Harpsichord',
    description: 'A bright, nasal, plucked keyboard instrument.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: 0, volume: 0.4 },
        { type: 'square', multiplier: 1, detune: 0, volume: 0.4 },
        { type: 'triangle', multiplier: 2, detune: 0, volume: 0.2 },
    ],
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.2, release: 0.2 },
    filter: { type: 'lowpass', frequency: 3500, isFixed: true, Q: 1 },
};

export const TUBULAR_BELLS: InstrumentDefinition = {
    id: 'tubular_bells',
    name: 'Tubular Bells',
    description: 'Deep, heavy, resonant church bells.',
    layers: [
        { type: 'sine', multiplier: 1, detune: 0, volume: 0.5 },
        { type: 'sine', multiplier: 1.5, detune: 2, volume: 0.3 },
        { type: 'triangle', multiplier: 2.2, detune: -2, volume: 0.2 },
    ],
    envelope: { attack: 0.02, decay: 1.0, sustain: 0.05, release: 2.0 },
};

export const SITAR: InstrumentDefinition = {
    id: 'sitar',
    name: 'Sitar',
    description: 'A twangy, nasal plucked string with buzzy sympathetic resonance.',
    layers: [
        { type: 'sawtooth', multiplier: 1, detune: 0, volume: 0.5 },
        { type: 'sine', multiplier: 2.02, detune: 15, volume: 0.3 },
        { type: 'triangle', multiplier: 3, detune: -8, volume: 0.15 },
    ],
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 },
    filter: { type: 'bandpass', frequency: 2, isFixed: false, Q: 4 },
};

export const TABLA: InstrumentDefinition = {
    id: 'tabla',
    name: 'Tabla',
    description: 'A deep, punchy Indian hand drum with tonal resonance.',
    layers: [
        { type: 'sine', multiplier: 0.5, detune: 0, volume: 0.7 },
        { type: 'triangle', multiplier: 1, detune: 0, volume: 0.3 },
    ],
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.01, release: 0.25 },
    filter: { type: 'lowpass', frequency: 350, isFixed: true, Q: 2.0 },
};

export const TANPURA: InstrumentDefinition = {
    id: 'tanpura',
    name: 'Tanpura',
    description: 'A hypnotic, ever-present drone that underpins Indian classical music.',
    layers: [
        { type: 'sine', multiplier: 1, detune: -6, volume: 0.4 },
        { type: 'sine', multiplier: 1, detune: 6, volume: 0.4 },
        { type: 'sine', multiplier: 2, detune: 0, volume: 0.15 },
    ],
    envelope: { attack: 1.0, decay: 0.5, sustain: 0.8, release: 2.0 },
    filter: { type: 'lowpass', frequency: 800, isFixed: true, Q: 0.7 },
};

export const INSTRUMENTS: Record<string, InstrumentDefinition> = {
    piano_forte: PIANO_FORTE,
    lute: LUTE,
    spectral_pad: SPECTRAL_PAD,
    crystal_bell: CRYSTAL_BELL,
    spectral_flute: SPECTRAL_FLUTE,
    strings_legato: ORCHESTRAL_STRINGS_LEGATO,
    strings_staccato: ORCHESTRAL_STRINGS_STACCATO,
    epic_brass: EPIC_BRASS,
    concert_harp: CONCERT_HARP,
    timpani: TIMPANI_DRUM,
    celesta: CELESTA,
    music_box: MUSIC_BOX,
    ocarina: OCARINA,
    french_horn: FRENCH_HORN,
    choir_aahs: CHOIR_AAHS,
    synth_lead: SYNTH_LEAD,
    bass_staccato: FRETLESS_BASS_STACCATO,
    brass_staccato: EPIC_BRASS_STACCATO,
    marimba_staccato: MARIMBA_STACCATO,
    fretless_bass: FRETLESS_BASS,
    marimba: MARIMBA,
    harpsichord: HARPSICHORD,
    tubular_bells: TUBULAR_BELLS,
    sitar: SITAR,
    tabla: TABLA,
    tanpura: TANPURA,
};
