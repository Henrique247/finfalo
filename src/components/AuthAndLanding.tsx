import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart, 
  BookOpen, 
  Users, 
  Briefcase, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  X,
  Bot,
  DollarSign,
  HelpCircle,
  FileText,
  Activity,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AuthAndLandingProps {
  onLoginSuccess: (
    userName: string, 
    accountType: 'personal' | 'family' | 'company', 
    email: string
  ) => void;
  currency: string;
}

export default function AuthAndLanding({ onLoginSuccess, currency }: AuthAndLandingProps) {
  // Screens: 'landing' | 'login' | 'register'
  const [screen, setScreen] = useState<'landing' | 'login' | 'register'>('landing');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regResponsibleName, setRegResponsibleName] = useState('');
  const [regAccountType, setRegAccountType] = useState<'personal' | 'family' | 'company'>('personal');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Users Mock Database inside LocalStorage
  useEffect(() => {
    const existing = localStorage.getItem('finfalo_registered_users');
    if (!existing) {
      const defaultUsers = [
        { email: 'personal@finfalo.com', password: '123456', name: 'Henrique', type: 'personal' },
        { email: 'familia@finfalo.com', password: '123456', name: 'Família Mendes', type: 'family' },
        { email: 'empresa@finfalo.com', password: '123456', name: 'FinFalo Soluções', type: 'company' }
      ];
      localStorage.setItem('finfalo_registered_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Preencha todos os campos.');
      return;
    }

    const usersStr = localStorage.getItem('finfalo_registered_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const matched = users.find(
      (u: any) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    if (matched) {
      onLoginSuccess(matched.name, matched.type, matched.email);
    } else {
      setLoginError('Credenciais inválidas. Use personal@finfalo.com, familia@finfalo.com ou empresa@finfalo.com (palavra-passe: 123456) ou registe uma nova conta.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    // Validate fields according to selected account type
    let resolvedName = '';
    if (regAccountType === 'personal') {
      if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
        setRegError('Preencha todos os quatro campos do cadastro pessoal.');
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setRegError('As palavras-passe introduzidas não coincidem.');
        return;
      }
      resolvedName = regName;
    } else if (regAccountType === 'family') {
      if (!regResponsibleName || !regFamilyName || !regEmail || !regPassword) {
        setRegError('Preencha todos os quatro campos do cadastro familiar.');
        return;
      }
      resolvedName = regFamilyName;
    } else if (regAccountType === 'company') {
      if (!regCompanyName || !regResponsibleName || !regEmail || !regPassword) {
        setRegError('Preencha todos os quatro campos do cadastro de empresa.');
        return;
      }
      resolvedName = regCompanyName;
    }

    if (regPassword.length < 6) {
      setRegError('A palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }

    const usersStr = localStorage.getItem('finfalo_registered_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const exists = users.some((u: any) => u.email.toLowerCase() === regEmail.toLowerCase());
    if (exists) {
      setRegError('Este email já está registado no sistema.');
      return;
    }

    const newUser = {
      email: regEmail,
      password: regPassword,
      name: resolvedName,
      type: regAccountType,
      responsibleName: regResponsibleName,
      // For family, save family name explicitly too
      familyName: regAccountType === 'family' ? regFamilyName : undefined,
      companyName: regAccountType === 'company' ? regCompanyName : undefined,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('finfalo_registered_users', JSON.stringify(updatedUsers));
    
    setRegSuccess(true);
    
    // Auto login immediately as requested! Reduz abandono no cadastro
    setTimeout(() => {
      onLoginSuccess(resolvedName, regAccountType, regEmail);
      setRegSuccess(false);
      // Reset registration states
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegFamilyName('');
      setRegCompanyName('');
      setRegResponsibleName('');
      setRegStep(1);
    }, 1200);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSent(false), 4000);
  };

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0869A6]/15 border border-[#0869A6]/30 flex items-center justify-center text-[#51a629] font-display font-black text-lg">
                FF
              </div>
              <span className="font-display font-black text-xl text-white uppercase tracking-wider">FinFalo</span>
            </div>
            <button 
              onClick={() => setScreen('landing')} 
              className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-display font-bold text-white mb-2">Iniciar Sessão</h2>
          <p className="text-xs text-slate-400 mb-6">Aceda ao seu painel financeiro seguro da FinFalo.</p>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2 mb-5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Endereço de Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@finfalo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer mt-2"
            >
              Entrar na Plataforma
            </button>
          </form>

          {/* Seed accounts hint block */}
          <div className="mt-6 pt-5 border-t border-slate-800/60 bg-slate-950/40 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block mb-2">Contas de Teste Rápidas:</span>
            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <div>
                <span className="text-white font-semibold">Pessoal:</span> personal@finfalo.com
              </div>
              <div>
                <span className="text-white font-semibold">Família:</span> familia@finfalo.com
              </div>
              <div>
                <span className="text-white font-semibold">Empresa:</span> empresa@finfalo.com
              </div>
              <div className="text-[9px] text-slate-500 mt-1">Palavra-passe para todas: <strong className="text-white">123456</strong></div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">Ainda não tem conta? </span>
            <button 
              onClick={() => setScreen('register')} 
              className="text-xs text-[#51a629] hover:underline font-bold cursor-pointer"
            >
              Registar-se
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0869A6]/15 border border-[#0869A6]/30 flex items-center justify-center text-[#51a629] font-display font-black text-lg">
                FF
              </div>
              <span className="font-display font-black text-xl text-white uppercase tracking-wider">FinFalo</span>
            </div>
            <button 
              onClick={() => {
                setScreen('landing');
                setRegStep(1);
              }} 
              className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {regStep === 1 ? (
            /* ==================== STEP 1: CHOOSE ACCOUNT TYPE ==================== */
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-display font-bold text-white mb-1.5">Escolher Tipo de Conta</h2>
                <p className="text-xs text-slate-400">Selecione a estrutura que melhor se adapta aos seus objetivos financeiros.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Personal Card */}
                <button
                  type="button"
                  onClick={() => setRegAccountType('personal')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    regAccountType === 'personal'
                      ? 'border-[#51a629] bg-[#51a629]/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-950/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    regAccountType === 'personal' ? 'bg-[#51a629]/20 text-[#51a629]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold block text-white">👤 Conta Pessoal</span>
                    <span className="text-[11px] text-slate-400 leading-normal block">
                      Perfeita para registos diários individuais, cofre inteligente de poupança (Auto-Save) e objetivos de tecnologia ou lazer.
                    </span>
                  </div>
                </button>

                {/* Family Card */}
                <button
                  type="button"
                  onClick={() => setRegAccountType('family')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    regAccountType === 'family'
                      ? 'border-[#51a629] bg-[#51a629]/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-950/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    regAccountType === 'family' ? 'bg-[#51a629]/20 text-[#51a629]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold block text-white">👨‍👩‍👧 Conta Família</span>
                    <span className="text-[11px] text-slate-400 leading-normal block">
                      Ideal para casais e lares. Sincronize despesas com vários membros, trace metas de viagens familiares e faça orçamentos partilhados.
                    </span>
                  </div>
                </button>

                {/* Company Card */}
                <button
                  type="button"
                  onClick={() => setRegAccountType('company')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    regAccountType === 'company'
                      ? 'border-[#51a629] bg-[#51a629]/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-950/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    regAccountType === 'company' ? 'bg-[#51a629]/20 text-[#51a629]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold block text-white">🏢 Conta Empresa</span>
                    <span className="text-[11px] text-slate-400 leading-normal block">
                      Gestor financeiro para pequenas empresas e freelancers. Controle fluxo de caixa, funcionários, clientes e fornecedores.
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Ir para Login
                </button>
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className="w-1/2 py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Seguinte <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* ==================== STEP 2: SIMPLIFIED REGISTRATION (4 FIELDS) ==================== */
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className="text-slate-400 hover:text-white text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Alterar tipo ({regAccountType === 'personal' ? 'Pessoal' : regAccountType === 'family' ? 'Família' : 'Empresa'})
                </button>
              </div>

              <h2 className="text-lg font-display font-bold text-white mb-1">
                {regAccountType === 'personal' && '👤 Cadastro Pessoal'}
                {regAccountType === 'family' && '👨‍👩‍👧 Cadastro Família'}
                {regAccountType === 'company' && '🏢 Cadastro de Empresa'}
              </h2>
              <p className="text-xs text-slate-400 mb-5">Por favor, introduza os 4 campos abaixo para criar a sua conta.</p>

              {regError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2 mb-5">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="bg-emerald-500/10 border border-[#51a629]/20 text-[#51a629] p-3 rounded-xl text-xs flex items-start gap-2 mb-5 animate-pulse">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>Criando conta com sucesso... A iniciar sessão automática de forma rápida!</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* 👤 PERSONAL FORM (4 fields: Nome completo, E-mail, Palavra-passe, Confirmar palavra-passe) */}
                {regAccountType === 'personal' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Henrique Mendes"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Endereço de E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="seuemail@exemplo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Palavra-passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          placeholder="Mínimo 6 caracteres"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirmar Palavra-passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          placeholder="Repita a palavra-passe"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 👨‍👩‍👧 FAMILY FORM (4 fields: Nome do responsável, Nome da família, E-mail, Palavra-passe) */}
                {regAccountType === 'family' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Responsável</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Henrique Mendes"
                          value={regResponsibleName}
                          onChange={(e) => setRegResponsibleName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome da Família</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Família Mendes"
                          value={regFamilyName}
                          onChange={(e) => setRegFamilyName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">E-mail de Contacto</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="familia@exemplo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Palavra-passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          placeholder="Mínimo 6 caracteres"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 🏢 COMPANY FORM (4 fields: Nome da empresa, Nome do responsável, E-mail, Palavra-passe) */}
                {regAccountType === 'company' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome da Empresa</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: FinFalo Soluções Tecnológicas Lda"
                          value={regCompanyName}
                          onChange={(e) => setRegCompanyName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Responsável / Sócio</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Henrique Mendes"
                          value={regResponsibleName}
                          onChange={(e) => setRegResponsibleName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">E-mail da Empresa</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="empresa@exemplo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Palavra-passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          placeholder="Mínimo 6 caracteres"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer mt-5"
                >
                  {regAccountType === 'personal' && 'Criar Conta Pessoal'}
                  {regAccountType === 'family' && 'Criar Família'}
                  {regAccountType === 'company' && 'Criar Empresa'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button 
                  onClick={() => {
                    setRegStep(1);
                  }}
                  className="text-xs text-slate-400 hover:text-white hover:underline cursor-pointer"
                >
                  Voltar para escolha de conta
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#031c33] text-slate-100 flex flex-col relative">
      {/* Background radial gradient */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#0869A6]/10 to-transparent pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#0869A6]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0869A6]/15 border border-[#0869A6]/30 flex items-center justify-center text-[#51a629] font-display font-black text-lg filter drop-shadow-[0_0_8px_rgba(81,166,41,0.2)]">
            FF
          </div>
          <div>
            <span className="font-display font-black text-xl text-white uppercase tracking-wider block leading-none">FinFalo</span>
            <span className="text-[9px] text-[#51a629] font-mono font-bold tracking-widest block uppercase mt-0.5">Gestão Financeira Familiar</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#problema-solucao" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Problema & Solução</a>
          <a href="#recursos" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Como Funciona</a>
          <a href="#contas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Tipos de Conta</a>
          <a href="#contacto" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Contacto</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScreen('login')} 
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          >
            Entrar
          </button>
          <button 
            onClick={() => setScreen('register')} 
            className="px-4.5 py-2 text-xs font-bold bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl shadow-md shadow-[#51a629]/10 transition-all cursor-pointer"
          >
            Criar Conta
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#51a629]/10 border border-[#51a629]/20 text-[#51a629] rounded-full text-[10px] font-bold tracking-wider uppercase">
          <Shield className="w-3.5 h-3.5" /> Plataforma Segura, Inteligente e Descomplicada
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Controle as finanças da sua <span className="text-[#51a629]">família</span> com precisão
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          FinFalo é a ferramenta ideal para casais, famílias e pequenos empreendedores registarem despesas, planearem orçamentos mensais, definirem metas de poupança inteligentes e alcançarem a estabilidade económica.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => setScreen('register')} 
            className="w-full sm:w-auto px-6 py-3.5 bg-[#51a629] hover:bg-[#278c36] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#51a629]/10 cursor-pointer"
          >
            Começar Grátis <ArrowRight className="w-4 h-4" />
          </button>
          <a 
            href="#problema-solucao" 
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            Saber Mais
          </a>
        </div>
      </section>

      {/* Problem & Solution Comparison Block */}
      <section id="problema-solucao" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#0869A6]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">O Cenário Real</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
              O planeamento financeiro não precisa de ser feito em papel ou tabelas complexas
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Grande parte das famílias enfrenta dificuldades não pela falta de rendimento, mas pela completa ausência de acompanhamento das suas transações diárias. Gastar mais do que se recebe, não ter um orçamento definido e poupar apenas "o que sobra" são obstáculos comuns que a FinFalo resolve definitivamente.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <TrendingDown className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Despesas diárias esquecidas que drenam o saldo total.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <TrendingDown className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Dificuldade em visualizar para onde o dinheiro vai todos os meses.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <TrendingDown className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">Ausência de metas de poupança automatizadas e estruturadas.</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">A Solução Inteligente</span>
            <h3 className="text-lg font-display font-bold text-white">Como a FinFalo transforma a sua rotina</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#51a629]" />
                <h4 className="text-xs font-bold text-white">Registo Instantâneo</h4>
                <p className="text-[11px] text-slate-400">Adicione receitas, recargas e despesas em segundos com categorização automática.</p>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                <Target className="w-5 h-5 text-[#51a629]" />
                <h4 className="text-xs font-bold text-white">Poupança Auto-Save</h4>
                <p className="text-[11px] text-slate-400">Retenha uma percentagem (%) ou quantia fixa automaticamente ao registar receitas.</p>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                <PieChart className="w-5 h-5 text-[#51a629]" />
                <h4 className="text-xs font-bold text-white">Estatísticas Reais</h4>
                <p className="text-[11px] text-slate-400">Gráficos de fluxo de caixa e score de saúde financeira atualizados em tempo real.</p>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                <BookOpen className="w-5 h-5 text-[#51a629]" />
                <h4 className="text-xs font-bold text-white">Educação Integrada</h4>
                <p className="text-[11px] text-slate-400">Artigos práticos de planeamento orçamental e glossário de conceitos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona / Recursos Section */}
      <section id="recursos" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#0869A6]/10 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">Recursos Disponíveis</span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">Explorar o funcionamento completo do site</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Desenvolvido com foco na simplicidade, segurança de dados e alta performance para garantir controlo absoluto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#51a629]/10 flex items-center justify-center text-[#51a629] border border-[#51a629]/20">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Dashboard de Controlo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte num só olhar o seu Saldo Disponível atualizado, os limites orçamentados mensais por categorias e um Score de Saúde Dinâmico calculado a partir dos seus hábitos.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#51a629]/10 flex items-center justify-center text-[#51a629] border border-[#51a629]/20">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Assistente FinBot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O assistente financeiro inteligente em formato chat integrado. Diga adeus a dúvidas complexas e peça recomendações personalizadas baseadas nos seus registos.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#51a629]/10 flex items-center justify-center text-[#51a629] border border-[#51a629]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Academia de Educação</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aceda a artigos exclusivos sobre a regra 50/30/20, gestão de juros compostos, desafios de poupança prática por semanas e dicionário de termos económicos.
            </p>
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section id="contas" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#0869A6]/10 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">Público-Alvo</span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">Escolha a conta perfeita para o seu perfil</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Oferecemos uma experiência focada com estatísticas e ferramentas configuradas para o seu contexto de utilização.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#51a629]/5 flex items-center justify-center text-[#51a629] border border-[#51a629]/10">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Conta Pessoal</h3>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Para estudantes, trabalhadores e profissionais independentes</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ideal para rastrear receitas individuais, monitorizar despesas pessoais e configurar planos de poupança automatizados em metas pontuais.
              </p>
            </div>
            <button 
              onClick={() => { setRegAccountType('personal'); setScreen('register'); }}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 rounded-xl cursor-pointer text-center"
            >
              Criar Conta Pessoal
            </button>
          </div>

          <div className="bg-slate-900/60 border border-[#51a629]/20 p-6 rounded-2xl space-y-4 relative flex flex-col justify-between shadow-xl shadow-[#51a629]/5">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#51a629] text-slate-950 rounded-full text-[9px] font-bold tracking-wider uppercase">
              Mais Procurada
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#51a629]/10 flex items-center justify-center text-[#51a629] border border-[#51a629]/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Conta de Família</h3>
                <span className="text-[10px] text-[#51a629] font-semibold block mt-0.5">Para casais e agregados familiares</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Desenhada especificamente para consolidar receitas e despesas familiares. Permite gerir orçamentos compartilhados e reter poupanças rumo às metas conjuntas da família.
              </p>
            </div>
            <button 
              onClick={() => { setRegAccountType('family'); setScreen('register'); }}
              className="mt-6 w-full py-2.5 bg-[#51a629] hover:bg-[#278c36] text-xs font-bold text-white rounded-xl cursor-pointer text-center"
            >
              Criar Conta de Família
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#51a629]/5 flex items-center justify-center text-[#51a629] border border-[#51a629]/10">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Conta de Empresa</h3>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Para pequenos empreendedores e freelancers</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permite acompanhar o fluxo de caixa do seu pequeno negócio de forma organizada. Excelente para orçamentos operacionais, categorias de despesas de negócios e acompanhamento de lucros.
              </p>
            </div>
            <button 
              onClick={() => { setRegAccountType('company'); setScreen('register'); }}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 rounded-xl cursor-pointer text-center"
            >
              Criar Conta de Empresa
            </button>
          </div>
        </div>
      </section>

      {/* System Benefits & Adapted Reality Block */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#0869A6]/10">
        <div className="bg-gradient-to-r from-slate-900 to-[#053259]/40 border border-slate-800/80 p-8 sm:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">O Nosso Diferencial</span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white">Gestão adaptada para a realidade das famílias angolanas</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sabemos que cada economia possui particularidades específicas. Por isso, a FinFalo foi construída de raiz para suportar as moedas de eleição locais (incluindo o Kwanza - Kz) e disponibiliza recursos focados na disciplina, sem requerer integrações bancárias complexas que limitam a usabilidade. Toda a inserção é controlada por si, de forma 100% privada e segura.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#51a629]" />
              <span className="text-xs font-bold text-white">Suporte ao Kwanza (Kz)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#51a629]" />
              <span className="text-xs font-bold text-white">Interface rápida e leve</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#51a629]" />
              <span className="text-xs font-bold text-white">Sem recolha abusiva de dados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support and Contact Section */}
      <section id="contacto" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 border-t border-[#0869A6]/10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">Suporte Técnico & Contacto</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">Tem dúvidas ou precisa de consultoria personalizada?</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A nossa equipa técnica está pronta para responder às suas questões, ajudar na configuração da sua conta ou agendar uma demonstração completa do ecossistema. Deixe a sua mensagem e responderemos com a máxima brevidade.
            </p>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#51a629] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Privacidade Absoluta Garantida</h4>
                <p className="text-[11px] text-slate-400">Qualquer informação enviada através dos nossos canais de comunicação é tratada com total confidencialidade e encriptação.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider mb-4">Envie uma Mensagem</h3>
            {contactSent ? (
              <div className="p-4 bg-emerald-500/10 border border-[#51a629]/20 text-[#51a629] rounded-xl text-xs flex items-center gap-2">
                <Check className="w-5 h-5 shrink-0" />
                <span>Mensagem enviada com sucesso! A nossa equipa entrará em contacto muito brevemente.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">O seu Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Henrique Mendes"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">O seu Email</label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@seuemail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Como podemos ajudar?</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva a sua dúvida, sugestão ou necessidade..."
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Submeter Mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Shared Global Footer inside Landing too */}
      <footer className="border-t border-slate-900 py-10 px-6 text-center text-[11px] text-slate-500 space-y-2 mt-auto relative z-10 bg-slate-950/20">
        <p>© 2026 FinFalo S.A. Todos os direitos reservados. Gestão de Finanças de Nova Geração.</p>
        <div className="flex justify-center gap-4 text-slate-400 font-semibold">
          <a href="#privacy" className="hover:text-emerald-400 transition-colors">Política de Privacidade</a>
          <span>•</span>
          <a href="#terms" className="hover:text-emerald-400 transition-colors">Termos de Utilização</a>
          <span>•</span>
          <a href="#support" className="hover:text-emerald-400 transition-colors">Suporte Técnico</a>
        </div>
      </footer>
    </div>
  );
}
