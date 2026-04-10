
import React, { useEffect, useRef } from 'react';
import { SkillName } from '../../types';
import {  SKILL_ICONS, getIconUrl  } from '../../constants';

interface LevelUpAnimationProps {
    skill: SkillName;
    level: number;
}

const FIREWORK_COLORS = ['#FFD700', '#FF4500', '#FF69B4', '#ADFF2F', '#1E90FF', '#9400D3', '#00FFFF'];

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    maxLife: number;
    size: number;
    gravity: number;

    constructor(x: number, y: number, color: string, isMaxLevel: boolean) {
        this.x = x;
        this.y = y;
        this.color = color;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isMaxLevel ? 6 : 4) + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.life = 0;
        this.maxLife = Math.random() * 60 + (isMaxLevel ? 100 : 60);
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.05;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life++;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const opacity = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ skill, level }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMaxLevel = level === 99;
    const animationDuration = isMaxLevel ? '8s' : '4s';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to screen size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles: Particle[] = [];
        let animationId: number;
        let frameCount = 0;

        const createExplosion = (x: number, y: number) => {
            const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
            const count = isMaxLevel ? 100 : 50;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y, color, isMaxLevel));
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Randomly trigger new explosions
            const explosionChance = isMaxLevel ? 0.08 : 0.04;
            if (Math.random() < explosionChance && frameCount < (isMaxLevel ? 400 : 180)) {
                createExplosion(
                    Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
                    Math.random() * canvas.height * 0.6 + canvas.height * 0.1
                );
            }

            particles = particles.filter(p => p.life < p.maxLife);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            frameCount++;
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isMaxLevel]);

    return (
        <div className="level-up-container" style={{ animationDuration }}>
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ zIndex: 1 }}
            />
            <div className={`level-up-centerpiece ${isMaxLevel ? 'max-level' : ''}`} style={{ zIndex: 10 }}>
                <div className="level-up-omega">Ω</div>
                <img src={getIconUrl(SKILL_ICONS[skill])} alt={skill} className="level-up-skill-icon" />
                <span className="level-up-text">{level}</span>
            </div>
        </div>
    );
};

export default LevelUpAnimation;