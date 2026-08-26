<script>
	/** 關於我們 */
	import { t, locale } from '$lib/stores/locale.js';
	import PageHero from '$lib/components/PageHero.svelte';
	import { base } from '$app/paths';

	const isEn = $derived($locale === 'en');
</script>

<PageHero title={$t.about.title} sub={$t.about.intro} />

<!-- 运营识别 -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.about.identityTitle}</h2>
		</div>
		<div class="identity-grid">
			<div class="card id-card">
				<table class="spec-table">
					<tbody>
						<tr><th>{$t.about.rows.fullName}</th><td>{isEn ? 'Bousouville National Airways Corporation Limited' : '布索維爾國家航空股份有限公司'}</td></tr>
						<tr><th>{$t.about.rows.iata}</th><td>BN</td></tr>
						<tr><th>{$t.about.rows.icao}</th><td>BNA</td></tr>
						<tr><th>{$t.about.rows.callsign}</th><td>{$t.about.rows.callsignValue}</td></tr>
						<tr><th>{$t.about.rows.registry}</th><td>{$t.about.rows.registryValue}</td></tr>
						<tr><th>{$t.about.rows.hub}</th><td>{$t.about.rows.hubValue}</td></tr>
						<tr><th>{$t.about.rows.founded}</th><td>{isEn ? '1960 (reconstituted 1975)' : '1960 年（1975 年改制）'}</td></tr>
						<tr><th>{$t.about.rows.alliance}</th><td>oneworld · {isEn ? 'since 2007' : '2007 年加入'}</td></tr>
						<tr><th>{$t.about.rows.hq}</th><td>{isEn ? '15–42 Government Offices Avenue, Crown District, Yuen Hoi' : '原海市王冠區官署大道 15–42 號'}</td></tr>
					</tbody>
				</table>
			</div>
			<div class="callsign-story">
				<h3>HONGHU · 鴻鵠</h3>
				<p>{$t.about.callsignStory}</p>
			</div>
		</div>
	</div>
</section>

