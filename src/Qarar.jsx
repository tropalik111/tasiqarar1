import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import {
  TrendingUp, Activity, Waves, Target, Brain, BookOpen, Briefcase,
  PlayCircle, Home, BarChart3, ChevronRight, Circle, Sparkles,
  AlertCircle, Eye, Droplets, Plus, Calendar, Sun, Moon, Languages,
  Settings, LogOut, Edit3, Trash2, Save, X, Youtube, User, Shield,
  EyeOff,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   QARAR — Saudi Market Intelligence Platform
   Full UI + Admin panel + localStorage persistence
   ────────────────────────────────────────────────────────────────── */

const ADMIN_PASSWORD = "qarar2026"; // CHANGE THIS in production!

const THEMES = {
  dark: {
    ink: "#0B0F14", surface: "#11161D", surface2: "#161C25",
    border: "#1E2632", borderHi: "#2A3442", muted: "#5D6878",
    text: "#D8DEE7", textHi: "#F4F1EA", gold: "#C9A86A",
    goldDim: "#8C754A", green: "#7DB48F", red: "#C97A7A",
    blue: "#7A9EC9", amber: "#D4A55C",
  },
  light: {
    ink: "#F7F4ED", surface: "#FFFFFF", surface2: "#F0EBE0",
    border: "#E2DDD0", borderHi: "#C9C2B0", muted: "#8B8470",
    text: "#3D3A33", textHi: "#1A1814", gold: "#A88847",
    goldDim: "#7A6232", green: "#5A8F6E", red: "#A85959",
    blue: "#4F7AAB", amber: "#B88836",
  },
};

const fontDisplay = `'Cormorant Garamond', Georgia, serif`;
const fontBody = `'Inter Tight', sans-serif`;
const fontArabic = `'Tajawal', sans-serif`;
const fontNastaliq = `'Noto Nastaliq Urdu', serif`;
const fontMono = `'JetBrains Mono', monospace`;

/* ── i18n ──────────────────────────────────────────────────────── */

const STRINGS = {
  en: {
    dir: "ltr",
    brand: "Saudi Market Intelligence",
    nav: {
      home: "Overview", stock: "Stock Analysis", market: "Market",
      portfolio: "Portfolio", journal: "Journal", weekly: "Weekly Review",
    },
    adminNav: { dashboard: "Dashboard", stocks: "Stocks", market: "Market View", weekly: "Weekly Video" },
    tadawul: "Tadawul · TASI",
    synthBy: "QARAR · INTELLIGENCE SYNTHESIS",
    trendStrength: "Trend Strength", bullishBias: "Bullish bias", liquidityIn: "Liquidity in",
    mostActive: "Most Active", today: "Today", sectors: "Sectors", heatmap: "Heatmap",
    tiles: [
      { t: "Stock Analysis", d: "Wave structure, momentum, liquidity" },
      { t: "Market Overview", d: "Direction, reversal zones, flow" },
      { t: "Portfolio", d: "Trades, P/L, post-trade review" },
      { t: "Weekly Review", d: "Friday video synthesis" },
    ],
    energy: "ENERGY", live: "SAR · LIVE",
    bullishWave3: "Bullish", liquidityInflow: "Liquidity Inflow", highConviction: "High Conviction",
    waveDaily: "Elliott Wave · Daily", impulsive: "Impulsive sequence in progress",
    waveStructure: "Wave Structure", currentlyIn: "Currently in",
    waveDesc: "The strongest and most extended wave of the impulsive sequence. Price action confirms institutional participation.",
    continuation: "Continuation", reversal: "Reversal",
    momentumFlow: "Momentum & Flow", momentum: "Momentum", liquidity: "Liquidity",
    inflow: "Inflow", volume: "Volume",
    keyZones: "Key Zones", resistance: "Resistance", support: "Support", current: "Current",
    aiSynthesis: "Qarar Synthesis · Analyst Reading",
    confidenceHigh: "CONFIDENCE · HIGH", horizon: "HORIZON · 2–4 WEEKS", updated: "UPDATED",
    news: "News", impact: "Impact", last7days: "Last 7 days",
    strong: "Strong", moderate: "Moderate", neutral: "Neutral",
    marketStructure: "Tadawul · Market Structure",
    marketHeadline: ["The market is", "bullish", ", with", "moderate", "conviction."],
    tasiLevel: "TASI Level", todayPct: "▲ +0.36% today", moderateClimbing: "Moderate · climbing",
    breadth: "Breadth", advancersDecliners: "Advancers vs decliners",
    volatility: "Volatility", vtad: "VTAD · subdued",
    wavePosture: "Wave Posture · TASI", finishingWave4: ["Index is finishing", "Wave 4", "consolidation"],
    reversalWatch: "Reversal Watch",
    threeZones: "Three zones warrant attention over the next 5 sessions.",
    reversalItems: [
      { z: "11,920 – 11,980", w: "Upside resistance cluster", p: "Likely pause" },
      { z: "11,640 – 11,720", w: "Wave 4 floor", p: "Active support" },
      { z: "11,400", w: "Structural invalidation", p: "Bullish thesis fails" },
    ],
    liquidityRotation: "Liquidity Rotation", fiveDayFlow: "SAR · 5-day flow",
    netInflow: "Net inflow", netOutflow: "Net outflow",
    portfolio: "Portfolio", invested: "Invested", positions: "3 positions",
    currentValue: "Current Value", openPL: "Open P/L",
    realizedUnrealized: "SAR · realized + unrealized",
    returnLbl: "Return", sinceInception: "Since inception",
    openPositions: "Open Positions", addTrade: "Add Trade", save: "Save",
    fields: ["Symbol", "Quantity", "Entry Price", "Take Profit", "Stop Loss"],
    cols: ["Sym", "Name", "Qty", "Entry", "Now", "TP / SL", "P/L", "Note"],
    disciplineScore: "Discipline Score", adherence: "Adherence to plan",
    disciplineMsg: ["You followed your", "pre-set stop loss", "in 9 of 11 closed trades."],
    postTradeLessons: "Post-Trade Lessons",
    lessons: [
      { d: "08 May", t: "Closed SABIC early due to news anxiety — momentum was still intact." },
      { d: "02 May", t: "Aramco TP hit cleanly. Entry on Wave 2 retracement worked." },
      { d: "27 Apr", t: "STC trade chopped on Wave 4. Should have waited for breakout confirmation." },
    ],
    journalTitle: "Trading Journal", everyTradeLesson: ["Every trade is a", "lesson", "."],
    journalSub: "Record reasoning, emotions, and outcome. Build the trader you want to become.",
    thisMonth: "This Month", tradesLogged: "trades logged",
    winRate: "Win Rate", winLoss: "9 wins · 5 losses",
    avgRR: "Avg R:R", rewardRisk: "reward to risk",
    recentEntries: "Recent Entries", newEntry: "+ New Entry",
    win: "Win", loss: "Loss",
    reasoning: "Reasoning", emotion: "Emotion", lesson: "Lesson",
    entries: [
      { date: "11 May 2026", sym: "2222 Aramco", outcome: "Win",
        reasoning: "Wave 3 thesis confirmed by volume expansion above 27.50. Entered on pullback to 27.20 with stop below Wave 2 low.",
        emotion: "Patient — waited for confirmation. No FOMO.",
        lesson: "When the structure agrees with momentum and news, conviction can be higher." },
      { date: "06 May 2026", sym: "2010 SABIC", outcome: "Loss",
        reasoning: "Took a counter-trend bounce trade against the prevailing Wave A. Plan was to exit at 76.50, exited at 75.20.",
        emotion: "Anxious about earnings — exited before invalidation.",
        lesson: "Don't trade against confirmed corrective structures. The setup was weak from the start." },
      { date: "29 Apr 2026", sym: "1180 Al Rajhi", outcome: "Win",
        reasoning: "Bank sector rotation evident. Liquidity gauge flipped positive. Entered on breakout above 89.00.",
        emotion: "Confident — sector tailwind clear.",
        lesson: "Sector flow is a leading signal worth respecting." },
    ],
    weeklyReview: "Weekly Review", tadawulWeekAhead: ["Tadawul, the", "week ahead", "."],
    chapters: "This Week's Chapters",
    chaptersList: [
      "00:00 — TASI structure & wave count",
      "03:42 — Energy sector deep dive",
      "08:15 — Banks: rotation in progress",
      "12:08 — Three stocks to watch",
      "15:30 — Scenarios for next week",
    ],
    threeScenarios: "Three Scenarios · Next Week",
    archive: "Archive",
    archiveItems: [
      { w: "Week 18", t: "Banks lead the rotation" },
      { w: "Week 17", t: "TASI tests 11,500" },
      { w: "Week 16", t: "Earnings season setup" },
      { w: "Week 15", t: "Energy thesis intact" },
    ],
    disclaimer: "Qarar provides analysis and structural interpretation only — never direct buy or sell recommendations.",
    copyright: "© 2026 QARAR · RIYADH",
    sectors_data: ["Energy", "Banks", "Materials", "Telecom", "Utilities", "Real Estate", "Healthcare", "Retail"],
    // Admin
    adminLogin: "Admin Sign In", adminPasswordLabel: "Admin password",
    signIn: "Sign in", logout: "Sign out",
    welcomeAdmin: "Welcome back", todayDate: "Today",
    publishedAnalyses: "Published Analyses", pendingTasks: "Today's Tasks",
    tasks: ["Update TASI market view", "Publish key stock analyses", "Record Friday's video"],
    addNew: "Add New", edit: "Edit", delete: "Delete", cancel: "Cancel",
    publish: "Publish", unpublish: "Unpublish", published: "Published", draft: "Draft",
    confirmDelete: "Delete this analysis?",
    formStock: "Stock Name", formSymbol: "Symbol", formWave: "Current Wave",
    formContinuation: "Continuation %", formReversal: "Reversal %",
    formSupport: "Support", formResistance: "Resistance",
    formPrice: "Current Price", formChange: "Change %",
    formAnalysis: "Analysis", formNotice: "Reminder: structural interpretation only, no direct buy/sell recommendations.",
    marketDirection: "Direction",
    bullish: "Bullish", bearish: "Bearish", sideways: "Sideways",
    marketView: "Market View", marketQuote: "Quote (short)",
    weekNumber: "Week Number", videoTitle: "Title", videoUrl: "YouTube URL",
    videoUrlPlaceholder: "https://youtube.com/watch?v=...",
    videoDescription: "Description", scenarios: "Scenarios",
    scenarioLabel: "Scenario", probability: "Probability %", description: "Description",
    saved: "Saved",
    backToSite: "Back to Site", goToAdmin: "Admin",
    minAgo: "min ago", hourAgo: "h ago", dayAgo: "d ago",
    yourAnalyses: "Latest Analyses",
    noAnalyses: "No analyses published yet.",
    watchVideo: "Watch on YouTube",
  },
  ar: {
    dir: "rtl",
    brand: "ذكاء السوق السعودي",
    nav: {
      home: "نظرة عامة", stock: "تحليل السهم", market: "السوق",
      portfolio: "المحفظة", journal: "اليوميات", weekly: "المراجعة الأسبوعية",
    },
    adminNav: { dashboard: "اللوحة", stocks: "الأسهم", market: "نظرة السوق", weekly: "الفيديو الأسبوعي" },
    tadawul: "تداول · تاسي",
    synthBy: "قرار · توليفة ذكية",
    trendStrength: "قوة الاتجاه", bullishBias: "ميل صعودي", liquidityIn: "تدفق السيولة",
    mostActive: "الأكثر", today: "نشاطاً", sectors: "خريطة", heatmap: "القطاعات",
    tiles: [
      { t: "تحليل السهم", d: "هيكل الموجات، الزخم، السيولة" },
      { t: "نظرة على السوق", d: "الاتجاه، مناطق الانعكاس، التدفق" },
      { t: "المحفظة", d: "الصفقات، الأرباح والخسائر، التقييم" },
      { t: "المراجعة الأسبوعية", d: "توليفة فيديو الجمعة" },
    ],
    energy: "قطاع الطاقة", live: "ريال · مباشر",
    bullishWave3: "صعودي", liquidityInflow: "تدفق سيولة", highConviction: "ثقة عالية",
    waveDaily: "موجات إليوت · يومي", impulsive: "تسلسل دافع قيد التنفيذ",
    waveStructure: "هيكل الموجات", currentlyIn: "حالياً في",
    waveDesc: "أقوى وأطول موجة في التسلسل الدافع. حركة السعر تؤكد مشاركة المؤسسات.",
    continuation: "استمرار", reversal: "انعكاس",
    momentumFlow: "الزخم والتدفق", momentum: "الزخم", liquidity: "السيولة",
    inflow: "تدفق داخل", volume: "الحجم",
    keyZones: "المناطق الرئيسية", resistance: "مقاومة", support: "دعم", current: "الحالي",
    aiSynthesis: "توليفة قرار · قراءة المحلل",
    confidenceHigh: "الثقة · مرتفعة", horizon: "الأفق · ٢ – ٤ أسابيع", updated: "آخر تحديث",
    news: "الأخبار", impact: "التأثير", last7days: "آخر ٧ أيام",
    strong: "قوي", moderate: "متوسط", neutral: "محايد",
    marketStructure: "تداول · هيكل السوق",
    marketHeadline: ["السوق", "صعودي", "، بقناعة", "متوسطة", "."],
    tasiLevel: "مستوى تاسي", todayPct: "▲ +٠.٣٦٪ اليوم", moderateClimbing: "متوسطة · في صعود",
    breadth: "الاتساع", advancersDecliners: "الصاعدة مقابل الهابطة",
    volatility: "التذبذب", vtad: "VTAD · هادئ",
    wavePosture: "وضعية الموجة · تاسي", finishingWave4: ["المؤشر ينهي تماسك", "الموجة الرابعة", ""],
    reversalWatch: "مراقبة الانعكاس",
    threeZones: "ثلاث مناطق تستحق الانتباه خلال الجلسات الخمس القادمة.",
    reversalItems: [
      { z: "١١,٩٢٠ – ١١,٩٨٠", w: "تجمع مقاومة علوي", p: "توقف محتمل" },
      { z: "١١,٦٤٠ – ١١,٧٢٠", w: "أرضية الموجة الرابعة", p: "دعم نشط" },
      { z: "١١,٤٠٠", w: "إبطال هيكلي", p: "تفشل الفرضية الصعودية" },
    ],
    liquidityRotation: "دوران السيولة", fiveDayFlow: "ريال · تدفق ٥ أيام",
    netInflow: "تدفق صافي", netOutflow: "خروج صافي",
    portfolio: "المحفظة", invested: "المستثمر", positions: "٣ مراكز",
    currentValue: "القيمة الحالية", openPL: "الربح/الخسارة المفتوحة",
    realizedUnrealized: "ريال · محقق + غير محقق",
    returnLbl: "العائد", sinceInception: "منذ البداية",
    openPositions: "المراكز المفتوحة", addTrade: "إضافة صفقة", save: "حفظ",
    fields: ["الرمز", "الكمية", "سعر الدخول", "جني الأرباح", "وقف الخسارة"],
    cols: ["الرمز", "الاسم", "الكمية", "الدخول", "الآن", "TP / SL", "ر/خ", "ملاحظة"],
    disciplineScore: "درجة الانضباط", adherence: "الالتزام بالخطة",
    disciplineMsg: ["التزمت بـ", "وقف الخسارة المحدد مسبقاً", "في ٩ من ١١ صفقة مغلقة."],
    postTradeLessons: "دروس ما بعد الصفقة",
    lessons: [
      { d: "٨ مايو", t: "أغلقت سابك مبكراً بسبب قلق من الأخبار — الزخم كان لا يزال سليماً." },
      { d: "٢ مايو", t: "أرامكو لامست هدف الربح بدقة. الدخول عند تصحيح الموجة الثانية نجح." },
      { d: "٢٧ أبريل", t: "صفقة الاتصالات تذبذبت في الموجة الرابعة. كان عليّ انتظار تأكيد الاختراق." },
    ],
    journalTitle: "يوميات التداول", everyTradeLesson: ["كل صفقة", "درس", "."],
    journalSub: "سجّل الأسباب، المشاعر، والنتيجة. ابنِ المتداول الذي تريد أن تصبحه.",
    thisMonth: "هذا الشهر", tradesLogged: "صفقة مسجلة",
    winRate: "نسبة الفوز", winLoss: "٩ فوز · ٥ خسارة",
    avgRR: "متوسط ع/م", rewardRisk: "العائد إلى المخاطرة",
    recentEntries: "أحدث المدخلات", newEntry: "+ مدخل جديد",
    win: "فوز", loss: "خسارة",
    reasoning: "السبب", emotion: "الشعور", lesson: "الدرس",
    entries: [
      { date: "١١ مايو ٢٠٢٦", sym: "٢٢٢٢ أرامكو", outcome: "فوز",
        reasoning: "فرضية الموجة الثالثة تأكدت بتوسع الحجم فوق ٢٧.٥٠. دخلت على ارتداد لـ ٢٧.٢٠ بوقف تحت قاع الموجة الثانية.",
        emotion: "صبور — انتظرت التأكيد. لا خوف من تفويت الفرصة.",
        lesson: "حين يتفق الهيكل مع الزخم والأخبار، يمكن أن تكون القناعة أعلى." },
      { date: "٦ مايو ٢٠٢٦", sym: "٢٠١٠ سابك", outcome: "خسارة",
        reasoning: "أخذت صفقة ارتداد عكس الاتجاه ضد الموجة A السائدة. الخطة كانت الخروج عند ٧٦.٥٠، خرجت عند ٧٥.٢٠.",
        emotion: "قلق من الأرباح — خرجت قبل الإبطال.",
        lesson: "لا تتداول عكس الهياكل التصحيحية المؤكدة. الإعداد كان ضعيفاً من البداية." },
      { date: "٢٩ أبريل ٢٠٢٦", sym: "١١٨٠ الراجحي", outcome: "فوز",
        reasoning: "دوران قطاع البنوك واضح. مؤشر السيولة انقلب إيجابياً. دخلت على اختراق فوق ٨٩.٠٠.",
        emotion: "واثق — دعم القطاع واضح.",
        lesson: "تدفق القطاع إشارة قائدة تستحق الاحترام." },
    ],
    weeklyReview: "المراجعة الأسبوعية", tadawulWeekAhead: ["تداول،", "الأسبوع القادم", "."],
    chapters: "فصول هذا الأسبوع",
    chaptersList: [
      "٠٠:٠٠ — هيكل تاسي وعدّ الموجات",
      "٠٣:٤٢ — تعمق في قطاع الطاقة",
      "٠٨:١٥ — البنوك: الدوران قيد التنفيذ",
      "١٢:٠٨ — ثلاثة أسهم للمراقبة",
      "١٥:٣٠ — سيناريوهات الأسبوع القادم",
    ],
    threeScenarios: "ثلاثة سيناريوهات · الأسبوع القادم",
    archive: "الأرشيف",
    archiveItems: [
      { w: "الأسبوع ١٨", t: "البنوك تقود الدوران" },
      { w: "الأسبوع ١٧", t: "تاسي يختبر ١١,٥٠٠" },
      { w: "الأسبوع ١٦", t: "إعداد موسم الأرباح" },
      { w: "الأسبوع ١٥", t: "فرضية الطاقة سليمة" },
    ],
    disclaimer: "قرار يقدم التحليل والتفسير الهيكلي فقط — لا توصيات شراء أو بيع مباشرة.",
    copyright: "© ٢٠٢٦ قرار · الرياض",
    sectors_data: ["الطاقة", "البنوك", "المواد الأساسية", "الاتصالات", "المرافق", "العقار", "الرعاية الصحية", "التجزئة"],
    // Admin
    adminLogin: "دخول المدير", adminPasswordLabel: "كلمة مرور المدير",
    signIn: "دخول", logout: "خروج",
    welcomeAdmin: "أهلاً بعودتك", todayDate: "اليوم",
    publishedAnalyses: "التحليلات المنشورة", pendingTasks: "مهام اليوم",
    tasks: ["تحديث نظرة تاسي العامة", "نشر تحليلات الأسهم الرئيسية", "تسجيل فيديو الجمعة"],
    addNew: "إضافة", edit: "تعديل", delete: "حذف", cancel: "إلغاء",
    publish: "نشر", unpublish: "إخفاء", published: "منشور", draft: "مسودة",
    confirmDelete: "حذف هذا التحليل؟",
    formStock: "اسم السهم", formSymbol: "الرمز", formWave: "الموجة الحالية",
    formContinuation: "احتمال الاستمرار %", formReversal: "احتمال الانعكاس %",
    formSupport: "الدعم", formResistance: "المقاومة",
    formPrice: "السعر الحالي", formChange: "التغير %",
    formAnalysis: "التحليل", formNotice: "تذكير: تفسير هيكلي فقط، لا توصيات شراء/بيع مباشرة.",
    marketDirection: "الاتجاه",
    bullish: "صعودي", bearish: "هبوطي", sideways: "جانبي",
    marketView: "نظرة السوق", marketQuote: "اقتباس (قصير)",
    weekNumber: "رقم الأسبوع", videoTitle: "العنوان", videoUrl: "رابط يوتيوب",
    videoUrlPlaceholder: "https://youtube.com/watch?v=...",
    videoDescription: "الوصف", scenarios: "السيناريوهات",
    scenarioLabel: "السيناريو", probability: "الاحتمال %", description: "الوصف",
    saved: "حُفظ",
    backToSite: "العودة للموقع", goToAdmin: "المدير",
    minAgo: "د", hourAgo: "س", dayAgo: "ي",
    yourAnalyses: "أحدث التحليلات",
    noAnalyses: "لا توجد تحليلات منشورة بعد.",
    watchVideo: "شاهد على يوتيوب",
  },
};

const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

/* ── Defaults / seeds ──────────────────────────────────────────── */

const DEFAULT_TASI = { value: 11847.23, change: 42.18, changePct: 0.36, strength: 68 };

const DEFAULT_MARKET = {
  direction: "bullish",
  strength: 68,
  quote: "The structure favors continuation. Momentum holds above the 50-period mean while liquidity rotates into Energy and Banks.",
  quoteAr: "الهيكل يدعم الاستمرار. الزخم يبقى فوق المتوسط لخمسين فترة، بينما تتدفق السيولة نحو الطاقة والبنوك.",
  quoteHighlight: ["Energy", "Banks"],
  quoteHighlightAr: ["الطاقة", "البنوك"],
  updatedAt: Date.now(),
};

const DEFAULT_STOCKS = [
  {
    id: "s1", sym: "2222", name: "Saudi Aramco", nameAr: "أرامكو السعودية",
    wave: "Wave 3", waveAr: "الموجة الثالثة",
    continuation: 72, reversal: 28,
    momentum: 74, support: 26.20, resistance: 30.10,
    price: 28.84, change: 0.42,
    analysis: "Aramco has cleared its Wave 2 retracement at 26.20 and is extending the third leg of the impulsive structure. Momentum confirms via rising volume and a tightening spread. The most probable path is continuation toward the 30.10 zone, with invalidation only on a decisive close below 26.20.",
    analysisAr: "أرامكو تجاوزت تصحيح الموجة الثانية عند ٢٦.٢٠ وتمدد ساقها الثالث ضمن الهيكل الدافع. الزخم يتأكد عبر ارتفاع الحجم وضيق الفارق. المسار الأرجح هو الاستمرار نحو منطقة ٣٠.١٠، مع إبطال الفرضية فقط على إغلاق حاسم تحت ٢٦.٢٠.",
    sector: "Energy", sectorAr: "الطاقة",
    published: true, featured: true,
    updatedAt: Date.now() - 1000 * 60 * 42,
  },
  {
    id: "s2", sym: "1180", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي",
    wave: "Wave 5", waveAr: "الموجة الخامسة",
    continuation: 55, reversal: 45,
    momentum: 62, support: 88.00, resistance: 96.00,
    price: 92.15, change: 1.10,
    analysis: "Banks sector rotation evident. Liquidity flipped positive. Currently extending the fifth wave with possible exhaustion near 96.",
    analysisAr: "دوران قطاع البنوك واضح. السيولة انقلبت إيجابية. حالياً تمدد الموجة الخامسة مع احتمال إرهاق قرب ٩٦.",
    sector: "Banks", sectorAr: "البنوك",
    published: true, featured: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
];

const DEFAULT_WEEKLY = {
  week: 19,
  title: "Tadawul, the week ahead",
  titleAr: "تداول، الأسبوع القادم",
  url: "",
  description: "Energy continues to lead. Banks rotate in. Materials show fatigue. We map the three scenarios for next week.",
  descriptionAr: "الطاقة تواصل القيادة. البنوك تدخل بالدوران. المواد تظهر إرهاقاً. نرسم ثلاثة سيناريوهات للأسبوع القادم.",
  scenarios: [
    { label: "Continuation higher", labelAr: "استمرار صعودي", prob: 55, desc: "Index breaks 11,920 and extends toward 12,100.", descAr: "المؤشر يخترق ١١,٩٢٠ ويمتد نحو ١٢,١٠٠." },
    { label: "Sideways consolidation", labelAr: "تماسك جانبي", prob: 30, desc: "Range-bound 11,720 – 11,920 through the week.", descAr: "نطاق ١١,٧٢٠ – ١١,٩٢٠ طوال الأسبوع." },
    { label: "Corrective pullback", labelAr: "تصحيح هبوطي", prob: 15, desc: "Loses 11,720, targets 11,400 zone.", descAr: "يخسر ١١,٧٢٠ ويستهدف منطقة ١١,٤٠٠." },
  ],
  updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
};

const SECTORS_PCT = [1.24, 0.81, -0.42, 0.18, -0.67, 0.95, 0.34, -0.21];
const SECTORS_VOL = [412, 380, 295, 142, 88, 210, 96, 154];

const generatePriceSeries = (n = 90, start = 27.5) => {
  const out = [];
  let p = start;
  for (let i = 0; i < n; i++) {
    const drift = Math.sin(i / 7) * 0.18 + Math.cos(i / 11) * 0.12;
    const noise = (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.6;
    p = Math.max(24, p + drift + noise);
    out.push(p);
  }
  return out;
};

const ARAMCO_SERIES = generatePriceSeries(90, 27.5);
const WAVE_POINTS = [
  { i: 5, label: "0" }, { i: 18, label: "1" }, { i: 28, label: "2" },
  { i: 48, label: "3" }, { i: 60, label: "4" }, { i: 82, label: "5" },
];

/* ── Helpers ───────────────────────────────────────────────────── */

const fmt = (n, d = 2, lang = "en") => {
  if (typeof n !== "number" || isNaN(n)) return "—";
  const locale = lang === "ar" ? "ar-SA" : "en-US";
  return n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
};
const pct = (n, lang = "en") => `${n >= 0 ? "+" : ""}${fmt(n, 2, lang)}%`;
const timeAgo = (ts, lang) => {
  const t = STRINGS[lang];
  const diff = Date.now() - (ts || Date.now());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} ${t.minAgo}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ${t.hourAgo}`;
  return `${Math.floor(hours / 24)} ${t.dayAgo}`;
};

// LocalStorage helpers
const ls = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

/* ── Reusable atoms ────────────────────────────────────────────── */

const Card = ({ children, style, className = "", onClick }) => {
  const { c } = useApp();
  return (
    <div onClick={onClick} className={className} style={{
      background: c.surface, border: `1px solid ${c.border}`,
      borderRadius: 4, ...style,
    }}>
      {children}
    </div>
  );
};

const SectionLabel = ({ children, accent }) => {
  const { c } = useApp();
  return (
    <div style={{
      fontFamily: fontMono, fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: accent ? c.gold : c.muted,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ width: 18, height: 1, background: accent ? c.gold : c.border }} />
      {children}
    </div>
  );
};

const Stat = ({ label, value, sub, accent }) => {
  const { c, lang } = useApp();
  return (
    <div>
      <div style={{
        fontFamily: lang === "ar" ? fontArabic : fontMono,
        fontSize: 10, letterSpacing: "0.12em", color: c.muted,
        textTransform: "uppercase", marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: fontDisplay, fontSize: 32, fontWeight: 400,
        color: accent || c.textHi, lineHeight: 1, letterSpacing: "-0.01em",
      }}>{value}</div>
      {sub && <div style={{
        fontFamily: lang === "ar" ? fontArabic : fontMono,
        fontSize: 11, color: c.muted, marginTop: 6,
      }}>{sub}</div>}
    </div>
  );
};

const Pill = ({ children, color }) => {
  const { c } = useApp();
  const col = color || c.gold;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px", fontFamily: fontMono, fontSize: 10,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: col, border: `1px solid ${col}40`,
      background: `${col}10`, borderRadius: 2,
    }}>{children}</span>
  );
};

const Button = ({ children, onClick, variant = "primary", icon: Icon, size = "md", type = "button", style }) => {
  const { c, lang } = useApp();
  const styles = {
    primary: { bg: c.gold, color: c.ink, border: c.gold },
    secondary: { bg: "transparent", color: c.gold, border: c.gold + "60" },
    ghost: { bg: "transparent", color: c.muted, border: c.border },
    danger: { bg: "transparent", color: c.red, border: c.red + "60" },
  };
  const s = styles[variant];
  const padding = size === "sm" ? "6px 12px" : "9px 16px";
  return (
    <button type={type} onClick={onClick} style={{
      padding, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: lang === "ar" ? fontArabic : fontMono,
      fontSize: size === "sm" ? 11 : 12,
      letterSpacing: lang === "ar" ? "0" : "0.1em",
      textTransform: lang === "ar" ? "none" : "uppercase",
      cursor: "pointer", borderRadius: 2,
      display: "inline-flex", alignItems: "center", gap: 8, ...style,
    }}>
      {Icon && <Icon size={size === "sm" ? 12 : 14} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, textarea, rows = 3 }) => {
  const { c, lang } = useApp();
  const isAr = lang === "ar";
  const Tag = textarea ? "textarea" : "input";
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{
        fontFamily: isAr ? fontArabic : fontMono,
        fontSize: 10, color: c.muted,
        letterSpacing: isAr ? "0" : "0.12em",
        textTransform: isAr ? "none" : "uppercase",
        marginBottom: 6,
      }}>{label}</div>
      <Tag type={type} value={value === undefined || value === null ? "" : value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        rows={textarea ? rows : undefined}
        style={{
          width: "100%", padding: "10px 12px", background: c.ink,
          border: `1px solid ${c.border}`, color: c.textHi,
          fontFamily: isAr ? fontArabic : fontBody,
          fontSize: 14, borderRadius: 2,
          resize: textarea ? "vertical" : "none",
          minHeight: textarea ? rows * 24 : undefined,
        }}
      />
    </label>
  );
};

/* ── Logo ──────────────────────────────────────────────────────── */

const Logo = ({ size = 34, color }) => {
  const { c } = useApp();
  const col = color || c.gold;
  const w = size;
  const h = size * 1.3;
  return (
    <svg width={w} height={h} viewBox="0 0 40 52">
      <rect x="3" y="2" width="34" height="48" fill="none" stroke={col} strokeWidth="1.4"/>
      <line x1="20" y1="9" x2="20" y2="14" stroke={col} strokeWidth="1.8"/>
      <rect x="14" y="14" width="12" height="9" fill="none" stroke={col} strokeWidth="2.2"/>
      <line x1="20" y1="23" x2="20" y2="44" stroke={col} strokeWidth="1.8"/>
    </svg>
  );
};

/* ── Wave Chart ────────────────────────────────────────────────── */

const WaveChart = ({ series = ARAMCO_SERIES, height = 320, support = 26.2, resistance = 30.1 }) => {
  const { c, lang } = useApp();
  const w = 800;
  const h = height;
  const pad = { l: 50, r: 30, t: 30, b: 40 };
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min;
  const xs = series.map((_, i) => pad.l + (i / (series.length - 1)) * (w - pad.l - pad.r));
  const ys = series.map((v) => pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaPath = `${path} L ${xs[xs.length - 1]} ${h - pad.b} L ${xs[0]} ${h - pad.b} Z`;
  const yFor = (p) => pad.t + (1 - (p - min) / range) * (h - pad.t - pad.b);

  const monthsEn = ["AUG", "SEP", "OCT", "NOV"];
  const monthsAr = ["أغسطس", "سبتمبر", "أكتوبر", "نوفمبر"];
  const months = lang === "ar" ? monthsAr : monthsEn;
  const resLabel = lang === "ar" ? "مقاومة" : "RES";
  const supLabel = lang === "ar" ? "دعم" : "SUP";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.gold} stopOpacity="0.18" />
          <stop offset="100%" stopColor={c.gold} stopOpacity="0" />
        </linearGradient>
        <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 40" fill="none" stroke={c.border} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x={pad.l} y={pad.t} width={w - pad.l - pad.r} height={h - pad.t - pad.b} fill="url(#grid)" opacity="0.4" />
      {resistance >= min && resistance <= max && (
        <>
          <rect x={pad.l} y={yFor(resistance + 0.3)}
            width={w - pad.l - pad.r}
            height={Math.max(0, yFor(resistance - 0.3) - yFor(resistance + 0.3))}
            fill={c.red} opacity="0.08" />
          <line x1={pad.l} x2={w - pad.r} y1={yFor(resistance)} y2={yFor(resistance)} stroke={c.red} strokeDasharray="2 4" strokeWidth="0.8" opacity="0.5" />
          <text x={w - pad.r - 4} y={yFor(resistance) - 4} textAnchor="end" fontFamily={lang === "ar" ? fontArabic : fontMono} fontSize="9" fill={c.red} letterSpacing="0.1em">
            {resLabel} {fmt(resistance, 2, lang)}
          </text>
        </>
      )}
      {support >= min && support <= max && (
        <>
          <rect x={pad.l} y={yFor(support + 0.3)}
            width={w - pad.l - pad.r}
            height={Math.max(0, yFor(support - 0.3) - yFor(support + 0.3))}
            fill={c.green} opacity="0.08" />
          <line x1={pad.l} x2={w - pad.r} y1={yFor(support)} y2={yFor(support)} stroke={c.green} strokeDasharray="2 4" strokeWidth="0.8" opacity="0.5" />
          <text x={w - pad.r - 4} y={yFor(support) + 12} textAnchor="end" fontFamily={lang === "ar" ? fontArabic : fontMono} fontSize="9" fill={c.green} letterSpacing="0.1em">
            {supLabel} {fmt(support, 2, lang)}
          </text>
        </>
      )}
      <path d={areaPath} fill="url(#areaG)" />
      <path d={path} fill="none" stroke={c.gold} strokeWidth="1.4" />
      <path d={WAVE_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${xs[p.i]} ${ys[p.i]}`).join(" ")}
        fill="none" stroke={c.textHi} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
      {WAVE_POINTS.map((p, i) => (
        <g key={i}>
          <circle cx={xs[p.i]} cy={ys[p.i]} r="3" fill={c.ink} stroke={c.gold} strokeWidth="1.2" />
          <text x={xs[p.i]} y={ys[p.i] - 12} textAnchor="middle" fontFamily={fontDisplay} fontSize="14" fill={c.gold} fontStyle="italic">
            {p.label}
          </text>
        </g>
      ))}
      {[min, (min + max) / 2, max].map((v, i) => (
        <text key={i} x={pad.l - 8} y={yFor(v) + 3} textAnchor="end" fontFamily={fontMono} fontSize="9" fill={c.muted}>
          {fmt(v, 2, lang)}
        </text>
      ))}
      {months.map((m, i) => (
        <text key={i} x={pad.l + (i / 3) * (w - pad.l - pad.r)} y={h - pad.b + 18} fontFamily={lang === "ar" ? fontArabic : fontMono} fontSize="9" fill={c.muted} letterSpacing="0.1em">
          {m}
        </text>
      ))}
    </svg>
  );
};

const Sparkline = ({ data, color, w = 80, h = 24 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
};

const fakeSpark = (seed, up = true) => {
  const arr = [];
  let v = 50;
  for (let i = 0; i < 20; i++) {
    v += (((seed + i) * 1103) % 17) - 8 + (up ? 0.6 : -0.6);
    arr.push(v);
  }
  return arr;
};

const Gauge = ({ value, label, color }) => {
  const { c, lang } = useApp();
  const col = color || c.gold;
  const angle = (value / 100) * 180 - 90;
  const r = 60, cx = 80, cy = 80;
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad);
  const y2 = cy + r * Math.sin(rad);
  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 160 100" style={{ width: 160 }}>
        <path d={`M 20 80 A 60 60 0 0 1 140 80`} fill="none" stroke={c.border} strokeWidth="6" />
        <path d={`M 20 80 A 60 60 0 0 1 ${x2} ${y2}`} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" />
        <circle cx={x2} cy={y2} r="4" fill={c.ink} stroke={col} strokeWidth="1.5" />
        <text x="80" y="70" textAnchor="middle" fontFamily={fontDisplay} fontSize="28" fill={c.textHi}>{value}</text>
      </svg>
      <div style={{
        fontFamily: lang === "ar" ? fontArabic : fontMono,
        fontSize: 10, letterSpacing: "0.15em", color: c.muted,
        textTransform: "uppercase", marginTop: -8,
      }}>{label}</div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   USER-FACING PAGES
   ────────────────────────────────────────────────────────────────── */

const HomePage = ({ go, stocks, market }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const published = stocks.filter((s) => s.published);
  const featured = published.slice(0, 6);

  const renderQuote = () => {
    let txt = isAr ? market.quoteAr : market.quote;
    const highlights = isAr ? market.quoteHighlightAr : market.quoteHighlight;
    const parts = [];
    let last = 0;
    (highlights || []).forEach((word) => {
      const idx = txt.indexOf(word, last);
      if (idx === -1) return;
      parts.push(<span key={last}>{txt.slice(last, idx)}</span>);
      parts.push(<span key={idx} style={{ color: c.gold }}>{word}</span>);
      last = idx + word.length;
    });
    parts.push(<span key="end">{txt.slice(last)}</span>);
    return parts;
  };

  const tiles = [
    { k: "stock", icon: BarChart3 }, { k: "market", icon: Activity },
    { k: "portfolio", icon: Briefcase }, { k: "weekly", icon: PlayCircle },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Card style={{ padding: 40, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(800px 300px at ${isAr ? "20%" : "80%"} 0%, ${c.gold}08, transparent)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, position: "relative" }}>
          <div>
            <SectionLabel accent>{t.tadawul}</SectionLabel>
            <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 24, flexDirection: isAr ? "row-reverse" : "row", justifyContent: "flex-start" }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 72, fontWeight: 400, color: c.textHi, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                {fmt(DEFAULT_TASI.value, 2, lang)}
              </div>
              <div style={{ color: c.green, fontFamily: fontMono, fontSize: 14 }}>
                ▲ {fmt(DEFAULT_TASI.change, 2, lang)} <span style={{ opacity: 0.7 }}>({pct(DEFAULT_TASI.changePct, lang)})</span>
              </div>
            </div>
            <div style={{ marginTop: 24, maxWidth: 520 }}>
              <p style={{ fontFamily: fontDisplay, fontSize: 22, fontStyle: "italic", color: c.text, lineHeight: 1.5, fontWeight: 300 }}>
                "{renderQuote()}"
              </p>
              <div style={{ marginTop: 16, fontFamily: isAr ? fontArabic : fontMono, fontSize: 11, color: c.muted, letterSpacing: "0.1em" }}>
                — {t.synthBy} · {timeAgo(market.updatedAt, lang)}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
            <Gauge value={market.strength} label={t.trendStrength} color={c.gold} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Pill color={market.direction === "bullish" ? c.green : market.direction === "bearish" ? c.red : c.amber}>
                <Circle size={6} fill={market.direction === "bullish" ? c.green : market.direction === "bearish" ? c.red : c.amber} />
                {market.direction === "bullish" ? t.bullishBias : market.direction === "bearish" ? t.bearish : t.sideways}
              </Pill>
              <Pill color={c.blue}><Droplets size={10} /> {t.liquidityIn}</Pill>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <h3 style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 400, color: c.textHi, margin: 0, letterSpacing: "-0.01em" }}>
              {t.mostActive} <span style={{ fontStyle: "italic", color: c.gold }}>{t.today}</span>
            </h3>
          </div>
          {featured.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: c.muted, fontFamily: fontDisplay, fontStyle: "italic" }}>
              {t.noAnalyses}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {featured.map((s, i) => {
                const up = (s.change || 0) >= 0;
                return (
                  <div key={s.id} onClick={() => go("stock", s.id)} style={{
                    display: "grid", gridTemplateColumns: "60px 1fr 100px 90px 80px",
                    alignItems: "center", padding: "14px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
                    cursor: "pointer", gap: 16,
                  }}>
                    <div style={{ fontFamily: fontMono, fontSize: 12, color: c.muted, letterSpacing: "0.05em" }}>{s.sym}</div>
                    <div>
                      <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 14, color: c.textHi, fontWeight: 500 }}>
                        {isAr ? s.nameAr : s.name}
                      </div>
                    </div>
                    <Sparkline data={fakeSpark(i, up)} color={up ? c.green : c.red} />
                    <div style={{ textAlign: isAr ? "left" : "right", fontFamily: fontMono, fontSize: 13, color: c.textHi }}>
                      {fmt(s.price, 2, lang)}
                    </div>
                    <div style={{ textAlign: isAr ? "left" : "right", fontFamily: fontMono, fontSize: 12, color: up ? c.green : c.red }}>
                      {up ? "▲" : "▼"} {fmt(Math.abs(s.change || 0), 2, lang)}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 400, color: c.textHi, margin: 0 }}>
              {t.sectors} <span style={{ fontStyle: "italic", color: c.gold }}>{t.heatmap}</span>
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {t.sectors_data.map((name, i) => {
              const p = SECTORS_PCT[i];
              const up = p >= 0;
              const intensity = Math.min(1, Math.abs(p) / 1.5);
              return (
                <div key={name} style={{
                  padding: 14,
                  background: up
                    ? `${c.green}${Math.round((0.06 + intensity * 0.18) * 255).toString(16).padStart(2, "0")}`
                    : `${c.red}${Math.round((0.06 + intensity * 0.18) * 255).toString(16).padStart(2, "0")}`,
                  border: `1px solid ${up ? c.green : c.red}25`,
                  borderRadius: 2,
                }}>
                  <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 12, color: c.textHi, fontWeight: 500 }}>{name}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 16, color: up ? c.green : c.red, marginTop: 6 }}>
                    {pct(p, lang)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {tiles.map((tile, idx) => (
          <Card key={tile.k} style={{ padding: 24, cursor: "pointer" }} className="qarar-tile">
            <div onClick={() => go(tile.k)}>
              <tile.icon size={20} color={c.gold} strokeWidth={1.4} />
              <div style={{ fontFamily: fontDisplay, fontSize: 22, color: c.textHi, marginTop: 16, fontWeight: 400, letterSpacing: "-0.01em" }}>
                {t.tiles[idx].t}
              </div>
              <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 12, color: c.muted, marginTop: 6, lineHeight: 1.6 }}>
                {t.tiles[idx].d}
              </div>
              <ChevronRight size={14} color={c.goldDim} style={{ marginTop: 12, transform: isAr ? "scaleX(-1)" : "none" }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const StockPage = ({ stocks, selectedStockId, setSelectedStockId }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const published = stocks.filter((s) => s.published);
  const stock = published.find((s) => s.id === selectedStockId) || published[0];

  if (!stock) {
    return (
      <Card style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontFamily: fontDisplay, fontSize: 20, color: c.muted, fontStyle: "italic" }}>
          {t.noAnalyses}
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stock selector */}
      {published.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {published.map((s) => (
            <button key={s.id} onClick={() => setSelectedStockId(s.id)} style={{
              padding: "8px 14px",
              background: s.id === stock.id ? c.gold + "15" : "transparent",
              color: s.id === stock.id ? c.gold : c.muted,
              border: `1px solid ${s.id === stock.id ? c.gold + "60" : c.border}`,
              fontFamily: isAr ? fontArabic : fontMono, fontSize: 12,
              cursor: "pointer", borderRadius: 2,
            }}>
              {s.sym} {isAr ? s.nameAr : s.name}
            </button>
          ))}
        </div>
      )}

      <Card style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
          <div>
            <SectionLabel accent>{stock.sym} · {isAr ? (stock.sectorAr || "") : (stock.sector || "")}</SectionLabel>
            <div style={{ marginTop: 12 }}>
              <h1 style={{ fontFamily: fontDisplay, fontSize: 52, fontWeight: 400, color: c.textHi, margin: 0, letterSpacing: "-0.02em" }}>
                {isAr ? stock.nameAr : stock.name}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: fontMono, fontSize: 36, color: c.textHi }}>{fmt(stock.price, 2, lang)}</span>
              <span style={{ fontFamily: fontMono, fontSize: 14, color: (stock.change || 0) >= 0 ? c.green : c.red }}>
                {(stock.change || 0) >= 0 ? "▲" : "▼"} {fmt(Math.abs(stock.change || 0), 2, lang)}%
              </span>
              <span style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.1em" }}>
                {t.live}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isAr ? "flex-start" : "flex-end" }}>
            <Pill color={c.green}><TrendingUp size={10} /> {t.bullishWave3} · {isAr ? stock.waveAr : stock.wave}</Pill>
            <Pill color={c.blue}><Droplets size={10} /> {t.liquidityInflow}</Pill>
            <Pill color={c.gold}><Sparkles size={10} /> {t.highConviction}</Pill>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <SectionLabel>{t.waveDaily}</SectionLabel>
            <div style={{ fontFamily: fontDisplay, fontSize: 20, color: c.textHi, marginTop: 8, fontStyle: "italic" }}>
              {t.impulsive}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["1D", "1W", "1M", "3M", "1Y"].map((tf, i) => (
              <button key={tf} style={{
                padding: "6px 12px",
                background: i === 2 ? c.gold + "20" : "transparent",
                color: i === 2 ? c.gold : c.muted,
                border: `1px solid ${i === 2 ? c.gold + "60" : c.border}`,
                fontFamily: fontMono, fontSize: 11, letterSpacing: "0.1em",
                borderRadius: 2, cursor: "pointer",
              }}>{tf}</button>
            ))}
          </div>
        </div>
        <WaveChart support={stock.support} resistance={stock.resistance} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <SectionLabel accent><Waves size={11} /> {t.waveStructure}</SectionLabel>
          <div style={{ marginTop: 20, fontFamily: fontDisplay, fontSize: 28, color: c.textHi, lineHeight: 1.3 }}>
            {t.currentlyIn} <span style={{ fontStyle: "italic", color: c.gold }}>{isAr ? stock.waveAr : stock.wave}</span>
          </div>
          <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.text, marginTop: 12, lineHeight: 1.7 }}>
            {t.waveDesc}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: t.continuation, v: stock.continuation, col: c.green },
              { l: t.reversal, v: stock.reversal, col: c.red },
            ].map((b) => (
              <div key={b.l}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: isAr ? fontArabic : fontMono, fontSize: 11, color: c.muted, marginBottom: 4 }}>
                  <span>{b.l}</span>
                  <span style={{ color: b.col, fontFamily: fontMono }}>{b.v}%</span>
                </div>
                <div style={{ height: 4, background: c.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${b.v}%`, height: "100%", background: b.col }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <SectionLabel accent><Activity size={11} /> {t.momentumFlow}</SectionLabel>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <Gauge value={stock.momentum || 50} label={t.momentum} color={c.green} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {t.liquidity}
              </div>
              <div style={{ fontFamily: fontDisplay, fontSize: 18, color: c.blue, marginTop: 4 }}>{t.inflow}</div>
            </div>
            <div>
              <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {t.volume}
              </div>
              <div style={{ fontFamily: fontDisplay, fontSize: 18, color: c.textHi, marginTop: 4 }}>+18%</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <SectionLabel accent><Target size={11} /> {t.keyZones}</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { l: `${t.resistance} R1`, v: stock.resistance, col: c.red, dist: `+${fmt(((stock.resistance - stock.price) / stock.price) * 100, 1, lang)}%` },
              { l: t.current, v: stock.price, col: c.gold, dist: "—", active: true },
              { l: `${t.support} S1`, v: stock.support, col: c.green, dist: `${fmt(((stock.support - stock.price) / stock.price) * 100, 1, lang)}%` },
            ].map((z) => (
              <div key={z.l} style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                paddingLeft: !isAr && z.active ? 10 : 0,
                paddingRight: isAr && z.active ? 10 : 0,
                borderLeft: !isAr && z.active ? `2px solid ${c.gold}` : "none",
                borderRight: isAr && z.active ? `2px solid ${c.gold}` : "none",
              }}>
                <div>
                  <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{z.l}</div>
                  <div style={{ fontFamily: fontDisplay, fontSize: 20, color: z.col, marginTop: 2 }}>{fmt(z.v, 2, lang)}</div>
                </div>
                <div style={{ fontFamily: fontMono, fontSize: 11, color: c.muted }}>{z.dist}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 32, background: `linear-gradient(135deg, ${c.surface} 0%, ${c.surface2} 100%)` }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{
            flexShrink: 0, width: 48, height: 48, border: `1px solid ${c.gold}`,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Brain size={20} color={c.gold} strokeWidth={1.4} />
          </div>
          <div style={{ flex: 1 }}>
            <SectionLabel accent>{t.aiSynthesis}</SectionLabel>
            <p style={{
              fontFamily: fontDisplay, fontSize: 22, fontWeight: 300, color: c.textHi,
              lineHeight: 1.6, margin: "16px 0 0", letterSpacing: "-0.005em",
            }}>
              {isAr ? stock.analysisAr : stock.analysis}
            </p>
            <div style={{
              marginTop: 20, display: "flex", gap: 24, flexWrap: "wrap",
              fontFamily: isAr ? fontArabic : fontMono, fontSize: 11,
              color: c.muted, letterSpacing: "0.1em",
            }}>
              <span>{t.confidenceHigh}</span>
              <span>{t.horizon}</span>
              <span>{t.updated} · {timeAgo(stock.updatedAt, lang)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const MarketPage = ({ market }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card style={{ padding: 40 }}>
        <SectionLabel accent>{t.marketStructure}</SectionLabel>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 52, fontWeight: 400, color: c.textHi, margin: "16px 0 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {t.marketHeadline[0]} <span style={{ fontStyle: "italic", color: market.direction === "bullish" ? c.green : market.direction === "bearish" ? c.red : c.amber }}>
            {market.direction === "bullish" ? t.bullish : market.direction === "bearish" ? t.bearish : t.sideways}
          </span>
          <span style={{ color: c.muted }}>{t.marketHeadline[2]}</span> <span style={{ fontStyle: "italic", color: c.gold }}>{t.marketHeadline[3]}</span> {t.marketHeadline[4]}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginTop: 40 }}>
          <Stat label={t.tasiLevel} value={fmt(DEFAULT_TASI.value, 2, lang)} sub={t.todayPct} accent={c.textHi} />
          <Stat label={t.trendStrength} value={fmt(market.strength, 0, lang)} sub={t.moderateClimbing} accent={c.gold} />
          <Stat label={t.breadth} value={isAr ? "٦٢٪" : "62%"} sub={t.advancersDecliners} accent={c.green} />
          <Stat label={t.volatility} value={fmt(14.2, 1, lang)} sub={t.vtad} accent={c.blue} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel>{t.wavePosture}</SectionLabel>
          <div style={{ fontFamily: fontDisplay, fontSize: 24, color: c.textHi, margin: "12px 0 24px", fontWeight: 400, lineHeight: 1.4 }}>
            {t.finishingWave4[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.finishingWave4[1]}</span> {t.finishingWave4[2]}
          </div>
          <WaveChart height={260} />
        </Card>

        <Card style={{ padding: 28 }}>
          <SectionLabel><AlertCircle size={11} /> {t.reversalWatch}</SectionLabel>
          <div style={{ marginTop: 16, fontFamily: fontDisplay, fontSize: 18, color: c.text, lineHeight: 1.6 }}>
            {t.threeZones}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {t.reversalItems.map((r, i) => (
              <div key={i} style={{
                padding: 16, background: c.surface2,
                borderLeft: !isAr ? `2px solid ${c.gold}` : "none",
                borderRight: isAr ? `2px solid ${c.gold}` : "none",
              }}>
                <div style={{ fontFamily: fontMono, fontSize: 13, color: c.gold }}>{r.z}</div>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.textHi, marginTop: 4 }}>{r.w}</div>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 12, color: c.muted, marginTop: 2, fontStyle: "italic" }}>{r.p}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: c.textHi, margin: 0, fontWeight: 400 }}>
            {t.liquidityRotation.split(" ")[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.liquidityRotation.split(" ").slice(1).join(" ")}</span>
          </h3>
          <SectionLabel>{t.fiveDayFlow}</SectionLabel>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {t.sectors_data.map((name, i) => {
            const inflow = SECTORS_PCT[i] > 0;
            const v = SECTORS_VOL[i] * (inflow ? 1.2 : 0.8);
            return (
              <div key={name} style={{ padding: 20, background: c.surface2, borderRadius: 2 }}>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.textHi }}>{name}</div>
                <div style={{ fontFamily: fontMono, fontSize: 18, color: inflow ? c.green : c.red, marginTop: 8 }}>
                  {inflow ? "+" : "−"} {v.toFixed(0)}M
                </div>
                <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {inflow ? t.netInflow : t.netOutflow}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const PortfolioPage = () => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [trades] = useState([
    { id: 1, sym: "2222", nameIdx: 0, qty: 500, entry: 27.20, current: 28.84, tp: 30.10, sl: 26.20,
      noteEn: "Wave 3 entry on momentum confirmation.", noteAr: "دخول الموجة الثالثة بتأكيد الزخم." },
    { id: 2, sym: "1180", nameIdx: 1, qty: 200, entry: 88.40, current: 92.15, tp: 96.00, sl: 85.00,
      noteEn: "Banks sector rotation, breakout setup.", noteAr: "دوران قطاع البنوك، إعداد اختراق." },
    { id: 3, sym: "2010", nameIdx: 2, qty: 300, entry: 75.80, current: 73.20, tp: 80.00, sl: 72.00,
      noteEn: "Mean reversion, watching for support hold.", noteAr: "ارتداد للمتوسط، مراقبة ثبات الدعم." },
  ]);
  const stockNames = [
    { name: "Saudi Aramco", nameAr: "أرامكو السعودية" },
    { name: "Al Rajhi Bank", nameAr: "مصرف الراجحي" },
    { name: "SABIC", nameAr: "سابك" },
  ];
  const totals = useMemo(() => {
    let invested = 0, current = 0;
    trades.forEach((tr) => { invested += tr.entry * tr.qty; current += tr.current * tr.qty; });
    return { invested, current, pl: current - invested, plPct: ((current - invested) / invested) * 100 };
  }, [trades]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card style={{ padding: 40 }}>
        <SectionLabel accent>{t.portfolio}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginTop: 24 }}>
          <Stat label={t.invested} value={fmt(totals.invested, 0, lang)} sub={`SAR · ${t.positions}`} />
          <Stat label={t.currentValue} value={fmt(totals.current, 0, lang)} sub="SAR" accent={c.textHi} />
          <Stat label={t.openPL} value={`${totals.pl >= 0 ? "+" : ""}${fmt(totals.pl, 0, lang)}`} sub={t.realizedUnrealized} accent={totals.pl >= 0 ? c.green : c.red} />
          <Stat label={t.returnLbl} value={pct(totals.plPct, lang)} sub={t.sinceInception} accent={totals.plPct >= 0 ? c.green : c.red} />
        </div>
      </Card>

      <Card style={{ padding: 28 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: c.textHi, margin: "0 0 20px", fontWeight: 400 }}>
          {t.openPositions.split(" ")[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.openPositions.split(" ").slice(1).join(" ")}</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "60px 1.5fr 0.8fr 1fr 1fr 1fr 1fr 1.2fr",
            padding: "12px 0", borderBottom: `1px solid ${c.border}`,
            fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted,
            letterSpacing: "0.1em", textTransform: "uppercase", gap: 12,
          }}>
            {t.cols.map((col) => <div key={col}>{col}</div>)}
          </div>
          {trades.map((tr) => {
            const pl = (tr.current - tr.entry) * tr.qty;
            const plP = ((tr.current - tr.entry) / tr.entry) * 100;
            const up = pl >= 0;
            return (
              <div key={tr.id} style={{
                display: "grid", gridTemplateColumns: "60px 1.5fr 0.8fr 1fr 1fr 1fr 1fr 1.2fr",
                padding: "16px 0", borderBottom: `1px solid ${c.border}`, fontFamily: fontMono,
                fontSize: 13, alignItems: "center", gap: 12,
              }}>
                <div style={{ color: c.muted }}>{tr.sym}</div>
                <div style={{ color: c.textHi, fontFamily: isAr ? fontArabic : fontBody, fontSize: 14 }}>
                  {isAr ? stockNames[tr.nameIdx].nameAr : stockNames[tr.nameIdx].name}
                </div>
                <div style={{ color: c.text }}>{tr.qty}</div>
                <div style={{ color: c.text }}>{fmt(tr.entry, 2, lang)}</div>
                <div style={{ color: c.textHi }}>{fmt(tr.current, 2, lang)}</div>
                <div style={{ fontSize: 11, color: c.muted }}>
                  <span style={{ color: c.green }}>{fmt(tr.tp, 2, lang)}</span> / <span style={{ color: c.red }}>{fmt(tr.sl, 2, lang)}</span>
                </div>
                <div style={{ textAlign: isAr ? "left" : "right", color: up ? c.green : c.red }}>
                  {up ? "+" : ""}{fmt(pl, 0, lang)}<br />
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{pct(plP, lang)}</span>
                </div>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 11, color: c.muted, fontStyle: "italic", lineHeight: 1.5 }}>
                  {isAr ? tr.noteAr : tr.noteEn}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.disciplineScore}</SectionLabel>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Gauge value={82} label={t.adherence} color={c.green} />
          </div>
          <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.text, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
            {t.disciplineMsg[0]} <span style={{ color: c.gold }}>{t.disciplineMsg[1]}</span> {t.disciplineMsg[2]}
          </div>
        </Card>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.postTradeLessons}</SectionLabel>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {t.lessons.map((l, i) => (
              <div key={i} style={{
                paddingLeft: !isAr ? 14 : 0, paddingRight: isAr ? 14 : 0,
                borderLeft: !isAr ? `2px solid ${c.gold}40` : "none",
                borderRight: isAr ? `2px solid ${c.gold}40` : "none",
              }}>
                <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.1em" }}>{l.d}</div>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.text, marginTop: 4, fontStyle: "italic", lineHeight: 1.6 }}>{l.t}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const JournalPage = () => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card style={{ padding: 40 }}>
        <SectionLabel accent>{t.journalTitle}</SectionLabel>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 48, fontWeight: 400, color: c.textHi, margin: "16px 0 0", letterSpacing: "-0.02em" }}>
          {t.everyTradeLesson[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.everyTradeLesson[1]}</span>{t.everyTradeLesson[2]}
        </h1>
        <p style={{ fontFamily: fontDisplay, fontSize: 18, color: c.muted, marginTop: 12, fontStyle: "italic", fontWeight: 300 }}>
          {t.journalSub}
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { l: t.thisMonth, v: isAr ? "١٤" : "14", sub: t.tradesLogged },
          { l: t.winRate, v: isAr ? "٦٤٪" : "64%", sub: t.winLoss, c: c.green },
          { l: t.avgRR, v: isAr ? "١.٨" : "1.8", sub: t.rewardRisk, c: c.gold },
        ].map((m) => (
          <Card key={m.l} style={{ padding: 24 }}>
            <Stat label={m.l} value={m.v} sub={m.sub} accent={m.c} />
          </Card>
        ))}
      </div>

      <Card style={{ padding: 28 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: c.textHi, margin: "0 0 24px", fontWeight: 400 }}>
          {t.recentEntries.split(" ")[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.recentEntries.split(" ").slice(1).join(" ")}</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {t.entries.map((e, i) => (
            <div key={i} style={{ padding: "24px 0", borderTop: i === 0 ? "none" : `1px solid ${c.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: fontDisplay, fontSize: 20, color: c.textHi, fontStyle: "italic" }}>{e.sym}</span>
                  <span style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 11, color: c.muted, letterSpacing: "0.1em" }}>{e.date}</span>
                </div>
                <Pill color={e.outcome === t.win ? c.green : c.red}>{e.outcome}</Pill>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                  { l: t.reasoning, v: e.reasoning, icon: Brain },
                  { l: t.emotion, v: e.emotion, icon: Eye },
                  { l: t.lesson, v: e.lesson, icon: Sparkles },
                ].map((b) => (
                  <div key={b.l}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                      <b.icon size={11} /> {b.l}
                    </div>
                    <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.text, lineHeight: 1.7, fontStyle: b.l === t.lesson ? "italic" : "normal" }}>{b.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  return m ? m[1] : null;
};

const WeeklyPage = ({ weekly }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const videoId = getYouTubeId(weekly.url);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card style={{ padding: 40 }}>
        <SectionLabel accent><Calendar size={11} /> {t.weeklyReview} · {isAr ? "الأسبوع" : "Week"} {weekly.week} · 2026</SectionLabel>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 52, fontWeight: 400, color: c.textHi, margin: "16px 0 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {isAr ? weekly.titleAr : weekly.title}
        </h1>
        <p style={{ fontFamily: fontDisplay, fontSize: 20, color: c.text, marginTop: 16, fontWeight: 300, fontStyle: "italic", maxWidth: 700, lineHeight: 1.5 }}>
          {isAr ? weekly.descriptionAr : weekly.description}
        </p>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {videoId ? (
          <div style={{ aspectRatio: "16/9", width: "100%" }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0, display: "block" }}
            />
          </div>
        ) : (
          <div style={{
            aspectRatio: "16/9", background: `linear-gradient(135deg, ${c.surface2} 0%, ${c.ink} 100%)`,
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <svg viewBox="0 0 800 450" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              <path d={`M 0 250 Q 100 180 200 220 T 400 200 T 600 240 T 800 220`} fill="none" stroke={c.gold} strokeWidth="1" />
              <path d={`M 0 280 Q 100 220 200 260 T 400 240 T 600 280 T 800 260`} fill="none" stroke={c.gold} strokeWidth="0.8" opacity="0.6" />
            </svg>
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%", border: `1.5px solid ${c.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                background: `${c.gold}10`,
              }}>
                <PlayCircle size={36} color={c.gold} strokeWidth={1} />
              </div>
              <div style={{ fontFamily: fontDisplay, fontSize: 28, color: c.textHi, fontStyle: "italic" }}>
                {isAr ? "لم يُرفع الفيديو بعد" : "Video not yet uploaded"}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.chapters}</SectionLabel>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {t.chaptersList.map((ch, i) => (
              <div key={i} style={{ paddingBottom: 14, borderBottom: i === t.chaptersList.length - 1 ? "none" : `1px solid ${c.border}` }}>
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 14, color: c.text }}>{ch}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.threeScenarios}</SectionLabel>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {weekly.scenarios.map((s, i) => {
              const cols = [c.green, c.gold, c.red];
              return (
                <div key={i} style={{
                  padding: 16, background: c.surface2,
                  borderLeft: !isAr ? `2px solid ${cols[i]}` : "none",
                  borderRight: isAr ? `2px solid ${cols[i]}` : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontFamily: fontDisplay, fontSize: 18, color: c.textHi, fontStyle: "italic" }}>
                      {isAr ? s.labelAr : s.label}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: 14, color: cols[i] }}>{s.prob}%</div>
                  </div>
                  <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.muted, marginTop: 6, lineHeight: 1.6 }}>
                    {isAr ? s.descAr : s.desc}
                  </div>
                  <div style={{ marginTop: 10, height: 3, background: c.border, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${s.prob}%`, height: "100%", background: cols[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card style={{ padding: 28 }}>
        <SectionLabel>{t.archive}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
          {t.archiveItems.map((a, i) => (
            <div key={i} style={{ padding: 16, background: c.surface2, cursor: "pointer", borderRadius: 2 }}>
              <PlayCircle size={20} color={c.goldDim} strokeWidth={1.2} />
              <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.15em", marginTop: 12 }}>{a.w}</div>
              <div style={{ fontFamily: fontDisplay, fontSize: 16, color: c.textHi, marginTop: 4, fontStyle: "italic" }}>{a.t}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   ADMIN PANEL
   ────────────────────────────────────────────────────────────────── */

const AdminLogin = ({ onLogin }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (pwd === ADMIN_PASSWORD) {
      ls.set("qarar:auth", { time: Date.now() });
      onLogin();
    } else {
      setError(isAr ? "كلمة المرور غير صحيحة" : "Incorrect password");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: c.ink,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
    }}>
      <Card style={{ padding: 40, maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={48} />
          </div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 28, color: c.textHi, margin: 0, fontWeight: 400 }}>
            {t.adminLogin}
          </h2>
        </div>
        <Input label={t.adminPasswordLabel} value={pwd} onChange={setPwd} type="password" />
        {error && (
          <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 12, color: c.red, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <Button onClick={submit} icon={Shield} style={{ flex: 1, justifyContent: "center" }}>
            {t.signIn}
          </Button>
        </div>
        <div style={{
          marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}`,
          fontFamily: fontMono, fontSize: 10, color: c.muted, textAlign: "center", letterSpacing: "0.1em",
        }}>
          Default password: qarar2026
        </div>
      </Card>
    </div>
  );
};

const AdminDashboard = ({ stocks, weekly, goto }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const published = stocks.filter((s) => s.published).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SectionLabel accent>{t.todayDate} · {new Date().toLocaleDateString(isAr ? "ar-SA" : "en-US")}</SectionLabel>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 44, color: c.textHi, margin: "12px 0 0", fontWeight: 400, letterSpacing: "-0.02em" }}>
          {t.welcomeAdmin}
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <Stat label={t.publishedAnalyses} value={published} accent={c.gold} />
        </Card>
        <Card style={{ padding: 20 }}>
          <Stat label={isAr ? "إجمالي التحليلات" : "Total Analyses"} value={stocks.length} accent={c.blue} />
        </Card>
        <Card style={{ padding: 20 }}>
          <Stat label={isAr ? "أسبوع الفيديو" : "Video Week"} value={weekly.week} accent={c.green} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.pendingTasks}</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {t.tasks.map((task, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                paddingBottom: 14,
                borderBottom: i === t.tasks.length - 1 ? "none" : `1px solid ${c.border}`,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${c.gold}`, flexShrink: 0 }} />
                <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 14, color: c.text }}>{task}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{isAr ? "إجراءات سريعة" : "Quick Actions"}</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <Button icon={Plus} variant="secondary" onClick={() => goto("stocks")}>
              {t.addNew} {t.adminNav.stocks}
            </Button>
            <Button icon={Activity} variant="secondary" onClick={() => goto("market")}>
              {t.adminNav.market}
            </Button>
            <Button icon={Youtube} variant="secondary" onClick={() => goto("weekly")}>
              {t.adminNav.weekly}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminStocks = ({ stocks, setStocks }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const blank = {
    id: "s" + Date.now(), sym: "", name: "", nameAr: "",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    sector: "", sectorAr: "",
    published: false,
  };

  const startNew = () => { setEditing({ ...blank, id: "s" + Date.now() }); setShowForm(true); };
  const startEdit = (s) => { setEditing({ ...s }); setShowForm(true); };

  const save = () => {
    const updated = { ...editing, updatedAt: Date.now() };
    const exists = stocks.find((s) => s.id === updated.id);
    const newList = exists
      ? stocks.map((s) => (s.id === updated.id ? updated : s))
      : [...stocks, updated];
    setStocks(newList);
    ls.set("qarar:stocks", newList);
    setShowForm(false); setEditing(null);
  };

  const remove = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    const newList = stocks.filter((s) => s.id !== id);
    setStocks(newList);
    ls.set("qarar:stocks", newList);
  };

  const togglePublish = (id) => {
    const newList = stocks.map((s) =>
      s.id === id ? { ...s, published: !s.published, updatedAt: Date.now() } : s
    );
    setStocks(newList);
    ls.set("qarar:stocks", newList);
  };

  if (showForm && editing) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 32, color: c.textHi, margin: 0, fontWeight: 400 }}>
            {stocks.find((s) => s.id === editing.id) ? t.edit : t.addNew}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={() => setShowForm(false)} icon={X}>{t.cancel}</Button>
            <Button onClick={save} icon={Save}>{t.save}</Button>
          </div>
        </div>

        <Card style={{ padding: 28 }}>
          <div style={{ background: c.gold + "10", border: `1px solid ${c.gold}30`, padding: 14, borderRadius: 2, marginBottom: 24 }}>
            <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 13, color: c.gold, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              {t.formNotice}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Input label={t.formStock + " (EN)"} value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Saudi Aramco" />
            <Input label={t.formStock + " (AR)"} value={editing.nameAr} onChange={(v) => setEditing({ ...editing, nameAr: v })} placeholder="أرامكو السعودية" />
            <Input label={t.formSymbol} value={editing.sym} onChange={(v) => setEditing({ ...editing, sym: v })} placeholder="2222" />
            <Input label={isAr ? "القطاع (EN)" : "Sector (EN)"} value={editing.sector} onChange={(v) => setEditing({ ...editing, sector: v })} placeholder="Energy" />
            <Input label={t.formWave + " (EN)"} value={editing.wave} onChange={(v) => setEditing({ ...editing, wave: v })} placeholder="Wave 3" />
            <Input label={t.formWave + " (AR)"} value={editing.waveAr} onChange={(v) => setEditing({ ...editing, waveAr: v })} placeholder="الموجة الثالثة" />
            <Input label={t.formPrice} value={editing.price} onChange={(v) => setEditing({ ...editing, price: parseFloat(v) || 0 })} type="number" />
            <Input label={t.formChange} value={editing.change} onChange={(v) => setEditing({ ...editing, change: parseFloat(v) || 0 })} type="number" />
            <Input label={t.formContinuation} value={editing.continuation} onChange={(v) => setEditing({ ...editing, continuation: parseInt(v) || 0 })} type="number" />
            <Input label={t.formReversal} value={editing.reversal} onChange={(v) => setEditing({ ...editing, reversal: parseInt(v) || 0 })} type="number" />
            <Input label={t.formSupport} value={editing.support} onChange={(v) => setEditing({ ...editing, support: parseFloat(v) || 0 })} type="number" />
            <Input label={t.formResistance} value={editing.resistance} onChange={(v) => setEditing({ ...editing, resistance: parseFloat(v) || 0 })} type="number" />
            <Input label={isAr ? "الزخم (0-100)" : "Momentum (0-100)"} value={editing.momentum} onChange={(v) => setEditing({ ...editing, momentum: parseInt(v) || 0 })} type="number" />
          </div>

          <Input label={t.formAnalysis + " (EN)"} value={editing.analysis} onChange={(v) => setEditing({ ...editing, analysis: v })} textarea rows={4} placeholder="Structural reading..." />
          <Input label={t.formAnalysis + " (AR)"} value={editing.analysisAr} onChange={(v) => setEditing({ ...editing, analysisAr: v })} textarea rows={4} placeholder="القراءة الهيكلية..." />

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Button onClick={save} icon={Save}>{t.save}</Button>
            {editing.published ? (
              <Button variant="ghost" onClick={() => setEditing({ ...editing, published: false })} icon={EyeOff}>{t.unpublish}</Button>
            ) : (
              <Button variant="secondary" onClick={() => setEditing({ ...editing, published: true })} icon={Eye}>{t.publish}</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, color: c.textHi, margin: 0, fontWeight: 400 }}>
          {t.adminNav.stocks}
        </h2>
        <Button onClick={startNew} icon={Plus}>{t.addNew}</Button>
      </div>

      <Card style={{ padding: 0 }}>
        {stocks.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: c.muted, fontFamily: fontDisplay, fontStyle: "italic", fontSize: 18 }}>
            {t.noAnalyses}
          </div>
        )}
        {stocks.map((s, i) => (
          <div key={s.id} style={{
            padding: "20px 24px",
            borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
            display: "grid",
            gridTemplateColumns: "60px 1fr 80px 100px 140px auto",
            alignItems: "center", gap: 16,
          }}>
            <div style={{ fontFamily: fontMono, fontSize: 12, color: c.muted }}>{s.sym}</div>
            <div>
              <div style={{ fontFamily: isAr ? fontArabic : fontBody, fontSize: 15, color: c.textHi, fontWeight: 500 }}>
                {isAr ? s.nameAr : s.name}
              </div>
              <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 11, color: c.muted, marginTop: 2 }}>
                {isAr ? s.waveAr : s.wave}
              </div>
            </div>
            <div style={{ fontFamily: fontMono, fontSize: 13, color: c.textHi }}>{(s.price || 0).toFixed(2)}</div>
            <Pill color={s.published ? c.green : c.amber}>{s.published ? t.published : t.draft}</Pill>
            <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted }}>
              {timeAgo(s.updatedAt, lang)}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Button variant="ghost" size="sm" onClick={() => togglePublish(s.id)}>
                {s.published ? <EyeOff size={12} /> : <Eye size={12} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => startEdit(s)} icon={Edit3}>{t.edit}</Button>
              <Button variant="danger" size="sm" onClick={() => remove(s.id)} icon={Trash2}>{t.delete}</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const AdminMarket = ({ market, setMarket }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [local, setLocal] = useState(market);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const updated = { ...local, updatedAt: Date.now() };
    setMarket(updated);
    ls.set("qarar:market", updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, color: c.textHi, margin: 0, fontWeight: 400 }}>
          {t.adminNav.market}
        </h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <Pill color={c.green}><Sparkles size={10} /> {t.saved}</Pill>}
          <Button onClick={save} icon={Save}>{t.save}</Button>
        </div>
      </div>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 8 }}>
          <div>
            <div style={{
              fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted,
              letterSpacing: isAr ? "0" : "0.12em",
              textTransform: isAr ? "none" : "uppercase", marginBottom: 8,
            }}>{t.marketDirection}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "bullish", l: t.bullish, c: c.green },
                { v: "sideways", l: t.sideways, c: c.amber },
                { v: "bearish", l: t.bearish, c: c.red },
              ].map((d) => (
                <button key={d.v} onClick={() => setLocal({ ...local, direction: d.v })} style={{
                  flex: 1, padding: "12px",
                  background: local.direction === d.v ? d.c + "20" : "transparent",
                  color: local.direction === d.v ? d.c : c.muted,
                  border: `1px solid ${local.direction === d.v ? d.c : c.border}`,
                  fontFamily: isAr ? fontArabic : fontMono, fontSize: 13,
                  letterSpacing: isAr ? "0" : "0.1em",
                  textTransform: isAr ? "none" : "uppercase",
                  cursor: "pointer", borderRadius: 2,
                }}>{d.l}</button>
              ))}
            </div>
          </div>
          <Input label={t.trendStrength + " (0-100)"} value={local.strength} onChange={(v) => setLocal({ ...local, strength: parseInt(v) || 0 })} type="number" />
        </div>

        <Input label={t.marketQuote + " (EN)"} value={local.quote} onChange={(v) => setLocal({ ...local, quote: v })} textarea rows={3} />
        <Input label={t.marketQuote + " (AR)"} value={local.quoteAr} onChange={(v) => setLocal({ ...local, quoteAr: v })} textarea rows={3} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Input
            label={isAr ? "كلمات بارزة (EN, مفصولة بفاصلة)" : "Highlights EN (comma-separated)"}
            value={(local.quoteHighlight || []).join(", ")}
            onChange={(v) => setLocal({ ...local, quoteHighlight: v.split(",").map(x => x.trim()).filter(Boolean) })}
            placeholder="Energy, Banks"
          />
          <Input
            label={isAr ? "كلمات بارزة (AR، مفصولة بفاصلة)" : "Highlights AR (comma-separated)"}
            value={(local.quoteHighlightAr || []).join(", ")}
            onChange={(v) => setLocal({ ...local, quoteHighlightAr: v.split(",").map(x => x.trim()).filter(Boolean) })}
            placeholder="الطاقة, البنوك"
          />
        </div>
      </Card>
    </div>
  );
};

const AdminWeekly = ({ weekly, setWeekly }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [local, setLocal] = useState(weekly);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const updated = { ...local, updatedAt: Date.now() };
    setWeekly(updated);
    ls.set("qarar:weekly", updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateScenario = (i, field, value) => {
    const newScenarios = [...local.scenarios];
    newScenarios[i] = { ...newScenarios[i], [field]: value };
    setLocal({ ...local, scenarios: newScenarios });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 32, color: c.textHi, margin: 0, fontWeight: 400 }}>
          {t.adminNav.weekly}
        </h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <Pill color={c.green}><Sparkles size={10} /> {t.saved}</Pill>}
          <Button onClick={save} icon={Save}>{t.save}</Button>
        </div>
      </div>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 20 }}>
          <Input label={t.weekNumber} value={local.week} onChange={(v) => setLocal({ ...local, week: parseInt(v) || 0 })} type="number" />
          <Input label={t.videoTitle + " (EN)"} value={local.title} onChange={(v) => setLocal({ ...local, title: v })} />
          <Input label={t.videoTitle + " (AR)"} value={local.titleAr} onChange={(v) => setLocal({ ...local, titleAr: v })} />
        </div>

        <Input label={t.videoUrl} value={local.url} onChange={(v) => setLocal({ ...local, url: v })} placeholder={t.videoUrlPlaceholder} />

        <Input label={t.videoDescription + " (EN)"} value={local.description} onChange={(v) => setLocal({ ...local, description: v })} textarea rows={3} />
        <Input label={t.videoDescription + " (AR)"} value={local.descriptionAr} onChange={(v) => setLocal({ ...local, descriptionAr: v })} textarea rows={3} />

        <div style={{ marginTop: 12 }}>
          <SectionLabel accent>{t.scenarios}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            {local.scenarios.map((sc, i) => (
              <Card key={i} style={{ padding: 16, background: c.surface2 }}>
                <div style={{ fontFamily: fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.15em", marginBottom: 12 }}>
                  {t.scenarioLabel} {i + 1}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 100px", gap: 12 }}>
                  <Input label={t.scenarioLabel + " (EN)"} value={sc.label} onChange={(v) => updateScenario(i, "label", v)} />
                  <Input label={t.scenarioLabel + " (AR)"} value={sc.labelAr} onChange={(v) => updateScenario(i, "labelAr", v)} />
                  <Input label="%" value={sc.prob} onChange={(v) => updateScenario(i, "prob", parseInt(v) || 0)} type="number" />
                </div>
                <Input label={t.description + " (EN)"} value={sc.desc} onChange={(v) => updateScenario(i, "desc", v)} />
                <Input label={t.description + " (AR)"} value={sc.descAr} onChange={(v) => updateScenario(i, "descAr", v)} />
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   MAIN APP
   ────────────────────────────────────────────────────────────────── */

export default function Qarar() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState(() => ls.get("qarar:theme", "dark"));
  const [lang, setLang] = useState(() => ls.get("qarar:lang", "en"));
  const [selectedStockId, setSelectedStockId] = useState(null);

  // Admin state
  const [mode, setMode] = useState("user"); // "user" or "admin"
  const [adminAuth, setAdminAuth] = useState(() => {
    const a = ls.get("qarar:auth", null);
    return a && (Date.now() - a.time) < 1000 * 60 * 60 * 24 * 7; // 7 days
  });
  const [adminPage, setAdminPage] = useState("dashboard");

  // Data state (with persistence)
  const [stocks, setStocks] = useState(() => ls.get("qarar:stocks", DEFAULT_STOCKS));
  const [market, setMarket] = useState(() => ls.get("qarar:market", DEFAULT_MARKET));
  const [weekly, setWeekly] = useState(() => ls.get("qarar:weekly", DEFAULT_WEEKLY));

  const c = THEMES[theme];
  const t = STRINGS[lang];
  const isAr = lang === "ar";

  // Persist theme + lang
  useEffect(() => { ls.set("qarar:theme", theme); }, [theme]);
  useEffect(() => { ls.set("qarar:lang", lang); }, [lang]);

  // Check URL for admin route
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === "#admin") {
        setMode("admin");
      } else {
        setMode("user");
      }
    };
    checkRoute();
    window.addEventListener("hashchange", checkRoute);
    return () => window.removeEventListener("hashchange", checkRoute);
  }, []);

  const ctx = { c, t, lang, theme };

  const goto = (p, stockId) => {
    setPage(p);
    if (stockId) setSelectedStockId(stockId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToAdmin = () => { window.location.hash = "admin"; };
  const goToSite = () => { window.location.hash = ""; };

  const logout = () => {
    ls.set("qarar:auth", null);
    setAdminAuth(false);
    goToSite();
  };

  // Admin mode
  if (mode === "admin") {
    if (!adminAuth) {
      return (
        <AppContext.Provider value={ctx}>
          <GlobalStyles c={c} isAr={isAr} />
          <AdminLogin onLogin={() => setAdminAuth(true)} />
        </AppContext.Provider>
      );
    }

    const renderAdminPage = () => {
      switch (adminPage) {
        case "dashboard": return <AdminDashboard stocks={stocks} weekly={weekly} goto={setAdminPage} />;
        case "stocks": return <AdminStocks stocks={stocks} setStocks={setStocks} />;
        case "market": return <AdminMarket market={market} setMarket={setMarket} />;
        case "weekly": return <AdminWeekly weekly={weekly} setWeekly={setWeekly} />;
        default: return <AdminDashboard stocks={stocks} weekly={weekly} goto={setAdminPage} />;
      }
    };

    const adminNavItems = [
      { key: "dashboard", icon: Home },
      { key: "stocks", icon: BarChart3 },
      { key: "market", icon: Activity },
      { key: "weekly", icon: PlayCircle },
    ];

    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} isAr={isAr} />
        <div dir={t.dir} style={{
          minHeight: "100vh", background: c.ink, color: c.text,
          fontFamily: isAr ? fontArabic : fontBody,
        }}>
          <header style={{
            borderBottom: `1px solid ${c.border}`, background: c.ink,
            position: "sticky", top: 0, zIndex: 10,
          }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Logo size={32} />
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontFamily: fontNastaliq, fontSize: 24, color: c.gold, lineHeight: 1 }}>قرار</div>
                    <Pill color={c.amber}>{isAr ? "مدير" : "Admin"}</Pill>
                  </div>
                </div>
              </div>

              <nav style={{ display: "flex", gap: 4 }}>
                {adminNavItems.map((item) => {
                  const active = adminPage === item.key;
                  return (
                    <button key={item.key} onClick={() => setAdminPage(item.key)} style={{
                      padding: "8px 14px",
                      background: active ? c.gold + "15" : "transparent",
                      color: active ? c.gold : c.muted, border: "none",
                      fontFamily: isAr ? fontArabic : fontMono,
                      fontSize: isAr ? 13 : 11,
                      letterSpacing: isAr ? "0" : "0.12em",
                      textTransform: isAr ? "none" : "uppercase",
                      cursor: "pointer",
                      borderBottom: `1px solid ${active ? c.gold : "transparent"}`,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <item.icon size={13} />
                      {t.adminNav[item.key]}
                    </button>
                  );
                })}
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 10px", background: "transparent",
                  border: `1px solid ${c.border}`, color: c.text,
                  cursor: "pointer", borderRadius: 2,
                  fontFamily: fontMono, fontSize: 11,
                }}>
                  <Languages size={12} color={c.gold} />
                  <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
                  <span style={{ color: c.border }}>·</span>
                  <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontArabic, fontSize: 13 }}>ع</span>
                </button>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
                  width: 34, height: 34, background: "transparent",
                  border: `1px solid ${c.border}`, color: c.gold,
                  cursor: "pointer", borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                </button>
                <Button variant="ghost" size="sm" onClick={goToSite} icon={Eye}>{t.backToSite}</Button>
                <Button variant="ghost" size="sm" onClick={logout} icon={LogOut}>{t.logout}</Button>
              </div>
            </div>
          </header>

          <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px" }}>
            {renderAdminPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // User-facing mode
  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage go={goto} stocks={stocks} market={market} />;
      case "stock": return <StockPage stocks={stocks} selectedStockId={selectedStockId} setSelectedStockId={setSelectedStockId} />;
      case "market": return <MarketPage market={market} />;
      case "portfolio": return <PortfolioPage />;
      case "journal": return <JournalPage />;
      case "weekly": return <WeeklyPage weekly={weekly} />;
      default: return <HomePage go={goto} stocks={stocks} market={market} />;
    }
  };

  const NAV = [
    { key: "home", icon: Home },
    { key: "stock", icon: BarChart3 },
    { key: "market", icon: Activity },
    { key: "portfolio", icon: Briefcase },
    { key: "journal", icon: BookOpen },
    { key: "weekly", icon: PlayCircle },
  ];

  return (
    <AppContext.Provider value={ctx}>
      <GlobalStyles c={c} isAr={isAr} />
      <div dir={t.dir} style={{
        minHeight: "100vh", background: c.ink, color: c.text,
        fontFamily: isAr ? fontArabic : fontBody,
        fontFeatureSettings: '"ss01", "cv11"',
        transition: "background 0.4s ease, color 0.4s ease",
      }}>
        <header style={{
          borderBottom: `1px solid ${c.border}`, background: c.ink,
          position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)",
          transition: "background 0.4s ease",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => goto("home")}>
              <Logo size={34} />
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontFamily: fontNastaliq, fontSize: 28, color: c.gold, lineHeight: 1 }}>قرار</div>
                  <div style={{ fontFamily: fontDisplay, fontSize: 20, color: c.textHi, fontStyle: "italic", lineHeight: 1 }}>Qarar</div>
                </div>
                <div style={{
                  fontFamily: isAr ? fontArabic : fontMono,
                  fontSize: 9, color: c.muted, letterSpacing: "0.18em", marginTop: 3,
                  textTransform: isAr ? "none" : "uppercase",
                }}>
                  {t.brand}
                </div>
              </div>
            </div>

            <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {NAV.map((item) => {
                const active = page === item.key;
                return (
                  <button key={item.key} onClick={() => goto(item.key)} style={{
                    padding: "8px 14px",
                    background: active ? c.gold + "15" : "transparent",
                    color: active ? c.gold : c.muted, border: "none",
                    fontFamily: isAr ? fontArabic : fontMono,
                    fontSize: isAr ? 13 : 11,
                    letterSpacing: isAr ? "0" : "0.12em",
                    textTransform: isAr ? "none" : "uppercase",
                    cursor: "pointer",
                    borderBottom: `1px solid ${active ? c.gold : "transparent"}`,
                    borderRadius: 0,
                  }}>
                    {t.nav[item.key]}
                  </button>
                );
              })}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 12px", background: "transparent",
                border: `1px solid ${c.border}`, color: c.text,
                cursor: "pointer", borderRadius: 2,
                fontFamily: fontMono, fontSize: 11, letterSpacing: "0.1em",
              }}>
                <Languages size={13} color={c.gold} />
                <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
                <span style={{ color: c.border }}>·</span>
                <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontArabic, fontSize: 13 }}>ع</span>
              </button>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, background: "transparent",
                border: `1px solid ${c.border}`, color: c.gold,
                cursor: "pointer", borderRadius: 2,
              }}>
                {theme === "dark" ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
              </button>
              <button onClick={goToAdmin} title={t.goToAdmin} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, background: "transparent",
                border: `1px solid ${c.border}`, color: c.muted,
                cursor: "pointer", borderRadius: 2,
              }}>
                <Settings size={14} />
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px" }}>
          {renderPage()}
        </main>

        <footer style={{ borderTop: `1px solid ${c.border}`, marginTop: 80 }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontFamily: fontDisplay, fontSize: 18, color: c.muted, fontStyle: "italic", maxWidth: 600, lineHeight: 1.5 }}>
              {t.disclaimer}
            </div>
            <div style={{ fontFamily: isAr ? fontArabic : fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.15em" }}>
              {t.copyright}
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

const GlobalStyles = ({ c, isAr }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,300;1,400&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Tajawal:wght@300;400;500;700&family=Noto+Nastaliq+Urdu:wght@500;600&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; background: ${c.ink}; }
    ::selection { background: ${c.gold}40; color: ${c.textHi}; }
    .qarar-tile { transition: border-color 0.2s ease, transform 0.2s ease; }
    .qarar-tile:hover { border-color: ${c.gold} !important; transform: translateY(-2px); }
    button { transition: all 0.15s ease; }
    button:hover { opacity: 0.85; }
    input:focus, textarea:focus { outline: none; border-color: ${c.gold} !important; }
    textarea { font-family: ${isAr ? fontArabic : fontBody}; }
  `}</style>
);
