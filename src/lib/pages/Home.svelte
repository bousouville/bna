<script>
	/** 首页（zh: / · en: /en） */
	import { page } from '$app/state';
	import { t, locale, fmtNum } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import { destinations, featuredIata, HUB } from '$data/destinations.js';
	import { haversineKm, blockMinutes, fareQuote } from '$data/booking.js';
	import { fleetStats } from '$data/fleet.js';
	import BookingWidget from '$lib/components/BookingWidget.svelte';
	import Mark from '$lib/components/Mark.svelte';
	import NewsCard from '$lib/components/NewsCard.svelte';

	const items = $derived($t.news.items);
	const featured = $derived(
		featuredIata.map((iata) => {
			const d = destinations.find((x) => x.iata === iata);
			const km = haversineKm(HUB, d);
			return { d, km, dur: blockMinutes(km), price: fareQuote(km).light };
		})
	);

	const homeHref = $derived(withBase($locale === 'en' ? '/en' : '/'));
	const destHref = $derived(withBase($locale === 'en' ? '/en/destinations' : '/destinations'));
	const expHref = $derived(withBase($locale === 'en' ? '/en/experience' : '/experience'));
	const oneworldHref = $derived(withBase($locale === 'en' ? '/en/oneworld' : '/oneworld'));
	const supportHref = $derived(withBase($locale === 'en' ? '/en/support' : '/support'));
	const newsHref = $derived(withBase($locale === 'en' ? '/en/news' : '/news'));

	const isEn = $derived($locale === 'en');
</script>

<!-- ============ HERO ============ -->
<section class="hero">
	<div class="hero-bg" aria-hidden="true">
		<Mark variant="white" size={230} />
	</div>
	<div class="container">
		<div class="hero-grid">
			<div class="hero-copy">
				<p class="kicker">{$t.home.kicker}</p>
				<h1>{$t.home.title}</h1>
				<p class="sub">{$t.home.sub}</p>
				<div class="cta">
					<a href={destHref} class="btn btn--gold">{$t.home.ctaNetwork}</a>
				</div>
				<div class="stats">
					<div><strong>{fmtNum(destinations.length, $locale)}</strong><span>{$t.home.stat1}</span></div>
					<div><strong>{fmtNum(fleetStats.inService, $locale)}</strong><span>{$t.home.stat2}</span></div>
					<div><strong>6</strong><span>{$t.home.stat3}</span></div>
					<div><strong>1960</strong><span>{$t.home.stat4}</span></div>
				</div>
			</div>
			<div class="hero-widget">
				<BookingWidget />
			</div>
		</div>
	</div>
</section>

<!-- ============ 品牌主张 ============ -->
<section class="section">
	<div class="container split">
		<div>
			<p class="eyebrow">{$t.home.brandEyebrow}</p>
			<h2>{$t.home.brandTitle}</h2>
			<p class="body">{$t.home.brandBody}</p>
		</div>
		<figure class="quote-card">
			<blockquote>{$t.home.brandQuote}</blockquote>
			<figcaption>{$t.home.brandQuoteBy}</figcaption>
		</figure>
	</div>
</section>

