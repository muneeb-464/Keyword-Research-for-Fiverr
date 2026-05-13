export interface Record_ {
  id: string; keyword: string; competition: number;
  queueSum: number; avgOrders: number; sellerPerOrder: number; date: string;
}
export interface Saved_ {
  id: string; keyword: string; competition: number;
  sellerPerOrder: number; savedAt: string;
}
export type Page    = "analyzer" | "queue" | "saved" | "market" | "history" | "trends";
export type SortKey = "date" | "competition" | "sellerPerOrder";
export type Theme   = "dark" | "light";
