<script>
	import { page } from '$app/state';
	import { t, setLocaleFromPath } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';

	$effect(() => {
		setLocaleFromPath(page.url.pathname);
	});

	const homeHref = $derived(withBase($t.code === 'en' ? '/en' : '/'));
</script>

<section class="section err">
	<div class="container">
		<p class="code">{page.status}</p>
		<h1>{$t.common.notFoundTitle}</h1>
		<p class="body">{$t.common.notFoundBody}</p>
		<a class="btn btn--primary" href={homeHref}>{$t.common.backHome}</a>
	</div>
</section>

<style>
	.err {
		text-align: center;
		padding-block: clamp(4rem, 12vw, 8rem);
	}

	.code {
		font-size: clamp(3rem, 10vw, 5rem);
		font-weight: 800;
		color: var(--gold-500);
		margin: 0;
	}

	h1 {
		color: var(--navy-900);
	}

	.body {
		color: var(--text-soft);
		max-width: 460px;
		margin: 0 auto 1.6rem;
	}
</style>
