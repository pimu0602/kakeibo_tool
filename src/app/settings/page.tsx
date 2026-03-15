'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ExpensePreset } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const router = useRouter();
    const [presets, setPresets] = useState<ExpensePreset[]>([]);
    const [newLabel, setNewLabel] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPresets();
    }, []);

    const fetchPresets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('expense_presets')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching presets:', error);
        } else {
            setPresets(data || []);
        }
        setLoading(false);
    };

    const handleAddPreset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel || !newAmount) return;

        const maxOrder = presets.length > 0 ? Math.max(...presets.map(p => p.order_index)) : 0;

        const { error } = await supabase
            .from('expense_presets')
            .insert([{
                label: newLabel,
                amount: Number(newAmount),
                order_index: maxOrder + 1
            }]);

        if (error) {
            console.error('Error adding preset:', error);
            alert('追加に失敗しました。テーブルが作成されているか確認してください。');
        } else {
            setNewLabel('');
            setNewAmount('');
            fetchPresets();
        }
    };

    const handleDeletePreset = async (id: string) => {
        const { error } = await supabase
            .from('expense_presets')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting preset:', error);
            alert(`削除に失敗しました。\n理由: ${error.message || '不明なエラー'}\n\n※Supabaseの削除権限（Policy）が設定されていない可能性があります。SQL Editorでもう一度SQLを実行してみてください。`);
        } else {
            fetchPresets();
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 pb-20">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-2xl font-bold italic">設定</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">新しい項目を追加</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddPreset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">項目名</Label>
                                <Input
                                    id="label"
                                    placeholder="例: シャンプー"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="text-lg py-6"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">金額</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0"
                                    value={newAmount}
                                    onChange={(e) => setNewAmount(e.target.value)}
                                    className="text-lg py-6"
                                />
                            </div>
                            <Button type="submit" className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90">
                                <Plus className="w-5 h-5 mr-2" /> 追加
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">登録済みの項目</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground animate-pulse">読み込み中...</div>
                        ) : presets.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">登録された項目はありません</div>
                        ) : (
                            <div className="divide-y">
                                {presets.map((preset) => (
                                    <div key={preset.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="font-bold text-lg">{preset.label}</p>
                                            <p className="text-sm text-muted-foreground">¥{preset.amount.toLocaleString()}</p>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>項目を削除しますか？</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        「{preset.label}」をリストから削除します。
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeletePreset(preset.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        削除する
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
