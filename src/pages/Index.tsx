import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FinanceChat from "@/components/FinanceChat";
import InvestmentCalculator from "@/components/InvestmentCalculator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <FinanceChat />
        <InvestmentCalculator />
      </main>
    </div>
  );
};

export default Index;
