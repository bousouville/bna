<script>
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { withBase } from '$lib/paths.js';
	import { locale, t, setLocaleFromPath } from '$lib/stores/locale.js';
	import { swapLocalePath } from '$lib/i18n/index.js';
	import Mark from './Mark.svelte';

	let menuOpen = $state(false);

	const sections = $derived([
		{ href: '/booking', key: 'booking' },
		{ href: '/destinations', key: 'destinations' },
		{ href: '/fleet', key: 'fleet' },
		{ href: '/experience', key: 'experience' },
		{ href: '/oneworld', key: 'oneworld' },
		{ href: '/about', key: 'about' },
		{ href: '/news', key: 'news' },
		{ href: '/support', key: 'support' }
	]);

	const current = $derived(page.url.pathname.startsWith(base)
		? page.url.pathname.slice(base.length).replace(/\/$/, '').replace(/^\/en/, '') || '/'
		: page.url.pathname.replace(/\/$/, '').replace(/^\/en/, '') || '/');

	$effect(() => {
		setLocaleFromPath(page.url.pathname);
	});
	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});

	function homeHref($locale) {
		return withBase($locale === 'en' ? '/en' : '/');
	}
	function sectionHref(href, $locale) {
		return withBase($locale === 'en' ? '/en' + href : href);
	}
</script>

<a class="skip-link" href="#main">{$t.nav.skip}</a>

<header class="site-header">
	<div class="container bar">
		<a class="brand" href={homeHref($locale)} aria-label="BNA — {$t.nav.home}">
			<Mark size={34} />
			<span class="brand-word">
				<strong>BNA</strong>
				<em>BOUSOVILLE NATIONAL AIRWAYS</em>
			</span>
		</a>

		<nav class="nav-desktop" aria-label="{$t.nav.home}">
			<ul>
				{#each sections as s (s.href)}
					<li>
						<a href={sectionHref(s.href, $locale)} class:active={current === s.href || current.startsWith(s.href + '/')}>
							{$t.nav[s.key]}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="actions">
			<span class="ow-pill">oneworld</span>
			<a class="btn btn--primary btn-book" href={sectionHref('/booking', $locale)}>{$t.common.book}</a>
			<a
				class="lang"
				href={swapLocalePath(page.url.pathname, $locale === 'zh' ? 'en' : 'zh')}
				hreflang={$locale === 'zh' ? 'en' : 'zh'}
			>
				{$locale === 'zh' ? 'EN' : '中'}
			</a>
			<button
				class="menu-btn"
				aria-expanded={menuOpen}
				aria-label={menuOpen ? $t.nav.close : $t.nav.menu}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="menu-icon" class:open={menuOpen} aria-hidden="true"><i></i><i></i><i></i></span>
			</button>
		</div>
	</div>

	{#if menuOpen}
		<nav class="nav-mobile" aria-label="{$t.nav.menu}">
			<ul>
				<li><a href={homeHref($locale)}>{$t.nav.home}</a></li>
				{#each sections as s (s.href)}
					<li><a href={sectionHref(s.href, $locale)}>{$t.nav[s.key]}</a></li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(255, 255, 255, 0.86);
		backdrop-filter: blur(16px) saturate(160%);
		-webkit-backdrop-filter: blur(16px) saturate(160%);
		border-bottom: 1px solid var(--line);
		box-shadow: 0 1px 0 rgba(0, 21, 64, 0.04);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		padding-block: 0.62rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		text-decoration: none;
		color: var(--navy-900);
		flex-shrink: 0;
	}

	.brand-word {
		display: grid;
		line-height: 1.12;
	}
	.brand-word strong {
		font-size: 1.2rem;
		letter-spacing: 0.14em;
		font-weight: 800;
	}
	.brand-word em {
		font-style: normal;
		font-size: 0.52rem;
		letter-spacing: 0.13em;
		color: var(--ink-500);
		text-transform: uppercase;
	}

	.nav-desktop {
		margin-left: auto;
	}
	.nav-desktop ul {
		display: flex;
		gap: 0.1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.nav-desktop a {
		position: relative;
		display: block;
		padding: 0.5rem 0.7rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ink-700);
		text-decoration: none;
		transition: color 0.15s var(--ease);
	}
	.nav-desktop a::after {
		content: '';
		position: absolute;
		left: 0.7rem;
		right: 0.7rem;
		bottom: 0.28rem;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(90deg, var(--gold-500), var(--gold-400));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.2s var(--ease);
	}
	.nav-desktop a:hover {
		color: var(--navy-800);
	}
	.nav-desktop a:hover::after {
		transform: scaleX(0.7);
	}
	.nav-desktop a.active {
		color: var(--navy-800);
	}
	.nav-desktop a.active::after {
		transform: scaleX(1);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex-shrink: 0;
	}

	.ow-pill {
		font-size: 0.66rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold-600);
		background: #f7f1e3;
		border: 1px solid #e7d9ba;
		padding: 0.28rem 0.62rem;
		border-radius: 999px;
	}

	.btn-book {
		padding: 0.55rem 1.2rem;
		font-size: 0.86rem;
	}

	.lang {
		color: var(--navy-800);
		font-weight: 700;
		font-size: 0.8rem;
		text-decoration: none;
		padding: 0.35rem 0.72rem;
		border: 1.5px solid var(--line);
		border-radius: 999px;
		transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
	}
	.lang:hover {
		border-color: var(--navy-500);
		background: var(--paper-cool);
	}

	.menu-btn {
		display: none;
		background: none;
		border: 0;
		padding: 0.5rem;
		cursor: pointer;
	}
	.menu-icon {
		display: grid;
		gap: 5px;
		width: 22px;
	}
	.menu-icon i {
		height: 2px;
		background: var(--navy-900);
		border-radius: 2px;
		transition: transform 0.2s var(--ease), opacity 0.2s var(--ease);
	}
	.menu-icon.open i:nth-child(1) { transform: translateY(7px) rotate(45deg); }
	.menu-icon.open i:nth-child(2) { opacity: 0; }
	.menu-icon.open i:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

	.nav-mobile {
		border-top: 1px solid var(--line);
		background: #fff;
		box-shadow: var(--shadow-2);
	}
	.nav-mobile ul {
		list-style: none;
		margin: 0;
		padding: 0.6rem var(--gutter) 1rem;
	}
	.nav-mobile a {
		display: block;
		padding: 0.72rem 0.4rem;
		font-weight: 600;
		color: var(--ink-900);
		text-decoration: none;
		border-bottom: 1px solid var(--paper-cool);
	}

	@media (max-width: 1160px) {
		.nav-desktop {
			display: none;
		}
		.menu-btn {
			display: block;
		}
	}
	@media (max-width: 520px) {
		.ow-pill {
			display: none;
		}
		.brand-word em {
			display: none;
		}
	}
</style>
