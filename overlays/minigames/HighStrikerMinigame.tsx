import React, { useState } from 'react';

type Props = {
  inv: any;
  addLog: (msg: string) => void;
};

const STRIKER_TIERS = [
  { label: 'Weakling', color: '#6b7280', tickets: 0, height: 10 },
  { label: 'Amateur', color: '#f59e0b', tickets: 2, height: 26 },
  { label: 'Strong', color: '#f97316', tickets: 5, height: 44 },
  { label: 'Mighty', color: '#ef4444', tickets: 10, height: 60 },
  { label: 'Legendary', color: '#a855f7', tickets: 15, height: 78 },
  { label: 'DING!', color: '#eab308', tickets: 25, height: 95 },
];

const HighStrikerMinigame: React.FC<Props> = ({ inv, addLog }) => {
  const [strikerPuckY, setStrikerPuckY] = useState<number>(0);
  const [strikerPhase, setStrikerPhase] = useState<'idle' | 'animating' | 'done'>('idle');
  const [strikerTierIndex, setStrikerTierIndex] = useState<number | null>(null);
  const [strikerTickets, setStrikerTickets] = useState<number>(0);

  const handleStrikerHit = () => {
    if (strikerPhase !== 'idle') return;
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

  const tier = strikerTierIndex !== null ? STRIKER_TIERS[strikerTierIndex] : null;
  const isBell = strikerTierIndex === 5;
  const towerH = 330;
  const puckSvgY = 350 - (strikerPuckY / 100) * towerH;

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-lg mx-auto p-3 gap-3 font-pixel-rpg">
      <p className="text-[11px] text-gray-400 font-sans text-center shrink-0">
        Strike the pedal and <strong className="text-yellow-400">ring the bell</strong> for the top prize!
      </p>

      <div className="flex gap-6 items-end justify-center flex-1 w-full overflow-hidden">
        <svg viewBox="0 0 200 400" className="h-full max-h-[460px] w-auto shrink-0">
          <rect x="94" y="20" width="6" height="330" rx="3" fill="#374151" />
          <rect x="100" y="20" width="6" height="330" rx="3" fill="#4b5563" />

          {STRIKER_TIERS.map((t, i) => {
            const markerY = 350 - (t.height / 100) * towerH;
            const isActive = strikerTierIndex !== null && i <= strikerTierIndex;
            return (
              <g key={t.label}>
                <line x1="76" y1={markerY} x2="124" y2={markerY} stroke={isActive ? t.color : '#374151'} strokeWidth="2.5" />
                <text x="72" y={markerY + 4} textAnchor="end" fontSize="10" fill={isActive ? t.color : '#6b7280'} fontFamily="monospace">
                  {t.label}
                </text>
                <text x="128" y={markerY + 4} textAnchor="start" fontSize="10" fill={isActive ? t.color : '#6b7280'} fontFamily="monospace">
                  {t.tickets > 0 ? `${t.tickets}T` : '-'}
                </text>
              </g>
            );
          })}

          <g transform="translate(97, 14)">
            <path d="M0,0 Q-14,12 -14,26 L14,26 Q14,12 0,0Z" fill={isBell ? '#eab308' : '#78716c'}
              style={{ filter: isBell ? 'drop-shadow(0 0 8px #eab308)' : 'none', transition: 'filter 0.3s' }} />
            <circle cx="0" cy="28" r="3" fill={isBell ? '#ca8a04' : '#57534e'} />
          </g>

          <circle
            cx="97"
            cy={puckSvgY}
            r="7"
            fill="#94a3b8"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            style={{ transition: strikerPhase === 'animating' ? 'cy 1.4s cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }}
          />

          <rect x="58" y="350" width="84" height="36" rx="5" fill="#374151" stroke="#4b5563" strokeWidth="2" />
          <rect x="66" y="347" width="68" height="36" rx="4"
            fill={strikerPhase === 'idle' ? '#f59e0b' : '#78350f'}
            style={{ cursor: strikerPhase === 'idle' ? 'pointer' : 'default', transition: 'fill 0.2s' }}
            onClick={handleStrikerHit}
          />
          <text x="100" y="369" textAnchor="middle" fontSize="13" fontWeight="bold" fill={strikerPhase === 'idle' ? '#1f2937' : '#6b7280'} fontFamily="monospace"
            style={{ cursor: strikerPhase === 'idle' ? 'pointer' : 'default' }}
            onClick={handleStrikerHit}
          >STRIKE</text>
        </svg>

        {strikerPhase === 'done' && tier && (
          <div className="flex flex-col items-center gap-2 animate-fade-in text-center shrink-0">
            <span className="font-pixel-rpg text-[9px] text-gray-500 uppercase tracking-widest">Result</span>
            <span className="font-bold text-base" style={{ color: tier.color }}>{tier.label}</span>
            <span className="text-yellow-400 font-bold text-xl">
              {tier.tickets > 0 ? `+${tier.tickets} Tickets` : 'No Prize'}
            </span>
            {isBell && <span className="text-yellow-300 text-sm animate-bounce font-sans">DING DING DING!</span>}
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

export default HighStrikerMinigame;
