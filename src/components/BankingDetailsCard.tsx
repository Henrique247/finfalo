import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  CreditCard,
  X,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { getProfileBankingDetails } from '../utils/banking';

interface BankingDetailsCardProps {
  accountType?: 'personal' | 'family' | 'company';
  userName?: string;
  email?: string;
  currency?: string;
  compact?: boolean;
  onClose?: () => void;
}

export default function BankingDetailsCard({
  accountType = 'personal',
  userName = 'Utilizador',
  email = '',
  currency = 'Kz',
  compact = false,
  onClose
}: BankingDetailsCardProps) {
  const details = getProfileBankingDetails(accountType, userName, email);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getProfileTitle = () => {
    if (accountType === 'company') return 'Perfil Empresa / Negócio';
    if (accountType === 'family') return 'Perfil Cofre Familiar';
    return 'Perfil Pessoal';
  };

  const getBadgeColor = () => {
    if (accountType === 'company') return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    if (accountType === 'family') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-[#51a629]/15 text-[#51a629] border-[#51a629]/30';
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl relative overflow-hidden ${
      compact ? 'max-w-md w-full' : ''
    }`}>
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#51a629]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#278c36] to-[#51a629] text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <CreditCard className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border uppercase tracking-wider ${getBadgeColor()}`}>
                {getProfileTitle()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BFA / Multicaixa</span>
            </div>
            <h3 className="text-sm sm:text-base font-display font-bold text-white mt-0.5">
              Dados Bancários & Referências
            </h3>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed relative z-10">
        Utilize estes dados para receber transferências bancárias diretas ou pagamentos por referência no Multicaixa para este perfil específico ({details.holderName}).
      </p>

      {/* Banking Data Box */}
      <div className="space-y-3 relative z-10">
        
        {/* IBAN */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 group hover:border-[#51a629]/40 transition-colors">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider block">IBAN Oficial (Angola)</span>
            <div className="font-mono font-bold text-xs sm:text-sm text-white tracking-wider mt-0.5 select-all truncate">
              {details.iban}
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(details.iban, 'iban')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-[#51a629] text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-800 flex items-center gap-1.5 text-xs font-bold"
          >
            {copiedField === 'iban' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Multicaixa Entity & Reference Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Entidade */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 group hover:border-sky-500/40 transition-colors">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Entidade Multicaixa</span>
              <div className="font-mono font-black text-sm text-sky-400 mt-0.5">
                {details.entity}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(details.entity, 'entity')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-sky-500 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-800"
              title="Copiar Entidade"
            >
              {copiedField === 'entity' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Referência */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 group hover:border-emerald-500/40 transition-colors">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Referência de Pagamento</span>
              <div className="font-mono font-black text-sm text-emerald-400 mt-0.5">
                {details.reference}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(details.reference, 'reference')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-500 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-800"
              title="Copiar Referência"
            >
              {copiedField === 'reference' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Account Number & Holder */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block">Titular do Perfil:</span>
            <span className="font-bold text-white">{details.holderName}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block">Nº de Conta:</span>
            <span className="font-mono font-bold text-slate-200">{details.accountNumber}</span>
          </div>
        </div>

      </div>

      {/* Footer Share Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#51a629]" />
          Validação Automática Multicaixa Express
        </span>
        <button
          onClick={() => {
            const shareText = `Dados Bancários FinFalo (${getProfileTitle()})\nTitular: ${details.holderName}\nIBAN: ${details.iban}\nEntidade: ${details.entity}\nReferência: ${details.reference}`;
            navigator.clipboard.writeText(shareText);
            alert('Todos os dados bancários foram copiados para a área de transferência!');
          }}
          className="text-[#51a629] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Partilhar Dados Completo
        </button>
      </div>

    </div>
  );
}
