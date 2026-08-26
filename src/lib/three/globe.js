/*
 * 航线地球 — 点阵大陆 + 大圆弧航线 + 城市标记
 * createGlobe(THREE, { landGeo, routes, hub, reducedMotion })
 * landGeo: GeoJSON FeatureCollection（经纬度多边形）
 * routes: [{ from:{lat,lon}, to:{lat,lon}, key }]
 */
export function createGlobe(THREE, opts) {
	const { landGeo, routes, hub, reducedMotion } = opts;
	const R = 100;
	const group = new THREE.Group();
	const disposables = [];
	const track = (o) => (disposables.push(o), o);

	const latLonToVec = (lat, lon, r = R) => {
		const la = (lat * Math.PI) / 180;
		const lo = (lon * Math.PI) / 180;
		return new THREE.Vector3(
			r * Math.cos(la) * Math.sin(lo),
			r * Math.sin(la),
			r * Math.cos(la) * Math.cos(lo)
		);
	};

	/* ---------- 海洋球 ---------- */
	const ocean = new THREE.Mesh(
		track(new THREE.SphereGeometry(R, 64, 48)),
		track(new THREE.MeshStandardMaterial({ color: 0x0a1f4a, roughness: 0.85, metalness: 0.05 }))
	);
	group.add(ocean);

	/* 大气辉光 */
	const glow = new THREE.Mesh(
		track(new THREE.SphereGeometry(R * 1.045, 48, 32)),
		track(
			new THREE.MeshBasicMaterial({
				color: 0x4a6fd4,
				transparent: true,
				opacity: 0.16,
				side: THREE.BackSide,
				depthWrite: false
			})
		)
	);
	group.add(glow);

	/* ---------- 点阵大陆（GeoJSON 光栅化采样） ---------- */
	function buildLandPoints() {
		const W = 720;
		const H = 360;
		const c = document.createElement('canvas');
		c.width = W;
		c.height = H;
		const g = c.getContext('2d', { willReadFrequently: true });
		g.fillStyle = '#000';
		g.fillRect(0, 0, W, H);
		g.fillStyle = '#fff';
		const drawRing = (ring) => {
			g.beginPath();
			ring.forEach(([lon, lat], i) => {
				const x = ((lon + 180) / 360) * W;
				const y = ((90 - lat) / 180) * H;
				if (i === 0) g.moveTo(x, y);
				else g.lineTo(x, y);
			});
			g.closePath();
			g.fill();
		};
		for (const f of landGeo.features) {
			const geom = f.geometry;
			if (geom.type === 'Polygon') geom.coordinates.forEach(drawRing);
			else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p) => p.forEach(drawRing));
		}
		const img = g.getImageData(0, 0, W, H).data;
		const pos = [];
		const step = 1.7; /* 度 */
		for (let lat = -90 + step / 2; lat < 90; lat += step) {
			/* 高纬度减少采样密度，避免堆积 */
			const ringSteps = Math.max(4, Math.round(360 / step * Math.cos((lat * Math.PI) / 180)));
			for (let i = 0; i < ringSteps; i++) {
				const lon = -180 + ((i + 0.5) * 360) / ringSteps;
				const x = Math.floor(((lon + 180) / 360) * W);
				const y = Math.floor(((90 - lat) / 180) * H);
				if (img[(y * W + x) * 4] > 127) {
					const v = latLonToVec(lat, lon, R * 1.002);
					pos.push(v.x, v.y, v.z);
				}
			}
		}
		const geo = track(new THREE.BufferGeometry());
		geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		const mat = track(
			new THREE.PointsMaterial({
				color: 0x9db4e8,
				size: 1.55,
				sizeAttenuation: true,
				transparent: true,
				opacity: 0.85
			})
		);
		return new THREE.Points(geo, mat);
	}
	group.add(buildLandPoints());

	/* ---------- 大圆弧 ---------- */
	function arcPoints(a, b, segments = 96) {
		const va = latLonToVec(a.lat, a.lon).normalize();
		const vb = latLonToVec(b.lat, b.lon).normalize();
		const angle = va.angleTo(vb);
		const pts = [];
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const p = new THREE.Vector3().copy(va).multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle))
				.add(new THREE.Vector3().copy(vb).multiplyScalar(Math.sin(t * angle) / Math.sin(angle)));
			const h = 1 + Math.sin(Math.PI * t) * (0.04 + (angle / Math.PI) * 0.22);
			pts.push(p.multiplyScalar(R * h));
		}
		return pts;
	}

	const routeObjs = [];
	for (const rt of routes) {
		const pts = arcPoints(rt.from, rt.to);
		const geo = track(new THREE.BufferGeometry().setFromPoints(pts));

		const faintMat = track(
			new THREE.LineBasicMaterial({ color: 0x8fa8dd, transparent: true, opacity: 0.22, depthWrite: false })
		);
		const faint = new THREE.Line(geo, faintMat);

		const brightMat = track(
			new THREE.LineBasicMaterial({
				color: 0xd9b45e,
				transparent: true,
				opacity: 0.95,
				depthWrite: false,
				blending: THREE.AdditiveBlending
			})
		);
		const bright = new THREE.Line(geo, brightMat);
		bright.geometry.setDrawRange(0, 0);

		group.add(faint);
		group.add(bright);
		routeObjs.push({ key: rt.key, faint, bright, mat: brightMat, faintMat, len: pts.length, head: 0 });
	}

	/* ---------- 城市标记 ---------- */
	const cityDots = [];
	function addDot(lat, lon, color, size, userData) {
		const dot = new THREE.Mesh(
			track(new THREE.SphereGeometry(size, 12, 10)),
			track(new THREE.MeshBasicMaterial({ color }))
		);
		dot.position.copy(latLonToVec(lat, lon, R * 1.012));
		dot.userData = userData;
		group.add(dot);
		return dot;
	}

	const hubDot = addDot(hub.lat, hub.lon, 0xd9b45e, 2.0, { hub: true });
	/* 光环 */
	const hubRing = new THREE.Mesh(
		track(new THREE.RingGeometry(2.6, 3.3, 40)),
		track(new THREE.MeshBasicMaterial({ color: 0xd9b45e, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }))
	);
	hubRing.position.copy(latLonToVec(hub.lat, hub.lon, R * 1.012));
	/* 法线朝外 */
	hubRing.lookAt(0, 0, 0);
	group.add(hubRing);

	/* ---------- 动画 ---------- */
	let selectedKey = null;
	let t = 0;

	function setSelected(key) {
		selectedKey = key;
		for (const ro of routeObjs) {
			const isSel = ro.key === key;
			ro.mat.opacity = isSel ? 1 : 0.35;
			ro.faintMat.opacity = isSel ? 0.5 : 0.22;
			if (isSel) {
				ro.bright.geometry.setDrawRange(0, ro.len); /* 选中：全线高亮 */
			}
		}
	}

	function update(dt) {
		t += dt;
		if (!reducedMotion) {
			const speed = 0.09;
			for (const ro of routeObjs) {
				if (ro.key === selectedKey) continue;
				ro.head = (ro.head + dt * speed * ro.len) % ro.len;
				const count = Math.min(26, ro.len);
				const start = Math.floor(ro.head);
				if (start + count <= ro.len) {
					ro.bright.geometry.setDrawRange(start, count);
				} else {
					/* 分两段绘制到头部 */
					const first = ro.len - start;
					ro.bright.geometry.setDrawRange(start, first);
				}
			}
		} else {
			for (const ro of routeObjs) {
				if (ro.key !== selectedKey) ro.bright.geometry.setDrawRange(0, 0);
			}
		}
	}

	function dispose() {
		for (const d of disposables) {
			if (d && d.dispose) d.dispose();
		}
	}

	return {
		group,
		update,
		dispose,
		setSelected,
		getHubScreen: null,
		hubDot,
		hubRing,
		hubVec: latLonToVec(hub.lat, hub.lon, R * 1.012)
	};
}
