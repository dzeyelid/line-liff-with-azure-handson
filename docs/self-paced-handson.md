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
1. GitHub の Personal access token を生成する
1. Azure Static Web Apps と Cosmos DB をデプロイする
1. Azure Static Web Apps の Functions の Application settings を設定する
1. GitHub リポジトリの Secrets を設定する
1. GitHub リポジトリのワークフローを修正する
1. GitHub アクションを確認する
1. LINE DevelopersコンソールでエンドポイントURLを設定する
1. 動作確認をする

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

![](./images/github-repository_create-repository-from-template_001.png)

下記を入力し、「Create repository from template」ボタンを選択しリポジトリを作成します。

- 「Repository name」に、任意のリポジトリ名を入力します。
- 「Public」を選択します。
- 「Include all branches」はチェックしません。

![](./images/github-repository_create-repository-from-template_002.png)

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

![](./images/azure-portal_deployment_001.png)
![](./images/azure-portal_deployment_002.png)

入力内容を確認し、「Create」ボタンを選択しデプロイを実行します。

![](./images/azure-portal_deployment_003.png)

デプロイが完了するまでしばらく時間がかかります。

デプロイが完了すると下記の画面に遷移します。「Go to resource group」ボタンを選択し、作成したリソースグループに移動します。

![](./images/azure-portal_deployment_004.png)

![](./images/azure-portal_resource-group.png)

## Azure Static Web Apps の Functions の Application settings を設定する

Azure Static Web Apps の Functions の Application settings の設定を行います。

このうち Cosmos DB の接続文字列が必要なので、先に取得しておきましょう。

まず、リソースグループのリソース一覧から Cosmos DB を選択し、開きましょう。

![](./images/azure-portal_get-cosmosdb-connstring_001.png)

Cosmos DB の画面で、左メニューから「Keys」を選択します。

![](./images/azure-portal_get-cosmosdb-connstring_002.png)

Cosmos DB のキー及び接続文字列が表示されます。「Read-write Keys」タブの「PRIMARY CONNECTION STRING」の値をコピーし控えておきましょう。

![](./images/azure-portal_get-cosmosdb-connstring_003.png)

それでは、Static Web Apps の設定に進みましょう。

まず、リソースグループの画面に戻ります。前述の画面空移動するには、画面上部のリソースグループ名の部分を選択すると、リソースグループに遷移できます。

![](./images/azure-portal_get-cosmosdb-connstring_004.png)

リソースグループの画面で、Static Web Apps を選択し開きます。

![](./images/azure-portal_static-web-apps_set-func-app-settings_001.png)

左のメニューの「Settings」から「Configuration」を開きます。ここでは、各 Environment に対して、Application settings として環境変数を設定できます。

![](./images/azure-portal_static-web-apps_set-func-app-settings_002.png)

下記 4つ環境変数を登録します。「+ Add」を選択し、一つずつ登録していきましょう。

| Variable name | value |
|----|----|
| `COSMOS_DB_CONNECTION_STRING` | Cosmos DB の接続文字列（Connection string） |
| `COSMOS_DB_CONTAINER_ID_GLOBAL_RESULTS` | `global-results` |
| `COSMOS_DB_CONTAINER_ID_PLAYER_RESULTS` | `player-results` |
| `COSMOS_DB_DATABASE_ID` | `games` |

![](./images/azure-portal_static-web-apps_set-func-app-settings_003.png)

4つの環境変数を登録し終えたら、忘れずに「Save」ボタンを選択し保存してください。

![](./images/azure-portal_static-web-apps_set-func-app-settings_004.png)

## GitHub リポジトリの Secrets を設定する

GitHub Actions のワークフローによる Azure Static Web Apps のデプロイに必要な Secret を設定します。

作成した GitHub リポジトリの「Settings」から「Secrets」を開きましょう。

![](./images/github_secrets_001.png)

すると、すでにひとつ `AZURE_STATIC_WEB_APPS_API_TOKEN_XXXX_XXXX_123456789` というような secret が作成されていることがわかります。これは、Azure Static Web Apps のリソースをデプロイしたときに自動的に作成された secret です。ワークフローはこの secret を用ることによってコードを Azure Static Web Apps にデプロイできるようになります。

![](./images/github_secrets_002.png)

もうひとつ secret を追加しましょう。

「New secret」ボタンを選択し、secret 作成画面を開きます。

![](./images/github_secrets_003.png)

「Name」に `LIFF_ID` を指定し、「Value」に前の手順で控えた「LIFF ID」を指定し、「Add secret」ボタンを選択して保存します。

![](./images/github_secrets_004.png)

## GitHub リポジトリのワークフローを修正する

次に、ワークフローを修正します。GitHub のリポジトリの `.github/workflows` ディレクトリを開きましょう。

![](./images/github_edit-workflow_001.png)

`.github/workflows` には、2つのワークフローがあります。

このうち、 `deploy-azure-static-web-apps.yml` は元リポジトリで使用していたものなので、削除しておきましょう。

![](./images/github_edit-workflow_002.png)

