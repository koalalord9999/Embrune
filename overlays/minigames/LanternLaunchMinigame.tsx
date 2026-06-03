// Lantern Launch Minigame extracted from FestivalMinigameView
import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/common/Button';

type Props = {
  questLogic: any;
  inv: any;
  addLog: (msg: string) => void;
  setActiveFestivalMinigame?: (val: any) => void;
};

const LanternLaunchMinigame: React.FC<Props> = ({ questLogic, inv, addLog }) => {
  // State
  const lanternDraft = (questLogic as any).getQuestVariable('lantern_thermal_draft') ?? 0;
  const [lanternResult, setLanternResult] = useState<{ status: 'success' | 'overheat' | null; tickets: number }>({
    status: null,
    tickets: 0,
  });

  // Lantern timing game – extra state
  const [lanternPhase, setLanternPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [lanternClicks, setLanternClicks] = useState(0);
  const [lanternNeedle, setLanternNeedle] = useState(10);
  const [lanternLastZone, setLanternLastZone] = useState<{ label: string; color: string } | null>(null);
  const lanternNeedleRef = useRef<number>(10);
  const lanternNeedleDirRef = useRef<number>(1);
  const lanternNeedleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lanternClicksRef = useRef<number>(0);
  const lanternDraftRef = useRef<number>(0);

  const LANTERN_NEEDLE_SPEEDS = [1.4, 2.1, 2.9, 3.8];

  const getLanternZone = (pos: number): { label: string; gain: number; color: string; textColor: string } => {
    if (pos >= 80 && pos <= 95) return { label: 'PERFECT!', gain: 28, color: '#10b981', textColor: 'text-emerald-400' };
    if ((pos >= 60 && pos < 80) || (pos > 95 && pos <= 100))
      return { label: 'GOOD', gain: 16, color: '#f59e0b', textColor: 'text-amber-400' };
    if (pos >= 30 && pos < 60) return { label: 'WARM', gain: 8, color: '#f97316', textColor: 'text-orange-400' };
    if (pos > 100) return { label: 'TOO HOT!', gain: 18, color: '#ef4444', textColor: 'text-rose-500' };
    return { label: 'COLD', gain: 3, color: '#6b7280', textColor: 'text-gray-500' };
  };

  const startLanternGame = () => {
    (questLogic as any).setQuestVariable('lantern_thermal_draft', 0);
    lanternDraftRef.current = 0;
    lanternClicksRef.current = 0;
    lanternNeedleRef.current = 10;
    lanternNeedleDirRef.current = 1;
    setLanternPhase('playing');
    setLanternClicks(0);
    setLanternNeedle(10);
    setLanternLastZone(null);
    setLanternResult({ status: null, tickets: 0 });

    if (lanternNeedleTimerRef.current) clearInterval(lanternNeedleTimerRef.current);
    lanternNeedleTimerRef.current = setInterval(() => {
      const speed = LANTERN_NEEDLE_SPEEDS[Math.min(lanternClicksRef.current, 3)];
      let pos = lanternNeedleRef.current + lanternNeedleDirRef.current * speed;
      if (pos >= 100) {
        pos = 100;
        lanternNeedleDirRef.current = -1;
      }
      if (pos <= 0) {
        pos = 0;
        lanternNeedleDirRef.current = 1;
      }
      lanternNeedleRef.current = pos;
      setLanternNeedle(pos);
    }, 30);
  };

  const finalizeLanternLaunch = (draft: number) => {
    if (lanternNeedleTimerRef.current) clearInterval(lanternNeedleTimerRef.current);
    const today = Math.floor(Date.now() / 86400000);
    (questLogic as any).setQuestVariable('last_played_lantern', today);
    if (draft > 100) {
      inv.modifyItem('festival_ticket', 2, false);
      addLog(`The lantern overheated at ${draft}% draft! It caught fire. Awarded 2 Festival Tickets.`);
      setLanternResult({ status: 'overheat', tickets: 2 });
    } else {
      let tickets = 3;
      if (draft >= 80 && draft <= 95) tickets = 15;
      else if (draft >= 60) tickets = 8;
      inv.modifyItem('festival_ticket', tickets, false);
      addLog(`Lantern Launched! ${draft}% draft. Awarded ${tickets} Festival Tickets.`);
      setLanternResult({ status: 'success', tickets });
    }
    setLanternPhase('done');
  };

  const handleFeedFuel = () => {
    if (lanternPhase !== 'playing') return;
    const needle = lanternNeedleRef.current;
    const zone = getLanternZone(needle);
    const newDraft = lanternDraftRef.current + zone.gain;
    const newClicks = lanternClicksRef.current + 1;

    lanternDraftRef.current = newDraft;
    lanternClicksRef.current = newClicks;
    (questLogic as any).setQuestVariable('lantern_thermal_draft', newDraft);
    setLanternClicks(newClicks);
    setLanternLastZone({ label: zone.label, color: zone.textColor });

    setTimeout(() => setLanternLastZone(null), 600);

    if (newDraft > 100 || newClicks >= 4) {
      setTimeout(() => finalizeLanternLaunch(newDraft), 400);
    }
  };

  // Rendering
  const renderLanternLaunch = () => {
    const currentDraft = lanternDraftRef.current;
    const needlePos = lanternNeedle;
    const zoneSegments = [
      { label: 'COLD', from: 0, to: 30, bg: 'bg-gray-700', border: 'border-gray-600' },
      { label: 'WARM', from: 30, to: 60, bg: 'bg-orange-700', border: 'border-orange-600' },
      { label: 'GOOD', from: 60, to: 80, bg: 'bg-amber-500', border: 'border-amber-400' },
      { label: 'PERFECT', from: 80, to: 95, bg: 'bg-emerald-500', border: 'border-emerald-400' },
      { label: 'HOT', from: 95, to: 100, bg: 'bg-rose-600', border: 'border-rose-500' },
    ];
    const currentZone = getLanternZone(needlePos);

    const getDraftFillClass = () => {
      if (currentDraft > 100) return 'bg-rose-500';
      if (currentDraft >= 80) return 'bg-emerald-500';
      if (currentDraft >= 60) return 'bg-amber-400';
      if (currentDraft >= 30) return 'bg-orange-500';
      return 'bg-gray-600';
    };

    return (
      <div className="bg-gray-900/90 border border-yellow-500/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl max-w-md w-full flex flex-col gap-4 font-pixel-rpg my-auto">
        {/* Header */}
        <p className="text-[11px] text-gray-400 font-sans text-center">
          Click <strong className="text-yellow-400">Feed Fuel</strong> when the marker is in the{' '}
          <strong className="text-emerald-400">green zone</strong> to build a perfect thermal draft.
          You get <strong className="text-yellow-400">4 feeds</strong> — make them count!
        </p>
        {lanternPhase === 'idle' && !lanternResult.status && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-4xl select-none">⚽</div>
            <Button onClick={startLanternGame} className="px-8 py-2 font-pixel-rpg text-sm">
              Begin Heating
            </Button>
            <div className="text-[9px] text-gray-500 font-sans text-center">
              Each fuel feed adds draft based on where the marker lands.<br />Hit the green zone for maximum lift!
            </div>
          </div>
        )}
        {(lanternPhase === 'playing' || lanternPhase === 'done') && (
          <>
            {/* Zone bar + needle */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[7px] text-gray-500 font-sans uppercase tracking-wider px-0.5">
                <span>Cold</span>
                <span>Warm</span>
                <span>Good</span>
                <span className="text-emerald-400 font-bold">Perfect</span>
                <span className="text-rose-400">Hot</span>
              </div>
              {/* Zone bar */}
              <div className="relative w-full h-7 rounded-lg overflow-hidden flex">
                <div className="h-full bg-gray-700" style={{ width: '30%' }} />
                <div className="h-full bg-orange-700" style={{ width: '30%' }} />
                <div className="h-full bg-amber-500" style={{ width: '20%' }} />
                <div className="h-full bg-emerald-500 shadow-[inset_0_0_8px_rgba(16,185,129,0.6)]" style={{ width: '15%' }} />
                <div className="h-full bg-rose-600" style={{ width: '5%' }} />
                {/* Needle */}
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)] rounded-full pointer-events-none transition-none"
                  style={{ left: `calc(${needlePos}% - 2px)` }}
                />
              </div>
              {/* Zone label */}
              <div className="h-4 text-center">
                {lanternLastZone ? (
                  <span className={`text-[10px] font-bold uppercase tracking-widest animate-pulse ${lanternLastZone.color}`}>
                    {lanternLastZone.label}
                  </span>
                ) : lanternPhase === 'playing' ? (
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${currentZone.textColor}`}>
                    {currentZone.label}
                  </span>
                ) : null}
              </div>
            </div>
            {/* Draft bar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider">Thermal Draft</span>
                <span className="text-sm font-extrabold text-yellow-400">{Math.min(currentDraft, 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-950 rounded-full border border-gray-800 overflow-hidden relative">
                <div className="absolute top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-500/40" style={{ left: '80%', right: '5%' }} />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getDraftFillClass()}`}
                  style={{ width: `${Math.min(currentDraft, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[7px] text-gray-600 font-sans">
                <span>0%</span>
                <span className="text-emerald-500/60">80–95 = Perfect</span>
                <span>100%</span>
              </div>
            </div>
            {/* Click counter */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${i < lanternClicks
                    ? 'bg-yellow-400 border-yellow-300 shadow-[0_0_6px_rgba(250,204,21,0.7)'
                    : 'bg-gray-800 border-gray-600'}`}
                />
              ))}
            </div>
            <p className="text-[9px] text-gray-500 font-sans text-center -mt-2">
              {lanternClicks < 4 ? `${lanternClicks}/4 feeds used` : 'Launching...'}
            </p>
          </>
        )}
        {/* Feed button */}
        {lanternPhase === 'playing' && (
          <button
            onPointerDown={handleFeedFuel}
            className="w-full py-3 rounded-xl font-pixel-rpg text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 border border-orange-400/50 shadow-lg active:scale-95 transition-transform select-none"
          >
            Feed Fuel
          </button>
        )}
      </div>
    );
  };

  return renderLanternLaunch();
};

export default LanternLaunchMinigame;
