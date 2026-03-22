export * from './enums';
export type {
  PlayerSkill,
  BankTab,
  EquipmentStats,
  Item,
  InventorySlot,
  Equipment,
  MonsterSpecialAttack,
  Monster,
  ActiveStatModifier,
  ActiveBuff,
  MonsterStatusEffect,
} from './entities';
export * from './quests';
export * from './world';
export * from './mechanics';
export * from './ui';
export * from './crafting';
export * from './drops';
export * from './spells';
export * from './player';
export * from './save';
export * from './prayer';
export * from './agility';
export type { Spell } from './spells';

export interface Message {
  username: string;
  message: string;
  sender?: string;
  timestamp?: number;
  isPM?: boolean;
  type?: string;
}

export interface LogEntry {
  message: string;
  timestamp: number;
}
