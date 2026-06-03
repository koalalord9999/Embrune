import React, { useState, useRef, useEffect, useMemo } from 'react';
import Button from '../../components/common/Button';
import { useSimplePhysics } from '../../hooks/useSimplePhysics';
import './SkeeballMinigame.css';

const BOARD_WIDTH = 320;
const BOARD_HEIGHT = 520;
const BALL_START_X = 160;
const BALL_START_Y = 470;
const AIM_CONE_DEG = 150;
const AIM_CONE_RAD = (AIM_CONE_DEG * Math.PI) / 180;

// Ramp Y threshold
const RAMP_Y = 350;

// Scoring zone center (where the concentric rings radiate from)
const ZONE_CX = 160;
const ZONE_CY = 160;

// Scoring holes with positions in the scoring zone
const HOLES = [
  { id: 1, x: 100, y: 105, points: 100, color: '#facc15', r: 16 },
  { id: 2, x: 220, y: 105, points: 100, color: '#facc15', r: 16 },
  { id: 3, x: ZONE_CX, y: 115, points: 50, color: '#ef4444', r: 18 },
  { id: 4, x: 125, y: 185, points: 30, color: '#60a5fa', r: 16 },
  { id: 5, x: 195, y: 185, points: 30, color: '#60a5fa', r: 16 },
  { id: 6, x: 105, y: 260, points: 20, color: '#fb923c', r: 16 },
  { id: 7, x: 215, y: 260, points: 20, color: '#fb923c', r: 16 },
];

// Gutter zone: below ball start
const GUTTER_Y = BALL_START_Y + 10;

