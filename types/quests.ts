import { SkillName } from './enums';
import { InventorySlot } from './entities';
import { QUESTS } from '../constants/quests';

// This creates a union type of all the keys from the QUESTS object, e.g., "goblin_menace" | "a_smiths_apprentice" | ...
export type QuestId = keyof typeof QUESTS;


export interface PlayerQuestState {
  questId: QuestId;
  currentStage: number;
  progress: number;
  isComplete: boolean;
}

export interface PlayerSlayerTask {
  monsterId: string;
  requiredCount: number;
  progress: number;
  isComplete: boolean;
  masterId?: string;
}

// FIX: Added 'operator' to gather type QuestRequirement to support 'eq', 'lt', etc.
export type QuestRequirement =
  | ({ type: 'gather' } & (
    | { itemId: string; quantity: number; operator?: 'gte' | 'lt' | 'eq' }
    | { items: { itemId: string; quantity: number; operator?: 'gte' | 'lt' | 'eq' }[] }
  ))
  | { type: 'kill'; monsterId: string; quantity: number; style?: 'melee' | 'ranged' | 'magic' }
  | { type: 'talk'; poiId: string; npcName: string }
  | { type: 'shear'; quantity: number }
  | { type: 'smith'; itemId: string; quantity: number }
  | { type: 'spin'; quantity: number }
  | { type: 'accept_repeatable_quest'; questId: string }
  | { type: 'offer'; itemId: string; quantity: number; poiId: string; npcName: string };

export type DialogueAction =
  | { type: 'give_item'; itemId: string; quantity: number; noted?: boolean }
  | { type: 'take_item'; itemId: string; quantity: number | 'all'; nameOverride?: string }
  | { type: 'give_coins'; amount: number }
  | { type: 'take_coins'; amount: number }
  | { type: 'give_xp'; skill: SkillName; amount: number }
  | { type: 'start_quest'; questId: QuestId }
  | { type: 'advance_quest'; questId: QuestId; quantity?: number }
  | { type: 'complete_quest'; questId: QuestId }
  | { type: 'teleport'; poiId: string }
  | { type: 'heal'; amount: 'full' | number }
  | { type: 'restore_stats' }
  | { type: 'open_bank' }
  | { type: 'start_bank_tutorial' }
  | { type: 'complete_tutorial' }
  | { type: 'set_quest_combat_reward'; itemId: string; quantity: number }
  | { type: 'start_mandatory_combat'; monsterId: string }
  | { type: 'tan_all_hides' }
  | { type: 'add_log'; message: string }
  | { type: 'restore_prayer' }
  | { type: 'open_make_x_for_grinding'; itemId: 'consecrated_bones' | 'consecrated_big_bones' | 'consecrated_dragon_bones' | 'consecrated_frost_dragon_bones' }
  // FIX: Added new action types for quest-specific variable management.
  | { type: 'set_variable'; name: string; value: any }
  | { type: 'increment_variable'; name: string; amount: number }
  | { type: 'start_destruction_trial_heat' }
  | { type: 'restore_unstable_core' }
  | { type: 'reset_destruction_trial' }
  | { type: 'instant_heat_temper' }
  | { type: 'tst_start_heat_trial_slow' }
  | { type: 'light_monolith_fire'; pitId: string; logType: string }
  | { type: 'show_quest_info'; questId: QuestId }
  | { type: 'slayer_get_task'; masterId: string }
  | { type: 'slayer_reset_task'; masterId: string }
  | { type: 'slayer_open_shop' }
  | { type: 'cleanup_quest_state'; questId: QuestId };

