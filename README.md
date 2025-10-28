# 姓名判断 光彩堂

React と Tailwind CSS で構築した静的な姓名判断アプリです。画数を独自の数理アルゴリズムで解析し、素数・累乗・剰余を利用して吉凶を判定します。同じ名前には常に同じ結果を返します。

## 開発環境

- Node.js 20 以上
- npm

## セットアップ

```bash
npm install
```

## 開発サーバー

```bash
npm run dev
```

## テスト

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## ビルド

```bash
npm run build
```

## デプロイ

生成される `dist` ディレクトリを GitHub Pages などの静的ホスティングに配置してください。GitHub Actions でテスト・Lint・ビルドが自動実行されるワークフローを同梱しています。
