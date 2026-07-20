import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Bell, 
  Menu, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart, 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Minus,
  Home,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Loader2,
  Key,
  Shield
} from 'lucide-react';

import { FinancialState, Transaction, Goal, Budget, Notification } from './types';
import Dashboard from './components/Dashboard';
import Wallet from './components/Wallet';
import Goals from './components/Goals';
import Analytics from './components/Analytics';
import Education from './components/Education';
import Profile from './components/Profile';
import FinBot from './components/FinBot';
import AuthAndLanding from './components/AuthAndLanding';
import OnboardingWizard from './components/OnboardingWizard';

// Initial Seeding Data generator by account type
function getSeedData(accountType: 'personal' | 'family' | 'company', userName: string, isOnboarded: boolean = true): FinancialState {
  if (!isOnboarded) {
    // Return a pristine, real, professional empty account state for real users - no simulated metrics or mock data
    return {
      userName: userName || (accountType === 'family' ? 'Família' : accountType === 'company' ? 'Empresa Lda.' : 'Utilizador'),
      currency: 'Kz',
      balance: 0,
      incomes: 0,
      expenses: 0,
      healthScore: 100,
      accountType,
      isOnboarded: false,
      showOnboardingAlert: true,
      transactions: [],
      goals: [],
      budgets: [
        { id: 'b1', category: 'Alimentação', limit: 0, spent: 0 },
        { id: 'b2', category: 'Transporte', limit: 0, spent: 0 },
        { id: 'b3', category: 'Internet', limit: 0, spent: 0 },
        { id: 'b4', category: 'Água', limit: 0, spent: 0 },
        { id: 'b5', category: 'Luz', limit: 0, spent: 0 },
        { id: 'b6', category: 'Saúde', limit: 0, spent: 0 },
        { id: 'b7', category: 'Educação', limit: 0, spent: 0 },
        { id: 'b8', category: 'Outros', limit: 0, spent: 0 }
      ],
      notifications: [],
      theme: 'dark',
      autoSaveType: 'disabled',
      autoSaveValue: 0,
      isLoggedIn: true,
      employees: [],
      clients: [],
      suppliers: [],
      familyMembersCount: 1,
      familyChildrenCount: 0,
      familyWorkingCount: 1,
      familyMembersList: []
    };
  }

  if (accountType === 'family') {
    return {
      userName: userName || 'Família Mendes',
      currency: 'Kz',
      balance: 485000,
      incomes: 750000,
      expenses: 265000,
      healthScore: 88,
      accountType: 'family',
      isOnboarded,
      showOnboardingAlert: !isOnboarded,
      transactions: [
        { id: 'tf1', description: 'Receita Serviços Família', amount: 750000, type: 'income', category: 'Salário', date: '2026-07-01' },
        { id: 'tf2', description: 'Supermercado Mensal', amount: 150000, type: 'expense', category: 'Alimentação', date: '2026-07-03' },
        { id: 'tf3', description: 'Colégio das Crianças', amount: 80000, type: 'expense', category: 'Educação', date: '2026-07-05' },
        { id: 'tf4', description: 'Combustível Familiar', amount: 35000, type: 'expense', category: 'Transporte', date: '2026-07-10' }
      ],
      goals: [
        { id: 'gf1', title: 'Férias em Família', target: 1200000, current: 650000, category: 'Viagens' }
      ],
      budgets: [
        { id: 'b1', category: 'Alimentação', limit: 200000, spent: 150000 },
        { id: 'b2', category: 'Transporte', limit: 50000, spent: 35000 },
        { id: 'b3', category: 'Internet', limit: 25000, spent: 0 },
        { id: 'b4', category: 'Água', limit: 15000, spent: 0 },
        { id: 'b5', category: 'Luz', limit: 30000, spent: 0 },
        { id: 'b6', category: 'Saúde', limit: 100000, spent: 0 },
        { id: 'b7', category: 'Educação', limit: 120000, spent: 80000 },
        { id: 'b8', category: 'Outros', limit: 80000, spent: 0 }
      ],
      notifications: [
        { id: 'nf1', text: 'Parabéns! Guardou mais 30% este mês para a meta de Férias.', type: 'success', date: 'Hoje', read: false }
      ],
      theme: 'dark',
      autoSaveType: 'percentage',
      autoSaveValue: 20,
      isLoggedIn: true
    };
  }

  if (accountType === 'company') {
    return {
      userName: userName || 'FinFalo Soluções',
      currency: 'Kz',
      balance: 1450000,
      incomes: 2500000,
      expenses: 1050000,
      healthScore: 92,
      accountType: 'company',
      isOnboarded,
      showOnboardingAlert: !isOnboarded,
      transactions: [
        { id: 'tc1', description: 'Faturação Cliente Alpha', amount: 1500000, type: 'income', category: 'Vendas', date: '2026-07-01' },
        { id: 'tc2', description: 'Faturação Cliente Beta', amount: 1000000, type: 'income', category: 'Vendas', date: '2026-07-02' },
        { id: 'tc3', description: 'Salários Equipa Técnica', amount: 800000, type: 'expense', category: 'Salários', date: '2026-07-05' },
        { id: 'tc4', description: 'Alojamento Cloud & SaaS', amount: 150000, type: 'expense', category: 'Internet', date: '2026-07-07' },
        { id: 'tc5', description: 'Licenças Software', amount: 100000, type: 'expense', category: 'Compras', date: '2026-07-08' }
      ],
      goals: [
        { id: 'gc1', title: 'Expandir Escritório', target: 5000000, current: 1500000, category: 'Investimentos' }
      ],
      budgets: [
        { id: 'b1', category: 'Alimentação', limit: 50000, spent: 0 },
        { id: 'b2', category: 'Transporte', limit: 100000, spent: 0 },
        { id: 'b3', category: 'Internet', limit: 300000, spent: 150000 },
        { id: 'b4', category: 'Água', limit: 20000, spent: 0 },
        { id: 'b5', category: 'Luz', limit: 50000, spent: 0 },
        { id: 'b6', category: 'Saúde', limit: 50000, spent: 0 },
        { id: 'b7', category: 'Educação', limit: 100000, spent: 0 },
        { id: 'b8', category: 'Outros', limit: 1500000, spent: 900000 }
      ],
      notifications: [
        { id: 'nc1', text: 'Fluxo de caixa positivo de 1.450.000 Kz registado este mês.', type: 'success', date: 'Ontem', read: false }
      ],
      theme: 'dark',
      autoSaveType: 'percentage',
      autoSaveValue: 20,
      isLoggedIn: true,

      // Preloaded company management data
      employees: [
        { id: 'emp1', name: 'António Luamba', role: 'Programador Sénior', salary: 350000 },
        { id: 'emp2', name: 'Maria Francisco', role: 'Designer UI/UX', salary: 250000 },
        { id: 'emp3', name: 'Carlos Neto', role: 'Gestor de Marketing', salary: 200000 }
      ],
      clients: [
        { id: 'cl1', name: 'Supermercados Kero', email: 'financas@kero.co.ao', phone: '923445566', status: 'Ativo' },
        { id: 'cl2', name: 'Banco Sol', email: 'solucoes@bancosol.ao', phone: '912887766', status: 'Ativo' },
        { id: 'cl3', name: 'Clínica Girassol', email: 'compras@girassol.ao', phone: '931554433', status: 'Pendente' }
      ],
      suppliers: [
        { id: 'sup1', name: 'Sapo ADSL', category: 'Internet', contact: 'comercial@sapo.ao' },
        { id: 'sup2', name: 'Unitel Empresas', category: 'Internet', contact: 'empresas@unitel.co.ao' },
        { id: 'sup3', name: 'ENDE Luanda', category: 'Energia', contact: 'apoio@ende.ao' }
      ]
    };
  }

  // Personal default (Henrique)
  return {
    userName: userName || 'Henrique',
    currency: 'Kz',
    balance: 215000,
    incomes: 250000,
    expenses: 35000,
    healthScore: 82,
    accountType: 'personal',
    isOnboarded,
    showOnboardingAlert: !isOnboarded,
    transactions: [
      { id: 't1', description: 'Salário', amount: 250000, type: 'income', category: 'Salário', date: '2026-07-01' },
      { id: 't2', description: 'Alimentação', amount: 15000, type: 'expense', category: 'Alimentação', date: '2026-07-05' },
      { id: 't3', description: 'Internet', amount: 12000, type: 'expense', category: 'Internet', date: '2026-07-08' },
      { id: 't4', description: 'Transporte', amount: 8000, type: 'expense', category: 'Transporte', date: '2026-07-12' }
    ],
    goals: [
      { id: 'g1', title: 'Comprar Computador', target: 600000, current: 420000, category: 'Tecnologia' }
    ],
    budgets: [
      { id: 'b1', category: 'Alimentação', limit: 80000, spent: 15000 },
      { id: 'b2', category: 'Transporte', limit: 30000, spent: 8000 },
      { id: 'b3', category: 'Internet', limit: 20000, spent: 12000 },
      { id: 'b4', category: 'Água', limit: 10000, spent: 0 },
      { id: 'b5', category: 'Luz', limit: 15000, spent: 0 },
      { id: 'b6', category: 'Saúde', limit: 50000, spent: 0 },
      { id: 'b7', category: 'Educação', limit: 60000, spent: 0 },
      { id: 'b8', category: 'Outros', limit: 40000, spent: 0 }
    ],
    notifications: [
      { id: 'n1', text: 'Gastou mais 25% em alimentação este mês.', type: 'danger', date: 'Hoje', read: false },
      { id: 'n2', text: 'Parabéns! Atingiu 70% da sua meta "Comprar Computador".', type: 'success', date: 'Ontem', read: false },
      { id: 'n3', text: 'Lembrete: Falta registar as despesas de hoje.', type: 'warning', date: 'Há 2 dias', read: true }
    ],
    theme: 'dark',
    autoSaveType: 'percentage',
    autoSaveValue: 20,
    isLoggedIn: true
  };
}

