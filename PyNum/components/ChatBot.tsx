import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { ChatMessage, AlgorithmType } from '../types';
import { askAiTutor } from '../services/geminiService';

interface ChatBotProps {
  currentAlgo: AlgorithmType;
}

export const ChatBot: React.FC<ChatBotProps> = ({ currentAlgo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-105 transition-all z-40 ${isOpen ? 'hidden' : 'flex items-center gap-2 group'}`}
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold hidden md:inline">Ask AI Tutor</span>
      </button>

      {/* Chat Overlay for Mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      <div className={`
        fixed z-50 bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0 pointer-events-none'}
        md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] md:rounded-2xl
        bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl w-full
      `}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Bot className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                  <h3 className="font-bold text-slate-800 text-sm">AI Tutor</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Powered by Gemini</p>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-20 text-sm px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                    <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-bold text-slate-700">Hello!</p>
                <p className="mt-1 text-slate-500">I can help you understand <span className="text-emerald-600 font-mono font-medium">{currentAlgo}</span>.</p>
                <div className="mt-8 grid gap-2">
                    <button onClick={() => setInput("Explain the concept simply")} className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow">
                        "Explain the concept simply"
                    </button>
                    <button onClick={() => setInput("What is the convergence rate?")} className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow">
                        "What is the convergence rate?"
                    </button>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1 border border-slate-300">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600" />
                 </div>
                 <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 border border-slate-100 shadow-sm">
                   <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                   <span className="text-xs text-slate-400 font-medium">Analyzing...</span>
                 </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 pb-8 md:pb-4">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none h-[50px] custom-scrollbar placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
      </div>
    </>
  );
};