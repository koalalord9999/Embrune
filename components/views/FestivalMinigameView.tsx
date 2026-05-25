import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../common/Button';
import { FESTIVAL_TRIVIA_QUESTIONS, GOURD_LOOT_TABLE } from '../../constants/festival';

const RING_TOSS_BOARD_LAYOUT: ('small' | 'medium' | 'large')[] = [
    'small', 'small', 'medium', 'small', 'small',
    'small', 'large', 'medium', 'large', 'small',
    'medium', 'medium', 'medium', 'medium', 'medium',
    'small', 'large', 'medium', 'large', 'small',
    'small', 'small', 'medium', 'small', 'small'
];

type FestivalGame = 'trivia' | 'ring_toss' | 'lantern_launch' | 'log_balance' | 'whack_lantern' | 'smash_gourd' | 'high_striker';

interface FestivalMinigameViewProps {
    activeFestivalMinigame: FestivalGame;
    setActiveFestivalMinigame: (val: FestivalGame | null) => void;
    ui: any;
    char: any;
    inv: any;
    quests: any;
    addLog: (msg: string) => void;
    questLogic: any;
}

const FestivalMinigameView: React.FC<FestivalMinigameViewProps> = ({
    activeFestivalMinigame,
    setActiveFestivalMinigame,
    ui,
    char,
    inv,
    addLog,
    questLogic,
}) => {
    // Current date code
    const getTodayCode = () => Math.floor(Date.now() / 86400000);

    // TRIVIA STATE
    const triviaIndex = (questLogic as any).getQuestVariable('trivia_question_index') ?? 0;
    const isTriviaAnswered = (questLogic as any).getQuestVariable('trivia_answered') ?? 0; // 0 = unans, 1 = correct, 2 = incorrect
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    // RING TOSS STATE
    const [pegs, setPegs] = useState<{ size: 'small' | 'medium' | 'large' }[]>([]);
    const [ringPos, setRingPos] = useState<{ left: string; top: string }>({ left: '50%', top: '102%' });
    const [ringTossOffsets, setRingTossOffsets] = useState<{
        targetLeft: string;
        targetTop: string;
        midLeft: string;
        midTop: string;
    }>({
        targetLeft: '50%',
        targetTop: '102%',
        midLeft: '50%',
        midTop: '102%',
    });
    const [isThrowing, setIsThrowing] = useState<boolean>(false);
    const [throwTarget, setThrowTarget] = useState<number | null>(null);
    const [ringTossResult, setRingTossResult] = useState<'success' | 'failure' | null>(null);
    const [ringTossTickets, setRingTossTickets] = useState<number>(0);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [hasFallen, setHasFallen] = useState<boolean>(false);
    const [ringsLeft, setRingsLeft] = useState<number>(1);
    const ringRef = useRef<HTMLDivElement>(null);

    // LANTERN LAUNCH STATE
    const lanternDraft = (questLogic as any).getQuestVariable('lantern_thermal_draft') ?? 0;
    const [lanternResult, setLanternResult] = useState<{ status: 'success' | 'overheat' | null; tickets: number }>({
        status: null,
        tickets: 0,
    });

    // LOG BALANCE STATE
    const [leanAngle, setLeanAngle] = useState<number>(0);
    const [leanVelocity, setLeanVelocity] = useState<number>(0);
    const [logPhase, setLogPhase] = useState<'idle' | 'playing' | 'done'>('idle');
    const [logSurviveMs, setLogSurviveMs] = useState<number>(0);
    const [logTickets, setLogTickets] = useState<number>(0);
    const logPhysicsRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const logPushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logStartTimeRef = useRef<number>(0);
    const leanVelocityRef = useRef<number>(0);
    const leanAngleRef = useRef<number>(0);
    const logPhaseRef = useRef<'idle' | 'playing' | 'done'>('idle');

    // WHACK-A-LANTERN STATE
    interface LanternCell { lit: boolean; color: string; isRed: boolean; id: number; }
    const [whalLanterns, setWhalLanterns] = useState<LanternCell[]>(
        Array.from({ length: 16 }, (_, i) => ({ lit: false, color: '#f59e0b', isRed: false, id: i }))
    );
    const [whalScore, setWhalScore] = useState<number>(0);
    const [whalTimeLeft, setWhalTimeLeft] = useState<number>(30);
    const [whalPhase, setWhalPhase] = useState<'idle' | 'playing' | 'done'>('idle');
    const [whalTickets, setWhalTickets] = useState<number>(0);
    const whalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const whalLanternTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [hammerPos, setHammerPos] = useState<{ x: number; y: number }>({ x: -200, y: -200 });
    const [isHammerSwinging, setIsHammerSwinging] = useState<boolean>(false);
    const whalContainerRef = useRef<HTMLDivElement>(null);

    // SMASH-A-GOURD STATE
    const gourdResult = (questLogic as any).getQuestVariable('gourd_smash_result') ?? null;
    const [gourdHits, setGourdHits] = useState<number>(0);
    const [gourdExploded, setGourdExploded] = useState<boolean>(false);

    // HIGH STRIKER STATE
    const STRIKER_TIERS = [
        { label: 'Weakling', color: '#6b7280', tickets: 0, height: 10 },
        { label: 'Amateur', color: '#f59e0b', tickets: 2, height: 26 },
        { label: 'Strong', color: '#f97316', tickets: 5, height: 44 },
        { label: 'Mighty', color: '#ef4444', tickets: 10, height: 60 },
        { label: 'Legendary', color: '#a855f7', tickets: 15, height: 78 },
        { label: 'DING!', color: '#eab308', tickets: 25, height: 95 },
    ];
    const [strikerPuckY, setStrikerPuckY] = useState<number>(0);
    const [strikerPhase, setStrikerPhase] = useState<'idle' | 'animating' | 'done'>('idle');
    const [strikerTierIndex, setStrikerTierIndex] = useState<number | null>(null);
    const [strikerTickets, setStrikerTickets] = useState<number>(0);

    const isBusy = !!ui.activeSingleAction;

    const getRingTossReward = (peg: 'small' | 'medium' | 'large') => {
        if (peg === 'medium') return 8;
        if (peg === 'large') return 20;
        return 3;
    };

    // HANDLE TRIVIA ANSWER
    const handleSelectTriviaAnswer = (choiceIndex: number) => {
        if (isTriviaAnswered !== 0) return;
        setSelectedChoice(choiceIndex);

        const currentQuestion = FESTIVAL_TRIVIA_QUESTIONS[triviaIndex];
        const correct = choiceIndex === currentQuestion.correctIndex;

        const today = getTodayCode();
        (questLogic as any).setQuestVariable('last_played_trivia', today);

        if (correct) {
            (questLogic as any).setQuestVariable('trivia_answered', 1);
            inv.modifyItem('festival_ticket', 10, false);
            addLog("Trivia correct! You earned 10 Festival Tickets.");
        } else {
            addLog("Incorrect trivia answer. Better luck tomorrow!");
        }
    };

    // INTERACTIVE RING TOSS BOARD INITIALIZATION
    const initRingTossBoard = () => {
        const newPegs = RING_TOSS_BOARD_LAYOUT.map(size => ({ size }));
        setPegs(newPegs);
        setRingPos({ left: '50%', top: '102%' });
        setRingTossOffsets({
            targetLeft: '50%',
            targetTop: '102%',
            midLeft: '50%',
            midTop: '102%',
        });
        setIsThrowing(false);
        setThrowTarget(null);
        setRingTossResult(null);
        setRingTossTickets(0);
        setShowPopup(false);
        setHasFallen(false);
    };

    useEffect(() => {
        if (activeFestivalMinigame === 'ring_toss') {
            const initialRings = (questLogic as any).getQuestVariable('ring_toss_rings_left') ?? 1;
            setRingsLeft(initialRings);
            initRingTossBoard();
        }
    }, [activeFestivalMinigame, questLogic]);

    const handleInteractiveToss = () => {
        if (isThrowing || ringTossResult !== null || ringsLeft <= 0) return;

        const nextRings = ringsLeft - 1;
        setRingsLeft(nextRings);
        (questLogic as any).setQuestVariable('ring_toss_rings_left', nextRings);

        const isSuccess = Math.random() < 0.25;
        const targetIndex = Math.floor(Math.random() * 25);
        const col = targetIndex % 5;
        const row = Math.floor(targetIndex / 5);
        const targetPeg = pegs[targetIndex] || { size: 'large' };
        const reward = isSuccess ? getRingTossReward(targetPeg.size) : 0;

        // Target coordinates in percentages for rendering ringPos
        const targetLeft = 10 + col * 20;
        const targetTop = 10 + row * 20;

        // Offset positions for failure (miss)
        const offsetLeft = targetLeft + (col < 4 ? 10 : -10);
        const offsetTop = targetTop + (row < 4 ? 10 : -10);

        const finalLeft = isSuccess ? targetLeft : offsetLeft;
        const finalTop = isSuccess ? targetTop : offsetTop;

        // Set CSS custom properties on the ring element before animating via React state
        const midLeft = 50 + (finalLeft - 50) * 0.5;
        const midTop = 102 + (finalTop - 102) * 0.5;

        setRingTossOffsets({
            targetLeft: `${finalLeft}%`,
            targetTop: `${finalTop}%`,
            midLeft: `${midLeft}%`,
            midTop: `${midTop}%`,
        });

        // Set ringPos to final landing spot so that when isThrowing becomes false,
        // it naturally rests at this landing position!
        setRingPos({ left: `${finalLeft}%`, top: `${finalTop}%` });

        setIsThrowing(true);
        setHasFallen(false);
        setThrowTarget(null);

        if (isSuccess) {
            setThrowTarget(targetIndex);
            setRingTossTickets(reward);

            setTimeout(() => {
                inv.modifyItem('festival_ticket', reward, false);
                addLog(`Ring Toss Success! Landed ring on the ${targetPeg.size} peg and won ${reward} Festival Tickets.`);
                setRingTossResult('success');
                setShowPopup(true);
                setIsThrowing(false);
            }, 1000);
        } else {
            setTimeout(() => {
                // Throw finishes, turn off throwing state and start falling state
                setIsThrowing(false);
                setHasFallen(true);
                // Animate ring falling down to bottom of the board (top: 105%)
                setRingPos({ left: `${offsetLeft}%`, top: '105%' });

                setTimeout(() => {
                    addLog("Ring Toss Failure. The ring bounced off the pegs.");
                    setRingTossResult('failure');
                    setShowPopup(true);
                }, 400);
            }, 1000);
        }
    };

    // HANDLE LANTERN WAIT DRAFT
    const handleLanternWaitDraft = () => {
        if (isBusy || lanternResult.status) return;

        ui.setActiveSingleAction({
            title: "Waiting for Thermal Draft...",
            iconUrl: "/assets/items/festival_ticket.png",
            iconClassName: "animate-bounce",
            startTime: Date.now(),
            duration: 1000,
            onComplete: () => {
                const increment = Math.floor(Math.random() * 15) + 8; // 8-22%
                const newDraft = lanternDraft + increment;
                (questLogic as any).setQuestVariable('lantern_thermal_draft', newDraft);

                if (newDraft > 100) {
                    // Overheat automatic fail
                    const today = getTodayCode();
                    (questLogic as any).setQuestVariable('last_played_lantern', today);
                    inv.modifyItem('festival_ticket', 2, false);
                    addLog(`The lantern draft exceeded 100%! It overheated and caught fire! Awarded 2 Festival Tickets.`);
                    setLanternResult({ status: 'overheat', tickets: 2 });
                } else {
                    addLog(`The hot air rises! Thermal Draft is now at ${newDraft}%.`);
                }
            }
        });
    };

    // HANDLE LANTERN LAUNCH
    const handleLanternLaunch = () => {
        if (isBusy || lanternResult.status) return;

        const today = getTodayCode();
        (questLogic as any).setQuestVariable('last_played_lantern', today);

        let tickets = 3;
        let rating = "poor";

        if (lanternDraft >= 80 && lanternDraft <= 95) {
            tickets = 15;
            rating = "perfect";
        } else if ((lanternDraft >= 60 && lanternDraft <= 79) || (lanternDraft >= 96 && lanternDraft <= 100)) {
            tickets = 8;
            rating = "good";
        }

        inv.modifyItem('festival_ticket', tickets, false);
        addLog(`Lantern Launched! Result: ${rating.toUpperCase()} (${lanternDraft}% draft). Awarded ${tickets} Festival Tickets.`);
        setLanternResult({ status: 'success', tickets });
    };

    // RESET MINIGAME STATE (For Play Again)
    const handleResetRingToss = () => {
        initRingTossBoard();
    };

    const handleResetLantern = () => {
        (questLogic as any).setQuestVariable('lantern_thermal_draft', 0);
        setLanternResult({ status: null, tickets: 0 });
    };

    // RENDER FUNCTIONS
    const renderTrivia = () => {
        const question = FESTIVAL_TRIVIA_QUESTIONS[triviaIndex];

        return (
            <div className="bg-gray-900/90 border border-yellow-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl max-w-lg w-full flex flex-col gap-6 font-pixel-rpg my-auto">
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800 text-left">
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">{question.question}</p>
                </div>

                <div className="flex flex-col gap-2">
                    {question.choices.map((choice, i) => {
                        let buttonStyle = "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white";
                        if (isTriviaAnswered !== 0) {
                            if (i === question.correctIndex) {
                                buttonStyle = "bg-emerald-900/60 border-emerald-500 text-emerald-200 cursor-default";
                            } else if (i === selectedChoice) {
                                buttonStyle = "bg-rose-900/60 border-rose-500 text-rose-200 cursor-default";
                            } else {
                                buttonStyle = "bg-gray-950/40 border-gray-900 text-gray-600 cursor-default opacity-50";
                            }
                        }

                        return (
                            <button
                                key={i}
                                disabled={isTriviaAnswered !== 0}
                                onClick={() => handleSelectTriviaAnswer(i)}
                                className={`w-full py-3 px-4 rounded-xl border text-left text-xs sm:text-sm font-pixel-rpg transition-all duration-200 ${buttonStyle}`}
                            >
                                <span className="inline-block w-6 text-yellow-500 font-bold">{String.fromCharCode(65 + i)}.</span>
                                {choice}
                            </button>
                        );
                    })}
                </div>

                {isTriviaAnswered !== 0 && (
                    <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800 text-left flex flex-col gap-2 animate-fade-in font-sans">
                        <span className={`text-xs font-bold font-pixel-rpg uppercase ${isTriviaAnswered === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isTriviaAnswered === 1 ? '✓ Correct! (+10 Tickets)' : '✗ Incorrect! (0 Tickets)'}
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed">{question.explanation}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderRingToss = () => {
        return (
            <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-1 relative gap-2 font-pixel-rpg">
                <style>{`
                    @keyframes throwArc {
                        0%   { left: 50%; top: 102%; transform: translate(-50%, -50%) scale(1); }
                        50%  { 
                            left: var(--mid-left); 
                            top: calc(var(--mid-top) - 80px); 
                            transform: translate(-50%, -50%) scale(1.6); 
                        }
                        100% { left: var(--target-left); top: var(--target-top); transform: translate(-50%, -50%) scale(1); }
                    }
                    .animate-throw-arc {
                        animation: throwArc 1000ms ease-out forwards;
                    }
                    
                    @keyframes scaleUp {
                        0% { transform: scale(0.9) opacity: 0; }
                        100% { transform: scale(1) opacity: 1; }
                    }
                    .scale-up-bounce {
                        animation: scaleUp 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                `}</style>

                <p className="text-[11px] text-gray-400 font-sans leading-tight text-center shrink-0">
                    Click the <strong className="text-yellow-400">golden ring</strong> below to toss it. Land on a peg to win up to <strong className="text-yellow-400">20 tickets</strong>!
                </p>

                {/* Pegboard Area */}
                <div className="flex-1 w-full aspect-square max-h-[300px] flex items-center justify-center shrink overflow-hidden relative mx-auto animate-fade-in">
                    <div className="relative aspect-square w-full h-full max-w-[300px] max-h-[300px] bg-gradient-to-b from-amber-950/20 to-amber-950/40 border border-amber-900/40 rounded-xl p-3 shadow-inner overflow-hidden">
                        {/* 5x5 Grid layout */}
                        <div className="grid grid-cols-5 grid-rows-5 gap-2 w-full h-full relative">
                            {pegs.map((peg, index) => {
                                const isTarget = throwTarget === index && ringTossResult === 'success';

                                // Precise dimensions
                                let width = '8px';
                                let height = '8px';
                                let pegColor = 'bg-emerald-400 border-emerald-300';
                                if (peg.size === 'medium') {
                                    width = '16px';
                                    height = '16px';
                                    pegColor = 'bg-amber-400 border-amber-300';
                                } else if (peg.size === 'large') {
                                    width = '24px';
                                    height = '24px';
                                    pegColor = 'bg-rose-500 border-rose-400';
                                }

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center relative w-full h-full"
                                    >
                                        {/* Peg Slot / Guide Ring */}
                                        <div className="w-8 h-8 rounded-full bg-black/40 border border-amber-950/30 flex items-center justify-center shadow-inner relative flex-shrink-0">
                                            {/* Peg Visual with inline styles to bypass Tailwind constraints */}
                                            <div
                                                style={{ width, height }}
                                                className={`rounded-full shadow-lg border transition-all duration-300 flex-shrink-0 ${pegColor} ${isTarget ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-black scale-110' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Absolutely positioned Ring representing the flying ring */}
                            <div
                                ref={ringRef}
                                className={`absolute pointer-events-none z-10 ${isThrowing ? 'animate-throw-arc' : ''}`}
                                style={{
                                    left: ringPos.left,
                                    top: ringPos.top,
                                    transform: 'translate(-50%, -50%)',
                                    transition: isThrowing
                                        ? 'none'
                                        : hasFallen
                                            ? 'top 400ms cubic-bezier(0.55, 0.085, 0.68, 0.53)'
                                            : 'none',
                                    ...({
                                        '--target-left': ringTossOffsets.targetLeft,
                                        '--target-top': ringTossOffsets.targetTop,
                                        '--mid-left': ringTossOffsets.midLeft,
                                        '--mid-top': ringTossOffsets.midTop,
                                    } as React.CSSProperties),
                                }}
                            >
                                <div className="w-8 h-8 rounded-full border-[3px] border-yellow-500 shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center bg-transparent">
                                    <div className="w-4 h-4 rounded-full border border-yellow-400/40 bg-black/5" />
                                </div>
                            </div>
                        </div>

                        {/* Result Popup Overlay inside Grid */}
                        {showPopup && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-xl animate-fade-in z-20">
                                <div className="bg-gray-900 border border-yellow-500/40 rounded-xl p-4 max-w-[240px] w-full text-center flex flex-col gap-2 shadow-2xl scale-up-bounce">
                                    {ringTossResult === 'success' ? (
                                        <>
                                            <div className="text-yellow-500 font-pixel-rpg text-[9px] tracking-widest uppercase">Result</div>
                                            <h3 className="text-emerald-400 font-pixel-rpg text-sm font-bold uppercase tracking-wide">★ PERFECT LANDING ★</h3>
                                            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/40">
                                                <p className="text-[10px] text-gray-200 font-sans leading-tight">
                                                    Landed around the <strong className="text-yellow-400 capitalize">{pegs[throwTarget!]?.size} peg</strong>!
                                                </p>
                                            </div>
                                            <div className="text-yellow-400 font-pixel-rpg text-lg font-bold flex items-center justify-center gap-1">
                                                +{ringTossTickets} Tickets 🎟
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-yellow-500 font-pixel-rpg text-[9px] tracking-widest uppercase">Result</div>
                                            <h3 className="text-rose-400 font-pixel-rpg text-sm font-bold uppercase tracking-wide">★ CLANK! MISSED ★</h3>
                                            <div className="bg-rose-950/40 p-2 rounded-lg border border-rose-900/40">
                                                <p className="text-[10px] text-gray-400 font-sans leading-tight">
                                                    Bounced off the pegs into the dirt!
                                                </p>
                                            </div>
                                            <div className="text-gray-500 font-pixel-rpg text-sm font-bold">
                                                0 Tickets 🎟
                                            </div>
                                        </>
                                    )}

                                    <div className="mt-1">
                                        {ringsLeft > 0 ? (
                                            <Button
                                                onClick={() => {
                                                    // Clear throw state, but do not regenerate pegs
                                                    setRingPos({ left: '50%', top: '102%' });
                                                    setRingTossOffsets({
                                                        targetLeft: '50%',
                                                        targetTop: '102%',
                                                        midLeft: '50%',
                                                        midTop: '102%',
                                                    });
                                                    setIsThrowing(false);
                                                    setThrowTarget(null);
                                                    setRingTossResult(null);
                                                    setRingTossTickets(0);
                                                    setShowPopup(false);
                                                    setHasFallen(false);
                                                }}
                                                className="w-full py-1.5 font-pixel-rpg text-xs"
                                            >
                                                Toss Next Ring
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setActiveFestivalMinigame(null);
                                                }}
                                                className="w-full py-1.5 font-pixel-rpg text-xs"
                                            >
                                                Finish Game
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Launch Platform and Start Button */}
                <div className="w-full max-w-[300px] bg-gray-950/60 rounded-xl border border-gray-850 p-2 flex flex-col items-center justify-center gap-1.5 shrink-0">
                    <div className="text-[10px] text-gray-400 font-pixel-rpg uppercase">
                        Rings left: <span className="text-yellow-400 font-bold">{ringsLeft}</span>
                    </div>
                    {!isThrowing && ringTossResult === null ? (
                        <div className="flex flex-col items-center gap-1 w-full">
                            {ringsLeft > 0 ? (
                                <>
                                    <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-[0.2em] font-pixel-rpg animate-pulse">Click the ring below to throw!</span>
                                    <div
                                        onClick={handleInteractiveToss}
                                        className="w-10 h-10 rounded-full border-4 border-yellow-500 shadow-xl flex items-center justify-center bg-transparent cursor-pointer hover:scale-110 active:scale-95 hover:border-yellow-400 hover:shadow-yellow-500/20 hover:bg-yellow-500/10 transition-all duration-200"
                                        title="Click to Throw Ring!"
                                    >
                                        <div className="w-5 h-5 rounded-full border border-yellow-400/40" />
                                    </div>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setActiveFestivalMinigame(null)}
                                    className="w-full py-1.5 font-pixel-rpg text-xs"
                                >
                                    Leave Game
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-10">
                            <span className="text-[9px] text-gray-400 tracking-[0.15em] font-pixel-rpg uppercase animate-pulse">
                                {isThrowing ? "Flying..." : "Resolving..."}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderLanternLaunch = () => {
        const activeAction = ui.activeSingleAction;
        const isWaiting = activeAction && activeAction.title === "Waiting for Thermal Draft...";

        const getDraftColor = () => {
            if (lanternDraft > 100) return 'bg-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse';
            if (lanternDraft >= 80 && lanternDraft <= 95) return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]';
            if ((lanternDraft >= 60 && lanternDraft <= 79) || (lanternDraft >= 96 && lanternDraft <= 100)) return 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]';
            return 'bg-amber-600';
        };

        const getDraftRating = () => {
            if (lanternDraft > 100) return { label: "OVERHEATED!", color: "text-rose-500 font-extrabold" };
            if (lanternDraft >= 80 && lanternDraft <= 95) return { label: "PERFECT ZONE!", color: "text-emerald-400 font-extrabold animate-bounce" };
            if ((lanternDraft >= 60 && lanternDraft <= 79) || (lanternDraft >= 96 && lanternDraft <= 100)) return { label: "GOOD ZONE", color: "text-amber-400 font-bold" };
            return { label: "WEAK DRAFT", color: "text-gray-400 font-medium" };
        };

        const rating = getDraftRating();

        return (
            <div className="bg-gray-900/90 border border-yellow-500/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl max-w-md w-full flex flex-col gap-4 font-pixel-rpg my-auto">
                <p className="text-[11px] text-gray-400 font-sans text-center">
                    Heat the lantern to build thermal draft. Launch when the meter hits the <strong className="text-emerald-400">80-95% SWEET SPOT</strong> for 15 tickets! Over 100% will catch fire!
                </p>

                {/* Gauge Display */}
                <div className="flex gap-4 items-center justify-center h-40 py-1">
                    {/* Thermal Draft Meter */}
                    <div className="w-10 h-full bg-gray-950 rounded-xl border border-gray-800 p-[3px] relative flex flex-col justify-end overflow-hidden">
                        {/* Sweet Spot Overlay Highlight */}
                        <div className="absolute left-[3px] right-[3px] bottom-[80%] top-[5%] bg-emerald-500/10 border-y border-emerald-500/40 pointer-events-none flex items-center justify-center">
                            <span className="text-[6px] text-emerald-400/60 vertical-text select-none tracking-tighter uppercase font-pixel-rpg">Sweet</span>
                        </div>
                        <div className="absolute left-[3px] right-[3px] bottom-[60%] top-[20%] bg-amber-400/5 border-y border-amber-400/20 pointer-events-none" />

                        {/* Draft Fill bar */}
                        <div
                            className={`w-full rounded-lg transition-all duration-300 ease-out origin-bottom ${getDraftColor()}`}
                            style={{ height: `${Math.min(100, lanternDraft)}%` }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex flex-col justify-center items-start text-left gap-1 font-pixel-rpg bg-gray-950/40 p-3 rounded-xl border border-gray-850 h-full">
                        <span className="text-[9px] text-gray-500 uppercase tracking-wider">Current Thermal Draft</span>
                        <span className="text-2xl font-extrabold text-yellow-400 leading-none">
                            {lanternDraft}%
                        </span>
                        <span className={`text-[9px] uppercase tracking-wide leading-none mt-0.5 ${rating.color}`}>
                            {rating.label}
                        </span>

                        <div className="border-t border-gray-850 w-full mt-1.5 pt-1.5 flex flex-col gap-0.5 text-[8px] text-gray-400 font-sans leading-relaxed">
                            <div className="flex justify-between"><span className="text-emerald-400 font-bold">80-95% (Sweet):</span> <strong className="text-gray-250">15 🎟</strong></div>
                            <div className="flex justify-between"><span className="text-amber-400 font-bold">60-79% / 96-100%:</span> <strong className="text-gray-250">8 🎟</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Under 60% (Weak):</span> <strong className="text-gray-250">3 🎟</strong></div>
                            <div className="flex justify-between"><span className="text-rose-500 font-bold">Over 100%:</span> <strong className="text-gray-250">2 🎟</strong></div>
                        </div>
                    </div>
                </div>

                {/* Progress meter for wait tick */}
                {isWaiting && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-yellow-400 tracking-[0.2em] font-bold uppercase animate-pulse font-pixel-rpg text-center">Feeding Fuel...</span>
                        <div className="relative w-full h-2 bg-gray-950 rounded-full border border-gray-800 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 origin-left"
                                style={{
                                    width: '100%',
                                    transform: 'scaleX(0)',
                                    transition: `transform ${activeAction?.duration}ms linear`,
                                    transformOrigin: 'left',
                                }}
                                ref={(el) => {
                                    if (el) {
                                        el.getBoundingClientRect();
                                        el.style.transform = 'scaleX(1)';
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Result Display */}
                {lanternResult.status && (
                    <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800 text-center flex flex-col gap-0.5 animate-fade-in font-pixel-rpg">
                        {lanternResult.status === 'overheat' ? (
                            <>
                                <span className="text-rose-500 text-sm font-extrabold uppercase tracking-widest animate-pulse">🔥 BOOM! OVERHEATED!</span>
                                <span className="text-[10px] text-gray-300 font-sans mt-0.5">
                                    The lantern caught fire and burned to ash.
                                </span>
                                <span className="text-yellow-400 text-xs font-bold mt-1">
                                    +2 tickets awarded.
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-emerald-400 text-sm font-extrabold uppercase tracking-widest">🚀 LAUNCH SUCCESS!</span>
                                <span className="text-[10px] text-gray-300 font-sans mt-0.5">
                                    The lantern drifts beautifully into the stars!
                                </span>
                                <span className="text-yellow-400 text-xs font-bold mt-1">
                                    +{lanternResult.tickets} Tickets Earned!
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    {!lanternResult.status && (
                        <>
                            <Button
                                disabled={isBusy}
                                onClick={handleLanternWaitDraft}
                                className="flex-1 py-1.5 font-pixel-rpg text-xs"
                            >
                                Wait for Draft (+8-22%)
                            </Button>
                            <Button
                                disabled={isBusy || lanternDraft === 0}
                                onClick={handleLanternLaunch}
                                className="flex-1 py-1.5 font-pixel-rpg text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-500"
                            >
                                Launch!
                            </Button>
                        </>
                    )}

                    {lanternResult.status && (
                        <Button
                            onClick={handleResetLantern}
                            className="flex-1 py-1.5 font-pixel-rpg text-xs"
                        >
                            Prepare Next Lantern
                        </Button>
                    )}
                </div>
            </div>
        );
    };


    // ─── LOG BALANCE ──────────────────────────────────────────────────────────
    const startLogBalance = () => {
        setLeanAngle(0);
        setLeanVelocity(0);
        setLogSurviveMs(0);
        setLogTickets(0);
        setLogPhase('playing');
        leanVelocityRef.current = 0;
        leanAngleRef.current = 0;
        logPhaseRef.current = 'playing';
        logStartTimeRef.current = Date.now();

        const schedulePush = () => {
            const delay = 2000 + Math.random() * 1500;
            logPushTimerRef.current = setTimeout(() => {
                if (logPhaseRef.current === 'done') return;
                const dir = Math.random() < 0.5 ? 1 : -1;
                leanVelocityRef.current += dir * (1.5 + Math.random());
                setLeanVelocity(leanVelocityRef.current);
                schedulePush();
            }, delay);
        };
        schedulePush();

        logPhysicsRef.current = setInterval(() => {
            leanAngleRef.current += leanVelocityRef.current * 0.3;
            if (Math.abs(leanAngleRef.current) >= 90) {
                endLogBalance(false);
                return;
            }
            setLeanAngle(leanAngleRef.current);
            leanVelocityRef.current *= 0.97; // friction
            setLeanVelocity(leanVelocityRef.current);
            setLogSurviveMs(Date.now() - logStartTimeRef.current);
        }, 100);
    };

    const endLogBalance = (survived: boolean) => {
        if (logPhysicsRef.current) clearInterval(logPhysicsRef.current);
        if (logPushTimerRef.current) clearTimeout(logPushTimerRef.current);
        setLogPhase('done');
        logPhaseRef.current = 'done';
        const ms = Date.now() - logStartTimeRef.current;
        const seconds = Math.floor(ms / 1000);
        const tickets = survived ? Math.min(15, Math.max(1, seconds)) : Math.max(0, Math.floor(seconds / 3));
        setLogTickets(tickets);
        if (tickets > 0) {
            inv.modifyItem('festival_ticket', tickets, false);
            addLog(`Log Balance! You held for ${seconds}s and earned ${tickets} Festival Tickets.`);
        } else {
            addLog(`Log Balance! You fell off quickly. No tickets this time.`);
        }
    };

    const handleLogLean = (dir: 'left' | 'right') => {
        if (logPhaseRef.current !== 'playing') return;
        const push = dir === 'left' ? -2.5 : 2.5;
        leanVelocityRef.current += push;
        if (Math.abs(leanVelocityRef.current) >= 12) {
            endLogBalance(false);
        }
        setLeanVelocity(leanVelocityRef.current);
    };

    const renderLogBalance = () => {
        const surviveSeconds = Math.floor(logSurviveMs / 1000);
        const clampedAngle = Math.max(-85, Math.min(85, leanAngle));
        // Rotate dashes around the ellipse based on survive time to simulate log rolling
        const rollOffset = logPhase === 'playing' ? (logSurviveMs * 0.05) % 7 : 0;
        return (
            <div className="flex flex-col items-center justify-between w-full h-full max-w-sm mx-auto p-3 gap-4 font-pixel-rpg">
                <p className="text-[11px] text-gray-400 font-sans text-center shrink-0">
                    Press the arrows to <strong className="text-yellow-400">stay balanced</strong> on the rolling log. Earn <strong className="text-yellow-400">1 ticket per second</strong> (max 15).
                </p>

                {/* Visual */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                    <svg viewBox="0 0 200 220" className="w-full max-w-[260px] max-h-[260px]">
                        {/* Log */}
                        <ellipse cx="100" cy="190" rx="90" ry="20" fill="#92400e" stroke="#78350f" strokeWidth="2" />
                        <ellipse cx="100" cy="175" rx="90" ry="20" fill="#a16207" stroke="#78350f" strokeWidth="2" />
                        {/* Grain lines */}
                        <ellipse cx="100" cy="175" rx="65" ry="13" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="4 3" strokeDashoffset={rollOffset} />
                        <ellipse cx="100" cy="175" rx="40" ry="7" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="4 3" strokeDashoffset={-rollOffset} />
                        {/* Stick figure — rotates from foot pivot (100,175) */}
                        <g transform={`rotate(${clampedAngle}, 100, 175)`}>
                            {/* Legs */}
                            <line x1="100" y1="175" x2="90" y2="150" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                            <line x1="100" y1="175" x2="110" y2="150" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                            {/* Body */}
                            <line x1="100" y1="150" x2="100" y2="115" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                            {/* Arms */}
                            <line x1="100" y1="130" x2="80" y2="118" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                            <line x1="100" y1="130" x2="120" y2="118" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                            {/* Head */}
                            <circle cx="100" cy="107" r="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
                        </g>
                        {/* Lean indicator */}
                        {logPhase === 'playing' && (
                            <text x="100" y="215" textAnchor="middle" fill={Math.abs(clampedAngle) > 55 ? '#ef4444' : '#f59e0b'} fontSize="10" fontFamily="monospace">
                                {Math.abs(clampedAngle) > 55 ? 'FALLING!' : 'BALANCE!'}
                            </text>
                        )}
                    </svg>
                </div>

                {/* Timer / status */}
                <div className="text-center shrink-0">
                    {logPhase === 'playing' && (
                        <span className="text-yellow-400 font-bold text-lg">{surviveSeconds}s</span>
                    )}
                    {logPhase === 'done' && (
                        <div className="flex flex-col items-center gap-1 animate-fade-in">
                            <span className="text-xs text-gray-400 font-sans">{surviveSeconds}s survived</span>
                            <span className="text-yellow-400 font-bold text-lg">+{logTickets} Tickets</span>
                            <span className="text-[10px] text-gray-500 font-sans">Exit and speak to Kenji to play again.</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-6 shrink-0">
                    {logPhase === 'idle' && (
                        <Button onClick={startLogBalance} className="px-8 py-2 font-pixel-rpg text-sm">
                            Step On!
                        </Button>
                    )}
                    {logPhase === 'playing' && (
                        <>
                            <button
                                onPointerDown={() => handleLogLean('left')}
                                className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 text-3xl flex items-center justify-center active:scale-90 transition-transform hover:border-yellow-500 select-none"
                                aria-label="Lean left"
                            >←</button>
                            <button
                                onPointerDown={() => handleLogLean('right')}
                                className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 text-3xl flex items-center justify-center active:scale-90 transition-transform hover:border-yellow-500 select-none"
                                aria-label="Lean right"
                            >→</button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // ─── WHACK-A-LANTERN ──────────────────────────────────────────────────────
    const LANTERN_COLORS = ['#f59e0b', '#14b8a6', '#a855f7', '#bb6691ff', '#22c55e'];

    const startWhackLantern = () => {
        setWhalScore(0);
        setWhalTickets(0);
        setWhalTimeLeft(30);
        setWhalLanterns(Array.from({ length: 16 }, (_, i) => ({ lit: false, color: '#f59e0b', isRed: false, id: i })));
        setWhalPhase('playing');

        whalTimerRef.current = setInterval(() => {
            setWhalTimeLeft(t => {
                if (t <= 1) {
                    endWhackLantern();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        const spawnLantern = () => {
            if (whalPhase === 'done') return;
            setWhalLanterns(prev => {
                const dark = prev.filter(l => !l.lit).map(l => l.id);
                if (dark.length === 0) return prev;
                const idx = dark[Math.floor(Math.random() * dark.length)];
                const isRed = Math.random() < 0.12;
                const color = isRed ? '#ef4444' : LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)];
                return prev.map(l => l.id === idx ? { ...l, lit: true, isRed, color } : l);
            });
            const next = 400 + Math.random() * 600;
            whalLanternTimerRef.current = setTimeout(spawnLantern, next);
        };
        whalLanternTimerRef.current = setTimeout(spawnLantern, 300);
    };

    const endWhackLantern = (force?: boolean) => {
        if (whalTimerRef.current) clearInterval(whalTimerRef.current);
        if (whalLanternTimerRef.current) clearTimeout(whalLanternTimerRef.current);
        setWhalPhase('done');
        setWhalLanterns(prev => prev.map(l => ({ ...l, lit: false })));
        setWhalScore(s => {
            const tickets = Math.min(20, s);
            setWhalTickets(tickets);
            if (tickets > 0) {
                inv.modifyItem('festival_ticket', tickets, false);
                addLog(`Whack-a-Lantern! You whacked ${s} lanterns and earned ${tickets} Festival Tickets.`);
            }
            return s;
        });
    };

    const handleWhackLantern = (id: number) => {
        if (whalPhase !== 'playing') return;
        const cell = whalLanterns.find(l => l.id === id);
        if (!cell || !cell.lit) return;
        if (cell.isRed) {
            endWhackLantern(true);
            addLog('Whack-a-Lantern! You hit a red lantern! Game over.');
            return;
        }
        setWhalScore(s => s + 1);
        setWhalLanterns(prev => prev.map(l => l.id === id ? { ...l, lit: false } : l));
        setIsHammerSwinging(true);
        setTimeout(() => setIsHammerSwinging(false), 150);
    };

    const handleWhalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHammerPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleWhalTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        setHammerPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    };

    const renderWhackLantern = () => (
        <div className="flex flex-col items-center justify-between w-full h-full max-w-sm mx-auto p-3 gap-3 font-pixel-rpg">
            {/* Header row */}
            <div className="flex justify-between w-full shrink-0 text-xs">
                <span className="text-yellow-400 font-bold">Score: {whalScore}</span>
                <span className={`font-bold ${whalTimeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-gray-300'}`}>
                    {whalTimeLeft}s
                </span>
            </div>

            {/* Grid */}
            <div
                ref={whalContainerRef}
                className="relative flex-1 w-full max-w-[280px] max-h-[280px] mx-auto"
                style={{ cursor: whalPhase === 'playing' ? 'none' : 'default' }}
                onPointerMove={handleWhalPointerMove}
                onTouchMove={handleWhalTouchMove}
            >
                <div className="grid grid-cols-4 gap-2 w-full h-full">
                    {whalLanterns.map(cell => (
                        <div
                            key={cell.id}
                            onPointerDown={() => handleWhackLantern(cell.id)}
                            onTouchStart={(e) => {
                                const touch = e.touches[0];
                                const rect = e.currentTarget.closest('[class*="relative"]')?.getBoundingClientRect();
                                if (rect) setHammerPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
                                setIsHammerSwinging(true);
                                setTimeout(() => setIsHammerSwinging(false), 150);
                                handleWhackLantern(cell.id);
                            }}
                            className="aspect-square flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 transition-all duration-100 cursor-none"
                        >
                            {/* Lantern SVG */}
                            <svg viewBox="0 0 40 56" className="w-full h-full p-1">
                                {/* Cap */}
                                <rect x="14" y="2" width="12" height="4" rx="2" fill="#78716c" />
                                <rect x="11" y="6" width="18" height="3" rx="1" fill="#57534e" />
                                {/* Body */}
                                <rect x="8" y="9" width="24" height="32" rx="4"
                                    fill={cell.lit ? cell.color : '#1c1917'}
                                    stroke={cell.lit ? cell.color : '#44403c'}
                                    strokeWidth="1.5"
                                    style={{ filter: cell.lit ? `drop-shadow(0 0 8px ${cell.color})` : 'none', transition: 'fill 0.1s, filter 0.1s' }}
                                />
                                {/* Ribs */}
                                {[16, 22, 28].map(y => (
                                    <line key={y} x1="8" y1={y} x2="32" y2={y} stroke={cell.lit ? 'rgba(0,0,0,0.2)' : '#292524'} strokeWidth="1" />
                                ))}
                                {/* Flame */}
                                {cell.lit && (
                                    <ellipse cx="20" cy="26" rx="5" ry="7" fill="rgba(255,255,200,0.35)" />
                                )}
                                {/* Base */}
                                <rect x="11" y="41" width="18" height="3" rx="1" fill="#57534e" />
                                <rect x="14" y="44" width="12" height="4" rx="2" fill="#78716c" />
                                {/* Hang wire */}
                                <line x1="20" y1="2" x2="20" y2="0" stroke="#78716c" strokeWidth="1.5" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Custom hammer cursor */}
                {whalPhase === 'playing' && (
                    <div
                        className="pointer-events-none absolute z-20"
                        style={{ left: hammerPos.x, top: hammerPos.y, transform: 'translate(-30%, -80%)' }}
                    >
                        <svg viewBox="0 0 32 48" width="40" height="60"
                            style={{ transform: isHammerSwinging ? 'rotate(25deg) translateY(6px)' : 'rotate(-10deg)', transition: 'transform 0.08s' }}>
                            {/* Handle */}
                            <rect x="14" y="18" width="5" height="26" rx="2" fill="#92400e" />
                            {/* Head */}
                            <rect x="4" y="6" width="24" height="14" rx="3" fill="#6b7280" />
                            <rect x="4" y="6" width="24" height="5" rx="2" fill="#9ca3af" />
                        </svg>
                    </div>
                )}

                {/* Done overlay */}
                {whalPhase === 'done' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-fade-in">
                        <span className="text-yellow-400 font-pixel-rpg text-sm font-bold uppercase">Round Over!</span>
                        <span className="text-gray-300 font-sans text-xs mt-1">Score: {whalScore} lanterns</span>
                        <span className="text-yellow-400 font-bold text-lg mt-1">+{whalTickets} Tickets</span>
                        <span className="text-gray-500 font-sans text-[10px] mt-2">Speak to Hana to play again.</span>
                    </div>
                )}
            </div>

            {whalPhase === 'idle' && (
                <Button onClick={startWhackLantern} className="px-8 py-2 font-pixel-rpg text-sm shrink-0">
                    Start!
                </Button>
            )}
            {whalPhase === 'playing' && (
                <p className="text-[10px] text-gray-500 font-sans shrink-0 text-center">
                    Click glowing lanterns — avoid <span className="text-rose-400 font-bold">red</span> ones!
                </p>
            )}
        </div>
    );

    // ─── SMASH-A-GOURD ────────────────────────────────────────────────────────
    const renderSmashGourd = () => {
        const maxHits = 5;
        const isSmashed = gourdExploded;

        const handleGourdHit = () => {
            if (isSmashed) return;
            const next = gourdHits + 1;
            setGourdHits(next);
            if (next >= maxHits) setGourdExploded(true);
        };

        // Parse the pre-resolved result
        let prizeNode: React.ReactNode = null;
        if (isSmashed && gourdResult) {
            const parts = gourdResult.split(':');
            if (parts[0] === 'tickets') {
                const amt = parseInt(parts[1] ?? '0', 10);
                prizeNode = (
                    <div className="flex flex-col items-center gap-1 animate-fade-in">
                        <svg viewBox="0 0 60 40" width="80" height="53">
                            <rect x="2" y="2" width="56" height="36" rx="6" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                            <circle cx="2" cy="20" r="5" fill="#1f1f1f" />
                            <circle cx="58" cy="20" r="5" fill="#1f1f1f" />
                            <text x="30" y="25" textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold" fontFamily="monospace">{amt}</text>
                        </svg>
                        <span className="text-yellow-400 font-bold text-sm">+{amt} Festival Tickets!</span>
                    </div>
                );
            } else if (parts[0] === 'item' && parts[1]) {
                const itemId = parts[1];
                prizeNode = (
                    <div className="flex flex-col items-center gap-1 animate-fade-in">
                        <img src={`/assets/items/${itemId}.png`} alt={itemId} className="w-16 h-16 object-contain" />
                        <span className="text-emerald-400 font-bold text-xs capitalize">{itemId.replace(/_/g, ' ')}!</span>
                    </div>
                );
            }
        }

        const crackPaths = [
            'M100,60 L95,90 L100,85 L98,110',
            'M100,60 L108,88 L103,82 L112,108',
            'M100,60 L85,75 L92,78 L80,100',
            'M100,60 L118,72 L110,76 L125,96',
        ];

        return (
            <div className="flex flex-col items-center justify-between w-full h-full max-w-xs mx-auto p-3 gap-4 font-pixel-rpg">
                <p className="text-[11px] text-gray-400 font-sans text-center shrink-0">
                    Tap the gourd <strong className="text-yellow-400">5 times</strong> to smash it open and reveal your prize!
                </p>

                {/* Gourd */}
                <div className="flex-1 flex items-center justify-center w-full">
                    <div
                        className={`cursor-pointer transition-transform active:scale-95 ${isSmashed ? '' : 'hover:scale-105'}`}
                        onClick={handleGourdHit}
                        style={{ userSelect: 'none' }}
                    >
                        {!isSmashed ? (
                            <svg viewBox="0 0 200 220" width="180" height="200">
                                {/* Gourd body */}
                                <ellipse cx="100" cy="140" rx="75" ry="65" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2" />
                                <ellipse cx="80" cy="115" rx="38" ry="32" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
                                {/* Stem */}
                                <path d="M100,75 C95,60 105,50 100,35" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
                                <path d="M100,35 C110,25 120,30 115,40" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
                                {/* Highlight */}
                                <ellipse cx="75" cy="120" rx="18" ry="12" fill="rgba(255,255,255,0.15)" transform="rotate(-20,75,120)" />
                                {/* Hit cracks */}
                                {crackPaths.slice(0, gourdHits > 0 ? gourdHits - 1 : 0).map((d, i) => (
                                    <path key={i} d={d} stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
                                ))}
                                {/* Shake hint */}
                                <text x="100" y="210" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                                    {gourdHits === 0 ? 'TAP TO HIT!' : `${maxHits - gourdHits} hits left!`}
                                </text>
                            </svg>
                        ) : (
                            <div className="flex flex-col items-center gap-3 animate-fade-in">
                                {/* Exploded gourd halves */}
                                <svg viewBox="0 0 200 120" width="180" height="108">
                                    <ellipse cx="60" cy="60" rx="48" ry="42" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2"
                                        transform="translate(-15,-10) rotate(-20,60,60)" />
                                    <ellipse cx="140" cy="60" rx="48" ry="42" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2"
                                        transform="translate(15,-10) rotate(20,140,60)" />
                                    <ellipse cx="60" cy="55" rx="30" ry="25" fill="#84cc16"
                                        transform="translate(-15,-10) rotate(-20,60,55)" />
                                </svg>
                                {prizeNode}
                            </div>
                        )}
                    </div>
                </div>

                {isSmashed && (
                    <p className="text-[10px] text-gray-500 font-sans shrink-0 text-center">
                        Come back tomorrow to smash another gourd!
                    </p>
                )}
            </div>
        );
    };

    // ─── HIGH STRIKER ─────────────────────────────────────────────────────────
    const handleStrikerHit = () => {
        if (strikerPhase !== 'idle') return;
        const tierIdx = Math.floor(Math.random() * STRIKER_TIERS.length);
        // Bias: DING is rare (~8%), weighted lower tiers
        const biasedRoll = Math.random();
        let bIdx = 0;
        if (biasedRoll < 0.30) bIdx = 0;
        else if (biasedRoll < 0.55) bIdx = 1;
        else if (biasedRoll < 0.74) bIdx = 2;
        else if (biasedRoll < 0.87) bIdx = 3;
        else if (biasedRoll < 0.95) bIdx = 4;
        else bIdx = 5;

        const tier = STRIKER_TIERS[bIdx];
        setStrikerPhase('animating');
        setStrikerPuckY(tier.height);

        setTimeout(() => {
            setStrikerTierIndex(bIdx);
            setStrikerTickets(tier.tickets);
            setStrikerPhase('done');
            if (tier.tickets > 0) {
                inv.modifyItem('festival_ticket', tier.tickets, false);
                addLog(`High Striker! You reached "${tier.label}" — ${tier.tickets} Festival Tickets earned!`);
            } else {
                addLog(`High Striker! You reached "${tier.label}" — no tickets this time.`);
            }
        }, 1600);
    };

    const renderHighStriker = () => {
        const tier = strikerTierIndex !== null ? STRIKER_TIERS[strikerTierIndex] : null;
        const isBell = strikerTierIndex === 5;
        // puckY = 0 (bottom) → 95 (top). SVG tower: y=20 (bell) to y=350 (base). Map puck.
        const towerH = 330;
        const puckSvgY = 350 - (strikerPuckY / 100) * towerH;

        return (
            <div className="flex flex-col items-center justify-between w-full h-full max-w-xs mx-auto p-2 gap-2 font-pixel-rpg">
                <p className="text-[11px] text-gray-400 font-sans text-center shrink-0">
                    Strike the pedal and <strong className="text-yellow-400">ring the bell</strong> for the top prize!
                </p>

                <div className="flex gap-4 items-end justify-center flex-1 w-full overflow-hidden">
                    {/* Tower SVG */}
                    <svg viewBox="0 0 100 380" className="h-full max-h-[320px] w-auto shrink-0">
                        {/* Tower poles */}
                        <rect x="44" y="20" width="6" height="330" rx="3" fill="#374151" />
                        <rect x="50" y="20" width="6" height="330" rx="3" fill="#4b5563" />

                        {/* Tier markers */}
                        {STRIKER_TIERS.map((t, i) => {
                            const markerY = 350 - (t.height / 100) * towerH;
                            const isActive = strikerTierIndex !== null && i <= strikerTierIndex;
                            return (
                                <g key={t.label}>
                                    <line x1="38" y1={markerY} x2="62" y2={markerY} stroke={isActive ? t.color : '#374151'} strokeWidth="2" />
                                    <text x="34" y={markerY + 4} textAnchor="end" fontSize="7" fill={isActive ? t.color : '#6b7280'} fontFamily="monospace">
                                        {t.label}
                                    </text>
                                    <text x="66" y={markerY + 4} textAnchor="start" fontSize="7" fill={isActive ? t.color : '#6b7280'} fontFamily="monospace">
                                        {t.tickets > 0 ? `${t.tickets}T` : '-'}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Bell */}
                        <g transform="translate(47, 14)">
                            <path d="M0,0 Q-10,10 -10,20 L10,20 Q10,10 0,0Z" fill={isBell ? '#eab308' : '#78716c'}
                                style={{ filter: isBell ? 'drop-shadow(0 0 6px #eab308)' : 'none', transition: 'filter 0.3s' }} />
                            <circle cx="0" cy="22" r="2" fill={isBell ? '#ca8a04' : '#57534e'} />
                        </g>

                        {/* Puck / ball */}
                        <circle
                            cx="47"
                            cy={puckSvgY}
                            r="5"
                            fill="#94a3b8"
                            stroke="#cbd5e1"
                            strokeWidth="1"
                            style={{ transition: strikerPhase === 'animating' ? 'cy 1.4s cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }}
                        />

                        {/* Base pedal */}
                        <rect x="25" y="348" width="50" height="32" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="1.5" />
                        <rect x="32" y="345" width="36" height="32" rx="3"
                            fill={strikerPhase === 'idle' ? '#f59e0b' : '#78350f'}
                            style={{ cursor: strikerPhase === 'idle' ? 'pointer' : 'default', transition: 'fill 0.2s' }}
                            onClick={handleStrikerHit}
                        />
                        <text x="50" y="360" textAnchor="middle" fontSize="10" fill={strikerPhase === 'idle' ? '#1f2937' : '#6b7280'} fontFamily="monospace"
                            style={{ cursor: strikerPhase === 'idle' ? 'pointer' : 'default' }}
                            onClick={handleStrikerHit}
                        >STRIKE</text>
                    </svg>

                    {/* Result panel */}
                    {strikerPhase === 'done' && tier && (
                        <div className="flex flex-col items-center gap-2 animate-fade-in text-center shrink-0">
                            <span className="font-pixel-rpg text-[9px] text-gray-500 uppercase tracking-widest">Result</span>
                            <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.label}</span>
                            <span className="text-yellow-400 font-bold text-lg">
                                {tier.tickets > 0 ? `+${tier.tickets} Tickets` : 'No Prize'}
                            </span>
                            {isBell && <span className="text-yellow-300 text-xs animate-bounce font-sans">DING DING DING!</span>}
                            <span className="text-[10px] text-gray-500 font-sans mt-1">Speak to Brokk to play again.</span>
                        </div>
                    )}
                    {strikerPhase === 'idle' && (
                        <div className="flex flex-col items-center gap-1 shrink-0 text-center">
                            <span className="text-[10px] text-gray-400 font-sans">Click the<br />yellow pedal</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ─── SHARED ───────────────────────────────────────────────────────────────
    const getMinigameDetails = () => {
        switch (activeFestivalMinigame) {
            case 'trivia': return { title: "Lin's Trivia Challenge", subtitle: "Lore Kiosk" };
            case 'ring_toss': return { title: "Oakhaven Ring Toss", subtitle: "Jin's Interactive Stall" };
            case 'lantern_launch': return { title: "Lantern Launch Platform", subtitle: "Festival Platform" };
            case 'log_balance': return { title: "Rolling Logs Balance", subtitle: "Instructor Kenji" };
            case 'whack_lantern': return { title: "Whack-a-Lantern", subtitle: "Booth Host Hana" };
            case 'smash_gourd': return { title: "Smash-a-Gourd", subtitle: "Gourd Patch" };
            case 'high_striker': return { title: "High Striker", subtitle: "Strongman Brokk" };
            default: return { title: "Festival Minigame", subtitle: "Embervale Festival" };
        }
    };
    const details = getMinigameDetails();

    return (
        <div className="flex flex-col h-full w-full text-gray-200 p-2 bg-gray-950/40 rounded-lg font-pixel-rpg overflow-hidden select-none border border-gray-800">
            {/* Common Top Bar */}
            <div className="flex justify-between items-center w-full mb-2 bg-black/40 p-2 rounded border border-gray-805 shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 leading-none">{details.title}</h1>
                    <p className="text-[10px] sm:text-xs text-gray-500 tracking-[0.2em] mt-1 uppercase opacity-60">{details.subtitle}</p>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center">
                    <div className="flex items-center gap-1.5 bg-gray-950/80 px-2.5 py-1 rounded-lg border border-gray-850">
                        <span className="text-[10px] text-gray-400">Tickets:</span>
                        <span className="text-xs font-bold text-yellow-400">
                            {inv.inventory.find((slot: any) => slot?.itemId === 'festival_ticket')?.quantity ?? 0}🎟
                        </span>
                    </div>
                    <Button onClick={() => setActiveFestivalMinigame(null)} variant="secondary" className="px-2 sm:px-3 py-1 text-xs">
                        Exit
                    </Button>
                </div>
            </div>

            {/* Viewport / Content Container */}
            <div className="flex-grow flex flex-col items-center justify-center min-h-0 w-full p-2 relative overflow-hidden">
                {activeFestivalMinigame === 'trivia' && renderTrivia()}
                {activeFestivalMinigame === 'ring_toss' && renderRingToss()}
                {activeFestivalMinigame === 'lantern_launch' && renderLanternLaunch()}
                {activeFestivalMinigame === 'log_balance' && renderLogBalance()}
                {activeFestivalMinigame === 'whack_lantern' && renderWhackLantern()}
                {activeFestivalMinigame === 'smash_gourd' && renderSmashGourd()}
                {activeFestivalMinigame === 'high_striker' && renderHighStriker()}
            </div>
        </div>
    );
};

export default FestivalMinigameView;
