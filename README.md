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
      console.error('ネットワークエラー', error);
    });
}
```

## データを表示する

取得したデータ（json)をHTMLに整形してアプリケーションにユーザー情報を表示する。    
HTMLの組み立てには`テンプレートリテラル`を利用する。

```js
const view = `
<h4>${userInfo.name} (@${userInfo.login})</h4>
<img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
<dl>
    <dt>Location</dt>
    <dd>${userInfo.location}</dd>
    <dt>Repositories</dt>
    <dd>${userInfo.public_repos}</dd>
</dl>
`;
```


### 動的にHTMLをセットするための目印になる要素を追加する

`index.html`
```html
    <!-- ... -->
    <h2>GitHub User Info</h2>
    <button onclick="fetchUserInfo('js-primer-example');">Get User Info</button>
    <!-- 整形したHTMLの挿入先 -->
    <div id="result"></div>
    <script src="index.js"></script>
```

### JavaScriptによってHTML文字列をDOMに追加する方法

- HTML文字列を`innerHTML`プロパティにセットする
```js
element.innerHTML = view;
```
簡潔に記載できるがエスケープ処理などのセキュリティに注意する必要がある

- Elementオブジェクトを作成して手続的にツリー構造を構築する
```js
const childElement = document.createElement('div')
element.appendChild(childElement)
```
冗長になるがセキュリティ的には安全

### HTML文字列のエスケープ

`innerHTML`プロパティに文字列をセットするとその文字列はHTMLとして解釈されるため、例えばGitHubのユーザー名に`<`や`>`などが含まれていると意図しない構造のHTMLになる可能性がある。    
これを回避するために、文字列をセットする前に特定の記号を安全な表現に置換する必要がある。    
この処理を一般的にHTMLの**エスケープ**と呼ぶ。

特殊な記号に対するエスケープ処理
`index.js`
```js
function escapeSpecialChars(str) {
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}
```

### タグ付きテンプレートリテラル

作成したエスケープ関数を`userinfo`から値を注入しているすべての箇所で呼び出す。   
ただし、テンプレートリテラル中で挿入している部分全てに関数を適用するのはメンテナンス性が良くないため、テンプレートリテラルを**タグ付け**して、エスケープ用の関数を自動的に適用させるようにする。    
タグ付けされたテンプレートリテラルは、テンプレートによる値の埋め込みを関数の呼び出しとして扱う。    

```js
function escapeHTML(string, ...values) {
  return string.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === 'string') {
      // 挿入された変数が文字列型ならエスケープする
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}
```
```js
// テンプレートリテラルのバッククォート記号の前に関数を書くと関数がタグ付される
const view = escapeHTML`
<h4>${userInfo.name} (@${userInfo.login})</h4>
<img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
<dl>
    <dt>Location</dt>
    <dd>${userInfo.location}</dd>
    <dt>Repositories</dt>
    <dd>${userInfo.public_repos}</dd>
</dl>
`;
// HTMLの挿入
const result = document.getElementById('result');
result.innerHTML = view;
```

### `fetchUserInfo()`内で組み立て
```js
function fetchUserInfo(userId) {
  fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then((response) => {
      console.log(response.status);
      // エラーレスポンス
      if (!response.ok) {
        console.error('エラーレスポンス', response);
      } else {
        return response.json().then((userInfo) => {
          // HTMLの組み立て
          const view = escapeHTML`
            <h4>${userInfo.name} (@${userInfo.login})</h4>
            <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
            <dl>
              <dt>Location</dt>
              <dd>${userInfo.location}</dd>
              <dt>Repositories</dt>
              <dd>${userInfo.public_repos}</dd>
            </dl>
          `;
          // HTMLの挿入
          const result = document.getElementById('result');
          result.innerHTML = view;
        });
      }
    })
    .catch((error) => {
      // ネットワークエラー
      console.error('ネットワークエラー', error);
    });
}
```

## Promiseを活用する

### 関数の分割

大きくなりすぎた`fetchUserInfo()`を整理する。    
現在、

- Fetch APIを使ったデータの取得
- HTML文字列の組み立て
- 組み立てたHTMLの表示

が一つの関数にあるので、それぞれを関数にして処理を分割する。

`index.js`
```js
function fetchUserInfo(userId) {
  fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then((response) => {
      // エラーレスポンス
      if (!response.ok) {
        console.error('エラーレスポンス', response);
      } else {
        return response.json().then((userInfo) => {
          const view = createView(userInfo);
          displayView(view);
        });
      }
    })
    .catch((error) => {
      // ネットワークエラー
      console.error('ネットワークエラー', error);
    });
}

// HTMLの組み立て
function createView(userInfo) {
  return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
  `;
}

// HTMLの挿入
function displayView(view) {
  const result = document.getElementById('result');
  result.innerHTML = view;
}
```

### アプリケーションにエントリーポイントを設ける

エラーハンドリングを行いやすくするため。

`index.js`
```js
function main() {
  fetchUserInfo('js-primer-example');
}
```

`index.html`
```html
  <button onclick="main();">Get User Info</button>
```

### Promiseのエラーハンドリング

`fetchUserInfo()`で、`fetch()`をreturnする。    
これによってPromiseオブジェクトがreturnされるため、`main()`の方でPromiseを受け取って非同期処理の結果を扱えるようになる。    
エラーは全て`catch()`で受け取り、`main()`でハンドリングする。    
`index.js`
```js
function main() {
  fetchUserInfo('js-primer-example').catch((error) => {
    // Promiseチェーンのエラーを受け取る
    console.error(`エラーが発生しました (${error})`);
  });
}

function fetchUserInfo(userId) {
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then((response) => {
    // エラーレスポンス
    if (!response.ok) {
      // エラーレスポンスからrejectedなPromiseを作成
      // -> Promiseチェーンがエラーの状態になるのでcatchでハンドリングできる
      Promise.reject(new Error(`${response.status} : ${response.statusText}`));
    } else {
      return response.json().then((userInfo) => {
        const view = createView(userInfo);
        displayView(view);
      });
    }
  });
}
```
ネットワークエラー : 元々`catch()`で受け取るのでそのまま。    

エラーレスポンス: そのままでは`catch()`で受け取れないので、受け取れるように処理を変更する。
`Promise.reject()`で失敗したPromiseを返却して、Promiseチェーンをエラーの状態にする→`catch()`で受け取る
