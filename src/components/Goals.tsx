import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Trash2, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Award
} from 'lucide-react';
import { FinancialState, Goal } from '../types';

interface GoalsProps {
  financialState: FinancialState;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onContributeGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export default function Goals({ 
  financialState, 
  onAddGoal, 
  onContributeGoal, 
  onDeleteGoal 
}: GoalsProps) {
  const { currency, goals, balance } = financialState;

  // New goal form state
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('0');
  const [category, setCategory] = useState('Tecnologia');

  // Contribution popup state
  const [contributingId, setContributingId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Simulator state
  const [simTarget, setSimTarget] = useState('500000');
  const [simMonthly, setSimMonthly] = useState('25000');
  const [simMonthsResult, setSimMonthsResult] = useState<number | null>(20);

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !target) return;

    onAddGoal({
      title,
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      category
    });

    setTitle('');
    setTarget('');
    setCurrent('0');
    setCategory('Tecnologia');
  };

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributingId || !contributionAmount) return;

    const amountNum = parseFloat(contributionAmount);
    if (amountNum > 0) {
      onContributeGoal(contributingId, amountNum);
    }

    setContributingId(null);
    setContributionAmount('');
  };

  const calculateSimulation = (targetVal: number, monthlyVal: number) => {
    if (monthlyVal <= 0) return null;
    return Math.ceil(targetVal / monthlyVal);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(simTarget) || 0;
    const m = parseFloat(simMonthly) || 0;
    setSimMonthsResult(calculateSimulation(t, m));
  };

  const categories = ['Tecnologia', 'Viagens', 'Carro', 'Casa', 'Investimentos', 'Fundo de Emergência', 'Outros'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Objetivos & Metas de Poupança</h1>
        <p className="text-xs text-slate-400">Desenha o teu futuro financeiro definindo objetivos claros e guardando dinheiro no cofre virtual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Goals Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const percentage = Math.round((goal.current / goal.target) * 100);
              const remaining = goal.target - goal.current;

              return (
                <div key={goal.id} className="fintech-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                  
                  {/* Category badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold font-display">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900/50 transition-colors"
                      title="Remover meta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Goal title */}
                  <div className="mt-3">
                    <h3 className="text-base font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Falta guardar: <span className="text-emerald-400 font-bold font-mono">{remaining > 0 ? remaining.toLocaleString() : 0} {currency}</span>
                    </p>
                  </div>

                  {/* Progress bar and values */}
                  <div className="my-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold font-mono">{percentage}% concluído</span>
                      <span className="text-slate-300 font-mono font-medium">
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {currency}
                      </span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 filter drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Contribution CTA */}
                  <button
                    onClick={() => setContributingId(goal.id)}
                    className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/20 hover:border-transparent text-xs text-emerald-400 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Contribuir para Meta
                  </button>
                </div>
              );
            })}

            {goals.length === 0 && (
              <div className="col-span-2 text-center py-16 bg-slate-950/20 border border-slate-800/60 rounded-2xl p-6 text-slate-400 text-sm">
                <Target className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-600 animate-pulse" />
                Ainda não tens objetivos criados. Desenha um objetivo à direita para começares a poupar!
              </div>
            )}
          </div>

          {/* Savings Simulator */}
          <div className="fintech-card p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Simulador de Objetivos
            </h2>
            <p className="text-xs text-slate-400">Descobre quanto tempo precisas para atingir os teus objetivos com base no teu compromisso mensal.</p>

            <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Valor da Meta ({currency})</label>
                <input
                  type="number"
                  required
                  value={simTarget}
                  onChange={(e) => setSimTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Poupança Mensal Planeada ({currency})</label>
                <input
                  type="number"
                  required
                  value={simMonthly}
                  onChange={(e) => setSimMonthly(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between bg-slate-950 p-4 border border-slate-800 rounded-xl mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-display">Tempo Estimado</span>
                  <p className="text-2xl font-display font-black text-white mt-0.5">
                    {simMonthsResult !== null ? `${simMonthsResult} meses` : 'Indefinido'}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  Calcular Tempo
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column: Create Goal Form & Cofre summary */}
        <div className="space-y-6">
          {/* Create Goal Form */}
          <div className="fintech-card p-5 rounded-2xl">
            <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Criar Nova Meta
            </h3>
            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Título do Objetivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Comprar Computador, Viagem, Carro..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Valor Alvo ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0.00"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Valor Inicial ({currency})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition-colors text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Criar Meta
              </button>
            </form>
          </div>

          {/* Cofre Virtual (Virtual Vault Info) */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Plus className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-display">Cofre Virtual</h4>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                  O dinheiro guardado para as tuas metas é descontado do teu Saldo Disponível para evitar que o gastes por acidente. É a tua proteção de disciplina financeira inteligente.
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] text-emerald-400 font-bold font-mono">
                  <Award className="w-4 h-4" /> 2026 FinFalo Cofres Ativos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Popup Modal */}
      {contributingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/20 p-6 rounded-2xl space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div>
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Guardar no Cofre
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Introduz a quantia a adicionar a este objetivo. O valor será transferido do teu Saldo Disponível.
              </p>
            </div>

            <form onSubmit={handleContributionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Montante ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0.00"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setContributingId(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors cursor-pointer"
                >
                  Depositar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
