
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Github, ExternalLink, Cpu, Database, Palette } from 'lucide-react';

const projects = [
    {
        title: "PyNum Studio",
        description: "A comprehensive web-based platform for numerical analysis education, featuring an AI-powered chatbot (Gemini), an interactive code editor, and a dynamic graphing tool. Designed to provide a seamless learning experience for students and enthusiasts of numerical methods.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Gemini AI", "Vite"],
        liveLink: "https://pynum-studio.vercel.app/",
        repoLink: "https://github.com/shahad-plus/pynum-studio",
        imageUrl: "./images/projects/pynum-studio-cover.png",
        category: "AI & Education",
        tech: {
            frontend: ["React", "TypeScript", "Vite"],
            backend: ["Gemini API (via Google AI Studio)"],
            styling: ["Tailwind CSS", "Framer Motion"]
        }
    },
    {
        title: "Medi AI",
        description: "An intelligent medical diagnosis assistant that leverages AI to analyze symptoms and provide potential conditions. It features a user-friendly interface for symptom input and displays results with probabilities and detailed information about each condition.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Gemini AI"],
        liveLink: "https://medi-ai-indol.vercel.app/",
        repoLink: "https://github.com/shahad-plus/medi-ai",
        imageUrl: "./images/projects/medi-ai-cover.png",
        category: "AI & Health",
        tech: {
            frontend: ["React", "TypeScript"],
            backend: ["Gemini API"],
            styling: ["Tailwind CSS"]
        }
    },
    {
        title: "Modern Portfolio",
        description: "A sleek, professional portfolio website built with React and TypeScript, showcasing my projects, skills, and experience. It features a modern design with smooth animations and a responsive layout, optimized for all devices.",
        tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        liveLink: "https://shahaduddin.com",
        repoLink: "https://github.com/shahad-plus/portfolio-v3",
        imageUrl: "./images/projects/portfolio-v3-cover.png",
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
                                <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover " />
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectGridPage;
