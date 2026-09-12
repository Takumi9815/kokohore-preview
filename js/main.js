/* ============================================================
   KOKOHOREわんにゃん ペットホテルLP — スクリプト（最小限・ビルド不要）

   ★編集するのは下の SITE だけ。
   - [data-line] … 全LINEボタンの href を SITE.lineUrl に置換（未設定なら #cta-final へスクロール）
   - [data-tel]  … 全電話ボタンの href を tel:SITE.tel に置換（未設定なら非表示）
   - [data-text] … <span data-text="rating"> 等を SITE の同名キーで上書き（空なら非表示）
   - [data-cta]  … クリックを dataLayer（GTM）へ送信。gtag / fbq があれば直接も発火
   ============================================================ */

// ▼編集ここから（サイト設定：ここを直せば全ページに反映）
var SITE = {
  // LINE公式アカウントの友だち追加URL（例: 'https://lin.ee/xxxxxxx'）。受領まで空のままでOK
  lineUrl: '',

  // 電話番号（ハイフンなし。例: '09057037914'）。広告用の番号が決まるまで空＝電話ボタン非表示
  tel: '',
  telDisplay: '',   // 表示用（例: '090-5703-7914'）

  // Google口コミの評点と時点（FVバッジ・実績セクションに反映）
  rating: '4.6',
  ratingDate: '2026年8月時点'
};
// ▲編集ここまで

// 年号
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 文言の一括反映：<span data-text="キー"> を SITE[キー] で上書き（空文字なら要素ごと非表示）
(function () {
  document.querySelectorAll('[data-text]').forEach(function (el) {
    var key = el.getAttribute('data-text');
    if (!Object.prototype.hasOwnProperty.call(SITE, key)) return;
    var value = SITE[key];
    if (typeof value !== 'string') return;
    if (value.trim() === '') { el.hidden = true; return; }
    el.textContent = value;
    el.hidden = false;
  });
})();

// LINEボタン：<a data-line> の href を SITE.lineUrl に置換
(function () {
  var url = (SITE.lineUrl || '').trim();
  if (!url) return;
  document.querySelectorAll('[data-line]').forEach(function (a) {
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
})();

// 電話ボタン：<a data-tel> の href を tel: に置換。未設定なら非表示にしてLINEだけにする
(function () {
  var tel = (SITE.tel || '').replace(/[^0-9+]/g, '');
  document.querySelectorAll('[data-tel]').forEach(function (a) {
    if (!tel) { a.hidden = true; return; }
    a.setAttribute('href', 'tel:' + tel);
    a.hidden = false;
  });
})();

// CTAクリック計測：data-cta="..." のクリックを dataLayer（GTM）へ送る
// GTM側：カスタムイベント cta_click → GA4イベント（キーイベント）／Google広告CV／Meta Pixel Lead
(function () {
  window.dataLayer = window.dataLayer || [];
  function track(label, type) {
    window.dataLayer.push({ event: 'cta_click', cta_label: label, cta_type: type });
    if (typeof window.gtag === 'function') window.gtag('event', 'cta_click', { cta_label: label, cta_type: type });
    if (typeof window.fbq === 'function') window.fbq('trackCustom', 'CTAClick', { label: label, type: type });
  }
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      var type = el.hasAttribute('data-line') ? 'line' : (el.hasAttribute('data-tel') ? 'tel' : 'other');
      track(el.getAttribute('data-cta'), type);
    });
  });
})();
