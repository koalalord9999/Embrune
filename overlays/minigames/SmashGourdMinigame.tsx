import React, { useState } from 'react';
import { GOURD_LOOT_TABLE } from '../../constants/festival';

type Props = {
  inv: any;
  addLog: (msg: string) => void;
  questLogic: any;
};

const SmashGourdMinigame: React.FC<Props> = ({ inv, addLog, questLogic }) => {
  const gourdResult = (questLogic as any).getQuestVariable('gourd_smash_result') ?? null;
  const [gourdHits, setGourdHits] = useState<number>(0);
  const [gourdExploded, setGourdExploded] = useState<boolean>(false);

  const maxHits = 5;
  const isSmashed = gourdExploded;

  const handleGourdHit = () => {
    if (isSmashed) return;
    const next = gourdHits + 1;
    setGourdHits(next);
    if (next >= maxHits) {
      setGourdExploded(true);
      if (gourdResult) {
        const parts = gourdResult.split(':');
        if (parts[0] === 'tickets') {
          const amt = parseInt(parts[1] ?? '0', 10);
          inv.modifyItem('festival_ticket', amt, false);
          let logMsg = "A modest haul of tickets falls from the gourd!";
          const matchingEntry = GOURD_LOOT_TABLE.find(entry =>
            entry.type === 'festival_ticket' &&
            amt >= (entry.minTickets ?? 0) &&
            amt <= (entry.maxTickets ?? 0)
          );
          if (matchingEntry) logMsg = matchingEntry.logMessage;
          addLog(`Gourd Smash! ${logMsg} (Earned ${amt} Festival Tickets)`);
        } else if (parts[0] === 'item' && parts[1]) {
          const itemId = parts[1];
          inv.modifyItem(itemId, 1, false);
          let logMsg = `A ${itemId.replace(/_/g, ' ')} tumbles out of the gourd!`;
          const matchingEntry = GOURD_LOOT_TABLE.find(entry =>
            entry.type === 'item' &&
            entry.itemId === itemId
          );
          if (matchingEntry) logMsg = matchingEntry.logMessage;
          addLog(`Gourd Smash! ${logMsg}`);
        }
      }
    }
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
              <ellipse cx="75" cy="120" rx="18" ry="12" fill="rgba(255,255,200,0.15)" transform="rotate(-20,75,120)" />
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

export default SmashGourdMinigame;
