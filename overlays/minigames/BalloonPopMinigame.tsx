import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  TouchEvent,
} from 'react';
import Button from '../../components/common/Button';
import { useSimplePhysics } from '../../hooks/useSimplePhysics';
import './BalloonPopMinigame.css';

type Props = {
  inv: any;
  addLog: (msg: string) => void;
  questLogic?: any;
  setActiveFestivalMinigame?: (val: any) => void;
};

const BOARD_SIZE = 300;
const BALLOON_RADIUS = 20;

type BalloonType =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'gold'
  | 'bomb'
  | 'clock'
  | 'rainbow';

interface Balloon {
  id: number;
  x: number;
  y: number;
  type: BalloonType;
  value: number;
  animationDelay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const BALLOON_CONFIG: Record<
  BalloonType,
  {
    value: number;
    className: string;
    label: string;
  }
> = {
  red: {
    value: 10,
    className: 'balloon-red',
    label: '+10',
  },
  blue: {
    value: 20,
    className: 'balloon-blue',
    label: '+20',
  },
  green: {
    value: 30,
    className: 'balloon-green',
    label: '+30',
  },
  yellow: {
    value: 50,
    className: 'balloon-yellow',
    label: '+50',
  },
  gold: {
    value: 250,
    className: 'balloon-gold',
    label: '+250',
  },
  bomb: {
    value: -50,
    className: 'balloon-bomb',
    label: '-50',
  },
  clock: {
    value: 0,
    className: 'balloon-clock',
    label: '+1 Dart',
  },
  rainbow: {
    value: 75,
    className: 'balloon-rainbow',
    label: 'Burst',
  },
};

function randomBalloonType(): BalloonType {
  const roll = Math.random();

  if (roll < 0.05) return 'gold';
  if (roll < 0.10) return 'bomb';
  if (roll < 0.15) return 'clock';
  if (roll < 0.20) return 'rainbow';

  const normal = ['red', 'blue', 'green', 'yellow'] as const;
  return normal[Math.floor(Math.random() * normal.length)];
}

function generateBalloons(count: number): Balloon[] {
  const balloons: Balloon[] = [];

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let x = 0;
    let y = 0;

    while (attempts < 50) {
      x = Math.random() * 240 + 30;
      y = Math.random() * 180 + 40;

      const overlaps = balloons.some((b) => {
        const dist = Math.hypot(x - b.x, y - b.y);
        return dist < 42;
      });

      if (!overlaps) break;
      attempts++;
    }

    const type = randomBalloonType();

    balloons.push({
      id: i,
      x,
      y,
      type,
      value: BALLOON_CONFIG[type].value,
      animationDelay: Math.random() * 2,
    });
  }

  return balloons;
}

