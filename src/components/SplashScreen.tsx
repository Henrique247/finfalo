import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const FINANCIAL_TIPS = [
  "Mantenha pelo menos 3 a 6 meses de despesas guardadas de forma segura no seu Cofre Virtual.",
  "Separe rigorosamente as suas contas pessoais das finanças da sua empresa para garantir sustentabilidade.",
  "Acompanhe o seu Score de Saúde Financeira semanalmente para identificar desvios e otimizar custos.",
  "Para pequenas empresas e freelancers, emita faturas e recibos em PDF profissionais imediatamente após a prestação de serviços.",
  "Defina metas financeiras claras com prazos definidos para acelerar a realização dos seus sonhos e projetos.",
  "Ative a regra de reforço automático do Cofre Virtual para guardar uma percentagem de cada entrada de receita."
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Progress interval (0 to 100 in ~2.8 seconds)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Tip rotation every 1.8 seconds
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % FINANCIAL_TIPS.length);
    }, 1800);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#031c33] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#51a629]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0869A6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar branding */}
      <div className="w-full max-w-xl flex items-center justify-between relative z-10 pt-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#51a629]" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">Ambiente Seguro FinFalo</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#51a629] bg-[#51a629]/10 px-2.5 py-1 rounded-full border border-[#51a629]/20">
          v2.6 FinTech
        </span>
      </div>

      {/* Main Content Center */}
      <div className="w-full max-w-md flex flex-col items-center text-center relative z-10 my-auto py-8">
        {/* FinFalo Official Logo */}
        <div className="mb-6 relative">
          <div className="absolute -inset-4 bg-[#51a629]/20 rounded-full blur-xl animate-pulse" />
          <img 
            src="https://i.postimg.cc/Y01cWMGN/Fin-Falo.png" 
            alt="FinFalo - Soluções Financeiras Inteligentes" 
            className="h-20 sm:h-24 w-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(81,166,41,0.4)]"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider mb-1">
          FinFalo
        </h1>
        <p className="text-xs text-[#51a629] font-mono font-bold tracking-widest uppercase mb-8">
          Gestão Financeira Inteligente
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-4 p-0.5 mb-3 shadow-inner relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0869A6] via-[#51a629] to-[#80e24f] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(81,166,41,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 mb-8 px-1">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#51a629] animate-spin" /> A carregar o seu cofre...
          </span>
          <span className="text-[#51a629] font-black">{progress}%</span>
        </div>

        {/* Financial Tips Carousel Box */}
        <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl text-left relative min-h-[100px] flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#51a629] uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Dica de Gestão Financeira #{tipIndex + 1}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium transition-all duration-300">
            "{FINANCIAL_TIPS[tipIndex]}"
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-xl text-center relative z-10 pb-2">
        <p className="text-[10px] text-slate-500 font-mono">
          © 2026 FinFalo S.A. Todos os direitos reservados. Encriptação Local & Cloud.
        </p>
      </div>
    </div>
  );
}
