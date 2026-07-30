
import React from 'react';
import { ArrowDown, FileText, Send } from 'lucide-react';

const Hero: React.FC = () => {
    const getAnimationDelay = (index: number) => ({ animationDelay: `${index * 150}ms` });

    return (
        <section id="home" className="relative overflow-hidden px-4 py-8 sm:px-6 md:px-8 md:py-12">
            <div className="relative mx-auto min-h-[78vh] overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
                <div className="absolute inset-0">
                    <img
                        src="/shahad_theme.png"
                        alt="Shahad Uddin"
                        className="h-full w-full object-cover object-[center_18%] sm:object-center"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.18),rgba(2,6,23,0.68)_65%),linear-gradient(to_bottom,rgba(2,6,23,0.28),rgba(2,6,23,0.82))]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70 [mask-image:linear-gradient(to_bottom,transparent,rgba(2,6,23,0.92),transparent)]" />
                </div>

                <div className="absolute left-4 top-4 text-4xl font-semibold text-slate-200/15 sm:left-6 sm:top-6 sm:text-6xl">∑</div>
                <div className="absolute bottom-6 right-4 text-4xl font-semibold text-slate-200/15 sm:right-6 sm:bottom-8 sm:text-6xl">∫</div>
                <div className="absolute right-5 top-1/3 text-2xl font-semibold text-slate-200/12 sm:right-10 sm:text-4xl">∂</div>

                <div className="relative z-10 flex min-h-[78vh] items-end sm:items-center">
                    <div className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-16">
                        <div className="max-w-3xl text-center sm:text-left">
                            <div style={getAnimationDelay(0)} className="animate-fadeInUp opacity-0">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-200 backdrop-blur-sm sm:text-xs sm:tracking-[0.36em]">
                                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
                                    Mathematics Student • Developer • Researcher
                                </div>
                            </div>

                            <h1
                                style={getAnimationDelay(1)}
                                className="animate-fadeInUp text-5xl font-black tracking-tight text-white opacity-0 drop-shadow-[0_8px_25px_rgba(2,6,23,0.75)] sm:text-6xl md:text-7xl lg:text-8xl"
                            >
                                <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                                    Shahad Uddin
                                </span>
                            </h1>

                            <p
                                style={getAnimationDelay(2)}
                                className="mx-auto mt-5 max-w-2xl animate-fadeInUp text-base leading-7 text-slate-200/85 opacity-0 drop-shadow-[0_2px_18px_rgba(2,6,23,0.7)] sm:mx-0 sm:text-lg sm:leading-8 lg:text-xl"
                            >
                                I build thoughtful web experiences and explore the space where
                                <span className="mx-1 font-semibold text-cyan-200">numerical analysis</span>
                                meets modern software.
                            </p>

                            <div
                                style={getAnimationDelay(3)}
                                className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 animate-fadeInUp opacity-0 sm:flex-row sm:justify-start"
                            >
                                <a
                                    href="#projects"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500/90 px-7 py-3.5 font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400 sm:w-auto"
                                >
                                    <FileText size={18} />
                                    View My Work
                                </a>

                                <a
                                    href="#contact"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-slate-950/35 px-7 py-3.5 font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/40 hover:bg-slate-950/50 hover:text-white sm:w-auto"
                                >
                                    <Send size={18} />
                                    Get In Touch
                                </a>
                            </div>

                            <div style={getAnimationDelay(4)} className="mt-7 flex flex-wrap items-center justify-center gap-3 animate-fadeInUp opacity-0 sm:justify-start">
                                <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-sm text-slate-200/80 backdrop-blur-sm">Numerical Methods</span>
                                <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-sm text-slate-200/80 backdrop-blur-sm">Web Applications</span>
                                <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-sm text-slate-200/80 backdrop-blur-sm">Research</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 animate-bounce-slow text-slate-200/55 sm:bottom-6">
                        <a href="#about" aria-label="Scroll to about section">
                            <ArrowDown size={22} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
