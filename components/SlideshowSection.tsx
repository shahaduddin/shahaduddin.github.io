import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Monitor, Calculator, FlaskConical } from 'lucide-react';

interface Project {
    title: string;
    description: string;
    tech: string[];
    icon: React.ReactNode;
    github?: string;
    live?: string;
    imageColor: string;
}

const projects: Project[] = [
    {
        title: "Mathematical Visualization Engine",
        description: "A high-performance interactive tool for visualizing complex Fourier Series and Taylor expansions. Built to bridge the gap between abstract calculus and visual intuition.",
        tech: ["React", "Three.js", "C++ (WASM)", "LaTeX"],
        icon: <Calculator className="w-8 h-8" />,
        imageColor: "from-blue-600/20 to-indigo-600/20",
        github: "https://github.com/shahaduddin"
    },
    {
        title: "Personal Research Portfolio",
        description: "The very site you are viewing. A highly optimized, responsive personal brand experience featuring custom particle systems and intersection-based animations.",
        tech: ["TypeScript", "Tailwind CSS", "React", "ESM"],
        icon: <Monitor className="w-8 h-8" />,
        imageColor: "from-purple-600/20 to-blue-600/20",
        github: "https://github.com/shahaduddin"
    },
    {
        title: "Scientific Data Plotter",
        description: "A lightweight desktop utility for SUST mathematics students to quickly plot data points from Fortran-generated output files into clean SVG charts.",
        tech: ["Fortran", "Node.js", "D3.js", "Shell"],
        icon: <FlaskConical className="w-8 h-8" />,
        imageColor: "from-emerald-600/20 to-teal-600/20",
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
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section id="projects" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">Selected Projects</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div 
                    className="relative group"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Main Slide Container */}
                    <div className="relative h-[500px] md:h-[450px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row p-8 md:p-12 gap-8 ${
                                    index === currentIndex 
                                    ? "opacity-100 translate-x-0 scale-100" 
                                    : index < currentIndex 
                                        ? "opacity-0 -translate-x-full scale-95" 
                                        : "opacity-0 translate-x-full scale-95"
                                }`}
                            >
                                {/* Visual Part */}
                                <div className={`flex-1 rounded-2xl bg-gradient-to-br ${project.imageColor} border border-white/5 flex items-center justify-center relative overflow-hidden group/img shadow-2xl shadow-black/50`}>
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"></div>
                                    <div className="text-white transform group-hover/img:scale-125 transition-transform duration-700 drop-shadow-2xl">
                                        {project.icon}
                                    </div>
                                    {/* Abstract Grid Overlay */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                </div>

                                {/* Content Part */}
                                <div className="flex-1 flex flex-col justify-center space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-indigo-400 font-mono text-xs tracking-widest uppercase">Project 0{index + 1}</div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{project.title}</h3>
                                    </div>
                                    
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t) => (
                                            <span key={t} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl transition-all font-medium text-sm">
                                                <Github size={18} /> Code
                                            </a>
                                        )}
                                        {project.live && (
                                            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-all font-medium text-sm shadow-lg shadow-indigo-600/20">
                                                <ExternalLink size={18} /> Demo
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:border-indigo-500 z-20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:border-indigo-500 z-20"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-3 mt-8">
                        {projects.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${
                                    index === currentIndex ? "w-12 bg-indigo-500" : "w-3 bg-slate-800 hover:bg-slate-700"
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