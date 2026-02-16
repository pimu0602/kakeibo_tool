import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, Payer } from '@/types';

interface ExpenseFormProps {
    onAdd: (expense: Expense) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
    const [payer, setPayer] = useState<Payer>('ひろむ');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            date,
            payer,
            amount: Number(amount),
            description,
        };

        onAdd(newExpense);
        setAmount('');
        setDescription('');
        // Keep date and payer for continuous entry
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>新しい支出を追加</CardTitle>
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
                            <Label htmlFor="payer" className="text-base">支払った人</Label>
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
                        <Label htmlFor="price" className="text-base">金額</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="text-lg py-6"
                        />
                    </div>
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
                    <Button type="submit" className="w-full py-6 text-lg">追加する</Button>
                </form>
            </CardContent>
        </Card>
    );
}
