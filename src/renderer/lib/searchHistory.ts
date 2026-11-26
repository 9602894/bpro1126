// src/renderer/lib/searchHistory.ts
// ★ 2026-11-26（用户要求）：搜索历史 —— **不再设条数上限**，保留全部记录；
//   仍保持去重（同词上移到最前）与逐条删除/清空。仅渲染层（localStorage）。
//   纯函数（pushSearchTerm / removeSearchTerm）单独导出，便于单测。
const KEY = 'winbox-search-history';

/**
 * @deprecated 搜索历史已放开为**无上限**，此常量仅为兼容旧 import 保留，
 * 不要再用于截断或 UI 文案（`slice(0, Infinity)` 仍返回全部，是安全的）。
 */
export const SEARCH_HISTORY_MAX = Number.POSITIVE_INFINITY;

/**
 * 纯函数：把词插到最前（去重）；空词不记。
 * ★ 2026-11-26：**不再截断**（无上限保留全部记录）。
 *   `_max` 参数仅为兼容旧调用保留，已忽略——即使调用方传了有限值也不会截断。
 */
export function pushSearchTerm(list: string[], term: string, _max: number = SEARCH_HISTORY_MAX): string[] {
  const cur = (list || []).filter((x) => typeof x === 'string' && x.trim());
  const t = (term || '').trim();
  if (!t) return cur;
  return [t, ...cur.filter((x) => x !== t)];
}

/** 纯函数：移除一条 */
export function removeSearchTerm(list: string[], term: string): string[] {
  return (list || []).filter((x) => x !== term);
}

export function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    // ★ 2026-11-26：不再 slice 截断——盘上已存的历史原样全量返回
    return arr.filter((x): x is string => typeof x === 'string' && !!x.trim());
  } catch {
    return [];
  }
}

export function saveSearchHistory(list: string[]): void {
  try {
    // ★ 2026-11-26：不再 slice 截断——全量落盘
    localStorage.setItem(KEY, JSON.stringify(list || []));
  } catch {
    /* 存储不可用时静默（不影响搜索） */
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
