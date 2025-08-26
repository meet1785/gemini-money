import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, TrendingUp, Calendar, Car, Home, Plane, GraduationCap, Heart, DollarSign, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialData } from "@/context/FinancialDataContext";
import { ValidationService, type GoalFormData, type AddFundsFormData } from "@/services/validationService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import geminiService from "@/services/geminiService";

interface AddFundsState { 
  goalId: string; 
  amount: string; 
}

const GoalSetting = () => {
  const { toast } = useToast();
  const { goals, addGoal, addFundsToGoal } = useFinancialData();
  const [newGoal, setNewGoal] = useState({ 
    name: "", 
    targetAmount: "", 
    targetDate: "", 
    category: "Other", 
    monthlyContribution: "" 
  });
  const [addFunds, setAddFunds] = useState<AddFundsState | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  const goalIcons: Record<string, React.ComponentType> = { 
    Vehicle: Car, 
    Home: Home, 
    Travel: Plane, 
    Education: GraduationCap, 
    Health: Heart, 
    Other: Target 
  };

  const handleAddGoal = async () => {
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data using Zod
      const validation = ValidationService.validateGoal(newGoal);
      
      if (!validation.success) {
        const errors = ValidationService.formatErrors(validation.error);
        setValidationErrors(errors);
        toast({ 
          title: "Validation Error", 
          description: "Please fix the errors and try again", 
          variant: "destructive" 
        });
        return;
      }

      // Add the goal
      addGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
        icon: goalIcons[newGoal.category] || Target
      });
      
      setNewGoal({ 
        name: "", 
        targetAmount: "", 
        targetDate: "", 
        category: "Other", 
        monthlyContribution: "" 
      });
      
      toast({ 
        title: "Goal Created", 
        description: "Your financial goal has been added successfully" 
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({ 
        title: "Error", 
        description: "Failed to create goal. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
  const calculateTimeToGoal = (current: number, target: number, monthly: number) => {
    if (monthly <= 0) return "Set monthly contribution";
    const remaining = target - current; const months = Math.ceil(remaining / monthly); const years = Math.floor(months / 12); const rm = months % 12;
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ${rm > 0 ? `${rm} month${rm > 1 ? 's' : ''}` : ''}`;
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  const handleAddFunds = async () => {
    if (!addFunds) return;
    
    try {
      // Validate the amount using Zod
      const validation = ValidationService.validateAddFunds({ amount: addFunds.amount });
      
      if (!validation.success) {
        const errors = ValidationService.formatErrors(validation.error);
        toast({ 
          title: "Invalid Amount", 
          description: errors.amount || "Please enter a valid amount", 
          variant: "destructive" 
        });
        return;
      }

      addFundsToGoal(addFunds.goalId, parseFloat(addFunds.amount));
      setAddFunds(null);
      toast({ 
        title: "Funds Added", 
        description: "Your goal has been updated successfully" 
      });
    } catch (error) {
      console.error('Error adding funds:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add funds. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  // Helper to format currency input
  const handleCurrencyInput = (value: string, field: string) => {
    const formatted = ValidationService.formatCurrency(value);
    setNewGoal(prev => ({ ...prev, [field]: formatted }));
  };

  // Generate AI recommendations based on current goals
  const generateAIRecommendations = async () => {
    if (!goals.length) {
      setAiRecommendations(['Set your first financial goal to get personalized recommendations!']);
      setIsLoadingRecommendations(false);
      return;
    }

    try {
      setIsLoadingRecommendations(true);
      
      // Create context for AI based on current goals
      const goalContext = goals.map(goal => ({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate,
        monthlyContribution: goal.monthlyContribution,
        progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
      }));

      const prompt = `Based on these financial goals: ${JSON.stringify(goalContext)}, 
      provide 2-3 specific, actionable recommendations to improve goal achievement. 
      Focus on practical advice like adjusting monthly contributions, timeline optimization, 
      or suggesting complementary goals. Keep each recommendation under 100 words.
      Return as a simple array of strings.`;

      const response = await geminiService.generateFinancialAdvice(prompt, { goals: goalContext });
      
      // Try to parse response as array, fallback to splitting by lines
      let recommendations: string[] = [];
      try {
        recommendations = JSON.parse(response);
      } catch {
        // Fallback: split by lines and clean up
        recommendations = response
          .split('\n')
          .filter(line => line.trim() && !line.includes('```'))
          .map(line => line.replace(/^\d+\.\s*|\*\s*|-\s*/, '').trim())
          .filter(line => line.length > 20) // Filter out very short lines
          .slice(0, 3); // Take max 3 recommendations
      }

      setAiRecommendations(recommendations.length > 0 ? recommendations : [
        'Continue building your emergency fund - aim for 6 months of expenses',
        'Consider increasing monthly contributions by 10% when possible',
        'Review and adjust goal timelines based on market conditions'
      ]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setAiRecommendations([
        'Continue building your emergency fund - aim for 6 months of expenses',
        'Consider increasing monthly contributions by 10% when possible',
        'Review and adjust goal timelines based on market conditions'
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Load recommendations when goals change
  useEffect(() => {
    generateAIRecommendations();
  }, [goals]);

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
                  className={validationErrors.name ? 'border-destructive' : ''}
                />
                {validationErrors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                <Input
                  id="targetAmount"
                  placeholder="500000"
                  value={newGoal.targetAmount}
                  onChange={(e) => handleCurrencyInput(e.target.value, 'targetAmount')}
                  className={validationErrors.targetAmount ? 'border-destructive' : ''}
                />
                {validationErrors.targetAmount && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.targetAmount}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(p => ({ ...p, targetDate: e.target.value }))}
                  className={validationErrors.targetDate ? 'border-destructive' : ''}
                />
                {validationErrors.targetDate && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.targetDate}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Contribution (₹)</Label>
                <Input
                  id="monthly"
                  placeholder="10000"
                  value={newGoal.monthlyContribution}
                  onChange={(e) => handleCurrencyInput(e.target.value, 'monthlyContribution')}
                  className={validationErrors.monthlyContribution ? 'border-destructive' : ''}
                />
                {validationErrors.monthlyContribution && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.monthlyContribution}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAddGoal} 
                className="w-full" 
                variant="hero"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map(goal => {
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const timeToGoal = calculateTimeToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
                const IconComponent = (goal as { icon?: React.ComponentType }).icon || goalIcons[goal.category] || Target;
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
                          <Input 
                            type="number" 
                            value={addFunds?.amount || ''} 
                            onChange={e => setAddFunds(s => s ? { ...s, amount: e.target.value } : s)} 
                            placeholder="₹ Amount" 
                            className="h-8" 
                          />
                          <Button size="sm" variant="hero" onClick={handleAddFunds}>
                            <Check className="h-3 w-3" />
                          </Button>
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
                {isLoadingRecommendations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse text-white/70">
                      Generating personalized recommendations...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aiRecommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3">
                        <p className="font-medium mb-1">Recommendation {index + 1}</p>
                        <p className="text-sm text-white/90">
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {!geminiService.isReady() && (
                  <div className="mt-4 text-xs text-white/60">
                    Add your Gemini API key for more personalized recommendations
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalSetting;