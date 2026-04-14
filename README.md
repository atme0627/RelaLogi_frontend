# RelaLogi Frontend

雑誌のピクセルパズルを写真で撮影・送信し、OCR で電子化してブラウザ上で遊べるサービスのフロントエンド。

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router) |
| UI ライブラリ | React 19 / Chakra UI 3 |
| アニメーション | Framer Motion 12 |
| 言語 | TypeScript 5 |
| API モック | MSW (Mock Service Worker) 2 |
| パッケージマネージャ | pnpm 10 |

## セットアップ

```bash
# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで http://localhost:3000 を開く。

## 環境変数

特別な環境変数の設定は不要。`NODE_ENV` のみ Next.js が自動で管理する。

## ディレクトリ構成

```
src/
├── app/                # ページ (App Router)
│   ├── page.tsx        #   トップページ
│   ├── crop/           #   画像クロップ
│   ├── size/           #   盤面サイズ設定
│   ├── play/           #   パズルプレイ
│   └── confirm/        #   完成確認
├── components/         # UI コンポーネント
├── contexts/           # React Context (パズルデータ・画像・ナビゲーション)
├── hooks/              # カスタムフック
├── types/              # 型定義
├── theme/              # Chakra UI テーマ設定
└── mocks/              # MSW モックハンドラ
```

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | 開発サーバー起動 (Turbopack) |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | ビルド済みアプリの起動 |
| `pnpm lint` | ESLint によるコードチェック |
