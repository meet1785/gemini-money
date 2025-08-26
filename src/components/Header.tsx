import { Button } from "@/components/ui/button";
import { Bot, DollarSign } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FinanceGPT</h1>
            <p className="text-xs text-muted-foreground">Your AI Money Mentor</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Features</Button>
          <Button variant="ghost" size="sm">Pricing</Button>
          <Button variant="outline" size="sm">Sign In</Button>
          <Button variant="hero" size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;