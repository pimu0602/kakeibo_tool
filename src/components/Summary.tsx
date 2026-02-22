import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryProps {
    expenses: Expense[];
}

export function Summary({ expenses }: SummaryProps) {
    console.log('Summary Render - expenses:', expenses);

    // 支出（通常）の合計
    const hiromuPaid = expenses
        .filter(e => (e.type === 'expense' || !e.type) && e.payer === 'ひろむ')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);
    const chikaPaid = expenses
        .filter(e => (e.type === 'expense' || !e.type) && e.payer === 'ちか')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);

    console.log('Paid logic - hiromuPaid:', hiromuPaid, 'chikaPaid:', chikaPaid);

    const totalExpenses = hiromuPaid + chikaPaid;
    const splitAmount = Math.round(totalExpenses / 2);

    // 支出のみに基づく差額（ひろむ基準）
    let hiromuBalance = hiromuPaid - splitAmount;

    // 清算（返金）データの反映
    const hiromuRepaid = expenses
        .filter(e => e.type === 'settlement' && e.payer === 'ひろむ')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);
    const chikaRepaid = expenses
        .filter(e => e.type === 'settlement' && e.payer === 'ちか')
        .reduce((acc, cur) => acc + Number(cur.amount), 0);

    console.log('Settlement logic - hiromuRepaid:', hiromuRepaid, 'chikaRepaid:', chikaRepaid);

    // 最終的な貸し借り額
    // hiromuBalanceに「ひろむが返した分(+hiromuRepaid)」を足し、「ちかから返してもらった分(-chikaRepaid)」を引く
    const finalBalance = hiromuBalance + hiromuRepaid - chikaRepaid;

    console.log('Final calculations - hiromuBalance:', hiromuBalance, 'finalBalance:', finalBalance);

    const amountToPay = Math.abs(finalBalance);
    const payer = finalBalance > 0 ? 'ちか' : 'ひろむ';
    const receiver = finalBalance > 0 ? 'ひろむ' : 'ちか';

    return (
        <Card className="bg-slate-50 border-2 border-slate-200">
            <CardHeader>
                <CardTitle className="text-center">集計</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500 mb-1">ひろむ支出</div>
                        <div className="text-lg font-bold text-blue-600">¥{hiromuPaid.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500 mb-1">ちか支出</div>
                        <div className="text-lg font-bold text-pink-600">¥{chikaPaid.toLocaleString()}</div>
                    </div>
                </div>

                <div className="border-t pt-4 text-center">
                    <div className="flex justify-between text-sm text-gray-500 mb-4 px-4">
                        <span>支出合計: {totalExpenses.toLocaleString()}円</span>
                        <span>1人あたり: {splitAmount.toLocaleString()}円</span>
                    </div>

                    {Math.abs(finalBalance) < 1 ? (
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
