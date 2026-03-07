
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Linkedin, Github, Send, AtSign } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 font-medium">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>

                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Touch</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                         <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
                         <div className="space-y-6 text-lg">
                            <a href="mailto:shahad.plus@gmail.com" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Mail size={24} className="text-indigo-400" />
                                </div>
                                <span>shahad.plus@gmail.com</span>
                            </a>
                             <a href="https://www.linkedin.com/in/shahad-uddin/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Linkedin size={24} className="text-indigo-400" />
                                </div>
                                <span>linkedin.com/in/shahad-uddin</span>
                            </a>
                            <a href="https://github.com/shahad-plus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Github size={24} className="text-indigo-400" />
                                </div>
                                <span>github.com/shahad-plus</span>
                            </a>
                         </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-8">Send a Message</h2>
                        <form action="#" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-mono text-slate-400 mb-2">Full Name</label>
                                <input type="text" name="name" id="name" required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-mono text-slate-400 mb-2">Email Address</label>
                                <input type="email" name="email" id="email" required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-mono text-slate-400 mb-2">Message</label>
                                <textarea name="message" id="message" rows={5} required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-105">
                                    Send Message
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                 <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Available for collaborations</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
