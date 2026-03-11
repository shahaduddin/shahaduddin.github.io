
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Linkedin, Github, Send, Loader, CheckCircle, Globe } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900/50 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center font-sans">
            <div className="w-full max-w-6xl mx-auto mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-indigo-300 transition-colors duration-300 font-medium">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
            </div>

            <div className="w-full max-w-6xl bg-black bg-opacity-30 backdrop-blur-lg border border-blue-800/50 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5">
                    
                    {/* Left Side: Gravatar-style Profile */}
                    <div className="md:col-span-2 bg-black bg-opacity-20 p-8 md:p-10 flex flex-col items-center text-center border-r border-blue-800/30">
                        <img 
                            src="/shahad-uddin-math-programmer-sust.png" 
                            alt="Shahad Uddin" 
                            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500/50 shadow-lg mb-5"
                        />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">Shahad Uddin</h1>
                        <p className="text-blue-300/80 text-lg mt-1">@TheShahadUddin</p>
                        <p className="text-slate-300 mt-4 text-md max-w-xs">
                            Mathematician | Programmer
                        </p>
                        <p className="text-slate-400 text-sm mt-2">Sylhet, Bangladesh</p>
                        
                        <div className="mt-8 w-full space-y-4 text-left">
                            <a href="https://shahaduddin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-300 transition-colors duration-300 p-3 rounded-lg hover:bg-white/5">
                                <Globe size={20} className="text-cyan-400" />
                                <span>shahaduddin.com</span>
                            </a>
                            <a href="mailto:hello@shahaduddin.com" className="flex items-center gap-4 text-slate-300 hover:text-indigo-300 transition-colors duration-300 p-3 rounded-lg hover:bg-white/5">
                                <Mail size={20} className="text-cyan-400" />
                                <span>hello@shahaduddin.com</span>
                            </a>
                             <a href="https://www.linkedin.com/in/shahaduddin/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-300 transition-colors duration-300 p-3 rounded-lg hover:bg-white/5">
                                <Linkedin size={20} className="text-cyan-400" />
                                <span>/in/shahaduddin</span>
                            </a>
                            <a href="https://github.com/shahaduddin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-indigo-300 transition-colors duration-300 p-3 rounded-lg hover:bg-white/5">
                                <Github size={20} className="text-cyan-400" />
                                <span>/shahaduddin</span>
                            </a>
                         </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="md:col-span-3 p-8 md:p-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Get In Touch</h2>
                        <p className="text-slate-400 mb-8">I'm always open for a chat. Let's make something great together!</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-mono text-slate-400 mb-2">Full Name</label>
                                <input id="name" type="text" name="name" required className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-mono text-slate-400 mb-2">Email Address</label>
                                <input id="email" type="email" name="email" required className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-mono text-slate-400 mb-2">Message</label>
                                <textarea id="message" name="message" rows={5} required className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"></textarea>
                                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
                            </div>
                            <div>
                                <button type="submit" disabled={state.submitting} className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-50 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-105">
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
