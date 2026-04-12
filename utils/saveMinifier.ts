import { REPEATABLE_QUEST_POOL, ALL_SKILLS, ITEMS, WEAPON_TYPE_SAVE_KEY } from '../constants';
import { MUSIC_TRACKS } from '../hooks/useMusicEngine';

/** Reverse mapping for numeric IDs to string IDs */
const ITEM_NUM_MAP: Record<number, string> = Object.values(ITEMS).reduce((acc, item) => {
    if (item.itemNum !== undefined) {
        acc[item.itemNum] = item.id;
    }
    return acc;
}, {} as Record<number, string>);

/** Keys that are static on a RepeatableQuest and can be looked up by ID */
const REPEATABLE_QUEST_STATIC_KEYS = [
    'title', 'description', 'location', 'target', 'baseCoinReward',
    'minQuantity', 'maxQuantity', 'isInstance', 'instancePoiId',
    'aggressionToggle', 'locationPoiId', 'type'
] as const;

/** Settings defaults */
const DEFAULT_SETTINGS = {
    showTooltips: true,
    showXpDrops: true,
    confirmValuableDrops: true,
    valuableDropThreshold: 1000,
    showMinimapHealth: false,
    showCombatPlayerHealth: false,
    showCombatEnemyHealth: false,
    showHitsplats: true,
    isOneClickMode: false,
    devSettings: {
        xpMultiplier: 1,
        combatSpeedMultiplier: 1,
        isPlayerInvisible: false,
        isAutoBankOn: false,
        isGodModeOn: false,
    }
};

/**
 * Minify a single item slot to an array: [id, quantity, noted?, extraStats?]
 */
function minifySlot(slot: any): any {
    if (!slot || typeof slot !== 'object') return null;
    const item = ITEMS[slot.itemId];
    const idToSave = (item && item.itemNum !== undefined) ? item.itemNum : slot.itemId;
    const res: any[] = [idToSave, slot.quantity];
    
    const extra: any = {};
    let hasExtra = false;
    if (slot.doses !== undefined) { extra.d = slot.doses; hasExtra = true; }
    if (slot.charges !== undefined) { extra.c = slot.charges; hasExtra = true; }
    if (slot.chargeProgress !== undefined) { extra.cp = slot.chargeProgress; hasExtra = true; }
    if (slot.nameOverride !== undefined) { extra.no = slot.nameOverride; hasExtra = true; }
    if (slot.statsOverride !== undefined) { extra.so = slot.statsOverride; hasExtra = true; }
    if (slot.isAltered !== undefined) { extra.ia = slot.isAltered; hasExtra = true; }
    if (slot.filled !== undefined) { extra.f = slot.filled; hasExtra = true; }
    if (slot.expiresAt !== undefined) { extra.e = slot.expiresAt; hasExtra = true; }

    if (hasExtra || slot.noted === true) {
        res.push(slot.noted === true ? 1 : 0);
        if (hasExtra) res.push(extra);
    }
    return res;
}

/**
 * Minify a GeneratedRepeatableQuest by stripping static fields
 */
function minifyRepeatableQuest(quest: any): any {
    if (!quest || typeof quest !== 'object') return quest;
    const minified: any = { id: quest.questNum !== undefined ? quest.questNum : quest.id };
    
    if (quest.requiredQuantity !== undefined) minified.q = quest.requiredQuantity;
    if (quest.finalCoinReward !== undefined) minified.c = quest.finalCoinReward;
    if (quest.xpReward && typeof quest.xpReward === 'object') {
        minified.x = quest.xpReward.amount;
    }

    return minified;
}

/**
 * Deeply minify the gameState to v2 schema.
 */
