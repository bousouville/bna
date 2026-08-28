/* 機隊數據 — 全型號多代共存：
   幹線寬體（A350/A330 兩代）· 寬體經典（A340/A300/A310/767）· 幹線單通道（A321/C919/E190-E2/757）·
   區域與渦槳（C909/ATR/BAe146/ERJ145）· 貨機（A330F/A350F/757F/767F/An-124/An-225）· 歷史機隊 */
export const fleet = [
	/* ---------- 幹線寬體 ---------- */
	{
		id: 'a350',
		group: 'mainline',
		name: { zh: '空中客車 A350-1000', en: 'Airbus A350-1000' },
		units: 8, orders: 4, firstDelivery: 2020,
		seats: { j: 44, w: 32, y: 248 },
		rangeKm: 16100, lengthM: 73.78, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2', en: 'Rolls-Royce Trent XWB-97 ×2' },
		regExample: 'BU-BNA2', viewer: 'a350'
	},
	{
		id: 'a350ulr',
		group: 'mainline',
		name: { zh: '空中客車 A350-1000ULR', en: 'Airbus A350-1000ULR' },
		units: 5, orders: 0, firstDelivery: 2024,
		seats: { j: 44, w: 40, y: 152 },
		rangeKm: 18300, lengthM: 73.78, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2（增強型）', en: 'Rolls-Royce Trent XWB-97 ×2 (enhanced)' },
		regExample: 'BU-BNA21', viewer: 'a350',
		note: { zh: '專司悉尼／墨爾本直飛', en: 'Dedicated to the Australia nonstops' }
	},
	{
		id: 'a330neo',
		group: 'mainline',
		name: { zh: '空中客車 A330-900neo', en: 'Airbus A330-900neo' },
		units: 12, orders: 2, firstDelivery: 2022,
		seats: { j: 28, w: 32, y: 232 },
		rangeKm: 13300, lengthM: 63.66, spanM: 64.0, speedKmh: 913,
		engines: { zh: '勞斯萊斯 Trent 7000 ×2', en: 'Rolls-Royce Trent 7000 ×2' },
		regExample: 'BU-BNA5', viewer: 'a330'
	},
	{
		id: 'a330',
		group: 'mainline',
		name: { zh: '空中客車 A330-300', en: 'Airbus A330-300' },
		units: 7, orders: 0, firstDelivery: 2013,
		seats: { j: 32, w: 24, y: 224 },
		rangeKm: 11750, lengthM: 63.66, spanM: 60.3, speedKmh: 871,
		engines: { zh: '勞斯萊斯 Trent 700 ×2', en: 'Rolls-Royce Trent 700 ×2' },
		regExample: 'BU-BNA1', viewer: 'a330',
		note: { zh: '首批寬體，隨 A330neo 交付逐步轉飛中短程', en: 'The first widebody batch, migrating to medium-haul as A330neos arrive' }
	},

	/* ---------- 寬體經典 ---------- */
	{
		id: 'a340',
		group: 'classic',
		name: { zh: '空中客車 A340-300', en: 'Airbus A340-300' },
		units: 4, orders: 0, firstDelivery: 2001,
		seats: { j: 30, w: 24, y: 216 },
		rangeKm: 13700, lengthM: 63.6, spanM: 60.3, speedKmh: 871,
		engines: { zh: 'CFM56-5C4 ×4', en: '4 × CFM56-5C4' },
		regExample: 'BU-BN34',
		note: { zh: '四發遠程老將，仍堅守北美與非洲部分航線', en: 'Four-engined long-haul veteran, still holding North America and Africa sectors' }
	},
	{
		id: 'a300',
		group: 'classic',
		name: { zh: '空中客車 A300-600R', en: 'Airbus A300-600R' },
		units: 3, orders: 0, firstDelivery: 1992,
		seats: { j: 24, w: 18, y: 198 },
		rangeKm: 7500, lengthM: 54.08, spanM: 44.84, speedKmh: 871,
		engines: { zh: '普惠 PW4158 ×2', en: 'Pratt & Whitney PW4158 ×2' },
		regExample: 'BU-BNA6',
		note: { zh: '八十年代訂購的初代雙發寬體，如今退守中程與夜航', en: 'An early twin widebody now resting on medium-haul and night sectors' }
	},
	{
		id: 'a310',
		group: 'classic',
		name: { zh: '空中客車 A310-300', en: 'Airbus A310-300' },
		units: 2, orders: 0, firstDelivery: 1990,
		seats: { j: 20, w: 16, y: 168 },
		rangeKm: 9500, lengthM: 46.66, spanM: 43.9, speedKmh: 865,
		engines: { zh: 'CF6-80C2 ×2', en: 'GE CF6-80C2 ×2' },
		regExample: 'BU-BNA0',
		note: { zh: '高密度中程與區域樞紐橋接', en: 'High-density medium-haul and regional hub feeding' }
	},
	{
		id: 'b767',
		group: 'classic',
		name: { zh: '波音 767-300ER', en: 'Boeing 767-300ER' },
		units: 5, orders: 0, firstDelivery: 1998,
		seats: { j: 26, w: 22, y: 178 },
		rangeKm: 11300, lengthM: 54.94, spanM: 47.57, speedKmh: 851,
		engines: { zh: 'GE CF6-80C2 ×2', en: 'GE CF6-80C2 ×2' },
		regExample: 'BU-BW67',
		note: { zh: '跨大西洋與中東的主力老臣', en: 'Workhorse of the transatlantic and Middle East lines' }
	},

	/* ---------- 幹線單通道 ---------- */
	{
		id: 'a321xlr',
		group: 'mainline',
		name: { zh: '空中客車 A321XLR', en: 'Airbus A321XLR' },
		units: 9, orders: 6, firstDelivery: 2024,
		seats: { j: 16, w: 0, y: 162 },
		rangeKm: 8700, lengthM: 44.51, spanM: 35.8, speedKmh: 876,
		engines: { zh: '普惠 PW1133G-JM ×2', en: 'Pratt & Whitney PW1133G-JM ×2' },
		regExample: 'BU-BNA8'
	},
	{
		id: 'a321neo',
		group: 'mainline',
		name: { zh: '空中客車 A321neo', en: 'Airbus A321neo' },
		units: 8, orders: 0, firstDelivery: 2019,
		seats: { j: 12, w: 0, y: 174 },
		rangeKm: 6900, lengthM: 44.51, spanM: 35.8, speedKmh: 870,
		engines: { zh: '普惠 PW1127G-JM ×2', en: 'Pratt & Whitney PW1127G-JM ×2' },
		regExample: 'BU-BNA7',
		note: { zh: '龍城快線與區域主力', en: 'Workhorse of the Lung Shing shuttle and regional sectors' }
	},
	{
		id: 'b757',
		group: 'mainline',
		name: { zh: '波音 757-200', en: 'Boeing 757-200' },
		units: 6, orders: 0, firstDelivery: 1995,
		seats: { j: 16, w: 0, y: 168 },
		rangeKm: 7200, lengthM: 47.32, spanM: 38.05, speedKmh: 850,
		engines: { zh: '普惠 PW2040 ×2', en: 'Pratt & Whitney PW2040 ×2' },
		regExample: 'BU-BW57',
		note: { zh: '窄體經典：跨大西洋與國內高頻快線兩棲', en: 'A narrowbody classic for both transatlantic and high-frequency domestic' }
	},
	{
		id: 'c919',
		group: 'mainline',
		name: { zh: '中國商飛 C919', en: 'COMAC C919' },
		units: 18, orders: 8, firstDelivery: 2023,
		seats: { j: 8, w: 0, y: 156 },
		rangeKm: 5500, lengthM: 38.9, spanM: 35.8, speedKmh: 834,
		engines: { zh: 'CFM LEAP-1C ×2', en: 'CFM LEAP-1C ×2' },
		regExample: 'BU-BNC9',
		note: { zh: '中國產幹線單通道：成體系運營國內與大中華區航線', en: 'Chinese-made single-aisle mainliner, flying the domestic and Greater China network at scale' }
	},
	{
		id: 'e190e2',
		group: 'mainline',
		name: { zh: '巴航工業 E190-E2', en: 'Embraer E190-E2' },
		units: 8, orders: 0, firstDelivery: 2023,
		seats: { j: 8, w: 0, y: 92 },
		rangeKm: 5300, lengthM: 36.24, spanM: 35.12, speedKmh: 829,
		engines: { zh: '普惠 PW1900G ×2', en: 'Pratt & Whitney PW1900G ×2' },
		regExample: 'BU-E291',
		note: { zh: '幹線以下的容量補空', en: 'Bridges the capacity gap below mainline' }
	},

	/* ---------- 區域與支線 ---------- */
	{
		id: 'c909',
		group: 'regional',
		name: { zh: '中國商飛 C909', en: 'COMAC C909' },
		units: 16, orders: 0, firstDelivery: 2022,
		seats: { j: 8, w: 0, y: 82 },
		rangeKm: 3700, lengthM: 33.46, spanM: 27.28, speedKmh: 815,
		engines: { zh: 'GE CF34-10A ×2', en: 'GE CF34-10A ×2' },
		regExample: 'BU-CR91',
		note: { zh: '支線網絡主幹', en: 'Backbone of the regional network' }
	},
	{
		id: 'atr72',
		group: 'regional',
		name: { zh: 'ATR 72-600', en: 'ATR 72-600' },
		units: 10, orders: 0, firstDelivery: 2019,
		seats: { j: 0, w: 0, y: 70 },
		rangeKm: 1500, lengthM: 27.17, spanM: 27.05, speedKmh: 510,
		engines: { zh: '普惠 PW127M 渦槳 ×2', en: '2 × Pratt & Whitney PW127M turboprop' },
		regExample: 'BU-TK72'
	},
	{
		id: 'atr42',
		group: 'regional',
		name: { zh: 'ATR 42-600', en: 'ATR 42-600' },
		units: 5, orders: 0, firstDelivery: 2016,
		seats: { j: 0, w: 0, y: 48 },
		rangeKm: 1310, lengthM: 25.06, spanM: 24.57, speedKmh: 540,
		engines: { zh: '普惠 PW127E 渦槳 ×2', en: '2 × Pratt & Whitney PW127E turboprop' },
		regExample: 'BU-TK42'
	},
	{
		id: 'bae146',
		group: 'regional',
		name: { zh: '英國宇航 BAe 146-200QT', en: 'BAe 146-200QT' },
		units: 3, orders: 0, firstDelivery: 1988,
		seats: { j: 8, w: 0, y: 86 },
		rangeKm: 2280, lengthM: 28.6, spanM: 26.34, speedKmh: 747,
		engines: { zh: 'Honeywell ALF 502R-5 ×4', en: '4 × Honeywell ALF 502R-5' },
		regExample: 'BU-QT07'
	},
	{
		id: 'erj145',
		group: 'regional',
		name: { zh: '巴航工業 ERJ-145', en: 'Embraer ERJ-145' },
		units: 4, orders: 0, firstDelivery: 1999,
		seats: { j: 0, w: 0, y: 50 },
		rangeKm: 2870, lengthM: 29.87, spanM: 20.04, speedKmh: 722,
		engines: { zh: '勞斯萊斯 AE 3007A ×2', en: 'Rolls-Royce AE 3007A ×2' },
		regExample: 'BU-ER11'
	},

	/* ---------- 貨機 ---------- */
	{
		id: 'a332f', group: 'freight',
		name: { zh: '空中客車 A330-200F（貨機）', en: 'Airbus A330-200F Freighter' },
		units: 3, orders: 0, firstDelivery: 2016, payloadT: 61,
		rangeKm: 7400, lengthM: 58.82, spanM: 60.3, speedKmh: 871,
		engines: { zh: '勞斯萊斯 Trent 772B ×2', en: 'Rolls-Royce Trent 772B ×2' },
		regExample: 'BU-CAF1'
	},
	{
		id: 'b757f', group: 'freight',
		name: { zh: '波音 757-200PCF（貨機）', en: 'Boeing 757-200PCF Freighter' },
		units: 4, orders: 0, firstDelivery: 1998, payloadT: 34,
		rangeKm: 5830, lengthM: 47.32, spanM: 38.05, speedKmh: 850,
		engines: { zh: '普惠 PW2040 ×2', en: 'Pratt & Whitney PW2040 ×2' },
		regExample: 'BU-PZF4'
	},
	{
		id: 'b767f', group: 'freight',
		name: { zh: '波音 767-300F（貨機）', en: 'Boeing 767-300F Freighter' },
		units: 5, orders: 0, firstDelivery: 2009, payloadT: 53,
		rangeKm: 6000, lengthM: 54.94, spanM: 47.57, speedKmh: 851,
		engines: { zh: 'GE CF6-80C2 ×2', en: 'GE CF6-80C2 ×2' },
		regExample: 'BU-PZM2'
	},
	{
		id: 'an124', group: 'freight',
		name: { zh: '安托諾夫 An-124-100（重型運輸機）', en: 'Antonov An-124-100 Heavy Lifter' },
		units: 2, orders: 0, firstDelivery: 1986, payloadT: 120,
		rangeKm: 4500, lengthM: 69.1, spanM: 73.3, speedKmh: 800,
		engines: { zh: 'Lotarev D-18T ×4', en: '4 × Lotarev D-18T' },
		regExample: 'BU-AN22'
	},
	{
		id: 'an225', group: 'freight',
		name: { zh: '安托諾夫 An-225「米莉亞二號」（重型運輸機）', en: 'Antonov An-225 “Mriya II” Heavy Lifter' },
		units: 1, orders: 0, firstDelivery: 2025, payloadT: 250,
		rangeKm: 4000, lengthM: 84.0, spanM: 88.4, speedKmh: 850,
		engines: { zh: 'Lotarev D-18T ×6', en: '6 × Lotarev D-18T' },
		regExample: 'BU-MRI02'
	},
	{
		id: 'a350f', group: 'freight',
		name: { zh: '空中客車 A350F（貨機）', en: 'Airbus A350F Freighter' },
		units: 0, orders: 4, firstDelivery: 2027, payloadT: 109,
		rangeKm: 8700, lengthM: 70.8, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2', en: 'Rolls-Royce Trent XWB-97 ×2' },
		regExample: 'BU-CAF3'
	}
];

