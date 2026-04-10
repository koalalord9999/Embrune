import { useCallback, useRef, useEffect, useState } from 'react';
import React from 'react';
import { AUDIO_MANIFEST, SOUND_CATEGORIES, SoundCategory, SoundID } from '../constants/audioManifest';
import { createWhiteNoiseBuffer, createBrownNoiseBuffer } from '../utils/audioSynth';
import { InstrumentDefinition } from '../types/music';
import { INSTRUMENTS } from '../constants/instruments';
import { useUIState } from './useUIState';

export interface MusicStatus {
    lastInstrumentName: string;
    lastFreq: string;
    activeNodes: number;
    lastTriggerTime: number;
}

let globalMusicStatus: MusicStatus = {
    lastInstrumentName: 'None',
    lastFreq: '-',
    activeNodes: 0,
    lastTriggerTime: 0
};

const statusListeners = new Set<(status: MusicStatus) => void>();

function updateStatus(updates: Partial<MusicStatus>) {
    globalMusicStatus = { ...globalMusicStatus, ...updates };
    statusListeners.forEach(l => l(globalMusicStatus));
}

export function useMusicStatus() {
    const [, forceUpdate] = React.useState(0);
    React.useEffect(() => {
        const l = () => forceUpdate(n => n + 1);
        statusListeners.add(l);
        return () => { statusListeners.delete(l); };
    }, []);
    return globalMusicStatus;
}

export let globalAudioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let ambientGain: GainNode | null = null;

const activeMusicNodes = new Set<AudioScheduledSourceNode>();

