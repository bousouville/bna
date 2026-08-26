<script>
	/** 機隊页 — 幹線 / 區域支線 / 貨機 分組展示 + 歷史機隊 */
	import { t, locale, fmtNum } from '$lib/stores/locale.js';
	import { mainlineFleet, regionalFleet, freighterFleet, heritage, fleetStats } from '$data/fleet.js';
	import { destinations } from '$data/destinations.js';
	import PageHero from '$lib/components/PageHero.svelte';
	import { base } from '$app/paths';
	import AircraftViewer from '$lib/components/AircraftViewer.svelte';

	let activeMain = $state('a350');
	let activeReg = $state('c909');
	const isEn = $derived($locale === 'en');

	const typeLabel = (f) =>
		isEn
			? f.name.en.replace('Airbus ', '').replace('Boeing ', '').replace('COMAC ', '').replace('Embraer ', '').replace('Antonov ', '')
			: f.name.zh.replace('空中客車 ', '').replace('波音 ', '').replace('中國商飛 ', '').replace('巴航工業 ', '').replace('安托諾夫 ', '');
</script>

<PageHero title={$t.fleet.title} sub={$t.fleet.intro} />

<!-- 概览统计 -->
<section class="section fleet-stats-band">
	<div class="container stats-row">
		<div><strong>{fleetStats.inService}</strong><span>{$t.fleet.statsInService}</span></div>
		<div><strong>{fleetStats.onOrder}</strong><span>{$t.fleet.statsOrders}</span></div>
		<div><strong>{fleetStats.avgAge}</strong><span>{$t.fleet.statsAverage}</span></div>
		<div><strong>{destinations.length}</strong><span>{$t.fleet.statsDest}</span></div>
	</div>
</section>

