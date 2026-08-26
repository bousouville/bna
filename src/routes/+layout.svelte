<script>
	import '@fontsource/inter/400.css';
	import { base } from '$app/paths';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/noto-sans-tc/400.css';
	import '@fontsource/noto-sans-tc/500.css';
	import '@fontsource/noto-sans-tc/700.css';
	import '$lib/styles/app.css';

	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { t, setLocaleFromPath } from '$lib/stores/locale.js';

	let { children } = $props();

	/* SSR/预渲染时同步设置语言；$effect 负责客户端导航切换 */
	setLocaleFromPath(page.url.pathname);
	$effect(() => {
		setLocaleFromPath(page.url.pathname);
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#00205B" />
	<link rel="icon" type="image/png" sizes="32x32" href={`${base}/favicon-32.png`} />
	<link rel="icon" type="image/png" sizes="64x64" href={`${base}/favicon.png`} />
	<link rel="apple-touch-icon" href={`${base}/apple-touch-icon.png`} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="BNA · 布索維爾國家航空 Bousouville National Airways" />
	<meta property="og:image" content={`${base}/og.png`} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Header />

<main id="main">
	{@render children()}
</main>

<Footer />
