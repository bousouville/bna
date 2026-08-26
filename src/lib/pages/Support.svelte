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
		<div class="airport-copy">
			<div class="section-head">
				<h2>{$t.support.airportTitle}</h2>
			</div>
			<ul class="airport-list">
				{#each Object.entries($t.support.airportRows) as [k, v] (k)}
					<li>{v}</li>
				{/each}
			</ul>
		</div>
		<div class="airport-visual" aria-hidden="true">
			<svg viewBox="0 0 300 220">
				<rect width="300" height="220" rx="12" fill="#00205b" />
				<!-- 跑道 -->
				<rect x="-40" y="150" width="420" height="26" rx="6" fill="#0d1b2e" transform="rotate(-8 150 163)" />
				<g fill="rgba(255,255,255,0.7)" transform="rotate(-8 150 163)">
					{#each Array(9) as _, i}
						<rect x={i * 36} y="161" width="20" height="4" rx="2" />
					{/each}
				</g>
				<!-- 起飞飞机剪影 -->
				<g transform="translate(70 70) rotate(-12) scale(0.5)" fill="#eef2f9">
					<path d="M0 12 C 10 4 30 0 52 0 L 210 0 C 232 0 244 4 250 10 C 244 16 232 20 210 20 L 52 20 C 30 20 10 18 0 12 Z" />
					<path d="M244 6 L 268 6 L 262 18 L 246 16 Z" />
					<path d="M96 14 L 150 44 L 132 46 L 88 18 Z" />
					<path d="M30 10 L 52 -22 L 60 -22 L 44 10 Z" />
					<ellipse cx="120" cy="24" rx="13" ry="6" />
				</g>
				<!-- 航站楼 -->
				<g fill="rgba(255,255,255,0.16)">
					<rect x="30" y="96" width="90" height="26" rx="4" />
					<rect x="180" y="96" width="90" height="26" rx="4" />
				</g>
				<text x="150" y="206" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="12">YHI · EBHI</text>
			</svg>
		</div>
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

	.airport {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
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

	.airport-visual svg {
		width: 100%;
		border-radius: var(--radius);
		box-shadow: var(--shadow-2);
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

		.airport {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 620px) {
		.grid4,
		.office-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
