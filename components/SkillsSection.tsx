import React from 'react';
import { 
    Code2, Terminal, Cpu, Globe, Binary, 
    Boxes, Workflow 
} from 'lucide-react';

interface Skill {
    name: string;
    iconClass?: string;
    iconComponent?: React.ReactNode;
}

interface SkillCategory {
    title: string;
    icon: React.ReactNode;
    skills: Skill[];
    color: string;
    glow: string;
}

const skillCategories: SkillCategory[] = [
    {
        title: "Scientific Computing",
        icon: <Binary size={24} />,
        color: "text-orange-400",
        glow: "group-hover:shadow-orange-500/20",
        skills: [
            { name: "C++", iconClass: "devicon-cplusplus-plain" },
            { name: "Fortran", iconClass: "devicon-fortran-original" },
            { name: "MATLAB", iconClass: "devicon-matlab-plain" },
            { name: "LaTeX", iconClass: "devicon-latex-original" }
        ]
    },
    {
        title: "Web Development",
        icon: <Globe size={24} />,
        color: "text-blue-400",
        glow: "group-hover:shadow-blue-500/20",
        skills: [
            { name: "HTML5", iconClass: "devicon-html5-plain" },
            { name: "CSS3", iconClass: "devicon-css3-plain" },
            { name: "JavaScript", iconClass: "devicon-javascript-plain" }
        ]
    },
    {
        title: "CS Fundamentals",
        icon: <Cpu size={24} />,
        color: "text-purple-400",
        glow: "group-hover:shadow-purple-500/20",
        skills: [
            { name: "Data Structures", iconComponent: <Boxes size={32} /> },
            { name: "Algorithms", iconComponent: <Workflow size={32} /> }
        ]
    },
    {
        title: "Tools & Shell",
        icon: <Terminal size={24} />,
        color: "text-green-400",
        glow: "group-hover:shadow-green-500/20",
        skills: [
            { name: "Git", iconClass: "devicon-git-plain" },
            { name: "GitHub", iconClass: "devicon-github-original" },
            { name: "Bash", iconClass: "devicon-bash-plain" },
            { name: "PowerShell", iconClass: "devicon-powershell-plain" }
        ]
    }
];

const SkillsSection: React.FC = () => {
    return (
        <section id="skills" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-tech opacity-20 pointer-events-none"></div>
            
            {/* Dynamic Rotating Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[150px] animate-spin-slow pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <h2 className="text-slate-500 font-mono uppercase tracking-widest text-sm">Technical Arsenal</h2>
                    <span className="h-px flex-1 bg-slate-800"></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-10 gap-8">
                    {skillCategories.map((category) => (
                        <div 
                            key={category.title}
                            className="glass-card rounded-2xl p-8 h-full flex flex-col hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className={`p-4 rounded-xl bg-slate-950/80 border border-slate-800 ${category.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-slate-900 shadow-xl ${category.glow}`}>
                                    {category.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">{category.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-5 relative z-10">
                                {category.skills.map((skill) => (
                                    <div 
                                        key={skill.name}
                                        className="relative group/icon"
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-950/60 border border-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer text-slate-500 hover:text-white hover:scale-110 active:scale-95">
                                            {skill.iconClass ? (
                                                <i className={`${skill.iconClass} text-4xl transition-colors duration-300`}></i>
                                            ) : (
                                                <div className="text-current transition-colors duration-300">
                                                    {skill.iconComponent}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-mono font-bold rounded-lg opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-20 shadow-xl translate-y-3 group-hover/icon:translate-y-0">
                                            {skill.name}
                                            <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-indigo-600 rotate-45"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;