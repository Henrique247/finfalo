// Utility to generate unique, formatted Angolan banking details for each profile

export interface BankingDetails {
  iban: string;
  accountNumber: string;
  bankName: string;
  entity: string;
  reference: string;
  holderName: string;
}

export function getProfileBankingDetails(
  accountType: 'personal' | 'family' | 'company' = 'personal',
  userName: string = 'Utilizador',
  email: string = ''
): BankingDetails {
  // Generate deterministic numbers based on email / accountType string hash
  let hash = 0;
  const str = (email + accountType + userName).toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const bankCode = '0040'; // Standard BFA/BAI/BCA bank code
  const num1 = String(positiveHash % 89999999 + 10000000).padStart(8, '0');
  const num2 = String((positiveHash * 3) % 89999999 + 10000000).padStart(8, '0');
  
  if (accountType === 'company') {
    return {
      iban: `AO06.${bankCode}.0000.${num1.slice(0, 4)}.${num1.slice(4)}.${num2.slice(0, 4)}.1`,
      accountNumber: `${bankCode}.0000.${num1}.10.1`,
      bankName: 'Banco FinFalo Enterprise',
      entity: '10115',
      reference: `923 ${num1.slice(0, 3)} ${num2.slice(0, 3)}`,
      holderName: `${userName || 'Empresa'} Lda.`
    };
  }

  if (accountType === 'family') {
    return {
      iban: `AO06.${bankCode}.0000.${num2.slice(0, 4)}.${num2.slice(4)}.${num1.slice(0, 4)}.2`,
      accountNumber: `${bankCode}.0000.${num2}.20.1`,
      bankName: 'Banco FinFalo Família',
      entity: '10115',
      reference: `912 ${num2.slice(0, 3)} ${num1.slice(0, 3)}`,
      holderName: `Cofre Familiar (${userName || 'Mendes'})`
    };
  }

  // Personal
  return {
    iban: `AO06.${bankCode}.0000.${num1.slice(0, 4)}.${num2.slice(0, 4)}.${num1.slice(4)}.3`,
    accountNumber: `${bankCode}.0000.${num1}.30.1`,
    bankName: 'Banco FinFalo Pessoal',
    entity: '10115',
    reference: `931 ${num1.slice(0, 3)} ${num2.slice(0, 3)}`,
    holderName: userName || 'Conta Pessoal'
  };
}
