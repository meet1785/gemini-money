/**
 * Local storage service for persisting financial data
 */

interface StorageData {
  portfolio: {
    totalValue: number;
    totalInvested: number;
    totalReturns: number;
    returnPercentage: number;
    dayChange: number;
    dayChangePercentage: number;
  };
  investments: Array<{
    id: string;
    name: string;
    invested: number;
    current: number;
    returns: number;
    returnPercentage: number;
    allocation: number;
    type: string;
    risk: string;
  }>;
  expenses: Array<{
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
  }>;
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    monthlyContribution: number;
    icon?: React.ComponentType;
  }>;
  lastUpdate: string;
}

class StorageService {
  private readonly STORAGE_KEY = 'financegpt_data';
  private readonly VERSION_KEY = 'financegpt_version';
  private readonly CURRENT_VERSION = '1.0.0';

  /**
   * Save data to localStorage
   */
  saveData(data: StorageData): void {
    try {
      // Create a serializable version (without React components)
      const serializableData = {
        ...data,
        goals: data.goals.map(goal => ({
          ...goal,
          icon: undefined // Remove icon component for storage
        }))
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableData));
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  loadData(): StorageData | null {
    try {
      const storedVersion = localStorage.getItem(this.VERSION_KEY);
      const storedData = localStorage.getItem(this.STORAGE_KEY);

      if (!storedData) {
        return null;
      }

      // Check version compatibility
      if (storedVersion !== this.CURRENT_VERSION) {
        console.warn('Data version mismatch, using defaults');
        this.clearData();
        return null;
      }

      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  clearData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.VERSION_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: boolean } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: false };
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const used = data ? new Blob([data]).size : 0;
      return { used, available: true };
    } catch {
      return { used: 0, available: false };
    }
  }
}

// Create singleton instance
const storageService = new StorageService();
export default storageService;