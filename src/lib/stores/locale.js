import { writable, derived } from 'svelte/store';
import { localeFromPath, tFor } from '$lib/i18n/index.js';

/** 当前语言，由根 layout 在 load 时设置 */
export const locale = writable('zh');

/** 当前词典 */
export const t = derived(locale, ($l) => tFor($l));

export function setLocaleFromPath(pathname) {
	locale.set(localeFromPath(pathname));
}

const numberLocale = ($l) => ($l === 'zh' ? 'zh-Hant' : 'en-GB');

/** 数值格式化 */
export function fmtNum(n, $locale) {
	return new Intl.NumberFormat(numberLocale($locale)).format(n);
}

/** 日期格式化：iso "2026-07-15" */
export function fmtDate(iso, $locale, opts = { year: 'numeric', month: 'long', day: 'numeric' }) {
	const d = new Date(iso + 'T00:00:00Z');
	return new Intl.DateTimeFormat($locale === 'zh' ? 'zh-Hant' : 'en-GB', {
		...opts,
		timeZone: 'UTC'
	}).format(d);
}

/** 星期几（短） */
export function fmtWeekday(iso, $locale) {
	const d = new Date(iso + 'T00:00:00Z');
	return new Intl.DateTimeFormat($locale === 'zh' ? 'zh-Hant' : 'en-GB', {
		weekday: 'short',
		timeZone: 'UTC'
	}).format(d);
}
