<script>
	import { t, locale, fmtDate } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';

	let { item, base } = $props(); /* item: { slug, date, cat, title, excerpt } */
	const dir = $derived(base ?? withBase($locale === 'en' ? '/en/news' : '/news'));</script>

<a class="news-card" href="{dir}/{item.slug}">
	<div class="meta">
		<span class="cat">{item.cat}</span>
		<time datetime={item.date}>{fmtDate(item.date, $locale)}</time>
	</div>
	<h3>{item.title}</h3>
	<p>{item.excerpt}</p>
	<span class="more">{$t.common.readMore} →</span>
</a>

<style>
	.news-card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.4rem 1.5rem;
		text-decoration: none;
		box-shadow: var(--shadow-1);
		transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease), border-color 0.18s var(--ease);
	}

	.news-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-2);
		border-color: var(--gold-400);
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.78rem;
	}

	.cat {
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold-600);
	}

	time {
		color: var(--ink-500);
	}

	h3 {
		font-size: 1.05rem;
		color: var(--navy-900);
		margin: 0;
	}

	.news-card:hover h3 {
		color: var(--gold-600);
	}

	p {
		color: var(--text-soft);
		font-size: 0.9rem;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.more {
		margin-top: auto;
		font-size: 0.85rem;
		font-weight: 650;
		color: var(--navy-700);
	}
</style>
