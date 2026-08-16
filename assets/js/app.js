/* ═══════════════════════════════════════════════════════════════
   جمعية طاقات الشبابية — منطق صفحة التبرّع
   المحتوى كله موجود في HTML. هذا الملف يضيف التفاعل فقط،
   فإن تعطّل السكربت تبقى الصفحة كاملة ومقروءة.
   ⚑ الأرقام القابلة للتعديل في UNITS و CONFIG أدناه.
   ═══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

/* ⚠️ تكاليف مبدئية للعرض — استبدلها بمتوسط التكلفة الفعلية لدى الجمعية.
   sg مفرد مرفوع · du مثنى · few جمع ٣–١٠ · acc مفرد منصوب ١١+ */
const UNITS = {
  baqi:    { prog:'مبنى الصدقة الجارية', cost:100, sg:'لبنة',        du:'لبنتان',        few:'لبنات',         acc:'لبنة',          accDu:'لبنتين' },
  maather: { prog:'مآثر',               cost:250, sg:'نشاط ثقافي',  du:'نشاطان ثقافيان', few:'أنشطة ثقافية',  acc:'نشاطًا ثقافيًا', accDu:'نشاطين ثقافيين' },
  clubs:   { prog:'الأندية الشبابية',    cost:320, sg:'شهر لفتى',    du:'شهران لفتى',    few:'أشهر لفتى',     acc:'شهرًا لفتى',    accDu:'شهرين لفتى' },
  girls:   { prog:'نادي الفتيات',        cost:380, sg:'أسبوع لفتاة', du:'أسبوعان لفتاة', few:'أسابيع لفتاة',  acc:'أسبوعًا لفتاة', accDu:'أسبوعين لفتاة' },
  summer:  { prog:'صيفك وجهة',           cost:450, sg:'أسبوع صيفي',  du:'أسبوعان صيفيان', few:'أسابيع صيفية', acc:'أسبوعًا صيفيًا', accDu:'أسبوعين صيفيين' },
  rusookh: { prog:'رسوخ',                cost:600, sg:'مقعد تدريبي', du:'مقعدان تدريبيان', few:'مقاعد تدريبية', acc:'مقعدًا تدريبيًا', accDu:'مقعدين تدريبيين' },
  sufara:  { prog:'سفراء مكة',           cost:900, sg:'سفير مؤهَّل',  du:'سفيران مؤهَّلان', few:'سفراءَ مؤهَّلين', acc:'سفيرًا مؤهَّلًا', accDu:'سفيرين مؤهَّلين' },
};

