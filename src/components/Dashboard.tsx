import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  PieChart,
  CreditCard,
  Wallet,
  TrendingUpIcon
} from "lucide-react";

const Dashboard = () => {
  const financialHealth = 78;
  const monthlyIncome = 85000;
  const monthlyExpenses = 62000;
  const savings = 23000;
  const investments = 145000;
  
  const goals = [
    { name: "Emergency Fund", target: 300000, current: 180000, progress: 60 },
    { name: "New Car", target: 800000, current: 320000, progress: 40 },
    { name: "Vacation", target: 150000, current: 135000, progress: 90 }
  ];

  const expenses = [
    { category: "Food & Dining", amount: 18000, percentage: 29, trend: "up" },
    { category: "Transportation", amount: 12000, percentage: 19, trend: "down" },
    { category: "Entertainment", amount: 8000, percentage: 13, trend: "up" },
    { category: "Utilities", amount: 15000, percentage: 24, trend: "stable" },
    { category: "Others", amount: 9000, percentage: 15, trend: "down" }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Financial Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Complete overview of your financial health and progress
          </p>
        </div>

        {/* Financial Health Score */}
        <div className="mb-8">
          <Card className="shadow-card bg-gradient-hero text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Financial Health Score</span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {financialHealth > 70 ? "Excellent" : financialHealth > 50 ? "Good" : "Needs Work"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">{financialHealth}/100</div>
                <Progress value={financialHealth} className="flex-1 h-3" />
              </div>
              <p className="text-white/90">
                Great job! Your financial health is strong. Keep up the good work with saving and investing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-secondary" />
                <span className="text-2xl font-bold">₹{monthlyIncome.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-destructive" />
                <span className="text-2xl font-bold">₹{monthlyExpenses.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                <span className="text-2xl font-bold">₹{savings.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">₹{investments.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Goals Progress */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Financial Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {goal.progress}% complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
                    <span className="font-medium">{expense.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">₹{expense.amount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">({expense.percentage}%)</span>
                    {expense.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                    {expense.trend === "down" && <TrendingDown className="h-3 w-3 text-secondary" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;