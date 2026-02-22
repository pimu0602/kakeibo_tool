export type Payer = 'ひろむ' | 'ちか';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  payer: Payer;
  amount: number;
  description: string;
  type?: 'expense' | 'settlement';
}
