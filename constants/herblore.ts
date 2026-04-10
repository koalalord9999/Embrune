export const HERBS = [
    { grimy: 'grimy_guromoot', clean: 'clean_guromoot', level: 1, xp: 2.5, grimyNum: 622, cleanNum: 623 },
    { grimy: 'grimy_spore_spud', clean: 'clean_spore_spud', level: 1, xp: 2.5, grimyNum: 624, cleanNum: 625 },
    { grimy: 'grimy_marleaf', clean: 'clean_marleaf', level: 5, xp: 3.8, grimyNum: 626, cleanNum: 627 },
    { grimy: 'grimy_swiftthistle', clean: 'clean_swiftthistle', level: 11, xp: 5, grimyNum: 628, cleanNum: 629 },
    { grimy: 'grimy_redfang_leaf', clean: 'clean_redfang_leaf', level: 20, xp: 6.3, grimyNum: 630, cleanNum: 631 },
    { grimy: 'grimy_suns_kiss', clean: 'clean_suns_kiss', level: 25, xp: 7.5, grimyNum: 632, cleanNum: 633 },
    { grimy: 'grimy_bog_nettle', clean: 'clean_bog_nettle', level: 30, xp: 8, grimyNum: 634, cleanNum: 635 },
    { grimy: 'grimy_gloom_moss', clean: 'clean_gloom_moss', level: 40, xp: 9, grimyNum: 636, cleanNum: 637 },
    { grimy: 'grimy_windwhisper_bud', clean: 'clean_windwhisper_bud', level: 48, xp: 10, grimyNum: 638, cleanNum: 639 },
    { grimy: 'grimy_cinderbloom', clean: 'clean_cinderbloom', level: 54, xp: 11.3, grimyNum: 640, cleanNum: 641 },
    { grimy: 'grimy_wyrmfire_petal', clean: 'clean_wyrmfire_petal', level: 63, xp: 11.8, grimyNum: 642, cleanNum: 643 },
    { grimy: 'grimy_duskshade', clean: 'clean_duskshade', level: 66, xp: 12.5, grimyNum: 644, cleanNum: 645 },
    { grimy: 'grimy_stonebloom', clean: 'clean_stonebloom', level: 70, xp: 13.8, grimyNum: 646, cleanNum: 647 },
];

