import React, { useMemo } from 'react';
import { Spell, PlayerSkill, SkillName, InventorySlot, Equipment, WeaponType } from '../../types';
import {  SPELLS, ITEMS, getIconClassName, getIconUrl  } from '../../constants';
import { TooltipState, useUIState } from '../../hooks/useUIState';

interface SpellbookPanelProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    inventory: (InventorySlot | null)[];
    equipment: Equipment;
    onCastSpell: (spell: Spell) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    autocastSpell: Spell | null;
    ui: ReturnType<typeof useUIState>;
}

const getSpellIconUrl = (spell: Spell): string => {
    if (spell.type === 'combat') {
        if (spell.id.includes('_dart')) return 'wind-slap';
        if (spell.id.includes('_bolt')) return 'swirl-ring';
        if (spell.id.includes('_blast')) return 'cloudy-fork';
        if (spell.id.includes('_wave')) return 'entangled-typhoon';
        if (spell.id.includes('_storm')) return 'tornado';
    }
    switch (spell.type) {
        case 'utility-teleport': return 'portal';
        case 'utility-enchant': return 'glowing-hands';
        case 'utility-alchemy': return 'shiny-purse';
        case 'utility-processing': return 'fission';
        case 'curse': return 'slalom';
        case 'enhancement': return 'aura';
        default: return 'book';
    }
};

const getSpellIconClassName = (spell: Spell): string => {
    // Combat spells are colored by their element
    if (spell.type === 'combat' && spell.element) {
        const elementToMaterialSuffix: Record<string, string> = {
            'wind': 'rune-gust',
            'water': 'rune-aqua',
            'earth': 'rune-stone',
            'fire': 'rune-ember',
        };
        const material = elementToMaterialSuffix[spell.element];
        if (material) {
            return `item-icon-${material}`;
        }
    }

    // Teleport spells are purple
    if (spell.type === 'utility-teleport') {
        return 'item-icon-rune-binding';
    }
    
    // Enchant spells are colored by their gem
    if (spell.type === 'utility-enchant') {
        if (spell.id.includes('sapphire')) return 'item-icon-uncut-sapphire';
        if (spell.id.includes('emerald')) return 'item-icon-uncut-emerald';
        if (spell.id.includes('ruby')) return 'item-icon-uncut-ruby';
        if (spell.id.includes('diamond')) return 'item-icon-uncut-diamond';
        if (spell.id.includes('sunstone')) return 'item-icon-uncut-sunstone';
    }

    // Transmutation spells are colored like emeralds
    if (spell.type === 'utility-alchemy') {
        if (spell.id === 'lesser_transmutation') return 'item-icon-uncut-emerald';
        if (spell.id === 'greater_transmutation') return 'item-icon-emerald';
    }
    
    // Superheat Ore
    if (spell.id === 'superheat_ore') {
        return 'item-icon-rune-ember';
    }
    
    // Curse spells are colored by their effect
    if (spell.type === 'curse') {
        if (spell.id === 'weaken') return 'item-icon-uncut-ruby'; // Attack
        if (spell.id === 'enfeeble') return 'item-icon-uncut-emerald'; // Strength
        if (spell.id === 'vulnerability') return 'item-icon-uncut-sapphire'; // Defence
    }

    // Enhancement spells - Use cut gem colors
    if (spell.type === 'enhancement') {
        if (spell.id === 'clarity_of_thought') return 'item-icon-sapphire'; // Intellect/Magic
        if (spell.id === 'arcane_strength') return 'item-icon-ruby'; // Power/Strength
    }
    
    // Fallback for all other spells
    return 'filter invert';
};

interface SpellDisplayProps {
    spell: Spell;
    magicLevel: number;
    inventory: (InventorySlot | null)[];
    equipment: Equipment;
    onCastSpell: (spell: Spell) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    autocastSpell: Spell | null;
}

