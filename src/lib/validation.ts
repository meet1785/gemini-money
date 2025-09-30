// Input validation and sanitization utilities

/**
 * Validate and sanitize a number input
 */
export function validateNumber(value: string | number, options?: {
  min?: number;
  max?: number;
  allowNegative?: boolean;
}): { valid: boolean; value: number; error?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, value: 0, error: 'Please enter a valid number' };
  }

  if (options?.allowNegative === false && num < 0) {
    return { valid: false, value: 0, error: 'Negative values are not allowed' };
  }

  if (options?.min !== undefined && num < options.min) {
    return { valid: false, value: 0, error: `Value must be at least ${options.min}` };
  }

  if (options?.max !== undefined && num > options.max) {
    return { valid: false, value: 0, error: `Value must be at most ${options.max}` };
  }

  return { valid: true, value: num };
}

/**
 * Validate and sanitize a string input
 */
export function validateString(value: string, options?: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
}): { valid: boolean; value: string; error?: string } {
  const trimmed = value.trim();

  if (options?.required && !trimmed) {
    return { valid: false, value: '', error: 'This field is required' };
  }

  if (options?.minLength && trimmed.length < options.minLength) {
    return { valid: false, value: '', error: `Must be at least ${options.minLength} characters` };
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    return { valid: false, value: '', error: `Must be at most ${options.maxLength} characters` };
  }

  if (options?.pattern && !options.pattern.test(trimmed)) {
    return { valid: false, value: '', error: 'Invalid format' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate a date string
 */
export function validateDate(value: string, options?: {
  future?: boolean;
  past?: boolean;
}): { valid: boolean; value: string; error?: string } {
  if (!value) {
    return { valid: false, value: '', error: 'Date is required' };
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { valid: false, value: '', error: 'Invalid date' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (options?.future && date < now) {
    return { valid: false, value: '', error: 'Date must be in the future' };
  }

  if (options?.past && date > now) {
    return { valid: false, value: '', error: 'Date must be in the past' };
  }

  return { valid: true, value };
}

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!pattern.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Debounce function to limit execution rate
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
