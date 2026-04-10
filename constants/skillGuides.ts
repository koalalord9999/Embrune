import { SkillName, SkillGuideTab, SkillGuideEntry } from '../types';
import { SMITHING_RECIPES, SMELTING_RECIPES } from './recipes';
import { slayer as SLAYER_MONSTERS } from './monsters/slayer';

const toTitleCase = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Unf', ' (unf)');

const wrapGeneral = (entries: SkillGuideEntry[]): SkillGuideTab[] => [
    { id: 'general', label: 'General', entries }
];

export const SKILL_GUIDES: Record<SkillName, SkillGuideTab[]> = {
    [SkillName.Attack]: wrapGeneral([
        { level: 1, description: 'Increases your chance to hit with melee.' },
        { level: 1, description: 'Wield Bronze weapons.', itemId: 'bronze_sword' },
        { level: 5, description: 'Wield Iron weapons.', itemId: 'iron_sword' },
        { level: 10, description: 'Wield Steel weapons.', itemId: 'steel_sword' },
        { level: 20, description: 'Wield Mithril weapons.', itemId: 'mithril_sword' },
        { level: 30, description: 'Wield Adamantite weapons.', itemId: 'adamantite_sword' },
        { level: 40, description: 'Wield Runic weapons.', itemId: 'runic_sword' },
        { level: 60, description: 'Wield Aquatite weapons.', itemId: 'aquatite_sword' },
    ]),
    [SkillName.Strength]: wrapGeneral([
        { level: 1, description: 'Increases your maximum melee hit.' },
        { level: 1, description: 'Wield Bronze Warhammers.', itemId: 'bronze_warhammer' },
        { level: 5, description: 'Wield Iron Warhammers.', itemId: 'iron_warhammer' },
        { level: 10, description: 'Wield Steel Warhammers.', itemId: 'steel_warhammer' },
        { level: 20, description: 'Wield Mithril Warhammers.', itemId: 'mithril_warhammer' },
        { level: 30, description: 'Wield Adamantite Warhammers.', itemId: 'adamantite_warhammer' },
        { level: 40, description: 'Wield Runic Warhammers.', itemId: 'runic_warhammer' },
    ]),
    [SkillName.Defence]: wrapGeneral([
        { level: 1, description: 'Decrease the chance to be hit by physical attack.' },
        { level: 1, description: 'Wear Leather and Bronze armour.', itemId: 'bronze_platebody' },
        { level: 5, description: 'Wear Iron armour.', itemId: 'iron_platebody' },
        { level: 10, description: 'Wear Steel armour.', itemId: 'steel_platebody' },
        { level: 20, description: 'Wear Mithril armour.', itemId: 'mithril_platebody' },
        { level: 30, description: 'Wear Adamantite armour.', itemId: 'adamantite_platebody' },
        { level: 40, description: 'Wear Runic armour.', itemId: 'runic_platebody' },
        { level: 60, description: 'Wear Aquatite armour.', itemId: 'aquatite_platebody' },
    ]),
    [SkillName.Ranged]: [
        {
            id: 'armor', label: 'Armor', entries: [
                { level: 5, description: 'Boar Hide Armor', itemId: 'boar_hide_body' },
                { level: 10, description: 'Wolf Pelt Armor', itemId: 'wolf_pelt_body' },
                { level: 20, description: 'Bear Hide Armor', itemId: 'bear_hide_body' },
                { level: 40, description: 'Grovehide Armor', itemId: 'grovehide_body' },
                { level: 50, description: 'Frosthide Armor', itemId: 'frosthide_body' },
                { level: 60, description: 'Emberscale Armor', itemId: 'emberscale_body' },
                { level: 70, description: 'Deathscythe Armor', itemId: 'deathscythe_body' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'bows', label: 'Bows', entries: [
                { level: 1, description: 'Shortbow / Longbow', itemId: 'shortbow' },
                { level: 10, description: 'Oak Shortbow / Longbow', itemId: 'oak_shortbow' },
                { level: 20, description: 'Willow Shortbow / Longbow', itemId: 'willow_shortbow' },
                { level: 30, description: 'Feywood Shortbow / Longbow', itemId: 'feywood_shortbow' },
                { level: 40, description: 'Yew Shortbow / Longbow', itemId: 'yew_shortbow' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'crossbows', label: 'Crossbows', entries: [
                { level: 1, description: 'Bronze Crossbow', itemId: 'bronze_crossbow' },
                { level: 26, description: 'Iron Crossbow', itemId: 'iron_crossbow' },
                { level: 31, description: 'Steel Crossbow', itemId: 'steel_crossbow' },
                { level: 41, description: 'Mithril Crossbow', itemId: 'mithril_crossbow' },
                { level: 51, description: 'Adamantite Crossbow', itemId: 'adamantite_crossbow' },
                { level: 61, description: 'Runic Crossbow', itemId: 'runic_crossbow' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'ammo', label: 'Ammunition', entries: [
            ]
        }
    ],
    [SkillName.Magic]: [
        {
            id: 'attack', label: 'Attack Spells', entries: [
                { level: 1, description: 'Gust Dart', itemId: 'wizard_robe_top' },
                { level: 5, description: 'Aqua Dart', itemId: 'aqua_rune' },
                { level: 9, description: 'Stone Dart', itemId: 'stone_rune' },
                { level: 13, description: 'Ember Dart', itemId: 'ember_rune' },
                { level: 17, description: 'Gust Bolt', itemId: 'gust_rune' },
                { level: 24, description: 'Aqua Bolt', itemId: 'aqua_rune' },
                { level: 31, description: 'Stone Bolt', itemId: 'stone_rune' },
                { level: 38, description: 'Ember Bolt', itemId: 'ember_rune' },
                { level: 42, description: 'Gust Blast', itemId: 'gust_rune' },
                { level: 49, description: 'Aqua Blast', itemId: 'aqua_rune' },
                { level: 54, description: 'Stone Blast', itemId: 'stone_rune' },
                { level: 59, description: 'Ember Blast', itemId: 'ember_rune' },
                { level: 66, description: 'Gust Wave', itemId: 'gust_rune' },
                { level: 73, description: 'Aqua Wave', itemId: 'aqua_rune' },
                { level: 77, description: 'Stone Wave', itemId: 'stone_rune' },
                { level: 81, description: 'Ember Wave', itemId: 'ember_rune' },
                { level: 85, description: 'Gust Storm', itemId: 'aether_rune' },
                { level: 89, description: 'Aqua Storm', itemId: 'aether_rune' },
                { level: 92, description: 'Stone Storm', itemId: 'aether_rune' },
                { level: 95, description: 'Ember Storm', itemId: 'aether_rune' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'buffs', label: 'Buffs', entries: [
                { level: 66, description: 'Arcane Strength', itemId: 'anima_rune' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'utility', label: 'Utility Spells', entries: [
                { level: 3, description: 'Weaken', itemId: 'binding_rune' },
                { level: 7, description: 'Enchant Sapphire', itemId: 'sapphire_amulet' },
                { level: 23, description: 'Clarity of Thought', itemId: 'flux_rune' },
                { level: 25, description: 'Meadowdale Teleport', itemId: 'passage_rune' },
                { level: 27, description: 'Enchant Emerald', itemId: 'emerald_amulet' },
                { level: 31, description: 'Oakhaven Teleport', itemId: 'passage_rune' },
                { level: 33, description: 'Lesser Transmutation', itemId: 'flux_rune' },
                { level: 37, description: 'Silverhaven Teleport', itemId: 'passage_rune' },
                { level: 41, description: 'Vulnerability', itemId: 'nexus_rune' },
                { level: 43, description: 'Superheat Ore', itemId: 'ember_rune' },
                { level: 49, description: 'Enchant Ruby', itemId: 'ruby_amulet' },
                { level: 57, description: 'Enchant Diamond', itemId: 'diamond_amulet' },
                { level: 62, description: 'Greater Transmutation', itemId: 'anima_rune' },
                { level: 68, description: 'Enchant Sunstone', itemId: 'sunstone_amulet' },
                { level: 82, description: 'Enfeeble', itemId: 'anima_rune' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'armor', label: 'Armor', entries: [
                { level: 1, description: 'Wizard Robes', itemId: 'wizard_robe_top' },
            ]
        },
        {
            id: 'weapons', label: 'Weapons', entries: [
            ]
        }
    ],
    [SkillName.Hitpoints]: wrapGeneral([
        { level: 1, description: 'Increases your maximum health.' },
    ]),
    [SkillName.Prayer]: wrapGeneral([
        { level: 1, description: 'Unlock Iron Will.' },
        { level: 4, description: 'Unlock Rising Power.' },
        { level: 7, description: 'Unlock Focused Strike.' },
        { level: 10, description: 'Unlock Steady Aim.' },
        { level: 13, description: 'Unlock Arcane Intent.' },
        { level: 16, description: 'Unlock Rapid Heal.' },
        { level: 22, description: 'Unlock Stone Guard.' },
        { level: 25, description: 'Unlock Surging Might.' },
        { level: 25, description: 'Unlock Protect Item.' },
        { level: 28, description: 'Unlock Keen Edge.' },
        { level: 31, description: 'Unlock Sure Shot.' },
        { level: 34, description: 'Unlock Weaver\'s Mind.' },
        { level: 43, description: 'Unlock Aegis Form.' },
        { level: 46, description: 'Unlock Titan\'s Vigor.' },
        { level: 49, description: 'Unlock Blade Master.' },
        { level: 52, description: 'Unlock Deadeye.' },
        { level: 55, description: 'Unlock Archon\'s Insight.' },
        { level: 58, description: "Unlock Protect from Magic." },
        { level: 61, description: "Unlock Protect from Ranged." },
        { level: 65, description: "Unlock Protect from Melee." },
        { level: 70, description: 'Unlock Adamant Skin.' },
        { level: 73, description: 'Unlock Divine Strength.' },
        { level: 76, description: 'Unlock Unrelenting Focus.' },
        { level: 79, description: 'Unlock Celestial Sight.' },
        { level: 82, description: 'Unlock Arcane Mastery.' },
    ].sort((a, b) => a.level - b.level)),
    [SkillName.Woodcutting]: wrapGeneral([
        { level: 1, description: 'Chop normal Trees. Use Bronze or Iron Axe.', itemId: 'logs' },
        { level: 5, description: 'Chop Driftwood Trees.', itemId: 'driftwood_logs' },
        { level: 6, description: 'Use a Steel Axe.', itemId: 'steel_axe' },
        { level: 15, description: 'Chop Oak Trees.', itemId: 'oak_logs' },
        { level: 21, description: 'Use a Mithril Axe.', itemId: 'mithril_axe' },
        { level: 30, description: 'Chop Willow Trees.', itemId: 'willow_logs' },
        { level: 31, description: 'Use an Adamantite Axe.', itemId: 'adamantite_axe' },
        { level: 41, description: 'Use a Runic Axe.', itemId: 'runic_axe' },
        { level: 45, description: 'Chop Maple Trees.', itemId: 'maple_logs' },
        { level: 50, description: 'Chop Mahogany Trees.', itemId: 'mahogany_logs' },
        { level: 55, description: 'Chop Feywood Trees.', itemId: 'feywood_logs' },
        { level: 65, description: 'Chop Yew Trees.', itemId: 'yew_logs' },
    ].sort((a, b) => a.level - b.level)),
    [SkillName.Fletching]: [
        {
            id: 'bows', label: 'Bows', entries: [
                { level: 1, description: 'Shortbow', subDescription: 'Logs', itemId: 'shortbow' },
                { level: 5, description: 'Longbow', subDescription: 'Logs', itemId: 'longbow' },
                { level: 20, description: 'Oak Shortbow', subDescription: 'Oak Logs', itemId: 'oak_shortbow' },
                { level: 25, description: 'Oak Longbow', subDescription: 'Oak Logs', itemId: 'oak_longbow' },
                { level: 35, description: 'Willow Shortbow', subDescription: 'Willow Logs', itemId: 'willow_shortbow' },
                { level: 40, description: 'Willow Longbow', subDescription: 'Willow Logs', itemId: 'willow_longbow' },
                { level: 50, description: 'Feywood Shortbow', subDescription: 'Feywood Logs', itemId: 'feywood_shortbow' },
                { level: 55, description: 'Feywood Longbow', subDescription: 'Feywood Logs', itemId: 'feywood_longbow' },
                { level: 65, description: 'Yew Shortbow', subDescription: 'Yew Logs', itemId: 'yew_shortbow' },
                { level: 70, description: 'Yew Longbow', subDescription: 'Yew Logs', itemId: 'yew_longbow' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'crossbows', label: 'Crossbows', entries: [
                { level: 9, description: 'Bronze Crossbow', subDescription: 'Logs + Bronze Limbs', itemId: 'bronze_crossbow' },
                { level: 24, description: 'Iron Crossbow', subDescription: 'Oak Logs + Iron Limbs', itemId: 'iron_crossbow' },
                { level: 39, description: 'Steel Crossbow', subDescription: 'Willow Logs + Steel Limbs', itemId: 'steel_crossbow' },
                { level: 54, description: 'Mithril Crossbow', subDescription: 'Feywood Logs + Mithril Limbs', itemId: 'mithril_crossbow' },
                { level: 69, description: 'Adamantite Crossbow', subDescription: 'Yew Logs + Adamantite Limbs', itemId: 'adamantite_crossbow' },
                { level: 84, description: 'Runic Crossbow', subDescription: 'Mahogany Logs + Runic Limbs', itemId: 'runic_crossbow' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'ammunition', label: 'Ammunition', entries: [
                { level: 1, description: 'Arrow Shaft', subDescription: 'Logs', itemId: 'arrow_shaft' },
                { level: 1, description: 'Headless Arrow', subDescription: 'Arrow Shaft + Feather', itemId: 'headless_arrow' },
                { level: 1, description: 'Bronze Arrow', subDescription: 'Headless Arrow + Bronze Arrowtip', itemId: 'bronze_arrow' },
                { level: 1, description: 'Bronze Bolts', subDescription: 'Bronze Bolts (unf) + Feather', itemId: 'bronze_bolts' },
                { level: 15, description: 'Iron Arrow', subDescription: 'Headless Arrow + Iron Arrowtip', itemId: 'iron_arrow' },
                { level: 30, description: 'Steel Arrow', subDescription: 'Headless Arrow + Steel Arrowtip', itemId: 'steel_arrow' },
                { level: 45, description: 'Mithril Arrow', subDescription: 'Headless Arrow + Mithril Arrowtip', itemId: 'mithril_arrow' },
                { level: 50, description: 'Mithril Bolts', subDescription: 'Mithril Bolts (unf) + Feather', itemId: 'mithril_bolts' },
                { level: 60, description: 'Adamantite Arrow', subDescription: 'Headless Arrow + Adamantite Arrowtip', itemId: 'adamantite_arrow' },
                { level: 65, description: 'Adamantite Bolts', subDescription: 'Adamantite Bolts (unf) + Feather', itemId: 'adamantite_bolts' },
                { level: 75, description: 'Runic Arrow', subDescription: 'Headless Arrow + Runic Arrowtip', itemId: 'runic_arrow' },
                { level: 80, description: 'Runic Bolts', subDescription: 'Runic Bolts (unf) + Feather', itemId: 'runic_bolts' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'armor', label: 'Armor', entries: []
        }
    ],
    [SkillName.Firemaking]: [
        {
            id: 'logs', label: 'Logs', entries: [
                { level: 1, description: 'Logs', itemId: 'logs' },
                { level: 5, description: 'Driftwood Logs', itemId: 'driftwood_logs' },
                { level: 15, description: 'Oak Logs', itemId: 'oak_logs' },
                { level: 30, description: 'Willow Logs', itemId: 'willow_logs' },
                { level: 45, description: 'Maple Logs', itemId: 'maple_logs' },
                { level: 50, description: 'Mahogany Logs', itemId: 'mahogany_logs' },
                { level: 60, description: 'Yew Logs', itemId: 'yew_logs' },
                { level: 75, description: 'Feywood Logs', itemId: 'feywood_logs' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'flasks', label: 'Flasks', entries: [
                { level: 1, description: 'Refined Grease Flask', subDescription: '1 Ranged Damage', itemId: 'refined_grease_flask' },
                { level: 10, description: 'Animal Fat Flask', subDescription: '10 Ranged Damage', itemId: 'animal_fat_flask' },
                { level: 20, description: 'Tallow Flask', subDescription: '20 Ranged Damage', itemId: 'tallow_flask' },
                { level: 30, description: 'Rich Animal Fat Flask', subDescription: '30 Ranged Damage', itemId: 'rich_animal_fat_flask' },
                { level: 40, description: 'Beast Fat Flask', subDescription: '40 Ranged Damage', itemId: 'beast_fat_flask' },
                { level: 50, description: 'Titan Fat Flask', subDescription: '50 Ranged Damage', itemId: 'titan_fat_flask' },
                { level: 60, description: 'Dragon Flask', subDescription: '60 Ranged Damage', itemId: 'dragon_fat_flask' },
            ].sort((a, b) => a.level - b.level)
        }
    ],
    [SkillName.Fishing]: wrapGeneral([
        { level: 1, description: 'Catch Shrimp with a Small Fishing Net.', itemId: 'raw_shrimp' },
        { level: 5, description: 'Catch Sardines with a Fishing Rod and bait.', itemId: 'raw_sardine' },
        { level: 10, description: 'Catch Herring with a Fishing Rod and bait.', itemId: 'raw_herring' },
        { level: 20, description: 'Catch Trout with a Fly Fishing Rod and feathers.', itemId: 'raw_trout' },
        { level: 30, description: 'Catch Pike with a Fly Fishing Rod and feathers.', itemId: 'raw_pike' },
        { level: 38, description: 'Catch Eels with a Basket Trap.', itemId: 'raw_eel' },
        { level: 40, description: 'Catch Tuna with a Harpoon.', itemId: 'raw_tuna' },
        { level: 50, description: 'Catch Lobsters with an Ocean Box Trap.', itemId: 'raw_lobster' },
        { level: 53, description: 'Catch Molten Eels in the Volcanic Steam Vents.', itemId: 'molten_eel' },
        { level: 62, description: 'Catch Swordfish with a Harpoon.', itemId: 'raw_swordfish' },
        { level: 76, description: 'Catch Sharks with a Harpoon.', itemId: 'raw_shark' },
    ].sort((a, b) => a.level - b.level)),
    [SkillName.Cooking]: [
        {
            id: 'meat',
            label: 'Meat',
            entries: [
                { level: 1, description: 'Cook a Rat Kebab.', itemId: 'rat_kebab_cooked' },
                { level: 3, description: 'Cook Chicken.', itemId: 'cooked_chicken' },
                { level: 5, description: 'Cook Beef.', itemId: 'cooked_beef' },
                { level: 10, description: 'Cook Boar Meat.', itemId: 'cooked_boar_meat' },
                { level: 50, description: 'Cook Serpent Omelet.', itemId: 'serpent_omelet_cooked' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'fish',
            label: 'Fish',
            entries: [
                { level: 1, description: 'Cook Shrimp.', itemId: 'cooked_shrimp' },
                { level: 5, description: 'Cook Sardines.', itemId: 'cooked_sardine' },
                { level: 8, description: 'Cook Giant Crab Meat.', itemId: 'cooked_crab_meat' },
                { level: 10, description: 'Cook Herring.', itemId: 'cooked_herring' },
                { level: 20, description: 'Cook Trout.', itemId: 'cooked_trout' },
                { level: 30, description: 'Cook Pike.', itemId: 'cooked_pike' },
                { level: 38, description: 'Cook Eel.', itemId: 'cooked_eel' },
                { level: 40, description: 'Cook Tuna.', itemId: 'cooked_tuna' },
                { level: 50, description: 'Cook Lobster.', itemId: 'cooked_lobster' },
                { level: 62, description: 'Cook Swordfish.', itemId: 'cooked_swordfish' },
                { level: 76, description: 'Cook Shark.', itemId: 'cooked_shark' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'baking',
            label: 'Baking',
            entries: [
                { level: 1, description: 'Bread Dough', subDescription: 'Pot of Flour + Bucket of Water', itemId: 'bread_dough' },
                { level: 1, description: 'Pie Shell', subDescription: 'Pot of Flour + Bucket of Water + Pie Dish', itemId: 'pie_dough' },
                { level: 1, description: 'Pizza Base', subDescription: 'Pot of Flour + Bucket of Water', itemId: 'pizza_base' },
                { level: 1, description: 'Bread', subDescription: 'Bake Bread Dough', itemId: 'bread' },
                { level: 10, description: 'Berry Pie', subDescription: 'Pie Shell + Berries', itemId: 'berry_pie' },
                { level: 20, description: 'Meat Pie', subDescription: 'Pie Shell + Cooked Meat', itemId: 'meat_pie' },
                { level: 30, description: 'Apple Pie', subDescription: 'Pie Shell + Apple', itemId: 'apple_pie' },
                { level: 35, description: 'Plain Pizza', subDescription: 'Pizza Base + Tomato + Cheese', itemId: 'plain_pizza' },
                { level: 35, description: 'Meat Pizza', subDescription: 'Plain Pizza + Cooked Meat', itemId: 'meat_pizza' },
                { level: 40, description: 'Cake', subDescription: 'Pot of Flour + Egg + Bucket of Milk + Cake Tin', itemId: 'cake' },
                { level: 40, description: 'Anchovy Pizza', subDescription: 'Plain Pizza + Cooked Anchovy', itemId: 'anchovy_pizza' },
                { level: 47, description: 'Fish Pie', subDescription: 'Pie Shell + Trout or Pike', itemId: 'fish_pie' },
                { level: 50, description: 'Pineapple Pizza', subDescription: 'Plain Pizza + Pineapple', itemId: 'pineapple_pizza' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'misc',
            label: 'Misc',
            entries: [
                { level: 1, description: 'Cook Seaweed into Soda Ash.', itemId: 'seaweed' },
                { level: 1, description: 'Cook Scrambled Eggs.', itemId: 'scrambled_eggs' },
                { level: 26, description: 'Churn Milk into Cheese at a Windmill.', itemId: 'cheese' },
                { level: 1, description: 'Pour Rendered Fats into a Fused Flask.', itemId: 'animal_fat_flask' },
                { level: 10, description: 'Render Animal Fat', itemId: 'animal_fat' },
                { level: 20, description: 'Render Tallow', itemId: 'tallow' },
                { level: 30, description: 'Render Rich Animal Fat', itemId: 'rich_animal_fat' },
                { level: 40, description: 'Render Beast Fat', itemId: 'beast_fat' },
                { level: 50, description: 'Render Titan Fat', itemId: 'titan_fat' },
                { level: 60, description: 'Render Dragon Fat', itemId: 'dragon_fat' },
            ].sort((a, b) => a.level - b.level)
        }
    ],
    [SkillName.Crafting]: [
        {
            id: 'armor',
            label: 'Armor',
            entries: [
                { level: 1, description: 'Leather Gloves', subDescription: '1x Leather + 1x Thread', itemId: 'leather_gloves' },
                { level: 3, description: 'Leather Boots', subDescription: '1x Leather + 1x Thread', itemId: 'leather_boots' },
                { level: 5, description: 'Leather Vambraces', subDescription: '1x Leather + 1x Thread', itemId: 'leather_vambraces' },
                { level: 6, description: 'Leather Cowl', subDescription: '1x Leather + 1x Thread', itemId: 'leather_cowl' },
                { level: 7, description: 'Leather Chaps', subDescription: '2x Leather + 1x Thread', itemId: 'leather_chaps' },
                { level: 9, description: 'Leather Body', subDescription: '3x Leather + 1x Thread', itemId: 'leather_body' },
                { level: 9, description: 'Boar Hide Vambraces', subDescription: '1x Boar Leather + 1x Thread', itemId: 'boar_hide_vambraces' },
                { level: 10, description: 'Boar Hide Cowl', subDescription: '1x Boar Leather + 1x Thread', itemId: 'boar_hide_cowl' },
                { level: 11, description: 'Boar Hide Chaps', subDescription: '2x Boar Leather + 1x Thread', itemId: 'boar_hide_chaps' },
                { level: 13, description: 'Boar Hide Body', subDescription: '3x Boar Leather + 1x Thread', itemId: 'boar_hide_body' },
                { level: 18, description: 'Wolf Pelt Vambraces', subDescription: '1x Wolf Leather + 1x Thread', itemId: 'wolf_pelt_vambraces' },
                { level: 19, description: 'Wolf Pelt Cowl', subDescription: '1x Wolf Leather + 1x Thread', itemId: 'wolf_pelt_cowl' },
                { level: 20, description: 'Wolf Pelt Chaps', subDescription: '2x Wolf Leather + 1x Thread', itemId: 'wolf_pelt_chaps' },
                { level: 22, description: 'Wolf Pelt Body', subDescription: '3x Wolf Leather + 1x Thread', itemId: 'wolf_pelt_body' },
                { level: 32, description: 'Bear Hide Vambraces', subDescription: '1x Bear Leather + 1x Thread', itemId: 'bear_hide_vambraces' },
                { level: 33, description: 'Bear Hide Cowl', subDescription: '1x Bear Leather + 1x Thread', itemId: 'bear_hide_cowl' },
                { level: 34, description: 'Bear Hide Chaps', subDescription: '2x Bear Leather + 1x Thread', itemId: 'bear_hide_chaps' },
                { level: 36, description: 'Bear Hide Body', subDescription: '3x Bear Leather + 1x Thread', itemId: 'bear_hide_body' },
                { level: 52, description: 'Grovehide Vambraces', subDescription: '1x Grove Hide + 1x Thread', itemId: 'grovehide_vambs' },
                { level: 56, description: 'Grovehide Coif', subDescription: '2x Grove Hide + 1x Thread', itemId: 'grovehide_coif' },
                { level: 57, description: 'Grovehide Legs', subDescription: '2x Grove Hide + 1x Thread', itemId: 'grovehide_legs' },
                { level: 60, description: 'Grovehide Body', subDescription: '3x Grove Hide + 1x Thread', itemId: 'grovehide_body' },
                { level: 63, description: 'Frosthide Vambraces', subDescription: '1x Frost Hide + 1x Thread', itemId: 'frosthide_vambs' },
                { level: 65, description: 'Frosthide Coif', subDescription: '2x Frost Hide + 1x Thread', itemId: 'frosthide_coif' },
                { level: 66, description: 'Frosthide Legs', subDescription: '2x Frost Hide + 1x Thread', itemId: 'frosthide_legs' },
                { level: 69, description: 'Frosthide Body', subDescription: '3x Frost Hide + 1x Thread', itemId: 'frosthide_body' },
                { level: 74, description: 'Emberscale Vambraces', subDescription: '1x Emberscale + 1x Thread', itemId: 'emberscale_vambs' },
                { level: 76, description: 'Emberscale Coif', subDescription: '2x Emberscale + 1x Thread', itemId: 'emberscale_coif' },
                { level: 77, description: 'Emberscale Legs', subDescription: '2x Emberscale + 1x Thread', itemId: 'emberscale_legs' },
                { level: 79, description: 'Emberscale Body', subDescription: '3x Emberscale + 1x Thread', itemId: 'emberscale_body' },
                { level: 82, description: 'Deathscythe Vambraces', subDescription: '1x Deathscythe + 1x Thread', itemId: 'deathscythe_vambs' },
                { level: 84, description: 'Deathscythe Coif', subDescription: '2x Deathscythe + 1x Thread', itemId: 'deathscythe_coif' },
                { level: 85, description: 'Deathscythe Legs', subDescription: '2x Deathscythe + 1x Thread', itemId: 'deathscythe_legs' },
                { level: 87, description: 'Deathscythe Body', subDescription: '3x Deathscythe + 1x Thread', itemId: 'deathscythe_body' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'gems',
            label: 'Gems',
            entries: [
                { level: 20, description: 'Sapphire', subDescription: 'Chisel + Uncut Sapphire', itemId: 'sapphire' },
                { level: 27, description: 'Emerald', subDescription: 'Chisel + Uncut Emerald', itemId: 'emerald' },
                { level: 34, description: 'Ruby', subDescription: 'Chisel + Uncut Ruby', itemId: 'ruby' },
                { level: 43, description: 'Diamond', subDescription: 'Chisel + Uncut Diamond', itemId: 'diamond' },
                { level: 55, description: 'Sunstone', subDescription: 'Chisel + Uncut Sunstone', itemId: 'sunstone' },
                { level: 67, description: 'Tenebrite', subDescription: 'Chisel + Uncut Tenebrite', itemId: 'tenebrite' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'jewelry',
            label: 'Jewelry',
            entries: [
                { level: 20, description: 'Sapphire Ring', subDescription: 'Gold Bar + Sapphire + Ring Mould', itemId: 'sapphire_ring' },
                { level: 26, description: 'Sapphire Necklace', subDescription: 'Gold Bar + Sapphire + Necklace Mould', itemId: 'sapphire_necklace' },
                { level: 32, description: 'Sapphire Amulet', subDescription: 'Gold Bar + Sapphire + Amulet Mould', itemId: 'sapphire_amulet_u' },
                { level: 27, description: 'Emerald Ring', subDescription: 'Gold Bar + Emerald + Ring Mould', itemId: 'emerald_ring' },
                { level: 29, description: 'Emerald Necklace', subDescription: 'Gold Bar + Emerald + Necklace Mould', itemId: 'emerald_necklace' },
                { level: 31, description: 'Emerald Amulet', subDescription: 'Gold Bar + Emerald + Amulet Mould', itemId: 'emerald_amulet_u' },
                { level: 34, description: 'Ruby Ring', subDescription: 'Gold Bar + Ruby + Ring Mould', itemId: 'ruby_ring' },
                { level: 40, description: 'Ruby Necklace', subDescription: 'Gold Bar + Ruby + Necklace Mould', itemId: 'ruby_necklace' },
                { level: 50, description: 'Ruby Amulet', subDescription: 'Gold Bar + Ruby + Amulet Mould', itemId: 'ruby_amulet_u' },
                { level: 43, description: 'Diamond Ring', subDescription: 'Gold Bar + Diamond + Ring Mould', itemId: 'diamond_ring' },
                { level: 56, description: 'Diamond Necklace', subDescription: 'Gold Bar + Diamond + Necklace Mould', itemId: 'diamond_necklace' },
                { level: 70, description: 'Diamond Amulet', subDescription: 'Gold Bar + Diamond + Amulet Mould', itemId: 'diamond_amulet_u' },
                { level: 55, description: 'Sunstone Ring', subDescription: 'Gold Bar + Sunstone + Ring Mould', itemId: 'sunstone_ring' },
                { level: 70, description: 'Sunstone Necklace', subDescription: 'Gold Bar + Sunstone + Necklace Mould', itemId: 'sunstone_necklace' },
                { level: 80, description: 'Sunstone Amulet', subDescription: 'Gold Bar + Sunstone + Amulet Mould', itemId: 'sunstone_amulet_u' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'tomes',
            label: 'Tomes',
            entries: [
                { level: 10, description: 'Tome of Warding', subDescription: '5x Leather + 10x Thread + 20x Gust Rune + 5x Mystic Page', itemId: 'tome_of_warding' },
                { level: 20, description: 'Tome of Focus', subDescription: '5x Boar Leather + 20x Thread + 40x Aqua Rune + 12x Mystic Page', itemId: 'tome_of_focus' },
                { level: 30, description: 'Tome of Power', subDescription: '5x Harpy Talon + 30x Thread + 60x Stone Rune + 25x Mystic Page', itemId: 'tome_of_power' },
                { level: 40, description: 'Tome of the Arcane', subDescription: '5x Crystalline Chitin + 40x Thread + 80x Ember Rune + 50x Mystic Page', itemId: 'tome_of_the_arcane' },
                { level: 50, description: 'Tome of the Master', subDescription: '3x Eldritch Pearl + 50x Thread + 100x Flux Rune + 200x Mystic Page', itemId: 'tome_of_the_master' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'misc',
            label: 'Misc',
            entries: [
                { level: 1, description: 'Ball of Wool', subDescription: 'Wool', itemId: 'ball_of_wool' },
                { level: 10, description: 'Bow String', subDescription: 'Flax', itemId: 'bow_string' },
                { level: 15, description: 'Rope', subDescription: 'Flax', itemId: 'rope' },
                { level: 1, description: 'Molten Glass', subDescription: 'Bucket of Sand + Soda Ash', itemId: 'molten_glass' },
                { level: 12, description: 'Throwing Flask', subDescription: 'Molten Glass', itemId: 'throwing_flask' },
                { level: 1, description: 'Fused Throwing Flask', subDescription: 'Throwing Flask + Wool String', itemId: 'throwing_flask_fused' },
            ].sort((a, b) => a.level - b.level)
        }
    ],
    [SkillName.Mining]: wrapGeneral([
        { level: 1, description: 'Mine Copper and Tin ore. Use Bronze or Iron Pickaxe.', itemId: 'copper_ore' },
        { level: 6, description: 'Use a Steel Pickaxe.', itemId: 'steel_pickaxe' },
        { level: 15, description: 'Mine Iron ore.', itemId: 'iron_ore' },
        { level: 20, description: 'Mine Silver ore.', itemId: 'silver_ore' },
        { level: 21, description: 'Use a Mithril Pickaxe.', itemId: 'mithril_pickaxe' },
        { level: 30, description: 'Mine Coal.', itemId: 'coal' },
        { level: 31, description: 'Use an Adamantite Pickaxe.', itemId: 'adamantite_pickaxe' },
        { level: 40, description: 'Mine Gold Ore.', itemId: 'gold_ore' },
        { level: 41, description: 'Use a Runic Pickaxe.', itemId: 'runic_pickaxe' },
        { level: 45, description: 'Mine Brimstone.', itemId: 'brimstone' },
        { level: 50, description: 'Mine Mithril ore.', itemId: 'mithril_ore' },
        { level: 41, description: 'Use a Crystal Tipped Runic Pickaxe.', itemId: 'crystal_tipped_runic_pickaxe' },
        { level: 65, description: 'Mine Adamantite ore.', itemId: 'adamantite_ore' },
        { level: 75, description: 'Mine Titanium ore.', itemId: 'titanium_ore' },
    ].sort((a, b) => a.level - b.level)),
    [SkillName.Smithing]: [
        {
            id: 'smelting',
            label: 'Smelting',
            entries: SMELTING_RECIPES.map(r => ({
                level: r.level,
                description: toTitleCase(r.barType),
                subDescription: r.ingredients.map(ing => `${ing.quantity}x ${toTitleCase(ing.itemId)}`).join(' + '),
                itemId: r.barType
            })).sort((a, b) => a.level - b.level)
        },
        ...[
            { id: 'bronze', label: 'Bronze', barId: 'bronze_bar' },
            { id: 'iron', label: 'Iron', barId: 'iron_bar' },
            { id: 'steel', label: 'Steel', barId: 'steel_bar' },
            { id: 'mithril', label: 'Mithril', barId: 'mithril_bar' },
            { id: 'adamantite', label: 'Adamantite', barId: 'adamantite_bar' },
            { id: 'runic', label: 'Runic', barId: 'runic_bar' }
        ].map(metal => ({
            id: metal.id,
            label: metal.label,
            entries: SMITHING_RECIPES
                .filter(r => r.barType === metal.barId)
                .map(r => ({
                    level: r.level,
                    description: toTitleCase(r.itemId),
                    subDescription: `${r.barsRequired}x ${metal.label} Bar`,
                    itemId: r.itemId as string
                })).sort((a, b) => a.level - b.level)
        }))
    ],
    [SkillName.Herblore]: [], // Handled dynamically in SkillGuideView
    [SkillName.Runecrafting]: [
        {
            id: 'runes',
            label: 'Runes',
            entries: [
                { level: 1, description: 'Gust Runes', itemId: 'gust_rune' },
                { level: 2, description: 'Binding Runes', itemId: 'binding_rune' },
                { level: 5, description: 'Stone Runes', itemId: 'stone_rune' },
                { level: 9, description: 'Aqua Runes', itemId: 'aqua_rune' },
                { level: 14, description: 'Ember Runes', itemId: 'ember_rune' },
                { level: 20, description: 'Flux Runes', itemId: 'flux_rune' },
                { level: 27, description: 'Verdant Runes', itemId: 'verdant_rune' },
                { level: 35, description: 'Astral Runes', itemId: 'astral_rune' },
                { level: 44, description: 'Hex Runes', itemId: 'hex_rune' },
                { level: 50, description: 'Passage Runes', itemId: 'passage_rune' },
                { level: 55, description: 'Nexus Runes', itemId: 'nexus_rune' },
                { level: 72, description: 'Anima Runes', itemId: 'anima_rune' },
                { level: 85, description: 'Aether Runes', itemId: 'aether_rune' },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'multicraft',
            label: 'Multicraft',
            entries: [
                ...[
                    { id: 'gust_rune', level: 1, name: 'Gust' },
                    { id: 'binding_rune', level: 2, name: 'Binding' },
                    { id: 'stone_rune', level: 5, name: 'Stone' },
                    { id: 'aqua_rune', level: 9, name: 'Aqua' },
                    { id: 'ember_rune', level: 14, name: 'Ember' },
                    { id: 'flux_rune', level: 20, name: 'Flux' },
                    { id: 'verdant_rune', level: 27, name: 'Verdant' },
                    { id: 'astral_rune', level: 35, name: 'Astral' },
                    { id: 'hex_rune', level: 44, name: 'Hex' },
                    { id: 'passage_rune', level: 50, name: 'Passage' },
                    { id: 'nexus_rune', level: 55, name: 'Nexus' },
                    { id: 'anima_rune', level: 72, name: 'Anima' },
                    { id: 'aether_rune', level: 85, name: 'Aether' },
                ].flatMap(rune => {
                    const extraEntries = [];
                    for (let i = 1; i <= 6; i++) {
                        const requiredLevel = rune.level + (i * 8);
                        if (requiredLevel <= 99) {
                            extraEntries.push({
                                level: requiredLevel,
                                description: `${i + 1}x ${rune.name} Runes`,
                                itemId: rune.id
                            });
                        }
                    }
                    return extraEntries;
                }).sort((a, b) => a.level - b.level)
            ]
        }
    ],
    [SkillName.Slayer]: [
        {
            id: 'monsters',
            label: 'Monsters',
            entries: [
                { level: 5, description: 'Grasping Limb', subDescription: 'Undead', revealSubAtLevel: true },
                { level: 7, description: 'Stonehide Slug', subDescription: 'Beast', revealSubAtLevel: true },
                { level: 15, description: 'Gaze Fiend', subDescription: 'Beast', revealSubAtLevel: true },
                { level: 20, description: 'Ember Demon', subDescription: 'Demon / Elemental', revealSubAtLevel: true },
                { level: 30, description: 'Howling Terror', subDescription: 'Beast / Demon', revealSubAtLevel: true },
                { level: 35, description: 'Dust Fiend', subDescription: 'Elemental', revealSubAtLevel: true },
                { level: 40, description: 'Gelatinous Abomination', subDescription: 'Elemental', revealSubAtLevel: true },
                { level: 45, description: 'Leaf Beast', subDescription: 'Beast', revealSubAtLevel: true },
                { level: 45, description: 'Gargantuan Tusker', subDescription: 'Beast', revealSubAtLevel: true },
                { level: 50, description: 'Blighted Spectre', subDescription: 'Undead / Elemental', revealSubAtLevel: true },
                { level: 55, description: 'Ethereal Phantom', subDescription: 'Undead', revealSubAtLevel: true },
                { level: 60, description: 'Stone Guardian', subDescription: 'Elemental / Armored', revealSubAtLevel: true },
                { level: 70, description: 'Shadow Weaver', subDescription: 'Demon', revealSubAtLevel: true },
                { level: 75, description: 'Void Stalker', subDescription: 'Demon', revealSubAtLevel: true },
                { level: 80, description: 'Frost Wyvern', subDescription: 'Dragon', revealSubAtLevel: true },
            ].sort((a, b) => a.level - b.level)
        },
        {
            id: 'masters',
            label: 'Masters',
            entries: [
                { level: 1, description: 'Kaelen', subDescription: 'Silverhaven -- Assigns tasks from Combat Lv. 1+' },
                { level: 40, description: 'Ravindra', subDescription: 'Fouthia -- Desert-biased tasks, higher quantities' },
            ]
        },
        {
            id: 'info',
            label: 'Info',
            entries: [
                { level: 1, description: 'Visit Kaelen, the Slayer Master, in Silverhaven to receive tasks.' },
                { level: 50, description: 'Unlock access to the Slayer Blimp in Silverhaven.' },
            ]
        }
    ],
    [SkillName.Thieving]: [], // Handled dynamically in SkillGuideView
    [SkillName.Agility]: wrapGeneral([
        { level: 1, description: 'Start the Meadowdale Rooftop Course.' },
        { level: 12, description: "Start the Oakhaven Artisan's Run." },
        { level: 25, description: 'Start the Verdant Fields Traverse.' },
        { level: 30, description: 'Start the Salt Flats Skeleton Run.' },
        { level: 35, description: 'Start the Fouthia Rooftop Run.' },
        { level: 46, description: 'Start the Sanctity Cathedral Climb.' },
        { level: 55, description: 'Start the Shipwreck Graveyard Leap.' },
        { level: 65, description: 'Start the Crystalline Isles Traverse.' },
        { level: 70, description: 'Start the Silverhaven Castle Run.' },
        { level: 75, description: 'Start the Wyrmwood Treetop Run.' },
        { level: 80, description: 'Start the Gale-Swept Peaks Ridge Walk.' },
        { level: 90, description: 'Start the Volcanic Brimstone Run.' },
    ]),
};