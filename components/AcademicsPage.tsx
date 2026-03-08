
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, GraduationCap, Library, School } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const certificateImages = [
    '/numo/certificates/15th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/16th_numo_sylhet_region_achievement_certificate.jpg',
    '/numo/certificates/15th_numo_final_round_perticipation_certificate.jpg',
];

const academicData = [
    { semester: 'Year 1, Semester 1', credits: 20.5, sgpa: 3.81, cgpa: 3.81 },
    { semester: 'Year 1, Semester 2', credits: 20.5, sgpa: 3.79, cgpa: 3.80 },
    { semester: 'Year 2, Semester 1', credits: 18.0, sgpa: 3.90, cgpa: 3.83 },
    { semester: 'Year 2, Semester 2', credits: 19.0, sgpa: 3.80, cgpa: 3.82 },
    { semester: 'Year 3, Semester 1', credits: 17.0, sgpa: 3.91, cgpa: 3.84 }
];

const educationHistory = [
    {
        institution: 'Shahjalal University of Science and Technology (SUST)',
        location: 'Sylhet, Bangladesh | B.Sc. in Mathematics (2021–Present)',
        description: 'At SUST, my academic focus has sharpened on the intersection of mathematics and computation. Specializing in numerical analysis, I\'ve discovered a passion for applying abstract mathematical principles to create tangible, efficient software. This is where my journey with "Math + Code" truly comes alive, driving my projects in scientific computing and algorithm optimization.',
        icon: GraduationCap,
    },
    {
        institution: 'Murari Chand College',
        location: 'Sylhet, Bangladesh | Higher Secondary (2019–2021)',
        description: 'My time at MC College was a gateway to the fascinating world of higher mathematics. It was here that complex theories began to feel like solvable puzzles, sparking an ambition to not just understand them but to apply them in practical, computational ways.',
        icon: Library,
    },
    {
        institution: 'Jobed Ali Secondary School',
        location: 'Jakigonj, Sylhet | Secondary (2014–2019)',
        description: 'This is where I built my foundational problem-solving skills. The disciplined approach to mathematics taught me how to think logically and systematically—a framework I rely on every day when I\'m debugging code or structuring an algorithm.',
        icon: School,
    },
    {
        institution: 'Kusum Koli Kinder Garten School',
        location: 'Jakigonj, Sylhet | Primary Education',
        description: 'My educational journey started here, with an early fascination for numbers and patterns. It was in these formative years that the seeds of a lifelong passion for logic and order were planted.',
        icon: School,
    }
];

const AcademicsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Dynamic Backgrounds */}
            <div className="absolute inset-0 bg-math opacity-30 pointer-events-none"></div>
            <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-indigo-900/30 to-transparent blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-teal-900/20 to-transparent blur-[150px] pointer-events-none"></div>
            
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 font-medium">
                            <ArrowLeft size={20} />
                            Back to Home
                        </Link>
                    </div>

                    <div className="text-center mb-20 relative">
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">Academic Journey</span>
                        </h1>
                        <p className="text-slate-400 max-w-3xl mx-auto text-lg font-light mt-6">
                            A detailed chronicle of my educational path, academic performance, and key achievements from my earliest curiosity to my current focus in mathematics and computation.
                        </p>
                    </div>

                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-white text-center mb-12">Achievement Certificates</h2>
                        <div className="glass-card p-4 sm:p-6 rounded-2xl">
                            <Swiper
                                spaceBetween={30}
                                centeredSlides={true}
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                                pagination={{ clickable: true, dynamicBullets: true, renderBullet: (index, className) => `<span class="${className} bg-slate-400/50"></span>` }}
                                navigation={true}
                                modules={[Autoplay, Pagination, Navigation]}
                                className="w-full h-[400px] md:h-[500px] rounded-2xl"
                            >
                                {certificateImages.map((src, index) => (
                                    <SwiperSlide key={index} className="flex items-center justify-center p-4">
                                        <img src={src} alt={`Certificate ${index + 1}`} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-white text-center mb-16">Semester Performance</h2>
                        <div className="relative">
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700/50"></div>
                            {academicData.map((data, index) => (
                                <div key={index} className={`mb-12 flex md:justify-between items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="hidden md:block w-5/12"></div>
                                    <div className="hidden md:block z-10">
                                        <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                                            <Calendar size={16} className="text-slate-900" />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-5/12 group">
                                        <div className="glass-card rounded-2xl p-6 shadow-xl group-hover:border-teal-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-teal-500/10 group-hover:-translate-y-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="md:hidden z-10">
                                                    <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                                                        <Calendar size={16} className="text-slate-900" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-100">{data.semester}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center font-mono">
                                                <div className="bg-slate-800/50 p-3 rounded-lg">
                                                    <p className="text-sm text-slate-400">Credits</p>
                                                    <p className="text-lg font-semibold text-white">{data.credits.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg">
                                                    <p className="text-sm text-slate-400">SGPA</p>
                                                    <p className="text-lg font-semibold text-green-400">{data.sgpa.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg col-span-2 sm:col-span-1">
                                                    <p className="text-sm text-slate-400">CGPA</p>
                                                    <p className="text-lg font-semibold text-teal-400 flex items-center justify-center gap-1">
                                                        <TrendingUp size={16} /> {data.cgpa.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-24">
                        <h2 className="text-3xl font-bold text-white text-center mb-16">My Educational Path</h2>
                        <div className="max-w-3xl mx-auto">
                            {educationHistory.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="flex gap-4 sm:gap-8 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-slate-800/80 border border-slate-700 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:scale-110">
                                                <Icon size={24} className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />
                                            </div>
                                            {index < educationHistory.length - 1 && (
                                                <div className="w-px flex-1 bg-slate-700/50 my-2 group-hover:bg-indigo-500/50 transition-all duration-300"></div>
                                            )}
                                        </div>
                                        <div className={`flex-1 ${index < educationHistory.length - 1 ? 'pb-16' : ''}`}>
                                            <div className="bg-slate-900/30 p-6 rounded-xl border border-transparent group-hover:border-slate-700/50 transition-all duration-300">
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
