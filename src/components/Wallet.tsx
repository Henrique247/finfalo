import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Settings,
  AlertTriangle,
  PieChart,
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Check,
  CheckSquare,
  FileSpreadsheet
} from 'lucide-react';
import { FinancialState, Transaction, Budget } from '../types';

interface WalletProps {
  financialState: FinancialState;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateBudget: (category: string, limit: number) => void;
}

export interface RawImportItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  suggestedCategory: string;
}

export default function Wallet({ 
  financialState, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction,
  onUpdateBudget
}: WalletProps) {
  const [activeTab, setActiveTab] = useState<'receitas' | 'despesas' | 'orcamento' | 'importar'>('receitas');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(''); // e.g. "2026-07"

  // Bank statement import mockup state
  const [importStep, setImportStep] = useState<'upload' | 'mapping' | 'success'>('upload');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: 'CSV' | 'OFX' } | null>(null);
  const [importTransactions, setImportTransactions] = useState<RawImportItem[]>([]);
  const [isMappingLoaded, setIsMappingLoaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Helper to trigger demonstration file simulations
  const handleLoadDemoFile = (fileType: 'BAI' | 'BCI') => {
    const fileName = fileType === 'BAI' ? 'extrato_bai_corrente_2026.ofx' : 'extrato_bci_corporativo_julho.csv';
    const fileSize = fileType === 'BAI' ? '24.5 KB' : '12.8 KB';
    setUploadedFile({ name: fileName, size: fileSize, type: fileType === 'BAI' ? 'OFX' : 'CSV' });
    
    // Set mock transaction items to be mapped
    const demoItems: RawImportItem[] = fileType === 'BAI' 
      ? [
          { id: 'bai_1', date: '2026-07-14', description: 'SUPERMERCADO KERO TALATONA', amount: 35000, type: 'expense', category: 'Alimentação', suggestedCategory: 'Alimentação' },
          { id: 'bai_2', date: '2026-07-12', description: 'UNITEL RECARGA SALDO TELEM.', amount: 5000, type: 'expense', category: 'Internet', suggestedCategory: 'Internet' },
          { id: 'bai_3', date: '2026-07-10', description: 'DEPOSITO SALARIO MENSUAL', amount: 320000, type: 'income', category: 'Salário', suggestedCategory: 'Salário' },
          { id: 'bai_4', date: '2026-07-08', description: 'FARMACIA ANGOMEDICA ALVALADE', amount: 18500, type: 'expense', category: 'Saúde', suggestedCategory: 'Saúde' }
        ]
      : [
          { id: 'bci_1', date: '2026-07-13', description: 'FATURACAO CLIENTE ALPHA SRL', amount: 450000, type: 'income', category: 'Negócios', suggestedCategory: 'Negócios' },
          { id: 'bci_2', date: '2026-07-11', description: 'RESTAURANTE COQUEIROS ALMOCO', amount: 14200, type: 'expense', category: 'Alimentação', suggestedCategory: 'Alimentação' },
          { id: 'bci_3', date: '2026-07-09', description: 'PAGAMENTO SEGURO ENSA', amount: 65000, type: 'expense', category: 'Outros', suggestedCategory: 'Outros' },
          { id: 'bci_4', date: '2026-07-07', description: 'UNITEL CORPORATIVO INTERNET', amount: 45000, type: 'expense', category: 'Internet', suggestedCategory: 'Internet' }
        ];

    setImportTransactions(demoItems);
    setImportStep('mapping');
    setIsMappingLoaded(false);

    // Simulate AI parsing / mapping load
    setTimeout(() => {
      setIsMappingLoaded(true);
    }, 1800);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isOfx = file.name.endsWith('.ofx');
      const isCsv = file.name.endsWith('.csv');
      if (isOfx || isCsv) {
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: isOfx ? 'OFX' : 'CSV'
        });
        // load mock data corresponding to dropped file
        const randomItems: RawImportItem[] = [
          { id: 'drop_1', date: '2026-07-14', description: 'SHOPPING FORTALEZA LOJA', amount: 12500, type: 'expense', category: 'Alimentação', suggestedCategory: 'Alimentação' },
          { id: 'drop_2', date: '2026-07-11', description: 'JUROS CREDITO MULTICAIXA', amount: 8000, type: 'income', category: 'Outros', suggestedCategory: 'Outros' },
          { id: 'drop_3', date: '2026-07-09', description: 'CANDONGA TAXI LOBITO', amount: 2500, type: 'expense', category: 'Transporte', suggestedCategory: 'Transporte' },
        ];
        setImportTransactions(randomItems);
        setImportStep('mapping');
        setIsMappingLoaded(false);
        setTimeout(() => setIsMappingLoaded(true), 1500);
      } else {
        alert('Por favor, carregue um ficheiro válido em formato .CSV ou .OFX.');
      }
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isOfx = file.name.endsWith('.ofx');
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: isOfx ? 'OFX' : 'CSV'
      });
      const randomItems: RawImportItem[] = [
        { id: 'sel_1', date: '2026-07-15', description: 'SUPERMERCADO KERO TALATONA', amount: 45000, type: 'expense', category: 'Alimentação', suggestedCategory: 'Alimentação' },
        { id: 'sel_2', date: '2026-07-13', description: 'RECARGA UNITEL 10GB', amount: 10000, type: 'expense', category: 'Internet', suggestedCategory: 'Internet' },
        { id: 'sel_3', date: '2026-07-09', description: 'DEPOSITO EM DINHEIRO', amount: 75000, type: 'income', category: 'Outros', suggestedCategory: 'Outros' },
      ];
      setImportTransactions(randomItems);
      setImportStep('mapping');
      setIsMappingLoaded(false);
      setTimeout(() => setIsMappingLoaded(true), 1500);
    }
  };

  const handleUpdateItemCategory = (id: string, newCat: string) => {
    setImportTransactions(prev => prev.map(item => item.id === id ? { ...item, category: newCat } : item));
  };

  const handleConfirmImport = () => {
    // Add all mapped items to state
    importTransactions.forEach(item => {
      onAddTransaction({
        description: item.description,
        amount: item.amount,
        type: item.type,
        category: item.category,
        date: item.date
      });
    });
    setImportStep('success');
  };

  const handleResetImport = () => {
    setImportStep('upload');
    setUploadedFile(null);
    setImportTransactions([]);
    setIsMappingLoaded(false);
  };
  
  // Helper to format short date for mobile (e.g. 15/07)
  const getCompactDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  // Transaction creation state
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Editing states
  const [editingId, setEditingId] = useState<string | null>(null);

  const { currency, transactions, budgets } = financialState;

  // Categories lists
  const incomeCategories = ['Salário', 'Negócios', 'Bónus', 'Outros'];
  const expenseCategories = ['Alimentação', 'Transporte', 'Água', 'Luz', 'Internet', 'Saúde', 'Educação', 'Outros'];

  // Trigger adding
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount || !category) return;

    if (editingId) {
      onEditTransaction({
        id: editingId,
        description: desc,
        amount: parseFloat(amount),
        type: activeTab === 'receitas' ? 'income' : 'expense',
        category,
        date
      });
      setEditingId(null);
    } else {
      onAddTransaction({
        description: desc,
        amount: parseFloat(amount),
        type: activeTab === 'receitas' ? 'income' : 'expense',
        category,
        date
      });
    }

    // Reset Form
    setDesc('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleEditInit = (tx: Transaction) => {
    setEditingId(tx.id);
    setDesc(tx.description);
    setAmount(tx.amount.toString());
    setCategory(tx.category);
    setDate(tx.date);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDesc('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Filter transactions
  const filteredTxList = transactions.filter(tx => {
    const isCorrectType = activeTab === 'receitas' ? tx.type === 'income' : tx.type === 'expense';
    if (!isCorrectType) return false;

    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? tx.category === categoryFilter : true;
    const matchesMonth = monthFilter ? tx.date.startsWith(monthFilter) : true;

    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Calculate totals
  const totalIncomesFiltered = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpensesFiltered = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Compute category breakdown stats for display (using percentage indicators)
  const getCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {};
    const selectedTxType = activeTab === 'receitas' ? 'income' : 'expense';
    let total = 0;

    transactions.forEach(t => {
      if (t.type === selectedTxType) {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
        total += t.amount;
      }
    });

    return Object.entries(breakdown).map(([cat, val]) => ({
      category: cat,
      value: val,
      percentage: total > 0 ? Math.round((val / total) * 100) : 0
    })).sort((a, b) => b.value - a.value);
  };

  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Carteira & Centro Financeiro</h1>
        <p className="text-xs text-slate-400">Gere todas as tuas receitas, despesas e planeamentos de orçamentos.</p>
      </div>

      {/* Main Tabs Selection */}
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none border-b border-[#0869A6]/20 scroll-smooth mb-1">
        <button
          onClick={() => { setActiveTab('receitas'); handleCancelEdit(); }}
          className={`py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            activeTab === 'receitas'
              ? 'border-[#51a629] text-[#51a629]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> Receitas
        </button>
        <button
          onClick={() => { setActiveTab('despesas'); handleCancelEdit(); }}
          className={`py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            activeTab === 'despesas'
              ? 'border-[#51a629] text-[#51a629]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> Despesas
        </button>
        <button
          onClick={() => { setActiveTab('orcamento'); handleCancelEdit(); }}
          className={`py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            activeTab === 'orcamento'
              ? 'border-[#51a629] text-[#51a629]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> Orçamentos Mensais
        </button>
        <button
          onClick={() => { setActiveTab('importar'); handleCancelEdit(); }}
          className={`py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            activeTab === 'importar'
              ? 'border-[#51a629] text-[#51a629]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> Conciliação de Extratos
        </button>
      </div>

      {activeTab === 'importar' ? (
        <div className="space-y-6">
          {/* Header information about OFX/CSV Import and AI category mapping */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-indigo-500/5 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#51a629]" />
              Motor de Conciliação Inteligente de Extratos
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Carregue os extratos bancários da sua conta (ficheiros <strong className="text-white">CSV</strong> ou <strong className="text-white">OFX</strong>) exportados do seu banco de preferência (BAI, BCI, BFA, etc.). O nosso motor de inteligência artificial analisa os descritivos das transações, categoriza-as automaticamente e permite conciliar tudo com um clique.
            </p>
          </div>

          {importStep === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Drag and drop Area */}
              <div className="lg:col-span-2">
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden cursor-pointer ${
                    dragOver 
                      ? 'border-[#51a629] bg-[#51a629]/5 scale-[0.99]' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept=".csv, .ofx"
                    onChange={handleFileSelected}
                  />
                  <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 hover:border-emerald-500/30 transition-all">
                      <UploadCloud className="w-8 h-8 text-[#51a629]" />
                    </div>
                    <span className="text-sm font-bold text-white block">Arrastar & Soltar o Extrato Bancário</span>
                    <span className="text-xs text-slate-400 block mt-1">Formatos suportados: <strong className="text-slate-300">.CSV</strong> ou <strong className="text-slate-300">.OFX</strong></span>
                    <span className="text-[10px] text-slate-500 block mt-6 bg-slate-950/80 border border-slate-900 px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
                      Clica para navegar nos ficheiros locais
                    </span>
                  </label>
                </div>
              </div>

              {/* Simulation Demo Column */}
              <div className="space-y-4">
                <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between h-full min-h-[340px]">
                  <div>
                    <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      Demonstração Rápida (Mockup)
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Se não possuir um ficheiro real de momento, clique nos presets simulados abaixo para visualizar a nossa interface avançada de mapeamento inteligente em ação:
                    </p>

                    <div className="space-y-2.5">
                      <button
                        onClick={() => handleLoadDemoFile('BAI')}
                        className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/40 hover:border-slate-700 transition-all text-left flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Extrato BAI Corrente</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Formato OFX • 4 Transações</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                      </button>

                      <button
                        onClick={() => handleLoadDemoFile('BCI')}
                        className="w-full p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/40 hover:border-slate-700 transition-all text-left flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Extrato BCI Corporativo</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Formato CSV • 4 Transações</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 italic mt-4 pt-3 border-t border-slate-800/60">
                    *Toda a simulação interage e altera diretamente a base de dados real em execução no browser.
                  </div>
                </div>
              </div>
            </div>
          )}

          {importStep === 'mapping' && (
            <div className="space-y-6">
              {!isMappingLoaded ? (
                /* Skeletal/Loading screen simulating AI classification */
                <div className="fintech-card p-10 rounded-2xl flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-[#51a629]/20 border-t-[#51a629] animate-spin" />
                    <Sparkles className="w-6 h-6 text-[#51a629] absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">A ler extrato e a mapear transações</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                      A encriptar canais e a correlacionar descrições bancárias com a inteligência de categorização do FinFalo...
                    </p>
                  </div>
                </div>
              ) : (
                /* The mapping interface */
                <div className="space-y-4">
                  {/* Summary row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-950/60 border border-slate-800 p-4 rounded-xl gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0869A6]/10 border border-[#0869A6]/20 flex items-center justify-center text-white shrink-0">
                        {uploadedFile?.type === 'OFX' ? <FileText className="w-5 h-5 text-indigo-400" /> : <FileSpreadsheet className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{uploadedFile?.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{uploadedFile?.size} • Detetados {importTransactions.length} registos no extrato</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleResetImport}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        Carregar Outro Ficheiro
                      </button>
                      <button
                        onClick={handleConfirmImport}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      >
                        Confirmar & Importar {importTransactions.length} Registos
                      </button>
                    </div>
                  </div>

                  {/* Table area */}
                  <div className="fintech-card p-5 rounded-2xl overflow-hidden">
                    <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-emerald-400" />
                      Mapeamento de Transações e Categorias
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            <th className="pb-3 pr-3 font-mono">Data</th>
                            <th className="pb-3 pr-3">Descrição Original do Banco</th>
                            <th className="pb-3 pr-3 font-mono">Tipo</th>
                            <th className="pb-3 pr-3 font-mono text-right">Valor</th>
                            <th className="pb-3 pr-3">Mapeamento da Categoria</th>
                            <th className="pb-3 text-center">AI Sugestão</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-xs text-slate-200">
                          {importTransactions.map(item => (
                            <tr key={item.id} className="hover:bg-slate-900/15 transition-all">
                              <td className="py-3.5 pr-3 font-mono text-slate-400 shrink-0">{item.date}</td>
                              <td className="py-3.5 pr-3 font-medium text-white max-w-xs truncate">
                                {item.description}
                              </td>
                              <td className="py-3.5 pr-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  item.type === 'income' 
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' 
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/10'
                                }`}>
                                  {item.type === 'income' ? 'Receita' : 'Despesa'}
                                </span>
                              </td>
                              <td className={`py-3.5 pr-3 text-right font-mono font-bold ${
                                item.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                              }`}>
                                {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} {currency}
                              </td>
                              <td className="py-3.5 pr-3">
                                <select
                                  value={item.category}
                                  onChange={(e) => handleUpdateItemCategory(item.id, e.target.value)}
                                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 outline-none w-44 cursor-pointer focus:border-[#51a629]/50"
                                >
                                  {(item.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3.5 text-center">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#51a629]/10 border border-[#51a629]/20 text-[#51a629] text-[10px] font-bold">
                                  <Sparkles className="w-3 h-3" />
                                  <span>100% Match</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {importStep === 'success' && (
            <div className="fintech-card p-8 rounded-2xl text-center py-16 space-y-6 max-w-lg mx-auto">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold text-white">Conciliação Concluída com Sucesso!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Os {importTransactions.length} registos do extrato bancário foram mapeados, encriptados e importados diretamente para o seu histórico financeiro no FinFalo.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-center gap-3">
                <button
                  onClick={handleResetImport}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Importar Novo Extrato
                </button>
                <button
                  onClick={() => setActiveTab('receitas')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  Ir para Receitas
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns (Form & Filters) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab !== 'orcamento' ? (
              <>
                {/* Add/Edit Transaction Form */}
                <div className="fintech-card p-3 sm:p-5 rounded-2xl">
                  <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    {editingId ? (
                      <>
                        <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                        Editar Registo
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        {`Adicionar ${activeTab === 'receitas' ? 'Receita' : 'Despesa'}`}
                      </>
                    )}
                  </h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Descrição</label>
                      <input
                        type="text"
                        required
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder={activeTab === 'receitas' ? 'Ex: Salário Mensal, Freelance...' : 'Ex: Supermercado, Passe de Autocarro...'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Valor ({currency})</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Categoria</label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-slate-300 outline-none focus:border-emerald-500/50"
                      >
                        <option value="">Selecione uma Categoria</option>
                        {(activeTab === 'receitas' ? incomeCategories : expenseCategories).map(catName => (
                          <option key={catName} value={catName}>{catName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Data</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-slate-300 outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-1 sm:mt-2">
                      {editingId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {editingId ? 'Guardar Alterações' : 'Confirmar Registo'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Transactions List with Search & Month Filters */}
                <div className="fintech-card p-4 sm:p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Histórico Filtrado 
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono normal-case">
                        {filteredTxList.length} transações
                      </span>
                    </h3>

                    {/* Search and Filter Inputs - 2 columns on mobile, 3 columns on desktop */}
                    <div className="grid grid-cols-12 gap-2 shrink-0 md:max-w-md w-full">
                      <div className="relative flex items-center col-span-12 sm:col-span-6">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
                        <input
                          type="text"
                          placeholder="Pesquisar..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/30"
                        />
                      </div>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="col-span-6 sm:col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500/30 cursor-pointer"
                      >
                        <option value="">Todas</option>
                        {(activeTab === 'receitas' ? incomeCategories : expenseCategories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="col-span-6 sm:col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500/30 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* List Body */}
                  <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto pr-1">
                    {filteredTxList.map((tx) => (
                      <div key={tx.id} className="py-2 sm:py-3 flex items-center justify-between gap-2.5 group hover:bg-slate-900/10 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 border ${
                            tx.type === 'income' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            {tx.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-tight">{tx.description}</h4>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block mt-0.5 truncate leading-none">
                              <span className="sm:hidden">{getCompactDate(tx.date)}</span>
                              <span className="hidden sm:inline">{tx.date}</span> • {tx.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
                          <div className={`text-xs font-bold font-mono shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} {currency}
                          </div>
                          {/* Action Buttons */}
                          <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditInit(tx)}
                              className="p-1 sm:p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                            >
                              <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteTransaction(tx.id)}
                              className="p-1 sm:p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredTxList.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        Não foram encontradas transações para estes filtros.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Budgets configuration */
              <div className="fintech-card p-4 sm:p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-1">Definir Limites de Categoria</h3>
                  <p className="text-xs text-slate-400">Controla as despesas definindo um teto mensal para cada categoria essencial.</p>
                </div>

                <div className="space-y-4">
                  {budgets.map(b => {
                    const percentUsed = Math.round((b.spent / b.limit) * 100);
                    const isExceeded = percentUsed >= 100;
                    const isWarning = percentUsed >= 80 && percentUsed < 100;

                    return (
                      <div key={b.id} className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-white font-display">{b.category}</span>
                            {isExceeded && (
                              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold">
                                <AlertTriangle className="w-3 h-3 animate-pulse" /> Excedido
                              </span>
                            )}
                            {isWarning && (
                              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                                <AlertTriangle className="w-3 h-3" /> Alerta (80%+)
                              </span>
                            )}
                          </div>
                          {/* Limit Config form Inline */}
                          <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto">
                            <span className="text-[10px] text-slate-400 sm:hidden">Definir Limite:</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                defaultValue={b.limit}
                                onBlur={(e) => onUpdateBudget(b.category, parseFloat(e.target.value) || 0)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    onUpdateBudget(b.category, parseFloat((e.target as HTMLInputElement).value) || 0);
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right text-xs text-white outline-none w-24 font-mono focus:border-emerald-500"
                              />
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{currency}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bar indicator */}
                        <div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(percentUsed, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                            <span>Gasto: {b.spent.toLocaleString()} / {b.limit.toLocaleString()} {currency}</span>
                            <span>{percentUsed}% usado</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Category Statistics & Overview) */}
          <div className="space-y-6">
            {/* Card: Portfolio Summary */}
            <div className="fintech-card p-4 sm:p-5 rounded-2xl text-center">
              <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-2">Resumo Financeiro</h3>
              <div className="my-4">
                <span className="text-2xl sm:text-3xl font-display font-black text-white text-glow-green break-all">
                  {activeTab === 'receitas' ? totalIncomesFiltered.toLocaleString() : totalExpensesFiltered.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-semibold block mt-1">
                  {activeTab === 'receitas' ? 'Receita Total do Portfólio' : 'Despesa Total do Portfólio'} ({currency})
                </span>
              </div>
              <p className="text-[10px] text-slate-500 italic mt-3">
                *Estes valores abrangem todo o histórico atual inserido na plataforma.
              </p>
            </div>

            {/* Breakdown By Category */}
            <div className="fintech-card p-4 sm:p-5 rounded-2xl">
              <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-400" /> Distribuição por Categorias
              </h3>

              <div className="space-y-4">
                {categoryBreakdown.map((item, idx) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">{item.category}</span>
                      <span className="text-slate-200 font-mono font-bold">
                        {item.value.toLocaleString()} {currency} ({item.percentage}%)
                      </span>
                    </div>
                    {/* Progress bar representing category segment percentage */}
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          activeTab === 'receitas' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

                {categoryBreakdown.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Sem registos nesta categoria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
