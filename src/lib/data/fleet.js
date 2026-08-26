/* 機隊數據 — 多代共存的全型號機隊：
   幹線寬體（A350/A330 兩代）· 幹線單通道（A321/C919/E190-E2）· 支線與渦槳（C909/ATR/BAe146/ERJ145）·
   貨機（A330F/A350F/B757F/B767F/An-124/An-225）· 歷史機隊（CV-440 至協和式） */
export const fleet = [
	/* ---------- 幹線客機 ---------- */
	{
		id: 'a350',
		group: 'mainline',
		name: { zh: '空中客車 A350-1000', en: 'Airbus A350-1000' },
		units: 6, orders: 4, firstDelivery: 2020,
		seats: { j: 44, w: 32, y: 248 },
		rangeKm: 16100, lengthM: 73.78, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2', en: 'Rolls-Royce Trent XWB-97 ×2' },
		regExample: 'BU-BNA2', viewer: 'a350'
	},
	{
		id: 'a350ulr',
		group: 'mainline',
		name: { zh: '空中客車 A350-1000ULR', en: 'Airbus A350-1000ULR' },
		units: 4, orders: 0, firstDelivery: 2024,
		seats: { j: 44, w: 40, y: 152 },
		rangeKm: 18300, lengthM: 73.78, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2（增強型）', en: 'Rolls-Royce Trent XWB-97 ×2 (enhanced)' },
		regExample: 'BU-BNA21', viewer: 'a350',
		note: { zh: '加大載油量與 MTOW 的超遠程構型，專司悉尼／墨爾本直飛', en: 'Higher-MTOW ultra-long-range variant dedicated to the Australia nonstops' }
	},
	{
		id: 'a330neo',
		group: 'mainline',
		name: { zh: '空中客車 A330-900neo', en: 'Airbus A330-900neo' },
		units: 8, orders: 2, firstDelivery: 2022,
		seats: { j: 28, w: 32, y: 232 },
		rangeKm: 13300, lengthM: 63.66, spanM: 64.0, speedKmh: 913,
		engines: { zh: '勞斯萊斯 Trent 7000 ×2', en: 'Rolls-Royce Trent 7000 ×2' },
		regExample: 'BU-BNA5', viewer: 'a330'
	},
	{
		id: 'a330',
		group: 'mainline',
		name: { zh: '空中客車 A330-300', en: 'Airbus A330-300' },
		units: 6, orders: 0, firstDelivery: 2013,
		seats: { j: 32, w: 24, y: 224 },
		rangeKm: 11750, lengthM: 63.66, spanM: 60.3, speedKmh: 871,
		engines: { zh: '勞斯萊斯 Trent 700 ×2', en: 'Rolls-Royce Trent 700 ×2' },
		regExample: 'BU-BNA1', viewer: 'a330',
		note: { zh: '2013–2016 年交付的首批；正隨 A330-900neo 交付逐步轉飛中短程航線', en: 'The 2013–2016 first batch, progressively migrating to medium-haul as A330neos arrive' }
	},
	{
		id: 'a321xlr',
		group: 'mainline',
		name: { zh: '空中客車 A321XLR', en: 'Airbus A321XLR' },
		units: 8, orders: 6, firstDelivery: 2024,
		seats: { j: 16, w: 0, y: 162 },
		rangeKm: 8700, lengthM: 44.51, spanM: 35.8, speedKmh: 876,
		engines: { zh: '普惠 PW1133G-JM ×2', en: 'Pratt & Whitney PW1133G-JM ×2' },
		regExample: 'BU-BNA8'
	},
	{
		id: 'a321neo',
		group: 'mainline',
		name: { zh: '空中客車 A321neo', en: 'Airbus A321neo' },
		units: 5, orders: 0, firstDelivery: 2019,
		seats: { j: 12, w: 0, y: 174 },
		rangeKm: 6900, lengthM: 44.51, spanM: 35.8, speedKmh: 870,
		engines: { zh: '普惠 PW1127G-JM ×2', en: 'Pratt & Whitney PW1127G-JM ×2' },
		regExample: 'BU-BNA7',
		note: { zh: '龍城快線與區域航線主力', en: 'Workhorse of the Lung Shing shuttle and regional sectors' }
	},
	{
		id: 'c919',
		group: 'mainline',
		name: { zh: '中國商飛 C919', en: 'COMAC C919' },
		units: 12, orders: 8, firstDelivery: 2024,
		seats: { j: 8, w: 0, y: 156 },
		rangeKm: 5500, lengthM: 38.9, spanM: 35.8, speedKmh: 834,
		engines: { zh: 'CFM LEAP-1C ×2', en: 'CFM LEAP-1C ×2' },
		regExample: 'BU-BNC9',
		note: { zh: '現役幹線單通道成員：國內快線成體系運營，並评估大中華區延伸', en: 'In-service single-aisle member: flying the domestic network at scale, with Greater China sectors under evaluation' }
	},
	{
		id: 'e190e2',
		group: 'mainline',
		name: { zh: '巴航工業 E190-E2', en: 'Embraer E190-E2' },
		units: 4, orders: 0, firstDelivery: 2023,
		seats: { j: 8, w: 0, y: 92 },
		rangeKm: 5300, lengthM: 36.24, spanM: 35.12, speedKmh: 829,
		engines: { zh: '普惠 PW1900G ×2', en: 'Pratt & Whitney PW1900G ×2' },
		regExample: 'BU-E291',
		note: { zh: '填補幹線單通道以下的容量空檔', en: 'Bridges the capacity gap below the mainline single-aisle fleet' }
	},

	/* ---------- 區域與支線 ---------- */
	{
		id: 'c909',
		group: 'regional',
		name: { zh: '中國商飛 C909', en: 'COMAC C909' },
		units: 10, orders: 0, firstDelivery: 2022,
		seats: { j: 8, w: 0, y: 82 },
		rangeKm: 3700, lengthM: 33.46, spanM: 27.28, speedKmh: 815,
		engines: { zh: 'GE CF34-10A ×2', en: 'GE CF34-10A ×2' },
		regExample: 'BU-CR91',
		note: { zh: '支線網絡主力：國內次級城市與大中華短程航線', en: 'Backbone of the regional network: secondary cities and short Greater China sectors' }
	},
	{
		id: 'atr72',
		group: 'regional',
		name: { zh: 'ATR 72-600', en: 'ATR 72-600' },
		units: 6, orders: 0, firstDelivery: 2019,
		seats: { j: 0, w: 0, y: 70 },
		rangeKm: 1500, lengthM: 27.17, spanM: 27.05, speedKmh: 510,
		engines: { zh: '普惠 PW127M 渦槳 ×2', en: '2 × Pratt & Whitney PW127M turboprop' },
		regExample: 'BU-TK72',
		note: { zh: '渦槳經濟性：離島與沿岸航段的最低成本答案', en: 'Turboprop economics: the lowest-cost answer for island and coastal sectors' }
	},
	{
		id: 'atr42',
		group: 'regional',
		name: { zh: 'ATR 42-600', en: 'ATR 42-600' },
		units: 4, orders: 0, firstDelivery: 2016,
		seats: { j: 0, w: 0, y: 48 },
		rangeKm: 1310, lengthM: 25.06, spanM: 24.57, speedKmh: 540,
		engines: { zh: '普惠 PW127E 渦槳 ×2', en: '2 × Pratt & Whitney PW127E turboprop' },
		regExample: 'BU-TK42',
		note: { zh: '低密度支線與包機任務', en: 'Thin regional routes and charter missions' }
	},
	{
		id: 'bae146',
		group: 'regional',
		name: { zh: '英國宇航 BAe 146-200QT', en: 'BAe 146-200QT' },
		units: 3, orders: 0, firstDelivery: 1988,
		seats: { j: 8, w: 0, y: 86 },
		rangeKm: 2280, lengthM: 28.6, spanM: 26.34, speedKmh: 747,
		engines: { zh: 'Honeywell ALF 502R-5 ×4', en: '4 × Honeywell ALF 502R-5' },
		regExample: 'BU-QT07',
		note: { zh: '四發「Whisperjet」：短跑道與噪音敏感機場的入場券，自歐洲二級市場收編', en: 'Four-engined “Whisperjet”: short-runway and noise-sensitive access, acquired second-hand from the European market' }
	},
	{
		id: 'erj145',
		group: 'regional',
		name: { zh: '巴航工業 ERJ-145', en: 'Embraer ERJ-145' },
		units: 2, orders: 0, firstDelivery: 1999,
		seats: { j: 0, w: 0, y: 50 },
		rangeKm: 2870, lengthM: 29.87, spanM: 20.04, speedKmh: 722,
		engines: { zh: '勞斯萊斯 AE 3007A ×2', en: 'Rolls-Royce AE 3007A ×2' },
		regExample: 'BU-ER11',
		note: { zh: '2000 年代訂購的一代，如今服役至 C909 全面接替為止', en: 'Ordered new in the 2000s; flies on until the C909 fully takes over' }
	},

	/* ---------- 貨機 ---------- */
	{
		id: 'a332f',
		group: 'freight',
		name: { zh: '空中客車 A330-200F（貨機）', en: 'Airbus A330-200F Freighter' },
		units: 2, orders: 0, firstDelivery: 2016, payloadT: 61,
		rangeKm: 7400, lengthM: 58.82, spanM: 60.3, speedKmh: 871,
		engines: { zh: '勞斯萊斯 Trent 772B ×2', en: 'Rolls-Royce Trent 772B ×2' },
		regExample: 'BU-CAF1',
		note: { zh: '執行原海—香港、原海—法蘭克福夜間貨運航班', en: 'Operates the Yuen Hoi–Hong Kong and Yuen Hoi–Frankfurt night freighters' }
	},
	{
		id: 'b757f',
		group: 'freight',
		name: { zh: '波音 757-200PCF（貨機）', en: 'Boeing 757-200PCF Freighter' },
		units: 3, orders: 0, firstDelivery: 1998, payloadT: 34,
		rangeKm: 5830, lengthM: 47.32, spanM: 38.05, speedKmh: 850,
		engines: { zh: '普惠 PW2040 ×2', en: 'Pratt & Whitney PW2040 ×2' },
		regExample: 'BU-PZF4',
		note: { zh: '歐洲夜間快遞網絡的老兵：窄體機身裝下整夜的時效件', en: 'Veteran of the European night-express network: next-day loads in a narrowbody fuselage' }
	},
	{
		id: 'b767f',
		group: 'freight',
		name: { zh: '波音 767-300F（貨機）', en: 'Boeing 767-300F Freighter' },
		units: 4, orders: 0, firstDelivery: 2009, payloadT: 53,
		rangeKm: 6000, lengthM: 54.94, spanM: 47.57, speedKmh: 851,
		engines: { zh: 'GE CF6-80C2 ×2', en: 'GE CF6-80C2 ×2' },
		regExample: 'BU-PZM2',
		note: { zh: '中東與中亞夜間航線的中堅，與 A330-200F 混編', en: 'Core of the Middle East and Central Asia night lines, mixed-crewed with the A330-200F' }
	},
	{
		id: 'an124',
		group: 'freight',
		name: { zh: '安托諾夫 An-124-100（重型運輸機）', en: 'Antonov An-124-100 Heavy Lifter' },
		units: 1, orders: 0, firstDelivery: 1986, payloadT: 120,
		rangeKm: 4500, lengthM: 69.1, spanM: 73.3, speedKmh: 800,
		engines: { zh: 'Lotarev D-18T ×4', en: '4 × Lotarev D-18T' },
		regExample: 'BU-AN22',
		note: { zh: '特種項目貨運：機械、能源部件與人道救援，需要時全球調機', en: 'Project cargo: machinery, energy components and humanitarian lifts, deployed worldwide on demand' }
	},
	{
		id: 'an225',
		group: 'freight',
		name: { zh: '安托諾夫 An-225「米莉亞二號」（重型運輸機）', en: 'Antonov An-225 “Mriya II” Heavy Lifter' },
		units: 1, orders: 0, firstDelivery: 2025, payloadT: 250,
		rangeKm: 4000, lengthM: 84.0, spanM: 88.4, speedKmh: 850,
		engines: { zh: 'Lotarev D-18T ×6', en: '6 × Lotarev D-18T' },
		regExample: 'BU-MRI02',
		note: { zh: '由哈托梅爾二號機身重建完成、以 An-124 半價噸公里的報價對外開放的超大貨運獨苗；BN Cargo 與安托諾夫聯合執管', en: 'Rebuilt from the second Hostomel airframe, offered out as the world’s sole super-heavy lifter; jointly operated by BN Cargo and Antonov' }
	},
	{
		id: 'a350f',
		group: 'freight',
		name: { zh: '空中客車 A350F（貨機）', en: 'Airbus A350F Freighter' },
		units: 0, orders: 4, firstDelivery: 2027, payloadT: 109,
		rangeKm: 8700, lengthM: 70.8, spanM: 64.75, speedKmh: 903,
		engines: { zh: '勞斯萊斯 Trent XWB-97 ×2', en: 'Rolls-Royce Trent XWB-97 ×2' },
		regExample: 'BU-CAF3',
		note: { zh: '2027 年起接管跨洲遠程貨運，讓老一代貨機退守區域夜航', en: 'Takes over intercontinental freight from 2027, releasing the older freighters to the regional night network' }
	}
];

