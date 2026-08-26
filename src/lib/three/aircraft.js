/*
 * 程序化 A330-300 机模 — 全部由代码构建，Canvas 程序绘制 BNA 涂装
 * buildAircraft(THREE) → { group, dispose() }
 *
 * 机体轴向：+X = 机头方向，+Y = 上，+Z = 左翼侧
 * 机身贴图 UV：u = 周向（0=+Z 侧缝，0.25=机腹，0.5=−Z 侧·标题面，0.75=机背），v = 纵向（1=机头）
 */

export function createAircraft(THREE) {
	const group = new THREE.Group();
	const disposables = [];

	const track = (obj) => (disposables.push(obj), obj);

	/* ---------- 尺寸（近似 A330-300，1 单位 = 1 m） ---------- */
	const FUSE_R = 2.95;
	const MID_LEN = 40; /* 圆柱中段长 */
	const NOSE_X = MID_LEN / 2; /* 中段前端 x=+20 */
	const TAIL_X = -MID_LEN / 2; /* 中段尾端 x=−20 */
	const SPAN = 58;

	/* ---------- 材质 ---------- */
	const whiteMat = track(new THREE.MeshStandardMaterial({ color: 0xf4f7fc, roughness: 0.42, metalness: 0.12 }));
	const wingMat = track(new THREE.MeshStandardMaterial({ color: 0xe8edf5, roughness: 0.5, metalness: 0.15, side: THREE.DoubleSide }));
	const navyMat = track(new THREE.MeshStandardMaterial({ color: 0x00205b, roughness: 0.4, metalness: 0.22 }));
	const goldMat = track(new THREE.MeshStandardMaterial({ color: 0xb0913f, roughness: 0.38, metalness: 0.45 }));

	/* ---------- 机身涂装贴图 ---------- */
	function makeFuselageTexture() {
		const W = 2048;
		const H = 1024;
		const c = document.createElement('canvas');
		c.width = W;
		c.height = H;
		const g = c.getContext('2d');

		g.fillStyle = '#f4f7fc';
		g.fillRect(0, 0, W, H);

		const BELLY = W * 0.25;
		const hTop = W * 0.09; /* 机头处机腹半宽 */
		const hBot = W * 0.165; /* 机尾处机腹半宽 */

		/* 机腹蓝区（上缘沿机身缓缓上扬：v=0 是机头→canvas 顶部） */
		g.fillStyle = '#00205b';
		g.beginPath();
		g.moveTo(BELLY - hTop, 0);
		g.lineTo(BELLY + hTop, 0);
		g.bezierCurveTo(BELLY + hTop + 30, H * 0.4, BELLY + hBot - 30, H * 0.7, BELLY + hBot, H);
		g.lineTo(BELLY - hBot, H);
		g.bezierCurveTo(BELLY - hBot + 30, H * 0.7, BELLY - hTop - 30, H * 0.4, BELLY - hTop, 0);
		g.closePath();
		g.fill();

		/* 金色腰线（蓝区两条边缘） */
		g.strokeStyle = '#b0913f';
		g.lineWidth = 22;
		for (const side of [-1, 1]) {
			g.beginPath();
			g.moveTo(BELLY + side * hTop, 0);
			g.bezierCurveTo(
				BELLY + side * (hTop + 30), H * 0.4,
				BELLY + side * (hBot - 30), H * 0.7,
				BELLY + side * hBot, H
			);
			g.stroke();
		}

		/* 舷窗两排（−Z 标题侧 x≈0.56W，+Z 侧 x≈0.94W；标题/舱门区域留空） */
		g.fillStyle = '#223354';
		const TITLE_Y0 = H * 0.24;
		const TITLE_Y1 = H * 0.44;
		const doorBands = [
			[H * 0.12 - 36, H * 0.12 + 36],
			[H * 0.58 - 36, H * 0.58 + 36]
		];
		for (const row of [
			{ x: W * 0.56, gap: true },
			{ x: W * 0.94, gap: false }
		]) {
			for (let i = 0; i < 46; i++) {
				const y = H * 0.08 + (H * 0.72 - H * 0.08) * (i / 45);
				if (row.gap && y > TITLE_Y0 && y < TITLE_Y1) continue;
				if (doorBands.some(([a, b]) => y > a && y < b)) continue;
				g.beginPath();
				g.arc(row.x, y, 9, 0, Math.PI * 2);
				g.fill();
			}
		}

		/* 舱门 */
		g.fillStyle = '#c9d3e6';
		for (const dx of [W * 0.475, W * 0.78]) {
			for (const dy of [H * 0.12, H * 0.58]) {
				g.fillRect(dx - 13, dy - 30, 26, 60);
			}
		}

		/* 航司名（−Z 侧，u≈0.56，嵌在舷窗带中） */
		g.fillStyle = '#00205b';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.font = '600 68px "Noto Sans TC", "PingFang TC", sans-serif';
		g.fillText('布索維爾國家航空', W * 0.56, H * 0.3);
		g.font = '700 36px "Inter", sans-serif';
		g.fillText('BOUSOVILLE NATIONAL AIRWAYS', W * 0.56, H * 0.375);

		/* 注册号（机尾，标题侧） */
		g.font = '700 46px "Inter", sans-serif';
		g.fillText('BU-BNA1', W * 0.56, H * 0.86);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = 4;
		track(tex);
		return tex;
	}

	/* ---------- 机身 ---------- */
	const fuseMat = track(new THREE.MeshStandardMaterial({ map: makeFuselageTexture(), roughness: 0.42, metalness: 0.12 }));

	const fuse = new THREE.Mesh(
		track(new THREE.CylinderGeometry(FUSE_R, FUSE_R, MID_LEN, 72, 1, true)),
		fuseMat
	);
	fuse.rotation.z = -Math.PI / 2; /* +Y(圆柱轴) → +X(机头) */
	group.add(fuse);

	/* 机头（白球壳，纵向下压呈水滴形） */
	const nose = new THREE.Mesh(track(new THREE.SphereGeometry(FUSE_R, 48, 32)), whiteMat);
	nose.scale.set(2.35, 0.98, 1);
	nose.position.x = NOSE_X;
	group.add(nose);

	/* 驾驶舱风挡（贴附在机头两侧的深色小块） */
	const glassMat = track(new THREE.MeshStandardMaterial({ color: 0x101a2c, roughness: 0.25, metalness: 0.4 }));
	for (const side of [1, -1]) {
		const pane = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 0.42, 0.1)), glassMat);
		pane.position.set(NOSE_X + 3.4, 0.75, side * 1.72);
		pane.rotation.y = side * 0.42;
		pane.rotation.z = -0.16;
		group.add(pane);
	}

	/* 机尾锥 */
	const tailcone = new THREE.Mesh(
		track(new THREE.CylinderGeometry(FUSE_R, FUSE_R * 0.16, 13, 48, 1, true)),
		fuseMat
	);
	tailcone.rotation.z = -Math.PI / 2; /* 大端(+Y) → +X，与中段衔接 */
	tailcone.position.x = TAIL_X - 6.5;
	group.add(tailcone);

	const tailTip = new THREE.Mesh(track(new THREE.SphereGeometry(FUSE_R * 0.16, 24, 16)), whiteMat);
	tailTip.scale.set(3.2, 1, 1);
	tailTip.position.x = TAIL_X - 13;
	group.add(tailTip);

	/* ---------- 机翼（形状坐标：shape-x = 世界 Z 展向，shape-y = 世界 X 弦向，负 = 向后） ---------- */
	function wingGeometry(semi, rootChord, tipChord, sweepFrac, thick) {
		const tipX = -semi * sweepFrac; /* 翼尖后掠量 */
		const s = new THREE.Shape();
		s.moveTo(0, 0);
		s.lineTo(semi, tipX);
		s.lineTo(semi, tipX - tipChord);
		s.lineTo(0, -rootChord);
		s.closePath();
		const geo = new THREE.ExtrudeGeometry(s, {
			depth: thick,
			bevelEnabled: true,
			bevelThickness: thick * 0.6,
			bevelSize: thick * 0.7,
			bevelSegments: 2
		});
		return geo;
	}

	const WING_SEMI = SPAN / 2 - 3;
	const wingGeo = track(wingGeometry(WING_SEMI, 7.8, 2.7, 0.30, 0.55));
	const wingY = -FUSE_R * 0.42;

	const wingR = new THREE.Mesh(wingGeo, wingMat);
	wingR.position.set(NOSE_X - 6, wingY, 2.6);
	wingR.rotation.x = 0.06; /* 上反角 */
	group.add(wingR);

	const wingL = new THREE.Mesh(wingGeo, wingMat);
	wingL.scale.z = -1;
	wingL.position.set(NOSE_X - 6, wingY, -2.6);
	wingL.rotation.x = -0.06;
	group.add(wingL);

	/* 翼梢小翼 */
	const sharkGeo = track(new THREE.BoxGeometry(1.1, 2.1, 2.4));
	for (const side of [1, -1]) {
		const shark = new THREE.Mesh(sharkGeo, wingMat);
		shark.position.set(NOSE_X - 6 - WING_SEMI * 0.30 + 1.0, wingY + WING_SEMI * 0.06 + 0.9, side * (2.6 + WING_SEMI));
		shark.rotation.x = side * -0.32;
		group.add(shark);
	}

	/* ---------- 垂直尾翼 ---------- */
	const finShape = new THREE.Shape();
	finShape.moveTo(1.6, 0);
	finShape.lineTo(-7.4, 10.4);
	finShape.quadraticCurveTo(-8.1, 11.0, -9.0, 10.9);
	finShape.lineTo(-8.7, 9.7);
	finShape.lineTo(-3.0, 0);
	finShape.closePath();
	const finGeo = track(new THREE.ExtrudeGeometry(finShape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.16, bevelSegments: 1 }));
	const fin = new THREE.Mesh(finGeo, navyMat);
	fin.geometry.translate(0, 0, -0.28); /* 厚度居中 */
	fin.position.set(TAIL_X + 5.5, FUSE_R * 0.72, 0);
	group.add(fin);

	/* 尾翼金飘带 */
	const finRibbon = new THREE.Mesh(track(new THREE.BoxGeometry(7.6, 1.25, 0.08)), goldMat);
	finRibbon.position.set(TAIL_X + 5.5 - 4.2, FUSE_R * 0.72 + 5.6, 0.31);
	finRibbon.rotation.z = 0.83;
	group.add(finRibbon);
	const finRibbon2 = finRibbon.clone();
	finRibbon2.position.z = -0.31;
	group.add(finRibbon2);

	/* 尾翼白色单字标（品牌抠图位图） */
	async function loadMarkTexture() {
		const res = await fetch(`${base}/brand/monogram-white.webp`);
		const blob = await res.blob();
		const bmp = await createImageBitmap(blob);
		const tex = new THREE.Texture(bmp);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = 4;
		tex.needsUpdate = true;
		track(tex);
		return tex;
	}
	/* 尾翼白色单字标：异步加载贴图后更新材质（初始为无贴图的白色平面） */
	const markMat = track(new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.4, metalness: 0.1, opacity: 0 }));
	const markPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(4.6, 3.1)), markMat);
	markPlane.position.set(TAIL_X + 5.5 - 4.2, FUSE_R * 0.72 + 5.6, 0.34);
	markPlane.rotation.z = -0.83;
	group.add(markPlane);
	const markPlane2 = markPlane.clone();
	markPlane2.rotation.y = Math.PI;
	markPlane2.position.z = -0.34;
	group.add(markPlane2);
	loadMarkTexture()
		.then((tex) => {
			markMat.map = tex;
			markMat.opacity = 1;
			markMat.needsUpdate = true;
		})
		.catch(() => {});

	/* ---------- 水平尾翼 ---------- */
	const stabGeo = track(wingGeometry(14.6, 3.9, 1.5, 0.42, 0.35));
	for (const side of [1, -1]) {
		const stab = new THREE.Mesh(stabGeo, wingMat);
		stab.scale.z = side;
		stab.position.set(TAIL_X + 4.5, FUSE_R * 0.42, side * 1.8);
		stab.rotation.x = side * 0.07;
		group.add(stab);
	}

	/* ---------- 发动机 ×2 ---------- */
	function buildEngine() {
		const e = new THREE.Group();
		const nac = new THREE.Mesh(
			track(new THREE.CylinderGeometry(1.5, 1.32, 4.8, 40, 1, true)),
			navyMat
		);
		nac.rotation.z = -Math.PI / 2;
		e.add(nac);
		const lip = new THREE.Mesh(track(new THREE.TorusGeometry(1.47, 0.16, 18, 40)), whiteMat);
		lip.rotation.y = Math.PI / 2;
		lip.position.x = 2.4;
		e.add(lip);
		const fan = new THREE.Mesh(track(new THREE.CircleGeometry(1.36, 40)), track(new THREE.MeshStandardMaterial({ color: 0x1b2436, roughness: 0.55, metalness: 0.65 })));
		fan.rotation.y = Math.PI / 2;
		fan.position.x = 2.15;
		e.add(fan);
		const mark = new THREE.Mesh(track(new THREE.RingGeometry(0.5, 0.66, 32)), goldMat);
		mark.rotation.y = Math.PI / 2;
		mark.position.x = 2.12;
		e.add(mark);
		const spinner = new THREE.Mesh(track(new THREE.ConeGeometry(0.3, 0.7, 24)), whiteMat);
		spinner.rotation.z = -Math.PI / 2;
		spinner.position.x = 2.45;
		e.add(spinner);
		const cone = new THREE.Mesh(track(new THREE.ConeGeometry(0.85, 1.5, 32)), track(new THREE.MeshStandardMaterial({ color: 0xb9c2d4, roughness: 0.4, metalness: 0.6 })));
		cone.rotation.z = -Math.PI / 2;
		cone.position.x = -3.0;
		e.add(cone);
		return e;
	}

	const engY = -FUSE_R * 0.5;
	const engZ = 10.2;
	const engX = NOSE_X - 9.5;
	for (const side of [1, -1]) {
		const eng = buildEngine();
		eng.position.set(engX, engY, side * engZ);
		group.add(eng);
		const pylon = new THREE.Mesh(track(new THREE.BoxGeometry(3.6, 1.5, 0.55)), whiteMat);
		pylon.position.set(engX + 0.4, engY + 1.35, side * engZ);
		group.add(pylon);
	}

	group.userData.span = SPAN;

	return {
		group,
		dispose() {
			for (const d of disposables) {
				if (d && d.dispose) d.dispose();
			}
		}
	};
}
