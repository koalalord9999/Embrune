import { REPEATABLE_QUEST_POOL, XP_TABLE, INVENTORY_CAPACITY, ALL_SKILLS, QUESTS, ITEMS, SPELLS, SAVE_KEY_TO_WEAPON_TYPE } from '../constants';
import { MUSIC_TRACKS } from '../hooks/useMusicEngine';

/** Reverse mapping for numeric IDs to string IDs */
const ITEM_NUM_MAP: Record<number, string> = Object.values(ITEMS).reduce((acc, item) => {
    if (item.itemNum !== undefined) {
        acc[item.itemNum] = item.id;
    }
    return acc;
}, {} as Record<number, string>);

/** Reverse mapping for repeatable quest numbers to string IDs */
const QUEST_NUM_MAP: Record<number, string> = REPEATABLE_QUEST_POOL.reduce((acc, quest) => {
    if (quest.questNum !== undefined) {
        acc[quest.questNum] = quest.id;
    }
    return acc;
}, {} as Record<number, string>);

/**
 * Calculate level from XP
 */
function getLevelForXp(xp: number): number {
    const level = XP_TABLE.findIndex(xpVal => xpVal > xp);
    return level === -1 ? 99 : level;
}

function inflateSlot(arr: any): any {
    if (!arr || !Array.isArray(arr)) return null;
    const rawId = arr[0];
    const resolvedId = typeof rawId === 'number' ? ITEM_NUM_MAP[rawId] : rawId;
    
    // Safety check: if mapping fails, fallback to original or null
    if (typeof rawId === 'number' && !resolvedId) {
        console.warn(`Failed to resolve numeric item ID: ${rawId}`);
        return null; 
    }

    const slot: any = {
        itemId: resolvedId,
        quantity: arr[1],
        noted: arr[2] === 1
    };
    if (arr[3] && typeof arr[3] === 'object') {
        const x = arr[3];
        if (x.d !== undefined) slot.doses = x.d;
        if (x.c !== undefined) slot.charges = x.c;
        if (x.cp !== undefined) slot.chargeProgress = x.cp;
        if (x.no !== undefined) slot.nameOverride = x.no;
        if (x.so !== undefined) slot.statsOverride = x.so;
        if (x.ia !== undefined) slot.isAltered = x.ia;
        if (x.f !== undefined) slot.filled = x.f;
        if (x.e !== undefined) slot.expiresAt = x.e;
    }
    return slot;
}

/**
 * Rebuild a full GeneratedRepeatableQuest from a minified version
 */
function inflateRepeatableQuest(min: any): any {
    if (!min || typeof min !== 'object') return min;
    if (min.title) return min; // Already full
    
    // Resolve ID if numeric
    const resolvedId = typeof min.id === 'number' ? QUEST_NUM_MAP[min.id] : min.id;
    const poolQuest = REPEATABLE_QUEST_POOL.find(q => q.id === resolvedId);
    if (!poolQuest) return min;
    
    // Restore randomized fields from shortened keys
    const res: any = { ...poolQuest };
    if (min.q !== undefined) res.requiredQuantity = min.q;
    if (min.c !== undefined) res.finalCoinReward = min.c;
    if (min.x !== undefined) {
        res.xpReward = { ...poolQuest.xpReward, amount: min.x };
    }

    return res;
}

/**
 * Takes a loaded game state (v0, v1, or v2) and restores all pruned data.
 */