/* ---------- 歷史機隊（已退役）---------- */
export const heritage = [
	{ id: 'cv440', years: '1960–1968', name: { zh: '康維爾 CV-440', en: 'Convair CV-440' } },
	{ id: 'b707', years: '1968–1984', name: { zh: '波音 707-320B', en: 'Boeing 707-320B' } },
	{ id: 'tu154m', years: '1978–1996', name: { zh: '圖波列夫 Tu-154M', en: 'Tupolev Tu-154M' } },
	{ id: 'b747sp', years: '1980–1994', name: { zh: '波音 747SP', en: 'Boeing 747SP' } },
	{ id: 'concorde', years: '1997–2003', name: { zh: '協和式 Concorde', en: 'Concorde' } },
	{ id: 'b747_400', years: '1996–2011', name: { zh: '波音 747-400', en: 'Boeing 747-400' } },
	{ id: 'a340_300', years: '2001–2015', name: { zh: '空中客車 A340-300', en: 'Airbus A340-300' } }
];

export const mainlineFleet = fleet.filter((t) => t.group === 'mainline');
export const regionalFleet = fleet.filter((t) => t.group === 'regional');
export const passengerFleet = fleet.filter((t) => t.group === 'mainline' || t.group === 'regional');
export const freighterFleet = fleet.filter((t) => t.group === 'freight');

