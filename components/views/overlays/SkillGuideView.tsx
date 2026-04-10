import React, { useState, useMemo, useEffect } from 'react';
import { PlayerSkill, SkillName, SkillGuideTab, SkillGuideEntry } from '../../../types';
import {  SKILL_GUIDES, ITEMS, getIconClassName, HERBS, HERBLORE_RECIPES, THIEVING_POCKET_TARGETS, THIEVING_CONTAINER_TARGETS, HOUSE_TIERS, THIEVING_STALL_TARGETS, getIconUrl  } from '../../../constants';
import Button from '../../common/Button';

interface SkillGuideViewProps {
    activeSkill: SkillName;
    setActiveSkill: (skill: SkillName) => void;
    onClose: () => void;
    playerSkills: PlayerSkill[];
}

const SkillGuideView: React.FC<SkillGuideViewProps> = ({ activeSkill, setActiveSkill, onClose, playerSkills }) => {
    const playerLevel = playerSkills.find(s => s.name === activeSkill)?.level ?? 1;
    const [activeTabId, setActiveTabId] = useState<string>('');

    const tabs = useMemo(() => {
        if (activeSkill === SkillName.Herblore) {
            // Generate Herblore tabs
            const cleaningTab: SkillGuideTab = {
                id: 'cleaning',
                label: 'Cleaning',
                entries: HERBS.map(h => ({
                    level: h.level,
                    description: `Clean ${ITEMS[h.grimy].name}`,
                    itemId: h.grimy
                })).sort((a, b) => a.level - b.level)
            };

            const potionsList = HERBLORE_RECIPES.finished.map(r => {
                const unf = HERBLORE_RECIPES.unfinished.find(u => u.unfinishedPotionId === r.unfinishedPotionId);
                const herb = unf ? HERBS.find(h => h.clean === unf.cleanHerbId) : null;
                
                const baseName = herb ? ITEMS[herb.clean].name.replace('Clean ', '') : (ITEMS[r.unfinishedPotionId]?.name ?? 'Base Potion');
                const secondaryName = ITEMS[r.secondaryId]?.name.replace('Clean ', '') ?? 'Ingredient';

                return {
                    level: r.level,
                    description: ITEMS[r.finishedPotionId].name,
                    subDescription: `${baseName} + ${secondaryName}`,
                    itemId: r.finishedPotionId,
                    herbLevel: herb ? herb.level : 0
                };
            }).sort((a, b) => {
                if (a.level !== b.level) return a.level - b.level;
                return a.herbLevel - b.herbLevel;
            });

            const potionsTab: SkillGuideTab = {
                id: 'potions',
                label: 'Potions',
                entries: potionsList
            };

            return [cleaningTab, potionsTab];
        }

        if (activeSkill === SkillName.Thieving) {
            // Generate Thieving tabs
            const pocketTab: SkillGuideTab = {
                id: 'pickpocket',
                label: 'Pickpocketing',
                entries: Object.values(THIEVING_POCKET_TARGETS).map(t => ({
                    level: t.level,
                    description: t.name,
                    itemId: 'coins'
                })).sort((a, b) => a.level - b.level)
            };

            const lockpickingTargets = [
                ...HOUSE_TIERS.map(tier => ({
                    name: `${tier.tierId.replace('thieving_house_drawer_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Homes`,
                    level: tier.level
                })),
                { name: 'Low-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_low.level },
                { name: 'Mid-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_mid.level },
                { name: 'High-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_high.level },
                { name: 'Elite Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_elite.level },
            ].sort((a, b) => a.level - b.level);

            const lockpickingTab: SkillGuideTab = {
                id: 'lockpicking',
                label: 'Lockpicking',
                entries: lockpickingTargets.map(t => ({
                    level: t.level,
                    description: t.name,
                    itemId: 'lockpick'
                }))
            };

            const stallTab: SkillGuideTab = {
                id: 'stalls',
                label: 'Stalls',
                entries: Object.values(THIEVING_STALL_TARGETS).map(t => ({
                    level: t.level,
                    description: t.name,
                })).sort((a, b) => a.level - b.level)
            };

            return [pocketTab, lockpickingTab, stallTab];
        }

        return SKILL_GUIDES[activeSkill] ?? [];
    }, [activeSkill]);

    // Reset active tab when skill changes or tabs load
    useEffect(() => {
        if (tabs.length > 0) {
            // Wait: Ensure we prefer the existing activeTabId if it exists in the current tabs. 
            // If not, fall back to the first tab.
            const tabExists = tabs.some(t => t.id === activeTabId);
            if (!tabExists) {
                setActiveTabId(tabs[0].id);
            }
        } else {
            setActiveTabId('');
        }
    }, [tabs, activeSkill]); // Removed activeTabId to prevent infinite loops when manually clicking tabs

    const activeTab = tabs.find(t => t.id === activeTabId);

    const renderEntry = (entry: SkillGuideEntry, index: number) => {
        const hasLevel = playerLevel >= entry.level;
        const item = entry.itemId ? ITEMS[entry.itemId] : null;
        const showSub = entry.subDescription && (!entry.revealSubAtLevel || hasLevel);
        return (
            <div key={index} className={`flex items-center gap-4 p-2 rounded-md font-pixel-rpg transition-all hover:brightness-110 ${hasLevel ? 'bg-green-900/30 border border-green-900/50' : 'bg-gray-900/50 border border-gray-800'}`}>
                <div className={`w-12 text-center font-bold text-xl flex-shrink-0 ${hasLevel ? 'text-green-400' : 'text-red-400'}`}>
                    {entry.level}
                </div>
                {item && (
                    <div className="w-10 h-10 bg-black/60 rounded border border-gray-700 p-1 flex-shrink-0 flex items-center justify-center">
                        <img src={getIconUrl(item.iconUrl)} alt={item.name} className={`w-full h-full object-contain ${getIconClassName(item)}`} />
                    </div>
                )}
                <div className={`flex-grow leading-tight ${hasLevel ? 'text-white' : 'text-gray-400'}`}>
                    <p className="text-xl">{entry.description}</p>
                    {showSub && (
                        <p className="text-sm text-gray-500 mt-1">{entry.subDescription}</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 font-pixel-rpg" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* OSRS Theme subtle background styling */}
                <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay bg-noise" />

                {/* Header Pane */}
                <div className="bg-gray-900 border-b-4 border-gray-700 p-3 sm:p-4 flex justify-between items-center relative z-10 shadow-lg">
                    <div className="absolute top-0 bottom-0 left-0 right-1/2 pointer-events-none opacity-30" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }} />
                    <div className="flex flex-col relative z-10 w-full text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-500 uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{activeSkill}</h1>
                        {activeTab && <p className="text-gray-400 tracking-[0.2em] uppercase text-xs sm:text-sm mt-1">{activeTab.label}</p>}
                    </div>
                    <div className="absolute right-3 sm:right-4 top-3 sm:top-4 z-20">
                         <Button onClick={onClose} size="sm" variant="secondary">X</Button>
                    </div>
                </div>
                
                {/* Body */}
                <div className="flex flex-col md:flex-row flex-grow min-h-0 relative z-10 bg-gray-800/90">
                    
                    {/* Mobile Tabs Wrapper (shows on top just below header, horizontally scrolling) */}
                    <div className="md:hidden flex overflow-x-auto p-2 bg-gray-950 border-b-2 border-gray-700 space-x-2 scrollbar-hide shrink-0 shadow-inner">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-sm font-bold text-lg border-2 ${
                                    activeTabId === tab.id 
                                    ? 'bg-yellow-700 border-yellow-500 text-white shadow-[0_0_10px_rgba(161,98,7,0.5)]' 
                                    : 'bg-black/60 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Pane (Left Side on Desktop) */}
                    <div className="w-full md:w-3/4 flex-grow overflow-y-auto p-2 sm:p-4 space-y-2 bg-black/40 shadow-inner custom-scrollbar">
                        {tabs.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 italic text-xl">Information unavailable.</p>
                            </div>
                        ) : activeTab?.entries.map((entry, idx) => renderEntry(entry, idx))}
                    </div>

                    {/* Desktop Tabs Pane (Right Side Sidebar) */}
                    <div className="hidden md:flex flex-col w-1/4 min-w-[200px] border-l-4 border-gray-700 bg-gray-900 p-2 sm:p-4 space-y-2 overflow-y-auto shrink-0 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
                        <div className="text-center font-bold text-gray-500 uppercase tracking-widest text-[10px] mb-2 border-b border-gray-800 pb-2">Categories</div>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`w-full text-left px-3 py-3 font-bold text-xl rounded-sm transition-all duration-100 border-2 relative overflow-hidden group ${
                                    activeTabId === tab.id 
                                    ? 'bg-yellow-800 border-yellow-500 text-white shadow-lg translate-x-[-4px]' 
                                    : 'bg-black/60 border-gray-800 text-gray-400 hover:bg-gray-700 hover:text-yellow-100'
                                }`}
                            >
                                {activeTabId === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
                                <span className="relative z-10 drop-shadow-md">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SkillGuideView;