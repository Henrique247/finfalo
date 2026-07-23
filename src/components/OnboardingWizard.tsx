import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Phone, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Target, 
  Bell, 
  Moon, 
  Sun, 
  Check, 
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { FinancialState } from '../types';

interface OnboardingWizardProps {
  financialState: FinancialState;
  onComplete: (updatedFields: Partial<FinancialState>) => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ financialState, onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [province, setProvince] = useState('Luanda');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [financialGoalText, setFinancialGoalText] = useState('Fundo de Emergência');
  const [customGoal, setCustomGoal] = useState('');
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const { userName, accountType } = financialState;

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const finalGoal = financialGoalText === 'Outros' ? customGoal : financialGoalText;
    
    // Save to financialState
    onComplete({
      phone,
      birthDate,
      province,
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : undefined,
      financialGoalText: finalGoal || undefined,
      allowNotifications,
      theme,
      isOnboarded: true,
      showOnboardingAlert: false
    });
  };

  const provinces = [
    'Luanda', 'Benguela', 'Huíla', 'Huambo', 'Cabinda', 'Namibe', 
    'Malanje', 'Kwanza Sul', 'Uíge', 'Zaire', 'Lunda Norte', 'Lunda Sul',
    'Bié', 'Moxico', 'Cunene', 'Cuando Cubango', 'Bengo', 'Kwanza Norte'
  ];

  const goalsPreset = accountType === 'company' 
    ? ['Expandir Negócio', 'Capital de Giro', 'Comprar Equipamentos', 'Fundo de Reserva', 'Investir em Marketing', 'Outros']
    : ['Comprar Casa / Terreno', 'Fundo de Emergência', 'Comprar Carro', 'Fazer uma Viagem', 'Educação / Cursos', 'Outros'];

  return (
    <section className="fixed inset-0 z-50 bg-[#031c33]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#0869A6]/15 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#51a629] animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Assistente de Configuração • Etapa {step} de 4
            </span>
          </div>
          <button 
            onClick={onSkip}
            className="text-[11px] text-slate-400 hover:text-white font-bold transition-all cursor-pointer hover:underline"
          >
            Pular tudo
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 mb-6 overflow-hidden border border-slate-800/40">
          <div 
            className="bg-gradient-to-r from-[#51a629] to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* ================= STEP 1: WELCOME ================= */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#51a629]/10 border border-[#51a629]/25 flex items-center justify-center text-[#51a629] mx-auto filter drop-shadow-[0_0_12px_rgba(81,166,41,0.25)]">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                Seja bem-vindo à FinFalo, <span className="text-[#51a629]">{userName}</span>!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                Parabéns por dar o primeiro passo rumo à prosperidade e organização financeira! Vamos configurar os dados base em 1 minuto.
              </p>
            </div>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-850 space-y-3">
              <span className="text-[10px] font-bold text-[#51a629] uppercase tracking-wider block font-mono">
                O que faremos a seguir:
              </span>
              <div className="grid grid-cols-1 gap-2.5 text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#51a629]/10 text-[#51a629] flex items-center justify-center font-bold font-mono">1</div>
                  <span>Dados Pessoais (Contacto e Província)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#51a629]/10 text-[#51a629] flex items-center justify-center font-bold font-mono">2</div>
                  <span>Configuração de Objetivos Financeiros e Renda</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#51a629]/10 text-[#51a629] flex items-center justify-center font-bold font-mono">3</div>
                  <span>Preferências de Interface e Notificações</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onSkip}
                className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Configurar Depois
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Começar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: PERSONAL DATA ================= */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-1">Fale-nos um pouco sobre si</h3>
              <p className="text-xs text-slate-400">Estes dados ajudam-nos a personalizar a sua experiência regional e canais de contacto.</p>
            </div>

            <div className="space-y-4">
              {/* Phone number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Telemóvel (Opcional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="Ex: 923 445 566"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Data de Nascimento (Opcional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Province selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Província (Angola)</label>
                <div className="relative font-mono">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov} className="bg-slate-900 text-white">
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800/50">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Seguinte <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: FINANCIAL DATA ================= */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-1">Configurações de Caixa</h3>
              <p className="text-xs text-slate-400">Indique o seu fluxo financeiro mensal e defina o seu objetivo financeiro prioritário.</p>
            </div>

            <div className="space-y-4">
              {/* Income input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {accountType === 'company' ? 'Faturamento Mensal Estimado (Kz)' : 'Salário Mensal Estimado (Kz)'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 py-0.5 px-1 text-[11px] font-bold font-mono text-emerald-400 bg-slate-950/40 rounded border border-slate-800">
                    Kz
                  </div>
                  <input
                    type="number"
                    placeholder="Ex: 350000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Goal preset selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Objetivo Principal</label>
                <div className="relative">
                  {accountType === 'company' ? (
                    <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  ) : (
                    <Target className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  )}
                  <select
                    value={financialGoalText}
                    onChange={(e) => setFinancialGoalText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                  >
                    {goalsPreset.map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {financialGoalText === 'Outros' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Especifique o seu Objetivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Poupar para casar, Fazer mestrado..."
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800/50">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Seguinte <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 4: PREFERENCES ================= */}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-1">Personalize a sua Experiência</h3>
              <p className="text-xs text-slate-400">Configure as preferências de interface e alertas do sistema.</p>
            </div>

            <div className="space-y-4">
              {/* Receive Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Notificações Diárias</span>
                    <span className="text-[10px] text-slate-400">Alertas de gastos e relatórios</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowNotifications(!allowNotifications)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    allowNotifications ? 'bg-[#51a629]' : 'bg-slate-800'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    allowNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Theme preference */}
              <div className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Tema Visual</span>
                    <span className="text-[10px] text-slate-400">Mudar entre claro e escuro</span>
                  </div>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      theme === 'light' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400'
                    }`}
                  >
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      theme === 'dark' ? 'bg-[#51a629] text-white shadow-md' : 'text-slate-400'
                    }`}
                  >
                    Escuro
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800/50">
              <button
                onClick={() => setStep(3)}
                className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                className="w-1/2 py-3 bg-gradient-to-tr from-[#278c36] to-[#51a629] text-white rounded-xl text-xs font-bold transition-all shadow-xl shadow-[#51a629]/20 cursor-pointer flex items-center justify-center gap-1.5 border border-[#51a629]"
              >
                Concluir <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
