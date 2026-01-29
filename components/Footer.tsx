
import React from 'react';
import { Github, Linkedin, Mail, Heart, Code2, Terminal, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        { label: "About", href: "#about" },
        { label: "Academic", href: "#academic" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Gallery", href: "#gallery" },
        { label: "Journal", href: "#blog" },
    ];

    return (
        <footer className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-10 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-soft-light"></div>
            
            {/* Ambient Glow */}
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-6">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <Terminal size={20} />
                            </div>
                            <span>Shahad Uddin</span>
                        </h3>
                        <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                            Blending abstract mathematics with rigorous software engineering to build the digital future.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                href="https://github.com/shahaduddin" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group"
                                aria-label="GitHub"
                            >
                                <Github size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a 
                                href="https://linkedin.com/in/shahaduddin" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a 
                                href="mailto:shahaduddin@protonmail.com" 
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group"
                                aria-label="Email"
                            >
                                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold mb-6 font-mono text-xs uppercase tracking-widest text-indigo-400">Directory</h4>
                        <ul className="space-y-3">
                            {links.map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                                        <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status / Info Column */}
                    <div className="md:col-span-4">
                        <h4 className="text-white font-bold mb-6 font-mono text-xs uppercase tracking-widest text-indigo-400">System Status</h4>
                        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Availability</span>
                                <span className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    OPEN
                                </span>
                            </div>
                            <div className="h-px bg-slate-800"></div>
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                                <span>Timezone</span>
                                <span>GMT+6 (Sylhet)</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                                <span>Response Time</span>
                                <span>&lt; 24 Hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="font-mono">
                        &copy; {currentYear} Shahad Uddin. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                        <span>Engineered with</span>
                        <Code2 size={12} className="text-indigo-500" />
                        <span>&</span>
                        <Heart size={12} className="text-rose-500" />
                        <span>using React</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
