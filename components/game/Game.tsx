
import React, { useState, useCallback, useMemo, useEffect, useRef, Suspense } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest, BonfireActivity, BankTab, DialogueResponse, DialogueCheckRequirement, Monster, MonsterType, SpellElement, PlayerType, ActiveBuff, Equipment, WeaponType } from '../../types';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useSaveGame } from '../../hooks/useSaveGame';
import { useGameSession } from '../../hooks/useGameSession';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useAggression } from '../../hooks/useAggression';
import { useShops } from '../../hooks/useShops';
import { useSkilling } from '../../hooks/useSkilling';
import { useThieving } from '../../hooks/useThieving';
import { useBank } from '../../hooks/useBank';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useCrafting } from '../../hooks/useCrafting';
import { useItemActions } from '../../hooks/useItemActions';
import { useSpellActions } from '../../hooks/useSpellActions';
import { useWorldActions } from '../../hooks/useWorldActions';
import { useNavigation } from '../../hooks/useNavigation';
import { usePlayerDeath } from '../../hooks/usePlayerDeath';
import { useKillHandler } from '../../hooks/useKillHandler';
import { useGroundItems } from '../../hooks/useGroundItems';
import { useSpellcasting } from '../../hooks/useSpellcasting';
import { useDialogueActions } from '../../hooks/useDialogueActions';
import { useSceneInteractions } from '../../hooks/useSceneInteractions';
import { useDevMode } from '../../hooks/useDevMode';
import { useThievingPilfering } from '../../hooks/useThievingPilfering';
import { usePrayer } from '../../hooks/usePrayer';
import { useDehydration } from '../../hooks/useDehydration';
import { useAgility } from '../../hooks/useAgility';
import { useMusicEngine, MUSIC_TRACKS } from '../../hooks/useMusicEngine';
import { PRAYERS, ITEMS, SKILL_ICONS, ATTACK_STYLES } from '../../constants';
import { useKeyboardManager, Direction } from '../../hooks/useKeyboardManager';
// Conditionally load the map manager. 
const mapManagerModules = import.meta.env.DEV ? import.meta.glob('../../ai_utility/map_manager/index.tsx') : {};
export const hasMapManager = Object.keys(mapManagerModules).length > 0;
const loadMapManager = hasMapManager ? (mapManagerModules['../../ai_utility/map_manager/index.tsx'] as () => Promise<{ default: React.ComponentType<any> }>) : null;
const MapManagerComponent = loadMapManager ? React.lazy(loadMapManager) : null;

import SidePanel from '../panels/SidePanel';
import ActivityLog from './ActivityLog';
import { ContextMenuOption } from '../common/ContextMenu';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import MainViewController from './MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import ExpandedMapView from '../views/ExpandedMapView';
import LevelUpAnimation from './LevelUpAnimation';
import DialogueOverlay from './dialogue/DialogueOverlay';
import LootButtonOverlay from './LootButtonOverlay';
import { useUIState } from '../../hooks/useUIState';
import { POIS } from '../../data/pois';
import DevPanel from '../panels/DevPanel';
import { FIREMAKING_RECIPES, QUESTS, MONSTERS } from '../../constants';
import SettingsView from '../panels/SettingsPanel';
import SkillGuideView from '../views/overlays/SkillGuideView';
import SingleActionProgressView from '../game/SingleActionProgressView';
import AgilityCourseView from '../views/AgilityCourseView.tsx'

