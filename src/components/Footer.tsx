import { Button } from "@/components/ui/button";
import { Bot, Heart, Mail, Phone, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">FinanceGPT</h3>
                <p className="text-sm text-background/70">AI Money Mentor</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Empowering your financial journey with AI-powered insights, 
              personalized advice, and smart tools for better money management.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">AI Financial Advisor</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Expense Tracking</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Investment Calculator</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Goal Setting</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Portfolio Tracker</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Education Hub</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Financial Guides</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Market Insights</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>  
            <div className="space-y-3 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@financegpt.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>www.financegpt.ai</span>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="hero" size="sm">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/70">
              © 2024 FinanceGPT. All rights reserved. | Privacy Policy | Terms of Service
            </div>
            <div className="flex items-center gap-1 text-sm text-background/70">
              Made with <Heart className="h-4 w-4 text-red-500" /> for better financial futures
            </div>
          </div>
        </div>      
      </div>
    </footer>
  );
};

export default Footer;