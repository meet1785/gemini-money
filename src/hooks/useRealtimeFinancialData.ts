import { useState, useEffect, useCallback } from 'react';

export interface FinancialData {
  portfolio: {
    totalValue: number;
    totalInvested: number;
    totalReturns: number;
    returnPercentage: number;
    dayChange: number;
    dayChangePercentage: number;
  };
  expenses: Array<{
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
  }>;
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    monthlyContribution: number;
  }>;
}

// Simulate real-time financial data updates
const useRealtimeFinancialData = () => {
  const [data, setData] = useState<FinancialData>({
    portfolio: {
      totalValue: 485000,
      totalInvested: 420000,
      totalReturns: 65000,
      returnPercentage: 15.48,
      dayChange: 2850,
      dayChangePercentage: 0.59
    },
    expenses: [
      {
        id: '1',
        category: 'Food & Dining',
        amount: 12500,
        date: new Date().toISOString().split('T')[0],
        description: 'Groceries and dining out'
      },
      {
        id: '2',
        category: 'Transportation',
        amount: 8500,
        date: new Date().toISOString().split('T')[0],
        description: 'Fuel and public transport'
      },
      {
        id: '3',
        category: 'Entertainment',
        amount: 4500,
        date: new Date().toISOString().split('T')[0],
        description: 'Movies and subscriptions'
      }
    ],
    goals: [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 600000,
        currentAmount: 420000,
        targetDate: '2025-06-01',
        category: 'Emergency',
        monthlyContribution: 25000
      },
      {
        id: '2',
        name: 'Home Down Payment',
        targetAmount: 2000000,
        currentAmount: 850000,
        targetDate: '2026-12-31',
        category: 'Major Purchase',
        monthlyContribution: 40000
      }
    ]
  });

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time portfolio updates
  const updatePortfolio = useCallback(() => {
    setData(prevData => {
      const newData = { ...prevData };
      
      // Simulate small changes in portfolio value (±0.5%)
      const changePercentage = (Math.random() - 0.5) * 0.01; // ±0.5%
      const oldValue = newData.portfolio.totalValue;
      const newValue = oldValue * (1 + changePercentage);
      const dayChange = newValue - oldValue;
      
      newData.portfolio = {
        ...newData.portfolio,
        totalValue: Math.round(newValue),
        totalReturns: Math.round(newValue - newData.portfolio.totalInvested),
        returnPercentage: Number(((newValue - newData.portfolio.totalInvested) / newData.portfolio.totalInvested * 100).toFixed(2)),
        dayChange: Math.round(dayChange),
        dayChangePercentage: Number((changePercentage * 100).toFixed(2))
      };
      
      return newData;
    });
    
    setLastUpdate(new Date());
  }, []);

  // Simulate adding new expenses
  const addExpense = useCallback((expense: Omit<FinancialData['expenses'][0], 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    
    setData(prevData => ({
      ...prevData,
      expenses: [...prevData.expenses, newExpense]
    }));
    
    setLastUpdate(new Date());
  }, []);

  // Update goal progress
  const updateGoalProgress = useCallback((goalId: string, newAmount: number) => {
    setData(prevData => ({
      ...prevData,
      goals: prevData.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: newAmount }
          : goal
      )
    }));
    
    setLastUpdate(new Date());
  }, []);

  // Simulate real-time updates every 30 seconds for portfolio
  useEffect(() => {
    const interval = setInterval(() => {
      updatePortfolio();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updatePortfolio]);

  // Simulate connection status
  useEffect(() => {
    const checkConnection = () => {
      // Simulate occasional disconnection
      const isOnline = Math.random() > 0.05; // 95% uptime
      setIsConnected(isOnline);
    };

    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    lastUpdate,
    isConnected,
    updatePortfolio,
    addExpense,
    updateGoalProgress
  };
};

export default useRealtimeFinancialData;