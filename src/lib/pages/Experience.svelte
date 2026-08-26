<script>
	/** 機上體驗 — 舱等 Tab、餐饮、SkyLink、雋逸會 */
	import { t } from '$lib/stores/locale.js';
	import PageHero from '$lib/components/PageHero.svelte';

	let cabin = $state('business');
	const keys = ['business', 'premium', 'economy'];

	const cabinArt = {
		business: { bg: 'linear-gradient(150deg,#00205b,#0a2d6e)', icon: 'seat' },
		premium: { bg: 'linear-gradient(150deg,#143d8f,#1e4fae)', icon: 'seat' },
		economy: { bg: 'linear-gradient(150deg,#0a2d6e,#143d8f)', icon: 'seat' }
	};
</script>

<PageHero title={$t.experience.title} sub={$t.experience.intro} />

<!-- 舱等 Tab -->
<section class="section">
	<div class="container">
		<div class="tabs" role="tablist" aria-label="{$t.experience.title}">
			{#each keys as k (k)}
				<button role="tab" aria-selected={cabin === k} class:active={cabin === k} onclick={() => (cabin = k)}>
					{$t.experience.cabinTabs[k]}
				</button>
			{/each}
		</div>

		{#each keys as k (k)}
			{#if cabin === k}
				<div class="cabin-panel" role="tabpanel">
					<div class="cabin-visual" style="background:{cabinArt[k].bg}">
						<svg viewBox="0 0 300 200" aria-hidden="true" class="cabin-svg">
							<!-- 舷窗 -->
							{#each [40, 100, 160, 220, 280] as x (x)}
								<ellipse cx={x} cy="60" rx="13" ry="20" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="2" />
							{/each}
							<!-- 座椅剪影 -->
							<g fill="rgba(255,255,255,0.9)">
								<path d="M60 120 q0 -18 14 -18 h30 q14 0 14 18 v40 h-14 v-14 h-30 v14 h-14 Z" />
								<path d="M150 120 q0 -18 14 -18 h30 q14 0 14 18 v40 h-14 v-14 h-30 v14 h-14 Z" opacity="0.75" />
								<path d="M240 120 q0 -18 14 -18 h30 q14 0 14 18 v40 h-14 v-14 h-30 v14 h-14 Z" opacity="0.55" />
							</g>
							<rect x="0" y="168" width="300" height="32" fill="rgba(255,255,255,0.08)" />
						</svg>
					</div>
					<div class="cabin-copy">
						<span class="chip">{(k === 'business' || k === 'premium' || k === 'economy') && $t.experience.cabins[k].tag}</span>
						<h2>{$t.experience.cabins[k].headline}</h2>
						<p class="lead">{$t.experience.cabins[k].body}</p>
						<dl class="feat-list">
							{#each $t.experience.cabins[k].features as f (f.k)}
								<div><dt>{f.k}</dt><dd>{f.v}</dd></div>
							{/each}
						</dl>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

<!-- 餐饮 -->
<section class="section section--soft">
	<div class="container split">
		<div>
			<p class="eyebrow">{$t.experience.diningEyebrow}</p>
			<h2>{$t.experience.diningTitle}</h2>
			<p class="lead">{$t.experience.diningBody}</p>
		</div>
		<div class="dine-grid">
			{#each $t.experience.diningItems as item (item.t)}
				<article class="dine-card">
					<h3>{item.t}</h3>
					<p>{item.d}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- SkyLink -->
<section class="section">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">{$t.experience.wifiEyebrow}</p>
			<h2>{$t.experience.wifiTitle}</h2>
			<p>{$t.experience.wifiBody}</p>
		</div>
		<div class="wifi-grid">
			<article class="wifi-card">
				<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9c5.5-5 12.5-5 18 0M6 12.5c3.8-3.4 8.2-3.4 12 0M9 16c1.8-1.6 4.2-1.6 6 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="19.5" r="1.4" fill="currentColor"/></svg>
				<h3>{$t.experience.wifiSpeed}</h3>
				<p>{$t.experience.wifiSpeedV}</p>
			</article>
			<article class="wifi-card">
				<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg>
				<h3>{$t.experience.wifiStream}</h3>
				<p>{$t.experience.wifiStreamV}</p>
			</article>
			<article class="wifi-card">
				<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="17.5" r="1" fill="currentColor"/></svg>
				<h3>{$t.experience.wifiScreens}</h3>
				<p>{$t.experience.wifiScreensV}</p>
			</article>
		</div>
	</div>
</section>

<!-- 雋逸會 -->
<section class="section oneworld-band-dark">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow gold">{$t.experience.eliteEyebrow}</p>
			<h2>{$t.experience.eliteTitle}</h2>
			<p>{$t.experience.eliteBody}</p>
		</div>
		<div class="tier-grid">
			{#each $t.experience.eliteTiers as tier (tier.n)}
				<article class="tier-card">
					<h3>{tier.n}</h3>
					<span class="chip chip--gold">{tier.t}</span>
					<p>{tier.b}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.tabs {
		display: inline-flex;
		gap: 0.25rem;
		background: var(--paper-cool);
		border-radius: 999px;
		padding: 0.3rem;
		margin-bottom: 1.8rem;
	}

	.tabs button {
		border: 0;
		background: transparent;
		padding: 0.55rem 1.3rem;
		border-radius: 999px;
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--ink-500);
		cursor: pointer;
		transition: all 0.15s var(--ease);
	}

	.tabs button.active {
		background: var(--navy-800);
		color: #fff;
	}

	.cabin-panel {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: center;
	}

	.cabin-visual {
		border-radius: var(--radius);
		overflow: hidden;
		min-height: 300px;
		display: grid;
	}

	.cabin-svg {
		width: 100%;
		height: 100%;
	}

	.cabin-copy .chip {
		margin-bottom: 0.9rem;
	}

	.cabin-copy h2 {
		color: var(--navy-900);
		font-size: clamp(1.4rem, 3vw, 1.9rem);
	}

	.lead {
		color: var(--text-soft);
		font-size: 1rem;
	}

	.feat-list {
		display: grid;
		gap: 0;
		margin: 1.2rem 0 0;
	}

	.feat-list div {
		display: grid;
		grid-template-columns: 130px 1fr;
		gap: 1rem;
		padding: 0.65rem 0;
		border-bottom: 1px dashed var(--line);
	}

	.feat-list dt {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--gold-600);
	}

	.feat-list dd {
		margin: 0;
		font-size: 0.92rem;
		color: var(--ink-700);
	}

	.split {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}

	.dine-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.dine-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.15rem 1.25rem;
		box-shadow: var(--shadow-1);
	}

	.dine-card h3 {
		font-size: 0.98rem;
		color: var(--navy-900);
		margin-bottom: 0.3rem;
	}

	.dine-card p {
		margin: 0;
		font-size: 0.86rem;
		color: var(--text-soft);
	}

	.wifi-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.1rem;
	}

	.wifi-card {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.5rem;
		box-shadow: var(--shadow-1);
		color: var(--navy-700);
	}

	.wifi-card h3 {
		font-size: 1rem;
		color: var(--navy-900);
		margin-top: 0.9rem;
	}

	.wifi-card p {
		margin: 0;
		font-size: 0.88rem;
		color: var(--text-soft);
	}

	.oneworld-band-dark {
		background: linear-gradient(140deg, var(--navy-900), var(--navy-700));
		color: #fff;
	}

	.oneworld-band-dark h2 {
		color: #fff;
	}

	.oneworld-band-dark p {
		color: rgba(255, 255, 255, 0.85);
	}

	.eyebrow.gold {
		color: var(--gold-300);
	}

	.tier-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.1rem;
	}

	.tier-card {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: var(--radius);
		padding: 1.4rem 1.3rem;
		display: grid;
		gap: 0.7rem;
		align-content: start;
	}

	.tier-card h3 {
		color: #fff;
		margin: 0;
		font-size: 1.05rem;
	}

	.tier-card .chip {
		justify-self: start;
	}

	.tier-card p {
		margin: 0;
		font-size: 0.86rem;
		color: rgba(255, 255, 255, 0.78);
	}

	@media (max-width: 960px) {
		.cabin-panel,
		.split {
			grid-template-columns: 1fr;
		}

		.dine-grid,
		.wifi-grid {
			grid-template-columns: 1fr 1fr;
		}

		.tier-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 620px) {
		.dine-grid,
		.wifi-grid,
		.tier-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
