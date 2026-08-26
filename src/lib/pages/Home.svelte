<script>
	/** 首页（zh: / · en: /en） */
	import { page } from '$app/state';
	import { t, locale, fmtNum } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import { destinations, featuredIata, HUB } from '$data/destinations.js';
	import { haversineKm, blockMinutes, fareQuote } from '$data/booking.js';
	import { fleetStats } from '$data/fleet.js';
	import BookingWidget from '$lib/components/BookingWidget.svelte';
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
	<div class="hero-deco" aria-hidden="true">
		<svg class="deco-svg" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="hline" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stop-color="#B0913F" stop-opacity="0" />
					<stop offset="0.5" stop-color="#C9AC6A" stop-opacity="0.9" />
					<stop offset="1" stop-color="#B0913F" stop-opacity="0" />
				</linearGradient>
			</defs>
			<path d="M-60 640 Q 420 380 780 300 T 1500 130" fill="none" stroke="url(#hline)" stroke-width="2.5" />
			<path d="M-60 700 Q 480 470 900 380 T 1560 230" fill="none" stroke="url(#hline)" stroke-width="1.5" opacity="0.6" />
			<path d="M-60 560 Q 380 300 860 240 T 1500 40" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.2" />
			<g fill="#ffffff">
				<circle cx="220" cy="180" r="1.6" opacity="0.5" /><circle cx="420" cy="90" r="1.2" opacity="0.35" />
				<circle cx="700" cy="150" r="1.8" opacity="0.4" /><circle cx="980" cy="70" r="1.3" opacity="0.45" />
				<circle cx="1180" cy="200" r="1.5" opacity="0.3" /><circle cx="1320" cy="110" r="1.2" opacity="0.5" />
				<circle cx="80" cy="320" r="1.2" opacity="0.3" /><circle cx="560" cy="260" r="1.1" opacity="0.35" />
			</g>
			<!-- 客机剪影（沿航线） -->
			<g transform="translate(880 322) rotate(-11) scale(0.62)" fill="#eef2f9">
				<path d="M0 12 C 10 4 30 0 52 0 L 210 0 C 232 0 244 4 250 10 C 244 16 232 20 210 20 L 52 20 C 30 20 10 18 0 12 Z" />
				<path d="M244 6 L 268 6 L 262 18 L 246 16 Z" opacity="0.95" />
				<path d="M96 14 L 150 44 L 132 46 L 88 18 Z" opacity="0.92" />
				<path d="M30 10 L 52 -22 L 60 -22 L 44 10 Z" opacity="0.95" />
				<ellipse cx="120" cy="24" rx="13" ry="6" opacity="0.9" />
			</g>
		</svg>
	</div>

	<div class="container hero-in">
		<p class="kicker">{$t.home.kicker}</p>
		<h1>{$t.home.title}</h1>
		<p class="sub">{$t.home.sub}</p>
		<div class="cta">
			<a href={destHref} class="btn btn--ghost">{$t.home.ctaNetwork}</a>
		</div>
		<div class="stats">
			<div><strong>{fmtNum(destinations.length, $locale)}</strong><span>{$t.home.stat1}</span></div>
			<div><strong>{fmtNum(fleetStats.inService, $locale)}</strong><span>{$t.home.stat2}</span></div>
			<div><strong>6</strong><span>{$t.home.stat3}</span></div>
			<div><strong>1960</strong><span>{$t.home.stat4}</span></div>
		</div>
	</div>

	<div class="container widget-slot">
		<BookingWidget />
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
	/* ---------- hero ---------- */
	.hero {
		position: relative;
		background: linear-gradient(160deg, #001540 0%, #00205b 55%, #0a2d6e 100%);
		color: #fff;
		padding-top: clamp(3rem, 7vw, 5.5rem);
		overflow: hidden;
	}

	.hero-deco {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.deco-svg {
		width: 100%;
		height: 100%;
	}

	.hero-in {
		position: relative;
		max-width: 780px;
	}

	.hero .kicker {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--gold-300);
		margin-bottom: 1rem;
	}

	.hero h1 {
		font-size: clamp(2.4rem, 6.5vw, 4.2rem);
		font-weight: 800;
		letter-spacing: 0.01em;
		margin-bottom: 0.4em;
	}

	.hero .sub {
		font-size: clamp(1rem, 2vw, 1.15rem);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.88);
		max-width: 620px;
	}

	.cta {
		display: flex;
		gap: 0.9rem;
		margin-top: 1.6rem;
	}

	.stats {
		display: flex;
		gap: clamp(1.5rem, 4vw, 3.2rem);
		margin-top: 2.2rem;
		flex-wrap: wrap;
	}

	.stats strong {
		display: block;
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--gold-300);
	}

	.stats span {
		font-size: 0.82rem;
		opacity: 0.8;
	}

	.widget-slot {
		position: relative;
		margin-top: clamp(1.8rem, 4vw, 2.8rem);
		padding-bottom: clamp(2.2rem, 5vw, 3.5rem);
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