/* 平均機齡：按首交付年估算（對二手引入機型即其制造年齡），精確到 0.1 年 */
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

/* 同一航線不同班次的機型混派規則：
   幹線帶內新老交替（A330 兩代 / A321 兩代），中短程帶讓 C919、E190-E2、C909 成體系上位，
   短程與離島交給渦槳與四發 Whisperjet —— 同一條航線不同班次可由不同機型執飛 */
export function typeMixForFlight(km, dest, roll) {
	const forced = dest && dest.aircraft;
	if (forced) return forced;
	if (km >= 14500) return 'a350ulr';
	if (km >= 10200) {
		if (km <= 13000 && roll < 0.3) return 'a330neo';
		return 'a350';
	}
	if (km >= 8600) {
		if (roll < 0.42) return 'a330neo';
		return 'a350';
	}
	if (km >= 6800) {
		if (roll < 0.35) return 'a330';
		return 'a330neo';
	}
	if (km >= 5600) {
		if (roll < 0.4) return 'a321xlr';
		return roll < 0.75 ? 'a330neo' : 'a330';
	}
	if (km >= 4200) {
		if (roll < 0.68) return 'a321xlr';
		return 'a321neo';
	}
	if (km >= 3000) {
		if (roll < 0.5) return 'a321neo';
		if (roll < 0.85) return 'c919';
		return 'a321xlr';
	}
	if (km >= 2100) {
		if (roll < 0.45) return 'c919';
		if (roll < 0.8) return 'a321neo';
		return 'e190e2';
	}
	if (km >= 1300) {
		if (roll < 0.38) return 'c909';
		if (roll < 0.58) return 'c919';
		if (roll < 0.86) return 'e190e2';
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
