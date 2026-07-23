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
  DollarSign,
  Download,
  CreditCard,
  Calculator,
  X,
  CheckCircle2
} from 'lucide-react';
import { FinancialState } from '../types';
import { generateFinancialReportPDF } from '../utils/pdfGenerator';
import BankingDetailsCard from './BankingDetailsCard';

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

  const [showBankingDetails, setShowBankingDetails] = useState(false);
  const [showSimpleCalc, setShowSimpleCalc] = useState(false);

  // Simple Family Calculator states
  const [supermarketCost, setSupermarketCost] = useState('120000');
  const [schoolCost, setSchoolCost] = useState('80000');
  const [utilitiesCost, setUtilitiesCost] = useState('35000');
  const [transportCost, setTransportCost] = useState('40000');
  const [leisureCost, setLeisureCost] = useState('25000');

  const formatVal = (val: number) => {
    return val.toLocaleString() + ' ' + currency;
  };

  const isTestAccount = financialState.email && ['personal@finfalo.com', 'familia@finfalo.com', 'empresa@finfalo.com'].includes(financialState.email.toLowerCase());

  const getFamilyMembers = () => {
    if (isTestAccount) {
      return [
        { name: 'Henrique (Responsável)', role: 'Pai', limit: 250000, spent: 185000, color: 'border-emerald-500' },
        { name: 'Maria Mendes', role: 'Mãe', limit: 250000, spent: 120000, color: 'border-sky-500' },
        { name: 'Lucas Mendes', role: 'Filho', limit: 50000, spent: 35000, color: 'border-amber-500' },
        { name: 'Sofia Mendes', role: 'Filha', limit: 50000, spent: 42000, color: 'border-pink-500' }
      ];
    }
    
    // Dynamic family members list for real users
    const list = [
      { 
        name: `${userName || 'Utilizador'} (Responsável)`, 
        role: 'Responsável (Gestor)', 
        limit: financialState.monthlyIncome || 350000, 
        spent: expenses, 
        color: 'border-emerald-500' 
      }
    ];
    
    const colors = ['border-sky-500', 'border-amber-500', 'border-pink-500', 'border-indigo-500', 'border-violet-500'];
    
    if (financialState.familyMembersList && financialState.familyMembersList.length > 0) {
      financialState.familyMembersList.forEach((m, idx) => {
        list.push({
          name: m.name,
          role: m.relation,
          limit: m.works ? m.salary : 50000,
          spent: 0, // No simulated fake expenditures
          color: colors[idx % colors.length]
        });
      });
    }
    
    return list;
  };

  const familyMembers = getFamilyMembers();

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Family Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#053259] via-[#064a7f] to-[#0869A6] p-4 sm:p-6 text-white shadow-xl border border-[#0869A6]/40 transition-all">
        {/* Heart icon glow watermark */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#51a629]/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#51a629]/5 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#51a629]/15 border border-[#51a629]/30 flex items-center justify-center text-[#51a629] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#A2C7E5] font-display font-medium tracking-wider uppercase block">Cofre de Família</span>
              <h2 className="text-sm sm:text-base font-display font-black text-white -mt-0.5 tracking-tight truncate font-sans">
                {userName || 'Família Mendes'} <span className="text-xs text-[#51a629]">●</span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button
              onClick={() => setShowBankingDetails(true)}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-all"
              title="Ver IBAN do Cofre Familiar"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>IBAN Familiar</span>
            </button>
            <button
              onClick={() => setShowSimpleCalc(!showSimpleCalc)}
              className="px-3 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-all"
              title="Calculadora Simples da Casa"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulador de Casa</span>
            </button>
            <button
              onClick={() => generateFinancialReportPDF(financialState, 'Relatório Orçamental Familiar')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-all"
              title="Exportar PDF do Relatório Familiar"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF</span>
            </button>
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
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-6 relative z-10">
          <button
            onClick={() => onOpenQuickAction('income')}
            className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm hover:shadow-md truncate font-sans"
          >
            <Plus className="w-3.5 h-3.5 text-[#51a629] stroke-[3] shrink-0" /> <span className="truncate">Receita Coletiva</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('expense')}
            className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-[#51a629] hover:bg-[#278c36] active:scale-95 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-[#278c36]/20 border border-[#51a629] truncate font-sans"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" /> <span className="truncate">Despesa Familiar</span>
          </button>
        </div>
      </div>

      {/* Simple Family Expense Calculator (Easy to use) */}
      {showSimpleCalc && (
        <div className="bg-slate-900 border border-sky-500/30 p-5 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white">Calculadora Doméstica Fácil</h3>
                <p className="text-[10px] text-slate-400">Estime as despesas mensais essenciais da casa sem complicações</p>
              </div>
            </div>
            <button
              onClick={() => setShowSimpleCalc(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">🛒 Supermercado</label>
              <input
                type="number"
                value={supermarketCost}
                onChange={(e) => setSupermarketCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">🎓 Escola / Propina</label>
              <input
                type="number"
                value={schoolCost}
                onChange={(e) => setSchoolCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">💡 Luz, Água & Gás</label>
              <input
                type="number"
                value={utilitiesCost}
                onChange={(e) => setUtilitiesCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">🚌 Transporte</label>
              <input
                type="number"
                value={transportCost}
                onChange={(e) => setTransportCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">🎉 Lazer & Outros</label>
              <input
                type="number"
                value={leisureCost}
                onChange={(e) => setLeisureCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">Total Previsto da Casa:</span>
            <span className="text-sm font-mono font-black text-[#51a629]">
              {(
                (parseFloat(supermarketCost) || 0) +
                (parseFloat(schoolCost) || 0) +
                (parseFloat(utilitiesCost) || 0) +
                (parseFloat(transportCost) || 0) +
                (parseFloat(leisureCost) || 0)
              ).toLocaleString()}{' '}
              {currency}
            </span>
          </div>
        </div>
      )}

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

            {!isTestAccount && familyMembers.length === 1 && (
              <div className="pt-4 mt-2 border-t border-slate-800/40 text-center">
                <p className="text-[10px] text-slate-400">Configure e adicione outros membros da família (cônjuge, filhos) para gerir as suas mesadas e limites!</p>
                <button
                  onClick={() => onNavigate('Perfil')}
                  className="mt-2 text-[11px] font-bold text-[#51a629] hover:underline cursor-pointer"
                >
                  Adicionar Membro da Família →
                </button>
              </div>
            )}
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

      {/* Banking Details Modal */}
      {showBankingDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <BankingDetailsCard
              accountType="family"
              userName={userName}
              email={financialState.email}
              currency={currency}
              compact
              onClose={() => setShowBankingDetails(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