/* ---------- 歷史機隊（已退役）---------- */
export const heritage = [
	{ id: 'cv440', years: '1960–1968', name: { zh: '康維爾 CV-440', en: 'Convair CV-440' } },
	{ id: 'b707', years: '1968–1984', name: { zh: '波音 707-320B', en: 'Boeing 707-320B' } },
	{ id: 'tu154m', years: '1978–1996', name: { zh: '圖波列夫 Tu-154M', en: 'Tupolev Tu-154M' } },
	{ id: 'b747sp', years: '1980–1994', name: { zh: '波音 747SP', en: 'Boeing 747SP' } },
	{ id: 'concorde', years: '1997–2003', name: { zh: '協和式 Concorde', en: 'Concorde' } },
	{ id: 'b747_400', years: '1996–2011', name: { zh: '波音 747-400', en: 'Boeing 747-400' } }
];

export const mainlineFleet = fleet.filter((t) => t.group === 'mainline');
export const classicFleet = fleet.filter((t) => t.group === 'classic');
export const regionalFleet = fleet.filter((t) => t.group === 'regional');
export const passengerFleet = fleet.filter((t) => t.group === 'mainline' || t.group === 'classic' || t.group === 'regional');
export const freighterFleet = fleet.filter((t) => t.group === 'freight');

