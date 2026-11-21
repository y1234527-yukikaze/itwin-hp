/* 用語の説明（点線の下線の言葉にカーソルを合わせる・タップすると短い説明が出る）
   使い方：本文で <span class="term" tabindex="0">用語<span class="term-tip" role="tooltip">説明</span></span>
   2026-11-19 架台の強度計算の記事で試行／2026-11-21 隠れた説明が横にはみ出す不具合を修正 */
(function () {
  var css =
    '.term{position:relative;color:var(--navy-soft,#16406e);text-decoration:underline dotted var(--orange,#d4691a);' +
    'text-decoration-thickness:2px;text-underline-offset:4px;cursor:help;outline:none;}' +
    '.term:focus-visible{box-shadow:0 0 0 2px var(--orange,#d4691a);border-radius:2px;}' +
    '.term-tip{position:absolute;z-index:50;left:50%;bottom:calc(100% + 10px);transform:translateX(calc(-50% + var(--tip-shift,0px)));' +
    'width:max-content;max-width:min(320px,calc(100vw - 32px));box-sizing:border-box;padding:10px 14px;' +
    'background:var(--navy,#0d2b4e);color:#fff;font-size:0.86rem;font-weight:400;line-height:1.7;letter-spacing:0;' +
    'text-align:left;text-indent:0;white-space:normal;border-radius:8px;box-shadow:0 6px 20px rgba(13,43,78,.25);' +
    'display:none;pointer-events:none;}' +
    '.term-tip::after{content:"";position:absolute;left:calc(50% - var(--tip-shift,0px));top:100%;margin-left:-7px;' +
    'border:7px solid transparent;border-top-color:var(--navy,#0d2b4e);}' +
    '.term-tip.below{bottom:auto;top:calc(100% + 10px);}' +
    '.term-tip.below::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:var(--navy,#0d2b4e);}' +
    '.term.open .term-tip,.term:focus-visible .term-tip{display:block;}' +
    '@media (hover:hover){.term:hover .term-tip{display:block;}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* 画面の端からはみ出さないように、左右と上下を調整する */
  function place(term) {
    var tip = term.querySelector('.term-tip');
    if (!tip) return;
    tip.style.setProperty('--tip-shift', '0px');
    tip.classList.remove('below');
    tip.style.display = 'block';   /* 隠れている間は display:none（はみ出しでスマホの画面が縮むのを防ぐ）。測る間だけ出す */
    var r = tip.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var gap = 12, shift = 0;
    if (r.left < gap) shift = gap - r.left;
    else if (r.right > vw - gap) shift = (vw - gap) - r.right;
    tip.style.setProperty('--tip-shift', shift + 'px');
    if (r.top < 80) tip.classList.add('below');
    tip.style.display = '';
  }
  function closeAll(except) {
    document.querySelectorAll('.term.open').forEach(function (t) {
      if (t !== except) t.classList.remove('open');
    });
  }

  document.querySelectorAll('.term').forEach(function (term) {
    term.addEventListener('mouseenter', function () { place(term); });
    term.addEventListener('focus', function () { place(term); });
    term.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !term.classList.contains('open');
      closeAll(term);
      if (willOpen) { place(term); term.classList.add('open'); }
      else term.classList.remove('open');
    });
  });
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  window.addEventListener('scroll', function () { closeAll(null); }, { passive: true });
})();