const SEED_DATA: FinancialState = {
  userName: 'Henrique',
  currency: 'Kz',
  balance: 215000,
  incomes: 250000,
  expenses: 35000,
  healthScore: 82,
  transactions: [
    { id: 't1', description: 'Salário', amount: 250000, type: 'income', category: 'Salário', date: '2026-07-01' },
    { id: 't2', description: 'Alimentação', amount: 15000, type: 'expense', category: 'Alimentação', date: '2026-07-05' },
    { id: 't3', description: 'Internet', amount: 12000, type: 'expense', category: 'Internet', date: '2026-07-08' },
    { id: 't4', description: 'Transporte', amount: 8000, type: 'expense', category: 'Transporte', date: '2026-07-12' }
  ],
  goals: [
    { id: 'g1', title: 'Comprar Computador', target: 600000, current: 420000, category: 'Tecnologia' }
  ],
  budgets: [
    { id: 'b1', category: 'Alimentação', limit: 80000, spent: 15000 },
    { id: 'b2', category: 'Transporte', limit: 30000, spent: 8000 },
    { id: 'b3', category: 'Internet', limit: 20000, spent: 12000 },
    { id: 'b4', category: 'Água', limit: 10000, spent: 0 },
    { id: 'b5', category: 'Luz', limit: 15000, spent: 0 },
    { id: 'b6', category: 'Saúde', limit: 50000, spent: 0 },
    { id: 'b7', category: 'Educação', limit: 60000, spent: 0 },
    { id: 'b8', category: 'Outros', limit: 40000, spent: 0 }
  ],
  notifications: [
    { id: 'n1', text: 'Gastou mais 25% em alimentação este mês.', type: 'danger', date: 'Hoje', read: false },
    { id: 'n2', text: 'Parabéns! Atingiu 70% da sua meta "Comprar Computador".', type: 'success', date: 'Ontem', read: false },
    { id: 'n3', text: 'Lembrete: Falta registar as despesas de hoje.', type: 'warning', date: 'Há 2 dias', read: true }
  ],
  theme: 'dark',
  autoSaveType: 'percentage',
  autoSaveValue: 20,
  isLoggedIn: false
};

