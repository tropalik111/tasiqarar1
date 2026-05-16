import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import {
  TrendingUp, Activity, Waves, Target, Brain, BookOpen, Briefcase,
  PlayCircle, Home, BarChart3, ChevronRight, Circle, Sparkles,
  AlertCircle, Eye, Droplets, Plus, Calendar, Sun, Moon, Languages,
  Settings, LogOut, Edit3, Trash2, Save, X, Youtube, User, Shield,
  EyeOff, Image as ImageIcon, Upload, Users, ChevronLeft,
} from "lucide-react";

// Supabase database helpers
import {
  db_listUsers, db_countUsers, db_findUserByEmail, db_findUserByUsername, db_createUser,
  db_listWaitlist, db_addToWaitlist, db_removeFromWaitlist,
  db_listStocks, db_saveStock, db_deleteStock,
  db_getMarket, db_saveMarket,
  db_getWeekly, db_saveWeekly,
  db_getSettings, db_setSiteForceOpen, db_setLaunchDate,
  db_listTrades, db_saveTrade, db_deleteTrade,
  db_listJournalEntries, db_saveJournalEntry, db_deleteJournalEntry,
} from "./db.js";

/* ──────────────────────────────────────────────────────────────────
   QARAR — Saudi Market Direction Platform v3 (Supabase)
   - Unified serif/nastaliq typography
   - Higher contrast palette
   - User authentication (signup/signin)
   - Admin chart image uploads (3 timeframes)
   ────────────────────────────────────────────────────────────────── */

const ADMIN_PASSWORD = "qarar2026"; // ⚠️ CHANGE THIS before production!

/* ── Launch / Seat Configuration ───────────────────────────────── */
// To change: update these two values, redeploy.
const MAX_SEATS = 100;                          // Max seats before lockout
const LAUNCH_DAYS_FROM_INSTALL = 10;            // Days until full launch
// Launch date is computed once on first load and stored in localStorage
// so it stays consistent for all users. Admin can override via toggle.

/* ── Themes with IMPROVED CONTRAST ─────────────────────────────── */

const THEMES = {
  dark: {
    ink: "#070A0F",        // deeper black
    surface: "#0F141B",
    surface2: "#161D27",
    border: "#222B38",
    borderHi: "#33404F",
    muted: "#7A8696",      // brighter for readability
    text: "#E8EDF5",       // much brighter text
    textHi: "#FFFFFF",     // pure white for headlines
    gold: "#D4B575",       // brighter gold
    goldDim: "#9C8456",
    green: "#8FCB9F",
    red: "#D88A8A",
    blue: "#8FAFD4",
    amber: "#DCB36C",
  },
  light: {
    ink: "#FAF7F0",        // warm parchment
    surface: "#FFFFFF",
    surface2: "#EFEADC",
    border: "#D8D2C2",
    borderHi: "#B5AC95",
    muted: "#5C5544",      // darker for readability
    text: "#2A2823",       // near-black text
    textHi: "#0F0E0B",
    gold: "#8E6F32",       // deeper gold for contrast
    goldDim: "#5F4920",
    green: "#3D7553",
    red: "#923D3D",
    blue: "#385F8C",
    amber: "#9F6F1F",
  },
};

/* ── Unified Typography ────────────────────────────────────────── */

// All text now uses the elegant serif (display) for EN
// and Nastaliq for AR. Mono used only for numbers/codes.
const fontEn = `'Cormorant Garamond', Georgia, serif`;
const fontAr = `'Noto Naskh Arabic', 'Amiri', serif`;
const fontNastaliq = `'Noto Nastaliq Urdu', serif`;
const fontMono = `'JetBrains Mono', monospace`;

// Helper: pick font based on language
const font = (lang) => (lang === "ar" ? fontAr : fontEn);

/* ── i18n strings ──────────────────────────────────────────────── */

const STRINGS = {
  en: {
    dir: "ltr",
    brand: "Saudi Market Direction",
    nav: {
      home: "Overview", stock: "Stock Analysis", market: "Market",
      portfolio: "Portfolio", journal: "Journal", weekly: "Weekly Review",
    },
    adminNav: {
      dashboard: "Dashboard", stocks: "Stocks", market: "Market View",
      weekly: "Weekly Video", users: "Users",
    },
    // Auth
    authWelcome: "Welcome to Qarar",
    authTagline: "Saudi market direction — analysis only.",
    signIn: "Sign In", signUp: "Sign Up",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    fullName: "Full Name", username: "Username",
    email: "Email", password: "Password",
    createAccount: "Create Account",
    signInCta: "Sign In",
    signOut: "Sign out",
    authErrorRequired: "Please fill in all fields",
    authErrorEmail: "Please enter a valid email",
    authErrorPassword: "Password must be at least 6 characters",
    authErrorExists: "This email or username already exists",
    authErrorInvalid: "Invalid email or password",
    welcomeBack: "Welcome back",
    // Launch / Countdown (NEW)
    seatsLeft: "seats remaining",
    seatsTaken: "members joined",
    seatsFull: "Seats Full",
    seatsFullDesc: "All 100 founding seats have been claimed.",
    waitlistTitle: "Join the Waitlist",
    waitlistDesc: "We'll notify you when new seats open.",
    waitlistJoin: "Join Waitlist",
    waitlistJoined: "You're on the waitlist!",
    reserveMySeat: "Reserve My Seat",
    congratsTitle: "Welcome to Qarar",
    congratsLine: "You've reserved seat",
    of: "of",
    countdownTitle: "We open in",
    countdownDays: "days",
    countdownHours: "hours",
    countdownMinutes: "minutes",
    countdownSeconds: "seconds",
    countdownDay: "day",
    countdownHour: "hour",
    countdownMinute: "minute",
    countdownSecond: "second",
    countdownDesc: "We'll notify you on your email at launch.",
    yourSeat: "Your seat",
    enterSite: "Enter Site",
    waitlistEmail: "Email address",
    // Admin
    launchControl: "Launch Control",
    launchStatus: "Launch Status",
    siteLocked: "Site Locked",
    siteOpen: "Site Open",
    launchDate: "Launch Date",
    seatsCount: "Seats Filled",
    waitlistCount: "Waitlist",
    openSiteNow: "Open Site Now",
    openSiteConfirm: "Open the site for all members now? This bypasses the countdown.",
    lockSiteAgain: "Lock Site Again",
    waitlistTab: "Waitlist",
    // Home
    tadawul: "Tadawul · TASI",
    synthBy: "QARAR · INTELLIGENCE SYNTHESIS",
    trendStrength: "Trend Strength", bullishBias: "Bullish bias",
    liquidityIn: "Liquidity in",
    mostActive: "Most Active", today: "Today",
    sectors: "Sectors", heatmap: "Heatmap",
    tiles: [
      { t: "Stock Analysis", d: "Wave structure, momentum, liquidity" },
      { t: "Market Overview", d: "Direction, reversal zones, flow" },
      { t: "Portfolio", d: "Trades, P/L, post-trade review" },
      { t: "Weekly Review", d: "Friday video synthesis" },
    ],
    // Stock
    energy: "ENERGY", live: "SAR · LIVE",
    bullishWave3: "Bullish", liquidityInflow: "Liquidity Inflow",
    highConviction: "High Conviction",
    waveDaily: "Elliott Wave · Daily",
    impulsive: "Impulsive sequence in progress",
    waveStructure: "Wave Structure", currentlyIn: "Currently in",
    waveDesc: "The strongest and most extended wave of the impulsive sequence. Price action confirms institutional participation.",
    continuation: "Continuation", reversal: "Reversal",
    momentumFlow: "Momentum & Flow",
    momentum: "Momentum", liquidity: "Liquidity",
    inflow: "Inflow", volume: "Volume",
    keyZones: "Key Zones", resistance: "Resistance",
    support: "Support", current: "Current",
    aiSynthesis: "Qarar Synthesis · Analyst Reading",
    confidenceHigh: "CONFIDENCE · HIGH",
    horizon: "HORIZON · 2–4 WEEKS",
    updated: "UPDATED",
    chartImages: "Chart Analysis",
    daily: "Daily", weekly_tf: "Weekly", monthly: "Monthly",
    noChartImages: "No chart images uploaded yet.",
    news: "News",
    liveFromTradingView: "Live · TradingView",
    // Market Overview (NEW)
    marketOverview: "Market Overview",
    watchlist: "All 10 Leading Stocks",
    outlook: "Outlook",
    scenario: "Scenario",
    confidence: "Confidence",
    horizon: "Horizon",
    high: "High", medium: "Medium", low: "Low",
    horizon1W: "1 Week", horizon1M: "1 Month", horizon3M: "3 Months",
    bullishExpected: "Bullish",
    bearishExpected: "Bearish",
    sidewaysExpected: "Sideways",
    notSet: "Not set",
    noScenario: "No scenario yet",
    colTicker: "Ticker", colCompany: "Company", colSector: "Sector",
    colOutlook: "Outlook", colScenario: "Scenario", colConf: "Conf.", colHorizon: "Horizon",
    // Market
    marketStructure: "Tadawul · Market Structure",
    marketHeadline: ["The market is", "bullish", ", with", "moderate", "conviction."],
    tasiLevel: "TASI Level", todayPct: "▲ +0.36% today",
    moderateClimbing: "Moderate · climbing",
    breadth: "Breadth", advancersDecliners: "Advancers vs decliners",
    volatility: "Volatility", vtad: "VTAD · subdued",
    wavePosture: "Wave Posture · TASI",
    finishingWave4: ["Index is finishing", "Wave 4", "consolidation"],
    reversalWatch: "Reversal Watch",
    threeZones: "Three zones warrant attention over the next 5 sessions.",
    reversalItems: [
      { z: "11,920 – 11,980", w: "Upside resistance cluster", p: "Likely pause" },
      { z: "11,640 – 11,720", w: "Wave 4 floor", p: "Active support" },
      { z: "11,400", w: "Structural invalidation", p: "Bullish thesis fails" },
    ],
    liquidityRotation: "Liquidity Rotation",
    fiveDayFlow: "SAR · 5-day flow",
    netInflow: "Net inflow", netOutflow: "Net outflow",
    // Portfolio
    portfolio: "Portfolio", invested: "Invested", positions: "3 positions",
    currentValue: "Current Value", openPL: "Open P/L",
    realizedUnrealized: "SAR · realized + unrealized",
    returnLbl: "Return", sinceInception: "Since inception",
    openPositions: "Open Positions",
    cols: ["Sym", "Name", "Qty", "Entry", "Now", "TP / SL", "P/L", "Note"],
    disciplineScore: "Discipline Score", adherence: "Adherence to plan",
    disciplineMsg: ["You followed your", "pre-set stop loss", "in 9 of 11 closed trades."],
    disciplineRating: ["Poor", "Fair", "Good", "Excellent"],
    disciplinePlanFollowed: "Plan Followed",
    disciplineSLRespected: "SL Respected",
    disciplineTPHit: "TP Reached",
    disciplineEmptyMsg: "Close at least one trade to see your discipline score.",
    postTradeLessons: "Post-Trade Lessons",
    lessons: [
      { d: "08 May", t: "Closed SABIC early due to news anxiety — momentum was still intact." },
      { d: "02 May", t: "Aramco TP hit cleanly. Entry on Wave 2 retracement worked." },
      { d: "27 Apr", t: "STC trade chopped on Wave 4. Should have waited for breakout confirmation." },
    ],
    // Journal
    journalTitle: "Trading Journal",
    everyTradeLesson: ["Every trade is a", "lesson", "."],
    journalSub: "Record reasoning, emotions, and outcome. Build the trader you want to become.",
    thisMonth: "This Month", tradesLogged: "trades logged",
    winRate: "Win Rate", winLoss: "9 wins · 5 losses",
    avgRR: "Avg R:R", rewardRisk: "reward to risk",
    recentEntries: "Recent Entries",
    win: "Win", loss: "Loss",
    reasoning: "Reasoning", emotion: "Emotion", lesson: "Lesson",
    // Portfolio interactive (NEW)
    addTrade: "Add Trade", editTrade: "Edit Trade",
    closeTrade: "Close Trade", reopenTrade: "Reopen",
    deleteTrade: "Delete Trade", confirmDeleteTrade: "Delete this trade?",
    confirmDeleteEntry: "Delete this journal entry?",
    formSym: "Symbol (e.g. 2222)", formName: "Stock Name",
    formQty: "Quantity", formEntry: "Entry Price",
    formCurrent: "Current Price", formTp: "Take Profit", formSl: "Stop Loss",
    formNote: "Note (your reason for this trade)",
    formClosePrice: "Close Price", formCloseDate: "Close Date",
    noTrades: "No trades yet. Click 'Add Trade' to record your first one.",
    openTrades: "Open", closedTrades: "Closed",
    totalTrades: "Total Trades",
    profitableTrades: "Winners", losingTrades: "Losers",
    closedPL: "Closed P/L",
    open: "Open", closed: "Closed",
    closeDialog: "Close Position",
    // Journal interactive (NEW)
    addEntry: "+ New Entry",
    editEntry: "Edit Entry",
    formEntryDate: "Date",
    formEntrySym: "Symbol",
    formOutcome: "Outcome",
    formReasoning: "Why did you take this trade?",
    formEmotion: "How did you feel? Patient? Anxious? Confident?",
    formLesson: "What did you learn from this trade?",
    noEntries: "No journal entries yet. Click 'New Entry' to record your first reflection.",
    entries: [
      { date: "11 May 2026", sym: "2222 Aramco", outcome: "Win",
        reasoning: "Wave 3 thesis confirmed by volume expansion above 27.50. Entered on pullback to 27.20 with stop below Wave 2 low.",
        emotion: "Patient — waited for confirmation. No FOMO.",
        lesson: "When the structure agrees with momentum and news, conviction can be higher." },
      { date: "06 May 2026", sym: "2010 SABIC", outcome: "Loss",
        reasoning: "Took a counter-trend bounce trade against the prevailing Wave A. Plan was to exit at 76.50, exited at 75.20.",
        emotion: "Anxious about earnings — exited before invalidation.",
        lesson: "Don't trade against confirmed corrective structures. The setup was weak from the start." },
    ],
    // Weekly
    weeklyReview: "Weekly Review",
    chapters: "This Week's Chapters",
    chaptersList: [],
    threeScenarios: "Three Scenarios · Next Week",
    archive: "Archive",
    archiveItems: [],
    noChapters: "No chapters added yet.",
    noArchive: "Archive will appear as you publish weekly reviews.",
    // Footer
    disclaimer: "Qarar provides analysis and structural interpretation only — never direct buy or sell recommendations.",
    copyright: "© 2026 QARAR · RIYADH",
    sectors_data: ["Energy", "Banks", "Materials", "Telecom", "Utilities", "Real Estate", "Healthcare", "Retail"],
    // Admin
    adminLogin: "Admin Sign In", adminPasswordLabel: "Admin password",
    welcomeAdmin: "Welcome back, admin", todayDate: "Today",
    publishedAnalyses: "Published Analyses", pendingTasks: "Today's Tasks",
    tasks: ["Update TASI market view", "Publish key stock analyses", "Record Friday's video"],
    addNew: "Add New", edit: "Edit", delete: "Delete", cancel: "Cancel",
    publish: "Publish", unpublish: "Unpublish", published: "Published", draft: "Draft",
    confirmDelete: "Delete this analysis?",
    formStock: "Stock Name", formSymbol: "Symbol", formWave: "Current Wave",
    formContinuation: "Continuation %", formReversal: "Reversal %",
    formSupport: "Support", formResistance: "Resistance",
    formPrice: "Current Price", formChange: "Change %",
    formAnalysis: "Analysis",
    formNotice: "Reminder: structural interpretation only, no direct buy/sell recommendations.",
    chartImagesAdmin: "Chart Images (3 Timeframes)",
    uploadImage: "Click to upload",
    removeImage: "Remove",
    imageHint: "JPG or PNG, max 5 MB",
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
    noAnalyses: "No analyses published yet.",
    // Users (admin)
    registeredUsers: "Registered Users",
    totalUsers: "Total Users",
    joined: "Joined",
    noUsers: "No users registered yet.",
  },
  ar: {
    dir: "rtl",
    brand: "اتجاه السوق السعودي",
    nav: {
      home: "نظرة عامة", stock: "تحليل السهم", market: "السوق",
      portfolio: "المحفظة", journal: "اليوميات", weekly: "المراجعة الأسبوعية",
    },
    adminNav: {
      dashboard: "اللوحة", stocks: "الأسهم", market: "نظرة السوق",
      weekly: "الفيديو الأسبوعي", users: "المستخدمون",
    },
    // Auth
    authWelcome: "أهلاً بك في قرار",
    authTagline: "اتجاه السوق السعودي — تحليل فقط.",
    signIn: "تسجيل دخول", signUp: "إنشاء حساب",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    fullName: "الاسم الكامل", username: "اسم المستخدم",
    email: "البريد الإلكتروني", password: "كلمة المرور",
    createAccount: "إنشاء حساب",
    signInCta: "دخول",
    signOut: "تسجيل خروج",
    authErrorRequired: "الرجاء تعبئة جميع الحقول",
    authErrorEmail: "الرجاء إدخال بريد إلكتروني صحيح",
    authErrorPassword: "كلمة المرور يجب أن تكون ٦ أحرف على الأقل",
    authErrorExists: "البريد الإلكتروني أو اسم المستخدم موجود مسبقاً",
    authErrorInvalid: "البريد أو كلمة المرور غير صحيحة",
    welcomeBack: "أهلاً بعودتك",
    // Launch / Countdown (NEW)
    seatsLeft: "مقعد متبقّي",
    seatsTaken: "عضو مسجّل",
    seatsFull: "المقاعد امتلأت",
    seatsFullDesc: "تم حجز كل المقاعد المؤسسة المئة.",
    waitlistTitle: "انضم لقائمة الانتظار",
    waitlistDesc: "سنخبرك عند فتح مقاعد جديدة.",
    waitlistJoin: "انضم لقائمة الانتظار",
    waitlistJoined: "أنت الآن في قائمة الانتظار!",
    reserveMySeat: "احجز مقعدي الآن",
    congratsTitle: "أهلاً بك في قَرار",
    congratsLine: "حجزت مقعدك رقم",
    of: "من أصل",
    countdownTitle: "نفتح الموقع خلال",
    countdownDays: "أيام",
    countdownHours: "ساعات",
    countdownMinutes: "دقائق",
    countdownSeconds: "ثواني",
    countdownDay: "يوم",
    countdownHour: "ساعة",
    countdownMinute: "دقيقة",
    countdownSecond: "ثانية",
    countdownDesc: "سنرسل لك إشعاراً على بريدك عند الافتتاح.",
    yourSeat: "مقعدك",
    enterSite: "ادخل الموقع",
    waitlistEmail: "البريد الإلكتروني",
    // Admin
    launchControl: "إدارة الإطلاق",
    launchStatus: "حالة الإطلاق",
    siteLocked: "الموقع مُقفل",
    siteOpen: "الموقع مفتوح",
    launchDate: "تاريخ الافتتاح",
    seatsCount: "المقاعد المحجوزة",
    waitlistCount: "قائمة الانتظار",
    openSiteNow: "افتح الموقع الآن",
    openSiteConfirm: "فتح الموقع لكل الأعضاء الآن؟ سيتم تجاوز العدّ التنازلي.",
    lockSiteAgain: "أقفل الموقع مرة أخرى",
    waitlistTab: "قائمة الانتظار",
    tadawul: "تداول · تاسي",
    synthBy: "قرار · توليفة ذكية",
    trendStrength: "قوة الاتجاه", bullishBias: "ميل صعودي",
    liquidityIn: "تدفق السيولة",
    mostActive: "الأكثر", today: "نشاطاً",
    sectors: "خريطة", heatmap: "القطاعات",
    tiles: [
      { t: "تحليل السهم", d: "هيكل الموجات، الزخم، السيولة" },
      { t: "نظرة على السوق", d: "الاتجاه، مناطق الانعكاس، التدفق" },
      { t: "المحفظة", d: "الصفقات، الأرباح والخسائر، التقييم" },
      { t: "المراجعة الأسبوعية", d: "توليفة فيديو الجمعة" },
    ],
    energy: "قطاع الطاقة", live: "ريال · مباشر",
    bullishWave3: "صعودي", liquidityInflow: "تدفق سيولة",
    highConviction: "ثقة عالية",
    waveDaily: "موجات إليوت · يومي",
    impulsive: "تسلسل دافع قيد التنفيذ",
    waveStructure: "هيكل الموجات", currentlyIn: "حالياً في",
    waveDesc: "أقوى وأطول موجة في التسلسل الدافع. حركة السعر تؤكد مشاركة المؤسسات.",
    continuation: "استمرار", reversal: "انعكاس",
    momentumFlow: "الزخم والتدفق",
    momentum: "الزخم", liquidity: "السيولة",
    inflow: "تدفق داخل", volume: "الحجم",
    keyZones: "المناطق الرئيسية", resistance: "مقاومة",
    support: "دعم", current: "الحالي",
    aiSynthesis: "توليفة قرار · قراءة المحلل",
    confidenceHigh: "الثقة · مرتفعة",
    horizon: "الأفق · ٢ – ٤ أسابيع",
    updated: "آخر تحديث",
    chartImages: "تحليل الشارت",
    daily: "يومي", weekly_tf: "أسبوعي", monthly: "شهري",
    noChartImages: "لم تُرفع صور تحليل بعد.",
    news: "الأخبار",
    liveFromTradingView: "مباشر · من TradingView",
    // Market Overview (NEW)
    marketOverview: "متابعة السوق",
    watchlist: "الشركات القيادية العشرة",
    outlook: "التوقع",
    scenario: "السيناريو",
    confidence: "الثقة",
    horizon: "الإطار الزمني",
    high: "عالية", medium: "متوسطة", low: "منخفضة",
    horizon1W: "أسبوع", horizon1M: "شهر", horizon3M: "٣ أشهر",
    bullishExpected: "صعود متوقع",
    bearishExpected: "هبوط متوقع",
    sidewaysExpected: "جانبي",
    notSet: "لم يُحدّد",
    noScenario: "لا يوجد سيناريو بعد",
    colTicker: "الرمز", colCompany: "الشركة", colSector: "القطاع",
    colOutlook: "التوقع", colScenario: "السيناريو", colConf: "الثقة", colHorizon: "الإطار",
    marketStructure: "تداول · هيكل السوق",
    marketHeadline: ["السوق", "صعودي", "، بقناعة", "متوسطة", "."],
    tasiLevel: "مستوى تاسي", todayPct: "▲ +٠.٣٦٪ اليوم",
    moderateClimbing: "متوسطة · في صعود",
    breadth: "الاتساع", advancersDecliners: "الصاعدة مقابل الهابطة",
    volatility: "التذبذب", vtad: "VTAD · هادئ",
    wavePosture: "وضعية الموجة · تاسي",
    finishingWave4: ["المؤشر ينهي تماسك", "الموجة الرابعة", ""],
    reversalWatch: "مراقبة الانعكاس",
    threeZones: "ثلاث مناطق تستحق الانتباه خلال الجلسات الخمس القادمة.",
    reversalItems: [
      { z: "١١,٩٢٠ – ١١,٩٨٠", w: "تجمع مقاومة علوي", p: "توقف محتمل" },
      { z: "١١,٦٤٠ – ١١,٧٢٠", w: "أرضية الموجة الرابعة", p: "دعم نشط" },
      { z: "١١,٤٠٠", w: "إبطال هيكلي", p: "تفشل الفرضية الصعودية" },
    ],
    liquidityRotation: "دوران السيولة",
    fiveDayFlow: "ريال · تدفق ٥ أيام",
    netInflow: "تدفق صافي", netOutflow: "خروج صافي",
    portfolio: "المحفظة", invested: "المستثمر", positions: "٣ مراكز",
    currentValue: "القيمة الحالية", openPL: "الربح/الخسارة المفتوحة",
    realizedUnrealized: "ريال · محقق + غير محقق",
    returnLbl: "العائد", sinceInception: "منذ البداية",
    openPositions: "المراكز المفتوحة",
    cols: ["الرمز", "الاسم", "الكمية", "الدخول", "الآن", "TP / SL", "ر/خ", "ملاحظة"],
    disciplineScore: "درجة الانضباط", adherence: "الالتزام بالخطة",
    disciplineMsg: ["التزمت بـ", "وقف الخسارة المحدد مسبقاً", "في ٩ من ١١ صفقة مغلقة."],
    disciplineRating: ["ضعيف", "مقبول", "جيد", "ممتاز"],
    disciplinePlanFollowed: "اتباع الخطة",
    disciplineSLRespected: "احترام وقف الخسارة",
    disciplineTPHit: "الوصول لهدف الربح",
    disciplineEmptyMsg: "أغلق صفقة واحدة على الأقل لرؤية درجة انضباطك.",
    postTradeLessons: "دروس ما بعد الصفقة",
    lessons: [
      { d: "٨ مايو", t: "أغلقت سابك مبكراً بسبب قلق من الأخبار — الزخم كان لا يزال سليماً." },
      { d: "٢ مايو", t: "أرامكو لامست هدف الربح بدقة. الدخول عند تصحيح الموجة الثانية نجح." },
      { d: "٢٧ أبريل", t: "صفقة الاتصالات تذبذبت في الموجة الرابعة. كان عليّ انتظار تأكيد الاختراق." },
    ],
    journalTitle: "يوميات التداول",
    everyTradeLesson: ["كل صفقة", "درس", "."],
    journalSub: "سجّل الأسباب، المشاعر، والنتيجة. ابنِ المتداول الذي تريد أن تصبحه.",
    thisMonth: "هذا الشهر", tradesLogged: "صفقة مسجلة",
    winRate: "نسبة الفوز", winLoss: "٩ فوز · ٥ خسارة",
    avgRR: "متوسط ع/م", rewardRisk: "العائد إلى المخاطرة",
    recentEntries: "أحدث المدخلات",
    win: "فوز", loss: "خسارة",
    reasoning: "السبب", emotion: "الشعور", lesson: "الدرس",
    // Portfolio interactive (NEW)
    addTrade: "إضافة صفقة", editTrade: "تعديل الصفقة",
    closeTrade: "إغلاق الصفقة", reopenTrade: "إعادة فتح",
    deleteTrade: "حذف الصفقة", confirmDeleteTrade: "حذف هذه الصفقة؟",
    confirmDeleteEntry: "حذف هذا المدخل؟",
    formSym: "الرمز (مثلاً ٢٢٢٢)", formName: "اسم السهم",
    formQty: "الكمية", formEntry: "سعر الدخول",
    formCurrent: "السعر الحالي", formTp: "هدف الربح", formSl: "وقف الخسارة",
    formNote: "ملاحظة (سبب دخولك في الصفقة)",
    formClosePrice: "سعر الإغلاق", formCloseDate: "تاريخ الإغلاق",
    noTrades: "لا توجد صفقات. اضغط 'إضافة صفقة' لتسجيل أول صفقة.",
    openTrades: "مفتوحة", closedTrades: "مغلقة",
    totalTrades: "إجمالي الصفقات",
    profitableTrades: "رابحة", losingTrades: "خاسرة",
    closedPL: "ربح/خسارة محققة",
    open: "مفتوحة", closed: "مغلقة",
    closeDialog: "إغلاق المركز",
    // Journal interactive (NEW)
    addEntry: "+ مدخل جديد",
    editEntry: "تعديل المدخل",
    formEntryDate: "التاريخ",
    formEntrySym: "الرمز",
    formOutcome: "النتيجة",
    formReasoning: "لماذا دخلت هذه الصفقة؟",
    formEmotion: "ما الذي شعرت به؟ صبور؟ قلق؟ واثق؟",
    formLesson: "ما الذي تعلّمته من هذه الصفقة؟",
    noEntries: "لا توجد مدخلات. اضغط 'مدخل جديد' لتسجيل أول تأمل.",
    entries: [
      { date: "١١ مايو ٢٠٢٦", sym: "٢٢٢٢ أرامكو", outcome: "فوز",
        reasoning: "فرضية الموجة الثالثة تأكدت بتوسع الحجم فوق ٢٧.٥٠. دخلت على ارتداد لـ ٢٧.٢٠ بوقف تحت قاع الموجة الثانية.",
        emotion: "صبور — انتظرت التأكيد. لا خوف من تفويت الفرصة.",
        lesson: "حين يتفق الهيكل مع الزخم والأخبار، يمكن أن تكون القناعة أعلى." },
      { date: "٦ مايو ٢٠٢٦", sym: "٢٠١٠ سابك", outcome: "خسارة",
        reasoning: "أخذت صفقة ارتداد عكس الاتجاه ضد الموجة A السائدة. الخطة كانت الخروج عند ٧٦.٥٠، خرجت عند ٧٥.٢٠.",
        emotion: "قلق من الأرباح — خرجت قبل الإبطال.",
        lesson: "لا تتداول عكس الهياكل التصحيحية المؤكدة. الإعداد كان ضعيفاً من البداية." },
    ],
    weeklyReview: "المراجعة الأسبوعية",
    chapters: "فصول هذا الأسبوع",
    chaptersList: [],
    threeScenarios: "ثلاثة سيناريوهات · الأسبوع القادم",
    archive: "الأرشيف",
    archiveItems: [],
    noChapters: "لم تُضف فصول بعد.",
    noArchive: "ستظهر المراجعات السابقة هنا عند نشرها.",
    disclaimer: "قرار يقدم التحليل والتفسير الهيكلي فقط — لا توصيات شراء أو بيع مباشرة.",
    copyright: "© ٢٠٢٦ قرار · الرياض",
    sectors_data: ["الطاقة", "البنوك", "المواد الأساسية", "الاتصالات", "المرافق", "العقار", "الرعاية الصحية", "التجزئة"],
    adminLogin: "دخول المدير", adminPasswordLabel: "كلمة مرور المدير",
    welcomeAdmin: "أهلاً بعودتك أيها المدير", todayDate: "اليوم",
    publishedAnalyses: "التحليلات المنشورة", pendingTasks: "مهام اليوم",
    tasks: ["تحديث نظرة تاسي العامة", "نشر تحليلات الأسهم الرئيسية", "تسجيل فيديو الجمعة"],
    addNew: "إضافة", edit: "تعديل", delete: "حذف", cancel: "إلغاء",
    publish: "نشر", unpublish: "إخفاء", published: "منشور", draft: "مسودة",
    confirmDelete: "حذف هذا التحليل؟",
    formStock: "اسم السهم", formSymbol: "الرمز", formWave: "الموجة الحالية",
    formContinuation: "احتمال الاستمرار %", formReversal: "احتمال الانعكاس %",
    formSupport: "الدعم", formResistance: "المقاومة",
    formPrice: "السعر الحالي", formChange: "التغير %",
    formAnalysis: "التحليل",
    formNotice: "تذكير: تفسير هيكلي فقط، لا توصيات شراء/بيع مباشرة.",
    chartImagesAdmin: "صور التحليل (٣ فريمات)",
    uploadImage: "اضغط للرفع",
    removeImage: "حذف",
    imageHint: "JPG أو PNG، حتى ٥ ميجا",
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
    noAnalyses: "لا توجد تحليلات منشورة بعد.",
    registeredUsers: "المستخدمون المسجلون",
    totalUsers: "إجمالي المستخدمين",
    joined: "الانضمام",
    noUsers: "لا يوجد مستخدمون مسجلون بعد.",
  },
};

const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

/* ── Defaults / seed data ──────────────────────────────────────── */

const DEFAULT_TASI = { value: 0, change: 0, changePct: 0, strength: 50 };

const DEFAULT_MARKET = {
  tasiValue: 0,
  tasiChange: 0,
  tasiChangePct: 0,
  direction: "sideways",
  strength: 50,
  quote: "",
  quoteAr: "",
  quoteHighlight: [],
  quoteHighlightAr: [],
  updatedAt: Date.now(),
};

// Top 10 leading Tadawul stocks — skeleton only, ready for admin to fill
const DEFAULT_STOCKS = [
  {
    id: "s1", sym: "2222", name: "Saudi Aramco", nameAr: "أرامكو السعودية",
    sector: "Energy", sectorAr: "الطاقة",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s2", sym: "1180", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي",
    sector: "Banks", sectorAr: "البنوك",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s3", sym: "1120", name: "Saudi National Bank", nameAr: "البنك الأهلي السعودي",
    sector: "Banks", sectorAr: "البنوك",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s4", sym: "1211", name: "Ma'aden", nameAr: "معادن",
    sector: "Materials", sectorAr: "المواد الأساسية",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s5", sym: "2010", name: "SABIC", nameAr: "سابك",
    sector: "Materials", sectorAr: "المواد الأساسية",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s6", sym: "7010", name: "STC", nameAr: "الاتصالات السعودية",
    sector: "Telecom", sectorAr: "الاتصالات",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s7", sym: "2082", name: "ACWA Power", nameAr: "أكوا باور",
    sector: "Utilities", sectorAr: "المرافق",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s8", sym: "4013", name: "Dr. Sulaiman Al-Habib", nameAr: "د. سليمان الحبيب",
    sector: "Healthcare", sectorAr: "الرعاية الصحية",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s9", sym: "1010", name: "Riyad Bank", nameAr: "بنك الرياض",
    sector: "Banks", sectorAr: "البنوك",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
  {
    id: "s10", sym: "4002", name: "Almarai", nameAr: "المراعي",
    sector: "Consumer Staples", sectorAr: "المواد الاستهلاكية",
    wave: "", waveAr: "",
    continuation: 50, reversal: 50, momentum: 50,
    support: 0, resistance: 0, price: 0, change: 0,
    analysis: "", analysisAr: "",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
    outlook: "", // "bullish" | "bearish" | "sideways" | "" (empty = not set)
    scenario: "", scenarioAr: "",
    confidence: "medium", // "high" | "medium" | "low"
    horizon: "1M", // "1W" | "1M" | "3M"
    updatedAt: Date.now(),
  },
];

const DEFAULT_WEEKLY = {
  week: 1,
  title: "",
  titleAr: "",
  url: "",
  description: "",
  descriptionAr: "",
  scenarios: [
    { label: "", labelAr: "", prob: 0, desc: "", descAr: "" },
    { label: "", labelAr: "", prob: 0, desc: "", descAr: "" },
    { label: "", labelAr: "", prob: 0, desc: "", descAr: "" },
  ],
  updatedAt: Date.now(),
};

// Sector data — zeros until admin updates
const SECTORS_PCT = [0, 0, 0, 0, 0, 0, 0, 0];
const SECTORS_VOL = [0, 0, 0, 0, 0, 0, 0, 0];

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

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Simple password obfuscation (NOT real security — for localStorage demo only)
const simpleHash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
};

const ls = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {
      console.error("localStorage full or unavailable:", e);
    }
  },
};

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

/* ── Atoms ─────────────────────────────────────────────────────── */

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
        fontFamily: fontMono, fontSize: 10, letterSpacing: "0.12em",
        color: c.muted, textTransform: "uppercase", marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: font(lang), fontSize: 36, fontWeight: 500,
        color: accent || c.textHi, lineHeight: 1, letterSpacing: "-0.01em",
      }}>{value}</div>
      {sub && <div style={{
        fontFamily: fontMono, fontSize: 11, color: c.muted, marginTop: 6,
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
      color: col, border: `1px solid ${col}50`,
      background: `${col}15`, borderRadius: 2,
    }}>{children}</span>
  );
};

const Button = ({ children, onClick, variant = "primary", icon: Icon, size = "md", type = "button", style, fullWidth }) => {
  const { c, lang } = useApp();
  const variants = {
    primary: { bg: c.gold, color: c.ink, border: c.gold },
    secondary: { bg: "transparent", color: c.gold, border: c.gold + "70" },
    ghost: { bg: "transparent", color: c.muted, border: c.border },
    danger: { bg: "transparent", color: c.red, border: c.red + "70" },
  };
  const s = variants[variant];
  const padding = size === "sm" ? "6px 12px" : "10px 18px";
  return (
    <button type={type} onClick={onClick} style={{
      padding, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: font(lang),
      fontSize: size === "sm" ? 12 : 14, fontWeight: 500,
      letterSpacing: "0.02em",
      cursor: "pointer", borderRadius: 2,
      display: "inline-flex", alignItems: "center", gap: 8,
      width: fullWidth ? "100%" : undefined,
      justifyContent: fullWidth ? "center" : undefined,
      ...style,
    }}>
      {Icon && <Icon size={size === "sm" ? 12 : 16} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, textarea, rows = 3 }) => {
  const { c, lang } = useApp();
  const Tag = textarea ? "textarea" : "input";
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{
        fontFamily: fontMono, fontSize: 10, color: c.muted,
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
      }}>{label}</div>
      <Tag type={type} value={value === undefined || value === null ? "" : value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        rows={textarea ? rows : undefined}
        style={{
          width: "100%", padding: "10px 12px", background: c.ink,
          border: `1px solid ${c.border}`, color: c.textHi,
          fontFamily: font(lang), fontSize: 15, borderRadius: 2,
          resize: textarea ? "vertical" : "none",
          minHeight: textarea ? rows * 24 : undefined,
        }}
      />
    </label>
  );
};

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

/* ── Chart Image Components ────────────────────────────────────── */

const ImageUploader = ({ value, onChange, label }) => {
  const { c, lang } = useApp();
  const inputRef = useRef(null);
  const t = STRINGS[lang];

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "ar" ? "حجم الصورة كبير. الحد الأقصى ٥ ميجا." : "Image too large. Maximum 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div style={{
        fontFamily: fontMono, fontSize: 10, color: c.muted,
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
      }}>{label}</div>

      {value ? (
        <div style={{ position: "relative" }}>
          <img src={value} alt={label} style={{
            width: "100%", height: 180, objectFit: "cover",
            border: `1px solid ${c.border}`, borderRadius: 2,
          }} />
          <button onClick={() => onChange("")} style={{
            position: "absolute", top: 8, right: 8,
            padding: "4px 10px", background: c.ink + "DD",
            border: `1px solid ${c.red}`, color: c.red,
            fontFamily: font(lang), fontSize: 11,
            cursor: "pointer", borderRadius: 2,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <Trash2 size={11} /> {t.removeImage}
          </button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} style={{
          width: "100%", height: 180,
          border: `1.5px dashed ${c.border}`, borderRadius: 2,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", gap: 10,
          background: c.surface2,
        }}>
          <Upload size={28} color={c.gold} strokeWidth={1.2} />
          <div style={{ fontFamily: font(lang), fontSize: 14, color: c.text }}>{t.uploadImage}</div>
          <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.1em" }}>
            {t.imageHint}
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
};

const ChartImageSlider = ({ images }) => {
  const { c, lang } = useApp();
  const t = STRINGS[lang];
  const [active, setActive] = useState("daily");

  const tabs = [
    { k: "daily", label: t.daily },
    { k: "weekly", label: t.weekly_tf },
    { k: "monthly", label: t.monthly },
  ];

  const hasAny = images && (images.daily || images.weekly || images.monthly);
  if (!hasAny) {
    return (
      <Card style={{ padding: 40, textAlign: "center" }}>
        <ImageIcon size={32} color={c.muted} strokeWidth={1.2} style={{ margin: "0 auto" }} />
        <div style={{ fontFamily: font(lang), fontSize: 16, color: c.muted, marginTop: 12, fontStyle: "italic" }}>
          {t.noChartImages}
        </div>
      </Card>
    );
  }

  const currentImage = images[active];

  return (
    <Card style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <SectionLabel accent><ImageIcon size={11} /> {t.chartImages}</SectionLabel>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map((tab) => (
            <button key={tab.k} onClick={() => setActive(tab.k)} style={{
              padding: "8px 16px",
              background: active === tab.k ? c.gold + "20" : "transparent",
              color: active === tab.k ? c.gold : c.muted,
              border: `1px solid ${active === tab.k ? c.gold + "70" : c.border}`,
              fontFamily: font(lang), fontSize: 13, fontWeight: 500,
              cursor: "pointer", borderRadius: 2,
              opacity: images[tab.k] ? 1 : 0.5,
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {currentImage ? (
        <img src={currentImage} alt={active} style={{
          width: "100%", maxHeight: 600, objectFit: "contain",
          background: c.ink, borderRadius: 2,
          border: `1px solid ${c.border}`,
        }} />
      ) : (
        <div style={{
          padding: 60, textAlign: "center", background: c.surface2,
          fontFamily: font(lang), color: c.muted, fontStyle: "italic",
        }}>
          {t.noChartImages}
        </div>
      )}
    </Card>
  );
};

/* ── TradingView News Widget ───────────────────────────────────── */

const TradingViewNews = ({ symbol }) => {
  const { c, t, lang, theme } = useApp();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !symbol) return;
    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      feedMode: "symbol",
      symbol: `TADAWUL:${symbol}`,
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: 460,
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: lang === "ar" ? "ar_AE" : "en",
    });
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, lang, theme]);

  if (!symbol) return null;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{
        padding: "20px 28px 16px",
        borderBottom: `1px solid ${c.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        flexWrap: "wrap", gap: 8,
      }}>
        <h3 style={{ fontFamily: font(lang), fontSize: 22, fontWeight: 500, color: c.textHi, margin: 0 }}>
          {t.news} <span style={{ fontStyle: "italic", color: c.gold }}>{t.liveFromTradingView}</span>
        </h3>
        <SectionLabel>{symbol} · TADAWUL</SectionLabel>
      </div>
      <div ref={containerRef} className="tradingview-widget-container" style={{ minHeight: 460, padding: 8 }} />
    </Card>
  );
};

const WaveChart = ({ series = ARAMCO_SERIES, height = 320, support = 26.2, resistance = 30.1 }) => {
  const { c, lang } = useApp();
  const w = 800, h = height;
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
          <stop offset="0%" stopColor={c.gold} stopOpacity="0.2" />
          <stop offset="100%" stopColor={c.gold} stopOpacity="0" />
        </linearGradient>
        <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 40" fill="none" stroke={c.border} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x={pad.l} y={pad.t} width={w - pad.l - pad.r} height={h - pad.t - pad.b} fill="url(#grid)" opacity="0.4" />
      {resistance >= min && resistance <= max && (
        <>
          <line x1={pad.l} x2={w - pad.r} y1={yFor(resistance)} y2={yFor(resistance)} stroke={c.red} strokeDasharray="2 4" strokeWidth="0.8" opacity="0.6" />
          <text x={w - pad.r - 4} y={yFor(resistance) - 4} textAnchor="end" fontFamily={fontMono} fontSize="9" fill={c.red} letterSpacing="0.1em">
            {resLabel} {fmt(resistance, 2, lang)}
          </text>
        </>
      )}
      {support >= min && support <= max && (
        <>
          <line x1={pad.l} x2={w - pad.r} y1={yFor(support)} y2={yFor(support)} stroke={c.green} strokeDasharray="2 4" strokeWidth="0.8" opacity="0.6" />
          <text x={w - pad.r - 4} y={yFor(support) + 12} textAnchor="end" fontFamily={fontMono} fontSize="9" fill={c.green} letterSpacing="0.1em">
            {supLabel} {fmt(support, 2, lang)}
          </text>
        </>
      )}
      <path d={areaPath} fill="url(#areaG)" />
      <path d={path} fill="none" stroke={c.gold} strokeWidth="1.6" />
      <path d={WAVE_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${xs[p.i]} ${ys[p.i]}`).join(" ")}
        fill="none" stroke={c.textHi} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
      {WAVE_POINTS.map((p, i) => (
        <g key={i}>
          <circle cx={xs[p.i]} cy={ys[p.i]} r="3" fill={c.ink} stroke={c.gold} strokeWidth="1.2" />
          <text x={xs[p.i]} y={ys[p.i] - 12} textAnchor="middle" fontFamily={fontEn} fontSize="14" fill={c.gold} fontStyle="italic">
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
        <text key={i} x={pad.l + (i / 3) * (w - pad.l - pad.r)} y={h - pad.b + 18} fontFamily={fontMono} fontSize="9" fill={c.muted} letterSpacing="0.1em">
          {m}
        </text>
      ))}
    </svg>
  );
};

const Sparkline = ({ data, color, w = 80, h = 24 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3" />
    </svg>
  );
};

const fakeSpark = (seed, up = true) => {
  const arr = []; let v = 50;
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
        <text x="80" y="70" textAnchor="middle" fontFamily={font(lang)} fontSize="30" fontWeight="500" fill={c.textHi}>{value}</text>
      </svg>
      <div style={{
        fontFamily: fontMono, fontSize: 10, letterSpacing: "0.15em",
        color: c.muted, textTransform: "uppercase", marginTop: -8,
      }}>{label}</div>
    </div>
  );
};

/* ── Professional Discipline Ring ──────────────────────────────── */

const DisciplineRing = ({ score, breakdown }) => {
  const { c, t, lang } = useApp();
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  // Color tiers: red < amber < gold < green
  const tierColor =
    score < 40 ? c.red :
    score < 60 ? c.amber :
    score < 80 ? c.gold :
    c.green;

  const tierLabel =
    score < 40 ? t.disciplineRating[0] :
    score < 60 ? t.disciplineRating[1] :
    score < 80 ? t.disciplineRating[2] :
    t.disciplineRating[3];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Ring */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background ring */}
          <circle cx={center} cy={center} r={r}
            stroke={c.border} strokeWidth={stroke} fill="none" opacity="0.6" />
          {/* Inner subtle ring */}
          <circle cx={center} cy={center} r={r - stroke - 6}
            stroke={c.border} strokeWidth="1" fill="none" opacity="0.3" />
          {/* Progress arc */}
          <circle cx={center} cy={center} r={r}
            stroke={tierColor} strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
          {/* Tick marks at 25/50/75 */}
          {[0.25, 0.5, 0.75].map((p) => {
            const angle = p * 2 * Math.PI;
            const x1 = center + (r - stroke / 2 - 2) * Math.cos(angle);
            const y1 = center + (r - stroke / 2 - 2) * Math.sin(angle);
            const x2 = center + (r + stroke / 2 + 2) * Math.cos(angle);
            const y2 = center + (r + stroke / 2 + 2) * Math.sin(angle);
            return <line key={p} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.muted} strokeWidth="1" opacity="0.4" />;
          })}
        </svg>
        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 4,
        }}>
          <div style={{
            fontFamily: fontMono, fontSize: 10,
            color: c.muted, letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            {t.disciplineScore}
          </div>
          <div style={{
            fontFamily: font(lang), fontSize: 64, fontWeight: 500,
            color: c.textHi, lineHeight: 1, letterSpacing: "-0.02em",
          }}>
            {Math.round(score)}
          </div>
          <div style={{
            fontFamily: font(lang), fontSize: 14,
            color: tierColor, fontStyle: "italic",
            letterSpacing: "0.05em",
          }}>
            {tierLabel}
          </div>
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdown && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          {breakdown.map((item) => {
            const itemColor =
              item.value < 40 ? c.red :
              item.value < 60 ? c.amber :
              item.value < 80 ? c.gold :
              c.green;
            return (
              <div key={item.label}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "baseline", marginBottom: 6,
                }}>
                  <span style={{
                    fontFamily: font(lang), fontSize: 13,
                    color: c.text,
                  }}>{item.label}</span>
                  <span style={{
                    fontFamily: fontMono, fontSize: 13,
                    color: itemColor, fontWeight: 500,
                  }}>{Math.round(item.value)}%</span>
                </div>
                <div style={{
                  height: 5, background: c.border, borderRadius: 3, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${item.value}%`, height: "100%",
                    background: itemColor,
                    transition: "width 0.6s ease-out",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  return m ? m[1] : null;
};

/* ──────────────────────────────────────────────────────────────────
   LAUNCH SYSTEM — Seat Counter, Congrats, Countdown, Seats Full
   ────────────────────────────────────────────────────────────────── */

// Helper: launch date is loaded from Supabase settings.
// We cache it in module scope so countdown components can access synchronously.
let _launchDateCache = null;
const setLaunchDateCache = (ts) => { _launchDateCache = ts; };
const getLaunchDate = () => {
  // Fallback if not yet loaded: 10 days from now
  return _launchDateCache || (Date.now() + LAUNCH_DAYS_FROM_INSTALL * 24 * 60 * 60 * 1000);
};

// Helper: check whether countdown is active or already passed
const isLaunchTimeReached = () => {
  return Date.now() >= getLaunchDate();
};

/* ── Seat Counter (bar) ─────────────────────────────────────────── */

const SeatCounter = ({ filled, max }) => {
  const { c, t, lang } = useApp();
  const percent = Math.min(100, (filled / max) * 100);
  const remaining = Math.max(0, max - filled);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: 10, fontFamily: fontMono, fontSize: 11,
        color: c.muted, letterSpacing: "0.1em",
      }}>
        <span>{filled} / {max} {t.seatsTaken}</span>
        <span style={{ color: remaining < 20 ? c.amber : c.gold }}>
          {remaining} {t.seatsLeft}
        </span>
      </div>
      <div style={{
        height: 6, background: c.border, borderRadius: 3, overflow: "hidden",
      }}>
        <div style={{
          width: `${percent}%`, height: "100%",
          background: `linear-gradient(90deg, ${c.gold}, ${c.amber})`,
          transition: "width 0.6s ease-out",
        }} />
      </div>
    </div>
  );
};

/* ── Congratulations screen (shown right after signup) ─────────── */

const CongratsScreen = ({ user, onContinue }) => {
  const { c, t, lang, setLang, theme, setTheme } = useApp();
  // Auto-advance after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => onContinue(), 4500);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div dir={t.dir} style={{
      minHeight: "100vh", background: c.ink, color: c.text,
      fontFamily: font(lang),
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <Logo size={60} />
        </div>
        <div style={{
          fontFamily: fontMono, fontSize: 11, color: c.gold,
          letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 24,
        }}>
          ✦ {t.welcomeBack} ✦
        </div>
        <h1 style={{
          fontFamily: font(lang), fontSize: 44, fontWeight: 500, color: c.textHi,
          margin: 0, marginBottom: 16, letterSpacing: "-0.02em",
        }}>
          {t.congratsTitle},
        </h1>
        <p style={{
          fontFamily: font(lang), fontSize: 22, color: c.gold,
          margin: "0 0 32px", fontStyle: "italic",
        }}>
          {user.name}
        </p>
        <div style={{
          padding: "28px 24px",
          background: `linear-gradient(135deg, ${c.surface} 0%, ${c.surface2} 100%)`,
          border: `1px solid ${c.gold}40`, borderRadius: 4,
        }}>
          <div style={{
            fontFamily: font(lang), fontSize: 16, color: c.text, marginBottom: 8,
          }}>
            {t.congratsLine}
          </div>
          <div style={{
            fontFamily: font(lang), fontSize: 72, fontWeight: 500,
            color: c.textHi, lineHeight: 1, letterSpacing: "-0.02em",
            margin: "8px 0",
          }}>
            #{user.seatNumber}
          </div>
          <div style={{
            fontFamily: fontMono, fontSize: 13, color: c.muted, letterSpacing: "0.1em",
          }}>
            {t.of} {MAX_SEATS}
          </div>
        </div>
        <div style={{
          marginTop: 40, fontFamily: fontMono, fontSize: 11,
          color: c.muted, letterSpacing: "0.2em",
        }}>
          ↓
        </div>
      </div>
    </div>
  );
};

/* ── Countdown Screen ───────────────────────────────────────────── */

const CountdownScreen = ({ user, onLogout }) => {
  const { c, t, lang, setLang, theme, setTheme } = useApp();
  const isAr = lang === "ar";
  const launchTs = getLaunchDate();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, launchTs - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  const units = [
    { v: days, l: days === 1 ? t.countdownDay : t.countdownDays },
    { v: hours, l: hours === 1 ? t.countdownHour : t.countdownHours },
    { v: minutes, l: minutes === 1 ? t.countdownMinute : t.countdownMinutes },
    { v: seconds, l: seconds === 1 ? t.countdownSecond : t.countdownSeconds },
  ];

  return (
    <div dir={t.dir} style={{
      minHeight: "100vh", background: c.ink, color: c.text,
      fontFamily: font(lang),
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative",
    }}>
      {/* Top-right toggles + logout */}
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
          padding: "8px 12px", background: "transparent",
          border: `1px solid ${c.border}`, color: c.text,
          cursor: "pointer", borderRadius: 2,
          fontFamily: fontMono, fontSize: 11, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Languages size={13} color={c.gold} />
          <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
          <span style={{ color: c.border }}>·</span>
          <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontAr }}>ع</span>
        </button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
          width: 36, height: 36, background: "transparent",
          border: `1px solid ${c.border}`, color: c.gold,
          cursor: "pointer", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button onClick={onLogout} title={t.signOut} style={{
          width: 36, height: 36, background: "transparent",
          border: `1px solid ${c.border}`, color: c.muted,
          cursor: "pointer", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <LogOut size={15} />
        </button>
      </div>

      {/* Glow background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(800px 500px at 50% 40%, ${c.gold}10, transparent)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", maxWidth: 720, width: "100%", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo size={48} />
        </div>

        {/* Brand */}
        <div style={{ fontFamily: fontNastaliq, fontSize: 40, color: c.gold, lineHeight: 1, marginBottom: 6 }}>
          قَرار
        </div>
        <div style={{
          fontFamily: fontMono, fontSize: 10, color: c.muted,
          letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 56,
        }}>
          QARAR · INTELLIGENCE
        </div>

        {/* Greeting */}
        <div style={{
          fontFamily: font(lang), fontSize: 16, color: c.muted,
          fontStyle: "italic", marginBottom: 12,
        }}>
          {isAr ? `أهلاً ${user.name}` : `Hello ${user.name}`}
        </div>

        {/* Countdown title */}
        <h1 style={{
          fontFamily: font(lang), fontSize: 36, fontWeight: 500, color: c.textHi,
          margin: "0 0 48px", letterSpacing: "-0.01em",
        }}>
          {t.countdownTitle}
        </h1>

        {/* Countdown boxes */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, marginBottom: 56,
        }}>
          {units.map((u, i) => (
            <div key={i} style={{
              padding: "28px 12px",
              background: c.surface,
              border: `1px solid ${c.gold}30`,
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: font(lang), fontSize: 48, fontWeight: 500,
                color: c.textHi, lineHeight: 1, letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}>
                {pad(u.v)}
              </div>
              <div style={{
                fontFamily: fontMono, fontSize: 10, color: c.gold,
                letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 8,
              }}>
                {u.l}
              </div>
            </div>
          ))}
        </div>

        {/* Seat info */}
        <div style={{
          padding: "20px 24px",
          background: c.surface2,
          border: `1px solid ${c.border}`,
          borderRadius: 4,
          marginBottom: 24,
          display: "inline-block",
        }}>
          <div style={{
            fontFamily: fontMono, fontSize: 10, color: c.muted,
            letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6,
          }}>
            {t.yourSeat}
          </div>
          <div style={{
            fontFamily: font(lang), fontSize: 32, fontWeight: 500,
            color: c.gold, lineHeight: 1,
          }}>
            #{user.seatNumber} <span style={{ color: c.muted, fontSize: 18 }}>{t.of} {MAX_SEATS}</span>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{
          fontFamily: font(lang), fontSize: 15, color: c.muted,
          fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.6,
        }}>
          {t.countdownDesc}
        </p>

        {/* Brand tagline */}
        <div style={{
          fontFamily: fontMono, fontSize: 11, color: c.muted,
          letterSpacing: "0.25em",
        }}>
          tasiqarar.com
        </div>
      </div>
    </div>
  );
};

/* ── Seats Full / Waitlist Screen ───────────────────────────────── */

const SeatsFullScreen = ({ onJoinWaitlist, waitlistCount }) => {
  const { c, t, lang, setLang, theme, setTheme } = useApp();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError("");
    if (submitting) return;
    if (!email.trim()) {
      setError(t.authErrorRequired);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.authErrorEmail);
      return;
    }
    setSubmitting(true);
    try {
      const result = await db_addToWaitlist(email);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      setJoined(true);
      if (onJoinWaitlist) {
        const fresh = await db_listWaitlist();
        onJoinWaitlist(fresh);
      }
    } catch (err) {
      console.error(err);
      setError(t.authErrorInvalid);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir={t.dir} style={{
      minHeight: "100vh", background: c.ink, color: c.text,
      fontFamily: font(lang),
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
          padding: "8px 12px", background: "transparent",
          border: `1px solid ${c.border}`, color: c.text,
          cursor: "pointer", borderRadius: 2,
          fontFamily: fontMono, fontSize: 11, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Languages size={13} color={c.gold} />
          <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
          <span style={{ color: c.border }}>·</span>
          <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontAr }}>ع</span>
        </button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
          width: 36, height: 36, background: "transparent",
          border: `1px solid ${c.border}`, color: c.gold,
          cursor: "pointer", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo size={48} />
        </div>
        <div style={{ fontFamily: fontNastaliq, fontSize: 36, color: c.gold, marginBottom: 4 }}>
          قَرار
        </div>
        <div style={{
          fontFamily: fontMono, fontSize: 10, color: c.muted,
          letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 48,
        }}>
          QARAR · INTELLIGENCE
        </div>

        <Card style={{ padding: 36 }}>
          {/* Lock icon */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            border: `1.5px solid ${c.gold}`, background: c.gold + "15",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <div style={{ fontSize: 30 }}>🔒</div>
          </div>

          <h2 style={{
            fontFamily: font(lang), fontSize: 32, color: c.textHi,
            margin: "0 0 12px", fontWeight: 500,
          }}>
            {t.seatsFull}
          </h2>
          <p style={{
            fontFamily: font(lang), fontSize: 15, color: c.muted,
            margin: "0 0 32px", fontStyle: "italic", lineHeight: 1.6,
          }}>
            {t.seatsFullDesc}
          </p>

          {joined ? (
            <div style={{
              padding: 20, background: c.green + "15",
              border: `1px solid ${c.green}40`, borderRadius: 2,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
              <div style={{ fontFamily: font(lang), fontSize: 16, color: c.green, fontWeight: 500 }}>
                {t.waitlistJoined}
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: font(lang), fontSize: 14, color: c.text,
                marginBottom: 16, fontStyle: "italic",
              }}>
                {t.waitlistDesc}
              </div>
              <Input label={t.waitlistEmail} value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
              {error && (
                <div style={{
                  padding: "10px 12px", background: c.red + "15",
                  border: `1px solid ${c.red}40`, borderRadius: 2,
                  fontFamily: font(lang), fontSize: 13, color: c.red,
                  marginBottom: 12,
                }}>
                  {error}
                </div>
              )}
              <Button onClick={submit} fullWidth icon={Sparkles}>
                {t.waitlistJoin}
              </Button>
              {waitlistCount > 0 && (
                <div style={{
                  marginTop: 16, fontFamily: fontMono, fontSize: 11,
                  color: c.muted, letterSpacing: "0.1em",
                }}>
                  {waitlistCount} {lang === "ar" ? "في قائمة الانتظار" : "on waitlist"}
                </div>
              )}
            </>
          )}
        </Card>

        <div style={{
          marginTop: 24, fontFamily: font(lang), fontSize: 12,
          color: c.muted, fontStyle: "italic", lineHeight: 1.6,
        }}>
          {t.disclaimer}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   AUTH PAGE (Sign In / Sign Up)
   ────────────────────────────────────────────────────────────────── */

const AuthPage = ({ users, setUsers, setCurrentUser, onSignupSuccess }) => {
  const { c, t, lang, setLang, theme, setTheme } = useApp();
  const isAr = lang === "ar";
  const [mode, setMode] = useState("signin"); // signin | signup
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const seatsFilled = users.length;
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    if (submitting) return;

    if (mode === "signup") {
      if (!name.trim() || !username.trim() || !email.trim() || !password) {
        setError(t.authErrorRequired); return;
      }
      if (!isValidEmail(email)) { setError(t.authErrorEmail); return; }
      if (password.length < 6) { setError(t.authErrorPassword); return; }

      setSubmitting(true);
      try {
        // Check existence in Supabase
        const existingEmail = await db_findUserByEmail(email);
        if (existingEmail) { setError(t.authErrorExists); setSubmitting(false); return; }
        const existingUsername = await db_findUserByUsername(username);
        if (existingUsername) { setError(t.authErrorExists); setSubmitting(false); return; }

        const result = await db_createUser({
          name, username, email,
          passwordHash: simpleHash(password),
        });
        if (result.error) { setError(t.authErrorExists); setSubmitting(false); return; }

        const newUser = result.user;
        // Refresh user list
        const fresh = await db_listUsers();
        setUsers(fresh);
        ls.set("qarar:session", { userId: newUser.id, time: Date.now() });
        setCurrentUser(newUser);
        if (onSignupSuccess) onSignupSuccess(newUser);
      } catch (err) {
        console.error(err);
        setError(t.authErrorInvalid);
      } finally {
        setSubmitting(false);
      }
    } else {
      // signin
      if (!email.trim() || !password) { setError(t.authErrorRequired); return; }
      setSubmitting(true);
      try {
        const user = await db_findUserByEmail(email);
        if (!user || user.passwordHash !== simpleHash(password)) {
          setError(t.authErrorInvalid); setSubmitting(false); return;
        }
        ls.set("qarar:session", { userId: user.id, time: Date.now() });
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
        setError(t.authErrorInvalid);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div dir={t.dir} style={{
      minHeight: "100vh", background: c.ink, color: c.text,
      fontFamily: font(lang),
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      {/* Top-right toggles */}
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
          padding: "8px 12px", background: "transparent",
          border: `1px solid ${c.border}`, color: c.text,
          cursor: "pointer", borderRadius: 2,
          fontFamily: fontMono, fontSize: 11, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Languages size={13} color={c.gold} />
          <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
          <span style={{ color: c.border }}>·</span>
          <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontAr }}>ع</span>
        </button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
          width: 36, height: 36, background: "transparent",
          border: `1px solid ${c.border}`, color: c.gold,
          cursor: "pointer", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo + Welcome */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={56} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <div style={{ fontFamily: fontNastaliq, fontSize: 36, color: c.gold, lineHeight: 1 }}>قرار</div>
            <div style={{ fontFamily: fontEn, fontSize: 28, color: c.textHi, fontStyle: "italic", lineHeight: 1 }}>Qarar</div>
          </div>
          <div style={{
            fontFamily: fontMono, fontSize: 10, color: c.muted,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            {t.brand}
          </div>
        </div>

        <Card style={{ padding: 36 }}>
          <h1 style={{
            fontFamily: font(lang), fontSize: 32, color: c.textHi,
            margin: 0, fontWeight: 500, textAlign: "center",
          }}>
            {mode === "signin" ? t.authWelcome : t.signUp}
          </h1>
          <p style={{
            fontFamily: font(lang), fontSize: 15, color: c.muted,
            textAlign: "center", margin: "8px 0 28px", fontStyle: "italic",
          }}>
            {t.authTagline}
          </p>

          <form onSubmit={submit}>
            {mode === "signup" && (
              <>
                <SeatCounter filled={seatsFilled} max={MAX_SEATS} />
                <Input label={t.fullName} value={name} onChange={setName} placeholder={isAr ? "محمد العتيبي" : "John Smith"} />
                <Input label={t.username} value={username} onChange={setUsername} placeholder={isAr ? "trader_2026" : "trader_2026"} />
              </>
            )}
            <Input label={t.email} value={email} onChange={setEmail} type="email" placeholder="email@example.com" />
            <Input label={t.password} value={password} onChange={setPassword} type="password" placeholder="••••••••" />

            {error && (
              <div style={{
                padding: "10px 12px", background: c.red + "15",
                border: `1px solid ${c.red}40`, borderRadius: 2,
                fontFamily: font(lang), fontSize: 13, color: c.red,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <Button type="submit" fullWidth onClick={submit} icon={mode === "signin" ? Shield : User} style={{ marginTop: 8 }}>
              {mode === "signin" ? t.signInCta : (mode === "signup" ? t.reserveMySeat : t.createAccount)}
            </Button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: `1px solid ${c.border}`,
            textAlign: "center", fontFamily: font(lang), fontSize: 14, color: c.muted,
          }}>
            {mode === "signin" ? t.noAccount : t.haveAccount}
            {" "}
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} style={{
              background: "none", border: "none", color: c.gold,
              fontFamily: font(lang), fontSize: 14, cursor: "pointer",
              textDecoration: "underline", padding: 0,
            }}>
              {mode === "signin" ? t.signUp : t.signIn}
            </button>
          </div>
        </Card>

        <div style={{
          marginTop: 24, textAlign: "center",
          fontFamily: font(lang), fontSize: 12, color: c.muted,
          fontStyle: "italic", lineHeight: 1.6,
        }}>
          {t.disclaimer}
        </div>
      </div>
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
          background: `radial-gradient(800px 300px at ${isAr ? "20%" : "80%"} 0%, ${c.gold}10, transparent)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, position: "relative" }}>
          <div>
            <SectionLabel accent>{t.tadawul}</SectionLabel>
            <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 24, flexDirection: isAr ? "row-reverse" : "row", justifyContent: "flex-start" }}>
              <div style={{ fontFamily: font(lang), fontSize: 76, fontWeight: 500, color: c.textHi, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                {market.tasiValue ? fmt(market.tasiValue, 2, lang) : "—"}
              </div>
              {market.tasiValue > 0 && (
                <div style={{ color: market.tasiChange >= 0 ? c.green : c.red, fontFamily: fontMono, fontSize: 14 }}>
                  {market.tasiChange >= 0 ? "▲" : "▼"} {fmt(Math.abs(market.tasiChange || 0), 2, lang)} <span style={{ opacity: 0.7 }}>({pct(market.tasiChangePct || 0, lang)})</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 24, maxWidth: 520 }}>
              {(isAr ? market.quoteAr : market.quote) ? (
                <p style={{ fontFamily: font(lang), fontSize: 24, fontStyle: "italic", color: c.text, lineHeight: 1.5, fontWeight: 400 }}>
                  "{renderQuote()}"
                </p>
              ) : (
                <p style={{ fontFamily: font(lang), fontSize: 18, fontStyle: "italic", color: c.muted, lineHeight: 1.5 }}>
                  {isAr ? "في انتظار توليفة المحلل…" : "Awaiting analyst synthesis…"}
                </p>
              )}
              <div style={{ marginTop: 16, fontFamily: fontMono, fontSize: 11, color: c.muted, letterSpacing: "0.1em" }}>
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
            <h3 style={{ fontFamily: font(lang), fontSize: 28, fontWeight: 500, color: c.textHi, margin: 0, letterSpacing: "-0.01em" }}>
              {t.mostActive} <span style={{ fontStyle: "italic", color: c.gold }}>{t.today}</span>
            </h3>
          </div>
          {featured.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: c.muted, fontFamily: font(lang), fontStyle: "italic", fontSize: 16 }}>
              {t.noAnalyses}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {featured.map((s, i) => {
                // Use outlook for arrow direction
                const outlookConf =
                  s.outlook === "bullish" ? { icon: "▲", color: c.green, label: t.bullishExpected } :
                  s.outlook === "bearish" ? { icon: "▼", color: c.red, label: t.bearishExpected } :
                  s.outlook === "sideways" ? { icon: "→", color: c.amber, label: t.sidewaysExpected } :
                  { icon: "·", color: c.muted, label: t.notSet };

                return (
                  <div key={s.id} onClick={() => go("stock", s.id)} style={{
                    display: "grid", gridTemplateColumns: "60px 1fr auto auto",
                    alignItems: "center", padding: "14px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
                    cursor: "pointer", gap: 16,
                  }}>
                    <div style={{ fontFamily: fontMono, fontSize: 12, color: c.muted, letterSpacing: "0.05em" }}>{s.sym}</div>
                    <div>
                      <div style={{ fontFamily: font(lang), fontSize: 17, color: c.textHi, fontWeight: 500 }}>
                        {isAr ? s.nameAr : s.name}
                      </div>
                      <div style={{ fontFamily: font(lang), fontSize: 12, color: c.muted, marginTop: 2 }}>
                        {isAr ? s.sectorAr : s.sector}
                      </div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "5px 10px",
                      background: outlookConf.color + "15",
                      border: `1px solid ${outlookConf.color}40`,
                      borderRadius: 2,
                    }}>
                      <span style={{ fontFamily: fontMono, fontSize: 14, color: outlookConf.color, fontWeight: 600, lineHeight: 1 }}>
                        {outlookConf.icon}
                      </span>
                      <span style={{ fontFamily: font(lang), fontSize: 13, color: outlookConf.color, fontWeight: 500 }}>
                        {outlookConf.label}
                      </span>
                    </div>
                    <ChevronRight size={14} color={c.muted} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: font(lang), fontSize: 28, fontWeight: 500, color: c.textHi, margin: 0 }}>
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
                    ? `${c.green}${Math.round((0.08 + intensity * 0.2) * 255).toString(16).padStart(2, "0")}`
                    : `${c.red}${Math.round((0.08 + intensity * 0.2) * 255).toString(16).padStart(2, "0")}`,
                  border: `1px solid ${up ? c.green : c.red}30`,
                  borderRadius: 2,
                }}>
                  <div style={{ fontFamily: font(lang), fontSize: 14, color: c.textHi, fontWeight: 500 }}>{name}</div>
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
              <tile.icon size={22} color={c.gold} strokeWidth={1.4} />
              <div style={{ fontFamily: font(lang), fontSize: 24, color: c.textHi, marginTop: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {t.tiles[idx].t}
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 14, color: c.muted, marginTop: 6, lineHeight: 1.6 }}>
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
        <div style={{ fontFamily: font(lang), fontSize: 20, color: c.muted, fontStyle: "italic" }}>
          {t.noAnalyses}
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {published.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {published.map((s) => (
            <button key={s.id} onClick={() => setSelectedStockId(s.id)} style={{
              padding: "9px 16px",
              background: s.id === stock.id ? c.gold + "20" : "transparent",
              color: s.id === stock.id ? c.gold : c.muted,
              border: `1px solid ${s.id === stock.id ? c.gold + "70" : c.border}`,
              fontFamily: font(lang), fontSize: 14, fontWeight: 500,
              cursor: "pointer", borderRadius: 2,
            }}>
              {s.sym} · {isAr ? s.nameAr : s.name}
            </button>
          ))}
        </div>
      )}

      <Card style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
          <div>
            <SectionLabel accent>{stock.sym} · {isAr ? (stock.sectorAr || "") : (stock.sector || "")}</SectionLabel>
            <div style={{ marginTop: 12 }}>
              <h1 style={{ fontFamily: font(lang), fontSize: 56, fontWeight: 500, color: c.textHi, margin: 0, letterSpacing: "-0.02em" }}>
                {isAr ? stock.nameAr : stock.name}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: fontMono, fontSize: 36, color: c.textHi }}>{fmt(stock.price, 2, lang)}</span>
              <span style={{ fontFamily: fontMono, fontSize: 14, color: (stock.change || 0) >= 0 ? c.green : c.red }}>
                {(stock.change || 0) >= 0 ? "▲" : "▼"} {fmt(Math.abs(stock.change || 0), 2, lang)}%
              </span>
              <span style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.1em" }}>
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

      {/* Chart Images Slider — NEW */}
      <ChartImageSlider images={stock.images} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <SectionLabel accent><Waves size={11} /> {t.waveStructure}</SectionLabel>
          <div style={{ marginTop: 20, fontFamily: font(lang), fontSize: 30, color: c.textHi, lineHeight: 1.3, fontWeight: 500 }}>
            {t.currentlyIn} <span style={{ fontStyle: "italic", color: c.gold }}>{isAr ? stock.waveAr : stock.wave}</span>
          </div>
          <div style={{ fontFamily: font(lang), fontSize: 15, color: c.text, marginTop: 12, lineHeight: 1.7 }}>
            {t.waveDesc}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: t.continuation, v: stock.continuation, col: c.green },
              { l: t.reversal, v: stock.reversal, col: c.red },
            ].map((b) => (
              <div key={b.l}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font(lang), fontSize: 13, color: c.muted, marginBottom: 4 }}>
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
              <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {t.liquidity}
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 20, color: c.blue, marginTop: 4, fontWeight: 500 }}>{t.inflow}</div>
            </div>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {t.volume}
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 20, color: c.textHi, marginTop: 4, fontWeight: 500 }}>+18%</div>
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
                  <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{z.l}</div>
                  <div style={{ fontFamily: font(lang), fontSize: 22, color: z.col, marginTop: 2, fontWeight: 500 }}>{fmt(z.v, 2, lang)}</div>
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
              fontFamily: font(lang), fontSize: 24, fontWeight: 400, color: c.textHi,
              lineHeight: 1.6, margin: "16px 0 0", letterSpacing: "-0.005em",
            }}>
              {isAr ? stock.analysisAr : stock.analysis}
            </p>
            <div style={{
              marginTop: 20, display: "flex", gap: 24, flexWrap: "wrap",
              fontFamily: fontMono, fontSize: 11,
              color: c.muted, letterSpacing: "0.1em",
            }}>
              <span>{t.confidenceHigh}</span>
              <span>{t.horizon}</span>
              <span>{t.updated} · {timeAgo(stock.updatedAt, lang)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Live News from TradingView */}
      <TradingViewNews symbol={stock.sym} />
    </div>
  );
};

const MarketPage = ({ market, stocks, goToStock }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";

  // Outlook config: icon, color, label
  const outlookConfig = (outlook) => {
    switch (outlook) {
      case "bullish":
        return { color: c.green, icon: "▲", label: t.bullishExpected, bg: c.green + "15" };
      case "bearish":
        return { color: c.red, icon: "▼", label: t.bearishExpected, bg: c.red + "15" };
      case "sideways":
        return { color: c.amber, icon: "→", label: t.sidewaysExpected, bg: c.amber + "15" };
      default:
        return { color: c.muted, icon: "·", label: t.notSet, bg: c.surface2 };
    }
  };

  const confidenceLabel = (conf) => {
    if (conf === "high") return t.high;
    if (conf === "low") return t.low;
    return t.medium;
  };

  const horizonLabel = (h) => {
    if (h === "1W") return t.horizon1W;
    if (h === "3M") return t.horizon3M;
    return t.horizon1M;
  };

  // Count outlooks for summary
  const summary = useMemo(() => {
    const total = stocks.length;
    const bull = stocks.filter((s) => s.outlook === "bullish").length;
    const bear = stocks.filter((s) => s.outlook === "bearish").length;
    const side = stocks.filter((s) => s.outlook === "sideways").length;
    const pending = total - bull - bear - side;
    return { total, bull, bear, side, pending };
  }, [stocks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero — TASI overview */}
      <Card style={{ padding: 40 }}>
        <SectionLabel accent>{t.marketOverview}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 32, marginTop: 24, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              {t.tasiLevel}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontFamily: font(lang), fontSize: 56, fontWeight: 500, color: c.textHi, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {market.tasiValue ? fmt(market.tasiValue, 2, lang) : "—"}
              </div>
              {market.tasiValue > 0 && (
                <div style={{ color: market.tasiChange >= 0 ? c.green : c.red, fontFamily: fontMono, fontSize: 14 }}>
                  {market.tasiChange >= 0 ? "▲" : "▼"} {pct(market.tasiChangePct || 0, lang)}
                </div>
              )}
            </div>
          </div>

          {/* Summary pills */}
          <div style={{ padding: 16, background: c.green + "12", border: `1px solid ${c.green}30`, borderRadius: 2, textAlign: "center" }}>
            <div style={{ fontFamily: fontMono, fontSize: 9, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {t.bullishExpected}
            </div>
            <div style={{ fontFamily: font(lang), fontSize: 32, color: c.green, fontWeight: 500, marginTop: 6 }}>
              {summary.bull}
            </div>
          </div>
          <div style={{ padding: 16, background: c.amber + "12", border: `1px solid ${c.amber}30`, borderRadius: 2, textAlign: "center" }}>
            <div style={{ fontFamily: fontMono, fontSize: 9, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {t.sidewaysExpected}
            </div>
            <div style={{ fontFamily: font(lang), fontSize: 32, color: c.amber, fontWeight: 500, marginTop: 6 }}>
              {summary.side}
            </div>
          </div>
          <div style={{ padding: 16, background: c.red + "12", border: `1px solid ${c.red}30`, borderRadius: 2, textAlign: "center" }}>
            <div style={{ fontFamily: fontMono, fontSize: 9, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {t.bearishExpected}
            </div>
            <div style={{ fontFamily: font(lang), fontSize: 32, color: c.red, fontWeight: 500, marginTop: 6 }}>
              {summary.bear}
            </div>
          </div>
        </div>
      </Card>

      {/* Watchlist Table — All 10 stocks */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          flexWrap: "wrap", gap: 8,
        }}>
          <h3 style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {t.watchlist.split(" ")[0]} <span style={{ fontStyle: "italic", color: c.gold }}>
              {t.watchlist.split(" ").slice(1).join(" ")}
            </span>
          </h3>
          <Pill color={c.gold}>{stocks.length} {isAr ? "سهم" : "stocks"}</Pill>
        </div>

        {/* Table header */}
        <div style={{
          padding: "14px 28px", background: c.surface2,
          display: "grid",
          gridTemplateColumns: "70px 1.4fr 1fr 140px 2.2fr 80px 80px",
          gap: 16, alignItems: "center",
          fontFamily: fontMono, fontSize: 10, color: c.muted,
          letterSpacing: "0.12em", textTransform: "uppercase",
          borderBottom: `1px solid ${c.border}`,
        }}>
          <div>{t.colTicker}</div>
          <div>{t.colCompany}</div>
          <div>{t.colSector}</div>
          <div>{t.colOutlook}</div>
          <div>{t.colScenario}</div>
          <div style={{ textAlign: "center" }}>{t.colConf}</div>
          <div style={{ textAlign: "center" }}>{t.colHorizon}</div>
        </div>

        {/* Stock rows */}
        {stocks.map((s, i) => {
          const o = outlookConfig(s.outlook);
          const scenario = isAr ? s.scenarioAr : s.scenario;
          return (
            <div key={s.id} onClick={() => goToStock && s.published && goToStock(s.id)} style={{
              padding: "18px 28px",
              borderBottom: i === stocks.length - 1 ? "none" : `1px solid ${c.border}`,
              display: "grid",
              gridTemplateColumns: "70px 1.4fr 1fr 140px 2.2fr 80px 80px",
              gap: 16, alignItems: "center",
              cursor: s.published ? "pointer" : "default",
              opacity: s.published ? 1 : 0.6,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { if (s.published) e.currentTarget.style.background = c.surface2; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {/* Ticker */}
              <div style={{ fontFamily: fontMono, fontSize: 13, color: c.muted, letterSpacing: "0.05em" }}>
                {s.sym}
              </div>

              {/* Company name */}
              <div style={{ fontFamily: font(lang), fontSize: 16, color: c.textHi, fontWeight: 500 }}>
                {isAr ? s.nameAr : s.name}
              </div>

              {/* Sector */}
              <div style={{ fontFamily: font(lang), fontSize: 13, color: c.muted }}>
                {isAr ? s.sectorAr : s.sector}
              </div>

              {/* Outlook pill */}
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 12px", background: o.bg,
                  border: `1px solid ${o.color}40`, borderRadius: 2,
                }}>
                  <span style={{
                    fontFamily: fontMono, fontSize: 16, color: o.color,
                    lineHeight: 1, fontWeight: 600,
                  }}>{o.icon}</span>
                  <span style={{
                    fontFamily: font(lang), fontSize: 13, color: o.color,
                    fontWeight: 500,
                  }}>{o.label}</span>
                </div>
              </div>

              {/* Scenario */}
              <div style={{
                fontFamily: font(lang), fontSize: 14, color: scenario ? c.text : c.muted,
                fontStyle: scenario ? "italic" : "normal",
                lineHeight: 1.5,
              }}>
                {scenario || t.noScenario}
              </div>

              {/* Confidence */}
              <div style={{ textAlign: "center" }}>
                {s.outlook ? (
                  <Pill color={
                    s.confidence === "high" ? c.green :
                    s.confidence === "low" ? c.red : c.amber
                  }>
                    {confidenceLabel(s.confidence)}
                  </Pill>
                ) : (
                  <span style={{ color: c.muted, fontFamily: fontMono, fontSize: 11 }}>—</span>
                )}
              </div>

              {/* Horizon */}
              <div style={{ textAlign: "center", fontFamily: fontMono, fontSize: 11, color: s.outlook ? c.gold : c.muted, letterSpacing: "0.1em" }}>
                {s.outlook ? horizonLabel(s.horizon) : "—"}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Legend / explanation */}
      <Card style={{ padding: 24, background: c.surface2 }}>
        <div style={{ fontFamily: font(lang), fontSize: 14, color: c.text, lineHeight: 1.7 }}>
          {isAr ? (
            <>
              <strong style={{ color: c.gold }}>كيف تقرأ هذه الصفحة:</strong> هذه نظرة سريعة على توقعاتي للأسهم القيادية العشرة في تاسي.
              <span style={{ color: c.green }}> ▲ صعود متوقع</span> ·
              <span style={{ color: c.amber }}> → جانبي</span> ·
              <span style={{ color: c.red }}> ▼ هبوط متوقع</span>.
              للتفاصيل الكاملة (التحليل، الصور، الأخبار)، اضغط على أي سهم منشور.
            </>
          ) : (
            <>
              <strong style={{ color: c.gold }}>How to read this page:</strong> A quick view of my outlook on the 10 leading TASI stocks.
              <span style={{ color: c.green }}> ▲ Bullish</span> ·
              <span style={{ color: c.amber }}> → Sideways</span> ·
              <span style={{ color: c.red }}> ▼ Bearish</span>.
              For full details (analysis, charts, news), click any published stock.
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

/* ── Trade Form (modal) ────────────────────────────────────────── */

const TradeForm = ({ trade, onSave, onCancel, onClose, isClose }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [form, setForm] = useState(trade || {
    id: "t" + Date.now(),
    sym: "", name: "",
    qty: 0, entry: 0, current: 0, tp: 0, sl: 0,
    note: "",
    status: "open",
    closePrice: 0,
    openedAt: Date.now(),
  });

  const submit = () => {
    if (!form.sym || !form.qty || !form.entry) {
      alert(isAr ? "الرجاء تعبئة الحقول الأساسية (الرمز، الكمية، سعر الدخول)" : "Please fill required fields (symbol, qty, entry)");
      return;
    }
    onSave({ ...form, qty: parseFloat(form.qty) || 0, entry: parseFloat(form.entry) || 0,
             current: parseFloat(form.current) || parseFloat(form.entry) || 0,
             tp: parseFloat(form.tp) || 0, sl: parseFloat(form.sl) || 0 });
  };

  const submitClose = () => {
    const closePrice = parseFloat(form.closePrice) || parseFloat(form.current) || 0;
    if (!closePrice) {
      alert(isAr ? "الرجاء إدخال سعر الإغلاق" : "Please enter close price");
      return;
    }
    onClose({ ...trade, status: "closed", closePrice, closedAt: Date.now() });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      zIndex: 100, padding: 24, overflowY: "auto",
    }} onClick={onCancel}>
      <Card style={{ padding: 32, maxWidth: 560, width: "100%", marginTop: 40 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {isClose ? t.closeDialog : (trade ? t.editTrade : t.addTrade)}
          </h2>
          <button onClick={onCancel} style={{
            background: "transparent", border: "none", color: c.muted,
            cursor: "pointer", padding: 4, display: "flex",
          }}><X size={20} /></button>
        </div>

        {isClose ? (
          <>
            <div style={{
              padding: 14, background: c.surface2, marginBottom: 20, borderRadius: 2,
              fontFamily: font(lang), fontSize: 14, color: c.text,
            }}>
              <strong>{trade.sym}</strong> · {trade.name} — {trade.qty} {isAr ? "سهم @" : "shares @"} {fmt(trade.entry, 2, lang)}
            </div>
            <Input label={t.formClosePrice} value={form.closePrice || form.current} onChange={(v) => setForm({ ...form, closePrice: v })} type="number" />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button variant="ghost" onClick={onCancel}>{t.cancel}</Button>
              <Button onClick={submitClose} icon={Save}>{t.closeTrade}</Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label={t.formSym} value={form.sym} onChange={(v) => setForm({ ...form, sym: v })} placeholder="2222" />
              <Input label={t.formName} value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder={isAr ? "أرامكو" : "Aramco"} />
              <Input label={t.formQty} value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} type="number" />
              <Input label={t.formEntry} value={form.entry} onChange={(v) => setForm({ ...form, entry: v })} type="number" />
              <Input label={t.formCurrent} value={form.current} onChange={(v) => setForm({ ...form, current: v })} type="number" />
              <div />
              <Input label={t.formTp} value={form.tp} onChange={(v) => setForm({ ...form, tp: v })} type="number" />
              <Input label={t.formSl} value={form.sl} onChange={(v) => setForm({ ...form, sl: v })} type="number" />
            </div>
            <Input label={t.formNote} value={form.note} onChange={(v) => setForm({ ...form, note: v })} textarea rows={2}
              placeholder={isAr ? "مثال: دخول على الموجة الثالثة بعد تأكيد الحجم" : "e.g., Wave 3 entry on volume confirmation"} />

            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={onCancel}>{t.cancel}</Button>
              <Button onClick={submit} icon={Save}>{t.save}</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

const PortfolioPage = ({ currentUser }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";

  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [closing, setClosing] = useState(null);
  const [filter, setFilter] = useState("open"); // open | closed | all

  // Load trades from Supabase on mount
  useEffect(() => {
    (async () => {
      const list = await db_listTrades(currentUser.id);
      setTrades(list);
      setLoaded(true);
    })();
  }, [currentUser.id]);

  const handleSave = async (trade) => {
    // Ensure trade has user_id and an id
    const toSave = {
      ...trade,
      id: trade.id || ("t" + Date.now() + Math.random().toString(36).slice(2, 7)),
      userId: currentUser.id,
      status: trade.status || "open",
      openedAt: trade.openedAt || Date.now(),
    };
    await db_saveTrade(toSave);
    const fresh = await db_listTrades(currentUser.id);
    setTrades(fresh);
    setShowForm(false);
    setEditing(null);
  };

  const handleClose = async (trade) => {
    const toSave = { ...trade, status: "closed", closedAt: Date.now(), userId: currentUser.id };
    await db_saveTrade(toSave);
    const fresh = await db_listTrades(currentUser.id);
    setTrades(fresh);
    setClosing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDeleteTrade)) return;
    await db_deleteTrade(id);
    const fresh = await db_listTrades(currentUser.id);
    setTrades(fresh);
  };

  const handleReopen = async (trade) => {
    const toSave = { ...trade, status: "open", closePrice: 0, closedAt: null, userId: currentUser.id };
    await db_saveTrade(toSave);
    const fresh = await db_listTrades(currentUser.id);
    setTrades(fresh);
  };

  const openTrades = trades.filter((tr) => tr.status === "open");
  const closedTrades = trades.filter((tr) => tr.status === "closed");
  const displayed = filter === "open" ? openTrades : filter === "closed" ? closedTrades : trades;

  // Stats
  const stats = useMemo(() => {
    let invested = 0, currentVal = 0;
    openTrades.forEach((tr) => {
      invested += tr.entry * tr.qty;
      currentVal += tr.current * tr.qty;
    });
    const openPL = currentVal - invested;
    const openPLPct = invested ? (openPL / invested) * 100 : 0;

    let closedPL = 0, winners = 0, losers = 0;
    closedTrades.forEach((tr) => {
      const tradePL = (tr.closePrice - tr.entry) * tr.qty;
      closedPL += tradePL;
      if (tradePL > 0) winners++;
      else if (tradePL < 0) losers++;
    });
    return { invested, currentVal, openPL, openPLPct, closedPL, winners, losers };
  }, [trades]);

  const winRate = stats.winners + stats.losers > 0
    ? (stats.winners / (stats.winners + stats.losers)) * 100
    : 0;

  // Discipline breakdown (computed from real closed trades)
  const discipline = useMemo(() => {
    if (closedTrades.length === 0) return null;

    // 1. Plan Followed: did the trade have TP and SL set at all? (planning %)
    const withPlan = closedTrades.filter((tr) => tr.tp > 0 && tr.sl > 0).length;
    const planFollowed = (withPlan / closedTrades.length) * 100;

    // 2. SL Respected: of losing trades, how many closed at-or-better-than the SL?
    const losingTrades = closedTrades.filter((tr) => {
      const pl = (tr.closePrice - tr.entry) * tr.qty;
      return pl < 0 && tr.sl > 0;
    });
    const slRespected = losingTrades.length === 0
      ? 100
      : (losingTrades.filter((tr) => {
          // If trade went long: closing >= SL means SL was respected (didn't go below)
          // If trade went short: closing <= SL means SL was respected (didn't go above)
          // We assume long trades for now (entry < SL means short, but in user model usually long)
          return tr.closePrice >= tr.sl;
        }).length / losingTrades.length) * 100;

    // 3. TP Hit Rate: of winning trades, how many hit/exceeded TP?
    const winTrades = closedTrades.filter((tr) => {
      const pl = (tr.closePrice - tr.entry) * tr.qty;
      return pl > 0 && tr.tp > 0;
    });
    const tpHit = winTrades.length === 0
      ? 0
      : (winTrades.filter((tr) => tr.closePrice >= tr.tp).length / winTrades.length) * 100;

    // Overall = weighted average
    const overall = (planFollowed * 0.4 + slRespected * 0.4 + tpHit * 0.2);

    return {
      overall,
      breakdown: [
        { label: t.disciplinePlanFollowed, value: planFollowed },
        { label: t.disciplineSLRespected, value: slRespected },
        { label: t.disciplineTPHit, value: tpHit },
      ],
    };
  }, [closedTrades, t]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {showForm && (
        <TradeForm trade={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
      {closing && (
        <TradeForm trade={closing} isClose onClose={handleClose} onCancel={() => setClosing(null)} />
      )}

      <Card style={{ padding: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <SectionLabel accent>{t.portfolio}</SectionLabel>
          <Button onClick={() => { setEditing(null); setShowForm(true); }} icon={Plus}>{t.addTrade}</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginTop: 24 }}>
          <Stat label={t.invested} value={fmt(stats.invested, 0, lang)} sub={`SAR · ${openTrades.length} ${isAr ? "مفتوحة" : "open"}`} />
          <Stat label={t.currentValue} value={fmt(stats.currentVal, 0, lang)} sub="SAR" accent={c.textHi} />
          <Stat label={t.openPL} value={`${stats.openPL >= 0 ? "+" : ""}${fmt(stats.openPL, 0, lang)}`}
            sub={stats.invested ? pct(stats.openPLPct, lang) : "—"}
            accent={stats.openPL >= 0 ? c.green : c.red} />
          <Stat label={t.closedPL} value={`${stats.closedPL >= 0 ? "+" : ""}${fmt(stats.closedPL, 0, lang)}`}
            sub={`${stats.winners}W · ${stats.losers}L`}
            accent={stats.closedPL >= 0 ? c.green : c.red} />
        </div>
      </Card>

      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {isAr ? "صفقاتي" : "My Trades"}
          </h3>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { k: "open", l: `${t.openTrades} · ${openTrades.length}` },
              { k: "closed", l: `${t.closedTrades} · ${closedTrades.length}` },
              { k: "all", l: isAr ? `الكل · ${trades.length}` : `All · ${trades.length}` },
            ].map((f) => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{
                padding: "7px 14px",
                background: filter === f.k ? c.gold + "20" : "transparent",
                color: filter === f.k ? c.gold : c.muted,
                border: `1px solid ${filter === f.k ? c.gold + "70" : c.border}`,
                fontFamily: font(lang), fontSize: 13, fontWeight: 500,
                cursor: "pointer", borderRadius: 2,
              }}>{f.l}</button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div style={{
            padding: 60, textAlign: "center", color: c.muted,
            fontFamily: font(lang), fontStyle: "italic", fontSize: 16,
            background: c.surface2, borderRadius: 2,
          }}>
            {t.noTrades}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {displayed.map((tr, i) => {
              const isOpen = tr.status === "open";
              const exitPrice = isOpen ? tr.current : tr.closePrice;
              const pl = (exitPrice - tr.entry) * tr.qty;
              const plP = tr.entry ? ((exitPrice - tr.entry) / tr.entry) * 100 : 0;
              const up = pl >= 0;
              return (
                <div key={tr.id} style={{
                  padding: "18px 0", borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16, alignItems: "center",
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1.4fr 0.7fr 0.9fr 0.9fr 1fr 0.9fr",
                    gap: 12, alignItems: "center",
                  }}>
                    <div style={{ fontFamily: fontMono, fontSize: 12, color: c.muted }}>{tr.sym}</div>
                    <div>
                      <div style={{ fontFamily: font(lang), fontSize: 16, color: c.textHi, fontWeight: 500 }}>
                        {tr.name || tr.sym}
                      </div>
                      {tr.note && (
                        <div style={{ fontFamily: font(lang), fontSize: 12, color: c.muted, fontStyle: "italic", marginTop: 2, lineHeight: 1.4 }}>
                          {tr.note}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: 13, color: c.text }}>{fmt(tr.qty, 0, lang)}</div>
                    <div style={{ fontFamily: fontMono, fontSize: 13, color: c.text }}>{fmt(tr.entry, 2, lang)}</div>
                    <div style={{ fontFamily: fontMono, fontSize: 13, color: c.textHi }}>
                      {fmt(exitPrice, 2, lang)}
                      {!isOpen && <div style={{ fontSize: 9, color: c.muted, marginTop: 2 }}>{isAr ? "إغلاق" : "close"}</div>}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: 11, color: c.muted }}>
                      {tr.tp > 0 && <span style={{ color: c.green }}>TP {fmt(tr.tp, 2, lang)}</span>}
                      {tr.tp > 0 && tr.sl > 0 && <span> · </span>}
                      {tr.sl > 0 && <span style={{ color: c.red }}>SL {fmt(tr.sl, 2, lang)}</span>}
                    </div>
                    <div style={{ textAlign: isAr ? "left" : "right" }}>
                      <div style={{ fontFamily: fontMono, fontSize: 14, color: up ? c.green : c.red, fontWeight: 500 }}>
                        {up ? "+" : ""}{fmt(pl, 0, lang)}
                      </div>
                      <div style={{ fontFamily: fontMono, fontSize: 11, color: up ? c.green : c.red, opacity: 0.8 }}>
                        {pct(plP, lang)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Pill color={isOpen ? c.green : c.muted}>{isOpen ? t.open : t.closed}</Pill>
                    {isOpen ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(tr); setShowForm(true); }} icon={Edit3}>{t.edit}</Button>
                        <Button variant="secondary" size="sm" onClick={() => setClosing(tr)}>{t.closeTrade}</Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleReopen(tr)}>{t.reopenTrade}</Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(tr.id)} icon={Trash2}></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Discipline + Win rate (only show when there are closed trades) */}
      <div style={{ display: "grid", gridTemplateColumns: discipline ? "1.3fr 1fr" : "1fr", gap: 24 }}>
        <Card style={{ padding: 32 }}>
          <SectionLabel accent>{t.disciplineScore}</SectionLabel>
          {discipline ? (
            <div style={{ marginTop: 24 }}>
              <DisciplineRing score={discipline.overall} breakdown={discipline.breakdown} />
            </div>
          ) : (
            <div style={{
              marginTop: 24, padding: "40px 20px", textAlign: "center",
              background: c.surface2, borderRadius: 2,
              fontFamily: font(lang), fontSize: 15, color: c.muted,
              fontStyle: "italic", lineHeight: 1.6,
            }}>
              {t.disciplineEmptyMsg}
            </div>
          )}
        </Card>

        {discipline && (
          <Card style={{ padding: 32 }}>
            <SectionLabel accent>{t.winRate}</SectionLabel>
            <div style={{ marginTop: 24 }}>
              {/* Big win rate display */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  fontFamily: font(lang), fontSize: 88, fontWeight: 500,
                  color: winRate >= 50 ? c.green : c.amber,
                  lineHeight: 1, letterSpacing: "-0.03em",
                }}>
                  {Math.round(winRate)}<span style={{ fontSize: 36, opacity: 0.7 }}>%</span>
                </div>
                <div style={{
                  fontFamily: fontMono, fontSize: 10, color: c.muted,
                  letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8,
                }}>
                  {stats.winners + stats.losers} {isAr ? "صفقة مغلقة" : "closed trades"}
                </div>
              </div>

              {/* W/L split bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: c.border }}>
                  {stats.winners + stats.losers > 0 && (
                    <>
                      <div style={{
                        width: `${(stats.winners / (stats.winners + stats.losers)) * 100}%`,
                        background: c.green,
                      }} />
                      <div style={{
                        width: `${(stats.losers / (stats.winners + stats.losers)) * 100}%`,
                        background: c.red,
                      }} />
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{
                  padding: 16, background: c.surface2, borderRadius: 2,
                  borderLeft: !isAr ? `3px solid ${c.green}` : "none",
                  borderRight: isAr ? `3px solid ${c.green}` : "none",
                }}>
                  <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {t.profitableTrades}
                  </div>
                  <div style={{ fontFamily: font(lang), fontSize: 32, color: c.green, marginTop: 6, fontWeight: 500 }}>
                    {stats.winners}
                  </div>
                </div>
                <div style={{
                  padding: 16, background: c.surface2, borderRadius: 2,
                  borderLeft: !isAr ? `3px solid ${c.red}` : "none",
                  borderRight: isAr ? `3px solid ${c.red}` : "none",
                }}>
                  <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {t.losingTrades}
                  </div>
                  <div style={{ fontFamily: font(lang), fontSize: 32, color: c.red, marginTop: 6, fontWeight: 500 }}>
                    {stats.losers}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

/* ── Journal Entry Form (modal) ────────────────────────────────── */

const EntryForm = ({ entry, onSave, onCancel }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState(entry || {
    id: "e" + Date.now(),
    date: today,
    sym: "",
    outcome: "win",
    reasoning: "",
    emotion: "",
    lesson: "",
  });

  const submit = () => {
    if (!form.sym || !form.reasoning) {
      alert(isAr ? "الرجاء تعبئة الرمز والسبب على الأقل" : "Please fill at least symbol and reasoning");
      return;
    }
    onSave(form);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      zIndex: 100, padding: 24, overflowY: "auto",
    }} onClick={onCancel}>
      <Card style={{ padding: 32, maxWidth: 600, width: "100%", marginTop: 40 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {entry ? t.editEntry : t.addEntry}
          </h2>
          <button onClick={onCancel} style={{
            background: "transparent", border: "none", color: c.muted,
            cursor: "pointer", padding: 4, display: "flex",
          }}><X size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label={t.formEntryDate} value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" />
          <Input label={t.formEntrySym} value={form.sym} onChange={(v) => setForm({ ...form, sym: v })} placeholder={isAr ? "٢٢٢٢ أرامكو" : "2222 Aramco"} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: fontMono, fontSize: 10, color: c.muted,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
          }}>{t.formOutcome}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { v: "win", l: t.win, col: c.green },
              { v: "loss", l: t.loss, col: c.red },
            ].map((o) => (
              <button key={o.v} onClick={() => setForm({ ...form, outcome: o.v })} style={{
                flex: 1, padding: "12px",
                background: form.outcome === o.v ? o.col + "25" : "transparent",
                color: form.outcome === o.v ? o.col : c.muted,
                border: `1px solid ${form.outcome === o.v ? o.col : c.border}`,
                fontFamily: font(lang), fontSize: 15, fontWeight: 500,
                cursor: "pointer", borderRadius: 2,
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        <Input label={t.formReasoning} value={form.reasoning} onChange={(v) => setForm({ ...form, reasoning: v })} textarea rows={3} />
        <Input label={t.formEmotion} value={form.emotion} onChange={(v) => setForm({ ...form, emotion: v })} textarea rows={2} />
        <Input label={t.formLesson} value={form.lesson} onChange={(v) => setForm({ ...form, lesson: v })} textarea rows={2} />

        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onCancel}>{t.cancel}</Button>
          <Button onClick={submit} icon={Save}>{t.save}</Button>
        </div>
      </Card>
    </div>
  );
};

const JournalPage = ({ currentUser }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";

  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Load on mount
  useEffect(() => {
    (async () => {
      const list = await db_listJournalEntries(currentUser.id);
      setEntries(list);
      setLoaded(true);
    })();
  }, [currentUser.id]);

  const handleSave = async (entry) => {
    const toSave = {
      ...entry,
      id: entry.id || ("j" + Date.now() + Math.random().toString(36).slice(2, 7)),
      userId: currentUser.id,
    };
    await db_saveJournalEntry(toSave);
    const fresh = await db_listJournalEntries(currentUser.id);
    setEntries(fresh);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDeleteEntry)) return;
    await db_deleteJournalEntry(id);
    const fresh = await db_listJournalEntries(currentUser.id);
    setEntries(fresh);
  };

  // Stats
  const stats = useMemo(() => {
    const total = entries.length;
    const wins = entries.filter((e) => e.outcome === "win").length;
    const losses = entries.filter((e) => e.outcome === "loss").length;
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

    // This month count
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const thisMonth = entries.filter((e) => (e.date || "").startsWith(monthStr)).length;

    return { total, wins, losses, winRate, thisMonth };
  }, [entries]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {showForm && (
        <EntryForm entry={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <Card style={{ padding: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <SectionLabel accent>{t.journalTitle}</SectionLabel>
          <Button onClick={() => { setEditing(null); setShowForm(true); }} icon={Plus}>{t.addEntry}</Button>
        </div>
        <h1 style={{ fontFamily: font(lang), fontSize: 52, fontWeight: 500, color: c.textHi, margin: "16px 0 0", letterSpacing: "-0.02em" }}>
          {t.everyTradeLesson[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.everyTradeLesson[1]}</span>{t.everyTradeLesson[2]}
        </h1>
        <p style={{ fontFamily: font(lang), fontSize: 20, color: c.muted, marginTop: 12, fontStyle: "italic", fontWeight: 400 }}>
          {t.journalSub}
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <Stat label={t.thisMonth} value={fmt(stats.thisMonth, 0, lang)} sub={t.tradesLogged} />
        </Card>
        <Card style={{ padding: 24 }}>
          <Stat label={t.winRate} value={stats.total === 0 ? "—" : `${Math.round(stats.winRate)}%`}
            sub={`${stats.wins} ${t.win} · ${stats.losses} ${t.loss}`}
            accent={stats.winRate >= 50 ? c.green : c.amber} />
        </Card>
        <Card style={{ padding: 24 }}>
          <Stat label={isAr ? "إجمالي المدخلات" : "Total Entries"} value={fmt(stats.total, 0, lang)}
            sub={isAr ? "منذ البداية" : "since inception"} accent={c.gold} />
        </Card>
      </div>

      <Card style={{ padding: 28 }}>
        <h3 style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, margin: "0 0 24px", fontWeight: 500 }}>
          {t.recentEntries.split(" ")[0]} <span style={{ fontStyle: "italic", color: c.gold }}>{t.recentEntries.split(" ").slice(1).join(" ")}</span>
        </h3>

        {entries.length === 0 ? (
          <div style={{
            padding: 60, textAlign: "center", color: c.muted,
            fontFamily: font(lang), fontStyle: "italic", fontSize: 16,
            background: c.surface2, borderRadius: 2,
          }}>
            {t.noEntries}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {entries.map((e, i) => (
              <div key={e.id} style={{ padding: "24px 0", borderTop: i === 0 ? "none" : `1px solid ${c.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: font(lang), fontSize: 22, color: c.textHi, fontStyle: "italic" }}>{e.sym}</span>
                    <span style={{ fontFamily: fontMono, fontSize: 11, color: c.muted, letterSpacing: "0.1em" }}>{e.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill color={e.outcome === "win" ? c.green : c.red}>
                      {e.outcome === "win" ? t.win : t.loss}
                    </Pill>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(e); setShowForm(true); }} icon={Edit3}></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)} icon={Trash2}></Button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {[
                    { l: t.reasoning, v: e.reasoning, icon: Brain },
                    { l: t.emotion, v: e.emotion, icon: Eye },
                    { l: t.lesson, v: e.lesson, icon: Sparkles },
                  ].map((b) => (
                    <div key={b.l}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                        <b.icon size={11} /> {b.l}
                      </div>
                      <div style={{ fontFamily: font(lang), fontSize: 15, color: c.text, lineHeight: 1.7, fontStyle: b.l === t.lesson ? "italic" : "normal" }}>
                        {b.v || <span style={{ color: c.muted, fontStyle: "italic" }}>—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const WeeklyPage = ({ weekly }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const videoId = getYouTubeId(weekly.url);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card style={{ padding: 40 }}>
        <SectionLabel accent><Calendar size={11} /> {t.weeklyReview} · {isAr ? "الأسبوع" : "Week"} {weekly.week} · 2026</SectionLabel>
        <h1 style={{ fontFamily: font(lang), fontSize: 56, fontWeight: 500, color: c.textHi, margin: "16px 0 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {isAr ? weekly.titleAr : weekly.title}
        </h1>
        <p style={{ fontFamily: font(lang), fontSize: 22, color: c.text, marginTop: 16, fontWeight: 400, fontStyle: "italic", maxWidth: 700, lineHeight: 1.5 }}>
          {isAr ? weekly.descriptionAr : weekly.description}
        </p>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {videoId ? (
          <div style={{ aspectRatio: "16/9", width: "100%" }}>
            <iframe width="100%" height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0" allowFullScreen
              style={{ border: 0, display: "block" }} />
          </div>
        ) : (
          <div style={{
            aspectRatio: "16/9", background: `linear-gradient(135deg, ${c.surface2} 0%, ${c.ink} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%", border: `1.5px solid ${c.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                background: `${c.gold}15`,
              }}>
                <PlayCircle size={36} color={c.gold} strokeWidth={1} />
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 28, color: c.textHi, fontStyle: "italic" }}>
                {isAr ? "لم يُرفع الفيديو بعد" : "Video not yet uploaded"}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.chapters}</SectionLabel>
          {t.chaptersList.length === 0 ? (
            <div style={{ marginTop: 16, padding: 24, background: c.surface2, borderRadius: 2, textAlign: "center", fontFamily: font(lang), color: c.muted, fontStyle: "italic", fontSize: 14 }}>
              {t.noChapters}
            </div>
          ) : (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {t.chaptersList.map((ch, i) => (
                <div key={i} style={{ paddingBottom: 14, borderBottom: i === t.chaptersList.length - 1 ? "none" : `1px solid ${c.border}` }}>
                  <div style={{ fontFamily: font(lang), fontSize: 16, color: c.text }}>{ch}</div>
                </div>
              ))}
            </div>
          )}
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
                    <div style={{ fontFamily: font(lang), fontSize: 19, color: c.textHi, fontStyle: "italic" }}>
                      {isAr ? s.labelAr : s.label}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: 14, color: cols[i] }}>{s.prob}%</div>
                  </div>
                  <div style={{ fontFamily: font(lang), fontSize: 14, color: c.muted, marginTop: 6, lineHeight: 1.6 }}>
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
        {t.archiveItems.length === 0 ? (
          <div style={{ marginTop: 16, padding: 24, background: c.surface2, borderRadius: 2, textAlign: "center", fontFamily: font(lang), color: c.muted, fontStyle: "italic", fontSize: 14 }}>
            {t.noArchive}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
            {t.archiveItems.map((a, i) => (
              <div key={i} style={{ padding: 16, background: c.surface2, cursor: "pointer", borderRadius: 2 }}>
                <PlayCircle size={20} color={c.goldDim} strokeWidth={1.2} />
                <div style={{ fontFamily: fontMono, fontSize: 10, color: c.gold, letterSpacing: "0.15em", marginTop: 12 }}>{a.w}</div>
                <div style={{ fontFamily: font(lang), fontSize: 17, color: c.textHi, marginTop: 4, fontStyle: "italic" }}>{a.t}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   ADMIN PANEL
   ────────────────────────────────────────────────────────────────── */

const AdminLogin = ({ onLogin }) => {
  const { c, t, lang } = useApp();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (pwd === ADMIN_PASSWORD) {
      ls.set("qarar:adminAuth", { time: Date.now() });
      onLogin();
    } else {
      setError(lang === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect password");
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
          <h2 style={{ fontFamily: font(lang), fontSize: 32, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {t.adminLogin}
          </h2>
        </div>
        <Input label={t.adminPasswordLabel} value={pwd} onChange={setPwd} type="password" />
        {error && (
          <div style={{ fontFamily: font(lang), fontSize: 13, color: c.red, marginBottom: 16 }}>{error}</div>
        )}
        <Button onClick={submit} icon={Shield} fullWidth>{t.signIn}</Button>
        <div style={{
          marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}`,
          fontFamily: fontMono, fontSize: 10, color: c.muted,
          textAlign: "center", letterSpacing: "0.1em",
        }}>
          Default password: qarar2026
        </div>
      </Card>
    </div>
  );
};

const AdminDashboard = ({ stocks, weekly, users, goto, siteForceOpen, setSiteForceOpen, waitlist }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const published = stocks.filter((s) => s.published).length;
  const launchTs = getLaunchDate();
  const launchReached = isLaunchTimeReached();
  const siteOpen = siteForceOpen || launchReached;

  // Compute days/hours remaining until launch
  const diff = Math.max(0, launchTs - Date.now());
  const daysLeft = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  const toggleSite = async () => {
    if (siteForceOpen) {
      if (window.confirm(isAr ? "إقفال الموقع للأعضاء؟" : "Lock the site for members again?")) {
        await db_setSiteForceOpen(false);
        setSiteForceOpen(false);
      }
    } else {
      if (window.confirm(t.openSiteConfirm)) {
        await db_setSiteForceOpen(true);
        setSiteForceOpen(true);
      }
    }
  };

  const launchDateStr = new Date(launchTs).toLocaleDateString(
    isAr ? "ar-SA" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <SectionLabel accent>{t.todayDate} · {new Date().toLocaleDateString(isAr ? "ar-SA" : "en-US")}</SectionLabel>
        <h1 style={{ fontFamily: font(lang), fontSize: 48, color: c.textHi, margin: "12px 0 0", fontWeight: 500, letterSpacing: "-0.02em" }}>
          {t.welcomeAdmin}
        </h1>
      </div>

      {/* LAUNCH CONTROL - prominent card */}
      <Card style={{
        padding: 28,
        background: `linear-gradient(135deg, ${c.surface} 0%, ${c.surface2} 100%)`,
        border: `1px solid ${siteOpen ? c.green : c.gold}40`,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <SectionLabel accent>
              {siteOpen ? "🟢" : "🔒"} {t.launchControl}
            </SectionLabel>
            <div style={{
              fontFamily: font(lang), fontSize: 28, color: c.textHi,
              marginTop: 12, fontWeight: 500,
            }}>
              {siteOpen ? t.siteOpen : t.siteLocked}
            </div>
            <div style={{
              fontFamily: font(lang), fontSize: 14, color: c.muted,
              marginTop: 6, fontStyle: "italic",
            }}>
              {siteOpen
                ? (siteForceOpen
                    ? (isAr ? "أنت فتحت الموقع يدوياً." : "You manually opened the site.")
                    : (isAr ? "العدّ التنازلي انتهى، الموقع مفتوح." : "Countdown ended, site is open."))
                : `${t.launchDate}: ${launchDateStr}`}
            </div>
          </div>
          <Button
            onClick={toggleSite}
            variant={siteForceOpen ? "danger" : "primary"}
            icon={siteForceOpen ? Shield : Sparkles}
          >
            {siteForceOpen ? t.lockSiteAgain : t.openSiteNow}
          </Button>
        </div>

        {!siteOpen && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20,
          }}>
            <div style={{ padding: 16, background: c.surface, borderRadius: 2 }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {isAr ? "أيام متبقية" : "Days left"}
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 32, color: c.gold, fontWeight: 500, marginTop: 4 }}>
                {daysLeft}
              </div>
            </div>
            <div style={{ padding: 16, background: c.surface, borderRadius: 2 }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {isAr ? "ساعات متبقية" : "Hours left"}
              </div>
              <div style={{ fontFamily: font(lang), fontSize: 32, color: c.gold, fontWeight: 500, marginTop: 4 }}>
                {hoursLeft}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <Stat label={t.seatsCount} value={`${users.length} / ${MAX_SEATS}`}
            sub={users.length >= MAX_SEATS ? t.seatsFull : `${MAX_SEATS - users.length} ${t.seatsLeft}`}
            accent={users.length >= MAX_SEATS ? c.red : c.gold} />
        </Card>
        <Card style={{ padding: 20 }}><Stat label={t.waitlistCount} value={waitlist.length} accent={c.blue} /></Card>
        <Card style={{ padding: 20 }}><Stat label={t.publishedAnalyses} value={published} accent={c.green} /></Card>
        <Card style={{ padding: 20 }}><Stat label={isAr ? "أسبوع الفيديو" : "Video Week"} value={weekly.week} accent={c.amber} /></Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{t.pendingTasks}</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {t.tasks.map((task, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, paddingBottom: 14,
                borderBottom: i === t.tasks.length - 1 ? "none" : `1px solid ${c.border}`,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${c.gold}`, flexShrink: 0 }} />
                <div style={{ fontFamily: font(lang), fontSize: 16, color: c.text }}>{task}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 28 }}>
          <SectionLabel accent>{isAr ? "إجراءات سريعة" : "Quick Actions"}</SectionLabel>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <Button icon={Plus} variant="secondary" onClick={() => goto("stocks")}>{t.addNew} {t.adminNav.stocks}</Button>
            <Button icon={Activity} variant="secondary" onClick={() => goto("market")}>{t.adminNav.market}</Button>
            <Button icon={Youtube} variant="secondary" onClick={() => goto("weekly")}>{t.adminNav.weekly}</Button>
            <Button icon={Users} variant="secondary" onClick={() => goto("users")}>{t.adminNav.users}</Button>
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
    outlook: "", scenario: "", scenarioAr: "",
    confidence: "medium", horizon: "1M",
    published: false,
    images: { daily: "", weekly: "", monthly: "" },
  };

  const startNew = () => { setEditing({ ...blank, id: "s" + Date.now() }); setShowForm(true); };
  const startEdit = (s) => {
    // Make sure all fields exist for older stocks
    const safe = {
      ...blank,
      ...s,
      images: s.images || { daily: "", weekly: "", monthly: "" },
    };
    setEditing(safe); setShowForm(true);
  };

  const save = async () => {
    const updated = { ...editing, updatedAt: Date.now() };
    await db_saveStock(updated);
    const fresh = await db_listStocks();
    setStocks(fresh);
    setShowForm(false); setEditing(null);
  };

  const remove = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    await db_deleteStock(id);
    const fresh = await db_listStocks();
    setStocks(fresh);
  };

  const togglePublish = async (id) => {
    const stock = stocks.find((s) => s.id === id);
    if (!stock) return;
    const updated = { ...stock, published: !stock.published, updatedAt: Date.now() };
    await db_saveStock(updated);
    const fresh = await db_listStocks();
    setStocks(fresh);
  };

  if (showForm && editing) {
    const updateImage = (key, value) => {
      setEditing({
        ...editing,
        images: { ...(editing.images || {}), [key]: value },
      });
    };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: font(lang), fontSize: 36, color: c.textHi, margin: 0, fontWeight: 500 }}>
            {stocks.find((s) => s.id === editing.id) ? t.edit : t.addNew}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" onClick={() => setShowForm(false)} icon={X}>{t.cancel}</Button>
            <Button onClick={save} icon={Save}>{t.save}</Button>
          </div>
        </div>

        <Card style={{ padding: 28 }}>
          <div style={{ background: c.gold + "12", border: `1px solid ${c.gold}40`, padding: 14, borderRadius: 2, marginBottom: 24 }}>
            <div style={{ fontFamily: font(lang), fontSize: 14, color: c.gold, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 10 }}>
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

          {/* Outlook section — NEW */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
            <SectionLabel accent><TrendingUp size={11} /> {t.outlook} & {t.scenario}</SectionLabel>

            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: fontMono, fontSize: 10, color: c.muted,
                letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
              }}>{t.outlook}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { v: "bullish", l: t.bullishExpected, c: c.green, icon: "▲" },
                  { v: "sideways", l: t.sidewaysExpected, c: c.amber, icon: "→" },
                  { v: "bearish", l: t.bearishExpected, c: c.red, icon: "▼" },
                  { v: "", l: t.notSet, c: c.muted, icon: "·" },
                ].map((o) => (
                  <button key={o.v || "none"} onClick={() => setEditing({ ...editing, outlook: o.v })} style={{
                    flex: 1, padding: "12px",
                    background: editing.outlook === o.v ? o.c + "25" : "transparent",
                    color: editing.outlook === o.v ? o.c : c.muted,
                    border: `1px solid ${editing.outlook === o.v ? o.c : c.border}`,
                    fontFamily: font(lang), fontSize: 14, fontWeight: 500,
                    cursor: "pointer", borderRadius: 2,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <span style={{ fontWeight: 700 }}>{o.icon}</span> {o.l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Input label={t.scenario + " (EN)"} value={editing.scenario} onChange={(v) => setEditing({ ...editing, scenario: v })}
                placeholder="e.g., Break above 28 opens path to 30" />
              <Input label={t.scenario + " (AR)"} value={editing.scenarioAr} onChange={(v) => setEditing({ ...editing, scenarioAr: v })}
                placeholder="مثال: كسر مقاومة ٢٨ يفتح المجال لـ ٣٠" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
              <div>
                <div style={{
                  fontFamily: fontMono, fontSize: 10, color: c.muted,
                  letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
                }}>{t.confidence}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { v: "high", l: t.high, c: c.green },
                    { v: "medium", l: t.medium, c: c.amber },
                    { v: "low", l: t.low, c: c.red },
                  ].map((cf) => (
                    <button key={cf.v} onClick={() => setEditing({ ...editing, confidence: cf.v })} style={{
                      flex: 1, padding: "8px",
                      background: editing.confidence === cf.v ? cf.c + "25" : "transparent",
                      color: editing.confidence === cf.v ? cf.c : c.muted,
                      border: `1px solid ${editing.confidence === cf.v ? cf.c : c.border}`,
                      fontFamily: font(lang), fontSize: 13, fontWeight: 500,
                      cursor: "pointer", borderRadius: 2,
                    }}>{cf.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: fontMono, fontSize: 10, color: c.muted,
                  letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6,
                }}>{t.horizon}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { v: "1W", l: t.horizon1W },
                    { v: "1M", l: t.horizon1M },
                    { v: "3M", l: t.horizon3M },
                  ].map((h) => (
                    <button key={h.v} onClick={() => setEditing({ ...editing, horizon: h.v })} style={{
                      flex: 1, padding: "8px",
                      background: editing.horizon === h.v ? c.gold + "25" : "transparent",
                      color: editing.horizon === h.v ? c.gold : c.muted,
                      border: `1px solid ${editing.horizon === h.v ? c.gold : c.border}`,
                      fontFamily: font(lang), fontSize: 13, fontWeight: 500,
                      cursor: "pointer", borderRadius: 2,
                    }}>{h.l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
            <SectionLabel accent>{isAr ? "التحليل الكامل" : "Full Analysis"}</SectionLabel>
          </div>
          <Input label={t.formAnalysis + " (EN)"} value={editing.analysis} onChange={(v) => setEditing({ ...editing, analysis: v })} textarea rows={4} placeholder="Structural reading..." />
          <Input label={t.formAnalysis + " (AR)"} value={editing.analysisAr} onChange={(v) => setEditing({ ...editing, analysisAr: v })} textarea rows={4} placeholder="القراءة الهيكلية..." />

          {/* NEW: Chart images uploader */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
            <SectionLabel accent><ImageIcon size={11} /> {t.chartImagesAdmin}</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
              <ImageUploader label={t.daily} value={editing.images?.daily} onChange={(v) => updateImage("daily", v)} />
              <ImageUploader label={t.weekly_tf} value={editing.images?.weekly} onChange={(v) => updateImage("weekly", v)} />
              <ImageUploader label={t.monthly} value={editing.images?.monthly} onChange={(v) => updateImage("monthly", v)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
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
        <h2 style={{ fontFamily: font(lang), fontSize: 36, color: c.textHi, margin: 0, fontWeight: 500 }}>
          {t.adminNav.stocks}
        </h2>
        <Button onClick={startNew} icon={Plus}>{t.addNew}</Button>
      </div>

      <Card style={{ padding: 0 }}>
        {stocks.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: c.muted, fontFamily: font(lang), fontStyle: "italic", fontSize: 18 }}>
            {t.noAnalyses}
          </div>
        )}
        {stocks.map((s, i) => {
          const imgCount = s.images
            ? [s.images.daily, s.images.weekly, s.images.monthly].filter(Boolean).length
            : 0;
          return (
            <div key={s.id} style={{
              padding: "20px 24px",
              borderTop: i === 0 ? "none" : `1px solid ${c.border}`,
              display: "grid",
              gridTemplateColumns: "60px 1fr 80px 70px 100px 130px auto",
              alignItems: "center", gap: 16,
            }}>
              <div style={{ fontFamily: fontMono, fontSize: 12, color: c.muted }}>{s.sym}</div>
              <div>
                <div style={{ fontFamily: font(lang), fontSize: 17, color: c.textHi, fontWeight: 500 }}>
                  {isAr ? s.nameAr : s.name}
                </div>
                <div style={{ fontFamily: font(lang), fontSize: 13, color: c.muted, marginTop: 2 }}>
                  {isAr ? s.waveAr : s.wave}
                </div>
              </div>
              <div style={{ fontFamily: fontMono, fontSize: 13, color: c.textHi }}>{(s.price || 0).toFixed(2)}</div>
              <Pill color={imgCount > 0 ? c.blue : c.muted}>
                <ImageIcon size={9} /> {imgCount}/3
              </Pill>
              <Pill color={s.published ? c.green : c.amber}>{s.published ? t.published : t.draft}</Pill>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted }}>{timeAgo(s.updatedAt, lang)}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(s.id)}>
                  {s.published ? <EyeOff size={12} /> : <Eye size={12} />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => startEdit(s)} icon={Edit3}>{t.edit}</Button>
                <Button variant="danger" size="sm" onClick={() => remove(s.id)} icon={Trash2}>{t.delete}</Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

const AdminMarket = ({ market, setMarket }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [local, setLocal] = useState(market);
  const [saved, setSaved] = useState(false);
  const save = async () => {
    const updated = { ...local, updatedAt: Date.now() };
    await db_saveMarket(updated);
    const fresh = await db_getMarket();
    setMarket(fresh);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: font(lang), fontSize: 36, color: c.textHi, margin: 0, fontWeight: 500 }}>{t.adminNav.market}</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <Pill color={c.green}><Sparkles size={10} /> {t.saved}</Pill>}
          <Button onClick={save} icon={Save}>{t.save}</Button>
        </div>
      </div>
      <Card style={{ padding: 28 }}>
        {/* TASI Index values */}
        <div style={{ marginBottom: 8 }}>
          <SectionLabel accent>{t.tasiLevel}</SectionLabel>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12 }}>
          <Input label={isAr ? "قيمة المؤشر" : "Index Value"} value={local.tasiValue || 0} onChange={(v) => setLocal({ ...local, tasiValue: parseFloat(v) || 0 })} type="number" />
          <Input label={isAr ? "التغير (نقاط)" : "Change (points)"} value={local.tasiChange || 0} onChange={(v) => setLocal({ ...local, tasiChange: parseFloat(v) || 0 })} type="number" />
          <Input label={isAr ? "التغير (٪)" : "Change (%)"} value={local.tasiChangePct || 0} onChange={(v) => setLocal({ ...local, tasiChangePct: parseFloat(v) || 0 })} type="number" />
        </div>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
          <SectionLabel accent>{t.marketView}</SectionLabel>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
          <div>
            <div style={{
              fontFamily: fontMono, fontSize: 10, color: c.muted,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
            }}>{t.marketDirection}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "bullish", l: t.bullish, c: c.green },
                { v: "sideways", l: t.sideways, c: c.amber },
                { v: "bearish", l: t.bearish, c: c.red },
              ].map((d) => (
                <button key={d.v} onClick={() => setLocal({ ...local, direction: d.v })} style={{
                  flex: 1, padding: "12px",
                  background: local.direction === d.v ? d.c + "25" : "transparent",
                  color: local.direction === d.v ? d.c : c.muted,
                  border: `1px solid ${local.direction === d.v ? d.c : c.border}`,
                  fontFamily: font(lang), fontSize: 15, fontWeight: 500,
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
          <Input label={isAr ? "كلمات بارزة (EN)" : "Highlights EN"} value={(local.quoteHighlight || []).join(", ")}
            onChange={(v) => setLocal({ ...local, quoteHighlight: v.split(",").map(x => x.trim()).filter(Boolean) })}
            placeholder="Energy, Banks" />
          <Input label={isAr ? "كلمات بارزة (AR)" : "Highlights AR"} value={(local.quoteHighlightAr || []).join(", ")}
            onChange={(v) => setLocal({ ...local, quoteHighlightAr: v.split(",").map(x => x.trim()).filter(Boolean) })}
            placeholder="الطاقة, البنوك" />
        </div>
      </Card>
    </div>
  );
};

const AdminWeekly = ({ weekly, setWeekly }) => {
  const { c, t, lang } = useApp();
  const [local, setLocal] = useState(weekly);
  const [saved, setSaved] = useState(false);
  const save = async () => {
    const updated = { ...local, updatedAt: Date.now() };
    await db_saveWeekly(updated);
    const fresh = await db_getWeekly();
    setWeekly(fresh);
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
        <h2 style={{ fontFamily: font(lang), fontSize: 36, color: c.textHi, margin: 0, fontWeight: 500 }}>{t.adminNav.weekly}</h2>
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

const AdminUsers = ({ users, waitlist, setWaitlist }) => {
  const { c, t, lang } = useApp();
  const isAr = lang === "ar";
  const [tab, setTab] = useState("members"); // members | waitlist

  // Sort users by seat number
  const sortedUsers = [...users].sort((a, b) => (a.seatNumber || 0) - (b.seatNumber || 0));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: font(lang), fontSize: 36, color: c.textHi, margin: 0, fontWeight: 500 }}>
          {tab === "members" ? t.registeredUsers : t.waitlistTab}
        </h2>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setTab("members")} style={{
            padding: "9px 16px",
            background: tab === "members" ? c.gold + "20" : "transparent",
            color: tab === "members" ? c.gold : c.muted,
            border: `1px solid ${tab === "members" ? c.gold + "70" : c.border}`,
            fontFamily: font(lang), fontSize: 13, fontWeight: 500,
            cursor: "pointer", borderRadius: 2,
          }}>
            👤 {t.registeredUsers} · {users.length}
          </button>
          <button onClick={() => setTab("waitlist")} style={{
            padding: "9px 16px",
            background: tab === "waitlist" ? c.gold + "20" : "transparent",
            color: tab === "waitlist" ? c.gold : c.muted,
            border: `1px solid ${tab === "waitlist" ? c.gold + "70" : c.border}`,
            fontFamily: font(lang), fontSize: 13, fontWeight: 500,
            cursor: "pointer", borderRadius: 2,
          }}>
            ⏳ {t.waitlistTab} · {waitlist?.length || 0}
          </button>
        </div>
      </div>

      {tab === "members" ? (
        <Card style={{ padding: 0 }}>
          {sortedUsers.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: c.muted, fontFamily: font(lang), fontStyle: "italic", fontSize: 18 }}>
              {t.noUsers}
            </div>
          ) : (
            <>
              <div style={{
                display: "grid", gridTemplateColumns: "80px 1.5fr 1.2fr 2fr 1fr",
                padding: "16px 24px", borderBottom: `1px solid ${c.border}`,
                fontFamily: fontMono, fontSize: 10, color: c.muted,
                letterSpacing: "0.1em", textTransform: "uppercase", gap: 16,
              }}>
                <div>{isAr ? "المقعد" : "Seat"}</div>
                <div>{t.fullName}</div>
                <div>{t.username}</div>
                <div>{t.email}</div>
                <div>{t.joined}</div>
              </div>
              {sortedUsers.map((u, i) => (
                <div key={u.id} style={{
                  display: "grid", gridTemplateColumns: "80px 1.5fr 1.2fr 2fr 1fr",
                  padding: "18px 24px",
                  borderBottom: i === sortedUsers.length - 1 ? "none" : `1px solid ${c.border}`,
                  alignItems: "center", gap: 16,
                }}>
                  <div style={{
                    fontFamily: font(lang), fontSize: 18, color: c.gold,
                    fontWeight: 600, letterSpacing: "-0.01em",
                  }}>
                    #{u.seatNumber || "—"}
                  </div>
                  <div style={{ fontFamily: font(lang), fontSize: 16, color: c.textHi, fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 13, color: c.gold }}>@{u.username}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 13, color: c.text }}>{u.email}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 11, color: c.muted }}>
                    {new Date(u.joinedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                  </div>
                </div>
              ))}
            </>
          )}
        </Card>
      ) : (
        <Card style={{ padding: 0 }}>
          {!waitlist || waitlist.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: c.muted, fontFamily: font(lang), fontStyle: "italic", fontSize: 18 }}>
              {isAr ? "لا أحد في قائمة الانتظار بعد." : "No one on the waitlist yet."}
            </div>
          ) : (
            <>
              <div style={{
                display: "grid", gridTemplateColumns: "60px 3fr 1fr 100px",
                padding: "16px 24px", borderBottom: `1px solid ${c.border}`,
                fontFamily: fontMono, fontSize: 10, color: c.muted,
                letterSpacing: "0.1em", textTransform: "uppercase", gap: 16,
              }}>
                <div>#</div>
                <div>{t.email}</div>
                <div>{t.joined}</div>
                <div></div>
              </div>
              {waitlist.map((w, i) => (
                <div key={w.id} style={{
                  display: "grid", gridTemplateColumns: "60px 3fr 1fr 100px",
                  padding: "16px 24px",
                  borderBottom: i === waitlist.length - 1 ? "none" : `1px solid ${c.border}`,
                  alignItems: "center", gap: 16,
                }}>
                  <div style={{ fontFamily: fontMono, fontSize: 13, color: c.muted }}>{i + 1}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 14, color: c.textHi }}>{w.email}</div>
                  <div style={{ fontFamily: fontMono, fontSize: 11, color: c.muted }}>
                    {new Date(w.joinedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                  </div>
                  <Button variant="danger" size="sm" icon={Trash2}
                    onClick={async () => {
                      if (window.confirm(isAr ? "حذف هذا البريد من القائمة؟" : "Remove this email from waitlist?")) {
                        await db_removeFromWaitlist(w.id);
                        const fresh = await db_listWaitlist();
                        setWaitlist(fresh);
                      }
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </Card>
      )}

      <div style={{
        marginTop: 24, padding: 16, background: c.surface2,
        borderRadius: 2, fontFamily: font(lang), fontSize: 13, color: c.muted, lineHeight: 1.6,
      }}>
        {isAr
          ? "ملاحظة: المستخدمون وقائمة الانتظار مخزّنون محلياً في متصفحك. لمشاركة الأعضاء بين كل الأجهزة لاحقاً، نحتاج Supabase."
          : "Note: Users and waitlist are stored locally in your browser. To share members across devices, we'll need Supabase later."}
      </div>
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

  // Admin
  const [mode, setMode] = useState("user");
  const [adminAuth, setAdminAuth] = useState(() => {
    const a = ls.get("qarar:adminAuth", null);
    return a && (Date.now() - a.time) < 1000 * 60 * 60 * 24 * 7;
  });
  const [adminPage, setAdminPage] = useState("dashboard");

  // ─── Cloud data (loaded from Supabase on mount) ───
  const [stocks, setStocks] = useState([]);
  const [market, setMarket] = useState({
    tasiValue: 0, tasiChange: 0, tasiChangePct: 0,
    direction: "sideways", strength: 50,
    quote: "", quoteAr: "",
    quoteHighlight: [], quoteHighlightAr: [],
    updatedAt: null,
  });
  const [weekly, setWeekly] = useState({
    week: 1, title: "", titleAr: "", url: "",
    description: "", descriptionAr: "", scenarios: [],
    updatedAt: null,
  });
  const [users, setUsers] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [siteForceOpen, setSiteForceOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Session-bound user from localStorage (auto-login)
  const [currentUser, setCurrentUser] = useState(null);
  const [justSignedUp, setJustSignedUp] = useState(false);

  // ─── Load everything from Supabase on first mount ───
  useEffect(() => {
    (async () => {
      try {
        // Parallel fetch for speed
        const [stocksData, marketData, weeklyData, usersData, waitlistData, settingsData] = await Promise.all([
          db_listStocks(),
          db_getMarket(),
          db_getWeekly(),
          db_listUsers(),
          db_listWaitlist(),
          db_getSettings(),
        ]);
        setStocks(stocksData);
        setMarket(marketData);
        setWeekly(weeklyData);
        setUsers(usersData);
        setWaitlist(waitlistData);
        setSiteForceOpen(settingsData.siteForceOpen);
        setLaunchDateCache(settingsData.launchDate);

        // Resume session if a userId was saved locally
        const session = ls.get("qarar:session", null);
        if (session?.userId) {
          const matched = usersData.find((u) => u.id === session.userId);
          if (matched) setCurrentUser(matched);
        }
      } catch (err) {
        console.error("Initial load failed:", err);
      } finally {
        setDataLoaded(true);
      }
    })();
  }, []);

  // Auto re-check launch time every minute so site can naturally unlock
  const [, setLaunchTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setLaunchTick((x) => x + 1), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const c = THEMES[theme];
  const t = STRINGS[lang];
  const isAr = lang === "ar";

  useEffect(() => { ls.set("qarar:theme", theme); }, [theme]);
  useEffect(() => { ls.set("qarar:lang", lang); }, [lang]);

  useEffect(() => {
    const checkRoute = () => {
      setMode(window.location.hash === "#admin" ? "admin" : "user");
    };
    checkRoute();
    window.addEventListener("hashchange", checkRoute);
    return () => window.removeEventListener("hashchange", checkRoute);
  }, []);

  const ctx = { c, t, lang, theme, setLang, setTheme };

  const goto = (p, stockId) => {
    setPage(p);
    if (stockId) setSelectedStockId(stockId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToAdmin = () => { window.location.hash = "admin"; };
  const goToSite = () => { window.location.hash = ""; };
  const adminLogout = () => {
    ls.set("qarar:adminAuth", null);
    setAdminAuth(false);
    goToSite();
  };
  const userLogout = () => {
    ls.set("qarar:session", null);
    setCurrentUser(null);
  };

  // ── Initial load: show splash while fetching from Supabase ──
  if (!dataLoaded) {
    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} />
        <div dir={t.dir} style={{
          minHeight: "100vh", background: c.ink, color: c.text,
          fontFamily: font(lang),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 24,
        }}>
          <Logo size={48} />
          <div style={{ fontFamily: fontNastaliq, fontSize: 36, color: c.gold }}>قَرار</div>
          <div style={{
            fontFamily: fontMono, fontSize: 11, color: c.muted,
            letterSpacing: "0.25em", textTransform: "uppercase",
          }}>
            Loading…
          </div>
          <div style={{
            width: 60, height: 2, background: c.border,
            borderRadius: 2, overflow: "hidden", marginTop: 12,
          }}>
            <div style={{
              width: "40%", height: "100%", background: c.gold,
              animation: "qararLoadBar 1.2s ease-in-out infinite",
            }} />
          </div>
          <style>{`
            @keyframes qararLoadBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(250%); }
            }
          `}</style>
        </div>
      </AppContext.Provider>
    );
  }

  // ── Admin mode (separate from user auth) ──
  if (mode === "admin") {
    if (!adminAuth) {
      return (
        <AppContext.Provider value={ctx}>
          <GlobalStyles c={c} />
          <AdminLogin onLogin={() => setAdminAuth(true)} />
        </AppContext.Provider>
      );
    }

    const renderAdminPage = () => {
      switch (adminPage) {
        case "dashboard": return <AdminDashboard stocks={stocks} weekly={weekly} users={users} goto={setAdminPage} siteForceOpen={siteForceOpen} setSiteForceOpen={setSiteForceOpen} waitlist={waitlist} />;
        case "stocks": return <AdminStocks stocks={stocks} setStocks={setStocks} />;
        case "market": return <AdminMarket market={market} setMarket={setMarket} />;
        case "weekly": return <AdminWeekly weekly={weekly} setWeekly={setWeekly} />;
        case "users": return <AdminUsers users={users} waitlist={waitlist} setWaitlist={setWaitlist} />;
        default: return <AdminDashboard stocks={stocks} weekly={weekly} users={users} goto={setAdminPage} />;
      }
    };

    const adminNavItems = [
      { key: "dashboard", icon: Home },
      { key: "stocks", icon: BarChart3 },
      { key: "market", icon: Activity },
      { key: "weekly", icon: PlayCircle },
      { key: "users", icon: Users },
    ];

    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} />
        <div dir={t.dir} style={{
          minHeight: "100vh", background: c.ink, color: c.text,
          fontFamily: font(lang),
        }}>
          <header style={{
            borderBottom: `1px solid ${c.border}`, background: c.ink,
            position: "sticky", top: 0, zIndex: 10,
          }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Logo size={32} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontFamily: fontNastaliq, fontSize: 26, color: c.gold, lineHeight: 1 }}>قرار</div>
                  <Pill color={c.amber}>{isAr ? "مدير" : "Admin"}</Pill>
                </div>
              </div>
              <nav style={{ display: "flex", gap: 4 }}>
                {adminNavItems.map((item) => {
                  const active = adminPage === item.key;
                  return (
                    <button key={item.key} onClick={() => setAdminPage(item.key)} style={{
                      padding: "8px 14px",
                      background: active ? c.gold + "20" : "transparent",
                      color: active ? c.gold : c.muted, border: "none",
                      fontFamily: font(lang), fontSize: 14, fontWeight: 500,
                      cursor: "pointer",
                      borderBottom: `1px solid ${active ? c.gold : "transparent"}`,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <item.icon size={13} />{t.adminNav[item.key]}
                    </button>
                  );
                })}
              </nav>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 10px",
                  background: "transparent", border: `1px solid ${c.border}`,
                  color: c.text, cursor: "pointer", borderRadius: 2,
                  fontFamily: fontMono, fontSize: 11,
                }}>
                  <Languages size={12} color={c.gold} />
                  <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
                  <span style={{ color: c.border }}>·</span>
                  <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontAr, fontSize: 13 }}>ع</span>
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
                <Button variant="ghost" size="sm" onClick={adminLogout} icon={LogOut}>{t.signOut}</Button>
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

  // ── User mode: launch system ──
  const seatsAreFull = users.length >= MAX_SEATS;
  const launchReady = siteForceOpen || isLaunchTimeReached();

  // CASE 1: Visitor not signed in
  if (!currentUser) {
    // If seats full, show waitlist screen
    if (seatsAreFull) {
      return (
        <AppContext.Provider value={ctx}>
          <GlobalStyles c={c} />
          <SeatsFullScreen
            onJoinWaitlist={(updated) => setWaitlist(updated)}
            waitlistCount={waitlist.length}
          />
        </AppContext.Provider>
      );
    }
    // Otherwise show auth page (with seat counter inside)
    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} />
        <AuthPage
          users={users}
          setUsers={setUsers}
          setCurrentUser={setCurrentUser}
          onSignupSuccess={() => setJustSignedUp(true)}
        />
      </AppContext.Provider>
    );
  }

  // CASE 2: User just signed up — show congrats briefly
  if (justSignedUp) {
    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} />
        <CongratsScreen user={currentUser} onContinue={() => setJustSignedUp(false)} />
      </AppContext.Provider>
    );
  }

  // CASE 3: User logged in but launch hasn't happened yet
  if (!launchReady) {
    return (
      <AppContext.Provider value={ctx}>
        <GlobalStyles c={c} />
        <CountdownScreen user={currentUser} onLogout={userLogout} />
      </AppContext.Provider>
    );
  }

  // CASE 4: User logged in AND launch ready — full site
  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage go={goto} stocks={stocks} market={market} />;
      case "stock": return <StockPage stocks={stocks} selectedStockId={selectedStockId} setSelectedStockId={setSelectedStockId} />;
      case "market": return <MarketPage market={market} stocks={stocks} goToStock={(id) => goto("stock", id)} />;
      case "portfolio": return <PortfolioPage currentUser={currentUser} />;
      case "journal": return <JournalPage currentUser={currentUser} />;
      case "weekly": return <WeeklyPage weekly={weekly} />;
      default: return <HomePage go={goto} stocks={stocks} market={market} />;
    }
  };

  const NAV = [
    { key: "home", icon: Home }, { key: "stock", icon: BarChart3 },
    { key: "market", icon: Activity }, { key: "portfolio", icon: Briefcase },
    { key: "journal", icon: BookOpen }, { key: "weekly", icon: PlayCircle },
  ];

  return (
    <AppContext.Provider value={ctx}>
      <GlobalStyles c={c} />
      <div dir={t.dir} style={{
        minHeight: "100vh", background: c.ink, color: c.text,
        fontFamily: font(lang),
        fontFeatureSettings: '"ss01", "cv11"',
        transition: "background 0.4s ease, color 0.4s ease",
      }}>
        <header style={{
          borderBottom: `1px solid ${c.border}`, background: c.ink,
          position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => goto("home")}>
              <Logo size={34} />
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontFamily: fontNastaliq, fontSize: 30, color: c.gold, lineHeight: 1 }}>قرار</div>
                  <div style={{ fontFamily: fontEn, fontSize: 22, color: c.textHi, fontStyle: "italic", lineHeight: 1, fontWeight: 500 }}>Qarar</div>
                </div>
                <div style={{
                  fontFamily: fontMono, fontSize: 9, color: c.muted,
                  letterSpacing: "0.18em", marginTop: 3, textTransform: "uppercase",
                }}>{t.brand}</div>
              </div>
            </div>

            <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {NAV.map((item) => {
                const active = page === item.key;
                return (
                  <button key={item.key} onClick={() => goto(item.key)} style={{
                    padding: "10px 16px",
                    background: active ? c.gold + "20" : "transparent",
                    color: active ? c.gold : c.muted, border: "none",
                    fontFamily: font(lang), fontSize: 15, fontWeight: 500,
                    cursor: "pointer",
                    borderBottom: `2px solid ${active ? c.gold : "transparent"}`,
                    borderRadius: 0,
                  }}>{t.nav[item.key]}</button>
                );
              })}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setLang(lang === "en" ? "ar" : "en")} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                background: "transparent", border: `1px solid ${c.border}`,
                color: c.text, cursor: "pointer", borderRadius: 2,
                fontFamily: fontMono, fontSize: 11, letterSpacing: "0.1em",
              }}>
                <Languages size={13} color={c.gold} />
                <span style={{ color: lang === "en" ? c.gold : c.muted }}>EN</span>
                <span style={{ color: c.border }}>·</span>
                <span style={{ color: lang === "ar" ? c.gold : c.muted, fontFamily: fontAr, fontSize: 13 }}>ع</span>
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

              {/* User badge + sign out */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: `1px solid ${c.border}`, borderRadius: 2 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: c.gold + "20",
                  border: `1px solid ${c.gold}`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontFamily: font(lang), fontSize: 13, color: c.gold, fontWeight: 600,
                }}>
                  {(currentUser.name || currentUser.username || "U")[0].toUpperCase()}
                </div>
                <div style={{ fontFamily: font(lang), fontSize: 14, color: c.textHi }}>
                  {currentUser.name || currentUser.username}
                </div>
                <button onClick={userLogout} title={t.signOut} style={{
                  background: "transparent", border: "none", color: c.muted,
                  cursor: "pointer", padding: 4, marginLeft: 4,
                  display: "flex", alignItems: "center",
                }}>
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px" }}>
          {renderPage()}
        </main>

        <footer style={{ borderTop: `1px solid ${c.border}`, marginTop: 80 }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontFamily: font(lang), fontSize: 18, color: c.muted, fontStyle: "italic", maxWidth: 600, lineHeight: 1.5 }}>
              {t.disclaimer}
            </div>
            <div style={{ fontFamily: fontMono, fontSize: 10, color: c.muted, letterSpacing: "0.15em" }}>
              {t.copyright}
            </div>
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

const GlobalStyles = ({ c }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; background: ${c.ink}; }
    ::selection { background: ${c.gold}40; color: ${c.textHi}; }
    .qarar-tile { transition: border-color 0.2s ease, transform 0.2s ease; }
    .qarar-tile:hover { border-color: ${c.gold} !important; transform: translateY(-2px); }
    button { transition: all 0.15s ease; }
    button:hover { opacity: 0.88; }
    input:focus, textarea:focus { outline: none; border-color: ${c.gold} !important; }
  `}</style>
);
