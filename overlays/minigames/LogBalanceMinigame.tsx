// Log Balance Minigame component extracted from FestivalMinigameView.tsx
import React, { useState, useRef } from 'react';
import Button from '../../components/common/Button';

type Props = {
  inv: any;
  addLog: (msg: string) => void;
  questLogic?: any;
  setActiveFestivalMinigame?: (val: any) => void;
};

const LogBalanceMinigame: React.FC<Props> = ({ inv, addLog }) => {
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

    // Push the player only one time in either direction after 1 second
    logPushTimerRef.current = setTimeout(() => {
      if (logPhaseRef.current === 'done') return;
      const dir = Math.random() < 0.5 ? 1 : -1;
      leanVelocityRef.current = dir * 1.5;
      setLeanVelocity(leanVelocityRef.current);
    }, 1000);

    logPhysicsRef.current = setInterval(() => {
      const ms = Date.now() - logStartTimeRef.current;
      if (ms >= 15000) {
        setLogSurviveMs(15000);
        endLogBalance(true);
        return;
      }

      // Gravity accelerates based on how far you are from center.
      const gravityMultiplier = 0.055;
      const gravityAcc = leanAngleRef.current * gravityMultiplier;
      leanVelocityRef.current += gravityAcc;

      // Apply velocity to angle (scaled to 50ms interval)
      leanAngleRef.current += leanVelocityRef.current * 0.22;

      // Fail if lean angle exceeds 90 degrees
      if (Math.abs(leanAngleRef.current) >= 90) {
        endLogBalance(false);
        return;
      }

      setLeanAngle(leanAngleRef.current);
      // Minimal passive damping — the player's clicks are the primary recovery tool
      leanVelocityRef.current *= 0.97;
      setLeanVelocity(leanVelocityRef.current);
      setLogSurviveMs(ms);
    }, 50);
  };

  const endLogBalance = (survived: boolean) => {
    if (logPhysicsRef.current) clearInterval(logPhysicsRef.current);
    if (logPushTimerRef.current) clearTimeout(logPushTimerRef.current);
    setLogPhase('done');
    logPhaseRef.current = 'done';
    const ms = Date.now() - logStartTimeRef.current;
    const seconds = survived ? 15 : Math.floor(ms / 1000);
    const tickets = survived ? 15 : Math.max(0, Math.floor(seconds / 3));
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

    const v = leanVelocityRef.current;
    const a = leanAngleRef.current;

    // Determine if this click is correcting (pushing against the current lean/velocity)
    // or worsening the tilt.
    const isCorrectingLean = (dir === 'left' && a > 0) || (dir === 'right' && a < 0);
    const isCorrectingVelocity = (dir === 'left' && v > 0) || (dir === 'right' && v < 0);
    const isCountering = isCorrectingLean || isCorrectingVelocity;

    if (isCountering) {
      // Strong recovery: heavily dampen velocity toward zero and nudge angle back.
      // This makes recovery feel like a real skill action — one good click at the right
      // moment can pull you back, but it has to be timed when you're not over the edge.
      leanVelocityRef.current *= -0.35; // Reverse and strongly reduce velocity
      const angleNudge = dir === 'left' ? -3.5 : 3.5;
      leanAngleRef.current += angleNudge;
    } else {
      // Clicking the wrong direction adds a small adverse push
      const push = dir === 'left' ? -1.8 : 1.8;
      leanVelocityRef.current += push;
      leanAngleRef.current += push * 0.8;
    }

    // Clamp angle so a single misclick cannot immediately end the game
    leanAngleRef.current = Math.max(-89, Math.min(89, leanAngleRef.current));

    setLeanAngle(leanAngleRef.current);
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
                {Math.abs(clampedAngle) > 55 ? 'FALLING!' : 'BALANCE!' }
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
              <span className="text-[10px] text-gray-500 font-sans mt-1">Exit and speak to Kenji to play again.</span>
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

  return renderLogBalance();
};

export default LogBalanceMinigame;
