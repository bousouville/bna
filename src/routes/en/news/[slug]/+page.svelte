<script>
	import NewsArticle from '$lib/pages/NewsArticle.svelte';

	let { params } = $props();
</script>

<NewsArticle slug={params.slug} />