<!-- 沿革 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.about.timelineTitle}</h2>
		</div>
		<ol class="timeline">
			{#each $t.about.timeline as ev (ev.y)}
				<li>
					<span class="year">{ev.y}</span>
					<p>{ev.t}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 品牌与涂装 -->
<section class="section">
	<div class="container">
		<div class="brand-grid">
			<div>
				<p class="eyebrow">{isEn ? 'Brand' : '品牌'}</p>
				<h2>{$t.about.brandTitle}</h2>
				<p class="lead">{$t.about.brandBody}</p>
				<div class="swatch-row">
					<span class="swatch" style="background:#00205b"></span>
					<span class="swatch-label">{$t.about.brandColors.blue}</span>
					<span class="swatch" style="background:#b0913f"></span>
					<span class="swatch-label">{$t.about.brandColors.gold}</span>
				</div>
			</div>
			<figure class="logo-figure">
				<img src={`${base}/brand/logo-full.webp`} alt="BNA logo" loading="lazy" />
			</figure>
		</div>

		<div class="livery-band">
			<div class="livery-copy">
				<h3>{$t.about.liveryTitle}</h3>
				<p>{$t.about.liveryBody}</p>
			</div>
			<div class="livery-fig">
				<img src={`${base}/img/a330-side.webp`} alt="A330-300 standard livery" loading="lazy" />
			</div>
		</div>
	</div>
</section>

<!-- 可持续发展 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.about.sustainTitle}</h2>
			<p>{$t.about.sustainBody}</p>
		</div>
		<div class="sus-grid">
			{#each $t.about.sustainItems as s (s.t)}
				<article class="card sus-card">
					<h3>{s.t}</h3>
					<p>{s.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- 集团与货运 -->
<section class="section">
	<div class="container split">
		<article>
			<h2>{$t.about.groupTitle}</h2>
			<p class="lead">{$t.about.groupBody}</p>
			<div class="group-links">
				<a class="chip" href="https://bousoville.hk.cn/en/government/ministries/aviation-holdings-bah/" target="_blank" rel="noopener noreferrer">BAH ↗</a>
				<a class="chip" href="https://bousoville.hk.cn/en/government/ministries/airports-group-bag/" target="_blank" rel="noopener noreferrer">BAG ↗</a>
				<a class="chip" href="https://bousoville.hk.cn/en/government/ministries/civil-aviation/" target="_blank" rel="noopener noreferrer">{isEn ? 'Civil Aviation Authority' : '民航局'} ↗</a>
			</div>
		</article>
		<article>
			<h2>{$t.about.cargo}</h2>
			<p class="lead">{$t.about.cargoBody}</p>
		</article>
	</div>
</section>

<!-- 联络 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.about.contactTitle}</h2>
		</div>
		<div class="contact-grid">
			<div class="card contact-card">
				<table class="spec-table">
					<tbody>
						<tr><th>{$t.about.contactRows.hq}</th><td>{isEn ? '15–42 Government Offices Avenue, Crown District, Yuen Hoi' : '原海市王冠區官署大道 15–42 號'}</td></tr>
						<tr><th>{$t.about.contactRows.tel}</th><td>{$t.about.contactRows.telValue}</td></tr>
						<tr><th>{$t.about.contactRows.hours}</th><td>{$t.about.contactRows.hoursValue}</td></tr>
						<tr><th>{$t.about.contactRows.offices}</th><td>{$t.about.contactRows.officesValue}</td></tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<style>
	.identity-grid {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
	}

	.id-card {
		padding: 0.5rem 0.9rem;
	}

	.callsign-story h3 {
		font-size: 1.5rem;
		letter-spacing: 0.12em;
		color: var(--gold-600);
	}

	.callsign-story p {
		color: var(--text-soft);
	}

	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
		display: grid;
		gap: 1.2rem;
		max-width: 720px;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 47px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: linear-gradient(var(--gold-500), var(--navy-300));
	}

	.timeline li {
		display: grid;
		grid-template-columns: 38px 1fr;
		gap: 1.4rem;
		align-items: start;
		position: relative;
	}

	.timeline .year {
		font-weight: 800;
		color: var(--navy-800);
		text-align: right;
		background: var(--paper-cool);
		border-radius: 8px;
		padding: 0.15rem 0.4rem;
		font-size: 0.86rem;
		position: relative;
		z-index: 1;
	}

	.timeline p {
		margin: 0;
		padding-top: 0.1rem;
		color: var(--ink-700);
	}

	.brand-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}

	.lead {
		color: var(--text-soft);
	}

	.swatch-row {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
		margin-top: 1.2rem;
	}

	.swatch {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.swatch-label {
		font-size: 0.8rem;
		color: var(--text-soft);
		margin-right: 1rem;
	}

	.logo-figure {
		margin: 0;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow-1);
		padding: 2rem;
		display: grid;
		place-items: center;
	}

	.logo-figure img {
		max-width: 360px;
	}

	.livery-band {
		margin-top: clamp(2rem, 5vw, 3.2rem);
		background: linear-gradient(150deg, var(--navy-900), var(--navy-700));
		border-radius: var(--radius);
		color: #fff;
		padding: clamp(1.6rem, 4vw, 2.6rem);
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 2rem;
		align-items: center;
	}

	.livery-copy h3 {
		color: #fff;
		font-size: 1.25rem;
	}

	.livery-copy p {
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.92rem;
		margin: 0;
	}

	.livery-fig {
		background: #fff;
		border-radius: 12px;
		padding: 1rem;
	}

	.sus-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
	}

	.sus-card {
		padding: 1.3rem;
	}

	.sus-card h3 {
		font-size: 0.98rem;
		color: var(--navy-900);
	}

	.sus-card p {
		margin: 0;
		font-size: 0.86rem;
		color: var(--text-soft);
	}

	.split {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: clamp(2rem, 5vw, 4rem);
	}

	.group-links {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.group-links .chip {
		text-decoration: none;
	}

	.contact-grid {
		max-width: 680px;
	}

	.contact-card {
		padding: 0.5rem 0.9rem;
	}

	@media (max-width: 960px) {
		.identity-grid,
		.brand-grid,
		.livery-band,
		.split {
			grid-template-columns: 1fr;
		}

		.sus-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 620px) {
		.sus-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
