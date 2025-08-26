import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, DollarSign, TrendingUp, PieChart, AlertTriangle, Loader2, Key } from "lucide-react";
import geminiService from "@/services/geminiService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'missing' | 'invalid' | 'valid'>('missing');

  // Check API key status on component mount
  useEffect(() => {
    const checkApiKey = () => {
      const status = geminiService.getAPIKeyStatus();
      setApiKeyStatus(status);
    };
    
    checkApiKey();
    // Check periodically in case user updates the API key
    const interval = setInterval(checkApiKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickQuestions = [
    { icon: DollarSign, text: "How can I save 20% of my salary?" },
    { icon: TrendingUp, text: "Best investment for 5-year goal?" },
    { icon: PieChart, text: "Explain compound interest simply" },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const currentInput = inputValue;
    setInputValue("");

    try {
      const response = await geminiService.generateFinancialAdvice(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or check your internet connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const getApiKeyStatusInfo = () => {
    switch (apiKeyStatus) {
      case 'missing':
        return {
          message: "Add your Gemini API key to enable full AI capabilities. Currently using fallback responses.",
          variant: "default" as const,
          icon: Key
        };
      case 'invalid':
        return {
          message: "Invalid API key. Please check your Gemini API key configuration.",
          variant: "destructive" as const,
          icon: AlertTriangle
        };
      case 'valid':
        return {
          message: "AI-powered responses active",
          variant: "default" as const,
          icon: Bot
        };
    }
  };

  const statusInfo = getApiKeyStatusInfo();

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
          {/* API Key Status */}
          <div className="mb-4">
            <Alert className="bg-background/60 backdrop-blur-sm border-muted-foreground/20">
              <statusInfo.icon className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{statusInfo.message}</span>
                <Badge variant={apiKeyStatus === 'valid' ? 'default' : 'secondary'} className="ml-2">
                  {apiKeyStatus === 'valid' ? 'Connected' : 'Limited Mode'}
                </Badge>
              </AlertDescription>
            </Alert>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Financial AI Assistant
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="px-6"
                    disabled={isLoading || !inputValue.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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