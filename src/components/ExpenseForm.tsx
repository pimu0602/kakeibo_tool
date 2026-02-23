import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, Payer } from '@/types';

const PRESET_ITEMS = [
    { label: 'シャンプー', amount: 2300 },
    { label: '歯磨き', amount: 1199 },
    { label: 'モットパウダー', amount: 3300 },
    { label: '石鹸', amount: 700 },
    { label: 'お茶', amount: 2520 },
    { label: 'プロテクションサンスクリーン', amount: 4400 },
    { label: 'プロテイン', amount: 4023 },
    { label: '日焼け止め', amount: 3664 },
    { label: '天恵ローション', amount: 9600 },
    { label: 'ヒカリノシオ', amount: 985 },
    { label: 'ワコナル', amount: 2657 },
    { label: 'オサケデビューティー', amount: 1944 },
    { label: 'トトクレ', amount: 3350 },
    { label: 'トトスイ', amount: 3350 },
];

interface ExpenseFormProps {
    onAdd: (expense: Expense) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
    const [type, setType] = useState<'expense' | 'settlement'>('expense');
    const [payer, setPayer] = useState<Payer>('ひろむ');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isCustom, setIsCustom] = useState(false);
    const [isPreset, setIsPreset] = useState(false);

    const handlePresetSelect = (value: string) => {
        if (value === '__custom__') {
            setIsCustom(true);
            setIsPreset(false);
            setDescription('');
            setAmount('');
            return;
        }
        setIsCustom(false);
        setIsPreset(true);
        const preset = PRESET_ITEMS.find(p => p.label === value);
        if (preset) {
            setDescription(preset.label);
            setAmount(String(preset.amount));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || (type === 'expense' && !description)) return;

        // プリセット → 清算（全額相手負担）として記録
        const actualType = isPreset ? 'settlement' : type;

        let finalDescription: string;
        if (isPreset) {
            finalDescription = description; // プリセットのラベルをそのまま使用
        } else if (type === 'settlement') {
            finalDescription = `${payer}から${payer === 'ひろむ' ? 'ちか' : 'ひろむ'}へ返金`;
        } else {
            finalDescription = description;
        }

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            date,
            payer,
            amount: Number(amount),
            description: finalDescription,
            type: actualType,
        };

        onAdd(newExpense);
        setAmount('');
        setDescription('');
        setIsCustom(false);
        setIsPreset(false);
    };

    return (
        <Card>
            <CardHeader className="pb-3 text-center">
                <CardTitle className="text-lg mb-4">内容を入力</CardTitle>
                <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        支出 (割り勘)
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('settlement')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'settlement' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        清算 (返金)
                    </button>
                </div>
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

                    {type === 'expense' && (
                        <div className="space-y-2">
                            <Label className="text-base font-bold">内容</Label>
                            <Select onValueChange={handlePresetSelect} value={isCustom ? '__custom__' : description}>
                                <SelectTrigger className="text-lg py-6">
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRESET_ITEMS.map((item) => (
                                        <SelectItem key={item.label} value={item.label}>
                                            {item.label}（¥{item.amount.toLocaleString()}）
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="__custom__">✏️ その他（自由入力）</SelectItem>
                                </SelectContent>
                            </Select>
                            {isCustom && (
                                <Input
                                    id="description"
                                    placeholder="内容を入力"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="text-lg py-6 mt-2"
                                />
                            )}
                        </div>
                    )}

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

                    <Button type="submit" className={`w-full py-7 text-xl font-bold ${type === 'settlement' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                        {type === 'expense' ? '支出を追加' : '返金を記録'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