export const HERBLORE_RECIPES = {
    unfinished: [
        { cleanHerbId: 'clean_guromoot', unfinishedPotionId: 'guromoot_potion_unf', level: 1, xp: 1, unfinishedNum: 648 },
        { cleanHerbId: 'clean_marleaf', unfinishedPotionId: 'marleaf_potion_unf', level: 5, xp: 1, unfinishedNum: 649 },
        { cleanHerbId: 'clean_swiftthistle', unfinishedPotionId: 'swiftthistle_potion_unf', level: 11, xp: 1, unfinishedNum: 650 },
        { cleanHerbId: 'clean_redfang_leaf', unfinishedPotionId: 'redfang_leaf_potion_unf', level: 20, xp: 1, unfinishedNum: 651 },
        { cleanHerbId: 'clean_suns_kiss', unfinishedPotionId: 'suns_kiss_potion_unf', level: 25, xp: 1, unfinishedNum: 652 },
        { cleanHerbId: 'clean_bog_nettle', unfinishedPotionId: 'bog_nettle_potion_unf', level: 30, xp: 1, unfinishedNum: 653 },
        { cleanHerbId: 'clean_gloom_moss', unfinishedPotionId: 'gloom_moss_potion_unf', level: 40, xp: 1, unfinishedNum: 654 },
        { cleanHerbId: 'clean_windwhisper_bud', unfinishedPotionId: 'windwhisper_bud_potion_unf', level: 48, xp: 1, unfinishedNum: 655 },
        { cleanHerbId: 'clean_cinderbloom', unfinishedPotionId: 'cinderbloom_potion_unf', level: 54, xp: 1, unfinishedNum: 656 },
        { cleanHerbId: 'clean_wyrmfire_petal', unfinishedPotionId: 'wyrmfire_petal_potion_unf', level: 63, xp: 1, unfinishedNum: 657 },
        { cleanHerbId: 'clean_duskshade', unfinishedPotionId: 'duskshade_potion_unf', level: 66, xp: 1, unfinishedNum: 658 },
        { cleanHerbId: 'clean_stonebloom', unfinishedPotionId: 'stonebloom_potion_unf', level: 70, xp: 1, unfinishedNum: 659 },
    ],
    finished: [
        // --- Guromoot Potions (Lvl 1 Herb) ---
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'spider_eggs', finishedPotionId: 'weak_attack_potion', level: 1, xp: 25, finishedNum: 660 },
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'weak_mining_potion', level: 3, xp: 28, finishedNum: 661 },
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'weapon_poison_weak', level: 10, xp: 45, finishedNum: 662 },
        
        // --- Marleaf Potions (Lvl 5 Herb) ---
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'stat_restore_potion', level: 5, xp: 30, finishedNum: 663 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'enchanted_bark', finishedPotionId: 'weak_woodcutting_potion', level: 7, xp: 35, finishedNum: 664 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'weak_crafting_potion', level: 10, xp: 40, finishedNum: 665 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'accuracy_potion', level: 15, xp: 55, finishedNum: 666 },
        
        // --- Swiftthistle Potions (Lvl 11 Herb) ---
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'weak_strength_potion', level: 11, xp: 50, finishedNum: 667 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'raw_sardine', finishedPotionId: 'weak_fishing_potion', level: 13, xp: 52, finishedNum: 668 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'iron_ore', finishedPotionId: 'weak_smithing_potion', level: 15, xp: 55, finishedNum: 669 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'redwater_kelp', finishedPotionId: 'energy_potion', level: 17, xp: 58, finishedNum: 670 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'spider_eggs', finishedPotionId: 'attack_potion', level: 22, xp: 60, finishedNum: 671 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'harpy_feather', finishedPotionId: 'hunters_brew', level: 22, xp: 68, finishedNum: 672 },

        // --- Redfang Leaf Potions (Lvl 20 Herb) ---
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'redwater_kelp', finishedPotionId: 'weak_defence_potion', level: 20, xp: 65, finishedNum: 673 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'mining_potion', level: 23, xp: 68, finishedNum: 674 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'evasion_potion', level: 24, xp: 68, finishedNum: 675 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'strength_potion', level: 26, xp: 70, finishedNum: 676 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'giant_crab_claw', finishedPotionId: 'weapon_poison_strong', level: 33, xp: 80, finishedNum: 677 },

        // --- Sun's Kiss Potions (Lvl 25 Herb) ---
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'glimmerhorn_dust', finishedPotionId: 'antipoison_potion', level: 25, xp: 70, finishedNum: 678 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'willow_logs', finishedPotionId: 'weak_fletching_potion', level: 28, xp: 72, finishedNum: 679 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'enchanted_bark', finishedPotionId: 'woodcutting_potion', level: 31, xp: 78, finishedNum: 680 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'redwater_kelp', finishedPotionId: 'defence_potion', level: 34, xp: 85, finishedNum: 681 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'coal', finishedPotionId: 'sunfire_elixir', level: 38, xp: 95, finishedNum: 682 },

        // --- Bog Nettle Potions (Lvl 30 Herb) ---
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'consecrated_dust', finishedPotionId: 'prayer_potion', level: 30, xp: 75, finishedNum: 683 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'raw_sardine', finishedPotionId: 'fishing_potion', level: 36, xp: 90, finishedNum: 684 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'glimmerhorn_dust', finishedPotionId: 'pouch_cleanser', level: 38, xp: 95, finishedNum: 685 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'combo_brew', level: 42, xp: 105, finishedNum: 686 },

        // --- Gloom Moss Potions (Lvl 40 Herb) ---
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'bloodroot_tendril', finishedPotionId: 'super_attack_potion', level: 40, xp: 100, finishedNum: 687 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'frost_berries', finishedPotionId: 'super_energy_potion', level: 45, xp: 120, finishedNum: 688 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'cowhide', finishedPotionId: 'crafting_potion', level: 43, xp: 102, finishedNum: 689 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'iron_ore', finishedPotionId: 'smithing_potion', level: 45, xp: 105, finishedNum: 690 },
        
        // --- Windwhisper Bud Potions (Lvl 48 Herb) ---
        { unfinishedPotionId: 'windwhisper_bud_potion_unf', secondaryId: 'harpy_feather', finishedPotionId: 'ranged_potion', level: 48, xp: 110, finishedNum: 691 },
        { unfinishedPotionId: 'windwhisper_bud_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'super_ranged_potion', level: 52, xp: 118, finishedNum: 692 },

        // --- Cinderbloom Potions (Lvl 54 Herb) ---
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'super_strength_potion', level: 54, xp: 125, finishedNum: 693 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'serpent_scale', finishedPotionId: 'weapon_poison_super', level: 55, xp: 130, finishedNum: 694 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'weak_herblore_potion', level: 56, xp: 128, finishedNum: 695 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'willow_logs', finishedPotionId: 'fletching_potion', level: 59, xp: 140, finishedNum: 696 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'overload_potion_weak', level: 64, xp: 160, finishedNum: 697 },

        // --- Wyrmfire Petal Potions (Lvl 63 Herb) ---
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'magic_potion', level: 63, xp: 155, finishedNum: 698 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'antifire_potion_weak', level: 66, xp: 160, finishedNum: 699 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'spectre_essence', finishedPotionId: 'super_magic_potion', level: 68, xp: 170, finishedNum: 700 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'serpent_scale_dust', finishedPotionId: 'antifire_potion', level: 72, xp: 175, finishedNum: 701 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'wyrmscale_dust', finishedPotionId: 'extended_antifire', level: 75, xp: 178, finishedNum: 702 },

        // --- Duskshade Potions (Lvl 66 Herb) ---
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'frost_berries', finishedPotionId: 'super_defence_potion', level: 66, xp: 165, finishedNum: 703 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'herblore_potion', level: 69, xp: 170, finishedNum: 704 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'unicorn_horn_dust', finishedPotionId: 'super_antipoison', level: 72, xp: 175, finishedNum: 705 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'spiked_toad_skin', finishedPotionId: 'spiketoad_potion', level: 78, xp: 180, finishedNum: 706 },

        // --- Stonebloom Potions (Lvl 70 Herb) ---
        { unfinishedPotionId: 'stonebloom_potion_unf', secondaryId: 'golem_core', finishedPotionId: 'stone_skin_potion', level: 80, xp: 200, finishedNum: 707 },
        { unfinishedPotionId: 'stonebloom_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'battlemasters_draught', level: 85, xp: 250, finishedNum: 708 },

        // --- Special ---
        { unfinishedPotionId: 'holy_water', secondaryId: 'clean_marleaf', finishedPotionId: 'anointing_oil', level: 5, xp: 20, finishedNum: 709 },
        { unfinishedPotionId: 'super_energy_potion', secondaryId: 'agility_paste', finishedPotionId: 'stamina_potion', level: 72, xp: 180, finishedNum: 710 }
    ],
};