const BalloonPopMinigame: React.FC<Props> = ({
  inv,
  addLog,
  setActiveFestivalMinigame,
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>(
    () => generateBalloons(10)
  );

  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);

  const [combo, setCombo] = useState(1);
  const comboTimeoutRef = useRef<number | null>(null);

  const [dartsLeft, setDartsLeft] = useState(8);
  const [ticketsWon, setTicketsWon] = useState(0);

  const [isLaunching, setIsLaunching] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  const [ballX, setBallX] = useState(160);
  const DART_START_Y = 310;

  const cabinetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (cabinetRef.current) {
        const rect = cabinetRef.current.getBoundingClientRect();
        const scaleX = rect.width / 320;
        const scaleY = rect.height / 340;
        const newScale = Math.min(scaleX, scaleY, 1.3);
        setScale(newScale || 1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const startPosRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const dartRef = useRef<HTMLDivElement>(null);

  const {
    position,
    z,
    velocity,
    launch,
    stop,
    setPosition,
  } = useSimplePhysics({
    initialX: 160,
    initialY: DART_START_Y,
    gravity: 500,
    damping: 0.99,
    mode: 'dart',
  });

  const flightHeightReachedRef = useRef(false);

  useEffect(() => {
    if (dartRef.current) {
      let angle = -90; // Default points straight up
      let scale = 1;

      if (isLaunching) {
        const vx = velocity.x;
        const vy = velocity.y;
        if (Math.hypot(vx, vy) > 0.1) {
          angle = Math.atan2(vy, vx) * (180 / Math.PI);
        }
        scale = 1 + z * 0.015;
      } else if (startPosRef.current && dragCurrent) {
        const dx = dragCurrent.x - ballX;
        const dy = dragCurrent.y - DART_START_Y;
        if (Math.hypot(dx, dy) > 2) {
          angle = Math.atan2(dy, dx) * (180 / Math.PI);
        }
      }

      dartRef.current.style.transform =
        `translate(${position.x - 18}px, ${position.y - 6}px) rotate(${angle}deg) scale(${scale})`;
    }
  }, [position, z, isLaunching, velocity, dragCurrent, ballX]);

  function awardTickets(finalScore: number) {
    if (finalScore >= 2000) return 100;
    if (finalScore >= 1200) return 50;
    return Math.floor(finalScore / 100);
  }

  function spawnParticles(x: number, y: number) {
    const newParticles: Particle[] = [];

    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 60,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter(
          (p) => !newParticles.some((np) => np.id === p.id)
        )
      );
    }, 500);
  }

  function increaseCombo() {
    setCombo((prev) => Math.min(prev + 1, 10));

    if (comboTimeoutRef.current) {
      window.clearTimeout(comboTimeoutRef.current);
    }

    comboTimeoutRef.current = window.setTimeout(() => {
      setCombo(1);
    }, 2000);
  }

  function popBalloon(balloon: Balloon) {
    spawnParticles(balloon.x, balloon.y);

    let gainedScore = balloon.value * combo;

    if (balloon.type === 'clock') {
      setDartsLeft((d) => d + 1);
      addLog('Bonus dart earned!');
      gainedScore = 25;
    }

    if (balloon.type === 'rainbow') {
      const nearby = balloons.filter((b) => {
        if (b.id === balloon.id) return false;

        return (
          Math.hypot(
            b.x - balloon.x,
            b.y - balloon.y
          ) < 60
        );
      });

      setBalloons((prev) =>
        prev.filter(
          (b) =>
            b.id !== balloon.id &&
            !nearby.some((n) => n.id === b.id)
        )
      );

      gainedScore += nearby.reduce(
        (sum, b) => sum + Math.max(0, b.value),
        0
      );
    } else {
      setBalloons((prev) =>
        prev.filter((b) => b.id !== balloon.id)
      );
    }

    setScore((s) => Math.max(0, s + gainedScore));

    addLog(
      `${BALLOON_CONFIG[balloon.type].label} (${balloon.type})`
    );

    increaseCombo();

    const pop = new Audio('/assets/minigames/pop.wav');
    pop.play().catch(() => { });
  }

  useEffect(() => {
    if (!isLaunching) return;

    let landingTimeout: number | null = null;
    let isTerminated = false;

    const checkCollision = () => {
      if (isTerminated) return;

      if (z > 5) {
        flightHeightReachedRef.current = true;
      }

      // Check if dart has landed back on the board surface (z=0 after being launched)
      if (flightHeightReachedRef.current && z === 0) {
        isTerminated = true;

        // Stop physics and launching immediately to prevent the loop
        stop();
        setIsLaunching(false);

        // Check contact with balloons
        const hit = balloons.find((b) => {
          const dist = Math.hypot(position.x - b.x, position.y - b.y);
          return dist < BALLOON_RADIUS + 8; // Slight buffer for balloon popping radius
        });

        if (hit) {
          popBalloon(hit);
        } else {
          addLog('Miss!');
        }

        // Delay returning dart to start position so user sees landing/pop
        landingTimeout = window.setTimeout(() => {
          setPosition(ballX, DART_START_Y);
        }, 800);

        return;
      }

      // Safety boundary check
      if (
        position.x < -100 ||
        position.x > BOARD_SIZE + 100 ||
        position.y > BOARD_SIZE + 150 ||
        position.y < -100
      ) {
        isTerminated = true;
        stop();
        setIsLaunching(false);
        setPosition(ballX, DART_START_Y);
        addLog('Miss!');
        return;
      }

      requestAnimationFrame(checkCollision);
    };

    const animFrame = requestAnimationFrame(checkCollision);

    return () => {
      cancelAnimationFrame(animFrame);
      if (landingTimeout) {
        window.clearTimeout(landingTimeout);
      }
    };
  }, [
    isLaunching,
    position,
    z,
    balloons,
    stop,
    ballX,
    setPosition,
    addLog,
  ]);

  useEffect(() => {
    if (
      !roundComplete &&
      dartsLeft <= 0 &&
      !isLaunching
    ) {
      const tickets = awardTickets(score);

      setTicketsWon(tickets);
      setRoundComplete(true);

      if (tickets > 0 && inv) {
        inv.modifyItem('festival_ticket', tickets, false);
      }

      addLog(
        `Round complete! Won ${tickets} festival ticket${tickets !== 1 ? 's' : ''}.`
      );
    }
  }, [
    dartsLeft,
    isLaunching,
    roundComplete,
    score,
    addLog,
    inv,
  ]);

  const handlePointerDown = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (roundComplete || isLaunching) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    const localX = (x - rect.left) / scale;
    const localY = (y - rect.top) / scale;

    const clampedX = Math.max(20, Math.min(300, localX));
    setBallX(clampedX);
    setPosition(clampedX, DART_START_Y);

    startPosRef.current = {
      x: clampedX,
      y: DART_START_Y,
      time: Date.now(),
    };

    setDragCurrent({
      x: localX,
      y: localY,
    });
  };

  const handlePointerMove = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (roundComplete || isLaunching) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    const localX = (x - rect.left) / scale;
    const localY = (y - rect.top) / scale;

    if (!startPosRef.current) {
      const clampedX = Math.max(20, Math.min(300, localX));
      setBallX(clampedX);
      setPosition(clampedX, DART_START_Y);
    } else {
      setDragCurrent({
        x: localX,
        y: localY,
      });
    }
  };

  const handlePointerUp = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (!startPosRef.current || isLaunching) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const localX = (clientX - rect.left) / scale;
    const localY = (clientY - rect.top) / scale;

    const dx = localX - ballX;
    const dy = localY - DART_START_Y;
    const dist = Math.hypot(dx, dy);

    if (dist < 10) {
      startPosRef.current = null;
      setDragCurrent(null);
      return;
    }

    const angle = Math.atan2(dy, dx);
    const power = Math.min(dist, 160);
    const speed = power * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const vz = 180;

    flightHeightReachedRef.current = false;
    launch(vx, vy, ballX, DART_START_Y, vz);

    setDartsLeft((d) => d - 1);
    setIsLaunching(true);

    startPosRef.current = null;
    setDragCurrent(null);
  };

  const handleReset = () => {
    stop();

    setScore(0);
    setCombo(1);

    setDartsLeft(8);

    setTicketsWon(0);

    setRoundComplete(false);

    setParticles([]);

    setBalloons(generateBalloons(10));

    setIsLaunching(false);
    setBallX(160);
    setPosition(160, DART_START_Y);
  };

  const progress =
    Math.min(score, 400) / 400;

  const trajectoryDots =
    startPosRef.current && dragCurrent
      ? (() => {
          const dx = dragCurrent.x - ballX;
          const dy = dragCurrent.y - DART_START_Y;
          const dist = Math.hypot(dx, dy);
          if (dist < 10) return [];

          const angle = Math.atan2(dy, dx);
          const dotLength = Math.min(dist, 160);
          const dotCount = 8;
          return Array.from({ length: dotCount }).map((_, i) => {
            const t = (i + 1) / dotCount;
            const d = dotLength * t;
            return {
              x: ballX + Math.cos(angle) * d,
              y: DART_START_Y + Math.sin(angle) * d,
            };
          });
        })()
      : [];

  return (
    <div className="balloon-pop-shell">
      <div className="balloon-pop-layout">

        {/* Left Side HUD Panel */}
        <div className="balloon-pop-side-panel">
          <h2>Balloon Pop</h2>

          <div className="balloon-pop-hud">
            <div>
              <span>Score</span>
              <strong>{score}</strong>
            </div>

            <div>
              <span>Combo</span>
              <strong>x{combo}</strong>
            </div>

            <div>
              <span>Darts</span>
              <strong>{dartsLeft}</strong>
            </div>

            <div>
              <span>Prize</span>
              <strong>{awardTickets(score)} tix</strong>
            </div>
          </div>
        </div>

        {/* Right Side Cabinet (Board) */}
        <div className="balloon-pop-cabinet" ref={cabinetRef}>
          <div
            className="balloon-board"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              touchAction: 'none',
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >

            {balloons.map((b) => (
              <div
                key={b.id}
                className={`festival-balloon ${BALLOON_CONFIG[b.type]
                    .className
                  }`}
                style={{
                  left: b.x - 14,
                  top: b.y - 18,
                  animationDelay:
                    `${b.animationDelay}s`,
                }}
              />
            ))}

            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: p.x,
                  top: p.y,
                  transform:
                    `translate(${p.dx}px, ${p.dy}px)`,
                }}
              />
            ))}

            {trajectoryDots.map(
              (dot, index) => (
                <div
                  key={index}
                  className="trajectory-dot"
                  style={{
                    left: dot.x - 3,
                    top: dot.y - 3,
                  }}
                />
              )
            )}

            {isLaunching && (
              <div
                className="dart-shadow"
                style={{
                  position: 'absolute',
                  left: position.x - 10,
                  top: position.y + 12 + z * 0.4,
                  width: '20px',
                  height: '6px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  transform: `scale(${Math.max(0.4, 1 - z * 0.01)})`,
                  zIndex: 10,
                }}
              />
            )}

            <svg
              ref={dartRef as any}
              className="festival-dart"
              viewBox="0 0 60 20"
              style={{
                left: '0px',
                top: '0px',
                transformOrigin: 'center center',
                pointerEvents: 'none',
              }}
            >
              <defs>
                <linearGradient id="steelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f3f4f6" />
                  <stop offset="40%" stopColor="#9ca3af" />
                  <stop offset="60%" stopColor="#4b5563" />
                  <stop offset="100%" stopColor="#1f2937" />
                </linearGradient>
                <linearGradient id="brassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#eab308" />
                  <stop offset="70%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>
                <linearGradient id="flightGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
              <path d="M 45 10 L 58 10" stroke="#e5e7eb" strokeWidth="2.2" strokeLinecap="round" />
              <rect x="25" y="6" width="20" height="8" rx="1.5" fill="url(#brassGrad)" stroke="#1e293b" strokeWidth="0.75" />
              <line x1="29" y1="6" x2="29" y2="14" stroke="#854d0e" strokeWidth="0.75" />
              <line x1="33" y1="6" x2="33" y2="14" stroke="#854d0e" strokeWidth="0.75" />
              <line x1="37" y1="6" x2="37" y2="14" stroke="#854d0e" strokeWidth="0.75" />
              <line x1="41" y1="6" x2="41" y2="14" stroke="#854d0e" strokeWidth="0.75" />
              <rect x="13" y="8" width="12" height="4" fill="url(#steelGrad)" stroke="#1e293b" strokeWidth="0.5" />
              <path d="M 2 3 L 13 8 L 9 10 L 2 10 Z" fill="url(#flightGrad)" stroke="#7f1d1d" strokeWidth="0.75" />
              <path d="M 2 17 L 13 12 L 9 10 L 2 10 Z" fill="url(#flightGrad)" stroke="#7f1d1d" strokeWidth="0.75" />
            </svg>

            {roundComplete && (
              <div className="round-complete-overlay">

                <div className="round-complete-title">
                  Round Complete
                </div>

                <div>
                  Final Score:
                  {' '}
                  {score}
                </div>

                <div>
                  Tickets Won:
                  {' '}
                  {ticketsWon}
                </div>

                <div className="flex gap-2 mt-4">

                  <Button
                    variant="secondary"
                    onClick={() =>
                      setActiveFestivalMinigame?.(
                        null
                      )
                    }
                  >
                    Leave Booth
                  </Button>

                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default BalloonPopMinigame;