<script>
	/** Three.js 航线地球 — 懒加载、悬停标签、点击选中航线、可降级为 2D */
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { createEventDispatcher } from 'svelte';
	import { t, locale } from '$lib/stores/locale.js';
	import { createOrbit } from '$lib/three/orbit.js';
	import { HUB } from '$data/destinations.js';
	const dispatch = createEventDispatcher();

	let canvasHost = $state();
	let state = $state('idle');
	let selectedKey = $state(null);
	let labels = $state([]);

	let globeApi = null;
	let orbit = null;
	let renderer = null;
	let camera = null;
	let reduced = false;
	let projected = []; /* 每帧投影的 { key, x, y, front } */
	let pointerPos = null;
	let raf = 0;

	function cityName(d) {
		return $locale === 'zh' ? d.city.zh : d.city.en;
	}

	function select(key) {
		selectedKey = key;
		globeApi?.setSelected(key);
		const r = routes.find((x) => x.key === key);
		dispatch('select', r || null);
	}

	function clearSelect() {
		selectedKey = null;
		globeApi?.setSelected(null);
		dispatch('select', null);
	}

	function onLabelClick(key, e) {
		e.stopPropagation();
		if (!key) {
			clearSelect();
			return;
		}
		if (selectedKey === key) clearSelect();
		else select(key);
	}

	function onPointerMove(e) {
		const rect = canvasHost.getBoundingClientRect();
		pointerPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function onPointerLeave() {
		pointerPos = null;
	}

	function onCanvasClick() {
		if (!pointerPos) return;
		let best = null;
		let bestD = 18 * 18;
		for (const p of projected) {
			if (!p.front) continue;
			const d = (p.x - pointerPos.x) ** 2 + (p.y - pointerPos.y) ** 2;
			if (d < bestD) {
				bestD = d;
				best = p.key;
			}
		}
		if (best) {
			if (selectedKey === best) clearSelect();
			else select(best);
		} else if (selectedKey) {
			clearSelect();
		}
	}

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const hasWebGL = (() => {
			try {
				const c = document.createElement('canvas');
				return !!(c.getContext('webgl2') || c.getContext('webgl'));
			} catch {
				return false;
			}
		})();
		if (!hasWebGL) {
			state = 'fallback';
			return;
		}

		let scene;
		let lastT = performance.now();

		const io = new IntersectionObserver(
			async (entries) => {
				if (!entries[0].isIntersecting || state !== 'idle') return;
				io.disconnect();
				state = 'loading';
				try {
					const [THREE, globeMod, landRes] = await Promise.all([
						import('three'),
						import('$lib/three/globe.js'),
						fetch(landUrl).then((r) => r.json())
					]);
					const { createGlobe } = globeMod;

					renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
					renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
					renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight);
					canvasHost.appendChild(renderer.domElement);

					scene = new THREE.Scene();
					camera = new THREE.PerspectiveCamera(42, canvasHost.clientWidth / canvasHost.clientHeight, 1, 1500);

					const hubLa = (HUB.lat * Math.PI) / 180;
					const hubLo = (HUB.lon * Math.PI) / 180;
					const dist = 305;
					camera.position.set(
						dist * Math.cos(hubLa) * Math.sin(hubLo),
						dist * Math.sin(hubLa),
						dist * Math.cos(hubLa) * Math.cos(hubLo)
					);

					scene.add(new THREE.HemisphereLight(0xcfdcff, 0x0a1030, 1.35));
					const sun = new THREE.DirectionalLight(0xffffff, 1.7);
					sun.position.copy(camera.position).multiplyScalar(1.6);
					scene.add(sun);

					globeApi = createGlobe(THREE, {
						landGeo: landRes,
						routes,
						hub: { lat: HUB.lat, lon: HUB.lon },
						reducedMotion: reduced
					});
					scene.add(globeApi.group);

					orbit = createOrbit(THREE, camera, renderer.domElement, {
						radius: dist,
						theta: hubLo,
						phi: Math.PI / 2 - hubLa + 0.28,
						autoRotate: !reduced,
						autoSpeed: 0.05,
						minRadius: 155,
						maxRadius: 540
					});

					state = 'ready';

					const R = 100;
					const cityVec = (r) => {
						if (!r._v3) {
							r._v3 = new THREE.Vector3(
								R * 1.012 * Math.cos((r.to.lat * Math.PI) / 180) * Math.sin((r.to.lon * Math.PI) / 180),
								R * 1.012 * Math.sin((r.to.lat * Math.PI) / 180),
								R * 1.012 * Math.cos((r.to.lat * Math.PI) / 180) * Math.cos((r.to.lon * Math.PI) / 180)
							);
						}
						return r._v3;
					};

					const v = new THREE.Vector3();

					function updateLabels() {
						if (!canvasHost || !globeApi) return;
						const w = canvasHost.clientWidth;
						const h = canvasHost.clientHeight;

						const proj = (vec) => {
							const front = vec.x * camera.position.x + vec.y * camera.position.y + vec.z * camera.position.z > 0;
							v.copy(vec).project(camera);
							return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, front };
						};

						const items = [];
						const hubP = proj(globeApi.hubVec);
						if (hubP.front) {
							items.push({ ...hubP, name: $locale === 'zh' ? '原海 YHI' : 'Yuen Hoi YHI', hub: true, key: null });
						}

						projected = [];
						for (const r of routes) {
							const p = proj(cityVec(r));
							projected.push({ key: r.key, x: p.x, y: p.y, front: p.front });
							if (p.front && (r.key === selectedKey || (pointerPos && Math.hypot(p.x - pointerPos.x, p.y - pointerPos.y) < 18))) {
								items.push({ ...p, name: cityName(r.dest), hub: false, key: r.key });
							}
						}
						labels = items;
					}

					const tick = (now) => {
						const dt = Math.min(0.05, (now - lastT) / 1000);
						lastT = now;
						orbit.update(dt);
						globeApi.update(dt);
						renderer.render(scene, camera);
						updateLabels();
						raf = requestAnimationFrame(tick);
					};
					raf = requestAnimationFrame(tick);
				} catch (e) {
					console.error('globe failed to load', e);
					state = 'fallback';
				}
			},
			{ threshold: 0.1 }
		);
		io.observe(canvasHost);

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			if (orbit) orbit.dispose();
			if (globeApi) globeApi.dispose();
			if (renderer) {
				renderer.dispose();
				renderer.domElement?.remove();
			}
		};
	});


	let { routes = [], landUrl = `${base}/data/land-110m.geojson`, children } = $props(); /* routes: [{ key, from:{lat,lon}, to:{lat,lon}, dest }] */</script>

