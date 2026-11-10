/* Parcours conseillés : pour chaque séance de course, propose une de mes traces (Coros) autour de Nice ou de Monaco
   qui colle à la distance et au D+ prévus, avec carte, profil, « Y aller » et export GPX (à importer dans l'appli Coros).
   Module indépendant du code de VictorTrail (qui peut être rechargé depuis /victorTrail/) : il se greffe sur la fiche séance.
   Les traces sont dans parcours.json (départs et arrivées masqués près de chez moi). */
(function () {
  'use strict';
  var DATA = null, LOADING = null, CUR = null, MAP = null, AREA = {};
  var KEYW = /tapis|piste|v[ée]lo|rameur|elliptique/i;

  var css = `
.pc{margin-top:18px;border:3px solid var(--ink);border-radius:14px;background:var(--paper);box-shadow:var(--sh,3px 3px 0 var(--ink));overflow:hidden}
.pc-h{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;background:var(--yellow,#ffe14d);border-bottom:3px solid var(--ink);color:var(--ink)}
.pc-h b{font:400 .95rem var(--d,var(--f));letter-spacing:.02em;text-transform:uppercase}
.pc-area{display:flex;gap:4px}
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
.pc-alt button{flex:0 0 auto;border:2px solid var(--ink);background:var(--paper);border-radius:10px;padding:6px 10px;font:600 .76rem var(--f);cursor:pointer;color:var(--ink);text-align:left}
.pc-alt button[aria-pressed=true]{background:var(--mint,#4dfcc0)}
.pc-alt button small{display:block;color:var(--muted);font-weight:500}
.pc .note{margin-top:8px}
`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function kmf(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }
  function fr(n) { return Math.round(n).toLocaleString('fr-FR'); }
  function pd(s) { var a = s.split('-').map(Number); return Date.UTC(a[0], a[1] - 1, a[2]); }

  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (!LOADING) LOADING = fetch('parcours.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { DATA = j; return j; }).catch(function () { LOADING = null; return null; });
    return LOADING;
  }
  function plan() { try { return JSON.parse(document.getElementById('data').textContent).plan || []; } catch (e) { return []; } }

  /* ---------- calcul des propositions ---------- */
  function idxAt(P, k) { for (var i = 0; i < P.length; i++) if (P[i][2] >= k) return i; return P.length - 1; }
  function options(r, K) {
    var P = r.pts, L = r.km, n = P.length - 1, up = P[n][4], dn = P[n][5], o = [];
    o.push({ r: r, t: r.loop ? 'boucle' : 'aller', km: L, dp: up, path: P.slice() });
    if (K / 2 >= 1 && K / 2 < L - 0.3) {
      var i = idxAt(P, K / 2), a = P.slice(0, i + 1);
      o.push({ r: r, t: 'ar', km: 2 * P[i][2], dp: P[i][4] + P[i][5], turn: P[i], path: a.concat(a.slice(0, -1).reverse()) });
      if (r.loop) {
        var j = idxAt(P, L - K / 2), b = P.slice(j).reverse();
        o.push({ r: r, t: 'ar2', km: 2 * (L - P[j][2]), dp: (up - P[j][4]) + (dn - P[j][5]), turn: P[j], path: b.concat(b.slice(0, -1).reverse()) });
      }
    }
    return o;
  }
  function pick(area, K, Dp) {
    var all = [];
    DATA.routes.forEach(function (r) { if (r.area === area) all = all.concat(options(r, K)); });
    all.forEach(function (x) {
      x.s = Math.abs(x.km - K) / Math.max(K, 3) + 1.2 * Math.abs(x.dp - Dp) / Math.max(Dp, 200) + (x.t === 'aller' ? 0.12 : 0) + (x.t === 'boucle' ? -0.03 : 0);
    });
    all.sort(function (a, b) { return a.s - b.s; });
    var out = [], seen = {};
    all.forEach(function (x) { var k = x.r.name + '|' + (x.t === 'ar2' ? 'ar' : x.t); if (out.length < 4 && !seen[k]) { seen[k] = 1; out.push(x); } });
    return out;
  }
  function how(x) {
    var r = x.r;
    if (x.t === 'boucle') return 'Boucle complète, comme ma sortie du ' + dfr(r.date) + '.';
    if (x.t === 'aller') return 'Aller simple jusqu\'à ' + (r.name.split('→').pop().trim()) + ', retour en train ou en bus.';
    var dir = x.t === 'ar2' ? 'dans l\'autre sens ' : '';
    return 'Aller-retour ' + dir + ': demi-tour au km ' + kmf(x.km / 2) + ' (' + x.turn[3] + ' m d\'altitude), puis même chemin au retour.';
  }
  function dfr(s) { var M = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']; var d = new Date(pd(s)); return d.getUTCDate() + ' ' + M[d.getUTCMonth()]; }

  /* ---------- rendu ---------- */
  function profile(x) {
    var P = x.path, w = 320, h = 70, p = 4, d = 0, D = [0];
    for (var i = 1; i < P.length; i++) { d += Math.abs(P[i][2] - P[i - 1][2]); D.push(d); }
    var E = P.map(function (q) { return q[3]; }), lo = Math.min.apply(null, E), hi = Math.max.apply(null, E), rg = Math.max(80, hi - lo);
    var X = function (v) { return p + v / Math.max(d, .01) * (w - 2 * p); }, Y = function (v) { return p + (1 - (v - lo) / rg) * (h - 2 * p - 10); };
    var step = Math.max(1, Math.floor(P.length / 160)), ln = '';
    for (var k = 0; k < P.length; k += step) ln += (k ? 'L' : 'M') + X(D[k]).toFixed(1) + ' ' + Y(E[k]).toFixed(1);
    ln += 'L' + X(d).toFixed(1) + ' ' + Y(E[E.length - 1]).toFixed(1);
    return '<svg class="pc-pr" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Profil du parcours, de ' + Math.round(lo) + ' à ' + Math.round(hi) + ' m"><path d="' + ln + 'L' + X(d) + ' ' + (h - 10) + 'L' + p + ' ' + (h - 10) + 'Z" fill="var(--lilac,#d9c2ff)" stroke="none"/><path d="' + ln + '" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="' + p + '" y="' + (h - 1) + '">' + Math.round(lo) + ' m</text><text x="' + (w - p) + '" y="' + (h - 1) + '" text-anchor="end">' + kmf(d) + ' km · point haut ' + Math.round(hi) + ' m</text></svg>';
  }
  function render(box, s, date) {
    var K = s.km || Math.round(s.m / 6), Dp = s.dp || 0;
    var dow = (new Date(pd(date)).getUTCDay() + 6) % 7;
    var key = date + '|' + s.t;
    var area = AREA[key] || ((dow === 2 || dow === 3) && s.sl === 'm' ? 'monaco' : 'nice');
    var L = pick(area, K, Dp), j = Math.min(CUR && CUR.key === key ? CUR.j : 0, L.length - 1), x = L[j];
    CUR = { key: key, j: j, x: x, s: s, date: date };
    var h = '<div class="pc-h"><b>Parcours conseillé</b><div class="pc-area" role="group" aria-label="Départ">' +
      ['nice', 'monaco'].map(function (a) { return '<button data-pca="' + a + '" aria-pressed="' + (a === area) + '">' + (a === 'nice' ? 'Nice' : 'Monaco') + '</button>'; }).join('') + '</div></div><div class="pc-b">';
    if (!x) { box.innerHTML = h + '<p class="note">Pas de trace disponible ici.</p></div>'; return; }
    var okK = Math.abs(x.km - K) <= Math.max(1.5, K * .12), okD = Math.abs(x.dp - Dp) <= Math.max(80, Dp * .2);
    h += '<h3>' + esc(x.r.name) + '</h3><div class="pc-how">' + esc(how(x)) + '</div>' +
      '<div class="pc-fit"><div><b class="' + (okK ? 'ok' : 'meh') + '">' + kmf(x.km) + '</b><span>km · prévu ' + kmf(K) + '</span></div><div><b class="' + (okD ? 'ok' : 'meh') + '">' + fr(x.dp) + '</b><span>m D+ · prévu ' + fr(Dp) + '</span></div></div>' +
      profile(x) +
      '<div class="pc-act"><button class="btn ghost" data-pcmap>Carte</button><a class="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=' + x.path[0][0] + ',' + x.path[0][1] + '">Y aller</a><button class="btn" data-pcgpx>GPX</button></div><div id="pcm"></div>';
    if (L.length > 1) h += '<div class="pc-alt" aria-label="Autres parcours">' + L.map(function (y, k) { return '<button data-pcalt="' + k + '" aria-pressed="' + (k === j) + '">' + esc(y.r.name.replace(/^(Nice|Monaco) · /, '')) + '<small>' + kmf(y.km) + ' km · ' + fr(y.dp) + ' m D+' + (y.t === 'ar' || y.t === 'ar2' ? ' · A/R' : y.t === 'aller' ? ' · aller' : '') + '</small></button>'; }).join('') + '</div>';
    if (!okK || !okD) h += '<p class="note">Aucune de mes traces ne colle pile : ' + (!okD && x.dp < Dp ? 'ajoute une ou deux côtes en route pour compléter le D+.' : !okD ? 'reste en aisance dans les montées, il y a plus de D+ que prévu.' : 'ajuste la distance en rallongeant ou raccourcissant le retour.') + '</p>';
    h += '<p class="note">Le GPX s\'importe dans l\'appli Coros (Profil → Parcours → Importer) pour suivre le tracé sur la montre.</p></div>';
    box.innerHTML = h;
  }

  function gpx(x) {
    var nm = x.r.name + ' · ' + kmf(x.km) + ' km ' + fr(x.dp) + ' m D+';
    var t = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="VictorTrail OS" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>' + esc(nm) + '</name></metadata><trk><name>' + esc(nm) + '</name><trkseg>' +
      x.path.map(function (p) { return '<trkpt lat="' + p[0] + '" lon="' + p[1] + '"><ele>' + p[3] + '</ele></trkpt>'; }).join('') + '</trkseg></trk></gpx>';
    var b = new Blob([t], { type: 'application/gpx+xml' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = (CUR.date + ' ' + x.r.name + ' ' + kmf(x.km) + 'km').replace(/[^\w\-àâçéèêëîïôûùüÿ ]+/gi, '').replace(/\s+/g, '_') + '.gpx';
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
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 16, subdomains: 'abc', attribution: '© OpenStreetMap, SRTM · OpenTopoMap' }).addTo(MAP);
      var ln = L.polyline(x.path.map(function (p) { return [p[0], p[1]]; }), { color: '#ff0a8c', weight: 4 }).addTo(MAP);
      L.circleMarker([x.path[0][0], x.path[0][1]], { radius: 8, color: '#1a1033', weight: 2, fillColor: '#4dfcc0', fillOpacity: 1 }).addTo(MAP).bindTooltip('Départ');
      if (x.turn) L.circleMarker([x.turn[0], x.turn[1]], { radius: 8, color: '#1a1033', weight: 2, fillColor: '#ffe14d', fillOpacity: 1 }).addTo(MAP).bindTooltip('Demi-tour · ' + x.turn[3] + ' m');
      else { var z = x.path[x.path.length - 1]; L.circleMarker([z[0], z[1]], { radius: 8, color: '#fff', weight: 2, fillColor: '#1a1033', fillOpacity: 1 }).addTo(MAP).bindTooltip('Arrivée'); }
      setTimeout(function () { MAP.invalidateSize(); MAP.fitBounds(ln.getBounds(), { padding: [16, 16] }); }, 30);
    }).catch(function () { hold.innerHTML = '<p class="note">Carte indisponible hors ligne.</p>'; });
  }

  /* ---------- greffe sur la fiche séance ---------- */
  var last = null;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-s]'); if (b) last = b.dataset.s;
    var pc = e.target.closest && e.target.closest('.pc'); if (!pc || !CUR) return;
    var a = e.target.closest('[data-pca]');
    if (a) { AREA[CUR.key] = a.dataset.pca; CUR.j = 0; render(pc, CUR.s, CUR.date); return; }
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
    box.innerHTML = '<div class="pc-h"><b>Parcours conseillé</b></div><div class="pc-b"><p class="note" style="margin:0">Chargement des traces…</p></div>';
    load().then(function (d) { if (!box.isConnected) return; if (!d) { box.innerHTML = '<div class="pc-h"><b>Parcours conseillé</b></div><div class="pc-b"><p class="note" style="margin:0">Traces indisponibles hors ligne.</p></div>'; return; } render(box, s, date); });
  }
  function watch() {
    var shB = document.getElementById('shB'); if (!shB) return setTimeout(watch, 300);
    new MutationObserver(function () { setTimeout(attach, 0); }).observe(shB, { childList: true });
  }
  watch();
})();
