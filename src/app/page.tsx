'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Summary } from '@/components/Summary';

export default function Home() {
  // Use a loaded flag to prevent hydration mismatch
  const [isLoaded, setIsLoaded] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kakeibo_data');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kakeibo_data', JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    if (confirm('本当に削除しますか？')) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const clearAllExpenses = () => {
    setExpenses([]);
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">💰 割り勘ツール</h1>

        <Summary expenses={expenses} />
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} onClearAll={clearAllExpenses} />
      </div>
    </main>
  );
}
