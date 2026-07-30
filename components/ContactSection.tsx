
import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, ArrowRight, Mail, Linkedin, Github } from 'lucide-react';

const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="relative mx-4 overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/70 px-4 py-12 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(2,6,23,0.55)] sm:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.16),transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,transparent,rgba(2,6,23,0.95),transparent)]" />
            <div className="absolute left-6 top-6 text-4xl font-semibold text-slate-700/40 sm:text-5xl">∑</div>
            <div className="absolute bottom-8 right-8 text-4xl font-semibold text-slate-700/40 sm:text-5xl">∂</div>
            <div className="absolute right-10 top-1/3 text-2xl font-semibold text-slate-700/35 sm:text-3xl">∫</div>

            <div className="relative z-10 mx-auto max-w-4xl rounded-[1.75rem] border border-slate-800/80 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10 lg:p-12">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
                        <AtSign size={14} className="text-cyan-500" />
                        <span>Let's Connect</span>
                    </div>

                    <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Ready to start a{' '}
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            new collaboration?
                        </span>
                    </h2>

                    <p className="mb-10 max-w-2xl text-lg font-light leading-8 text-slate-400">
                        I’m available for freelance work, research conversations, and thoughtful product ideas. If you have a project in mind, a question, or just want to say hello, I’d love to hear from you.
                    </p>

                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.18)] transition-all duration-300 hover:scale-[1.02] hover:from-indigo-500 hover:to-cyan-500"
                    >
                        Send Me a Message
                        <ArrowRight size={20} />
                    </Link>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800/70 pt-8 sm:gap-4">
                        <a
                            href="mailto:hello@shahaduddin.com"
                            className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
                        >
                            <Mail size={18} className="text-cyan-400" />
                            <span className="text-sm">Email</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/shahaduddin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
                        >
                            <Linkedin size={18} className="text-cyan-400" />
                            <span className="text-sm">LinkedIn</span>
                        </a>
                        <a
                            href="https://github.com/shahaduddin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
                        >
                            <Github size={18} className="text-cyan-400" />
                            <span className="text-sm">GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
