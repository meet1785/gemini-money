import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Repeat, 
  Plus, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialData } from "@/context/FinancialDataContext";
import { validateNumber, validateString, validateDate, formatCurrency } from "@/lib/validation";
import type { RecurringTransaction } from "@/context/FinancialDataContext";

const RecurringTransactions = () => {
  const { toast } = useToast();
  const { 
    recurringTransactions, 
    addRecurringTransaction, 
    removeRecurringTransaction, 
    toggleRecurringTransaction 
  } = useFinancialData();

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    category: "",
    frequency: "monthly" as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    description: ""
  });

  const categories = [
    "Income",
    "Food & Dining",
    "Transportation", 
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Education",
    "Housing",
    "Insurance",
    "Subscriptions",
    "Others"
  ];

  const frequencyLabels: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly"
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-purple-100 text-purple-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      case 'yearly': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTransaction = () => {
    // Validate inputs
    const nameValidation = validateString(newTransaction.name, { required: true, minLength: 2 });
    const amountValidation = validateNumber(newTransaction.amount, { min: 1 });
    const dateValidation = validateDate(newTransaction.startDate);

    if (!nameValidation.valid) {
      toast({
        title: "Invalid Name",
        description: nameValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!amountValidation.valid) {
      toast({
        title: "Invalid Amount",
        description: amountValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!newTransaction.category) {
      toast({
        title: "Missing Category",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (!dateValidation.valid) {
      toast({
        title: "Invalid Date",
        description: dateValidation.error,
        variant: "destructive"
      });
      return;
    }

    // Validate end date if provided
    if (newTransaction.endDate) {
      const endDateValidation = validateDate(newTransaction.endDate, { future: true });
      if (!endDateValidation.valid) {
        toast({
          title: "Invalid End Date",
          description: endDateValidation.error,
          variant: "destructive"
        });
        return;
      }

      // Check if end date is after start date
      if (new Date(newTransaction.endDate) <= new Date(newTransaction.startDate)) {
        toast({
          title: "Invalid Date Range",
          description: "End date must be after start date",
          variant: "destructive"
        });
        return;
      }
    }

    const transaction: Omit<RecurringTransaction, 'id' | 'lastProcessed'> = {
      name: nameValidation.value,
      amount: amountValidation.value,
      category: newTransaction.category,
      frequency: newTransaction.frequency,
      startDate: newTransaction.startDate,
      endDate: newTransaction.endDate || undefined,
      isActive: true,
      description: newTransaction.description || `Recurring ${newTransaction.frequency} ${newTransaction.category.toLowerCase()}`
    };

    addRecurringTransaction(transaction);
    
    // Reset form
    setNewTransaction({
      name: "",
      amount: "",
      category: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      description: ""
    });

    toast({
      title: "Recurring Transaction Added",
      description: `${transaction.name} will be automatically tracked ${transaction.frequency}`
    });
  };

  const handleRemove = (id: string, name: string) => {
    removeRecurringTransaction(id);
    toast({
      title: "Transaction Removed",
      description: `${name} has been removed from recurring transactions`
    });
  };

  const handleToggle = (id: string, name: string, isActive: boolean) => {
    toggleRecurringTransaction(id);
    toast({
      title: isActive ? "Transaction Paused" : "Transaction Activated",
      description: `${name} is now ${isActive ? 'inactive' : 'active'}`
    });
  };

  const getNextOccurrence = (transaction: RecurringTransaction) => {
    const lastProcessed = transaction.lastProcessed 
      ? new Date(transaction.lastProcessed)
      : new Date(transaction.startDate);
    
    const next = new Date(lastProcessed);
    
    switch (transaction.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    
    return next.toISOString().split('T')[0];
  };

  return (
    <section className="py-8">
      <div className="container">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-6 w-6 text-primary" />
              Recurring Transactions
            </CardTitle>
            <CardDescription>
              Set up automatic recurring expenses and income to reduce manual tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Recurring Transaction Form */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Add New Recurring Transaction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Transaction Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Monthly Rent, Netflix Subscription"
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newTransaction.frequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setNewTransaction({ ...newTransaction, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTransaction.startDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newTransaction.endDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, endDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Additional details about this transaction"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleAddTransaction} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Recurring Transaction
              </Button>
            </div>

            {/* List of Recurring Transactions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Active & Scheduled Transactions</h3>
              
              {recurringTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Repeat className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recurring transactions set up yet.</p>
                  <p className="text-sm">Add your first recurring transaction above to automate expense tracking.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recurringTransactions.map((transaction) => (
                    <Card key={transaction.id} className={`${!transaction.isActive ? 'opacity-60' : ''}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-base">{transaction.name}</h4>
                              <Badge className={getFrequencyBadgeColor(transaction.frequency)}>
                                {frequencyLabels[transaction.frequency]}
                              </Badge>
                              {transaction.isActive ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Paused
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold text-foreground">
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                <span>{transaction.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>From {transaction.startDate}</span>
                              </div>
                              {transaction.isActive && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Next: {getNextOccurrence(transaction)}</span>
                                </div>
                              )}
                            </div>
                            
                            {transaction.description && (
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            )}
                            
                            {transaction.endDate && (
                              <p className="text-xs text-muted-foreground">
                                Ends on: {transaction.endDate}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={transaction.isActive}
                                onCheckedChange={() => handleToggle(transaction.id, transaction.name, transaction.isActive)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(transaction.id, transaction.name)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Stats */}
            {recurringTransactions.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Active</p>
                    <p className="text-lg font-semibold">
                      {recurringTransactions.filter(t => t.isActive).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Paused</p>
                    <p className="text-lg font-semibold">
                      {recurringTransactions.filter(t => !t.isActive).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Total</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(
                        recurringTransactions
                          .filter(t => t.isActive && t.frequency === 'monthly')
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Income Sources</p>
                    <p className="text-lg font-semibold">
                      {recurringTransactions.filter(t => t.category === 'Income' && t.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecurringTransactions;
