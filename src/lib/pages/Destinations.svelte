<script>
	/** 航點页 — 3D 地球 + 2D 降级航图 + 分区卡片 */
	import { t, locale, fmtNum } from '$lib/stores/locale.js';
	import { base } from '$app/paths';
	import { destinations, HUB, regions, findDest } from '$data/destinations.js';
	import { haversineKm, blockMinutes } from '$data/booking.js';
	import PageHero from '$lib/components/PageHero.svelte';
	import FlatNetworkMap from '$lib/components/FlatNetworkMap.svelte';

	let regionFilter = $state('all');
	let selected = $state(null);

	const isEn = $derived($locale === 'en');

	/* 给每个目的地补充计算字段 */
	const enriched = $derived(
		destinations.map((d) => {
			const km = haversineKm(HUB, d);
			return { ...d, km, dur: blockMinutes(km) };
		})
	);

	const routes = $derived(
		enriched.map((d) => ({
			key: d.iata,
			from: { lat: HUB.lat, lon: HUB.lon },
			to: { lat: d.lat, lon: d.lon },
			dest: d
		}))
	);

	const filtered = $derived(regionFilter === 'all' ? enriched : enriched.filter((d) => d.region === regionFilter));

	function onSelect(r) {
		selected = r ? r.dest.iata : null;
		if (selected) {
			document.getElementById('dest-' + selected)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function regionName(r) {
		return $t.destinations.regions[r] || r;
	}

	function freqLabel(d) {
		if (d.weekly >= 7) {
			return isEn ? `${Math.round(d.weekly / 7)} daily` : `每日 ${Math.round(d.weekly / 7)} 班`;
		}
		return `${d.weekly} ${$t.destinations.flightsWeek}`;
	}

	function durLabel(min) {
		return `${Math.floor(min / 60)}${$t.common.hr}${String(min % 60).padStart(2, '0')}`;
	}

</script>

<PageHero title={$t.destinations.title} sub={$t.destinations.intro} />

<section class="section">
	<div class="container">
		<FlatNetworkMap {routes} hub={HUB} regionFilter={regionFilter} onselect={onSelect} />
	</div>
</section>

<!-- 港原快線 -->
<section class="section">
	<div class="container shuttle-band">
		<div class="shuttle-copy">
			<p class="eyebrow">{$t.destinations.shuttleTag}</p>
			<h2>{$t.destinations.hkShuttleTitle}</h2>
			<p class="lead">{$t.destinations.hkShuttleBody}</p>
		</div>
		<div class="shuttle-rows">
			{#each $t.destinations.hkShuttleRows as r (r.t)}
				<div class="shuttle-row"><h3>{r.t}</h3><p>{r.d}</p></div>
			{/each}
		</div>
	</div>
</section>

<section class="section section--soft">
	<div class="container">
		<div class="filter-row" role="tablist" aria-label="{regionName('all')}">
			<button class="chip filter" class:active={regionFilter === 'all'} onclick={() => (regionFilter = 'all')} role="tab" aria-selected={regionFilter === 'all'}>
				{$t.destinations.regionAll}
			</button>
			{#each regions as r (r)}
				<button class="chip filter" class:active={regionFilter === r} onclick={() => (regionFilter = r)} role="tab" aria-selected={regionFilter === r}>
					{regionName(r)}
				</button>
			{/each}
		</div>

		<div class="dest-grid">
			{#each filtered as d (d.iata)}
				<article class="card dest-card" class:selected={selected === d.iata} id="dest-{d.iata}">
					<div class="dest-head">
						<h3>{isEn ? d.city.en : d.city.zh}</h3>
						<span class="iata">
							{#if d.shuttle}<span class="chip chip--gold chip-xs">{freqLabel(d)}</span>{/if}
							{d.iata}
						</span>
					</div>
					<p class="airport">{isEn ? d.airport.en : d.airport.zh} · {isEn ? d.country.en : d.country.zh}</p>
					{#if d.note}
						<p class="note">{isEn ? d.note.en : d.note.zh}</p>
					{/if}
					<dl class="dest-facts">
						<div><dt>{$t.destinations.frequency}</dt><dd>{freqLabel(d)}</dd></div>
						<div><dt>{$t.common.duration}</dt><dd>{durLabel(d.dur)}</dd></div>
						<div><dt>{$t.common.distance}</dt><dd>{fmtNum(d.km, $locale)} {$t.common.km}</dd></div>
						<div><dt>{$t.destinations.firstFlight}</dt><dd>{d.since}</dd></div>
					</dl>
					<a class="btn btn--ghost-dark btn-sm" href="{`${base}${isEn ? '/en/booking' : '/booking'}`}?to={d.iata}">{$t.common.book}</a>
				</article>
			{/each}
		</div>

		<p class="dest-foot">{$t.destinations.checkvisas} {$t.destinations.transfer}</p>
	</div>
</section>

<style>
	.filter-row {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		margin-bottom: 1.8rem;
	}

	.filter {
		cursor: pointer;
		border: 1px solid var(--line);
		background: #fff;
		transition: all 0.15s var(--ease);
	}

	.filter:hover {
		border-color: var(--navy-500);
	}

	.filter.active {
		background: var(--navy-800);
		color: #fff;
		border-color: var(--navy-800);
	}

	.dest-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.dest-card {
		padding: 1.3rem 1.4rem;
		display: grid;
		gap: 0.55rem;
		transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease), transform 0.2s var(--ease);
	}

	.dest-card.selected {
		border-color: var(--gold-500);
		box-shadow: 0 0 0 3px rgba(176, 145, 63, 0.18), var(--shadow-2);
		transform: translateY(-2px);
	}

	.dest-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.dest-head h3 {
		margin: 0;
		font-size: 1.15rem;
		color: var(--navy-900);
	}

	.iata {
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--gold-600);
		font-size: 0.9rem;
	}

	.airport {
		font-size: 0.84rem;
		color: var(--text-soft);
		margin: 0;
	}

	.note {
		font-size: 0.82rem;
		color: var(--navy-700);
		background: var(--paper-cool);
		border-radius: 8px;
		padding: 0.45rem 0.7rem;
		margin: 0;
	}

	.dest-facts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem 0.9rem;
		margin: 0.3rem 0 0.7rem;
	}

	.dest-facts div {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		border-bottom: 1px dashed var(--line);
		padding-bottom: 0.3rem;
	}

	.dest-facts dt {
		font-size: 0.78rem;
		color: var(--text-soft);
	}

	.dest-facts dd {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 650;
		color: var(--ink-700);
	}

	.btn-sm {
		padding: 0.5rem 1.1rem;
		font-size: 0.84rem;
		justify-self: start;
	}

	.shuttle-band {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: clamp(2rem, 5vw, 4rem);
		background: linear-gradient(150deg, var(--navy-900), var(--navy-700));
		border-radius: var(--radius);
		color: #fff;
		padding: clamp(1.8rem, 4vw, 2.8rem);
	}

	.shuttle-copy .eyebrow {
		color: var(--gold-300);
	}

	.shuttle-copy h2 {
		color: #fff;
	}

	.shuttle-copy .lead {
		color: rgba(255, 255, 255, 0.85);
	}

	.shuttle-rows {
		display: grid;
		gap: 0.9rem;
	}

	.shuttle-row {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 12px;
		padding: 0.9rem 1.1rem;
	}

	.shuttle-row h3 {
		margin: 0 0 0.25rem;
		font-size: 0.95rem;
		color: var(--gold-300);
	}

	.shuttle-row p {
		margin: 0;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.chip-xs {
		font-size: 0.66rem;
		padding: 0.1rem 0.5rem;
		margin-right: 0.45rem;
	}

	.iata {
		display: inline-flex;
		align-items: center;
	}

	.dest-foot {
		margin-top: 1.6rem;
		color: var(--text-soft);
		font-size: 0.9rem;
	}

	@media (max-width: 960px) {
		.dest-grid {
			grid-template-columns: 1fr 1fr;
		}

		.shuttle-band {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 620px) {
		.dest-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
