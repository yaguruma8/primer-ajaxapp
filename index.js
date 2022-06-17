'use strict';

async function main() {
  try {
    const userInfo = await fetchUserInfo('js-primer-example')
    const view = createView(userInfo)
    displayView(view)
  } catch(error) {
    console.error(`エラーが発生しました (${error})`);
  }
}

function fetchUserInfo(userId) {
  return fetch(
    `https://api.github.com/users/${encodeURIComponent(userId)}`
  ).then((response) => {
    // エラーレスポンス
    if (!response.ok) {
      Promise.reject(new Error(`${response.status} : ${response.statusText}`));
    } else {
      return response.json();
    }
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
