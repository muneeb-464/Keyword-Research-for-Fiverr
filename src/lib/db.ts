import { supabase } from './supabase'
import type { Record_, Saved_ } from '../types'

// ── Keywords (history + all-time queue) ──────────────────────────────────────

export async function loadHistory(userId: string): Promise<Record_[]> {
  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('user_id', userId)
    .eq('in_history', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToRecord)
}

export async function loadAllKeywords(userId: string): Promise<Record_[]> {
  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToRecord)
}

export async function upsertKeyword(userId: string, r: Record_): Promise<void> {
  const { error } = await supabase.from('keywords').upsert({
    id: r.id,
    user_id: userId,
    keyword: r.keyword,
    competition: r.competition,
    queue_sum: r.queueSum,
    avg_orders: r.avgOrders,
    seller_per_order: r.sellerPerOrder,
    date: r.date,
    avg_price: r.avgPrice,
    in_history: true,
  })
  if (error) throw error
}

export async function deleteFromHistory(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('keywords')
    .update({ in_history: false })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function resetHistory(userId: string): Promise<void> {
  const { error } = await supabase
    .from('keywords')
    .update({ in_history: false })
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteKeyword(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function updateKeywordName(userId: string, id: string, keyword: string): Promise<void> {
  const { error } = await supabase
    .from('keywords')
    .update({ keyword })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ── Saved keywords ────────────────────────────────────────────────────────────

export async function loadSaved(userId: string): Promise<Saved_[]> {
  const { data, error } = await supabase
    .from('saved_keywords')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToSaved)
}

export async function upsertSaved(userId: string, s: Saved_): Promise<void> {
  const { error } = await supabase.from('saved_keywords').upsert({
    id: s.id,
    user_id: userId,
    keyword: s.keyword,
    competition: s.competition,
    seller_per_order: s.sellerPerOrder,
    saved_at: s.savedAt,
  })
  if (error) throw error
}

export async function deleteSaved(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('saved_keywords')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ── Starred keywords ──────────────────────────────────────────────────────────

export async function loadStarred(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('starred_keywords')
    .select('keyword_id')
    .eq('user_id', userId)
  if (error) throw error
  return new Set((data ?? []).map((r: { keyword_id: string }) => r.keyword_id))
}

export async function addStarred(userId: string, keywordId: string): Promise<void> {
  const { error } = await supabase
    .from('starred_keywords')
    .upsert({ user_id: userId, keyword_id: keywordId })
  if (error) throw error
}

export async function removeStarred(userId: string, keywordId: string): Promise<void> {
  const { error } = await supabase
    .from('starred_keywords')
    .delete()
    .eq('user_id', userId)
    .eq('keyword_id', keywordId)
  if (error) throw error
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function rowToRecord(row: Record<string, unknown>): Record_ {
  return {
    id: row.id as string,
    keyword: row.keyword as string,
    competition: row.competition as number,
    queueSum: row.queue_sum as number,
    avgOrders: row.avg_orders as number,
    sellerPerOrder: row.seller_per_order as number,
    date: row.date as string,
    avgPrice: (row.avg_price as number) ?? 0,
  }
}

function rowToSaved(row: Record<string, unknown>): Saved_ {
  return {
    id: row.id as string,
    keyword: row.keyword as string,
    competition: row.competition as number,
    sellerPerOrder: row.seller_per_order as number,
    savedAt: row.saved_at as string,
  }
}
