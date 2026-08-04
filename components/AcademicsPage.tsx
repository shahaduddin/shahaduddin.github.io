
import React from 'react';
import { Calendar, TrendingUp, GraduationCap, Library, School } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './Header';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import MathSymbolsBackground from './MathSymbolsBackground';
import './MathSymbolsBackground.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const certificateImages = [
    '/numo/certificates/15th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/16th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/15th_numo_final_round_participation_certificate.jpg',
    '/numo/certificates/16th_numo_final_round_participation_certificate.jpg',
    '/numo/certificates/14th_numo_sylhet_region_participation_certificate.jpg',
    '/numo/certificates/15th_numo_sylhet_region_participation_certificate.jpg',
    '/numo/certificates/16th_numo_sylhet_region_participation_certificate.jpg',
];

const academicData = [
    { semester: 'Year 1, Semester 1', credits: 20.5, sgpa: 3.81, cgpa: 3.81 },
    { semester: 'Year 1, Semester 2', credits: 20.5, sgpa: 3.79, cgpa: 3.80 },
    { semester: 'Year 2, Semester 1', credits: 18.0, sgpa: 3.90, cgpa: 3.83 },
    { semester: 'Year 2, Semester 2', credits: 19.0, sgpa: 3.80, cgpa: 3.82 },
    { semester: 'Year 3, Semester 1', credits: 17.0, sgpa: 3.91, cgpa: 3.84 },
    { semester: 'Year 3, Semester 2', credits: 17.5, sgpa: 3.95, cgpa: 3.86 }
];

const totalCredits = academicData.reduce((sum, item) => sum + item.credits, 0);
const overallCgpa = academicData.reduce((sum, item) => sum + item.credits * item.cgpa, 0) / totalCredits;
const averageSgpa = academicData.reduce((sum, item) => sum + item.sgpa, 0) / academicData.length;
const latestSemester = academicData[academicData.length - 1];

const educationHistory = [
    {
        institution: 'Shahjalal University of Science and Technology (SUST)',
        location: 'Sylhet, Bangladesh | B.Sc. in Mathematics (2021–Present)',
        description: `At SUST, my academic focus has sharpened on the intersection of mathematics and computation. Specializing in numerical analysis, I've discovered a passion for applying abstract mathematical principles to create tangible, efficient software. This is where my journey with "Math + Code" truly comes alive, driving my projects in scientific computing and algorithm optimization.`,
        icon: GraduationCap,
    },
    {
        institution: 'Murari Chand College',
        location: 'Sylhet, Bangladesh | Higher Secondary (2019–2021)',
        description: `My time at MC College was a gateway to the fascinating world of higher mathematics. It was here that complex theories began to feel like solvable puzzles, sparking an ambition to not just understand them but to apply them in practical, computational ways.`,
        icon: Library,
    },
    {
        institution: 'Jobed Ali Secondary School',
        location: 'Jakigonj, Sylhet | Secondary (2014–2019)',
        description: `This is where I built my foundational problem-solving skills. The disciplined approach to mathematics taught me how to think logically and systematically—a framework I rely on every day when I'm debugging code or structuring an algorithm.`,
        icon: School,
    },
    {
        institution: 'Kusum Koli Kindergarten',
        location: 'Jakigonj, Sylhet | Primary Education',
        description: `My educational journey started here, with an early fascination for numbers and patterns. It was in these formative years that the seeds of a lifelong passion for logic and order were planted.`,
        icon: School,
    }
];

const AcademicsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
            <Header />
            <MathSymbolsBackground />
            <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-indigo-900/30 to-transparent blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-cyan-900/20 to-transparent blur-[150px] pointer-events-none"></div>
            
            <div className="relative z-10 px-4 pb-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16 md:mb-20 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-6">
                            <GraduationCap size={14} className="text-indigo-400" />
                            <span>Academic overview</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-indigo-400">Academic Journey</span>
                        </h1>
                        <p className="text-slate-400 max-w-3xl mx-auto text-lg font-light mt-6">
                            A summary-first view of my academic state, results, certificates, and progression through mathematics and computation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-24">
                        <div className="xl:col-span-4 space-y-6">
                            <div className="glass-card rounded-[2rem] p-8 border border-slate-800/70 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.14),transparent_30%)] pointer-events-none"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-widest">
                                        <TrendingUp size={12} />
                                        <span>Overall result</span>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black text-white leading-none">{overallCgpa.toFixed(2)}</div>
                                        <div className="text-slate-400 mt-3">Weighted CGPA across {academicData.length} completed semesters</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500 font-mono mb-2">Total credits</div>
                                            <div className="text-slate-100 font-semibold text-lg">{totalCredits.toFixed(1)}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500 font-mono mb-2">Average SGPA</div>
                                            <div className="text-slate-100 font-semibold text-lg">{averageSgpa.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                        <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500 font-mono mb-2">Current academic state</div>
                                        <div className="text-slate-100 font-semibold text-lg">4th Year, 1st Semester</div>
                                        <div className="text-slate-400 text-sm mt-2">B.Sc. in Mathematics at Shahjalal University of Science and Technology</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                                <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Latest completed semester</div>
                                    <div className="text-slate-100 font-semibold text-lg">{latestSemester.semester}</div>
                                    <div className="text-slate-400 text-sm mt-2">SGPA {latestSemester.sgpa.toFixed(2)} | CGPA {latestSemester.cgpa.toFixed(2)}</div>
                                </div>
                                <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Academic tone</div>
                                    <div className="text-slate-100 font-semibold text-lg">Consistent and improving</div>
                                    <div className="text-slate-400 text-sm mt-2">A steady result line with strong recent semester performance.</div>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-8 space-y-8">
                            <div className="glass-card rounded-[2rem] p-5 md:p-8 border border-slate-800/70">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
                                            <Award size={12} className="text-amber-400" />
                                            <span>Certificate showcase</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Olympiad certificates</h2>
                                        <p className="text-slate-400 mt-2 max-w-2xl">
                                            A fast visual reference to the achievements that add context to the detailed semester record.
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-500 font-mono uppercase tracking-[0.25em]">NUMO</div>
                                </div>

                                <Swiper
                                    loop={true}
                                    centeredSlides={true}
                                    autoplay={{ delay: 3200, disableOnInteraction: false }}
                                    pagination={{ clickable: true, dynamicBullets: true, renderBullet: (index, className) => `<span class="${className} bg-slate-400/50"></span>` }}
                                    navigation={true}
                                    modules={[Autoplay, Pagination, Navigation]}
                                    className="w-full rounded-2xl"
                                    breakpoints={{
                                        320: { slidesPerView: 1, spaceBetween: 10 },
                                        768: { slidesPerView: 1.4, spaceBetween: 16 },
                                        1024: { slidesPerView: 2.2, spaceBetween: 24 },
                                    }}
                                >
                                    {certificateImages.map((src, index) => (
                                        <SwiperSlide key={src} className="flex items-center justify-center p-2 sm:p-4">
                                            <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
                                                <img src={src} alt={`Certificate ${index + 1}`} className="w-full max-h-[360px] object-contain bg-slate-950 transition-transform duration-300 hover:scale-105" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">University</div>
                                    <div className="text-slate-100 font-semibold text-lg">SUST</div>
                                    <div className="text-slate-400 text-sm mt-2">Shahjalal University of Science and Technology</div>
                                </div>
                                <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Department</div>
                                    <div className="text-slate-100 font-semibold text-lg">Mathematics</div>
                                    <div className="text-slate-400 text-sm mt-2">Theory, analysis, and computation</div>
                                </div>
                                <div className="rounded-[1.5rem] bg-slate-900/60 border border-slate-800 p-5">
                                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-2">Standing</div>
                                    <div className="text-slate-100 font-semibold text-lg">Active student</div>
                                    <div className="text-slate-400 text-sm mt-2">Pursuing a B.Sc. in Mathematics</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-24">
                        <h2 className="text-4xl font-bold text-white text-center mb-4">Semester performance</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">A chronological view of each completed semester with credit load, SGPA, and CGPA movement.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {academicData.map((data, index) => (
                                <div key={data.semester} className="glass-card rounded-[1.75rem] p-6 border border-slate-800/70 group hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono uppercase tracking-widest mb-3">
                                                <Calendar size={12} className="text-teal-400" />
                                                <span>Semester {index + 1}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{data.semester}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-teal-400/15 border border-teal-400/20 flex items-center justify-center text-teal-300">
                                            <TrendingUp size={20} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 text-center font-mono">
                                        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-2">Credits</p>
                                            <p className="text-lg font-semibold text-white">{data.credits.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-2">SGPA</p>
                                            <p className="text-lg font-semibold text-green-400">{data.sgpa.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-2">CGPA</p>
                                            <p className="text-lg font-semibold text-teal-300">{data.cgpa.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-24">
                        <h2 className="text-4xl font-bold text-white text-center mb-16">My educational path</h2>
                        <div className="max-w-4xl mx-auto space-y-6">
                            {educationHistory.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="grid grid-cols-[64px_1fr] gap-4 sm:gap-6 items-start group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-14 h-14 bg-slate-900/80 border border-slate-700 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:scale-105">
                                                <Icon size={24} className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />
                                            </div>
                                            {index < educationHistory.length - 1 && (
                                                <div className="w-px flex-1 bg-slate-700/50 my-2 group-hover:bg-indigo-500/50 transition-all duration-300"></div>
                                            )}
                                        </div>
                                        <div className={`pb-4 ${index < educationHistory.length - 1 ? 'border-b border-slate-800/70' : ''}`}>
                                            <div className="rounded-[1.5rem] bg-slate-900/40 p-6 border border-transparent group-hover:border-slate-700/60 transition-all duration-300">
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">{item.institution}</h3>
                                                <p className="text-sm sm:text-base text-indigo-400/80 mb-3 font-mono">{item.location}</p>
                                                <p className="text-slate-300/80 leading-relaxed text-base sm:text-lg font-light">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicsPage;
