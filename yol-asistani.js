// Yol Tarifi Asistanı — ilçe ve semt seçen ziyaretçiye merkezimize toplu taşımayla nasıl gelineceğini anlatır.
// Tarifler araclar/yol-tarifi.js ile ESHOT, İzmir Metro, İZBAN ve Tramvay GTFS verilerinden önceden hesaplanır
// (site/yol-tarifi/*.json). Sunucu, API anahtarı ve kullanım ücreti gerektirmez.
(function () {
  'use strict';
  var DEST = '38.3767286,27.1342532';
  var TEL = '+905303100883', TEL_TXT = '0530 310 08 83';
  var ADRES = 'Yunus Emre Mah. Şht. Pilot Volkan Koçyiğit Blv. No:5 Kat:3 Daire:6, Karabağlar';
  var HOME = { b12622: 1, b12623: 1 }; // Kaymakkuyu 2: merkezimizin tam karşısı
  var BASE = '/yol-tarifi/';

  var css = '' +
    '.ya-fab{position:fixed;left:22px;bottom:22px;z-index:1000;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:linear-gradient(135deg,#0b3c5d,#328cc1);color:#fff;font:700 .95rem/1.2 inherit;padding:12px 20px 12px 12px;border-radius:999px;box-shadow:0 14px 30px -12px rgba(11,60,93,.75);transition:transform .3s cubic-bezier(.22,1,.36,1)}' +
    '.ya-fab:hover{transform:translateY(-2px)}' +
    '.ya-fab .ya-fi{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:1.15rem}' +
    '.ya-fab small{display:block;font-weight:500;font-size:.72rem;opacity:.85}' +
    '.ya-panel{position:fixed;left:22px;bottom:22px;z-index:1002;width:min(400px,calc(100vw - 24px));height:min(640px,calc(100vh - 44px));display:none;flex-direction:column;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -20px rgba(7,39,61,.55);border:1px solid rgba(11,60,93,.1)}' +
    '.ya-open .ya-panel{display:flex;animation:yaUp .35s cubic-bezier(.22,1,.36,1)}.ya-open .ya-fab{display:none}' +
    '@keyframes yaUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
    '.ya-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#0b3c5d,#1d6a9a);color:#fff}' +
    '.ya-av{width:40px;height:40px;border-radius:50%;background:#fff;color:#0b3c5d;display:grid;place-items:center;font-size:1.2rem;flex-shrink:0}' +
    '.ya-head b{display:block;font-size:1rem}.ya-head span{font-size:.75rem;opacity:.85}' +
    '.ya-x{margin-left:auto;background:rgba(255,255,255,.15);border:0;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem}' +
    '.ya-body{flex:1;overflow-y:auto;padding:16px 14px;background:#f4f8fb;display:flex;flex-direction:column;gap:10px}' +
    '.ya-msg{max-width:92%;padding:10px 13px;border-radius:16px;font-size:.92rem;line-height:1.5;color:#1e293b;background:#fff;border:1px solid rgba(11,60,93,.08);border-bottom-left-radius:5px;animation:yaIn .3s ease}' +
    '.ya-me{align-self:flex-end;background:#0b3c5d;color:#fff;border:0;border-bottom-left-radius:16px;border-bottom-right-radius:5px}' +
    '@keyframes yaIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '.ya-typing{display:inline-flex;gap:4px}.ya-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:yaDot 1s infinite}.ya-typing i:nth-child(2){animation-delay:.15s}.ya-typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes yaDot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}' +
    '.ya-search{width:100%;padding:10px 12px;border:1px solid rgba(11,60,93,.18);border-radius:12px;font:inherit;font-size:.92rem;margin:2px 0 8px;outline:0}.ya-search:focus{border-color:#328cc1;box-shadow:0 0 0 3px rgba(50,140,193,.15)}' +
    '.ya-chips{display:flex;flex-wrap:wrap;gap:6px;max-height:260px;overflow-y:auto}' +
    '.ya-chip{border:1px solid rgba(11,60,93,.16);background:#fff;color:#0b3c5d;border-radius:999px;padding:6px 12px;font:600 .84rem/1.2 inherit;cursor:pointer}.ya-chip:hover,.ya-chip:focus{background:#0b3c5d;color:#fff;outline:0}' +
    '.ya-chip small{font-weight:500;opacity:.7}' +
    '.ya-steps{list-style:none;margin:6px 0 2px;padding:0;display:flex;flex-direction:column;gap:9px}' +
    '.ya-steps li{display:flex;gap:10px;align-items:flex-start}.ya-steps .ya-si{width:30px;height:30px;border-radius:10px;flex-shrink:0;display:grid;place-items:center;background:#e8f1f8;font-size:1rem}' +
    '.ya-steps em{display:block;font-style:normal;font-size:.78rem;color:#64748b}' +
    '.ya-line{display:inline-block;min-width:30px;text-align:center;background:#0b3c5d;color:#fff;border-radius:6px;padding:0 6px;font-weight:800;font-size:.85rem}' +
    '.ya-sum{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}.ya-tag{background:#e8f1f8;color:#0b3c5d;border-radius:999px;padding:3px 10px;font-size:.78rem;font-weight:700}' +
    '.ya-alt{border:1px solid rgba(11,60,93,.12);border-radius:12px;margin-top:6px;overflow:hidden}.ya-alt summary{cursor:pointer;padding:8px 10px;font-size:.86rem;font-weight:600;color:#0b3c5d;list-style:none}.ya-alt summary::-webkit-details-marker{display:none}.ya-alt summary::before{content:"▸ "}.ya-alt[open] summary::before{content:"▾ "}.ya-alt .ya-steps{padding:0 10px 10px}' +
    '.ya-acts{display:flex;flex-direction:column;gap:7px}.ya-btn{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border-radius:12px;padding:10px 12px;font:700 .88rem/1.2 inherit;border:1px solid rgba(11,60,93,.18);background:#fff;color:#0b3c5d;cursor:pointer}.ya-btn.pri{background:#0b3c5d;color:#fff;border-color:#0b3c5d}.ya-btn.grn{background:#25d366;border-color:#25d366;color:#fff}' +
    '.ya-note{font-size:.76rem;color:#64748b;line-height:1.5}' +
    '@media (max-width:768px){.ya-fab{left:12px;bottom:calc(86px + env(safe-area-inset-bottom));padding:10px 16px 10px 10px;font-size:.88rem}.ya-panel{left:12px;right:12px;width:auto;bottom:calc(12px + env(safe-area-inset-bottom));height:calc(100vh - 90px);height:calc(100dvh - 90px)}}' +
    '@media print{.ya-fab,.ya-panel{display:none!important}}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var root = document.createElement('div'); root.className = 'ya-root';
  root.innerHTML =
    '<button type="button" class="ya-fab" aria-haspopup="dialog"><span class="ya-fi" aria-hidden="true">🧭</span><span>Yol tarifi almak için tıklayın<small>İlçe ve semtinizi seçin</small></span></button>' +
    '<div class="ya-panel" role="dialog" aria-label="Yol Tarifi Asistanı">' +
    '<div class="ya-head"><span class="ya-av" aria-hidden="true">🧭</span><div><b>Yol Tarifi Asistanı</b><span>Burak Psikoteknik · Karabağlar</span></div><button type="button" class="ya-x" aria-label="Kapat">✕</button></div>' +
    '<div class="ya-body" aria-live="polite"></div></div>';
  document.body.appendChild(root);
  var fab = root.querySelector('.ya-fab'), body = root.querySelector('.ya-body');

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return String(s).toLocaleLowerCase('tr').replace(/[çğıöşü]/g, function (c) { return { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c]; }).replace(/\s+/g, ' ').trim(); };
  var clean = function (s) { return String(s).replace(/\s+-\s+(\d)/g, ' $1').trim(); };
  var cache = {};
  function getJSON(f) {
    if (!cache[f]) cache[f] = fetch(BASE + f).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    return cache[f];
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function msg(html, me) { var d = document.createElement('div'); d.className = 'ya-msg' + (me ? ' ya-me' : ''); d.innerHTML = html; body.appendChild(d); scroll(); return d; }
  function typing(ms) {
    var d = msg('<span class="ya-typing" aria-label="Yazıyor"><i></i><i></i><i></i></span>');
    return new Promise(function (res) { setTimeout(function () { d.remove(); res(); }, ms); });
  }

  // Seçim kutusu: arama + düğmeler
  function picker(placeholder, items, onPick) {
    var d = msg('<input class="ya-search" type="search" autocomplete="off" placeholder="' + esc(placeholder) + '"><div class="ya-chips"></div>');
    var inp = d.querySelector('input'), box = d.querySelector('.ya-chips');
    function draw(q) {
      var nq = norm(q || ''), html = '', n = 0;
      items.forEach(function (it, i) { if (!nq || norm(it.label).indexOf(nq) > -1) { html += '<button type="button" class="ya-chip" data-i="' + i + '">' + esc(it.label) + (it.sub ? ' <small>' + esc(it.sub) + '</small>' : '') + '</button>'; n++; } });
      box.innerHTML = n ? html : '<span class="ya-note">Sonuç bulunamadı. Farklı yazmayı deneyin ya da bize ulaşın: <a href="tel:' + TEL + '">' + TEL_TXT + '</a></span>';
    }
    draw('');
    inp.addEventListener('input', function () { draw(inp.value); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var b = box.querySelector('.ya-chip'); if (b) b.click(); } });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.ya-chip'); if (!b) return;
      d.remove(); onPick(items[+b.dataset.i]);
    });
    setTimeout(function () { if (window.matchMedia('(min-width:769px)').matches) inp.focus(); }, 50);
  }

  function stepHTML(a) {
    var dur = function (n) { return n === 1 ? 'bir sonraki durakta' : n + ' durak sonra'; };
    var ist = function (t) { return t === 'otobus' ? 'durağından' : 'istasyonundan'; };
    var inIst = function (t) { return t === 'otobus' ? 'durağında' : 'istasyonunda'; };
    if (a.tip === 'yuru') {
      var yer = a.mod === 'bus' ? 'durağına' : 'istasyonuna';
      return '<li><span class="ya-si">🚶</span><div><strong>' + esc(a.nereye) + '</strong> ' + yer + ' yürüyün.<em>~' + a.m + ' m · ' + Math.max(1, Math.round(a.m * 1.3 / 70)) + ' dk</em></div></li>';
    }
    if (a.tip === 'varis') {
      var karsi = HOME[a.durakId];
      return '<li><span class="ya-si">📍</span><div>' + (karsi ? 'Merkezimiz <strong>' + esc(a.durak) + '</strong> durağının <strong>tam karşısındadır</strong>.' : '<strong>' + esc(a.durak) + '</strong> durağından merkezimize yürüyün.') +
        '<em>' + (karsi ? '' : '~' + a.m + ' m · ') + esc(ADRES) + ' (binada asansör var)</em></div></li>';
    }
    var ic = { otobus: '🚌', metro: '🚇', izban: '🚆', tramvay: '🚋' }[a.tip];
    var arac = a.tip === 'otobus' ? '<span class="ya-line">' + esc(a.hat) + '</span> numaralı otobüse'
      : a.tip === 'metro' ? '<span class="ya-line">' + esc(a.hat) + '</span> metrosuna'
      : a.tip === 'izban' ? '<span class="ya-line">İZBAN</span> trenine' : 'tramvaya (' + esc(a.ad) + ')';
    var ek = a.tip === 'otobus' && a.ad ? esc(a.ad) + ' · ' : '';
    return '<li><span class="ya-si">' + ic + '</span><div><strong>' + esc(clean(a.binis)) + '</strong> ' + ist(a.tip) + ' ' + arac + ' binin, <strong>' + esc(clean(a.yon)) + '</strong> yönü. ' +
      dur(a.durak) + ' <strong>' + esc(clean(a.inis)) + '</strong> ' + inIst(a.tip) + ' inin.<em>' + ek + '~' + a.dk + ' dk yolculuk</em></div></li>';
  }
  function summary(j) {
    var lines = j.adimlar.filter(function (a) { return a.hat; }).map(function (a) { return a.tip === 'otobus' ? a.hat : a.tip === 'izban' ? 'İZBAN' : a.tip === 'tramvay' ? 'Tramvay' : a.hat; });
    var akt = j.arac - 1;
    return lines.join(' → ') + ' · ~' + j.sure + ' dk' + (akt ? ' · ' + akt + ' aktarma' : ' · aktarmasız');
  }
  function stepsOf(j, yer) {
    var pre = '';
    if (j.baslangicM > 150 && yer.tur === 'mahalle' && j.adimlar[0].tip !== 'yuru') pre = '<li><span class="ya-si">🚶</span><div><strong>' + esc(clean(j.baslangic)) + '</strong> durağına gidin.<em>Mahalle merkezinden ~' + j.baslangicM + ' m</em></div></li>';
    return '<ol class="ya-steps">' + pre + j.adimlar.map(stepHTML).join('') + '</ol>';
  }

  function answer(ilce, yer) {
    var gm = 'https://www.google.com/maps/dir/?api=1&origin=' + yer.lat + ',' + yer.lon + '&destination=' + DEST;
    var akt = yer.arac - 1;
    var ad = yer.ad.replace(/ \((Metro|İZBAN|Tramvay) İstasyonu\)$/, '');
    return typing(900).then(function () {
      msg('<b>' + esc(ad) + '</b> (' + esc(ilce.ad) + ') bölgesinden merkezimize toplu taşımayla yaklaşık <b>' + yer.sure + ' dakikada</b> gelebilirsiniz' +
        (akt ? ' (' + akt + ' aktarma).' : ', aktarma yapmadan.') + ' Adım adım anlatıyorum:');
      return typing(700);
    }).then(function () {
      msg('<div class="ya-sum"><span class="ya-tag">' + esc(summary(yer)) + '</span></div>' + stepsOf(yer, yer));
      if (yer.alternatif && yer.alternatif.length) {
        msg('<b>Diğer seçenekler</b>' + yer.alternatif.map(function (a) {
          return '<details class="ya-alt"><summary>' + esc(summary(a)) + '</summary>' + stepsOf(a, yer) + '</details>';
        }).join(''));
      }
      if (yer.sure >= 100) msg('💡 Uzak bir ilçeden geliyorsanız <b>şehirlerarası / ilçe otobüsüyle İzmir Otogarı</b>na gelmek çoğu zaman daha hızlıdır. Otogardan <b>Gaziemir – Yeni Garaj dolmuşu</b> aktarmasız olarak merkezimizin önünden geçer.');
      return typing(500);
    }).then(function () {
      msg('<div class="ya-acts">' +
        '<a class="ya-btn pri" target="_blank" rel="noopener" href="' + gm + '&travelmode=transit">🗺️ Google Haritalar\'da toplu taşımayla aç</a>' +
        '<a class="ya-btn" target="_blank" rel="noopener" href="' + gm + '&travelmode=driving">🚗 Araçla yol tarifi</a>' +
        '<a class="ya-btn grn" href="tel:' + TEL + '">📞 Bizi arayın: ' + TEL_TXT + '</a>' +
        '<button type="button" class="ya-btn ya-again">↺ Başka bir yerden tarif al</button></div>' +
        '<p class="ya-note" style="margin-top:8px">🚗 Araçla gelirken çevre yolunda Karabağlar <b>4012. Sokak</b> çıkışını kullanın; çıkıştan merkezimize ~450 m kalır.</p>' +
        '<p class="ya-note" style="margin-top:6px">Tarifler ESHOT, İzmir Metro, İZBAN ve Tramvay sefer verilerinden hesaplanmıştır; süreler bekleme dahil tahminidir. Anlık sefer saatleri için ESHOT Mobil veya Google Haritalar\'a bakabilirsiniz.</p>');
    });
  }

  function start() {
    body.innerHTML = '';
    msg('Merhaba! 👋 Ben Burak Psikoteknik\'in yol tarifi asistanıyım. Merkezimize <b>nereden</b> geleceğinizi söyleyin, size hangi otobüs, metro veya İZBAN\'a binip nerede ineceğinizi adım adım anlatayım.');
    getJSON('index.json').then(function (ix) {
      msg('Önce <b>ilçenizi</b> seçin:');
      picker('İlçe ara… (ör. Balçova)', ix.ilceler.map(function (i) { return { label: i.ad, data: i }; }), function (it) {
        var ilce = it.data;
        msg(esc(ilce.ad), true);
        typing(500).then(function () { return getJSON(ilce.slug + '.json'); }).then(function (d) {
          msg('<b>' + esc(ilce.ad) + '</b> içinde hangi <b>mahalle veya semttesiniz</b>? Metro, İZBAN ve tramvay istasyonlarını da seçebilirsiniz.');
          picker('Mahalle / semt ara… (ör. Fahrettin Altay)', d.yerler.map(function (y) { return { label: y.ad.replace(/ \((Metro|İZBAN|Tramvay) İstasyonu\)$/, ''), sub: y.tur === 'istasyon' ? (y.ad.match(/\((\S+) İstasyonu\)$/) || [])[1] + ' istasyonu' : '', data: y }; }), function (p) {
            msg(esc(p.label) + (p.sub ? ' (' + esc(p.sub) + ')' : ''), true);
            answer(ilce, p.data);
          });
        }).catch(fail);
      });
    }).catch(fail);
  }
  function fail() { msg('Üzgünüm, tarif bilgisi şu an yüklenemedi. <a href="https://www.google.com/maps/dir/?api=1&destination=' + DEST + '" target="_blank" rel="noopener">Google Haritalar\'da konumunuzdan tarif alın</a> ya da bizi arayın: <a href="tel:' + TEL + '">' + TEL_TXT + '</a>'); }

  var started = false;
  function open() { root.classList.add('ya-open'); if (!started) { started = true; start(); } setTimeout(function () { root.querySelector('.ya-x').focus(); }, 30); }
  function close() { root.classList.remove('ya-open'); fab.focus(); }
  fab.addEventListener('click', open);
  root.querySelector('.ya-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('ya-open')) close(); });
  body.addEventListener('click', function (e) { if (e.target.closest('.ya-again')) start(); });
  // Sayfadaki herhangi bir öğeye data-yol-asistani eklenirse asistanı açar
  document.addEventListener('click', function (e) { var t = e.target.closest('[data-yol-asistani]'); if (t) { e.preventDefault(); open(); } });
  // Sayfada görünür bir "Yol Tarifi Al" butonu varken köşedeki buton gizlenir; aşağı kaydırınca belirir
  var inPage = document.querySelectorAll('[data-yol-asistani]');
  if (inPage.length && 'IntersectionObserver' in window) {
    var vis = new Set();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) vis.add(en.target); else vis.delete(en.target); });
      fab.style.display = vis.size ? 'none' : '';
    });
    inPage.forEach(function (el) { io.observe(el); });
  }
})();
