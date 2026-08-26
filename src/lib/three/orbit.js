/*
 * 轻量轨道控制 — 拖拽旋转 / 滚轮缩放 / 惯性 / 触摸
 * createOrbit(THREE, camera, dom, opts) → { update, dispose }
 */
export function createOrbit(THREE, camera, dom, opts = {}) {
	const target = opts.target || new THREE.Vector3(0, 0, 0);
	let radius = opts.radius || 60;
	let theta = opts.theta ?? -0.35; /* 方位角（负=从 −Z 侧看，展示涂装标题面） */
	let phi = opts.phi ?? 1.25; /* 极角 */
	let autoRotate = opts.autoRotate ?? true;
	const autoSpeed = opts.autoSpeed ?? 0.12;
	const minR = opts.minRadius || radius * 0.45;
	const maxR = opts.maxRadius || radius * 2.2;

	let vTheta = 0;
	let vPhi = 0;
	let dragging = false;
	let lastX = 0;
	let lastY = 0;
	let userTouched = false;

	function onDown(e) {
		dragging = true;
		userTouched = true;
		lastX = e.clientX;
		lastY = e.clientY;
		dom.setPointerCapture?.(e.pointerId);
	}

	function onMove(e) {
		if (!dragging) return;
		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		vTheta = dx * 0.005;
		vPhi = dy * 0.004;
		theta -= vTheta;
		phi -= vPhi;
	}

	function onUp() {
		dragging = false;
	}

	function onWheel(e) {
		e.preventDefault();
		userTouched = true;
		radius *= 1 + Math.sign(e.deltaY) * 0.08;
		radius = Math.min(maxR, Math.max(minR, radius));
	}

	dom.addEventListener('pointerdown', onDown);
	dom.addEventListener('pointermove', onMove);
	dom.addEventListener('pointerup', onUp);
	dom.addEventListener('pointercancel', onUp);
	dom.addEventListener('wheel', onWheel, { passive: false });

	function update(dt) {
		if (!dragging) {
			/* 惯性衰减 */
			theta -= vTheta;
			phi -= vPhi;
			vTheta *= 0.94;
			vPhi *= 0.94;
			if (autoRotate && !userTouched) {
				theta += dt * autoSpeed;
			}
		}
		phi = Math.min(Math.PI - 0.25, Math.max(0.25, phi));
		camera.position.set(
			target.x + radius * Math.sin(phi) * Math.sin(theta),
			target.y + radius * Math.cos(phi),
			target.z + radius * Math.sin(phi) * Math.cos(theta)
		);
		camera.lookAt(target);
	}

	function dispose() {
		dom.removeEventListener('pointerdown', onDown);
		dom.removeEventListener('pointermove', onMove);
		dom.removeEventListener('pointerup', onUp);
		dom.removeEventListener('pointercancel', onUp);
		dom.removeEventListener('wheel', onWheel);
	}

	return { update, dispose, get radius() { return radius; }, set radius(r) { radius = r; } };
}
