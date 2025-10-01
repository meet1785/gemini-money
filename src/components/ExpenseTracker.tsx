import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Plus,
  FileText,
  Trash2,
  Edit,
  Calendar,
  DollarSign,
  Tag,
  TrendingUp,
  Bot,
  Loader2,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import geminiService from "@/services/geminiService";
import { useFinancialData } from "@/context/FinancialDataContext";

interface EditingState {
  id: string;
  amount: string;
  category: string;
  description: string;
  date: string;
}

const ExpenseTracker = () => {
  const { toast } = useToast();
  const { expenses, addExpense, removeExpense } = useFinancialData();
  const [aiAnalysis, setAiAnalysis] = useState<{ insights: string[]; recommendations: string[]; trends: string; }>({ insights: [], recommendations: [], trends: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "", description: "", date: "" });
  const [editing, setEditing] = useState<EditingState | null>(null);

  // Get AI analysis when expenses change
  useEffect(() => {
    const analyzeExpenses = async () => {
      if (!expenses.length) return;
      
      setIsAnalyzing(true);
      try {
        const analysis = await geminiService.analyzeExpenses(expenses);
        setAiAnalysis(analysis);
      } catch (e) {
        console.error('Error analyzing expenses:', e);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timeout = setTimeout(analyzeExpenses, 1000); // Debounce analysis
    return () => clearTimeout(timeout);
  }, [expenses]);

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

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.date) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    addExpense({
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description || "No description",
      date: newExpense.date,
      type: 'manual'
    });
    setNewExpense({ amount: "", category: "", description: "", date: "" });
    
    toast({ title: "Expense Added", description: "Your expense has been tracked successfully" });
  };

  const handleFileUpload = () => {
    // Simulate file upload processing
    const simulatedExpenses = [
      {
        amount: 3200,
        category: 'Utilities',
        description: 'Electricity bill - AI categorized',
        date: new Date().toISOString().split('T')[0],
        type: 'uploaded' as const
      },
      {
        amount: 1800,
        category: 'Food & Dining', 
        description: 'Grocery shopping - AI categorized',
        date: new Date().toISOString().split('T')[0],
        type: 'uploaded' as const
      }
    ];

    simulatedExpenses.forEach(e => addExpense(e));
    
    toast({ title: "File Processed", description: "2 expenses automatically categorized by AI" });
  };

  const startEditing = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;
    setEditing({ id, amount: exp.amount.toString(), category: exp.category, description: exp.description, date: exp.date });
  };

  const cancelEditing = () => setEditing(null);

  const saveEditing = () => {
    if (!editing) return;
    // naive re-create: remove old then add new (keeps ordering simple)
    removeExpense(editing.id);
    addExpense({
      amount: parseFloat(editing.amount),
      category: editing.category,
      description: editing.description,
      date: editing.date,
      type: 'manual'
    });
    setEditing(null);
    toast({ title: 'Expense Updated', description: 'Changes saved.' });
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Smart Expense Tracker</h2>
          <p className="text-muted-foreground text-lg">
            Track expenses manually or upload bank statements for AI categorization
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add New Expense
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={newExpense.amount}
                  onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={value => setNewExpense(p => ({ ...p, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={e => setNewExpense(p => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description"
                  value={newExpense.description}
                  onChange={e => setNewExpense(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <Button onClick={handleAddExpense} className="w-full" variant="hero">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </CardContent>
          </Card>

          {/* Upload & Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* File Upload */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Bank Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload CSV or Excel file</p>
                  <p className="text-muted-foreground mb-4">
                    AI will automatically categorize your expenses
                  </p>
                  <Button onClick={handleFileUpload} variant="outline">
                    <Upload className="h-4 w-4" />
                    Choose File (Demo)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expense Summary */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Expense Summary
                  </span>
                  <Badge variant="secondary">
                    {expenses.length} transactions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  ₹{totalExpenses.toLocaleString()}
                </div>
                <p className="text-muted-foreground">Total expenses tracked</p>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.slice(0, 8).map(expense => {
                    const isEdit = editing?.id === expense.id;
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-primary p-2 rounded-lg">
                            <Tag className="h-4 w-4 text-white" />
                          </div>
                          <div className="space-y-1">
                            {isEdit ? (
                              <Input value={editing.amount} onChange={e => setEditing(s => s ? { ...s, amount: e.target.value } : s)} className="h-8 w-32 text-xs" />
                            ) : (
                              <p className="font-medium">{expense.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {isEdit ? (
                                  <Select value={editing.category} onValueChange={v => setEditing(s => s ? { ...s, category: v } : s)}>
                                    <SelectTrigger className="h-6 w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                ) : expense.category}
                              </Badge>
                              <Calendar className="h-3 w-3" />
                              {isEdit ? (
                                <Input type="date" value={editing.date} onChange={e => setEditing(s => s ? { ...s, date: e.target.value } : s)} className="h-6 w-36 text-xs" />
                              ) : expense.date}
                              {expense.type === 'uploaded' && <Badge variant="secondary" className="text-xs">AI</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          {isEdit ? (
                            <Input value={editing.description} onChange={e => setEditing(s => s ? { ...s, description: e.target.value } : s)} className="h-8 text-xs" placeholder="Description" />
                          ) : (
                            <p className="font-bold">₹{expense.amount.toLocaleString()}</p>
                          )}
                          <div className="flex gap-1 justify-end">
                            {isEdit ? (
                              <>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-green-600" onClick={saveEditing}>
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEditing}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => startEditing(expense.id)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => removeExpense(expense.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Expense Analysis
                  {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiAnalysis.insights.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Key Insights
                    </h4>
                    <div className="space-y-2">
                      {aiAnalysis.insights.map((insight, i) => (
                        <Alert key={i} className="border-blue-200 bg-blue-50/50">
                          <AlertDescription className="text-blue-700">
                            {insight}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <Alert key={i} className="border-green-200 bg-green-50/50">
                          <AlertDescription className="text-green-700">
                            • {rec}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.trends && (
                  <div>
                    <h4 className="font-medium mb-3">Spending Trends</h4>
                    <Alert className="border-orange-200 bg-orange-50/50">
                      <AlertDescription className="text-orange-700">
                        {aiAnalysis.trends}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {aiAnalysis.insights.length === 0 && aiAnalysis.recommendations.length === 0 && !aiAnalysis.trends && !isAnalyzing && (
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      Add more expenses to get AI-powered insights and recommendations.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpenseTracker;