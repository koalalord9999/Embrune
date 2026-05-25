import React, { useState, useEffect, useMemo } from 'react';
import { ActiveStatModifier, ActiveBuff, SkillName, Item, Prayer } from '../../types';
import { SKILL_ICONS, getSkillColorClass, ITEMS, getIconClassName, PRAYERS, getPrayerIconColor, getPrayerShadowColor, getIconUrl } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';

interface BuffBarProps {
    statModifiers: ActiveStatModifier[];
    activeBuffs: (ActiveBuff | any)[]; // Use 'any' to allow for custom buff structures
    activePrayers: string[];
    setTooltip: (tooltip: TooltipState | null) => void;
}

interface DisplayBuff {
    id: number | string;
    name?: string;
    description?: string;
    iconUrl: string;
    value: string;
    valueColor?: string;
    expiresAt: number; // Can be Infinity for non-expiring buffs
    iconClassName?: string;
    colorClass?: string;
    prayerColor?: string;
    prayerShadowColor?: string;
}

const BuffIcon: React.FC<{ buff: DisplayBuff; setTooltip: (tooltip: TooltipState | null) => void }> = ({ buff, setTooltip }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (buff.expiresAt === Infinity) {
            setTimeLeft(Infinity);
            return;
        }

        const calculateTime = () => {
            const remaining = Math.max(0, Math.ceil((buff.expiresAt - Date.now()) / 1000));
            setTimeLeft(remaining);
        };

        calculateTime(); // Initial calculation
        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    }, [buff.expiresAt]);

    const defaultValueColor = useMemo(() => {
        const numValue = parseFloat(buff.value);
        if (!isNaN(numValue)) {
            return numValue > 0 ? 'text-green-400' : 'text-red-400';
        }
        return 'text-white';
    }, [buff.value]);

    const valueColor = buff.valueColor || defaultValueColor;

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!buff.name && !buff.description) return;

        const tooltipContent = (
            <div className="text-left w-48">
                {buff.name && <p className="font-bold text-yellow-300">{buff.name}</p>}
                {buff.description && <p className="text-sm text-gray-300 mb-2">{buff.description}</p>}
                {timeLeft !== Infinity && <p className="text-xs text-gray-400">Duration remaining: {timeLeft}s</p>}
            </div>
        );

        setTooltip({
            content: tooltipContent,
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <div
            className="relative w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 shadow-lg cursor-help transition-transform hover:scale-105"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            {buff.prayerColor ? (
                <div
                    className="w-full h-full flex items-center justify-center shadow-none"
                    style={{
                        filter: `drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) drop-shadow(-1px 1px 0px black) drop-shadow(0 0 2px ${buff.prayerShadowColor || buff.prayerColor}) drop-shadow(0 0 2px ${buff.prayerShadowColor || buff.prayerColor})`,
                    }}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundColor: buff.prayerColor,
                            maskImage: `url(${getIconUrl(buff.iconUrl)})`,
                            WebkitMaskImage: `url(${getIconUrl(buff.iconUrl)})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                        }}
                    />
                </div>
            ) : buff.colorClass ? (
                <div
                    className={`w-full h-full ${buff.colorClass}`}
                    style={{
                        maskImage: `url(${getIconUrl(buff.iconUrl)})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${getIconUrl(buff.iconUrl)})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                    }}
                />
            ) : (
                <img
                    src={getIconUrl(buff.iconUrl)}
                    alt="buff icon"
                    className={`w-full h-full ${buff.iconClassName || 'filter invert opacity-60'}`}
                />
            )}
            <span className={`absolute text-lg font-bold ${valueColor}`} style={{ textShadow: '1px 1px 2px black' }}>
                {buff.value}
            </span>
            {timeLeft !== Infinity && (
                <span className="absolute top-0 right-0 text-xs font-mono font-bold text-white bg-black/60 px-1 rounded-bl-sm">
                    {timeLeft}
                </span>
            )}
        </div>
    );
};