export type DialogueCheckRequirement =
  | { type: 'items'; items: { itemId: string, quantity: number, operator?: 'gte' | 'lt' | 'eq', nameOverride?: string }[] }
  | { type: 'coins'; amount: number }
  | { type: 'skill'; skill: SkillName; level: number }
  | { type: 'world_state'; property: 'windmillFlour' | 'monolithFire' | 'monolithFires' | 'monolithLogType' | 'monolith_pit_1' | 'monolith_pit_2' | 'monolith_pit_3' | 'monolith_pit_4'; value: any; operator?: 'gte' | 'eq' }
  // FIX: Added 'operator' to quest check requirement to support flexible stage comparisons ---
  | { type: 'quest'; questId: QuestId; status: 'not_started' | 'in_progress' | 'completed'; stage?: number; operator?: 'gte' | 'lt' | 'eq' }
  // FIX: Added new check type for quest-specific variables.
  | { type: 'variable'; name: string; value: any; operator: 'eq' | 'lt' | 'gte' }
  | { type: 'quest_requirements'; questId: QuestId }
  | { type: 'slayer_credits'; amount: number; operator?: 'gte' | 'lt' | 'eq' }
  | { type: 'slayer_task'; status: 'none' | 'active' | 'complete'; masterId?: string; operator?: 'eq' | 'ne' };

export interface DialogueCheck {
  requirements: DialogueCheckRequirement[];
  // --- FIX: Made successNode and failureNode optional to support simple conditional visibility for responses ---
  successNode?: string;
  failureNode?: string;
}

export interface DialogueResponse {
  text: string;
  next?: string;
  check?: DialogueCheck;
  actions?: DialogueAction[];
  failureActions?: DialogueAction[];
}

export interface DialogueNode {
  npcName: string;
  npcIcon: string;
  text: string;
  responses: DialogueResponse[];
  conditionalResponses?: DialogueResponse[];
  highlight?: string | string[];
  dim?: boolean;
}

export interface DialogueEntryPoint {
  npcName: string;
  response: DialogueResponse;
}

export interface QuestStage {
  description: string;
  requirement: QuestRequirement;
  stageRewards?: {
    xp?: { skill: SkillName; amount: number }[];
    items?: InventorySlot[];
    coins?: number;
  };
}

export interface Quest {
  id: QuestId;
  name: string;
  description: string;
  stages: QuestStage[];
  rewards: { xp?: { skill: SkillName; amount: number }[]; items?: InventorySlot[]; coins?: number };
  isHidden?: boolean;
  isSuperHidden?: boolean;
  dialogue?: Record<string, DialogueNode>;
  dialogueEntryPoints?: DialogueEntryPoint[];
  // FIX: Removed unused 'Terrell' property and added 'startDialogueNode'
  startDialogueNode?: string;
  startHint: string;
  playerStagePerspectives: string[];
  completionSummary: string;
  startPoi?: string;
  requirements?: {
    quests?: QuestId[];
    skills?: { skill: SkillName; level: number }[];
    recommendedCombatLevel?: number;
    notes?: string[];
  };
  triggerItem?: {
    itemId: string;
    npcName: string;
    startNode: string;
  };
  cleanupWorldState?: string[];
  cleanupQuestVariables?: string[];
}

export interface RepeatableQuest {
  id: string;
  questNum?: number;
  type: 'gather' | 'interact' | 'kill';
  title: string;
  description: string;
  location: 'meadowdale' | 'oakhaven' | 'general' | 'isle_of_whispers' | 'silverhaven' | 'fouthia' | 'sanctity';
  locationPoiId?: string; // For 'interact' type
  target: {
    itemId?: string; // For 'gather' type
    name?: string; // For 'interact' type
    monsterId?: string; // For 'kill' type
  };
  baseCoinReward: number; // Per item for 'gather', or flat for 'interact'
  xpReward: {
    skill: SkillName;
    amount: number;
  };
  minQuantity?: number;
  maxQuantity?: number;
  isInstance?: boolean;
  instancePoiId?: string;
  aggressionToggle?: {
    poiId: string;
    monsterId: string;
  };
}

export interface GeneratedRepeatableQuest extends RepeatableQuest {
  requiredQuantity: number;
  finalCoinReward: number;
}

export interface PlayerRepeatableQuest {
  questId: string;
  boardId: string; // The POI id of the board
  generatedQuest: GeneratedRepeatableQuest;
  progress: number;
}

export interface RepeatableQuestsState {
  boards: Record<string, GeneratedRepeatableQuest[]>;
  activePlayerQuest: PlayerRepeatableQuest | null;
  nextResetTimestamp: number;
  completedQuestIds: string[];
  boardCompletions: Record<string, number>;
}