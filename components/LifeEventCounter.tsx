import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const LifeEventCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-4 z-[80] -translate-x-1/2 rounded-full border border-indigo-400/30 bg-slate-900/90 px-4 py-3 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-indigo-500/15 p-2 text-cyan-300">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Static milestone
          </p>
          <p className="text-sm font-semibold text-white">
            12 years • 3 months • 18 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifeEventCounter;
