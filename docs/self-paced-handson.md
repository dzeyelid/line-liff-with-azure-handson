# セルフペースドハンズオン

## 準備

本環境を実行するには下記の準備が必要です。

| 必要なもの | 説明 |
|----|----|
| LINEアカウント | LINEアカウントをお持ちでない場合は、スマートフォンで[LINEをダウンロード](https://line.me/) し、LINEアカウントを作成してください。 |
| Azureアカウント | Azureアカウントをお持ちでない場合は、[こちら](https://azure.microsoft.com/ja-jp/free/) から作成してください。新規作成すると無料枠が適用されます。 |
| GitHubアカウント | GitHubアカウントをお持ちでない場合は、[こちら](https://github.com/join) から作成してください。 |

本ハンズオンで作成するアプリは、LINE のスマートフォンアプリ内で開くLIFFブラウザでの動作を想定しています。

また、本アプリは Google Chrome や Microsoft Edge などの外部ブラウザで開いた場合も利用できるよう調整していますが、その場合は、LINEアカウントでのログインが求められます。外部ブラウザの場合は、シェア機能は利用できません。

## 大まかな流れ

1. LINE アカウントで LINEログインのチャネルを作成する
1. Azure にリソースをデプロイする
2. LIFF にフロントエンドのURLを設定する

## LINE アカウントで LINEログインのチャネルを作成する

まず、[LINE Developersコンソール](https://developers.line.biz/console/)にログインし、プロバイダーと「LINEログイン」のチャネルを作成します。

LINE Developersコンソールを開機、プロバイダーの「作成」ボタンを選択します。

![](./images/line-develpers-console_create-provider_001.png)

任意のプロバイダー名を入力し、「作成」ボタンを選択し作成します。

![](./images/line-develpers-console_create-provider_002.png)

プロバイダーが作成できたら、「チャネル設定」のタブで「LINEログイン」を選択します。

![](./images/line-develpers-console_create-channel_001.png)

下記を入力し、「作成」ボタンを選択しチャネルを作成します。

- 「チャネル名」「チャネル説明」を適宜入力してください。
- 「アプリタイプ」は「ウェブアプリ」「ネイティブアプリ」ともにチェックを付けてください。
- 「LINE Developers Agreement の内容に同意します」の Agreement の内容を確認の上、チェックを付けてください。

![](./images/line-develpers-console_create-channel_002.png)

チャネルが作成できたら、「LIFF」タブを開き、「追加」ボタンを選択します。

![](./images/line-devepolers-console_liff-setting_001.png)

下記を入力し、「追加」ボタンを選択しLIFFアプリを追加します。

- 「LIFFアプリ」に任意のアプリ名を入力します。
- 「サイズ」は「Full」を選択します。
- 「エンドポイントURL」は、Azure Static Web Apps をデプロイした後に決まるので、とりいそぎ別の https で始まるURLを入力します。（例: `https://example.com` ）
- 「Scope」は、「profile」にチェックを付けます。
- 「ボットリンク機能」は、「On (Normal)」をチェックします。

![](./images/line-devepolers-console_liff-setting_002.png)

LIFFアプリを追加すると、「LIFF ID」が発行されます。のちに使うので、控えておいてください。

![](./images/line-devepolers-console_liff-setting_003.png)

----

LIFF ID は GitHub Secret に指定する