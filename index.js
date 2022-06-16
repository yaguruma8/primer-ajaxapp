'use strict';

// console.log('index.js: loaded')

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

// エスケープ処理
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
