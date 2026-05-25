
import { POI } from '../../types';
import { meadowdalePois } from './meadowdale';
import { minePois } from './mines';
import { southernRoadPois } from './southern_road';
import { wildernessPois } from './wilderness';
import { goblinDungeonPois } from './dungeon_goblin';
import { oakhavenRoadPois } from './oakhaven_road';
import { oakhavenPois } from './oakhaven';
import { galeSweptPeaksPois } from './gale_swept_peaks';
import { sunkenLandsPois } from './sunken_lands';
import { theVerdantFieldsPois } from './the_verdant_fields';
import { theFeywoodPois } from './the_feywood';
import { theSerpentsCoilPois } from './the_serpents_coil';
import { silverhavenPois } from './silverhaven';
import { banditHideoutPois } from './bandit_hideout';
import { isleOfWhispersPois } from './isle_of_whispers';
import { sunkenLabyrinthPois } from './dungeon_sunken_labyrinth';
import { tutorialZonePois } from './tutorial_zone';
import { dwarvenOutpostPois } from './dwarven_outpost';
import { saltFlatsPois } from './salt_flats';
import { crystallineIslesPois } from './crystalline_isles';
import { magusSpirePois } from './dungeon_magus_spire';
import { chasmOfWoePois } from './dungeon_chasm_of_woe';
import { pilferingPois } from './pilfering';
import { fouthiaPois } from './fouthia';
import { futureZonePois } from './future_zones';
import { sanctityPois } from './sanctity';
import { volcanicSteamVentsPois } from './volcanic_steam_vents';
import { sunbrightPlainsPois } from './sunbright_plains';
import { wyrmwoodGrovePois } from './wyrmwood_grove';
import { frostfangPeaksPois } from './frostfang_peaks';
import { sunscorchedWastesPois } from './sunscorched_wastes';
import { barrowOfTheRevenantPois } from './dungeon_barrow';
import { sunbrightUndergroundCavePois } from './sunbright_underground_cave';
import { agilityCoursePois } from './agility_courses';
import { newPois } from './new_pois';
import { lanternFestivalPois } from './lantern_festival';

import { DUSKWATCH_POIS } from './slayers_respite/duskwatch';
import { IRONMAW_POIS } from './slayers_respite/ironmaw';
import { BLEAKPOST_POIS } from './slayers_respite/bleakpost';
import { RESPITE_ROADS_POIS } from './slayers_respite/respite_roads';
import { HOLLOWED_BARROW_POIS } from './slayers_respite/dungeon_hollowed_barrow';
import { CINDERFORGE_DEPTHS_POIS } from './slayers_respite/dungeon_cinderforge_depths';
import { ABYSSAL_RIFT_POIS } from './slayers_respite/dungeon_abyssal_rift';
import { BONEMARSH_POIS } from './slayers_respite/the_bonemarsh';
import { SCORCHED_HOLLOW_POIS } from './slayers_respite/the_scorched_hollow';
import { SHATTERED_COAST_POIS } from './slayers_respite/the_shattered_coast';
import { FROSTSPINE_RIDGE_POIS } from './slayers_respite/frostspine_ridge';
import { THORNVEIL_POIS } from './slayers_respite/the_thornveil';
import { ABYSSAL_EXPANSE_POIS } from './slayers_respite/the_abyssal_expanse';

export const POIS: Record<string, POI> = {
    ...tutorialZonePois,
    ...meadowdalePois,
    ...wildernessPois,
    ...minePois,
    ...southernRoadPois,
    ...goblinDungeonPois,
    ...oakhavenRoadPois,
    ...oakhavenPois,
    ...galeSweptPeaksPois,
    ...sunkenLandsPois,
    ...theVerdantFieldsPois,
    ...theFeywoodPois,
    ...theSerpentsCoilPois,
    ...silverhavenPois,
    ...banditHideoutPois,
    ...isleOfWhispersPois,
    ...sunkenLabyrinthPois,
    ...dwarvenOutpostPois,
    ...saltFlatsPois,
    ...crystallineIslesPois,
    ...magusSpirePois,
    ...chasmOfWoePois,
    ...pilferingPois,
    ...fouthiaPois,
    ...futureZonePois,
    ...sanctityPois,
    ...volcanicSteamVentsPois,
    ...sunbrightPlainsPois,
    ...sunbrightUndergroundCavePois,
    ...wyrmwoodGrovePois,
    ...frostfangPeaksPois,
    ...sunscorchedWastesPois,
    ...barrowOfTheRevenantPois,
    ...agilityCoursePois,
    ...newPois,
    ...lanternFestivalPois,
    ...DUSKWATCH_POIS,
    ...IRONMAW_POIS,
    ...BLEAKPOST_POIS,
    ...RESPITE_ROADS_POIS,
    ...HOLLOWED_BARROW_POIS,
    ...CINDERFORGE_DEPTHS_POIS,
    ...ABYSSAL_RIFT_POIS,
    ...BONEMARSH_POIS,
    ...SCORCHED_HOLLOW_POIS,
    ...SHATTERED_COAST_POIS,
    ...FROSTSPINE_RIDGE_POIS,
    ...THORNVEIL_POIS,
    ...ABYSSAL_EXPANSE_POIS,
};