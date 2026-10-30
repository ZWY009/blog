import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 合并 className：后面的 Tailwind 类覆盖前面的冲突类 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** 2026-10-12 → 2026 年 10 月 12 日 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}

/** 2026-10-12 → 2026 */
export function yearOf(iso: string): string {
  return iso.slice(0, 4);
}
