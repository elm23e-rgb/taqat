/* ═══════════════════════════════════════════════════════════════
   خريطة النصوص القابلة للتحرير
   ─────────────────────────────────────────────────────────────
   sel     : محدِّد العنصر في الصفحة
   label   : اسمه في لوحة التحرير
   multi   : يسمح بأكثر من سطر (Enter = سطر جديد)
   one     : يُتاح له زرّ «سطر واحد»
   guard   : عنصر يجب ألّا يتداخل معه هذا النص
   max     : حدّ تحذيري لعدد الحروف
   ═══════════════════════════════════════════════════════════════ */
window.TAQAT_FIELDS = [

  { g:'الشريط العلوي', f:[
    { sel:'.nav__links a:nth-child(1)', label:'رابط ١', max:18 },
    { sel:'.nav__links a:nth-child(2)', label:'رابط ٢', max:18 },
    { sel:'.nav__links a:nth-child(3)', label:'رابط ٣', max:18 },
    { sel:'.nav__links a:nth-child(4)', label:'رابط ٤', max:18 },
    { sel:'.nav__go', label:'زر التبرّع', max:14 },
  ]},

  { g:'الواجهة', f:[
    { sel:'.hero__h1', label:'العنوان الرئيسي', multi:1, one:1, guard:'.wheel', max:70,
      note:'السطر الثاني يظهر بلون التوقيع. اضغط Enter لفصل السطرين.' },
    { sel:'.hero__p', label:'السطر التعريفي', multi:1, max:150 },
  ]},

  { g:'لوحة التبرّع', f:[
    { sel:'#giveT', label:'عنوان اللوحة', max:24 },
    { sel:'#dest button:nth-child(1)', label:'وجهة ١', one:1, guard:'#freq', max:24 },
    { sel:'#dest button:nth-child(2)', label:'وجهة ٢', one:1, guard:'#freq', max:24 },
    { sel:'#dest button:nth-child(3)', label:'وجهة ٣', one:1, guard:'#freq', max:24 },
    { sel:'#freq button:nth-child(1)', label:'تكرار ١', max:14 },
    { sel:'#freq button:nth-child(2)', label:'تكرار ٢', max:14 },
    { sel:'#pickLbl label', label:'سؤال اختيار البرنامج', max:30 },
    { sel:'.amts__free', label:'زر المبلغ الحرّ', max:14 },
    /* النصّ وحده قابل للتحرير — علامات وسائل الدفع بجانبه رسومٌ لا نصّ،
       ولو صار الحقل على الفقرة كلّها لمَحاها التحرير وأعادها نصًّا عاديًّا */
    { sel:'.give__safe-t', label:'سطر طرق الدفع', multi:1, max:110 },
  ]},

  { g:'قدّر أثرك', f:[
    { sel:'.reckon__ask', label:'الجملة الافتتاحية', max:26 },
    { sel:'.reckon__cur', label:'كلمة العملة', max:10 },
    { sel:'.steps__own', label:'زر المبلغ الآخر', max:16 },
    { sel:'.own__l', label:'عنوان خانة المبلغ', max:36 },
    { sel:'.own__hint', label:'تنبيه الحدّ الأدنى', max:40 },
    { sel:'#reckonGo', label:'زر الانتقال للتبرّع', max:28 },
    { sel:'.reckon__note', label:'ملاحظة التقدير', multi:1, max:150 },
  ]},

  { g:'البرامج · العنوان', f:[
    { sel:'.progs__t', label:'عنوان القسم', mode:'first', max:22 },
    { sel:'.progs__t span', label:'سطر تحت العنوان', max:60 },
  ]},

  ...[1,2,3,4,5,6].map(i => ({
    g:'البرنامج ' + ['الأول','الثاني','الثالث','الرابع','الخامس','السادس'][i-1],
    f:[
      { sel:`.bands li:nth-child(${i}) .band__no`, label:'السطر الصغير', one:1, max:40 },
      { sel:`.bands li:nth-child(${i}) .band__h`,  label:'اسم البرنامج', one:1, guard:`.bands li:nth-child(${i}) .band__fig`, max:28 },
      { sel:`.bands li:nth-child(${i}) .band__p`,  label:'الوصف', multi:1, max:260 },
      { sel:`.bands li:nth-child(${i}) .band__go`, label:'زر الدعم', mode:'text', one:1, max:22 },
    ]
  })),

  { g:'أرقام «مآثر»', f:[
    { sel:'.bands li:nth-child(1) .band__stats span:nth-child(1)', label:'رقم ١', one:1, max:24 },
    { sel:'.bands li:nth-child(1) .band__stats span:nth-child(2)', label:'رقم ٢', one:1, max:24 },
    { sel:'.bands li:nth-child(1) .band__stats span:nth-child(3)', label:'رقم ٣', one:1, max:24 },
    { sel:'.bands li:nth-child(1) .band__stats span:nth-child(4)', label:'رقم ٤', one:1, max:24 },
  ]},

  { g:'الجسر', f:[
    { sel:'.bridge', label:'الجملة الفاصلة', multi:1, one:1, max:80 },
  ]},

  { g:'المبنى', f:[
    { sel:'.baqi__kicker', label:'السطر الصغير', one:1, max:40 },
    /* العنوان سطرٌ واحد بلون واحد بعد أن حلّ «مبنى الصدقة الجارية» محلّ العنوان المجزّأ */
    { sel:'.baqi__h', label:'العنوان', one:1, guard:'.shot', max:26 },
    { sel:'.baqi__p', label:'الوصف', multi:1, max:230 },
    { sel:'[data-dest-go="baqi"]', label:'زر المساهمة', max:22 },
    { sel:'.baqi__aya', label:'سطر الحديث', one:1, max:80 },
    { sel:'.shot__ph b', label:'اسم الصورة (حين تغيب)', max:30 },
    { sel:'.shot__cap', label:'تعليق الصورة', one:1, max:50 },
  ]},

  { g:'الميدان', f:[
    { sel:'.reel__h', label:'العنوان', multi:1, one:1, guard:'.reel__fig', max:36,
      note:'الجزء بعد Enter يظهر بلون التوقيع.' },
    { sel:'.reel__p', label:'الوصف', multi:1, max:200 },
    { sel:'.reel__meta li:nth-child(1) b', label:'بطاقة ١ · العنوان', max:22 },
    { sel:'.reel__meta li:nth-child(1) span', label:'بطاقة ١ · الوصف', max:26 },
    { sel:'.reel__meta li:nth-child(2) b', label:'بطاقة ٢ · العنوان', max:22 },
    { sel:'.reel__meta li:nth-child(2) span', label:'بطاقة ٢ · الوصف', max:26 },
    { sel:'.reel__meta li:nth-child(3) b', label:'بطاقة ٣ · العنوان', max:22 },
    { sel:'.reel__meta li:nth-child(3) span', label:'بطاقة ٣ · الوصف', max:26 },
    { sel:'.reel__lbl', label:'زر التشغيل', mode:'first', one:1, max:22 },
  ]},

  { g:'الثقة', f:[
    { sel:'.trust__h', label:'العنوان', mode:'first', one:1, max:40 },
    { sel:'.trust__h b', label:'رقم الترخيص', max:10 },
    { sel:'.trust__p', label:'الوصف', multi:1, max:220 },
    { sel:'#seeLic', label:'زر الترخيص', mode:'text', max:26 },
    { sel:'.trust__facts div:nth-child(1) dt', label:'حقيقة ١ · العنوان', max:14 },
    { sel:'.trust__facts div:nth-child(1) dd', label:'حقيقة ١ · النص', multi:1, max:180 },
    { sel:'.trust__facts div:nth-child(2) dt', label:'حقيقة ٢ · العنوان', max:14 },
    { sel:'.trust__facts div:nth-child(2) dd', label:'حقيقة ٢ · النص', multi:1, max:180 },
    { sel:'.trust__facts div:nth-child(3) dt', label:'حقيقة ٣ · العنوان', max:14 },
    { sel:'.trust__facts div:nth-child(3) dd', label:'حقيقة ٣ · النص', multi:1, max:180 },
    { sel:'.allies__t', label:'عنوان الشركاء', max:30 },
  ]},

  { g:'الأسئلة', f:[1,2,3,4,5].flatMap(i => ([
      { sel:`.qi:nth-child(${i}) .qi__q`, label:`سؤال ${i}`, mode:'first', one:1, max:70 },
      { sel:`.qi:nth-child(${i}) .qi__a p`, label:`جواب ${i}`, multi:1, max:420 },
    ])).flat()
  },

  { g:'التذييل', f:[
    { sel:'.foot__col:nth-child(1) h3', label:'عمود ١ · العنوان', max:16 },
    { sel:'.foot__col:nth-child(1) p:nth-of-type(1)', label:'عمود ١ · العنوان البريدي', multi:1, max:90 },
    { sel:'.foot__col:nth-child(2) h3', label:'عمود ٢ · العنوان', max:16 },
    { sel:'.foot__col:nth-child(3) h3', label:'عمود ٣ · العنوان', max:16 },
    { sel:'.foot__col--end h3', label:'عمود ٤ · العنوان', mode:'first', max:14 },
    { sel:'.foot__col--end p', label:'عمود ٤ · النص', multi:1, max:80 },
  ]},

  { g:'نوافذ التأكيد', f:[
    { sel:'#psT', label:'عنوان نافذة الدفع', max:26 },
    { sel:'#payGo', label:'زر الإتمام', max:26 },
    { sel:'#paySheet .sheet__note', label:'ملاحظة نافذة الدفع', multi:1, max:130 },
    { sel:'#lsT', label:'عنوان نافذة الترخيص', max:26 },
    { sel:'#licSheet .sheet__note', label:'ملاحظة الترخيص', multi:1, max:130 },
    { sel:'.thanks__t', label:'عنوان الشكر', one:1, max:40 },
    { sel:'#share', label:'زر المشاركة', max:20 },
    { sel:'[data-close-thanks]', label:'زر العودة', max:24 },
  ]},

];
