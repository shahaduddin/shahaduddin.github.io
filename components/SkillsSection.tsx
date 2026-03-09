
import React from 'react';
import { 
    Code2, Smartphone, ServerCog, Database, TestTube2, BrainCircuit, Wrench, ChevronRight
} from 'lucide-react';

interface Skill {
    name: string;
}

interface SkillCategory {
    title: string;
    icon: React.ReactNode;
    skills: Skill[];
}

const skillCategories: SkillCategory[] = [
    {
        title: "Frontend Development",
        icon: <Code2 className="w-6 h-6 text-blue-400" />,
        skills: [
            { name: "React & Next.js" },
            { name: "TypeScript" },
            { name: "JavaScript (ES6+)" },
            { name: "Tailwind CSS" },
            { name: "HTML5 & CSS3" }
        ]
    },
    {
        title: "Backend Development",
        icon: <ServerCog className="w-6 h-6 text-green-400" />,
        skills: [
            { name: "Node.js & Express" },
            { name: "RESTful APIs" },
            { name: "Serverless Functions" },
        ]
    },
    {
        title: "Mobile Development",
        icon: <Smartphone className="w-6 h-6 text-purple-400" />,
        skills: [
            { name: "React Native" },
            { name: "Cross-Platform UI/UX" },
        ]
    },
    {
        title: "Databases",
        icon: <Database className="w-6 h-6 text-yellow-400" />,
        skills: [
            { name: "MongoDB" },
            { name: "PostgreSQL" }
        ]
    },
    {
        title: "Scientific Computation",
        icon: <BrainCircuit className="w-6 h-6 text-rose-400" />,
        skills: [
            { name: "C++" },
            { name: "Fortran" },
            { name: "MATLAB" },
            { name: "LaTeX" },
        ]
    },
    {
        title: "Tools & DevOps",
        icon: <Wrench className="w-6 h-6 text-orange-400" />,
        skills: [
            { name: "Git" },
            { name: "GitHub" },
            { name: "Vercel" }
        ]
    },
];

const SkillsSection: React.FC = () => {
    return (
        <section id="skills" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,rgb(255,255,255))]"></div>
            <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
                        <TestTube2 size={14} className="text-purple-500" />
                        <span>My Arsenal</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Technologies & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Skills</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light mt-4">
                        I thrive on learning and adapting to new technologies. Here is a snapshot of the tools and languages I am proficient in.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillCategories.map((category) => (
                        <div 
                            key={category.title}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800/80">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-100">{category.title}</h3>
                            </div>

                            <ul className="space-y-3">
                                {category.skills.map((skill) => (
                                    <li key={skill.name} className="flex items-center gap-3">
                                        <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-slate-300 font-medium">{skill.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
