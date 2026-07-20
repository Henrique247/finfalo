import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Globe, 
  Coins, 
  Bell, 
  Eye, 
  EyeOff, 
  Check, 
  Camera, 
  AlertCircle,
  Target,
  Users,
  Trash2,
  Plus,
  Mail,
  Briefcase,
  TrendingUp,
  BarChart3,
  Lock
} from 'lucide-react';
import { FinancialState } from '../types';

interface ProfileProps {
  financialState: FinancialState;
  onUpdateState: (updates: Partial<FinancialState>) => void;
}

export default function Profile({ financialState, onUpdateState }: ProfileProps) {
  const { userName, currency } = financialState;

  // Profile fields
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('henrique@finfalo.com');
  const [phone, setPhone] = useState('+244 923 000 000');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Preference fields
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [selectedTheme, setSelectedTheme] = useState(financialState.theme || 'dark');

  // AutoSave configuration fields
  const [autoSaveType, setAutoSaveType] = useState(financialState.autoSaveType || 'percentage');
  const [autoSaveValue, setAutoSaveValue] = useState(financialState.autoSaveValue !== undefined ? financialState.autoSaveValue : 20);

  // Success notify
  const [saved, setSaved] = useState(false);

  const isCompany = financialState.accountType === 'company';

  // Sub tab inside Profile.tsx
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'company'>(
    isCompany ? 'company' : 'profile'
  );

  // Collaborators List State
  const [collaborators, setCollaborators] = useState([
    { id: 'col_1', name: 'Dr. Afonso Henriques', email: 'afonso.henriques@empresa.ao', role: 'Diretor Geral', permission: 'admin' as const, status: 'Ativo' },
    { id: 'col_2', name: 'Engª. Maria Leitão', email: 'maria.leitao@empresa.ao', role: 'Diretora Operacional', permission: 'write' as const, status: 'Ativo' },
    { id: 'col_3', name: 'Dr. Valdir Lourenço', email: 'valdir.lourenco@empresa.ao', role: 'Contabilista Certificado', permission: 'write' as const, status: 'Ativo' },
    { id: 'col_4', name: 'Isabel Simões', email: 'isabel.simoes@empresa.ao', role: 'Analista Financeiro Jr.', permission: 'read' as const, status: 'Pendente' }
  ]);

  // Form State for Adding Collaborator
  const [newColName, setNewColName] = useState('');
  const [newColEmail, setNewColEmail] = useState('');
  const [newColRole, setNewColRole] = useState('');
  const [newColPermission, setNewColPermission] = useState<'admin' | 'write' | 'read'>('read');
  const [colSavedMsg, setColSavedMsg] = useState('');

  // Handle adding new collaborator
  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName || !newColEmail || !newColRole) return;

    const newCol = {
      id: `col_${Date.now()}`,
      name: newColName,
      email: newColEmail,
      role: newColRole,
      permission: newColPermission,
      status: 'Pendente'
    };

    setCollaborators([...collaborators, newCol]);
    setNewColName('');
    setNewColEmail('');
    setNewColRole('');
    setNewColPermission('read');
    
    setColSavedMsg('Colaborador convidado com sucesso!');
    setTimeout(() => setColSavedMsg(''), 3000);
  };

  // Handle deleting collaborator
  const handleDeleteCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  // Handle updating permissions inline
  const handleUpdatePermission = (id: string, perm: 'admin' | 'write' | 'read') => {
    setCollaborators(collaborators.map(c => c.id === id ? { ...c, permission: perm } : c));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      userName: name,
      currency: selectedCurrency,
      theme: selectedTheme as 'light' | 'dark',
      autoSaveType,
      autoSaveValue: Number(autoSaveValue)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white font-sans">Perfil & Definições</h1>
        <p className="text-xs text-slate-400">Gere as tuas preferências de visualização, moedas base e credenciais de segurança.</p>
      </div>

      {/* Account Type Specific sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`py-2 px-4 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'border-[#51a629] text-[#51a629]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Definições de Perfil
        </button>
        {isCompany ? (
          <button
            onClick={() => setActiveSubTab('company')}
            className={`py-2 px-4 text-xs sm:text-sm font-display font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'company'
                ? 'border-[#51a629] text-[#51a629]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" /> Painel de Gestão da Empresa
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateState({ accountType: 'company' });
                setActiveSubTab('company');
              }}
              className="py-1.5 px-3 bg-[#51a629]/10 hover:bg-[#51a629]/20 text-[#51a629] text-[10px] font-bold rounded-lg border border-[#51a629]/20 transition-all cursor-pointer"
            >
              Simular Conta de Empresa (Ativar Painel de Colaboradores & Relatórios)
            </button>
          </div>
        )}
      </div>

      {activeSubTab === 'company' ? (
        <div className="space-y-6">
          {/* Header Card with Business Status */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-indigo-500/5 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                Painel Corporativo: {name} Lda.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Controlo consolidado de fluxo de caixa corporativo, contas de colaboradores, auditoria de permissões de tesouraria e exportação de relatórios regulatórios angolanos.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                NIF: 5001248901
              </span>
              <span className="text-[10px] bg-[#51a629]/15 border border-[#51a629]/20 text-emerald-400 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                Plano: Corporate Gold
              </span>
            </div>
          </div>

          {/* Consolidated Cash Flow Report section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consolidated metrics cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="fintech-card p-4 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Receita Consolidada</span>
                <span className="text-xl font-display font-bold text-emerald-400 mt-1 block">{(financialState.incomes * 1.5).toLocaleString()} {currency}</span>
                <span className="text-[9px] text-slate-500 mt-0.5 block flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" /> +15.4% vs mês anterior
                </span>
              </div>

              <div className="fintech-card p-4 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Custos Operacionais</span>
                <span className="text-xl font-display font-bold text-slate-200 mt-1 block">{(financialState.expenses * 1.2).toLocaleString()} {currency}</span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">Salários, Recargas, Rendas</span>
              </div>

              <div className="fintech-card p-4 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Resultado Líquido</span>
                <span className={`text-xl font-display font-bold mt-1 block ${
                  (financialState.incomes * 1.5 - financialState.expenses * 1.2) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {(financialState.incomes * 1.5 - financialState.expenses * 1.2).toLocaleString()} {currency}
                </span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">Margem líquida de ~22%</span>
              </div>

              <div className="fintech-card p-4 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Impostos Estimados (AGT)</span>
                <span className="text-xl font-display font-bold text-amber-500 mt-1 block">{(financialState.incomes * 1.5 * 0.15).toLocaleString()} {currency}</span>
                <span className="text-[9px] text-slate-500 mt-0.5 block">Provisão de 15% IRT/Industrial</span>
              </div>
            </div>

            {/* Main view split: Left is Collaborators, Right is Cash Flow Report Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Collaborators list with access permissions management */}
              <div className="fintech-card p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Gestão de Colaboradores e Acesso
                    </h3>
                    <p className="text-[11px] text-slate-400">Atribua permissões e controle quem pode reconciliar extratos ou autorizar despesas.</p>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-md font-mono">
                    {collaborators.length} Convites
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[9px] uppercase font-bold tracking-wider text-slate-400">
                        <th className="pb-2.5 pr-2">Colaborador</th>
                        <th className="pb-2.5 pr-2">Função / Cargo</th>
                        <th className="pb-2.5 pr-2">Permissão</th>
                        <th className="pb-2.5 pr-2 text-center">Status</th>
                        <th className="pb-2.5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-xs">
                      {collaborators.map(col => (
                        <tr key={col.id} className="hover:bg-slate-900/15 transition-all">
                          <td className="py-3 pr-2">
                            <div>
                              <span className="font-bold text-white block">{col.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <Mail className="w-2.5 h-2.5 text-slate-400" /> {col.email}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-2 font-medium text-slate-300">{col.role}</td>
                          <td className="py-3 pr-2">
                            <select
                              value={col.permission}
                              onChange={(e) => handleUpdatePermission(col.id, e.target.value as any)}
                              className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-white rounded px-2 py-1 outline-none cursor-pointer focus:border-emerald-500/50"
                            >
                              <option value="admin">Administrador</option>
                              <option value="write">Escrita / Reconciliar</option>
                              <option value="read">Apenas Leitura</option>
                            </select>
                          </td>
                          <td className="py-3 pr-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              col.status === 'Ativo' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}>
                              {col.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteCollaborator(col.id)}
                              className="p-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer"
                              title="Remover acesso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form to Invite Collaborator */}
              <form onSubmit={handleAddCollaborator} className="fintech-card p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  Convidar Novo Colaborador
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Nome completo..."
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      required
                      placeholder="Email corporativo (@empresa.ao)..."
                      value={newColEmail}
                      onChange={(e) => setNewColEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Cargo/Função (Ex: Técnico de Contabilidade)"
                      value={newColRole}
                      onChange={(e) => setNewColRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <select
                      value={newColPermission}
                      onChange={(e) => setNewColPermission(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                      <option value="admin">Administrador</option>
                      <option value="write">Escrita / Reconciliar</option>
                      <option value="read">Apenas Leitura</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full h-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Convidar
                    </button>
                  </div>
                </div>

                {colSavedMsg && (
                  <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    {colSavedMsg}
                  </div>
                )}
              </form>
            </div>

            {/* Consolidated Cash Flow Report representation (right column) */}
            <div className="space-y-6">
              <div className="fintech-card p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#51a629]" />
                  Previsão de Fluxo de Caixa (Jul/Dez)
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gráfico de projeções consolidadas baseadas no histórico de faturamento e custos recorrentes mapeados por reconciliação.
                </p>

                {/* Simulated visual bar charts */}
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-300 font-bold">Julho (Atual)</span>
                      <span className="text-emerald-400 font-bold">100% Equilibrado</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '60%' }} title="Incomes" />
                      <div className="h-full bg-indigo-500" style={{ width: '40%' }} title="Expenses" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Agosto (Projetado)</span>
                      <span className="text-indigo-400 font-bold">+10% Receita</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                      <div className="h-full bg-indigo-500" style={{ width: '35%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Setembro (Projetado)</span>
                      <span className="text-amber-400 font-bold">Investimento</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '50%' }} />
                      <div className="h-full bg-indigo-500" style={{ width: '50%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Outubro (Projetado)</span>
                      <span className="text-emerald-400 font-bold">+35% Campanha</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '75%' }} />
                      <div className="h-full bg-indigo-500" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" /> Dados Auditados AGT
                  </span>
                  <button 
                    type="button"
                    onClick={() => alert('O Relatório Consolidado de Fluxo de Caixa no formato PDF/Excel foi enviado para o seu email.')}
                    className="text-[#51a629] font-bold hover:underline cursor-pointer"
                  >
                    Exportar Relatório
                  </button>
                </div>
              </div>

              {/* Compliance Box */}
              <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-display font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Conformidade Fiscal e IVA
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  O FinFalo calcula automaticamente a provisão de imposto sobre o valor acrescentado (IVA) e as retenções na fonte de prestadores de serviços de acordo com as leis do Ministério das Finanças da República de Angola.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card & Photo */}
          <div className="space-y-6">
            <div className="fintech-card p-6 rounded-2xl text-center flex flex-col items-center">
              {/* Avatar block with upload trigger design */}
              <div className="relative w-24 h-24 mb-4">
                <div className="w-full h-full rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-3xl text-emerald-400 font-display font-black">
                  {name ? name.charAt(0).toUpperCase() : 'H'}
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full border border-slate-950 transition-colors cursor-pointer shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-base font-display font-bold text-white">{name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{email}</p>

              <div className="mt-5 w-full pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Membro FinFalo desde</span>
                <span className="text-white font-semibold font-mono">Julho 2026</span>
              </div>
            </div>

            {/* Quick info alerts */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-display">Segurança Ativa</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    A tua conta pessoal está protegida por encriptação AES-256 de ponta a ponta. Todas as sessões e transações são processadas em ambiente sandboxed privado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Form & preferences */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="fintech-card p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-1">Configurações Gerais</h3>
                <p className="text-xs text-slate-400 font-sans">Atualiza os teus dados de contacto e preferências financeiras.</p>
              </div>

              {/* Form grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Utilizador</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email de Acesso</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Telefone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Palavra-passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Preferences breakdown */}
                <div className="md:col-span-2 pt-4 border-t border-slate-800/60 mt-2">
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" /> Preferências do Sistema
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Moeda Base</label>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                      >
                        <option value="Kz">Kwanza (Kz)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="BRL">Real (R$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Idioma</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                      >
                        <option value="pt">Português (PT)</option>
                        <option value="en">English (US)</option>
                        <option value="es">Español (ES)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tema Visual</label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                      >
                        <option value="dark">FinFalo Neon Escuro</option>
                        <option value="light">FinFalo Claro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Auto Save Settings */}
                <div className="md:col-span-2 pt-4 border-t border-slate-800/60 mt-2">
                  <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" /> Poupança Automática p/ Metas (Auto-Save)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Método de Poupança por Recarga</label>
                      <select
                        value={autoSaveType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setAutoSaveType(val);
                          if (val === 'percentage') {
                            setAutoSaveValue(20);
                          } else if (val === 'fixed') {
                            setAutoSaveValue(5000);
                          } else {
                            setAutoSaveValue(0);
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                      >
                        <option value="percentage">Percentagem descontada a cada recarga (%)</option>
                        <option value="fixed">Quantia fixa descontada a cada recarga ({currency})</option>
                        <option value="disabled">Desativar poupança automática</option>
                      </select>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Define como o sistema retira automaticamente uma parte das tuas receitas/depósitos para a meta de poupança activa.
                      </span>
                    </div>

                    {autoSaveType !== 'disabled' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          {autoSaveType === 'percentage' ? 'Percentagem a Poupar (%)' : `Quantia Fixa a Poupar (${currency})`}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step={autoSaveType === 'percentage' ? '1' : 'any'}
                          max={autoSaveType === 'percentage' ? '100' : undefined}
                          value={autoSaveValue}
                          onChange={(e) => setAutoSaveValue(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                          placeholder={autoSaveType === 'percentage' ? 'Ex: 20' : 'Ex: 5000'}
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {autoSaveType === 'percentage' 
                            ? 'A percentagem recomendada é 20% das tuas receitas recebidas.' 
                            : `Será descontado o valor fixo de ${autoSaveValue} ${currency} de cada nova receita.`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save CTA */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-4">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Definições sincronizadas com a cloud.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {saved ? (
                    <>
                      Definições Guardadas <Check className="w-4 h-4" />
                    </>
                  ) : (
                    'Guardar Preferências'
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
