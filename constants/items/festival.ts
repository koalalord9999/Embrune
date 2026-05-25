import { Item, EquipmentSlot, SkillName } from '../../types';

export const festival: Item[] = [
    // Whistles (blow action makes a toot)
    { id: 'red_whistle', itemNum: 800, name: 'Red Whistle', description: 'A bright red whistle. Blow it to make a loud toot!', stackable: false, value: 10, iconUrl: 'whistle', material: 'ruby' },
    { id: 'blue_whistle', itemNum: 801, name: 'Blue Whistle', description: 'A bright blue whistle. Blow it to make a loud toot!', stackable: false, value: 10, iconUrl: 'whistle', material: 'sapphire' },
    { id: 'green_whistle', itemNum: 802, name: 'Green Whistle', description: 'A bright green whistle. Blow it to make a loud toot!', stackable: false, value: 10, iconUrl: 'whistle', material: 'emerald' },
    { id: 'yellow_whistle', itemNum: 803, name: 'Yellow Whistle', description: 'A bright yellow whistle. Blow it to make a loud toot!', stackable: false, value: 10, iconUrl: 'whistle', material: 'sunstone' },
    // Festive Outfit
    { id: 'festive_hood', itemNum: 804, name: 'Festive Hood', description: 'A decorative hood adorned with glowing festival lights. Part of the Festive outfit.', stackable: false, value: 100, iconUrl: 'hood', equipment: { slot: EquipmentSlot.Head, }, material: 'emerald' },
    { id: 'festive_tunic', itemNum: 805, name: 'Festive Tunic', description: 'A vibrant tunic woven with festive patterns. Part of the Festive outfit.', stackable: false, value: 100, iconUrl: 'leather-vest', equipment: { slot: EquipmentSlot.Body, }, material: 'emerald' },
    { id: 'festive_trousers', itemNum: 806, name: 'Festive Trousers', description: 'Vibrant trousers to match the festive tunic. Part of the Festive outfit.', stackable: false, value: 100, iconUrl: 'leg-armor', equipment: { slot: EquipmentSlot.Legs, }, material: 'emerald' },
    { id: 'festive_gloves', itemNum: 807, name: 'Festive Gloves', description: 'Soft gloves decorated with gold embroidery. Part of the Festive outfit.', stackable: false, value: 100, iconUrl: 'gloves', equipment: { slot: EquipmentSlot.Gloves, }, material: 'emerald' },
    { id: 'festive_boots', itemNum: 808, name: 'Festive Boots', description: 'Comfortable boots designed for dancing and celebrating. Part of the Festive outfit.', stackable: false, value: 100, iconUrl: 'leather-boot', equipment: { slot: EquipmentSlot.Boots, }, material: 'emerald' },
    // Chase Item: Cape
    { id: 'festival_cape', itemNum: 809, name: 'Festival Cape', description: 'A spectacular flowing cape that glows with the warmth of a hundred lanterns. Doubles the Festive outfit bonus.', stackable: false, value: 500, iconUrl: 'cape', equipment: { slot: EquipmentSlot.Cape, }, material: 'emerald' },
    // Food Items
    { id: 'festival_pie', itemNum: 810, name: 'Festival Pie', description: 'A delicious pie filled with seasonal fruits.', stackable: false, value: 20, iconUrl: 'pie-slice', consumable: { healAmount: 12, }, material: 'uncut-emerald' },
    { id: 'festival_meat', itemNum: 811, name: 'Festival Meat', description: 'Perfectly roasted festival meat, seasoned with rich spices.', stackable: false, value: 25, iconUrl: 'meat', consumable: { healAmount: 15, }, material: 'raw-meat' },
    { id: 'festival_cake', itemNum: 812, name: 'Festival Cake', description: 'A sweet, frosted cake celebrating the Embrune anniversary.', stackable: false, value: 30, iconUrl: 'cake-slice', consumable: { healAmount: 18, }, material: 'raw-fish' },
    // Festival Currency
    { id: 'festival_ticket', itemNum: 799, name: 'Festival Ticket', description: 'A colorful ticket earned from participating in the Oakhaven Lantern Festival activities.', stackable: true, value: 0, iconUrl: 'ticket', material: 'emerald' },
    { id: 'festival_token', itemNum: 813, name: 'Festival Token', description: 'A token used for participating in the festival activities.', stackable: true, value: 1, iconUrl: 'token', material: 'gold' },
];

export const FESTIVAL_SKILL_ROTATION: SkillName[] = [
    SkillName.Woodcutting, SkillName.Fletching, SkillName.Firemaking, SkillName.Fishing,
    SkillName.Cooking, SkillName.Crafting, SkillName.Mining, SkillName.Smithing,
    SkillName.Herblore, SkillName.Runecrafting, SkillName.Thieving, SkillName.Agility,
];

export function getActiveFestivalSkill(): SkillName {
    // Deterministic selection based on the UTC date
    const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return FESTIVAL_SKILL_ROTATION[day % FESTIVAL_SKILL_ROTATION.length];
}

