import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  public isReady(): boolean {
    return this.isInitialized && this.model !== null;
  }

  public getAPIKeyStatus(): 'missing' | 'invalid' | 'valid' {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return 'missing';
    }
    
    if (!this.isInitialized) {
      return 'invalid';
    }
    
    return 'valid';
  }

  public async generateFinancialAdvice(userMessage: string, context?: any): Promise<string> {
    if (!this.isReady()) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const prompt = this.createFinancialPrompt(userMessage, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private createFinancialPrompt(userMessage: string, context?: any): string {
    const basePrompt = `You are an expert financial advisor and mentor. Your role is to provide personalized, practical, and easy-to-understand financial advice. 

Guidelines:
- Always provide actionable advice
- Use simple language and avoid jargon
- Include specific numbers and examples when relevant
- Focus on Indian financial context (₹ currency, Indian investment options like SIP, mutual funds, etc.)
- Be encouraging and supportive
- If asked about investments, always mention risk factors
- Suggest diversification and long-term thinking
- For complex topics, break them down into simple steps

User's question: ${userMessage}

Please provide a helpful, personalized response (keep it under 200 words):`;

    return basePrompt;
  }

  private getFallbackResponse(userMessage: string): string {
    const input = userMessage.toLowerCase();
    
    // Enhanced fallback responses
    if (input.includes("save") && input.includes("20%")) {
      return "Great goal! To save 20% of your salary, try the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Start by automating your savings - transfer money to a separate account right after salary. Cut unnecessary subscriptions and cook more at home. You'll reach your goal in no time!";
    } else if (input.includes("investment") && input.includes("5")) {
      return "For a 5-year investment goal, consider a mix of equity mutual funds (60%) and debt funds (40%). With monthly SIP in diversified equity funds, you could potentially accumulate good returns (assuming 10-12% returns). Start with index funds like Nifty 50 for lower risk. Remember: longer tenure = higher equity allocation.";
    } else if (input.includes("compound interest")) {
      return "Think of compound interest as 'money making money'! 🌱 If you invest ₹1000 at 10% interest: Year 1: ₹1100, Year 2: ₹1210 (extra ₹10 from interest earning interest!), Year 3: ₹1331. The magic happens when your returns also earn returns. Einstein called it the 8th wonder of the world. Start early, stay invested!";
    } else if (input.includes("emergency fund")) {
      return "Your emergency fund should cover 6 months of expenses. Keep it in liquid funds or high-yield savings accounts for easy access. Don't invest emergency funds in stocks - you need guaranteed access. Build it gradually. This protects you from job loss, medical emergencies, or major repairs.";
    } else if (input.includes("sip") || input.includes("lump sum")) {
      return "SIP vs Lump Sum? SIP wins for most people! 🎯 SIP advantages: Rupee cost averaging (buy more units when prices are low), removes timing pressure, builds discipline. Lump sum works only if you can time the market perfectly (which is very difficult!).";
    } else {
      return `I understand you're asking about "${userMessage}". Here's my advice: Focus on building an emergency fund first, then start a monthly SIP in diversified equity funds. Keep your debt-to-income ratio below 30%. Track expenses regularly - small leaks sink big ships! For personalized advice, please add your Gemini API key to enable full AI capabilities.`;
    }
  }

  public async analyzeExpenses(expenses: any[]): Promise<{
    insights: string[];
    recommendations: string[];
    trends: string;
  }> {
    if (!this.isReady()) {
      return {
        insights: [
          "Your largest expense category needs attention",
          "Consider tracking daily expenses for better insights",
          "Look for subscription services you might not be using"
        ],
        recommendations: [
          "Set up automated savings for better money management",
          "Review and optimize your monthly subscriptions",
          "Create a budget plan based on the 50/30/20 rule"
        ],
        trends: "Add your Gemini API key to get AI-powered expense analysis and personalized insights."
      };
    }

    try {
      const expenseData = JSON.stringify(expenses);
      const prompt = `Analyze these expense data and provide insights, recommendations, and trends: ${expenseData}
      
      Return a JSON response with:
      - insights: array of 3-4 key insights about spending patterns
      - recommendations: array of 3-4 actionable recommendations
      - trends: string describing overall spending trends
      
      Focus on Indian financial context and practical advice.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          insights: [text.split('\n')[0] || "Analysis completed"],
          recommendations: [text.split('\n')[1] || "Review your spending patterns"],
          trends: text.split('\n')[2] || "Monitor your expenses regularly"
        };
      }
    } catch (error) {
      console.error('Error analyzing expenses:', error);
      return {
        insights: ["Analysis temporarily unavailable"],
        recommendations: ["Please try again later"],
        trends: "Unable to analyze at the moment"
      };
    }
  }

  public async generateInvestmentStrategy(goals: any): Promise<string> {
    if (!this.isReady()) {
      return "For personalized investment strategies, please add your Gemini API key. Meanwhile, consider a diversified portfolio with equity mutual funds for long-term goals and debt funds for short-term needs.";
    }

    try {
      const prompt = `Based on these financial goals: ${JSON.stringify(goals)}, 
      provide a comprehensive investment strategy including:
      - Asset allocation recommendations
      - Specific investment products for Indian market
      - Risk assessment
      - Timeline considerations
      Keep it practical and under 300 words.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating investment strategy:', error);
      return "Unable to generate strategy at the moment. Consider consulting with a financial advisor for personalized investment planning.";
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();
export default geminiService;