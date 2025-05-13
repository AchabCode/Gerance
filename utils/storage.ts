import AsyncStorage from '@react-native-async-storage/async-storage';
import { BankrollItem, JournalEntry, HourlyRateParams, AppState, BankrollHistory } from '../types';

const STORAGE_KEYS = {
  BANKROLL_ITEMS: 'gerance_bankroll_items',
  BANKROLL_HISTORY: 'gerance_bankroll_history',
  JOURNAL_ENTRIES: 'gerance_journal_entries',
  HOURLY_RATE_PARAMS: 'gerance_hourly_rate_params',
};

export const saveBankrollItems = async (items: BankrollItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BANKROLL_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving bankroll items:', error);
  }
};

export const loadBankrollItems = async (): Promise<BankrollItem[]> => {
  try {
    const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.BANKROLL_ITEMS);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error('Error loading bankroll items:', error);
    return [];
  }
};

export const saveBankrollHistory = async (history: BankrollHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BANKROLL_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving bankroll history:', error);
  }
};

export const loadBankrollHistory = async (): Promise<BankrollHistory[]> => {
  try {
    const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.BANKROLL_HISTORY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('Error loading bankroll history:', error);
    return [];
  }
};

export const saveJournalEntries = async (entries: JournalEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
};

export const loadJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const storedEntries = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
};

export const saveHourlyRateParams = async (params: HourlyRateParams): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_RATE_PARAMS, JSON.stringify(params));
  } catch (error) {
    console.error('Error saving hourly rate params:', error);
  }
};

export const loadHourlyRateParams = async (): Promise<HourlyRateParams> => {
  try {
    const storedParams = await AsyncStorage.getItem(STORAGE_KEYS.HOURLY_RATE_PARAMS);
    return storedParams ? JSON.parse(storedParams) : {
      bb_amount: 0,
      bb_per_hour: 0,
      rakeback_hourly: 0,
      monthly_hours: 0,
      monthly_expenses: 0,
    };
  } catch (error) {
    console.error('Error loading hourly rate params:', error);
    return {
      bb_amount: 0,
      bb_per_hour: 0,
      rakeback_hourly: 0,
      monthly_hours: 0,
      monthly_expenses: 0,
    };
  }
};

export const loadAllData = async (): Promise<AppState> => {
  const [bankrollItems, bankrollHistory, journalEntries, hourlyRateParams] = await Promise.all([
    loadBankrollItems(),
    loadBankrollHistory(),
    loadJournalEntries(),
    loadHourlyRateParams(),
  ]);

  return {
    bankrollItems,
    bankrollHistory,
    journalEntries,
    hourlyRateParams,
  };
};