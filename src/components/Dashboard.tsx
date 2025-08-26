import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  PieChart,
  CreditCard,
  Wallet,
  TrendingUpIcon,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react";
import useRealtimeFinancialData from "@/hooks/useRealtimeFinancialData";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, cardHover, fadeInUp } from "@/lib/animations";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const Dashboard = () => {
  const { data, lastUpdate, isConnected, updatePortfolio } = useRealtimeFinancialData();
  const [financialHealth, setFinancialHealth] = useState(78);

  // Calculate dynamic financial health based on actual data
  useEffect(() => {
    const calculateHealthScore = () => {
      const { portfolio } = data;
      
      // Simple health calculation based on returns and portfolio diversity
      let score = 50; // Base score
      
      // Portfolio performance (30 points max)
      if (portfolio.returnPercentage > 15) score += 30;
      else if (portfolio.returnPercentage > 10) score += 20;
      else if (portfolio.returnPercentage > 5) score += 10;
      
      // Day change impact (10 points max)
      if (portfolio.dayChangePercentage > 0) score += 10;
      else if (portfolio.dayChangePercentage > -2) score += 5;
      
      // Portfolio size relative to investment (10 points max)  
      if (portfolio.totalValue > 400000) score += 10;
      else if (portfolio.totalValue > 200000) score += 5;
      
      setFinancialHealth(Math.min(100, Math.max(0, score)));
    };

    calculateHealthScore();
  }, [data.portfolio]);

  const monthlyIncome = 85000;
  const monthlyExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const savings = monthlyIncome - monthlyExpenses;

  // Calculate expense breakdown percentages
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesWithPercentage = data.expenses.map(expense => ({
    ...expense,
    percentage: Math.round((expense.amount / totalExpenses) * 100),
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' // Random for demo
  }));

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Your Financial Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Complete overview of your financial health and progress
          </p>
        </motion.div>

        {/* Real-time Status */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Alert className={`${isConnected ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center gap-2">
              {isConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-orange-600" />}
              <AlertDescription className="flex items-center justify-between w-full">
                <span className={isConnected ? 'text-green-800' : 'text-orange-800'}>
                  {isConnected ? 'Real-time data connected' : 'Connection interrupted - using cached data'}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated {formatLastUpdate(lastUpdate)}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>

        {/* Financial Health Score */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
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
                  <motion.div 
                    className="text-4xl font-bold"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    <AnimatedCounter value={financialHealth} suffix="/100" />
                  </motion.div>
                  <Progress value={financialHealth} className="flex-1 h-3" />
                </div>
                <p className="text-white/90">
                  Great job! Your financial health is strong. Keep up the good work with saving and investing.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Wallet className="h-5 w-5 text-secondary" />
                    </motion.div>
                    <span className="text-2xl font-bold">
                      ₹<AnimatedCounter value={monthlyIncome} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <CreditCard className="h-5 w-5 text-destructive" />
                    </motion.div>
                    <span className="text-2xl font-bold">
                      ₹<AnimatedCounter value={monthlyExpenses} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <DollarSign className="h-5 w-5 text-secondary" />
                    </motion.div>
                    <span className="text-2xl font-bold">
                      ₹<AnimatedCounter value={savings} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <TrendingUpIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span className="text-2xl font-bold">
                      ₹<AnimatedCounter value={data.portfolio.totalValue} />
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs ${data.portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.portfolio.dayChange >= 0 ? '+' : ''}₹<AnimatedCounter value={Math.abs(data.portfolio.dayChange)} duration={1.5} /> 
                      ({data.portfolio.dayChangePercentage >= 0 ? '+' : ''}<AnimatedCounter value={Math.abs(data.portfolio.dayChangePercentage)} decimals={1} duration={1.5} />%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Goals Progress */}
          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Financial Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.goals.map((goal, index) => {
                    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                    return (
                      <motion.div 
                        key={goal.id} 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ₹<AnimatedCounter value={goal.currentAmount} /> / ₹<AnimatedCounter value={goal.targetAmount} />
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          <AnimatedCounter value={Math.round(progress)} suffix="% complete" />
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Expense Breakdown */}
          <motion.div variants={staggerItem}>
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full"
            >
              <Card className="shadow-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expensesWithPercentage.map((expense, index) => (
                    <motion.div 
                      key={expense.id} 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
                        <span className="font-medium">{expense.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">₹<AnimatedCounter value={expense.amount} /></span>
                        <span className="text-xs text-muted-foreground">(<AnimatedCounter value={expense.percentage} suffix="%" />)</span>
                        {expense.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                        {expense.trend === "down" && <TrendingDown className="h-3 w-3 text-secondary" />}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;