// ===== 定数・DOM 要素の取得 =====

// localStorage に保存するときのキー名(この名前でデータを出し入れする)
const STORAGE_KEY = 'kakeibo-records';

const form = document.getElementById('kakeibo-form');
const listEl = document.getElementById('kakeibo-list'); // 一覧の <tbody>
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const totalAmountEl = document.getElementById('total-amount');
const dateInput = document.getElementById('date');

// 保存用の値(income / expense)を画面表示用の日本語に変換するための対応表
const TYPE_LABELS = { income: '収入', expense: '支出' };

// ===== localStorage の読み書き =====

// 保存済みの記録を配列で返す。
// localStorage には文字列しか保存できないので、JSON.parse で配列に戻す。
function loadRecords() {
  try {
    // 初回など未保存のときは getItem が null を返すので、'[]' を代わりに使う
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    // 保存内容が壊れていて JSON として読めない場合は空として扱う
    return [];
  }
}

// 記録の配列を JSON 文字列に変換して保存する
function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ===== 画面の描画 =====

// 1件分の記録から一覧の行(<tr>)を作る
function createRow(record) {
  const tr = document.createElement('tr');
  // 列の順番は index.html の <thead> に合わせる
  const cells = [
    record.date,
    record.item,
    TYPE_LABELS[record.type] ?? record.type,
    record.amount.toLocaleString(), // 1,200 のように桁区切りにする
  ];
  for (const text of cells) {
    const td = document.createElement('td');
    // innerHTML ではなく textContent を使い、入力された文字を HTML として解釈させない
    td.textContent = text;
    tr.appendChild(td);
  }
  return tr;
}

// 記録の配列をもとに、一覧と合計欄をまとめて更新する
function render(records) {
  // 元の配列を変えないようコピーしてから、日付の新しい順に並べる
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  // 一覧の中身を、新しく作った行にまるごと入れ替える
  listEl.replaceChildren(...sorted.map(createRow));

  // 指定した区分(income / expense)の金額を合計する
  const sum = (type) =>
    records.filter((r) => r.type === type).reduce((acc, r) => acc + r.amount, 0);
  const income = sum('income');
  const expense = sum('expense');
  totalIncomeEl.textContent = income.toLocaleString();
  totalExpenseEl.textContent = expense.toLocaleString();
  totalAmountEl.textContent = (income - expense).toLocaleString();
}

// 日付入力欄に今日の日付を入れる。
// 'sv-SE' ロケールは YYYY-MM-DD 形式になり、<input type="date"> の値としてそのまま使える。
function setToday() {
  dateInput.value = new Date().toLocaleDateString('sv-SE');
}

// ===== フォーム送信時の処理 =====

form.addEventListener('submit', (event) => {
  // ページ遷移(再読み込み)を止めて、JS で処理する
  event.preventDefault();

  // フォームの入力値をまとめて取得する(キーは各 input の name 属性)
  const data = new FormData(form);

  // 保存済みデータに新しい1件を追加して保存する
  const records = loadRecords();
  records.push({
    id: crypto.randomUUID(), // 将来の編集・削除で特定できるよう一意の ID を付ける
    date: data.get('date'),
    item: data.get('item').trim(), // 前後の空白は除く
    type: data.get('type'), // 'income' または 'expense'
    amount: Number(data.get('amount')), // フォームの値は文字列なので数値に変換
  });
  saveRecords(records);

  // 保存した内容で画面を更新し、入力欄を初期状態に戻す
  render(records);
  form.reset();
  setToday(); // reset() で日付も空になるので入れ直す
});

// ===== ページ読み込み時の処理 =====

setToday();
// 保存済みデータを読み込んで表示する(リロードしてもデータが残る)
render(loadRecords());
