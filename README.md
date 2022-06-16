# primer-ajaxapp

GitHubのユーザーIDからプロフィール情報を取得するアプリケーションを作成する

[JavaScript Primer - ユースケース: Ajax通信](https://jsprimer.net/use-case/ajaxapp/)

## アプリケーションの要件

- GitHubのユーザーIDをテキストボックスに入力できる
- 入力されたユーザーIDを元にGitHubからユーザー情報を取得する
- 取得したユーザー情報をアプリケーション上で表示する

## エントリーポイント

エントリーポイント＝アプリケーションの中で一番最初に呼び出される部分

アプリケーションを作成する際には、まずはエントリーポイントを用意する。    
Webアプリケーションにおいては常にHTMLドキュメントがエントリーポイントとなり、ブラウザでHTMLドキュメントが読み込まれた後にHTMLドキュメント中で読み込まれたJavaScriptが実行される。

`index.html`
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Ajax Example</title>
  </head>
  <body>
    <h2>GitHub User Info</h2>
    <script src="index.js"></script>
  </body>
</html>
```

`index.js`
```js
'use strict'

console.log('index.js: loaded')
```

## HTTP通信

GitHubのAPIを呼び出すためにはHTTP通信をする必要がある。ウェブブラウザ上でJavaScriptからHTTP通信をするために`Fetch API`という機能を使う。

## Fetch API

[Fetch の使用 - Web API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch)

HTTP通信を行なってリソースを取得するためのAPI。    
ページ全体を再読み込みすることなく指定したURLからデータを取得できる。
古い規格の`XMLHttpRequest`と似た規格だがより強力で柔軟な操作が可能。

### リクエスト送信: `fetch(url)`メソッド    

GitHubにはユーザー情報を取得するAPIが用意されているのでそれを使用する。    
`https://api.github.com/users/GitHubユーザーID`    

ユーザーIDは`encodeURIComponent()`関数でエスケープする。

### レスポンスの受け取り

`fetch()`は`Promise`を返却し、この`Promise`インスタンスはリクエストに対するレスポンスを表す`Response`オブジェクトでresolveされる。

送信したリクエストにレスポンスが返却されると`then`コールバックが呼び出される。

`Response`オブジェクトの`status`プロパティからはHTTPレスポンスのステータスコードが取得できる。

`Response`オブジェクトの`json()`も`Promise`を返し、HTTPレスポンスボディをjsonとしてパースしたオブジェクトでresolveされる。

```js
const userId = 'js-primer-example';
fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`).then(
  (response) => {
    console.log(response.status);
    return response.json().then((userinfo) => {
      console.log(userinfo);
    });
  }
);
```

### エラーハンドリング

HTTP通信にはエラーがつきもののため、Fetch APIを使った通信においてもエラーハンドリングする必要がある。

サーバーとの通信に際してネットワークエラーが発生した場合:    
ネットワークエラーを表す`NetworkError`オブジェクトでrejectされた`Promise`が返される。    
すなわち、`then()`の第二引数か`catch()`のコールバック関数が呼び出される。

リクエストが成功したかどうかは`Response`オブジェクトの`ok`プロパティで確認:    
ステータスコードが200番台なら`true`を、それ以外（400番台、500番台）などなら`false`を返す。    
よって`ok`プロパティが`false`になるエラーレスポンスをハンドリングできる。

`index.js`
```js
function fetchUserInfo(userId) {
  fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then((response) => {
      console.log(response.status);
      // エラーレスポンス
      if (!response.ok) {
        console.error('エラーレスポンス', response);
      } else {
        return response.json().then((userinfo) => {
          console.log(userinfo);
        });
      }
    })
    .catch((error) => {
      // ネットワークエラー
      console.error(error);
    });
}
```

