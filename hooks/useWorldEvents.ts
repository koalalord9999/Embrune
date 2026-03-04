import { useEffect, useRef } from 'react';
import { WorldState, PlayerQuestState } from '../types';
import { POIS, REGIONS } from '../constants';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { useQuestLogic } from './useQuestLogic';

interface WorldEventDependencies {
    session: ReturnType<typeof useGameSession>;
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
    questLogic: ReturnType<typeof useQuestLogic>;
    playerQuests: PlayerQuestState[];
}

export const useWorldEvents = (deps: WorldEventDependencies) => {
    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const checkDestructionTrialCompletion = (currentState: WorldState) => {
        const { questLogic, inv, addLog } = depsRef.current;
        const progress = currentState.destructionTrialProgress;
        if (progress?.heat === 'completed' && progress?.pressure === 'completed' && progress?.silence === 'completed') {
            const playerQuest = depsRef.current.playerQuests.find(q => q.questId === 'the_sorcerers_trial');
            // Ensure we don't grant the item multiple times
            if (playerQuest && playerQuest.currentStage === 11) {
                inv.modifyItem('tempered_core', 1, false, { bypassAutoBank: true });
                questLogic.completeQuestStage('the_sorcerers_trial');
                addLog("The unstable core has been fully tempered against heat, pressure, and silence. It is now a stable, powerful artifact.");
            }
        }
    };
    
    // For timed events like the Heat trial
    useEffect(() => {
        const interval = setInterval(() => {
            const { worldState, setWorldState, addLog } = depsRef.current;
            const progress = worldState.destructionTrialProgress;

            if (progress?.heat === 'started' && progress.heatEndTime && Date.now() >= progress.heatEndTime) {
                setWorldState(ws => {
                    const newProgress = { ...ws.destructionTrialProgress, heat: 'completed' as const };
                    const newState = { ...ws, destructionTrialProgress: newProgress };
                    checkDestructionTrialCompletion(newState);
                    return newState;
                });
                addLog("A sweaty dwarf apprentice hands you back the core. It seems much calmer now, humming with a steady, deep power.");
            }
             if (progress?.pressure === 'started' && progress.pressureStartTime && (Date.now() - progress.pressureStartTime >= 300000)) { // 5 minutes
                setWorldState(ws => {
                    const newProgress = { ...ws.destructionTrialProgress, pressure: 'completed' as const };
                    const newState = { ...ws, destructionTrialProgress: newProgress };
                    checkDestructionTrialCompletion(newState);
                    return newState;
                });
                addLog("The core shudders one last time and then settles, its frantic energy seemingly crushed into submission by the immense pressure of the deep.");
            }
             if (progress?.silence === 'started' && progress.silenceStartTime && (Date.now() - progress.silenceStartTime >= 180000)) { // 3 minutes
                setWorldState(ws => {
                    const newProgress = { ...ws.destructionTrialProgress, silence: 'completed' as const };
                    const newState = { ...ws, destructionTrialProgress: newProgress };
                    checkDestructionTrialCompletion(newState);
                    return newState;
                });
                addLog("In the profound magical silence, the core's chaotic energy finds no purchase. It settles into a state of quiet equilibrium.");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // For location-based events like Pressure and Silence trials
    useEffect(() => {
        const { session, worldState, setWorldState, addLog, playerQuests, inv } = depsRef.current;
        const playerQuest = playerQuests.find(q => q.questId === 'the_sorcerers_trial');

        if (!playerQuest || playerQuest.isComplete || playerQuest.currentStage !== 11) return;

        const hasCore = inv.hasItems([{ itemId: 'unstable_core', quantity: 1 }]);
        const progress = worldState.destructionTrialProgress || {};
        const currentPoi = POIS[session.currentPoiId];
        const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;

        // Pressure Trial Logic
        const isInLabyrinth = currentRegion?.id === 'sunken_labyrinth' && currentPoi.id !== 'laby_entrance';
        if (hasCore && progress.pressure !== 'completed') {
            if (isInLabyrinth && progress.pressure !== 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, pressure: 'started', pressureStartTime: Date.now() } }));
                addLog("The Unstable Core begins to hum violently as it acclimates to the crushing pressure. You must remain in the labyrinth for 5 minutes.");
            } else if (!isInLabyrinth && progress.pressure === 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, pressure: undefined, pressureStartTime: undefined } }));
                addLog("You have left the labyrinth, interrupting the tempering process.");
            }
        }
        
        // Silence Trial Logic
        const isInSaltPillar = session.currentPoiId === 'the_great_salt_pillar';
        if (hasCore && progress.silence !== 'completed') {
            if (isInSaltPillar && progress.silence !== 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, silence: 'started', silenceStartTime: Date.now() } }));
                addLog("The weave of magic here is almost non-existent. The core begins to stabilize in the profound silence. You must remain here for 3 minutes.");
            } else if (!isInSaltPillar && progress.silence === 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, silence: undefined, silenceStartTime: undefined } }));
                addLog("You have left the Great Salt Pillar, interrupting the tempering process.");
            }
        }
        
    }, [depsRef.current?.session.currentPoiId]);

    useEffect(() => {
        const { session, worldState, setWorldState, char, inv, addLog, questLogic, playerQuests } = depsRef.current;
        const interval = setInterval(() => {
            const { session, worldState, setWorldState, char, inv, addLog, questLogic, playerQuests } = depsRef.current;
            const now = Date.now();
            let updates: Partial<NonNullable<WorldState['eventNextTrigger']>> = {};

            const cooldowns = worldState.eventNextTrigger ?? {};

            const sorcerersTrialQuest = playerQuests.find(q => q.questId === 'the_sorcerers_trial');
            const isChargingStage = sorcerersTrialQuest && !sorcerersTrialQuest.isComplete && sorcerersTrialQuest.currentStage === 4;

            // 1. Gale-Swept Peaks Thunderstorm
            if (!cooldowns.galeSwept || now >= cooldowns.galeSwept) {
                updates.galeSwept = now + 300000; // 5 mins
                const regionPois = Object.values(POIS).filter(p => p.regionId === 'gale_swept_peaks');
                if (regionPois.length > 0) {
                    const targetPoi = regionPois[Math.floor(Math.random() * regionPois.length)];
                    if (session.currentPoiId === targetPoi.id) {
                        const damage = Math.floor(Math.random() * 6) + 5; // 5-10
                        char.setCurrentHp(hp => Math.max(0, hp - damage));
                        addLog(`A bolt of lightning strikes nearby, shocking you for ${damage} damage!`);
                        if (isChargingStage && inv.hasItems([{ itemId: 'inert_rune_of_attunement', quantity: 1 }])) {
                            inv.modifyItem('inert_rune_of_attunement', -1, true);
                            inv.modifyItem('imprinted_rune_of_attunement', 1, false, { bypassAutoBank: true, nameOverride: 'Imprinted Rune of Attunement (Lightning)' });
                            addLog("The lightning strike channels its raw power into your rune, imprinting it with elemental fury!");
                        }
                    }
                }
            }

            // 2. Isle of Whispers Tidal Swell
            if (!cooldowns.isleOfWhispers || now >= cooldowns.isleOfWhispers) {
                 updates.isleOfWhispers = now + 180000; // 3 mins
                 const regionPois = Object.values(POIS).filter(p => 
                    p.regionId === 'isle_of_whispers' && 
                    p.connections.filter(c => POIS[c]?.regionId === 'isle_of_whispers').length < 3 &&
                    p.id !== 'port_wreckage_docks'
                );
                 if (regionPois.length > 0) {
                    const targetPoi = regionPois[Math.floor(Math.random() * regionPois.length)];
                     if (session.currentPoiId === targetPoi.id) {
                         const damage = Math.floor(Math.random() * 5) + 3; // 3-7
                         char.setCurrentHp(hp => Math.max(0, hp - damage));
                         addLog(`A massive wave crashes over the area, soaking you for ${damage} damage!`);
                         if (isChargingStage && inv.hasItems([{ itemId: 'inert_rune_of_attunement', quantity: 1 }])) {
                            inv.modifyItem('inert_rune_of_attunement', -1, true);
                            inv.modifyItem('imprinted_rune_of_attunement', 1, false, { bypassAutoBank: true, nameOverride: 'Imprinted Rune of Attunement (Water)' });
                            addLog("The raw power of the ocean surges into your rune, imprinting it with the might of the tides!");
                        }
                     }
                 }
            }

            // 3. Volcanic Steam Vents Geyser Eruption
            if (!cooldowns.volcanicVents || now >= cooldowns.volcanicVents) {
                updates.volcanicVents = now + 300000; // 5 mins
                const regionPois = Object.values(POIS).filter(p => 
                    p.regionId === 'volcanic_steam_vents' && 
                    (p.description.toLowerCase().includes('lava') || p.description.toLowerCase().includes('geyser') || p.description.toLowerCase().includes('vents'))
                );
                if (regionPois.length > 0) {
                    const targetPoi = regionPois[Math.floor(Math.random() * regionPois.length)];
                    if (session.currentPoiId === targetPoi.id) {
                        const damage = Math.floor(Math.random() * 5) + 8; // 8-12
                        char.setCurrentHp(hp => Math.max(0, hp - damage));
                        addLog(`A geyser of superheated steam erupts from the ground, scalding you for ${damage} damage!`);
                        if (isChargingStage && inv.hasItems([{ itemId: 'inert_rune_of_attunement', quantity: 1 }])) {
                            inv.modifyItem('inert_rune_of_attunement', -1, true);
                            inv.modifyItem('imprinted_rune_of_attunement', 1, false, { bypassAutoBank: true, nameOverride: 'Imprinted Rune of Attunement (Fire)' });
                            addLog("The raw geothermal energy of the earth erupts into your rune, imprinting it with volcanic power!");
                        }
                    }
                }
            }

            if (Object.keys(updates).length > 0) {
                setWorldState(ws => ({
                    ...ws,
                    eventNextTrigger: { ...ws.eventNextTrigger, ...updates }
                }));
            }

        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []); // Run only on mount
};