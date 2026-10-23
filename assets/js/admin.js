/* Kira HQ: the owner dashboard. Reads the sample database in store.js. Charts are inline SVG. */
(function () {
  'use strict';
  var KF = window.KF, UI = window.KFUI, S = window.KFStore, $ = UI.$, $$ = UI.$$;
  var COL = { room: '#0a3528', course: '#c76a5d', camp: '#b9995f' };
  var LAB = { room: 'Trading Room', course: 'Courses', camp: 'Bootcamps' };
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function day(iso) { var d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function kind(item) { return item.split('-')[0]; }

  function render() {
    var db = S.db(), orders = S.allOrders(), apps = S.allApps(), now = new Date();
    var h = now.getHours();
    $('[data-hq-date]').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('[data-hq-hello]').textContent = (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ', Kira';
    var sl = UI.sessionLine(); $('[data-hq-sess]').textContent = sl.text; $('.hq-live').classList.toggle('is-closed', !sl.live);

    // KPIs
    var active = db.members.filter(function (m) { return m.active; });
    var perMonth = { month: 99, quarter: 269 / 3, year: 890 / 12 };
    var mrr = active.reduce(function (a, m) { return a + perMonth[m.plan]; }, 0);
    var d30 = S.iso(new Date(now.getTime() - 30 * 864e5)), d60 = S.iso(new Date(now.getTime() - 60 * 864e5));
    var rev30 = orders.filter(function (o) { return o.date >= d30; }).reduce(function (a, o) { return a + o.usd; }, 0);
    var rev60 = orders.filter(function (o) { return o.date >= d60 && o.date < d30; }).reduce(function (a, o) { return a + o.usd; }, 0);
    var seats = KF.tour.reduce(function (a, t) { return a + (t.seats - t.left); }, 0) + db.own.orders.filter(function (o) { return kind(o.item) === 'camp'; }).length;
    var newApps = apps.filter(function (a) { return a.status === 'New'; }).length;
    var chg = rev60 ? (rev30 - rev60) / rev60 * 100 : 0;
    var k = [
      ['Active members', active.length.toLocaleString('en-US'), Math.round(active.length / db.members.length * 100) + '% of all members', ''],
      ['Monthly recurring', money(mrr), 'From Trading Room plans', ''],
      ['Revenue, 30 days', money(rev30), (chg >= 0 ? '+' : '−') + Math.abs(chg).toFixed(0) + '% on the 30 days before', chg >= 0 ? 'up' : 'down'],
      ['Bootcamp seats sold', seats + ' of ' + KF.tour.length * 40, 'Across seven cities', ''],
      ['New applications', String(newApps), 'Mentorship, waiting for you', newApps ? 'down' : '']
    ];
    $('[data-kpis]').innerHTML = k.map(function (x) { return '<div class="kpi"><span class="kpi__l">' + x[0] + '</span><span class="kpi__n">' + x[1] + '</span><span class="kpi__d ' + x[3] + '">' + x[2] + '</span></div>'; }).join('');

    // revenue by month, stacked by kind
    var months = [];
    for (var i = 11; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleDateString('en-GB', { month: 'short' }), room: 0, course: 0, camp: 0 }); }
    orders.forEach(function (o) { var mo = months.filter(function (x) { return o.date.slice(0, 7) === x.key; })[0]; if (mo) mo[kind(o.item)] += o.usd; });
    var max = Math.max.apply(null, months.map(function (x) { return x.room + x.course + x.camp; })) || 1;
    var W = 760, H = 260, pad = 34, bw = (W - pad) / months.length * 0.62, step = (W - pad) / months.length;
    var svg = '<svg class="hq-chart" viewBox="0 0 ' + W + ' ' + (H + 30) + '" role="img" aria-label="Revenue by month, stacked by Trading Room, courses and bootcamps">';
    [0, 0.5, 1].forEach(function (g) { var y = H - g * (H - 20); svg += '<line x1="' + pad + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#e9e3e5"/><text x="0" y="' + (y + 4) + '">' + (g ? '$' + Math.round(max * g / 1000) + 'k' : '0') + '</text>'; });
    months.forEach(function (mo, i) {
      var x = pad + i * step + (step - bw) / 2, y = H;
      ['room', 'course', 'camp'].forEach(function (kk) { var hh = mo[kk] / max * (H - 20); if (hh <= 0) return; y -= hh; svg += '<rect class="hq-bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + COL[kk] + '" data-tip="' + mo.label + ' · ' + LAB[kk] + ' ' + money(mo[kk]) + '"/>'; });
      svg += '<text x="' + (x + bw / 2) + '" y="' + (H + 20) + '" text-anchor="middle">' + mo.label + '</text>';
    });
    svg += '</svg>';
    $('[data-chart]').innerHTML = svg;
    $('[data-legend]').innerHTML = ['room', 'course', 'camp'].map(function (kk) { return '<span><i style="background:' + COL[kk] + '"></i>' + LAB[kk] + '</span>'; }).join('');
    $('[data-table]').innerHTML = '<div class="hq-table-wrap"><table class="hq-table"><thead><tr><th>Month</th><th class="r">Trading Room</th><th class="r">Courses</th><th class="r">Bootcamps</th><th class="r">Total</th></tr></thead><tbody>' + months.map(function (mo) { return '<tr><td>' + mo.label + '</td><td class="r">' + money(mo.room) + '</td><td class="r">' + money(mo.course) + '</td><td class="r">' + money(mo.camp) + '</td><td class="r">' + money(mo.room + mo.course + mo.camp) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var best = months.slice().sort(function (a, b) { return (b.room + b.course + b.camp) - (a.room + a.course + a.camp); })[0];
    var roomShare = months.reduce(function (a, m) { return a + m.room; }, 0) / months.reduce(function (a, m) { return a + m.room + m.course + m.camp; }, 1) * 100;
    $('[data-finding]').textContent = 'The Trading Room brings in ' + roomShare.toFixed(0) + '% of revenue. ' + best.label + ' was the strongest month.';

    // countries
    var cc = {}; active.forEach(function (m) { cc[m.country] = (cc[m.country] || 0) + 1; });
    var rows = Object.keys(cc).map(function (c) { return [c, cc[c]]; }).sort(function (a, b) { return b[1] - a[1]; });
    $('[data-mem-total]').textContent = active.length + ' active';
    $('[data-countries]').innerHTML = rows.map(function (r) { return '<div class="hb"><span>' + r[0] + '</span><span class="hb__t"><span style="width:' + (r[1] / rows[0][1] * 100).toFixed(0) + '%"></span></span><span class="hb__v">' + r[1] + '</span></div>'; }).join('');

    // applications
    $('[data-app-count]').textContent = newApps + ' new';
    $('[data-apps]').innerHTML = apps.slice(0, 9).map(function (a) {
      return '<tr><td><strong>' + UI.esc(a.name) + '</strong><br><span class="hq-muted">' + UI.esc(a.country) + ' · ' + day(a.date) + '</span></td><td>' + a.exp + '</td><td>' + UI.esc(a.market) + '</td><td>' + UI.esc(a.size) + '</td><td>' + UI.esc(a.goal) + '</td><td><span class="st st--' + a.status.replace(/\s/g, '') + '">' + a.status + '</span></td>' +
        '<td><div class="hq-act"><button type="button" data-app="' + a.ref + '" data-to="Call booked">Book call</button><button type="button" data-app="' + a.ref + '" data-to="Accepted">Accept</button></div></td></tr>';
    }).join('');

    // bootcamps
    $('[data-camp-total]').textContent = seats + ' seats sold';
    $('[data-camps]').innerHTML = KF.tour.map(function (t) { var sold = t.seats - t.left; return '<div class="hb"><span>' + t.city + ' <span class="hq-muted">' + t.dates + '</span></span><span class="hb__t"><span style="width:' + (sold / t.seats * 100).toFixed(0) + '%"></span></span><span class="hb__v">' + sold + '/' + t.seats + '</span></div>'; }).join('');

    // posted setups
    $('[data-posted]').innerHTML = db.own.setups.slice(0, 4).map(function (s) { return '<li><strong>' + UI.esc(s.dir + ' ' + s.pair) + '</strong> · Entry ' + UI.esc(s.entry) + ' · Stop ' + UI.esc(s.stop) + ' · TP ' + UI.esc(s.tp) + ' <span class="hq-muted">' + new Date(s.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '</span></li>'; }).join('');

    orderTable();
    // desk insights (sample)
    var qs = [['How much is the Trading Room?', 148], ['I am a complete beginner', 121], ['Next bootcamp?', 96], ['Which broker do I need?', 74], ['Do you guarantee profit?', 52], ['How do I join mentorship?', 41]];
    $('[data-desk]').innerHTML = qs.map(function (q) { return '<div class="hb"><span>' + q[0] + '</span><span class="hb__t"><span style="width:' + (q[1] / qs[0][1] * 100).toFixed(0) + '%"></span></span><span class="hb__v">' + q[1] + '</span></div>'; }).join('');
    // next live
    var d2 = new Date(); for (var j = 0; j < 8; j++) { var c = new Date(Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate() + j, 19, 0)); if ((c.getUTCDay() === 2 || c.getUTCDay() === 4) && c > d2) { $('[data-hq-next]').textContent = c.toLocaleDateString('en-GB', { weekday: 'long' }) + ', ' + c.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); break; } }
  }

  function orderTable() {
    var q = ($('[data-order-q]').value || '').toLowerCase();
    var list = S.allOrders().filter(function (o) { return !q || (o.name + ' ' + o.ref).toLowerCase().indexOf(q) > -1; }).slice(0, 12);
    $('[data-orders]').innerHTML = list.map(function (o) { var it = S.item(o.item) || { name: o.item }; return '<tr><td class="nw">' + o.ref + '</td><td class="nw">' + day(o.date) + '</td><td>' + UI.esc(o.name) + '<br><span class="hq-muted">' + UI.esc(o.country || '') + '</span></td><td>' + it.name + '</td><td>' + o.method + '</td><td class="r">' + money(o.usd) + '</td><td><span class="st st--' + o.status.replace(/\s/g, '') + '">' + o.status + '</span></td></tr>'; }).join('') || '<tr><td colspan="7" class="hq-muted">No orders match.</td></tr>';
  }

  render();
  $('[data-order-q]').addEventListener('input', orderTable);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-app]'); if (b) { S.setApp(b.getAttribute('data-app'), b.getAttribute('data-to')); render(); UI.toast('Application ' + b.getAttribute('data-to').toLowerCase()); return; }
    var t = e.target.closest('[data-view]'); if (t) { var v = t.getAttribute('data-view'); $$('[data-view]').forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); }); $('[data-chart]').hidden = v !== 'chart'; $('[data-table]').hidden = v !== 'table'; }
  });
  $('[data-setup-form]').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target;
    if (!f.entry.value || !f.stop.value || !f.tp.value) { $('[data-setup-msg]').textContent = 'Add the entry, stop and first target.'; return; }
    S.postSetup({ pair: f.pair.value, dir: f.dir.value, entry: f.entry.value, stop: f.stop.value, tp: f.tp.value });
    f.reset(); $('[data-setup-msg]').textContent = 'Sent. Members see it in the Atelier now.'; render(); UI.toast('Setup sent to members');
  });
  // tooltip on chart bars
  var tip = document.createElement('div'); tip.className = 'hq-tip'; document.body.appendChild(tip);
  document.addEventListener('pointermove', function (e) { var r = e.target.closest && e.target.closest('[data-tip]'); if (r) { tip.textContent = r.getAttribute('data-tip'); tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY - 34) + 'px'; tip.style.opacity = 1; } else tip.style.opacity = 0; });
  // section highlight
  var links = $$('.hq-nav a');
  window.addEventListener('scroll', function () { var y = window.scrollY + 120, on = links[0]; links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s && s.offsetTop <= y) on = a; }); links.forEach(function (a) { a.classList.toggle('is-on', a === on); }); }, { passive: true });
  S.onChange = render;
})();
