import React, { useEffect, useRef, useState } from 'react';

interface FPSCounterProps {
  className?: string;
}

const FPSCounter: React.FC<FPSCounterProps> = ({ className }) => {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());
  const maxRefreshRate = useRef(60);

  useEffect(() => {
    let animationFrameId: number;
    const tick = () => {
      frames.current += 1;
      const now = performance.now();
      const delta = now - lastTime.current;
      if (delta >= 1000) {
        const calculatedFps = Math.round((frames.current * 1000) / delta);
        setFps(calculatedFps);
        if (calculatedFps > maxRefreshRate.current) {
          maxRefreshRate.current = calculatedFps;
        }
        frames.current = 0;
        lastTime.current = now;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const pct = maxRefreshRate.current > 0 ? (fps / maxRefreshRate.current) * 100 : 0;
  
  let colorClass = 'text-green-500';
  if (pct <= 25) {
    colorClass = 'text-red-500';
  } else if (pct <= 80) {
    colorClass = 'text-yellow-500';
  }

  return (
    <span className={`${className || ''} text-white`}>
      FPS: <span className={colorClass}>{fps}</span>
    </span>
  );
};

export default FPSCounter;
