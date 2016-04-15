# Memo with Text Search

## はじめに
このアプリケーションは、Node.js、Cloudant NoSQL DB でテキスト検索実装の検証のために作成しました。  
Memo アプリ にテキスト検索機能を付加しました。
Memo アプリについては以下のサイトを参照してください。  
<https://github.com/ippei0605/memo>


## セットアップ
1. 本サイトから Memo with Text Search アプリをダウンロード (Download ZIP) して解凍してください。ディレクトリ名は memo-textsearch-master から memo-textsearch に変更してください。

1. Bluemix コンソールから CFアプリケーション (Node.js) を作成してください。  
アプリケーション名: memo-textsearch-ippei (任意)  

    > 以降、memo-textsearch-ippei で説明します。


1. CF コマンド・ライン・インターフェースをインストールしていない場合は、インストールしてください。

1. Cloudant NoSQL DB を作成し、memo-textsearch-ippei にバインドしてください。  
サービス名: Cloudant NoSQL DB-cc (固定)  

    > 名前を変更したい場合は、 utils/context.js の CLOUDANT_SERVICE_NAME の設定値を変更してください。

1. 解凍したディレクトリ (memoアプリのホーム) に移動してください。

        > cd memo-testsearch

1. Bluemixに接続してください。

        > cf api https://api.ng.bluemix.net
    

1. Bluemix にログインしてください。(ユーザ、組織、スペースは御自身の環境に合わせて変更してください。)

        > cf login -u e87782@jp.ibm.com -o e87782@jp.ibm.com -s dev

1. アプリをデプロイしてください。

        > cf push memo-textsearch-ippei

1. ご使用のブラウザーで以下の URL を入力して、アプリにアクセスしてください。

        memo-textsearch-ippei.mybluemix.net


## ファイル構成
    memo
    │  .cfignore
    │  .gitignore
    │  app.js                    Memo with Text Search アプリ
    │  package.json
    │  README.md
    │  
    ├─install
    │      memo.function         Cloudant NoSQL DB のビューのマップファンクション
    │      postinstall.js        Memo with Text Search アプリのインストール後処理
    │      search-text.function  Cloudant NoSQL DB のインデックス
    │      
    ├─models
    │      memo.js               Memo with Text Search アプリのモデル
    │      
    ├─public
    │      favicon.ico
    │      
    ├─routes
    │      index.js              Memo with Text Search アプリのルーティング
    │      
    ├─utils
    │      context.js            Memo with Text Search アプリのコンテキスト
    │      
    └─views
            index.ejs             メモ一覧表示画面、新規登録・更新ダイアログ


## ルート (URLマッピング)
|Action|Method|処理|
|---|-----------|-----------|
|/|GET|検索キーワードが無い場合は全てのメモを表示します。ある場合は検索結果を表示します。|
|/memos|POST|メモを新規登録して、メモ一覧を表示します。(検索結果を維持)|
|/memos/:_id/:_rev|POST|メモを更新して、メモ一覧を表示します。(検索結果を維持)|
|/memos/:_id/:_rev/delete|POST|メモを削除して、メモ一覧を表示します。(検索結果を維持)|


## Memo アプリからの変更点
* テキスト検索機能をアドオンしました。概要を以下に示します。
 * メモのデータ項目中、contect と updatedAt に対して、default インデックスを設定しました。(_id、_rev は対象外)
     * 「あああ」、「2016*」などのキーワードで検索することが可能です。
     * 一覧と検索のビュー構造を共通化するため、テキスト検索 (search 関数) 結果の updatedAt を降順にソートしてキー配列とし、ビューにより表示します。
     * 設計文書(DocumentDesign)のインデックス要素「dafault」は、JavaScript では予約語のため、ドット演算子ではなく配列表記しました。
 * 新規、更新、削除処理後のメモ一覧表示は、テキスト検索の結果を表示するように変更しました。
 * 検索結果をクリアするために、タイトルにメモ一覧に移動するリンクを付加しました。
* その他
 * メモ新規登録および更新ダイアログをサーバ送信せず、クライアントのみの制御に変更しました。
 * 上記に伴い、マップファンクションは全項目を取得するように変更しました。


## まとめ
Cloudant NoSQL DB のインデックス機能により、複数項目のテキスト検索が簡単に実装できることが分かりました。  
Node.js において、Cloudant のドキュメント操作は非同期処理のため、リストで取得したドキュメントを、ループ処理で個別操作して、結果セットを画面  (EJS) に渡すことは難しいです。非同期処理の結果を待つ仕組みが必要だからです。また、SQLのようにサブクエリを実行することもできません。インデックスとビュー (マップファンクション) を組合わせて記述することが Node.js では効率的だと思いました。データ構造や画面レイアウトがより複雑な場合は、当たり前のことですがインデックスとビューの設計が鍵となります。  
些細なことですが、Java Script の予約語は、要素や関数に利用されていることがあり、その場合は工夫が必要だと思いました。 (Express の dalete関数、今回のインデックスの default など)

## リンク
* Cloudant Node.js client library  
<https://github.com/cloudant/nodejs-cloudant>
* Cloudant NoSQL DB の概要 (Bluemix)  
<https://new-console.ng.bluemix.net/docs/services/Cloudant/index.html#Cloudant>
* Cloudant.com (こちらの FOR DEVELOPERS の FAQ や Sample Apps は Blumix の文書より充実してます。)  
<https://cloudant.com/>
