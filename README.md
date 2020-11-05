# Azure Static Web Apps と Cosmos DB で作る LIFF アプリ

## 構成

TODO: 構成図を添付する

## セルフペースドハンズオン

ご自身のペースでトライするには、[セルフペースドハンズオン](./docs/self-paced-handson.md)の資料をご利用ください。

## 未整理

### How to prepare

https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cts%2Cbash#v2

```bash
npm install -g @vue/cli
```

### Run front-end locally

初回

```bash
cd frontend
cp .env.local.example .env.local
```

`.env.local` を設定します。

```bash
npm install
npm run serve
```

初回以降

```bash
cd frontend
npm run serve
```

### Run functions locally

```bash
npm install -g typescript

cd api
npm install
npm run start
```

初回以降

```bash
cd api
npm run start
```

set environment variable `LINE_CHANNEL_ID` in Azure Static Web Apps