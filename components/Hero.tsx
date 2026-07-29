
import React from 'react';
import { ArrowDown, FileText, Send } from 'lucide-react';

const Hero: React.FC = () => {
    const getAnimationDelay = (index: number) => ({ animationDelay: `${index * 150}ms` });

    return (
        <section id="home" className="relative overflow-hidden px-4 py-8 sm:px-6 md:px-8 md:py-12">
            <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/70 px-6 py-16 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl sm:px-8 sm:py-20 md:px-12 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.16),transparent_35%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,transparent,rgba(2,6,23,0.95),transparent)]" />

                <div className="absolute left-6 top-6 text-5xl font-semibold text-slate-700/40 sm:text-6xl">∑</div>
                <div className="absolute bottom-8 right-8 text-5xl font-semibold text-slate-700/40 sm:text-6xl">∫</div>
                <div className="absolute right-10 top-1/3 text-3xl font-semibold text-slate-700/35 sm:text-4xl">∂</div>

                <div className="relative z-10 w-full text-center">
                    <div style={getAnimationDelay(0)} className="animate-fadeInUp opacity-0">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
                            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                            Software Developer • Researcher • Problem Solver
                        </div>
                    </div>

                    <h1
                        style={getAnimationDelay(1)}
                        className="animate-fadeInUp text-5xl font-black tracking-tight text-white opacity-0 sm:text-6xl md:text-7xl"
                    >
                        <span className="bg-gradient-to-r from-slate-100 via-blue-200 to-indigo-400 bg-clip-text text-transparent">
                            Shahad Uddin
                        </span>
                    </h1>

                    <p
                        style={getAnimationDelay(2)}
                        className="mx-auto mt-6 max-w-2xl animate-fadeInUp text-lg leading-8 text-slate-400 opacity-0 sm:text-xl"
                    >
                        I build thoughtful web experiences and explore the space where
                        <span className="mx-1 font-medium text-slate-200"> numerical analysis</span>
                        meets modern software.
                    </p>

                    <div
                        style={getAnimationDelay(3)}
                        className="mt-10 flex flex-col flex-wrap items-center justify-center gap-4 animate-fadeInUp opacity-0 sm:flex-row"
                    >
                        <a
                            href="#projects"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 sm:w-auto"
                        >
                            <FileText size={18} />
                            View My Work
                        </a>

                        <a
                            href="#contact"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-7 py-3.5 font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:text-white sm:w-auto"
                        >
                            <Send size={18} />
                            Get In Touch
                        </a>
                    </div>

                    <div style={getAnimationDelay(4)} className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fadeInUp opacity-0">
                        <span className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-400">Numerical Methods</span>
                        <span className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-400">Web Applications</span>
                        <span className="rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1.5 text-sm text-slate-400">Research</span>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow text-slate-500">
                    <a href="#about" aria-label="Scroll to about section">
                        <ArrowDown size={22} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
