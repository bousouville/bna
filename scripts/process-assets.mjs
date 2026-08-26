/*
	资产处理：从 assets/source 的品牌图生成站点所需资源
	- 去白衬底（ink-over-white unmatting：亮度→alpha，去白预乘还原墨色）
	- 标志裁切（trim）→ static/brand/
	- favicon / apple-touch-icon → static/
	- OG 图 → static/og.png
	- A330 侧视图裁切 → static/img/
*/
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, 'assets/source');
const BRAND = path.join(ROOT, 'static/brand');
const IMG = path.join(ROOT, 'static/img');

const NAVY = { r: 0, g: 32, b: 91 };

/* 墨水浮于白底：按亮度估 alpha（<=LOW 全不透明，>=HIGH 全透明），再扣除白底分量还原墨色 */
const LOW = 196;
const HIGH = 246;

async function keyOutWhite(inputBuf) {
	const { data, info } = await sharp(inputBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const px = data;
	for (let i = 0; i < px.length; i += 4) {
		const r = px[i], g = px[i + 1], b = px[i + 2];
		const L = 0.299 * r + 0.587 * g + 0.114 * b;
		const a = Math.min(1, Math.max(0, (HIGH - L) / (HIGH - LOW)));
		if (a <= 0) {
			px[i] = px[i + 1] = px[i + 2] = 0;
			px[i + 3] = 0;
		} else {
			const inv = (1 - a) * 255;
			px[i] = Math.min(255, Math.max(0, Math.round((r - inv) / a)));
			px[i + 1] = Math.min(255, Math.max(0, Math.round((g - inv) / a)));
			px[i + 2] = Math.min(255, Math.max(0, Math.round((b - inv) / a)));
			px[i + 3] = Math.round(a * 255);
		}
	}
	return { data: px, info };
}

/* 抠图 + 裁切 + 缩放 → 带 alpha 的 webp */
async function keyToFile(input, out, opts = {}) {
	const trimmed = await sharp(input).trim({ threshold: 12 }).toBuffer();
	const { data, info } = await keyOutWhite(trimmed);
	let img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
	if (opts.maxWidth) img = img.resize({ width: opts.maxWidth, withoutEnlargement: true });
	await img.webp({ quality: opts.quality ?? 92, alphaQuality: 95 }).toFile(out);
	const meta = await sharp(out).metadata();
	console.log(path.basename(out), meta.width, 'x', meta.height, 'channels:' + meta.channels);
	return meta;
}

async function main() {
	await mkdir(BRAND, { recursive: true });
	await mkdir(IMG, { recursive: true });

	/* 1. monogram：彩色去衬底版 + 纯白单色版 */
	const monoTrim = await sharp(path.join(SRC, 'monogram.png')).trim({ threshold: 12 }).toBuffer();
	const mMeta = await keyToFile(monoTrim, path.join(BRAND, 'monogram.webp'), { maxWidth: 720 });

	const { data: wRaw, info: wInfo } = await keyOutWhite(monoTrim);
	for (let i = 0; i < wRaw.length; i += 4) {
		wRaw[i] = 255; wRaw[i + 1] = 255; wRaw[i + 2] = 255;
	}
	await sharp(wRaw, { raw: { width: wInfo.width, height: wInfo.height, channels: 4 } })
		.resize({ width: 720, withoutEnlargement: true })
		.webp({ quality: 92, alphaQuality: 95 })
		.toFile(path.join(BRAND, 'monogram-white.webp'));
	console.log('monogram-white', wInfo.width, 'x', wInfo.height, 'aspect:', (wInfo.width / wInfo.height).toFixed(3));

	/* 2. 完整标志（横版字标，去衬底） */
	await keyToFile(path.join(SRC, 'logo-corp.png'), path.join(BRAND, 'logo-full.webp'), { maxWidth: 1000 });
	await keyToFile(path.join(SRC, 'logo-short.png'), path.join(BRAND, 'logo-short.webp'), { maxWidth: 1000 });

	/* 3. favicon 与 apple-touch-icon（海军蓝底 + 白色单字标） */
	const monoWhiteRaw = await sharp(path.join(BRAND, 'monogram-white.webp')).toBuffer();
	const iconBase = async (size) => {
		const inner = await sharp(monoWhiteRaw)
			.resize({ width: Math.round(size * 0.74) })
			.png()
			.toBuffer();
		return sharp({
				create: { width: size, height: size, channels: 4, background: { ...NAVY, alpha: 1 } }
			})
				.composite([{ input: inner, gravity: 'centre' }]);
	};
	await (await iconBase(64)).png().toFile(path.join(ROOT, 'static/favicon-32.png'));
	await (await iconBase(128)).png().toFile(path.join(ROOT, 'static/favicon.png'));
	await (await iconBase(180)).png().toFile(path.join(ROOT, 'static/apple-touch-icon.png'));
	console.log('favicons ok');

	/* 4. OG 图 1200×630：海军蓝渐变 + 金带 + 白卡彩色标志 */
	const W = 1200, H = 630;
	const logoFull = await sharp(path.join(SRC, 'logo-corp.png')).trim({ threshold: 12 }).toBuffer();
	const logoMeta = await sharp(logoFull).metadata();
	const logoW = 720;
	const logoH = Math.round((logoMeta.height / logoMeta.width) * logoW);
	const logoPng = await sharp(logoFull).resize({ width: logoW }).png().toBuffer();
	const cardW = logoW + 160, cardH = logoH + 120;
	const card = await sharp({
		create: { width: cardW, height: cardH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
	})
		.composite([{ input: logoPng, gravity: 'centre' }])
		.png()
		.toBuffer();
	const ribbon = Buffer.from(
		`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#001540"/>
					<stop offset="1" stop-color="#0a2d6e"/>
				</linearGradient>
			</defs>
			<rect width="${W}" height="${H}" fill="url(#bg)"/>
			<path d="M-40 ${H} L ${W} 180 L ${W} 300 L 160 ${H} Z" fill="#B0913F" opacity="0.9"/>
			<path d="M-40 ${H} L ${W} 120 L ${W} 150 L 60 ${H} Z" fill="#00205B" opacity="0.85"/>
		</svg>`
	);
	await sharp(ribbon)
		.composite([{ input: card, gravity: 'centre' }])
		.png()
		.toFile(path.join(ROOT, 'static/og.png'));
	console.log('og ok');

	/* 5. A330 左侧主视图裁切 */
	const side = await sharp(path.join(SRC, 'a330-fourview.png'))
		.extract({ left: 20, top: 60, width: 1408, height: 420 })
		.trim({ threshold: 12 })
		.toBuffer();
	await sharp(side).webp({ quality: 90 }).toFile(path.join(IMG, 'a330-side.webp'));
	const sideMeta = await sharp(side).metadata();
	console.log('a330-side', sideMeta.width, 'x', sideMeta.height);

	console.log('ALL DONE');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
