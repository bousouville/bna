<script>
	/** 寰宇一家页 */
	import { t } from '$lib/stores/locale.js';
	import PageHero from '$lib/components/PageHero.svelte';
</script>

<PageHero title={$t.oneworld.title} sub={$t.oneworld.intro} />

<section class="section">
	<div class="container">
		<div class="ow-band">
			<svg viewBox="0 0 120 120" class="ow-logo" aria-hidden="true">
				<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2.5" />
				{#each Array(12) as _, i}
					<ellipse cx="60" cy="60" rx="54" ry="20" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.8" transform="rotate({i * 15} 60 60)" />
				{/each}
				<circle cx="60" cy="60" r="17" fill="#C9AC6A" />
			</svg>
			<div>
				<span class="chip chip--gold">{$t.oneworld.memberSince}</span>
				<h2>{$t.oneworld.benefitsTitle}</h2>
			</div>
		</div>
		<div class="benefit-grid">
			{#each $t.oneworld.benefits as b (b.t)}
				<article class="card benefit">
					<h3>{b.t}</h3>
					<p>{b.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<h2>{$t.oneworld.alliancePartners}</h2>
			<p>{$t.oneworld.alliancePartnersBody}</p>
		</div>
		<div class="partner-grid">
			{#each $t.oneworld.partners as p (p.n)}
				<article class="card partner">
					<h3>{p.n}</h3>
					<p>{p.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-head">
			<h2>{$t.oneworld.tiersTitle}</h2>
		</div>
		<div class="card table-wrap">
			<table class="spec-table wide">
				<thead>
					<tr><th>{$t.oneworld.tiersRows.tier}</th><th>{$t.oneworld.tiersRows.ow}</th><th>{$t.oneworld.tiersRows.rights}</th></tr>
				</thead>
				<tbody>
					{#each $t.oneworld.tiersRows.rows as row (row.t)}
						<tr><td>{row.t}</td><td><span class="chip chip--gold">{row.o}</span></td><td>{row.r}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<section class="section section--soft">
	<div class="container lounge">
		<div>
			<p class="eyebrow">YHI · T1</p>
			<h2>{$t.oneworld.loungeTitle}</h2>
			<p class="lead">{$t.oneworld.loungeBody}</p>
		</div>
		<div class="lounge-visual" aria-hidden="true">
			<svg viewBox="0 0 300 210">
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#7c96cf" />
						<stop offset="0.7" stop-color="#d9b45e" />
						<stop offset="1" stop-color="#00205b" />
					</linearGradient>
				</defs>
				<rect width="300" height="210" rx="12" fill="#00205b" />
				<rect x="24" y="26" width="118" height="92" rx="6" fill="url(#sky)" opacity="0.9" />
				<rect x="158" y="26" width="118" height="92" rx="6" fill="url(#sky)" opacity="0.75" />
				<!-- 尾翼剪影 -->
				<path d="M60 118 L86 60 L96 60 L78 118 Z" fill="#fff" opacity="0.9" />
				<!-- 座椅 -->
				<g fill="rgba(255,255,255,0.85)">
					<path d="M30 150 q0 -10 8 -10 h16 q8 0 8 10 v22 h-7 v-8 h-18 v8 h-7 Z" />
					<path d="M84 150 q0 -10 8 -10 h16 q8 0 8 10 v22 h-7 v-8 h-18 v8 h-7 Z" opacity="0.7" />
					<path d="M138 150 q0 -10 8 -10 h16 q8 0 8 10 v22 h-7 v-8 h-18 v8 h-7 Z" opacity="0.5" />
				</g>
				<rect x="0" y="182" width="300" height="28" fill="rgba(255,255,255,0.08)" />
			</svg>
		</div>
	</div>
</section>

<style>
	.ow-band {
		display: flex;
		gap: 1.6rem;
		align-items: center;
		margin-bottom: 1.8rem;
	}

	.ow-logo {
		width: 96px;
		flex: none;
	}

	.ow-band h2 {
		margin: 0.4rem 0 0;
		color: var(--navy-900);
	}

	.benefit-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
	}

	.benefit,
	.partner {
		padding: 1.3rem 1.3rem 1.2rem;
	}

	.benefit h3,
	.partner h3 {
		font-size: 1rem;
		color: var(--navy-900);
		margin-bottom: 0.35rem;
	}

	.benefit p,
	.partner p {
		margin: 0;
		font-size: 0.87rem;
		color: var(--text-soft);
	}

	.partner-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.table-wrap {
		overflow-x: auto;
		padding: 0.4rem 0.8rem;
	}

	.wide th,
	.wide td {
		width: auto;
	}

	.wide th:first-child,
	.wide td:first-child {
		width: 200px;
	}

	.lounge {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}

	.lead {
		color: var(--text-soft);
	}

	.lounge-visual svg {
		width: 100%;
		border-radius: var(--radius);
		box-shadow: var(--shadow-2);
	}

	@media (max-width: 960px) {
		.benefit-grid {
			grid-template-columns: 1fr 1fr;
		}

		.partner-grid {
			grid-template-columns: 1fr 1fr;
		}

		.lounge {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 620px) {
		.benefit-grid,
		.partner-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
