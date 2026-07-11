# Audit Report: Scales of the Swamp - Stage 3

I have conducted a thorough audit of Stage 3 of the "Scales of the Swamp" quest. Overall, the logic flow from Stage 2 (burning the ward) to Stage 3 (entering the thicket) and the POI unlock requirements correctly align. However, there are a few inconsistencies and polish issues that need addressing.

## 1. Lingering Activity (Visibility Check Missing)
**Location:** `data/pois/the_serpents_coil.ts` -> `mangrove_thicket_west`
**Issue:** The `Muddy Tracks` NPC activity lacks a `visibilityCheck`. After a player interacts with the tracks and advances to Stage 4, the "Muddy Tracks" activity will remain permanently visible at the POI. However, because the dialogue entry point in the quest file strictly requires `stage: 3` and has no `failureNode`, interacting with it later will result in a blank or broken interaction.
**Recommendation:** Add a `visibilityCheck` to the "Muddy Tracks" activity to hide it once the quest stage progresses past stage 3. 
```typescript
visibilityCheck: [{ type: 'quest', questId: 'scales_of_the_swamp', status: 'in_progress', stage: 3 }] // or similar based on your engine's supported checks
```

## 2. NPC Definition Icon Mismatch
**Location:** `data/quests/scales_of_the_swamp.ts` -> `npcDefs`
**Issue:** The `npcDefs` entry for `muddy_tracks` assigns it the `person` icon:
```typescript
muddy_tracks: { npcName: 'Muddy Tracks', npcIcon: 'person' },
```
Footprints are not a person. Additionally, the POI activity definition in `the_serpents_coil.ts` uses the `magnifying_glass` icon, creating an inconsistency between the POI interaction list and the dialogue screen.
**Recommendation:** Change the `npcIcon` in the quest file to match the POI, e.g., `'magnifying_glass'` or `'search'`.

## 3. Empty Failure Node in Entry Point
**Location:** `data/quests/scales_of_the_swamp.ts` -> `dialogueEntryPoints`
**Issue:** If a player somehow manages to interact with the Muddy Tracks when they are not exactly on Stage 3, the check will fail. Since the `failureNode` is `''`, this might cause an invisible dialog or error in the UI. 
**Recommendation:** Either ensure the activity is strictly hidden via `visibilityCheck` (as recommended in point 1), or add a generic fallback node (e.g., "(The tracks have washed away in the mud.)") for safety.

## 4. Continuity Verification (Pass)
- **POI Unlock:** `mangrove_thicket_west` correctly uses an `unlockRequirement` of `stage: 3`. This prevents players from skipping the ward-burning sequence at the entrance.
- **Quest Log:** The stage description ("Navigate the dense mangroves...") and the player perspective ("The swamp is a maze. I need to find tracks...") correctly reflect the required actions.
- **Connections:** `mangrove_thicket_west` connects to `serpent_nesting_ground`, accurately reflecting the text in the `muddy_tracks_node` dialogue ("They lead toward the Nesting Ground.").