export const useSoundEngine = () => {
    const ui = useUIState();
    const [isAudioActive, setIsAudioActive] = useState(false);
    const contextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const update = () => {
            const active = globalAudioContext?.state === 'running';
            setIsAudioActive(active);
        };

        const interval = setInterval(update, 500);
        
        if (globalAudioContext) {
            globalAudioContext.addEventListener('statechange', update);
        }
        
        update();
        
        return () => {
            clearInterval(interval);
            globalAudioContext?.removeEventListener('statechange', update);
        };
    }, []);

    const initContext = useCallback(() => {
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            masterGain = globalAudioContext.createGain();
            
            musicGain = globalAudioContext.createGain();
            sfxGain = globalAudioContext.createGain();
            ambientGain = globalAudioContext.createGain();

            musicGain.connect(masterGain);
            sfxGain.connect(masterGain);
            ambientGain.connect(masterGain);

            masterGain.connect(globalAudioContext.destination);
        }
        
        if (globalAudioContext.state === 'suspended') {
            globalAudioContext.resume();
        }

        contextRef.current = globalAudioContext;
        
    }, []);

    useEffect(() => {
        if (globalAudioContext && masterGain && musicGain && sfxGain && ambientGain) {
            const finalMasterVol = ui.isMuted ? 0 : Math.pow(ui.masterVolume, 2);
            masterGain.gain.setTargetAtTime(finalMasterVol, globalAudioContext.currentTime, 0.05);

            musicGain.gain.setTargetAtTime(Math.pow(ui.musicVolume, 2), globalAudioContext.currentTime, 0.05);
            sfxGain.gain.setTargetAtTime(Math.pow(ui.sfxVolume, 2), globalAudioContext.currentTime, 0.05);
            ambientGain.gain.setTargetAtTime(Math.pow(ui.ambientVolume, 2), globalAudioContext.currentTime, 0.05);
        }
    }, [ui.isMuted, ui.masterVolume, ui.musicVolume, ui.sfxVolume, ui.ambientVolume]);

    const playRecipe = useCallback((recipe: string, baseStartTime?: number, category: SoundCategory | 'music' = 'sfx') => {
        if (!globalAudioContext || !masterGain) return;

        let recipeString = recipe;
        let timeOffsetMs = 0;
        if (recipe.match(/^\d+:/)) {
            const parts = recipe.split(/:(.+)/);
            timeOffsetMs = parseInt(parts[0], 10);
            recipeString = parts[1];
        }

        const params = recipeString.split('|').reduce((acc, part) => {
            const [key, val] = part.split(':');
            acc[key] = val;
            return acc;
        }, {} as Record<string, any>);

        const now = (baseStartTime ?? globalAudioContext.currentTime) + (timeOffsetMs / 1000);
        const duration = parseFloat(params.dur || 0.1);
        const freq = parseFloat(params.freq || 440);
        const vol = parseFloat(params.vol || 0.5);
        const attack = parseFloat(params.attack || 0.005);
        const decay = parseFloat(params.decay || duration);
        const filterFreq = parseFloat(params.filter || 2000);
        const filterQ = parseFloat(params.q || 1);
        const pitchMod = parseFloat(params.pitchMod || 0);

        if (params.instr) {
            playInstrumentNote(params.instr, freq, duration * 1000, now, vol, category);
            return;
        }

        const nodeGain = globalAudioContext.createGain();
        nodeGain.gain.setValueAtTime(0, now);
        nodeGain.gain.linearRampToValueAtTime(vol, now + attack);
        nodeGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);
        
        let targetGainNode: GainNode | null = null;
        switch(category) {
            case 'sfx': targetGainNode = sfxGain; break;
            case 'ambient': targetGainNode = ambientGain; break;
            case 'music': targetGainNode = musicGain; break;
        }

        if (targetGainNode) {
            nodeGain.connect(targetGainNode);
        } else {
            nodeGain.connect(masterGain); // Fallback
        }

        let sourceNode: AudioScheduledSourceNode;

        if (params.osc) {
            const osc = globalAudioContext.createOscillator();
            osc.type = params.osc as OscillatorType;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchMod !== 0) {
                osc.frequency.exponentialRampToValueAtTime(freq + pitchMod, now + duration);
            }

            const filter = globalAudioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(filterFreq, now);
            filter.Q.setValueAtTime(filterQ, now);

            osc.connect(filter);
            filter.connect(nodeGain);
            sourceNode = osc;
        } else {
            const buffer = params.noise === 'white' 
                ? createWhiteNoiseBuffer(globalAudioContext, duration)
                : createBrownNoiseBuffer(globalAudioContext, duration);
            
            const source = globalAudioContext.createBufferSource();
            source.buffer = buffer;

            const filter = globalAudioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(filterFreq, now);
            filter.Q.setValueAtTime(filterQ, now);

            source.connect(filter);
            filter.connect(nodeGain);
            sourceNode = source;
        }


        if (category === 'music') {
            activeMusicNodes.add(sourceNode);
            sourceNode.onended = () => activeMusicNodes.delete(sourceNode);
        }

        sourceNode.start(now);
        sourceNode.stop(now + duration + 0.1);
    }, []);

    const playInstrumentNote = useCallback((
        instrumentId: string, 
        freq: number, 
        durationMs: number, 
        startTimeInContext?: number, 
        velocity: number = 1.0,
        category: SoundCategory | 'music' = 'music'
    ) => {
        if (!globalAudioContext) return;
        const instrument = INSTRUMENTS[instrumentId];
        if (!instrument) {
            console.error(`Instrument ${instrumentId} not found.`);
            return;
        }

        const now = startTimeInContext || globalAudioContext.currentTime;
        const durationSec = durationMs / 1000;
        const targetGainNode = category === 'music' ? musicGain : (category === 'ambient' ? ambientGain : sfxGain);
        if (!targetGainNode) return;

        // --- ENVELOPE (Gain Node) ---
        // Each note gets its own master gain across all its layers.
        const noteGain = globalAudioContext.createGain();
        const env = instrument.envelope;
        
        // Velocity impacts the overall volume.
        const vol = 0.5 * (velocity || 1.0); 

        // ATTACK
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(vol, now + env.attack);
        // DECAY
        noteGain.gain.linearRampToValueAtTime(vol * env.sustain, now + env.attack + env.decay);
        
        // RELEASE (Schedules for after duration)
        const noteOffTime = now + durationSec;
        // MUST clamp the noteOffTime so it doesn't overlap the attack/decay ramp causing audio clicks
        const safeNoteOffTime = Math.max(noteOffTime, now + env.attack + env.decay);
        
        noteGain.gain.cancelScheduledValues(safeNoteOffTime);
        noteGain.gain.setValueAtTime(vol * env.sustain, safeNoteOffTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, safeNoteOffTime + env.release);

        noteGain.connect(targetGainNode);

        // --- FILTER (Optional) ---
        let lastNode: AudioNode = noteGain;
        if (instrument.filter) {
            const filterNode = globalAudioContext.createBiquadFilter();
            filterNode.type = instrument.filter.type;
            const filterFreq = instrument.filter.isFixed 
                ? instrument.filter.frequency 
                : freq * instrument.filter.frequency;
            filterNode.frequency.setValueAtTime(filterFreq, now);
            filterNode.Q.setValueAtTime(instrument.filter.Q, now);
            
            filterNode.connect(targetGainNode);
            noteGain.disconnect();
            noteGain.connect(filterNode);
        }

        // --- OSCILLATOR LAYERS ---
        const activeInstr = instrument.name;
        const activeNote = freq.toFixed(1);
        updateStatus({
            lastInstrumentName: activeInstr,
            lastFreq: activeNote,
            activeNodes: activeMusicNodes.size + instrument.layers.length,
            lastTriggerTime: Date.now()
        });

        instrument.layers.forEach(layer => {
            const osc = globalAudioContext!.createOscillator();
            osc.type = layer.type;
            osc.frequency.setValueAtTime(freq * layer.multiplier, now);
            osc.detune.setValueAtTime(layer.detune, now);
            
            const layerGain = globalAudioContext!.createGain();
            layerGain.gain.setValueAtTime(layer.volume, now);
            
            osc.connect(layerGain);
            layerGain.connect(noteGain);
            
            if (category === 'music') activeMusicNodes.add(osc);
            
            osc.start(now);
            osc.stop(noteOffTime + env.release + 0.1); 
            
            osc.onended = () => {
                if (category === 'music') activeMusicNodes.delete(osc);
            };
        });

    }, []);

    const getContextTime = useCallback(() => globalAudioContext?.currentTime ?? 0, []);

    const play = useCallback((soundId: SoundID) => {
        const recipeOrRecipes = AUDIO_MANIFEST[soundId];
        if (!recipeOrRecipes) return;
        
        if (!isAudioActive) initContext();
        if (globalAudioContext?.state !== 'running') return;
    
        const category = SOUND_CATEGORIES[soundId];

        if (typeof recipeOrRecipes === 'string') {
            playRecipe(recipeOrRecipes, undefined, category);
        } else if (Array.isArray(recipeOrRecipes)) {
            const baseTime = getContextTime();
            recipeOrRecipes.forEach(recipe => {
                playRecipe(recipe, baseTime, category);
            });
        }
    }, [playRecipe, isAudioActive, initContext, getContextTime]);
    
    const setMusicVolume = useCallback((targetVolume: number, fadeSeconds: number = 0.1) => {
        if (!globalAudioContext || !musicGain) return;
        const now = globalAudioContext.currentTime;
        musicGain.gain.cancelScheduledValues(now);
        musicGain.gain.setValueAtTime(musicGain.gain.value, now);
        // Fade to the target volume relative to the user's setting.
        const finalVolume = targetVolume * Math.pow(ui.musicVolume, 2);
        musicGain.gain.linearRampToValueAtTime(finalVolume, now + fadeSeconds);
    }, [ui.musicVolume]);

    const stopAllMusic = useCallback((fadeSeconds: number = 0.5) => {
        if (!globalAudioContext || !musicGain) return;

        const now = globalAudioContext.currentTime;
        musicGain.gain.cancelScheduledValues(now);
        musicGain.gain.setValueAtTime(musicGain.gain.value, now);
        musicGain.gain.linearRampToValueAtTime(0, now + fadeSeconds);

        activeMusicNodes.forEach(node => {
            try { node.stop(now + fadeSeconds); } catch(e) {}
        });
        activeMusicNodes.clear();
    }, []);

    return { 
        play, 
        playRecipe,
        playInstrumentNote,
        stopAllMusic, 
        setMusicVolume, 
        initContext, 
        isAudioActive,
        getContextTime,
        isContextRunning: () => globalAudioContext?.state === 'running'
    };
};