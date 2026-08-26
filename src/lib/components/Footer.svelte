<script>
	import { locale, t } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import Mark from './Mark.svelte';

	const cols = $derived([
		{
			h: $t.footer.cols.airline.h,
			links: [
				{ label: $t.footer.cols.airline.links[0], href: pl('/booking') },
				{ label: $t.footer.cols.airline.links[1], href: pl('/destinations') },
				{ label: $t.footer.cols.airline.links[2], href: pl('/experience') },
				{ label: $t.footer.cols.airline.links[3], href: pl('/fleet') },
				{ label: $t.footer.cols.airline.links[4], href: pl('/oneworld') }
			]
		},
		{
			h: $t.footer.cols.travel.h,
			links: [
				{ label: $t.footer.cols.travel.links[0], href: pl('/support') },
				{ label: $t.footer.cols.travel.links[1], href: pl('/support') },
				{ label: $t.footer.cols.travel.links[2], href: pl('/support') },
				{ label: $t.footer.cols.travel.links[3], href: pl('/support') }
			]
		},
		{
			h: $t.footer.cols.company.h,
			links: [
				{ label: $t.footer.cols.company.links[0], href: pl('/about') },
				{ label: $t.footer.cols.company.links[1], href: pl('/news') },
				{ label: $t.footer.cols.company.links[2], href: pl('/about') },
				{ label: $t.footer.cols.company.links[3], href: pl('/support') }
			]
		},
		{
			h: $t.footer.cols.group.h,
			links: $t.footer.cols.group.links.map((label, i) => ({ label, href: $t.footer.groupLinks[i], ext: true }))
		}
	]);

	function pl(href) {
		return withBase($locale === 'en' ? '/en' + href : href);
	}
</script>

<footer class="site-footer">
	<div class="container">
		<div class="top">
			<div class="brandcol">
				<div class="brand">
					<Mark variant="white" size={38} />
					<div class="brand-word">
						<strong>BNA</strong>
						<span>BOUSOVILLE NATIONAL AIRWAYS</span>
					</div>
				</div>
				<p class="tagline">{$t.footer.tagline}</p>
				<p class="corp">{$t.footer.corp}</p>
				<p class="codes">{$t.footer.codes}</p>
			</div>

			{#each cols as col (col.h)}
				<nav class="col" aria-label={col.h}>
					<h3>{col.h}</h3>
					<ul>
						{#each col.links as l (l.label)}
							<li>
								<a href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}>
									{l.label}{#if l.ext}&nbsp;↗{/if}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="bottom">
			<a href={pl('/support')} class="legal">
				{$t.common.webPrivacy}
			</a>
			<span>bna.bousoville.hk.cn</span>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--navy-900);
		color: rgba(255, 255, 255, 0.85);
		padding: clamp(2.5rem, 6vw, 4rem) 0 2rem;
		font-size: 0.9rem;
	}

	.top {
		display: grid;
		grid-template-columns: 1.6fr repeat(4, 1fr);
		gap: 2rem;
		padding-bottom: 2.2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-bottom: 1.1rem;
	}

	.brand-word {
		display: grid;
		line-height: 1.2;
	}

	.brand-word strong {
		font-size: 1.3rem;
		letter-spacing: 0.16em;
	}

	.brand-word span {
		font-size: 0.56rem;
		letter-spacing: 0.14em;
		opacity: 0.7;
	}

	.tagline {
		color: var(--gold-300);
		font-weight: 600;
		margin-bottom: 0.8rem;
	}

	.corp,
	.codes {
		font-size: 0.76rem;
		opacity: 0.6;
		margin-bottom: 0.35rem;
	}

	.col h3 {
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold-300);
		margin-bottom: 0.9rem;
	}

	.col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}

	.col a {
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
	}

	.col a:hover {
		color: #fff;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.4rem;
		font-size: 0.78rem;
		opacity: 0.75;
	}

	.bottom a {
		color: inherit;
	}

	@media (max-width: 960px) {
		.top {
			grid-template-columns: 1fr 1fr;
		}

		.brandcol {
			grid-column: 1 / -1;
		}
	}
</style>
