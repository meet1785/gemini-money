import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import FinanceChat from "@/components/FinanceChat";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import ExpenseTracker from "@/components/ExpenseTracker";
import GoalSetting from "@/components/GoalSetting";
import PortfolioTracker from "@/components/PortfolioTracker";
import EducationHub from "@/components/EducationHub";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Dashboard />
        <Features />
        <FinanceChat />
        <InvestmentCalculator />
        <ExpenseTracker />
        <GoalSetting />
        <PortfolioTracker />
        <EducationHub />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
