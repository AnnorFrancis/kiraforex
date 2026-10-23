/* Kira Forex: the sample business database (localStorage).
   Seeds believable SAMPLE members, orders and applications relative to today, so the student area and
   Kira HQ always look alive on camera. Real orders placed on the site are kept as own:true. */
(function () {
  'use strict';
  var KF = window.KF;
  var KEY = 'kf.db.v3';
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }

  var FIRST = ['Ama', 'Kwame', 'Akosua', 'Kofi', 'Efua', 'Yaw', 'Abena', 'Kojo', 'Adjoa', 'Kwesi', 'Chiamaka', 'Tunde', 'Ngozi', 'Emeka', 'Aisha', 'Ifeoma', 'Brenda', 'Samuel', 'Mercy', 'Joel', 'Thandi', 'Sipho', 'Naledi', 'Achieng', 'Wanjiru', 'Grace', 'Fatou', 'Moussa', 'Aminata', 'Esther', 'Daniel', 'Priscilla', 'Rita', 'Selorm', 'Elikem', 'Nana', 'Afia', 'Dela', 'Joyce', 'Prince'];
  var LAST = ['Mensah', 'Owusu', 'Boateng', 'Asante', 'Addo', 'Ofori', 'Agyeman', 'Darko', 'Quaye', 'Tetteh', 'Okafor', 'Adeyemi', 'Eze', 'Balogun', 'Nkosi', 'Dlamini', 'Ndlovu', 'Otieno', 'Kamau', 'Mukasa', 'Nakato', 'Diallo', 'Traore', 'Fofana', 'Mbeki', 'Ansah', 'Amoah', 'Frimpong', 'Acheampong', 'Sarpong'];
  var COUNTRIES = [['Ghana', 38], ['Nigeria', 24], ['Cameroon', 9], ['South Africa', 7], ['United Kingdom', 5], ['Uganda', 5], ['Kenya', 4], ['United Arab Emirates', 4], ['Other', 4]];
  function country(r) { var x = r() * 100, a = 0; for (var i = 0; i < COUNTRIES.length; i++) { a += COUNTRIES[i][1]; if (x < a) return COUNTRIES[i][0]; } return 'Ghana'; }

  KF.catalog = function () {
    var c = {};
    KF.room.forEach(function (p) { c['room-' + p.id] = { id: 'room-' + p.id, kind: 'room', name: 'Trading Room, ' + p.name.toLowerCase(), usd: p.usd, per: p.per }; });
    KF.courses.forEach(function (x) { c['course-' + x.id] = { id: 'course-' + x.id, kind: 'course', name: x.name, usd: x.usd, per: x.length }; });
    KF.tour.forEach(function (t) {
      c['camp-' + t.id] = { id: 'camp-' + t.id, kind: 'camp', name: 'Bootcamp, ' + t.city + ', standard seat', usd: KF.bootcamp.usd, per: t.dates + ' ' + t.year };
      c['camp-' + t.id + '-vip'] = { id: 'camp-' + t.id + '-vip', kind: 'camp', name: 'Bootcamp, ' + t.city + ', VIP seat', usd: KF.bootcamp.vipUsd, per: t.dates + ' ' + t.year };
    });
    return c;
  };

  function seed() {
    var r = rng(20261023), today = new Date(); today.setHours(12, 0, 0, 0);
    var members = [], orders = [], apps = [];
    for (var i = 0; i < 260; i++) {
      var name = pick(r, FIRST) + ' ' + pick(r, LAST);
      var joined = addDays(today, -Math.floor(r() * 420));
      var plan = r() < 0.62 ? 'month' : (r() < 0.6 ? 'quarter' : 'year');
      var active = r() < 0.86;
      members.push({ id: 'M' + (1000 + i), name: name, country: country(r), plan: plan, joined: iso(joined), active: active, course: r() < 0.34 ? pick(r, KF.courses).id : null });
    }
    var cat = KF.catalog(), ids = Object.keys(cat);
    var LAM = 0.0015, SPAN = 1 - Math.exp(-LAM * 360);
    for (var j = 0; j < 760; j++) {
      var d = addDays(today, -Math.floor(-Math.log(1 - r() * SPAN) / LAM));
      var m = members[Math.floor(r() * members.length)];
      var it = r() < 0.66 ? 'room-' + m.plan : (r() < 0.7 ? 'course-' + pick(r, KF.courses).id : 'camp-' + pick(r, KF.tour).id + (r() < 0.25 ? '-vip' : ''));
      orders.push({ ref: 'KF-' + (240000 + j * 7 + Math.floor(r() * 7)), date: iso(d), item: it, name: m.name, country: m.country, usd: cat[it].usd, method: pick(r, ['Mobile Money', 'Mobile Money', 'Card', 'Card', 'Bank transfer']), status: 'Paid' });
    }
    var goals = ['Stop revenge trading after a loss', 'Pass a prop firm challenge', 'Trade gold with a written plan', 'Size positions properly', 'Trade around a full-time job', 'Stop overtrading on Fridays'];
    for (var k = 0; k < 14; k++) {
      apps.push({ ref: 'AP-' + (7100 + k * 3), date: iso(addDays(today, -Math.floor(r() * 18))), name: pick(r, FIRST) + ' ' + pick(r, LAST), country: country(r), exp: pick(r, ['6-12 months', '1-3 years', '3+ years']), market: pick(r, ['Gold (XAUUSD)', 'GBPJPY and the majors', 'Synthetic indices', 'Indices']), size: pick(r, ['$1,000 to $5,000', '$5,000 to $25,000', 'Prop firm account', 'Over $25,000']), goal: pick(r, goals), status: k < 9 ? 'New' : (k < 12 ? 'Call booked' : 'Accepted') });
    }
    return { seeded: iso(today), members: members, orders: orders, apps: apps, own: { orders: [], apps: [], journal: [], setups: [] } };
  }

  function load() {
    var db = null;
    try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    var today = iso(new Date());
    if (!db || db.seeded !== today) { var own = db && db.own; db = seed(); if (own) db.own = own; save(db); }
    return db;
  }
  function save(db) { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }

  var S = window.KFStore = {
    db: load,
    save: save,
    iso: iso,
    item: function (id) { return KF.catalog()[id] || null; },
    placeOrder: function (o) {
      var db = load();
      var ref = 'KF-' + String(Date.now()).slice(-6);
      var rec = { ref: ref, date: iso(new Date()), item: o.item, name: o.name, email: o.email, wa: o.wa, country: o.country, usd: o.usd, method: o.method, status: o.method === 'Bank transfer' ? 'Awaiting transfer' : 'Paid', own: true };
      db.own.orders.unshift(rec); save(db); return rec;
    },
    apply: function (a) {
      var db = load();
      var ref = 'AP-' + String(Date.now()).slice(-5);
      var rec = Object.assign({ ref: ref, date: iso(new Date()), status: 'New', own: true }, a);
      db.own.apps.unshift(rec); save(db); return rec;
    },
    journal: function (entry) { var db = load(); if (entry) { db.own.journal.unshift(Object.assign({ date: iso(new Date()) }, entry)); save(db); } return db.own.journal; },
    postSetup: function (s) { var db = load(); db.own.setups.unshift(Object.assign({ at: new Date().toISOString() }, s)); save(db); return db.own.setups; },
    allOrders: function () { var db = load(); return db.own.orders.concat(db.orders).sort(function (a, b) { return a.date < b.date ? 1 : -1; }); },
    allApps: function () { var db = load(); return db.own.apps.concat(db.apps).sort(function (a, b) { return a.date < b.date ? 1 : -1; }); },
    setApp: function (ref, status) {
      var db = load(); [db.own.apps, db.apps].forEach(function (l) { l.forEach(function (a) { if (a.ref === ref) a.status = status; }); }); save(db);
    }
  };
  window.addEventListener('storage', function (e) { if (e.key === KEY && S.onChange) S.onChange(); });
})();
