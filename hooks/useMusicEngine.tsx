
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useSoundEngine } from './useSoundEngine';
import { WorldState } from '../types';
import {  REGIONS  } from '../constants';
import * as TRACKS from '../components/music/index';
import { useUIState } from './useUIState';

export type MusicStyle = 'grand' | 'pastoral' | 'mystic' | 'industrial' | 'desolate' | 'eerie' | 'volcanic' | 'tutorial' | 'heroic';
export type MusicMode = 'play' | 'stop' | 'pause' | 'loop' | 'random';

export interface MusicTrackMetadata {
    id: string;
    name: string;
    style: MusicStyle;
    regionId?: string;
    poiId?: string;
    trackNum?: number;
}

interface MusicEvent {
    time: number; // ms offset
    recipe: string;
}

// --- MODULE SCOPE GLOBALS (Singleton Management) ---
let globalSessionId = 0;
let globalSchedulerTimer: number | null = null;
let globalPreStartTimeout: number | null = null;
let globalActiveTrackId: string | null = null;
let globalMusicMode: MusicMode = 'play'; // Default to 'play'
let globalSelectedTrackId: string | null = null;
let globalLastValidRegionId: string | undefined = undefined;
let globalPlaybackNonce = 0; // Incremented to force effect re-runs

// Subscriber pattern so all hook instances share state
type MusicStateListener = () => void;
const listeners: Set<MusicStateListener> = new Set();
function notifyListeners() {
    listeners.forEach(fn => fn());
}

export function resetMusicEngine() {
    globalSessionId++; // Invalidate pending timeouts
    if (globalSchedulerTimer) clearInterval(globalSchedulerTimer);
    if (globalPreStartTimeout) clearTimeout(globalPreStartTimeout);
    globalSchedulerTimer = null;
    globalPreStartTimeout = null;
    globalActiveTrackId = null;
    globalSelectedTrackId = null;
    globalLastValidRegionId = undefined;
    globalMusicMode = 'play';
    globalPlaybackNonce = 0;
    notifyListeners();
}
// ---------------------------------------------------