const NOW_YEAR = 2026;
const _unitsTotal = fleet.reduce((s, t) => s + t.units, 0);
const _ageWeighted = fleet.reduce((s, t) => s + t.units * (NOW_YEAR - t.firstDelivery + 0.5), 0);

export const fleetStats = {
	inService: _unitsTotal,
	onOrder: fleet.reduce((s, t) => s + t.orders, 0),
	freightersInService: freighterFleet.reduce((s, t) => s + t.units, 0),
	payloadTOnOrder: freighterFleet.reduce((s, t) => s + t.payloadT * t.orders, 0),
	avgAge: Math.round((_ageWeighted / _unitsTotal) * 10) / 10
};

/* 航線主用機型：按航距分帶 */
export function typeForDistance(km) {
	if (km >= 14500) return 'a350ulr';
	if (km >= 8600) return 'a350';
	if (km >= 6800) return 'a330neo';
	if (km >= 5600) return 'a330';
	if (km >= 3900) return 'a321xlr';
	return 'a321neo';
}

/* 同一航線不同班次的機型混派：經典/新代/區域按重疊帶交替 */
export function typeMixForFlight(km, dest, roll) {
	const forced = dest && dest.aircraft;
	if (forced) return forced;
	if (km >= 14500) return 'a350ulr';
	if (km >= 11200) {
		if (km <= 13000 && roll < 0.22) return 'a330neo';
		if (roll < 0.4) return 'a340';
		return 'a350';
	}
	if (km >= 8600) {
		if (roll < 0.3) return 'a330neo';
		if (roll < 0.46) return 'a340';
		return 'a350';
	}
	if (km >= 6800) {
		if (roll < 0.34) return 'a330';
		if (roll < 0.62) return 'a330neo';
		if (roll < 0.8) return 'a340';
		return 'b767';
	}
	if (km >= 5600) {
		if (roll < 0.26) return 'a321xlr';
		if (roll < 0.5) return 'a330neo';
		if (roll < 0.72) return 'b767';
		return 'a300';
	}
	if (km >= 4300) {
		if (roll < 0.42) return 'a321xlr';
		if (roll < 0.66) return 'a321neo';
		if (roll < 0.88) return 'b757';
		return 'c919';
	}
	if (km >= 3000) {
		if (roll < 0.4) return 'a321neo';
		if (roll < 0.7) return 'c919';
		if (roll < 0.9) return 'b757';
		return 'a321xlr';
	}
	if (km >= 2100) {
		if (roll < 0.42) return 'c919';
		if (roll < 0.78) return 'a321neo';
		return 'e190e2';
	}
	if (km >= 1300) {
		if (roll < 0.36) return 'c909';
		if (roll < 0.56) return 'c919';
		if (roll < 0.84) return 'e190e2';
		return 'erj145';
	}
	if (km >= 800) {
		if (roll < 0.35) return 'e190e2';
		if (roll < 0.7) return 'c909';
		if (roll < 0.88) return 'erj145';
		return 'atr72';
	}
	if (roll < 0.45) return 'atr42';
	if (roll < 0.85) return 'atr72';
	return 'c909';
}

export function findType(id) {
	return fleet.find((t) => t.id === id);
}
