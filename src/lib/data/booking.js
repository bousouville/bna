/* 訂座引擎 — 確定性生成班期、運價與座位圖（客戶端） */
import { HUB, destinations, findDest } from '$data/destinations.js';
import { typeForDistance, typeMixForFlight, fleet } from '$data/fleet.js';

/* ---------- helpers ---------- */

function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

export function haversineKm(a, b) {
	const R = 6371;
	const toRad = (x) => (x * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLon = toRad(b.lon - a.lon);
	const s =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
	return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

/* 短航段實際巡航較低；渦槳與支線機型使用更低巡航檔，另加滑行與進場時間 */
export function blockMinutes(km) {
	const cruise = km <= 400 ? 390 : km <= 800 ? 480 : km <= 1400 ? 650 : km <= 2300 ? 770 : 865;
	return Math.round((km / cruise) * 60 + 32 + Math.min(18, km / 220));
}

export function formatDur(min) {
	const h = Math.floor(min / 60);
	const m = min % 60;
	return `${h}:${String(m).padStart(2, '0')}`;
}

/* ---------- 航班號 ---------- */

/* 區域號塊（每航點 10 個號位，去程偶數間隔、回程 +1）：
   國內 100– · 大中華 200–（港原快線 201–208 佔用 HKG 自身號位）· 歐 350– ·
   亞太 900–（龍城快線 801–812 佔用其間空檔）· 中東南亞 1200– · 非洲 1300– · 美洲 1400– */
const REGION_START = {
	domestic: 100,
	'greater-china': 200,
	europe: 350,
	'asia-pacific': 900,
	'middle-east': 1200,
	africa: 1300,
	americas: 1400
};

function flightNumbers(dest, count) {
	const start = REGION_START[dest.region] ?? 300;
	const idxInRegion = destinations.filter((d) => d.region === dest.region).findIndex((d) => d.iata === dest.iata);
	const base = start + Math.max(0, idxInRegion) * 10;
	return Array.from({ length: count }, (_, i) => 'BN' + (base + i * 2));
}

/* 快線：固定班次與時刻（本地分鐘），往返成對 */
const SHUTTLE_HKG_OUT = [
	{ no: 'BN202', min: 515 }, /* 08:35 */
	{ no: 'BN204', min: 800 }, /* 13:20 */
	{ no: 'BN208', min: 1085 }, /* 18:05 */
	{ no: 'BN206', min: 1435 } /* 23:55 */
];
const SHUTTLE_HKG_RET = [
	{ no: 'BN201', min: 550 }, /* 09:10 */
	{ no: 'BN203', min: 845 }, /* 14:05 */
	{ no: 'BN205', min: 1150 }, /* 19:10 */
	{ no: 'BN207', min: 55 } /* 00:55 */
];
const SHUTTLE_LSG_OUT = [
	{ no: 'BN801', min: 400 },
	{ no: 'BN803', min: 520 },
	{ no: 'BN805', min: 700 },
	{ no: 'BN807', min: 880 },
	{ no: 'BN809', min: 1060 },
	{ no: 'BN811', min: 1210 }
];
const SHUTTLE_LSG_RET = [
	{ no: 'BN802', min: 510 },
	{ no: 'BN804', min: 630 },
	{ no: 'BN806', min: 810 },
	{ no: 'BN808', min: 990 },
	{ no: 'BN810', min: 1170 },
	{ no: 'BN812', min: 1320 }
];

/* ---------- schedule ---------- */

export function getRoute(fromIata, toIata) {
	const origin = fromIata === HUB.iata ? HUB : findDest(fromIata);
	const dest = toIata === HUB.iata ? HUB : findDest(toIata);
	if (!origin || !dest) return null;
	const km = haversineKm(origin, dest);
	return { origin, dest, km };
}

/* 與 UTC 偏移（分鐘） */
function tzOffsetMinutes(tz, date) {
	const dtf = new Intl.DateTimeFormat('en-US', {
		timeZone: tz,
		timeZoneName: 'shortOffset'
	});
	const part = dtf.formatToParts(date).find((p) => p.type === 'timeZoneName');
	const m = part && part.value.match(/GMT([+-]\d+)?/);
	if (!m) return 0;
	const sign = m[1] && m[1][0] === '-' ? -1 : 1;
	const num = m[1] ? parseInt(m[1].replace(/[+-]/, ''), 10) : 0;
	return sign * num * 60;
}

/* dateLocal "2026-09-01" + 分鐘數（本地）→ UTC Date */
function localToUtc(tz, dateStr, minutesLocal) {
	const [y, mo, d] = dateStr.split('-').map(Number);
	const probe = new Date(Date.UTC(y, mo - 1, d, 0, minutesLocal));
	const off = tzOffsetMinutes(tz, probe);
	return new Date(probe.getTime() - off * 60000);
}

/* UTC Date → 當地時間字符串 */
export function fmtLocal(date, tz) {
	return new Intl.DateTimeFormat('en-GB', {
		timeZone: tz,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(date);
}

export function searchFlights({ from, to, date }) {
	const route = getRoute(from, to);
	if (!route || route.km < 1) return null;
	const { origin, dest, km } = route;
	const seed = hashStr(`${origin.iata}-${dest.iata}`);
	const idx = Math.max(0, destinations.findIndex((d) => d.iata === dest.iata));
	const outbound = origin.iata === HUB.iata;
	const weekly = dest.iata === HUB.iata ? origin.weekly : dest.weekly;
	const shuttleNo = outbound ? dest.iata : origin.iata;

	/* 機型強制字段（dest.aircraft）恒取「非樞紐一端」的航點，保證往返一致 */
	const nonHubCity = outbound ? dest : origin;

	/* 該日期是否運營：以 (dayOfYear + idx) % 7 < weekly 近似班期表；每日 ≥ 1 班的航線天天運營 */
	const day = Math.floor(Date.parse(date + 'T00:00Z') / 86400000);
	const daily = Math.max(1, Math.round(weekly / 7));
	const operatesToday = weekly >= 7 ? true : ((day + idx * 3) % 7) < Math.min(7, weekly);

	const rand = mulberry32(seed ^ hashStr(date));
	const block = blockMinutes(km);

	/* 快線固定時刻（雙向）；否則從時刻池取 */
	const shuttleSlots = shuttleNo === 'HKG' ? (outbound ? SHUTTLE_HKG_OUT : SHUTTLE_HKG_RET) : shuttleNo === 'LSG' ? (outbound ? SHUTTLE_LSG_OUT : SHUTTLE_LSG_RET) : null;
	let depSlots;
	if (shuttleSlots) {
		depSlots = shuttleSlots.slice(0, Math.min(daily, shuttleSlots.length));
	} else {
		const POOL = [35, 255, 415, 555, 700, 845, 1000, 1215, 1435];
		depSlots = Array.from({ length: daily }, (_, i) => ({
			no: null,
			min: POOL[(idx * 2 + i * 3 + (seed % 5)) % POOL.length] + (rand() < 0.3 ? 45 : 0)
		}));
	}

	/* 航班號以「非樞紐一端」所屬航點的號段為基準，返程 +1 成對 */
	const routeCity = outbound ? dest : origin;
	const nums = flightNumbers(routeCity, Math.max(4, daily));

	const flights = [];
	if (operatesToday) {
		for (let i = 0; i < depSlots.length; i++) {
			const slot = depSlots[i];
			const depDate = new Date(localToUtc(origin.tz, date, slot.min));
			const arrDate = new Date(depDate.getTime() + block * 60000);
			/* 一條航線多型混派：重疊帶內按確定性隨機交替新老機型；強制機型以非樞紐端為準 */
			const type = typeMixForFlight(km, nonHubCity, rand());
			const tinfo = fleet.find((t) => t.id === type) || fleet[0];
			let no;
			if (slot.no) {
				no = slot.no;
			} else {
				const n = nums[i] || nums[0];
				no = outbound ? n : 'BN' + (parseInt(n.slice(2), 10) + 1);
			}
			flights.push({
				no,
				icaoNo: null,
				from: origin,
				to: dest,
				depUtc: depDate.toISOString(),
				arrUtc: arrDate.toISOString(),
				depLocal: fmtLocal(depDate, origin.tz),
				arrLocal: fmtLocal(arrDate, dest.tz),
				block,
				km,
				type,
				typeName: tinfo.name,
				meal: km > 2500,
				seats: {
					j: Math.max(2, Math.min(tinfo.seats.j - 2, 4 + Math.floor(rand() * 12))),
					w: tinfo.seats.w > 0 ? Math.max(2, Math.min(tinfo.seats.w - 2, 2 + Math.floor(rand() * 10))) : 0,
					y: Math.max(4, Math.min(tinfo.seats.y - 4, 6 + Math.floor(rand() * 40)))
				}
			});
		}
	}
	flights.sort((a, b) => a.depUtc.localeCompare(b.depUtc));
	return { route: { origin, dest, km }, date, flights };
}

/* ---------- fares ---------- */

const BOU_PER_KM_Y = 0.052;
const MIN_FARE = 49;

export function fareQuote(km) {
	const yBase = Math.max(MIN_FARE, Math.round((km * BOU_PER_KM_Y) / 5) * 5 - 1);
	return {
		light: yBase,
		classic: Math.round(yBase * 1.38) - 1,
		flex: Math.round(yBase * 1.95) - 1,
		w: Math.round(yBase * 2.1) - 1,
		j: Math.round(yBase * 4.4) - 1
	};
}

/* ---------- seat maps ---------- */

export function seatMap(type) {
	/* 每艙：rows 行數、letters 座位字母（左→右）、aisles 過道字母 */
	const J11 = ['A', 'D', 'G', 'K'];
	const A8 = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'K'];
	const A6 = ['A', 'B', 'C', 'D', 'E', 'F'];
	const A4 = ['A', 'C', 'D', 'F']; /* 單通道兩側雙座 2-2，過道 C-D */
	const T5 = ['A', 'B', 'C', 'D', 'E']; /* 909 經濟艙 2-3 */
	const P4 = ['A', 'B', 'C', 'D']; /* 渦槳 2-2 */
	const T3 = ['A', 'B', 'C']; /* ERJ 1-2 */
	const layouts = {
		a330: { j: { rows: 8, letters: J11, aisles: ['D', 'G'] }, w: { rows: 3, letters: A8, aisles: ['C', 'F', 'G'] }, y: { rows: 28, letters: A8, aisles: ['D', 'G'] } },
		a330neo: { j: { rows: 7, letters: J11, aisles: ['D', 'G'] }, w: { rows: 4, letters: A8, aisles: ['C', 'F', 'G'] }, y: { rows: 29, letters: A8, aisles: ['D', 'G'] } },
		a350: { j: { rows: 11, letters: J11, aisles: ['D', 'G'] }, w: { rows: 4, letters: A8, aisles: ['C', 'F', 'G'] }, y: { rows: 31, letters: A8, aisles: ['D', 'G'] } },
		a350ulr: { j: { rows: 11, letters: J11, aisles: ['D', 'G'] }, w: { rows: 5, letters: A8, aisles: ['C', 'F', 'G'] }, y: { rows: 19, letters: A8, aisles: ['D', 'G'] } },
		a321xlr: { j: { rows: 4, letters: A4, aisles: ['C'] }, y: { rows: 27, letters: A6, aisles: ['C', 'F'] } },
		a321neo: { j: { rows: 3, letters: A4, aisles: ['C'] }, y: { rows: 29, letters: A6, aisles: ['C', 'F'] } },
		c919: { j: { rows: 2, letters: A4, aisles: ['C'] }, y: { rows: 26, letters: A6, aisles: ['C', 'F'] } },
		e190e2: { j: { rows: 2, letters: A4, aisles: ['C'] }, y: { rows: 16, letters: A6, aisles: ['C', 'F'] } },
		c909: { j: { rows: 2, letters: A4, aisles: ['C'] }, y: { rows: 17, letters: T5, aisles: ['B', 'C'] } },
		atr72: { y: { rows: 18, letters: P4, aisles: ['B', 'C'] } },
		atr42: { y: { rows: 12, letters: P4, aisles: ['B', 'C'] } },
		bae146: { j: { rows: 2, letters: A4, aisles: ['C'] }, y: { rows: 15, letters: A6, aisles: ['C', 'F'] } },
		erj145: { y: { rows: 17, letters: T3, aisles: ['B'] } }
	};
	return layouts[type] || layouts.a321neo;
}

export function buildSeatMap(type, flightNo, date) {
	const cfg = seatMap(type);
	const rand = mulberry32(hashStr(flightNo + date));
	const out = {};
	let rowNo = 1;
	const cabins = ['j', 'w', 'y'].filter((c) => cfg[c]);
	const rowCounts = Object.fromEntries(cabins.map((c) => [c, cfg[c].rows]));
	const preceding = (c) => cabins.slice(0, cabins.indexOf(c)).reduce((s, k) => s + rowCounts[k], 0);
	for (const cab of cabins) {
		const c = cfg[cab];
		const yStart = cab === 'y' ? 1 + preceding('y') : 0;
		const rows = [];
		for (let r = 0; r < c.rows; r++) {
			const seats = c.letters.map((L) => {
				const roll = rand();
				const exit = cab === 'y' && (rowNo === yStart + 2 || rowNo === yStart + 3 || rowNo === yStart + 14);
				return {
					id: rowNo + L,
					occupied: roll < (cab === 'j' ? 0.42 : 0.68),
					paid: !exit && roll > 0.86 && c.letters.length > 3 && (L === 'A' || L === 'F' || L === 'K' || L === 'D'),
					exit,
					window: L === 'A' || L === 'K' || L === c.letters[c.letters.length - 1] && c.letters.length === 4,
					aisle: (c.aisles || []).includes(L)
				};
			});
			rows.push({ no: rowNo, seats });
			rowNo++;
		}
		out[cab] = rows;
	}
	return out;
}

/* ---------- PNR ---------- */

export function makeRef(flightNo, date) {
	const rand = mulberry32(hashStr(flightNo + date + 'ref'));
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let s = '';
	for (let i = 0; i < 6; i++) s += chars[Math.floor(rand() * chars.length)];
	return s;
}