export const MUSIC_TRACKS: MusicTrackMetadata[] = [
    { id: 'login', name: 'Embrune Theme', style: 'heroic' as MusicStyle, trackNum: 1 },
    // Specialized POI/Discovery Tracks FIRST
    // --- Meadowdale Suite ---
    { id: 'meadowdale_breeze', name: 'Meadowdale Breeze', style: 'pastoral' as MusicStyle, regionId: 'meadowdale', trackNum: 2 },
    { id: 'rusty_flagon', name: 'The Rusty Flagon', style: 'pastoral' as MusicStyle, poiId: 'the_rusty_flagon', trackNum: 3 },
    { id: 'hallowed_ground', name: 'Hallowed Ground', style: 'mystic' as MusicStyle, poiId: 'meadowdale_chapel', trackNum: 4 },
    { id: 'market_day', name: 'Market Day', style: 'pastoral' as MusicStyle, poiId: 'meadowdale_square', trackNum: 5 },
    // --- Oakhaven Suite ---
    { id: 'sawdust_and_ambition', name: 'Sawdust & Ambition', style: 'industrial' as MusicStyle, regionId: 'oakhaven', trackNum: 6 },
    { id: 'the_last_round', name: 'The Last Round', style: 'industrial' as MusicStyle, poiId: 'the_carved_mug', trackNum: 7 },
    { id: 'oakhaven_market', name: 'Oakhaven Market', style: 'industrial' as MusicStyle, poiId: 'oakhaven_market', trackNum: 8 },
    // --- Silverhaven Suite ---
    { id: 'silver_crown', name: 'Silver Crown', style: 'grand' as MusicStyle, regionId: 'silverhaven', trackNum: 9 },
    { id: 'velvet_and_venom', name: 'Velvet & Venom', style: 'grand' as MusicStyle, poiId: 'the_gilded_goblet', trackNum: 10 },
    { id: 'salt_and_sirens', name: 'Salt & Sirens', style: 'grand' as MusicStyle, poiId: 'silverhaven_docks', trackNum: 11 },
    { id: 'hymn_of_the_spire', name: 'Hymn of the Spire', style: 'mystic' as MusicStyle, poiId: 'silverhaven_temple', trackNum: 12 },
    { id: 'dragons_shadow', name: "The Dragon's Shadow", style: 'grand' as MusicStyle, poiId: 'silverhaven_castle_grounds', trackNum: 13 },
    { id: 'hammer_and_thread', name: 'Hammer & Thread', style: 'industrial' as MusicStyle, poiId: 'silverhaven_artisans_quarter', trackNum: 14 },
    // --- Sanctity Suite ---
    { id: 'grace_everlasting', name: 'Grace Everlasting', style: 'pastoral' as MusicStyle, regionId: 'sanctity', trackNum: 15 },
    { id: 'still_waters', name: 'Still Waters', style: 'pastoral' as MusicStyle, poiId: 'sanctity_inn', trackNum: 16 },
    { id: 'ashes_and_absolution', name: 'Ashes & Absolution', style: 'mystic' as MusicStyle, poiId: 'sanctity_chapel', trackNum: 17 },
    // --- Fouthia Suite ---
    { id: 'dust_and_devotion', name: 'Dust & Devotion', style: 'desolate' as MusicStyle, regionId: 'fouthia', trackNum: 18 },
    { id: 'scorpions_den', name: "Scorpion's Den", style: 'desolate' as MusicStyle, poiId: 'the_sand_serpent_inn', trackNum: 19 },
    { id: 'silk_and_cinder', name: 'Silk & Cinder', style: 'desolate' as MusicStyle, poiId: 'fouthia_bazaar', trackNum: 20 },
    { id: 'whispers_in_the_sand', name: 'Whispers in the Sand', style: 'mystic' as MusicStyle, poiId: 'fouthia_shrine', trackNum: 21 },
    // --- Slayers Respite Suite ---
    // Duskwatch
    { id: 'duskwatch_plaza', name: "The Guildmaster's Pride", style: 'grand' as MusicStyle, poiId: 'duskwatch_plaza', trackNum: 23 },
    { id: 'duskwatch_inn', name: 'The Salty Spirit', style: 'pastoral' as MusicStyle, poiId: 'duskwatch_tavern', trackNum: 24 },
    { id: 'duskwatch_market', name: 'Coin & Scoria', style: 'industrial' as MusicStyle, poiId: 'duskwatch_market', trackNum: 25 },
    { id: 'duskwatch_gates', name: 'Iron Vigil', style: 'heroic' as MusicStyle, poiId: 'duskwatch_north_gate', trackNum: 26 },
    // Thornveil
    { id: 'thornveil_gen', name: 'Emerald Canopy', style: 'pastoral' as MusicStyle, regionId: 'the_thornveil', trackNum: 27 },
    { id: 'thornveil_mystic', name: 'Dancers of the Leaf', style: 'mystic' as MusicStyle, poiId: 'thornveil_ne_canopy_walk', trackNum: 28 },
    { id: 'thornveil_deep', name: 'Strangle-Root', style: 'mystic' as MusicStyle, poiId: 'thornveil_nw_inner_thicket', trackNum: 29 },
    // Scorched Hollow
    { id: 'scorched_gen', name: 'Ash and Ember', style: 'volcanic' as MusicStyle, regionId: 'the_scorched_hollow', trackNum: 30 },
    { id: 'scorched_secondary', name: 'Obsidian Heart', style: 'volcanic' as MusicStyle, poiId: 'scorched_obsidian_peak', trackNum: 31 },
    { id: 'scorched_deep', name: 'Forge of the Sun', style: 'volcanic' as MusicStyle, poiId: 'scorched_magma_cathedral', trackNum: 32 },
    // Bonemarsh
    { id: 'bonemarsh_gen', name: 'Mist of the Fallen', style: 'desolate' as MusicStyle, regionId: 'the_bonemarsh', trackNum: 33 },
    { id: 'bonemarsh_mystic', name: "Kaelen's Vigil", style: 'mystic' as MusicStyle, poiId: 'bonemarsh_mire_watcher_hut', trackNum: 34 },
    { id: 'bonemarsh_deep', name: 'The Sinking Heart', style: 'desolate' as MusicStyle, poiId: 'bonemarsh_mire_core', trackNum: 35 },
    // Shattered Coast
    { id: 'coast_gen', name: 'Brine & Bone', style: 'pastoral' as MusicStyle, regionId: 'the_shattered_coast', trackNum: 36 },
    { id: 'coast_grand', name: "Eyrie's Call", style: 'grand' as MusicStyle, poiId: 'shattered_cliff_eyrie', trackNum: 37 },
    { id: 'coast_mystic', name: 'Lustre of the Deep', style: 'mystic' as MusicStyle, poiId: 'shattered_drowned_lake', trackNum: 38 },
    // Frostspine
    { id: 'frostspine_gen', name: 'Glacial Breath', style: 'desolate' as MusicStyle, regionId: 'respite_frostspine_ridge', trackNum: 39 },
    { id: 'frostspine_pastoral', name: 'Echoes of the Peak', style: 'pastoral' as MusicStyle, poiId: 'frostspine_ridge_base_camp', trackNum: 40 },
    { id: 'frostspine_grand', name: "Dragon's Skeleton", style: 'grand' as MusicStyle, poiId: 'frostspine_ancient_peak', trackNum: 41 },
    // Abyssal Expanse
    { id: 'abyssal_gen', name: 'Violet Haze', style: 'eerie' as MusicStyle, regionId: 'the_abyssal_expanse', trackNum: 42 },
    { id: 'abyssal_mystic', name: 'Lost Research', style: 'mystic' as MusicStyle, poiId: 'abyssal_n2', trackNum: 43 },
    { id: 'abyssal_eerie', name: 'Event Horizon', style: 'eerie' as MusicStyle, poiId: 'abyssal_n5', trackNum: 44 },
    // Dungeons
    { id: 'barrow_entry', name: 'Crypt Whispers', style: 'eerie' as MusicStyle, poiId: 'hollowed_barrow_entrance', trackNum: 45 },
    { id: 'barrow_inner', name: 'Ancient Sarcophagus', style: 'eerie' as MusicStyle, poiId: 'hollowed_barrow_heart', trackNum: 46 },
    { id: 'forge_entry', name: 'Hiss of the Deeps', style: 'industrial' as MusicStyle, poiId: 'cinderforge_entrance', trackNum: 47 },
    { id: 'forge_inner', name: "Master's Hammer", style: 'industrial' as MusicStyle, poiId: 'cinderforge_heart', trackNum: 48 },
    { id: 'rift_entry', name: 'Shattered Reality', style: 'eerie' as MusicStyle, poiId: 'abyssal_rift_entrance', trackNum: 49 },
    { id: 'rift_inner', name: 'The Unmaking', style: 'mystic' as MusicStyle, poiId: 'abyssal_rift_heart_of_unmaking', trackNum: 50 },
    // --- Other ---
    { id: 'generated_track_1', name: 'Whispers from the Void', style: 'eerie' as MusicStyle, trackNum: 22 },
    // Generic Region Defaults LAST
    ...(Object.values(REGIONS).map((r): MusicTrackMetadata => {
        if (['meadowdale', 'oakhaven', 'silverhaven', 'sanctity', 'fouthia', 'the_thornveil', 'the_scorched_hollow', 'the_bonemarsh', 'the_shattered_coast', 'respite_frostspine_ridge', 'the_abyssal_expanse', 'hollowed_barrow', 'cinderforge_depths', 'abyssal_rift'].includes(r.id)) return null as any; // Skip regions with dedicated suites
        let style: MusicStyle = 'desolate';
        if (['meadowdale', 'the_verdant_fields', 'sunbright_plains'].includes(r.id)) style = 'pastoral';
        else if (['oakhaven', 'dwarven_outpost', 'sanctity'].includes(r.id)) style = 'industrial';
        else if (['silverhaven'].includes(r.id)) style = 'grand';
        else if (['feywood', 'crystalline_isles', 'magus_spire'].includes(r.id)) style = 'mystic';
        else if (['volcanic_steam_vents', 'the_serpents_coil'].includes(r.id)) style = 'volcanic';
        else if (r.id.includes('dungeon') || r.id.includes('chasm') || r.id.includes('warrens') || r.id.includes('barrow')) style = 'eerie';
        else if (r.id === 'path_of_beginnings') style = 'tutorial';

        return { id: r.id, name: r.name, style, regionId: r.id, trackNum: r.trackNum };
    }) as (MusicTrackMetadata | null)[]).filter((r): r is MusicTrackMetadata => r !== null)
].sort((a, b) => a.name.localeCompare(b.name));