`deploy-azure-static-web-apps.yml` を開き、ごみ箱のマークを選択しファイルを削除します。

![](./images/github_edit-workflow_003.png)

ここでは、適宜コミットタイトルとディスクリプションを入力し、「Commit changes」ボタンを選択し、削除をコミットします。なお、実際のコミットの作法は各自・各プロジェクトに従ってください。

![](./images/github_edit-workflow_004.png)

つぎに、もう一方の `azure-static-web-apps-xxx-xxx-123456789.yml` というようなファイル名のワークフローは、Azure Static Web Apps のデプロイ時に生成されたものです。（以降、`azure-static-web-apps-<suffix>.yml` と表記します。）

![](./images/github_edit-workflow_004.png)

この `azure-static-web-apps-<suffix>.yml` をみてみましょう。

すでに `Azure/static-web-apps-deploy@v0.0.1-preview` という Azure Static Web Apps にデプロイするための GitHub アクションが設定されていることがわかります。

そして、このアクションのパラメータ `azure_static_web_apps_api_token` には、先ほど確認した secret `AZURE_STATIC_WEB_APPS_API_TOKEN_XXXX_XXXX_123456789` が利用されていることもわかります。

さて、本アプリを正しくデプロイするために一部編集します。

GitHub で扱いファイルを編集するには多くの方法がありますが、ここでは GitHub 上で直接編集します。ファイルの右上にある鉛筆のマーク（Edit this file という注釈）を選択して、編集画面に遷移します。

![](./images/github_edit-workflow_005.png)

GitHub 上でワークフローファイルを編集するときは、このように GitHub アクションが編集しやすいUIを利用できます。

![](./images/github_edit-workflow_006.png)

「Azure/static-web-apps-deploy」アクションの実行時に、環境変数として `VUE_APP_LIFF_ID` を渡したいので、下記の設定を追加します。

```yml
env:
  VUE_APP_LIFF_ID: ${{ secrets.LIFF_ID }}
```

追加する位置は、 `with:` と同階層です。

```diff
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
        ...
          ###### End of Repository/Build Configurations ######
+       env:
+         VUE_APP_LIFF_ID: ${{ secrets.LIFF_ID }}
```

![](./images/github_edit-workflow_007.png)

GitHubアクションの利用については、こちらをご参考ください。

- [GitHub Actions 入門 - GitHub Docs](https://docs.github.com/ja/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions)

また、「Azure/static-web-apps-deploy」アクションの詳細はこちらをご参照ください。

- [Azure Static Web Apps Deploy · Actions · GitHub Marketplace](https://github.com/marketplace/actions/azure-static-web-apps-deploy)

ファイルの編集ができたら、コミットします。ここでは、「Start commit」ボタンを選択し、コミットタイトルやディスクリプションを適宜入力の上、「Commit changes」ボタンを選択しコミットします。なお、実際のコミットの作法は各自・各プロジェクトに従ってください。

![](./images/github_edit-workflow_008.png)

## GitHub アクションを確認する

コミットを終えると、このワークフローが実行されます。（ `on.push.branches: [main]` のトリガが設定されているため）

実行内容を見てみましょう。「Actions」タブを開くとこれまでに実行されたワークフローの一覧が表示されます。

実行中のワークフロー（黄色いマーク）を開いてみましょう。

![](./images/github_workflow_001.png)

「Buid and Deploy Job」を開くと各ステップを見ることができます。「Build And Deploy」を開くと、Azure Static Web Apps へコードをデプロイする様子を確認することができます。

![](./images/github_workflow_002.png)

下の方までスクロールし、デプロイが成功していると、このようにデプロイされたURL `https://<prefix>.azurestaticapps.net/` が表示されます。（URLは各環境で異なります。）

![](./images/github_workflow_003.png)

このURLをコピーして控えておいてください。

## LINE DevelopersコンソールでエンドポイントURLを設定する

URLを開く前に、最後の仕上げがあります。

[LINE Developersコンソール](https://developers.line.biz/console/) にもどり、作成したLIFFアプリの詳細画面に戻ります。 

「エンドポイントURL」の「編集」ボタンを選択し、先ほど表示されていた Azure Static Web Apps のURLに置き換えます。「更新」ボタンを選択し、保存しましょう。

![](./images/line-devepolers-console_liff-setting_004.png)

## 動作確認をする

ここまで完了しましたら、LIFF URL を開いてみましょう！LINEアプリがインストールされているスマートフォン、あるいは外部ブラウザでURLを開きます。

![](./images/line-devepolers-console_liff-setting_005.png)

スマートフォンで開いた場合は、LINEアプリが起動しこのように表示されます。

![](./images/liff-app_on-line_001.png)


「Allow」を選択し、許可することで LIFFアプリを利用できるようになります。

![](./images/liff-app_on-line_002.png)

外部ブラウザで開いた場合は、LINEログインを促され、ログインすると LIFF アプリが表示されます。

![](./images/liff-app_on-web_001.png)

![](./images/liff-app_on-web_002.png)

Congratulation!! :tada:
