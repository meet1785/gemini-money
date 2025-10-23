import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

// ---- Types ----
export interface Investment {
  id: string;
  name: string;
  invested: number;
  current: number;
  returns: number;
  returnPercentage: number;
  allocation: number; // percentage of portfolio
  type: string;
  risk: 'Low' | 'Medium' | 'High';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string; // ISO date
  description: string;
  type: 'manual' | 'uploaded' | 'recurring';
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO date
  endDate?: string; // Optional end date
  lastProcessed?: string; // Last date this was processed
  isActive: boolean;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  monthlyContribution: number;
  icon?: LucideIcon;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

interface FinancialDataContextValue {
  portfolio: PortfolioSummary;
  investments: Investment[];
  expenses: Expense[];
  goals: Goal[];
  recurringTransactions: RecurringTransaction[];
  lastUpdate: Date;
  isConnected: boolean;
  // Actions
  simulatePortfolioUpdate: () => void;
  addExpense: (partial: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  addGoal: (partial: Omit<Goal, 'id' | 'currentAmount'>) => void;
  addFundsToGoal: (goalId: string, amount: number) => void;
  addInvestment: (partial: Omit<Investment, 'id' | 'returns' | 'returnPercentage' | 'allocation'>) => void;
  addRecurringTransaction: (partial: Omit<RecurringTransaction, 'id' | 'lastProcessed'>) => void;
  removeRecurringTransaction: (id: string) => void;
  toggleRecurringTransaction: (id: string) => void;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void;
}

const FinancialDataContext = createContext<FinancialDataContextValue | undefined>(undefined);

// Default data for first-time users
const DEFAULT_INVESTMENTS: Investment[] = [
  {
    id: 'inv1',
    name: 'Equity Mutual Funds',
    invested: 200000,
    current: 235000,
    returns: 35000,
    returnPercentage: 17.5,
    allocation: 48.5,
    type: 'Mutual Fund',
    risk: 'High'
  },
  {
    id: 'inv2',
    name: 'Fixed Deposits',
    invested: 150000,
    current: 162000,
    returns: 12000,
    returnPercentage: 8.0,
    allocation: 33.4,
    type: 'Fixed Deposit',
    risk: 'Low'
  },
  {
    id: 'inv3',
    name: 'Direct Stocks',
    invested: 70000,
    current: 88000,
    returns: 18000,
    returnPercentage: 25.7,
    allocation: 18.1,
    type: 'Stocks',
    risk: 'High'
  }
];

const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp1',
    category: 'Food & Dining',
    amount: 12500,
    date: new Date().toISOString().split('T')[0],
    description: 'Groceries and dining out',
    type: 'manual'
  },
  {
    id: 'exp2',
    category: 'Transportation',
    amount: 8500,
    date: new Date().toISOString().split('T')[0],
    description: 'Fuel and public transport',
    type: 'manual'
  },
  {
    id: 'exp3',
    category: 'Entertainment',
    amount: 4500,
    date: new Date().toISOString().split('T')[0],
    description: 'Movies and subscriptions',
    type: 'manual'
  }
];

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal1',
    name: 'Emergency Fund',
    targetAmount: 600000,
    currentAmount: 420000,
    targetDate: '2025-06-01',
    category: 'Emergency',
    monthlyContribution: 25000
  },
  {
    id: 'goal2',
    name: 'Home Down Payment',
    targetAmount: 2000000,
    currentAmount: 850000,
    targetDate: '2026-12-31',
    category: 'Major Purchase',
    monthlyContribution: 40000
  }
];

const DEFAULT_RECURRING_TRANSACTIONS: RecurringTransaction[] = [
  {
    id: 'rec1',
    name: 'Monthly Salary',
    amount: 85000,
    category: 'Income',
    frequency: 'monthly',
    startDate: '2024-01-01',
    isActive: true,
    description: 'Monthly salary deposit'
  },
  {
    id: 'rec2',
    name: 'Rent Payment',
    amount: 25000,
    category: 'Housing',
    frequency: 'monthly',
    startDate: '2024-01-05',
    isActive: true,
    description: 'Monthly rent'
  }
];

export const FinancialDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or use defaults
  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = getFromStorage<Investment[]>(STORAGE_KEYS.INVESTMENTS);
    return saved || DEFAULT_INVESTMENTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES);
    return saved || DEFAULT_EXPENSES;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = getFromStorage<Goal[]>(STORAGE_KEYS.GOALS);
    return saved || DEFAULT_GOALS;
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    const saved = getFromStorage<RecurringTransaction[]>(STORAGE_KEYS.RECURRING_TRANSACTIONS);
    return saved || DEFAULT_RECURRING_TRANSACTIONS;
  });

  const [portfolio, setPortfolio] = useState<PortfolioSummary>(() => {
    const totalInvested = investments.reduce((s, i) => s + i.invested, 0);
    const totalValue = investments.reduce((s, i) => s + i.current, 0);
    const totalReturns = totalValue - totalInvested;
    return {
      totalValue,
      totalInvested,
      totalReturns,
      returnPercentage: Number(((totalReturns / totalInvested) * 100).toFixed(2)),
      dayChange: 0,
      dayChangePercentage: 0
    };
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const recomputePortfolio = useCallback(() => {
    const totalInvested = investments.reduce((s, i) => s + i.invested, 0);
    const totalValue = investments.reduce((s, i) => s + i.current, 0);
    const totalReturns = totalValue - totalInvested;
    setPortfolio(prev => ({
      ...prev,
      totalValue,
      totalInvested,
      totalReturns,
      returnPercentage: Number(((totalReturns / totalInvested) * 100).toFixed(2))
    }));
  }, [investments]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INVESTMENTS, investments);
  }, [investments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECURRING_TRANSACTIONS, recurringTransactions);
  }, [recurringTransactions]);

  useEffect(() => {
    recomputePortfolio();
  }, [recomputePortfolio]);

  const simulatePortfolioUpdate = useCallback(() => {
    // simulate small random change applied to each investment's current value
    setInvestments(prev => prev.map(inv => {
      const changePct = (Math.random() - 0.5) * 0.01; // ±0.5%
      const newCurrent = Math.max(0, Math.round(inv.current * (1 + changePct)));
      const returns = newCurrent - inv.invested;
      return {
        ...inv,
        current: newCurrent,
        returns,
        returnPercentage: Number(((returns / inv.invested) * 100).toFixed(2))
      };
    }));

    setPortfolio(prev => {
      const oldValue = prev.totalValue;
      const newValue = investments.reduce((s, i) => s + i.current, 0);
      const dayChange = newValue - oldValue;
      return {
        ...prev,
        totalValue: newValue,
        totalReturns: newValue - prev.totalInvested,
        returnPercentage: Number((((newValue - prev.totalInvested) / prev.totalInvested) * 100).toFixed(2)),
        dayChange,
        dayChangePercentage: Number(((dayChange / oldValue) * 100 || 0).toFixed(2))
      };
    });

    // recompute allocations
    setInvestments(curr => {
      const newTotal = curr.reduce((s, i) => s + i.current, 0) || 1;
      return curr.map(i => ({ ...i, allocation: Number(((i.current / newTotal) * 100).toFixed(1)) }));
    });

    setLastUpdate(new Date());
  }, [investments]);

  // interval for portfolio simulation
  useEffect(() => {
    const id = setInterval(simulatePortfolioUpdate, 30000);
    return () => clearInterval(id);
  }, [simulatePortfolioUpdate]);

  // simulate connection reliability
  useEffect(() => {
    const id = setInterval(() => setIsConnected(Math.random() > 0.05), 10000);
    return () => clearInterval(id);
  }, []);

  // Process recurring transactions
  const processRecurringTransactions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newExpenses: Expense[] = [];
    const updatedTransactions: RecurringTransaction[] = [];

    recurringTransactions.forEach(transaction => {
      if (!transaction.isActive) return;

      const startDate = new Date(transaction.startDate);
      startDate.setHours(0, 0, 0, 0);

      // Check if we should process this transaction
      if (startDate > today) return;

      // Check if end date has passed
      if (transaction.endDate) {
        const endDate = new Date(transaction.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (endDate < today) return;
      }

      // Get last processed date or use start date
      const lastProcessed = transaction.lastProcessed 
        ? new Date(transaction.lastProcessed) 
        : new Date(startDate);
      lastProcessed.setHours(0, 0, 0, 0);

      // Calculate if we need to add a new transaction
      let shouldProcess = false;
      const nextProcessDate = new Date(lastProcessed);

      switch (transaction.frequency) {
        case 'daily':
          nextProcessDate.setDate(nextProcessDate.getDate() + 1);
          shouldProcess = nextProcessDate <= today;
          break;
        case 'weekly':
          nextProcessDate.setDate(nextProcessDate.getDate() + 7);
          shouldProcess = nextProcessDate <= today;
          break;
        case 'monthly':
          nextProcessDate.setMonth(nextProcessDate.getMonth() + 1);
          shouldProcess = nextProcessDate <= today;
          break;
        case 'yearly':
          nextProcessDate.setFullYear(nextProcessDate.getFullYear() + 1);
          shouldProcess = nextProcessDate <= today;
          break;
      }

      if (shouldProcess) {
        // Create expense from recurring transaction
        newExpenses.push({
          id: `rec-${transaction.id}-${Date.now()}`,
          amount: transaction.amount,
          category: transaction.category,
          description: `${transaction.name} (Recurring)`,
          date: today.toISOString().split('T')[0],
          type: 'recurring'
        });

        // Mark transaction as updated
        updatedTransactions.push({
          ...transaction,
          lastProcessed: today.toISOString().split('T')[0]
        });
      }
    });

    // Batch update expenses and transactions
    if (newExpenses.length > 0) {
      setExpenses(prev => [...newExpenses, ...prev]);
    }
    if (updatedTransactions.length > 0) {
      setRecurringTransactions(prev => 
        prev.map(t => {
          const updated = updatedTransactions.find(ut => ut.id === t.id);
          return updated || t;
        })
      );
      setLastUpdate(new Date());
    }
  }, [recurringTransactions]);

  // Check recurring transactions daily
  useEffect(() => {
    // Process immediately on mount
    processRecurringTransactions();

    // Check every hour for new transactions
    const id = setInterval(processRecurringTransactions, 3600000);
    return () => clearInterval(id);
  }, [processRecurringTransactions]);

  const addExpense = (partial: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...partial, id: Date.now().toString() }, ...prev]);
    setLastUpdate(new Date());
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setLastUpdate(new Date());
  };

  const addGoal = (partial: Omit<Goal, 'id' | 'currentAmount'>) => {
    setGoals(prev => [...prev, { ...partial, currentAmount: 0, id: Date.now().toString() }]);
    setLastUpdate(new Date());
  };

  const addFundsToGoal = (goalId: string, amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g));
    setLastUpdate(new Date());
  };

  const addInvestment = (partial: Omit<Investment, 'id' | 'returns' | 'returnPercentage' | 'allocation'>) => {
    setInvestments(prev => {
      const newInv: Investment = {
        ...partial,
        id: Date.now().toString(),
        returns: partial.current - partial.invested,
        returnPercentage: Number((((partial.current - partial.invested) / partial.invested) * 100).toFixed(2)),
        allocation: 0
      };
      return [...prev, newInv];
    });
    setLastUpdate(new Date());
  };

  const addRecurringTransaction = (partial: Omit<RecurringTransaction, 'id' | 'lastProcessed'>) => {
    const newTransaction: RecurringTransaction = {
      ...partial,
      id: Date.now().toString(),
      lastProcessed: undefined
    };
    setRecurringTransactions(prev => [...prev, newTransaction]);
    setLastUpdate(new Date());
  };

  const removeRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(t => t.id !== id));
    setLastUpdate(new Date());
  };

  const toggleRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
    );
    setLastUpdate(new Date());
  };

  const updateRecurringTransaction = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    setLastUpdate(new Date());
  };

  const value: FinancialDataContextValue = {
    portfolio,
    investments,
    expenses,
    goals,
    recurringTransactions,
    lastUpdate,
    isConnected,
    simulatePortfolioUpdate,
    addExpense,
    removeExpense,
    addGoal,
    addFundsToGoal,
    addInvestment,
    addRecurringTransaction,
    removeRecurringTransaction,
    toggleRecurringTransaction,
    updateRecurringTransaction
  };

  return (
    <FinancialDataContext.Provider value={value}>{children}</FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const ctx = useContext(FinancialDataContext);
  if (!ctx) throw new Error('useFinancialData must be used within FinancialDataProvider');
  return ctx;
};
