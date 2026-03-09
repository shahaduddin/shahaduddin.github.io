
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Linkedin, Github, Send, Loader, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const ContactPage: React.FC = () => {
    const [state, handleSubmit] = useForm("xreybbdb");

    if (state.succeeded) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center text-center">
                <div className="max-w-md">
                    <CheckCircle className="mx-auto w-16 h-16 text-emerald-500 mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
                    <p className="text-slate-400 text-lg mb-8">Thanks for reaching out! I'll get back to you as soon as possible.</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-semibold shadow-lg shadow-indigo-500/20">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

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
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 h-full">
                         <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
                         <div className="space-y-6 text-lg">
                            <a href="mailto:hello@shahaduddin.com" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Mail size={24} className="text-indigo-400" />
                                </div>
                                <span>hello@shahaduddin.com</span>
                            </a>
                             <a href="https://www.linkedin.com/in/shahaduddin/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Linkedin size={24} className="text-indigo-400" />
                                </div>
                                <span>linkedin.com/in/shahaduddin</span>
                            </a>
                            <a href="https://github.com/shahaduddin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Github size={24} className="text-indigo-400" />
                                </div>
                                <span>github.com/shahaduddin</span>
                            </a>
                         </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-8">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-mono text-slate-400 mb-2">Full Name</label>
                                <input id="name" type="text" name="name" required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-mono text-slate-400 mb-2">Email Address</label>
                                <input id="email" type="email" name="email" required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-mono text-slate-400 mb-2">Message</label>
                                <textarea id="message" name="message" rows={5} required className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"></textarea>
                                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                            <div>
                                <button type="submit" disabled={state.submitting} className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-400 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-105">
                                    {state.submitting ? <><Loader className="animate-spin" size={20} /> Sending...</> : <><Send size={20} /> Send Message</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
