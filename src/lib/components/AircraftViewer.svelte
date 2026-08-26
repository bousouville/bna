<script>
	/** Three.js 3D 机模查看器 — 懒加载、可降级 */
	import { onMount } from 'svelte';
	import { t } from '$lib/stores/locale.js';
	import { createOrbit } from '$lib/three/orbit.js';

	let { children } = $props();
	let canvasHost = $state();
	let state = $state('idle'); // idle | loading | ready | fallback
	let reduced = false;

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

		let raf = 0;
		let renderer, scene, camera, orbit, aircraft;
		let lastT = performance.now();

		/* IntersectionObserver 进入视口才加载 three */
		const io = new IntersectionObserver(
			async (entries) => {
				if (!entries[0].isIntersecting || state === 'loading' || state === 'ready') return;
				io.disconnect();
				state = 'loading';
				try {
					const THREE = await import('three');
					const { createAircraft } = await import('$lib/three/aircraft.js');

					renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
					renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
					renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight);
					renderer.setAnimationLoop(null);
					canvasHost.appendChild(renderer.domElement);

					scene = new THREE.Scene();
					camera = new THREE.PerspectiveCamera(38, canvasHost.clientWidth / canvasHost.clientHeight, 0.1, 600);
					camera.position.set(30, 10, -52);
					camera.lookAt(0, 0, 0);

					/* 灯光 */
					const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x1b2436, 1.15);
					scene.add(hemi);
					const key = new THREE.DirectionalLight(0xffffff, 2.2);
					key.position.set(40, 55, -70);
					scene.add(key);
					const rim = new THREE.DirectionalLight(0x8fa8ff, 1.1);
					rim.position.set(-60, 20, 50);
					scene.add(rim);
					const fill = new THREE.DirectionalLight(0xffe9c4, 0.5);
					fill.position.set(0, -30, -20);
					scene.add(fill);

					/* 地面（展示台） */
					const ped = new THREE.Mesh(
						new THREE.CircleGeometry(46, 64),
						new THREE.MeshStandardMaterial({ color: 0x0d224f, roughness: 0.9, metalness: 0.1 })
					);
					ped.rotation.x = -Math.PI / 2;
					ped.position.y = -7.5;
					scene.add(ped);

					aircraft = createAircraft(THREE);
					scene.add(aircraft.group);

					orbit = createOrbit(THREE, camera, renderer.domElement, {
						radius: 62,
						theta: -0.42,
						phi: 1.32,
						autoRotate: !reduced,
						autoSpeed: 0.1,
						minRadius: 32,
						maxRadius: 130
					});

					state = 'ready';
					const tick = (now) => {
						const dt = Math.min(0.05, (now - lastT) / 1000);
						lastT = now;
						orbit.update(dt);
						renderer.render(scene, camera);
						raf = requestAnimationFrame(tick);
					};
					raf = requestAnimationFrame(tick);
				} catch (e) {
					console.error('3D viewer failed', e);
					state = 'fallback';
				}
			},
			{ threshold: 0.15 }
		);

		io.observe(canvasHost);

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			if (orbit) orbit.dispose();
			if (aircraft) aircraft.dispose();
			if (renderer) {
				renderer.dispose();
				renderer.domElement?.remove();
			}
		};
	});
</script>

<div class="viewer">
	{#if state === 'ready' || state === 'loading' || state === 'idle'}
		<div class="host" bind:this={canvasHost} role="img" aria-label="{$t.fleet.view3d}"></div>
		<div class="hint" aria-hidden="true">
			<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.4"/><path d="M1.6 8h12.8M8 1.6c-4.5 4-4.5 8.8 0 12.8 4.5-4 4.5-8.8 0-12.8Z" stroke="currentColor" stroke-width="1.1"/></svg>
			{$t.fleet.view3dHint}
		</div>
	{/if}
	{#if state === 'fallback'}
		{@render children?.()}
	{/if}
</div>

<style>
	.viewer {
		position: relative;
		width: 100%;
		min-height: 340px;
		background: radial-gradient(120% 120% at 50% 10%, #123069 0%, #071736 70%);
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
