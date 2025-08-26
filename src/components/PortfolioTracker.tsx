import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const PortfolioTracker = () => {
  const portfolio = {
    totalValue: 485000,
    totalInvested: 420000,
    totalReturns: 65000,
    returnPercentage: 15.48,
    dayChange: 2850,
    dayChangePercentage: 0.59
  };

  const investments = [
    {
      name: "Equity Mutual Funds",
      invested: 200000,
      current: 235000,
      returns: 35000,
      returnPercentage: 17.5,
      allocation: 48.5,
      type: "Mutual Fund",
      risk: "High"
    },
    {
      name: "Fixed Deposits",
      invested: 150000,
      current: 162000,
      returns: 12000,
      returnPercentage: 8.0,
      allocation: 33.4,
      type: "Fixed Deposit",
      risk: "Low"
    },
    {
      name: "Direct Stocks",
      invested: 70000,
      current: 88000,
      returns: 18000,
      returnPercentage: 25.7,
      allocation: 18.1,
      type: "Stocks",
      risk: "High"
    }
  ];

  const recommendations = [
    {
      type: "Rebalance",
      title: "Consider Rebalancing",
      description: "Your equity allocation is above recommended 60%. Consider booking profits.",
      action: "Rebalance Now"
    },
    {
      type: "Diversify",
      title: "Add International Exposure",
      description: "Consider adding international mutual funds for better diversification.",
      action: "Explore Options"
    },
    {
      type: "SIP",
      title: "Increase SIP Amount",
      description: "Your current SIP can be increased by ₹5,000 based on your income.",
      action: "Increase SIP"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-destructive";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Portfolio Tracker</h2>
          <p className="text-muted-foreground text-lg">
            Monitor your investments and get AI-powered portfolio insights
          </p>
        </div>

        {/* Portfolio Overview */}
        <Card className="shadow-glow bg-gradient-hero text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio Overview</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {portfolio.returnPercentage > 0 ? "Profit" : "Loss"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Total Value</p>
                <p className="text-3xl font-bold">₹{portfolio.totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Invested</p>
                <p className="text-2xl font-bold">₹{portfolio.totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Total Returns</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">₹{portfolio.totalReturns.toLocaleString()}</p>
                  {portfolio.returnPercentage > 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-secondary" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-white/80">+{portfolio.returnPercentage}%</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Today's Change</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">₹{portfolio.dayChange.toLocaleString()}</p>
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-sm text-white/80">+{portfolio.dayChangePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Investment Holdings */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Investment Holdings
                  </span>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                    Add Investment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {investments.map((investment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{investment.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {investment.type}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getRiskColor(investment.risk)}`}>
                              {investment.risk} Risk
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Invested</p>
                          <p className="font-medium">₹{investment.invested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Current Value</p>
                          <p className="font-medium">₹{investment.current.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Returns</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-secondary">
                              ₹{investment.returns.toLocaleString()}
                            </p>
                            <span className="text-xs text-secondary">
                              (+{investment.returnPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Portfolio Allocation</span>
                          <span>{investment.allocation}%</span>
                        </div>
                        <Progress value={investment.allocation} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs mb-2">
                        {rec.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-secondary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Performer</span>
                  <span className="text-sm font-medium">Direct Stocks (+25.7%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Asset Allocation</span>
                  <span className="text-sm font-medium">66.6% Equity</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <span className="text-sm font-medium">7/10 (Moderate-High)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Diversification</span>
                  <span className="text-sm font-medium">Good</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTracker;