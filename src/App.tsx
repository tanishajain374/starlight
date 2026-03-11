import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Pizza, UtensilsCrossed, Info, X } from 'lucide-react';
import { chatWithMcBot, Message } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Domino's India! 🍕 I'm your virtual assistant. How can I help you with your order today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const promptWithContext = `${userMessage} (Refer to https://www.dominos.co.in/)`;
    
    const response = await chatWithMcBot(promptWithContext, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#E6F4F9] flex flex-col items-center justify-center p-4 font-sans">
      {/* Domino's Header */}
      <div className="w-full max-w-2xl bg-[#006491] rounded-t-2xl p-6 flex items-center justify-between shadow-xl border-b-4 border-[#E31837]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md rotate-45 overflow-hidden">
            <div className="-rotate-45 flex flex-col items-center">
              <div className="w-2 h-2 bg-[#E31837] rounded-full mb-0.5" />
              <div className="flex gap-0.5">
                <div className="w-2 h-2 bg-[#006491] rounded-full" />
                <div className="w-2 h-2 bg-[#006491] rounded-full" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">Domino's Assistant</h1>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Always Delivering</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-2xl bg-white h-[600px] shadow-2xl flex flex-col relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-wrap gap-12 p-12 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <Pizza key={i} size={48} className="text-[#006491]" />
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md",
                  msg.role === 'user' ? "bg-[#006491] text-white" : "bg-[#E31837] text-white"
                )}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-[#006491] text-white rounded-tr-none border border-[#00557a]" 
                    : "bg-[#F0F7FA] text-[#27251F] rounded-tl-none border border-blue-50"
                )}>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-[#E31837] text-white flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-[#F0F7FA] p-4 rounded-2xl rounded-tl-none border border-blue-50 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100 relative z-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about pizzas, sides, or offers..."
              className="w-full bg-[#F5F5F5] border-2 border-transparent focus:border-[#006491] focus:bg-white rounded-full py-4 pl-6 pr-14 text-sm transition-all outline-none text-[#27251F] placeholder:text-gray-400 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 p-3 rounded-full transition-all",
                input.trim() && !isLoading 
                  ? "bg-[#E31837] text-white hover:bg-[#c4152f] shadow-lg" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 text-gray-400 font-medium uppercase tracking-wider">
            Official Virtual Assistant • Knowledge base: Domino's India
          </p>
        </div>
      </div>

      {/* Footer Decorative */}
      <div className="w-full max-w-2xl mt-4 flex justify-center gap-8">
        <div className="flex items-center gap-2 text-[#006491]/60">
          <Pizza size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Fresh & Hot Delivery</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1E9F2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B8DCEB;
        }
      `}</style>
    </div>
  );
}
