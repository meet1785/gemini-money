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
import { useFinancialData } from "@/context/FinancialDataContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PortfolioTracker = () => {
  const { portfolio, investments, addInvestment } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [newInv, setNewInv] = useState({ name: "", invested: "", current: "", type: "Stocks", risk: "Medium" });

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

  const submitNewInvestment = () => {
    if (!newInv.name || !newInv.invested || !newInv.current) return;
    addInvestment({
      name: newInv.name,
      invested: parseFloat(newInv.invested),
      current: parseFloat(newInv.current),
      type: newInv.type,
      risk: newInv.risk as "High" | "Medium" | "Low"
    });
    setNewInv({ name: "", invested: "", current: "", type: "Stocks", risk: "Medium" });
    setShowForm(false);
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
                  {portfolio.dayChange >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
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
                  <Button size="sm" variant={showForm ? 'secondary' : 'outline'} onClick={() => setShowForm(s => !s)}>
                    {showForm ? 'Close' : <><Plus className="h-4 w-4" /> Add Investment</>}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showForm && (
                  <div className="border rounded-lg p-4 mb-6 grid md:grid-cols-5 gap-2 text-xs items-end">
                    <div className="space-y-1">
                      <Label>Name</Label>
                      <Input 
                        value={newInv.name} 
                        onChange={e => setNewInv(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g., Gold ETF" 
                        className="h-8" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Invested</Label>
                      <Input 
                        type="number" 
                        value={newInv.invested} 
                        onChange={e => setNewInv(p => ({ ...p, invested: e.target.value }))}
                        className="h-8" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Current</Label>
                      <Input 
                        type="number" 
                        value={newInv.current} 
                        onChange={e => setNewInv(p => ({ ...p, current: e.target.value }))}
                        className="h-8" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Type</Label>
                      <Input 
                        value={newInv.type} 
                        onChange={e => setNewInv(p => ({ ...p, type: e.target.value }))}
                        className="h-8" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Risk</Label>
                      <Input 
                        value={newInv.risk} 
                        onChange={e => setNewInv(p => ({ ...p, risk: e.target.value }))}
                        className="h-8" 
                      />
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                      <Button size="sm" onClick={submitNewInvestment}>Save</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  {investments.map(inv => (
                    <div key={inv.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{inv.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {inv.type}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getRiskColor(inv.risk)}`}>
                              {inv.risk} Risk
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
                          <p className="font-medium">₹{inv.invested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Current Value</p>
                          <p className="font-medium">₹{inv.current.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Returns</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-secondary">₹{inv.returns.toLocaleString()}</p>
                            <span className="text-xs text-secondary">
                              ({inv.returnPercentage >= 0 ? '+' : ''}{inv.returnPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Portfolio Allocation</span>
                          <span>{inv.allocation}%</span>
                        </div>
                        <Progress value={inv.allocation} className="h-1" />
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
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
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
                  <span className="text-sm font-medium">{[...investments].sort((a,b)=>b.returnPercentage-a.returnPercentage)[0]?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Investments</span>
                  <span className="text-sm font-medium">{investments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Return %</span>
                  <span className="text-sm font-medium">{portfolio.returnPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Day Change</span>
                  <span className="text-sm font-medium">{portfolio.dayChange >=0 ? '+' : ''}{portfolio.dayChangePercentage}%</span>
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