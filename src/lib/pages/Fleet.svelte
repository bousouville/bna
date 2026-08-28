<script>
	/** 機隊页 — 乾淨參數卡 + 規格表（幹線/區域/貨運/歷史），無圖示示意 */
	import { t, locale, fmtNum } from '$lib/stores/locale.js';
	import { mainlineFleet, regionalFleet, freighterFleet, heritage, fleetStats } from '$data/fleet.js';
	import { destinations } from '$data/destinations.js';
	import PageHero from '$lib/components/PageHero.svelte';

	let activeMain = $state('a350');
	let activeReg = $state('c909');
	const isEn = $derived($locale === 'en');

	const shortCode = {
		a350: 'A350-1000', a350ulr: 'A350-1000ULR', a330neo: 'A330-900neo', a330: 'A330-300',
		a321xlr: 'A321XLR', a321neo: 'A321neo', c919: 'C919', e190e2: 'E190-E2',
		c909: 'C909', atr72: 'ATR 72-600', atr42: 'ATR 42-600', bae146: 'BAe 146-200QT',
		erj145: 'ERJ-145', a332f: 'A330-200F', a350f: 'A350F', b757f: '757-200PCF',
		b767f: '767-300F', an124: 'An-124-100', an225: 'An-225'
	};

	const typeLabel = (f) => shortCode[f.id] ?? (isEn ? f.name.en : f.name.zh);
</script>

<PageHero title={$t.fleet.title} sub={$t.fleet.intro} />

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
				{@const info = $t.fleet.types[f.id]}
				{@const narrow = f.seats.w === 0}
				<div class="type-panel" role="tabpanel">
					<div class="type-main">
						<div class="type-head">
							<div class="type-code"><span class="code">{typeLabel(f)}</span><span class="reg">{f.regExample}</span></div>
							<p class="role">{info?.role ?? ''}</p>
							<p class="story">{info?.story ?? ''}</p>
							{#if f.note}<p class="note">{isEn ? f.note.en : f.note.zh}</p>{/if}
						</div>
						<dl class="quick">
							<div><dt>{$t.fleet.specUnits}</dt><dd>{f.units > 0 ? f.units : '—'}{f.orders > 0 ? ` + ${f.orders}` : ''}</dd></div>
							<div><dt>{$t.fleet.specSeats}</dt><dd>{f.seats.j + f.seats.w + f.seats.y}</dd></div>
							<div><dt>{$t.fleet.specRange}</dt><dd>{fmtNum(f.rangeKm, $locale)} {$t.common.km}</dd></div>
							<div><dt>{$t.fleet.specFirst}</dt><dd>{f.firstDelivery}</dd></div>
						</dl>
					</div>
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
					{typeLabel(f)}<small>×{f.units}</small>
				</button>
			{/each}
		</div>

		{#each regionalFleet as f (f.id)}
			{#if activeReg === f.id}
				{@const info = $t.fleet.types[f.id]}
				<div class="type-panel reg" role="tabpanel">
					<div class="type-main">
						<div class="type-head">
							<div class="type-code"><span class="code">{typeLabel(f)}</span><span class="reg">{f.regExample}</span></div>
							<p class="role">{info?.role ?? ''}</p>
							<p class="story">{info?.story ?? ''}</p>
							{#if f.note}<p class="note">{isEn ? f.note.en : f.note.zh}</p>{/if}
						</div>
						<dl class="quick">
							<div><dt>{$t.fleet.specUnits}</dt><dd>{f.units}</dd></div>
							<div><dt>{$t.fleet.specSeats}</dt><dd>{f.seats.j + f.seats.y}</dd></div>
							<div><dt>{$t.fleet.specRange}</dt><dd>{fmtNum(f.rangeKm, $locale)} {$t.common.km}</dd></div>
							<div><dt>{$t.fleet.specSpeed}</dt><dd>{f.speedKmh} km/h</dd></div>
						</dl>
					</div>
					<table class="spec-table spec">
						<tbody>
							<tr><th>{$t.fleet.specUnits}</th><td>{f.units}</td></tr>
							<tr><th>{$t.fleet.specSeats}</th><td>{f.seats.j + f.seats.y}{#if f.seats.j > 0}<br /><small>{$t.fleet.seatMixNarrow.replace('{j}', f.seats.j).replace('{y}', f.seats.y)}</small>{/if}</td></tr>
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

<!-- 多代同堂 -->
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
						<span class="code">{typeLabel(f)}</span>
						<span class="chip">{fmtNum(f.payloadT, $locale)} t</span>
					</div>
					<h3>{isEn ? f.name.en : f.name.zh}</h3>
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
		grid-template-columns: minmax(280px, 1fr) minmax(320px, 460px);
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
		animation: fade-in 0.25s ease both;
	}

	.type-main {
		background: var(--paper-cool);
		border-radius: var(--radius);
		padding: 1.4rem 1.5rem;
	}

	.type-code {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin-bottom: 0.6rem;
	}
	.type-code .code {
		font-size: 1.7rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		color: var(--navy-900);
	}
	.type-code .reg {
		font-size: 0.78rem;
		color: var(--text-soft);
		letter-spacing: 0.04em;
	}
	.type-head .role {
		color: var(--gold-600);
		font-weight: 700;
		font-size: 0.92rem;
		margin-bottom: 0.5rem;
	}
	.type-head .story {
		color: var(--text-soft);
		line-height: 1.7;
		margin: 0 0 0.7rem;
	}
	.type-head .note {
		color: var(--navy-700);
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 0.5rem 0.7rem;
		font-size: 0.82rem;
		margin: 0;
	}

	.quick {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem 1rem;
		margin: 1rem 0 0;
	}
	.quick div {
		border-top: 1px dashed var(--line);
		padding-top: 0.45rem;
	}
	.quick dt {
		font-size: 0.72rem;
		color: var(--text-soft);
	}
	.quick dd {
		margin: 0;
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--navy-800);
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
		padding: 1.3rem 1.4rem;
	}
	.freight-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.8rem;
		flex-wrap: wrap;
		margin-bottom: 0.4rem;
	}
	.freight-head .code {
		font-size: 1.25rem;
		font-weight: 800;
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
	.freight-card h3 {
		margin: 0.1rem 0 0.6rem;
		font-size: 0.88rem;
		color: var(--navy-700);
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
		.type-panel { grid-template-columns: 1fr; }
		.freight-grid, .heritage-grid { grid-template-columns: 1fr 1fr; }
	}
	@media (max-width: 720px) {
		.stats-row, .freight-grid, .heritage-grid { grid-template-columns: 1fr 1fr; }
		.freight-facts { grid-template-columns: 1fr; }
	}
</style>
