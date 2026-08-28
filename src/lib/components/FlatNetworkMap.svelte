<script>
	/** 航線網絡平面地圖 — d3-geo 等距圓柱投影 + 真實大圓航線 + 平移縮放 + 點擊交互 */
	import { onMount } from 'svelte';
	import { geoEquirectangular, geoPath, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo';
	import { feature } from 'topojson-client';
	import landTopo from 'world-atlas/land-110m.json';
	import { t, locale } from '$lib/stores/locale.js';

	const W = 1000;
	const H = 500;
	const land = feature(landTopo, landTopo.objects.land);
	const projection = geoEquirectangular().fitExtent([[6, 6], [W - 6, H - 6]], { type: 'Sphere' });
	const path = geoPath(projection);
	const landD = path(land);
	const graticuleD = path(geoGraticule10());

	const regionColors = {
		domestic: '#5b8def',
		'greater-china': '#d95f5f',
		europe: '#c9ac6a',
		'asia-pacific': '#7fcf8a',
		'middle-east': '#c99a4e',
		africa: '#b06fd9',
		americas: '#5fc0d9'
	};

	let { routes = [], hub, regionFilter = 'all', onselect } = $props();
	let selected = $state(null);
	let hovered = $state(null);
	let showLabels = $state(true);
	let view = $state({ x: 0, y: 0, k: 1 });
	let drag = $state(null);
	let host = $state();

	const isEn = $derived($locale === 'en');

	const pts = $derived(
		routes.map((r) => {
			const p = projection([r.to.lon, r.to.lat]);
			return { ...r, x: p[0], y: p[1] };
		})
	);
	const hubP = $derived(hub ? projection([hub.lon, hub.lat]) : null);

	function arcD(r) {
		const a = [r.from.lon, r.from.lat];
		const b = [r.to.lon, r.to.lat];
		if (geoDistance(a, b) < 1e-6) return '';
		const pts = [];
		for (let i = 0; i <= 60; i++) pts.push(geoInterpolate(a, b)(i / 60));
		return path({ type: 'LineString', coordinates: pts });
	}

	function regionColor(region) {
		return regionColors[region] || '#9aa7bd';
	}

	function select(r) {
		selected = r ? r.dest.iata : null;
		onselect?.(r || null);
	}

	function clampK(k) {
		return Math.min(14, Math.max(1, k));
	}

	function onPointerDown(e) {
		drag = { startX: e.clientX, startY: e.clientY, x: view.x, y: view.y };
		host.setPointerCapture?.(e.pointerId);
	}
	function onPointerMove(e) {
		if (!drag) return;
		view.x = drag.x + (e.clientX - drag.startX);
		view.y = drag.y + (e.clientY - drag.startY);
	}
	function onPointerUp() {
		drag = null;
	}
	function zoom(factor, cx, cy) {
		const k2 = clampK(view.k * factor);
		const rect = host.getBoundingClientRect();
		const mx = cx ?? rect.width / 2;
		const my = cy ?? rect.height / 2;
		const px = (mx - view.x) / view.k;
		const py = (my - view.y) / view.k;
		view.x = mx - px * k2;
		view.y = my - py * k2;
		view.k = k2;
	}
	function onWheel(e) {
		e.preventDefault();
		zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - host.getBoundingClientRect().left, e.clientY - host.getBoundingClientRect().top);
	}
	function resetView() {
		view = { x: 0, y: 0, k: 1 };
	}

	onMount(() => {
		const clampDrag = () => { drag = null; };
		window.addEventListener('pointerup', clampDrag);
		return () => window.removeEventListener('pointerup', clampDrag);
	});
</script>

