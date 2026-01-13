import React from 'react';
import { 
    Facebook, Twitter, Instagram, Youtube, Heart, 
    Mail, ArrowRight,
    Home, GraduationCap, Code2, Layers
} from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const socialIcons = [
        { 
            Icon: Facebook, 
            href: "https://facebook.com/shahaduddin01", 
            label: "Facebook",
            hoverClass: "hover:text-blue-500 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:bg-blue-500/10"
        },
        { 
            Icon: Twitter, 
            href: "https://x.com/shahaduddin01", 
            label: "X (Twitter)",
            hoverClass: "hover:text-sky-400 hover:border-sky-500/50 hover:shadow-sky-500/20 hover:bg-sky-500/10"
        },
        { 
            Icon: Instagram, 
            href: "https://instagram.com/shahaduddin01", 
            label: "Instagram",
            hoverClass: "hover:text-pink-500 hover:border-pink-500/50 hover:shadow-pink-500/20 hover:bg-pink-500/10"
        },
        {
            Icon: Youtube,
            href: "https://www.youtube.com/@shahaduddin01",
            label: "YouTube",
            hoverClass: "hover:text-red-500 hover:border-red-500/50 hover:shadow-red-500/20 hover:bg-red-500/10"
        }
    ];

    const navLinks = [
        { name: "Home", href: "#", icon: Home },
        { name: "Academic Background", href: "#academic", icon: GraduationCap },
        { name: "Technical Skills", href: "#skills", icon: Code2 },
        { name: "Projects", href: "#projects", icon: Layers }
    ];

    return (
        <footer className="relative bg-slate-950 pt-24 pb-12 overflow-hidden border-t border-slate-900">
            {/* Mathematical Background Elements */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {/* Mathematical Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                {/* Floating Mathematical Symbols */}
                <div className="absolute top-0 left-[-5%] text-[15rem] leading-none text-slate-800/10 font-serif rotate-12 blur-sm">∫</div>
                <div className="absolute bottom-[-10%] right-[-5%] text-[15rem] leading-none text-slate-800/10 font-serif -rotate-12 blur-sm">∑</div>
                
                <div className="absolute top-20 right-[20%] text-9xl text-slate-800/5 font-serif rotate-12">π</div>
                <div className="absolute bottom-32 left-[15%] text-8xl text-slate-800/5 font-serif -rotate-6">∞</div>
                <div className="absolute top-1/2 left-[5%] text-8xl text-slate-800/5 font-serif rotate-45 font-light">∂</div>
                <div className="absolute bottom-10 right-[30%] text-7xl text-slate-800/5 font-serif -rotate-12">√</div>
                <div className="absolute top-10 right-10 text-6xl text-slate-800/5 font-serif rotate-12">≠</div>
            </div>

            {/* Ambient Lighting / Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
                    
                    {/* Brand Identity & Socials */}
                    <div className="md:col-span-5 space-y-8">
                        <div>
                            <a href="#" className="inline-block group">
                                <h2 className="text-3xl font-bold text-white tracking-tighter group-hover:text-indigo-400 transition-colors">
                                    Shahad<span className="text-indigo-500 animate-pulse">.</span>Uddin
                                </h2>
                            </a>
                            <p className="mt-4 text-slate-400 max-w-sm leading-relaxed text-sm">
                                Merging the precision of Mathematics with the creativity of Web Development to build elegant digital solutions.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                             {socialIcons.map(({ Icon, href, label, hoverClass }) => (
                                <a 
                                    key={label}
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={`group relative flex items-center justify-center p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${hoverClass}`}
                                    aria-label={label}
                                >
                                    <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                                    
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-20">
                                        <div className="px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap border border-slate-700 relative">
                                            {label}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 transform rotate-45"></div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Sitemap Navigation */}
                    <div className="md:col-span-3 md:pl-8">
                        <div className="relative mb-8">
                             <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest relative z-10">
                                Explore
                            </h3>
                            <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full"></div>
                        </div>
                        
                        <nav aria-label="Footer Navigation">
                            <ul className="space-y-3">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <a 
                                            href={link.href} 
                                            className="group flex items-center justify-between p-3 rounded-2xl border border-transparent hover:bg-slate-900/80 hover:border-slate-800 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-all duration-300">
                                                    <link.icon size={16} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                                                    {link.name}
                                                </span>
                                            </div>
                                            <ArrowRight size={14} className="text-indigo-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* CTA Card */}
                    <div className="md:col-span-4">
                        <div className="relative group h-full">
                            {/* Animated Gradient Border Layer */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl opacity-30 group-hover:opacity-75 blur transition duration-500 animate-pulse-slow"></div>
                            
                            <div className="relative h-full bg-slate-950/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col overflow-hidden">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                
                                {/* Status Indicator */}
                                <div className="flex items-center gap-2.5 mb-6 bg-slate-900/50 w-fit px-3 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm shadow-inner">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Available for projects</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Let's Create Something Exceptional</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-grow">
                                    Have a complex problem or a visionary idea? I'm ready to bring technical expertise and mathematical precision to your team.
                                </p>
                                
                                <a 
                                    href="mailto:shahaduddin@protonmail.com"
                                    className="group/btn relative w-full overflow-hidden rounded-2xl bg-indigo-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow duration-300"
                                >
                                    <div className="relative flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 group-hover/btn:bg-indigo-600">
                                        <Mail size={16} />
                                        <span>Start a Conversation</span>
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Separator with Glow */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-8"></div>

                {/* Footer Bottom Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
                    <p>&copy; {currentYear} Shahad Uddin. All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        Designed & Built with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> in Sylhet
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;