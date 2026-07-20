import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  ChevronRight,
  Award, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  UserCheck, 
  Building, 
  Trash2, 
  CheckCircle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { FinancialState, Transaction } from '../types';

interface BusinessDashboardProps {
  financialState: FinancialState;
  onNavigate: (tab: string) => void;
  onOpenQuickAction: (type: 'income' | 'expense' | 'goal') => void;
  onStartOnboarding: () => void;
  onUpdateState?: (updates: Partial<FinancialState>) => void;
}

export default function BusinessDashboard({
  financialState,
  onNavigate,
  onOpenQuickAction,
  onStartOnboarding,
  onUpdateState
}: BusinessDashboardProps) {
  // Business navigation inside the dashboard
  const [bizTab, setBizTab] = useState<'geral' | 'fluxo' | 'funcionarios' | 'clientes' | 'fornecedores'>('geral');

  // Business Addition Forms State
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empSalary, setEmpSalary] = useState('');

  const [showAddCli, setShowAddCli] = useState(false);
  const [cliName, setCliName] = useState('');
  const [cliEmail, setCliEmail] = useState('');
  const [cliPhone, setCliPhone] = useState('');
  const [cliStatus, setCliStatus] = useState('Ativo');

  const [showAddSup, setShowAddSup] = useState(false);
  const [supName, setSupName] = useState('');
  const [supCat, setSupCat] = useState('Internet');
  const [supContact, setSupContact] = useState('');

  const { 
    userName, 
    currency, 
    balance, 
    expenses, 
    transactions, 
    employees = [],
    clients = [],
    suppliers = []
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

  const isTestAccount = financialState.email && ['personal@finfalo.com', 'familia@finfalo.com', 'empresa@finfalo.com'].includes(financialState.email.toLowerCase());

  // Real revenues and costs calculated directly from all transactions
  const realIncomes = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const realExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, curr) => sum + curr.amount, 0);

  // Dynamic seed values for Company
  const companyBaseRevenues = isTestAccount ? 9500000 : 0;
  const companyBaseCosts = isTestAccount ? 6800000 : 0;

  const totalRevenues = isTestAccount ? (companyBaseRevenues + realIncomes) : realIncomes;
  const totalCosts = isTestAccount ? (companyBaseCosts + realExpenses) : realExpenses;
  const totalProfit = totalRevenues - totalCosts;

  // Handles adding business items
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empRole.trim() || !empSalary) return;
    const newEmp = {
      id: 'emp_' + Date.now(),
      name: empName,
      role: empRole,
      salary: parseFloat(empSalary)
    };
    
    // Create a business expense transaction automatically for the salaries category
    const autoTx: Transaction = {
      id: 'tx_emp_' + Date.now(),
      description: `Salário Pago: ${empName}`,
      amount: parseFloat(empSalary),
      type: 'expense',
      category: 'Salários',
      date: new Date().toISOString().split('T')[0]
    };

    if (onUpdateState) {
      onUpdateState({
        employees: [newEmp, ...employees],
        transactions: [autoTx, ...transactions],
        expenses: expenses + autoTx.amount,
        balance: balance - autoTx.amount
      });
    }
    
    setEmpName('');
    setEmpRole('');
    setEmpSalary('');
    setShowAddEmp(false);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    if (onUpdateState) {
      onUpdateState({ employees: updated });
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliName.trim() || !cliEmail.trim() || !cliPhone.trim()) return;
    const newCli = {
      id: 'cli_' + Date.now(),
      name: cliName,
      email: cliEmail,
      phone: cliPhone,
      status: cliStatus
    };
    if (onUpdateState) {
      onUpdateState({
        clients: [newCli, ...clients]
      });
    }
    setCliName('');
    setCliEmail('');
    setCliPhone('');
    setCliStatus('Ativo');
    setShowAddCli(false);
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    if (onUpdateState) {
      onUpdateState({ clients: updated });
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supContact.trim()) return;
    const newSup = {
      id: 'sup_' + Date.now(),
      name: supName,
      category: supCat,
      contact: supContact
    };
    if (onUpdateState) {
      onUpdateState({
        suppliers: [newSup, ...suppliers]
      });
    }
    setSupName('');
    setSupContact('');
    setShowAddSup(false);
  };

  const handleDeleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    if (onUpdateState) {
      onUpdateState({ suppliers: updated });
    }
  };

  // Dynamic breakdown of company costs by categories
  const getCompanyCategoriesCosts = () => {
    const baseSalaries = isTestAccount ? 800000 : 0;
    const baseInternet = isTestAccount ? 150000 : 0;
    const baseCompras = isTestAccount ? 100000 : 0;
    const baseEnergia = isTestAccount ? 80000 : 0;
    const baseImpostos = isTestAccount ? 120000 : 0;
    
    const dynamicSalaries = transactions
      .filter(t => t.type === 'expense' && t.category === 'Salários')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const dynamicInternet = transactions
      .filter(t => t.type === 'expense' && t.category === 'Internet')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const dynamicCompras = transactions
      .filter(t => t.type === 'expense' && (t.category === 'Compras' || t.category === 'Outros'))
      .reduce((sum, curr) => sum + curr.amount, 0);

    const dynamicEnergia = transactions
      .filter(t => t.type === 'expense' && t.category === 'Energia')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const dynamicImpostos = transactions
      .filter(t => t.type === 'expense' && t.category === 'Impostos')
      .reduce((sum, curr) => sum + curr.amount, 0);

    return [
      { name: 'Salários', value: baseSalaries + dynamicSalaries, color: 'bg-indigo-500' },
      { name: 'Internet', value: baseInternet + dynamicInternet, color: 'bg-sky-500' },
      { name: 'Compras', value: baseCompras + dynamicCompras, color: 'bg-emerald-500' },
      { name: 'Energia', value: baseEnergia + dynamicEnergia, color: 'bg-amber-500' },
      { name: 'Impostos', value: baseImpostos + dynamicImpostos, color: 'bg-rose-500' }
    ];
  };

  const bizCategoriesCosts = getCompanyCategoriesCosts();

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Onboarding Banner */}
      {financialState.showOnboardingAlert && (
        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-100 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-400 font-display">Configure o perfil da sua Empresa</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">Conclua o assistente de configuração rápida para desbloquear análises corporativas ultra-precisas.</p>
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

      {/* Profiling Progress */}
      <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl sm:rounded-3xl flex items-center justify-between gap-4 text-slate-100 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 text-xs font-bold font-display">
            <span className="text-slate-300">Nível de Conclusão do Perfil Empresarial</span>
            <span className="text-[#51a629] font-mono">{profileCompletion}%</span>
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

      <div className="space-y-5">
        {/* Business Tabs Navigation Bar */}
        <div className="flex bg-slate-950/80 p-1 border border-slate-850 rounded-2xl overflow-x-auto gap-1 no-scrollbar scroll-smooth">
          {[
            { id: 'geral', label: 'Gestor Geral', icon: Building },
            { id: 'fluxo', label: 'Fluxo de Caixa', icon: TrendingUp },
            { id: 'funcionarios', label: 'Funcionários', icon: Users },
            { id: 'clientes', label: 'Clientes', icon: UserCheck },
            { id: 'fornecedores', label: 'Fornecedores', icon: Briefcase }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = bizTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBizTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-display cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-tr from-[#278c36] to-[#51a629] text-white shadow-lg shadow-[#51a629]/10' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Business Tab: Geral (Gestor Geral) */}
        {bizTab === 'geral' && (
          <div className="space-y-6">
            {/* Top Business Performance Hero Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#053259] via-[#064a7f] to-[#0869A6] p-4 sm:p-6 text-white shadow-xl border border-[#0869A6]/40 transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#51a629]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex items-center justify-between relative z-10 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#51a629]/15 border border-[#51a629]/30 flex items-center justify-center text-[#51a629] shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#A2C7E5] font-display font-medium tracking-wider uppercase block">Gestão Empresarial</span>
                    <h2 className="text-sm sm:text-base font-display font-black text-white -mt-0.5 tracking-tight truncate font-sans">
                      {userName} <span className="text-[#51a629]">●</span>
                    </h2>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[9px] font-mono text-slate-100 flex items-center gap-1 font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#51a629] animate-pulse"></span>
                  <span>PME Gestor</span>
                </div>
              </div>

              <div className="mt-6 relative z-10">
                <span className="text-[#A2C7E5] text-[10px] uppercase tracking-widest font-semibold font-display">Saldo Corporativo</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white leading-tight mt-0.5">
                  {formatVal(balance)}
                </h1>
              </div>

              {/* Corporate Quick Actions inside company card */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-6 relative z-10">
                <button
                  onClick={() => onOpenQuickAction('income')}
                  className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm hover:shadow-md truncate font-sans"
                >
                  <Plus className="w-3.5 h-3.5 text-[#51a629] stroke-[3] shrink-0" /> <span className="truncate">Registar Receita</span>
                </button>
                <button
                  onClick={() => onOpenQuickAction('expense')}
                  className="py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-[#51a629] hover:bg-[#278c36] active:scale-95 text-[10px] sm:text-xs font-bold text-white transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-[#278c36]/20 border border-[#51a629] truncate font-sans"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0" /> <span className="truncate">Registar Custo</span>
                </button>
              </div>
            </div>

            {/* DOWNHILL CASH FLOW REPORT */}
            <div className="space-y-3">
              <h3 className="text-xs font-display font-bold text-[#A2C7E5] uppercase tracking-widest pl-1">Estrutura de Resultados (Fluxo Descendente)</h3>
              
              <div className="flex flex-col items-center gap-2">
                {/* Card 1: Receitas */}
                <div className="w-full bg-[#053259]/20 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Faturamento / Receitas</span>
                      <h4 className="text-base font-display font-black text-white mt-0.5">{formatVal(totalRevenues)}</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">Entradas</span>
                </div>

                {/* Down Arrow 1 */}
                <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[#51a629] shrink-0 font-black animate-bounce shadow-md">
                  ↓
                </div>

                {/* Card 2: Custos */}
                <div className="w-full bg-[#053259]/20 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500" />
                  <div className="flex items-center gap-3 pl-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Custos Operacionais</span>
                      <h4 className="text-base font-display font-black text-white mt-0.5">{formatVal(totalCosts)}</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-md">Saídas</span>
                </div>

                {/* Down Arrow 2 */}
                <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[#51a629] shrink-0 font-black animate-bounce shadow-md">
                  ↓
                </div>

                {/* Card 3: Lucro */}
                <div className="w-full bg-slate-900 border border-[#51a629]/40 p-5 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden filter drop-shadow-[0_0_15px_rgba(81,166,41,0.1)]">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#51a629]" />
                  <div className="flex items-center gap-3.5 pl-2">
                    <div className="w-10 h-10 rounded-xl bg-[#51a629]/20 border border-[#51a629]/30 text-[#51a629] flex items-center justify-center shrink-0 filter drop-shadow-[0_0_8px_rgba(81,166,41,0.3)]">
                      <Award className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#51a629] uppercase tracking-widest font-black">Resultado Líquido / Lucro</span>
                      <h4 className="text-lg font-display font-black text-[#51a629] mt-0.5">{formatVal(totalProfit)}</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-white bg-gradient-to-tr from-[#278c36] to-[#51a629] border border-[#51a629]/35 px-2 py-0.5 rounded-md">Ativo</span>
                </div>
              </div>
            </div>

            {/* Quick stats widget for Employees, Clients, Suppliers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => setBizTab('funcionarios')}
                className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group hover:border-[#51a629]/30 transition-colors"
              >
                <Users className="w-5 h-5 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Funcionários</span>
                <span className="text-sm font-display font-black text-white mt-0.5">{employees.length}</span>
              </button>
              <button 
                onClick={() => setBizTab('clientes')}
                className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group hover:border-[#51a629]/30 transition-colors"
              >
                <UserCheck className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Clientes</span>
                <span className="text-sm font-display font-black text-white mt-0.5">{clients.length}</span>
              </button>
              <button 
                onClick={() => setBizTab('fornecedores')}
                className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group hover:border-[#51a629]/30 transition-colors"
              >
                <Briefcase className="w-5 h-5 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Fornecedores</span>
                <span className="text-sm font-display font-black text-white mt-0.5">{suppliers.length}</span>
              </button>
            </div>
          </div>
        )}

        {/* Business Tab: Fluxo */}
        {bizTab === 'fluxo' && (
          <div className="space-y-6">
            <div className="fintech-card p-5 rounded-3xl space-y-4">
              <div>
                <span className="text-[9px] text-[#51a629] font-mono font-bold uppercase tracking-wider block">Relatórios Empresariais</span>
                <h2 className="text-sm sm:text-base font-display font-bold text-white mt-0.5">Distribuição de Custos por Categoria</h2>
                <p className="text-[10px] text-slate-400">Classificação dos principais custos empresariais e operacionais.</p>
              </div>

              <div className="space-y-3.5">
                {bizCategoriesCosts.map((cat, idx) => {
                  const pct = Math.round((cat.value / totalCosts) * 100) || 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white font-display flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                          {cat.name}
                        </span>
                        <span className="text-slate-300 font-mono font-bold">
                          {formatVal(cat.value)} <span className="text-slate-500 text-[10px] font-semibold">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${pct}%`,
                            backgroundColor: cat.name === 'Salários' ? '#6366f1' : cat.name === 'Internet' ? '#0ea5e9' : cat.name === 'Compras' ? '#10b981' : cat.name === 'Energia' ? '#f59e0b' : '#f43f5e'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Custos Totais Computados:</span>
                <span className="text-white">{formatVal(totalCosts)}</span>
              </div>
            </div>

            {/* Cash flow recent business invoices */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">Histórico de Transações de Empresa</h3>
                <button 
                  onClick={() => onNavigate('Carteira')} 
                  className="text-[10px] text-[#51a629] hover:underline font-bold"
                >
                  Ver Tudo
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {transactions.filter(t => ['Vendas', 'Compras', 'Salários', 'Energia', 'Internet', 'Impostos', 'Outros'].includes(t.category) || t.id.startsWith('tx_emp_')).map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                        tx.type === 'income' ? 'bg-[#51a629]/10 border-[#51a629]/20 text-[#51a629]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
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
        )}

        {/* Business Tab: Funcionários */}
        {bizTab === 'funcionarios' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-display font-bold text-white">Funcionários Cadastrados</h3>
                <p className="text-[10px] text-slate-400">Gerir pessoal, cargos e folha salarial.</p>
              </div>
              <button
                onClick={() => setShowAddEmp(!showAddEmp)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 shrink-0 font-display"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            {/* Expandable Add Employee Form */}
            {showAddEmp && (
              <form onSubmit={handleAddEmployee} className="p-4 bg-slate-950 border border-[#51a629]/25 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-widest font-mono">Novo Funcionário</span>
                  <button type="button" onClick={() => setShowAddEmp(false)} className="text-slate-500 hover:text-white font-bold text-xs">X</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: João Silva" 
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Cargo / Função</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Técnico de Suporte" 
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Salário Mensal (Kz)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Ex: 150000" 
                    value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Adicionar à Folha e Contratar
                </button>
              </form>
            )}

            {/* Employee list */}
            <div className="space-y-2.5">
              {employees.map((emp) => (
                <div key={emp.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{emp.name}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{emp.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Salário</span>
                      <span className="font-bold font-mono text-white">{emp.salary.toLocaleString()} Kz</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                      title="Demitir / Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="text-center py-8 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum funcionário cadastrado.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Tab: Clientes */}
        {bizTab === 'clientes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-display font-bold text-white">Carteira de Clientes</h3>
                <p className="text-[10px] text-slate-400">Lista de parceiros corporativos e estado de faturas.</p>
              </div>
              <button
                onClick={() => setShowAddCli(!showAddCli)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 shrink-0 font-display"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            {/* Expandable Add Client Form */}
            {showAddCli && (
              <form onSubmit={handleAddClient} className="p-4 bg-slate-950 border border-[#51a629]/25 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-widest font-mono">Novo Cliente</span>
                  <button type="button" onClick={() => setShowAddCli(false)} className="text-slate-500 hover:text-white font-bold text-xs">X</button>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Nome da Empresa / Cliente</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Unitel Luanda" 
                      value={cliName}
                      onChange={(e) => setCliName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">E-mail de Contacto</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="Ex: financas@unitel.ao" 
                        value={cliEmail}
                        onChange={(e) => setCliEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Telefone</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="Ex: 934882299" 
                        value={cliPhone}
                        onChange={(e) => setCliPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Estado de Faturação Inicial</label>
                    <select
                      value={cliStatus}
                      onChange={(e) => setCliStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                      <option value="Ativo" className="bg-slate-900 text-white">Ativo (Fatura Sincronizada)</option>
                      <option value="Pendente" className="bg-slate-900 text-white">Pendente (Aguardando Pagamento)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cadastrar Cliente Corporativo
                </button>
              </form>
            )}

            {/* Client list */}
            <div className="space-y-2.5">
              {clients.map((cli) => (
                <div key={cli.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{cli.name}</h4>
                        <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                          cli.status === 'Ativo' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {cli.status === 'Ativo' ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                          {cli.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteClient(cli.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/40 p-2 rounded-xl border border-slate-850/50">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{cli.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cliPhone || cli.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="text-center py-8 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum cliente cadastrado.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Tab: Fornecedores */}
        {bizTab === 'fornecedores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-display font-bold text-white">Fornecedores Homologados</h3>
                <p className="text-[10px] text-slate-400">Gerir contratos de utilidades de Internet, Energia, etc.</p>
              </div>
              <button
                onClick={() => setShowAddSup(!showAddSup)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 shrink-0 font-display"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>

            {/* Expandable Add Supplier Form */}
            {showAddSup && (
              <form onSubmit={handleAddSupplier} className="p-4 bg-slate-950 border border-[#51a629]/25 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-1 border-b border-slate-800">
                  <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-widest font-mono">Novo Fornecedor</span>
                  <button type="button" onClick={() => setShowAddSup(false)} className="text-slate-500 hover:text-white font-bold text-xs">X</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Nome Fantasia / Fornecedor</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: ENDE Luanda" 
                      value={supName}
                      onChange={(e) => setSupName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">Categoria de Serviço</label>
                    <select
                      value={supCat}
                      onChange={(e) => setSupCat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                      <option value="Internet">Internet</option>
                      <option value="Energia">Energia</option>
                      <option value="Impostos">Impostos</option>
                      <option value="Compras">Compras</option>
                      <option value="Salários">Salários</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase tracking-wider mb-1">E-mail / Contacto Corporativo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: comercial@ende.ao" 
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Registrar Fornecedor
                </button>
              </form>
            )}

            {/* Supplier list */}
            <div className="space-y-2.5">
              {suppliers.map((sup) => (
                <div key={sup.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{sup.name}</h4>
                      <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-400/10 border border-sky-400/15 px-2 py-0.5 rounded-md mt-1 inline-block uppercase">{sup.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Contacto Contractual</span>
                      <span className="font-mono text-[10px] text-slate-300">{sup.contact}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSupplier(sup.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {suppliers.length === 0 && (
                <div className="text-center py-8 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum fornecedor cadastrado.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
