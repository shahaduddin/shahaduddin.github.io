
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { ChatMessage, AlgorithmType } from '../types';
import { askAiTutor } from '../services/geminiService';

interface ChatBotProps {
  currentAlgo: AlgorithmType;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ currentAlgo, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const answer = await askAiTutor(userMsg.text, currentAlgo);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Overlay for Mobile/Focus */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300"
            onClick={onClose}
        />
      )}

      {/* Chat Window */}
      <div className={`
        fixed z-50 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'}
        md:bottom-6 md:right-6 md:w-[440px] md:h-[640px] md:rounded-3xl
        bottom-0 left-0 right-0 h-[90vh] rounded-t-3xl w-full border border-slate-200 dark:border-slate-800
      `}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Active • Gemini 3</p>
                  </div>
              </div>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 dark:bg-slate-950/30 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-12 text-sm px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                </div>
                <h4 className="font-black text-slate-800 dark:text-slate-200 text-base mb-2 tracking-tight">Ready to assist!</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-8">
                  I'm an expert in <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentAlgo}</span>. How can I help clarify the logic or math for you today?
                </p>
                <div className="grid gap-2">
                    {["Explain this method simply", "What is the convergence rate?", "Practical applications?"].map(hint => (
                      <button 
                        key={hint}
                        onClick={() => setInput(hint)} 
                        className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95"
                      >
                        {hint}
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 dark:bg-emerald-700 text-white rounded-br-none font-medium' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-slate-200/50 dark:shadow-none'
                }`}>
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4 text-white" />
                    </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-3 animate-pulse">
                 <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-5 py-3.5 flex items-center gap-3 border border-slate-200 dark:border-slate-700 shadow-sm shadow-slate-200/50 dark:shadow-none">
                   <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                   <span className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Processing...</span>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 md:pb-6 shrink-0">
            <div className="flex gap-2 items-end bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Message your tutor..."
                className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none resize-none h-[44px] custom-scrollbar placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white p-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 dark:shadow-none transition-all hover:scale-105 active:scale-90 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
      </div>
    </>
  );
};
