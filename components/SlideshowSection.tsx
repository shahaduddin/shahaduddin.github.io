
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
        liveLink: "https://pynum-studio.vercel.app/",
        svgComponent: (
            <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="-50 -50 100 100">
                    <g fill="none" strokeWidth="3">
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20">
                             <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20" transform="rotate(60)">
                             <animateTransform attributeName="transform" type="rotate" from="60" to="420" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <ellipse stroke="rgb(59 130 246 / 0.7)" rx="45" ry="20" transform="rotate(120)">
                             <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="15s" repeatCount="indefinite"/>
                        </ellipse>
                        <circle stroke="rgb(59 130 246 / 1)" r="8" fill="rgb(59 130 246 / 0.3)"/>
                    </g>
                </svg>
            </div>
        ),
    },
    {
        title: "OrthoBudget",
        description: "A budget management app for orthodontic residents.",
        liveLink: "https://orthobudget.vercel.app",
        svgComponent: (
             <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="0 0 100 100">
                    <path d="M 20 80 L 80 80 L 50 20 Z" fill="none" stroke="rgb(34 197 94 / 0.8)" strokeWidth="4">
                         <animateTransform attributeName="transform" type="rotate" from="0 50 60" to="360 50 60" dur="10s" repeatCount="indefinite"/>
                    </path>
                    <text x="50" y="70" text-anchor="middle" font-size="20" fill="rgb(34 197 94 / 0.9)">$</text>
                </svg>
            </div>
        ),
    },
    {
        title: "ZincCalcPro",
        description: "An advanced calculator for zinc dosage in pediatric patients.",
        liveLink: "https://zinccalcpro.vercel.app",
        svgComponent: (
             <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="80%" height="80%" viewBox="0 0 100 100">
                    <rect x="20" y="20" width="60" height="70" rx="10" fill="none" stroke="rgb(236 72 153 / 0.8)" strokeWidth="4"/>
                    <path d="M30 40H70 M30 55H70 M30 70H70" stroke="rgb(236 72 153 / 0.8)" strokeWidth="3"/>
                </svg>
            </div>
        ),
    },
    {
        title: "Modern Portfolio",
        description: "A sleek, professional portfolio website built with React and TypeScript.",
        liveLink: "https://shahaduddin.com",
        svgComponent: (
            <div className="w-full h-full bg-slate-900/25 p-8 flex items-center justify-center">
                <svg width="60%" height="60%" viewBox="0 0 100 100">
                    <g fill="none" stroke="rgb(168 85 247 / 0.8)" strokeWidth="4">
                        <path d="M 20 30 L 5 50 L 20 70">
                             <animate attributeName="stroke" values="rgb(168 85 247 / 0.8);rgb(99 102 241 / 0.8);rgb(168 85 247 / 0.8)" dur="4s" repeatCount="indefinite" />
                        </path>
                        <path d="M 80 30 L 95 50 L 80 70">
                            <animate attributeName="stroke" values="rgb(168 85 247 / 0.8);rgb(99 102 241 / 0.8);rgb(168 85 247 / 0.8)" dur="4s" repeatCount="indefinite" />
                        </path>
                        <path d="M 60 20 L 40 80">
                             <animate attributeName="d" values="M 60 20 L 40 80; M 70 20 L 30 80; M 60 20 L 40 80" dur="4s" repeatCount="indefinite" />
                        </path>
                    </g>
                </svg>
            </div>
        ),
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
                                {project.svgComponent}
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