const generateScore = (track: MusicTrackMetadata): string => {
    // FIX: Property 'GENERATED_SCORE' does not exist on type 'typeof import("file:///components/music/index")'.
    if (track.id === 'generated_track_1') {
        return (TRACKS as any).GENERATED_SCORE;
    }
    // --- Meadowdale Suite ---
    if (track.id === 'meadowdale_breeze') return (TRACKS as any).MEADOWDALE_BREEZE_SCORE;
    if (track.id === 'rusty_flagon') return (TRACKS as any).RUSTY_FLAGON_SCORE;
    if (track.id === 'hallowed_ground') return (TRACKS as any).HALLOWED_GROUND_SCORE;
    if (track.id === 'market_day') return (TRACKS as any).MARKET_DAY_SCORE;
    // --- Oakhaven Suite ---
    if (track.id === 'sawdust_and_ambition') return (TRACKS as any).SAWDUST_AND_AMBITION_SCORE;
    if (track.id === 'the_last_round') return (TRACKS as any).THE_LAST_ROUND_SCORE;
    if (track.id === 'oakhaven_market') return (TRACKS as any).OAKHAVEN_MARKET_SCORE;
    // --- Silverhaven Suite ---
    if (track.id === 'silver_crown') return (TRACKS as any).SILVER_CROWN_SCORE;
    if (track.id === 'velvet_and_venom') return (TRACKS as any).VELVET_AND_VENOM_SCORE;
    if (track.id === 'salt_and_sirens') return (TRACKS as any).SALT_AND_SIRENS_SCORE;
    if (track.id === 'hymn_of_the_spire') return (TRACKS as any).HYMN_OF_THE_SPIRE_SCORE;
    if (track.id === 'dragons_shadow') return (TRACKS as any).DRAGONS_SHADOW_SCORE;
    if (track.id === 'hammer_and_thread') return (TRACKS as any).HAMMER_AND_THREAD_SCORE;
    // --- Sanctity Suite ---
    if (track.id === 'grace_everlasting') return (TRACKS as any).GRACE_EVERLASTING_SCORE;
    if (track.id === 'still_waters') return (TRACKS as any).STILL_WATERS_SCORE;
    if (track.id === 'ashes_and_absolution') return (TRACKS as any).ASHES_AND_ABSOLUTION_SCORE;
    // --- Fouthia Suite ---
    if (track.id === 'dust_and_devotion') return (TRACKS as any).DUST_AND_DEVOTION_SCORE;
    if (track.id === 'scorpions_den') return (TRACKS as any).SCORPIONS_DEN_SCORE;
    if (track.id === 'silk_and_cinder') return (TRACKS as any).SILK_AND_CINDER_SCORE;
    if (track.id === 'whispers_in_the_sand') return (TRACKS as any).WHISPERS_IN_THE_SAND_SCORE;
    // --- Slayers Respite Suite ---
    if (track.id === 'duskwatch_plaza') return (TRACKS as any).DUSKWATCH_PLAZA_SCORE;
    if (track.id === 'duskwatch_inn') return (TRACKS as any).DUSKWATCH_INN_SCORE;
    if (track.id === 'duskwatch_market') return (TRACKS as any).DUSKWATCH_MARKET_SCORE;
    if (track.id === 'duskwatch_gates') return (TRACKS as any).DUSKWATCH_GATES_SCORE;
    if (track.id === 'thornveil_gen') return (TRACKS as any).THORNVEIL_GEN_SCORE;
    if (track.id === 'thornveil_mystic') return (TRACKS as any).THORNVEIL_MYSTIC_SCORE;
    if (track.id === 'thornveil_deep') return (TRACKS as any).THORNVEIL_DEEP_SCORE;
    if (track.id === 'scorched_gen') return (TRACKS as any).SCORCHED_GEN_SCORE;
    if (track.id === 'scorched_secondary') return (TRACKS as any).SCORCHED_SECONDARY_SCORE;
    if (track.id === 'scorched_deep') return (TRACKS as any).SCORCHED_DEEP_SCORE;
    if (track.id === 'bonemarsh_gen') return (TRACKS as any).BONEMARSH_GEN_SCORE;
    if (track.id === 'bonemarsh_mystic') return (TRACKS as any).BONEMARSH_MYSTIC_SCORE;
    if (track.id === 'bonemarsh_deep') return (TRACKS as any).BONEMARSH_DEEP_SCORE;
    if (track.id === 'coast_gen') return (TRACKS as any).COAST_GEN_SCORE;
    if (track.id === 'coast_grand') return (TRACKS as any).COAST_GRAND_SCORE;
    if (track.id === 'coast_mystic') return (TRACKS as any).COAST_MYSTIC_SCORE;
    if (track.id === 'frostspine_gen') return (TRACKS as any).FROSTSPINE_GEN_SCORE;
    if (track.id === 'frostspine_pastoral') return (TRACKS as any).FROSTSPINE_PASTORAL_SCORE;
    if (track.id === 'frostspine_grand') return (TRACKS as any).FROSTSPINE_GRAND_SCORE;
    if (track.id === 'abyssal_gen') return (TRACKS as any).ABYSSAL_GEN_SCORE;
    if (track.id === 'abyssal_mystic') return (TRACKS as any).ABYSSAL_MYSTIC_SCORE;
    if (track.id === 'abyssal_eerie') return (TRACKS as any).ABYSSAL_EERIE_SCORE;
    if (track.id === 'barrow_entry') return (TRACKS as any).BARROW_ENTRY_SCORE;
    if (track.id === 'barrow_inner') return (TRACKS as any).BARROW_INNER_SCORE;
    if (track.id === 'forge_entry') return (TRACKS as any).FORGE_ENTRY_SCORE;
    if (track.id === 'forge_inner') return (TRACKS as any).FORGE_INNER_SCORE;
    if (track.id === 'rift_entry') return (TRACKS as any).RIFT_ENTRY_SCORE;
    if (track.id === 'rift_inner') return (TRACKS as any).RIFT_INNER_SCORE;
    switch (track.style) {
        // FIX: Property 'TUTORIAL_SCORE' does not exist on type 'typeof import("file:///components/music/index")'.
        case 'tutorial': return (TRACKS as any).TUTORIAL_SCORE;
        case 'heroic': return TRACKS.HEROIC_SCORE;
        case 'grand': return TRACKS.getGrandScore(track);
        case 'pastoral': return TRACKS.getPastoralScore(track);
        case 'mystic': return TRACKS.getMysticScore(track);
        case 'industrial': return TRACKS.getIndustrialScore(track);
        case 'desolate': return TRACKS.getDesolateScore(track);
        case 'eerie': return TRACKS.getEerieScore(track);
        case 'volcanic': return TRACKS.getVolcanicScore(track);
        default: return TRACKS.getDesolateScore(track);
    }
};

