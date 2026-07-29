import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, X, CalendarDays, Lock, Eye } from 'lucide-react';

type EventMode = 'milestone' | 'countdown';

const getTimeParts = (targetDate: Date, mode: EventMode, now: Date) => {
  const diffMs = mode === 'milestone' ? now.getTime() - targetDate.getTime() : targetDate.getTime() - now.getTime();
  const safeDiffMs = Math.max(diffMs, 0);

  const totalDays = Math.floor(safeDiffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  const hours = Math.floor((safeDiffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDiffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDiffMs / 1000) % 60);

  return {
    totalDays,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

const LifeEventCounter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<EventMode>('milestone');
  const [selectedDate, setSelectedDate] = useState('2021-01-01');
  const [showHint, setShowHint] = useState(true);
  const [title, setTitle] = useState('A private milestone');
  const [hint, setHint] = useState('A quiet chapter in my journey.');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const targetDate = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);
  const timeParts = useMemo(() => getTimeParts(targetDate, mode, now), [targetDate, mode, now]);

  const primaryValue = mode === 'milestone'
    ? `${timeParts.years}`
    : `${timeParts.totalDays}`;

  const primaryLabel = mode === 'milestone'
    ? 'years'
    : 'days left';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full border border-indigo-400/40 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/60"
        aria-label="Open life milestone counter"
      >
        <Sparkles size={18} className="text-cyan-300" />
        <span>Life marker</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700/70 bg-slate-900/95 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-mono uppercase tracking-[0.3em] text-cyan-300">Personal milestone</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">A calm counter for a special moment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-700 p-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                aria-label="Close counter panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <CalendarDays size={16} className="text-indigo-400" />
                  <span>{mode === 'milestone' ? 'Years from a chosen date' : 'Countdown to a chosen date'}</span>
                </div>

                <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-5 text-center">
                  <p className="text-6xl font-black tracking-tight text-white sm:text-7xl">{primaryValue}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-400">{primaryLabel}</p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-800/70 p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{mode === 'milestone' ? timeParts.years : timeParts.days}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{mode === 'milestone' ? 'Years' : 'Days'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/70 p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{mode === 'milestone' ? timeParts.months : timeParts.hours}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{mode === 'milestone' ? 'Months' : 'Hours'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/70 p-3 text-center">
                    <p className="text-2xl font-semibold text-white">{mode === 'milestone' ? timeParts.days : timeParts.minutes}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{mode === 'milestone' ? 'Days' : 'Minutes'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div>
                  <label className="text-sm font-medium text-slate-300">Mode</label>
                  <div className="mt-2 flex rounded-full border border-slate-700 p-1">
                    <button
                      type="button"
                      onClick={() => setMode('milestone')}
                      className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${mode === 'milestone' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Since a date
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('countdown')}
                      className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${mode === 'countdown' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Countdown
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">Choose a date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none ring-0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none ring-0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">Reason or hint</label>
                  <textarea
                    rows={3}
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none ring-0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowHint((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                >
                  {showHint ? <Eye size={16} /> : <Lock size={16} />}
                  {showHint ? 'Show hint' : 'Keep it anonymous'}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Current focus</p>
              <h4 className="mt-2 text-xl font-semibold text-white">{title}</h4>
              {showHint ? (
                <p className="mt-2 text-sm leading-6 text-slate-300">{hint}</p>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-400">The reason is kept private for now.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LifeEventCounter;
