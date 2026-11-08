/* Le Bestiaire de Victor : une carte TCG par semaine jusqu'à la Diagonale des Fous.
   Module indépendant du code de VictorTrail (qui peut être rechargé depuis /victorTrail/) :
   il ajoute une entrée dans « Plus », l'écran #/plus/cartes et un bandeau sur « Aujourd'hui ».
   Les cartes sont dans cartes/cards.json ; ce qui a été dévoilé est gardé dans le navigateur. */
(function () {
  'use strict';
  var KEY = 'vt-tcg-revealed';
  var DATA = null, LOADING = null;
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

  /* ---------- styles ---------- */
  var css = `
.tcg-hd{margin:0 calc(-1 * max(16px,env(safe-area-inset-left))) 18px;padding:16px max(16px,env(safe-area-inset-left)) 16px;background:var(--violet,#7a12ff);color:#fff;border-bottom:3px solid var(--ink,#1a1033)}
.tcg-hd h1{color:#fff;font-size:1.55rem;margin:0;text-shadow:2px 2px 0 var(--ink,#1a1033)}
.tcg-hd p{margin:4px 0 0;font-weight:600;font-size:.82rem;letter-spacing:.1em;text-transform:uppercase}
.tcg-prog{display:flex;align-items:center;gap:10px;margin:0 0 18px}
.tcg-prog .t{flex:1;height:14px;border:3px solid var(--ink,#1a1033);border-radius:999px;background:#fff;overflow:hidden}
.tcg-prog .t i{display:block;height:100%;background:linear-gradient(90deg,#3aa0ff,#ff0a8c,#4dfcc0)}
.tcg-prog b{font-family:var(--d);font-weight:400;font-size:1rem;color:var(--ink,#1a1033);white-space:nowrap}
.tcg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 12px}
@media (min-width:560px){.tcg-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
.tcg-slot{all:unset;display:block;align-self:start;cursor:pointer;-webkit-tap-highlight-color:transparent;position:relative}
.tcg-slot:focus-visible{outline:3px solid var(--pink,#ff0a8c);outline-offset:3px;border-radius:10px}
.tcg-slot[disabled]{cursor:default}
.tcg-cap{display:block;margin-top:6px;font:700 .7rem var(--f);text-align:center;color:var(--muted,#6b5b8a);letter-spacing:.04em;text-transform:uppercase;line-height:1.25}
.tcg-cap b{color:var(--ink,#1a1033)}
.tcg-flip{perspective:900px;aspect-ratio:630/880;width:100%}
.tcg-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.3,1.4,.5,1)}
.tcg-flip.front .tcg-in{transform:rotateY(180deg)}
.tcg-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.tcg-face.f{transform:rotateY(180deg)}
.tcg-new .tcg-flip{animation:tcgPulse 1.6s ease-in-out infinite}
@keyframes tcgPulse{0%,100%{filter:drop-shadow(0 0 0 rgba(255,10,140,0))}50%{filter:drop-shadow(0 0 12px rgba(255,10,140,.9))}}
@keyframes tcgHolo{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes tcgTw{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
/* --- carte : tout est en cqw (100cqw = largeur de la carte) --- */
.tcg-card{container-type:inline-size;width:100%;height:100%}
.tcg-c{position:relative;box-sizing:border-box;width:100%;height:100%;border-radius:5.4cqw;border:1cqw solid #1a1033;padding:2.5cqw;background:linear-gradient(160deg,#ff2fa0 0%,#ff4fb8 35%,#c13cff 70%,#ff2fa0 100%);box-shadow:1.6cqw 1.8cqw 0 #1a1033;overflow:hidden;font-family:var(--f,system-ui)}
.tcg-art{position:relative;width:100%;height:100%;border-radius:3.5cqw;overflow:hidden;border:.65cqw solid #1a1033;background:linear-gradient(160deg,#ffb3dc 0%,#ff5fbf 35%,#b66bff 65%,#5fe0e0 100%)}
.tcg-art img{position:absolute;left:0;top:-3cqw;width:100%;height:auto;display:block}
.tcg-ph{position:absolute;left:6cqw;right:6cqw;top:18cqw;height:56cqw;box-sizing:border-box;border:.65cqw dashed rgba(26,16,51,.5);border-radius:3cqw;background:rgba(255,255,255,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2cqw;text-align:center;color:#1a1033;font:900 4.2cqw var(--d);text-transform:uppercase}
.tcg-ph svg{width:10cqw;height:10cqw}
.tcg-sheen{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.2) 30%,rgba(77,252,192,.18) 38%,rgba(255,10,140,.16) 46%,transparent 56%);background-size:200% 100%;animation:tcgHolo 6s linear infinite}
.tcg-top{position:absolute;left:0;right:0;top:0;padding:3cqw 3.2cqw 5cqw;display:flex;align-items:flex-start;gap:2cqw;background:linear-gradient(180deg,rgba(26,16,51,.6),rgba(26,16,51,0))}
.tcg-badge{flex:none;width:8.6cqw;height:8.6cqw;border-radius:2cqw;background:#ffe14d;border:.5cqw solid #1a1033;display:flex;align-items:center;justify-content:center;font:900 3.6cqw var(--d);color:#ff0a8c}
.tcg-nm{flex:1;min-width:0}
.tcg-nm b{display:block;font:400 6cqw/1 var(--d);color:#fff;text-transform:uppercase;-webkit-text-stroke:.2cqw #1a1033;text-shadow:.5cqw .5cqw 0 #1a1033;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcg-nm span{display:block;margin-top:.6cqw;font:700 2.5cqw var(--f);letter-spacing:.15cqw;color:#fff;text-transform:uppercase;text-shadow:.3cqw .3cqw 0 #1a1033;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tcg-pv{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:.8cqw}
.tcg-pv b{padding:.6cqw 2.2cqw;border-radius:99cqw;background:#1a1033;color:#ff4fb8;font:400 3.4cqw var(--d)}
.tcg-pv span{font:700 2.2cqw var(--f);color:#fff;text-shadow:.3cqw .3cqw 0 #1a1033}
.tcg-goal{position:absolute;left:2.4cqw;bottom:calc(29% + 1.6cqw);display:flex;align-items:center;gap:1.2cqw;padding:.6cqw 2.6cqw .6cqw .6cqw;border-radius:99cqw;background:rgba(255,10,140,.92);border:.5cqw solid #1a1033;color:#fff;font:500 2.7cqw var(--f)}
.tcg-goal i{width:5.6cqw;height:5.6cqw;border-radius:50%;background:#4dfcc0;border:.5cqw solid #1a1033;display:flex;align-items:center;justify-content:center}
.tcg-goal i svg{width:3.4cqw;height:3.4cqw}
.tcg-goal b{font-weight:800}
.tcg-atk{position:absolute;left:0;right:0;bottom:0;height:29%;box-sizing:border-box;padding:2.4cqw 3.4cqw 2cqw;border-top:.65cqw solid #1a1033;background:#5ff5d6 repeating-linear-gradient(45deg,rgba(26,16,51,.07) 0 1.6cqw,transparent 1.6cqw 3.5cqw);display:flex;flex-direction:column;gap:1cqw}
.tcg-atk .l1{display:flex;align-items:baseline;justify-content:space-between;gap:2cqw}
.tcg-atk .l1 b{font:400 4.4cqw/1 var(--d);color:#ff0a8c;text-transform:uppercase;-webkit-text-stroke:.15cqw #1a1033}
.tcg-atk .l1 span{font:400 5.2cqw/1 var(--d);color:#7a12ff}
.tcg-atk p{margin:0;font:italic 700 2.5cqw/1.32 var(--f);color:#1a1033}
.tcg-atk .l3{margin-top:auto;padding-top:1cqw;border-top:.3cqw dashed rgba(26,16,51,.35);display:flex;justify-content:space-between;align-items:center;gap:2cqw;font:700 2.1cqw var(--f);color:#1a1033;letter-spacing:.1cqw;text-transform:uppercase}
.tcg-atk .l3 em{font-style:italic;text-transform:none;letter-spacing:0;color:#7a12ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* dos */
.tcg-b{position:relative;box-sizing:border-box;width:100%;height:100%;border-radius:5.4cqw;border:1cqw solid #1a1033;padding:2.5cqw;background:linear-gradient(160deg,#4dfcc0,#3aa0ff 40%,#7a12ff 75%,#ff0a8c);box-shadow:1.6cqw 1.8cqw 0 #1a1033;overflow:hidden}
.tcg-b .in{position:relative;width:100%;height:100%;border-radius:3.5cqw;border:.65cqw solid #1a1033;overflow:hidden;background:repeating-conic-gradient(from 0deg at 50% 50%,#4a16b8 0deg 10deg,#3a0f99 10deg 20deg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4cqw}
.tcg-b .in::before{content:'';position:absolute;inset:4cqw;border:.5cqw dashed rgba(255,225,77,.55);border-radius:2.5cqw}
.tcg-b .emb{position:relative;width:46cqw;height:46cqw;border-radius:50%;background:#ffe14d;border:1cqw solid #1a1033;box-shadow:1.4cqw 1.4cqw 0 #ff0a8c;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5cqw}
.tcg-b .emb b{font:400 17cqw/1 var(--d);color:#ff0a8c;-webkit-text-stroke:.5cqw #1a1033;letter-spacing:-.5cqw}
.tcg-b .emb span{font:700 3.2cqw var(--f);color:#1a1033;letter-spacing:.6cqw;text-transform:uppercase}
.tcg-b .ttl{position:relative;font:400 7cqw/1 var(--d);color:#fff;text-transform:uppercase;text-shadow:.6cqw .6cqw 0 #ff0a8c;text-align:center}
.tcg-b .ser{position:relative;font:700 3cqw var(--f);color:#4dfcc0;letter-spacing:.4cqw;text-transform:uppercase;text-align:center;padding:0 6cqw}
.tcg-b .st{position:absolute;width:7cqw;height:7cqw;animation:tcgTw 2.4s ease-in-out infinite}
.tcg-b .lock{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:9cqw;background:rgba(26,16,51,.45)}
.tcg-b .lock span{display:flex;align-items:center;gap:1.5cqw;padding:1.4cqw 3.2cqw;border-radius:99cqw;background:#1a1033;color:#fff;font:700 3.6cqw var(--f);border:.5cqw solid #ffe14d}
.tcg-b .lock svg{width:4.4cqw;height:4.4cqw}
.tcg-b .tap{position:absolute;left:50%;bottom:8cqw;transform:translateX(-50%);padding:1.4cqw 3.4cqw;border-radius:99cqw;background:#ff0a8c;color:#fff;border:.5cqw solid #1a1033;font:700 3.8cqw var(--f);white-space:nowrap;text-transform:uppercase}
@container (max-width:220px){.tcg-atk p,.tcg-atk .l3,.tcg-goal,.tcg-nm span,.tcg-pv span{display:none}.tcg-atk{height:18%}.tcg-nm b{font-size:7.4cqw}.tcg-b .ser,.tcg-b .emb span{display:none}.tcg-b .ttl{font-size:9cqw}.tcg-b .lock span{font-size:6.4cqw}.tcg-b .lock svg{width:6.4cqw;height:6.4cqw}.tcg-b .tap{font-size:6.6cqw;bottom:6cqw}.tcg-ph{font-size:6.4cqw}}
/* visionneuse */
.tcg-view{position:fixed;inset:0;z-index:200;background:rgba(26,16,51,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px;opacity:0;transition:opacity .25s}
.tcg-view.on{opacity:1}
.tcg-view .card{width:min(84vw,420px,calc((100vh - 170px) * 630 / 880))}
.tcg-view .bar2{display:flex;align-items:center;gap:10px}
.tcg-view button{border:3px solid #1a1033;background:#fff;color:#1a1033;border-radius:12px;box-shadow:3px 3px 0 #ff0a8c;font:700 .9rem var(--f);min-width:46px;min-height:46px;padding:0 14px;cursor:pointer}
.tcg-view button[disabled]{opacity:.35;cursor:default}
.tcg-view .x{position:absolute;top:max(14px,env(safe-area-inset-top));right:16px}
.tcg-view .lbl{color:#fff;font:700 .78rem var(--f);letter-spacing:.1em;text-transform:uppercase;text-align:center}
/* bandeau Aujourd'hui */
.tcg-ban{display:flex;align-items:center;gap:14px;margin:0 0 18px;padding:12px 14px;border:3px solid var(--ink,#1a1033);border-radius:14px;box-shadow:var(--sh,4px 4px 0 #1a1033);background:linear-gradient(120deg,#ff0a8c,#7a12ff);color:#fff;text-decoration:none}
.tcg-ban .mini{flex:none;width:46px}
.tcg-ban b{display:block;font-family:var(--d);font-weight:400;font-size:1.05rem;text-shadow:2px 2px 0 #1a1033}
.tcg-ban small{display:block;font:600 .8rem var(--f);opacity:.95}
.tcg-ban .go{margin-left:auto;font:700 1.4rem var(--f)}
@container (max-width:80px){.tcg-b .ttl,.tcg-b .st{display:none}.tcg-b .emb b{-webkit-text-stroke:0;font-size:20cqw}}
@media (prefers-reduced-motion:reduce){.tcg-in{transition:none}.tcg-sheen,.tcg-b .st,.tcg-new .tcg-flip{animation:none}}
`;
  var st = document.createElement('style'); st.id = 'tcg-css'; st.textContent = css; document.head.appendChild(st);

  /* ---------- utilitaires ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) { return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()]; }
  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (LOADING) return LOADING;
    LOADING = fetch('cartes/cards.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { DATA = j; return j; }).catch(function () { LOADING = null; return null; });
    return LOADING;
  }
  function revealed() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function setRevealed(n) { var r = revealed(); if (r.indexOf(n) < 0) { r.push(n); try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} } }
  function slots(D) {
    var out = [], first = pd(D.first), N = D.slots, byN = {};
    D.cards.forEach(function (c) { byN[c.slot] = c; });
    for (var n = 1; n <= N; n++) {
      var d;
      if (n === N) { d = pd(D.finale); d.setHours(8, 0, 0, 0); }
      else { d = new Date(first); d.setDate(first.getDate() + 7 * (n - 1)); d.setHours(D.revealHour || 18, 0, 0, 0); }
      out.push({ n: n, date: d, card: byN[n] || null, open: Date.now() >= d.getTime() });
    }
    return out;
  }
  function state(s, R) { if (!s.open) return 'locked'; if (!s.card) return 'empty'; return R.indexOf(s.n) >= 0 ? 'shown' : 'new'; }

  /* ---------- rendu des cartes ---------- */
  var STAR = '<svg class="st" viewBox="-20 -20 40 40" aria-hidden="true"><path d="M0 -20 C2 -6 6 -2 20 0 C6 2 2 6 0 20 C-2 6 -6 2 -20 0 C-6 -2 -2 -6 0 -20Z" fill="#fff"/></svg>';
  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function back(s, st, N) {
    var h = '<div class="tcg-card"><div class="tcg-b"><div class="in">' +
      STAR.replace('class="st"', 'class="st" style="left:12cqw;top:14cqw"') +
      STAR.replace('class="st"', 'class="st" style="right:12cqw;top:26cqw;animation-delay:.8s"') +
      STAR.replace('class="st"', 'class="st" style="left:18cqw;bottom:20cqw;animation-delay:1.4s"') +
      '<div class="ttl">Victor<br>Trail</div><div class="emb"><b>' + String(s.n).padStart(2, '0') + '</b><span>sur ' + N + '</span></div><div class="ser">Série 01 · Diagonale 2027</div>';
    if (st === 'locked') h += '<div class="lock"><span>' + LOCK + fmt(s.date) + '</span></div>';
    else if (st === 'empty') h += '<div class="lock"><span>En préparation</span></div>';
    else if (st === 'new') h += '<div class="tap">Touche pour dévoiler</div>';
    return h + '</div></div></div>';
  }
  function front(s) {
    var c = s.card || {};
    var art = c.img ? '<img src="cartes/' + esc(c.img) + '" alt="Illustration de la carte ' + esc(c.title) + '" loading="lazy">'
      : '<div class="tcg-ph"><svg viewBox="0 0 24 24" fill="none" stroke="#1a1033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16 15 10 5 20"/></svg>Illustration<br>à venir</div>';
    return '<div class="tcg-card"><div class="tcg-c"><div class="tcg-art">' + art + '<div class="tcg-sheen"></div>' +
      '<div class="tcg-top"><div class="tcg-badge">06</div><div class="tcg-nm"><b>Victor</b><span>' + esc(c.title) + '</span></div><div class="tcg-pv"><b>PV ' + esc(c.pv) + '</b><span>#' + String(s.n).padStart(2, '0') + '-NCE</span></div></div>' +
      '<div class="tcg-goal"><i><svg viewBox="0 0 24 24" fill="none" stroke="#1a1033" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20 10 8l4 6 3-4 4 10Z"/><path d="M10 8V3l4 1.5L10 6"/></svg></i><span>Objectif : <b>' + esc(c.goal) + '</b></span></div>' +
      '<div class="tcg-atk"><div class="l1"><b>' + esc(c.attack) + '</b><span>' + esc(c.dmg) + '</span></div><p>' + esc(c.text) + '</p><div class="l3"><em>' + esc(c.motto) + '</em><span>Série 01 · ★ Holo</span></div></div>' +
      '</div></div></div>';
  }
  function flipHTML(s, st, N, isFront) {
    return '<div class="tcg-flip' + (isFront ? ' front' : '') + '"><div class="tcg-in"><div class="tcg-face">' + back(s, st, N) + '</div><div class="tcg-face f">' + (s.card ? front(s) : '') + '</div></div></div>';
  }

  /* ---------- écran classeur ---------- */
  function drawBinder(el) {
    el.innerHTML = '<div id="tcg"><a class="back" href="#/plus">‹ Plus</a><div class="tcg-hd"><h1>Le Bestiaire</h1><p>Une carte par semaine jusqu\'à la Diagonale</p></div><p class="note">Chargement des cartes…</p></div>';
    load().then(function (D) {
      var root = document.getElementById('tcg'); if (!root) return;
      if (!D) { root.querySelector('.note').textContent = 'Cartes indisponibles (hors ligne).'; return; }
      var S = slots(D), R = revealed(), N = D.slots;
      var shown = S.filter(function (s) { return state(s, R) === 'shown'; }).length;
      var nxt = S.find(function (s) { return !s.open; });
      var h = '<a class="back" href="#/plus">‹ Plus</a><div class="tcg-hd"><h1>Le Bestiaire</h1><p>' + esc(D.serie) + '</p></div>' +
        '<div class="tcg-prog"><div class="t"><i style="width:' + (shown / N * 100).toFixed(1) + '%"></i></div><b>' + shown + ' / ' + N + '</b></div>' +
        '<p class="note" style="margin:-8px 0 16px">' + (nxt ? 'Prochaine carte le ' + fmt(nxt.date) + ' à ' + nxt.date.getHours() + ' h. ' : 'Toutes les cartes sont sorties. ') + 'La dernière se dévoile le jour de la Diagonale.</p><div class="tcg-grid">';
      S.forEach(function (s) {
        var st = state(s, R);
        var cap = st === 'shown' ? '<b>' + esc(s.card.title) + '</b>' : st === 'new' ? '<b style="color:var(--pink)">À dévoiler !</b>' : st === 'empty' ? 'Carte ' + s.n : (s.n === N ? 'Jour J · ' : '') + fmt(s.date);
        var lbl = st === 'shown' ? 'Carte ' + s.n + ' : ' + s.card.title : st === 'new' ? 'Carte ' + s.n + ', touche pour la dévoiler' : 'Carte ' + s.n + ', se dévoile le ' + fmt(s.date);
        h += '<button class="tcg-slot' + (st === 'new' ? ' tcg-new' : '') + '" data-n="' + s.n + '" aria-label="' + esc(lbl) + '"' + (st === 'locked' || st === 'empty' ? ' disabled' : '') + '>' + flipHTML(s, st, N, st === 'shown') + '<span class="tcg-cap">' + cap + '</span></button>';
      });
      root.innerHTML = h + '</div>';
      root.querySelectorAll('.tcg-slot:not([disabled])').forEach(function (b) {
        b.onclick = function () {
          var n = +b.dataset.n, s = S[n - 1];
          if (state(s, revealed()) === 'new') {
            setRevealed(n);
            b.classList.remove('tcg-new');
            b.querySelector('.tcg-flip').classList.add('front');
            b.querySelector('.tcg-cap').innerHTML = '<b>' + esc(s.card.title) + '</b>';
            b.setAttribute('aria-label', 'Carte ' + n + ' : ' + s.card.title);
            var p = root.querySelector('.tcg-prog'); var sh = revealed().filter(function (x) { return S[x - 1] && S[x - 1].open && S[x - 1].card; }).length;
            p.querySelector('i').style.width = (sh / N * 100).toFixed(1) + '%'; p.querySelector('b').textContent = sh + ' / ' + N;
            setTimeout(function () { openView(S, n, b); }, 900);
          } else openView(S, n, b);
        };
      });
    });
  }

  /* ---------- visionneuse plein écran ---------- */
  function openView(S, n, trigger) {
    var R = revealed();
    var list = S.filter(function (s) { return state(s, R) === 'shown'; }).map(function (s) { return s.n; });
    var i = list.indexOf(n); if (i < 0) return;
    var v = document.createElement('div'); v.className = 'tcg-view'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Carte');
    function draw() {
      var s = S[list[i] - 1];
      v.innerHTML = '<button class="x" aria-label="Fermer">✕</button><div class="card">' + flipHTML(s, 'shown', S.length, true) + '</div>' +
        '<div class="lbl">Carte ' + s.n + ' / ' + S.length + ' · sortie le ' + fmt(s.date) + '<br>Touche la carte pour la retourner</div>' +
        '<div class="bar2"><button data-p aria-label="Carte précédente"' + (i ? '' : ' disabled') + '>‹</button><button data-n aria-label="Carte suivante"' + (i < list.length - 1 ? '' : ' disabled') + '>›</button></div>';
      v.querySelector('.x').onclick = close;
      v.querySelector('.card').onclick = function () { v.querySelector('.tcg-flip').classList.toggle('front'); };
      v.querySelector('[data-p]').onclick = function () { if (i) { i--; draw(); } };
      v.querySelector('[data-n]').onclick = function () { if (i < list.length - 1) { i++; draw(); } };
      v.querySelector('.x').focus();
    }
    function key(e) { if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft' && i) { i--; draw(); } if (e.key === 'ArrowRight' && i < list.length - 1) { i++; draw(); } }
    function close() { document.removeEventListener('keydown', key); window.removeEventListener('hashchange', close); v.classList.remove('on'); setTimeout(function () { v.remove(); }, 250); if (trigger && trigger.isConnected) trigger.focus(); }
    v.onclick = function (e) { if (e.target === v) close(); };
    document.addEventListener('keydown', key);
    window.addEventListener('hashchange', close);
    document.body.appendChild(v); draw();
    requestAnimationFrame(function () { v.classList.add('on'); });
  }

  /* ---------- branchements sur l'appli ---------- */
  function isBinder() { return /^#\/plus\/cartes/.test(location.hash || ''); }
  function patchPlus() {
    var el = document.getElementById('s-plus'); if (!el) return;
    if (isBinder()) { if (!document.getElementById('tcg')) drawBinder(el); return; }
    var menu = el.querySelector('nav.menu');
    if (menu && !menu.querySelector('[href="#/plus/cartes"]')) {
      var a = document.createElement('a'); a.href = '#/plus/cartes';
      a.innerHTML = '<div><span>Le Bestiaire</span><small>Ma carte TCG de la semaine, jusqu\'à la Diagonale</small></div>';
      menu.insertBefore(a, menu.firstChild);
    }
  }
  function patchToday() {
    var el = document.getElementById('s-aujourdhui'); if (!el || !el.firstChild || el.querySelector('.tcg-ban')) return;
    load().then(function (D) {
      if (!D || el.querySelector('.tcg-ban')) return;
      var S = slots(D), R = revealed();
      var s = S.filter(function (x) { return state(x, R) === 'new'; }).pop(); if (!s) return;
      var a = document.createElement('a'); a.className = 'tcg-ban'; a.href = '#/plus/cartes';
      a.innerHTML = '<div class="mini">' + flipHTML(s, 'new', D.slots, false).replace('<div class="tap">Touche pour dévoiler</div>', '') + '</div><div><b>Nouvelle carte !</b><small>La carte ' + s.n + ' du Bestiaire t\'attend</small></div><span class="go" aria-hidden="true">›</span>';
      var hd = el.querySelector(':scope > .hd');
      if (hd) hd.after(a); else el.insertBefore(a, el.firstChild);
    });
  }
  function watch(id, fn) {
    var el = document.getElementById(id); if (!el) return;
    new MutationObserver(function () { fn(); }).observe(el, { childList: true });
    fn();
  }
  function init() {
    watch('s-plus', patchPlus);
    watch('s-aujourdhui', patchToday);
    window.addEventListener('hashchange', function () { setTimeout(patchPlus, 0); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
