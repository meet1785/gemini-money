// Type definitions for Gemini AI service

export interface ExpenseAnalysis {
  insights: string[];
  recommendations: string[];
  trends: string;
}

export interface FinancialContext {
  expenses?: unknown[];
  goals?: unknown[];
  investments?: unknown[];
  [key: string]: unknown;
}

export interface GenerativeModel {
  generateContent: (prompt: string) => Promise<GenerativeResponse>;
}

export interface GenerativeResponse {
  response: {
    text: () => string;
  };
}
