import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Particle Network Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const particles: { x: number; y: number; vx: number; vy: number }[] = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
        const connectionDistance = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw particles
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off walls
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Indigo-500
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
            
            {/* Background Gradient Spotlights */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
                <div className="inline-block px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm mb-4 animate-fade-in-up">
                    <span className="text-indigo-300 font-mono text-sm tracking-wider">PORTFOLIO v2.0</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-2">
                    <span className="block mb-2">Shahad Uddin</span>
                </h1>
                
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto"></div>

                <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                    Crafting logic into digital experiences. 
                    <br className="hidden md:block"/>
                    <span className="text-slate-200 font-medium">Web Developer</span> & <span className="text-slate-200 font-medium">Mathematician</span>.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 w-full max-w-xl mx-auto">
                    <a 
                        href="#academic" 
                        className="w-full md:w-auto px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                    >
                        View Background
                    </a>

                    <a 
                        href="#contact" 
                        className="w-full md:w-auto px-8 py-4 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-indigo-400 hover:text-indigo-400 transition-all backdrop-blur-sm flex items-center justify-center"
                    >
                        Contact Me
                    </a>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500">
                <ArrowDown size={24} />
            </div>
        </header>
    );
};

export default Hero;