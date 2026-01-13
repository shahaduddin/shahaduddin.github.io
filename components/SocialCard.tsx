import React from 'react';
import { SocialLink } from '../types';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface SocialCardProps {
    data: SocialLink;
}

const SocialCard: React.FC<SocialCardProps> = ({ data }) => {
    const { name, email, url, icon, username, colorClass, actionText } = data;
    const href = email ? `mailto:${email}` : url;

    return (
        <a 
            href={href}
            target={email ? undefined : "_blank"} 
            rel={email ? undefined : "noopener noreferrer"}
            className="group block h-full"
        >
            <div className="h-full glass border border-slate-800/50 rounded-3xl p-8 transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/40 hover:-translate-y-3 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-slate-500 transform translate-x-2 group-hover:translate-x-0">
                    <ExternalLink size={20} />
                </div>

                <div className={`mb-8 p-5 rounded-2xl bg-slate-950/80 w-fit border border-slate-800 group-hover:border-indigo-500/50 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${colorClass} shadow-lg shadow-black/20`}>
                    {icon}
                </div>
                
                <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{name}</h3>
                    <p className="text-slate-500 font-mono text-sm break-all group-hover:text-slate-300 transition-colors">
                        {username}
                    </p>
                </div>

                <div className="mt-10 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-400 transition-all">
                    {actionText}
                    <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
            </div>
        </a>
    );
};

export default SocialCard;