const CONFIG = {
  min: 10, max: 1000000, start: 300,
  gateway: '',            // ضع رابط بوابة الدفع هنا ليُستخدم بدل النموذج التجريبي
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nf = new Intl.NumberFormat('en-US');
const money = n => nf.format(Math.round(n));
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ── تمييز العدد ── */
const isFew = n => { const t = n % 100; return t >= 3 && t <= 10; };
const phrase = (n, u) => n === 1 ? u.acc : n === 2 ? u.accDu : `${money(n)} ${isFew(n) ? u.few : u.acc}`;

/* ── الحالة ── */
const S = { dest: 'general', prog: 'maather', freq: 'once', amount: CONFIG.start };

const destName = () =>
  S.dest === 'baqi' ? 'الصدقة الجارية'
: S.dest === 'program' ? UNITS[S.prog].prog
: 'أينما تشتد الحاجة';

/* الوحدة المعروضة تتبع ما اختاره المتبرّع، لا الأرخص */
function pool() {
  if (S.dest === 'baqi') return [UNITS.baqi];
  if (S.dest === 'program') return [UNITS[S.prog]];
  return Object.entries(UNITS).filter(([k]) => k !== 'baqi').map(([, v]) => v);
}
function best(amount) {
  for (const u of [...pool()].sort((a, b) => b.cost - a.cost)) {
    const n = Math.floor(amount / u.cost);
    if (n >= 1) return { u, n };
  }
  return null;
}
const cheapest = () => pool().reduce((a, b) => (b.cost < a.cost ? b : a));

/* ── لوحة التبرّع ── */
function sync() {
  const b = best(S.amount), c = cheapest();
  $('#says').innerHTML = b
    ? `يقارب <b>${phrase(b.n, b.u)}</b> في «${b.u.prog}»`
    : `يُسهم مع غيره في إقامة <b>${c.sg}</b> في «${c.prog}»`;
  $('#payAmt').textContent = money(S.amount);
  $('#barAmt').textContent = money(S.amount);
  $('#barMeta').textContent = destName() + (S.freq === 'monthly' ? ' · كل شهر' : '');
  $('#pickWrap').hidden = S.dest !== 'program';
}

function pickTab(box, btn) {
  $$('button', box).forEach(b => {
    const on = b === btn;
    b.classList.toggle('on', on);
    if (b.getAttribute('role') === 'radio') b.setAttribute('aria-checked', String(on));
    else if (b.hasAttribute('role')) b.setAttribute('aria-selected', String(on));
  });
}

function markProg() {
  pickTab($('#pick'), $(`#pick button[data-p="${S.prog}"]`));
}

function setDest(dest, prog) {
  S.dest = dest;
  if (prog) { S.prog = prog; markProg(); }
  pickTab($('#dest'), $(`#dest button[data-dest="${dest}"]`));
  sync();
}

function toGive() {
  $('#give').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
}

/* ── عدّاد الأرقام الدوّار ── */
function roll(el, value) {
  const s = money(value);
  const cells = $$('.dg', el);
  const shape = cells.map(c => c.classList.contains('dg--sep') ? ',' : 'd').join('');
  const want = [...s].map(ch => ch === ',' ? ',' : 'd').join('');

  if (shape !== want) {
    el.innerHTML = [...s].map(ch => ch === ','
      ? '<span class="dg dg--sep">,</span>'
      : '<span class="dg"><span class="col">' +
        '0123456789'.split('').map(d => `<i>${d}</i>`).join('') + '</span></span>'
    ).join('');
  }
  let i = 0;
  $$('.dg', el).forEach(cell => {
    const ch = s[i++];
    if (cell.classList.contains('dg--sep')) return;
    const col = $('.col', cell);
    if (col) col.style.transform = `translateY(${-(+ch) * 1.16}em)`;
  });
}

/* ── الحاسبة ── */
const calc = { amount: 1000 };
function renderCalc() {
  const r = $('#dial');
  const pct = (calc.amount - r.min) / (r.max - r.min) * 100;
  $('#dialFill').style.setProperty('--f', Math.max(1.5, pct) + '%');
  roll($('#roll'), calc.amount);
  $('#rollSr').textContent = money(calc.amount) + ' ريال';

  renderSpread();
}

/* ترتيب الأبواب من الأرخص إلى الأغلى، فيُضيء الواحد تلو الآخر كلما ارتفع المبلغ */
const SPREAD = Object.entries(UNITS)
  .map(([id, u]) => ({ id, u, name: id === 'baqi' ? 'المبنى' : u.prog }))
  .sort((a, b) => a.u.cost - b.u.cost);

let spreadBuilt = false;
function renderSpread() {
  const box = $('#spread');
  if (!box) return;

  if (!spreadBuilt) {
    box.innerHTML = SPREAD.map(s =>
      `<div class="sp" data-id="${s.id}">
         <span class="sp__p">${s.name}</span>
         <span class="sp__n" data-n="0">0</span>
         <span class="sp__u"></span>
       </div>`).join('');
    spreadBuilt = true;
  }

  const words = [];
  SPREAD.forEach(s => {
    const cell = $(`.sp[data-id="${s.id}"]`, box);
    const n = Math.floor(calc.amount / s.u.cost);
    const numEl = $('.sp__n', cell), uEl = $('.sp__u', cell);
    const was = +numEl.dataset.n;

    numEl.dataset.n = n;
    uEl.textContent = n === 0 ? s.u.sg : (n === 1 ? s.u.sg : n === 2 ? s.u.du : isFew(n) ? s.u.few : s.u.acc);
    cell.classList.toggle('sp--off', n === 0);

    /* ومضة صغيرة في اللحظة التي يُضيء فيها بابٌ جديد */
    if (was === 0 && n > 0 && !RM.matches) {
      cell.classList.remove('sp--lit'); void cell.offsetWidth; cell.classList.add('sp--lit');
    }
    tickTo(numEl, n, was);
    if (n > 0) words.push(`${s.name}: ${phrase(n, s.u)}`);
  });

  /* ملخّص نصّي لقارئ الشاشة — الشبكة وحدها لا تُقرأ جيدًا */
  $('#reckonOut').textContent = words.length
    ? `${money(calc.amount)} ريال تُقيم: ` + words.join('، ')
    : `${money(calc.amount)} ريال يُسهم مع غيره في إقامة وحدة كاملة.`;
}

/* عدّ متدرّج — والقيمة النهائية تُكتب أولًا فلا تعلق على صفر أبدًا */
function tickTo(el, to, from) {
  el.textContent = money(to);
  if (RM.matches || to === from || Math.abs(to - from) > 4000) return;
  const t0 = performance.now(), dur = 420;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = money(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── شاشة الشكر ── */
function thanks() {
  const b = best(S.amount), c = cheapest();
  $('#thanksMsg').innerHTML = b
    ? `دعمكم أسهم في إقامة <b>${phrase(b.n, b.u)}</b> في «${b.u.prog}»${S.freq === 'monthly' ? '، كل شهر' : ''}.<br>جزاكم الله خيرًا وجعلها في ميزان حسناتكم.`
    : `دعمكم أسهم في إقامة <b>${c.sg}</b> في «${c.prog}».<br>جزاكم الله خيرًا وجعلها في ميزان حسناتكم.`;
  $('#thanksRef').textContent = 'TQ-' + Date.now().toString(36).toUpperCase().slice(-7);
  $('#thanks').hidden = false;
  document.body.classList.add('stop');
  burst();
}

function burst() {
  if (RM.matches) return;
  const cv = $('#fx'), ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  const cols = ['#d22f73', '#80c348', '#e8a045', '#186ca6', '#33b9c3', '#f3cd7d'];
  const ps = Array.from({ length: 120 }, () => ({
    x: W * .5 + (Math.random() - .5) * W * .3, y: H * .38,
    vx: (Math.random() - .5) * 9 * dpr, vy: (Math.random() * -12 - 3) * dpr,
    g: (.2 + Math.random() * .12) * dpr, s: (4 + Math.random() * 7) * dpr,
    r: Math.random() * 6.28, vr: (Math.random() - .5) * .24,
    c: cols[(Math.random() * cols.length) | 0], a: 1,
  }));
  const t0 = performance.now();
  (function loop(t) {
    ctx.clearRect(0, 0, W, H);
    let live = 0;
    for (const p of ps) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (t - t0 > 1400) p.a = Math.max(0, p.a - .013);
      if (p.a > 0 && p.y < H + 60) live++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (live) requestAnimationFrame(loop);
  })(t0);
}

/* ── الصفائح ── */
let lastFocus = null;
const openSheet = id => {
  lastFocus = document.activeElement;
  const el = $('#' + id);
  el.hidden = false; document.body.classList.add('stop');
  (el.querySelector('button,select,input,a') || el).focus({ preventScroll: true });
};
const shutSheet = el => {
  el.hidden = true;
  if (!$('.sheet:not([hidden]), .thanks:not([hidden])')) document.body.classList.remove('stop');
  lastFocus && lastFocus.focus({ preventScroll: true });
};

/* ═══ الإقلاع ═══ */
/* التعديلات المعتمدة من لوحة التحرير (editor.html).
   النصوص الأصلية موجودة في HTML، فإن غاب هذا كله تبقى الصفحة كاملة. */
function applyEdits() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem('taqat.content.v1') || '{}'); } catch (_) { return; }
  if (!saved || typeof saved !== 'object') return;
  /* هجرةٌ لمرّة واحدة تنظّف قيمًا محفوظة صارت تُفسد الصفحة بعد تغيّر بنيتها:
     ① جملة فاصلة محفوظة فارغة من قبل إضافتها، تُفرّغ السطر وتطوي الحقل في كل تحميل.
     ② سطر طرق الدفع: صار فقرةً فيها رسوم العلامات، وحقل التحرير انتقل إلى ‎.give__safe-t‎،
        فالقيمة القديمة على الفقرة كلها تمحو الرسوم وتعيدها نصًّا عاديًّا.
     ③ عنوان المبنى: كان جزأين (أبيض وذهبي)، وصار سطرًا واحدًا، فقيمتا الجزأين لا محلّ لهما.
     بعدها يعود نصّ HTML مرجعًا، ويظلّ التحرير من اللوحة عاملًا كما هو. */
  const FIXED = 'taqat.content.fix.v3';
  if (!localStorage.getItem(FIXED)) {
    /* تُقرأ النسخة الأحدث لحظة الكتابة، لئلّا تُمحى تعديلاتٌ حُفظت من لوحة التحرير
       في تبويب آخر بعد إقلاع هذه الصفحة */
    let now = saved;
    try { now = JSON.parse(localStorage.getItem('taqat.content.v1') || '{}') || saved; } catch (_) {}
    if (!String(now['.bridge'] || '').trim()) { delete now['.bridge']; delete now['.bridge::one']; }
    delete now['.give__safe']; delete now['.give__safe::one'];
    delete now['.baqi__h em']; delete now['.baqi__h em::one'];
    try {
      localStorage.setItem('taqat.content.v1', JSON.stringify(now));
      localStorage.setItem(FIXED, '1');
    } catch (_) {}
    saved = now;
  }
  const tags = saved.__tags || {};
  const keys = Object.keys(saved).filter(k => k !== '__tags');
  if (!keys.length) return;
  const modeOf = sel => {
    const list = window.TAQAT_FIELDS || [];
    for (const g of list) for (const f of g.f) if (f.sel === sel) return f.mode;
    return undefined;
  };
  keys.forEach(k => {
    if (k.endsWith('::one')) {
      const el = $(k.slice(0, -5));
      /* الصنف يتيح للتنسيق أن يوسّع قياس السطر الواحد، وإلا فاض النص من حافّته */
      if (el) { el.style.whiteSpace = 'nowrap'; el.classList.add('is-oneline'); }
      return;
    }
    const el = $(k);
    if (!el) return;
    const mode = modeOf(k);
    if (mode === 'first' || mode === 'text') {
      const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
      if (t.length) { t[0].textContent = saved[k]; t.slice(1).forEach(n => (n.textContent = '')); }
    } else {
      const tg = tags[k] || [];
      el.innerHTML = String(saved[k]).split('\n')
        .map((s, i) => { s = s.trim(); return tg[i] ? '<' + tg[i] + '>' + s + '</' + tg[i] + '>' : s; })
        .join('<br>');
    }
  });
}

/* الصفحة مفتوحة في تبويب ولوحة التحرير في تبويب آخر: حدث التخزين يصل من التبويب الآخر
   وحده، فتُعيد الصفحة بناءها ويظهر التعديل بلا تحديث يدوي.
   المعاينة داخل اللوحة مستثناة — اللوحة تُحدّثها مباشرةً في أثناء الكتابة. */
if (window.top === window.self) {
  addEventListener('storage', e => {
    if (e.key === 'taqat.content.v1' || e.key === null) location.reload();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyEdits();
  $('#yr').textContent = new Date().getFullYear();

  /* التبويبات */
  $$('#dest button').forEach(b => b.addEventListener('click', () => {
    pickTab($('#dest'), b); S.dest = b.dataset.dest; sync();
  }));
  $$('#freq button').forEach(b => b.addEventListener('click', () => {
    pickTab($('#freq'), b); S.freq = b.dataset.freq; sync();
  }));
  $$('#pick button').forEach(b => b.addEventListener('click', () => {
    S.prog = b.dataset.p; markProg(); sync();
  }));
  markProg();

  /* المبالغ */
  const amts = $('#amts'), freeWrap = $('#freeWrap'), freeAmt = $('#freeAmt');
  $$('button', amts).forEach(b => b.addEventListener('click', () => {
    $$('button', amts).forEach(x => x.classList.toggle('on', x === b));
    if (b.dataset.amt === 'free') {
      freeWrap.hidden = false; freeAmt.focus();
      const v = +freeAmt.value.replace(/\D/g, ''); if (v) S.amount = v;
    } else { freeWrap.hidden = true; S.amount = +b.dataset.amt; }
    sync();
  }));
  freeAmt.addEventListener('input', e => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 7);
    e.target.value = raw ? money(+raw) : '';
    const v = +raw;
    if (v >= CONFIG.min && v <= CONFIG.max) { S.amount = v; sync(); }
  });

  /* أزرار البرامج */
  $$('[data-prog]').forEach(b => b.addEventListener('click', () => {
    setDest('program', b.dataset.prog); toGive();
  }));
  $$('[data-dest-go]').forEach(b => b.addEventListener('click', () => {
    setDest(b.dataset.destGo); toGive();
  }));
  $$('[data-give]').forEach(b => b.addEventListener('click', toGive));

  /* الحاسبة: الشريط + المبالغ الجاهزة + المبلغ الحرّ، ثلاثتها تحرّك رقمًا واحدًا */
  const dial = $('#dial'), steps = $('#steps'), ownWrap = $('#ownWrap'), ownAmt = $('#ownAmt'),
        ownBtn = $('.steps__own');

  const markStep = () => $$('button', steps).forEach(b =>
    b.classList.toggle('on', b !== ownBtn && +b.dataset.step === calc.amount));

  const setCalc = (v, { fromOwn = false } = {}) => {
    calc.amount = Math.min(CONFIG.max, Math.max(CONFIG.min, v));
    dial.value = Math.min(+dial.max, Math.max(+dial.min, calc.amount));
    renderCalc();
    if (!fromOwn) markStep();
  };

  dial.addEventListener('input', () => {
    calc.amount = +dial.value;
    renderCalc(); markStep();
    if (!ownWrap.hidden) ownAmt.value = money(calc.amount);
  });

  $$('button', steps).forEach(b => b.addEventListener('click', () => {
    if (b.dataset.step === 'own') {
      const open = ownWrap.hidden;
      ownWrap.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.classList.toggle('on', open);
      if (open) { ownAmt.value = money(calc.amount); ownAmt.focus(); ownAmt.select(); }
      return;
    }
    ownWrap.hidden = true; ownBtn.classList.remove('on'); ownBtn.setAttribute('aria-expanded', 'false');
    setCalc(+b.dataset.step);
  }));

  ownAmt.addEventListener('input', e => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 7);
    e.target.value = raw ? money(+raw) : '';
    const v = +raw;
    if (v >= CONFIG.min) { setCalc(v, { fromOwn: true }); $$('button', steps).forEach(b => b.classList.toggle('on', b === ownBtn)); }
  });

  renderCalc(); markStep();
  $('#reckonGo').addEventListener('click', () => {
    S.amount = calc.amount;
    const hit = $$('button', amts).find(x => +x.dataset.amt === S.amount);
    $$('button', amts).forEach(x => x.classList.remove('on'));
    if (hit) { hit.classList.add('on'); freeWrap.hidden = true; }
    else { $('.amts__free').classList.add('on'); freeWrap.hidden = false; freeAmt.value = money(S.amount); }
    sync(); toGive();
  });

  /* الأسئلة */
  $$('.qi__q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement, open = item.classList.contains('on');
    $$('.qi').forEach(x => { x.classList.remove('on'); $('.qi__q', x).setAttribute('aria-expanded', 'false'); });
    if (!open) { item.classList.add('on'); q.setAttribute('aria-expanded', 'true'); }
  }));

  /* الدفع */
  $('#pay').addEventListener('click', () => {
    if (!(S.amount >= CONFIG.min)) { freeAmt.focus(); return; }
    if (CONFIG.gateway) { location.href = CONFIG.gateway; return; }
    $('#recap').innerHTML =
      `<div><dt>الوجهة</dt><dd>${destName()}</dd></div>
       <div><dt>التكرار</dt><dd>${S.freq === 'monthly' ? 'كل شهر' : 'مرّة واحدة'}</dd></div>
       <div class="tot"><dt>${S.freq === 'monthly' ? 'شهريًا' : 'المبلغ'}</dt><dd>${money(S.amount)} ريال</dd></div>`;
    openSheet('paySheet');
  });
  $$('#pm button').forEach(b => b.addEventListener('click', () => pickTab($('#pm'), b)));
  $('#payGo').addEventListener('click', () => { shutSheet($('#paySheet')); setTimeout(thanks, 160); });

  /* الجملة الفاصلة إن أُفرغت من المحرّر: يُطوى حقلها بالكامل.
     CSS يتكفّل بذلك عبر :has، وهذا احتياط للمتصفحات التي لا تدعمه
     ولحالة المسافات البيضاء التي لا يلتقطها :empty */
  const bridge = $('.bridge'), bridgeBand = $('.bridgeband');
  if (bridge && bridgeBand) {
    const progs = $('#programs');
    const syncBridge = () => {
      const empty = !bridge.textContent.trim();
      bridgeBand.classList.toggle('is-empty', empty);
      progs && progs.classList.toggle('progs--nobridge', empty);
    };
    syncBridge();
    new MutationObserver(syncBridge).observe(bridge, { childList: true, characterData: true, subtree: true });
  }

  /* شعار شريك مفقود → يُعرض اسمه نصًّا بدل مربّع مكسور */
  $$('.allies__l img').forEach(img => {
    const li = img.parentElement;
    const miss = () => li.classList.add('noimg');
    img.addEventListener('error', miss);
    if (img.complete && !img.naturalWidth) miss();
  });

  /* الصور الاختيارية: الترخيص وصورة المبنى — لا تظهر أبدًا مكسورة */
  [['#licImg', '#licBox'], ['#bldImg', '#bldShot']].forEach(([i, b]) => {
    const img = $(i), box = $(b);
    if (!img || !box) return;
    img.addEventListener('load', () => box.classList.add('has'));
    img.addEventListener('error', () => box.classList.add('none'));
    if (img.complete) box.classList.add(img.naturalWidth ? 'has' : 'none');
  });
  $$('#seeLic,[data-see-lic]').forEach(b => b.addEventListener('click', () => openSheet('licSheet')));

  /* الإغلاق */
  $$('[data-x]').forEach(b => b.addEventListener('click', e => shutSheet(e.target.closest('.sheet'))));
  $$('[data-close-thanks]').forEach(b => b.addEventListener('click', () => {
    $('#thanks').hidden = true; document.body.classList.remove('stop');
  }));
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const s = $('.sheet:not([hidden])');
    if (s) return shutSheet(s);
    if (!$('#thanks').hidden) { $('#thanks').hidden = true; document.body.classList.remove('stop'); }
  });

  /* المشاركة */
  $('#share').addEventListener('click', async () => {
    const d = { title: 'جمعية طاقات الشبابية',
                text: 'دعمتُ برامج شباب مكة عبر جمعية طاقات الشبابية.',
                url: location.origin + location.pathname };
    try { if (navigator.share) return void await navigator.share(d); } catch (_) {}
    try { await navigator.clipboard.writeText(d.text + ' ' + d.url); } catch (_) {}
  });

  /* ═══ الشاشة: تشتغل وحدها عند ظهورها، وتتوقّف متى شئت ═══ */
  const vid = $('#vid'), screen = $('#screen');
  let closed = false;                       // أغلقها المستخدم → لا تعاود التشغيل تلقائيًا
  const SRC = 'assets/video/impact.mp4';

  /* الحالة تُنقل عبر تسمية الزرّ وشكله، بلا نصّ معروض */
  const setState = s => {
    screen.dataset.state = s;
    $('#vidToggle').setAttribute('aria-label', s === 'playing' ? 'إيقاف مؤقت' : 'تشغيل');
  };

  const start = () => {
    if (!vid.src) vid.src = SRC;
    /* المتصفحات لا تسمح بالتشغيل التلقائي إلا صامتًا */
    vid.muted = true;
    return vid.play().then(() => setState('playing'))
                     .catch(() => setState('idle'));   // مُنع التشغيل → يبقى زرّ التشغيل ظاهرًا
  };

  $('#vidPlay').addEventListener('click', () => { closed = false; start(); });
  $('#vidToggle').addEventListener('click', () => {
    if (vid.paused) { closed = false; start(); }
    else { vid.pause(); setState('paused'); }
  });
  $('#vidStop').addEventListener('click', () => {
    closed = true; vid.pause(); vid.currentTime = 0; setState('idle');
  });
  vid.addEventListener('play',  () => setState('playing'));
  vid.addEventListener('pause', () => { if (screen.dataset.state === 'playing') setState('paused'); });

  /* تشتغل حين تدخل الشاشة، وتتوقّف حين تخرج — بلا استهلاك بلا داعٍ.
     ومع تفضيل تقليل الحركة لا تشتغل تلقائيًا إطلاقًا. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { if (!closed && !RM.matches) start(); }
      else if (!vid.paused) { vid.pause(); setState('paused'); }
    }), { threshold: .45 }).observe(screen);
  }
  setState('idle');

  /* الشريط الثابت + دوران الدوّار مع التمرير */
  const give = $('#give'), bar = $('#bar'), ring = $('.wheel__ring'), sign = $('.foot__sign');
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const past = give.getBoundingClientRect().bottom < 0;
      /* ينزوي قبل أن يبلغ توقيع التذييل فلا يحجب اسم الجمعية */
      const atSign = sign && sign.getBoundingClientRect().top < innerHeight - 6;
      bar.classList.toggle('on', past && !atSign && $('#thanks').hidden && !$('.sheet:not([hidden])'));
      if (ring && !RM.matches) ring.style.setProperty('--spin', (scrollY * .06).toFixed(2) + 'deg');
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* العودة من بوابة الدفع */
  if (new URLSearchParams(location.search).get('status') === 'success') thanks();

  sync();
});
})();
