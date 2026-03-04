
import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { ActivePanel, SkillName, InventorySlot, ActiveCraftingAction, DialogueNode, CraftingContext, Equipment, PlayerQuestState, Spell, Item, DialogueResponse, DialogueCheckRequirement, ActiveTutorialState } from '../types';
import { ContextMenuOption } from '../components/common/ContextMenu';

export interface DialogueState {
    npcName: string;
    npcIcon: string;
    nodes: Record<string, DialogueNode>;
    currentNodeKey: string;
    onEnd: () => void;
    onResponse: (response: DialogueResponse) => void;
    onNavigate?: (nextNodeKey: string) => void;
    handleDialogueCheck?: (requirements: DialogueCheckRequirement[]) => boolean;
}

export interface TooltipState {
    content?: React.ReactNode;
    item?: Item;
    slot?: InventorySlot;
    position: { x: number; y: number; };
}

export interface ContextMenuState {
    options: ContextMenuOption[];
    triggerEvent: React.MouseEvent | React.Touch;
    isTouchInteraction: boolean;
    title?: string;
    content?: React.ReactNode;
}

export interface MakeXPrompt {
    title: string;
    max: number;
    onConfirm: (quantity: number) => void;
}

export interface ConfirmationPrompt {
    message: string;
    onConfirm: () => void;
}

export interface QuestDetailState {
    questId: string;
    playerQuests: PlayerQuestState[];
}

export interface ExportDataState {
    data: string | { filePath: string; content: string }[];
    onClose?: () => void;
    onCopy?: () => void;
    title?: string;
    copyButtonText?: string;
}

export interface ItemsOnDeathData {
    inventory: (InventorySlot | null)[];
    equipment: Equipment;
    coins: number;
}

export interface ActiveSingleAction {
    title: string;
    iconUrl: string;
    iconClassName: string;
    startTime: number;
    duration: number; // in ms
    onComplete: () => void;
}

export type WithdrawMode = 1 | 5 | 10 | 'x' | 'all';

// Helper for localStorage
const createPersistentState = <T,>(key: string, defaultValue: T): [T, (value: React.SetStateAction<T>) => void] => {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    const setPersistentValue = (newValueAction: React.SetStateAction<T>) => {
        // This allows using the functional update form of setState (e.g., setCounter(c => c + 1))
        const newValue = newValueAction instanceof Function ? newValueAction(value) : newValueAction;
        try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
        setValue(newValue);
    };

    return [value, setPersistentValue];
};