<!-- ============ 精选航线 ============ -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">{$t.home.routesEyebrow}</p>
			<h2>{$t.home.routesTitle}</h2>
			<p>{$t.home.routesBody}</p>
		</div>
		<div class="route-grid">
			{#each featured as f (f.d.iata)}
				<a class="route-card" href="{destHref}?to={f.d.iata}">
					<div class="route-top">
						<span class="route-city">{isEn ? f.d.city.en : f.d.city.zh}</span>
						<span class="route-iata">{HUB.iata} → {f.d.iata}</span>
					</div>
					<div class="route-mid">
						<span>{isEn ? f.d.country.en : f.d.country.zh}</span>
						<span class="dot" aria-hidden="true">·</span>
						<span>{f.dur / 60 | 0}{$t.common.hr}{f.dur % 60}{$t.common.min}</span>
						<span class="dot" aria-hidden="true">·</span>
						<span>{$t.common.direct}</span>
					</div>
					<div class="route-bottom">
						<span class="route-price"><em>{$t.home.fromPrice}</em><strong>BOU {f.price}</strong><small>{$t.common.perAdult}</small></span>
						<span class="route-freq">{f.d.weekly >= 7 ? $t.common.daily : `${f.d.weekly} × / ${$t.common.weekly}`}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ============ 机上体验 ============ -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">{$t.home.cabinEyebrow}</p>
			<h2>{$t.home.cabinTitle}</h2>
			<p>{$t.home.cabinBody}</p>
		</div>
		<div class="cabin-grid">
			{#each ['business', 'premium', 'economy'] as key (key)}
				<article class="cabin-card">
					<h3>{$t.home.cabins[key].name}</h3>
					<p>{$t.home.cabins[key].desc}</p>
				</article>
			{/each}
		</div>
		<div class="center">
			<a href={expHref} class="btn btn--ghost-dark">{$t.home.cabinCta}</a>
		</div>
	</div>
</section>

<!-- ============ 寰宇一家 ============ -->
<section class="section oneworld-band">
	<div class="container split">
		<div>
			<p class="eyebrow gold">{$t.home.oneworldEyebrow}</p>
			<h2>{$t.home.oneworldTitle}</h2>
			<p class="body">{$t.home.oneworldBody}</p>
			<a href={oneworldHref} class="btn btn--gold">{$t.home.oneworldCta}</a>
		</div>
		<div class="ow-mark" aria-hidden="true">
			<svg viewBox="0 0 120 120">
				<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" />
				{#each Array(12) as _, i}
					<ellipse cx="60" cy="60" rx="54" ry="20" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.6" transform="rotate({i * 15} 60 60)" />
				{/each}
				<circle cx="60" cy="60" r="17" fill="#C9AC6A" />
			</svg>
		</div>
	</div>
</section>

<!-- ============ 出发之前 ============ -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">{$t.home.svcEyebrow}</p>
			<h2>{$t.home.svcTitle}</h2>
		</div>
		<div class="svc-grid">
			{#each ['checkin', 'baggage', 'lounge', 'transit'] as k (k)}
				<article class="svc-card">
					<h3>{$t.home.svcItems[k].title}</h3>
					<p>{$t.home.svcItems[k].desc}</p>
				</article>
			{/each}
		</div>
		<div class="center">
			<a href={supportHref} class="btn btn--ghost-dark">{$t.home.svcCta}</a>
		</div>
	</div>
</section>

<!-- ============ 新闻 ============ -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">{$t.home.newsEyebrow}</p>
			<h2>{$t.home.newsTitle}</h2>
		</div>
		<div class="news-grid">
			{#each items.slice(0, 3) as item (item.slug)}
				<NewsCard {item} />
			{/each}
		</div>
		<div class="center">
			<a href={newsHref} class="btn btn--ghost-dark">{$t.home.newsCta}</a>
		</div>
	</div>
</section>

<style>
	/* ---------- hero — 预订优先双栏 ---------- */
	.hero {
		position: relative;
		color: #fff;
		padding-block: clamp(2.8rem, 7vw, 5.4rem);
		overflow: hidden;
		background:
			radial-gradient(90% 80% at 80% 8%, rgba(201, 172, 106, 0.2), transparent 55%),
			radial-gradient(80% 70% at 10% 90%, rgba(30, 79, 174, 0.4), transparent 60%),
			linear-gradient(165deg, #001540 0%, #00205b 55%, #0a2d6e 100%);
	}
	.hero-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}
	.hero-bg :global(img) {
		position: absolute;
		right: -4%;
		top: -16%;
		width: clamp(280px, 34vw, 430px);
		opacity: 0.09;
		filter: saturate(0.3);
	}
	.hero-grid {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}
	.hero-copy {
		max-width: 600px;
	}
	.hero .kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55em;
		font-size: 0.76rem;
		font-weight: 800;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--gold-300);
		margin-bottom: 1.1rem;
	}
	.hero .kicker::before {
		content: '';
		width: 26px;
		height: 2px;
		background: linear-gradient(90deg, var(--gold-400), transparent);
	}
	.hero h1 {
		font-size: clamp(2.4rem, 6vw, 3.9rem);
		font-weight: 800;
		letter-spacing: 0.005em;
		line-height: 1.05;
		margin-bottom: 0.55em;
	}
	.hero .sub {
		font-size: clamp(1rem, 1.9vw, 1.14rem);
		line-height: 1.75;
		color: rgba(255, 255, 255, 0.88);
		max-width: 560px;
	}
	.cta {
		display: flex;
		gap: 0.9rem;
		margin-top: 1.7rem;
	}
	.stats {
		display: flex;
		gap: clamp(1.6rem, 4vw, 3.2rem);
		margin-top: 2.4rem;
		flex-wrap: wrap;
	}
	.stats strong {
		display: block;
		font-size: 1.7rem;
		font-weight: 800;
		color: var(--gold-300);
	}
	.stats span {
		font-size: 0.82rem;
		opacity: 0.8;
	}
	.hero-widget {
		flex-shrink: 0;
		max-width: 560px;
		margin-inline: auto;
		width: 100%;
	}
	@media (max-width: 1000px) {
		.hero-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.hero-copy { max-width: 640px; }
		.hero-widget { max-width: 100%; }
	}

	/* ---------- split ---------- */
	.split {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: clamp(2rem, 6vw, 4.5rem);
		align-items: center;
	}

	.body {
		color: var(--text-soft);
		font-size: 1.02rem;
	}

	.quote-card {
		margin: 0;
		background: linear-gradient(150deg, var(--navy-900), var(--navy-700));
		color: #fff;
		border-radius: var(--radius);
		padding: clamp(1.8rem, 4vw, 2.8rem);
		box-shadow: var(--shadow-2);
		position: relative;
		overflow: hidden;
	}

	.quote-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(115deg, transparent 70%, rgba(201, 172, 106, 0.25) 70.2%, rgba(201, 172, 106, 0.25) 84%, transparent 84.2%);
	}

	.quote-card blockquote {
		margin: 0 0 1rem;
		font-size: clamp(1.4rem, 3vw, 1.9rem);
		font-weight: 700;
		line-height: 1.35;
	}

	.quote-card figcaption {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
	}

	/* ---------- 航线卡片 ---------- */
	.route-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.route-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.2rem 1.3rem;
		text-decoration: none;
		box-shadow: var(--shadow-1);
		transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease), border-color 0.18s var(--ease);
		display: grid;
		gap: 0.55rem;
	}

	.route-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-2);
		border-color: var(--gold-400);
	}

	.route-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.route-city {
		font-size: 1.18rem;
		font-weight: 750;
		color: var(--navy-900);
	}

	.route-iata {
		font-size: 0.8rem;
		font-weight: 650;
		letter-spacing: 0.06em;
		color: var(--gold-600);
	}

	.route-mid {
		font-size: 0.83rem;
		color: var(--text-soft);
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
	}

	.dot {
		opacity: 0.5;
	}

	.route-bottom {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-top: 1px dashed var(--line);
		padding-top: 0.7rem;
		margin-top: 0.2rem;
	}

	.route-price em {
		font-style: normal;
		font-size: 0.72rem;
		color: var(--text-soft);
		margin-right: 0.5em;
	}

	.route-price strong {
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--navy-800);
	}

	.route-price small {
		color: var(--text-soft);
		margin-left: 0.35em;
		font-size: 0.74rem;
	}

	.route-freq {
		font-size: 0.78rem;
		font-weight: 650;
		color: var(--ink-500);
	}

	/* ---------- cabins ---------- */
	.cabin-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
		margin-bottom: 1.8rem;
	}

	.cabin-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.5rem 1.5rem 1.3rem;
		box-shadow: var(--shadow-1);
		position: relative;
		overflow: hidden;
	}

	.cabin-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--navy-800), var(--gold-400));
	}

	.cabin-card h3 {
		font-size: 1.08rem;
		color: var(--navy-900);
	}

	.cabin-card p {
		color: var(--text-soft);
		font-size: 0.92rem;
		margin: 0;
	}

	.center {
		text-align: center;
		margin-top: 1.6rem;
	}

	/* ---------- oneworld band ---------- */
	.oneworld-band {
		background: linear-gradient(140deg, var(--navy-900), var(--navy-700));
		color: #fff;
	}

	.oneworld-band .body {
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: 1.8rem;
	}

	.eyebrow.gold {
		color: var(--gold-300);
	}

	.ow-mark {
		display: grid;
		place-items: center;
	}

	.ow-mark svg {
		width: min(240px, 60%);
		opacity: 0.9;
	}

	/* ---------- svc ---------- */
	.svc-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
		margin-bottom: 0.4rem;
	}

	.svc-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.3rem 1.3rem 1.2rem;
		box-shadow: var(--shadow-1);
	}

	.svc-card h3 {
		font-size: 1rem;
		color: var(--navy-900);
	}

	.svc-card p {
		font-size: 0.86rem;
		color: var(--text-soft);
		margin: 0;
	}

	/* ---------- news ---------- */
	.news-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	@media (max-width: 960px) {
		.split {
			grid-template-columns: 1fr;
		}

		.route-grid,
		.cabin-grid,
		.news-grid {
			grid-template-columns: 1fr 1fr;
		}

		.svc-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 620px) {
		.route-grid,
		.cabin-grid,
		.news-grid,
		.svc-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