<!-- 主線客機 -->
<section class="section">
	<div class="container">
		<h2 class="group-h">{$t.fleet.groups.mainline}</h2>
		<div class="type-tabs" role="tablist" aria-label="{$t.fleet.groups.mainline}">
			{#each mainlineFleet as f (f.id)}
				<button role="tab" aria-selected={activeMain === f.id} class:active={activeMain === f.id} onclick={() => (activeMain = f.id)}>
					{typeLabel(f)}
					{#if f.orders > 0}<small>+{f.orders}</small>{/if}
				</button>
			{/each}
		</div>

		{#each mainlineFleet as f (f.id)}
			{#if activeMain === f.id}
				{@const len = (f.lengthM / 84) * 460 + 40}
				{@const narrow = f.seats.w === 0}
				{@const info = $t.fleet.types[f.id]}
				<div class="type-panel" role="tabpanel">
					<div class="type-head">
						<div>
							<h3>{isEn ? f.name.en : f.name.zh}</h3>
							<p class="role">{info?.role ?? ''}</p>
							<p class="story">{info?.story ?? ''}</p>
						</div>
					</div>

					{#if f.viewer === 'a330'}
						<div class="viewer-wrap">
							<AircraftViewer>
								<!-- 3D 降级：涂装侧视图（设计蓝图卡） -->
								<figure class="blueprint">
									<img src={`${base}/img/a330-side.webp`} alt="{isEn ? f.name.en : f.name.zh} — BNA livery" loading="lazy" />
									<figcaption>{f.regExample} · {isEn ? 'A330 family' : 'A330 系列'}</figcaption>
								</figure>
							</AircraftViewer>
						</div>
					{:else if f.viewer === 'a350'}
						<figure class="blueprint a350">
							<svg viewBox="0 0 560 120" aria-hidden="true">
								<g fill="none" stroke="var(--navy-700)" stroke-width="2">
									<path d="M{280 - len / 2} 64 q {len * 0.1} -12 {len * 0.28} -12 h {len * 0.4} q {len * 0.17} 0 {len * 0.22} 12 q -{len * 0.05} 9 -{len * 0.2} 9 h -{len * 0.44} q -{len * 0.13} 0 -{len * 0.26} -9 Z" fill="#eef2f9" />
									<path d="M296 54 L{296 + len * 0.24} 14 L{296 + len * 0.24 + 12} 16 L{302 + len * 0.06} 56 Z" fill="#00205b" opacity="0.9" />
									<path d="M{280 - len * 0.14} 60 L{280 - len * 0.24} 26 L{280 - len * 0.24 + 10} 24 L{280 - len * 0.1} 58 Z" fill="#00205b" opacity="0.9" />
									<path d="M286 52 L{286 + len * 0.2} 38 L{286 + len * 0.2 + 6} 46 L292 62 Z" fill="#b0913f" opacity="0.9" />
									<ellipse cx="{280 - len * 0.06}" cy="70" rx="11" ry="7" fill="#00205b" />
									<ellipse cx="{280 - len * 0.15}" cy="70" rx="11" ry="7" fill="#00205b" />
								</g>
							</svg>
							<figcaption>{isEn ? f.name.en : f.name.zh} · {f.regExample}</figcaption>
						</figure>
					{:else}
						<figure class="blueprint alt">
							<svg viewBox="0 0 560 120" aria-hidden="true">
								<g fill="none" stroke="var(--navy-700)" stroke-width="2">
									<path d="M{280 - len / 2} 64 q {len * 0.12} -13 {len * 0.3} -13 h {len * 0.38} q {len * 0.16} 0 {len * 0.2} 13 q -{len * 0.06} 9 -{len * 0.22} 9 h -{len * 0.4} q -{len * 0.14} 0 -{len * 0.26} -9 Z" fill="#eef2f9" />
									<path d="M300 56 L360 20 L372 22 L318 58 Z" fill="#00205b" opacity="0.9" />
									<path d="M212 60 L178 30 L188 28 L226 58 Z" fill="#00205b" opacity="0.9" />
									<path d="M290 52 L340 40 L346 48 L296 62 Z" fill="#b0913f" opacity="0.9" />
									<ellipse cx="308" cy="70" rx="12" ry="7" fill="#00205b" />
									<ellipse cx="272" cy="70" rx="12" ry="7" fill="#00205b" />
								</g>
							</svg>
							<figcaption>{isEn ? f.name.en : f.name.zh} · {f.regExample}</figcaption>
						</figure>
					{/if}

					<table class="spec-table spec">
						<tbody>
							<tr><th>{$t.fleet.specUnits}</th><td>{f.units > 0 ? f.units : '—'}{f.orders > 0 ? ` + ${f.orders} (${$t.fleet.orderNote})` : ''}</td></tr>
							{#if !narrow}
								<tr><th>{$t.fleet.specSeats}</th><td>{f.seats.j + f.seats.w + f.seats.y}<br /><small>{$t.fleet.seatMix.replace('{j}', f.seats.j).replace('{w}', f.seats.w).replace('{y}', f.seats.y)}</small></td></tr>
							{:else}
								<tr><th>{$t.fleet.specSeats}</th><td>{f.seats.j + f.seats.y}<br /><small>{$t.fleet.seatMixNarrow.replace('{j}', f.seats.j).replace('{y}', f.seats.y)}</small></td></tr>
							{/if}
							<tr><th>{$t.fleet.specRange}</th><td>{fmtNum(f.rangeKm, $locale)} {$t.common.km}</td></tr>
							<tr><th>{$t.fleet.specLength}</th><td>{f.lengthM} m</td></tr>
							<tr><th>{$t.fleet.specSpan}</th><td>{f.spanM} m</td></tr>
							<tr><th>{$t.fleet.specSpeed}</th><td>{f.speedKmh} km/h</td></tr>
							<tr><th>{$t.fleet.specEngines}</th><td>{isEn ? f.engines.en : f.engines.zh}</td></tr>
							<tr><th>{$t.fleet.specFirst}</th><td>{f.firstDelivery}</td></tr>
						</tbody>
					</table>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- 區域與支線 -->
<section class="section section--soft">
	<div class="container">
		<h2 class="group-h">{$t.fleet.groups.regional}</h2>
		<div class="type-tabs" role="tablist" aria-label="{$t.fleet.groups.regional}">
			{#each regionalFleet as f (f.id)}
				<button role="tab" aria-selected={activeReg === f.id} class:active={activeReg === f.id} onclick={() => (activeReg = f.id)}>
					{typeLabel(f)}
					<small>×{f.units}</small>
				</button>
			{/each}
		</div>

		{#each regionalFleet as f (f.id)}
			{#if activeReg === f.id}
				{@const len = (f.lengthM / 84) * 460 + 40}
				{@const info = $t.fleet.types[f.id]}
				<div class="type-panel reg" role="tabpanel">
					<div class="type-head">
						<div>
							<h3>{isEn ? f.name.en : f.name.zh}</h3>
							<p class="role">{info?.role ?? ''}</p>
							<p class="story">{info?.story ?? ''}</p>
						</div>
					</div>
					<figure class="blueprint alt">
						<svg viewBox="0 0 560 120" aria-hidden="true">
							<g fill="none" stroke="var(--navy-700)" stroke-width="2">
								<path d="M{280 - len / 2} 66 q {len * 0.14} -10 {len * 0.32} -10 h {len * 0.36} q {len * 0.16} 0 {len * 0.18} 10 q -{len * 0.08} 8 -{len * 0.24} 8 h -{len * 0.38} q -{len * 0.16} 0 -{len * 0.24} -8 Z" fill="#eef2f9" />
								<path d="M{280 - len * 0.02} 56 L{280 + len * 0.18} 30 L{280 + len * 0.18 + 10} 32 L{280 + len * 0.04} 58 Z" fill="#00205b" opacity="0.9" />
								<path d="M{280 - len * 0.12} 62 L{280 - len * 0.19} 40 L{280 - len * 0.19 + 8} 38 L{280 - len * 0.08} 60 Z" fill="#00205b" opacity="0.9" />
							</g>
						</svg>
						<figcaption>{isEn ? f.name.en : f.name.zh} · {f.regExample}</figcaption>
					</figure>
					<table class="spec-table spec">
						<tbody>
							<tr><th>{$t.fleet.specUnits}</th><td>{f.units}</td></tr>
							<tr><th>{$t.fleet.specSeats}</th><td>{f.seats.j + f.seats.y}{#if f.seats.j > 0}<br /><small>{$t.fleet.seatMixNarrow.replace('{j}', f.seats.j).replace('{y}', f.seats.y)}</small>{/if}</td></tr>
							<tr><th>{$t.fleet.specRange}</th><td>{fmtNum(f.rangeKm, $locale)} {$t.common.km}</td></tr>
							<tr><th>{$t.fleet.specSpeed}</th><td>{f.speedKmh} km/h</td></tr>
							<tr><th>{$t.fleet.specEngines}</th><td>{isEn ? f.engines.en : f.engines.zh}</td></tr>
							<tr><th>{$t.fleet.specFirst}</th><td>{f.firstDelivery}</td></tr>
						</tbody>
					</table>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- 多代同堂策略 -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.fleet.mixTitle}</h2>
			<p>{$t.fleet.mixBody}</p>
		</div>
	</div>
</section>

<!-- 貨運機隊 -->
<section class="section section--soft">
	<div class="container">
		<h2 class="group-h">{$t.fleet.groups.freight}</h2>
		<div class="freight-grid">
			{#each freighterFleet as f (f.id)}
				<article class="card freight-card">
					<div class="freight-head">
						<h3>{isEn ? f.name.en : f.name.zh}</h3>
						<span class="chip">{fmtNum(f.payloadT, $locale)} t</span>
					</div>
					<p>{isEn ? f.note?.en : f.note?.zh}</p>
					<dl class="freight-facts">
						<div><dt>{$t.fleet.specUnits}</dt><dd>{f.units > 0 ? f.units : '—'}{f.orders > 0 ? ` + ${f.orders}` : ''}</dd></div>
						<div><dt>{$t.fleet.specRange}</dt><dd>{fmtNum(f.rangeKm, $locale)} {$t.common.km}</dd></div>
						<div><dt>{$t.fleet.specFirst}</dt><dd>{f.firstDelivery}</dd></div>
					</dl>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- 歷史機隊 -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.fleet.heritageTitle}</h2>
		</div>
		<div class="heritage-grid">
			{#each heritage as h (h.id)}
				<article class="card heritage-card">
					<span class="years">{h.years}</span>
					<h3>{isEn ? h.name.en : h.name.zh}</h3>
					<p>{$t.fleet.heritage[h.id]}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.fleet-stats-band {
		background: linear-gradient(140deg, var(--navy-900), var(--navy-700));
		color: #fff;
		padding-block: 2.2rem;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		text-align: center;
	}

	.stats-row strong {
		display: block;
		font-size: 2rem;
		font-weight: 800;
		color: var(--gold-300);
	}

	.stats-row span {
		font-size: 0.85rem;
		opacity: 0.8;
	}

	.group-h {
		font-size: 1.35rem;
		color: var(--navy-900);
		margin-bottom: 1.1rem;
	}

	.type-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 1.4rem;
	}

	.type-tabs button {
		border: 1px solid var(--line);
		background: #fff;
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		font-size: 0.86rem;
		cursor: pointer;
		color: var(--ink-700);
	}

	.type-tabs button.active {
		background: var(--navy-800);
		border-color: var(--navy-800);
		color: #fff;
	}

	.type-tabs small {
		opacity: 0.65;
		margin-left: 0.25rem;
	}

	.type-panel {
		display: grid;
		grid-template-columns: minmax(260px, 1fr) minmax(300px, 420px);
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
		animation: fade-in 0.25s ease both;
	}

	.type-head .role {
		color: var(--gold-600);
		font-weight: 700;
		font-size: 0.92rem;
		margin-bottom: 0.5rem;
	}

	.type-head .story {
		color: var(--text-soft);
		line-height: 1.75;
	}

	.blueprint {
		background:
			repeating-linear-gradient(90deg, rgba(0, 32, 91, 0.04) 0 1px, transparent 1px 22px),
			repeating-linear-gradient(rgba(0, 32, 91, 0.04) 0 1px, transparent 1px 22px),
			#fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1rem;
		text-align: center;
	}

	.blueprint figcaption {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		color: var(--text-soft);
	}

	.viewer-wrap {
		grid-column: 1 / -1;
	}

	.spec {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.spec th {
		text-align: left;
		color: var(--text-soft);
		font-weight: 500;
		padding: 0.42rem 0.75rem 0.42rem 0;
		width: 44%;
		vertical-align: top;
		border-top: 1px dashed var(--line);
	}

	.spec td {
		padding: 0.42rem 0;
		border-top: 1px dashed var(--line);
		color: var(--ink-700);
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: none; }
	}

	.freight-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.freight-card {
		padding: 1.4rem 1.5rem;
	}

	.freight-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.8rem;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}

	.freight-head h3 {
		font-size: 1.02rem;
		color: var(--navy-900);
	}

	.freight-head .chip {
		font-size: 0.74rem;
		background: var(--paper-cool);
		border-radius: 999px;
		padding: 0.12rem 0.55rem;
		color: var(--navy-800);
		font-weight: 700;
	}

	.freight-card p {
		margin: 0 0 0.9rem;
		font-size: 0.88rem;
		color: var(--text-soft);
		min-height: 3.2em;
	}

	.freight-facts {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6rem;
	}

	.freight-facts div {
		border-top: 1px dashed var(--line);
		padding-top: 0.45rem;
	}

	.freight-facts dt {
		font-size: 0.72rem;
		color: var(--text-soft);
	}

	.freight-facts dd {
		margin: 0;
		font-weight: 700;
		font-size: 0.88rem;
		color: var(--navy-800);
	}

	.heritage-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.heritage-card {
		padding: 1.3rem 1.4rem;
		position: relative;
	}

	.heritage-card .years {
		font-size: 0.76rem;
		font-weight: 800;
		color: var(--gold-600);
		letter-spacing: 0.04em;
	}

	.heritage-card h3 {
		margin: 0.35rem 0 0.4rem;
		font-size: 1.02rem;
		color: var(--navy-900);
	}

	.heritage-card p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-soft);
		line-height: 1.65;
	}

	@media (max-width: 960px) {
		.type-panel {
			grid-template-columns: 1fr;
		}

		.freight-grid,
		.heritage-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 720px) {
		.stats-row,
		.freight-grid,
		.heritage-grid {
			grid-template-columns: 1fr 1fr;
		}

		.freight-facts {
			grid-template-columns: 1fr;
		}
	}
</style>
