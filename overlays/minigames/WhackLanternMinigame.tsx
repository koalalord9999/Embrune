import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/common/Button';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

type FestivalGame = 'trivia' | 'lantern_launch' | 'log_balance' | 'whack_lantern' | 'smash_gourd' | 'high_striker' | 'skeeball' | 'balloon_pop';

type Props = {
  inv: any;
  addLog: (msg: string) => void;
  setActiveFestivalMinigame: (val: FestivalGame | null) => void;
};

interface LanternCell {
  lit: boolean;
  color: string;
  isRed: boolean;
  id: number;
}

const LANTERN_COLORS = ['#f59e0b', '#14b8a6', '#a855f7', '#bb6691ff', '#22c55e'];

const WhackLanternMinigame: React.FC<Props> = ({ inv, addLog, setActiveFestivalMinigame }) => {
  const isMobile = useIsTouchDevice();
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
    }, 1800);

    const spawnLantern = () => {
      if (whalPhase === 'done') return;

      const r = Math.random();
      const countToSpawn = r < 0.10 ? 3 : r < 0.40 ? 2 : 1;

      for (let i = 0; i < countToSpawn; i++) {
        setWhalLanterns(prev => {
          const dark = prev.filter(l => !l.lit).map(l => l.id);
          if (dark.length === 0) return prev;
          const idx = dark[Math.floor(Math.random() * dark.length)];
          const isRed = Math.random() < 0.25;
          const color = isRed ? '#ef4444' : LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)];

          // Automatically turn off this specific lantern after 2000 - 2500ms
          setTimeout(() => {
            setWhalLanterns(curr => curr.map(l => l.id === idx ? { ...l, lit: false } : l));
          }, 2000 + Math.random() * 500);

          return prev.map(l => l.id === idx ? { ...l, lit: true, isRed, color } : l);
        });
      }

      const next = 300 + Math.random() * 350; // Faster spawn interval (300-650ms)
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
      const isJackpot = (isMobile && s >= 150) || (!isMobile && s >= 90);
      const tickets = isJackpot ? 50 : Math.min(20, s);
      setWhalTickets(tickets);
      if (tickets > 0) {
        inv.modifyItem('festival_ticket', tickets, false);
        if (isJackpot) {
          addLog(`JACKPOT! Whack-a-Lantern! You whacked ${s} lanterns and earned a jackpot of 50 Festival Tickets!`);
        } else {
          addLog(`Whack-a-Lantern! You whacked ${s} lanterns and earned ${tickets} Festival Tickets.`);
        }
      }
      return s;
    });
  };

  useEffect(() => {
    return () => {
      if (whalTimerRef.current) clearInterval(whalTimerRef.current);
      if (whalLanternTimerRef.current) clearTimeout(whalLanternTimerRef.current);
    };
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-sm mx-auto p-3 gap-3 font-pixel-rpg">
      <div className="flex justify-between w-full shrink-0 text-xs">
        <span className="text-yellow-400 font-bold">Score: {whalScore}</span>
        <span className={`font-bold ${whalTimeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-gray-300'}`}>
          {whalTimeLeft}s
        </span>
      </div>

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
              <svg viewBox="0 0 40 56" className="w-full h-full p-1">
                <rect x="14" y="2" width="12" height="4" rx="2" fill="#78716c" />
                <rect x="11" y="6" width="18" height="3" rx="1" fill="#57534e" />
                <rect x="8" y="9" width="24" height="32" rx="4"
                  fill={cell.lit ? cell.color : '#1c1917'}
                  stroke={cell.lit ? cell.color : '#44403c'}
                  strokeWidth="1.5"
                  style={{ filter: cell.lit ? `drop-shadow(0 0 8px ${cell.color})` : 'none', transition: 'fill 0.1s, filter 0.1s' }}
                />
                {[16, 22, 28].map(y => (
                  <line key={y} x1="8" y1={y} x2="32" y2={y} stroke={cell.lit ? 'rgba(0,0,0,0.2)' : '#292524'} strokeWidth="1" />
                ))}
                {cell.lit && (
                  <ellipse cx="20" cy="26" rx="5" ry="7" fill="rgba(255,255,200,0.35)" />
                )}
                <rect x="11" y="41" width="18" height="3" rx="1" fill="#57534e" />
                <rect x="14" y="44" width="12" height="4" rx="2" fill="#78716c" />
                <line x1="20" y1="2" x2="20" y2="0" stroke="#78716c" strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>

        {whalPhase === 'playing' && (
          <div
            className="pointer-events-none absolute z-20"
            style={{ left: hammerPos.x, top: hammerPos.y, transform: 'translate(-30%, -80%)' }}
          >
            <svg viewBox="0 0 32 48" width="40" height="60"
              style={{ transform: isHammerSwinging ? 'rotate(25deg) translateY(6px)' : 'rotate(-10deg)', transition: 'transform 0.08s' }}>
              <rect x="14" y="18" width="5" height="26" rx="2" fill="#92400e" />
              <rect x="4" y="6" width="24" height="14" rx="3" fill="#6b7280" />
              <rect x="4" y="6" width="24" height="5" rx="2" fill="#9ca3af" />
            </svg>
          </div>
        )}

        {whalPhase === 'done' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-fade-in">
            <span className="text-yellow-400 font-pixel-rpg text-sm font-bold uppercase">Round Over!</span>
            <span className="text-gray-300 font-sans text-xs mt-1">Score: {whalScore} lanterns</span>
            <span className="text-yellow-400 font-bold text-lg mt-1">
              {(isMobile && whalScore >= 150) || (!isMobile && whalScore >= 90) ? 'JACKPOT! ' : ''}
              +{whalTickets} Tickets
            </span>
            <span className="text-gray-500 font-sans text-[10px] mt-2">Speak to Hana to play again.</span>
          </div>
        )}
      </div>

      {whalPhase === 'idle' && (
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <Button onClick={startWhackLantern} className="px-8 py-2 font-pixel-rpg text-sm">
            Start!
          </Button>
          <span className="text-[9px] text-gray-500 font-sans">
            Jackpot Target: {isMobile ? '150+ (Mobile)' : '90+ (PC)'}
          </span>
        </div>
      )}
      {whalPhase === 'playing' && (
        <p className="text-[10px] text-gray-500 font-sans shrink-0 text-center">
          Click glowing lanterns — avoid <span className="text-rose-400 font-bold">red</span> ones!<br />
          Target: <span className="text-yellow-400 font-semibold">{isMobile ? '150' : '90'}</span> for Jackpot!
        </p>
      )}
    </div>
  );
};

export default WhackLanternMinigame;
