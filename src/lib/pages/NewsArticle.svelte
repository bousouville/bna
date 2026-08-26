<script>
	/** 新聞文章页（共享，slug 由路由传入） */
	import { t, locale, fmtDate } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import PageHero from '$lib/components/PageHero.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';

	let { slug } = $props();

	const items = $derived($t.news.items);
	const idx = $derived(items.findIndex((i) => i.slug === slug));
	const item = $derived(idx >= 0 ? items[idx] : null);
	const related = $derived(items.filter((i) => i.slug !== slug).slice(0, 3));
	const isEn = $derived($locale === 'en');

	const backHref = $derived(withBase(isEn ? '/en/news' : '/news'));
</script>

{#if item}
	<PageHero
		title={item.title}
		sub=""
		crumbs={[{ label: $t.news.title, href: backHref }, { label: item.date, href: backHref }]}
	/>

	<article class="section">
		<div class="container art">
			<header class="art-head">
				<span class="chip">{item.cat}</span>
				<time datetime={item.date}>{fmtDate(item.date, $locale)}</time>
			</header>
			<p class="art-excerpt">{item.excerpt}</p>
			{#each item.body as para (para.slice(0, 24))}
				<p class="art-para">{para}</p>
			{/each}
			<div class="art-back">
				<a class="btn btn--ghost-dark" href={backHref}>← {$t.news.backToList}</a>
			</div>
		</div>
	</article>

	<section class="section section--soft">
		<div class="container">
			<div class="section-head">
				<h2>{$t.news.latest}</h2>
			</div>
			<div class="related">
				{#each related as r (r.slug)}
					<NewsCard item={r} base={withBase(isEn ? '/en/news' : '/news')} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.art {
		max-width: 760px;
	}

	.art-head {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.2rem;
	}

	.art-head time {
		color: var(--text-soft);
		font-size: 0.88rem;
	}

	.art-excerpt {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--navy-800);
		line-height: 1.7;
		border-left: 3px solid var(--gold-500);
		padding-left: 1.1rem;
		margin-bottom: 1.6rem;
	}

	.art-para {
		color: var(--ink-700);
		line-height: 1.9;
		margin-bottom: 1.1rem;
	}

	.art-back {
		margin-top: 2rem;
	}

	.related {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	@media (max-width: 960px) {
		.related {
			grid-template-columns: 1fr;
		}
	}
</style>
