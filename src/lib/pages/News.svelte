<script>
	/** 新聞列表 */
	import { t, locale } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import PageHero from '$lib/components/PageHero.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';

	const items = $derived($t.news.items);
	const isEn = $derived($locale === 'en');
</script>

<PageHero title={$t.news.title} sub={$t.news.intro} />

<section class="section">
	<div class="container">
		<div class="news-list">
			{#each items as item (item.slug)}
				<NewsCard {item} base={withBase(isEn ? '/en/news' : '/news')} />
			{/each}
		</div>
	</div>
</section>

<style>
	.news-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	@media (max-width: 960px) {
		.news-list {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 620px) {
		.news-list {
			grid-template-columns: 1fr;
		}
	}
</style>
