import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Calculator, Cpu, GraduationCap, MapPin, Sparkles, TrendingUp } from 'lucide-react';

const certificateImages = [
    '/numo/certificates/15th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/16th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/15th_numo_final_round_participation_certificate.jpg',
    '/numo/certificates/16th_numo_final_round_participation_certificate.jpg',
];

const academicHighlights = [
    { label: 'Current level', value: '4th Year' },
    { label: 'Current semester', value: '1st Semester' },
    { label: 'Overall result', value: 'CGPA 3.82 / 4.00' },
    { label: 'Credits completed', value: '112.5' },
];

const AcademicSection: React.FC = () => {
    return (
        <section id="academics" className="px-4 py-12 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-math opacity-40 pointer-events-none"></div>
            <div className="absolute top-1/4 -left-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_25%,rgba(79,70,229,0.12),transparent_45%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest">
                        <Award size={14} className="text-indigo-500" />
                        <span>Academic Background</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-slate-800/70 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_30%)] pointer-events-none"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                                    <Cpu size={12} />
                                    <span>Current academic state</span>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                        Mathematics <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">&amp; Computation</span>
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                        I am currently in my 4th year, 1st semester of a B.Sc. in Mathematics at Shahjalal University of Science and Technology, building a strong foundation in numerical thinking and computational problem solving.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {academicHighlights.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                                            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500 font-mono mb-2">{item.label}</div>
                                            <div className="text-slate-100 font-semibold text-base md:text-lg">{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-5">
                                    <div className="flex items-center gap-3 text-emerald-300 mb-3">
                                        <TrendingUp size={18} />
                                        <span className="font-semibold uppercase tracking-[0.2em] text-xs">Overall result</span>
                                    </div>
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <div className="text-4xl font-black text-white leading-none">3.82</div>
                                            <div className="text-slate-400 text-sm mt-2">CGPA across 6 completed semesters</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono">Credits completed</div>
                                            <div className="text-2xl font-bold text-cyan-300">112.5</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                                        <div className="text-xl font-bold text-white">Available</div>
                                        <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">For opportunities</div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                                        <div className="text-xl font-bold text-white">SUST</div>
                                        <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">Sylhet, Bangladesh</div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4">
                                        <div className="text-xl font-bold text-white">Math + Code</div>
                                        <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">Focus area</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-5">
                                <div className="flex items-center gap-3 mb-3 text-indigo-300">
                                    <BookOpen size={18} />
                                    <span className="font-semibold uppercase tracking-[0.2em] text-xs">Academic focus</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Numerical analysis, scientific computing, and algorithm design shape the way I study, build, and think.
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-5">
                                <div className="flex items-center gap-3 mb-3 text-cyan-300">
                                    <Sparkles size={18} />
                                    <span className="font-semibold uppercase tracking-[0.2em] text-xs">First impression</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Strong academic consistency, competitive performance, and a visible blend of mathematics with software thinking.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="glass-card rounded-[2rem] p-6 md:p-8 border border-slate-800/70">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
                                        <Award size={12} className="text-amber-400" />
                                        <span>Certificate Showcase</span>
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Mathematics olympiad highlights</h4>
                                    <p className="text-slate-400 mt-2 max-w-2xl">
                                        A curated glimpse of the achievements that reflect steady participation and competition experience.
                                    </p>
                                </div>
                                <div className="text-sm text-slate-500 font-mono uppercase tracking-[0.25em]">NUMO Certificates</div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {certificateImages.map((src, index) => (
                                    <div key={src} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 aspect-[4/3]">
                                        <img
                                            src={src}
                                            alt={`Olympiad certificate ${index + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                                        <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-200 backdrop-blur-sm">
                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                            Certificate {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Profile</div>
                                <div className="text-slate-100 font-semibold text-lg">Shahad Uddin</div>
                                <div className="text-slate-400 text-sm mt-2">B.Sc. Mathematics, SUST</div>
                            </div>
                            <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Status</div>
                                <div className="text-slate-100 font-semibold text-lg">Currently active</div>
                                <div className="text-slate-400 text-sm mt-2">Focused on completion and growth</div>
                            </div>
                            <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Interests</div>
                                <div className="text-slate-100 font-semibold text-lg">Tech &amp; Math</div>
                                <div className="text-slate-400 text-sm mt-2">Problem solving and scientific computing</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link to="/academics" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-105">
                        View Detailed Performance
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AcademicSection;
