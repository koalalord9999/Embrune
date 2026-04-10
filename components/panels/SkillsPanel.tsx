
import React from 'react';
import { PlayerSkill, SkillName } from '../../types';
import {  XP_TABLE, SKILL_ICONS, SKILL_DISPLAY_ORDER, getSkillColorClass, getIconUrl  } from '../../constants';
import { ContextMenuState, TooltipState } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { ContextMenuOption } from '../common/ContextMenu';

interface SkillsPanelProps {
    skills: (PlayerSkill & { currentLevel: number })[];
    setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState | null>>;
    onOpenGuide: (skill: SkillName) => void;
    isTouchSimulationEnabled: boolean;
    isOneClickMode: boolean;
    tooltip: TooltipState | null;
    contextMenu: ContextMenuState | null;
}

const SkillDisplay: React.FC<{
    skill: PlayerSkill & { currentLevel: number };
    setTooltip: React.Dispatch<React.SetStateAction<TooltipState | null>>;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState | null>>;
    onOpenGuide: (skill: SkillName) => void;
    isTouchSimulationEnabled: boolean;
    isOneClickMode: boolean;
    tooltip: TooltipState | null;
    contextMenu: ContextMenuState | null;
}> = ({ skill, setTooltip, setContextMenu, onOpenGuide, isTouchSimulationEnabled, isOneClickMode, tooltip, contextMenu }) => {
    
    const [isHovered, setIsHovered] = React.useState(false);
    const mousePos = React.useRef({ x: 0, y: 0 });

    const buildTooltipContent = (skill: PlayerSkill) => {
        const isMaxLevel = skill.level >= 99;
        const xpForCurrentLevel = XP_TABLE[skill.level - 1] ?? 0;
        const xpForNextLevel = isMaxLevel ? skill.xp : (XP_TABLE[skill.level] ?? skill.xp);
        
        const xpInLevel = skill.xp - xpForCurrentLevel;
        const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
        const progress = (isMaxLevel || xpToNextLevel <= 0) ? 100 : Math.max(0, (xpInLevel / xpToNextLevel) * 100);
        const remainingXp = isMaxLevel ? 0 : xpForNextLevel - skill.xp;

        return (
            <div className="text-left w-64 font-pixel-rpg">
                <div className="text-xl mt-1 space-y-0.5 text-gray-300 leading-none">
                    <p>Total XP: <span className="font-bold text-white">{skill.xp.toLocaleString()}</span></p>
                </div>
                {!isMaxLevel && (
                    <>
                        <div className="w-full h-4 bg-red-600/80 rounded-sm relative mt-2 overflow-hidden border border-black/50">
                            <div className="absolute left-0 top-0 h-full bg-green-600/80" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xl font-bold mt-1 leading-none">
                            <span className="text-gray-400">{xpForCurrentLevel.toLocaleString()}</span>
                            <span className="text-yellow-300">{remainingXp.toLocaleString()} left</span>
                            <span className="text-gray-400">{xpForNextLevel.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // Live update for Tooltip and Context Menu
    React.useEffect(() => {
        if (isHovered) {
            setTooltip({
                content: buildTooltipContent(skill),
                position: mousePos.current
            });
        }
    }, [skill, isHovered, setTooltip]);

    React.useEffect(() => {
        if (contextMenu && contextMenu.title === skill.name) {
            const menuOptions: ContextMenuOption[] = [
                {
                    label: "Open Guide",
                    onClick: handleOpenGuide,
                },
            ];
            setContextMenu({
                ...contextMenu,
                content: buildTooltipContent(skill),
                options: menuOptions
            });
        }
    }, [skill, contextMenu?.title, setContextMenu]);

    const handleOpenGuide = () => {
        setTooltip(null);
        onOpenGuide(skill.name);
    };

    const handleOpenContextMenu = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const point = 'touches' in event ? event.touches[0] : event as React.MouseEvent;

        const tooltipNode = buildTooltipContent(skill);
        const menuOptions: ContextMenuOption[] = [
            {
                label: "Open Guide",
                onClick: handleOpenGuide,
            },
        ];

        setContextMenu({
            options: menuOptions,
            content: tooltipNode,
            triggerEvent: point,
            isTouchInteraction: 'touches' in event,
            title: skill.name,
        });
    };

    const longPressHandlers = useLongPress({
        onLongPress: handleOpenContextMenu,
        onClick: handleOpenGuide,
        isOneClickMode: isOneClickMode,
    });

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return;
        mousePos.current = { x: e.clientX, y: e.clientY };
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTooltip(null);
    };

    const levelColor = skill.currentLevel < skill.level ? 'text-red-400' : (skill.currentLevel > skill.level ? 'text-green-400' : 'text-white');

    return (
        <div
            className="bg-gray-900/50 p-2 h-10 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
            {...longPressHandlers}
            onContextMenu={handleOpenContextMenu}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`w-6 h-6 flex-shrink-0 ${getSkillColorClass(skill.name)}`}
                style={{
                    maskImage: `url(${getIconUrl(SKILL_ICONS[skill.name])})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${getIconUrl(SKILL_ICONS[skill.name])})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                }}
            />
            <div className="flex-1 text-right leading-none font-pixel-rpg">
                <span className={`text-xl font-bold align-super ${levelColor}`}>{skill.currentLevel}</span>
                <span className="text-sm text-gray-500 mx-px">/</span>
                <span className="text-lg align-sub text-gray-200">{skill.level}</span>
            </div>
        </div>
    );
};

const TotalLevelDisplay: React.FC<{
    skills: PlayerSkill[];
    setTooltip: (tooltip: TooltipState | null) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    isOneClickMode: boolean;
    contextMenu: ContextMenuState | null;
}> = ({ skills, setTooltip, setContextMenu, isOneClickMode, contextMenu }) => {
    
    const [isHovered, setIsHovered] = React.useState(false);
    const mousePos = React.useRef({ x: 0, y: 0 });

    const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);
    const totalXp = skills.reduce((sum, skill) => sum + skill.xp, 0);

    const buildTooltipContent = () => {
        return (
            <div className="text-left w-48 font-pixel-rpg">
                <div className="text-xl mt-1 space-y-0.5 text-gray-300 leading-none">
                    <p>Total XP: <span className="font-bold text-white">{totalXp.toLocaleString()}</span></p>
                </div>
            </div>
        );
    };

    // Live update for Tooltip and Context Menu
    React.useEffect(() => {
        if (isHovered) {
            setTooltip({
                content: buildTooltipContent(),
                position: mousePos.current
            });
        }
    }, [skills, isHovered, setTooltip]);

    React.useEffect(() => {
        if (contextMenu && contextMenu.title === "Total Level") {
            setContextMenu({
                ...contextMenu,
                content: buildTooltipContent()
            });
        }
    }, [skills, contextMenu?.title, setContextMenu]);

    const handleOpenContextMenu = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const point = 'touches' in event ? event.touches[0] : event as React.MouseEvent;

        setContextMenu({
            options: [],
            content: buildTooltipContent(),
            triggerEvent: point,
            isTouchInteraction: 'touches' in event,
            title: "Total Level",
        });
    };

    const longPressHandlers = useLongPress({
        onLongPress: handleOpenContextMenu,
        onClick: (e) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
            handleOpenContextMenu({
                ...e,
                preventDefault: () => {},
                touches: [{ clientX, clientY }]
            } as unknown as React.TouchEvent);
        },
        isOneClickMode: isOneClickMode,
    });

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) return;
        mousePos.current = { x: e.clientX, y: e.clientY };
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTooltip(null);
    };

    return (
        <div 
            className="bg-gray-900/50 p-2 h-10 rounded-md flex items-center gap-2 shadow-inner border border-yellow-900/30 cursor-pointer hover:bg-gray-700/50 transition-colors"
            {...longPressHandlers}
            onContextMenu={handleOpenContextMenu}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`w-6 h-6 flex-shrink-0 bg-yellow-400`}
                style={{
                    maskImage: `url(${getIconUrl('laurel-crown')})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${getIconUrl('laurel-crown')})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                }}
            />
            <div className="flex-1 text-right leading-none font-pixel-rpg">
                <span className="text-xl font-bold text-yellow-500 align-super">{totalLevel}</span>
            </div>
        </div>
    );
};

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills, setTooltip, setContextMenu, onOpenGuide, isTouchSimulationEnabled, isOneClickMode, tooltip, contextMenu }) => {
    const sortedSkills = [...skills].sort((a, b) => {
        return SKILL_DISPLAY_ORDER.indexOf(a.name) - SKILL_DISPLAY_ORDER.indexOf(b.name);
    });

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                    {sortedSkills.map(skill => (
                        <SkillDisplay
                            key={skill.name}
                            skill={skill}
                            setTooltip={setTooltip}
                            setContextMenu={setContextMenu}
                            onOpenGuide={onOpenGuide}
                            isTouchSimulationEnabled={isTouchSimulationEnabled}
                            isOneClickMode={isOneClickMode}
                            tooltip={tooltip}
                            contextMenu={contextMenu}
                        />
                    ))}
                    
                    <TotalLevelDisplay 
                        skills={sortedSkills}
                        setTooltip={setTooltip}
                        setContextMenu={setContextMenu}
                        isOneClickMode={isOneClickMode}
                        contextMenu={contextMenu}
                    />
                </div>
            </div>
        </div>
    );
};

export default SkillsPanel;
