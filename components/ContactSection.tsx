import React from 'react';
import { SocialLink } from '../types';
import SocialCard from './SocialCard.tsx';
import { Mail, Linkedin, Github } from 'lucide-react';

const socialData: SocialLink[] = [
    {
        name: "Email",
        email: "shahaduddin@protonmail.com",
        username: "shahaduddin@protonmail.com",
        icon: <Mail size={32} />,
        label: "Email",
        colorClass: "text-emerald-400",
        actionText: "Write Message"
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/in/shahaduddin",
        username: "shahaduddin",
        icon: <Linkedin size={32} />,
        label: "LinkedIn",
        colorClass: "text-blue-400",
        actionText: "Connect"
    },
    {
        name: "GitHub",
        url: "https://github.com/shahaduddin",
        username: "shahaduddin",
        icon: <Github size={32} />,
        label: "GitHub",
        colorClass: "text-purple-400",
        actionText: "Follow"
    }
];

const ContactSection: React.FC = () => {
    return (
        <section id="contact" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
            {/* Background Patterns & Textures */}
            <div className="absolute inset-0 bg-tech opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">Let's Connect</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                        Get in Touch
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Whether you want to discuss a project, a complex math problem, or just say hi, 
                        my digital inbox is always open.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {socialData.map((social) => (
                        <SocialCard key={social.name} data={social} />
                    ))}
                </div>

                {/* Optional Decorative Tagline */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Available for collaborations</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;