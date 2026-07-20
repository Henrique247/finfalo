import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Award, 
  Trophy, 
  CheckCircle, 
  Compass, 
  Bookmark, 
  Flame,
  ArrowRight,
  Zap
} from 'lucide-react';
import { SavingChallenge } from '../types';

export default function Education() {
  const [activeSubTab, setActiveSubTab] = useState<'conteudo' | 'desafios' | 'glossario'>('conteudo');
  
  // Simulated articles
  const articles = [
    {
      id: '1',
      title: 'A Regra dos 50/30/20: Como Organizar as Finanças',
      category: 'Orçamento',
      readTime: '4 min',
      description: 'Divide os teus rendimentos líquidos em 50% para Necessidades, 30% para Desejos e 20% para Poupança.',
      content: 'A regra dos 50/30/20 é um método de orçamento simples que ajuda a equilibrar as tuas contas de forma inteligente. 50% vai para despesas essenciais (luz, água, renda, supermercado), 30% vai para o teu lazer (cinema, jantares fora, subscrições) e os restantes 20% devem ser obrigatoriamente poupados ou investidos rumo às tuas metas.'
    },
    {
      id: '2',
      title: 'Fundo de Emergência: O Teu Escudo de Proteção',
      category: 'Poupança',
      readTime: '5 min',
      description: 'Aprende como calcular e constituir um fundo seguro para evitar imprevistos.',
      content: 'O fundo de emergência deve equivaler a 3 a 6 meses das tuas despesas de subsistência mensais. Este dinheiro serve para cobrir eventos totalmente imprevisíveis, tais como despesas de saúde imprevistas ou a perda temporária de rendimentos. Este fundo deve ser guardado numa conta de elevada liquidez e risco nulo.'
    },
    {
      id: '3',
      title: 'Introdução aos Juros Compostos: O Efeito Bola de Neve',
      category: 'Investimento',
      readTime: '6 min',
      description: 'Como o tempo é o teu maior aliado na multiplicação de património.',
      content: 'Os juros compostos são os juros calculados sobre o capital inicial acrescido dos juros acumulados de períodos anteriores. Isto cria um efeito exponencial de multiplicação a longo prazo, permitindo que as tuas poupanças cresçam sozinhas ao longo dos anos.'
    }
  ];

  // Simulated savings challenges
  const [challenges, setChallenges] = useState<SavingChallenge[]>([
    {
      id: 'c1',
      title: 'Desafio Poupança Lazer (4 Semanas)',
      targetAmount: 20000,
      durationWeeks: 4,
      weeklyAmount: 5000,
      currentWeek: 2,
      completed: false
    },
    {
      id: 'c2',
      title: 'Fundo Tecnologia 2026',
      targetAmount: 50000,
      durationWeeks: 10,
      weeklyAmount: 5000,
      currentWeek: 10,
      completed: true
    }
  ]);

  // Handle increment week challenge
  const handleNextWeek = (id: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextWeek = Math.min(ch.currentWeek + 1, ch.durationWeeks);
        const completed = nextWeek === ch.durationWeeks;
        return { ...ch, currentWeek: nextWeek, completed };
      }
      return ch;
    }));
  };

  const glossaryItems = [
    { term: 'Ações', definition: 'Frações representativas do capital social de uma empresa, conferindo ao titular direitos de sócio.' },
    { term: 'Ativos', definition: 'Tudo o que possui valor económico e pode ser convertido em dinheiro (ex: investimentos, imóveis).' },
    { term: 'Inflação', definition: 'O aumento geral e continuado dos preços dos bens e serviços, reduzindo o poder de compra.' },
    { term: 'Liquidez', definition: 'A rapidez e facilidade com que um ativo pode ser convertido em dinheiro líquido sem perda de valor.' },
    { term: 'Passivos', definition: 'Obrigações financeiras ou dívidas que retiram dinheiro do teu bolso (ex: empréstimos de consumo).' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-[#51a629]/10 rounded-xl border border-[#51a629]/20">
          <BookOpen className="w-6 h-6 text-[#51a629]" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white leading-tight">Academia FinFalo</h1>
          <p className="text-xs text-slate-400 mt-0.5">Desenvolve a tua inteligência e bem-estar financeiro com guias práticos e desafios.</p>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none bg-slate-950 p-1 border border-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveSubTab('conteudo')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'conteudo'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Artigos & Guias
        </button>
        <button
          onClick={() => setActiveSubTab('desafios')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'desafios'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Desafios Ativos
        </button>
        <button
          onClick={() => setActiveSubTab('glossario')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'glossario'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Glossário Finanças
        </button>
      </div>

      {/* Tab Switcher Body */}
      {activeSubTab === 'conteudo' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List of articles */}
          {articles.map((art) => (
            <div key={art.id} className="fintech-card p-5 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase tracking-wider text-[9px]">
                    {art.category}
                  </span>
                  <span className="text-slate-500 font-mono font-medium">{art.readTime} de leitura</span>
                </div>
                <h3 className="text-sm font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {art.description}
                </p>
                <div className="pt-2 text-xs text-slate-300 border-t border-slate-800/60 leading-relaxed italic">
                  "{art.content}"
                </div>
              </div>
              <div className="flex items-center justify-end text-xs font-bold text-emerald-400 mt-4 group-hover:gap-1.5 transition-all">
                Guardar Artigo <Bookmark className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'desafios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Challenges listing */}
          {challenges.map((ch) => {
            const progress = Math.round((ch.currentWeek / ch.durationWeeks) * 100);
            return (
              <div key={ch.id} className="fintech-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                {ch.completed && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase px-3 py-1 rounded-bl-lg tracking-wider flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Concluído
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-white">{ch.title}</h3>
                      <p className="text-[10px] text-slate-500 font-mono">Semanal: {ch.weeklyAmount.toLocaleString()} Kz</p>
                    </div>
                  </div>

                  {/* Progress tracker info */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Progresso de Poupança</span>
                      <span className="text-white font-bold font-mono">{ch.currentWeek} de {ch.durationWeeks} semanas ({progress}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${ch.completed ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-5">
                  <span className="text-xs text-slate-400 font-medium">Meta Total: <strong className="text-white font-mono">{ch.targetAmount.toLocaleString()} Kz</strong></span>
                  {!ch.completed ? (
                    <button
                      onClick={() => handleNextWeek(ch.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Registar Semana <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" /> Excelente trabalho!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'glossario' && (
        <div className="fintech-card p-6 rounded-2xl max-w-3xl">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Compass className="w-4.5 h-4.5 text-emerald-400" /> Dicionário de Conceitos Financeiros
          </h2>

          <div className="divide-y divide-slate-800/60">
            {glossaryItems.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-emerald-400 font-display block">{item.term}</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
