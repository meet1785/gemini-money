import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, TrendingUp, Calendar, Car, Home, Plane, GraduationCap, Heart, DollarSign, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialData } from "@/context/FinancialDataContext";

interface AddFundsState { goalId: string; amount: string; }

const GoalSetting = () => {
  const { toast } = useToast();
  const { goals, addGoal, addFundsToGoal } = useFinancialData();
  const [newGoal, setNewGoal] = useState({ name: "", targetAmount: "", targetDate: "", category: "Other", monthlyContribution: "" });
  const [addFunds, setAddFunds] = useState<AddFundsState | null>(null);

  const goalIcons: Record<string, any> = { Vehicle: Car, Home: Home, Travel: Plane, Education: GraduationCap, Health: Heart, Other: Target };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    addGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
      icon: goalIcons[newGoal.category] || Target
    } as any);
    setNewGoal({ name: "", targetAmount: "", targetDate: "", category: "Other", monthlyContribution: "" });
    toast({ title: "Goal Created", description: "Your financial goal has been added successfully" });
  };

  const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
  const calculateTimeToGoal = (current: number, target: number, monthly: number) => {
    if (monthly <= 0) return "Set monthly contribution";
    const remaining = target - current; const months = Math.ceil(remaining / monthly); const years = Math.floor(months / 12); const rm = months % 12;
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ${rm > 0 ? `${rm} month${rm > 1 ? 's' : ''}` : ''}`;
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Financial Goals</h2>
          <p className="text-muted-foreground text-lg">Set and track your financial goals with AI-powered planning</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add New Goal */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                New Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name *</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., New Car"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="500000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(p => ({ ...p, targetAmount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(p => ({ ...p, targetDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Contribution (₹)</Label>
                <Input
                  id="monthly"
                  type="number"
                  placeholder="10000"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => setNewGoal(p => ({ ...p, monthlyContribution: e.target.value }))}
                />
              </div>

              <Button onClick={handleAddGoal} className="w-full" variant="hero">
                <Plus className="h-4 w-4" />
                Create Goal
              </Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map(goal => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const timeToGoal = calculateTimeToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
                const IconComponent = (goal as any).icon || goalIcons[goal.category] || Target;
                const isAdding = addFunds?.goalId === goal.id;
                return (
                  <Card key={goal.id} className="shadow-card hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-primary p-2 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {goal.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>₹{goal.currentAmount.toLocaleString()}</span>
                          <span>₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-secondary" />
                          <span>₹{goal.monthlyContribution.toLocaleString()}/month</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Time to goal: {timeToGoal}
                        </div>
                      </div>

                      {isAdding ? (
                        <div className="flex gap-2 items-center">
                          <Input type="number" value={addFunds?.amount || ''} onChange={e => setAddFunds(s => s ? { ...s, amount: e.target.value } : s)} placeholder="₹ Amount" className="h-8" />
                          <Button size="sm" variant="hero" onClick={() => { const amt = parseFloat(addFunds?.amount || '0'); addFundsToGoal(goal.id, amt); setAddFunds(null); toast({ title: 'Funds Added', description: `Added ₹${amt.toLocaleString()} to ${goal.name}` }); }}><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddFunds(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setAddFunds({ goalId: goal.id, amount: '' })}>
                            <DollarSign className="h-3 w-3 mr-1" />
                            Add Funds
                          </Button>
                          <Button size="sm" variant="ghost" className="flex-1">
                            Edit
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Recommendations */}
            <Card className="shadow-card mt-8 bg-gradient-hero text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI Goal Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-medium mb-1">Emergency Fund Priority</p>
                    <p className="text-sm text-white/90">
                      Increase your emergency fund contribution to ₹20,000/month to reach your goal 3 months earlier.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-medium mb-1">New Goal Suggestion</p>
                    <p className="text-sm text-white/90">
                      Based on your savings pattern, consider setting up a retirement fund goal of ₹50L by 2040.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalSetting;