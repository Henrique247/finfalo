import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Award, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  UserCheck, 
  Building2, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Download,
  FileText,
  DollarSign,
  PieChart,
  Receipt,
  Search,
  Filter,
  ShieldCheck,
  Building,
  CreditCard,
  ArrowRightLeft,
  X,
  Shield
} from 'lucide-react';
import { FinancialState, Transaction } from '../types';
import { generateFinancialReportPDF, generateInvoicePDF } from '../utils/pdfGenerator';
import BankingDetailsCard from './BankingDetailsCard';

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
  // Navigation tab inside Company dashboard
  const [bizTab, setBizTab] = useState<'geral' | 'fluxo' | 'funcionarios' | 'clientes' | 'fornecedores'>('geral');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Expandable Forms State
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

  // Banking details modal state
  const [showBankingDetails, setShowBankingDetails] = useState(false);

  // Small Entrepreneur: Pro-Labore transfer modal state
  const [showProLaboreModal, setShowProLaboreModal] = useState(false);
  const [proLaboreAmount, setProLaboreAmount] = useState('');
  const [proLaboreNote, setProLaboreNote] = useState('');
  const [proLaboreMsg, setProLaboreMsg] = useState('');

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

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    let completion = 20;
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

  // Calculations for Company
  const realIncomes = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const realExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const companyBaseRevenues = isTestAccount ? 9500000 : 0;
  const companyBaseCosts = isTestAccount ? 6800000 : 0;

  const totalRevenues = isTestAccount ? (companyBaseRevenues + realIncomes) : realIncomes;
  const totalCosts = isTestAccount ? (companyBaseCosts + realExpenses) : realExpenses;
  const totalProfit = totalRevenues - totalCosts;
  const profitMargin = totalRevenues > 0 ? ((totalProfit / totalRevenues) * 100).toFixed(1) : '0';

  // Total payroll amount
  const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

  // Business item management handlers
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empRole.trim() || !empSalary) return;
    const newEmp = {
      id: 'emp_' + Date.now(),
      name: empName.trim(),
      role: empRole.trim(),
      salary: parseFloat(empSalary)
    };
    
    const autoTx: Transaction = {
      id: 'tx_emp_' + Date.now(),
      description: `Salário Pago: ${empName.trim()}`,
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
      name: cliName.trim(),
      email: cliEmail.trim(),
      phone: cliPhone.trim(),
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
      name: supName.trim(),
      category: supCat,
      contact: supContact.trim()
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

  const handleProLaboreTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(proLaboreAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (amt > balance) {
      setProLaboreMsg(`Saldo insuficiente no negócio. Disponível: ${formatVal(balance)}`);
      return;
    }

    const bizExpenseTx: Transaction = {
      id: 'tx_prolabore_exp_' + Date.now(),
      description: `Retirada de Pró-Labore (Transferência para Casa) - ${proLaboreNote || 'Comércio Local'}`,
      amount: amt,
      type: 'expense',
      category: 'Salários',
      date: new Date().toISOString().split('T')[0]
    };

    const personalIncomeTx: Transaction = {
      id: 'tx_prolabore_inc_' + (Date.now() + 1),
      description: `Pró-Labore do Negócio recebido na Conta Pessoal`,
      amount: amt,
      type: 'income',
      category: 'Salário',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedTxs = [bizExpenseTx, personalIncomeTx, ...transactions];

    if (onUpdateState) {
      onUpdateState({
        transactions: updatedTxs,
        balance: balance - amt
      });
    }

    setProLaboreMsg(`Sucesso! ${amt.toLocaleString()} ${currency} transferidos com segurança do negócio para a sua conta de casa!`);
    setTimeout(() => {
      setShowProLaboreModal(false);
      setProLaboreAmount('');
      setProLaboreNote('');
      setProLaboreMsg('');
    }, 2000);
  };

  const handleDeleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    if (onUpdateState) {
      onUpdateState({ suppliers: updated });
    }
  };

  // Cost breakdown categories
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
      { name: 'Salários & Pessoal', value: baseSalaries + dynamicSalaries, color: 'bg-indigo-500' },
      { name: 'Comunicações & Internet', value: baseInternet + dynamicInternet, color: 'bg-sky-500' },
      { name: 'Compras & Stock', value: baseCompras + dynamicCompras, color: 'bg-emerald-500' },
      { name: 'Energia & Utilidades', value: baseEnergia + dynamicEnergia, color: 'bg-amber-500' },
      { name: 'Impostos & Taxas', value: baseImpostos + dynamicImpostos, color: 'bg-rose-500' }
    ];
  };

  const bizCategoriesCosts = getCompanyCategoriesCosts();

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* Onboarding Alert Banner */}
      {financialState.showOnboardingAlert && (
        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-100 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-400 font-display">Configure o perfil corporativo da sua Empresa</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">Complete o assistente para sincronizar relatórios de fluxo de caixa e impostos empresariais.</p>
            </div>
          </div>
          <button
            onClick={onStartOnboarding}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer self-stretch sm:self-auto text-center font-display shadow-md shrink-0"
          >
            Completar Agora
          </button>
        </div>
      )}

      {/* Corporate Profile Completion Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 text-xs font-bold font-display">
            <span className="text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#51a629]" />
              Nível de Conformidade & Configuração da Empresa
            </span>
            <span className="text-[#51a629] font-mono">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800/60 p-0.5">
            <div 
              className="bg-gradient-to-r from-[#278c36] via-[#51a629] to-emerald-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(81,166,41,0.5)]"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
        {profileCompletion < 100 && (
          <button
            onClick={onStartOnboarding}
            className="text-xs bg-[#51a629]/10 text-[#51a629] hover:bg-[#51a629]/20 font-bold px-4 py-2.5 rounded-xl border border-[#51a629]/30 transition-all cursor-pointer whitespace-nowrap font-display text-center"
          >
            Completar Perfil
          </button>
        )}
      </div>

      {/* Top Corporate Hero & Executive KPI Cards Grid */}
      <div className="space-y-4">
        
        {/* Main Executive Corporate Header Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#031c33] via-[#053259] to-[#0869A6] p-5 sm:p-7 text-white shadow-2xl border border-[#0869A6]/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#51a629]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#278c36] to-[#51a629] border border-white/20 flex items-center justify-center text-white shadow-lg shadow-[#51a629]/25 shrink-0">
                <Building className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#A2C7E5] font-mono font-bold tracking-widest uppercase">Gestão Corporativa PME</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#51a629]/20 text-[#51a629] border border-[#51a629]/30">NIF Sincronizado</span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-display font-black text-white truncate leading-tight mt-0.5">
                  {userName} <span className="text-[#51a629]">●</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              <button
                onClick={() => setShowBankingDetails(true)}
                className="px-3.5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all font-display shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span>IBAN & Referência do Negócio</span>
              </button>
              <button
                onClick={() => generateFinancialReportPDF(financialState, 'Relatório Executivo Empresarial')}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all font-display shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Exportar PDF</span>
              </button>
              <button
                onClick={() => generateInvoicePDF(financialState, {
                  invoiceNumber: `FT2026-${Math.floor(1000 + Math.random() * 9000)}`,
                  clientName: clients[0]?.name || 'Cliente Corporativo',
                  clientEmail: clients[0]?.email || 'financeiro@empresa.ao',
                  clientPhone: clients[0]?.phone || '+244 923 000 000',
                  items: [
                    { description: 'Prestação de Serviços de Consultoria Financeira', qty: 1, unitPrice: 250000 },
                    { description: 'Licença de Software FinFalo Enterprise', qty: 1, unitPrice: 150000 }
                  ],
                  taxRate: 14,
                  notes: 'Pagamento por transferência bancária Iban AO06.0040.0000.1234.5678.9012.3. Vencimento a 15 dias.'
                })}
                className="px-3.5 py-2.5 rounded-xl bg-[#51a629] hover:bg-[#278c36] text-white border border-[#51a629] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all font-display shadow-lg shadow-[#51a629]/20"
              >
                <FileText className="w-4 h-4" />
                <span>Emitir Fatura</span>
              </button>
            </div>
          </div>

          {/* Corporate Balance & Quick Actions */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 items-center relative z-10">
            <div className="lg:col-span-2 space-y-1">
              <span className="text-[#A2C7E5] text-[11px] font-mono font-bold uppercase tracking-widest block">
                Saldo Bancário Corporativo Disponível
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white">
                  {formatVal(balance)}
                </h2>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                  Conta Ativa
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onOpenQuickAction('income')}
                className="py-3 px-3 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm font-sans truncate"
              >
                <Plus className="w-4 h-4 text-[#51a629] stroke-[3] shrink-0" />
                <span className="truncate">Entrada / Receita</span>
              </button>
              <button
                onClick={() => onOpenQuickAction('expense')}
                className="py-3 px-3 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs font-bold text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md font-sans truncate"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3] shrink-0" />
                <span className="truncate">Saída / Custo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Metrics Cards Grid (4 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Faturamento */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-3 shadow-sm hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Faturamento Total</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">{formatVal(totalRevenues)}</h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> Entradas Operacionais
              </span>
            </div>
          </div>

          {/* Card 2: Custos Operacionais */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-3 shadow-sm hover:border-rose-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Custos & Despesas</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">{formatVal(totalCosts)}</h3>
              <span className="text-[10px] text-rose-400 font-mono font-bold flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3" /> Saídas Registadas
              </span>
            </div>
          </div>

          {/* Card 3: Lucro Líquido */}
          <div className="bg-slate-900 border border-[#51a629]/30 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-3 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#51a629]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-widest font-mono">Lucro Líquido</span>
              <div className="w-8 h-8 rounded-xl bg-[#51a629]/20 text-[#51a629] flex items-center justify-center shrink-0 border border-[#51a629]/30">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#51a629]">{formatVal(totalProfit)}</h3>
              <span className="text-[10px] text-slate-300 font-mono font-bold flex items-center gap-1 mt-1">
                Margem: <span className="text-[#51a629]">{profitMargin}%</span>
              </span>
            </div>
          </div>

          {/* Card 4: Massa Salarial & Pessoal */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-3 shadow-sm hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Folha de Salários</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">{formatVal(totalPayroll)}</h3>
              <span className="text-[10px] text-indigo-400 font-mono font-bold block mt-1">
                {employees.length} Colaboradores Activos
              </span>
            </div>
          </div>

        </div>

        {/* Small Entrepreneurs Feature: Separation of Business vs Personal Funds */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#51a629]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#51a629]/20 text-[#51a629] border border-[#51a629]/30 uppercase tracking-wider">
                  Solução para Pequeno Negócio & Comércio Local
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sem Misturar as Contas</span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2 mt-1">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                Separação do Dinheiro de Casa vs. Dinheiro do Negócio
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pequenos empreendedores frequentemente misturam as despesas de casa com o faturamento do negócio. O FinFalo protege as contas da sua família permitindo transferir um <strong>Pró-Labore fixo</strong> da empresa para a sua conta pessoal de forma organizada e auditada.
              </p>
            </div>

            <button
              onClick={() => setShowProLaboreModal(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#278c36] to-[#51a629] hover:from-[#51a629] hover:to-emerald-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#51a629]/25 transition-all cursor-pointer shrink-0"
            >
              <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Retirar Pró-Labore para Casa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Corporate Section with Tabs */}
      <div className="space-y-5">
        
        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-950 p-1.5 border border-slate-800 rounded-2xl overflow-x-auto gap-1 no-scrollbar scroll-smooth">
          {[
            { id: 'geral', label: 'Painel Executivo', icon: Building2 },
            { id: 'fluxo', label: 'Fluxo de Caixa', icon: TrendingUp },
            { id: 'funcionarios', label: `Funcionários (${employees.length})`, icon: Users },
            { id: 'clientes', label: `Clientes (${clients.length})`, icon: UserCheck },
            { id: 'fornecedores', label: `Fornecedores (${suppliers.length})`, icon: Briefcase }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = bizTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBizTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-display cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
                  isActive 
                    ? 'bg-gradient-to-tr from-[#278c36] to-[#51a629] text-white shadow-md shadow-[#51a629]/15' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PAINEL EXECUTIVO (GERAL) */}
        {bizTab === 'geral' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: DRE & Financial Structure */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Waterfall DRE / Income Statement */}
              <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-sm">
                <div>
                  <span className="text-[10px] text-[#51a629] font-mono font-bold uppercase tracking-widest block">
                    Demonstração de Resultados (DRE Executivo)
                  </span>
                  <h3 className="text-base sm:text-lg font-display font-bold text-white mt-0.5">
                    Estrutura de Lucro & Custos Operacionais
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visão encadeada das receitas brutas até ao resultado líquido apurado.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Step 1: Gross Revenues */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-500/25 rounded-2xl flex items-center justify-between gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">(+) Receita Bruta / Faturamento</span>
                        <h4 className="text-lg font-display font-black text-white mt-0.5">{formatVal(totalRevenues)}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      100% Entrada
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center my-1">
                    <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center text-xs font-black">
                      ↓
                    </div>
                  </div>

                  {/* Step 2: Costs */}
                  <div className="p-4 bg-slate-950/80 border border-rose-500/25 rounded-2xl flex items-center justify-between gap-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500" />
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">(-) Custos Operacionais, Impostos & Pessoal</span>
                        <h4 className="text-lg font-display font-black text-white mt-0.5">{formatVal(totalCosts)}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                      Deduções
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center my-1">
                    <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 text-[#51a629] flex items-center justify-center text-xs font-black animate-bounce">
                      ↓
                    </div>
                  </div>

                  {/* Step 3: Net Profit */}
                  <div className="p-5 bg-gradient-to-r from-slate-950 to-slate-900 border-2 border-[#51a629] rounded-2xl flex items-center justify-between gap-3 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#51a629]" />
                    <div className="flex items-center gap-3.5 pl-2">
                      <div className="w-11 h-11 rounded-xl bg-[#51a629]/20 text-[#51a629] border border-[#51a629]/40 flex items-center justify-center shrink-0 shadow-md">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#51a629] uppercase font-black tracking-widest">(=) Resultado Líquido Final</span>
                        <h4 className="text-2xl font-display font-black text-[#51a629] mt-0.5">{formatVal(totalProfit)}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Margem Líquida</span>
                      <span className="text-sm font-mono font-black text-white bg-[#51a629]/20 border border-[#51a629]/30 px-2.5 py-0.5 rounded-lg inline-block mt-0.5">
                        {profitMargin}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Category Distribution Progress */}
              <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                    Distribuição dos Custos por Categoria
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Total: {formatVal(totalCosts)}</span>
                </div>

                <div className="space-y-3.5">
                  {bizCategoriesCosts.map((cat, idx) => {
                    const pct = totalCosts > 0 ? Math.round((cat.value / totalCosts) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white font-display flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                            {cat.name}
                          </span>
                          <span className="text-slate-300 font-mono font-bold">
                            {formatVal(cat.value)} <span className="text-slate-500 text-[10px]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${cat.color}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Quick Stats & Module Jump Links */}
            <div className="space-y-6">
              
              {/* Management Summary Widget */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-display font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                  Ativos & Recursos
                </h3>

                <div className="space-y-3">
                  <button 
                    onClick={() => setBizTab('funcionarios')}
                    className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Quadro de Pessoal</h4>
                        <span className="text-[10px] text-slate-400 block">{employees.length} Colaboradores</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">{formatVal(totalPayroll)}</span>
                  </button>

                  <button 
                    onClick={() => setBizTab('clientes')}
                    className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                        <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Carteira de Clientes</h4>
                        <span className="text-[10px] text-slate-400 block">{clients.length} Parceiros</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {clients.filter(c => c.status === 'Ativo').length} Ativos
                    </span>
                  </button>

                  <button 
                    onClick={() => setBizTab('fornecedores')}
                    className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold shrink-0">
                        <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Fornecedores</h4>
                        <span className="text-[10px] text-slate-400 block">{suppliers.length} Homologados</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400">Regular</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <h3 className="text-xs font-display font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                  Atalhos de Gestão
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAddEmp(true)}
                    className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> Registar Funcionário</span>
                    <span className="text-[10px] text-slate-500 font-mono">+ Folha</span>
                  </button>

                  <button
                    onClick={() => setShowAddCli(true)}
                    className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Cadastrar Cliente</span>
                    <span className="text-[10px] text-slate-500 font-mono">+ Vendas</span>
                  </button>

                  <button
                    onClick={() => setShowAddSup(true)}
                    className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-sky-400" /> Registar Fornecedor</span>
                    <span className="text-[10px] text-slate-500 font-mono">+ Contrato</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: FLUXO DE CAIXA */}
        {bizTab === 'fluxo' && (
          <div className="space-y-6">
            
            {/* Cash Flow Detailed Summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] text-[#51a629] font-mono font-bold uppercase tracking-wider block">Relatórios de Caixa</span>
                  <h3 className="text-base font-display font-bold text-white mt-0.5">Histórico de Lançamentos Financeiros</h3>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Pesquisar transação..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#51a629]/50"
                  />
                </div>
              </div>

              {/* Corporate Transactions List */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {transactions
                  .filter(tx => 
                    !searchQuery || 
                    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tx) => (
                    <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          tx.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowUpRight className="w-4.5 h-4.5" /> : <ArrowDownRight className="w-4.5 h-4.5" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate">{tx.description}</h4>
                          <span className="text-[10px] text-slate-400 font-mono font-bold block mt-0.5 uppercase">
                            {tx.category} • {tx.date}
                          </span>
                        </div>
                      </div>
                      <span className={`font-bold font-mono text-sm shrink-0 ${tx.type === 'income' ? 'text-[#51a629]' : 'text-slate-300'}`}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} {currency}
                      </span>
                    </div>
                  ))}

                {transactions.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                    Nenhuma transação corporativa registada.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: FUNCIONÁRIOS */}
        {bizTab === 'funcionarios' && (
          <div className="space-y-5">
            
            {/* Header with Payroll Stats */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Quadro de Funcionários & Folha Salarial</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Massa Salarial Mensal: <span className="text-indigo-400 font-mono font-bold">{formatVal(totalPayroll)}</span>
                </p>
              </div>
              <button
                onClick={() => setShowAddEmp(!showAddEmp)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 font-display shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Adicionar Funcionário
              </button>
            </div>

            {/* Expandable Add Employee Form */}
            {showAddEmp && (
              <form onSubmit={handleAddEmployee} className="p-5 bg-slate-950 border border-[#51a629]/30 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-[#51a629] uppercase tracking-widest font-mono">Contratar / Cadastrar Novo Funcionário</span>
                  <button type="button" onClick={() => setShowAddEmp(false)} className="text-slate-500 hover:text-white font-bold text-xs">✕</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: João da Silva" 
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Cargo / Função</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Contabilista Sénior" 
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Salário Mensal ({currency})</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Ex: 250000" 
                    value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-[#51a629]/20"
                >
                  Confirmar Contratação e Adicionar à Folha
                </button>
              </form>
            )}

            {/* Employee Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs sm:text-sm truncate">{emp.name}</h4>
                      <span className="text-[10px] text-indigo-300 block truncate mt-0.5">{emp.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Salário</span>
                      <span className="font-bold font-mono text-xs text-white">{emp.salary.toLocaleString()} {currency}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer ml-1"
                      title="Demitir / Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {employees.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum funcionário cadastrado no momento.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: CLIENTES */}
        {bizTab === 'clientes' && (
          <div className="space-y-5">
            
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Carteira de Clientes Corporativos</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total de Parcerias: <span className="text-emerald-400 font-mono font-bold">{clients.length} Clientes</span>
                </p>
              </div>
              <button
                onClick={() => setShowAddCli(!showAddCli)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 font-display shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Cadastrar Cliente
              </button>
            </div>

            {/* Expandable Add Client Form */}
            {showAddCli && (
              <form onSubmit={handleAddClient} className="p-5 bg-slate-950 border border-[#51a629]/30 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-[#51a629] uppercase tracking-widest font-mono">Registar Novo Cliente Corporativo</span>
                  <button type="button" onClick={() => setShowAddCli(false)} className="text-slate-500 hover:text-white font-bold text-xs">✕</button>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Nome da Empresa / Cliente</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Sonangol Luanda" 
                      value={cliName}
                      onChange={(e) => setCliName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">E-mail de Contacto</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="Ex: financas@empresa.ao" 
                        value={cliEmail}
                        onChange={(e) => setCliEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Telefone</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="Ex: +244 923 000 000" 
                        value={cliPhone}
                        onChange={(e) => setCliPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Estado Inicial de Contrato</label>
                    <select
                      value={cliStatus}
                      onChange={(e) => setCliStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629] cursor-pointer"
                    >
                      <option value="Ativo" className="bg-slate-900 text-white">Ativo (Fatura Sincronizada)</option>
                      <option value="Pendente" className="bg-slate-900 text-white">Pendente (Aguardando Pagamento)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-[#51a629]/20"
                >
                  Cadastrar Cliente e Ativar
                </button>
              </form>
            )}

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((cli) => (
                <div key={cli.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm truncate">{cli.name}</h4>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                          cli.status === 'Ativo' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {cli.status === 'Ativo' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {cli.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteClient(cli.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{cli.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cli.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => generateInvoicePDF(financialState, {
                      invoiceNumber: `FT2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      clientName: cli.name,
                      clientEmail: cli.email,
                      clientPhone: cli.phone,
                      items: [
                        { description: `Serviços Prestados a ${cli.name}`, qty: 1, unitPrice: 350000 }
                      ],
                      taxRate: 14,
                      notes: 'Pagamento a 15 dias por IBAN.'
                    })}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#51a629]" /> Emitir Fatura PDF
                  </button>
                </div>
              ))}

              {clients.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum cliente cadastrado no momento.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: FORNECEDORES */}
        {bizTab === 'fornecedores' && (
          <div className="space-y-5">
            
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Fornecedores & Parceiros de Serviços</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Registados: <span className="text-sky-400 font-mono font-bold">{suppliers.length} Fornecedores</span>
                </p>
              </div>
              <button
                onClick={() => setShowAddSup(!showAddSup)}
                className="bg-[#51a629] hover:bg-[#278c36] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 font-display shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Adicionar Fornecedor
              </button>
            </div>

            {/* Expandable Add Supplier Form */}
            {showAddSup && (
              <form onSubmit={handleAddSupplier} className="p-5 bg-slate-950 border border-[#51a629]/30 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-[#51a629] uppercase tracking-widest font-mono">Registar Fornecedor Homologado</span>
                  <button type="button" onClick={() => setShowAddSup(false)} className="text-slate-500 hover:text-white font-bold text-xs">✕</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Nome / Razão Social</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: ENDE Luanda / Zap Fibra" 
                      value={supName}
                      onChange={(e) => setSupName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Categoria de Serviço</label>
                    <select
                      value={supCat}
                      onChange={(e) => setSupCat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629] cursor-pointer"
                    >
                      <option value="Internet">Comunicações & Internet</option>
                      <option value="Energia">Energia & Utilidades</option>
                      <option value="Impostos">Impostos & Estado</option>
                      <option value="Compras">Compras & Material</option>
                      <option value="Salários">Serviços de Pessoal</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">E-mail ou Contacto Corporativo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: suporte@zap.co.ao" 
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#51a629] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-[#51a629]/20"
                >
                  Registar Fornecedor
                </button>
              </form>
            )}

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((sup) => (
                <div key={sup.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{sup.name}</h4>
                      <span className="inline-block text-[9px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md mt-1 uppercase">
                        {sup.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Contacto</span>
                      <span className="font-mono text-xs text-slate-300 truncate max-w-[100px] block">{sup.contact}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSupplier(sup.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {suppliers.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 text-xs">
                  Nenhum fornecedor cadastrado no momento.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Banking Details Modal */}
      {showBankingDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <BankingDetailsCard
              accountType="company"
              userName={userName}
              email={financialState.email}
              currency={currency}
              compact
              onClose={() => setShowBankingDetails(false)}
            />
          </div>
        </div>
      )}

      {/* Pro-Labore Transfer Modal */}
      {showProLaboreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#51a629]/20 text-[#51a629] flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-white">Retirar Pró-Labore para Casa</h3>
                  <p className="text-[11px] text-slate-400">Transferência do Saldo da Empresa para a Conta Pessoal</p>
                </div>
              </div>
              <button
                onClick={() => setShowProLaboreModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProLaboreTransfer} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Montante a Transferir ({currency})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={balance}
                  value={proLaboreAmount}
                  onChange={(e) => setProLaboreAmount(e.target.value)}
                  placeholder={`Saldo livre: ${formatVal(balance)}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white font-mono font-bold outline-none focus:border-[#51a629]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Descrição / Motivo
                </label>
                <input
                  type="text"
                  value={proLaboreNote}
                  onChange={(e) => setProLaboreNote(e.target.value)}
                  placeholder="Ex: Pró-labore do mês para despesas de casa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#51a629]"
                />
              </div>

              {proLaboreMsg && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  proLaboreMsg.includes('Sucesso')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {proLaboreMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#51a629] hover:bg-[#278c36] text-white font-display font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#51a629]/20"
              >
                Confirmar Transferência para Conta de Casa
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
