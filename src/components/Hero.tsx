import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, Calculator, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your AI Financial 
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Mentor
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Get personalized financial advice, track expenses intelligently, and plan your investments with the power of AI. No jargon, just clear guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="text-lg">
                <MessageCircle className="h-5 w-5" />
                Start Chat with AI
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Calculator className="h-5 w-5" />
                Try Calculator
              </Button>
            </div>

            <div className="flex items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Real-time Analysis</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-card shadow-glow border-0 p-6">
              <img 
                src={heroImage} 
                alt="AI Financial Dashboard"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;