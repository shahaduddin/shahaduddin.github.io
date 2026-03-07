
import React from 'react';
import { ArrowDown, FileText, Send } from 'lucide-react';

const Hero: React.FC = () => {
    // Helper function to apply animation delays
    const getAnimationDelay = (index: number) => ({ animationDelay: `${index * 150}ms` });

    return (
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-slate-950">
            {/* Animated Gradient Blobs */}
            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-4000 pointer-events-none"></div>

            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-slate-800/[0.1] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,rgb(2,6,23),transparent)] pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
                <div style={getAnimationDelay(0)} className="animate-fadeInUp opacity-0">
                    <div className="inline-block px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-4">
                        <span className="text-blue-300 font-mono text-sm tracking-wider">Software Developer & Researcher</span>
                    </div>
                </div>

                <h1 
                    style={getAnimationDelay(1)} 
                    className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white animate-fadeInUp opacity-0"
                >
                    Shahad Uddin
                </h1>
                
                <p 
                    style={getAnimationDelay(2)} 
                    className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed animate-fadeInUp opacity-0"
                >
                    I build dynamic, user-friendly web applications and explore the intersection of 
                    <span className="text-slate-200 font-medium"> numerical analysis and modern software</span>.
                </p>

                <div 
                    style={getAnimationDelay(3)} 
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full animate-fadeInUp opacity-0"
                >
                    <a 
                        href="#projects" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40"
                    >
                        <FileText size={20} />
                        View My Work
                    </a>

                    <a 
                        href="#contact" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 font-medium transition-all duration-300 hover:border-blue-400 hover:text-white"
                    >
                        <Send size={18} />
                        Get In Touch
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow text-slate-500">
                <a href="#about" aria-label="Scroll to about section">
                    <ArrowDown size={24} />
                </a>
            </div>
        </section>
    );
};

export default Hero;
