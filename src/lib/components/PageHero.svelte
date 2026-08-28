<script>
	import { t, locale, fmtDate } from '$lib/stores/locale.js';
	import Mark from './Mark.svelte';

	let { kicker = '', title = '', sub = '', image = '', tone = 'navy', crumbs = [] } = $props();
</script>

<section class="hero" class:has-image={image} style={image ? `--hero-img:url('${image}')` : ''}>
	<div class="layer"></div>
	<div class="container">
		<div class="hero-in">
			{#if crumbs.length}
				<nav class="crumbs" aria-label="Breadcrumb">
					<a href={crumbs[0].href}>{crumbs[0].label}</a>
					{#each crumbs.slice(1) as c (c.href)}
						<span aria-hidden="true">›</span>
						<a href={c.href} aria-current="page">{c.label}</a>
					{/each}
				</nav>
			{/if}
			{#if kicker}<p class="kicker">{kicker}</p>{/if}
			<h1>{title}</h1>
			{#if sub}<p class="sub">{sub}</p>{/if}
		</div>
	</div>
	<div class="mark-watermark" aria-hidden="true">
		<Mark variant="white" size={220} />
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		color: #fff;
		background: var(--navy-800);
		padding: clamp(3.2rem, 8vw, 6rem) 0 clamp(3.6rem, 9vw, 6.5rem);
	}

	.hero.has-image {
		background-image:
			linear-gradient(105deg, rgba(0, 16, 48, 0.94) 26%, rgba(0, 32, 91, 0.62) 62%, rgba(0, 21, 64, 0.3)),
			var(--hero-img);
		background-size: cover;
		background-position: center;
	}

	/* 夜景氛围层：径向辉光 + 极淡网格 + 底部渐隐 */
	.layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(90% 70% at 82% 12%, rgba(201, 172, 106, 0.16), transparent 55%),
			radial-gradient(70% 60% at 12% 92%, rgba(30, 79, 174, 0.3), transparent 60%),
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 100% 100%, 100% 100%, 46px 46px, 46px 46px;
		mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent);
	}

	.container {
		position: relative;
		z-index: 2;
	}

	.hero-in {
		max-width: 780px;
	}

	.crumbs {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		margin-bottom: 1.2rem;
		color: rgba(255, 255, 255, 0.72);
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.14);
		padding: 0.34rem 0.8rem;
		border-radius: 999px;
		backdrop-filter: blur(4px);
	}
	.crumbs a {
		color: #fff;
		font-weight: 600;
		text-decoration: none;
	}
	.crumbs a:hover {
		text-decoration: underline;
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55em;
		font-size: 0.74rem;
		font-weight: 800;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--gold-300);
		margin-bottom: 0.9rem;
	}
	.kicker::before {
		content: '';
		width: 26px;
		height: 2px;
		background: linear-gradient(90deg, var(--gold-400), transparent);
	}

	h1 {
		font-size: clamp(2.1rem, 5.4vw, 3.4rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.08;
		margin-bottom: 0.6em;
	}

	.sub {
		max-width: 620px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.86);
		margin: 0;
	}

	.mark-watermark {
		position: absolute;
		right: -3.5%;
		bottom: -14%;
		z-index: 1;
		opacity: 0.08;
		pointer-events: none;
		filter: saturate(0.3);
		transform: translateY(18%);
	}

	@media (max-width: 720px) {
		.mark-watermark {
			display: none;
		}
	}
</style>
