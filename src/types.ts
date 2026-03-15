export type Payer = 'ひろむ' | 'ちか';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  payer: Payer;
  amount: number;
  description: string;
  type?: 'expense' | 'settlement';
}

export interface ExpensePreset {
  id: string;
  label: string;
  amount: number;
  order_index: number;
}
