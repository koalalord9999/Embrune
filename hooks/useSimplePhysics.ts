import { useRef, useEffect, useState } from 'react';

export function useSimplePhysics({
  initialX = 0,
  initialY = 0,
  gravity = 900,
  damping = 0.985,
  mode = 'skeeball',
}: {
  initialX?: number;
  initialY?: number;
  gravity?: number;
  damping?: number;
  mode?: 'skeeball' | 'dart';
} = {}) {
  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [z, setZ] = useState(0);
  const [didClearRamp, setDidClearRamp] = useState(false);

  const rafRef = useRef<number | null>(null);

  const posRef = useRef({
    x: initialX,
    y: initialY,
  });

  const velocityRef = useRef({
    x: 0,
    y: 0,
  });

  const zRef = useRef(0);
  const vzRef = useRef(0);
  const clearedRampRef = useRef(false);

  const lastTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const step = (now: number) => {
    const dt =
      lastTimeRef.current === 0
        ? 0.016
        : (now - lastTimeRef.current) / 1000;

    lastTimeRef.current = now;

    if (mode === 'skeeball') {
      velocityRef.current.y += gravity * dt;
    }

    velocityRef.current.x *= damping;
    velocityRef.current.y *= damping;

    posRef.current.x += velocityRef.current.x * dt;
    posRef.current.y += velocityRef.current.y * dt;

    if (mode === 'skeeball') {
      // Bumper collision logic (applies at all heights)
      const y = posRef.current.y;
      const t = Math.max(0, Math.min(1, (480 - y) / 410));
      const xLeft = 50 + 35 * t;
      const xRight = 270 - 35 * t;
      const radius = 10;

      if (posRef.current.x - radius < xLeft) {
        posRef.current.x = xLeft + radius;
        velocityRef.current.x = -velocityRef.current.x * 0.6;
      } else if (posRef.current.x + radius > xRight) {
        posRef.current.x = xRight - radius;
        velocityRef.current.x = -velocityRef.current.x * 0.6;
      }

      // Elevated hole collision barriers (only if rolling on the board surface)
      if (zRef.current === 0) {
        const barriers = [
          { x: 100, y: 105, r: 16 },
          { x: 220, y: 105, r: 16 },
          { x: 160, y: 115, r: 18 },
        ];

        for (const barrier of barriers) {
          const dx = posRef.current.x - barrier.x;
          const dy = posRef.current.y - barrier.y;
          const dist = Math.hypot(dx, dy);
          const minDist = barrier.r + radius;
          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dist > 0 ? dx / dist : 1;
            const ny = dist > 0 ? dy / dist : 0;

            posRef.current.x += nx * overlap;
            posRef.current.y += ny * overlap;

            const dot = velocityRef.current.x * nx + velocityRef.current.y * ny;
            if (dot < 0) {
              velocityRef.current.x = (velocityRef.current.x - 2 * dot * nx) * 0.6;
              velocityRef.current.y = (velocityRef.current.y - 2 * dot * ny) * 0.6;
            }
          }
        }
      }

      // Back wall (top boundary of scoring area) bounce
      const wallY = 70;
      const ballRadius = 10;
      if (clearedRampRef.current && posRef.current.y - ballRadius < wallY) {
        posRef.current.y = wallY + ballRadius;
        velocityRef.current.y = Math.abs(velocityRef.current.y) * 0.5;
      }

      // Jump ramp at y <= 350
      if (posRef.current.y <= 350 && zRef.current === 0 && velocityRef.current.y < -300) {
        vzRef.current = -velocityRef.current.y * 0.45;
        zRef.current = 1;
        clearedRampRef.current = true;
        setDidClearRamp(true);
      }

      if (zRef.current > 0) {
        vzRef.current -= 1200 * dt;
        zRef.current += vzRef.current * dt;
        if (zRef.current > 65) {
          zRef.current = 65;
        }
        if (zRef.current <= 0) {
          zRef.current = 0;
          vzRef.current = 0;
        }
      }

      // Keep the ball in the scoring zone once it has cleared the ramp (only when on the ground)
      if (clearedRampRef.current && zRef.current === 0) {
        if (posRef.current.y > 308) {
          posRef.current.y = 308;
          velocityRef.current.y = 0;
        }
        if (posRef.current.y < 70) {
          posRef.current.y = 70;
          velocityRef.current.y = Math.abs(velocityRef.current.y) * 0.4;
        }
      }
    } else {
      // mode === 'dart'
      if (zRef.current > 0 || vzRef.current !== 0) {
        vzRef.current -= gravity * dt;
        zRef.current += vzRef.current * dt;
        if (zRef.current <= 0) {
          zRef.current = 0;
          vzRef.current = 0;
          // Stop all movement on landing
          velocityRef.current.x = 0;
          velocityRef.current.y = 0;
        }
      }
    }

    setPosition({
      x: posRef.current.x,
      y: posRef.current.y,
    });
    setZ(zRef.current);

    rafRef.current = requestAnimationFrame(step);
  };

  const launch = (
    velocityX: number,
    velocityY: number,
    startX: number = posRef.current.x,
    startY: number = posRef.current.y,
    velocityZ: number = 0,
  ) => {
    posRef.current = {
      x: startX,
      y: startY,
    };

    velocityRef.current = {
      x: velocityX,
      y: velocityY,
    };

    zRef.current = velocityZ > 0 ? 1 : 0;
    vzRef.current = velocityZ;
    clearedRampRef.current = false;

    setPosition(posRef.current);
    setZ(zRef.current);
    setDidClearRamp(false);

    lastTimeRef.current = 0;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(step);
  };

  const stop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = null;

    velocityRef.current = {
      x: 0,
      y: 0,
    };

    zRef.current = 0;
    vzRef.current = 0;
    clearedRampRef.current = false;
    setZ(0);
    setDidClearRamp(false);

    lastTimeRef.current = 0;
  };

  const setBallPosition = (x: number, y: number) => {
    posRef.current = { x, y };
    zRef.current = 0;
    vzRef.current = 0;
    clearedRampRef.current = false;
    setPosition({ x, y });
    setZ(0);
    setDidClearRamp(false);
  };

  return {
    position,
    z,
    didClearRamp,
    velocity: velocityRef.current,
    launch,
    stop,
    setPosition: setBallPosition,
  };
}


