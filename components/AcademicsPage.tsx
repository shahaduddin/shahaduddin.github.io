'''
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, TrendingUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Assuming the certificates are in public/numo/certificates/
const certificateImages = [
    '/numo/certificates/15th-numo-sylhet-regional-champions.jpg',
    '/numo/certificates/16th-numo-sylhet-regional-runners-up.jpg',
    '/numo/certificates/math-olympiad-2022-winner.jpg',
    // Add more certificate paths as needed
];

const academicData = [
    { semester: 'Year 1, Semester 1', credits: 17.5, sgpa: 3.88, cgpa: 3.88 },
    { semester: 'Year 1, Semester 2', credits: 18.0, sgpa: 3.92, cgpa: 3.90 },
    { semester: 'Year 2, Semester 1', credits: 19.5, sgpa: 3.95, cgpa: 3.92 },
    { semester: 'Year 2, Semester 2', credits: 20.0, sgpa: 3.98, cgpa: 3.94 },
    { semester: 'Year 3, Semester 1', credits: 18.5, sgpa: 3.96, cgpa: 3.95 },
    { semester: 'Year 3, Semester 2', credits: 19.0, sgpa: 4.00, cgpa: 3.96 },
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
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
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
                    <h2 className="text-3xl font-bold text-white text-center mb-10">Semester Performance</h2>
                    <div className="overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="p-4 text-slate-300 tracking-wider">Semester</th>
                                    <th className="p-4 text-slate-300 tracking-wider">Credits</th>
                                    <th className="p-4 text-slate-300 tracking-wider">SGPA</th>
                                    <th className="p-4 text-slate-300 tracking-wider">CGPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicData.map((row, index) => (
                                    <tr key={index} className="border-t border-slate-800">
                                        <td className="p-4 text-slate-200">{row.semester}</td>
                                        <td className="p-4 text-slate-200">{row.credits.toFixed(2)}</td>
                                        <td className="p-4 text-green-400">{row.sgpa.toFixed(2)}</td>
                                        <td className="p-4 text-teal-400 font-semibold">{row.cgpa.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicsPage;
'''