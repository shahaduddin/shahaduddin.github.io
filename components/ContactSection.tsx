
import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, ArrowRight, Mail, Linkedin, Github } from 'lucide-react';

const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="py-24 px-4 bg-slate-950/70 relative overflow-hidden rounded-3xl border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-slate-950 to-slate-950"></div>
             <div className="absolute -top-16 -right-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-8">
                    <AtSign size={14} className="text-cyan-500" />
                    <span>Contact</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                    Let's Build Something <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Amazing Together</span>
                </h2>
                
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mb-12">
                    Have a project in mind, a question, or just want to say hi? I'd love to hear from you. 
                    Click the button below to go to the contact page.
                </p>

                <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-105">
                    Get in Touch
                    <ArrowRight size={20} />
                </Link>
                
                <div className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-slate-800/50">
                    <a href="mailto:shahad.plus@gmail.com" className="text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Mail size={24} />
                    </a>
                     <a href="https://www.linkedin.com/in/shahad-uddin/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Linkedin size={24} />
                    </a>
                    <a href="https://github.com/shahad-plus" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors duration-300">
                        <Github size={24} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
