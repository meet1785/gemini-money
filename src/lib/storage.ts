// Local storage utilities for persisting user data

const STORAGE_KEYS = {
  INVESTMENTS: 'financeGPT_investments',
  EXPENSES: 'financeGPT_expenses',
  GOALS: 'financeGPT_goals',
  SETTINGS: 'financeGPT_settings',
} as const;

export interface StorageData<T> {
  data: T;
  timestamp: number;
  version: string;
}

/**
 * Safely get data from localStorage with error handling
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed: StorageData<T> = JSON.parse(item);
    return parsed.data;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely save data to localStorage with error handling
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const storageData: StorageData<T> = {
      data,
      timestamp: Date.now(),
      version: '1.0.0',
    };
    localStorage.setItem(key, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    // Check if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Export all data as JSON for backup
 */
export function exportData(): string {
  const data: Record<string, unknown> = {};
  
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const item = getFromStorage(key);
    if (item) {
      data[name] = item;
    }
  });
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    data,
  }, null, 2);
}

/**
 * Import data from JSON backup
 */
export function importData(jsonString: string): boolean {
  try {
    const imported = JSON.parse(jsonString);
    
    if (!imported.data) {
      throw new Error('Invalid import format');
    }
    
    // Save each data type
    Object.entries(imported.data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
      if (key && value) {
        saveToStorage(key, value);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

export { STORAGE_KEYS };
