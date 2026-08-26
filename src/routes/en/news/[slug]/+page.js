import { error } from '@sveltejs/kit';
import { dictionaries } from '$lib/i18n/index.js';

export function entries() {
	return dictionaries.en.news.items.map((i) => ({ slug: i.slug }));
}

export function load({ params }) {
	if (!dictionaries.en.news.items.some((i) => i.slug === params.slug)) {
		throw error(404, 'Article not found');
	}
	return {};
}
