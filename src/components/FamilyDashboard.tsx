import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Award, 
  ChevronRight, 
  Shield, 
  Heart, 
  BookOpen,
  PieChart,
  DollarSign
} from 'lucide-react';
import { FinancialState } from '../types';

interface FamilyDashboardProps {
  financialState: FinancialState;
  onNavigate: (tab: string) => void;
  onOpenQuickAction: (type: 'income' | 'expense' | 'goal') => void;
}

export default function FamilyDashboard({
  financialState,
  onNavigate,
  onOpenQuickAction
}: FamilyDashboardProps) {
  const { 
    userName, 
    currency, 
    balance, 
    incomes, 
    expenses, 
    transactions, 
    goals,
    budgets
  } = financialState;

  const formatVal = (val: number) => {
    return val.toLocaleString() + ' ' + currency;
  };

  // Static list of family members for visualization
  const familyMembers = [
    { name: 'Henrique (Responsável)', role: 'Pai', limit: 250000, spent: 185000, color: 'border-emerald-500' },
    { name: 'Maria Mendes', role: 'Mãe', limit: 250000, spent: 120000, color: 'border-sky-500' },
    { name: 'Lucas Mendes', role: 'Filho', limit: 50000, spent: 35000, color: 'border-amber-500' },
    { name: 'Sofia Mendes', role: 'Filha', limit: 50000, spent: 42000, color: 'border-pink-500' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Family Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c1e30] via-[#112a43] to-[#184066] p-5 sm:p-6 text-white shadow-xl border border-[#184066]/50 transition-all">
        {/* Heart icon glow watermark */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#51a629]/5 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#51a629]/15 border border-[#51a629]/30 flex items-center justify-center text-[#51a629] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A2C7E5] font-display font-medium tracking-wider uppercase block">Cofre de Família</span>
              <h2 className="text-sm sm:text-base font-display font-black text-white -mt-0.5 tracking-tight truncate">
                {userName || 'Família Mendes'} <span className="text-xs text-pink-400">♥</span>
              </h2>
            </div>
          </div>
          
          <div className="bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full text-[9px] font-mono text-pink-400 flex items-center gap-1 font-bold shrink-0">
            <Shield className="w-3.5 h-3.5" />
            <span>Segurança Familiar</span>
          </div>
        </div>

        {/* Family Shared Balance */}
        <div className="mt-6 relative z-10">
          <span className="text-[#A2C7E5] text-[10px] uppercase tracking-widest font-semibold font-display">Fundo Coletivo Disponível</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white leading-tight mt-0.5">
            {formatVal(balance)}
          </h1>
        </div>

        {/* Quick Family Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
          <button
            onClick={() => onOpenQuickAction('income')}
            className="py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 text-[#51a629] stroke-[3]" /> Adicionar Receita Coletiva
          </button>
          <button
            onClick={() => onOpenQuickAction('expense')}
            className="py-3 px-2 rounded-2xl bg-[#51a629] hover:bg-[#278c36] active:scale-95 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#278c36]/20 border border-[#51a629]"
          >
            <ArrowUpRight className="w-4 h-4 text-white stroke-[2.5]" /> Registar Despesa Familiar
          </button>
        </div>
      </div>

      {/* Main Grid: Family Members & Goals progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Column: Family Members Allocations (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Family Member Spending Allowances */}
          <div className="bg-slate-900 border border-slate-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4">
            <div>
              <span className="text-[9px] text-[#A2C7E5] font-mono font-bold uppercase tracking-wider block">Mesadas & Cartões</span>
              <h3 className="text-sm font-display font-bold text-white mt-0.5">Membros da Família & Limites</h3>
              <p className="text-[10px] text-slate-400">Controlo de limites de gastos mensais para cada dependente.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyMembers.map((member, idx) => {
                const pct = Math.round((member.spent / member.limit) * 100) || 0;
                return (
                  <div key={idx} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <h4 className="font-bold text-white truncate max-w-[140px]">{member.name}</h4>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block">{member.role}</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        pct > 80 ? 'bg-rose-500/10 text-rose-400' : 'bg-[#51a629]/10 text-[#51a629]'
                      }`}>
                        {pct}% Usado
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct > 80 ? 'bg-rose-500' : 'bg-[#51a629]'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>Gasto: {member.spent.toLocaleString()} Kz</span>
                      <span className="font-bold">Teto: {member.limit.toLocaleString()} Kz</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Family Budget Items Breakdown */}
          <div className="bg-slate-900 border border-slate-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] text-pink-400 font-mono font-bold uppercase tracking-wider block">Orçamento Doméstico</span>
                <h3 className="text-sm font-display font-bold text-white mt-0.5">Orçamentos de Categoria</h3>
              </div>
              <button
                onClick={() => onNavigate('Carteira')}
                className="text-[10px] text-[#51a629] hover:underline font-bold"
              >
                Configurar Limites
              </button>
            </div>

            <div className="space-y-3">
              {budgets.slice(0, 4).map((b) => {
                const percentage = Math.round((b.spent / b.limit) * 100) || 0;
                return (
                  <div key={b.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 font-display flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-pink-500" />
                        {b.category}
                      </span>
                      <span className="text-slate-200 font-mono">
                        {b.spent.toLocaleString()} / {b.limit.toLocaleString()} Kz
                        <span className="text-slate-500 text-[10px] ml-1">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-pink-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Family Goals and Shared Activity */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Family Savings Vault Progress */}
          <div className="bg-slate-900 border border-slate-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] text-[#A2C7E5] font-mono font-bold uppercase tracking-wider block">Sonhos Conjuntos</span>
                  <h3 className="text-sm font-display font-bold text-white mt-0.5">Metas de Poupança</h3>
                </div>
                <button
                  onClick={() => onNavigate('Objetivos')}
                  className="text-[10px] text-[#51a629] hover:underline font-bold flex items-center gap-0.5"
                >
                  Ver Metas <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Focus Savings Goal - e.g. Vacation */}
              {goals.slice(0, 1).map((goal) => {
                const percentage = Math.round((goal.current / goal.target) * 100) || 0;
                return (
                  <div key={goal.id} className="p-4 rounded-2xl bg-slate-950/40 border border-[#51a629]/25 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] bg-[#51a629]/10 text-[#51a629] font-mono px-2 py-0.5 rounded-full uppercase font-bold">Férias em Família</span>
                        <h4 className="text-xs font-bold text-white mt-1.5 truncate">{goal.title}</h4>
                      </div>
                      <span className="text-sm font-display font-black text-[#51a629] font-mono">{percentage}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#278c36] to-[#51a629] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Acumulado: {goal.current.toLocaleString()} Kz</span>
                      <span className="font-bold">Alvo: {goal.target.toLocaleString()} Kz</span>
                    </div>
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Nenhuma meta familiar ativa por agora.
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('Objetivos')}
              className="w-full py-2.5 mt-4 rounded-xl bg-[#51a629]/10 hover:bg-[#51a629]/20 border border-[#51a629]/20 text-xs text-[#51a629] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
            >
              Nova Meta Familiar
            </button>
          </div>
        </div>
      </div>

      {/* Shared Family Recent Transactions list */}
      <div className="bg-slate-900 border border-slate-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] text-[#A2C7E5] font-mono font-bold uppercase tracking-wider block">Histórico Coletivo</span>
            <h3 className="text-sm font-display font-bold text-white mt-0.5">Movimentações Recentes da Casa</h3>
          </div>
          <button
            onClick={() => onNavigate('Carteira')}
            className="text-[10px] text-[#51a629] hover:underline font-bold flex items-center gap-0.5"
          >
            Ver Extrato <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/40 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  tx.type === 'income' ? 'bg-[#51a629]/10 border-[#51a629]/20 text-[#51a629]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white truncate">{tx.description}</h4>
                  <span className="text-[9px] text-slate-500 font-mono font-bold block mt-0.5 uppercase">{tx.category} • {tx.date}</span>
                </div>
              </div>
              <span className={`font-bold font-mono ${tx.type === 'income' ? 'text-[#51a629]' : 'text-slate-300'}`}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} Kz
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
