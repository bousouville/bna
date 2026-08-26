<script>
	import { withBase } from '$lib/paths.js';
	/** 单字标 — 品牌原图抠图位图（color 彩色 / white 纯白，均带透明通道） */
	let { variant = 'color', size = 34 } = $props();

	const aspect = 720 / 487;
	const w = $derived(size * aspect);
		const src = $derived(withBase(variant === 'white' ? '/brand/monogram-white.webp' : '/brand/monogram.webp'));
</script>

<img {src} width={w} height={size} alt="BNA" style="display:block" loading="eager" />
