import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus, 
  Award, 
  Lightbulb, 
  ChevronRight,
  Eye,
  EyeOff,
  CreditCard,
  Target,
  AlertTriangle,
  ArrowRight,
  User,
  Sparkles,
  Download
} from 'lucide-react';
import { FinancialState } from '../types';
import { generateFinancialReportPDF } from '../utils/pdfGenerator';
import BankingDetailsCard from './BankingDetailsCard';

interface PersonalDashboardProps {
  financialState: FinancialState;
  onNavigate: (tab: string) => void;
  onOpenQuickAction: (type: 'income' | 'expense' | 'goal') => void;
  onStartOnboarding: () => void;
}

export default function PersonalDashboard({
  financialState,
  onNavigate,
  onOpenQuickAction,
  onStartOnboarding
}: PersonalDashboardProps) {
  const [graphPeriod, setGraphPeriod] = useState<'7d' | '30d' | '12m'>('30d');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeCardPopup, setActiveCardPopup] = useState<boolean>(false);
  const [showBankingDetails, setShowBankingDetails] = useState<boolean>(false);

  const { 
    userName, 
    currency, 
    balance, 
    incomes, 
    expenses, 
    healthScore, 
    transactions, 
    goals
  } = financialState;

  // Calculate progressive profiling percentage
  const getProfileCompletion = () => {
    let completion = 20; // registration is 20%
    if (financialState.phone) completion += 20;
    if (financialState.birthDate) completion += 20;
    if (financialState.monthlyIncome && financialState.monthlyIncome > 0) completion += 20;
    if (financialState.financialGoalText) completion += 20;
    return completion;
  };
  const profileCompletion = getProfileCompletion();

  const formatVal = (val: number) => {
    return val.toLocaleString() + ' ' + currency;
  };

  // Daily advice list
  const dailyTips = [
    "Evite gastar mais de 30% da sua renda em despesas supérfluas.",
    "Pague a si mesmo primeiro: transfira uma percentagem direta para o seu cofre virtual.",
    "O seu fundo de emergência deve cobrir de 3 a 6 meses de despesas básicas.",
    "Preste atenção aos pequenos débitos recorrentes; cancele subscrições que não usa.",
    "Desenhe as suas metas de poupança no FinFalo e acompanhe o progresso semanal.",
    "Espere 24 horas antes de efetuar compras por impulso. Poupe primeiro!",
    "Pequenos descontos geram grandes poupanças a longo prazo."
  ];
  const dayIndex = new Date().getDate() % dailyTips.length;
  const currentTip = dailyTips[dayIndex];

  // Graph Data logic
  const getGraphData = () => {
    const isTestAccount = financialState.email && ['personal@finfalo.com', 'familia@finfalo.com', 'empresa@finfalo.com'].includes(financialState.email.toLowerCase());
    
    if (isTestAccount) {
      if (graphPeriod === '7d') {
        return {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          incomes: [12000, 0, 45000, 0, 10000, 15000, 0],
          expenses: [3500, 8000, 12000, 4000, 15000, 22000, 5000],
        };
      } else if (graphPeriod === '12m') {
        return {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          incomes: [220000, 250000, 230000, 260000, 250000, 240000, 280000, 250000, 250000, 260000, 270000, 290000],
          expenses: [180000, 195000, 160000, 175000, 210000, 185000, 170000, 160000, 150000, 180000, 210000, 230000],
        };
      } else { // 30d
        return {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
          incomes: [80000, 60000, 70000, 90000],
          expenses: [45000, 55000, 38000, 62000],
        };
      }
    }

    // Real Account: calculate dynamic values from real user transactions
    if (graphPeriod === '7d') {
      const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const labels: string[] = [];
      const incomes: number[] = [];
      const expenses: number[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = daysOfWeek[d.getDay()];
        labels.push(dayLabel);
        
        const dayIncomes = transactions
          .filter(t => t.date === dateStr && t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const dayExpenses = transactions
          .filter(t => t.date === dateStr && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
          
        incomes.push(dayIncomes);
        expenses.push(dayExpenses);
      }
      
      return { labels, incomes, expenses };
    } else if (graphPeriod === '12m') {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const labels: string[] = [];
      const incomes: number[] = [];
      const expenses: number[] = [];
      
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const year = d.getFullYear();
        const month = d.getMonth();
        labels.push(monthNames[month]);
        
        const mTransactions = transactions.filter(t => {
          if (!t.date) return false;
          const txDate = new Date(t.date);
          return txDate.getFullYear() === year && txDate.getMonth() === month;
        });
        
        incomes.push(mTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0));
        expenses.push(mTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
      }
      
      return { labels, incomes, expenses };
    } else { // 30d
      const labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      const incomes = [0, 0, 0, 0];
      const expenses = [0, 0, 0, 0];
      const now = Date.now();
      const oneDay = 1000 * 60 * 60 * 24;
      
      for (let w = 0; w < 4; w++) {
        const daysAgoStart = 28 - w * 7;
        const daysAgoEnd = 28 - (w + 1) * 7;
        
        const wTransactions = transactions.filter(t => {
          if (!t.date) return false;
          const txDate = new Date(t.date);
          const diffTime = now - txDate.getTime();
          const diffDays = diffTime / oneDay;
          return diffDays <= daysAgoStart && diffDays > daysAgoEnd;
        });
        
        incomes[w] = wTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        expenses[w] = wTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      }
      
      return { labels, incomes, expenses };
    }
  };

  const graphData = getGraphData();
  const maxVal = Math.max(...graphData.incomes, ...graphData.expenses) * 1.15 || 10000;
  const isGraphEmpty = graphData.incomes.every(v => v === 0) && graphData.expenses.every(v => v === 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Onboarding Alert */}
      {financialState.showOnboardingAlert && (
        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-100 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-400 font-display">Configure o seu perfil da FinFalo</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">Conclua o assistente de configuração rápida para desbloquear análises ultra-precisas.</p>
            </div>
          </div>
          <button
            onClick={onStartOnboarding}
            className="text-[10px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer self-stretch sm:self-auto text-center font-display"
          >
            Completar Agora
          </button>
        </div>
      )}

      {/* Progressive Profiling Bar */}
      <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl sm:rounded-3xl flex items-center justify-between gap-4 text-slate-100 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 text-xs font-bold font-display">
            <span className="text-slate-300">Nível de Conclusão do Perfil</span>
            <span className="text-[#51a629] font-mono">{profileCompletion}% concluído</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/40">
            <div 
              className="bg-gradient-to-r from-[#51a629] to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
        {profileCompletion < 100 && (
          <button
            onClick={onStartOnboarding}
            className="text-[10px] sm:text-xs bg-[#51a629]/10 text-[#51a629] hover:bg-[#51a629]/20 font-bold px-3.5 py-2 rounded-xl border border-[#51a629]/25 transition-all cursor-pointer whitespace-nowrap font-display"
          >
            Completar Perfil
          </button>
        )}
      </div>

      {/* Personal Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#053259] via-[#064a7f] to-[#0869A6] p-4 sm:p-6 text-white shadow-xl border border-[#0869A6]/40 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-[#51a629]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#278c36] to-[#51a629] p-[2px] shadow-lg">
                <div className="w-full h-full rounded-full bg-[#053259] flex items-center justify-center text-white overflow-hidden font-display font-black">
                  <User className="w-5 h-5 text-[#51a629]" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#51a629] border-2 border-[#053259]"></span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[11px] text-[#A2C7E5] font-display font-medium tracking-wider uppercase block truncate">Olá, Bem-vindo</span>
              <h2 className="text-sm sm:text-base font-display font-black text-white -mt-0.5 tracking-tight flex items-center gap-1 truncate font-sans">
                {userName} <span className="text-xs text-emerald-400">●</span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button
              onClick={() => setShowBankingDetails(true)}
              className="px-3 py-1.5 rounded-full bg-[#51a629]/20 hover:bg-[#51a629]/30 text-emerald-200 border border-[#51a629]/40 text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-all"
              title="Ver IBAN e Referência Multicaixa"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>IBAN & Referência</span>
            </button>
            <button
              onClick={() => generateFinancialReportPDF(financialState, 'Relatório Financeiro Pessoal')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-all"
              title="Exportar PDF do Relatório Financeiro"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Current Balance Display with Eye Toggle */}
        <div className="mt-5 sm:mt-8 relative z-10">
          <div className="flex items-center gap-2 text-[#A2C7E5] text-[10px] sm:text-xs uppercase tracking-widest font-semibold font-display">
            <span>Saldo Disponível</span>
            <button 
              onClick={() => setShowBalance(!showBalance)} 
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? "Ocultar Saldo" : "Mostrar Saldo"}
            >
              {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white transition-all duration-300 break-all leading-tight">
              {showBalance ? formatVal(balance) : "•••••• " + currency}
            </h1>
          </div>
          <p className="text-[8px] sm:text-[10px] text-[#A2C7E5] mt-0.5 font-mono tracking-widest uppercase">
            ID: FF-923-3569
          </p>
        </div>

        {/* Dual Actions CTAs */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-5 sm:mt-8 relative z-10">
          <button
            onClick={() => onOpenQuickAction('income')}
            className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md truncate font-sans"
          >
            <Plus className="w-3.5 h-3.5 text-[#51a629] stroke-[3] shrink-0" /> Guardar / Depositar
          </button>
          
          <button
            onClick={() => onOpenQuickAction('expense')}
            className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-[#51a629] hover:bg-[#278c36] active:scale-95 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#278c36]/20 border border-[#51a629] truncate font-sans"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" /> Registar Saída
          </button>
        </div>
      </div>

      {/* Upgrade banner */}
      <div className="bg-[#FFEAD2]/90 border border-amber-500/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-sm transition-all hover:scale-[1.01]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
          <AlertTriangle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] sm:text-xs font-bold text-amber-900 uppercase tracking-wide font-display truncate">Upgrade Recomendado</h4>
          <p className="text-[10px] sm:text-[11px] text-amber-800 leading-normal -mt-0.5 truncate">
            Atualize os seus limites para render mais no cofre de poupança automática.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('Perfil')}
          className="text-[10px] sm:text-xs font-bold text-amber-900 hover:underline shrink-0"
        >
          Ver Mais
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-2">
        <h3 className="text-[10px] sm:text-xs font-display font-bold text-[#A2C7E5] uppercase tracking-widest pl-1">Ações Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <button
            onClick={() => onOpenQuickAction('income')}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0869A6]/10 hover:bg-[#0869A6]/20 border border-[#0869A6]/25 transition-all text-center cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0869A6]/20 text-[#0869A6] flex items-center justify-center font-bold mb-1 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-white block truncate w-full">Topup</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('expense')}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all text-center cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold mb-1 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-white block truncate w-full">Despesas</span>
          </button>

          <button
            onClick={() => onNavigate('Objetivos')}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#51a629]/10 hover:bg-[#51a629]/20 border border-[#51a629]/20 transition-all text-center cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#51a629]/20 text-[#51a629] flex items-center justify-center font-bold mb-1 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-white block truncate w-full">Poupança</span>
          </button>

          <button
            onClick={() => setActiveCardPopup(true)}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#A2C7E5]/10 hover:bg-[#A2C7E5]/20 border border-[#A2C7E5]/25 transition-all text-center cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#A2C7E5]/20 text-[#A2C7E5] flex items-center justify-center font-bold mb-1 sm:mb-2 group-hover:scale-105 transition-transform shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-white block truncate w-full">Cartões</span>
          </button>
        </div>
      </div>

      {/* Graph and Score columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="fintech-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">Histórico de Performance</span>
              <h2 className="text-sm sm:text-base font-display font-bold text-white mt-0.5 font-sans">Estatísticas de Fluxo</h2>
            </div>
            <div className="flex bg-slate-950/60 p-0.5 sm:p-1 border border-slate-800 rounded-lg sm:rounded-xl self-start sm:self-auto shrink-0 font-mono text-[9px]">
              {(['7d', '30d', '12m'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setGraphPeriod(period)}
                  className={`px-2 py-1 sm:px-3 sm:py-1 font-bold rounded-md sm:rounded-lg transition-all cursor-pointer ${
                    graphPeriod === period
                      ? 'bg-gradient-to-tr from-[#278c36] to-[#51a629] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {period === '7d' ? '7D' : period === '30d' ? '30D' : '12M'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Graph bars */}
          <div className="relative w-full h-48 flex items-end pt-4 pb-6">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(8, 105, 166, 0.15)" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(8, 105, 166, 0.15)" strokeDasharray="3,3" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(8, 105, 166, 0.15)" strokeDasharray="3,3" />
              <line x1="0" y1="200" x2="500" y2="200" stroke="rgba(8, 105, 166, 0.3)" />

              {graphData.labels.map((label, idx) => {
                const totalPoints = graphData.labels.length;
                const xSpacing = 500 / (totalPoints + 1);
                const x = xSpacing * (idx + 1);

                const incomeVal = graphData.incomes[idx];
                const expenseVal = graphData.expenses[idx];

                const incomeH = (incomeVal / maxVal) * 150;
                const expenseH = (expenseVal / maxVal) * 150;

                return (
                  <g key={idx}>
                    <rect
                      x={x - 10}
                      y={200 - incomeH}
                      width="8"
                      height={incomeH || 2}
                      rx="4"
                      fill="url(#mockupBlueGrad)"
                      className="transition-all duration-350 hover:opacity-80"
                    />
                    <rect
                      x={x + 2}
                      y={200 - expenseH}
                      width="8"
                      height={expenseH || 2}
                      rx="4"
                      fill="url(#mockupGreenGrad)"
                      className="transition-all duration-350 hover:opacity-80"
                    />
                  </g>
                );
              })}

              <defs>
                <linearGradient id="mockupBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0869A6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#053259" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="mockupGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#51a629" stopOpacity="1" />
                  <stop offset="100%" stopColor="#278c36" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] text-[#A2C7E5] font-mono select-none">
              {graphData.labels.map((label, idx) => (
                <div key={idx} className="text-center w-full font-semibold">
                  {label}
                </div>
              ))}
            </div>

            {isGraphEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs rounded-2xl text-center p-4 border border-slate-800">
                <TrendingUp className="w-8 h-8 text-[#51a629] mb-2 animate-pulse" />
                <span className="text-xs font-bold text-white block">Sem Movimentações</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-normal max-w-xs">
                  Registe as suas despesas e depósitos na Carteira para gerar o gráfico dinâmico!
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-slate-800/60 pt-3 text-[10px] sm:text-[11px] font-bold gap-2">
            <div className="flex gap-3 text-[#A2C7E5]">
              <span className="flex items-center gap-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0869A6] inline-block"></span> Entradas
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#51a629] inline-block"></span> Saídas
              </span>
            </div>
            <span className="text-[#51a629] font-mono shrink-0">
              Taxa de Poupança: +{Math.round(((incomes - expenses) / incomes || 1) * 100)}%
            </span>
          </div>
        </div>

        {/* Health Score column */}
        <div className="space-y-4 sm:space-y-6">
          <div className="fintech-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
            <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Award className="w-4 h-4 text-[#51a629]" /> Score de Saúde FinFalo
            </h3>

            <div className="flex items-center gap-3 sm:gap-4 my-3">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-850"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#51a629]"
                    strokeDasharray={`${healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base sm:text-lg font-display font-black text-white">{healthScore}</span>
                  <span className="text-[7px] sm:text-[8px] text-slate-500 block -mt-1">/100</span>
                </div>
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#51a629]/10 text-[#51a629] border border-[#51a629]/20 text-[9px] font-bold uppercase block w-max font-sans">
                  Poupador Ativo
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mt-1 leading-normal font-sans">
                  O seu ecossistema de metas de poupança está saudável e estável.
                </p>
              </div>
            </div>
            
            <p className="text-[10px] sm:text-[11px] text-[#A2C7E5] border-t border-slate-800/60 pt-3">
              Dica: Falta apenas <span className="text-[#51a629] font-bold">180.000 Kz</span> para atingir o seu objetivo!
            </p>
          </div>

          {/* Tip of the day */}
          <div className="bg-[#053259]/30 border border-[#0869A6]/20 p-4 rounded-2xl sm:rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#51a629]/5 rounded-full blur-xl animate-pulse"></div>
            <div className="flex gap-2.5 relative">
              <div className="w-8 h-8 rounded-lg bg-[#51a629]/10 border border-[#51a629]/30 flex items-center justify-center text-[#51a629] shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-display">Dica FinFalo</h4>
                <p className="text-slate-300 text-[10px] sm:text-[11px] mt-1 leading-relaxed italic">
                  "{currentTip}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent movements and goals vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="fintech-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[9px] text-[#A2C7E5] font-mono font-bold uppercase tracking-wider block">Histórico Recente</span>
              <h2 className="text-sm font-display font-bold text-white mt-0.5 font-sans">Últimas Movimentações</h2>
            </div>
            <button
              onClick={() => onNavigate('Carteira')}
              className="text-[10px] sm:text-xs text-[#51a629] hover:text-[#278c36] font-bold flex items-center gap-0.5 group transition-all shrink-0 font-sans"
            >
              Ver Tudo <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 font-sans">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between hover:border-[#0869A6]/30 transition-all gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    tx.type === 'income' 
                      ? 'bg-[#51a629]/10 border-[#51a629]/25 text-[#51a629]' 
                      : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white leading-tight truncate">{tx.description}</h4>
                    <span className="text-[9px] text-[#A2C7E5] font-mono font-semibold block mt-0.5 truncate">{tx.date} • {tx.category}</span>
                  </div>
                </div>
                <div className={`text-xs font-bold font-mono shrink-0 ${tx.type === 'income' ? 'text-[#51a629]' : 'text-slate-300'}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} {currency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Targets / Goals Vault */}
        <div className="fintech-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div>
              <span className="text-[9px] text-[#A2C7E5] font-mono font-bold uppercase tracking-wider block">Cofres Inteligentes</span>
              <h2 className="text-sm font-display font-bold text-white mt-0.5 font-sans">Metas de Poupança</h2>
            </div>
            <button
              onClick={() => onNavigate('Objetivos')}
              className="text-[10px] sm:text-xs text-[#51a629] hover:text-[#278c36] font-bold flex items-center gap-0.5 group transition-all shrink-0 font-sans"
            >
              Ver Metas <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {goals.slice(0, 2).map((goal) => {
              const percentage = Math.round((goal.current / goal.target) * 100) || 0;
              return (
                <div key={goal.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-2">
                  <div className="flex justify-between items-center text-xs gap-2 min-w-0 font-sans">
                    <span className="font-bold text-white truncate">{goal.title}</span>
                    <span className="text-[#51a629] font-bold font-mono shrink-0">{percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#278c36] to-[#51a629] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold font-mono gap-1 min-w-0">
                    <span className="truncate">{goal.category}</span>
                    <span className="shrink-0">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {currency}</span>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs">
                Nenhum cofre ativo por agora.
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('Objetivos')}
            className="w-full py-2.5 mt-4 rounded-xl bg-[#51a629]/10 hover:bg-[#51a629]/20 border border-[#51a629]/20 text-xs text-[#51a629] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
          >
            Nova Meta <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Virtual Debit Card Modal Popup */}
      {activeCardPopup && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#053259] border border-[#0869A6]/40 p-6 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#51a629]/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between border-b border-[#0869A6]/20 pb-2">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#51a629]" /> Cartões Virtuais FinFalo
              </h3>
              <button 
                onClick={() => setActiveCardPopup(false)} 
                className="text-slate-400 hover:text-white cursor-pointer font-bold text-xs bg-white/10 px-2 py-1 rounded-lg font-mono"
              >
                Fechar
              </button>
            </div>

            <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#0869A6] via-[#053259] to-slate-950 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A2C7E5] block">FinFalo Platinum</span>
                  <span className="text-[9px] font-mono text-[#51a629] block">DEBIT CARD</span>
                </div>
                <div className="w-8 h-6 rounded bg-gradient-to-r from-amber-400 to-amber-200 opacity-90 relative">
                  <div className="absolute inset-1 border border-amber-600/30 rounded-sm"></div>
                </div>
              </div>

              <div className="my-3 text-lg font-mono tracking-widest font-bold text-center">
                ••••  ••••  ••••  3569
              </div>

              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Titular</span>
                  <span className="font-bold uppercase tracking-wide truncate block max-w-[120px]">{userName}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Validade</span>
                  <span className="font-bold font-mono">12/31</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full bg-rose-500 opacity-90"></div>
                  <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Limite de Cartão:</span>
                <span className="text-white font-bold">500.000 Kz / Dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado do Cartão:</span>
                <span className="text-[#51a629] font-bold flex items-center gap-1">● Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pagamento Aproximação:</span>
                <span className="text-white font-bold">Ativado</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("O teu cartão virtual está sincronizado com o Apple Pay e Google Wallet!");
                setActiveCardPopup(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#51a629] hover:bg-[#278c36] text-slate-950 hover:text-white text-xs font-bold text-center transition-colors cursor-pointer"
            >
              Vincular à Carteira Móvel
            </button>
          </div>
        </div>
      )}

      {/* Banking Details Modal */}
      {showBankingDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <BankingDetailsCard
              accountType="personal"
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
