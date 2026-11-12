/* Parcours conseillés : pour chaque séance de course, propose un itinéraire autour de chez moi (Nice), autour du bureau
   (Monaco) ou depuis une gare de la ligne Monaco → Nice (descendre du train après le travail et rentrer en courant),
   qui colle à la distance et au D+ prévus : carte, profil, « Y aller » et export GPX (à importer dans l'appli Coros).
   Les itinéraires sont tracés sur les vrais sentiers par BRouter (OpenStreetMap, profil randonnée montagne) puis gardés
   dans le téléphone. En secours : mes anciennes sorties Coros (parcours.enc.json, chiffré).
   Module indépendant du code de VictorTrail (qui peut être rechargé depuis /victorTrail/) : il se greffe sur la fiche séance. */
(function () {
  'use strict';

  /* ---------- lieux ---------- */
  var P = {
    NV: [43.7046, 7.2617, 20, 'gare de Nice-Ville'], NEG: [43.6948, 7.2580, 5, 'Promenade (Negresco)'], AERO: [43.6672, 7.2150, 3, 'bout de la Promenade (aéroport)'],
    PORT: [43.6972, 7.2853, 3, 'port de Nice'], CHAT: [43.6953, 7.2806, 90, 'colline du Château'], ALBAN: [43.7016, 7.2995, 220, 'fort du Mont Alban'],
    COCO: [43.6893, 7.2960, 10, 'Coco Beach'], CIMIEZ: [43.7196, 7.2765, 100, 'Cimiez'], VINAIG: [43.7175, 7.3070, 350, 'Mont Vinaigrier'],
    COLV: [43.7166, 7.3087, 340, 'col de Villefranche'], LEUZE: [43.7221, 7.3223, 550, 'Mont Leuze'], REVERE: [43.7374, 7.3688, 690, 'fort de la Revère'],
    CHAUVE: [43.7707, 7.2545, 850, 'fort du Mont Chauve d\'Aspremont'], EZEV: [43.7286, 7.3620, 390, 'village d\'Èze'],
    VILLST: [43.7042, 7.3120, 10, 'gare de Villefranche-sur-Mer'], BEAUST: [43.7076, 7.3330, 10, 'gare de Beaulieu-sur-Mer'],
    EZEST: [43.7227, 7.3572, 20, 'gare d\'Èze-sur-Mer'], CAPDST: [43.7206, 7.3947, 40, 'gare de Cap-d\'Ail'],
    HOSP: [43.6925, 7.3440, 10, 'pointe Saint-Hospice'], PHARE: [43.6800, 7.3300, 20, 'phare du Cap Ferrat'], PASS: [43.6965, 7.3265, 5, 'plage de Passable'],
    MON: [43.7307, 7.4170, 40, 'Monaco'], TETE: [43.7315, 7.4018, 550, 'Tête de Chien'], TURBIE: [43.7450, 7.4005, 480, 'La Turbie'],
    MGROS: [43.7657, 7.4425, 684, 'Mont Gros de Roquebrune'], MALA: [43.7228, 7.4065, 5, 'plage Mala'], LARV: [43.7448, 7.4345, 3, 'Larvotto'],
    CMART: [43.7545, 7.4860, 10, 'Cap Martin'], ROCH: [43.7316, 7.4202, 60, 'Rocher de Monaco'], HERC: [43.7350, 7.4225, 3, 'port Hercule']
  };
  /* t : boucle | ar (aller-retour, raccourcissable) | aller (aller simple, retour en train ou fin à la maison) ; nuit : sentier peu éclairé */
  var IDEES = [
    { id: 'n-chateau', ctx: 'nice', t: 'boucle', nm: 'Colline du Château et port', w: ['NV', 'CHAT', 'PORT', 'NV'] },
    { id: 'n-alban', ctx: 'nice', t: 'ar', nm: 'Fort du Mont Alban', w: ['NV', 'PORT', 'ALBAN'], nuit: 1 },
    { id: 'n-vinaig', ctx: 'nice', t: 'boucle', nm: 'Boucle Vinaigrier et Mont Alban', w: ['NV', 'VINAIG', 'COLV', 'ALBAN', 'PORT', 'NV'], nuit: 1 },
    { id: 'n-leuze', ctx: 'nice', t: 'ar', nm: 'Mont Leuze par le Vinaigrier', w: ['NV', 'VINAIG', 'LEUZE'], nuit: 1 },
    { id: 'n-revere', ctx: 'nice', t: 'ar', nm: 'Fort de la Revère par les crêtes', w: ['NV', 'VINAIG', 'LEUZE', 'REVERE'], nuit: 1 },
    { id: 'n-chauve', ctx: 'nice', t: 'ar', nm: 'Mont Chauve d\'Aspremont', w: ['NV', 'CIMIEZ', 'CHAUVE'], nuit: 1 },
    { id: 'n-prom', ctx: 'nice', t: 'ar', nm: 'Promenade des Anglais', w: ['NV', 'NEG', 'AERO'] },
    { id: 'n-litt', ctx: 'nice', t: 'ar', nm: 'Sentier du littoral vers Villefranche', w: ['NV', 'PORT', 'COCO', 'VILLST'] },
    { id: 'n-eze', ctx: 'nice', t: 'aller', nm: 'Nice → Èze par les crêtes', w: ['NV', 'VINAIG', 'LEUZE', 'EZEV', 'EZEST'], nuit: 1, fin: 'retour en train depuis la gare d\'Èze-sur-Mer' },
    { id: 'm-tete', ctx: 'monaco', t: 'ar', nm: 'Tête de Chien', w: ['MON', 'TETE'], nuit: 1 },
    { id: 'm-turbie', ctx: 'monaco', t: 'boucle', nm: 'La Turbie par la Tête de Chien', w: ['MON', 'TETE', 'TURBIE', 'MON'], nuit: 1 },
    { id: 'm-revere', ctx: 'monaco', t: 'ar', nm: 'Fort de la Revère par La Turbie', w: ['MON', 'TURBIE', 'REVERE'], nuit: 1 },
    { id: 'm-mgros', ctx: 'monaco', t: 'ar', nm: 'Mont Gros de Roquebrune', w: ['MON', 'MGROS'], nuit: 1 },
    { id: 'm-capdail', ctx: 'monaco', t: 'ar', nm: 'Sentier du littoral de Cap-d\'Ail', w: ['MON', 'MALA'] },
    { id: 'm-cmart', ctx: 'monaco', t: 'ar', nm: 'Bord de mer jusqu\'au Cap Martin', w: ['MON', 'LARV', 'CMART'] },
    { id: 'm-rocher', ctx: 'monaco', t: 'boucle', nm: 'Rocher et port Hercule', w: ['MON', 'ROCH', 'HERC', 'MON'] },
    { id: 'g-vill', ctx: 'gare', t: 'aller', nm: 'Villefranche → maison par le Mont Alban', w: ['VILLST', 'COLV', 'ALBAN', 'PORT', 'NV'], nuit: 1 },
    { id: 'g-beau', ctx: 'gare', t: 'aller', nm: 'Beaulieu → maison par le Mont Leuze', w: ['BEAUST', 'LEUZE', 'VINAIG', 'NV'], nuit: 1 },
    { id: 'g-eze', ctx: 'gare', t: 'aller', nm: 'Èze → maison par Nietzsche et les crêtes', w: ['EZEST', 'EZEV', 'LEUZE', 'VINAIG', 'NV'], nuit: 1 },
    { id: 'g-capd', ctx: 'gare', t: 'aller', nm: 'Cap-d\'Ail → maison par la Grande Corniche', w: ['CAPDST', 'TURBIE', 'REVERE', 'LEUZE', 'VINAIG', 'NV'], nuit: 1 },
    { id: 'g-nietz', ctx: 'gare', t: 'ar', nm: 'Sentier Nietzsche (Èze-sur-Mer)', w: ['EZEST', 'EZEV'], nuit: 1 },
    { id: 'g-ezerev', ctx: 'gare', t: 'ar', nm: 'Èze-sur-Mer → fort de la Revère', w: ['EZEST', 'EZEV', 'REVERE'], nuit: 1 },
    { id: 'g-ferrat', ctx: 'gare', t: 'boucle', nm: 'Tour du Cap Ferrat depuis Beaulieu', w: ['BEAUST', 'HOSP', 'PHARE', 'PASS', 'BEAUST'] },
    { id: 'g-mer', ctx: 'gare', t: 'aller', nm: 'Beaulieu → maison par le bord de mer', w: ['BEAUST', 'VILLST', 'COCO', 'PORT', 'NV'] }
  ];
  var CTX = { nice: 'Maison', monaco: 'Bureau', gare: 'Gare', mes: 'Mes sorties' };
  var CK = 'vt-pc1-', KEYW = /tapis|piste|v[ée]lo|rameur|elliptique/i;
  var ROUTE = {}, QUEUE = [], BUSY = false, FAIL = {}, MINE = null, MINEP = null, CUR = null, MAP = null, CTXSEL = {};

  var css = `
.pc{margin-top:18px;border:3px solid var(--ink);border-radius:14px;background:var(--paper);box-shadow:var(--sh,3px 3px 0 var(--ink));overflow:hidden}
.pc-h{padding:10px 14px;background:var(--yellow,#ffe14d);border-bottom:3px solid var(--ink);color:var(--ink)}
.pc-h b{display:block;font:400 .95rem var(--d,var(--f));letter-spacing:.02em;text-transform:uppercase}
.pc-area{display:flex;gap:4px;margin-top:8px;flex-wrap:wrap}
.pc-area button{border:2px solid var(--ink);background:var(--paper);border-radius:99px;padding:4px 10px;font:700 .76rem var(--f);cursor:pointer;color:var(--ink)}
.pc-area button[aria-pressed=true]{background:var(--ink);color:#fff}
.pc-b{padding:12px 14px 14px}
.pc-b h3{font:800 1.05rem/1.25 var(--f);margin:0}
.pc-how{font-size:.86rem;color:var(--ink2);margin-top:4px}
.pc-fit{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px}
.pc-fit div{display:flex;flex-direction:column}
.pc-fit b{font:800 1.2rem/1.1 var(--f);font-variant-numeric:tabular-nums}
.pc-fit span{font-size:.72rem;color:var(--muted)}
.pc-fit .ok{color:var(--good)}.pc-fit .meh{color:var(--z4)}
.pc svg.pc-pr{display:block;width:100%;height:auto;margin-top:10px}
.pc svg.pc-pr text{font:600 9px var(--f);fill:var(--muted)}
.pc-act{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.pc-act .btn{margin-top:0;min-height:44px;font-size:.86rem}
.pc-map{height:260px;border:2px solid var(--ink);border-radius:12px;margin-top:10px;overflow:hidden}
.pc-alt{display:flex;gap:6px;overflow-x:auto;margin-top:10px;scrollbar-width:none}
.pc-alt::-webkit-scrollbar{display:none}
.pc-alt button{flex:0 0 auto;border:2px solid var(--ink);background:var(--paper);border-radius:10px;padding:6px 10px;font:600 .76rem var(--f);cursor:pointer;color:var(--ink);text-align:left;max-width:220px}
.pc-alt button[aria-pressed=true]{background:var(--mint,#4dfcc0)}
.pc-alt button small{display:block;color:var(--muted);font-weight:500}
.pc-wait{font-size:.8rem;color:var(--muted);margin-top:8px}
.pc .note{margin-top:8px}
`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function kmf(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }
  function fr(n) { return Math.round(n).toLocaleString('fr-FR'); }
  function pd(s) { var a = s.split('-').map(Number); return Date.UTC(a[0], a[1] - 1, a[2]); }
  function dfr(s) { var M = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']; var d = new Date(pd(s)); return d.getUTCDate() + ' ' + M[d.getUTCMonth()]; }
  function hav(a, b) { var R = 6371000, r = Math.PI / 180, x = Math.sin((b[0] - a[0]) * r / 2), y = Math.sin((b[1] - a[1]) * r / 2); return 2 * R * Math.asin(Math.sqrt(x * x + Math.cos(a[0] * r) * Math.cos(b[0] * r) * y * y)); }
  function plan() { try { return (window.VT_D && window.VT_D.plan) || []; } catch (e) { return []; } }

  /* ---------- tracés : BRouter (sentiers OSM) puis cache local ---------- */
  function cached(id) { if (ROUTE[id]) return ROUTE[id]; try { var j = localStorage.getItem(CK + id); if (j) return ROUTE[id] = JSON.parse(j); } catch (e) { } return null; }
  function build(coords) {
    var raw = coords.map(function (c) { return [c[1], c[0], c[2]]; }), last = 0;
    raw.forEach(function (p) { if (p[2] == null || isNaN(p[2])) p[2] = last; else last = p[2]; });
    var out = [], acc = 0, nxt = 0;
    for (var i = 0; i < raw.length; i++) {
      if (i) acc += hav(raw[i - 1], raw[i]);
      if (acc >= nxt || i === raw.length - 1) { out.push([+raw[i][0].toFixed(5), +raw[i][1].toFixed(5), acc / 1000, raw[i][2]]); nxt = acc + 25; }
    }
    var n = out.length, E = out.map(function (q) { return q[3]; });
    var up = 0, dn = 0, ref = null;
    out.forEach(function (q, k) {
      var a = Math.max(0, k - 3), b = Math.min(n, k + 4), s = 0; for (var j = a; j < b; j++) s += E[j]; var e = s / (b - a);
      if (ref == null) ref = e; else if (e - ref > 3) { up += e - ref; ref = e; } else if (ref - e > 3) { dn += ref - e; ref = e; }
      q[2] = +q[2].toFixed(3); q[3] = Math.round(e); q.push(Math.round(up), Math.round(dn));
    });
    return out;
  }
  function fetchRoute(T) {
    var url = 'https://brouter.de/brouter?lonlats=' + T.w.map(function (k) { return P[k][1] + ',' + P[k][0]; }).join('|') + '&profile=hiking-mountain&alternativeidx=0&format=geojson';
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }).then(function (j) {
      var pts = build(j.features[0].geometry.coordinates);
      if (pts.length < 2) throw new Error('vide');
      var R = { pts: pts }; ROUTE[T.id] = R;
      try { localStorage.setItem(CK + T.id, JSON.stringify(R)); } catch (e) { }
      return R;
    });
  }
  function enqueue(ctx) { IDEES.forEach(function (T) { if (T.ctx === ctx && !cached(T.id) && !FAIL[T.id] && QUEUE.indexOf(T) < 0) QUEUE.push(T); }); pump(); }
  function pump() {
    if (BUSY || !QUEUE.length) return; BUSY = true; var T = QUEUE.shift();
    fetchRoute(T).catch(function () { FAIL[T.id] = 1; }).then(function () { BUSY = false; refresh(); setTimeout(pump, 250); });
  }
  var rT = null;
  function refresh() { clearTimeout(rT); rT = setTimeout(function () { var b = document.querySelector('#shB .pc'); if (b && CUR) render(b, CUR.s, CUR.date); }, 150); }
  function loadMine() {
    if (MINE) return Promise.resolve(MINE);
    if (!MINEP) MINEP = (window.VT_OWNER && window.VT_dec ? fetch('parcours.enc.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (x) { return x ? window.VT_dec(x, 'o') : null; }) : Promise.resolve(null)).then(function (j) { MINE = j; return j; }).catch(function () { MINEP = null; return null; });
    return MINEP;
  }

  /* ---------- estimation (avant calcul) et propositions ---------- */
  function estimate(T) {
    var km = 0, up = 0, dn = 0;
    for (var i = 1; i < T.w.length; i++) { var a = P[T.w[i - 1]], b = P[T.w[i]]; km += hav(a, b) / 1000 * 1.35; var d = b[2] - a[2]; if (d > 0) up += d; else dn -= d; }
    return { km: km, up: up, dn: dn };
  }
  function idxAt(p, k) { for (var i = 0; i < p.length; i++) if (p[i][2] >= k) return i; return p.length - 1; }
  function options(T, K) {
    var R = cached(T.id), o = [], base = { T: T, nm: T.nm };
    if (!R) {
      var e = estimate(T);
      if (T.t === 'ar') { var f = Math.min(1, K / 2 / e.km); o.push(Object.assign({}, base, { t: 'ar', km: 2 * e.km * f, dp: (e.up + e.dn) * f, est: 1 })); }
      else o.push(Object.assign({}, base, { t: T.t, km: e.km, dp: e.up, est: 1 }));
      return o;
    }
    var p = R.pts, L = p[p.length - 1][2], n = p.length - 1, up = p[n][4];
    if (T.t !== 'ar') o.push(Object.assign({}, base, { t: T.t, km: L, dp: up, path: p.slice() }));
    if (T.t === 'ar' || T.t === 'boucle') {
      var half = Math.min(K / 2, L);
      if (half >= 1) {
        var i = half >= L ? n : idxAt(p, half), a = p.slice(0, i + 1);
        var rep = i === n && T.t === 'ar' ? Math.max(1, Math.round(K / (2 * L))) : 1;
        o.push(Object.assign({}, base, { t: 'ar', km: 2 * p[i][2] * rep, dp: (p[i][4] + p[i][5]) * rep, rep: rep, turn: i < n || T.t === 'ar' ? p[i] : null, full: i === n, path: a.concat(a.slice(0, -1).reverse()) }));
      }
    }
    return o;
  }
  function optionsMine(r, K) {
    var p = r.pts, L = r.km, n = p.length - 1, o = [], base = { nm: r.name.replace(/^(Nice|Monaco) · /, ''), mine: r };
    o.push(Object.assign({}, base, { t: r.loop ? 'boucle' : 'aller', km: L, dp: p[n][4], path: p.slice() }));
    if (K / 2 >= 1 && K / 2 < L - 0.3) { var i = idxAt(p, K / 2), a = p.slice(0, i + 1); o.push(Object.assign({}, base, { t: 'ar', km: 2 * p[i][2], dp: p[i][4] + p[i][5], turn: p[i], path: a.concat(a.slice(0, -1).reverse()) })); }
    return o;
  }
  function pick(ctx, K, Dp) {
    var all = [];
    if (ctx === 'mes') (MINE ? MINE.routes : []).forEach(function (r) { all = all.concat(optionsMine(r, K)); });
    else IDEES.forEach(function (T) { if (T.ctx === ctx && !FAIL[T.id]) all = all.concat(options(T, K)); });
    all.forEach(function (x) { x.s = Math.abs(x.km - K) / Math.max(K, 3) + 1.2 * Math.abs(x.dp - Dp) / Math.max(Dp, 200) + (x.t === 'aller' && ctx !== 'gare' ? 0.12 : 0) + (x.est ? 0.05 : 0); });
    all.sort(function (a, b) { return a.s - b.s; });
    var out = [], seen = {};
    all.forEach(function (x) { var k = x.nm + '|' + x.t; if (out.length < 5 && !seen[k]) { seen[k] = 1; out.push(x); } });
    return out;
  }
  function de(s) { return /^gare/.test(s) ? 'de la ' + s : 'de ' + s; }
  function how(x) {
    if (x.mine) return x.t === 'boucle' ? 'Boucle complète, comme ma sortie du ' + dfr(x.mine.date) + '.' : x.t === 'aller' ? 'Aller simple, retour en train ou en bus.' : 'Aller-retour : demi-tour au km ' + kmf(x.km / 2) + ', puis même chemin au retour.';
    var T = x.T, w0 = P[T.w[0]][3], wN = P[T.w[T.w.length - 1]][3];
    if (x.t === 'boucle') return 'Boucle au départ ' + de(w0) + ', par ' + T.w.slice(1, -1).map(function (k) { return P[k][3]; }).join(', ') + '.';
    if (x.t === 'aller') return 'Départ ' + de(w0) + ', arrivée ' + (T.w[T.w.length - 1] === 'NV' ? 'à la gare de Nice-Ville, à 5 min de chez toi' : (/^gare/.test(wN) ? 'à la ' : 'à ') + wN) + (T.fin ? ' (' + T.fin + ')' : '') + '.';
    if (x.est) return 'Aller-retour au départ ' + de(w0) + ' vers ' + wN + '.';
    return x.full ? 'Aller-retour complet : ' + w0 + ' → ' + wN + ' et retour par le même chemin' + (x.rep > 1 ? ', à enchaîner ' + x.rep + ' fois (les chiffres comptent les ' + x.rep + ' allers-retours).' : '.') : 'Aller-retour au départ ' + de(w0) + ' vers ' + wN + ' : demi-tour au km ' + kmf(x.km / 2) + ' (' + x.turn[3] + ' m d\'altitude).';
  }

  /* ---------- rendu ---------- */
  function profile(x) {
    var p = x.path, w = 320, h = 70, pad = 4, d = 0, D = [0];
    for (var i = 1; i < p.length; i++) { d += Math.abs(p[i][2] - p[i - 1][2]); D.push(d); }
    var E = p.map(function (q) { return q[3]; }), lo = Math.min.apply(null, E), hi = Math.max.apply(null, E), rg = Math.max(80, hi - lo);
    var X = function (v) { return pad + v / Math.max(d, .01) * (w - 2 * pad); }, Y = function (v) { return pad + (1 - (v - lo) / rg) * (h - 2 * pad - 10); };
    var step = Math.max(1, Math.floor(p.length / 160)), ln = '';
    for (var k = 0; k < p.length; k += step) ln += (k ? 'L' : 'M') + X(D[k]).toFixed(1) + ' ' + Y(E[k]).toFixed(1);
    ln += 'L' + X(d).toFixed(1) + ' ' + Y(E[E.length - 1]).toFixed(1);
    return '<svg class="pc-pr" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Profil du parcours, de ' + Math.round(lo) + ' à ' + Math.round(hi) + ' m"><path d="' + ln + 'L' + X(d) + ' ' + (h - 10) + 'L' + pad + ' ' + (h - 10) + 'Z" fill="var(--lilac,#d9c2ff)"/><path d="' + ln + '" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="' + pad + '" y="' + (h - 1) + '">' + Math.round(lo) + ' m</text><text x="' + (w - pad) + '" y="' + (h - 1) + '" text-anchor="end">' + kmf(d) + ' km · point haut ' + Math.round(hi) + ' m</text></svg>';
  }
  function defCtx(s, date) {
    var dow = (new Date(pd(date)).getUTCDay() + 6) % 7, bureau = dow === 2 || dow === 3;
    return bureau ? (s.sl === 'm' ? 'monaco' : 'gare') : 'nice';
  }
  function render(box, s, date) {
    var K = s.km || Math.round(s.m / 6), Dp = s.dp || 0, key = date + '|' + s.t;
    var ctx = CTXSEL[key] || defCtx(s, date);
    if (ctx === 'mes' && !MINE) { loadMine().then(refresh); }
    if (ctx !== 'mes') enqueue(ctx);
    var L = pick(ctx, K, Dp), j = CUR && CUR.key === key && CUR.ctx === ctx ? Math.min(CUR.j, L.length - 1) : 0, x = L[j];
    CUR = { key: key, ctx: ctx, j: j, x: x, s: s, date: date };
    var h = '<div class="pc-h"><b>Parcours conseillé</b><div class="pc-area" role="group" aria-label="Point de départ">' +
      ['nice', 'monaco', 'gare', 'mes'].map(function (a) { return '<button data-pca="' + a + '" aria-pressed="' + (a === ctx) + '">' + CTX[a] + '</button>'; }).join('') + '</div></div><div class="pc-b">';
    if (!x) { box.innerHTML = h + '<p class="note" style="margin:0">' + (ctx === 'mes' && !MINE ? 'Chargement de mes sorties…' : 'Pas d\'itinéraire disponible (hors ligne ?).') + '</p></div>'; return; }
    var pend = QUEUE.length + (BUSY ? 1 : 0);
    var okK = Math.abs(x.km - K) <= Math.max(1.5, K * .12), okD = Math.abs(x.dp - Dp) <= Math.max(80, Dp * .2);
    h += '<h3>' + esc(x.nm) + '</h3><div class="pc-how">' + esc(how(x)) + '</div>' +
      '<div class="pc-fit"><div><b class="' + (okK ? 'ok' : 'meh') + '">' + (x.est ? '≈ ' : '') + kmf(x.km) + '</b><span>km · prévu ' + kmf(K) + '</span></div><div><b class="' + (okD ? 'ok' : 'meh') + '">' + (x.est ? '≈ ' : '') + fr(x.dp) + '</b><span>m D+ · prévu ' + fr(Dp) + '</span></div></div>';
    if (x.path) {
      var st0 = x.path[0], train = ctx === 'gare';
      h += profile(x) + '<div class="pc-act"><button class="btn ghost" data-pcmap>Carte</button><a class="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&travelmode=' + (train ? 'transit' : 'walking') + '&destination=' + st0[0] + ',' + st0[1] + '">Y aller</a><button class="btn" data-pcgpx>GPX</button></div><div id="pcm"></div>';
    } else h += '<p class="pc-wait">' + (FAIL[x.T.id] ? 'Itinéraire indisponible.' : 'Tracé en cours sur les sentiers… (' + pend + ' restant' + (pend > 1 ? 's' : '') + ')') + '</p>';
    if (L.length > 1) h += '<div class="pc-alt" aria-label="Autres parcours">' + L.map(function (y, k) { return '<button data-pcalt="' + k + '" aria-pressed="' + (k === j) + '">' + esc(y.nm) + '<small>' + (y.est ? '≈ ' : '') + kmf(y.km) + ' km · ' + fr(y.dp) + ' m D+' + (y.t === 'ar' ? ' · A/R' + (y.rep > 1 ? ' ×' + y.rep : '') : y.t === 'aller' ? ' · aller' : ' · boucle') + '</small></button>'; }).join('') + '</div>';
    if (x.path && (!okK || !okD)) h += '<p class="note">Rien ne colle pile : ' + (!okD && x.dp < Dp ? 'ajoute une ou deux côtes en route pour compléter le D+.' : !okD ? 'reste en aisance dans les montées, il y a plus de D+ que prévu.' : x.km < K ? 'rallonge un peu (tour du port, Promenade) pour la distance.' : 'raccourcis le retour pour rester sur la durée prévue.') + '</p>';
    if (s.sl === 'e' && x.T && x.T.nuit) h += '<p class="note">Sortie du soir sur sentier : frontale obligatoire en cette saison, et préviens quelqu\'un de ton parcours.</p>';
    if (ctx === 'gare') h += '<p class="note">Descends du train à la gare de départ en rentrant du bureau : le parcours te ramène chez toi.</p>';
    h += '<p class="note">Itinéraires tracés sur les sentiers OpenStreetMap (BRouter) : jette un œil à la carte avant de partir. Le GPX s\'importe dans l\'appli Coros (Profil → Parcours → Importer).</p></div>';
    box.innerHTML = h;
  }

  function gpx(x) {
    var nm = x.nm + ' · ' + kmf(x.km) + ' km ' + fr(x.dp) + ' m D+';
    var t = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="VictorTrail OS" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>' + esc(nm) + '</name></metadata><trk><name>' + esc(nm) + '</name><trkseg>' +
      x.path.map(function (p) { return '<trkpt lat="' + p[0] + '" lon="' + p[1] + '"><ele>' + p[3] + '</ele></trkpt>'; }).join('') + '</trkseg></trk></gpx>';
    var b = new Blob([t], { type: 'application/gpx+xml' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = (CUR.date + ' ' + x.nm + ' ' + kmf(x.km) + 'km').replace(/[^\w\-àâçéèêëîïôûùüÿ ]+/gi, '').replace(/\s+/g, '_') + '.gpx';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }
  function leaflet() {
    if (window.L) return Promise.resolve();
    if (typeof window.loadLeaflet === 'function') return window.loadLeaflet();
    return new Promise(function (res, rej) {
      var c = document.createElement('link'); c.rel = 'stylesheet'; c.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(c);
      var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function map(x) {
    var hold = document.getElementById('pcm'); if (!hold) return;
    if (hold.firstChild) { hold.innerHTML = ''; return; }
    hold.innerHTML = '<div class="pc-map" id="pcmap"></div>';
    leaflet().then(function () {
      if (!document.getElementById('pcmap')) return;
      if (MAP) { try { MAP.remove(); } catch (e) { } }
      MAP = L.map('pcmap', { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 16, subdomains: 'abc', attribution: '© OpenStreetMap, SRTM · OpenTopoMap · itinéraire BRouter' }).addTo(MAP);
      var ln = L.polyline(x.path.map(function (p) { return [p[0], p[1]]; }), { color: '#ff0a8c', weight: 4 }).addTo(MAP);
      L.circleMarker([x.path[0][0], x.path[0][1]], { radius: 8, color: '#1a1033', weight: 2, fillColor: '#4dfcc0', fillOpacity: 1 }).addTo(MAP).bindTooltip('Départ');
      if (x.turn) L.circleMarker([x.turn[0], x.turn[1]], { radius: 8, color: '#1a1033', weight: 2, fillColor: '#ffe14d', fillOpacity: 1 }).addTo(MAP).bindTooltip('Demi-tour · ' + x.turn[3] + ' m');
      else if (x.t === 'aller') { var z = x.path[x.path.length - 1]; L.circleMarker([z[0], z[1]], { radius: 8, color: '#fff', weight: 2, fillColor: '#1a1033', fillOpacity: 1 }).addTo(MAP).bindTooltip('Arrivée'); }
      setTimeout(function () { MAP.invalidateSize(); MAP.fitBounds(ln.getBounds(), { padding: [16, 16] }); }, 30);
    }).catch(function () { hold.innerHTML = '<p class="note">Carte indisponible hors ligne.</p>'; });
  }

  /* ---------- greffe sur la fiche séance ---------- */
  var last = null;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-s]'); if (b) last = b.dataset.s;
    var pc = e.target.closest && e.target.closest('.pc'); if (!pc || !CUR) return;
    var a = e.target.closest('[data-pca]');
    if (a) { CTXSEL[CUR.key] = a.dataset.pca; CUR.j = 0; render(pc, CUR.s, CUR.date); return; }
    var k = e.target.closest('[data-pcalt]');
    if (k) { CUR.j = +k.dataset.pcalt; render(pc, CUR.s, CUR.date); return; }
    if (e.target.closest('[data-pcgpx]')) { gpx(CUR.x); return; }
    if (e.target.closest('[data-pcmap]')) map(CUR.x);
  }, true);

  function attach() {
    var shB = document.getElementById('shB'); if (!shB || !last || shB.querySelector('.pc') || !shB.firstChild) return;
    var q = last.split('|'), w = plan().find(function (x) { return x.ws === q[0]; }); if (!w) return;
    var s = w.s[+q[1]];
    if (!s || s.c !== 'run' || s.r || KEYW.test((s.t || '') + ' ' + (s.ds || ''))) return;
    var date = new Date(pd(w.ws) + s.d * 864e5).toISOString().slice(0, 10);
    var box = document.createElement('div'); box.className = 'pc';
    var note = shB.querySelector('.btn, p.note'); shB.insertBefore(box, note || null);
    render(box, s, date);
  }
  function watch() {
    var shB = document.getElementById('shB'); if (!shB) return setTimeout(watch, 300);
    new MutationObserver(function () { setTimeout(attach, 0); }).observe(shB, { childList: true });
  }
  watch();
})();
