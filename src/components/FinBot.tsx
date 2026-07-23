import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, ArrowUpRight, Sparkles, MessageSquare, CornerDownLeft } from 'lucide-react';
import { FinancialState } from '../types';

interface FinBotProps {
  financialState: FinancialState;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function FinBot({ financialState, isOpen, onClose }: FinBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic initialization or reset of initial message when userName or accountType changes
  useEffect(() => {
    if (messages.length <= 1) {
      const name = financialState.userName || 'Utilizador';
      setMessages([
        {
          role: 'model',
          text: `Olá ${name}! Sou o **FinBot**, o teu assistente financeiro inteligente da FinFalo. \n\nPosso analisar as tuas despesas, verificar as tuas metas de poupança e sugerir formas inteligentes de poupares dinheiro. \n\nComo posso ajudar-te hoje?`
        }
      ]);
    }
  }, [financialState.userName, financialState.accountType]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Create request payload passing current state as financial context!
      const response = await fetch('/api/finbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(1), // omit the very first static model greeting to avoid redundancy if desired, or send full
          financialData: {
            userName: financialState.userName,
            currency: financialState.currency,
            balance: financialState.balance,
            incomes: financialState.incomes,
            expenses: financialState.expenses,
            healthScore: financialState.healthScore,
            transactions: financialState.transactions,
            goals: financialState.goals,
            budgets: financialState.budgets,
            accountType: financialState.accountType,
            customApiKey: financialState.customApiKey,
            familyMembersCount: financialState.familyMembersCount,
            familyChildrenCount: financialState.familyChildrenCount,
            familyWorkingCount: financialState.familyWorkingCount,
            familyMembersList: financialState.familyMembersList
          }
        })
      });

      const data = await response.json();
      const reply = data.text || 'O FinBot está a processar os dados. Por favor, tenta novamente em instantes.';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: 'De momento estamos a enfrentar um problema. Por favor, tenta novamente em instantes.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Quanto gastei este mês?",
    "Qual é a minha maior despesa?",
    "Como estão as minhas metas?",
    "Dá-me sugestões para poupar."
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-110 z-50 bg-slate-950/95 border-l border-emerald-500/20 shadow-2xl flex flex-col backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-slate-950"></span>
          </div>
          <div>
            <h3 className="font-display font-bold text-white flex items-center gap-1.5">
              FinBot <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-normal">IA</span>
            </h3>
            <p className="text-xs text-slate-400">Inteligência Financeira FinFalo</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {msg.role === 'user' ? 'H' : <Bot className="w-4.5 h-4.5 text-emerald-400" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600/90 text-white rounded-tr-none'
                  : 'bg-slate-900/80 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                {/* Basic custom markdown rendering for bold text and paragraphs */}
                {msg.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                    {paragraph.split('**').map((part, bIdx) => 
                      bIdx % 2 === 1 ? <strong key={bIdx} className="text-white font-semibold">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <Bot className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-1.5 py-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion pills */}
      {messages.length === 1 && !loading && (
        <div className="px-4 py-2 flex flex-col gap-1.5 border-t border-emerald-500/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-display">Sugestões rápidas</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-xs bg-slate-900 hover:bg-slate-800/80 text-emerald-400 hover:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-left cursor-pointer"
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-emerald-500/10 bg-slate-900/40">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2 relative bg-slate-950 border border-emerald-500/20 rounded-xl px-3 py-2 items-center focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunta algo sobre as tuas finanças..."
            className="flex-1 bg-transparent text-white outline-none border-none text-sm placeholder:text-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-2 rounded-lg transition-colors ${
              input.trim() && !loading
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
          <MessageSquare className="w-3 h-3" /> FinBot processado em servidores seguros. Os teus dados não são partilhados.
        </p>
      </div>
    </div>
  );
}
