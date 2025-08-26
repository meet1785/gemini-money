import { z } from 'zod';

/**
 * Validation schemas using Zod for form data validation
 */

// Common validation rules
const positiveNumber = z.number().positive('Must be a positive number');
const nonEmptyString = z.string().min(1, 'This field is required');
const futureDate = z.string().refine(
  (date) => new Date(date) > new Date(),
  'Date must be in the future'
);
const validAmount = z.string().refine(
  (val) => !isNaN(Number(val)) && Number(val) > 0,
  'Must be a valid positive number'
);

// Expense validation schema
export const expenseSchema = z.object({
  category: nonEmptyString,
  amount: validAmount,
  date: z.string().min(1, 'Date is required'),
  description: nonEmptyString.max(200, 'Description must be less than 200 characters')
});

// Goal validation schema
export const goalSchema = z.object({
  name: nonEmptyString.max(50, 'Goal name must be less than 50 characters'),
  targetAmount: validAmount,
  targetDate: futureDate,
  category: nonEmptyString,
  monthlyContribution: z.string().refine(
    (val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0),
    'Must be a valid non-negative number'
  ).optional()
});

// Investment validation schema
export const investmentSchema = z.object({
  name: nonEmptyString.max(50, 'Investment name must be less than 50 characters'),
  invested: validAmount,
  current: validAmount,
  type: nonEmptyString,
  risk: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Risk level must be Low, Medium, or High' })
  })
});

// Goal funds addition schema
export const addFundsSchema = z.object({
  amount: validAmount
});

// API Key validation schema
export const apiKeySchema = z.object({
  apiKey: z.string()
    .min(1, 'API key is required')
    .refine(
      (key) => key.startsWith('AIza') && key.length > 30,
      'Please enter a valid Gemini API key'
    )
});

// Financial analysis request schema
export const analysisRequestSchema = z.object({
  expenses: z.array(z.object({
    id: z.string(),
    category: z.string(),
    amount: z.number(),
    date: z.string(),
    description: z.string()
  })).min(1, 'At least one expense is required for analysis')
});

// Form validation utility
export class ValidationService {
  static validateExpense(data: unknown) {
    return expenseSchema.safeParse(data);
  }

  static validateGoal(data: unknown) {
    return goalSchema.safeParse(data);
  }

  static validateInvestment(data: unknown) {
    return investmentSchema.safeParse(data);
  }

  static validateAddFunds(data: unknown) {
    return addFundsSchema.safeParse(data);
  }

  static validateApiKey(data: unknown) {
    return apiKeySchema.safeParse(data);
  }

  static validateAnalysisRequest(data: unknown) {
    return analysisRequestSchema.safeParse(data);
  }

  // Helper to format validation errors for UI display
  static formatErrors(errors: z.ZodError) {
    const formatted: Record<string, string> = {};
    errors.errors.forEach((error) => {
      const path = error.path.join('.');
      formatted[path] = error.message;
    });
    return formatted;
  }

  // Helper to check if a string is a valid positive number
  static isValidPositiveNumber(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }

  // Helper to check if a date string is in the future
  static isFutureDate(dateString: string): boolean {
    return new Date(dateString) > new Date();
  }

  // Helper to sanitize and format currency input
  static formatCurrency(value: string): string {
    // Remove non-numeric characters except decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    return sanitized;
  }

  // Helper to validate Indian mobile number format
  static validateIndianMobile(mobile: string): boolean {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  // Helper to validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
export type AddFundsFormData = z.infer<typeof addFundsSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;