/* =============================================================
   翔舞技建 デモサイト  共通スクリプト
   - ハンバーガーメニュー（開閉）
   - FAQアコーディオン
   - スクロール時のふわっと表示（控えめ）
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. ハンバーガーメニュー
     ----------------------------------------------------------- */
  function initHamburger() {
    var btn = document.querySelector('.hamburger');
    var nav = document.querySelector('.gnav');
    var overlay = document.querySelector('.nav-overlay');
    if (!btn || !nav) return;

    function closeMenu() {
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      var willOpen = !nav.classList.contains('is-open');
      btn.classList.toggle('is-open', willOpen);
      nav.classList.toggle('is-open', willOpen);
      if (overlay) overlay.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      // ドロワーを開いている間は背面スクロールを止める
      document.body.style.overflow = willOpen ? 'hidden' : '';
    }

    btn.addEventListener('click', toggleMenu);

    // 背景（暗幕）クリックで閉じる
    if (overlay) overlay.addEventListener('click', closeMenu);

    // ナビ内リンクをタップしたら閉じる（ページ遷移時の体感をスムーズに）
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Escキーで閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // PC幅に戻ったら状態をリセット
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* -----------------------------------------------------------
     2. FAQ アコーディオン
     ----------------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!question || !answer) return;

      question.setAttribute('aria-expanded', 'false');

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // いったん全て閉じる（同時に1つだけ開くタイプ）
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherA = other.querySelector('.faq-a');
          var otherQ = other.querySelector('.faq-q');
          if (otherA) otherA.style.maxHeight = null;
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        });

        // クリックしたものが閉じていたら開く（開いていたものは閉じたまま＝トグル）
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // ウィンドウリサイズ時、開いている項目の高さを再計算
    window.addEventListener('resize', function () {
      document.querySelectorAll('.faq-item.is-open .faq-a').forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + 'px';
      });
    });
  }

  /* -----------------------------------------------------------
     3. スクロール時のふわっと表示
     ----------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    // モーション控えめ設定なら即表示して終了
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------
     初期化
     ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initHamburger();
    initFaq();
    initReveal();
  });
})();