const STATIC_MUSIC_LIBRARY: Record<string, string> = {};
MUSIC_TRACKS.forEach(track => {
    STATIC_MUSIC_LIBRARY[track.id] = generateScore(track);
});

export const useMusicEngine = (
    regionId?: string, 
    poiId?: string,
    worldState?: WorldState,
    setWorldState?: React.Dispatch<React.SetStateAction<WorldState>>
) => {
    const ui = useUIState();
    const { playRecipe, stopAllMusic, setMusicVolume, getContextTime, initContext, isAudioActive } = useSoundEngine();
    
    // Shared state via module globals + subscriber re-render
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const listener = () => forceUpdate(n => n + 1);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    const musicMode = globalMusicMode;
    const selectedTrackId = globalSelectedTrackId;

    const setSelectedTrackId = useCallback((id: string | null) => {
        globalSelectedTrackId = id;
        notifyListeners();
    }, []);

    const setMusicModeState = useCallback((mode: MusicMode) => {
        globalMusicMode = mode;
        notifyListeners();
    }, []);

    // Instance-local tracking
    const playbackEventsRef = useRef<MusicEvent[]>([]);
    const nextEventIndexRef = useRef<number>(0);
    const playbackStartTimeRef = useRef<number>(0);
    const pausedProgressRef = useRef<number>(0); // ms offset into the song when paused

    const parseScore = (score: string): MusicEvent[] => {
        return score.split('\n')
            .map(line => {
                const [offset, recipe] = line.split(/:(.+)/);
                return { time: parseInt(offset), recipe };
            })
            .filter(e => !isNaN(e.time) && e.recipe);
    };

    const stopScheduler = useCallback(() => {
        globalSessionId++; // Invalidate ALL pending intervals globally
        
        if (globalSchedulerTimer) {
            clearInterval(globalSchedulerTimer);
            globalSchedulerTimer = null;
        }
        if (globalPreStartTimeout) {
            clearTimeout(globalPreStartTimeout);
            globalPreStartTimeout = null;
        }
    }, []);

    const playMusicSegmentInternal = useCallback((score: string, trackId: string, startOffsetMs: number = 0, instant: boolean = false) => {
        if (!isAudioActive) return;

        initContext();
        stopScheduler();

        const currentSessionId = globalSessionId;
        
        const events = parseScore(score);
        playbackEventsRef.current = events;
        globalActiveTrackId = trackId;
        notifyListeners();

        const fadeOutTime = instant ? 0 : 0.5;
        stopAllMusic(fadeOutTime);

        let startIdx = 0;
        if (startOffsetMs > 0) {
            startIdx = events.findIndex(e => e.time >= startOffsetMs);
            if (startIdx === -1) startIdx = 0;
        }
        nextEventIndexRef.current = startIdx;

        globalPreStartTimeout = window.setTimeout(() => {
            if (currentSessionId !== globalSessionId) return;

            playbackStartTimeRef.current = getContextTime() + 0.1 - (startOffsetMs / 1000);
            if (instant) {
                setMusicVolume(1, 0); 
            } else {
                setMusicVolume(0, 0);
                setMusicVolume(1, 1.0);
            }

            globalSchedulerTimer = window.setInterval(() => {
                if (currentSessionId !== globalSessionId) {
                    if (globalSchedulerTimer) {
                        clearInterval(globalSchedulerTimer);
                        globalSchedulerTimer = null;
                    }
                    return;
                }

                const nowMs = (getContextTime() - playbackStartTimeRef.current) * 1000;
                const lookAheadMs = 4000; 
                const targetTimeMs = nowMs + lookAheadMs;

                const activeEvents = playbackEventsRef.current;
                const totalDurationMs = activeEvents.length > 0 ? activeEvents[activeEvents.length - 1].time + 100 : 0;

                while (activeEvents.length > 0) {
                    const nowMsNormalized = (getContextTime() - playbackStartTimeRef.current) * 1000;
                    const targetTimeMs = nowMsNormalized + lookAheadMs;

                    if (nextEventIndexRef.current < activeEvents.length && activeEvents[nextEventIndexRef.current].time < targetTimeMs) {
                        const event = activeEvents[nextEventIndexRef.current];
                        const scheduleTime = playbackStartTimeRef.current + (event.time / 1000);
                        
                        if (scheduleTime > getContextTime()) {
                            playRecipe(event.recipe, scheduleTime, 'music');
                        }
                        nextEventIndexRef.current++;
                    } else if (nextEventIndexRef.current >= activeEvents.length && globalMusicMode === 'loop' && totalDurationMs > 0) {
                        // Loop around: increment the start time by the total duration and reset index
                        playbackStartTimeRef.current += (totalDurationMs / 1000);
                        nextEventIndexRef.current = 0;
                    } else {
                        // No more events in the lookahead window
                        break;
                    }
                }

                if (nextEventIndexRef.current >= activeEvents.length && globalMusicMode !== 'loop') {
                    if (globalMusicMode === 'random') {
                        stopScheduler();
                        globalActiveTrackId = null; 
                        const unlockedTracks = worldState?.unlockedMusicTracks || [];
                        const playable = MUSIC_TRACKS.filter(t => unlockedTracks.includes(t.id));
                        if (playable.length > 0) {
                            const others = playable.filter(t => t.id !== globalSelectedTrackId);
                            const next = others.length > 0
                                ? others[Math.floor(Math.random() * others.length)]
                                : playable[Math.floor(Math.random() * playable.length)];
                            setSelectedTrackId(next.id);
                        }
                    } else {
                        // Just stop or stay at end
                    }
                }
            }, 800); 

        }, (fadeOutTime * 1000) + 20);
    }, [getContextTime, initContext, playRecipe, stopAllMusic, setMusicVolume, isAudioActive, stopScheduler, worldState?.unlockedMusicTracks, setSelectedTrackId]);

    const setMusicMode = useCallback((mode: MusicMode) => {
        // Reroll random if already in random
        if (mode === 'random' && globalMusicMode === 'random') {
            const unlocked = worldState?.unlockedMusicTracks || [];
            const playable = MUSIC_TRACKS.filter(t => unlocked.includes(t.id));
            if (playable.length > 0) {
                const others = playable.filter(t => t.id !== globalSelectedTrackId);
                const next = others.length > 0
                    ? others[Math.floor(Math.random() * others.length)]
                    : playable[Math.floor(Math.random() * playable.length)];
                setSelectedTrackId(next.id);
                notifyListeners();
            }
            return;
        }

        if (mode === globalMusicMode) return;

        globalMusicMode = mode;
        setMusicModeState(mode);

        if (mode === 'stop') {
            globalActiveTrackId = null;
            globalSelectedTrackId = null;
            stopAllMusic(0);
            stopScheduler();
            pausedProgressRef.current = 0;
            notifyListeners();
        } else if (mode === 'pause') {
            if (globalActiveTrackId && playbackStartTimeRef.current > 0) {
                const nowMs = (getContextTime() - playbackStartTimeRef.current) * 1000;
                pausedProgressRef.current = Math.max(0, nowMs);
            }
            stopAllMusic(0);
            stopScheduler();
        } else if (mode === 'play') {
            // Trigger playback state without forced track pinning so zone music isn't blocked
            globalPlaybackNonce++;
            notifyListeners();
        } else if (mode === 'loop') {
            globalPlaybackNonce++;
            notifyListeners();
        } else if (mode === 'random') {
            const unlocked = worldState?.unlockedMusicTracks || [];
            const playable = MUSIC_TRACKS.filter(t => unlocked.includes(t.id));
            if (playable.length > 0) {
                const next = playable[Math.floor(Math.random() * playable.length)];
                globalActiveTrackId = null;
                globalPlaybackNonce++;
                setSelectedTrackId(next.id);
            }
        }
    }, [stopAllMusic, stopScheduler, getContextTime, regionId, worldState?.unlockedMusicTracks, setSelectedTrackId, setMusicModeState]);

    const stopMusic = useCallback((fade: number = 0.5) => {
        setMusicMode('stop');
    }, [setMusicMode]);


    // --- TWO-EYE DISCOVERY SYSTEM ---
    
    // 1. Discovery Eye: Only looks at physical location for unlocks (Ignores manual selection)
    const currentLocaleTrackId = useMemo(() => {
        if (poiId) {
            const poiTrack = MUSIC_TRACKS.find(t => t.poiId === poiId);
            if (poiTrack) return poiTrack.id;
        } 
        
        if (regionId) {
            const regionTrack = MUSIC_TRACKS.find(t => t.regionId === regionId);
            if (regionTrack) return regionTrack.id;
            return regionId; // Standard region fallback
        }
        
        return null;
    }, [poiId, regionId]);

    // 2. Playback Eye: Decides what the speakers actually play (Manual override priority)
    const targetPlaybackTrackId = useMemo(() => {
        return selectedTrackId || currentLocaleTrackId;
    }, [selectedTrackId, currentLocaleTrackId]);

    // Auto-Unlock Effect: Dedicated to updating worldState library based on LOCATION
    useEffect(() => {
        if (currentLocaleTrackId && setWorldState) {
            setWorldState(prev => {
                if (prev.unlockedMusicTracks.includes(currentLocaleTrackId as string)) return prev;
                return {
                    ...prev,
                    unlockedMusicTracks: [...prev.unlockedMusicTracks, currentLocaleTrackId as string]
                };
            });
        }
    }, [currentLocaleTrackId, setWorldState]);

    // Unified Playback Decision Logic: Dedicated to starting/stopping audio segments
    useEffect(() => {
        if (!isAudioActive || globalMusicMode === 'stop' || globalMusicMode === 'pause') {
            // Respect the Pause/Stop state
            if (globalActiveTrackId) {
                stopAllMusic(0);
                stopScheduler();
                globalActiveTrackId = null;
            }
            return;
        }

        // Only start music if we have a target and it's not already playing
        if (targetPlaybackTrackId && targetPlaybackTrackId !== globalActiveTrackId) {
            const track = MUSIC_TRACKS.find(t => t.id === targetPlaybackTrackId);
            if (track) {
                const score = STATIC_MUSIC_LIBRARY[track.id];
                if (score) {
                    // Check if we have paused progress for this specific track
                    const resumeOffset = pausedProgressRef.current;
                    pausedProgressRef.current = 0; // Consume the progress
                    
                    // Switch to the new track
                    playMusicSegmentInternal(score, track.id, resumeOffset, true);
                }
            }
        }

        // Detect transitions or mode changes that require resetting state
        const isZoneTransition = (regionId !== undefined && regionId !== globalLastValidRegionId);
        if (isZoneTransition) {
            globalLastValidRegionId = regionId;
            pausedProgressRef.current = 0; // Clear progress on zone change
        }
    }, [targetPlaybackTrackId, regionId, globalMusicMode, globalPlaybackNonce, stopAllMusic, stopScheduler, isAudioActive, playMusicSegmentInternal]);

    return { 
        musicLibrary: STATIC_MUSIC_LIBRARY, 
        playMusicSegment: (score: string, id: string) => {
            setSelectedTrackId(id);
            if (globalMusicMode === 'stop' || globalMusicMode === 'pause') {
                globalMusicMode = 'play';
                setMusicModeState('play');
            }
            // Trigger playback by clearing active track id so the effect re-runs
            globalActiveTrackId = null;
            globalPlaybackNonce++;
            notifyListeners();
        }, 
        stopMusic, 
        isReady: !!STATIC_MUSIC_LIBRARY,
        musicMode,
        setMusicMode,
        selectedTrackId,
        setSelectedTrackId,
        activeTrackId: globalActiveTrackId,
    };
};