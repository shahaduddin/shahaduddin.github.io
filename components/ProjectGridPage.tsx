
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Github, ExternalLink, Cpu, Database, Palette } from 'lucide-react';

const projects = [
    {
        title: "PyNum Studio",
        description: "A comprehensive web-based platform for numerical analysis education, featuring an AI-powered chatbot (Gemini), an interactive code editor, and a dynamic graphing tool. Designed to provide a seamless learning experience for students and enthusiasts of numerical methods.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Gemini AI", "Vite"],
        liveLink: "https://shahaduddin.com/pynum",
        repoLink: "https://github.com/shahaduddin/",
        svgComponent: (
            <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="-50 -50 100 100">
                    <g fill="none" strokeWidth="3">
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20">
                             <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20" transform="rotate(60)">
                             <animateTransform attributeName="transform" type="rotate" from="60" to="420" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20" transform="rotate(120)">
                             <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <circle stroke="rgb(59 130 246 / 1)" r="8" fill="rgb(59 130 246 / 0.3)"/>
                    </g>
                </svg>
            </div>
        ),
        category: "AI & Education",
        tech: {
            frontend: ["React", "TypeScript", "Vite"],
            backend: ["Gemini API (via Google AI Studio)"],
            styling: ["Tailwind CSS", "Framer Motion"]
        }
    },
    {
        title: "OrthoBudget",
        description: "A budget management app for orthodontic residents, featuring a dashboard for tracking expenses, setting savings goals, and visualizing financial progress. Built with Next.js and deployed on Vercel.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        liveLink: "https://orthobudget.vercel.app",
        repoLink: "https://github.com/shahaduddin/",
        svgComponent: (
             <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="0 0 100 100">
                    <path d="M 20 80 L 80 80 L 50 20 Z" fill="none" stroke="rgb(34 197 94 / 0.8)" strokeWidth="4">
                         <animateTransform attributeName="transform" type="rotate" from="0 50 60" to="360 50 60" dur="10s" repeatCount="indefinite"/>
                    </path>
                    <text x="50" y="70" text-anchor="middle" font-size="20" fill="rgb(34 197 94 / 0.9)">$</text>
                </svg>
            </div>
        ),
        category: "Web Application",
        tech: {
            frontend: ["Next.js", "TypeScript"],
            backend: [],
            styling: ["Tailwind CSS"]
        }
    },
    {
        title: "ZincCalcPro",
        description: "An advanced calculator for students, featuring a sleek interface and precise calculations. Deployed on Vercel.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        liveLink: "https://zinccalcpro.vercel.app",
        repoLink: "https://github.com/shahaduddin/",
        svgComponent: (
             <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="0 0 100 100">
                    <rect x="20" y="20" width="60" height="70" rx="10" fill="none" stroke="rgb(236 72 153 / 0.8)" strokeWidth="4"/>
                    <path d="M30 40H70 M30 55H70 M30 70H70" stroke="rgb(236 72 153 / 0.8)" strokeWidth="3"/>
                </svg>
            </div>
        ),
        category: "Medical Tool",
        tech: {
            frontend: ["Next.js", "TypeScript"],
            backend: [],
            styling: ["Tailwind CSS"]
        }
    },
    {
        title: "Modern Portfolio",
        description: "A sleek, professional portfolio website built with React and TypeScript, showcasing my projects, skills, and experience. It features a modern design with smooth animations and a responsive layout, optimized for all devices.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        liveLink: "https://shahaduddin.com",
        repoLink: "https://github.com/shahaduddin/shahaduddin.github.io",
        svgComponent: (
            <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="60%" height="60%" viewBox="0 0 100 100">
                    <g fill="none" stroke="rgb(168 85 247 / 0.8)" strokeWidth="4">
                        <path d="M 20 30 L 5 50 L 20 70">
                             <animate attributeName="stroke" values="rgb(168 85 247 / 0.8);rgb(99 102 241 / 0.8);rgb(168 85 247 / 0.8)" dur="4s" repeatCount="indefinite" />
                        </path>
                        <path d="M 80 30 L 95 50 L 80 70">
                            <animate attributeName="stroke" values="rgb(168 85 247 / 0.8);rgb(99 102 241 / 0.8);rgb(168 85 247 / 0.8)" dur="4s" repeatCount="indefinite" />
                        </path>
                        <path d="M 60 20 L 40 80">
                             <animate attributeName="d" values="M 60 20 L 40 80; M 70 20 L 30 80; M 60 20 L 40 80" dur="4s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        ),
        category: "Web Development",
        tech: {
            frontend: ["React", "TypeScript"],
            backend: [],
            styling: ["Tailwind CSS", "Framer Motion"]
        }
    },
];

const ProjectGridPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 font-medium">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Project Showcase</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
                        A curated collection of my work, from AI-powered applications to modern web experiences.
                    </p>
                </div>

                <div className="flex flex-col gap-16">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">
                           <div className="relative h-full w-full p-8 order-2 md:order-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>
                                    <span className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-mono mb-6">{project.category}</span>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-8">{project.description}</p>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-3"><Cpu size={18} className="text-blue-400"/> Frontend</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.frontend.map(t => <span key={t} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-mono">{t}</span>)}
                                            </div>
                                        </div>
                                        {project.tech.backend.length > 0 && <div>
                                            <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-3"><Database size={18} className="text-blue-400"/> Backend</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.backend.map(t => <span key={t} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-mono">{t}</span>)}
                                            </div>
                                        </div>}
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-slate-200 mb-3"><Palette size={18} className="text-blue-400"/> Styling</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.styling.map(t => <span key={t} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-mono">{t}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 mt-10">
                                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold shadow-lg shadow-blue-500/20"> <ExternalLink size={18} /> Live Demo</a>}
                                    {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors font-semibold"> <Github size={18} /> Repository</a>}
                                </div>
                           </div>
                           <div className="relative w-full h-80 md:h-full order-1 md:order-2 overflow-hidden bg-slate-800">
                                {project.svgComponent}
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectGridPage;
