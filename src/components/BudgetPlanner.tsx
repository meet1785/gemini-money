import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialData } from "@/context/FinancialDataContext";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";
import { validateNumber } from "@/lib/validation";

interface BudgetCategory {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

const STORAGE_KEY_BUDGETS = 'financeGPT_budgets';

const BudgetPlanner = () => {
  const { toast } = useToast();
  const { expenses } = useFinancialData();
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    const saved = getFromStorage<BudgetCategory[]>(STORAGE_KEY_BUDGETS);
    return saved || [
      { id: 'b1', category: 'Food & Dining', limit: 15000, spent: 0, period: 'monthly' },
      { id: 'b2', category: 'Transportation', limit: 10000, spent: 0, period: 'monthly' },
      { id: 'b3', category: 'Entertainment', limit: 5000, spent: 0, period: 'monthly' },
    ];
  });

  const [newBudget, setNewBudget] = useState({ category: "", limit: "", period: 'monthly' as const });
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Calculate spent amounts from expenses
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const updatedBudgets = budgets.map(budget => {
      const categoryExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const matchesCategory = exp.category === budget.category;
        
        if (budget.period === 'monthly') {
          return matchesCategory && 
                 expDate.getMonth() === currentMonth && 
                 expDate.getFullYear() === currentYear;
        } else {
          return matchesCategory && expDate.getFullYear() === currentYear;
        }
      });

      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { ...budget, spent };
    });

    setBudgets(updatedBudgets);
    saveToStorage(STORAGE_KEY_BUDGETS, updatedBudgets);

    const total = updatedBudgets.reduce((sum, b) => sum + b.limit, 0);
    const spent = updatedBudgets.reduce((sum, b) => sum + b.spent, 0);
    setTotalBudget(total);
    setTotalSpent(spent);
  }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddBudget = () => {
    const limitValidation = validateNumber(newBudget.limit, { min: 0 });
    
    if (!newBudget.category || !limitValidation.valid) {
      toast({
        title: "Invalid Input",
        description: limitValidation.error || "Please fill all fields correctly",
        variant: "destructive"
      });
      return;
    }

    const budget: BudgetCategory = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: limitValidation.value,
      spent: 0,
      period: newBudget.period
    };

    const updated = [...budgets, budget];
    setBudgets(updated);
    saveToStorage(STORAGE_KEY_BUDGETS, updated);
    setNewBudget({ category: "", limit: "", period: 'monthly' });
    
    toast({
      title: "Budget Added",
      description: `Budget for ${newBudget.category} has been created`
    });
  };

  const removeBudget = (id: string) => {
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    saveToStorage(STORAGE_KEY_BUDGETS, updated);
    toast({ title: "Budget Removed", description: "Budget has been deleted" });
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-orange-600" />;
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  };

  const categories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Education",
    "Others"
  ];

  const totalProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PieChart className="h-4 w-4" />
            Smart Budget Planning
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Budget Planner
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Set spending limits and track your progress to stay on top of your finances
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add Budget Form */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Budget Category
              </CardTitle>
              <CardDescription>
                Set spending limits for different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newBudget.category}
                  onChange={e => setNewBudget(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Budget Limit (₹) *</Label>
                <Input
                  id="limit"
                  type="number"
                  placeholder="15000"
                  value={newBudget.limit}
                  onChange={e => setNewBudget(p => ({ ...p, limit: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <select
                  id="period"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newBudget.period}
                  onChange={e => setNewBudget(p => ({ ...p, period: e.target.value as 'monthly' | 'yearly' }))}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <Button onClick={handleAddBudget} className="w-full" variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Budget Summary */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Overall Budget Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(totalProgress, 100)} 
                    className={`h-3 ${getProgressColor(totalSpent, totalBudget)}`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {totalProgress.toFixed(1)}% used
                    </span>
                    <span className={totalProgress >= 100 ? "text-red-600 font-semibold" : "text-green-600"}>
                      ₹{Math.max(0, totalBudget - totalSpent).toLocaleString()} remaining
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Categories */}
            <div className="grid gap-4">
              {budgets.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No budgets created yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add your first budget to start tracking
                    </p>
                  </CardContent>
                </Card>
              ) : (
                budgets.map(budget => {
                  const progress = (budget.spent / budget.limit) * 100;
                  const remaining = budget.limit - budget.spent;
                  
                  return (
                    <Card key={budget.id} className="shadow-card hover:shadow-glow transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(budget.spent, budget.limit)}
                            <div>
                              <h3 className="font-semibold text-lg">{budget.category}</h3>
                              <Badge variant="outline" className="mt-1">
                                {budget.period}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBudget(budget.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                            </span>
                            <span className={remaining < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                              {remaining >= 0 ? (
                                <>₹{remaining.toLocaleString()} left</>
                              ) : (
                                <>₹{Math.abs(remaining).toLocaleString()} over budget</>
                              )}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(progress, 100)} 
                            className={`h-2 ${getProgressColor(budget.spent, budget.limit)}`}
                          />
                          <p className="text-xs text-muted-foreground">
                            {progress.toFixed(1)}% of budget used
                          </p>
                        </div>

                        {progress >= 100 && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Budget limit exceeded! Consider reducing spending in this category.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetPlanner;
