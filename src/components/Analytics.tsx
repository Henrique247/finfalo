import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar, 
  Award, 
  ArrowDownRight, 
  ArrowUpRight, 
  Download, 
  Briefcase,
  AlertCircle,
  FileText
} from 'lucide-react';
import { FinancialState } from '../types';

interface AnalyticsProps {
  financialState: FinancialState;
}

export default function Analytics({ financialState }: AnalyticsProps) {
  const [reportPeriod, setReportPeriod] = useState<'mensal' | 'anual'>('mensal');
  const { currency, balance, incomes, expenses, healthScore, transactions } = financialState;

  // Compute category spend totals for analytics
  const getCategorySpendTotals = () => {
    const categoriesTotals: Record<string, number> = {};
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoriesTotals[t.category] = (categoriesTotals[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      }
    });

    return Object.entries(categoriesTotals).map(([cat, amount]) => ({
      category: cat,
      amount: amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  };

  const spendCategories = getCategorySpendTotals();

  // Helper mock trigger for PDF export
  const [isExporting, setIsExporting] = useState(false);
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Relatório PDF Gerado com Sucesso! O download do ficheiro "FinFalo_Relatorio_Financeiro.pdf" iniciou no teu browser.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Análise Inteligente & Relatórios</h1>
          <p className="text-xs text-slate-400">Verifica gráficos de performance aprofundados e gera relatórios instantâneos.</p>
        </div>
        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl self-start md:self-center">
          <button
            onClick={() => setReportPeriod('mensal')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              reportPeriod === 'mensal'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Relatório Mensal
          </button>
          <button
            onClick={() => setReportPeriod('anual')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              reportPeriod === 'anual'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Relatório Anual
          </button>
        </div>
      </div>

      {/* Main Grid: Comparison & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Comparison card (Receipts x Expenses) */}
        <div className="fintech-card p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Evolução de Fluxo de Caixa</h2>
            <p className="text-xs text-slate-400">Visão das tuas receitas e despesas acumuladas no período</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
              <span className="text-[10px] text-slate-400 font-display font-semibold uppercase tracking-wider block">Entradas Totais</span>
              <p className="text-xl font-display font-black text-emerald-400 text-glow-green mt-1">
                +{incomes.toLocaleString()} {currency}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Fluxo de Caixa Positivo</span>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
              <span className="text-[10px] text-slate-400 font-display font-semibold uppercase tracking-wider block">Saídas Totais</span>
              <p className="text-xl font-display font-black text-rose-400 mt-1">
                -{expenses.toLocaleString()} {currency}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Fluxo de Caixa Negativo</span>
            </div>
          </div>

          {/* Interactive cashflow bar */}
          <div className="space-y-2 bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Receitas ({Math.round((incomes / (incomes + expenses || 1)) * 100)}%)</span>
              <span className="font-semibold text-rose-400">Despesas ({Math.round((expenses / (incomes + expenses || 1)) * 100)}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                style={{ width: `${(incomes / (incomes + expenses || 1)) * 100}%` }}
              />
              <div 
                className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
                style={{ width: `${(expenses / (incomes + expenses || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Saldo Líquido Retido este mês: <span className="text-emerald-400 font-bold font-mono">{(incomes - expenses).toLocaleString()} {currency}</span>
            </p>
          </div>
        </div>

        {/* Health scorecard */}
        <div className="fintech-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Score de Saúde Financeira
            </h2>
            <p className="text-xs text-slate-400">Avaliação do teu ecossistema de investimentos</p>
          </div>

          {/* Circular dial container */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-display font-black text-white">{healthScore}</span>
                <span className="text-xs text-slate-500 block">/100</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-display uppercase tracking-wider">
                Boa Gestão
              </span>
            </div>
          </div>

          {/* Smart suggestion paragraph */}
          <div className="border-t border-slate-800 pt-4 text-xs text-slate-300">
            <p className="flex items-start gap-1.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                "Este mês gastaste <strong className="text-white">18% menos</strong> em lazer e transporte. Excelente iniciativa! Continua com este padrão para maximizar os teus cofres."
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Categories Spend Analysis Table & Report Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Categorized spending details */}
        <div className="fintech-card p-6 rounded-2xl lg:col-span-2">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieChart className="w-4.5 h-4.5 text-emerald-400" /> Detalhe de Gastos por Categoria
          </h2>

          <div className="space-y-4">
            {spendCategories.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-300 font-medium">{item.category}</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {item.amount.toLocaleString()} {currency} ({item.percentage}%)
                  </span>
                </div>
                {/* Visual bar tracker */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {spendCategories.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">
                Ainda não foram registadas despesas para análise categórica.
              </div>
            )}
          </div>
        </div>

        {/* Report Exporter & PDF simulation card */}
        <div className="fintech-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-2">Exportar Ficheiros</h2>
            <p className="text-xs text-slate-400">Garante a portabilidade dos teus dados exportando extratos e análises em tempo real.</p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl my-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">FinFalo_Extrato_Completo</span>
                <span className="text-[9px] text-slate-500 font-mono block uppercase">PDF / XLS FORMAT</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              O relatório consolida as transações, percentagens de categorias, saldo retido e evolução patrimonial.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isExporting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
          >
            <Download className="w-4 h-4 animate-bounce" /> 
            {isExporting ? 'A Exportar Relatório...' : 'Exportar Relatório PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