<div class="map-wrap" bind:this={host}>
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="{$t.destinations.mapTitle}"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onwheel={onWheel}
	>
		<rect width={W} height={H} fill="#0a1f4a" rx="12" />
		<g transform="translate({view.x} {view.y}) scale({view.k})">
			<path d={graticuleD} fill="none" stroke="rgba(255,255,255,.07)" stroke-width="0.6" />
			<path d={landD} fill="#1b3a6e" stroke="#2d5a9c" stroke-width="0.5" />

			<!-- 航線 -->
			{#each pts as r (r.key)}
				{#if regionFilter === 'all' || r.dest.region === regionFilter}
					<path
						d={arcD(r)}
						fill="none"
						stroke={regionColor(r.dest.region)}
						stroke-width={selected === r.dest.iata ? 2.6 : 1.1}
						opacity={selected && selected !== r.dest.iata ? 0.25 : selected === r.dest.iata ? 1 : 0.72}
						stroke-linecap="round"
					/>
				{/if}
			{/each}

			<!-- 目的地標記 -->
			{#each pts as r (r.key)}
				{#if regionFilter === 'all' || r.dest.region === regionFilter}
					<g
						class="marker"
						style="--mc:{regionColor(r.dest.region)}"
						transform="translate({r.x} {r.y})"
						onpointerenter={() => (hovered = r.dest.iata)}
						onpointerleave={() => (hovered = null)}
						onclick={(e) => { e.stopPropagation(); select(r); }}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && select(r)}
					>
						<circle r={selected === r.dest.iata || hovered === r.dest.iata ? 6 : 4.4} fill={regionColor(r.dest.region)} stroke="#fff" stroke-width="1.1" />
						{#if showLabels && (hovered === r.dest.iata || selected === r.dest.iata || r.dest.shuttle)}
							<text x={0} y={-10} text-anchor="middle" fill="#fff" font-size="11" font-weight="600">{isEn ? r.dest.city.en : r.dest.city.zh} {r.dest.iata}</text>
						{/if}
					</g>
				{/if}
			{/each}

			<!-- 樞紐 -->
			{#if hub && hubP}
				<g transform="translate({hubP[0]} {hubP[1]})" class="marker hub">
					<circle r="7" fill="#d9b45e" stroke="#fff" stroke-width="1.4" />
					<text x={0} y={-11} text-anchor="middle" fill="#d9b45e" font-size="12" font-weight="800">{isEn ? 'Yuen Hoi · YHI' : '原海 · YHI'}</text>
				</g>
			{/if}
		</g>
	</svg>

	<div class="controls">
		<button class="ctl" onclick={() => zoom(1.3)} aria-label="+">+</button>
		<button class="ctl" onclick={() => zoom(1 / 1.3)} aria-label="−">−</button>
		<button class="ctl" onclick={resetView} aria-label="reset">⌂</button>
		<button class="tol" class:on={showLabels} onclick={() => (showLabels = !showLabels)}>{$t.destinations.labels}</button>
	</div>

	<div class="legend">
		{#each Object.entries(regionColors) as [r, c] (r)}
			<span class="lg"><i style="background:{c}"></i>{$t.destinations.regions[r]}</span>
		{/each}
	</div>

	<p class="hint">{$t.destinations.mapHint}</p>
</div>

<style>
	.map-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 8.4;
		min-height: 340px;
		max-height: 640px;
		border-radius: var(--radius);
		overflow: hidden;
		background: #0a1f4a;
		touch-action: none;
		user-select: none;
	}
	svg {
		width: 100%;
		height: 100%;
		display: block;
		cursor: grab;
	}
	svg:active {
		cursor: grabbing;
	}
	.marker {
		cursor: pointer;
	}
	.marker text {
		pointer-events: none;
		paint-order: stroke;
		stroke: #0a1f4a;
		stroke-width: 2.5px;
	}

	.controls {
		position: absolute;
		right: 0.9rem;
		top: 0.9rem;
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}
	.ctl {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(4, 16, 40, 0.7);
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		backdrop-filter: blur(4px);
	}
	.ctl:hover {
		background: rgba(22, 52, 108, 0.85);
	}
	.tol {
		height: 30px;
		padding: 0 0.6rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(4, 16, 40, 0.7);
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.74rem;
		cursor: pointer;
		backdrop-filter: blur(4px);
	}
	.tol.on {
		color: #fff;
		background: rgba(22, 52, 108, 0.85);
	}

	.legend {
		position: absolute;
		left: 0.9rem;
		bottom: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 0.9rem;
		background: rgba(4, 16, 40, 0.7);
		border-radius: 10px;
		padding: 0.5rem 0.8rem;
		backdrop-filter: blur(4px);
	}
	.lg {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.72rem;
		color: rgba(255, 255, 255, 0.85);
	}
	.lg i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.hint {
		position: absolute;
		left: 0.9rem;
		top: 0.9rem;
		font-size: 0.72rem;
		color: rgba(255, 255, 255, 0.75);
		background: rgba(4, 16, 40, 0.7);
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		white-space: nowrap;
		max-width: 46%;
	}
</style>
