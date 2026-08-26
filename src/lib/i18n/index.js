import { base } from '$app/paths';
import { withBase } from '$lib/paths.js';
import zh from './zh.js';
import en from './en.js';

export const dictionaries = { zh, en };

export const locales = ['zh', 'en'];

export function localeFromPath(pathname) {
	const seg = pathname.split('/').filter(Boolean)[0];
	return seg === 'en' ? 'en' : 'zh';
}

export function tFor(locale) {
	return dictionaries[locale] || zh;
}

export function swapLocalePath(pathname, target) {
	const b = base.replace(/\/$/, '');
	let p = b && pathname.startsWith(b) ? pathname.slice(b.length) : pathname;
	const segs = p.split('/').filter(Boolean);
	const isEn = segs[0] === 'en';
	if (target === 'en' && !isEn) {
		return withBase('/en' + (segs.length ? '/' + segs.join('/') : '/'));
	}
	if (target === 'zh' && isEn) {
		return withBase('/' + segs.slice(1).join('/'));
	}
	return withBase(p || '/');
}

/* 带 {n} 占位符的简单格式化 */
export function fmt(template, vars) {
	let out = template;
	for (const [k, v] of Object.entries(vars || {})) {
		out = out.replaceAll(`{${k}}`, String(v));
	}
	return out;
}
