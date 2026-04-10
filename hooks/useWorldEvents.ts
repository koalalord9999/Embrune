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
    const { session, worldState, setWorldState, char, inv, addLog, questLogic, playerQuests } = deps;
    const depsRef = useRef(deps);
    const processingCompletionRef = useRef<Record<string, boolean>>({});

    useEffect(() => {
        depsRef.current = deps;
    }, [deps]);

    const checkDestructionTrialCompletion = (currentState: WorldState) => {
        const { questLogic, inv, addLog } = depsRef.current;
        const progress = currentState.destructionTrialProgress;
        if (progress?.heat === 'completed' && progress?.pressure === 'completed' && progress?.silence === 'completed') {
            const playerQuest = depsRef.current.playerQuests.find(q => q.questId === 'the_sorcerers_trial');
            // Ensure we don't grant the item multiple times
            if (playerQuest && playerQuest.currentStage === 11) {
                inv.modifyItem('tempered_core', 1, false, { bypassAutoBank: true });
                addLog("The unstable core has been fully tempered against heat, pressure, and silence. It is now a stable, powerful artifact.");
            }
        }
    };

    const getCoreName = (progress: any, isCharging?: boolean) => {
        const trials = [];
        if (progress?.heat === 'completed') trials.push('Heat');
        if (progress?.pressure === 'completed') trials.push('Pressure');
        if (progress?.silence === 'completed') trials.push('Silence');

        if (trials.length === 0) return isCharging ? 'Unstable Core (Stabilizing...)' : 'Unstable Core';
        return `Unstable Core (${trials.join(', ')})${isCharging ? ' (Stabilizing...)' : ''}`;
    };

    // For timed events like the Heat trial
    useEffect(() => {
        const interval = setInterval(() => {
            const { worldState, setWorldState, addLog, inv, session } = depsRef.current;
            const progress = worldState.destructionTrialProgress;

            if (progress?.heat === 'started' && progress.heatEndTime && Date.now() >= progress.heatEndTime) {
                // Ensure the player is actually AT the forge to receive the item back.
                const isInForge = session.currentPoiId === 'dwarven_forge' || session.currentPoiId === 'dwarven_outpost_entrance';
                if (isInForge && !processingCompletionRef.current.heat) {
                    processingCompletionRef.current.heat = true;

                    // 1. Move to completed state locally first
                    const newProgress = { ...progress, heat: 'completed' as const };
                    const newState: WorldState = { ...worldState, destructionTrialProgress: newProgress };

                    // 2. Clear all existing cores to prevent duplication
                    inv.inventory.forEach(slot => {
                        if (slot && slot.itemId === 'unstable_core') {
                            inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        }
                    });

                    // 3. Update world state
                    setWorldState(newState);

                    // 4. Give the new core (or completion item)
                    if (newProgress.heat === 'completed' && newProgress.pressure === 'completed' && newProgress.silence === 'completed') {
                        checkDestructionTrialCompletion(newState);
                    } else {
                        inv.modifyItem('unstable_core', 1, false, {
                            bypassAutoBank: true,
                            nameOverride: getCoreName(newProgress)
                        });
                    }

                    addLog("A sweaty dwarf apprentice hands you back the core. It seems much calmer now, humming with a steady, deep power.");
                }
            }

            if (progress?.pressure === 'started' && progress.pressureStartTime && (Date.now() - progress.pressureStartTime >= 300000)) { // 5 minutes
                if (!processingCompletionRef.current.pressure) {
                    processingCompletionRef.current.pressure = true;

                    const newProgress = { ...progress, pressure: 'completed' as const };
                    const newState: WorldState = { ...worldState, destructionTrialProgress: newProgress };

                    inv.inventory.forEach(slot => {
                        if (slot && slot.itemId === 'unstable_core') {
                            inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        }
                    });

                    setWorldState(newState);

                    if (newProgress.heat === 'completed' && newProgress.pressure === 'completed' && newProgress.silence === 'completed') {
                        checkDestructionTrialCompletion(newState);
                    } else {
                        inv.modifyItem('unstable_core', 1, false, {
                            bypassAutoBank: true,
                            nameOverride: getCoreName(newProgress)
                        });
                    }
                    addLog("The core shudders one last time and then settles, its frantic energy seemingly crushed into submission by the immense pressure of the deep.");
                }
            }

            if (progress?.silence === 'started' && progress.silenceStartTime && (Date.now() - progress.silenceStartTime >= 180000)) { // 3 minutes
                if (!processingCompletionRef.current.silence) {
                    processingCompletionRef.current.silence = true;

                    const newProgress = { ...progress, silence: 'completed' as const };
                    const newState: WorldState = { ...worldState, destructionTrialProgress: newProgress };

                    inv.inventory.forEach(slot => {
                        if (slot && slot.itemId === 'unstable_core') {
                            inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        }
                    });

                    setWorldState(newState);

                    if (newProgress.heat === 'completed' && newProgress.pressure === 'completed' && newProgress.silence === 'completed') {
                        checkDestructionTrialCompletion(newState);
                    } else {
                        inv.modifyItem('unstable_core', 1, false, {
                            bypassAutoBank: true,
                            nameOverride: getCoreName(newProgress)
                        });
                    }
                    addLog("In the profound magical silence, the core's chaotic energy finds no purchase. It settles into a state of quiet equilibrium.");
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // For location-based events like Pressure and Silence trials
    useEffect(() => {
        const playerQuest = playerQuests.find(q => q.questId === 'the_sorcerers_trial');
        if (!playerQuest || playerQuest.isComplete || playerQuest.currentStage !== 11) return;

        const hasCore = inv.hasItems([{ itemId: 'unstable_core', quantity: 1 }]);
        const progress = worldState.destructionTrialProgress || {};
        const currentPoiId = session.currentPoiId;
        const currentPoi = POIS[currentPoiId];
        const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;

        // Pressure Trial Trigger
        const isInLabyrinth = currentRegion?.id === 'sunken_labyrinth' && currentPoiId !== 'laby_entrance';
        if (hasCore && progress.pressure !== 'completed') {
            if (isInLabyrinth && progress.pressure !== 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, pressure: 'started', pressureStartTime: Date.now() } }));
                addLog("The Unstable Core begins to hum violently as it acclimates to the crushing pressure. You must remain in the labyrinth for 5 minutes.");
                inv.inventory.forEach(slot => {
                    if (slot && slot.itemId === 'unstable_core') {
                        inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        inv.modifyItem('unstable_core', slot.quantity, true, { bypassAutoBank: true, nameOverride: getCoreName(progress, true) });
                    }
                });
            } else if (!isInLabyrinth && progress.pressure === 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, pressure: undefined, pressureStartTime: undefined } }));
                addLog("You have left the labyrinth, interrupting the tempering process.");
                inv.inventory.forEach(slot => {
                    if (slot && slot.itemId === 'unstable_core') {
                        inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        inv.modifyItem('unstable_core', slot.quantity, true, { bypassAutoBank: true, nameOverride: getCoreName(progress, false) });
                    }
                });
            }
        }

        // Silence Trial Trigger
        const isInSaltPillar = currentPoiId === 'the_great_salt_pillar';
        if (hasCore && progress.silence !== 'completed') {
            if (isInSaltPillar && progress.silence !== 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, silence: 'started', silenceStartTime: Date.now() } }));
                addLog("The weave of magic here is almost non-existent. The core begins to stabilize in the profound silence. You must remain here for 3 minutes.");
                inv.inventory.forEach(slot => {
                    if (slot && slot.itemId === 'unstable_core') {
                        inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        inv.modifyItem('unstable_core', slot.quantity, true, { bypassAutoBank: true, nameOverride: getCoreName(progress, true) });
                    }
                });
            } else if (!isInSaltPillar && progress.silence === 'started') {
                setWorldState(ws => ({ ...ws, destructionTrialProgress: { ...ws.destructionTrialProgress, silence: undefined, silenceStartTime: undefined } }));
                addLog("You have left the Great Salt Pillar, interrupting the tempering process.");
                inv.inventory.forEach(slot => {
                    if (slot && slot.itemId === 'unstable_core') {
                        inv.modifyItem('unstable_core', -slot.quantity, true, { nameOverride: slot.nameOverride });
                        inv.modifyItem('unstable_core', slot.quantity, true, { bypassAutoBank: true, nameOverride: getCoreName(progress, false) });
                    }
                });
            }
        }
    }, [session.currentPoiId, playerQuests, worldState.destructionTrialProgress, inv.inventory]);

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
                updates.galeSwept = now + 60000; // 1 minute
                const strikePoiIds = ['the_summit', 'ancient_ruins_summit', 'summit_approach'];
                const strikePois = Object.values(POIS).filter(p => strikePoiIds.includes(p.id));
                if (strikePois.length > 0) {
                    const targetPoi = strikePois[Math.floor(Math.random() * strikePois.length)];
                    if (session.currentPoiId === targetPoi.id) {
                        const damage = Math.floor(Math.random() * 6) + 5; // 5-10
                        char.setCurrentHp(hp => Math.max(0, hp - damage));
                        addLog(`A bolt of lightning strikes nearby, shocking you for ${damage} damage!`);
                        if (isChargingStage && inv.hasItems([{ itemId: 'inert_rune_of_attunement', quantity: 1 }])) {
                            inv.modifyItem('inert_rune_of_attunement', -1, true);
                            inv.modifyItem('imprinted_rune_of_attunement', 1, false, { bypassAutoBank: true, nameOverride: 'Imprinted Rune of Attunement (Lightning)' });
                            addLog("The lightning strike channels its raw power into your rune, imprinting it with elemental fury!");
                        }
                    } else if (strikePoiIds.includes(session.currentPoiId)) {
                        addLog("Thunder rumbles ominously in the distance.");
                    }
                }
            }

            // 2. Isle of Whispers Tidal Swell
            if (!cooldowns.isleOfWhispers || now >= cooldowns.isleOfWhispers) {
                updates.isleOfWhispers = now + 60000; // 1 minute
                const squallPoiIds = ['crabclaw_isle', 'deep_sea_fishing_spot', 'sirens_cove', 'abandoned_lighthouse'];
                const squallPois = Object.values(POIS).filter(p => squallPoiIds.includes(p.id));
                if (squallPois.length > 0) {
                    const targetPoi = squallPois[Math.floor(Math.random() * squallPois.length)];
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
                    else if (squallPoiIds.includes(session.currentPoiId)) {
                        addLog("You hear waves crashing violently against the shore.");
                    }
                }
            }

            // 3. Volcanic Steam Vents Geyser Eruption
            if (!cooldowns.volcanicVents || now >= cooldowns.volcanicVents) {
                updates.volcanicVents = now + 60000; // 1 minute
                const regionPois = Object.values(POIS).filter(p =>
                    p.regionId === 'volcanic_steam_vents' &&
                    (p.description.toLowerCase().includes('lava') || p.description.toLowerCase().includes('geyser') || p.description.toLowerCase().includes('vents') || p.description.toLowerCase().includes('steam'))
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
                    } else if (regionPois.some(p => p.id === session.currentPoiId)) {
                        addLog(`You hear a loud hiss as a geyser erupts nearby.`);
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