
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

const projects = [
    {
        title: "PyNum Studio",
        description: "An AI-powered web platform for numerical analysis education.",
        imageUrl: "./images/projects/pynum-studio-cover.png",
        liveLink: "https://pynum-studio.vercel.app/"
    },
    {
        title: "Medi AI",
        description: "An intelligent medical diagnosis assistant using AI to analyze symptoms.",
        imageUrl: "./images/projects/medi-ai-cover.png",
        liveLink: "https://medi-ai-indol.vercel.app/"
    },
    {
        title: "Modern Portfolio",
        description: "A sleek, professional portfolio website built with React and TypeScript.",
        imageUrl: "./images/projects/portfolio-v3-cover.png",
        liveLink: "https://shahaduddin.com"
    },
];

const SlideshowSection: React.FC = () => {
    return (
        <section id="projects" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                 <div className="flex flex-col items-center text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest">
                        <Briefcase size={14} className="text-blue-500" />
                        <span>My Work</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Projects</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                        A glimpse into my passion for creating innovative and user-friendly applications. Explore a selection of my featured work below.
                    </p>
                </div>

                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    modules={[Autoplay, EffectCoverflow, Pagination]}
                    className="w-full h-[400px] mb-16"
                >
                    {projects.map((project, index) => (
                        <SwiperSlide key={index} className="bg-center bg-cover w-[300px] h-[400px] md:w-[400px] rounded-2xl overflow-hidden border border-slate-800">
                            <div className="relative w-full h-full bg-slate-900/50 group">
                                <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover z-0"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-end">
                                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                    <p className="text-slate-300 text-sm">{project.description}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="text-center">
                    <Link to="/projects" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-blue-500/30 transform hover:scale-105">
                        View All Projects
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SlideshowSection;
