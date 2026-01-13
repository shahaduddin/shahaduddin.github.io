import React from 'react';
import { GraduationCap, BookOpen, MapPin } from 'lucide-react';

const AcademicSection: React.FC = () => {
    return (
        <section id="academic" className="py-24 px-4 relative bg-slate-950 overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-math opacity-40 pointer-events-none"></div>
            
            {/* Ambient Glows */}
            <div className="absolute top-1/4 -left-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">Academic Background</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
                    
                    {/* Decorative math symbols background */}
                    <div className="absolute -right-8 -top-8 text-[12rem] text-slate-800/10 font-serif select-none pointer-events-none rotate-12 group-hover:text-indigo-500/10 transition-colors duration-700">∫</div>
                    <div className="absolute -left-12 -bottom-12 text-[12rem] text-slate-800/10 font-serif select-none pointer-events-none -rotate-12 group-hover:text-indigo-500/10 transition-colors duration-700">∑</div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
                        <div className="relative flex-shrink-0">
                            <div className="bg-indigo-500/10 p-8 rounded-2xl border border-indigo-500/20 text-indigo-400 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                                <GraduationCap size={56} strokeWidth={1.2} />
                            </div>
                            <div className="absolute -inset-2 bg-indigo-500/20 blur-xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Shahjalal University of Science and Technology</h3>
                                <div className="flex flex-wrap gap-5 text-slate-400 text-base">
                                    <span className="flex items-center gap-2">
                                        <MapPin size={18} className="text-indigo-500" />
                                        Sylhet, Bangladesh
                                    </span>
                                    <span className="flex items-center gap-2 border-l border-slate-800 pl-5">
                                        <BookOpen size={18} className="text-indigo-500" />
                                        B.Sc. in Mathematics
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50 font-mono text-sm md:text-base text-slate-300 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/50">
                                    <span className="text-slate-500">Academic Status</span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-green-400 font-semibold uppercase tracking-wider text-xs">Active Student</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <span className="block text-slate-500 text-[10px] uppercase tracking-tighter">Current Level</span>
                                        <span className="text-white font-bold text-lg">3rd Year</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-slate-500 text-[10px] uppercase tracking-tighter">Current Semester</span>
                                        <span className="text-white font-bold text-lg">2nd Semester</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AcademicSection;