const BuffBar: React.FC<BuffBarProps> = ({ statModifiers, activeBuffs, activePrayers, setTooltip }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const allBuffs = useMemo(() => {
        const buffs: DisplayBuff[] = [];

        const isOverloaded = activeBuffs.some(b => b.type === 'overload');

        // 1. Process statModifiers (potions)
        statModifiers.forEach(mod => {
            if (isOverloaded && ['Attack', 'Strength', 'Defence', 'Ranged', 'Magic'].includes(mod.skill) && mod.currentValue > 0) {
                return; // Hide these, as overload provides a unified buff icon
            }

            buffs.push({
                id: mod.id,
                name: `${mod.skill} ${mod.currentValue > 0 ? 'Boost' : 'Drain'}`,
                description: `${mod.currentValue > 0 ? 'Increases' : 'Decreases'} your ${mod.skill} level.`,
                iconUrl: SKILL_ICONS[mod.skill],
                value: `${mod.currentValue > 0 ? '+' : ''}${mod.currentValue}`,
                valueColor: mod.currentValue > 0 ? 'text-green-400' : 'text-red-400',
                expiresAt: mod.nextDecayTimestamp,
                colorClass: getSkillColorClass(mod.skill),
            });
        });

        // 2. Process activeBuffs (spells, debuffs, etc.)
        activeBuffs.forEach(buff => {
            let expiresAt = Date.now() + buff.durationRemaining;

            // Specific logic for Poison
            if (buff.type === 'poison') {
                expiresAt = buff.nextTickTimestamp ?? (Date.now() + 15000);
            }

            switch (buff.type) {
                case 'stat_boost':
                    if (buff.statBoost) {
                        buffs.push({
                            id: buff.id,
                            name: buff.name || `${buff.statBoost.skill} ${buff.statBoost.value > 0 ? 'Boost' : 'Drain'}`,
                            description: buff.description || `${buff.statBoost.value > 0 ? 'Increases' : 'Decreases'} your ${buff.statBoost.skill} level.`,
                            iconUrl: SKILL_ICONS[buff.statBoost.skill],
                            value: `${buff.statBoost.value > 0 ? '+' : ''}${buff.statBoost.value}`,
                            valueColor: buff.statBoost.value > 0 ? 'text-green-400' : 'text-red-400',
                            expiresAt,
                            colorClass: getSkillColorClass(buff.statBoost.skill),
                        });
                    }
                    break;
                case 'spell_buff':
                    buffs.push({
                        id: buff.id,
                        name: buff.name,
                        description: buff.description,
                        iconUrl: 'aura', // Generic enhancement icon
                        value: '',
                        expiresAt,
                        colorClass: 'bg-yellow-900/40 text-yellow-200'
                    });
                    break;
                case 'accuracy_boost':
                    buffs.push({
                        id: buff.id,
                        name: 'Accuracy Boost',
                        description: 'Increases your accuracy by ' + buff.value + '%.',
                        iconUrl: 'crosshair-arrow',
                        value: `+${buff.value}%`,
                        valueColor: 'text-green-400',
                        expiresAt
                    });
                    break;
                case 'evasion_boost':
                    buffs.push({
                        id: buff.id,
                        name: 'Evasion Boost',
                        description: 'Increases your evasion by ' + buff.value + '%.',
                        iconUrl: 'run',
                        value: `+${buff.value}%`,
                        valueColor: 'text-green-400',
                        expiresAt
                    });
                    break;
                case 'recoil':
                    buffs.push({
                        id: buff.id,
                        name: 'Recoil',
                        description: 'Returns ' + buff.value + '% of incoming damage to the attacker.',
                        iconUrl: 'porcupine',
                        value: `${buff.value}%`,
                        valueColor: 'text-orange-400',
                        expiresAt
                    });
                    break;
                case 'flat_damage':
                    buffs.push({
                        id: buff.id,
                        name: 'Flat Damage Boost',
                        description: 'Increases your damage by ' + buff.value + '.',
                        iconUrl: 'sword-brandish',
                        value: `+${buff.value}`,
                        valueColor: 'text-yellow-400',
                        expiresAt
                    });
                    break;
                case 'damage_on_hit': // Sunfire Elixir
                    buffs.push({
                        id: buff.id,
                        name: 'Sunfire',
                        description: 'Deals additional fire damage on hit.',
                        iconUrl: 'fire-sword',
                        value: `+${buff.value}`,
                        valueColor: 'text-orange-500',
                        expiresAt
                    });
                    break;
                case 'poison_immunity':
                    buffs.push({
                        id: buff.id,
                        name: 'Poison Immunity',
                        description: 'You are immune to poison damage.',
                        iconUrl: 'health-potion',
                        value: `Immune`,
                        valueColor: 'text-green-300',
                        expiresAt,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'damage_reduction':
                    buffs.push({
                        id: buff.id,
                        name: 'Damage Reduction',
                        description: 'Reduces incoming damage by ' + buff.value + '%.',
                        iconUrl: 'stone-shield',
                        value: `-${buff.value}%`,
                        valueColor: 'text-blue-300',
                        expiresAt
                    });
                    break;
                case 'antifire':
                    buffs.push({
                        id: buff.id,
                        name: 'Antifire',
                        description: 'Protects you from dragonfire attacks.',
                        iconUrl: 'dragon-shield',
                        value: 'Fire',
                        valueColor: 'text-orange-400',
                        expiresAt,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'stun':
                    buffs.push({
                        id: buff.id,
                        name: 'Stunned',
                        description: 'You are unable to move or act.',
                        iconUrl: 'star-swirl',
                        value: 'Stun',
                        valueColor: 'text-yellow-300',
                        expiresAt
                    });
                    break;
                case 'poison':
                    buffs.push({
                        id: buff.id,
                        name: 'Poison',
                        description: 'You are taking poison damage over time.',
                        iconUrl: 'boiling-bubbles',
                        value: `${buff.value}`,
                        valueColor: 'text-green-500',
                        expiresAt,
                        iconClassName: 'opacity-80',
                        colorClass: 'bg-green-700'
                    });
                    break;
                case 'dehydration' as any: // Cast as any to handle custom type from Game.tsx
                    buffs.push({
                        id: buff.id,
                        name: 'Dehydration',
                        description: 'You are suffering from severe dehydration. Drink water!',
                        iconUrl: 'sunrise',
                        value: `+${buff.value}`,
                        valueColor: 'text-orange-400',
                        expiresAt: Infinity,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'overload':
                    buffs.push({
                        id: buff.id,
                        name: 'Overload',
                        description: 'Significantly boosts all combat stats. Damages you over time initially, but heals upon expiry.',
                        iconUrl: ITEMS['overload_potion_weak']?.iconUrl || 'potion-ball',
                        value: '',
                        expiresAt,
                        iconClassName: 'filter-none',
                        colorClass: 'bg-purple-900/60'
                    });
                    break;
                case 'adrenaline':
                    buffs.push({
                        id: buff.id,
                        name: 'Adrenaline Surge',
                        description: 'Reduces attack speed and spellcast time by 1 tick, but rapidly drains prayer and health.',
                        iconUrl: ITEMS['battlemasters_draught']?.iconUrl || 'sprint',
                        value: '',
                        expiresAt,
                        iconClassName: 'filter-none',
                        colorClass: 'bg-red-900/60'
                    });
                    break;
                /* Combined into spell_buff for the singular spell display */
                /*
                case 'magic_damage_boost' as any:
                    buffs.push({
                        id: buff.id,
                        name: 'Magic Power',
                        description: 'Increases your magic damage by ' + buff.value + '%.',
                        iconUrl: 'magic-swirl',
                        value: `+${buff.value}%`,
                        valueColor: 'text-purple-400',
                        expiresAt,
                        colorClass: 'bg-purple-900/50'
                    });
                    break;
                */
                case 'item_expiry': {
                    const item = ITEMS[buff.itemId];
                    if (item) {
                        buffs.push({
                            id: buff.id,
                            name: item.name,
                            description: 'This item will expire soon.',
                            iconUrl: item.iconUrl,
                            value: '',
                            expiresAt: Date.now() + buff.durationRemaining,
                            iconClassName: getIconClassName(item),
                        });
                    }
                    break;
                }
            }
        });

        // 3. Process activePrayers
        activePrayers.forEach(prayerId => {
            const prayer = PRAYERS.find(p => p.id === prayerId);
            if (prayer) {
                buffs.push({
                    id: `prayer-${prayer.id}`,
                    name: prayer.name,
                    description: prayer.description,
                    iconUrl: prayer.iconUrl,
                    value: '',
                    expiresAt: Infinity,
                    iconClassName: 'filter-none',
                    prayerColor: getPrayerIconColor(prayer),
                    prayerShadowColor: getPrayerShadowColor(prayer)
                });
            }
        });

        return buffs.sort((a, b) => a.expiresAt - b.expiresAt);
    }, [statModifiers, activeBuffs, activePrayers]);

    const showExpandButton = allBuffs.length > 4 && !isExpanded;
    const containerHeight = isExpanded ? 'max-h-80' : 'max-h-[224px]'; // 4 * (h-12 + gap-1) = 224px

    if (allBuffs.length === 0) {
        return null;
    }

    return (
        <div
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1"
            onMouseEnter={() => { if (allBuffs.length > 4) setIsExpanded(true) }}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div
                className={`flex flex-col gap-1 transition-all duration-300 overflow-y-auto overflow-x-hidden ${containerHeight}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {allBuffs.map(buff => <BuffIcon key={buff.id} buff={buff} setTooltip={setTooltip} />)}
            </div>
            {showExpandButton && (
                <div className="w-12 h-4 bg-gray-700 rounded-b-md flex items-center justify-center text-xs font-bold text-gray-300 cursor-pointer">
                    ...
                </div>
            )}
        </div>
    );
};

export default BuffBar;
