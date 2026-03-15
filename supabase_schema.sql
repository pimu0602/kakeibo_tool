-- 支出プリセット項目のテーブル作成
CREATE TABLE IF NOT EXISTS expense_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データの投入 (現在の固定リストを移行)
INSERT INTO expense_presets (label, amount, order_index) VALUES
('シャンプー', 2300, 1),
('歯磨き', 1199, 2),
('モットパウダー', 3300, 3),
('石鹸', 700, 4),
('お茶', 2520, 5),
('プロテクションサンスクリーン', 4400, 6),
('プロテイン', 4023, 7),
('日焼け止め', 3664, 8),
('天恵ローション', 9600, 9),
('ヒカリノシオ', 985, 10),
('ワコナル', 2657, 11),
('オサケデビューティー', 1944, 12),
('トトクレ', 3350, 13),
('トトスイ', 3350, 14);

-- RLS (Row Level Security) の設定
-- 誰でも読み書きできるように設定（個人利用のためシンプルに）
ALTER TABLE expense_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to everyone" ON expense_presets
    FOR ALL
    USING (true)
    WITH CHECK (true);
