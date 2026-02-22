'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Summary } from '@/components/Summary';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // 30秒ごとに自動更新して、2人の入力を即座に反映
    const interval = setInterval(fetchExpenses, 30000);
    return () => clearInterval(interval);
  }, []);

  const addExpense = async (expense: Expense) => {
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      fetchExpenses();
    } catch (error) {
      alert('保存に失敗しました。電波の状態を確認してください。');
    }
  };

  const deleteExpense = async (id: string) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
        fetchExpenses();
      } catch (error) {
        alert('削除に失敗しました。');
      }
    }
  };

  const clearAllExpenses = async () => {
    try {
      await fetch('/api/expenses?id=all', { method: 'DELETE' });
      fetchExpenses();
    } catch (error) {
      alert('全削除に失敗しました。');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex-1 text-center text-gray-800 ml-8">💰 割り勘ツール</h1>
          <button onClick={fetchExpenses} className="p-2 text-gray-500 hover:text-blue-500" title="更新">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
          </button>
        </div>

        <Summary expenses={expenses} />
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} onClearAll={clearAllExpenses} />

        <div className="text-[10px] text-gray-400 text-center mt-8">
          Last Check: {new Date().toLocaleString('ja-JP')} (Fix v4 applied)
        </div>
      </div>
    </main>

  );
}