export function minifyGameState(state: any): any {
    if (!state || typeof state !== 'object') return state;

    // Safety: If the state is already minified (v1 or v2), don't minify it again.
    if (state._v || state._minified) {
        return state;
    }

    // Use shortened keys for the root object
    const mini: any = {
        _v: 2, // Version 2: Deep Minification
        u: state.username,
        pt: state.playerType,
        hp: state.currentHp,
        dead: state.isDead,
        c: state.coins,
        d: state.deaths,
        st: state.startTime,
        ac: state.autocastSpell ? state.autocastSpell.id : null,
        cp: state.currentPrayer,
        cs: state.combatStance,
        loc: state.currentPoiId,
        ap: state.activePrayers,
        sm: state.statModifiers,
        ab: state.activeBuffs,
        re: state.runEnergy,
        rt: state.isRunToggled,
    };

    if (state.stylesByWeaponType) {
        const minifiedStwt: Record<string, number> = {};
        for (const [wt, index] of Object.entries(state.stylesByWeaponType)) {
            const shortKey = WEAPON_TYPE_SAVE_KEY[wt as any];
            if (shortKey && typeof index === 'number') {
                minifiedStwt[shortKey] = index;
            }
        }
        if (Object.keys(minifiedStwt).length > 0) {
            mini.stwt = minifiedStwt;
        }
    }

    // 1. Skills (s): Array of XP values in ALL_SKILLS order
    if (Array.isArray(state.skills)) {
        mini.s = ALL_SKILLS.map(skillDef => {
            const skill = state.skills.find((s: any) => s.name === skillDef.name);
            return skill ? (typeof skill === 'object' ? skill.xp : 0) : 0;
        });
    }

    // 2. Inventory (i): Array of [id, qty, noted?]
    if (Array.isArray(state.inventory)) {
        let items = state.inventory.map(minifySlot);
        // Remove trailing nulls
        let lastIdx = -1;
        for (let j = items.length - 1; j >= 0; j--) {
            if (items[j] !== null) {
                lastIdx = j;
                break;
            }
        }
        mini.i = items.slice(0, lastIdx + 1);
    }

    // 3. Bank (b): Array of tabs, each an array of [id, qty, noted?]
    if (Array.isArray(state.bank)) {
        mini.b = state.bank.map((tab: any) => {
            if (!tab || !Array.isArray(tab.items)) return null;
            let items = tab.items.map(minifySlot);
            // Trim tab
            let lastIdx = -1;
            for (let j = items.length - 1; j >= 0; j--) {
                if (items[j] !== null) {
                    lastIdx = j;
                    break;
                }
            }
            return {
                id: tab.id,
                n: tab.name,
                i: items.slice(0, lastIdx + 1)
            };
        });
    }

    // 4. Quests (q): Map { id: 1 | [stage, progress] }
    if (Array.isArray(state.playerQuests)) {
        const questMap: Record<string, any> = {};
        state.playerQuests.forEach((q: any) => {
            if (q.isComplete) {
                questMap[q.questId] = 1;
            } else {
                questMap[q.questId] = [q.currentStage, q.progress];
            }
        });
        mini.q = questMap;
    }

    // 5. Equipment (e): Map { slotName: [id, qty, noted?] }
    if (state.equipment && typeof state.equipment === 'object') {
        const eq: Record<string, any> = {};
        for (const [slot, item] of Object.entries(state.equipment)) {
            if (item) eq[slot] = minifySlot(item);
        }
        mini.e = eq;
    }

    // 6. World (w): Shortened keys
    if (state.worldState) {
        const now = Date.now();
        const w: any = {
            mut: Array.from(new Set(state.worldState.unlockedMusicTracks || []))
                .filter(id => id !== 'test_song' && id !== 'harp_test')
                .map(id => {
                    const t = MUSIC_TRACKS.find(mt => mt.id === id);
                    return t?.trackNum !== undefined ? t.trackNum : id;
                }),
            dh: state.worldState.dehydrationLevel,
            fl: state.worldState.windmillFlour,
            im: {}, // poiImmunity
            rk: [] // recentlyKilled
        };
        
        if (state.worldState.poiImmunity) {
            for (const [k, v] of Object.entries(state.worldState.poiImmunity as any)) {
                if (typeof v === 'number' && v > now) w.im[k] = v;
            }
        }
        if (state.worldState.recentlyKilled) {
            w.rk = state.worldState.recentlyKilled.filter(Boolean);
        }
        if (state.worldState.generatedHouses) {
            const gh: Record<string, any> = {};
            const activeHouseId = state.worldState.activePilferingSession?.housePoiId;
            for (const [id, data] of Object.entries(state.worldState.generatedHouses as Record<string, any>)) {
                // If it's the active house, keep activities for the session
                if (id === activeHouseId) {
                    gh[id] = { t: data.tierId, l: data.level, a: data.activities };
                } else {
                    // Otherwise just store tier and level for the UI hover/consistency
                    gh[id] = [data.tierId, data.level];
                }
            }
            w.gh = gh;
        }
        if (state.worldState.monolithFires) w.mf = state.worldState.monolithFires;
        if (state.worldState.questVariables) w.qv = state.worldState.questVariables;
        if (state.worldState.eventNextTrigger) w.ent = state.worldState.eventNextTrigger;
        if (state.worldState.dehydrationLevel !== undefined) w.dh = state.worldState.dehydrationLevel;
        if (state.worldState.windmillFlour !== undefined) w.fl = state.worldState.windmillFlour;
        if (state.worldState.depletedHouses) w.dph = state.worldState.depletedHouses;
        if (state.worldState.nextHouseResetTimestamp !== undefined) w.nrt = state.worldState.nextHouseResetTimestamp;
        if (state.worldState.deathMarker) w.dm = state.worldState.deathMarker;
        if (state.worldState.destructionTrialProgress) w.dtp = state.worldState.destructionTrialProgress;
        if (state.worldState.activePilferingSession) {
            const aps = state.worldState.activePilferingSession;
            w.aps = {
                h: aps.housePoiId,
                e: aps.entryPoiId,
                s: aps.startTime,
                t: aps.tierId,
                tl: aps.tierLevel,
                lc: aps.lootedContainerIds
            };
        }
        
        mini.w = w;
    }

    // 6b. Progression
    if (Array.isArray(state.lockedPois)) mini.lp = state.lockedPois;
    if (Array.isArray(state.clearedSkillObstacles)) mini.cso = state.clearedSkillObstacles;
    if (state.groundItems) {
        const gi: Record<string, any[]> = {};
        for (const [poiId, items] of Object.entries(state.groundItems as Record<string, any[]>)) {
            if (Array.isArray(items) && items.length > 0) {
                gi[poiId] = items.map(i => ({
                    i: minifySlot(i.item),
                    e: i.expiresAt,
                    u: i.uniqueId,
                    d: i.isDeathPile ? 1 : 0
                }));
            }
        }
        mini.gi = gi;
    }

    // 7. Resource Nodes (rn)
    if (state.resourceNodeStates) {
        const rn: Record<string, number> = {};
        for (const [id, s] of Object.entries(state.resourceNodeStates as any)) {
            if (s) {
                const node = s as any;
                if (node.respawnTimer > 0) {
                    rn[id] = node.respawnTimer;
                } else if (node.resources === 0) {
                    rn[id] = -1; // -1 represents depleted and no active timer
                }
            }
        }
        mini.rn = rn;
    }

    // 8. Repeatable Quests (rq)
    if (state.repeatableQuestsState) {
        const rqs = state.repeatableQuestsState;
        mini.rq = {
            b: {}, // boards
            apq: null, // activePlayerQuest
            rt: rqs.nextResetTimestamp || 0,
            c: rqs.completedQuestIds || [],
            bc: rqs.boardCompletions || {}
        };
        if (rqs.boards) {
            for (const [bid, qs] of Object.entries(rqs.boards as any)) {
                if (Array.isArray(qs)) mini.rq.b[bid] = qs.map(minifyRepeatableQuest);
            }
        }
        if (rqs.activePlayerQuest) {
            const apq = rqs.activePlayerQuest;
            mini.rq.apq = {
                id: apq.questId,
                bid: apq.boardId,
                p: apq.progress,
                gq: minifyRepeatableQuest(apq.generatedQuest)
            };
        }
    }

    // 9. Settings (set)
    if (state.settings) {
        const set: any = {};
        let changed = false;
        for (const [k, v] of Object.entries(state.settings)) {
            if (k === 'devSettings') {
                const dev: any = {};
                let dChanged = false;
                for (const [dk, dv] of Object.entries(v as any)) {
                    if ((DEFAULT_SETTINGS.devSettings as any)[dk] !== dv) {
                        dev[dk] = dv;
                        dChanged = true;
                    }
                }
                if (dChanged) { set.dev = dev; changed = true; }
            } else if ((DEFAULT_SETTINGS as any)[k] !== v) {
                set[k] = v;
                changed = true;
            }
        }
        if (changed) mini.set = set;
    }

    // 10. Meta / Location
    mini.slayer = state.slayerTask;
    mini.ag = state.agilityState;
    
    // Filter expired monster respawn timers to prevent save bloat
    const now = Date.now();
    const mr: Record<string, number> = {};
    if (state.monsterRespawnTimers) {
        for (const [id, time] of Object.entries(state.monsterRespawnTimers)) {
            if (typeof time === 'number' && time > now) {
                mr[id] = time;
            }
        }
    }
    mini.mr = mr;
    
    // Slayer task needs shrinking too if active
    if (mini.slayer && typeof mini.slayer === 'object') {
        mini.slayer = {
            id: mini.slayer.monsterId,
            rc: mini.slayer.requiredCount,
            p: mini.slayer.progress,
            c: mini.slayer.isComplete ? 1 : 0
        };
    }

    return mini;
}
