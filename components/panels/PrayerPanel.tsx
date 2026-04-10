import React, { useMemo } from 'react';
import { PlayerSkill, SkillName, Prayer, PlayerQuestState, PrayerType } from '../../types';
import {  PRAYERS, QUESTS, getPrayerIconColor, getPrayerShadowColor, getIconUrl  } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';

interface PrayerPanelProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    activePrayers: string[];
    onTogglePrayer: (prayerId: string) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    playerQuests: PlayerQuestState[];
}



const PrayerDisplay: React.FC<{
    prayer: Prayer;
    prayerLevel: number;
    onTogglePrayer: (prayerId: string) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isActive: boolean;
    playerQuests: PlayerQuestState[];
}> = ({ prayer, prayerLevel, onTogglePrayer, setTooltip, isActive, playerQuests }) => {

    const isLockedByQuest = useMemo(() => {
        if (!prayer.questId) return false;
        const quest = playerQuests.find(q => q.questId === prayer.questId);
        return !quest || !quest.isComplete;
    }, [prayer.questId, playerQuests]);

    const hasLevel = prayerLevel >= prayer.level;
    const canActivate = hasLevel && !isLockedByQuest;
    const iconColor = getPrayerIconColor(prayer);
    const shadowColor = getPrayerShadowColor(prayer);

    const handleMouseEnter = (e: React.MouseEvent) => {
        const levelColor = hasLevel ? 'text-green-400' : 'text-red-400';
        const tooltipContent = (
            <div className="text-left w-64 font-pixel-rpg">
                <p className="font-bold text-yellow-300 text-xl">{prayer.name}</p>
                <p className={`text-lg italic mb-1 ${levelColor}`}>Lvl {prayer.level} Prayer</p>
                <p className="text-lg text-gray-300 mb-1 leading-tight">{prayer.description}</p>
                {prayer.drainRate > 0 && <p className="text-lg text-gray-400">Drain: {prayer.drainRate} pts/min</p>}
                {isLockedByQuest && <p className="text-lg text-red-400 mt-1">Unlocked: {QUESTS[prayer.questId!].name}</p>}
            </div>
        );

        setTooltip({
            content: tooltipContent,
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <button
            onClick={() => { if (canActivate) onTogglePrayer(prayer.id); setTooltip(null); }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
            className={`w-full aspect-square rounded-md transition-colors flex items-center justify-center text-center hover:bg-gray-700/20 relative isolate border-2 border-transparent`}
        >
            {isActive && (
                <span
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '85%',
                        height: '85%',
                        borderRadius: '70%',
                        backgroundColor: '#ca8a04', // Static goldish color
                        animation: 'pulse-prayer-glow 1.8s ease-in-out infinite',
                        zIndex: -1,
                        boxShadow: `0 0 15px 2px #ca8a04`,
                        opacity: 0.6,
                    }}
                />
            )}
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    filter: !canActivate
                        ? 'grayscale(1) brightness(0.2)'
                        : `drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) drop-shadow(-1px 1px 0px black) drop-shadow(0 0 2px ${shadowColor}) drop-shadow(0 0 2px ${shadowColor})`,
                }}
            >
                <div
                    className="w-full h-full p-2 transition-all"
                    style={{
                        backgroundColor: iconColor,
                        maskImage: `url(${getIconUrl(prayer.iconUrl)})`,
                        WebkitMaskImage: `url(${getIconUrl(prayer.iconUrl)})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                    }}
                />
            </div>
        </button>
    );

};


const PrayerPanel: React.FC<PrayerPanelProps> = ({ skills, activePrayers, onTogglePrayer, setTooltip, playerQuests }) => {
    const prayerLevel = skills.find(s => s.name === SkillName.Prayer)?.level ?? 1;

    const sortedPrayers = useMemo(() => {
        return [...PRAYERS].sort((a, b) => a.level - b.level);
    }, []);

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-1">
                    {sortedPrayers.map(prayer => (
                        <PrayerDisplay
                            key={prayer.id}
                            prayer={prayer}
                            prayerLevel={prayerLevel}
                            isActive={activePrayers.includes(prayer.id)}
                            onTogglePrayer={onTogglePrayer}
                            setTooltip={setTooltip}
                            playerQuests={playerQuests}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrayerPanel;