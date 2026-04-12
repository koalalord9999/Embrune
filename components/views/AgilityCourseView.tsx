import React, { useState, useEffect, useCallback } from 'react';
import { useAgility } from '../../hooks/useAgility';
import { AGILITY_COURSES } from '../../constants';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { ActiveSingleAction } from '../../hooks/useUIState';

interface AgilityCourseViewProps {
    agility: ReturnType<typeof useAgility>;
    activeAction?: ActiveSingleAction | null;
    onCancelAction?: () => void;
}

const AgilityCourseView: React.FC<AgilityCourseViewProps> = ({ agility, activeAction, onCancelAction }) => {
    const { agilityState, stopCourse, attemptObstacle } = agility;
    const course = agilityState.activeCourseId ? AGILITY_COURSES[agilityState.activeCourseId] : null;

    const gridSize = course.level >= 60 ? 5 : course.level >= 30 ? 4 : 3;
    const totalHoles = gridSize * gridSize;

    // Minigame State: Reaction Target
    const [targetPos, setTargetPos] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [lastHitResult, setLastHitResult] = useState<{ result: 'lightning' | 'fast' | 'steady' | 'fail', bonus: string } | null>(null);
    const [isCooldown, setIsCooldown] = useState(false);

    // Randomize target whenever obstacle changes
    const randomizeTarget = useCallback(() => {
        setTargetPos(prev => {
            const possiblePositions = Array.from({ length: totalHoles }, (_, i) => i);
            const otherPositions = possiblePositions.filter(p => p !== prev);
            return otherPositions[Math.floor(Math.random() * otherPositions.length)];
        });
        setStartTime(Date.now());
    }, [totalHoles]);

    useEffect(() => {
        randomizeTarget();
    }, [agilityState.currentObstacleIndex, randomizeTarget]);

    const handleTargetClick = (index: number) => {
        if (isCooldown || !!activeAction || index !== targetPos) return;

        const reactionTime = (Date.now() - startTime) / 1000;
        let result: 'lightning' | 'fast' | 'steady' = 'steady';
        let bonus = '1.0x';
        let multiplier = 1;

        if (reactionTime < 0.5) {
            result = 'lightning';
            bonus = '1.25x';
            multiplier = 1.25;
        } else if (reactionTime < 0.8) {
            result = 'fast';
            bonus = '1.1x';
            multiplier = 1.1;
        }

        setLastHitResult({ result, bonus });
        attemptObstacle(multiplier, result);

        setIsCooldown(true);
        setTimeout(() => {
            setIsCooldown(false);
        }, 300);
    };

    // Clear last hit result when action finishes
    useEffect(() => {
        if (!activeAction && !isCooldown) {
            setLastHitResult(null);
        }
    }, [activeAction, isCooldown]);

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500 font-pixel-rpg">
                <p className="text-xl">Error: Active course data not found.</p>
                <Button onClick={stopCourse} className="mt-4">Return</Button>
            </div>
        );
    }

    const lapsForThisCourse = agilityState.lapsCompleted[course.id] || 0;
    const currentObstacle = course.obstacles[agilityState.currentObstacleIndex];

    return (
        <div className="flex flex-col h-full text-gray-200 p-2 bg-gray-950/40 rounded-lg font-pixel-rpg overflow-hidden select-none border border-gray-800">
            {/* Top Bar */}
            <div className="flex justify-between items-center w-full mb-2 bg-black/40 p-2 rounded border border-gray-800">
                <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 leading-none">{course.name}</h1>
                    <p className="text-[10px] sm:text-xs text-gray-500 tracking-[0.2em] mt-1 uppercase opacity-60">Sprinting Protocol Active</p>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center">
                    <div className="flex flex-col items-end mr-1 sm:mr-4">
                        <span className="text-blue-300 text-[10px] sm:text-sm uppercase tracking-tighter">Obstacle {agilityState.currentObstacleIndex + 1} / {course.obstacles.length}</span>
                        <span className="text-green-400 text-[10px] sm:text-sm font-bold uppercase tracking-tighter">Laps: {lapsForThisCourse}</span>
                    </div>
                    <Button onClick={stopCourse} variant="secondary" className="px-2 sm:px-3 py-1 text-xs">
                        Exit
                    </Button>
                </div>
            </div>

            {/* Main Content Area: Responsive flex direction */}
            <div className="flex flex-col md:flex-row flex-grow min-h-0 w-full gap-2 sm:gap-4 p-1 sm:p-2">

                {/* Progress Indicators: Horizontal on mobile, vertical on desktop */}
                <div className="flex md:flex-col items-center gap-1 overflow-x-auto md:overflow-y-auto md:w-12 md:h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 md:py-2 md:border-r border-gray-800/50">
                    <span className="hidden md:block text-[10px] text-gray-600 uppercase vertical-text mb-2 tracking-widest">Progress</span>
                    <div className="flex md:flex-col gap-1 min-w-full">
                        {course.obstacles.map((_, index) => (
                            <div
                                key={index}
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 min-w-[32px] md:min-h-[40px] rounded flex items-center justify-center border-2 relative
                                    ${index === agilityState.currentObstacleIndex ? 'bg-yellow-600 border-yellow-300 z-10' :
                                        index < agilityState.currentObstacleIndex ? 'bg-green-900 border-green-700 opacity-60' : 'bg-gray-900 border-gray-800 opacity-30'}
                                `}
                            >
                                <span className={`text-xs md:text-base font-bold ${index === agilityState.currentObstacleIndex ? 'text-white' : 'text-gray-400'}`}>
                                    {index < agilityState.currentObstacleIndex ? '✓' : index + 1}
                                </span>
                                {index === agilityState.currentObstacleIndex && (
                                    <div className="absolute -bottom-1 md:-right-1 md:top-1/2 md:-translate-y-1/2 w-2 h-2 bg-yellow-400 rotate-45" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Centered Minigame Hub */}
                <div className="flex-grow flex flex-col items-center justify-between min-h-0 overflow-hidden py-1 sm:py-2">
                    {/* Header */}
                    <div className="text-center shrink-0 mb-1 sm:mb-2">
                        <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] leading-none mb-1 sm:mb-2">Next Obstacle</p>
                        <h2 className="text-xl sm:text-3xl font-bold text-yellow-300 leading-none">{currentObstacle?.name}</h2>
                    </div>

                    {/* Grid Wrapper */}
                    <div className="flex-1 w-full aspect-square max-h-[440px] flex items-center justify-center shrink overflow-hidden relative pb-2 sm:pb-4 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                            <div
                                className="rounded-2xl relative overflow-hidden flex flex-col p-1 sm:p-[6px] shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-gray-900"
                                style={{
                                    height: '100%',
                                    maxHeight: '440px',
                                    maxWidth: '100%',
                                    aspectRatio: '1 / 1',
                                }}
                            >
                                {/* GPU-Accelerated Progress Background */}
                                <div 
                                    className="absolute bottom-0 left-0 w-full h-full bg-blue-500 origin-bottom"
                                    style={{
                                        transform: activeAction ? 'scaleY(1)' : 'scaleY(0)',
                                        transition: activeAction ? `transform ${activeAction.duration}ms linear` : 'none',
                                    }}
                                />

                                <div
                                    className="bg-gray-950 w-full h-full rounded-xl grid gap-1 sm:gap-2 p-1 sm:p-2 relative overflow-hidden z-10"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                        gridTemplateRows: `repeat(${gridSize}, 1fr)`
                                    }}
                                >
                                {Array.from({ length: totalHoles }).map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleTargetClick(i)}
                                        className={`
                                            rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer border-2
                                            ${i === targetPos ? 'bg-yellow-600 border-yellow-400' : 'bg-black/20 border-transparent'}
                                        `}
                                    >
                                    </div>
                                ))}

                                {/* Status Overlays */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                    {lastHitResult?.result === 'lightning' && <span className="text-3xl sm:text-5xl font-black text-blue-400 italic tracking-tighter">LIGHTNING!!</span>}
                                    {lastHitResult?.result === 'fast' && <span className="text-3xl sm:text-5xl font-black text-green-400 italic tracking-tighter">FAST!</span>}
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgilityCourseView;