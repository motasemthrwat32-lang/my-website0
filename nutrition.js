/* =========================================================
   CAP ELITE — قسم برنامج التغذية (ملف مستقل)
   ========================================================= */
(function () {
"use strict";
if (window.__CAP_NUT__) return;
window.__CAP_NUT__ = true;

function boot() {
  const mainEl = document.querySelector(".main");
  if (!mainEl) return;

  /* ---------------- أدوات ---------------- */
  const $q = (s, r) => (r || document).querySelector(s);
  const $qa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? (d || 0) : n; };
  const fmt = v => String(Math.round(v * 10) / 10);
  const fmt0 = v => String(Math.round(v));
  const safeName = v => String(v || "").trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-") || "client";
  const norm = s => String(s || "").toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[\u064B-\u0652]/g, "").trim();
  const toast = m => { try { if (typeof window.toast === "function") window.toast(m); } catch (e) {} };
  const coachName = () => { const el = $q(".js-coach"); return (el && el.textContent.trim()) || "COACH"; };
  const mainClient = () => { const el = document.getElementById("clientName"); return el ? el.value.trim() : ""; };
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const IN_APP = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Snapchat|Twitter|Line\//i.test(navigator.userAgent);

  /* ---------------- قاعدة الأصناف (لكل 100 جم) ---------------- */
  const CATS = { prot: "بروتين", carb: "نشويات وعيش", legu: "فول وبقوليات", dairy: "ألبان وجبن", veg: "خضار وسلطة", fruit: "فواكه", fat: "دهون ومكسرات", other: "إضافات وسكريات", mine: "أصنافي" };
  const F = [
    ["egg", "بيض كامل", "prot", 143, 12.6, 0.7, 9.5, 100, "بيضة", 50],
    ["eggw", "بياض بيض", "prot", 52, 10.9, 0.7, 0.2, 100, "بياضة", 33],
    ["chk", "صدور فراخ مشوية", "prot", 165, 31, 0, 3.6, 150],
    ["quarter", "ربع فراخ مشوي (لحم صافي)", "prot", 190, 27, 0, 9, 200, "ربع فراخ", 200],
    ["chkthigh", "وراك فراخ مشوية بدون جلد", "prot", 209, 26, 0, 11, 150],
    ["turkey", "صدور ديك رومي", "prot", 135, 30, 0, 1, 150],
    ["beef", "لحم بقري مشوي", "prot", 217, 26, 0, 12, 150],
    ["kofta", "كفتة مشوية", "prot", 230, 22, 3, 14, 150],
    ["liver", "كبدة مشوية", "prot", 175, 27, 4, 5, 120],
    ["tilapia", "سمك بلطي مشوي", "prot", 128, 26, 0, 2.7, 200],
    ["salmon", "سلمون مشوي", "prot", 208, 20, 0, 13, 150],
    ["shrimp", "جمبري مسلوق", "prot", 99, 24, 0.2, 0.3, 150],
    ["tuna", "تونة معلبة بالماء", "prot", 116, 26, 0, 1, 120],
    ["whey", "بروتين واي (سكوب)", "prot", 400, 80, 8, 6, 30, "سكوب", 30],
    ["rice", "أرز أبيض مسلوق", "carb", 130, 2.7, 28, 0.3, 150],
    ["basmati", "أرز بسمتي مسلوق", "carb", 121, 3.5, 25, 0.4, 150],
    ["brown", "أرز بني مسلوق", "carb", 123, 2.7, 26, 1, 150],
    ["pasta", "مكرونة مسلوقة", "carb", 158, 5.8, 31, 0.9, 150],
    ["potato", "بطاطس مسلوقة", "carb", 87, 1.9, 20, 0.1, 200],
    ["sweetp", "بطاطا مشوية", "carb", 90, 2, 21, 0.2, 200],
    ["bulgur", "برغل مسلوق", "carb", 83, 3, 19, 0.2, 150],
    ["baladi", "عيش بلدي", "carb", 265, 9, 55, 1.5, 80, "رغيف", 80],
    ["fino", "عيش فينو", "carb", 280, 9, 55, 2, 55, "رغيف", 55],
    ["toastb", "توست أسمر", "carb", 250, 10, 43, 3.5, 56, "شريحة", 28],
    ["toastw", "توست أبيض", "carb", 265, 9, 49, 3.2, 56, "شريحة", 28],
    ["oats", "شوفان (وزن جاف)", "carb", 389, 17, 66, 7, 50],
    ["cornf", "كورن فليكس", "carb", 357, 7, 84, 0.4, 40],
    ["foul", "فول مدمس", "legu", 110, 7.6, 19, 0.4, 150],
    ["falafel", "طعمية (فلافل)", "legu", 333, 13, 32, 18, 100, "قرص", 25],
    ["lentil", "عدس مطبوخ", "legu", 116, 9, 20, 0.4, 150],
    ["chickpea", "حمص مسلوق", "legu", 164, 8.9, 27, 2.6, 100],
    ["beans", "فاصوليا بيضاء مطبوخة", "legu", 139, 9.7, 25, 0.5, 150],
    ["lobia", "لوبيا مطبوخة", "legu", 116, 7, 21, 0.5, 150],
    ["cottage", "جبنة قريش", "dairy", 90, 12, 3, 3, 100],
    ["fetaLow", "جبنة بيضاء قليلة الدسم", "dairy", 160, 18, 3, 8, 80],
    ["feta", "جبنة بيضاء (تلاجة)", "dairy", 264, 14, 4, 21, 50],
    ["ras", "جبنة رومي", "dairy", 380, 26, 2, 30, 40, "شريحة", 20],
    ["triangle", "جبنة مثلثات", "dairy", 250, 11, 6, 20, 36, "مثلث", 18],
    ["mozz", "جبنة موتزاريلا", "dairy", 254, 24, 3, 16, 50],
    ["milk", "لبن كامل الدسم", "dairy", 61, 3.2, 4.8, 3.3, 250, "كوب", 250],
    ["milkSkim", "لبن خالي الدسم", "dairy", 34, 3.4, 5, 0.1, 250, "كوب", 250],
    ["yogurt", "زبادي عادي", "dairy", 61, 3.5, 4.7, 3.3, 170, "علبة", 170],
    ["greek", "زبادي يوناني قليل الدسم", "dairy", 73, 10, 4, 2, 150, "علبة", 150],
    ["salad", "سلطة خضراء", "veg", 20, 1, 4, 0.2, 150],
    ["cucumber", "خيار", "veg", 15, 0.7, 3.6, 0.1, 100],
    ["tomato", "طماطم", "veg", 18, 0.9, 3.9, 0.2, 100],
    ["lettuce", "خس", "veg", 15, 1.4, 2.9, 0.2, 80],
    ["broccoli", "بروكلي مسلوق", "veg", 35, 2.4, 7, 0.4, 150],
    ["mixveg", "خضار مشكل مسلوق", "veg", 40, 2, 8, 0.3, 150],
    ["zucchini", "كوسة مطبوخة", "veg", 17, 1.2, 3.1, 0.3, 150],
    ["spinach", "سبانخ مطبوخة", "veg", 23, 3, 3.8, 0.3, 150],
    ["okra", "بامية مطبوخة", "veg", 33, 1.9, 7, 0.2, 150],
    ["molokhia", "ملوخية مطبوخة", "veg", 32, 3, 5, 0.4, 150],
    ["carrot", "جزر", "veg", 41, 0.9, 10, 0.2, 100],
    ["pepper", "فلفل رومي", "veg", 31, 1, 6, 0.3, 100],
    ["banana", "موز", "fruit", 89, 1.1, 23, 0.3, 120, "موزة", 120],
    ["apple", "تفاح", "fruit", 52, 0.3, 14, 0.2, 180, "تفاحة", 180],
    ["orange", "برتقال", "fruit", 47, 0.9, 12, 0.1, 150, "برتقالة", 150],
    ["strawberry", "فراولة", "fruit", 32, 0.7, 7.7, 0.3, 150],
    ["grapes", "عنب", "fruit", 69, 0.7, 18, 0.2, 150],
    ["guava", "جوافة", "fruit", 68, 2.6, 14, 1, 150],
    ["mango", "مانجو", "fruit", 60, 0.8, 15, 0.4, 150],
    ["watermelon", "بطيخ", "fruit", 30, 0.6, 7.6, 0.2, 250],
    ["dates", "تمر", "fruit", 282, 2.5, 75, 0.4, 24, "تمرة", 8],
    ["olive", "زيت زيتون", "fat", 884, 0, 0, 100, 13, "معلقة", 13],
    ["butter", "زبدة", "fat", 717, 0.9, 0.1, 81, 10, "قطعة", 10],
    ["pbutter", "زبدة فول سوداني", "fat", 588, 25, 20, 50, 16, "معلقة", 16],
    ["tahini", "طحينة", "fat", 595, 17, 21, 54, 15, "معلقة", 15],
    ["almond", "لوز", "fat", 579, 21, 22, 50, 25],
    ["walnut", "عين جمل", "fat", 654, 15, 14, 65, 25],
    ["peanut", "فول سوداني", "fat", 567, 26, 16, 49, 25],
    ["avocado", "أفوكادو", "fat", 160, 2, 9, 15, 100],
    ["honey", "عسل نحل", "other", 304, 0.3, 82, 0, 20, "معلقة", 20],
    ["jam", "مربى", "other", 250, 0.4, 65, 0.1, 20, "معلقة", 20],
    ["sugar", "سكر", "other", 387, 0, 100, 0, 5, "معلقة", 5],
    ["juice", "عصير برتقال طازج", "other", 45, 0.7, 10, 0.2, 250, "كوب", 250],
    ["tea", "شاي / قهوة سادة", "other", 2, 0.1, 0.3, 0, 200]
  ];
  const FOODS = F.map(a => ({ id: a[0], n: a[1], cat: a[2], k: a[3], p: a[4], c: a[5], f: a[6], g: a[7], pl: a[8] || "", pg: a[9] || 0 }));
  const FMAP = {};
  FOODS.forEach(f => FMAP[f.id] = f);

  const MEALS = [
    { id: "breakfast", n: "الفطار", icon: "fa-mug-hot" },
    { id: "lunch", n: "الغداء", icon: "fa-drumstick-bite" },
    { id: "dinner", n: "العشاء", icon: "fa-bowl-food" },
    { id: "snack", n: "سناك / قبل وبعد التمرين", icon: "fa-apple-whole" }
  ];

  const PRESETS = {
    breakfast: [
      { n: "فطار مصري (فول + بيض + عيش)", it: [["foul", 150], ["egg", 100], ["baladi", 80], ["tomato", 100]] },
      { n: "شوفان بروتين", it: [["oats", 50], ["milkSkim", 250], ["banana", 120], ["pbutter", 16]] },
      { n: "بيض وجبنة قريش وتوست", it: [["egg", 150], ["cottage", 100], ["toastb", 56], ["cucumber", 100]] }
    ],
    lunch: [
      { n: "فراخ مشوية وأرز وسلطة", it: [["chk", 200], ["rice", 200], ["salad", 150], ["olive", 13]] },
      { n: "ربع فراخ مشوي وأرز", it: [["quarter", 200], ["rice", 150], ["salad", 150]] },
      { n: "سمك مشوي وبطاطس وخضار", it: [["tilapia", 200], ["potato", 200], ["broccoli", 150]] },
      { n: "لحمة ومكرونة وسلطة", it: [["beef", 150], ["pasta", 200], ["salad", 150]] },
      { n: "كفتة وأرز بني وخضار", it: [["kofta", 150], ["brown", 150], ["mixveg", 150]] }
    ],
    dinner: [
      { n: "جبنة تلاجة وعيش وخضار", it: [["fetaLow", 80], ["baladi", 80], ["cucumber", 100], ["tomato", 100]] },
      { n: "تونة وسلطة وتوست", it: [["tuna", 120], ["salad", 200], ["toastb", 56]] },
      { n: "زبادي يوناني وشوفان وموز", it: [["greek", 200], ["oats", 40], ["banana", 100]] }
    ],
    snack: [
      { n: "واي بروتين وموزة", it: [["whey", 30], ["banana", 120]] },
      { n: "لوز وتمر", it: [["almond", 25], ["dates", 24]] },
      { n: "زبادي وتفاحة", it: [["yogurt", 170], ["apple", 180]] }
    ]
  };

  const GOALS = { cut: "تنشيف / خسارة دهون", maintain: "ثبات الوزن", bulk: "زيادة كتلة عضلية" };

  /* ---------------- الحالة والحفظ ---------------- */
  const KEY = "capEliteNutrition_v1";
  const NS = {
    plan: { breakfast: [], lunch: [], dinner: [], snack: [] },
    times: { breakfast: "8:00 ص", lunch: "2:00 م", dinner: "9:00 م", snack: "" },
    target: { k: 0, p: 0, c: 0, f: 0 },
    notes: "", client: "",
    calc: { w: "", h: "", a: "", sex: "m", act: "1.55", goal: "maintain" },
    custom: [],
    pm: "breakfast", cat: "all"
  };
  let saveT = null;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ plan: NS.plan, times: NS.times, target: NS.target, notes: NS.notes, client: NS.client, calc: NS.calc, custom: NS.custom }));
      } catch (e) {}
    }, 300);
  }
  function registerFood(o) {
    if (!o || !o.id || FMAP[o.id]) return;
    const f = { id: o.id, n: o.n, cat: "mine", k: num(o.k), p: num(o.p), c: num(o.c), f: num(o.f), g: num(o.g, 100), pl: "", pg: 0 };
    FOODS.push(f); FMAP[f.id] = f;
  }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!d) return;
      (d.custom || []).forEach(o => { NS.custom.push(o); registerFood(o); });
      if (d.plan) MEALS.forEach(m => { NS.plan[m.id] = (d.plan[m.id] || []).filter(it => it && FMAP[it.id]).map(it => ({ id: it.id, g: num(it.g) })); });
      if (d.times) Object.assign(NS.times, d.times);
      if (d.target) Object.assign(NS.target, d.target);
      if (d.calc) Object.assign(NS.calc, d.calc);
      NS.notes = d.notes || ""; NS.client = d.client || "";
    } catch (e) {}
  }

  /* ---------------- الحسابات ---------------- */
  const calcItem = it => {
    const f = FMAP[it.id];
    if (!f) return null;
    const m = it.g / 100;
    return { f, k: f.k * m, p: f.p * m, c: f.c * m, fat: f.f * m };
  };
  const sumCalc = arr => arr.reduce((a, c) => ({ k: a.k + c.k, p: a.p + c.p, c: a.c + c.c, f: a.f + c.fat }), { k: 0, p: 0, c: 0, f: 0 });
  const mealTotals = id => sumCalc(NS.plan[id].map(calcItem).filter(Boolean));
  const dayTotals = () => MEALS.reduce((a, m) => { const t = mealTotals(m.id); return { k: a.k + t.k, p: a.p + t.p, c: a.c + t.c, f: a.f + t.f }; }, { k: 0, p: 0, c: 0, f: 0 });
  const hasItems = () => MEALS.some(m => NS.plan[m.id].length);
  const pieceText = (f, g) => {
    if (!f.pg || !f.pl) return "";
    const n = Math.round((g / f.pg) * 2) / 2;
    return "≈ " + n + " " + f.pl;
  };
  const stepOf = f => (f.pg && f.pg <= 60) ? f.pg : (f.g <= 30 ? 5 : 10);

  /* ---------------- CSS ---------------- */
  const css = document.createElement("style");
  css.textContent = `
.nut-block{padding:16px;margin-bottom:16px;border:1px solid var(--line);border-radius:17px;background:#0c0c10}
.nut-h{display:flex;align-items:center;gap:9px;margin:0 0 12px;color:var(--gold2);font-size:14.5px;font-weight:900}
.nut-h i{color:var(--gold)}
.nut-h small{color:var(--muted);font-weight:700;font-size:11px}
.nut-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.nut-grid .field,.nut-targets .field{margin:0}
.nut-targets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.field textarea{width:100%;padding:13px 14px;border:1px solid var(--line2);border-radius:13px;background:#09090c;outline:none;font-size:13px;resize:vertical;min-height:84px}
.field textarea:focus{border-color:var(--gold);box-shadow:0 0 0 4px rgba(224,184,63,.1)}
.nut-dash{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:8px}
.nut-dcard{padding:14px;border:1px solid var(--line);border-radius:16px;background:#0b0b0e;position:relative;overflow:hidden}
.nut-dcard::before{content:"";position:absolute;top:0;left:20%;right:20%;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.nut-dcard span{color:var(--muted);font-size:11.5px;font-weight:800}
.nut-dcard strong{display:block;margin-top:2px;font:900 26px "Inter",sans-serif;color:var(--gold)}
.nut-dcard strong small{margin-inline-start:5px;color:#7a7a86;font:700 11px "Cairo",sans-serif}
.nut-dcard .bar{margin:8px 0 0}
.nut-dcard.over .bar span{background:linear-gradient(90deg,#7f1d1d,#ef4444)}
.nut-dcard.over strong{color:#f87171}
.nut-split{margin:0 0 16px;color:#8e8e9a;font-size:11.5px;font-weight:700;text-align:center}
.nut-meal{margin-bottom:14px;border:1px solid var(--line);border-radius:18px;background:#0c0c10;overflow:hidden}
.nut-mh{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 100% 0%,rgba(224,184,63,.14),transparent 60%),#131318}
.nut-mi{flex:0 0 42px;width:42px;height:42px;display:grid;place-items:center;border-radius:13px;color:#0b0b0b;background:linear-gradient(135deg,var(--gold2),var(--gold));font-size:17px}
.nut-mt b{display:block;font-size:16px;font-weight:900}
.nut-time{width:110px;margin-top:3px;padding:3px 8px;border:1px solid var(--line2);border-radius:8px;background:#07070a;outline:none;color:var(--gold2);font:700 11px "Cairo",sans-serif}
.nut-time:focus{border-color:var(--gold)}
.grow{flex:1}
.nut-msum{text-align:left;direction:ltr}
.nut-msum b{font:900 24px "Inter",sans-serif;color:var(--gold2)}
.nut-msum small{color:#8e8e9a;font:700 11px "Cairo",sans-serif}
.nut-items{padding:10px 12px 0}
.nut-row{display:grid;grid-template-columns:minmax(0,1.2fr) auto minmax(0,1.3fr) auto;gap:12px;align-items:center;padding:10px 12px;margin-bottom:8px;border:1px solid var(--line);border-radius:14px;background:#111116}
.nut-row:hover{border-color:rgba(224,184,63,.3)}
.nut-rname b{display:block;font-size:13.5px;font-weight:900}
.nut-rname small{display:block;min-height:15px;color:var(--gold);font-size:11px;font-weight:800}
.nut-gram{display:flex;align-items:center;gap:6px}
.nut-gram .icon-btn{width:30px;height:30px}
.nut-gram .mini{width:66px}
.nut-gram span{color:#8e8e9a;font-size:11px;font-weight:800}
.nut-macros{display:flex;flex-wrap:wrap;gap:5px}
.nut-macros span{padding:3px 9px;border-radius:999px;font:800 11px "Inter",sans-serif;background:#0b0b0f;border:1px solid var(--line2);white-space:nowrap}
.nut-macros .nk{color:var(--gold2);border-color:rgba(224,184,63,.35)}
.nut-macros .np{color:#ff8a8a}
.nut-macros .nc{color:#7dd3fc}
.nut-macros .nf{color:#fcd34d}
.nut-mm{padding:2px 16px 6px;color:#8e8e9a;font:700 11px "Inter","Cairo",sans-serif;text-align:center}
.nut-macts{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 12px 14px}
.nut-preset{padding:8px 10px;border:1px solid var(--line2);border-radius:11px;background:#15151b;color:#d8d8de;font-size:11.5px;font-weight:800;outline:none;max-width:100%}
.nut-preset option{background:#111}
.nut-empty{padding:18px;margin-bottom:8px;border:1px dashed #33333d;border-radius:14px;color:var(--muted);text-align:center;font-size:12px}
.nut-acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:14px}
.nut-chips{display:flex;gap:7px;overflow-x:auto;padding:10px 18px 2px;scrollbar-width:none}
.nut-chips::-webkit-scrollbar{display:none}
.nut-chip{flex:0 0 auto;padding:7px 13px;border:1px solid var(--line2);border-radius:999px;background:#121217;color:#c9c9d2;font-size:11.5px;font-weight:800}
.nut-chip.on{color:#0b0b0b;border-color:var(--gold);background:linear-gradient(135deg,var(--gold3),var(--gold),var(--gold2))}
.nut-fk{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 13px;margin-bottom:9px;border:1px solid var(--line);border-radius:16px;background:#121217}
.nut-fk:hover{border-color:rgba(224,184,63,.4)}
.nut-fk b{display:block;font-size:14px;font-weight:900}
.nut-fk small{display:block;margin-top:3px;color:#9a9aa5;font:600 11px "Inter","Cairo",sans-serif}
.nut-fk em{font-style:normal;color:var(--gold2);font-weight:800}
.nut-cform{display:none;margin:12px 18px 0;padding:14px;border:1px solid rgba(224,184,63,.3);border-radius:15px;background:#0c0c10}
.nut-cform.show{display:block}
.nut-cform .nut-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
.nut-ptools{display:flex;gap:8px;margin:10px 18px 0}
.nut-out{position:fixed;inset:0;z-index:350;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px 12px 40px;background:rgba(0,0,0,.94)}
.nut-outbox{position:relative;width:min(760px,100%);margin:0 auto;padding:20px;border:1px solid var(--line2);border-radius:22px;background:#0d0d11}
.nut-outbox h3{margin:0 0 4px;padding-inline-end:48px;font-size:19px;font-weight:900}
.nut-outbox p{margin:0 0 14px;color:var(--muted);font-size:12px;line-height:1.8}
.nut-outbox p.nut-warn{padding:10px 12px;border:1px solid rgba(252,211,77,.35);border-radius:12px;background:rgba(252,211,77,.08);color:#fcd34d;font-weight:800}
.nut-outacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;margin-bottom:16px}
.nut-outacts a.btn{text-decoration:none}
.nut-prev{display:grid;gap:12px}
.nut-prev img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--line);-webkit-touch-callout:default;user-select:auto}
@media (max-width:900px){
  .dock{grid-template-columns:repeat(6,1fr)}
  .dock button{font-size:9.5px}
  .nut-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .nut-dash,.nut-targets{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:640px){
  .nut-row{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"name del" "gram gram" "mac mac"}
  .nut-row .nut-rname{grid-area:name}
  .nut-row .nut-gram{grid-area:gram}
  .nut-row .nut-macros{grid-area:mac}
  .nut-row .del{grid-area:del}
  .nut-cform .nut-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .nut-acts{grid-template-columns:1fr}
}
`;
  document.head.appendChild(css);

  /* ---------------- بناء القسم ---------------- */
  const sec = document.createElement("section");
  sec.id = "secNutrition";
  sec.className = "card card-pad section";
  sec.innerHTML = `
    <div class="head">
      <div class="ic"><i class="fa-solid fa-utensils"></i></div>
      <div><h2>برنامج التغذية</h2><p>STEP 04 • NUTRITION PLAN</p></div>
      <div class="grow"></div>
      <span class="step-tag">04</span>
    </div>

    <div class="nut-block">
      <h3 class="nut-h"><i class="fa-solid fa-calculator"></i> حاسبة الاحتياج اليومي <small>(اختياري)</small></h3>
      <div class="nut-grid">
        <div class="field"><label><i class="fa-solid fa-weight-scale"></i> الوزن (كجم)</label><input type="number" inputmode="decimal" data-calc="w" placeholder="80"></div>
        <div class="field"><label><i class="fa-solid fa-ruler-vertical"></i> الطول (سم)</label><input type="number" inputmode="decimal" data-calc="h" placeholder="175"></div>
        <div class="field"><label><i class="fa-solid fa-cake-candles"></i> السن</label><input type="number" inputmode="numeric" data-calc="a" placeholder="25"></div>
        <div class="field"><label><i class="fa-solid fa-venus-mars"></i> النوع</label>
          <select data-calc="sex"><option value="m">ذكر</option><option value="f">أنثى</option></select></div>
        <div class="field"><label><i class="fa-solid fa-person-running"></i> النشاط</label>
          <select data-calc="act">
            <option value="1.2">قليل جدًا (بدون تمرين)</option>
            <option value="1.375">خفيف (1-3 أيام)</option>
            <option value="1.55">متوسط (3-5 أيام)</option>
            <option value="1.725">عالي (6-7 أيام)</option>
            <option value="1.9">مكثف جدًا</option>
          </select></div>
        <div class="field"><label><i class="fa-solid fa-bullseye"></i> الهدف</label>
          <select data-calc="goal">
            <option value="cut">تنشيف / خسارة دهون</option>
            <option value="maintain">ثبات الوزن</option>
            <option value="bulk">زيادة كتلة عضلية</option>
          </select></div>
      </div>
      <button id="nutCalcBtn" class="btn btn-outline btn-block" type="button" style="margin-top:12px"><i class="fa-solid fa-wand-magic-sparkles"></i> احسب واضبط الأهداف تلقائي</button>
      <h3 class="nut-h" style="margin-top:16px"><i class="fa-solid fa-flag-checkered"></i> الأهداف اليومية <small>(تقدر تعدلها بإيدك)</small></h3>
      <div class="nut-targets">
        <div class="field"><label>سعرات</label><input type="number" inputmode="numeric" data-t="k" placeholder="2400"></div>
        <div class="field"><label>بروتين (جم)</label><input type="number" inputmode="numeric" data-t="p" placeholder="160"></div>
        <div class="field"><label>كارب (جم)</label><input type="number" inputmode="numeric" data-t="c" placeholder="280"></div>
        <div class="field"><label>دهون (جم)</label><input type="number" inputmode="numeric" data-t="f" placeholder="70"></div>
      </div>
      <p id="nutCalcInfo" class="hint" style="margin-top:10px"></p>
    </div>

    <div id="nutDash" class="nut-dash"></div>
    <p id="nutSplit" class="nut-split"></p>
    <div id="nutMeals"></div>

    <div class="nut-block">
      <div class="field"><label><i class="fa-solid fa-user"></i> اسم العميل <small style="color:#6e6e79">(لو فاضي بيتاخد من بيانات البرنامج)</small></label><input id="nutClient" placeholder="أحمد محمد"></div>
      <div class="field" style="margin-bottom:0"><label><i class="fa-solid fa-note-sticky"></i> ملاحظات المدرب</label><textarea id="nutNotes" placeholder="مثال: اشرب مياه كتير، الأكل بعد التمرين بساعة..."></textarea></div>
      <div class="nut-acts">
        <button id="nutPngBtn" class="btn btn-gold" type="button"><i class="fa-solid fa-file-image"></i> تصدير التغذية PNG</button>
        <button id="nutPdfBtn" class="btn btn-outline" type="button"><i class="fa-solid fa-file-pdf"></i> تصدير التغذية PDF</button>
        <button id="nutCopyBtn" class="btn btn-ghost" type="button"><i class="fa-solid fa-copy"></i> نسخ كنص</button>
        <button id="nutWaBtn" class="btn btn-ghost" type="button"><i class="fa-brands fa-whatsapp"></i> إرسال واتساب</button>
      </div>
      <p id="nutStatus" class="status"></p>
      <button id="nutResetBtn" class="btn btn-ghost btn-sm btn-block" type="button"><i class="fa-solid fa-broom"></i> مسح برنامج التغذية كله</button>
      <p class="hint" style="margin-top:10px">الأوزان المحسوبة بعد الطهي، والقيم تقريبية. البرنامج بيتحفظ تلقائي في المتصفح.</p>
    </div>
  `;
  const footer = $q(".footer", mainEl);
  if (footer) mainEl.insertBefore(sec, footer); else mainEl.appendChild(sec);

  /* نافذة اختيار الأصناف */
  const picker = document.createElement("div");
  picker.id = "nutPicker";
  picker.className = "modal top";
  picker.innerHTML = `
    <div class="mbox">
      <button class="mclose" type="button" data-nclose="picker" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>
      <div class="mhead"><h2 id="nutPickTitle">أضف أصناف</h2><p>اضغط «إضافة» وبعدين عدّل الجرامات من الوجبة نفسها</p></div>
      <div class="search"><i class="fa-solid fa-magnifying-glass"></i><input id="nutSearch" type="search" placeholder="ابحث عن صنف (فراخ، رز، فول...)"></div>
      <div id="nutChips" class="nut-chips"></div>
      <div class="nut-ptools"><button id="nutCToggle" class="btn btn-outline btn-sm" type="button"><i class="fa-solid fa-circle-plus"></i> صنف مخصص</button></div>
      <div id="nutCForm" class="nut-cform">
        <div class="nut-grid">
          <div class="field" style="grid-column:1/-1"><label>اسم الصنف</label><input id="nutCN" placeholder="مثال: أرز بالخلطة"></div>
          <div class="field"><label>سعرات /100جم</label><input id="nutCK" type="number" inputmode="decimal"></div>
          <div class="field"><label>بروتين /100جم</label><input id="nutCP" type="number" inputmode="decimal"></div>
          <div class="field"><label>كارب /100جم</label><input id="nutCC" type="number" inputmode="decimal"></div>
          <div class="field"><label>دهون /100جم</label><input id="nutCF" type="number" inputmode="decimal"></div>
          <div class="field"><label>الجرام الافتراضي</label><input id="nutCG" type="number" inputmode="decimal" placeholder="100"></div>
        </div>
        <button id="nutCSave" class="btn btn-gold btn-block" type="button" style="margin-top:10px"><i class="fa-solid fa-check"></i> حفظ وإضافة للوجبة</button>
      </div>
      <div id="nutCount" class="pcount"></div>
      <div id="nutPlist" class="plist"></div>
    </div>`;
  document.body.appendChild(picker);

  /* نافذة نتيجة التصدير */
  const out = document.createElement("div");
  out.id = "nutOut";
  out.className = "nut-out";
  out.hidden = true;
  document.body.appendChild(out);

  /* ---------------- ربط القوائم ---------------- */
  function goNut() {
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window.setActiveNav === "function") window.setActiveNav("secNutrition");
  }
  const nav = $q(".side .nav");
  if (nav) {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.go = "secNutrition";
    b.innerHTML = '<i class="fa-solid fa-utensils"></i> برنامج التغذية';
    const ref = $q(".js-export", nav);
    if (ref) nav.insertBefore(b, ref); else nav.appendChild(b);
    b.addEventListener("click", goNut);
  }
  const dock = $q(".dock");
  if (dock) {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.go = "secNutrition";
    b.innerHTML = '<i class="fa-solid fa-utensils"></i>التغذية';
    const ref = $q('[data-go="secPreview"]', dock);
    if (ref) ref.insertAdjacentElement("afterend", b); else dock.appendChild(b);
    b.addEventListener("click", goNut);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting && typeof window.setActiveNav === "function") window.setActiveNav("secNutrition");
    }), { rootMargin: "-40% 0px -55% 0px" }).observe(sec);
  }

  /* ---------------- العرض ---------------- */
  const elMeals = $q("#nutMeals", sec), elDash = $q("#nutDash", sec), elSplit = $q("#nutSplit", sec);

  function rowHTML(mId, it, i) {
    const f = FMAP[it.id];
    if (!f) return "";
    return `<div class="nut-row" data-m="${mId}" data-i="${i}">
      <div class="nut-rname"><b>${esc(f.n)}</b><small class="nut-piece"></small></div>
      <div class="nut-gram">
        <button class="icon-btn" type="button" data-nact="dec" aria-label="نقص"><i class="fa-solid fa-minus"></i></button>
        <input class="mini nut-g" type="number" inputmode="decimal" min="0" value="${esc(it.g)}">
        <span>جم</span>
        <button class="icon-btn" type="button" data-nact="inc" aria-label="زيادة"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="nut-macros">
        <span class="nk"><b data-r="k">0</b> سعرة</span>
        <span class="np">P <b data-r="p">0</b></span>
        <span class="nc">C <b data-r="c">0</b></span>
        <span class="nf">F <b data-r="f">0</b></span>
      </div>
      <button class="icon-btn del" type="button" data-nact="del" aria-label="حذف"><i class="fa-solid fa-trash"></i></button>
    </div>`;
  }

  function renderMeals() {
    elMeals.innerHTML = MEALS.map(m => {
      const items = NS.plan[m.id];
      const rows = items.length ? items.map((it, i) => rowHTML(m.id, it, i)).join("")
        : `<div class="nut-empty"><i class="fa-solid fa-plate-wheat" style="color:var(--gold);margin-inline-end:6px"></i>لسه مفيش أصناف في ${esc(m.n)}</div>`;
      const opts = (PRESETS[m.id] || []).map((p, i) => `<option value="${i}">${esc(p.n)}</option>`).join("");
      return `<div class="nut-meal" data-meal="${m.id}">
        <div class="nut-mh">
          <span class="nut-mi"><i class="fa-solid ${m.icon}"></i></span>
          <div class="nut-mt"><b>${esc(m.n)}</b><input class="nut-time" data-time="${m.id}" value="${esc(NS.times[m.id] || "")}" placeholder="الوقت"></div>
          <div class="grow"></div>
          <div class="nut-msum"><b data-ms="${m.id}">0</b> <small>سعرة</small></div>
        </div>
        <div class="nut-items">${rows}</div>
        <div class="nut-mm" data-mm="${m.id}"></div>
        <div class="nut-macts">
          <button class="btn btn-gold btn-sm" type="button" data-nact="add" data-meal="${m.id}"><i class="fa-solid fa-plus"></i> إضافة صنف</button>
          <select class="nut-preset" data-meal="${m.id}"><option value="">✨ وجبات جاهزة...</option>${opts}</select>
          <button class="btn btn-ghost btn-sm" type="button" data-nact="clear" data-meal="${m.id}"><i class="fa-solid fa-eraser"></i> مسح الوجبة</button>
        </div>
      </div>`;
    }).join("");
    updateNumbers();
  }

  function renderDash(day) {
    const t = NS.target;
    const cards = [
      { l: "السعرات", v: day.k, t: t.k, u: "سعرة" },
      { l: "البروتين", v: day.p, t: t.p, u: "جم" },
      { l: "الكارب", v: day.c, t: t.c, u: "جم" },
      { l: "الدهون", v: day.f, t: t.f, u: "جم" }
    ];
    elDash.innerHTML = cards.map(c => {
      const pct = c.t > 0 ? Math.min(100, (c.v / c.t) * 100) : 0;
      const over = c.t > 0 && c.v > c.t * 1.05;
      return `<div class="nut-dcard ${over ? "over" : ""}"><span>${c.l}</span>
        <strong>${fmt0(c.v)}<small>${c.t > 0 ? "/ " + fmt0(c.t) + " " + c.u : c.u}</small></strong>
        <div class="bar"><span style="width:${pct}%"></span></div></div>`;
    }).join("");
    const cal = day.p * 4 + day.c * 4 + day.f * 9;
    elSplit.textContent = cal > 0
      ? `توزيع السعرات: بروتين ${Math.round(day.p * 4 / cal * 100)}% • كارب ${Math.round(day.c * 4 / cal * 100)}% • دهون ${Math.round(day.f * 9 / cal * 100)}%`
      : "";
  }

  function updateNumbers() {
    MEALS.forEach(m => {
      const t = { k: 0, p: 0, c: 0, f: 0 };
      NS.plan[m.id].forEach((it, i) => {
        const c = calcItem(it);
        if (!c) return;
        t.k += c.k; t.p += c.p; t.c += c.c; t.f += c.fat;
        const row = $q(`.nut-row[data-m="${m.id}"][data-i="${i}"]`, elMeals);
        if (row) {
          $q('[data-r="k"]', row).textContent = fmt0(c.k);
          $q('[data-r="p"]', row).textContent = fmt(c.p);
          $q('[data-r="c"]', row).textContent = fmt(c.c);
          $q('[data-r="f"]', row).textContent = fmt(c.fat);
          $q(".nut-piece", row).textContent = pieceText(c.f, it.g);
        }
      });
      const ms = $q(`[data-ms="${m.id}"]`, elMeals), mm = $q(`[data-mm="${m.id}"]`, elMeals);
      if (ms) ms.textContent = fmt0(t.k);
      if (mm) mm.textContent = NS.plan[m.id].length ? `بروتين ${fmt(t.p)} جم  •  كارب ${fmt(t.c)} جم  •  دهون ${fmt(t.f)} جم` : "";
    });
    renderDash(dayTotals());
    save();
  }

  function fillInputs() {
    $qa("[data-calc]", sec).forEach(el => { el.value = NS.calc[el.dataset.calc] != null ? NS.calc[el.dataset.calc] : ""; });
    $qa("[data-t]", sec).forEach(el => { const v = NS.target[el.dataset.t]; el.value = v ? v : ""; });
    $q("#nutClient", sec).value = NS.client;
    $q("#nutNotes", sec).value = NS.notes;
  }

  /* ---------------- الحاسبة ---------------- */
  function doCalc() {
    const c = NS.calc, w = num(c.w), h = num(c.h), a = num(c.a);
    const info = $q("#nutCalcInfo", sec);
    if (!(w > 0 && h > 0 && a > 0)) { info.textContent = "اكتب الوزن والطول والسن الأول."; return; }
    const bmr = 10 * w + 6.25 * h - 5 * a + (c.sex === "f" ? -161 : 5);
    const tdee = bmr * num(c.act, 1.55);
    const k = Math.round(tdee * ({ cut: 0.8, maintain: 1, bulk: 1.15 }[c.goal] || 1) / 10) * 10;
    const p = Math.round(w * ({ cut: 2.2, maintain: 1.8, bulk: 2 }[c.goal] || 1.8));
    const f = Math.round(k * 0.25 / 9);
    const cc = Math.max(0, Math.round((k - p * 4 - f * 9) / 4));
    NS.target = { k, p, c: cc, f };
    fillInputs();
    const water = (w * 0.035).toFixed(1);
    info.textContent = `احتياجك للثبات ≈ ${Math.round(tdee)} سعرة • الهدف المقترح (${GOALS[c.goal]}): ${k} سعرة • بروتين ${p} جم • كارب ${cc} جم • دهون ${f} جم • ماء ≈ ${water} لتر يوميًا`;
    updateNumbers();
    toast("تم ضبط الأهداف ✅");
  }

  /* ---------------- أحداث القسم ---------------- */
  sec.addEventListener("click", e => {
    const b = e.target.closest("[data-nact]");
    if (!b) return;
    const act = b.dataset.nact;
    if (act === "add") { openPicker(b.dataset.meal); return; }
    if (act === "clear") {
      const id = b.dataset.meal;
      if (!NS.plan[id].length) return;
      if (!confirm("مسح كل أصناف الوجبة دي؟")) return;
      NS.plan[id] = []; renderMeals(); return;
    }
    const row = b.closest(".nut-row");
    if (!row) return;
    const mId = row.dataset.m, i = +row.dataset.i, it = NS.plan[mId][i];
    if (!it) return;
    if (act === "del") { NS.plan[mId].splice(i, 1); renderMeals(); return; }
    if (act === "inc" || act === "dec") {
      const st = stepOf(FMAP[it.id]);
      it.g = Math.max(0, Math.round((it.g + (act === "inc" ? st : -st)) * 10) / 10);
      $q(".nut-g", row).value = it.g;
      updateNumbers();
    }
  });
  sec.addEventListener("change", e => {
    const sel = e.target.closest(".nut-preset");
    if (!sel) return;
    const meal = sel.dataset.meal, idx = sel.value;
    sel.value = "";
    if (idx === "") return;
    const pr = (PRESETS[meal] || [])[+idx];
    if (!pr) return;
    if (NS.plan[meal].length && !confirm("هيتم استبدال أصناف الوجبة بالوجبة الجاهزة، متأكد؟")) return;
    NS.plan[meal] = pr.it.filter(a => FMAP[a[0]]).map(a => ({ id: a[0], g: a[1] }));
    renderMeals();
    toast("تم تطبيق الوجبة ✅");
  });
  sec.addEventListener("input", e => {
    const t = e.target;
    if (t.matches(".nut-g")) {
      const row = t.closest(".nut-row");
      const it = row && NS.plan[row.dataset.m][+row.dataset.i];
      if (it) { it.g = Math.max(0, num(t.value)); updateNumbers(); }
    } else if (t.matches("[data-time]")) {
      NS.times[t.dataset.time] = t.value; save();
    } else if (t.matches("[data-calc]")) {
      NS.calc[t.dataset.calc] = t.value; save();
    } else if (t.matches("[data-t]")) {
      NS.target[t.dataset.t] = Math.max(0, num(t.value)); updateNumbers();
    } else if (t.id === "nutClient") {
      NS.client = t.value; save();
    } else if (t.id === "nutNotes") {
      NS.notes = t.value; save();
    }
  });
  $q("#nutCalcBtn", sec).addEventListener("click", doCalc);
  $q("#nutResetBtn", sec).addEventListener("click", () => {
    if (!confirm("متأكد إنك عايز تمسح برنامج التغذية كله؟")) return;
    MEALS.forEach(m => NS.plan[m.id] = []);
    NS.target = { k: 0, p: 0, c: 0, f: 0 }; NS.notes = "";
    fillInputs(); $q("#nutCalcInfo", sec).textContent = "";
    renderMeals(); toast("تم مسح برنامج التغذية");
  });

  /* ---------------- نافذة الأصناف ---------------- */
  function openPicker(meal) {
    NS.pm = meal; NS.cat = "all";
    const m = MEALS.find(x => x.id === meal);
    $q("#nutPickTitle").textContent = "أضف أصناف لـ " + (m ? m.n : "");
    $q("#nutSearch").value = "";
    $q("#nutCForm").classList.remove("show");
    renderChips(); renderFoodList();
    picker.classList.add("show");
    document.body.classList.add("lock");
    $q("#nutPlist").scrollTop = 0;
  }
  function closePicker() {
    picker.classList.remove("show");
    document.body.classList.remove("lock");
  }
  function renderChips() {
    const hasMine = FOODS.some(f => f.cat === "mine");
    const keys = ["all"].concat(Object.keys(CATS).filter(k => k !== "mine" || hasMine));
    $q("#nutChips").innerHTML = keys.map(k =>
      `<button type="button" class="nut-chip ${NS.cat === k ? "on" : ""}" data-chip="${k}">${k === "all" ? "الكل" : CATS[k]}</button>`).join("");
  }
  function renderFoodList() {
    const q = norm($q("#nutSearch").value);
    const list = FOODS.filter(f => (NS.cat === "all" || f.cat === NS.cat) && (!q || norm(f.n).includes(q)));
    $q("#nutCount").textContent = list.length + " صنف";
    const box = $q("#nutPlist"), keep = box.scrollTop;
    if (!list.length) { box.innerHTML = `<div class="empty"><i class="fa-solid fa-magnifying-glass"></i> مفيش أصناف مطابقة<small>تقدر تضيف صنف مخصص من الزر فوق</small></div>`; return; }
    const cur = NS.plan[NS.pm] || [];
    box.innerHTML = list.map(f => {
      const added = cur.some(it => it.id === f.id);
      return `<div class="nut-fk">
        <div style="min-width:0"><b>${esc(f.n)}</b>
          <small>لكل 100 جم: <em>${fmt0(f.k)}</em> سعرة • P ${fmt(f.p)} • C ${fmt(f.c)} • F ${fmt(f.f)}</small>
          <small>الافتراضي: ${fmt(f.g)} جم ${f.pl ? "(" + pieceText(f, f.g).replace("≈ ", "≈ ") + ")" : ""}</small></div>
        <button class="btn btn-gold btn-sm" type="button" data-pick="${esc(f.id)}" ${added ? "disabled" : ""}>${added ? '<i class="fa-solid fa-check"></i> تم' : '<i class="fa-solid fa-plus"></i> إضافة'}</button>
      </div>`;
    }).join("");
    box.scrollTop = keep;
  }
  function addFood(id) {
    const f = FMAP[id];
    if (!f) return false;
    const cur = NS.plan[NS.pm];
    if (cur.some(it => it.id === id)) return false;
    cur.push({ id, g: f.g });
    renderMeals();
    return true;
  }
  picker.addEventListener("click", e => {
    if (e.target === picker) { closePicker(); return; }
    if (e.target.closest('[data-nclose="picker"]')) { closePicker(); return; }
    const chip = e.target.closest("[data-chip]");
    if (chip) { NS.cat = chip.dataset.chip; renderChips(); renderFoodList(); $q("#nutPlist").scrollTop = 0; return; }
    const pk = e.target.closest("[data-pick]");
    if (pk && !pk.disabled) { if (addFood(pk.dataset.pick)) { renderFoodList(); toast("تمت الإضافة ✅"); } }
  });
  $q("#nutSearch").addEventListener("input", renderFoodList);
  $q("#nutCToggle").addEventListener("click", () => $q("#nutCForm").classList.toggle("show"));
  $q("#nutCSave").addEventListener("click", () => {
    const n = $q("#nutCN").value.trim();
    const p = num($q("#nutCP").value), c = num($q("#nutCC").value), f = num($q("#nutCF").value);
    let k = num($q("#nutCK").value);
    if (!n) { toast("اكتب اسم الصنف"); return; }
    if (!k) k = p * 4 + c * 4 + f * 9;
    if (!k && !p && !c && !f) { toast("اكتب القيم الغذائية لكل 100 جم"); return; }
    const o = { id: "c_" + Date.now(), n, k, p, c, f, g: num($q("#nutCG").value, 100) || 100 };
    NS.custom.push(o); registerFood(o);
    ["nutCN", "nutCK", "nutCP", "nutCC", "nutCF", "nutCG"].forEach(id => $q("#" + id).value = "");
    $q("#nutCForm").classList.remove("show");
    addFood(o.id); renderChips(); renderFoodList(); save();
    toast("تم حفظ الصنف وإضافته ✅");
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!out.hidden) closeOut();
    else if (picker.classList.contains("show")) closePicker();
  });

  /* ---------------- التصدير: رسم الصفحات ---------------- */
  const W = 1080, H = 1528, P = 48, R = W - P, CW = W - P * 2;
  const COLS = { g: R - 452, k: R - 557, p: R - 662, c: R - 767, f: R - 872 };
  const CP = "#ff8a8a", CC = "#7dd3fc", CF = "#fcd34d", GOLD = "#e0b83f", GOLD2 = "#ffe08a";

  function setSt(msg, type) {
    const el = $q("#nutStatus", sec);
    el.textContent = msg || "";
    el.className = "status" + (type ? " " + type : "");
  }
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function T(ctx, font, color, align, dir) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || "right";
    try { ctx.direction = dir || "rtl"; } catch (e) {}
  }
  function fit(ctx, text, maxW) {
    text = String(text);
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 1 && ctx.measureText(text + "…").width > maxW) text = text.slice(0, -1);
    return text + "…";
  }
  function wrapLines(ctx, text, maxW, maxLines) {
    const out = [];
    String(text).split(/\n/).forEach(par => {
      const words = par.split(/\s+/).filter(Boolean);
      let line = "";
      if (!words.length) { out.push(""); return; }
      words.forEach(w => {
        const test = line ? line + " " + w : w;
        if (!line || ctx.measureText(test).width <= maxW) line = test;
        else { out.push(line); line = w; }
      });
      if (line) out.push(line);
    });
    if (out.length > maxLines) { out.length = maxLines; out[maxLines - 1] = fit(ctx, out[maxLines - 1] + "…", maxW); }
    return out;
  }
  async function loadFonts() {
    try {
      if (!document.fonts) return;
      await Promise.all(["900 30px Cairo", "800 20px Cairo", "700 15px Cairo", "600 16px Cairo", "900 40px Inter", "800 20px Inter", "600 13px Inter"]
        .map(f => document.fonts.load(f, "CAP أبجد 123")));
    } catch (e) {}
  }
  function loadPhoto() {
    return new Promise(res => {
      let src = "";
      try { src = (typeof state !== "undefined" && state && state.photo) || ""; } catch (e) {}
      if (!src) return res(null);
      const i = new Image();
      i.onload = () => res(i); i.onerror = () => res(null); i.src = src;
    });
  }

  function drawMealHead(ctx, y, m, tot) {
    rr(ctx, P, y, CW, 64, 16); ctx.fillStyle = "#191710"; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(224,184,63,.5)"; ctx.stroke();
    rr(ctx, R - 9, y + 13, 5, 38, 3); ctx.fillStyle = GOLD; ctx.fill();
    T(ctx, "900 27px Cairo, Arial", "#fff", "right", "rtl");
    ctx.fillText(m.n, R - 26, y + 42);
    const nw = ctx.measureText(m.n).width, time = NS.times[m.id];
    if (time) { T(ctx, "700 15px Cairo, Arial", GOLD2, "right", "rtl"); ctx.fillText("• " + time, R - 26 - nw - 14, y + 41); }
    const ks = fmt0(tot.k);
    T(ctx, "900 24px Inter, Arial", GOLD2, "left", "ltr"); ctx.fillText(ks, P + 22, y + 41);
    const kw = ctx.measureText(ks).width;
    T(ctx, "700 14px Cairo, Arial", "#aaa", "left", "rtl"); ctx.fillText("سعرة", P + 22 + kw + 8, y + 41);
    T(ctx, "700 13px Cairo, Arial", "#777", "right", "rtl"); ctx.fillText("الصنف", R - 20, y + 88);
    T(ctx, "700 13px Cairo, Arial", "#777", "center", "rtl");
    ctx.fillText("الكمية", COLS.g, y + 88); ctx.fillText("سعرات", COLS.k, y + 88);
    ctx.fillText("بروتين", COLS.p, y + 88); ctx.fillText("كارب", COLS.c, y + 88); ctx.fillText("دهون", COLS.f, y + 88);
  }
  function drawFoodRow(ctx, y, o) {
    const it = o.it, c = o.c, f = c.f;
    rr(ctx, P, y, CW, 70, 14); ctx.fillStyle = "#141418"; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "#2b2b32"; ctx.stroke();
    T(ctx, "900 22px Cairo, Arial", "#fff", "right", "rtl");
    ctx.fillText(fit(ctx, f.n, 380), R - 20, y + 31);
    T(ctx, "600 14px Cairo, Arial", "#9a9aa5", "right", "rtl");
    ctx.fillText(pieceText(f, it.g) || CATS[f.cat], R - 20, y + 55);
    T(ctx, "800 20px Cairo, Arial", "#fff", "center", "rtl"); ctx.fillText(fmt(it.g) + " جم", COLS.g, y + 42);
    T(ctx, "900 22px Inter, Arial", GOLD2, "center", "ltr"); ctx.fillText(fmt0(c.k), COLS.k, y + 42);
    T(ctx, "800 20px Inter, Arial", CP, "center", "ltr"); ctx.fillText(fmt(c.p), COLS.p, y + 42);
    T(ctx, "800 20px Inter, Arial", CC, "center", "ltr"); ctx.fillText(fmt(c.c), COLS.c, y + 42);
    T(ctx, "800 20px Inter, Arial", CF, "center", "ltr"); ctx.fillText(fmt(c.fat), COLS.f, y + 42);
  }
  function drawMealTotal(ctx, y, tot, gs) {
    rr(ctx, P, y, CW, 64, 14); ctx.fillStyle = "rgba(224,184,63,.09)"; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(224,184,63,.45)"; ctx.stroke();
    T(ctx, "900 19px Cairo, Arial", GOLD2, "right", "rtl"); ctx.fillText("إجمالي الوجبة", R - 20, y + 40);
    T(ctx, "800 18px Cairo, Arial", "#ddd", "center", "rtl"); ctx.fillText(fmt(gs) + " جم", COLS.g, y + 40);
    T(ctx, "900 23px Inter, Arial", GOLD2, "center", "ltr"); ctx.fillText(fmt0(tot.k), COLS.k, y + 40);
    T(ctx, "900 21px Inter, Arial", CP, "center", "ltr"); ctx.fillText(fmt(tot.p), COLS.p, y + 40);
    T(ctx, "900 21px Inter, Arial", CC, "center", "ltr"); ctx.fillText(fmt(tot.c), COLS.c, y + 40);
    T(ctx, "900 21px Inter, Arial", CF, "center", "ltr"); ctx.fillText(fmt(tot.f), COLS.f, y + 40);
  }
  function drawDayTotal(ctx, y, day) {
    const g = ctx.createLinearGradient(P, y, R, y);
    g.addColorStop(0, "rgba(224,184,63,.05)"); g.addColorStop(1, "rgba(224,184,63,.24)");
    rr(ctx, P, y, CW, 118, 18); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = GOLD; ctx.stroke();
    T(ctx, "900 27px Cairo, Arial", "#fff", "right", "rtl"); ctx.fillText("إجمالي اليوم", R - 24, y + 46);
    const cal = day.p * 4 + day.c * 4 + day.f * 9;
    if (cal > 0) {
      T(ctx, "600 14px Cairo, Arial", "#bbb", "right", "rtl");
      ctx.fillText(`بروتين ${Math.round(day.p * 4 / cal * 100)}% • كارب ${Math.round(day.c * 4 / cal * 100)}% • دهون ${Math.round(day.f * 9 / cal * 100)}%`, R - 24, y + 78);
    }
    const t = NS.target;
    const cols = [
      { x: COLS.k, v: day.k, t: t.k, col: GOLD2, l: "سعرة" },
      { x: COLS.p, v: day.p, t: t.p, col: CP, l: "بروتين" },
      { x: COLS.c, v: day.c, t: t.c, col: CC, l: "كارب" },
      { x: COLS.f, v: day.f, t: t.f, col: CF, l: "دهون" }
    ];
    cols.forEach(c => {
      T(ctx, "900 30px Inter, Arial", c.col, "center", "ltr"); ctx.fillText(c.x === COLS.k ? fmt0(c.v) : fmt(c.v), c.x, y + 52);
      T(ctx, "700 13px Cairo, Arial", "#aaa", "center", "rtl"); ctx.fillText(c.l, c.x, y + 76);
      if (c.t > 0) { T(ctx, "700 12px Cairo, Arial", "#888", "center", "rtl"); ctx.fillText("الهدف " + fmt0(c.t), c.x, y + 98); }
    });
  }
  function drawHeader(ctx, pg, total, client, coach, photo, day) {
    if (pg === 0) {
      const COVER = 300;
      ctx.fillStyle = "#111114"; ctx.fillRect(0, 0, W, COVER);
      const g = ctx.createRadialGradient(W * 0.05, 0, 0, W * 0.05, 0, W * 0.55);
      g.addColorStop(0, "rgba(224,184,63,.22)"); g.addColorStop(1, "rgba(224,184,63,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, COVER);
      ctx.fillStyle = GOLD; ctx.fillRect(0, COVER - 4, W, 4);
      T(ctx, "900 13px Inter, Arial", GOLD, "right", "ltr"); ctx.fillText("NUTRITION PLAN", R, 66);
      T(ctx, "600 13px Inter, Arial", "#888", "left", "ltr");
      ctx.fillText(new Date().toLocaleDateString("en-GB"), P, 66);
      ctx.font = "900 50px Inter, Arial";
      const a = "CAP ", b = "/ " + coach, wa = ctx.measureText(a).width;
      const x0 = Math.max(P + 150, R - wa - ctx.measureText(b).width);
      T(ctx, "900 50px Inter, Arial", "#fff", "left", "ltr"); ctx.fillText(a, x0, 132);
      ctx.fillStyle = GOLD; ctx.fillText(fit(ctx, b, R - x0 - wa), x0 + wa, 132);
      ctx.fillRect(R - 80, 156, 80, 3);
      T(ctx, "900 32px Cairo, Arial", "#fff", "right", "rtl"); ctx.fillText("برنامج التغذية اليومي", R, 210);
      T(ctx, "900 21px Cairo, Arial", GOLD2, "right", "rtl");
      let sub = "اللاعب: " + client;
      ctx.fillText(fit(ctx, sub, CW - 170), R, 250);
      if (NS.target.k > 0) {
        T(ctx, "700 15px Cairo, Arial", "#aaa", "right", "rtl");
        ctx.fillText("الهدف: " + GOALS[NS.calc.goal], R, 278);
      }
      const pcx = P + 62, pcy = 172, pr = 58;
      ctx.save(); ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.fillStyle = "#18181e"; ctx.fill(); ctx.clip();
      if (photo) {
        const k = Math.max(pr * 2 / photo.width, pr * 2 / photo.height), iw = photo.width * k, ih = photo.height * k;
        ctx.drawImage(photo, pcx - iw / 2, pcy - ih / 2, iw, ih);
      } else {
        T(ctx, "900 40px Cairo, Arial", GOLD, "center", "rtl");
        ctx.textBaseline = "middle"; ctx.fillText("ع", pcx, pcy + 2); ctx.textBaseline = "alphabetic";
      }
      ctx.restore();
      ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = GOLD; ctx.stroke();
      const by = COVER + 24, gap = 14, bw = (CW - gap * 3) / 4, t = NS.target;
      [
        { l: "السعرات", v: fmt0(day.k), t: t.k, u: "سعرة", col: GOLD2 },
        { l: "البروتين", v: fmt(day.p), t: t.p, u: "جم", col: CP },
        { l: "الكارب", v: fmt(day.c), t: t.c, u: "جم", col: CC },
        { l: "الدهون", v: fmt(day.f), t: t.f, u: "جم", col: CF }
      ].forEach((s, i) => {
        const x = R - (i + 1) * bw - i * gap;
        rr(ctx, x, by, bw, 110, 16); ctx.fillStyle = "#141418"; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = "#333"; ctx.stroke();
        T(ctx, "700 15px Cairo, Arial", "#aaa", "center", "rtl"); ctx.fillText(s.l, x + bw / 2, by + 30);
        T(ctx, "900 36px Inter, Arial", s.col, "center", "ltr"); ctx.fillText(s.v, x + bw / 2, by + 71);
        T(ctx, "700 13px Cairo, Arial", "#888", "center", "rtl");
        ctx.fillText(s.u + (s.t > 0 ? " • الهدف " + fmt0(s.t) : ""), x + bw / 2, by + 97);
      });
    } else {
      ctx.fillStyle = "#111114"; ctx.fillRect(0, 0, W, 104);
      ctx.fillStyle = GOLD; ctx.fillRect(0, 100, W, 4);
      T(ctx, "900 26px Cairo, Arial", "#fff", "right", "rtl");
      ctx.fillText(fit(ctx, "برنامج التغذية — " + client, CW - 260), R, 64);
      T(ctx, "900 22px Inter, Arial", GOLD, "left", "ltr"); ctx.fillText("CAP / " + coach, P, 62);
    }
  }

  async function buildCanvases() {
    await loadFonts();
    const client = (NS.client || mainClient()).trim() || "عميل";
    const coach = coachName();
    const photo = await loadPhoto();
    const day = dayTotals();
    const sc = document.createElement("canvas").getContext("2d");

    const blocks = [];
    MEALS.forEach(m => {
      const items = NS.plan[m.id].map(it => ({ it, c: calcItem(it) })).filter(o => o.c);
      if (!items.length) return;
      const tot = sumCalc(items.map(o => o.c)), gs = items.reduce((a, o) => a + o.it.g, 0);
      blocks.push({ h: 100, keep: true, draw: (ctx, y) => drawMealHead(ctx, y, m, tot) });
      items.forEach(o => blocks.push({ h: 76, draw: (ctx, y) => drawFoodRow(ctx, y, o) }));
      blocks.push({ h: 90, draw: (ctx, y) => drawMealTotal(ctx, y, tot, gs) });
    });
    blocks.push({ h: 144, draw: (ctx, y) => drawDayTotal(ctx, y, day) });

    const w = num(NS.calc.w);
    if (w > 0) {
      const L = (w * 0.035).toFixed(1);
      blocks.push({
        h: 88, draw: (ctx, y) => {
          rr(ctx, P, y, CW, 64, 14); ctx.fillStyle = "#141418"; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "#333"; ctx.stroke();
          T(ctx, "800 19px Cairo, Arial", "#7dd3fc", "right", "rtl");
          ctx.fillText(`شرب الماء المقترح: حوالي ${L} لتر يوميًا`, R - 22, y + 40);
        }
      });
    }
    const notes = NS.notes.trim();
    if (notes) {
      sc.font = "600 18px Cairo, Arial";
      const lines = wrapLines(sc, notes, CW - 48, 12);
      const bh = 70 + lines.length * 32 + 6;
      blocks.push({
        h: bh + 22, draw: (ctx, y) => {
          rr(ctx, P, y, CW, bh, 16); ctx.fillStyle = "#141418"; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "#333"; ctx.stroke();
          T(ctx, "900 20px Cairo, Arial", GOLD2, "right", "rtl"); ctx.fillText("ملاحظات المدرب", R - 24, y + 38);
          T(ctx, "600 18px Cairo, Arial", "#ddd", "right", "rtl");
          lines.forEach((ln, i) => ctx.fillText(ln, R - 24, y + 76 + i * 32));
        }
      });
    }

    const START1 = 300 + 24 + 110 + 28, START2 = 104 + 26, MAXY = H - 70;
    const pages = [[]]; let y = START1;
    blocks.forEach((b, i) => {
      let need = b.h;
      if (b.keep && blocks[i + 1]) need += blocks[i + 1].h;
      if (y + need > MAXY && pages[pages.length - 1].length) { pages.push([]); y = START2; }
      pages[pages.length - 1].push({ b, y }); y += b.h;
    });

    const scale = 1.5, canvases = [];
    pages.forEach((pg, idx) => {
      const c = document.createElement("canvas");
      c.width = Math.round(W * scale); c.height = Math.round(H * scale);
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("المتصفح لا يدعم Canvas");
      ctx.scale(scale, scale);
      ctx.fillStyle = "#08080a"; ctx.fillRect(0, 0, W, H);
      drawHeader(ctx, idx, pages.length, client, coach, photo, day);
      pg.forEach(o => o.b.draw(ctx, o.y));
      T(ctx, "700 13px Inter, Arial", "#666", "center", "ltr");
      ctx.fillText(`CAP / ${coach} • NUTRITION PLAN • PAGE ${idx + 1}/${pages.length}`, W / 2, H - 26);
      canvases.push(c);
    });
    return canvases;
  }

  function dataURLToBlob(d) {
    const parts = d.split(","), mime = (parts[0].match(/:(.*?);/) || [])[1] || "image/png";
    const bin = atob(parts[1]), arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  function toBlob(c, type, q) {
    return new Promise((res, rej) => {
      try {
        if (c.toBlob) c.toBlob(b => { if (b) res(b); else { try { res(dataURLToBlob(c.toDataURL(type, q))); } catch (e) { rej(e); } } }, type, q);
        else res(dataURLToBlob(c.toDataURL(type, q)));
      } catch (e) { rej(e); }
    });
  }

  /* ---------------- نافذة نتيجة التصدير ----------------
     (بتشتغل على كل الأجهزة بما فيها الآيفون — بدون window.open
      عشان iOS بيحظره بعد العمليات الـ async)                     */
  let outUrls = [];
  function closeOut() {
    out.hidden = true; out.innerHTML = "";
    outUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} });
    outUrls = [];
    document.body.classList.remove("lock");
  }
  function showOut(cfg) {
    outUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} });
    outUrls = cfg.urls || [];
    let canShare = false;
    try { canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: cfg.files })); } catch (e) {}
    const acts = [];
    if (canShare) acts.push(`<button class="btn btn-gold" type="button" data-oact="share"><i class="fa-solid fa-share-nodes"></i> مشاركة / حفظ في الملفات</button>`);
    if (cfg.kind === "pdf") {
      acts.push(`<a class="btn btn-outline" href="${cfg.fileUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-up-right-from-square"></i> فتح الـ PDF</a>`);
      if (!IS_IOS) acts.push(`<a class="btn btn-ghost" href="${cfg.fileUrl}" download="${esc(cfg.files[0].name)}"><i class="fa-solid fa-download"></i> تحميل الـ PDF</a>`);
    } else if (!IS_IOS) {
      acts.push(`<button class="btn btn-outline" type="button" data-oact="dl"><i class="fa-solid fa-download"></i> تحميل ${cfg.files.length > 1 ? "كل الصور" : "الصورة"}</button>`);
    }
    const warn = (IS_IOS && IN_APP)
      ? `<p class="nut-warn">⚠️ أنت فاتح الموقع من جوه تطبيق (Instagram / Facebook / TikTok). التحميل ممكن ما يشتغلش — افتح الموقع من Safari عشان تحفظ الملف.</p>`
      : "";
    out.innerHTML = `<div class="nut-outbox">
      <button class="mclose" type="button" data-oact="close" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>
      <h3>${esc(cfg.title)}</h3>
      <p>${esc(cfg.hint)}</p>
      ${warn}
      <div class="nut-outacts">${acts.join("")}</div>
      <div class="nut-prev">${cfg.previews.map((s, i) => `<img src="${s}" alt="صفحة ${i + 1}">`).join("")}</div>
    </div>`;
    out.onclick = e => {
      const b = e.target.closest("[data-oact]");
      if (e.target === out) { closeOut(); return; }
      if (!b) return;
      const a = b.dataset.oact;
      if (a === "close") closeOut();
      else if (a === "share") {
        navigator.share({ files: cfg.files, title: cfg.files[0].name }).catch(err => {
          if (!err || err.name !== "AbortError") toast("تعذرت المشاركة، جرّب زر فتح الـ PDF أو اضغط ضغطة طويلة على الصورة");
        });
      } else if (a === "dl") {
        cfg.files.forEach((f, i) => setTimeout(() => {
          const u = URL.createObjectURL(f), el = document.createElement("a");
          el.href = u; el.download = f.name; el.style.display = "none";
          document.body.appendChild(el); el.click(); el.remove();
          setTimeout(() => URL.revokeObjectURL(u), 15000);
        }, i * 400));
      }
    };
    out.hidden = false; out.scrollTop = 0;
    document.body.classList.add("lock");
  }

  /* ---------------- تنفيذ التصدير ---------------- */
  async function exportNut(kind, btn) {
    if (!hasItems()) { toast("أضف أصناف للوجبات أولاً"); return; }
    btn.classList.add("busy");
    setSt("جاري تجهيز الصفحات...", "work");
    try {
      const canvases = await buildCanvases();
      const client = (NS.client || mainClient()).trim() || "client";
      const base = "CAP-Nutrition-" + safeName(client);

      /* ===== PNG ===== */
      if (kind === "png") {
        const blobs = [];
        for (const c of canvases) blobs.push(await toBlob(c, "image/png"));
        const files = blobs.map((b, i) => new File(
          [b],
          base + (blobs.length > 1 ? "-page" + (i + 1) : "") + ".png",
          { type: "image/png" }
        ));
        const urls = blobs.map(b => URL.createObjectURL(b));
        canvases.forEach(c => { c.width = 1; c.height = 1; });
        showOut({
          kind: "png",
          title: blobs.length > 1 ? `جاهز ✅ (${blobs.length} صفحات)` : "جاهز ✅",
          hint: IS_IOS
            ? "اضغط «مشاركة / حفظ في الملفات» واختار «حفظ الصورة»، أو اضغط ضغطة طويلة على أي صورة تحت واختار «إضافة إلى الصور»."
            : "حمّل الصور أو اضغط «مشاركة» لو متاحة على جهازك.",
          previews: urls, urls, files
        });
        setSt(`✅ ${blobs.length} صفحة جاهزة`, "ok");

      /* ===== PDF ===== */
      } else {
        const lib = window.jspdf && window.jspdf.jsPDF;
        if (!lib) throw new Error("مكتبة PDF لم تُحمَّل — تأكد من الاتصال بالإنترنت");

        const pdf = new lib({ orientation: "portrait", unit: "px", format: [W, H], compress: true });
        const PW = pdf.internal.pageSize.getWidth(), PH = pdf.internal.pageSize.getHeight();
        const previews = [];

        canvases.forEach((c, i) => {
          const d = c.toDataURL("image/jpeg", 0.92);
          previews.push(d);
          if (i > 0) pdf.addPage([W, H], "portrait");
          pdf.addImage(d, "JPEG", 0, 0, PW, PH, undefined, "FAST");
        });
        canvases.forEach(c => { c.width = 1; c.height = 1; });

        const blob = pdf.output("blob");
        const fileName = base + ".pdf";
        const file = new File([blob], fileName, { type: "application/pdf" });
        const fileUrl = URL.createObjectURL(blob);

        showOut({
          kind: "pdf",
          title: "ملف الـ PDF جاهز ✅",
          hint: IS_IOS
            ? "اضغط «مشاركة / حفظ في الملفات» ثم اختار Save to Files. ولو الزر مش ظاهر، اضغط «فتح الـ PDF» ثم أيقونة Share ثم Save to Files."
            : "اضغط «تحميل الـ PDF» أو «مشاركة» لو متاحة على جهازك.",
          previews,
          urls: [fileUrl],
          files: [file],
          fileUrl
        });
        setSt("✅ PDF جاهز", "ok");
      }

    } catch (err) {
      console.error(err);
      setSt("❌ تعذر التصدير: " + (err && err.message || err), "err");
    } finally {
      btn.classList.remove("busy");
    }
  }

  $q("#nutPngBtn", sec).addEventListener("click", e => exportNut("png", e.currentTarget));
  $q("#nutPdfBtn", sec).addEventListener("click", e => exportNut("pdf", e.currentTarget));

  /* ---------------- نسخ / واتساب ---------------- */
  function buildText() {
    const client = (NS.client || mainClient()).trim() || "عميل";
    const day = dayTotals();
    let t = `🍽 برنامج التغذية — CAP / ${coachName()}\n👤 اللاعب: ${client}\n`;
    if (NS.target.k > 0) t += `🎯 الهدف: ${GOALS[NS.calc.goal]} (${fmt0(NS.target.k)} سعرة)\n`;
    MEALS.forEach(m => {
      const items = NS.plan[m.id].map(it => ({ it, c: calcItem(it) })).filter(o => o.c);
      if (!items.length) return;
      const tot = sumCalc(items.map(o => o.c));
      t += `\n━━━━━━━━━━━━\n🔸 ${m.n}${NS.times[m.id] ? " (" + NS.times[m.id] + ")" : ""}\n`;
      items.forEach(o => {
        const pt = pieceText(o.c.f, o.it.g);
        t += `• ${o.c.f.n} — ${fmt(o.it.g)} جم${pt ? " (" + pt + ")" : ""} — ${fmt0(o.c.k)} سعرة\n`;
      });
      t += `المجموع: ${fmt0(tot.k)} سعرة | P ${fmt(tot.p)} | C ${fmt(tot.c)} | F ${fmt(tot.f)}\n`;
    });
    t += `\n━━━━━━━━━━━━\n📊 إجمالي اليوم: ${fmt0(day.k)} سعرة\nبروتين ${fmt(day.p)} جم • كارب ${fmt(day.c)} جم • دهون ${fmt(day.f)} جم\n`;
    if (NS.notes.trim()) t += `\n📝 ملاحظات: ${NS.notes.trim()}\n`;
    return t;
  }
  $q("#nutCopyBtn", sec).addEventListener("click", async () => {
    if (!hasItems()) { toast("أضف أصناف للوجبات أولاً"); return; }
    const text = buildText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else throw new Error("no clipboard");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      ta.remove();
    }
    toast("تم نسخ البرنامج ✅");
  });
  $q("#nutWaBtn", sec).addEventListener("click", () => {
    if (!hasItems()) { toast("أضف أصناف للوجبات أولاً"); return; }
    const a = document.createElement("a");
    a.href = "https://wa.me/?text=" + encodeURIComponent(buildText());
    a.target = "_blank"; a.rel = "noopener"; a.style.display = "none";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------------- تشغيل ---------------- */
  load();
  fillInputs();
  renderMeals();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();