<script>
	import { t, locale, fmtDate } from '$lib/stores/locale.js';
	import Mark from './Mark.svelte';


	let { kicker = '', title = '', sub = '', image = '', tone = 'navy', crumbs = [] } = $props();</script>

<section class="hero" class:has-image={image} style={image ? `--hero-img:url('${image}')` : ''}>
	<div class="container">
		{#if crumbs.length}
			<nav class="crumbs" aria-label="Breadcrumb">
				<a href={crumbs[0].href}>{crumbs[0].label}</a>
				{#each crumbs.slice(1) as c (c.href)}
					<span aria-hidden="true">›</span>
					<a href={c.href} aria-current="page">{c.label}</a>
				{/each}
			</nav>
		{/if}
		<div class="mark-row" aria-hidden="true">
			<Mark variant="white" size={26} />
		</div>
		{#if kicker}<p class="kicker">{kicker}</p>{/if}
		<h1>{title}</h1>
		{#if sub}<p class="sub">{sub}</p>{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		color: #fff;
		background: var(--navy-800);
		padding: clamp(3rem, 7vw, 5rem) 0 clamp(3.4rem, 8vw, 6rem);
	}

	.hero.has-image {
		background-image:
			linear-gradient(100deg, rgba(0, 21, 64, 0.94) 20%, rgba(0, 32, 91, 0.55) 65%, rgba(0, 32, 91, 0.25)),
			var(--hero-img);
		background-size: cover;
		background-position: center;
	}

	/* 斜向金蓝飘带 */
	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(115deg, transparent 55%, rgba(176, 145, 63, 0.32) 55.2%, rgba(176, 145, 63, 0.32) 66%, transparent 66.2%),
			linear-gradient(115deg, transparent 68%, rgba(255, 255, 255, 0.06) 68.2%, rgba(255, 255, 255, 0.06) 76%, transparent 76.2%);
		pointer-events: none;
	}

	.container {
		position: relative;
	}

	.crumbs {
		display: flex;
		gap: 0.5rem;
		font-size: 0.8rem;
		margin-bottom: 1.1rem;
		opacity: 0.85;
	}

	.crumbs a {
		color: inherit;
	}

	.mark-row {
		opacity: 0.95;
		margin-bottom: 1rem;
	}

	.kicker {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--gold-300);
		margin-bottom: 0.7rem;
	}

	h1 {
		font-size: clamp(1.9rem, 4.6vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.015em;
		margin-bottom: 0.5em;
	}

	.sub {
		max-width: 640px;
		font-size: 1.02rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
	}
</style>
