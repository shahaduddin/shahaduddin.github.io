import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const certificateImages = [
    '/numo/certificates/15th-numo-sylhet-regional-champions.jpg',
    '/numo/certificates/16th-numo-sylhet-regional-runners-up.jpg',
    '/numo/certificates/math-olympiad-2022-winner.jpg',
];

const academicData = [
    { semester: 'Year 1, Semester 1', credits: 20.5, sgpa: 3.81, cgpa: 3.81 },
    { semester: 'Year 1, Semester 2', credits: 20.5, sgpa: 3.79, cgpa: 3.80 },
    { semester: 'Year 2, Semester 1', credits: 18.0, sgpa: 3.90, cgpa: 3.82 },
    { semester: 'Year 2, Semester 2', credits: 19.0, sgpa: 3.80, cgpa: 3.82 },
    { semester: 'Year 3, Semester 1', credits: 17.5, sgpa: 3.91, cgpa: 3.84 }
];

const AcademicsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors duration-300 font-medium">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Academic Journey</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
                        A detailed look at my academic performance and achievements.
                    </p>
                </div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-10">Achievement Certificates</h2>
                    <Swiper
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="w-full h-[400px] md:h-[500px] rounded-2xl border border-slate-800 bg-slate-900"
                    >
                        {certificateImages.map((src, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center p-4">
                                <img src={src} alt={`Certificate ${index + 1}`} className="max-h-full max-w-full object-contain rounded-lg" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-white text-center mb-16">Semester Performance</h2>
                    <div className="relative">
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700"></div>
                        {academicData.map((data, index) => (
                            <div key={index} className={`mb-12 flex md:justify-between items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="hidden md:block w-5/12"></div>
                                <div className="hidden md:block z-10">
                                    <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                                        <Calendar size={16} className="text-slate-900" />
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-teal-500/50 transition-colors duration-300">
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicsPage;