// Original hook logic, now internal
const useUIStateInternal = () => {
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    const [combatQueue, setCombatQueue] = useState<string[]>([]);
    const [isMandatoryCombat, setIsMandatoryCombat] = useState<boolean>(false);
    const [activeShopId, setActiveShopId] = useState<string | null>(null);
    const [activeCraftingContext, setActiveCraftingContext] = useState<CraftingContext | null>(null);
    const [itemToUse, setItemToUse] = useState<{ item: InventorySlot, index: number } | null>(null);
    const [spellToCast, setSpellToCast] = useState<Spell | null>(null);
    const [activeQuestBoardId, setActiveQuestBoardId] = useState<string | null>(null);
    const [activeTeleportBoardId, setActiveTeleportBoardId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [makeXPrompt, setMakeXPrompt] = useState<MakeXPrompt | null>(null);
    const [activeDialogue, setActiveDialogue] = useState<DialogueState | null>(null);
    const [confirmationPrompt, setConfirmationPrompt] = useState<ConfirmationPrompt | null>(null);
    const [exportData, setExportData] = useState<ExportDataState | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [activeSkillGuide, setActiveSkillGuide] = useState<SkillName | null>(null);
    const [activeCraftingAction, setActiveCraftingAction] = useState<ActiveCraftingAction | null>(null);
    const [activeSingleAction, setActiveSingleAction] = useState<ActiveSingleAction | null>(null);
    const [activeQuestDetail, setActiveQuestDetail] = useState<QuestDetailState | null>(null);
    const [isSelectingAutocastSpell, setIsSelectingAutocastSpell] = useState<boolean>(false);
    const [manualCastTrigger, setManualCastTrigger] = useState<Spell | null>(null);

    // New state for guided tutorials
    const [activeTutorial, setActiveTutorial] = useState<ActiveTutorialState | null>(null);


    // New state for equipment overlays
    const [isEquipmentStatsViewOpen, setIsEquipmentStatsViewOpen] = useState<boolean>(false);
    const [itemsOnDeathData, setItemsOnDeathData] = useState<ItemsOnDeathData | null>(null);
    const [priceCheckerInventory, setPriceCheckerInventory] = useState<(InventorySlot | null)[] | null>(null);
    const [isAtlasViewOpen, setIsAtlasViewOpen] = useState<boolean>(false);
    const [isExpandedMapViewOpen, setIsExpandedMapViewOpen] = useState<boolean>(false);
    const [isLootViewOpen, setIsLootViewOpen] = useState<boolean>(false);
    const [isDevPanelOpen, setIsDevPanelOpen] = useState<boolean>(false);
    const [isMonsterDBOpen, setIsMonsterDBOpen] = useState<boolean>(false);
    const [isSettingsViewOpen, setIsSettingsViewOpen] = useState<boolean>(false);
    const [isSoundCreatorOpen, setIsSoundCreatorOpen] = useState<boolean>(false);
    const [activeMapRegionId, setActiveMapRegionId] = useState<string>('world');
    const [activeBankTabId, setActiveBankTabId] = useState<number>(0);
    const [activeDungeonMap, setActiveDungeonMap] = useState<{ regionId: string; mapTitle: string } | null>(null);

    // Persistent Settings
    const [showTooltips, setShowTooltips] = createPersistentState<boolean>('settings_showTooltips', true);
    const [showXpDrops, setShowXpDrops] = createPersistentState<boolean>('settings_showXpDrops', true);
    const [confirmValuableDrops, setConfirmValuableDrops] = createPersistentState<boolean>('settings_confirmValuableDrops', true);
    const [valuableDropThreshold, setValuableDropThreshold] = createPersistentState<number>('settings_valuableDropThreshold', 1000);
    const [showMinimapHealth, setShowMinimapHealth] = createPersistentState<boolean>('settings_showMinimapHealth', false);
    const [showCombatPlayerHealth, setShowCombatPlayerHealth] = createPersistentState<boolean>('settings_showCombatPlayerHealth', false);
    const [showCombatEnemyHealth, setShowCombatEnemyHealth] = createPersistentState<boolean>('settings_showCombatEnemyHealth', false);
    const [showHitsplats, setShowHitsplats] = createPersistentState<boolean>('settings_showHitsplats', true);
    const [isOneClickMode, setIsOneClickMode] = createPersistentState<boolean>('settings_isOneClickMode', false);
    const [masterVolume, setMasterVolume] = createPersistentState<number>('settings_masterVolume', 1);
    const [musicVolume, setMusicVolume] = createPersistentState<number>('settings_musicVolume', 1);
    const [sfxVolume, setSfxVolume] = createPersistentState<number>('settings_sfxVolume', 1);
    const [ambientVolume, setAmbientVolume] = createPersistentState<number>('settings_ambientVolume', 1);
    const [isMuted, setIsMuted] = createPersistentState<boolean>('settings_isMuted', false);
    
    // Non-persistent dev settings
    const [xpMultiplier, setXpMultiplier] = useState<number>(1);
    const [combatSpeedMultiplier, setCombatSpeedMultiplier] = useState<number>(1);
    const [isPlayerInvisible, setIsPlayerInvisible] = useState<boolean>(false);
    const [isAutoBankOn, setIsAutoBankOn] = useState<boolean>(false);
    const [isGodModeOn, setIsGodModeOn] = useState<boolean>(false);
    const [isPermAggroOn, setIsPermAggroOn] = useState<boolean>(false);

    // New state for bank quantity toggles (session-wide)
    const [activeWithdrawMode, setActiveWithdrawMode] = useState<WithdrawMode>(1);
    const [customWithdrawAmount, setCustomWithdrawAmount] = useState<number | null>(null);

    const isBusy = useMemo(() => !!(
        activeShopId ||
        activeCraftingContext ||
        activeQuestBoardId ||
        activeTeleportBoardId ||
        makeXPrompt ||
        confirmationPrompt ||
        exportData ||
        isImportModalOpen ||
        activeSkillGuide ||
        activeCraftingAction ||
        activeSingleAction ||
        activeQuestDetail ||
        isEquipmentStatsViewOpen ||
        itemsOnDeathData ||
        priceCheckerInventory ||
        isAtlasViewOpen ||
        isLootViewOpen ||
        activeDungeonMap ||
        isMonsterDBOpen ||
        activeTutorial
    ), [
        activeShopId,
        activeCraftingContext,
        activeQuestBoardId,
        activeTeleportBoardId,
        makeXPrompt,
        confirmationPrompt,
        exportData,
        isImportModalOpen,
        activeSkillGuide,
        activeCraftingAction,
        activeSingleAction,
        activeQuestDetail,
        itemsOnDeathData,
        priceCheckerInventory,
        isAtlasViewOpen,
        isLootViewOpen,
        activeDungeonMap,
        isMonsterDBOpen,
        activeTutorial
    ]);


    const closeContextMenu = useCallback(() => setContextMenu(null), []);
    const closeMakeXPrompt = useCallback(() => setMakeXPrompt(null), []);
    const closeConfirmationPrompt = useCallback(() => setConfirmationPrompt(null), []);
    const closeExportModal = useCallback(() => setExportData(null), []);
    const closeImportModal = useCallback(() => setIsImportModalOpen(false), []);
    const closeSkillGuide = useCallback(() => setActiveSkillGuide(null), []);
    const openCraftingView = useCallback((context: CraftingContext) => setActiveCraftingContext(context), []);
    const closeCraftingView = useCallback(() => setActiveCraftingContext(null), []);
    
    const closeAllModals = useCallback(() => {
        setCombatQueue([]);
        setIsMandatoryCombat(false);
        setActiveShopId(null);
        setActiveCraftingContext(null);
        setItemToUse(null);
        setSpellToCast(null);
        setMakeXPrompt(null);
        setActiveQuestBoardId(null);
        setActiveTeleportBoardId(null);
        setActiveDialogue(null);
        setConfirmationPrompt(null);
        setExportData(null);
        setIsImportModalOpen(false);
        setActiveSkillGuide(null);
        setActiveCraftingAction(null);
        setActiveSingleAction(null);
        setActiveQuestDetail(null);
        setIsEquipmentStatsViewOpen(false);
        setItemsOnDeathData(null);
        setPriceCheckerInventory(null);
        setIsAtlasViewOpen(false);
        setIsExpandedMapViewOpen(false);
        setActiveMapRegionId('world');
        setIsLootViewOpen(false);
        setIsSelectingAutocastSpell(false);
        setManualCastTrigger(null);
        setActiveDungeonMap(null);
        setIsDevPanelOpen(false);
        setIsSettingsViewOpen(false);
        setIsMonsterDBOpen(false);
        setActiveTutorial(null);
        setIsSoundCreatorOpen(false);
    }, []);

    return {
        activePanel, setActivePanel,
        combatQueue, setCombatQueue,
        isMandatoryCombat, setIsMandatoryCombat,
        activeShopId, setActiveShopId,
        activeCraftingContext,
        itemToUse, setItemToUse,
        spellToCast, setSpellToCast,
        activeQuestBoardId, setActiveQuestBoardId,
        activeTeleportBoardId, setActiveTeleportBoardId,
        tooltip, setTooltip,
        contextMenu, setContextMenu,
        makeXPrompt, setMakeXPrompt,
        activeDialogue, setActiveDialogue,
        confirmationPrompt, setConfirmationPrompt,
        exportData, setExportData,
        isImportModalOpen, setIsImportModalOpen,
        activeSkillGuide, setActiveSkillGuide,
        activeCraftingAction, setActiveCraftingAction,
        activeSingleAction, setActiveSingleAction,
        activeQuestDetail, setActiveQuestDetail,
        isEquipmentStatsViewOpen, setIsEquipmentStatsViewOpen,
        itemsOnDeathData, setItemsOnDeathData,
        priceCheckerInventory, setPriceCheckerInventory,
        isAtlasViewOpen, setIsAtlasViewOpen,
        isExpandedMapViewOpen, setIsExpandedMapViewOpen,
        isLootViewOpen, setIsLootViewOpen,
        activeMapRegionId, setActiveMapRegionId,
        isSelectingAutocastSpell, setIsSelectingAutocastSpell,
        manualCastTrigger, setManualCastTrigger,
        isDevPanelOpen, setIsDevPanelOpen,
        isMonsterDBOpen, setIsMonsterDBOpen,
        activeDungeonMap, setActiveDungeonMap,
        isSettingsViewOpen, setIsSettingsViewOpen,
        isSoundCreatorOpen, setIsSoundCreatorOpen,
        activeBankTabId, setActiveBankTabId,
        activeTutorial, setActiveTutorial,
        isBusy,
        showTooltips, setShowTooltips,
        showXpDrops, setShowXpDrops,
        confirmValuableDrops, setConfirmValuableDrops,
        valuableDropThreshold, setValuableDropThreshold,
        showMinimapHealth, setShowMinimapHealth,
        showCombatPlayerHealth, setShowCombatPlayerHealth,
        showCombatEnemyHealth, setShowCombatEnemyHealth,
        showHitsplats, setShowHitsplats,
        isOneClickMode, setIsOneClickMode,
        masterVolume, setMasterVolume,
        musicVolume, setMusicVolume,
        sfxVolume, setSfxVolume,
        ambientVolume, setAmbientVolume,
        isMuted, setIsMuted,
        activeWithdrawMode, setActiveWithdrawMode,
        customWithdrawAmount, setCustomWithdrawAmount,
        xpMultiplier, setXpMultiplier,
        combatSpeedMultiplier, setCombatSpeedMultiplier,
        isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn,
        isGodModeOn, setIsGodModeOn,
        isPermAggroOn, setIsPermAggroOn,
        closeContextMenu,
        closeMakeXPrompt,
        closeConfirmationPrompt,
        closeExportModal,
        closeImportModal,
        closeSkillGuide,
        openCraftingView,
        closeCraftingView,
        closeAllModals,
    };
};

// --- Define Context ---
type UIContextType = ReturnType<typeof useUIStateInternal>;
const UIContext = createContext<UIContextType | null>(null);

// --- Create Provider Component ---
export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const uiState = useUIStateInternal();
    // FIX: Replaced JSX with React.createElement to resolve parsing errors in a .ts file.
    // A file containing JSX must have a .tsx extension.
    return React.createElement(UIContext.Provider, { value: uiState }, children);
};

// --- Create Consumer Hook ---
export const useUIState = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUIState must be used within a UIProvider');
    }
    return context;
};
