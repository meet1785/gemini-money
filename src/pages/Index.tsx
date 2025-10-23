import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import FinanceChat from "@/components/FinanceChat";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import ExpenseTracker from "@/components/ExpenseTracker";
import BudgetPlanner from "@/components/BudgetPlanner";
import GoalSetting from "@/components/GoalSetting";
import PortfolioTracker from "@/components/PortfolioTracker";
import RecurringTransactions from "@/components/RecurringTransactions";
import EducationHub from "@/components/EducationHub";
import APIKeySetup from "@/components/APIKeySetup";
import DataManagement from "@/components/DataManagement";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Dashboard />
        <Features />
        <APIKeySetup />
        <FinanceChat />
        <InvestmentCalculator />
        <ExpenseTracker />
        <BudgetPlanner />
        <RecurringTransactions />
        <GoalSetting />
        <PortfolioTracker />
        <DataManagement />
        <EducationHub />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
