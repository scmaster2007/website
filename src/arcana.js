// Arcana — site-wide keyboard shortcuts + hermetic secrets.
// Plain JS, no dependencies. Loaded by index.html, blog.html, post.html.
//
//   t      toggle light / dark
//   g h    go home          g w    go to writings
//   /      search posts     j / k  drift down / up
//   m      music (posts)    d      the dancers (posts)
//   ?      help panel       esc    close
//
// Secrets (typed anywhere): zohar — transmute to gold / back to lead;
// solve — dissolution (dark); coagula — fixation (light).
(function () {
  'use strict';

  var GOLD_LIGHT = '#8f6e1d';
  var GOLD_DARK  = '#d4af5f';
  var HEBREW = 'אבגדהוזחטיכלמנסעפצקרשת';

  var rmQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  var reducedMotion = !!(rmQuery && rmQuery.matches);
  if (rmQuery && rmQuery.addEventListener) {
    rmQuery.addEventListener('change', function (e) { reducedMotion = e.matches; });
  }

  // ---------- styles ----------
  var style = document.createElement('style');
  style.textContent = [
    ':root[data-gold="1"] { --link: ' + GOLD_LIGHT + '; --thumb: rgba(160,124,42,0.5); --thumb-hover: rgba(160,124,42,0.8); }',
    ':root[data-gold="1"][data-theme="dark"] { --link: ' + GOLD_DARK + '; --thumb: rgba(212,175,95,0.45); --thumb-hover: rgba(212,175,95,0.8); }',
    '#arcana-toast {',
    '  position: fixed; left: 50%; bottom: 38px; transform: translateX(-50%);',
    '  z-index: 10000; pointer-events: none;',
    '  background: var(--paper, #fdfcf8); color: var(--ink, #0e0e10);',
    '  border: 1px solid var(--ink, #0e0e10);',
    '  padding: 8px 18px; font-family: "Source Serif 4", Georgia, serif;',
    '  font-style: italic; font-size: 14px; letter-spacing: 0.02em;',
    '  opacity: 0; transition: opacity 0.45s ease;',
    '}',
    '#arcana-toast.show { opacity: 1; }',
    '#arcana-help {',
    '  position: fixed; inset: 0; z-index: 10001;',
    '  display: flex; align-items: center; justify-content: center;',
    '  background: rgba(0,0,0,0.35);',
    '}',
    /* black over near-black paper barely dims — blur instead */
    ':root[data-theme="dark"] #arcana-help {',
    '  background: rgba(0,0,0,0.5);',
    '  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);',
    '}',
    '#arcana-help .arcana-card {',
    '  background: var(--paper, #fdfcf8); color: var(--ink, #0e0e10);',
    '  border: 1px solid var(--ink, #0e0e10);',
    '  font-family: "Source Serif 4", Georgia, serif; font-size: 14px;',
    '  padding: 18px 26px 14px; min-width: 264px; max-width: 90vw;',
    '}',
    '#arcana-help .arcana-title {',
    '  text-align: center; font-style: italic; margin-bottom: 12px;',
    '}',
    '#arcana-help table { border-collapse: collapse; margin: 0 auto; }',
    '#arcana-help td { padding: 2.5px 8px; }',
    '#arcana-help td:first-child {',
    '  font-family: "JetBrains Mono", ui-monospace, monospace;',
    '  font-size: 11.5px; text-align: right; opacity: 0.75; white-space: nowrap;',
    '}',
    '#arcana-help .arcana-hint {',
    '  margin-top: 12px; padding-top: 9px; text-align: center;',
    '  border-top: 1px dashed var(--ink, #0e0e10);',
    '  font-style: italic; font-size: 12px; opacity: 0.55;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ---------- theme ----------
  function theme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    window.dispatchEvent(new CustomEvent('arcana:theme', { detail: { theme: t } }));
  }

  // ---------- gold (the transmutation) ----------
  function goldOn() {
    return document.documentElement.dataset.gold === '1';
  }
  function setGold(on) {
    if (on) document.documentElement.dataset.gold = '1';
    else delete document.documentElement.dataset.gold;
    try { localStorage.setItem('gold', on ? '1' : '0'); } catch (e) {}
    window.dispatchEvent(new CustomEvent('arcana:gold', { detail: { gold: on } }));
    if (on) {
      rainBurst();
      toast('aurum — the stone is transmuted');
    } else {
      toast('plumbum — returned to lead');
    }
  }
  // Restore a previous transmutation quietly on load.
  try {
    if (localStorage.getItem('gold') === '1') {
      document.documentElement.dataset.gold = '1';
    }
  } catch (e) {}

  // ---------- toast ----------
  var toastEl = null;
  var toastTimer = 0;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'arcana-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // restart the transition even if a toast is already showing
    toastEl.classList.remove('show');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2300);
  }

  // ---------- golden rain burst ----------
  function rainBurst() {
    if (reducedMotion) return;
    var LIFE = 3000;
    var FS = 18;
    var canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var cols = [];
    var n = Math.max(1, Math.floor(w / FS));
    for (var i = 0; i < n; i++) {
      cols.push({
        y: -Math.random() * h * 0.8,
        speed: 3 + Math.random() * 4,
        chars: [],
        last: -1e9,
      });
    }

    // darker gold on light paper, bright gold on dark — same split as --link
    var glyphRgb = theme() === 'dark' ? '201,162,74' : '143,110,29';

    var t0 = performance.now();
    function frame(now) {
      var t = now - t0;
      if (t > LIFE) { canvas.remove(); return; }
      // fade in fast, hold, fade out at the end
      var fade = Math.min(t / 250, 1) * Math.min((LIFE - t) / 700, 1);
      ctx.clearRect(0, 0, w, h);
      ctx.font = FS + 'px "Source Serif 4", serif';
      ctx.textBaseline = 'top';
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i];
        c.y += c.speed;
        var head = Math.floor(c.y / FS);
        if (head !== c.last) {
          c.last = head;
          c.chars.push(HEBREW.charAt(Math.floor(Math.random() * HEBREW.length)));
          if (c.chars.length > 10) c.chars.shift();
        }
        for (var k = 0; k < c.chars.length; k++) {
          var a = ((k + 1) / c.chars.length) * 0.8 * fade;
          if (a <= 0) continue;
          ctx.fillStyle = 'rgba(' + glyphRgb + ',' + a.toFixed(3) + ')';
          ctx.fillText(c.chars[k], i * FS, (head - (c.chars.length - 1 - k)) * FS);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- help overlay ----------
  var helpEl = null;
  function buildHelp() {
    helpEl = document.createElement('div');
    helpEl.id = 'arcana-help';
    helpEl.setAttribute('role', 'dialog');
    helpEl.setAttribute('aria-label', 'Keyboard shortcuts');
    var rows = [
      ['t', 'toggle light / dark'],
      ['g h', 'go home'],
      ['g w', 'go to writings'],
      ['/', 'search posts'],
      ['j / k', 'drift down / up'],
      ['m', 'music (on posts)'],
      ['d', 'the dancers (on posts)'],
      ['?', 'this panel'],
      ['esc', 'close'],
    ];
    var html = '<div class="arcana-card"><div class="arcana-title">— arcana —</div><table>';
    for (var i = 0; i < rows.length; i++) {
      html += '<tr><td>' + rows[i][0] + '</td><td>' + rows[i][1] + '</td></tr>';
    }
    html += '</table><div class="arcana-hint">✦ the old words still work ✦</div></div>';
    helpEl.innerHTML = html;
    helpEl.addEventListener('click', function (e) {
      if (e.target === helpEl) closeHelp();
    });
    document.body.appendChild(helpEl);
  }
  function toggleHelp() {
    if (!helpEl) { buildHelp(); return; }
    helpEl.style.display = helpEl.style.display === 'none' ? 'flex' : 'none';
  }
  function closeHelp() {
    if (helpEl) helpEl.style.display = 'none';
  }

  // ---------- search ----------
  function doSearch() {
    var inp = document.getElementById('post-search');
    if (inp) {
      inp.focus();
      if (inp.select) inp.select();
    } else {
      location.href = 'blog.html#search';
    }
  }

  function clickBtn(id) {
    var btn = document.getElementById(id);
    if (btn) btn.click();
  }

  // ---------- secrets ----------
  var buf = '';
  var SECRETS = [
    { word: 'zohar', fire: function () { setGold(!goldOn()); } },
    { word: 'solve', fire: function () {
        if (theme() !== 'dark') { setTheme('dark'); toast('solve — dissolution'); }
      } },
    { word: 'coagula', fire: function () {
        if (theme() !== 'light') { setTheme('light'); toast('coagula — fixation'); }
      } },
  ];
  function checkSecrets() {
    for (var i = 0; i < SECRETS.length; i++) {
      if (buf.slice(-SECRETS[i].word.length) === SECRETS[i].word) {
        buf = '';
        SECRETS[i].fire();
        return;
      }
    }
  }

  // True while the buffer tail (≥2 chars) is partway into a known secret —
  // shortcuts are swallowed then, so secret words may contain any letters.
  function midSecret() {
    for (var i = 0; i < SECRETS.length; i++) {
      var w = SECRETS[i].word;
      var max = Math.min(buf.length, w.length - 1);
      for (var L = max; L >= 2; L--) {
        if (buf.slice(-L) === w.slice(0, L)) return true;
      }
    }
    return false;
  }

  // ---------- keyboard ----------
  var pendingG = 0;
  document.addEventListener('keydown', function (e) {
    var el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
      if (e.key === 'Escape') { pendingG = 0; el.blur(); closeHelp(); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // normalize letters so CapsLock / Shift don't disable shortcuts
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    // feed the secret buffer (letters only)
    if (k.length === 1 && /[a-z]/.test(k)) {
      buf = (buf + k).slice(-12);
      checkSecrets();
      if (midSecret()) { pendingG = 0; return; }
    }

    if (k === 'Escape') { pendingG = 0; closeHelp(); return; }

    // 'g' prefix navigation
    if (pendingG && Date.now() - pendingG < 1400) {
      pendingG = 0;
      if (k === 'h') { location.href = 'index.html'; return; }
      if (k === 'w' || k === 'b') { location.href = 'blog.html'; return; }
      // any other key cancels the prefix and falls through
    } else {
      pendingG = 0;
    }

    switch (k) {
      case 'g': pendingG = Date.now(); break;
      case 't': setTheme(theme() === 'dark' ? 'light' : 'dark'); break;
      case '/': e.preventDefault(); closeHelp(); doSearch(); break;
      case '?': e.preventDefault(); toggleHelp(); break;
      case 'm': clickBtn('music-btn'); break;
      case 'd': clickBtn('gif-btn'); break;
      case 'j': window.scrollBy({ top: 320, behavior: reducedMotion ? 'auto' : 'smooth' }); break;
      case 'k': window.scrollBy({ top: -320, behavior: reducedMotion ? 'auto' : 'smooth' }); break;
    }
  });
})();
