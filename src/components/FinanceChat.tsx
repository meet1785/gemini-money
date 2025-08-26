import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, DollarSign, TrendingUp, PieChart } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const FinanceChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI financial mentor. I can help you with budgeting, investments, savings goals, and explain complex financial concepts in simple terms. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickQuestions = [
    { icon: DollarSign, text: "How can I save 20% of my salary?" },
    { icon: TrendingUp, text: "Best investment for 5-year goal?" },
    { icon: PieChart, text: "Explain compound interest simply" },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Enhanced AI responses based on user input
    setTimeout(() => {
      let response = "";
      const input = inputValue.toLowerCase();
      
      if (input.includes("save") && input.includes("20%")) {
        response = "Great goal! To save 20% of your ₹60k salary (₹12,000/month), try the 50/30/20 rule: 50% for needs (₹30k), 30% for wants (₹18k), 20% for savings (₹12k). Start by automating your savings - transfer ₹12k to a separate account right after salary. Cut unnecessary subscriptions and cook more at home. You'll reach your goal in no time!";
      } else if (input.includes("investment") && input.includes("5")) {
        response = "For a 5-year investment goal, consider a mix of equity mutual funds (60%) and debt funds (40%). With ₹15,000 monthly SIP in diversified equity funds, you could potentially accumulate ₹12-15 lakhs (assuming 12% returns). Start with index funds like Nifty 50 for lower risk. Remember: longer tenure = higher equity allocation. Would you like specific fund recommendations?";
      } else if (input.includes("compound interest")) {
        response = "Think of compound interest as 'money making money'! 🌱 If you plant ₹1000 at 10% interest: Year 1: ₹1100, Year 2: ₹1210 (extra ₹10 from interest earning interest!), Year 3: ₹1331. After 30 years: ₹17,449! The magic happens when your returns also earn returns. Einstein called it the 8th wonder of the world. Start early, stay invested!";
      } else if (input.includes("emergency fund")) {
        response = "Your emergency fund should cover 6 months of expenses. If you spend ₹40k/month, aim for ₹2.4 lakhs. Keep it in liquid funds or high-yield savings accounts for easy access. Don't invest emergency funds in stocks - you need guaranteed access. Build it gradually: save ₹10k monthly for 24 months. This protects you from job loss, medical emergencies, or major repairs.";
      } else if (input.includes("sip") || input.includes("lump sum")) {
        response = "SIP vs Lump Sum? SIP wins for most people! 🎯 SIP advantages: Rupee cost averaging (buy more units when prices are low), removes timing pressure, builds discipline. Lump sum works only if you can time the market perfectly (spoiler: you can't!). Even if you have ₹1 lakh today, consider investing ₹20k monthly for 5 months instead.";
      } else {
        response = `I understand you're asking about "${inputValue}". Based on your financial profile, here's my personalized advice: Focus on building an emergency fund first (₹2-3 lakhs), then start a monthly SIP of ₹15,000 in diversified equity funds. Keep your debt-to-income ratio below 30%. Track expenses using our smart tracker - small leaks sink big ships! Need specific recommendations for your situation?`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);

    setInputValue("");
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ask Your AI Financial Mentor</h2>
          <p className="text-muted-foreground text-lg">
            Get instant, personalized financial advice powered by AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Financial AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="bg-gradient-primary p-2 rounded-full h-8 w-8 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-md ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.type === 'user' && (
                        <div className="bg-secondary p-2 rounded-full h-8 w-8 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question.text)}
                      className="text-xs"
                    >
                      <question.icon className="h-3 w-3" />
                      {question.text}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about budgeting, investing, saving goals..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="px-6">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FinanceChat;