import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryProps {
    expenses: Expense[];
}

export function Summary({ expenses }: SummaryProps) {
    // ひろむが支払った合計
    const hiromuTotal = expenses
        .filter(e => e.payer === 'ひろむ')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);

    // ちかが支払った合計
    const chikaTotal = expenses
        .filter(e => e.payer === 'ちか')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);

    // 差額
    const balance = hiromuTotal - chikaTotal;
    const amountToPay = Math.abs(balance);
    const payer = balance > 0 ? 'ひろむ' : 'ちか';
    const receiver = balance > 0 ? 'ちか' : 'ひろむ';

    return (
        <Card className="bg-slate-50 border-2 border-slate-200">
            <CardHeader>
                <CardTitle className="text-center">集計</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500 mb-1">ひろむ支払い合計</div>
                        <div className="text-lg font-bold text-blue-600">¥{hiromuTotal.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500 mb-1">ちか支払い合計</div>
                        <div className="text-lg font-bold text-pink-600">¥{chikaTotal.toLocaleString()}</div>
                    </div>
                </div>

                <div className="border-t pt-4 text-center">
                    {amountToPay < 1 ? (
                        <div className="text-xl font-bold text-green-600 py-2">精算なし（同額）</div>
                    ) : (
                        <div className="p-4 bg-white rounded-xl border shadow-sm inline-block w-full">
                            <div className="text-sm text-gray-500 mb-1">残り精算額</div>
                            <div className="flex items-center justify-center gap-2 text-lg">
                                <span className="font-bold">{payer}</span>
                                <span className="text-sm text-gray-400">→</span>
                                <span className="font-bold">{receiver}</span>
                            </div>
                            <div className="text-3xl font-black text-primary mt-2">¥{Math.round(amountToPay).toLocaleString()}</div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
