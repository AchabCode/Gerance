export type BankrollItemType = 'cash' | 'poker_site' | 'bank_account' | 'crypto';

export interface BankrollItem {
  id: string;
  type: BankrollItemType;
  name: string;
  amount: number;
}

export interface BankrollHistory {
  id: string;
  date: string;
  amount: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export interface HourlyRateParams {
  bb_amount: number;
  bb_per_hour: number;
  rakeback_hourly: number;
  monthly_hours: number;
  monthly_expenses: number;
}

export interface AppState {
  bankrollItems: BankrollItem[];
  bankrollHistory: BankrollHistory[];
  journalEntries: JournalEntry[];
  hourlyRateParams: HourlyRateParams;
}