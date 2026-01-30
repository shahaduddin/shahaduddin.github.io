
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Monitor, Calculator, FlaskConical, Activity, Sparkles, Binary } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    tech: string[];
    icon: React.ReactNode;
    banner?: string;
    github?: string;
    live?: string;
    imageColor: string;
}

const projects: Project[] = [
    {
        title: "PyNum Analysis Studio",
        description: "An advanced Numerical Analysis workspace featuring real-time algorithm visualization, matrix computations, and an AI-powered math tutor for deep mathematical exploration.",
        tech: ["React", "TypeScript", "Recharts", "Gemini AI"],
        icon: <Activity className="w-8 h-8" />,
        banner: "./PyNum/pynum_social_banner.png",
        imageColor: "from-emerald-600/20 to-teal-600/20",
        github: "https://github.com/shahaduddin/PyNum",
        live: "./PyNum"
    },
    {
        title: "Complex Visualization Engine",
        description: "A high-performance interactive tool for visualizing complex Fourier Series and Taylor expansions. Built to bridge the gap between abstract calculus and visual intuition.",
        tech: ["Three.js", "C++ (WASM)", "LaTeX", "React"],
        icon: <Calculator className="w-8 h-8" />,
        imageColor: "from-blue-600/20 to-indigo-600/20",
        github: "https://github.com/shahaduddin"
    },
    {
        title: "Scientific Data Pipeline",
        description: "A specialized utility for SUST students to process and plot large datasets from Fortran-generated output files into interactive SVG-based dashboards.",
        tech: ["Fortran", "D3.js", "Node.js", "Shell"],
        icon: <FlaskConical className="w-8 h-8" />,
        imageColor: "from-purple-600/20 to-blue-600/20",
        github: "https://github.com/shahaduddin"
    }
];

const SlideshowSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section id="projects" className="py-32 px-4 bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-0 right-10 text-indigo-500/5 font-mono text-9xl select-none rotate-12">{"{}"}</div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase tracking-[0.2em]">
                        <Binary size={12} />
                        <span>Featured Deployments</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Projects</span>
                    </h2>
                </div>

                <div 
                    className="relative group"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Main Slide Container */}
                    <div className="relative h-[650px] md:h-[500px] overflow-hidden rounded-[2.5rem] border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col md:flex-row p-8 md:p-14 gap-10 ${
                                    index === currentIndex 
                                    ? "opacity-100 translate-x-0 scale-100" 
                                    : index < currentIndex 
                                        ? "opacity-0 -translate-x-full scale-95" 
                                        : "opacity-0 translate-x-full scale-95"
                                }`}
                            >
                                {/* Visual Part */}
                                <div className={`flex-1 rounded-[2rem] bg-gradient-to-br ${project.imageColor} border border-white/5 flex items-center justify-center relative overflow-hidden group/img shadow-2xl shadow-black/50`}>
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"></div>
                                    
                                    {project.banner ? (
                                        <img 
                                            src={project.banner} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-white transform group-hover/img:scale-110 transition-transform duration-1000 drop-shadow-2xl">
                                            {React.isValidElement(project.icon) && React.cloneElement(project.icon as React.ReactElement<any>, { size: 120, strokeWidth: 1 })}
                                        </div>
                                    )}

                                    {/* Abstract Grid Overlay */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                                    
                                    {/* Project Number Badge */}
                                    <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center justify-center font-mono text-sm text-white font-bold">
                                        0{index + 1}
                                    </div>
                                </div>

                                {/* Content Part */}
                                <div className="flex-1 flex flex-col justify-center space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 text-indigo-400 font-mono text-[10px] tracking-[0.3em] uppercase bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                                            <Sparkles size={12} />
                                            Case Study
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">{project.title}</h3>
                                    </div>
                                    
                                    <p className="text-slate-400 text-lg leading-relaxed font-light">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t) => (
                                            <span key={t} className="px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider group-hover:border-indigo-500/30 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 pt-6">
                                        {project.live && (
                                            <a 
                                                href={project.live} 
                                                className="flex items-center gap-3 text-slate-950 bg-white hover:bg-indigo-500 hover:text-white px-8 py-4 rounded-2xl transition-all duration-500 font-bold text-base shadow-xl shadow-white/5 group/demo"
                                            >
                                                Launch App <ExternalLink size={20} className="group-hover/demo:rotate-12 transition-transform" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a 
                                                href={project.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex items-center gap-3 text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white px-8 py-4 rounded-2xl transition-all duration-500 font-bold text-base border border-slate-700/50"
                                            >
                                                <Github size={20} /> Repository
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-indigo-600 hover:border-indigo-500 z-20 flex items-center justify-center shadow-2xl"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-indigo-600 hover:border-indigo-500 z-20 flex items-center justify-center shadow-2xl"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={28} />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-4 mt-12">
                        {projects.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${
                                    index === currentIndex ? "w-16 bg-indigo-500" : "w-4 bg-slate-800 hover:bg-slate-700"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SlideshowSection;
