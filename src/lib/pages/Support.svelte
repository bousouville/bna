<script>
	/** 旅行支援 */
	import { t, locale } from '$lib/stores/locale.js';
	import PageHero from '$lib/components/PageHero.svelte';

	const isEn = $derived($locale === 'en');
</script>

<PageHero title={$t.support.title} sub={$t.support.intro} />

<!-- 行李 -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.support.baggageTitle}</h2>
			<p>{$t.support.baggageIntro}</p>
		</div>
		<div class="card table-wrap">
			<table class="spec-table wide">
				<thead>
					<tr>
						<th>{$t.support.baggageTable.quality}</th>
						<th>{$t.support.baggageTable.cabinBag}</th>
						<th>{$t.support.baggageTable.checkBag}</th>
					</tr>
				</thead>
				<tbody>
					{#each $t.support.baggageTable.rows as r (r.q)}
						<tr><td>{r.q}</td><td>{r.c}</td><td>{r.b}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
		<ul class="note-list">
			{#each $t.support.baggageNotes as n (n)}
				<li>{n}</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 值机 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.support.checkinTitle}</h2>
		</div>
		<div class="grid4">
			{#each $t.support.checkinItems as c (c.t)}
				<article class="card mini">
					<h3>{c.t}</h3>
					<p>{c.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- 机场指南 -->
<section class="section">
	<div class="container airport">
		<div class="section-head">
			<h2>{$t.support.airportTitle}</h2>
		</div>
		<div class="airport-stats">
			{#each $t.support.airportStats as st (st.k)}
				<div class="astat"><strong>{st.v}</strong><span>{st.k}</span></div>
			{/each}
		</div>
		<ul class="airport-list">
			{#each Object.entries($t.support.airportRows) as [k, v] (k)}
				<li>{v}</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 機場沿革 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.support.airportHistoryTitle}</h2>
		</div>
		<ol class="history">
			{#each $t.support.airportHistory as ev (ev.y)}
				<li>
					<span class="year">{ev.y}</span>
					<p>{ev.t}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 特殊服务 -->
<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.support.assistTitle}</h2>
		</div>
		<div class="grid4">
			{#each $t.support.assistItems as a (a.t)}
				<article class="card mini">
					<h3>{a.t}</h3>
					<p>{a.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- 联络 -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.support.contactTitle}</h2>
			<p>{$t.support.contactIntro}</p>
		</div>
		<div class="office-grid">
			{#each $t.support.offices as o (o.c)}
				<article class="card office">
					<h3>{o.c}</h3>
					<p>{o.a}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.table-wrap {
		overflow-x: auto;
		padding: 0.4rem 0.8rem;
	}

	.wide th:first-child,
	.wide td:first-child {
		width: 220px;
	}

	.note-list {
		margin: 1.4rem 0 0;
		padding-left: 1.2rem;
		color: var(--text-soft);
		font-size: 0.92rem;
		display: grid;
		gap: 0.45rem;
	}

	.grid4 {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
	}

	.mini {
		padding: 1.25rem;
	}

	.mini h3 {
		font-size: 0.98rem;
		color: var(--navy-900);
	}

	.mini p {
		margin: 0;
		font-size: 0.86rem;
		color: var(--text-soft);
	}



	.airport-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.9rem;
	}

	.airport-list li {
		padding: 0.9rem 1.1rem;
		background: var(--paper-cool);
		border-radius: 10px;
		font-size: 0.92rem;
		color: var(--ink-700);
	}

	.airport-stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.8rem;
		margin-bottom: 1.4rem;
	}
	.astat {
		background: linear-gradient(150deg, var(--navy-900), var(--navy-700));
		color: #fff;
		border-radius: 12px;
		padding: 0.9rem 1rem;
	}
	.astat strong {
		display: block;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--gold-300);
		line-height: 1.35;
	}
	.astat span {
		font-size: 0.75rem;
		opacity: 0.8;
	}
	@media (max-width: 860px) {
		.airport-stats { grid-template-columns: 1fr 1fr; }
	}

	.history {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		max-width: 760px;
		position: relative;
	}

	.history li {
		display: grid;
		grid-template-columns: 52px 1fr;
		gap: 1.2rem;
		align-items: baseline;
	}

	.history .year {
		font-weight: 800;
		color: var(--navy-800);
		background: var(--paper-cool);
		border-radius: 8px;
		padding: 0.12rem 0.4rem;
		font-size: 0.85rem;
		text-align: center;
	}

	.history p {
		margin: 0;
		color: var(--ink-700);
	}

	.office-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
	}

	.office {
		padding: 1.2rem;
	}

	.office h3 {
		font-size: 1rem;
		color: var(--navy-900);
	}

	.office p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-soft);
	}

	@media (max-width: 960px) {
		.grid4,
		.office-grid {
			grid-template-columns: 1fr 1fr;
		}


	}

	@media (max-width: 620px) {
		.grid4,
		.office-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
