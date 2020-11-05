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
1. GitHub リポジトリをテンプレートから作成する
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

## GitHub リポジトリをテンプレートから作成する

つぎに、テンプレートをもとに、ご自身が操作する GitHub リポジトリを用意します。

[本リポジトリ](https://github.com/dzeyelid/line-liff-with-azure-handson) のトップページから、上部の「Use this tempalte」ボタンを選択し、このリポジトリテンプレートをベースにリポジトリを作成してください。

![](./images/github-repository_create-repository-from-template.png)

## GitHub の Personal access token を生成する

後述のデプロイで利用するため、GitHub の Personal access token を生成します。

下記の手順をもとに進み、 `public_repo` に設定をして、画面下部の「Generate token」ボタンを選択し、トークンを生成します。

- [個人アクセストークンを使用する - GitHub Docs](https://help.github.com/ja/github/authenticating-to-github/creating-a-personal-access-token)

![](./images/github_develper-settings_generate-personal-access-token_001.png)

生成されたトークンはここでしか表示されないので、適宜控えてください。

![](./images/github_develper-settings_generate-personal-access-token_002.png)

## Azure Static Web Apps と Cosmos DB をデプロイする

Azure Static Web Apps と Azure Cosmos DB をデプロイします。

下記のボタンを選択すると、Azure ポータルで「Costom deployment」画面が開きます。

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdzeyelid%2Fline-liff-with-azure-handson%2Fmain%2Farm-templates%2Ftemplate.json)

下記を入力し、「Review + create」ボタンを選択して入力内容を表示します。

- 「Resource group」は、「Create new」を選択し、表示されたダイアログに任意のリソースグループ名を入力し、「OK」を選択します。
- 「Region」は、近いリージョン（`Japan East` や `Japan West` など）を入力します。
- 「Identifier」は、グローバルで一位になるような文字列を入力します。（※ この文字列を使う Cosmos DB のリソース名がグローバルで一意になる必要があります。）
- 「Static Web App Location」は、近いリージョンを指定します。日本からは `eastasia` のままで構いません。
- 「Static Web App Sku Tier」および「Static Web App Sku Name」は、「Free」のままで構いません。
- 「Static Web App Repository Url」は、先ほど作成した GitHub リポジトリのURLを設定します。（例: `https://github.com/<owner>/<repository>` ）
- 「Static Web App Repository Token」は、先ほど生成した GitHub persional access token を設定します。
- 「Static Web App Branch」「Static Web App App Location」「Static Web App Api Location」「Static Web App App Artifact Location」は変更しません。
- 「Static Web App Exists」「Cosmos Db Enable Free Tier」「Cosmos Db Database Throughput」はそのままで構いません。

![]()

入力内容を確認し、「Create」ボタンを選択しデプロイを実行します。

![]()

デプロイが完了するまでしばらく時間がかかります。

![]()

## GitHub リポジトリの Secrets を設定する


LIFF ID を設定する

また、デプロイが終わると、指定した GitHub リポジトリの Secret に新しい Secret が生成されます。
これをワークフローに設定します。

----

### メモ

LIFF ID は GitHub Secret に指定する

コラム: テンプレートからリポジトリを作成すると、 `.github/workflows/deploy-azure-static-web-app.yml` があるので GitHub Actions のワークフローが実行されますが、 `azure_static_web_apps_api_token was not provided.` というエラーが発生し失敗します。