export function inflateGameState(state: any): any {
    if (!state || typeof state !== 'object') return state;

    // --- DETECT VERSION ---
    const v = state._v || (state._minified ? 1 : 0);

    if (v >= 2) {
        // --- INFLATE VERSION 2 (DEEP) ---
        const full: any = {
            username: state.u,
            playerType: state.pt,
            currentHp: state.hp,
            isDead: state.dead,
            currentPoiId: state.loc,
            coins: state.c || state.coins || 0,
            deaths: state.d || state.deaths || 0,
            startTime: state.st,
            slayerTask: state.slayer,
            agilityState: state.ag,
            autocastSpell: typeof state.ac === 'string' ? SPELLS.find(s => s.id === state.ac) : state.ac,
            currentPrayer: state.cp,
            combatStance: state.cs,
            activePrayers: state.ap,
            statModifiers: state.sm,
            activeBuffs: state.ab,
            runEnergy: state.re !== undefined ? state.re : 100,
            isRunToggled: !!state.rt,
            monsterRespawnTimers: state.mr || {},
            settings: {}
        };

        if (state.stwt && typeof state.stwt === 'object') {
            const inflatedStwt: Record<string, number> = {};
            for (const [shortKey, index] of Object.entries(state.stwt)) {
                if (typeof index === 'number') {
                    const wt = SAVE_KEY_TO_WEAPON_TYPE[shortKey];
                    if (wt) {
                        inflatedStwt[wt] = index;
                    }
                }
            }
            if (Object.keys(inflatedStwt).length > 0) {
                full.stylesByWeaponType = inflatedStwt;
            }
        }

        // 1. Skills
        if (Array.isArray(state.s)) {
            full.skills = ALL_SKILLS.map((skillDef, i) => {
                const xp = state.s[i] || 0;
                return { name: skillDef.name, xp, level: getLevelForXp(xp) };
            });
        }

        // 2. Inventory
        if (Array.isArray(state.i)) {
            full.inventory = state.i.map(inflateSlot);
            while (full.inventory.length < INVENTORY_CAPACITY) full.inventory.push(null);
        } else {
            full.inventory = Array(INVENTORY_CAPACITY).fill(null);
        }

        // 3. Bank
        if (Array.isArray(state.b)) {
            full.bank = state.b.map((tab: any) => {
                if (!tab) return null;
                return {
                    id: tab.id,
                    name: tab.n,
                    items: (tab.i || []).map(inflateSlot)
                };
            });
        }

        // 4. Quests
        const inflatedQuests: any[] = [];
        if (state.q && typeof state.q === 'object') {
            for (const [id, status] of Object.entries(state.q)) {
                if (status === 1) {
                    const questDef = (QUESTS as any)[id];
                    const maxStage = questDef ? questDef.stages.length : 0;
                    inflatedQuests.push({ questId: id, currentStage: maxStage, progress: 0, isComplete: true });
                } else if (Array.isArray(status)) {
                    inflatedQuests.push({ questId: id, currentStage: status[0], progress: status[1], isComplete: false });
                }
            }
        }
        full.playerQuests = inflatedQuests;

        // 5. Equipment
        full.equipment = {};
        if (state.e && typeof state.e === 'object') {
            for (const [slot, item] of Object.entries(state.e)) {
                full.equipment[slot] = inflateSlot(item);
            }
        }

        // 6. World State
        if (state.w) {
            const mut = (state.w.mut || []).map((tId: string | number) => {
                if (typeof tId === 'number') {
                    const match = MUSIC_TRACKS.find(mt => mt.trackNum === tId);
                    return match ? match.id : tId;
                }
                return tId;
            });

            const gh: Record<string, any> = {};
            if (state.w.gh) {
                for (const [id, data] of Object.entries(state.w.gh as Record<string, any>)) {
                    if (Array.isArray(data)) {
                        // Minified as [tierId, level]
                        gh[id] = { tierId: data[0], level: data[1], activities: [] };
                    } else if (data && typeof data === 'object' && data.a) {
                        // Minified with activities
                        gh[id] = { tierId: data.t, level: data.l, activities: data.a };
                    } else {
                        gh[id] = data; // fallback or old format
                    }
                }
            }

            let aps = null;
            if (state.w.aps) {
                const a = state.w.aps;
                if (a.h) {
                    aps = {
                        housePoiId: a.h,
                        entryPoiId: a.e,
                        startTime: a.s,
                        tierId: a.t,
                        tierLevel: a.tl,
                        lootedContainerIds: a.lc || []
                    };
                } else {
                    aps = a; // old format
                }
            }

            full.worldState = {
                unlockedMusicTracks: mut,
                dehydrationLevel: state.w.dh || 0,
                windmillFlour: state.w.fl || 0,
                poiImmunity: state.w.im || {},
                recentlyKilled: state.w.rk || [],
                generatedHouses: gh,
                monolithFires: state.w.mf || {},
                questVariables: state.w.qv || {},
                eventNextTrigger: state.w.ent || {},
                depletedHouses: state.w.dph || [],
                nextHouseResetTimestamp: state.w.nrt || 0,
                deathMarker: state.w.dm || null,
                destructionTrialProgress: state.w.dtp || null,
                activePilferingSession: aps
            };
        }

        // 6b. Progression
        if (Array.isArray(state.lp)) full.lockedPois = state.lp;
        if (Array.isArray(state.cso)) full.clearedSkillObstacles = state.cso;

        // 7. Resource Nodes
        full.resourceNodeStates = {};
        if (state.rn) {
            for (const [id, timer] of Object.entries(state.rn)) {
                const t = timer as number;
                full.resourceNodeStates[id] = { 
                    resources: 0, 
                    respawnTimer: t === -1 ? 0 : t 
                };
            }
        }

        // 8. Ground Items
        full.groundItems = {};
        if (state.gi) {
            for (const [poiId, items] of Object.entries(state.gi as Record<string, any[]>)) {
                full.groundItems[poiId] = items.map(i => ({
                    item: inflateSlot(i.i),
                    expiresAt: i.e,
                    uniqueId: i.u,
                    isDeathPile: !!i.d
                }));
            }
        }

        // 8. Repeatable Quests
        if (state.rq) {
            full.repeatableQuestsState = { 
                boards: {}, 
                activePlayerQuest: null,
                nextResetTimestamp: state.rq.rt || 0,
                completedQuestIds: state.rq.c || [],
                boardCompletions: state.rq.bc || {}
            };
            
            // Inflate Active Player Quest
            if (state.rq.apq) {
                const a = state.rq.apq;
                if (a.id) { // New minified format
                    full.repeatableQuestsState.activePlayerQuest = {
                        questId: a.id,
                        boardId: a.bid,
                        progress: a.p,
                        generatedQuest: inflateRepeatableQuest(a.gq)
                    };
                } else { // Legacy format
                    full.repeatableQuestsState.activePlayerQuest = a;
                    if (a.generatedQuest) {
                        full.repeatableQuestsState.activePlayerQuest.generatedQuest = inflateRepeatableQuest(a.generatedQuest);
                    }
                }
            }

            // Inflate Boards
            if (state.rq.b) {
                for (const [bid, qs] of Object.entries(state.rq.b)) {
                    if (Array.isArray(qs)) full.repeatableQuestsState.boards[bid] = qs.map(inflateRepeatableQuest);
                }
            }
        }

        // 9. Settings
        const DEFAULT_SETTINGS = {
            showTooltips: true, showXpDrops: true, confirmValuableDrops: true, valuableDropThreshold: 1000,
            showMinimapHealth: false, showCombatPlayerHealth: false, showCombatEnemyHealth: false,
            showHitsplats: true, isOneClickMode: false,
            devSettings: { xpMultiplier: 1, combatSpeedMultiplier: 1, isPlayerInvisible: false, isAutoBankOn: false, isGodModeOn: false }
        };
        const merge = (target: any, source: any) => {
            for (const [k, v] of Object.entries(source)) {
                if (v && typeof v === 'object' && target[k]) merge(target[k], v);
                else target[k] = v;
            }
        };
        full.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        if (state.set) merge(full.settings, state.set);
        if (state.set?.dev) merge(full.settings.devSettings, state.set.dev);

        // 10. Slayer
        if (full.slayerTask && full.slayerTask.id) {
            full.slayerTask = {
                monsterId: full.slayerTask.id,
                requiredCount: full.slayerTask.rc ?? 10,
                progress: full.slayerTask.p ?? 0,
                isComplete: full.slayerTask.c === 1 || full.slayerTask.isComplete === true
            };
        }

        // Clean up and replace state
        Object.keys(state).forEach(k => delete state[k]);
        Object.assign(state, full);
    } else {
        // --- INFLATE VERSION 0/1 (LEGACY/SHALLOW) ---
        // Skill levels
        if (Array.isArray(state.skills)) {
            state.skills = state.skills.map((s: any) => {
                const xp = s.xp ?? (typeof s === 'number' ? s : 0);
                const name = s.name ?? "Unknown";
                return { name, xp, level: s.level ?? getLevelForXp(xp) };
            });
        }
        // Inventory
        if (Array.isArray(state.inventory)) {
            state.inventory = state.inventory.map((slot: any) => {
                if (slot && typeof slot === 'object' && slot.noted === undefined) slot.noted = false;
                return slot;
            });
            while (state.inventory.length < INVENTORY_CAPACITY) state.inventory.push(null);
        }
        // Repeatable Quests
        if (state.repeatableQuestsState?.boards) {
            for (const bid of Object.keys(state.repeatableQuestsState.boards)) {
                const qs = state.repeatableQuestsState.boards[bid];
                if (Array.isArray(qs)) state.repeatableQuestsState.boards[bid] = qs.map(inflateRepeatableQuest);
            }
            if (state.repeatableQuestsState.activePlayerQuest?.generatedQuest) {
                state.repeatableQuestsState.activePlayerQuest.generatedQuest = inflateRepeatableQuest(state.repeatableQuestsState.activePlayerQuest.generatedQuest);
            }
        }
    }

    // Recalculate derived if missing
    if (state.isDead === undefined) state.isDead = (state.currentHp ?? 0) <= 0;
    if (state.combatLevel === undefined && Array.isArray(state.skills)) {
        const get = (n: string) => state.skills.find((s: any) => s.name === n)?.level ?? 1;
        const atk = get('Attack'); const str = get('Strength'); const def = get('Defence');
        const rng = get('Ranged'); const mag = get('Magic'); const pry = get('Prayer'); const hp = get('Hitpoints');
        const b = 0.25 * (def + hp + Math.floor(pry / 2));
        const ml = 0.325 * (atk + str); const rg = 0.325 * Math.floor(rng * 1.5); const mg = 0.325 * Math.floor(mag * 1.5);
        state.combatLevel = Math.floor(b + Math.max(ml, rg, mg));
    }

    return state;
}