<div class="globe-wrap">
	{#if state !== 'fallback'}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- 键盘用户经下方城市标签按钮完成选择；画布为指针交互的 WebGL 场景 -->
		<div
			class="host"
			bind:this={canvasHost}
			onpointermove={onPointerMove}
			onpointerleave={onPointerLeave}
			onclick={onCanvasClick}
			role="application"
			aria-label="{$t.destinations.mapTitle}"
		></div>
		<div class="labels" aria-hidden="false">
			{#each labels as l (l.name + Math.round(l.x))}
				<button
					class="label"
					class:hub={l.hub}
					class:selected={l.key && l.key === selectedKey}
					style="left:{l.x}px; top:{l.y}px"
					onclick={(e) => onLabelClick(l.key, e)}
				>
					{l.name}
				</button>
			{/each}
		</div>
		<div class="hint" aria-hidden="true">
			<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.4"/><path d="M1.6 8h12.8M8 1.6c-4.5 4-4.5 8.8 0 12.8 4.5-4 4.5-8.8 0-12.8Z" stroke="currentColor" stroke-width="1.1"/></svg>
			{$t.destinations.mapHint}
		</div>
	{/if}
	{#if state === 'fallback'}
		{@render children?.()}
	{/if}
</div>

<style>
	.globe-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 10.5;
		min-height: 320px;
		max-height: 620px;
		background: radial-gradient(130% 130% at 50% 0%, #10254f 0%, #050f26 72%);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.host {
		position: absolute;
		inset: 0;
		touch-action: none;
		cursor: grab;
	}

	.host:active {
		cursor: grabbing;
	}

	.labels {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.label {
		position: absolute;
		transform: translate(-50%, calc(-100% - 10px));
		background: rgba(3, 12, 32, 0.82);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.25);
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		pointer-events: auto;
		cursor: pointer;
		white-space: nowrap;
		backdrop-filter: blur(4px);
	}

	.label.hub {
		background: var(--gold-600, #8f7a3e);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.label.selected {
		background: var(--navy-600, #143d8f);
		border-color: var(--gold-400, #c9ac6a);
	}

	.hint {
		position: absolute;
		left: 50%;
		bottom: 0.8rem;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: rgba(4, 16, 40, 0.72);
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.74rem;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		pointer-events: none;
		white-space: nowrap;
	}
</style>