const SkeeballMinigame: React.FC<{
  inv: any;
  addLog: (msg: string) => void;
  setActiveFestivalMinigame?: (val: any) => void;
}> = ({ inv, addLog, setActiveFestivalMinigame }) => {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(9);
  const [isRolling, setIsRolling] = useState(false);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);
  const [aimLine, setAimLine] = useState<{ x: number; y: number } | null>(null);
  const [ballX, setBallX] = useState(BALL_START_X);
  const [gameOver, setGameOver] = useState(false);
  const [ticketsWon, setTicketsWon] = useState(0);
  const [throwPending, setThrowPending] = useState(false);
  const [rackBalls, setRackBalls] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  useEffect(() => {
    if (throwsLeft === 9) {
      setRackBalls([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }, [throwsLeft]);

  useEffect(() => {
    if (rackBalls.length > throwsLeft) {
      const diff = rackBalls.length - throwsLeft;
      setRackBalls((prev) => prev.slice(diff));
    }
  }, [throwsLeft, rackBalls.length]);

  const ballRef = useRef<SVGCircleElement>(null);
  const boardRef = useRef<SVGSVGElement>(null);

  const { position, z, didClearRamp, velocity, launch, stop, setPosition } = useSimplePhysics({
    initialX: BALL_START_X,
    initialY: BALL_START_Y,
    gravity: 1200,
    damping: 0.991,
  });

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const rollStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!ballRef.current) return;

    ballRef.current.setAttribute('cx', position.x.toString());
    ballRef.current.setAttribute('cy', position.y.toString());
    ballRef.current.setAttribute('r', (10 + z * 0.21).toString());
  }, [position, z]);

  const getLocalPos = (e: any) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // SVG coordinates need scaling from client coords
    const scaleX = BOARD_WIDTH / rect.width;
    const scaleY = BOARD_HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Clamp an angle to the 150-degree upward cone
  const clampToCone = (rawAngle: number): number => {
    const halfCone = AIM_CONE_RAD / 2;
    const center = -Math.PI / 2;
    let diff = rawAngle - center;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    if (Math.abs(diff) <= halfCone) return rawAngle;
    return center + Math.sign(diff) * halfCone;
  };

  const handlePointerDown = (e: any) => {
    if (isRolling || throwsLeft <= 0) return;

    const local = getLocalPos(e);
    const clampedX = Math.max(60, Math.min(260, local.x));
    setBallX(clampedX);
    setPosition(clampedX, BALL_START_Y);
    startPosRef.current = { x: clampedX, y: BALL_START_Y };
  };

  const handlePointerMove = (e: any) => {
    if (isRolling) return;

    const current = getLocalPos(e);

    if (!startPosRef.current) {
      const clampedX = Math.max(60, Math.min(260, current.x));
      setBallX(clampedX);
      setPosition(clampedX, BALL_START_Y);
    } else {
      setAimLine({
        x: current.x,
        y: current.y,
      });
    }
  };

  const handlePointerUp = (e: any) => {
    if (!startPosRef.current || isRolling) return;

    const end = getLocalPos(e);

    const dx = end.x - ballX;
    const dy = end.y - BALL_START_Y;
    const dist = Math.hypot(dx, dy);

    if (dist < 5) {
      startPosRef.current = null;
      setAimLine(null);
      return;
    }

    let angle = Math.atan2(dy, dx);
    angle = clampToCone(angle);

    const power = Math.min(dist, 120);
    const vx = Math.cos(angle) * power * 15;
    const vy = Math.sin(angle) * power * 15;

    launch(vx, vy, ballX, BALL_START_Y);
    rollStartTimeRef.current = Date.now();

    // Don't decrement throws yet -- wait to see if ball clears the ramp
    setThrowPending(true);
    setIsRolling(true);
    setAimLine(null);
    startPosRef.current = null;
  };

  // Track when ball clears the ramp to actually consume the throw
  useEffect(() => {
    if (throwPending && didClearRamp) {
      setThrowsLeft((v) => v - 1);
      setThrowPending(false);
    }
  }, [throwPending, didClearRamp]);

  useEffect(() => {
    if (!isRolling) return;

    let animationFrame: number;
    let isFirstFrame = true;

    const rollStartTime = Date.now();

    const checkCollision = () => {
      // Ball rolled back down the lane without clearing the ramp
      if (!didClearRamp && position.y >= GUTTER_Y && !isFirstFrame) {
        stop();
        setIsRolling(false);
        setThrowPending(false);
        setPosition(ballX, BALL_START_Y);
        // Ball comes back -- no throw lost
        return;
      }

      // Safety timeout: if rolling for more than 4 seconds, reset to avoid getting stuck
      if (Date.now() - rollStartTimeRef.current > 4000) {
        stop();
        setIsRolling(false);
        setThrowPending(false);
        setPosition(ballX, BALL_START_Y);
        addLog('Lane Roller: Roll timed out.');
        setPopup({
          x: ZONE_CX,
          y: 290,
          text: '0',
        });
        setTimeout(() => {
          setPopup(null);
        }, 700);
        return;
      }

      // If the ball has cleared the ramp and rolled back down to the bottom of the scoring zone (near y = 307)
      if (didClearRamp && position.y >= 307 && z === 0) {
        stop();
        setIsRolling(false);
        setPosition(ballX, BALL_START_Y);
        addLog('Lane Roller: Gutter ball - 0 points.');
        setPopup({
          x: ZONE_CX,
          y: 290,
          text: '0',
        });
        setTimeout(() => {
          setPopup(null);
        }, 700);
        return;
      }

      // Only check holes when ball is on the surface (or landing) and has cleared the ramp
      // 50 and 100 holes are elevated: they can only be entered if the ball is descending from the air (z > 0 and velocity/vz is negative, or we are landing).
      // If we are rolling on the ground (z === 0), we bounce off the 50 and 100 holes like solid barriers.
      let hitHole = undefined;

      if (didClearRamp) {
        // Find if we hit any hole
        const touchingHole = HOLES.find((hole) => {
          const dist = Math.hypot(position.x - hole.x, position.y - hole.y);
          return dist < hole.r;
        });

        if (touchingHole) {
          const isElevated = touchingHole.points === 50 || touchingHole.points === 100;
          if (isElevated) {
            // Must be landing from above: Z must be between 5 and 10
            if (z >= 5 && z <= 10) {
              hitHole = touchingHole;
            }
          } else {
            // Non-elevated holes (20, 30) can be entered from the ground (z === 0)
            if (z < 10) {
              hitHole = touchingHole;
            }
          }
        }
      }

      if (hitHole) {
        stop();
        setIsRolling(false);
        setPosition(ballX, BALL_START_Y);
        setScore((s) => s + hitHole.points);
        setActiveHole(hitHole.id);

        addLog(`Lane Roller: Scored ${hitHole.points} points.`);

        setPopup({
          x: hitHole.x,
          y: hitHole.y,
          text: `+${hitHole.points}`,
        });

        setTimeout(() => {
          setPopup(null);
          setActiveHole(null);
        }, 700);

        return;
      }

      const outOfBounds =
        position.y > BOARD_HEIGHT + 20 ||
        position.x < -20 ||
        position.x > BOARD_WIDTH + 20;

      // Gutter -- ball has cleared ramp but missed all holes and rolled back down
      const inGutter = didClearRamp && position.y >= RAMP_Y && z === 0 && !isFirstFrame;

      if (outOfBounds || inGutter) {
        stop();
        setIsRolling(false);
        setPosition(ballX, BALL_START_Y);
        addLog('Lane Roller: Gutter ball - 0 points.');

        setPopup({
          x: ZONE_CX,
          y: 290,
          text: '0',
        });
        setTimeout(() => {
          setPopup(null);
        }, 700);

        return;
      }

      isFirstFrame = false;
      animationFrame = requestAnimationFrame(checkCollision);
    };

    animationFrame = requestAnimationFrame(checkCollision);

    return () => cancelAnimationFrame(animationFrame);
  }, [isRolling, position, stop, addLog, ballX, setPosition, z, velocity, didClearRamp]);

  useEffect(() => {
    if (!isRolling && throwsLeft === 0 && !gameOver && !throwPending) {
      const tickets = score === 900 ? 50 : Math.floor(score / 50);
      setTicketsWon(tickets);
      setGameOver(true);
      if (tickets > 0) {
        inv.modifyItem('festival_ticket', tickets, false);
        addLog(`Lane Roller: Finished with ${score} points and earned ${tickets} Festival Tickets!`);
      } else {
        addLog(`Lane Roller: Finished with ${score} points.`);
      }
    }
  }, [isRolling, throwsLeft, score, inv, addLog, gameOver, throwPending]);

  const powerMeter = useMemo(() => {
    if (!aimLine) return 0;

    return Math.min(
      100,
      Math.hypot(
        aimLine.x - ballX,
        aimLine.y - BALL_START_Y
      )
    );
  }, [aimLine, ballX]);

  const clampedAim = useMemo(() => {
    if (!aimLine) return null;
    const dx = aimLine.x - ballX;
    const dy = aimLine.y - BALL_START_Y;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) return null;
    let angle = Math.atan2(dy, dx);
    const halfCone = AIM_CONE_RAD / 2;
    const center = -Math.PI / 2;
    let diff = angle - center;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    if (Math.abs(diff) > halfCone) {
      angle = center + Math.sign(diff) * halfCone;
    }
    const len = Math.min(dist, 200);
    return {
      x: ballX + Math.cos(angle) * len,
      y: BALL_START_Y + Math.sin(angle) * len,
    };
  }, [aimLine, ballX]);



  return (
    <div className="skeeball-shell">
      <div className="skeeball-layout">
        <div className="skeeball-side-panel">
          <h2>Lane Roller</h2>

          <div className="skeeball-hud">
            <div>
              <span>Score</span>
              <strong>{score}</strong>
            </div>

            <div className="ball-loader-container">
              <span>Balls</span>
              <div className="ball-rack" style={{ position: 'relative' }}>
                {/* Render 9 empty background slots */}
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="rack-ball empty"
                    style={{
                      position: 'absolute',
                      bottom: `${idx * 22 + 8}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                ))}

                {/* Render the active loaded balls sliding down */}
                {rackBalls.map((ballId, idx) => (
                  <div
                    key={ballId}
                    className="rack-ball loaded"
                    style={{
                      position: 'absolute',
                      bottom: `${idx * 22 + 8}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      transitionDelay: `${(throwsLeft - 1 - idx) * 0.04}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="skeeball-cabinet">
          <svg
            ref={boardRef}
            viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
            className="skeeball-board"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            <defs>
              <linearGradient id="woodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b3e1f" />
                <stop offset="100%" stopColor="#2d1606" />
              </linearGradient>

              <linearGradient id="laneGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a2512" />
                <stop offset="100%" stopColor="#1c0d03" />
              </linearGradient>

              <linearGradient id="rampGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#301509" />
                <stop offset="50%" stopColor="#6e3d17" />
                <stop offset="100%" stopColor="#d4a017" />
              </linearGradient>

              <linearGradient id="scoringBgGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#3a1c08" />
                <stop offset="100%" stopColor="#1a0d03" />
              </linearGradient>

              <radialGradient id="ballGradient">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>

              {/* Clip the scoring zone to the lane trapezoid */}
              <clipPath id="scoringClip">
                <polygon points="85,70 235,70 259,310 61,310" />
              </clipPath>
            </defs>

            {/* Board background */}
            <rect
              x="0"
              y="0"
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              fill="url(#woodGradient)"
              rx="18"
            />

            {/* Lane (rolling area below ramp) */}
            <polygon
              points="50,480 270,480 235,70 85,70"
              fill="url(#laneGradient)"
              stroke="#9a6a32"
              strokeWidth="6"
            />

            {/* === SCORING ZONE (behind the ramp) === */}
            <g clipPath="url(#scoringClip)">
              {/* Outermost ring - 0 point gutter zone */}
              <rect x="60" y="70" width="200" height="245" fill="#1c0d03" />

              {/* 20-point ring (outermost scoring ring) */}
              <ellipse cx={ZONE_CX} cy={ZONE_CY + 30} rx="115" ry="120" fill="#3d1a08" stroke="#d4a017" strokeWidth="2.5" />

              {/* 30-point ring */}
              <ellipse cx={ZONE_CX} cy={ZONE_CY + 20} rx="82" ry="88" fill="#2d1506" stroke="#d4a017" strokeWidth="2.5" />

              {/* 50-point ring (center) */}
              <ellipse cx={ZONE_CX} cy={ZONE_CY + 5} rx="45" ry="50" fill="#3a1510" stroke="#d4a017" strokeWidth="2.5" />

              {/* Zone point labels */}
              <text x="160" y="300" textAnchor="middle" fill="#9a6a32" fontSize="11" fontWeight="bold" opacity="0.6">0</text>
            </g>

            {/* Scoring holes */}
            {HOLES.map((hole) => (
              <g
                key={hole.id}
                className={activeHole === hole.id ? 'hole-active' : ''}
              >
                {/* Outer ring */}
                <circle
                  cx={hole.x}
                  cy={hole.y}
                  r={hole.r + 8}
                  fill="#0a0503"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
                {/* Inner color */}
                <circle
                  cx={hole.x}
                  cy={hole.y}
                  r={hole.r}
                  fill={hole.color}
                  opacity="0.85"
                />
                {/* Hole darkness (the actual hole) */}
                <circle
                  cx={hole.x}
                  cy={hole.y}
                  r={hole.r - 5}
                  fill="#050200"
                  opacity="0.7"
                />
                {/* Score label */}
                <text
                  x={hole.x}
                  y={hole.y + 4}
                  textAnchor="middle"
                  className="hole-score"
                >
                  {hole.points}
                </text>
              </g>
            ))}

            {/* Divider line between scoring zone and ramp top */}
            <line x1="61" y1="310" x2="259" y2="310" stroke="#d4a017" strokeWidth="2" opacity="0.6" />

            {/* Visual jump ramp */}
            <polygon
              points="61,350 259,350 259,310 61,310"
              fill="url(#rampGradient)"
              stroke="#fbbf24"
              strokeWidth="3"
            />

            {/* Ramp highlight line at top edge */}
            <line x1="63" y1="312" x2="257" y2="312" stroke="#ffe885" strokeWidth="1.5" opacity="0.5" />

            {/* Lane edge highlight (right side) */}
            <line x1="238" y1="72" x2="275" y2="480" stroke="#d4a017" strokeWidth="5" />

            {/* Score popup */}
            {popup && (
              <text
                x={popup.x}
                y={popup.y - 28}
                textAnchor="middle"
                className="score-popup"
              >
                {popup.text}
              </text>
            )}



            {/* Aim line */}
            {clampedAim && (
              <line
                x1={ballX}
                y1={BALL_START_Y}
                x2={clampedAim.x}
                y2={clampedAim.y}
                stroke="#facc15"
                strokeDasharray="6 4"
                strokeWidth="3"
              />
            )}

            {/* Ball shadow */}
            <ellipse
              cx={position.x}
              cy={position.y + 8 + z * 0.45}
              rx={Math.max(2, 10 - z * 0.12)}
              ry={Math.max(0.8, 4 - z * 0.05)}
              fill="rgba(10, 5, 2, 0.85)"
              stroke="rgba(212, 160, 23, 0.25)"
              strokeWidth="1.5"
              opacity={Math.max(0.2, 0.85 - z * 0.01)}
            />

            {/* Ball */}
            <circle
              ref={ballRef}
              cx={position.x}
              cy={position.y}
              r="10"
              fill="url(#ballGradient)"
              stroke="#fff7cc"
              strokeWidth="2"
            />
          </svg>

          <div className="power-meter-shell">
            <div
              className="power-meter-fill"
              style={{ width: `${powerMeter}%` }}
            />
          </div>

          {gameOver && (
            <div className="skeeball-gameover-overlay">
              <div className="gameover-card">
                <span className="gameover-title">Game Over</span>

                <div className="gameover-stats">
                  <div className="stat-row">
                    <span>Score:</span>
                    <strong>{score}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Tickets Won:</span>
                    <strong style={{ color: '#fbbf24' }}>{ticketsWon}</strong>
                  </div>
                </div>

                {score === 900 && (
                  <div className="perfect-bonus">
                    PERFECT BONUS
                  </div>
                )}

                <Button onClick={() => setActiveFestivalMinigame?.(null)} className="skeeball-btn">
                  Exit
                </Button>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default SkeeballMinigame;