const AttackLabel: React.FC<{ monsterName: string; respawnTimestamp: number | undefined }> = ({ monsterName, respawnTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState(respawnTimestamp ? Math.ceil((respawnTimestamp - Date.now()) / 1000) : 0);

    useEffect(() => {
        if (!respawnTimestamp || timeLeft <= 0) return;
        const interval = setInterval(() => {
            const newTime = Math.ceil((respawnTimestamp - Date.now()) / 1000);
            if (newTime <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(newTime);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [respawnTimestamp]);

    if (timeLeft > 0) {
        return <>{`Attack ${monsterName} (${timeLeft}s)`}</>;
    }
    return <>{`Attack ${monsterName}`}</>;
};

import { beasts } from '../../constants/monsters/beasts';
import { humanoids } from '../../constants/monsters/humanoids';
import { magicalAndUndead } from '../../constants/monsters/magicalAndUndead';
import { dragons } from '../../constants/monsters/dragons';
import BuffBar from './BuffBar';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { useWorldEvents } from '../../hooks/useWorldEvents';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types';


interface GameProps {
    initialState: any;
    slotId: number;
    onReturnToMenu: (currentState: any) => void;
    ui: ReturnType<typeof useUIState>;
    assets: Record<string, string>;
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
}

const Game: React.FC<GameProps> = ({ initialState, slotId, onReturnToMenu, ui, assets, onExportGame, onImportGame, onResetGame }) => {
    // Core State Hooks
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog, setActivityLog } = useActivityLog([]);
    const { play } = useSoundEngine();
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const [poiImmunityTimeLeft, setPoiImmunityTimeLeft] = useState(0);
    const [killTrigger, setKillTrigger] = useState(0);
    const [bonfires, setBonfires] = useState<BonfireActivity[]>([]);
    const [dynamicActivities, setDynamicActivities] = useState<POIActivity[] | null>(null);
    const [poisonEvent, setPoisonEvent] = useState<{ damage: number, timestamp: number } | null>(null);
    const [isTraveling, setIsTraveling] = useState(false);
    const [combatStance, setCombatStance] = useState<CombatStance>(initialState.combatStance);
    const [stylesByWeaponType, setStylesByWeaponType] = useState<Partial<Record<WeaponType, number>>>(initialState.stylesByWeaponType || {});
    const [combatAttackType, setCombatAttackType] = useState<'stab' | 'slash' | 'crush'>('crush');
    const [rangeCooldowns, setRangeCooldowns] = useState<Record<string, number>>({});

    const containerRef = useRef<HTMLDivElement>(null);
    const isBusy = ui.isBusy || isTraveling || !!ui.activeSingleAction;
    const [worldState, setWorldState] = useState<WorldState>(initialState.worldState);
    const [bookmarks, setBookmarks] = useState<string[]>(initialState.bookmarks || []);

    // Music System Integration
    const currentRegionId = useMemo(() => {
        const poi = POIS[session.currentPoiId];
        return poi ? poi.regionId : undefined;
    }, [session.currentPoiId]);

    useMusicEngine(currentRegionId, session.currentPoiId, worldState, setWorldState);

    // DEV MODE STATE INITIALIZATION
    const handleTogglePermAggro = useCallback(() => {
        ui.setIsPermAggroOn(prev => {
            const newState = !prev;
            if (newState) {
                addLog(`System: Permanent aggression enabled for all monsters.`);
            } else {
                addLog(`System: Permanent aggression disabled.`);
            }
            return newState;
        });
    }, [ui, addLog]);
    useEffect(() => {
        if (initialState.settings?.devSettings) {
            const ds = initialState.settings.devSettings;
            ui.setXpMultiplier(ds.xpMultiplier ?? 1);
            ui.setCombatSpeedMultiplier(ds.combatSpeedMultiplier ?? 1);
            ui.setIsPlayerInvisible(ds.isPlayerInvisible ?? false);
            ui.setIsAutoBankOn(ds.isAutoBankOn ?? false);
            ui.setIsGodModeOn(ds.isGodModeOn ?? false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on initial mount

    // --- START DEV MODE LOGIC ---
    const devMode = useDevMode({
        initialState,
        devModeOverride: initialState.playerType === PlayerType.Cheats,
        isInCombat: ui.combatQueue.length > 0,
        ui,
        addLog,
        combatSpeedMultiplier: ui.combatSpeedMultiplier,
        setCombatSpeedMultiplier: ui.setCombatSpeedMultiplier,
        xpMultiplier: ui.xpMultiplier,
        setXpMultiplier: ui.setXpMultiplier,
        isPlayerInvisible: ui.isPlayerInvisible,
        setIsPlayerInvisible: ui.setIsPlayerInvisible,
        isAutoBankOn: ui.isAutoBankOn,
        setIsAutoBankOn: ui.setIsAutoBankOn,
        isGodModeOn: ui.isGodModeOn,
        setIsGodModeOn: ui.setIsGodModeOn,
    });
    const { isDevMode } = devMode;
    const { messages, sendMessage, announceLogin, announceLogout } = useChat(initialState.username);
    const handleSendMessage = (message: string) => sendMessage(initialState.username, message);

    useEffect(() => {
        announceLogin(initialState.username);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReturnToMenuWithLogout = useCallback((currentState: any) => {
        announceLogout(initialState.username);
        onReturnToMenu(currentState);
    }, [announceLogout, initialState.username, onReturnToMenu]);

    const effectiveXpMultiplier = isDevMode ? devMode.xpMultiplier : 1;
    const combatSpeedMultiplier = isDevMode ? devMode.combatSpeedMultiplier : 1;
    // --- END DEV MODE LOGIC ---

    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });

    // Character & Item Hooks
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
        if (amount > 0) {
            setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
        }
    }, []);

    const removeXpDrop = useCallback((id: number) => setXpDrops(prev => prev.filter(drop => drop.id !== id)), []);

    const handleLevelUp = useCallback((skill: SkillName, level: number) => {
        setLevelUpInfo({ skill, level });
        play('LEVEL_UP');
        const duration = level === 99 ? 8000 : 4000;
        setTimeout(() => setLevelUpInfo(null), duration);
    }, [play]);

    const handlePoisonDamage = useCallback((damage: number) => {
        setPoisonEvent({ damage, timestamp: Date.now() });
    }, []);

    useEffect(() => {
        if (poisonEvent) {
            const timer = setTimeout(() => setPoisonEvent(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [poisonEvent]);

    const charInitialData = useMemo(() => ({
        skills: initialState.skills,
        combatStance: combatStance,
        currentHp: initialState.currentHp,
        currentPrayer: initialState.currentPrayer,
        autocastSpell: initialState.autocastSpell,
        statModifiers: initialState.statModifiers,
        activeBuffs: initialState.activeBuffs,
        runEnergy: initialState.runEnergy,
        isRunToggled: initialState.isRunToggled,
        isResting: initialState.isResting ?? false,
        lastHomeTeleport: initialState.lastHomeTeleport ?? 0
    }), [initialState, combatStance]);
    const charCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp, onPoisonDamage: handlePoisonDamage }), [addLog, handleXpGain, handleLevelUp, handlePoisonDamage]);

    const prayer = usePrayer(initialState.activePrayers || [], addLog);

    const invRef = useRef<ReturnType<typeof useInventory> | null>(null);
    const {
        groundItems: allGroundItems,
        groundItemsForCurrentPoi,
        onItemDropped,
        handlePickUpItem,
        handleTakeAllLoot,
        clearAllItemsAtPoi,
        clearDeathPileItemsAtPoi,
        moveItems
    } = useGroundItems(initialState.groundItems, { session, invRef, addLog, ui, worldState, setWorldState });

    const [bank, setBank] = useState<BankTab[]>(initialState.bank);
    const inv = useInventory(
        { inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment },
        addLog,
        {
            isAutoBankOn: devMode.isAutoBankOn,
            setBank,
            onItemDropped,
            setCombatStance: setCombatStance,
            playerQuests: quests.playerQuests,
            startQuest: (questId) => quests.startQuest(questId, addLog),
            closeDialogue: () => ui.setActiveDialogue(null),
        }
    );
    useEffect(() => { invRef.current = inv; }, [inv]);

    useEffect(() => {
        const weaponType = inv.equipment.weapon ? ITEMS[inv.equipment.weapon.itemId]?.equipment?.weaponType : WeaponType.Unarmed;
        const normalizedWeaponType = weaponType ?? WeaponType.Unarmed;

        const attackStyles = ATTACK_STYLES[normalizedWeaponType];
        if (attackStyles) {
            const savedIndex = stylesByWeaponType[normalizedWeaponType] || 0;
            const styleToApply = attackStyles[savedIndex] || attackStyles[0];
            if (styleToApply) {
                setCombatStance(styleToApply.stance);
                setCombatAttackType(styleToApply.attackType);
            }
        }
    }, [inv.equipment.weapon?.itemId]); // intentionally omitting stylesByWeaponType to avoid reverting manual selections

    const char = useCharacter(
        charInitialData,
        charCallbacks,
        worldState,
        setWorldState,
        ui.combatQueue.length > 0,
        combatSpeedMultiplier,
        effectiveXpMultiplier,
        isDevMode ? devMode.isGodModeOn : false,
        prayer.activePrayers,
        () => prayer.setActivePrayers([]),
        inv.equipment
    );

    // Logic Hooks
    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    const [slayerCredits, setSlayerCredits] = useState(initialState.slayerCredits || 0);
    const [slayerTaskStreak, setSlayerTaskStreak] = useState(initialState.slayerTaskStreak || 0);
    const isInCombat = ui.combatQueue.length > 0;

    const questLogic = useQuestLogic({ playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests, addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems, setLockedPois: quests.setLockedPois, setClearedSkillObstacles, worldState, setWorldState });

    const onQuestAcceptedCallback = useCallback((quest: GeneratedRepeatableQuest) => {
        const tutorialQuest = quests.playerQuests.find(q => q.questId === 'embrune_101');
        if (tutorialQuest && !tutorialQuest.isComplete) {
            const questData = QUESTS['embrune_101'];
            const currentStage = questData.stages[tutorialQuest.currentStage];
            if (currentStage?.requirement.type === 'accept_repeatable_quest' && currentStage.requirement.questId === quest.id) {
                questLogic.completeQuestStage('embrune_101');
            }
        }
    }, [quests.playerQuests, questLogic]);

    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char, onQuestAcceptedCallback);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: char.addXp, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment, setEquipment: inv.setEquipment, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, hasItems: inv.hasItems });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });

    const cancelCurrentAction = useCallback(() => {
        skilling.stopSkilling();
        if (ui.activeCraftingAction) {
            ui.setActiveCraftingAction(null);
            addLog("You stop what you were doing.");
        }
        if (ui.activeSingleAction) {
            ui.setActiveSingleAction(null);
        }
        if (char.isResting) {
            char.setIsResting(false);
            addLog("You stop resting.");
        }
        if (interactQuest.activeCleanup) {
            interactQuest.handleCancelInteractQuest();
        }
    }, [skilling, ui, char, interactQuest, addLog]);

    const navigation = useNavigation({
        session,
        lockedPois: quests.lockedPois,
        clearedSkillObstacles,
        addLog,
        isBusy,
        isInCombat,
        ui,
        skilling,
        interactQuest,
        isStunned: char.isStunned,
        isRunToggled: char.isRunToggled,
        runEnergy: char.runEnergy,
        setRunEnergy: char.setRunEnergy,
        setIsTraveling,
        setIsResting: char.setIsResting,
        activeBuffs: char.activeBuffs,
        equipment: inv.equipment,
        worldState
    });
    const agility = useAgility(initialState.agilityState, { skills: char.skills, addXp: char.addXp, addLog, setCurrentHp: char.setCurrentHp, modifyItem: inv.modifyItem, setActiveSingleAction: ui.setActiveSingleAction, navigation, setRunEnergy: char.setRunEnergy, setIsResting: char.setIsResting });

    useDehydration({
        session,
        inv,
        char,
        addLog,
        worldState,
        setWorldState,
        isInCombat,
    });

    const handleFastTravel = useCallback((destinationPoiId: string) => {
        if (isBusy || isInCombat || char.isStunned) {
            addLog("You can't travel right now.");
            return;
        }

        const path = navigation.findShortestPath(session.currentPoiId, destinationPoiId);

        if (!path || path.length <= 1) {
            return; // No travel needed or no path found
        }

        const hops = path.length - 1;
        const costPerHop = char.activeBuffs.some(b => b.type === 'stamina') ? 1 : 10;
        const energyCost = hops * costPerHop;
        const travelTime = hops * 1000; // in ms

        if (char.runEnergy < energyCost) {
            addLog(`You don't have enough run energy to travel that far (Cost: ${energyCost}).`);
            return;
        }

        ui.closeAllModals();

        ui.setActiveSingleAction({
            title: "Fast Traveling...",
            iconUrl: SKILL_ICONS.Agility,
            iconClassName: 'filter invert',
            startTime: Date.now(),
            duration: travelTime,
            onComplete: () => {
                char.setRunEnergy(re => re - energyCost);
                navigation.handleForcedNavigate(destinationPoiId);
            }
        });

    }, [isBusy, isInCombat, char.isStunned, char.runEnergy, char.activeBuffs, navigation, session.currentPoiId, addLog, ui]);


    const handlePlayerDeathRef = useRef<() => void>(null!);

    const thievingPilfering = useThievingPilfering({
        worldState,
        setWorldState,
        char,
        navigation,
        addLog,
        setDynamicActivities,
        session,
        inventory: inv.inventory,
        modifyItem: inv.modifyItem,
        isInCombat,
        moveItems,
        setIsResting: char.setIsResting,
    });

    const thieving = useThieving(initialState.thievingContainerStates || {}, {
        addLog,
        skills: char.skills,
        addXp: char.addXp,
        inventory: inv.inventory,
        modifyItem: inv.modifyItem,
        equipment: inv.equipment,
        addBuff: char.addBuff,
        setPlayerHp: char.setCurrentHp,
        isStunned: char.isStunned,
        isInCombat,
        startCombat: (ids) => startCombat(ids),
        currentPoiId: session.currentPoiId,
        activeBuffs: char.activeBuffs,
        currentHp: char.currentHp,
        onPlayerDeath: () => handlePlayerDeathRef.current?.(),
        setWorldState,
        navigation,
        worldState,
        onItemDropped,
        setIsResting: char.setIsResting,
    });

    const poi = useMemo(() => {
        const basePoi = POIS[session.currentPoiId];
        if (!basePoi) return null;

        if (repeatableQuests.activePlayerQuest && repeatableQuests.activePlayerQuest.generatedQuest.isInstance && repeatableQuests.activePlayerQuest.generatedQuest.instancePoiId === session.currentPoiId) {
            const quest = repeatableQuests.activePlayerQuest.generatedQuest;
            const newActivities: POIActivity[] = [...(basePoi.activities ?? [])];

            if (quest.type === 'kill' && quest.target.monsterId) {
                const remainingToKill = quest.requiredQuantity - repeatableQuests.activePlayerQuest.progress;

                for (let i = 0; i < remainingToKill; i++) {
                    newActivities.push({ type: 'combat', monsterId: quest.target.monsterId });
                }
            }
            return { ...basePoi, activities: newActivities };
        }

        if (basePoi.id === 'pilfering_house_instance' && dynamicActivities) {
            return { ...basePoi, activities: [...(basePoi.activities ?? []), ...dynamicActivities] };
        }

        return basePoi;
    }, [session.currentPoiId, repeatableQuests.activePlayerQuest, dynamicActivities]);

    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog, inv.inventory);
    const slayer = useSlayer(initialState.slayerTask, quests.playerQuests, {
        addLog,
        addXp: char.addXp,
        modifyItem: inv.modifyItem,
        combatLevel: char.combatLevel,
        slayerLevel: char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1,
        slayerCredits,
        slayerTaskStreak,
        setSlayerCredits,
        setSlayerTaskStreak,
        setActiveShopId: ui.setActiveShopId,
    });

    const startCombat = useCallback((ids: string[]) => {
        const validIds = ids.filter(id => {
            const respawnTime = monsterRespawnTimers[id];
            const isRespawning = respawnTime && respawnTime > Date.now();
            if (isRespawning) return false;

            const monsterId = id.split(':')[1];
            const monster = MONSTERS[monsterId];
            if (!monster) return true;

            // Slayer requirements
            if (monster.slayerLevel && (char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1) < monster.slayerLevel) {
                addLog(`You need a Slayer level of ${monster.slayerLevel} to fight this creature.`);
                return false;
            }

            return true;
        });

        if (validIds.length === 0) return;

        cancelCurrentAction();
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        ui.setCombatQueue(validIds);
        ui.setIsMandatoryCombat(false);
        setPoisonEvent(null); // Clear poison event on combat start
    }, [ui, cancelCurrentAction, monsterRespawnTimers]);

    // Add a wrapper for onStartCombat to handle single monster IDs from SceneView
    const onStartSingleCombat = useCallback((id: string) => {
        startCombat([id]);
    }, [startCombat]);

    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); }
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);

    /* FIX: Moved playerDeath declaration above handlePlayerDeath to fix block-scoped variable usage error. */
    const playerDeath = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, playerQuests: quests.playerQuests, onItemDropped, setWorldState, playerType: initialState.playerType, slotId, onReturnToMenu: handleReturnToMenuWithLogout, repeatableQuests, setDynamicActivities, worldState, onResetGame, setActivePrayers: prayer.setActivePrayers });

    const handlePlayerDeath = useCallback((currentState: any) => { playerDeath.handlePlayerDeath(currentState); handleCombatFinish(); }, [playerDeath, handleCombatFinish]);

    const gameState = useMemo(() => ({
        username: initialState.username,
        playerType: initialState.playerType,
        skills: char.skills.map(({ currentLevel, ...rest }) => rest), // Strip out currentLevel
        inventory: inv.inventory,
        bank: bank,
        coins: inv.coins,
        equipment: inv.equipment,
        combatStance: combatStance,
        stylesByWeaponType: stylesByWeaponType,
        currentHp: char.currentHp,
        currentPrayer: char.rawCurrentPrayer,
        runEnergy: char.runEnergy,
        isRunToggled: char.isRunToggled,
        isResting: char.isResting,
        agilityState: agility.agilityState,
        activePrayers: prayer.activePrayers,
        currentPoiId: session.currentPoiId,
        playerQuests: quests.playerQuests,
        lockedPois: quests.lockedPois,
        clearedSkillObstacles: clearedSkillObstacles,
        resourceNodeStates: skilling.resourceNodeStates,
        monsterRespawnTimers: monsterRespawnTimers,
        groundItems: allGroundItems,
        repeatableQuestsState: {
            boards: repeatableQuests.boards,
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask,
        slayerCredits: slayerCredits,
        slayerTaskStreak: slayerTaskStreak,
        worldState: worldState,
        bookmarks: bookmarks,
        autocastSpell: char.autocastSpell,
        settings: {
            showTooltips: ui.showTooltips,
            showXpDrops: ui.showXpDrops,
            confirmValuableDrops: ui.confirmValuableDrops,
            valuableDropThreshold: ui.valuableDropThreshold,
            showMinimapHealth: ui.showMinimapHealth,
            showCombatPlayerHealth: ui.showCombatPlayerHealth,
            showCombatEnemyHealth: ui.showCombatEnemyHealth,
            showHitsplats: ui.showHitsplats,
            isOneClickMode: ui.isOneClickMode,
            devSettings: {
                xpMultiplier: devMode.xpMultiplier,
                combatSpeedMultiplier: devMode.combatSpeedMultiplier,
                isPlayerInvisible: devMode.isPlayerInvisible,
                isAutoBankOn: devMode.isAutoBankOn,
                isGodModeOn: devMode.isGodModeOn,
            }
        },
        statModifiers: char.statModifiers,
        activeBuffs: char.activeBuffs,
        isDead: char.currentHp <= 0,
        combatLevel: char.combatLevel,
    }), [
        initialState.username, initialState.playerType,
        char.skills, combatStance, stylesByWeaponType, char.currentHp, char.rawCurrentPrayer, char.autocastSpell, char.statModifiers, char.activeBuffs, char.combatLevel, prayer.activePrayers, char.runEnergy, char.isRunToggled, char.isResting, agility.agilityState,
        inv.inventory, inv.coins, inv.equipment, bank, session.currentPoiId, quests.playerQuests, quests.lockedPois, clearedSkillObstacles,
        skilling.resourceNodeStates, monsterRespawnTimers, allGroundItems, repeatableQuests, slayer.slayerTask, slayerCredits, slayerTaskStreak, worldState,
        ui.showTooltips, ui.showXpDrops, ui.confirmValuableDrops, ui.valuableDropThreshold, ui.showMinimapHealth, ui.showCombatPlayerHealth, ui.showCombatEnemyHealth, ui.showHitsplats, ui.isOneClickMode,
        devMode.xpMultiplier, devMode.combatSpeedMultiplier, devMode.isPlayerInvisible, devMode.isAutoBankOn, devMode.isGodModeOn, bookmarks
    ]);

    useEffect(() => {
        handlePlayerDeathRef.current = () => handlePlayerDeath(gameState);
    }, [gameState, handlePlayerDeath]);

    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: setCombatStance, bankPlaceholders: worldState.bankPlaceholders ?? false });

    const setWindmillFlour = useCallback((updater: React.SetStateAction<number>) => {
        setWorldState(prev => {
            const newFlour = typeof updater === 'function' ? updater(prev.windmillFlour) : updater;
            return { ...prev, windmillFlour: newFlour };
        });
    }, []);

    const onCreateBonfire = useCallback((logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;

        // Check for Sorcerer's Trial quest routing
        const trialQuest = quests.playerQuests.find(q => q.questId === 'the_sorcerers_trial');
        if (trialQuest && !trialQuest.isComplete && session.currentPoiId === 'sp_ancient_monolith') {
            const currentFires = worldState.monolithFires || {};
            const pits = ['monolith_pit_1', 'monolith_pit_2', 'monolith_pit_3', 'monolith_pit_4'];
            const emptyPit = pits.find(pid => !currentFires[pid] || currentFires[pid].expiresAt <= Date.now());

            if (emptyPit) {
                const duration = (30 + recipe.level * 2) * 1000;
                setWorldState(prev => ({
                    ...prev,
                    monolithFires: {
                        ...(prev.monolithFires || {}),
                        [emptyPit]: {
                            logType: logId,
                            expiresAt: Date.now() + duration
                        }
                    }
                }));
                addLog(`You light the fire in the ${emptyPit.replace('monolith_pit_', 'fire pit ')}.`);
                return;
            }
        }

        const duration = (30 + recipe.level * 2) * 1000;
        const newBonfire: BonfireActivity = {
            type: 'bonfire',
            uniqueId: `${session.currentPoiId}-${Date.now()}`,
            logId,
            expiresAt: Date.now() + duration,
            poiId: session.currentPoiId,
        };
        setBonfires(prev => [...prev, newBonfire]);
    }, [session.currentPoiId, quests.playerQuests, worldState.monolithFires, setWorldState, addLog]);

    const handleUnlockAllMusic = useCallback(() => {
        const allIds = MUSIC_TRACKS.map(t => t.id);
        setWorldState(prev => ({
            ...prev,
            unlockedMusicTracks: Array.from(new Set([...prev.unlockedMusicTracks, ...allIds]))
        }));
        addLog("System: All music tracks unlocked.");
    }, [setWorldState, addLog, MUSIC_TRACKS]);

    const onRefreshBonfire = useCallback((bonfireId: string, logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        setBonfires(prev => prev.map(b =>
            b.uniqueId === bonfireId
                ? { ...b, expiresAt: Date.now() + duration }
                : b
        ));
    }, []);

    // Item Expiration Check
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            let inventoryChanged = false;
            let equipmentChanged = false;

            const newInventory = inv.inventory.map(slot => {
                if (slot && slot.expiresAt && now >= slot.expiresAt) {
                    const itemData = ITEMS[slot.itemId];
                    addLog(`Your ${itemData.name} has burnt out.`);
                    inventoryChanged = true;
                    return null;
                }
                return slot;
            });

            const newEquipment: Equipment = { ...inv.equipment };
            (Object.keys(newEquipment) as Array<keyof Equipment>).forEach(slotKey => {
                const slot = newEquipment[slotKey];
                if (slot && slot.expiresAt && now >= slot.expiresAt) {
                    const itemData = ITEMS[slot.itemId];
                    addLog(`Your ${itemData.name} has burnt out.`);
                    newEquipment[slotKey] = null;
                    equipmentChanged = true;
                }
            });

            if (inventoryChanged) {
                inv.setInventory(newInventory);
            }
            if (equipmentChanged) {
                inv.setEquipment(newEquipment);
            }

            // Monolith Fire Burnout
            const monolithFires = worldState.monolithFires || {};
            let monolithFiresChanged = false;
            const newMonolithFires = { ...monolithFires };

            Object.entries(monolithFires).forEach(([pitId, fire]) => {
                if (fire && fire.expiresAt && now >= fire.expiresAt) {
                    delete newMonolithFires[pitId];
                    monolithFiresChanged = true;
                    // Drop ashes at the monolith
                    onItemDropped({ itemId: 'ashes', quantity: 1 }, 'sp_ancient_monolith');
                    addLog(`The fire in the ${pitId.replace('monolith_pit_', 'fire pit ')} has burnt out, leaving only ashes.`);
                }
            });

            if (monolithFiresChanged) {
                setWorldState(prev => ({ ...prev, monolithFires: newMonolithFires }));
            }

        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [inv.inventory, inv.equipment, inv.setInventory, inv.setEquipment, addLog, worldState.monolithFires, setWorldState, onItemDropped]);

    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, checkQuestProgressOnOffer: questLogic.checkQuestProgressOnOffer, advanceTutorial: (condition: string) => { }, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment, setEquipment: inv.setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire, isInCombat, currentPrayer: char.currentPrayer, setCurrentPrayer: char.setCurrentPrayer, setIsResting: char.setIsResting, setInventory: inv.setInventory, setBank });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour: worldState.windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction, setInventory: inv.setInventory, equipment: inv.equipment, setIsResting: char.setIsResting, setWorldState });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session, setIsResting: char.setIsResting, slayer, bankLogic });
    const { handleDialogueCheck, onResponse, handleDialogueAction } = dialogueActions;

    useEffect(() => {
        questLogic.checkGatherQuests();
    }, [inv.inventory, quests.playerQuests.length, quests.playerQuests.map(q => q.currentStage).join(',')]);

    // Auto-trigger Leo's dialogue for new players
    useEffect(() => {
        const tutorialQuest = quests.playerQuests.find(q => q.questId === 'embrune_101');
        const isFirstSpawn = tutorialQuest && tutorialQuest.currentStage === 0 && !tutorialQuest.isComplete && session.currentPoiId === 'tutorial_entrance';

        if (isFirstSpawn && !ui.activeDialogue && !isTraveling && !ui.isBusy) {
            const questData = QUESTS['embrune_101'];
            if (questData && questData.dialogue && questData.dialogue['in_progress_embrune_101_0']) {
                ui.setActiveDialogue({
                    npcName: questData.dialogue['in_progress_embrune_101_0'].npcName,
                    npcIcon: questData.dialogue['in_progress_embrune_101_0'].npcIcon,
                    nodes: questData.dialogue,
                    currentNodeKey: 'in_progress_embrune_101_0',
                    onEnd: () => ui.setActiveDialogue(null),
                    onResponse: onResponse,
                    handleDialogueCheck: handleDialogueCheck
                });
            }
        }
    }, [quests.playerQuests, session.currentPoiId, ui, onResponse, handleDialogueCheck, isTraveling]);

    const itemActions = useItemActions({
        addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp,
        currentPrayer: char.currentPrayer, maxPrayer: char.maxPrayer, setCurrentPrayer: char.setCurrentPrayer,
        setRunEnergy: char.setRunEnergy, restoreNegativeStatModifiers: char.restoreNegativeStatModifiers,
        applyStatModifier: char.applyStatModifier, addBuff: char.addBuff, curePoison: char.curePoison, setInventory: inv.setInventory,
        skills: char.skills, inventory: inv.inventory, activeBuffs: char.activeBuffs, activeCraftingAction: ui.activeCraftingAction,
        setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem,
        addXp: char.addXp, openCraftingView: ui.openCraftingView, itemToUse: ui.itemToUse, setItemToUse: ui.setItemToUse,
        setConfirmationPrompt: ui.setConfirmationPrompt,
        setMakeXPrompt: ui.setMakeXPrompt,
        startQuest: (questId) => { quests.startQuest(questId, addLog); },
        currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, isStunned: char.isStunned,
        setActiveDungeonMap: ui.setActiveDungeonMap, confirmValuableDrops: ui.confirmValuableDrops,
        valuableDropThreshold: ui.valuableDropThreshold, ui, equipment: inv.equipment, onResponse, handleDialogueCheck, setEquipment: inv.setEquipment,
        navigation,
        rangeCooldowns,
        setRangeCooldowns,
        worldState,
        setWorldState,
        setIsResting: char.setIsResting,
        combatSpeedMultiplier,
        crafting: {
            handleCooking: crafting.handleCooking,
            handleSmelting: crafting.handleSmelting,
            handleStokeBonfire: crafting.handleStokeBonfire,
            handleJewelryCrafting: crafting.handleJewelryCrafting,
        }
    });

    const spellActions = useSpellActions({
        addLog,
        addXp: char.addXp,
        modifyItem: inv.modifyItem,
        hasItems: inv.hasItems,
        skills: char.skills,
        ui,
        equipment: inv.equipment,
        currentPoiId: session.currentPoiId,
        setInventory: inv.setInventory,
        char,
        combatSpeedMultiplier
    });

    const sceneInteractions = useSceneInteractions(session.currentPoiId, {
        playerQuests: quests.playerQuests,
        setActiveDialogue: ui.setActiveDialogue,
        handleDialogueCheck,
        onResponse,
        addLog,
        inventory: inv.inventory,
        setIsResting: char.setIsResting,
    });

    useWorldEvents({ session, worldState, setWorldState, char, inv, addLog, questLogic, playerQuests: quests.playerQuests });

    // Swamp ejection: if the player is in a deep swamp POI without sufficient quest progress, teleport them out.
    useEffect(() => {
        const DEEP_SWAMP_POIS = new Set([
            'mangrove_thicket_west', 'serpent_nesting_ground', 'flooded_forest',
            'murky_channel_east', 'isolated_islet', 'shipwreck_shallows',
            'sunken_temple_approach', 'sunken_temple_altar', 'hex_altar',
        ]);
        if (!DEEP_SWAMP_POIS.has(session.currentPoiId)) return;

        const swampQuest = quests.playerQuests.find(q => q.questId === 'scales_of_the_swamp');
        const questStage = swampQuest ? (swampQuest.isComplete ? 999 : swampQuest.currentStage) : -1;

        if (questStage < 3) {
            addLog("The miasma is too thick without the ward. You are forced back to the entrance.");
            navigation.handleForcedNavigate('serpents_coil_entrance');
        }
    }, [session.currentPoiId, quests.playerQuests, navigation, addLog]);


    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn, setWorldState, addLog, worldState, inv, navigation });
    const handleKill = useCallback((id: string, style?: 'melee' | 'ranged' | 'magic') => { killHandler.handleKill(id, style); }, [killHandler]);
    const handleEncounterWin = useCallback((ids: string[]) => { killHandler.handleEncounterWin(ids); }, [killHandler]);

    // Interruption logic for cast bars / actions when taking damage
    const prevHpRef = useRef(char.currentHp);
    useEffect(() => {
        if (char.currentHp < prevHpRef.current) {
            const damage = prevHpRef.current - char.currentHp;
            if (damage > 0 && ui.activeSingleAction?.interruptOnDamage) {
                ui.setActiveSingleAction(null);
                addLog("Your action was interrupted!");
            }
        }
        prevHpRef.current = char.currentHp;
    }, [char.currentHp, ui.activeSingleAction, addLog, ui]);

    const spellcasting = useSpellcasting({
        char,
        inv,
        addLog,
        navigation,
        ui,
        isStunned: char.isStunned,
        combatSpeedMultiplier,
        setIsResting: char.setIsResting,
    });

    useSaveGame(gameState, slotId);

    const onWinCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        handleCombatFinish();
        setPoisonEvent(null); // Clear poison event on combat end
    }, [ui, handleCombatFinish]);

    const onFleeFromCombat = useCallback((defeatedIds: string[]) => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        setPoisonEvent(null); // Clear poison event on flee

        if (defeatedIds.length > 0) {
            killHandler.handleEncounterWin(defeatedIds);
        }

        const fleePoiId = session.currentPoiId;
        setWorldState(ws => ({
            ...ws,
            poiImmunity: {
                ...(ws.poiImmunity ?? {}),
                [fleePoiId]: Date.now() + 10000 // 10 seconds immunity for this POI
            }
        }));
        addLog("You flee from combat, gaining 10 seconds of aggression immunity in this area.");
    }, [ui, addLog, session, setWorldState, killHandler]);

    useAggression(
        poi,
        true, // isGameLoaded
        isBusy,
        isInCombat,
        isTraveling,
        char.combatLevel,
        startCombat,
        addLog,
        monsterRespawnTimers,
        ui.isPermAggroOn,
        devMode.isPlayerInvisible,
        false, // isPlayerImmune
        inv.equipment,
        inv.inventory,
        char.skills,
        inv.setEquipment,
        worldState,
        setWorldState,
        repeatableQuests.activePlayerQuest
    );

    useEffect(() => { questLogic.checkGatherQuests(); }, [inv.inventory, questLogic]);

    useEffect(() => {
        if (initialState.settings) {
            const s = initialState.settings;
            ui.setShowTooltips(s.showTooltips ?? true);
            ui.setShowXpDrops(s.showXpDrops ?? true);
            ui.setConfirmValuableDrops(s.confirmValuableDrops ?? true);
            ui.setValuableDropThreshold(s.valuableDropThreshold ?? 1000);
            ui.setShowMinimapHealth(s.showMinimapHealth ?? false);
            ui.setShowCombatPlayerHealth(s.showCombatPlayerHealth ?? false);
            ui.setShowCombatEnemyHealth(s.showCombatEnemyHealth ?? false);
            ui.setShowHitsplats(s.showHitsplats ?? true);
            ui.setIsOneClickMode(s.isOneClickMode ?? false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBonfireTick = useCallback(() => {
        const now = Date.now();
        setBonfires(prevBonfires => {
            const activeBonfires: BonfireActivity[] = [];
            let changed = false;
            prevBonfires.forEach(bonfire => {
                if (now >= bonfire.expiresAt) {
                    changed = true;
                    onItemDropped({ itemId: 'ashes', quantity: 1 }, bonfire.poiId);
                    addLog("A fire has burnt out, leaving a pile of ashes.");
                } else {
                    activeBonfires.push(bonfire);
                }
            });
            return changed ? activeBonfires : prevBonfires;
        });
    }, [addLog, onItemDropped]);

    const bonfireCallbackRef = useRef(handleBonfireTick);
    useEffect(() => { bonfireCallbackRef.current = handleBonfireTick; });

    useEffect(() => {
        const interval = setInterval(() => bonfireCallbackRef.current(), 1000);
        return () => clearInterval(interval);
    }, []);


    const handleToggleBankPlaceholders = useCallback(() => {
        setWorldState(ws => ({ ...ws, bankPlaceholders: !ws.bankPlaceholders }));
    }, []);

    const handleDeathMarkerTick = useCallback(() => {
        setWorldState(ws => {
            if (!ws.deathMarker) return ws;
            const newTime = ws.deathMarker.timeRemaining - 1000;
            if (newTime <= 0) {
                addLog("Your dropped items from your previous death have disappeared.");
                clearDeathPileItemsAtPoi(ws.deathMarker.poiId);
                return { ...ws, deathMarker: null };
            }
            return { ...ws, deathMarker: { ...ws.deathMarker, timeRemaining: newTime } };
        });
    }, [addLog, clearDeathPileItemsAtPoi]);

    const deathMarkerCallbackRef = useRef(handleDeathMarkerTick);
    useEffect(() => { deathMarkerCallbackRef.current = handleDeathMarkerTick; });

    useEffect(() => {
        const interval = setInterval(() => deathMarkerCallbackRef.current(), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleMonsterRespawnCleanup = useCallback(() => {
        const now = Date.now();
        setMonsterRespawnTimers(prev => {
            let changed = false;
            const next = { ...prev };
            for (const [id, time] of Object.entries(next)) {
                if ((time as number) <= now) {
                    delete next[id];
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, []);

    const monsterRespawnCleanupRef = useRef(handleMonsterRespawnCleanup);
    useEffect(() => { monsterRespawnCleanupRef.current = handleMonsterRespawnCleanup; });

    useEffect(() => {
        const interval = setInterval(() => monsterRespawnCleanupRef.current(), 5000);
        return () => clearInterval(interval);
    }, []);

    // POI Immunity Timer UI Logic
    useEffect(() => {
        const poiImmunityExpiry = worldState.poiImmunity?.[session.currentPoiId];
        if (!poiImmunityExpiry) {
            setPoiImmunityTimeLeft(0);
            return;
        }
        const timer = setInterval(() => {
            const now = Date.now();
            if (now < poiImmunityExpiry) {
                setPoiImmunityTimeLeft(Math.ceil((poiImmunityExpiry - now) / 1000));
            } else {
                setPoiImmunityTimeLeft(0);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [worldState.poiImmunity, session.currentPoiId]);

    // Grant Immunity on Entering Death POI
    useEffect(() => {
        const needsImmunity = !!worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
        if (needsImmunity) {
            const immunityDuration = 30 * 1000;
            const expiryTime = Date.now() + immunityDuration;

            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                return {
                    ...ws,
                    deathMarker: { ...ws.deathMarker, immunityGranted: true },
                    poiImmunity: {
                        ...(ws.poiImmunity ?? {}),
                        [session.currentPoiId]: expiryTime
                    }
                };
            });
            addLog(`You are immune to monster aggression in this area for 30 seconds.`);
        }
    }, [session.currentPoiId, worldState.deathMarker, addLog, setWorldState]);

    useEffect(() => {
        const quest = repeatableQuests.activePlayerQuest;
        if (quest && quest.generatedQuest.id === 'kill_rats_meadowdale' && quest.progress >= quest.generatedQuest.requiredQuantity) {
            if (session.currentPoiId === 'tavern_cellar') {
                // Turn in the quest automatically
                repeatableQuests.handleTurnInRepeatableQuest();

                addLog("You've cleared the cellar! You are automatically moved back upstairs.");

                const cellarItems = allGroundItems['tavern_cellar'] || [];
                cellarItems.forEach(item => onItemDropped(item.item, 'the_rusty_flagon'));
                clearAllItemsAtPoi('tavern_cellar');

                navigation.handleForcedNavigate('the_rusty_flagon');
            }
        }
    }, [repeatableQuests.activePlayerQuest, session.currentPoiId, repeatableQuests, addLog, allGroundItems, onItemDropped, clearAllItemsAtPoi, navigation]);

    useEffect(() => {
        if (!ui.activeSingleAction) return;

        const { startTime, duration, onComplete } = ui.activeSingleAction;
        const elapsed = Date.now() - startTime;
        const remaining = duration - elapsed;

        if (remaining <= 0) {
            onComplete();
            ui.setActiveSingleAction(null);
            return;
        }

        const timer = setTimeout(() => {
            onComplete();
            ui.setActiveSingleAction(null);
        }, remaining);

        return () => clearTimeout(timer);
    }, [ui.activeSingleAction, ui.setActiveSingleAction]);

    const handleActivityClickWrapper = (activity: POIActivity) => {
        cancelCurrentAction();
        if (ui.itemToUse) {
            itemActions.handleUseItemOnActivity(ui.itemToUse, activity);
            ui.setItemToUse(null);
        } else if (ui.spellToCast) {
            addLog("You can't cast that on the environment.");
            ui.setSpellToCast(null);
        } else if (activity.type === 'npc' && activity.name === 'Leave House') {
            thievingPilfering.leaveHouse();
            return;
        } else if (activity.type === 'npc' && activity.name === 'Altar') {
            handleDialogueAction([{ type: 'restore_prayer' }]);
            return;
        } else if (activity.type === 'start_agility_course') {
            agility.startCourse(activity.courseId);
        } else if (activity.type === 'npc' || activity.type === 'slayer_master') {
            sceneInteractions.handleActivityClick(activity);
        } else {
            handleNonNpcActivity(activity);
        }
    };

    const handleNonNpcActivity = useCallback((activity: POIActivity) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        if (char.isStunned) { addLog("You are stunned and cannot perform actions."); return; }
        if (activity.type === 'shop') ui.setActiveShopId(activity.shopId);
        else if (activity.type === 'bank') ui.setActivePanel('bank');
        else if (activity.type === 'blimp_travel') {
            const slayerLevel = char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1;
            const requiredLevel = activity.requiredSlayerLevel ?? 50;
            if (slayerLevel < requiredLevel) {
                addLog(`You need a Slayer level of ${requiredLevel} to use this service.`);
            } else if (activity.cost && inv.coins < activity.cost) {
                addLog(`You need ${activity.cost} coins to use the blimp.`);
            } else {
                if (activity.cost) {
                    inv.modifyItem('coins', -activity.cost);
                }
                const destination = activity.destinationPoiId || 'duskwatch_landing';
                session.setCurrentPoiId(destination);
                addLog(`The blimp whisks you away to your destination: ${destination.replace(/_/g, ' ')}.`);
            }
        }
        else if (activity.type === 'cooking_range' || activity.type === 'bonfire') ui.openCraftingView({ type: 'cooking_range' });
        else if (activity.type === 'furnace') ui.openCraftingView({ type: 'furnace' });
        else if (activity.type === 'anvil') ui.openCraftingView({ type: 'anvil' });
        else if (activity.type === 'bookbinding_workbench') ui.openCraftingView({ type: 'bookbinding' });
        else if (activity.type === 'spinning_wheel') ui.openCraftingView({ type: 'spinning_wheel' });
        else if (activity.type === 'wishing_well') worldActions.handleWishingWell();
        else if (activity.type === 'water_source') worldActions.handleCollectWater(activity);
        else if (activity.type === 'milking') worldActions.handleMilking();
        else if (activity.type === 'windmill') worldActions.handleMillWheat();
        else if (activity.type === 'ancient_chest') worldActions.handleOpenAncientChest();
        else if (activity.type === 'runecrafting_altar') crafting.handleInstantRunecrafting(activity.runeId);
        else if (activity.type === 'ladder') navigation.handleForcedNavigate(activity.toPoiId);
        else if (activity.type === 'thieving_lockpick') thieving.handleLockpick(activity);
        else if (activity.type === 'thieving_stall') thieving.handleStealFromStall(activity);
        else if (activity.type === 'thieving_pilfer') thievingPilfering.handlePilfer(activity);
        else if (activity.type === 'cut_cactus') worldActions.handleCutCactus();
        else if (activity.type === 'sand_pit') worldActions.handleSandPit();
        else if (activity.type === 'ground_item') skilling.handlePickupGroundItem(activity);
        else if (activity.type === 'quest_board') ui.setActiveQuestBoardId(session.currentPoiId);
    }, [char, addLog, ui, slayer, worldActions, crafting, navigation, session, thieving, thievingPilfering, skilling, inv]);

    const gridItems = useMemo(() => {
        const grid: (POI | { type: 'obstacle'; fromPoiId: string; toPoiId: string; requirement: any })[][] = Array(9).fill(null).map(() => []);
        if (!poi || !poi.connections) return grid;

        const getDirectionalGridIndex = (angle: number): number => {
            if (angle > -22.5 && angle <= 22.5) return 5; // E
            if (angle > 22.5 && angle <= 67.5) return 8; // SE
            if (angle > 67.5 && angle <= 112.5) return 7; // S
            if (angle > 112.5 && angle <= 157.5) return 6; // SW
            if (angle > 157.5 || angle <= -157.5) return 3; // W
            if (angle > -157.5 && angle <= -112.5) return 0; // NW
            if (angle > -112.5 && angle <= -67.5) return 1; // N
            if (angle > -67.5 && angle <= -22.5) return 2; // NE
            return 1; // Fallback
        };

        poi.connections.forEach(connId => {
            const destinationPoi = POIS[connId];
            if (!destinationPoi) return;

            let startX = poi.internalX ?? poi.x;
            let startY = poi.internalY ?? poi.y;
            let endX, endY;

            if (poi.type === 'internal' && destinationPoi.type !== 'internal') {
                startX = poi.eX ?? startX;
                startY = poi.eY ?? startY;
                endX = destinationPoi.x;
                endY = destinationPoi.y;
            } else if (poi.type !== 'internal' && destinationPoi.type === 'internal') {
                startX = poi.x;
                startY = poi.y;
                endX = destinationPoi.eX ?? destinationPoi.x;
                endY = destinationPoi.eY ?? destinationPoi.y;
            } else {
                endX = destinationPoi.internalX ?? destinationPoi.x;
                endY = destinationPoi.internalY ?? destinationPoi.y;
            }

            const dx = endX - startX;
            const dy = endY - startY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const gridIndex = getDirectionalGridIndex(angle);

            const obstacleId = `${poi.id}-${connId}`;
            const requirement = poi.connectionRequirements?.[connId];
            if (requirement && !clearedSkillObstacles.includes(obstacleId)) {
                grid[gridIndex].push({ type: 'obstacle', fromPoiId: poi.id, toPoiId: connId, requirement });
            } else {
                grid[gridIndex].push(destinationPoi);
            }
        });

        return grid;
    }, [poi, clearedSkillObstacles]);

    const handleTravelKey = useCallback((direction: Direction) => {
        const dirMap: Record<Direction, number> = {
            'NW': 0, 'N': 1, 'NE': 2,
            'W': 3, 'E': 5,
            'SW': 6, 'S': 7, 'SE': 8
        };
        const gridIndex = dirMap[direction];
        const cellItems = gridItems[gridIndex];

        if (cellItems && cellItems.length > 0) {
            const item = cellItems[0];
            if ('id' in item) {
                navigation.handleNavigate(item.id);
            } else if ('type' in item && item.type === 'obstacle') {
                worldActions.handleClearObstacle(item.fromPoiId, item.toPoiId, item.requirement);
            }
        }
    }, [gridItems, navigation]);

    const handleActionKey = useCallback((index: number, isShiftPressed: boolean) => {
        if (!poi || ui.combatQueue.length > 0) return;

        let activity: POIActivity | BonfireActivity | null = null;
        let isCombat = false;
        let uniqueId = "";

        // Filter activities using the EXACT SAME logic as SceneView.tsx
        const visibleActivities = (poi.activities ?? []).filter(act => {
            const pAct = act as any;

            // 1. quest_start check
            if (pAct.type === 'quest_start' && quests.playerQuests.some(q => q.questId === pAct.questId)) return false;

            // 2. questCondition check
            if (pAct.questCondition) {
                const questCond = pAct.questCondition;
                const activeRepeatableQuest = repeatableQuests.activePlayerQuest;
                const isRepeatableQuestActive = activeRepeatableQuest?.questId === questCond.questId;
                const mainQuest = quests.playerQuests.find(q => q.questId === questCond.questId);

                let isMainQuestVisible = false;
                if (mainQuest) {
                    if (mainQuest.isComplete) {
                        isMainQuestVisible = !!questCond.visibleAfterCompletion;
                    } else {
                        isMainQuestVisible = questCond.stages.includes(mainQuest.currentStage);
                    }
                }
                if (!isRepeatableQuestActive && !isMainQuestVisible) return false;
            }

            // 3. visibilityCheck check
            if (pAct.type === 'npc' && pAct.visibilityCheck) {
                if (!handleDialogueCheck(pAct.visibilityCheck)) {
                    return false;
                }
            }

            return true;
        });

        if (index < visibleActivities.length) {
            activity = visibleActivities[index];
            if (activity.type === 'combat') {
                isCombat = true;
                const originalIndex = (poi.activities ?? []).indexOf(activity);
                uniqueId = `${poi.id}:${activity.monsterId}:${originalIndex}`;
            }
        } else {
            let offset = visibleActivities.length;
            if (bonfires.length > 0) {
                const bonfireIdx = index - offset;
                if (bonfireIdx >= 0 && bonfireIdx < bonfires.length) {
                    activity = bonfires[bonfireIdx];
                }
                offset += bonfires.length;
            }

            if (!activity && repeatableQuests.activePlayerQuest && index === offset) {
                interactQuest.handleStartInteractQuest(repeatableQuests.activePlayerQuest);
                return;
            }
        }

        if (!activity) return;

        if (isShiftPressed) {
            let options: ContextMenuOption[] = [];
            let title = 'Options';

            if (activity && typeof activity === 'object' && 'type' in activity) {
                const act = activity as POIActivity;
                if (act.type === 'npc' || act.type === 'slayer_master') {
                    title = act.name;
                    const actActions = (act as any).actions as (
                        | { label: string; action: 'open_bank' | 'deposit_backpack' | 'deposit_equipment' }
                        | { type: 'shop'; label: string; shopId: string }
                    )[] | undefined;

                    const isBanker = actActions?.some(a => 'action' in a && a.action === 'open_bank');
                    const isAltar = act.name === 'Altar';

                    if (!isBanker && !isAltar) {
                        options.push({ label: 'Talk to', onClick: () => { handleActivityClickWrapper(act); return false; } });
                    }
                    if (isAltar) {
                        options.push({ label: 'Pray', onClick: () => { handleActivityClickWrapper(act); return false; } });
                    }
                    if (act.type === 'npc' && act.pickpocket) {
                        options.push({
                            label: 'Pickpocket',
                            onClick: () => {
                                const originalIndex = (poi.activities ?? []).indexOf(act);
                                const pickpocketId = `${poi.id}:${act.name}:${originalIndex}`;
                                thieving.handlePickpocket({ name: act.name, pickpocket: act.pickpocket }, pickpocketId);
                                return false;
                            }
                        });
                    }
                    if (act.type === 'npc' && act.attackableMonsterId) {
                        const originalIndex = (poi.activities ?? []).indexOf(act);
                        const combatId = `${poi.id}:${act.attackableMonsterId}:${originalIndex}`;
                        const respawnTimestamp = monsterRespawnTimers[combatId];
                        const isRespawning = respawnTimestamp && respawnTimestamp > Date.now();

                        options.push({
                            label: <AttackLabel monsterName={MONSTERS[act.attackableMonsterId]?.name || act.name} respawnTimestamp={respawnTimestamp} />,
                            onClick: () => {
                                startCombat([combatId]);
                                return false;
                            },
                            disabled: !!isRespawning
                        });
                    }
                    if (actActions) {
                        actActions.forEach(action => {
                            let onClick = () => { };
                            if ('action' in action) {
                                if (action.action === 'open_bank') onClick = () => ui.setActivePanel('bank');
                                else if (action.action === 'deposit_backpack') onClick = () => bankLogic.handleDepositBackpack(ui.activeBankTabId);
                                else if (action.action === 'deposit_equipment') onClick = () => bankLogic.handleDepositEquipment(ui.activeBankTabId);
                            } else if ('type' in action && action.type === 'shop') {
                                onClick = () => ui.setActiveShopId(action.shopId);
                            }
                            options.push({ label: action.label, onClick: () => { onClick(); return false; } });
                        });
                    }
                } else if (act.type === 'furnace') {
                    title = 'Furnace';
                    options = [
                        { label: 'Smelt', onClick: () => { ui.openCraftingView({ type: 'furnace' }); return false; } },
                        { label: 'Craft Jewelry', onClick: () => { ui.openCraftingView({ type: 'jewelry' }); return false; } }
                    ];
                } else if (act.type === 'anvil') {
                    title = 'Anvil';
                    options = [{ label: 'Smith', onClick: () => { ui.openCraftingView({ type: 'anvil' }); return false; } }];
                } else if (act.type === 'cooking_range') {
                    title = 'Cooking Range';
                    options = [
                        { label: 'Cook', onClick: () => { handleActivityClickWrapper(act); return false; } },
                        { label: 'Rendering', onClick: () => { ui.openCraftingView({ type: 'rendering' }); return false; } }
                    ];
                }
            }

            // Fallback for missing context menu
            if (options.length === 0) {
                options.push({ label: 'Close', onClick: () => false });
                ui.setContextMenu({
                    options,
                    title: 'System Info',
                    triggerEvent: {
                        clientX: window.innerWidth / 2,
                        clientY: window.innerHeight / 2
                    } as any,
                    isTouchInteraction: false,
                    content: (
                        <div className="text-xs text-gray-400 italic mt-2 px-2 pb-1 text-center">
                            Please report this entry to the developer with a screenshot if you expected options here.
                        </div>
                    )
                });
                return;
            }

            const buttonEl = document.querySelector(`[data-tutorial-id="activity-button-${index}"]`);
            const rect = buttonEl?.getBoundingClientRect();
            const mockEvent = {
                clientX: rect ? rect.left : window.innerWidth / 2,
                clientY: rect ? rect.bottom : window.innerHeight / 2,
            } as any as React.MouseEvent;

            ui.setContextMenu({
                options,
                title,
                triggerEvent: mockEvent,
                isTouchInteraction: false
            });
        } else {
            if (isCombat) {
                startCombat([uniqueId]);
            } else {
                handleActivityClickWrapper(activity as POIActivity);
            }
        }
    }, [poi, bonfires, repeatableQuests.activePlayerQuest, handleActivityClickWrapper, interactQuest.handleStartInteractQuest, onStartSingleCombat, addLog, thieving, ui, bankLogic, startCombat, quests.playerQuests]);

    const handleToggleDevPanel = useCallback(() => {
        ui.setIsDevPanelOpen(prev => !prev);
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [ui]);

    useKeyboardManager({
        keybindings: ui.keybindings,
        isBusy,
        hasActiveDialogue: !!ui.activeDialogue,
        onTravel: handleTravelKey,
        onAction: handleActionKey,
        onEsc: () => {
            if (!ui.isMapManagerOpen) {
                ui.closeAllModals();
            }
        },
        onPanelSwitch: (panel) => {
            if (panel === 'dev') {
                // Dev Panel restriction
                if (initialState.playerType === PlayerType.Cheats) {
                    handleToggleDevPanel();
                }
                return;
            }

            ui.setActivePanel(panel);
        },
        onSlash: () => {
            // This will be handled by ActivityLog focusing on /
        },
        onR: () => {
            // This will be handled by ActivityLog focusing on /r
        }
    });

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;

    // Dev Handlers
    const handleHealPlayer = useCallback(() => char.setCurrentHp(char.maxHp), [char]);
    const handleKillMonster = useCallback(() => { if (ui.combatQueue.length > 0) setKillTrigger(k => k + 1); }, [ui.combatQueue]);
    const handleAddCoins = useCallback((amount: number) => inv.modifyItem('coins', amount, false), [inv]);
    const handleSetSkillLevel = useCallback((skill: SkillName, level: number) => char.setSkillLevel(skill, level), [char]);
    const handleResetQuest = useCallback((questId: string) => {
        quests.resetQuest(questId, addLog);
        questLogic.cleanupQuestState(questId);
    }, [quests, questLogic, addLog]);
    const handleMaxCharacter = useCallback(() => char.setAllSkillsLevel(99), [char]);
    const handleTrialTestBoost = useCallback(() => {
        const requiredQuestIds = ['the_saints_first_step', 'the_arcane_awakening', 'whispers_of_the_divine'];
        quests.setPlayerQuests(prev => {
            let next = [...prev];
            requiredQuestIds.forEach(id => {
                const existingIndex = next.findIndex(q => q.questId === id);
                if (existingIndex >= 0) {
                    next[existingIndex] = { ...next[existingIndex], isComplete: true };
                } else {
                    next.push({ questId: id, currentStage: 99, isComplete: true, progress: 0 });
                }
            });
            return next;
        });

        const combatSkills = [SkillName.Attack, SkillName.Strength, SkillName.Defence, SkillName.Ranged, SkillName.Magic, SkillName.Hitpoints, SkillName.Prayer];
        (Object.values(SkillName) as SkillName[]).forEach(name => {
            let targetLevel = 45;
            if (combatSkills.includes(name)) {
                targetLevel = 65;
            } else if (name === SkillName.Runecrafting) {
                targetLevel = 60;
            }
            char.setSkillLevel(name, targetLevel);
        });
        char.setCurrentHp(char.maxHp);
        char.setCurrentPrayer(char.maxPrayer);
        addLog("Dev: Trial test boost applied! Skills 65/45 and required quests completed.");
    }, [quests, char, addLog]);


    const handleAdjustQuestStage = useCallback((questId: string, amount: number) => {
        questLogic.cleanupQuestState(questId);
        quests.setPlayerQuests(prev => {
            const existingIndex = prev.findIndex(q => q.questId === questId);
            if (existingIndex === -1) {
                // If quest not started, start at stage 0 (amount 1) or don't do anything for -1
                if (amount <= 0) return prev;
                return [...prev, { questId, currentStage: 0, isComplete: false, progress: 0 }];
            }

            const quest = prev[existingIndex];
            const questData = QUESTS[questId];
            if (!questData) return prev;

            const next = [...prev];
            const newStage = Math.max(0, quest.currentStage + amount);
            const isComplete = newStage >= questData.stages.length;

            next[existingIndex] = {
                ...quest,
                currentStage: isComplete ? questData.stages.length - 1 : newStage,
                isComplete: isComplete,
                progress: 0 // Reset progress when jumping stages
            };
            return next;
        });
        addLog(`Dev: Adjusted ${questId} stage by ${amount}.`);
    }, [quests, questLogic, addLog]);


    const handleLogout = useCallback(() => {
        handleReturnToMenuWithLogout(gameState);
    }, [handleReturnToMenuWithLogout, gameState]);

    const buffsForDisplay = useMemo(() => {
        const allBuffs: (ActiveBuff | any)[] = [...char.activeBuffs];
        if (worldState.dehydrationLevel > 0) {
            allBuffs.push({
                id: -999,
                type: 'dehydration',
                value: worldState.dehydrationLevel,
                duration: Infinity,
                durationRemaining: Infinity
            });
        }

        const checkAndAddExpiryBuff = (slot: InventorySlot | null, idPrefix: string) => {
            if (slot && slot.expiresAt) {
                allBuffs.push({
                    id: `${idPrefix}-${slot.itemId}`,
                    type: 'item_expiry',
                    value: 0,
                    duration: slot.expiresAt - Date.now(),
                    durationRemaining: slot.expiresAt - Date.now(),
                    itemId: slot.itemId,
                });
            }
        };

        // Check equipment
        Object.values(inv.equipment).forEach((slot, index) => checkAndAddExpiryBuff(slot, `equip-${index}`));

        // Check inventory
        inv.inventory.forEach((slot, index) => checkAndAddExpiryBuff(slot, `inv-${index}`));

        return allBuffs;
    }, [char.activeBuffs, worldState.dehydrationLevel, inv.equipment, inv.inventory]);

    const wrappedItemActions = useMemo(() => ({
        ...itemActions,
        handleConsume: (...args: Parameters<typeof itemActions.handleConsume>) => {
            cancelCurrentAction();
            itemActions.handleConsume(...args);
        },
        handleBuryBones: (...args: Parameters<typeof itemActions.handleBuryBones>) => {
            cancelCurrentAction();
            itemActions.handleBuryBones(...args);
        },
        handleUseItemOn: (...args: Parameters<typeof itemActions.handleUseItemOn>) => {
            cancelCurrentAction();
            itemActions.handleUseItemOn(...args);
        },
        handleDivine: (...args: Parameters<typeof itemActions.handleDivine>) => {
            cancelCurrentAction();
            itemActions.handleDivine(...args);
        },
        handleReadMap: (...args: Parameters<typeof itemActions.handleReadMap>) => {
            cancelCurrentAction();
            itemActions.handleReadMap(...args);
        },
        handleTeleport: (...args: Parameters<typeof itemActions.handleTeleport>) => {
            cancelCurrentAction();
            itemActions.handleTeleport(...args);
        },
        handleCombine: (...args: Parameters<typeof itemActions.handleCombine>) => {
            cancelCurrentAction();
            itemActions.handleCombine(...args);
        },
    }), [itemActions, cancelCurrentAction]);

    const devPanelProps = useMemo(() => ({
        inv,
        setTooltip: ui.setTooltip,
        devPanelState: devMode.devPanelState,
        updateDevPanelState: devMode.updateDevPanelState,
        combatSpeedMultiplier: devMode.combatSpeedMultiplier,
        setCombatSpeedMultiplier: devMode.setCombatSpeedMultiplier,
        isInstantRespawnOn: devMode.isInstantRespawnOn,
        setIsInstantRespawnOn: devMode.setIsInstantRespawnOn,
        instantRespawnCounter: devMode.instantRespawnCounter,
        setInstantRespawnCounter: devMode.setInstantRespawnCounter,
        isInCombat,
        isPermAggroOn: ui.isPermAggroOn,
        onTogglePermAggro: handleTogglePermAggro,
        isPlayerInvisible: devMode.isPlayerInvisible,
        setIsPlayerInvisible: devMode.setIsPlayerInvisible,
        isAutoBankOn: devMode.isAutoBankOn,
        setIsAutoBankOn: devMode.setIsAutoBankOn,
        isTouchSimulationEnabled: devMode.isTouchSimulationEnabled,
        onToggleTouchSimulation: devMode.onToggleTouchSimulation,
        showAllPois: devMode.showAllPois,
        onToggleShowAllPois: () => devMode.setShowAllPois(p => !p),
        onForcedNavigate: navigation.handleForcedNavigate,
        xpMultiplier: devMode.xpMultiplier,
        setXpMultiplier: devMode.setXpMultiplier,
        onClose: () => ui.setIsDevPanelOpen(false),
        onHealPlayer: handleHealPlayer,
        onKillMonster: handleKillMonster,
        onAddCoins: handleAddCoins,
        onSetSkillLevel: handleSetSkillLevel,
        onMaxCharacter: handleMaxCharacter,
        onResetQuest: handleResetQuest,
        onAdjustQuestStage: handleAdjustQuestStage,
        onResetQuestBoards: repeatableQuests.resetBoards,
        onResetPilferingHouses: thievingPilfering.resetPilferingTimers,
        onTrialTestBoost: handleTrialTestBoost,
        onUnlockAllMusic: handleUnlockAllMusic,
        isGodModeOn: devMode.isGodModeOn,
        setIsGodModeOn: devMode.setIsGodModeOn,
        ui,
        slayer,
        questVariables: worldState.questVariables || {},
        deleteQuestVariable: questLogic.deleteQuestVariable,
    }), [
        inv, ui, devMode.devPanelState, devMode.updateDevPanelState, devMode.combatSpeedMultiplier, devMode.setCombatSpeedMultiplier,
        devMode.isInstantRespawnOn, devMode.setIsInstantRespawnOn, devMode.instantRespawnCounter, devMode.setInstantRespawnCounter,
        isInCombat, ui.isPermAggroOn, handleTogglePermAggro, devMode.isPlayerInvisible,
        devMode.setIsPlayerInvisible, devMode.isAutoBankOn, devMode.setIsAutoBankOn, devMode.isTouchSimulationEnabled,
        devMode.onToggleTouchSimulation,
        devMode.showAllPois, devMode.setShowAllPois, navigation.handleForcedNavigate,
        devMode.xpMultiplier, devMode.setXpMultiplier, devMode.isGodModeOn, devMode.setIsGodModeOn,
        handleHealPlayer, handleKillMonster, handleAddCoins, handleSetSkillLevel, handleMaxCharacter, handleResetQuest, handleAdjustQuestStage,
        handleTrialTestBoost, repeatableQuests.resetBoards, thievingPilfering.resetPilferingTimers, slayer,
        worldState.questVariables, questLogic.deleteQuestVariable
    ]);

    // Centralized death check
    useEffect(() => {
        if (char.currentHp <= 0 && !isInCombat) {
            handlePlayerDeath(gameState);
        }
    }, [char.currentHp, gameState, handlePlayerDeath, isInCombat]);

    return (
        <div ref={containerRef} className="w-full h-full p-2 flex flex-col md:flex-row gap-2 relative overflow-y-auto md:overflow-hidden">
            <div className="w-full md:w-4/5 flex flex-col gap-2 relative">
                <BuffBar statModifiers={char.statModifiers} activeBuffs={buffsForDisplay} activePrayers={prayer.activePrayers} setTooltip={ui.setTooltip} />
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative overflow-y-auto md:overflow-visible">
                    {ui.activeSingleAction && !agility.agilityState.activeCourseId && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                            <SingleActionProgressView
                                action={ui.activeSingleAction}
                                onCancel={() => ui.setActiveSingleAction(null)}
                            />
                        </div>
                    )}
                    <MainViewController combatAttackType={combatAttackType} stylesByWeaponType={stylesByWeaponType} setStylesByWeaponType={setStylesByWeaponType} setCombatAttackType={setCombatAttackType} onFastTravel={handleFastTravel} bookmarks={bookmarks} setBookmarks={setBookmarks} playerType={initialState.playerType} {...{
                        char: { ...char, setCombatStance },
                        itemActions, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath: () => handlePlayerDeath(gameState), handleKill, onWinCombat, onFleeSuccess: onFleeFromCombat, onResponse, handleDialogueCheck, combatSpeedMultiplier: devMode.combatSpeedMultiplier, activeCombatStyleHighlight: null, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, addLog, ui, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi, onPickUpItem: handlePickUpItem, onTakeAllLoot: handleTakeAllLoot, onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp, poiImmunityTimeLeft, killTrigger, bankPlaceholders: worldState.bankPlaceholders ?? false, handleToggleBankPlaceholders, bonfires: bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId)), onStokeBonfire: crafting.handleStokeBonfire, isStunned: char.isStunned, addBuff: char.addBuff, isDevMode: devMode.isDevMode, onToggleDevPanel: handleToggleDevPanel, onToggleTouchSimulation: devMode.onToggleTouchSimulation, onDepositEquipment: () => bankLogic.handleDepositEquipment(ui.activeBankTabId), deathMarker: worldState.deathMarker, activeRepeatableQuest: repeatableQuests.activePlayerQuest, onActivity: handleActivityClickWrapper, onResetGame, onImportGame, onExportGame, isOneClickMode: ui.isOneClickMode, poi, thievingContainerStates: thieving.containerStates, onPickpocket: thieving.handlePickpocket, onLockpick: thieving.handleLockpick, onPilfer: thievingPilfering.handlePilfer, onStealFromStall: thieving.handleStealFromStall, worldState, onStartCombat: onStartSingleCombat, onEncounterWin: handleEncounterWin, activePrayers: prayer.activePrayers, onJewelryCraft: crafting.handleJewelryCrafting, setEquipment: inv.setEquipment, poisonEvent, runEnergy: char.runEnergy, setRunEnergy: char.setRunEnergy, playerCombatLevel: char.combatLevel, addXp: char.addXp, setCurrentHp: char.setCurrentHp, agility, setActivePrayers: prayer.setActivePrayers
                    }} />
                    {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                    <LootButtonOverlay groundItems={groundItemsForCurrentPoi} onOpenLootView={() => ui.setIsLootViewOpen(true)} />
                </div>
                <div className={`md:flex-shrink-0 relative`}>
                    <ActivityLog logs={activityLog} chatMessages={messages} onSendMessage={handleSendMessage} isDialogueActive={!!ui.activeDialogue} username={initialState.username} />
                    {ui.activeDialogue && (
                        <DialogueOverlay
                            dialogue={ui.activeDialogue}
                            setActivePanel={ui.setActivePanel}
                            onResponse={onResponse}
                            handleDialogueCheck={handleDialogueCheck}
                            isDialogueProcessing={ui.isDialogueProcessing}
                            onNavigate={(nodeKey) => ui.setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: nodeKey } : null)}
                        />
                    )}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel
                    {...{
                        ui,
                        initialState,
                        char: { ...char, setCombatStance },
                        combatAttackType,
                        setCombatAttackType,
                        stylesByWeaponType,
                        setStylesByWeaponType,
                        inv,
                        quests,
                        repeatableQuests,
                        slayer,
                        onReturnToMenu: handleLogout,
                        isDevMode: devMode.isDevMode,
                        isTouchSimulationEnabled: devMode.isTouchSimulationEnabled,
                        onToggleTouchSimulation: devMode.onToggleTouchSimulation,
                        itemActions: wrappedItemActions,
                        isBusy,
                        handleExamine: itemActions.handleExamine,
                        session,
                        addLog,
                        activeCombatStyleHighlight: null,
                        onNavigate: navigation.handleNavigate,
                        unlockedPois: navigation.reachablePois,
                        isBankOpen,
                        isShopOpen,
                        onDeposit: (inventoryIndex, quantity) => bankLogic.handleDeposit(inventoryIndex, quantity, ui.activeBankTabId),
                        onCastSpell: spellcasting.onCastSpell,
                        onSpellOnItem: spellActions.handleSpellOnItem,
                        isEquipmentStatsOpen: !!ui.isEquipmentStatsViewOpen,
                        activePrayers: prayer.activePrayers,
                        onTogglePrayer: (prayerId: string) => prayer.togglePrayer(prayerId, char.skills, quests.playerQuests, char.rawCurrentPrayer),
                        isPoisoned: char.isPoisoned,
                        onCurePoison: itemActions.handleCurePoisonFromOrb,
                        poisonEvent,
                        onToggleDevPanel: handleToggleDevPanel,
                        worldState,
                    }}
                    isPermAggroOn={ui.isPermAggroOn}
                    onTogglePermAggro={handleTogglePermAggro}
                    isGodModeOn={devMode.isGodModeOn}
                    onToggleGodMode={() => devMode.setIsGodModeOn(!devMode.isGodModeOn)}
                />
            </div>
            {ui.showXpDrops && <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />}
            {ui.isDevPanelOpen && (
                <div className="absolute inset-0 bg-black/80 flex justify-end z-40 p-2 pointer-events-none" onClick={() => ui.setIsDevPanelOpen(false)}>
                    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md h-full flex flex-col pointer-events-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <DevPanel {...devPanelProps} slayer={slayer} isCurrentMonsterAggro={devMode.isCurrentMonsterAggro} onToggleAggro={devMode.onToggleAggro} />
                    </div>
                </div>
            )}
            {ui.isMapManagerOpen && hasMapManager && MapManagerComponent && (
                <div className="absolute inset-0 z-50 bg-black">
                    <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white font-pixel-rpg p-4">Loading Map Editor...</div>}>
                        <MapManagerComponent onClose={() => ui.setIsMapManagerOpen(false)} />
                    </Suspense>
                </div>
            )}
            {ui.isExpandedMapViewOpen && (
                <ExpandedMapView
                    currentPoiId={session.currentPoiId}
                    unlockedPois={navigation.reachablePois}
                    onNavigate={navigation.handleNavigate}
                    onFastTravel={handleFastTravel}
                    onClose={() => ui.setIsExpandedMapViewOpen(false)}
                    setTooltip={ui.setTooltip}
                    addLog={addLog}
                    showAllPois={devMode.showAllPois}
                    activeMapRegionId={ui.activeMapRegionId}
                    setActiveMapRegionId={ui.setActiveMapRegionId}
                    deathMarker={worldState.deathMarker}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                    playerType={initialState.playerType}
                    setContextMenu={ui.setContextMenu}
                />
            )}
            {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={char.skills} />}
            {ui.isSettingsViewOpen && (
                <SettingsView
                    onClose={() => ui.setIsSettingsViewOpen(false)}
                    onExportGame={onExportGame}
                    onImportGame={onImportGame}
                    onResetGame={onResetGame}
                    isDevMode={isDevMode}
                    onToggleDevPanel={handleToggleDevPanel}
                    isTouchSimulationEnabled={devMode.isTouchSimulationEnabled}
                    onToggleTouchSimulation={devMode.onToggleTouchSimulation}
                    ui={ui}
                    bankPlaceholders={worldState.bankPlaceholders ?? false}
                    handleToggleBankPlaceholders={handleToggleBankPlaceholders}
                />

            )}
        </div>
    );
};

export default Game;