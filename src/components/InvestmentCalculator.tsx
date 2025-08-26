import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

const InvestmentCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [years, setYears] = useState(5);
  const [returnRate, setReturnRate] = useState(12);

  const calculateReturns = () => {
    const monthlyRate = returnRate / 100 / 12;
    const totalMonths = years * 12;
    const futureValue = monthlyInvestment * 
      (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate) * (1 + monthlyRate);
    
    const totalInvested = monthlyInvestment * totalMonths;
    const returns = futureValue - totalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested,
      returns: Math.round(returns)
    };
  };

  const results = calculateReturns();

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Investment Calculator</h2>
          <p className="text-muted-foreground text-lg">
            See how your money can grow with systematic investments
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Investment (₹)</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return">Expected Annual Return (%)</Label>
                <Input
                  id="return"
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <Button variant="hero" className="w-full" size="lg">
                <TrendingUp className="h-5 w-5" />
                Calculate Growth
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                Projected Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{results.totalInvested.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-success text-white rounded-lg p-4">
                  <p className="text-sm text-white/90">Expected Returns</p>
                  <p className="text-2xl font-bold">
                    ₹{results.returns.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-primary text-white rounded-lg p-4">
                  <p className="text-sm text-white/90">Future Value</p>
                  <p className="text-3xl font-bold">
                    ₹{results.futureValue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Your ₹{monthlyInvestment.toLocaleString()} monthly investment could grow to{' '}
                  <span className="font-semibold text-secondary">
                    ₹{results.futureValue.toLocaleString()}
                  </span>{' '}
                  in {years} years!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InvestmentCalculator;