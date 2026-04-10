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
    const [localProgress, setLocalProgress] = useState(0);

    // Track active action progress
    useEffect(() => {
        if (!activeAction) {
            setLocalProgress(0);
            return;
        }

        let frameId: number;
        const updateProgress = () => {
            const elapsed = Date.now() - activeAction.startTime;
            const newProgress = Math.min(100, (elapsed / activeAction.duration) * 100);
            setLocalProgress(newProgress);
            if (newProgress < 100) {
                frameId = requestAnimationFrame(updateProgress);
            }
        };
        frameId = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(frameId);
    }, [activeAction]);

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
                <div className="flex md:flex-col items-center gap-1 overflow-x-auto md:overflow-y-auto md:w-12 md:h-full scrollbar-hide py-1 md:py-2 md:border-r border-gray-800/50">
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
                <div className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-y-auto sm:overflow-visible">
                    <div className="text-center mb-3 sm:mb-6">
                        <p className="text-gray-500 text-xs sm:text-base uppercase tracking-[0.3em] leading-none mb-2">Next Obstacle</p>
                        <h2 className="text-2xl sm:text-4xl font-bold text-yellow-300 leading-none">{currentObstacle?.name}</h2>
                    </div>

                    <div
                        className="w-full max-w-[320px] sm:max-w-[400px] aspect-square bg-gray-950 rounded-2xl border-[4px] sm:border-[6px] border-gray-900 p-2 sm:p-3 grid gap-2 sm:gap-3 relative overflow-hidden"
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
                            {lastHitResult?.result === 'lightning' && <span className="text-5xl font-black text-blue-400 italic tracking-tighter">LIGHTNING!!</span>}
                            {lastHitResult?.result === 'fast' && <span className="text-5xl font-black text-green-400 italic tracking-tighter">FAST!</span>}
                            {lastHitResult?.result === 'steady' && <span className="text-4xl font-black text-yellow-500 italic tracking-tighter">STEADY</span>}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-1 min-h-[96px] w-full max-w-[280px]">
                        {activeAction ? (
                            <div className="w-full flex flex-col items-center gap-2 animate-fade-in">
                                {lastHitResult && (
                                    <div className="bg-black/50 px-4 py-1 rounded-full border border-gray-700 mb-1">
                                        <span className={`text-sm font-bold ${lastHitResult.result === 'lightning' ? 'text-blue-400' : 'text-green-400'}`}>
                                            MODIFIER: {lastHitResult.bonus} XP
                                        </span>
                                    </div>
                                )}
                                <span className="text-blue-300 text-[10px] uppercase tracking-widest leading-none">Sprinting...</span>
                                <ProgressBar value={localProgress} maxValue={100} color="bg-blue-500" />
                                <Button onClick={onCancelAction} variant="secondary" className="mt-1 px-4 py-0.5 text-[10px]">
                                    Cancel
                                </Button>
                            </div>
                        ) : lastHitResult ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-3xl font-black italic tracking-tighter ${lastHitResult.result === 'lightning' ? 'text-blue-400' :
                                    lastHitResult.result === 'fast' ? 'text-green-400' : 'text-yellow-500'
                                    }`}>
                                    {lastHitResult.result.toUpperCase()}{lastHitResult.result !== 'steady' ? '!!' : ''}
                                </span>
                                <div className="bg-black/50 px-4 py-1 rounded-full border border-gray-700">
                                    <span className={`text-xl font-bold ${lastHitResult.result === 'lightning' ? 'text-blue-400' : 'text-green-400'}`}>
                                        MODIFIER: {lastHitResult.bonus} XP
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm uppercase tracking-[0.4em] leading-none mb-2">Focus & Target</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgilityCourseView;