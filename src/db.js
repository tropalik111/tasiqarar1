// ═══════════════════════════════════════════════════════
// db.js — Supabase database helper
// All DB operations go through this file.
// ═══════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";

// ⚠️ Supabase credentials — these are PUBLIC (safe to expose).
// Security is enforced by Row Level Security (RLS) in Supabase.
const SUPABASE_URL = "https://flakmgkendcsyvbunnmv.supabase.co";
const SUPABASE_KEY = "sb_publishable_uTwW1mEsV_9fcf3weDBUcw_ujF5Krun";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Helper: timestamp normalization ────────────────────
const ts = (d) => (d ? new Date(d).getTime() : null);

// ═══════════════════════════════════════════════════════
// USERS — sign up, sign in, list
// ═══════════════════════════════════════════════════════

export async function db_listUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("seat_number", { ascending: true });
  if (error) { console.error("listUsers:", error); return []; }
  return (data || []).map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    passwordHash: u.password_hash,
    seatNumber: u.seat_number,
    joinedAt: ts(u.joined_at),
  }));
}

export async function db_countUsers() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  if (error) { console.error("countUsers:", error); return 0; }
  return count || 0;
}

export async function db_findUserByEmail(email) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .ilike("email", email.toLowerCase())
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    passwordHash: data.password_hash,
    seatNumber: data.seat_number,
    joinedAt: ts(data.joined_at),
  };
}

export async function db_findUserByUsername(username) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .ilike("username", username.toLowerCase())
    .maybeSingle();
  return data || null;
}

export async function db_createUser({ name, username, email, passwordHash }) {
  // Atomic-ish seat assignment: count current users + 1
  const count = await db_countUsers();
  const seatNumber = count + 1;

  const { data, error } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      seat_number: seatNumber,
    })
    .select()
    .single();

  if (error) {
    console.error("createUser:", error);
    return { error: error.message };
  }
  return {
    user: {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      passwordHash: data.password_hash,
      seatNumber: data.seat_number,
      joinedAt: ts(data.joined_at),
    },
  };
}

// ═══════════════════════════════════════════════════════
// WAITLIST
// ═══════════════════════════════════════════════════════

export async function db_listWaitlist() {
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("joined_at", { ascending: true });
  if (error) { console.error("listWaitlist:", error); return []; }
  return (data || []).map((w) => ({
    id: w.id,
    email: w.email,
    joinedAt: ts(w.joined_at),
  }));
}

export async function db_addToWaitlist(email) {
  const e = email.trim().toLowerCase();
  // Check duplicate
  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .ilike("email", e)
    .maybeSingle();
  if (existing) return { exists: true };

  const { data, error } = await supabase
    .from("waitlist")
    .insert({ email: e })
    .select()
    .single();
  if (error) { console.error("addToWaitlist:", error); return { error: error.message }; }
  return { entry: { id: data.id, email: data.email, joinedAt: ts(data.joined_at) } };
}

