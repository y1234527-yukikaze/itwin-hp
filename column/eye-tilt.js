/* アイキャッチを、マウスの位置に合わせて少しだけ傾ける（コラム記事・2026-11-16）
   PCでマウスを乗せたときだけ。スマホ・タブレットと「動きを減らす」設定の人には動かさない。
   アイキャッチ＝本文の最初の見出しより前にある、最初の図。 */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var body = document.querySelector('.article-body');
  if (!body) return;
  var fig = body.querySelector('.article-figure'), h2 = null;
  // 目次の見出しは数えない（古い記事は、目次の下にアイキャッチがある）
  body.querySelectorAll('h2').forEach(function (h) { if (!h2 && !h.closest('nav, [class*="toc"]') && h.textContent.trim() !== '目次') h2 = h; });
  if (!fig || (h2 && (h2.compareDocumentPosition(fig) & Node.DOCUMENT_POSITION_FOLLOWING))) return;
  var img = fig.querySelector('img');
  if (!img) return;
  var wrap = document.createElement('span');
  wrap.className = 'eye-tilt';
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  var MAX = 6; // 傾ける角度の上限（度）
  wrap.addEventListener('mousemove', function (e) {
    var r = wrap.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    wrap.style.transform = 'perspective(1000px) rotateX(' + (-y * MAX).toFixed(2) + 'deg) rotateY(' + (x * MAX).toFixed(2) + 'deg) scale(1.015)';
    wrap.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
    wrap.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
    wrap.classList.add('is-on');
  });
  wrap.addEventListener('mouseleave', function () {
    wrap.style.transform = '';
    wrap.classList.remove('is-on');
  });
})();