export default function App() {
  const [state, setState] = useState<FinancialState>(() => {
    const saved = localStorage.getItem('finfalo_state_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          safeActive: false,
          safeType: 'disabled',
          safeValue: 0,
          safeBalance: 0,
          safeLogs: [],
          ...parsed
        };
      } catch (e) {
        return {
          safeActive: false,
          safeType: 'disabled',
          safeValue: 0,
          safeBalance: 0,
          safeLogs: [],
          ...SEED_DATA
        };
      }
    }
    return {
      safeActive: false,
      safeType: 'disabled',
      safeValue: 0,
      safeBalance: 0,
      safeLogs: [],
      ...SEED_DATA
    };
  });

  const [activeTab, setActiveTab] = useState<string>('Início');
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Logout transition state
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutStep, setLogoutStep] = useState(1);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Quick action modal state
  const [quickActionType, setQuickActionType] = useState<'income' | 'expense' | 'goal' | null>(null);
  const [qaDesc, setQaDesc] = useState('');
  const [qaAmount, setQaAmount] = useState('');
  const [qaCategory, setQaCategory] = useState('');

  // Intercept states for transaction authorization by PIN
  const [pendingTxAction, setPendingTxAction] = useState<{
    type: 'add' | 'edit';
    newTx?: Omit<Transaction, 'id'>;
    updatedTx?: Transaction;
  } | null>(null);
  const [txPinInput, setTxPinInput] = useState('');
  const [txPinError, setTxPinError] = useState('');

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLogoutStep(1);

    // 1st Phase -> 2nd Phase after 1.2s
    setTimeout(() => {
      setLogoutStep(2);
      
      // 2nd Phase -> 3rd Phase after 1.2s
      setTimeout(() => {
        setLogoutStep(3);

        // 3rd Phase -> Finalize Logout after 1.2s
        setTimeout(() => {
          setIsLoggingOut(false);
          setState({
            userName: '',
            currency: 'Kz',
            balance: 0,
            incomes: 0,
            expenses: 0,
            healthScore: 100,
            transactions: [],
            goals: [],
            budgets: [],
            notifications: [],
            isLoggedIn: false
          });
          setActiveTab('Início');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Persist State
  useEffect(() => {
    localStorage.setItem('finfalo_state_2026', JSON.stringify(state));
    if (state.isLoggedIn && state.email) {
      localStorage.setItem(`finfalo_state_user_${state.email.toLowerCase()}`, JSON.stringify(state));
    }
  }, [state]);

  // Recalculate financial health and balance when transactions are updated
  const updateFinancials = (transactionsList: Transaction[], goalsList: Goal[], budgetsList: Budget[]) => {
    const incomesTotal = transactionsList
      .filter(t => t.type === 'income')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const expensesTotal = transactionsList
      .filter(t => t.type === 'expense')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const totalGoalContributions = goalsList.reduce((sum, curr) => sum + curr.current, 0);

    // Balance is incomes - expenses - goal savings
    const currentBalance = incomesTotal - expensesTotal;

    // Update categories spend on budgets dynamically
    const updatedBudgets = budgetsList.map(b => {
      const categorySpent = transactionsList
        .filter(t => t.type === 'expense' && t.category === b.category)
        .reduce((sum, curr) => sum + curr.amount, 0);
      return { ...b, spent: categorySpent };
    });

    // Smart financial health calculations (0-100)
    // Points based on: savings rate, budget limits, goal progress
    let score = 75;
    const savingsRate = incomesTotal > 0 ? ((incomesTotal - expensesTotal) / incomesTotal) * 100 : 0;
    if (savingsRate > 20) score += 10;
    if (savingsRate > 40) score += 5;
    if (savingsRate < 10) score -= 15;

    // Exceeded budgets penalty
    const exceededBudgetsCount = updatedBudgets.filter(b => b.spent > b.limit).length;
    score -= exceededBudgetsCount * 8;

    score = Math.max(0, Math.min(100, score));

    return {
      balance: currentBalance,
      incomes: incomesTotal,
      expenses: expensesTotal,
      budgets: updatedBudgets,
      healthScore: score
    };
  };

  // Intercept and request PIN for additions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    setPendingTxAction({ type: 'add', newTx });
    setTxPinInput('');
    setTxPinError('');
  };

  // Intercept and request PIN for edits
  const handleEditTransaction = (updatedTx: Transaction) => {
    setPendingTxAction({ type: 'edit', updatedTx });
    setTxPinInput('');
    setTxPinError('');
  };

  const handleVerifyTxPin = (e: React.FormEvent) => {
    e.preventDefault();
    setTxPinError('');

    const usersStr = localStorage.getItem('finfalo_registered_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const activeUser = users.find((u: any) => u.email.toLowerCase() === (state.email || '').toLowerCase());
    const correctPin = activeUser?.pin || '123456';

    if (txPinInput === correctPin) {
      if (pendingTxAction) {
        if (pendingTxAction.type === 'add' && pendingTxAction.newTx) {
          // Block negative balance on addition of expenses
          const txType = pendingTxAction.newTx.type;
          const txAmount = pendingTxAction.newTx.amount;
          if (txType === 'expense' && txAmount > state.balance) {
            setTxPinError(`Saldo insuficiente! Não é possível realizar esta operação pois o saldo disponível ficaria negativo. O seu saldo disponível atual é de ${state.balance.toLocaleString()} ${state.currency}.`);
            return;
          }
          executeAddTransaction(pendingTxAction.newTx);
        } else if (pendingTxAction.type === 'edit' && pendingTxAction.updatedTx) {
          // Block negative balance on edit of transactions
          const originalTx = state.transactions.find(t => t.id === pendingTxAction.updatedTx!.id);
          if (originalTx) {
            let balanceDiff = 0;
            if (originalTx.type === 'expense') balanceDiff += originalTx.amount;
            else balanceDiff -= originalTx.amount;

            if (pendingTxAction.updatedTx.type === 'expense') balanceDiff -= pendingTxAction.updatedTx.amount;
            else balanceDiff += pendingTxAction.updatedTx.amount;

            if (state.balance + balanceDiff < 0) {
              setTxPinError(`Saldo insuficiente! Esta alteração deixaria o seu saldo disponível negativo (${(state.balance + balanceDiff).toLocaleString()} ${state.currency}).`);
              return;
            }
          }
          executeEditTransaction(pendingTxAction.updatedTx);
        }
      }
      setPendingTxAction(null);
      setTxPinInput('');
    } else {
      setTxPinError('PIN de segurança incorreto. Autorização recusada.');
    }
  };

  // Real execution of adding transaction
  const executeAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 'tx_' + Date.now()
    };
    
    let updatedTxs = [tx, ...state.transactions];
    let updatedGoals = [...state.goals];
    let updatedNotifications = [...state.notifications];

    // Check if there's any active goal to fulfill when recording income
    if (newTx.type === 'income') {
      const autoSaveType = state.autoSaveType || 'percentage';
      const autoSaveValue = state.autoSaveValue !== undefined ? state.autoSaveValue : 20;

      if (autoSaveType !== 'disabled' && autoSaveValue > 0) {
        const activeGoalIndex = updatedGoals.findIndex(g => g.current < g.target);
        if (activeGoalIndex !== -1) {
          const activeGoal = updatedGoals[activeGoalIndex];
          const remainingNeeded = activeGoal.target - activeGoal.current;
          
          let contributionAmount = 0;
          if (autoSaveType === 'percentage') {
            contributionAmount = parseFloat((newTx.amount * (autoSaveValue / 100)).toFixed(2));
          } else {
            contributionAmount = autoSaveValue;
          }

          if (contributionAmount > remainingNeeded) {
            contributionAmount = remainingNeeded;
          }

          if (contributionAmount > 0) {
            // Register the auto discount as an expense transaction as requested
            const goalExpenseTx: Transaction = {
              id: 'tx_g_' + Date.now() + '_auto',
              description: `Poupança p/ Meta: ${activeGoal.title}`,
              amount: contributionAmount,
              type: 'expense',
              category: 'Investimentos',
              date: newTx.date || new Date().toISOString().split('T')[0]
            };

            // Append this new expense transaction
            updatedTxs = [goalExpenseTx, ...updatedTxs];

            // Update the current amount inside the goal
            updatedGoals = updatedGoals.map((g, idx) => 
              idx === activeGoalIndex 
                ? { ...g, current: parseFloat((g.current + contributionAmount).toFixed(2)) } 
                : g
            );

            // Add a notification about the discount
            const displaySavingStr = autoSaveType === 'percentage' ? `${autoSaveValue}%` : `${autoSaveValue} ${state.currency}`;
            const newNotif: Notification = {
              id: 'n_auto_' + Date.now(),
              text: `Poupança Automática: Descontámos ${displaySavingStr} (${contributionAmount.toLocaleString()} ${state.currency}) da entrada "${newTx.description}" e guardámos na meta "${activeGoal.title}". Tudo registado em despesas!`,
              type: 'success',
              date: 'Hoje',
              read: false
            };
            updatedNotifications = [newNotif, ...updatedNotifications];
          }
        }
      }
    }

    // Automatic Cofre/Safe saving rule
    let addedToSafe = 0;
    const updatedSafeLogs = state.safeLogs ? [...state.safeLogs] : [];
    if (newTx.type === 'income' && state.safeActive && state.safeType !== 'disabled') {
      const sType = state.safeType || 'percentage';
      const sValue = state.safeValue || 0;
      if (sValue > 0) {
        let deductionAmount = 0;
        if (sType === 'percentage') {
          deductionAmount = parseFloat((newTx.amount * (sValue / 100)).toFixed(2));
        } else {
          deductionAmount = sValue;
        }
        deductionAmount = Math.min(deductionAmount, newTx.amount);

        if (deductionAmount > 0) {
          addedToSafe = deductionAmount;
          const safeExpenseTx: Transaction = {
            id: 'tx_safe_' + Date.now() + '_auto',
            description: `Reforço Automático do Cofre`,
            amount: deductionAmount,
            type: 'expense',
            category: 'Cofre',
            date: newTx.date || new Date().toISOString().split('T')[0]
          };
          updatedTxs = [safeExpenseTx, ...updatedTxs];

          updatedSafeLogs.push({
            id: 'log_' + Date.now(),
            date: newTx.date || new Date().toISOString().split('T')[0],
            amount: deductionAmount,
            type: 'deposit',
            reason: `Entrada: ${newTx.description}`
          });

          const displaySafeStr = sType === 'percentage' ? `${sValue}%` : `${sValue} ${state.currency}`;
          const safeNotif: Notification = {
            id: 'n_safe_' + Date.now(),
            text: `Cofre FinFalo: Retirámos ${displaySafeStr} (${deductionAmount.toLocaleString()} ${state.currency}) da entrada "${newTx.description}" e guardámos de forma segura no seu Cofre Virtual!`,
            type: 'success',
            date: 'Hoje',
            read: false
          };
          updatedNotifications = [safeNotif, ...updatedNotifications];
        }
      }
    }

    const stats = updateFinancials(updatedTxs, updatedGoals, state.budgets);

    setState(prev => ({
      ...prev,
      transactions: updatedTxs,
      goals: updatedGoals,
      notifications: updatedNotifications,
      safeBalance: parseFloat(((prev.safeBalance || 0) + addedToSafe).toFixed(2)),
      safeLogs: updatedSafeLogs,
      ...stats
    }));
  };

  // Real execution of editing transaction
  const executeEditTransaction = (updatedTx: Transaction) => {
    const updatedTxs = state.transactions.map(t => t.id === updatedTx.id ? updatedTx : t);
    const stats = updateFinancials(updatedTxs, state.goals, state.budgets);

    setState(prev => ({
      ...prev,
      transactions: updatedTxs,
      ...stats
    }));
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updatedTxs = state.transactions.filter(t => t.id !== id);
    const stats = updateFinancials(updatedTxs, state.goals, state.budgets);

    setState(prev => ({
      ...prev,
      transactions: updatedTxs,
      ...stats
    }));
  };

  // Add goal
  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: 'goal_' + Date.now()
    };
    
    let updatedTxs = [...state.transactions];
    if (goal.current > 0) {
      if (goal.current > state.balance) {
        alert("Saldo insuficiente para definir o valor inicial desta meta.");
        return;
      }
      // Create an expense transaction for the initial contribution
      const initialTx: Transaction = {
        id: 'tx_g_init_' + Date.now(),
        description: `Depósito Inicial Meta: ${goal.title}`,
        amount: goal.current,
        type: 'expense',
        category: 'Investimentos',
        date: new Date().toISOString().split('T')[0]
      };
      updatedTxs = [initialTx, ...updatedTxs];
    }

    const updatedGoals = [...state.goals, goal];
    const stats = updateFinancials(updatedTxs, updatedGoals, state.budgets);

    setState(prev => ({
      ...prev,
      transactions: updatedTxs,
      goals: updatedGoals,
      ...stats
    }));
  };

  // Contribute to Goal
  const handleContributeGoal = (id: string, amount: number) => {
    if (amount > state.balance) {
      alert("Saldo insuficiente para contribuir esta quantia para o objetivo.");
      return;
    }

    const targetGoal = state.goals.find(g => g.id === id);
    if (!targetGoal) return;

    const updatedGoals = state.goals.map(g => {
      if (g.id === id) {
        return { ...g, current: parseFloat((g.current + amount).toFixed(2)) };
      }
      return g;
    });

    // Create an expense transaction for this contribution
    const contributionTx: Transaction = {
      id: 'tx_g_' + Date.now(),
      description: `Contribuição Meta: ${targetGoal.title}`,
      amount: amount,
      type: 'expense',
      category: 'Investimentos',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedTxs = [contributionTx, ...state.transactions];
    const stats = updateFinancials(updatedTxs, updatedGoals, state.budgets);

    setState(prev => ({
      ...prev,
      transactions: updatedTxs,
      goals: updatedGoals,
      ...stats
    }));
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    const updatedGoals = state.goals.filter(g => g.id !== id);
    const stats = updateFinancials(state.transactions, updatedGoals, state.budgets);

    setState(prev => ({
      ...prev,
      goals: updatedGoals,
      ...stats
    }));
  };

  // Update category budget limit
  const handleUpdateBudget = (category: string, limit: number) => {
    const updatedBudgets = state.budgets.map(b => b.category === category ? { ...b, limit } : b);
    const stats = updateFinancials(state.transactions, state.goals, updatedBudgets);

    setState(prev => ({
      ...prev,
      budgets: updatedBudgets,
      ...stats
    }));
  };

  // Toggle notifications read status
  const markNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // Handle Quick actions form submit
  const handleQuickActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaDesc.trim() || !qaAmount || !qaCategory) return;

    const amountNum = parseFloat(qaAmount);

    if (quickActionType === 'income') {
      handleAddTransaction({
        description: qaDesc,
        amount: amountNum,
        type: 'income',
        category: qaCategory,
        date: new Date().toISOString().split('T')[0]
      });
    } else if (quickActionType === 'expense') {
      handleAddTransaction({
        description: qaDesc,
        amount: amountNum,
        type: 'expense',
        category: qaCategory,
        date: new Date().toISOString().split('T')[0]
      });
    } else if (quickActionType === 'goal') {
      handleAddGoal({
        title: qaDesc,
        target: amountNum,
        current: 0,
        category: qaCategory
      });
    }

    // Reset QA
    setQuickActionType(null);
    setQaDesc('');
    setQaAmount('');
    setQaCategory('');
  };

  const handleOpenQuickAction = (type: 'income' | 'expense' | 'goal') => {
    setQuickActionType(type);
    setQaCategory(type === 'income' ? 'Salário' : type === 'expense' ? 'Alimentação' : 'Tecnologia');
  };

  // Render correct tab view
  const renderView = () => {
    switch (activeTab) {
      case 'Início':
        return (
          <Dashboard 
            financialState={state} 
            onNavigate={setActiveTab} 
            onOpenQuickAction={handleOpenQuickAction} 
            onStartOnboarding={() => setState(prev => ({ ...prev, isOnboarded: false }))}
            onUpdateState={(updates) => setState(prev => ({ ...prev, ...updates }))}
          />
        );
      case 'Carteira':
        return (
          <Wallet 
            financialState={state} 
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateBudget={handleUpdateBudget}
          />
        );
      case 'Objetivos':
        return (
          <Goals 
            financialState={state} 
            onAddGoal={handleAddGoal}
            onContributeGoal={handleContributeGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'Análises':
        return <Analytics financialState={state} />;
      case 'Educação':
        return <Education />;
      case 'Perfil':
        return (
          <Profile 
            financialState={state} 
            onUpdateState={(updates) => setState(prev => ({ ...prev, ...updates }))} 
          />
        );
      default:
        return (
          <Dashboard 
            financialState={state} 
            onNavigate={setActiveTab} 
            onOpenQuickAction={handleOpenQuickAction} 
            onStartOnboarding={() => setState(prev => ({ ...prev, isOnboarded: false }))}
            onUpdateState={(updates) => setState(prev => ({ ...prev, ...updates }))}
          />
        );
    }
  };

  const unreadNotificationsCount = state.notifications.filter(n => !n.read).length;

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-[#031c33] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        {/* Background glow highlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#51a629]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0869A6]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          {/* Main Phase Icon Header */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#0869A6]/10 border border-[#0869A6]/20 flex items-center justify-center">
                {logoutStep === 1 && <Key className="w-8 h-8 text-[#51a629] animate-pulse" />}
                {logoutStep === 2 && <Shield className="w-8 h-8 text-emerald-400 animate-bounce" />}
                {logoutStep === 3 && <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                {logoutStep}/3
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">Desconexão Segura</h2>
            <p className="text-[11px] text-slate-400 mt-1">A fechar a sua sessão e a limpar dados temporários do sistema.</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-[#51a629] to-emerald-400 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${logoutStep === 1 ? 33 : logoutStep === 2 ? 66 : 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">
              <span>A iniciar</span>
              <span>{logoutStep === 1 ? '33%' : logoutStep === 2 ? '66%' : '100%'}</span>
            </div>
          </div>

          {/* Detailed Reading Phases (3 phases) */}
          <div className="space-y-3.5 pt-2 text-left">
            {/* Phase 1 */}
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
              logoutStep >= 1 
                ? 'border-emerald-500/25 bg-emerald-500/5' 
                : 'border-slate-800/40 bg-slate-950/20 opacity-40'
            }`}>
              <div className="shrink-0">
                {logoutStep > 1 ? (
                  <div className="w-6 h-6 rounded-full bg-[#51a629]/20 border border-[#51a629]/40 flex items-center justify-center text-[#51a629]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                ) : logoutStep === 1 ? (
                  <Loader2 className="w-5 h-5 text-[#51a629] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-800" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fase 1: Encriptação de Sessão Local</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  {logoutStep > 1 ? 'Chaves locais e preferências guardadas com encriptação AES.' : 'A encriptar credenciais de segurança e preferências locais...'}
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
              logoutStep >= 2 
                ? 'border-emerald-500/25 bg-emerald-500/5' 
                : 'border-slate-800/40 bg-slate-950/20 opacity-40'
            }`}>
              <div className="shrink-0">
                {logoutStep > 2 ? (
                  <div className="w-6 h-6 rounded-full bg-[#51a629]/20 border border-[#51a629]/40 flex items-center justify-center text-[#51a629]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                ) : logoutStep === 2 ? (
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-800" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fase 2: Comunicação de Auditoria</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  {logoutStep < 2 
                    ? 'A aguardar conclusão da fase anterior...' 
                    : logoutStep > 2 
                      ? 'Canais de transação e logs de auditoria fechados com sucesso.' 
                      : 'A desvincular canais de comunicação financeira e logs seguros...'}
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
              logoutStep >= 3 
                ? 'border-emerald-500/25 bg-emerald-500/5' 
                : 'border-slate-800/40 bg-slate-950/20 opacity-40'
            }`}>
              <div className="shrink-0">
                {logoutStep > 3 ? (
                  <div className="w-6 h-6 rounded-full bg-[#51a629]/20 border border-[#51a629]/40 flex items-center justify-center text-[#51a629]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                ) : logoutStep === 3 ? (
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-800" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fase 3: Reposição de Memória e Chaves</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  {logoutStep < 3 
                    ? 'A aguardar sincronização...' 
                    : 'A eliminar chaves temporárias de autenticação e histórico do browser...'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            FinFalo • Segurança & Planeamento
          </div>
        </div>
      </div>
    );
  }

  if (!state.isLoggedIn) {
    return (
      <AuthAndLanding 
        currency={state.currency || 'Kz'}
        onLoginSuccess={(userName, accountType, email) => {
          const userKey = `finfalo_state_user_${email.toLowerCase()}`;
          const savedUserStr = localStorage.getItem(userKey);
          let userState: FinancialState;
          if (savedUserStr) {
            try {
              userState = JSON.parse(savedUserStr);
              userState.isLoggedIn = true;
            } catch (err) {
              userState = { ...getSeedData(accountType, userName), isLoggedIn: true, email: email.toLowerCase() };
            }
          } else {
            const isTestAccount = ['personal@finfalo.com', 'familia@finfalo.com', 'empresa@finfalo.com'].includes(email.toLowerCase());
            userState = { ...getSeedData(accountType, userName, isTestAccount), isLoggedIn: true, email: email.toLowerCase() };
          }
          setState(userState);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[#031c33] flex text-slate-100 font-sans selection:bg-[#51a629] selection:text-white ${state.theme === 'light' ? 'light-mode' : ''}`}>
      
      {/* Onboarding Wizard Flow */}
      {state.isLoggedIn && !state.isOnboarded && (
        <OnboardingWizard
          financialState={state}
          onComplete={(updates) => {
            setState(prev => {
              const newState = {
                ...prev,
                ...updates,
                isOnboarded: true,
                showOnboardingAlert: false
              };
              
              // If they input a monthlyIncome during onboarding, set it as the initial income and balance, and record a transaction
              if (updates.monthlyIncome && updates.monthlyIncome > 0 && prev.balance === 0) {
                const initialTx = {
                  id: `tx_init_${Date.now()}`,
                  description: prev.accountType === 'company' ? 'Faturação Mensal Inicial' : 'Salário Mensal Inicial',
                  amount: updates.monthlyIncome,
                  type: 'income' as const,
                  category: prev.accountType === 'company' ? 'Vendas' : 'Salário',
                  date: new Date().toISOString().split('T')[0]
                };
                newState.balance = updates.monthlyIncome;
                newState.incomes = updates.monthlyIncome;
                newState.transactions = [initialTx];
              }
              
              return newState;
            });
          }}
          onSkip={() => {
            setState(prev => ({
              ...prev,
              isOnboarded: true,
              showOnboardingAlert: true
            }));
          }}
        />
      )}

      {/* Mobile backdrop overlay to close sidebar */}
      {isSidebarOpen && (
        <span 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden block"
        />
      )}

      {/* 1. Desktop Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#031c33] border-r border-[#0869A6]/20 z-40 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col justify-between ${
        isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Logo container */}
          <div className="p-6 border-b border-[#0869A6]/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg className="w-10 h-10 text-[#51a629] shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="opacity-20" />
                <path d="M30 65C30 42 45 32 70 32" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M45 70C45 55 55 45 70 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="70" cy="32" r="7" fill="#51a629" className="animate-pulse" />
              </svg>
              <div>
                <span className="font-display font-black text-lg text-white uppercase tracking-wider block">FinFalo</span>
                <span className="text-[9px] text-[#51a629] font-mono font-bold tracking-widest block -mt-1 uppercase">FINTECH INTELIGENTE</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menus List */}
          <nav className="p-4 space-y-1.5 mt-4">
            {[
              { name: 'Início', icon: Home },
              { name: 'Carteira', icon: TrendingUp },
              { name: 'Objetivos', icon: Target },
              { name: 'Análises', icon: PieChart },
              { name: 'Educação', icon: BookOpen },
              { name: 'Perfil', icon: User }
            ].map((menuItem) => {
              const Icon = menuItem.icon;
              const isActive = activeTab === menuItem.name;
              return (
                <button
                  key={menuItem.name}
                  onClick={() => {
                    setActiveTab(menuItem.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'bg-[#51a629]/15 border border-[#51a629]/30 text-white shadow-[0_0_15px_rgba(81,166,41,0.08)]' 
                      : 'border border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {menuItem.name}
                </button>
              );
            })}

            {/* Mobile-only Terminar Sessão option inside Hamburger menu */}
            <div className="pt-2.5 mt-2.5 border-t border-[#0869A6]/20 lg:hidden">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
                Terminar Sessão
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-[#0869A6]/20 space-y-3 bg-slate-900/10">
          {/* FinBot Toggle CTA */}
          <button
            onClick={() => setIsBotOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#51a629]/10 to-[#053259]/20 hover:from-[#51a629]/15 border border-[#51a629]/25 hover:border-[#51a629]/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-[#51a629] animate-pulse" />
              <div>
                <span className="text-xs font-bold text-white block">FinBot</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Assistente Inteligente</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={() => {
              setShowLogoutConfirm(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/5 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 text-slate-500 hover:text-rose-400" /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Pane Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top bar header */}
        <header className="sticky top-0 bg-[#031c33]/80 backdrop-blur-md border-b border-[#0869A6]/20 z-30 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-slate-300 text-xs hidden sm:inline-block uppercase tracking-widest font-mono">
              {state.accountType === 'family' 
                ? 'Conta de Família' 
                : state.accountType === 'company' 
                  ? 'Conta de Empresa' 
                  : 'Conta Pessoal'} • <span className="text-[#51a629]">{state.userName}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* FinBot Header Toggle button */}
            <button
              onClick={() => setIsBotOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#51a629]/30 text-[#51a629] flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
            >
              <Bot className="w-4.5 h-4.5 animate-pulse" /> FinBot
            </button>

            {/* Notification trigger button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) markNotificationsRead();
                }}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[9px] rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown card */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-display font-bold text-white uppercase tracking-wider">Centro de Notificações</span>
                    <button 
                      onClick={() => setIsNotificationsOpen(false)} 
                      className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto space-y-2.5">
                    {state.notifications.map((not) => (
                      <div key={not.id} className="pt-2.5 first:pt-0">
                        <div className="flex items-start gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                            not.type === 'danger' ? 'bg-rose-500' : not.type === 'success' ? 'bg-[#51a629]' : 'bg-amber-400'
                          }`} />
                          <div>
                            <p className="text-xs text-slate-200 leading-normal">{not.text}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{not.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Page View Component */}
        <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>

        {/* 2. Responsive Bottom Navigation Bar (Mobile specific overlay) */}
        <div className="fixed bottom-0 inset-x-0 bg-[#031c33]/95 backdrop-blur-md border-t border-[#0869A6]/25 z-40 py-2 px-1 flex items-center justify-around lg:hidden">
          {[
            { label: 'Início', tab: 'Início', icon: Home },
            { label: 'Carteira', tab: 'Carteira', icon: TrendingUp },
            { label: 'Objetivos', tab: 'Objetivos', icon: Target },
            { label: 'Análises', tab: 'Análises', icon: PieChart },
            { label: 'Educar', tab: 'Educação', icon: BookOpen },
            { label: 'Perfil', tab: 'Perfil', icon: User }
          ].map((btn) => {
            const Icon = btn.icon;
            const isActive = activeTab === btn.tab;
            return (
              <button
                key={btn.tab}
                onClick={() => setActiveTab(btn.tab)}
                className={`flex flex-col items-center gap-0.5 cursor-pointer py-1 flex-1 transition-all ${
                  isActive ? 'text-[#51a629] scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold tracking-tight">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Action Button (FAB) for adding new transactions on mobile & desktop */}
        <button
          onClick={() => handleOpenQuickAction('expense')}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-[#51a629] text-white flex items-center justify-center shadow-lg shadow-[#51a629]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#51a629]/50 filter drop-shadow-[0_0_8px_rgba(81,166,41,0.4)]"
          title="Registar Transação"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Shared Global Footer */}
        <footer className="border-t border-slate-900 py-6 px-4 sm:px-6 text-center text-[10px] sm:text-[11px] text-slate-500 space-y-3 mt-auto">
          <p className="max-w-md mx-auto leading-relaxed">© 2026 FinFalo S.A. Todos os direitos reservados. Gestão de Finanças de Nova Geração.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-slate-400 font-semibold">
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">Política de Privacidade</a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a href="#terms" className="hover:text-emerald-400 transition-colors">Termos de Utilização</a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a href="#support" className="hover:text-emerald-400 transition-colors">Suporte Técnico</a>
          </div>
        </footer>
      </div>

      {/* AI FinBot Sidebar Drawer Overlay */}
      <FinBot 
        financialState={state} 
        isOpen={isBotOpen} 
        onClose={() => setIsBotOpen(false)} 
      />

      {/* Shared Global Quick Action modal popup */}
      {quickActionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#053259] border border-[#0869A6]/30 p-6 rounded-2xl space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#0869A6]/20 pb-2">
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#51a629]" />
                {quickActionType === 'income' ? 'Nova Receita' : quickActionType === 'expense' ? 'Nova Despesa' : 'Nova Meta'}
              </h3>
              <button onClick={() => setQuickActionType(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickActionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Descrição / Título</label>
                <input
                  type="text"
                  required
                  placeholder={quickActionType === 'goal' ? 'Ex: Comprar Computador...' : 'Ex: Salário, Supermercado...'}
                  value={qaDesc}
                  onChange={(e) => setQaDesc(e.target.value)}
                  className="w-full bg-[#031c33] border border-[#0869A6]/35 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#0869A6]/60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Valor / Meta ({state.currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="0.00"
                  value={qaAmount}
                  onChange={(e) => setQaAmount(e.target.value)}
                  className="w-full bg-[#031c33] border border-[#0869A6]/35 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#0869A6]/60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Categoria</label>
                <select
                  value={qaCategory}
                  onChange={(e) => setQaCategory(e.target.value)}
                  className="w-full bg-[#031c33] border border-[#0869A6]/35 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none focus:border-[#0869A6]/60"
                >
                  {quickActionType === 'income' ? (
                    ['Salário', 'Negócios', 'Bónus', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)
                  ) : quickActionType === 'expense' ? (
                    ['Alimentação', 'Transporte', 'Água', 'Luz', 'Internet', 'Saúde', 'Educação', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)
                  ) : (
                    ['Tecnologia', 'Viagens', 'Carro', 'Casa', 'Investimentos', 'Fundo de Emergência', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#51a629] hover:bg-[#278c36] text-white transition-colors text-xs font-bold cursor-pointer"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pure HTML Custom Safe Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-[#053259] border border-rose-500/25 p-6 rounded-2xl space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                  Terminar Sessão Segura?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Desejas mesmo sair da tua conta do <span className="text-[#51a629] font-bold">FinFalo</span>? A tua carteira, transações e objetivos estão salvaguardados e encriptados na cloud local do teu navegador.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 border border-rose-400/30 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/10 cursor-pointer"
              >
                Sim, Terminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction PIN Verification Modal overlay */}
      {pendingTxAction && (
        <div className="fixed inset-0 bg-[#031c33]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-white">Autorização de Segurança</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Por favor, introduza o seu **PIN de 6 dígitos** para autorizar {pendingTxAction.type === 'add' ? 'a criação deste novo movimento' : 'esta alteração na transação'}.
              </p>
              {pendingTxAction.newTx && (
                <div className="mt-3 px-4 py-2 bg-slate-950/50 border border-slate-800/40 rounded-xl inline-flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Valor do Movimento:</span>
                  <span className={`text-sm font-bold font-mono mt-0.5 ${pendingTxAction.newTx.type === 'income' ? 'text-[#51a629]' : 'text-rose-400'}`}>
                    {pendingTxAction.newTx.type === 'income' ? '+' : '-'}{pendingTxAction.newTx.amount.toLocaleString()} {state.currency}
                  </span>
                  <span className="text-[11px] text-slate-300 italic font-medium mt-1">"{pendingTxAction.newTx.description}"</span>
                </div>
              )}
              {pendingTxAction.updatedTx && (
                <div className="mt-3 px-4 py-2 bg-slate-950/50 border border-slate-800/40 rounded-xl inline-flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Valor Editado:</span>
                  <span className={`text-sm font-bold font-mono mt-0.5 ${pendingTxAction.updatedTx.type === 'income' ? 'text-[#51a629]' : 'text-rose-400'}`}>
                    {pendingTxAction.updatedTx.type === 'income' ? '+' : '-'}{pendingTxAction.updatedTx.amount.toLocaleString()} {state.currency}
                  </span>
                  <span className="text-[11px] text-slate-300 italic font-medium mt-1">"{pendingTxAction.updatedTx.description}"</span>
                </div>
              )}
            </div>

            {txPinError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-400" />
                <span>{txPinError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyTxPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••••"
                  value={txPinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) setTxPinInput(val);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[0.5em] text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPendingTxAction(null);
                    setTxPinInput('');
                  }}
                  className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={txPinInput.length !== 6}
                  className="w-1/2 py-3 bg-[#51a629] hover:bg-[#278c36] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#51a629]/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Autorizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
