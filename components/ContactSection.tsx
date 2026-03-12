
import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, ArrowRight, Mail, Linkedin, Github } from 'lucide-react';

const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="mx-4 px-4 py-12 sm:py-32 bg-slate-950/70 relative overflow-hidden rounded-3xl border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-slate-950 to-slate-950"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-8">
                    <AtSign size={14} className="text-cyan-500 animate-pulse" />
                    <span>Let's Connect</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                    Ready to Start a <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">New Project?</span>
                </h2>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mb-12">
                    I'm currently available for freelance work and open to new opportunities. If you have a project you want to discuss, or if you just want to say hi, my inbox is always open.
                </p>

                <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 font-semibold text-lg shadow-2xl shadow-indigo-500/30 transform hover:scale-105">
                    Send Me a Message
                    <ArrowRight size={20} />
                </Link>
                
                <div className="flex items-center justify-center gap-8 mt-20 pt-10 border-t border-slate-800/50">
                    <a href="mailto:hello@shahaduddin.com" className="group flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Mail size={24} />
                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Email</span>
                    </a>
                     <a href="https://www.linkedin.com/in/shahaduddin/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Linkedin size={24} />
                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">LinkedIn</span>
                    </a>
                    <a href="https://github.com/shahaduddin" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Github size={24} />
                         <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">GitHub</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
