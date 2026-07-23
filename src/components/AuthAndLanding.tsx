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
  Sparkles,
  Loader2
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
  // Screens: 'landing' | 'login' | 'register' | 'set-pin' | 'enter-pin'
  const [screen, setScreen] = useState<'landing' | 'login' | 'register' | 'set-pin' | 'enter-pin'>('landing');
  
  // Transition Loader State when entering app
  const [isEnteringApp, setIsEnteringApp] = useState(false);
  const [enteringProgress, setEnteringProgress] = useState(0);
  const [enteringTipIndex, setEnteringTipIndex] = useState(0);
  const [pendingUserToEnter, setPendingUserToEnter] = useState<{ name: string; type: 'personal' | 'family' | 'company'; email: string } | null>(null);

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

  // Custom states for PIN flow
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [tempRegisterData, setTempRegisterData] = useState<any>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Trigger entering loading screen with smooth progress bar and tips
  const triggerEnteringApp = (name: string, type: 'personal' | 'family' | 'company', email: string) => {
    setPendingUserToEnter({ name, type, email });
    setIsEnteringApp(true);
    setEnteringProgress(0);

    const interval = setInterval(() => {
      setEnteringProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoginSuccess(name, type, email);
            setIsEnteringApp(false);
          }, 200);
          return 100;
        }
        return prev + 5;
      });
    }, 45);
  };

  useEffect(() => {
    if (!isEnteringApp) return;
    const tips = [
      "A encriptar o seu cofre e a validar os PINs de segurança...",
      "A recalcular o seu Score de Saúde Financeira FinFalo em tempo real...",
      "A organizar as suas categorias de receitas, despesas e orçamentos...",
      "A sincronizar metas de poupança inteligente..."
    ];
    const tipInterval = setInterval(() => {
      setEnteringTipIndex(prev => (prev + 1) % tips.length);
    }, 1200);
    return () => clearInterval(tipInterval);
  }, [isEnteringApp]);

  // Users Mock Database inside LocalStorage with PIN support
  useEffect(() => {
    const existing = localStorage.getItem('finfalo_registered_users');
    let needsUpdate = false;
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        // Migrate default users if they don't have PIN
        if (parsed.length > 0 && !parsed[0].pin) {
          needsUpdate = true;
        }
      } catch (e) {
        needsUpdate = true;
      }
    }
    if (!existing || needsUpdate) {
      const defaultUsers = [
        { email: 'personal@finfalo.com', password: '123456', pin: '123456', name: 'Henrique', type: 'personal' },
        { email: 'familia@finfalo.com', password: '123456', pin: '123456', name: 'Família Mendes', type: 'family' },
        { email: 'empresa@finfalo.com', password: '123456', pin: '123456', name: 'FinFalo Soluções', type: 'company' }
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
      setMatchedUser(matched);
      setScreen('enter-pin');
      setPinInput('');
      setPinError('');
    } else {
      setLoginError('Credenciais inválidas. Use os e-mails das contas sugeridas abaixo (palavra-passe: 123456) ou registe uma nova conta.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    // Validate fields according to selected account type
    let resolvedName = '';
    let nameToValidateForNumbers = '';
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
      nameToValidateForNumbers = regName;
    } else if (regAccountType === 'family') {
      if (!regResponsibleName || !regFamilyName || !regEmail || !regPassword) {
        setRegError('Preencha todos os quatro campos do cadastro familiar.');
        return;
      }
      resolvedName = regFamilyName;
      nameToValidateForNumbers = regResponsibleName;
    } else if (regAccountType === 'company') {
      if (!regCompanyName || !regResponsibleName || !regEmail || !regPassword) {
        setRegError('Preencha todos os quatro campos do cadastro de empresa.');
        return;
      }
      resolvedName = regCompanyName;
      nameToValidateForNumbers = regResponsibleName;
    }

    // Name validation: cannot contain numbers
    if (/\d/.test(nameToValidateForNumbers)) {
      setRegError('O nome não pode conter números. Por favor, introduza o seu nome correto sem algarismos.');
      return;
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

    setTempRegisterData({
      email: regEmail,
      password: regPassword,
      name: resolvedName,
      type: regAccountType,
      responsibleName: regResponsibleName,
      familyName: regAccountType === 'family' ? regFamilyName : undefined,
      companyName: regAccountType === 'company' ? regCompanyName : undefined,
    });

    setScreen('set-pin');
    setPinInput('');
    setPinError('');
  };

  const handleConfirmSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (pinInput.length !== 6 || !/^\d+$/.test(pinInput)) {
      setPinError('O PIN deve conter exatamente 6 números.');
      return;
    }

    if (!tempRegisterData) return;

    const usersStr = localStorage.getItem('finfalo_registered_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const newUser = {
      ...tempRegisterData,
      pin: pinInput
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('finfalo_registered_users', JSON.stringify(updatedUsers));

    setRegSuccess(true);
    
    setTimeout(() => {
      triggerEnteringApp(newUser.name, newUser.type, newUser.email);
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
      setTempRegisterData(null);
      setPinInput('');
    }, 600);
  };

  const handleConfirmEnterPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!matchedUser) return;

    const savedPin = matchedUser.pin || '123456';

    if (pinInput === savedPin) {
      triggerEnteringApp(matchedUser.name, matchedUser.type, matchedUser.email);
      setMatchedUser(null);
      setPinInput('');
    } else {
      setPinError('PIN de segurança incorreto. Por favor, tente novamente.');
    }
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

  // Render Full Screen Entering Loader Transition
  if (isEnteringApp) {
    const tips = [
      "A encriptar o seu cofre e a validar os PINs de segurança...",
      "A recalcular o seu Score de Saúde Financeira FinFalo em tempo real...",
      "A organizar as suas categorias de receitas, despesas e orçamentos...",
      "A sincronizar metas de poupança inteligente..."
    ];
    return (
      <div className="fixed inset-0 z-50 bg-[#031c33] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden animate-in fade-in duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#51a629]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="w-full max-w-md flex flex-col items-center text-center relative z-10 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-[#51a629]/30 flex items-center justify-center shadow-2xl shadow-[#51a629]/20">
              <img 
                src="https://i.postimg.cc/Y01cWMGN/Fin-Falo.png" 
                alt="FinFalo Logo" 
                className="h-12 w-auto object-contain animate-pulse"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#51a629] rounded-full flex items-center justify-center text-slate-950">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-display font-black uppercase tracking-wider text-white">
              Bem-vindo, {pendingUserToEnter?.name}
            </h2>
            <p className="text-xs text-[#51a629] font-mono font-bold uppercase tracking-widest">
              A preparar o seu painel financeiro...
            </p>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 p-0.5 shadow-inner relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0869A6] via-[#51a629] to-[#80e24f] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(81,166,41,0.6)]"
              style={{ width: `${enteringProgress}%` }}
            />
          </div>

          <div className="w-full flex justify-between text-xs font-mono font-bold text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Loader2 className="w-4 h-4 text-[#51a629] animate-spin" /> Autenticação concluída
            </span>
            <span className="text-[#51a629]">{enteringProgress}%</span>
          </div>

          <div className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-left backdrop-blur-md">
            <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block mb-1">Status de Inicialização</span>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              "{tips[enteringTipIndex]}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://i.postimg.cc/Y01cWMGN/Fin-Falo.png" 
                alt="FinFalo Logo" 
                className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(81,166,41,0.3)]" 
              />
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

  if (screen === 'set-pin') {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-[#51a629]/10 border border-[#51a629]/20 flex items-center justify-center text-[#51a629]">
              <Shield className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white">Definir PIN de Segurança</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Crie um PIN numérico de 6 dígitos. Este PIN será solicitado sempre que iniciar sessão ou realizar movimentos (receitas, despesas, transferências, etc.) na sua conta.
            </p>
          </div>

          {pinError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{pinError}</span>
            </div>
          )}

          {regSuccess && (
            <div className="bg-emerald-500/10 border border-[#51a629]/20 text-[#51a629] p-3 rounded-xl text-xs flex items-start gap-2 text-left animate-pulse">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>PIN configurado com sucesso! Redirecionando para o seu cofre...</span>
            </div>
          )}

          <form onSubmit={handleConfirmSetPin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">PIN de 6 dígitos</label>
              <input
                type="password"
                pattern="\d*"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                placeholder="Ex: 123456"
                value={pinInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 6) setPinInput(val);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-white outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={pinInput.length !== 6 || regSuccess}
              className="w-full py-3.5 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar e Criar Conta
            </button>
          </form>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => {
                setScreen('register');
                setTempRegisterData(null);
                setPinInput('');
                setPinError('');
              }}
              className="text-xs text-slate-500 hover:text-white cursor-pointer"
            >
              Voltar ao Cadastro
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'enter-pin') {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-[#0869A6]/10 border border-[#0869A6]/20 flex items-center justify-center text-[#51a629]">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white">Autorização por PIN</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Olá, <strong className="text-white">{matchedUser?.name}</strong>. Introduza o seu PIN de segurança de 6 dígitos para aceder à sua conta.
            </p>
          </div>

          {pinError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleConfirmEnterPin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">PIN de 6 dígitos</label>
              <input
                type="password"
                pattern="\d*"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 6) setPinInput(val);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-white outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={pinInput.length !== 6}
              className="w-full py-3.5 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Desbloquear Conta
            </button>
          </form>

          {/* Seed accounts hint text */}
          {matchedUser && ['personal@finfalo.com', 'familia@finfalo.com', 'empresa@finfalo.com'].includes(matchedUser?.email?.toLowerCase()) && (
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-left">
              <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block">Nota de Teste:</span>
              <p className="text-[10px] text-slate-400 mt-1">O PIN padrão para esta conta de demonstração é <strong className="text-white">123456</strong>.</p>
            </div>
          )}

          <div className="text-center">
            <button 
              type="button"
              onClick={() => {
                setScreen('login');
                setMatchedUser(null);
                setPinInput('');
                setPinError('');
              }}
              className="text-xs text-slate-500 hover:text-white cursor-pointer"
            >
              Voltar ao Login
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
              <img 
                src="https://i.postimg.cc/Y01cWMGN/Fin-Falo.png" 
                alt="FinFalo Logo" 
                className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(81,166,41,0.3)]" 
              />
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
    <div className="min-h-screen bg-[#031c33] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial gradient and ambient light glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0869A6]/20 to-[#51a629]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#0869A6]/10 to-transparent pointer-events-none" />

      {/* Navigation / Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/Y01cWMGN/Fin-Falo.png" 
            alt="FinFalo Logo" 
            className="h-11 w-auto object-contain drop-shadow-[0_0_15px_rgba(81,166,41,0.35)]" 
          />
          <div>
            <span className="font-display font-black text-2xl text-white uppercase tracking-wider block leading-none">FinFalo</span>
            <span className="text-[10px] text-[#51a629] font-mono font-bold tracking-widest block uppercase mt-0.5">FinTech Inteligente</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScreen('login')} 
            className="px-5 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            Entrar
          </button>
          <button 
            onClick={() => setScreen('register')} 
            className="px-5 py-2.5 text-xs font-bold bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl shadow-lg shadow-[#51a629]/20 transition-all cursor-pointer"
          >
            Criar Conta
          </button>
        </div>
      </header>

      {/* Welcome Screen Content (Página de Boas-Vindas) */}
      <main className="relative z-10 my-auto w-full max-w-3xl mx-auto px-6 py-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#51a629]/10 border border-[#51a629]/25 text-[#51a629] rounded-full text-xs font-bold tracking-wider uppercase shadow-inner">
          <Sparkles className="w-4 h-4" /> Bem-Vindo ao FinFalo
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight">
            A plataforma para a gestão das suas <span className="text-[#51a629] drop-shadow-sm">finanças</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Planeamento inteligente, controlo de orçamentos, metas de poupança e relatórios executivos para a sua vida pessoal, familiar ou negócio.
          </p>
        </div>

        {/* Two Main Action Buttons */}
        <div className="pt-4 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => setScreen('login')} 
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer font-display group"
          >
            <User className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Entrar</span>
          </button>

          <button 
            onClick={() => setScreen('register')} 
            className="w-full py-4 bg-[#51a629] hover:bg-[#278c36] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#51a629]/25 hover:shadow-[#51a629]/40 cursor-pointer font-display group"
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Criar Conta</span>
            <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-900/80 bg-slate-950/30">
        <p>© 2026 FinFalo S.A. Todos os direitos reservados. Gestão de Finanças de Nova Geração.</p>
      </footer>
    </div>
  );
}