export async function db_removeFromWaitlist(id) {
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) { console.error("removeFromWaitlist:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// STOCKS — full CRUD for the leading stocks
// ═══════════════════════════════════════════════════════

const mapStockFromDB = (s) => ({
  id: s.id,
  sym: s.sym,
  name: s.name,
  nameAr: s.name_ar,
  sector: s.sector || "",
  sectorAr: s.sector_ar || "",
  wave: s.wave || "",
  waveAr: s.wave_ar || "",
  continuation: s.continuation ?? 50,
  reversal: s.reversal ?? 50,
  momentum: s.momentum ?? 50,
  support: parseFloat(s.support) || 0,
  resistance: parseFloat(s.resistance) || 0,
  price: parseFloat(s.price) || 0,
  change: parseFloat(s.change) || 0,
  analysis: s.analysis || "",
  analysisAr: s.analysis_ar || "",
  outlook: s.outlook || "",
  scenario: s.scenario || "",
  scenarioAr: s.scenario_ar || "",
  confidence: s.confidence || "medium",
  horizon: s.horizon || "1M",
  published: !!s.published,
  images: s.images || { daily: "", weekly: "", monthly: "" },
  updatedAt: ts(s.updated_at),
});

const mapStockToDB = (s) => ({
  id: s.id,
  sym: s.sym,
  name: s.name,
  name_ar: s.nameAr,
  sector: s.sector,
  sector_ar: s.sectorAr,
  wave: s.wave,
  wave_ar: s.waveAr,
  continuation: s.continuation,
  reversal: s.reversal,
  momentum: s.momentum,
  support: s.support,
  resistance: s.resistance,
  price: s.price,
  change: s.change,
  analysis: s.analysis,
  analysis_ar: s.analysisAr,
  outlook: s.outlook,
  scenario: s.scenario,
  scenario_ar: s.scenarioAr,
  confidence: s.confidence,
  horizon: s.horizon,
  published: s.published,
  images: s.images,
  updated_at: new Date().toISOString(),
});

export async function db_listStocks() {
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("id", { ascending: true });
  if (error) { console.error("listStocks:", error); return []; }
  return (data || []).map(mapStockFromDB);
}

export async function db_saveStock(stock) {
  const payload = mapStockToDB(stock);
  const { error } = await supabase.from("stocks").upsert(payload);
  if (error) { console.error("saveStock:", error); return false; }
  return true;
}

export async function db_deleteStock(id) {
  const { error } = await supabase.from("stocks").delete().eq("id", id);
  if (error) { console.error("deleteStock:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// MARKET — singleton (id=1)
// ═══════════════════════════════════════════════════════

const mapMarketFromDB = (m) => ({
  tasiValue: parseFloat(m.tasi_value) || 0,
  tasiChange: parseFloat(m.tasi_change) || 0,
  tasiChangePct: parseFloat(m.tasi_change_pct) || 0,
  direction: m.direction || "sideways",
  strength: m.strength ?? 50,
  quote: m.quote || "",
  quoteAr: m.quote_ar || "",
  quoteHighlight: m.quote_highlight || [],
  quoteHighlightAr: m.quote_highlight_ar || [],
  updatedAt: ts(m.updated_at),
});

export async function db_getMarket() {
  const { data, error } = await supabase
    .from("market")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    console.error("getMarket:", error);
    return {
      tasiValue: 0, tasiChange: 0, tasiChangePct: 0,
      direction: "sideways", strength: 50,
      quote: "", quoteAr: "",
      quoteHighlight: [], quoteHighlightAr: [],
      updatedAt: null,
    };
  }
  return mapMarketFromDB(data);
}

export async function db_saveMarket(m) {
  const payload = {
    id: 1,
    tasi_value: m.tasiValue,
    tasi_change: m.tasiChange,
    tasi_change_pct: m.tasiChangePct,
    direction: m.direction,
    strength: m.strength,
    quote: m.quote,
    quote_ar: m.quoteAr,
    quote_highlight: m.quoteHighlight || [],
    quote_highlight_ar: m.quoteHighlightAr || [],
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("market").upsert(payload);
  if (error) { console.error("saveMarket:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// WEEKLY VIDEO — singleton (id=1)
// ═══════════════════════════════════════════════════════

const mapWeeklyFromDB = (w) => ({
  week: w.week ?? 1,
  title: w.title || "",
  titleAr: w.title_ar || "",
  url: w.url || "",
  description: w.description || "",
  descriptionAr: w.description_ar || "",
  scenarios: w.scenarios || [],
  updatedAt: ts(w.updated_at),
});

export async function db_getWeekly() {
  const { data, error } = await supabase
    .from("weekly")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    console.error("getWeekly:", error);
    return { week: 1, title: "", titleAr: "", url: "", description: "", descriptionAr: "", scenarios: [], updatedAt: null };
  }
  return mapWeeklyFromDB(data);
}

export async function db_saveWeekly(w) {
  const payload = {
    id: 1,
    week: w.week,
    title: w.title,
    title_ar: w.titleAr,
    url: w.url,
    description: w.description,
    description_ar: w.descriptionAr,
    scenarios: w.scenarios || [],
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("weekly").upsert(payload);
  if (error) { console.error("saveWeekly:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// SETTINGS — launch date, site_force_open (singleton id=1)
// ═══════════════════════════════════════════════════════

export async function db_getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    console.error("getSettings:", error);
    // Default fallback: 10 days from now
    return {
      launchDate: Date.now() + 10 * 24 * 60 * 60 * 1000,
      siteForceOpen: false,
    };
  }
  return {
    launchDate: ts(data.launch_date),
    siteForceOpen: !!data.site_force_open,
  };
}

export async function db_setSiteForceOpen(open) {
  const { error } = await supabase
    .from("settings")
    .update({ site_force_open: open })
    .eq("id", 1);
  if (error) { console.error("setSiteForceOpen:", error); return false; }
  return true;
}

export async function db_setLaunchDate(date) {
  const { error } = await supabase
    .from("settings")
    .update({ launch_date: new Date(date).toISOString() })
    .eq("id", 1);
  if (error) { console.error("setLaunchDate:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// TRADES — per-user
// ═══════════════════════════════════════════════════════

const mapTradeFromDB = (t) => ({
  id: t.id,
  userId: t.user_id,
  sym: t.sym,
  name: t.name,
  qty: parseFloat(t.qty) || 0,
  entry: parseFloat(t.entry) || 0,
  current: parseFloat(t.current_price) || 0,
  tp: parseFloat(t.tp) || 0,
  sl: parseFloat(t.sl) || 0,
  note: t.note || "",
  status: t.status || "open",
  closePrice: parseFloat(t.close_price) || 0,
  openedAt: ts(t.opened_at),
  closedAt: ts(t.closed_at),
});

export async function db_listTrades(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("opened_at", { ascending: false });
  if (error) { console.error("listTrades:", error); return []; }
  return (data || []).map(mapTradeFromDB);
}

export async function db_saveTrade(trade) {
  const payload = {
    id: trade.id,
    user_id: trade.userId,
    sym: trade.sym,
    name: trade.name,
    qty: trade.qty,
    entry: trade.entry,
    current_price: trade.current,
    tp: trade.tp,
    sl: trade.sl,
    note: trade.note,
    status: trade.status,
    close_price: trade.closePrice || 0,
    opened_at: trade.openedAt ? new Date(trade.openedAt).toISOString() : new Date().toISOString(),
    closed_at: trade.closedAt ? new Date(trade.closedAt).toISOString() : null,
  };
  const { error } = await supabase.from("trades").upsert(payload);
  if (error) { console.error("saveTrade:", error); return false; }
  return true;
}

export async function db_deleteTrade(id) {
  const { error } = await supabase.from("trades").delete().eq("id", id);
  if (error) { console.error("deleteTrade:", error); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════
// JOURNAL ENTRIES — per-user
// ═══════════════════════════════════════════════════════

const mapJournalFromDB = (j) => ({
  id: j.id,
  userId: j.user_id,
  date: j.entry_date,
  sym: j.sym,
  outcome: j.outcome || "win",
  reasoning: j.reasoning || "",
  emotion: j.emotion || "",
  lesson: j.lesson || "",
  createdAt: ts(j.created_at),
});

export async function db_listJournalEntries(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });
  if (error) { console.error("listJournalEntries:", error); return []; }
  return (data || []).map(mapJournalFromDB);
}

export async function db_saveJournalEntry(entry) {
  const payload = {
    id: entry.id,
    user_id: entry.userId,
    entry_date: entry.date,
    sym: entry.sym,
    outcome: entry.outcome,
    reasoning: entry.reasoning,
    emotion: entry.emotion,
    lesson: entry.lesson,
  };
  const { error } = await supabase.from("journal_entries").upsert(payload);
  if (error) { console.error("saveJournalEntry:", error); return false; }
  return true;
}

export async function db_deleteJournalEntry(id) {
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) { console.error("deleteJournalEntry:", error); return false; }
  return true;
}
