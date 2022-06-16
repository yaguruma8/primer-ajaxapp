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
