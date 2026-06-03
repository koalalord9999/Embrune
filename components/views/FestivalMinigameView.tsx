import React from 'react';
import Button from '../common/Button';

import TriviaMinigame from '../../overlays/minigames/TriviaMinigame';

import LanternLaunchMinigame from '../../overlays/minigames/LanternLaunchMinigame';
import LogBalanceMinigame from '../../overlays/minigames/LogBalanceMinigame';
import WhackLanternMinigame from '../../overlays/minigames/WhackLanternMinigame';
import SmashGourdMinigame from '../../overlays/minigames/SmashGourdMinigame';
import HighStrikerMinigame from '../../overlays/minigames/HighStrikerMinigame';
import SkeeballMinigame from '../../overlays/minigames/SkeeballMinigame';
import BalloonPopMinigame from '../../overlays/minigames/BalloonPopMinigame';

type FestivalGame = 'trivia' | 'lantern_launch' | 'log_balance' | 'whack_lantern' | 'smash_gourd' | 'high_striker' | 'skeeball' | 'balloon_pop';

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



    // ─── SHARED ───────────────────────────────────────────────────────────────
    const getMinigameDetails = () => {
        switch (activeFestivalMinigame) {
            case 'trivia': return { title: "Lin's Trivia Challenge", subtitle: "Lore Kiosk" };
            case 'lantern_launch': return { title: "Lantern Launch Platform", subtitle: "Festival Platform" };
            case 'log_balance': return { title: "Rolling Logs Balance", subtitle: "Instructor Kenji" };
            case 'whack_lantern': return { title: "Whack-a-Lantern", subtitle: "Booth Host Hana" };
            case 'smash_gourd': return { title: "Smash-a-Gourd", subtitle: "Gourd Patch" };
            case 'high_striker': return { title: "High Striker", subtitle: "Strongman Brokk" };
            case 'skeeball': return { title: "Lane Roller", subtitle: "Ball Loader Victoria" };
            case 'balloon_pop': return { title: "Balloon Pop", subtitle: "Dart Thrower Kevin" };
            default: return { title: "Festival Minigame", subtitle: "Embrune Festival" };
        }
    };
    const details = getMinigameDetails();

    return (
        <div className="flex flex-col h-full w-full text-gray-200 p-2 bg-gray-950/40 rounded-lg font-pixel-rpg overflow-hidden select-none border border-gray-800">
            <style>{`
                @keyframes scaleUp {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .scale-up-bounce {
                    animation: scaleUp 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
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
                {activeFestivalMinigame === 'trivia' && (
                    <TriviaMinigame
                        questLogic={questLogic}
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
                {activeFestivalMinigame === 'lantern_launch' && (
                    <LanternLaunchMinigame
                        questLogic={questLogic}
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
                {activeFestivalMinigame === 'log_balance' && (
                    <LogBalanceMinigame
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
                {activeFestivalMinigame === 'whack_lantern' && (
                    <WhackLanternMinigame
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
                {activeFestivalMinigame === 'smash_gourd' && (
                    <SmashGourdMinigame
                        inv={inv}
                        addLog={addLog}
                        questLogic={questLogic}
                    />
                )}
                {activeFestivalMinigame === 'high_striker' && (
                    <HighStrikerMinigame
                        inv={inv}
                        addLog={addLog}
                    />
                )}
                {activeFestivalMinigame === 'skeeball' && (
                    <SkeeballMinigame
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
                {activeFestivalMinigame === 'balloon_pop' && (
                    <BalloonPopMinigame
                        inv={inv}
                        addLog={addLog}
                        setActiveFestivalMinigame={setActiveFestivalMinigame}
                    />
                )}
            </div>
        </div>
    );
};

export default FestivalMinigameView;
