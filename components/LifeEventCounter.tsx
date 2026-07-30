import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock3, Pi, Sigma, Sparkles, X } from 'lucide-react';

const quotes = [
  'Pure mathematics is, in its way, the poetry of logical ideas. - Albert Einstein',
  'The essence of mathematics is not to make simple things complicated, but to make complicated things simple. - S. Gudder',
  'Mathematics reveals its secrets only to those who approach it with pure love. - Archimedes',
  'In mathematics, the art of proposing a question must be held of higher value than solving it. - Georg Cantor',
  'Go down deep enough into anything and you will find mathematics. - Dean Schlicter',
];

const targetDate = new Date('2042-05-11T00:00:00');

const getCountdown = (now: Date) => {
  const diffMs = Math.max(targetDate.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const LifeEventCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);
  const countdown = useMemo(() => getCountdown(now), [now]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/20 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6">
      <div className="relative w-full max-w-[24rem] sm:max-w-md max-h-[90dvh] overflow-y-auto rounded-[1.5rem] border border-slate-700/70 bg-slate-950/90 shadow-[0_30px_90px_rgba(2,6,23,0.7)] sm:rounded-[2rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.15),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
        <div className="absolute inset-0 animate-pulse bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,197,94,0.12),rgba(59,130,246,0.12),rgba(168,85,247,0.12),rgba(236,72,153,0.12),rgba(34,197,94,0.12))] blur-2xl" />

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-200 transition-colors hover:border-white/25 hover:text-white"
          aria-label="Close countdown"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-cyan-300 shadow-lg shadow-cyan-500/10 sm:p-3">
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 sm:text-[10px]">Mathematical countdown</p>
              <h3 className="text-lg font-black tracking-tight text-white sm:text-xl">A square of time and light</h3>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 shadow-lg shadow-emerald-500/10 sm:rounded-3xl sm:p-4">
              <div className="flex items-center justify-between text-emerald-300">
                <Sigma size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] sm:text-[10px]">Days</span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-white sm:mt-5 sm:text-4xl">{countdown.days}</p>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 shadow-lg shadow-blue-500/10 sm:rounded-3xl sm:p-4">
              <div className="flex items-center justify-between text-blue-300">
                <Clock3 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] sm:text-[10px]">Hours</span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-white sm:mt-5 sm:text-4xl">{countdown.hours}</p>
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-3 shadow-lg shadow-violet-500/10 sm:rounded-3xl sm:p-4">
              <div className="flex items-center justify-between text-violet-300">
                <Pi size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] sm:text-[10px]">Minutes</span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-white sm:mt-5 sm:text-4xl">{countdown.minutes}</p>
            </div>

            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 shadow-lg shadow-rose-500/10 sm:rounded-3xl sm:p-4">
              <div className="flex items-center justify-between text-rose-300">
                <ArrowLeft size={16} className="rotate-45 sm:w-[18px] sm:h-[18px]" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] sm:text-[10px]">Seconds</span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-white sm:mt-5 sm:text-4xl">{countdown.seconds}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-sm sm:rounded-3xl sm:p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 sm:text-[10px]">Random quote</p>
            <p className="mt-2 text-xs leading-5 text-slate-200 sm:text-sm sm:leading-6">{quote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeEventCounter;
