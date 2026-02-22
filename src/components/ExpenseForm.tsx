import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expense, Payer } from '@/types';

interface ExpenseFormProps {
    onAdd: (expense: Expense) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
    const [type, setType] = useState<'expense' | 'settlement'>('expense');
    const [payer, setPayer] = useState<Payer>('ひろむ');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || (type === 'expense' && !description)) return;

        const finalDescription = type === 'settlement'
            ? `${payer}から${payer === 'ひろむ' ? 'ちか' : 'ひろむ'}へ返金`
            : description;

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            date,
            payer,
            amount: Number(amount),
            description: finalDescription,
            type,
        };

        onAdd(newExpense);
        setAmount('');
        setDescription('');
    };

    return (
        <Card>
            <CardHeader className="pb-3 text-center">
                <CardTitle className="text-lg">内容を入力</CardTitle>
                <Tabs value={type} onValueChange={(v) => setType(v as 'expense' | 'settlement')} className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="expense">支出 (割り勘)</TabsTrigger>
                        <TabsTrigger value="settlement">清算 (返金)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-base">日付</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="text-lg py-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payer" className="text-base">
                                {type === 'expense' ? '支払った人' : '返した人'}
                            </Label>
                            <Select value={payer} onValueChange={(v) => setPayer(v as Payer)}>
                                <SelectTrigger className="text-lg py-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ひろむ">ひろむ</SelectItem>
                                    <SelectItem value="ちか">ちか</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-base font-bold">金額</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="text-lg py-6 border-2 focus:border-primary"
                        />
                    </div>

                    {type === 'expense' && (
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-base">内容</Label>
                            <Input
                                id="description"
                                placeholder="例: スーパー、夕食代"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="text-lg py-6"
                            />
                        </div>
                    )}

                    <Button type="submit" className={`w-full py-7 text-xl font-bold ${type === 'settlement' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                        {type === 'expense' ? '支出を追加' : '返金を記録'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
