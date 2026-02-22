import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

export function ExpenseList({ expenses, onDelete, onClearAll }: ExpenseListProps) {
    // Sort by date desc
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>履歴</CardTitle>
                {expenses.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">履歴を全削除</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    この操作は取り消せません。すべての履歴が削除されます。
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction onClick={onClearAll} className="bg-red-600 hover:bg-red-700">削除する</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sorted.length === 0 ? (
                        <p className="text-center text-muted-foreground">まだ履歴がありません</p>
                    ) : (
                        sorted.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between border-b py-3 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <span>{expense.date}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs text-white ${expense.payer === 'ひろむ' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                            {expense.payer}
                                        </span>
                                        {expense.type === 'settlement' && (
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">
                                                清算
                                            </span>
                                        )}
                                    </div>
                                    <div className={`font-medium text-lg ${expense.type === 'settlement' ? 'text-green-700' : ''}`}>
                                        {expense.description}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-xl">¥{expense.amount.toLocaleString()}</span>
                                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => onDelete(expense.id)}>
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
