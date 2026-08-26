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
		{ href: '/experience', key: 'experience' },
		{ href: '/fleet', key: 'fleet' },
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
	<div class="utility">
		<div class="container utility-in">
			<span class="ow">oneworld member</span>
			<span class="codes">BN · BNA · HONGHU</span>
			<a class="lang" href={swapLocalePath(page.url.pathname, $locale === 'zh' ? 'en' : 'zh')} hreflang={$locale === 'zh' ? 'en' : 'zh'}>
				{$t.nav.language}
			</a>
		</div>
	</div>

	<div class="mainbar">
		<div class="container mainbar-in">
			<a class="brand" href={homeHref($locale)} aria-label="BNA — {$t.nav.home}">
				<Mark size={30} />
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
				<a class="btn btn--primary btn-book" href={sectionHref('/booking', $locale)}>{$t.common.book}</a>
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
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--line);
	}

	.utility {
		background: var(--navy-900);
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
	}

	.utility-in {
		display: flex;
		gap: 1.2rem;
		align-items: center;
		padding-block: 0.32rem;
	}

	.utility .ow {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--gold-300);
	}

	.utility .codes {
		opacity: 0.75;
	}

	.lang {
		margin-left: auto;
		color: #fff;
		font-weight: 600;
		text-decoration: none;
		padding: 0.15rem 0.6rem;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 999px;
		transition: background 0.15s var(--ease);
	}

	.lang:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.mainbar-in {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-block: 0.7rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		text-decoration: none;
		color: var(--navy-900);
	}

	.brand-word {
		display: grid;
		line-height: 1.15;
	}

	.brand-word strong {
		font-size: 1.18rem;
		letter-spacing: 0.16em;
		font-weight: 800;
	}

	.brand-word em {
		font-style: normal;
		font-size: 0.56rem;
		letter-spacing: 0.14em;
		color: var(--ink-500);
	}

	.nav-desktop {
		margin-left: auto;
	}

	.nav-desktop ul {
		display: flex;
		gap: 0.15rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-desktop a {
		display: block;
		padding: 0.45rem 0.72rem;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ink-700);
		text-decoration: none;
		transition: background 0.15s var(--ease), color 0.15s var(--ease);
	}

	.nav-desktop a:hover {
		background: var(--paper-cool);
		color: var(--navy-800);
	}

	.nav-desktop a.active {
		color: var(--navy-800);
		background: var(--paper-cool);
		box-shadow: inset 0 -2px 0 var(--gold-500);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.btn-book {
		padding: 0.55rem 1.25rem;
		font-size: 0.88rem;
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

	.menu-icon.open i:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.menu-icon.open i:nth-child(2) {
		opacity: 0;
	}

	.menu-icon.open i:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

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
		padding: 0.7rem 0.4rem;
		font-weight: 600;
		color: var(--ink-900);
		text-decoration: none;
		border-bottom: 1px solid var(--paper-cool);
	}

	@media (max-width: 1080px) {
		.nav-desktop {
			display: none;
		}

		.menu-btn {
			display: block;
		}

		.codes {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.brand-word em {
			display: none;
		}
	}
</style>
