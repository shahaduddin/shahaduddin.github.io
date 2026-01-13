import React from 'react';
import { FileText, Download } from 'lucide-react';

const ResumeSection: React.FC = () => {
    return (
        <section id="resume" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
             {/* Background elements */}
             <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

             <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">Curriculum Vitae</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden border border-slate-800 hover:border-indigo-500/30 transition-all duration-500 group">
                    {/* Decorative Blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        
                        {/* Visual Icon / Illustration */}
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-44 bg-slate-900/80 rounded-lg border border-slate-700 flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                                <div className="absolute inset-3 border-2 border-dashed border-slate-800 rounded flex flex-col gap-2 p-2">
                                     <div className="w-1/2 h-2 bg-slate-700 rounded-full mb-2"></div>
                                     <div className="w-full h-1 bg-slate-800 rounded-full"></div>
                                     <div className="w-full h-1 bg-slate-800 rounded-full"></div>
                                     <div className="w-3/4 h-1 bg-slate-800 rounded-full"></div>
                                     <div className="mt-auto w-full h-16 bg-slate-800/30 rounded"></div>
                                </div>
                                <FileText size={48} className="text-indigo-500 relative z-10 drop-shadow-lg" />
                            </div>
                            {/* Glow effect behind the document */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl -z-10 rounded-full transform scale-90"></div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-white">
                                Ready to see the full picture?
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Grab a copy of my resume to view my complete academic history, detailed project case studies, and professional experience.
                            </p>
                            
                            <div className="pt-2">
                                <a 
                                    href="/Shahad_Uddin_Resume.pdf" 
                                    download
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 group/btn w-full md:w-auto"
                                >
                                    <Download size={20} className="group-hover/btn:animate-bounce" />
                                    Download PDF Resume
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
             </div>
        </section>
    );
};

export default ResumeSection;