import React from 'react';
import { FinancialState } from '../types';
import PersonalDashboard from './PersonalDashboard';
import FamilyDashboard from './FamilyDashboard';
import BusinessDashboard from './BusinessDashboard';

interface DashboardProps {
  financialState: FinancialState;
  onNavigate: (tab: string) => void;
  onOpenQuickAction: (type: 'income' | 'expense' | 'goal') => void;
  onStartOnboarding: () => void;
  onUpdateState?: (updates: Partial<FinancialState>) => void;
}

export default function Dashboard({ 
  financialState, 
  onNavigate, 
  onOpenQuickAction, 
  onStartOnboarding,
  onUpdateState
}: DashboardProps) {
  const accountType = financialState.accountType || 'personal';

  switch (accountType) {
    case 'company':
      return (
        <BusinessDashboard 
          financialState={financialState}
          onNavigate={onNavigate}
          onOpenQuickAction={onOpenQuickAction}
          onStartOnboarding={onStartOnboarding}
          onUpdateState={onUpdateState}
        />
      );
    case 'family':
      return (
        <FamilyDashboard 
          financialState={financialState}
          onNavigate={onNavigate}
          onOpenQuickAction={onOpenQuickAction}
        />
      );
    case 'personal':
    default:
      return (
        <PersonalDashboard 
          financialState={financialState}
          onNavigate={onNavigate}
          onOpenQuickAction={onOpenQuickAction}
          onStartOnboarding={onStartOnboarding}
        />
      );
  }
}
