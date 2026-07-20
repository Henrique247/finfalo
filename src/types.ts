export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
  deadline?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Notification {
  id: string;
  text: string;
  type: 'danger' | 'success' | 'warning' | 'info';
  date: string;
  read: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  content: string;
}

export interface SavingChallenge {
  id: string;
  title: string;
  targetAmount: number;
  durationWeeks: number;
  weeklyAmount: number;
  currentWeek: number;
  completed: boolean;
}

export interface FinancialState {
  userName: string;
  currency: string;
  balance: number;
  incomes: number;
  expenses: number;
  healthScore: number;
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
  notifications: Notification[];
  theme?: 'light' | 'dark';
  autoSaveType?: 'percentage' | 'fixed' | 'disabled';
  autoSaveValue?: number;
  accountType?: 'personal' | 'family' | 'company';
  isLoggedIn?: boolean;
  email?: string;
  
  // Onboarding & Profile details
  phone?: string;
  birthDate?: string;
  province?: string;
  monthlyIncome?: number;
  financialGoalText?: string;
  allowNotifications?: boolean;
  isOnboarded?: boolean;
  showOnboardingAlert?: boolean;

  // Company account features
  employees?: { id: string; name: string; role: string; salary: number }[];
  clients?: { id: string; name: string; email: string; phone: string; status: string }[];
  suppliers?: { id: string; name: string; category: string; contact: string }[];
}