const SpellDisplay: React.FC<SpellDisplayProps> = ({ spell, magicLevel, inventory, equipment, onCastSpell, setTooltip, autocastSpell }) => {
    const isAutocasting = autocastSpell?.id === spell.id;

    const canCast = useMemo(() => {
        const hasRequiredLevel = magicLevel >= spell.level;

        const equippedStaff = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const providedRune = equippedStaff?.equipment?.weaponType === WeaponType.Staff ? equippedStaff.equipment.providesRune : null;
        const needed = spell.runes.filter(r => r.itemId !== providedRune);
        
        const hasRunes = needed.every(rune => {
            const playerHas = inventory.reduce((acc, slot) => slot?.itemId === rune.itemId ? acc + slot.quantity : acc, 0);
            return playerHas >= rune.quantity;
        });
        
        return hasRequiredLevel && hasRunes;
    }, [magicLevel, spell, inventory, equipment.weapon]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        const hasRequiredLevel = magicLevel >= spell.level;
        const levelColor = hasRequiredLevel ? 'text-green-400' : 'text-red-400';
        
        const equippedStaff = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const providedRune = equippedStaff?.equipment?.weaponType === WeaponType.Staff ? equippedStaff.equipment.providesRune : null;

        const runeList = spell.runes.map(r => {
            const runeItem = ITEMS[r.itemId];
            if (r.itemId === providedRune) {
                return `<li class="text-green-400 font-bold text-lg">∞ ${runeItem.name}</li>`;
            }
            const playerHas = inventory.reduce((acc, slot) => slot?.itemId === r.itemId ? acc + slot.quantity : acc, 0);
            const color = playerHas >= r.quantity ? 'text-green-400' : 'text-red-400';
            return `<li class="${color} font-bold text-lg">${r.quantity}x ${runeItem.name}</li>`;
        }).join('');

        setTooltip({
            content: (
                <div className="text-left w-64 font-pixel-rpg">
                    <p className="font-bold text-yellow-300 text-xl">{spell.name}</p>
                    <p className={`text-lg italic mb-2 ${levelColor} leading-none`}>Lvl {spell.level} Magic</p>
                    <p className="text-lg text-gray-300 mb-2 leading-tight">{spell.description}</p>
                    <ul className="text-lg list-none space-y-1" dangerouslySetInnerHTML={{ __html: runeList }} />
                </div>
            ),
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const teleportOverlay = useMemo(() => {
        if (spell.type !== 'utility-teleport') return null;
        let letter = '';
        if (spell.id === 'meadowdale_teleport') letter = 'M';
        else if (spell.id === 'oakhaven_teleport') letter = 'O';
        else if (spell.id === 'silverhaven_teleport') letter = 'S';

        if (letter) {
            const textColorClass = canCast ? 'text-white' : 'text-black';
            return (
                <span 
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${textColorClass} text-1xl font-bold pointer-events-none`}
                    style={{ textShadow: '1px 1px 3px gray-500, -1px -1px 3px gray-500, 1px -1px 3px gray-500, -1px 1px 3px gray-500' }}
                >
                    {letter}
                </span>
            );
        }
        return null;
    }, [spell.id, spell.type, canCast]);

    return (
        <button
            onClick={() => { onCastSpell(spell); setTooltip(null); }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
            className={`w-full aspect-square rounded-md transition-colors flex items-center justify-center text-center hover:bg-gray-700/20 relative isolate ${isAutocasting ? 'autocast-orb-highlight' : ''}`}
        >
            <img src={getIconUrl(getSpellIconUrl(spell))} alt={spell.name} className={`w-full h-full p-1 ${getSpellIconClassName(spell)}`} style={!canCast ? { opacity: 0.4 } : {}} />
            {teleportOverlay}
        </button>
    );
};


const SpellbookPanel: React.FC<SpellbookPanelProps> = ({ skills, inventory, equipment, onCastSpell, setTooltip, autocastSpell, ui }) => {
    const magicLevel = skills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

    const spellsToDisplay = useMemo(() => {
        const sorted = [...SPELLS].sort((a, b) => a.level - b.level);
        if (ui.isSelectingAutocastSpell) {
            return sorted.filter(spell => spell.autocastable && spell.type === 'combat');
        }
        return sorted;
    }, [ui.isSelectingAutocastSpell]);

    return (
        <div className="flex flex-col h-full text-gray-300 font-pixel-rpg">
            {ui.isSelectingAutocastSpell && <h3 className="text-xl font-bold text-center mb-2 text-yellow-400">Select Autocast Spell</h3>}
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-1">
                    {spellsToDisplay.map(spell => (
                        <SpellDisplay
                            key={spell.id}
                            spell={spell}
                            magicLevel={magicLevel}
                            inventory={inventory}
                            equipment={equipment}
                            onCastSpell={onCastSpell}
                            setTooltip={setTooltip}
                            autocastSpell={autocastSpell}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpellbookPanel;