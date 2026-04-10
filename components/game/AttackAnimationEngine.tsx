import React, { useState, useEffect, useRef } from 'react';

type AttackType = 'stab' | 'slash' | 'crush' | 'ranged' | 'magic';
type AnimationSource = 'player' | 'monster';

interface Animation {
    id: number;
    type: AttackType;
    source: AnimationSource;
    options: {
        arrowType?: string | null;
        spellTier?: number;
        element?: string | null;
    };
}

interface AnimationProps {
    triggers: Animation[];
    playerRef: React.RefObject<HTMLDivElement>;
    monsterRef: React.RefObject<HTMLDivElement>;
    onAnimationComplete: (id: number) => void;
}

const Projectile: React.FC<{
    id: number,
    type: 'ranged' | 'magic',
    start: { x: number, y: number },
    end: { x: number, y: number },
    options: Animation['options'],
    onComplete: (id: number) => void,
    triggerShake: () => void
}> = ({ id, type, start, end, options, onComplete, triggerShake }) => {
    const [position, setPosition] = useState(start);
    const [impactPosition, setImpactPosition] = useState<{ x: number, y: number } | null>(null);
    const [isImpacted, setIsImpacted] = useState(false);
    const startTimeRef = useRef(Date.now());
    const duration = 400; // ms

    useEffect(() => {
        if (isImpacted) return;

        let animationFrameId: number;
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(1, elapsed / duration);

            const newX = start.x + (end.x - start.x) * progress;
            const newY = start.y + (end.y - start.y) * progress;

            setPosition({ x: newX, y: newY });

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setIsImpacted(true);
                setImpactPosition({ x: end.x, y: end.y });
                triggerShake();
                
                // Allow impact animation to play
                setTimeout(() => {
                    onComplete(id);
                }, 400);
            }
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [id, start, end, onComplete, isImpacted]);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const renderProjectile = () => {
        if (isImpacted && impactPosition) {
             const spellTier = options.spellTier ?? 1;
             const impactClass = spellTier >= 4 ? 'impact-massive' : (spellTier >= 3 ? 'impact-spiky' : '');
             if (!impactClass) return null;
             
             return (
                 <div className="magic-impact-splash" style={{ left: impactPosition.x, top: impactPosition.y, transform: 'translate(-50%, -50%)' }}>
                     <div className={impactClass} style={{ '--magic-color': `var(--element-${options.element || 'wind'})` } as any} />
                 </div>
             );
        }

        if (type === 'ranged') {
            const tipClass = options.arrowType ? `arrow-tip-${options.arrowType}` : 'arrow-tip-default';
            return (
                <div className="anim-ranged" style={{ transform: `rotate(${angle}deg)` }}>
                    <svg viewBox="0 0 100 100">
                        <polygon points="0,45 70,45 70,35 90,50 70,65 70,55 0,55" className="arrow-shaft" />
                        <polygon points="90,50 70,35 80,50 70,65" className={tipClass} />
                    </svg>
                </div>
            );
        }
        if (type === 'magic') {
            const spellTier = options.spellTier ?? 1;
            const elementClass = options.element ? `element-${options.element}` : 'element-wind';
            return (
                <div className={`anim-magic anim-magic-${spellTier} ${elementClass}`} style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}>
                    {spellTier === 2 && <div className="anim-magic-head-star" />}
                    {spellTier >= 4 && <div className="magic-ring magic-ring-1" />}
                    {spellTier >= 5 && <div className="magic-ring magic-ring-2" />}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="attack-animation" style={{ left: isImpacted ? 0 : position.x, top: isImpacted ? 0 : position.y }}>
            {renderProjectile()}
        </div>
    );
};

const AttackAnimationEngine: React.FC<AnimationProps> = ({ triggers, playerRef, monsterRef, onAnimationComplete }) => {
    const [animations, setAnimations] = useState<any[]>([]);
    const prevTriggersRef = useRef<Animation[]>([]);

    useEffect(() => {
        const newTriggers = triggers.filter(t => !prevTriggersRef.current.some(pt => pt.id === t.id));

        if (newTriggers.length > 0) {
            const containerRect = playerRef.current?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
            if (!containerRect) return;

            const newAnimations = newTriggers.map(trigger => {
                const sourceEl = trigger.source === 'player' ? playerRef.current : monsterRef.current;
                const targetEl = trigger.source === 'player' ? monsterRef.current : playerRef.current;
                if (!sourceEl || !targetEl) return null;

                const sourceRect = sourceEl.getBoundingClientRect();
                const targetRect = targetEl.getBoundingClientRect();
        
                const sourceCenter = {
                    x: sourceRect.left - containerRect.left + sourceRect.width / 2,
                    y: sourceRect.top - containerRect.top + sourceRect.height / 2,
                };
                const targetCenter = {
                    x: targetRect.left - containerRect.left + targetRect.width / 2,
                    y: targetRect.top - containerRect.top + targetRect.height / 2,
                };
                
                let startPos = { ...sourceCenter };
                let endPos = { ...targetCenter };

                // Add vertical offset to prevent overlapping melee/magic animations
                const verticalOffset = trigger.source === 'player' ? 12 : -12;
                startPos.y += verticalOffset;
                endPos.y += verticalOffset;

                if (trigger.type === 'ranged') {
                    const randomAngle = Math.random() * 2 * Math.PI;
                    const randomRadius = 40;
                    startPos.x += Math.cos(randomAngle) * randomRadius;
                    startPos.y += Math.sin(randomAngle) * randomRadius;
                } else if (trigger.type === 'stab' && trigger.source === 'monster') {
                    // Start from the LEFT edge of the monster frame reaching toward the player
                    startPos.x = sourceRect.left - containerRect.left;
                }

                return { ...trigger, start: startPos, end: endPos };
            }).filter(Boolean);

            setAnimations(prev => [...prev, ...newAnimations]);
        }

        prevTriggersRef.current = triggers;
    }, [triggers, playerRef, monsterRef]);

    const triggerShake = (source: AnimationSource) => {
        const targetEl = source === 'player' ? monsterRef.current : playerRef.current;
        if (targetEl) {
            targetEl.classList.add('shake-target');
            setTimeout(() => {
                targetEl.classList.remove('shake-target');
            }, 300);
        }
    };

    const handleAnimationEnd = (id: number) => {
        setAnimations(prev => prev.filter(anim => anim.id !== id));
        onAnimationComplete(id);
    };

    const handleCrushImpact = (source: AnimationSource, id: number) => {
        triggerShake(source);
        handleAnimationEnd(id);
    };

    return (
        <div className="animation-container">
            {animations.map(anim => {
                const dx = anim.end.x - anim.start.x;
                const dy = anim.end.y - anim.start.y;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (anim.type === 'ranged' || anim.type === 'magic') {
                    return <Projectile key={anim.id} id={anim.id} type={anim.type} start={anim.start} end={anim.end} options={anim.options} onComplete={handleAnimationEnd} triggerShake={() => triggerShake(anim.source)} />;
                }

                return (
                    <div
                        key={anim.id}
                        className="attack-animation"
                        onAnimationEnd={() => anim.type === 'crush' ? handleCrushImpact(anim.source, anim.id) : handleAnimationEnd(anim.id)}
                        style={{
                            top: anim.type === 'stab' ? `${anim.start.y}px` : `${anim.end.y - 60}px`,
                            left: anim.type === 'stab' ? `${anim.start.x}px` : `${anim.end.x - 60}px`,
                            transform: anim.type === 'stab' ? `rotate(${angle}deg)` : 'none',
                        }}
                    >
                        {anim.type === 'stab' && <div className="anim-stab" style={{width: `${distance}px`, transform: dx < 0 ? 'scaleX(-1)' : 'none'}} />}
                        {anim.type === 'slash' && (
                            <div className="anim-slash">
                                <svg viewBox="0 0 100 100">
                                    <path d="M 10,90 Q 50,90 90,50" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" style={{filter: 'blur(2px)'}}>
                                        <animate attributeName="opacity" values="0.6;0" dur="0.5s" repeatCount="1" />
                                    </path>
                                    <path d="M 20,80 Q 50,80 80,50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round">
                                         <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="1" />
                                    </path>
                                </svg>
                            </div>
                        )}
                         {anim.type === 'crush' && (
                            <div className="anim-crush">
                               <div className="anim-crush-hammer" />
                               <div className="anim-crush-shockwave" />
                               <div className="anim-crush-shockwave-2" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AttackAnimationEngine;