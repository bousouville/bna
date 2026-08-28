<script>
	/** 订座页 — 班期检索 → 票价 → 座位 → 确认 */
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { t, locale, fmtDate, fmtWeekday } from '$lib/stores/locale.js';
	import { destinations, HUB, findDest } from '$data/destinations.js';
	import { searchFlights, fareQuote, buildSeatMap, makeRef, formatDur } from '$data/booking.js';
	import PageHero from '$lib/components/PageHero.svelte';

	/* ---------- 查询状态（来自 URL 或表单） ---------- */
	let from = $state(HUB.iata);
	let to = $state('HKG');
	let depart = $state('');
	let ret = $state('');
	let adults = $state(1);
	let cabinClass = $state('economy');

	let step = $state('search'); // search | results | seats | confirm | done
	const stepIdx = $derived({ search: 0, results: 1, seats: 2, confirm: 3, done: 4 }[step] ?? 1);
	const stepsArr = $derived([
		{ idx: 0, n: '1', label: isEn ? 'Search' : '搜尋' },
		{ idx: 1, n: '2', label: isEn ? 'Flights' : '班期' },
		{ idx: 2, n: '3', label: isEn ? 'Seats' : '選座' },
		{ idx: 3, n: '4', label: isEn ? 'Confirm' : '確認' },
		{ idx: 4, n: '5', label: isEn ? 'Done' : '完成' }
	]);
	let result = $state(null);
	let fareSel = $state(null);
	let seatSel = $state(null);
	let seatMap = $state(null);
	let paxName = $state('');
	let email = $state('');
	let phone = $state('');
	let payMethod = $state('card');
	let bookingRef = $state('');
	let error = $state('');

	const isEn = $derived($locale === 'en');

	/* 从 URL 读取查询参数（客户端） */
	$effect(() => {
		const url = page.url;
		const q = url.searchParams;
		const qFrom = q.get('from');
		const qTo = q.get('to');
		if (qFrom || qTo) {
			if (qFrom) from = qFrom;
			if (qTo) to = qTo;
			const dest = findDest(qTo || 'HKG');
			if (dest) to = dest.iata;
			const qDepart = q.get('depart');
			if (qDepart) depart = qDepart;
			const qRet = q.get('return');
			if (qRet) ret = qRet;
			const qAdults = parseInt(q.get('adults') || '1', 10);
			if (qAdults > 0) adults = qAdults;
			if (q.get('cabin')) cabinClass = q.get('cabin');
			if (qFrom || qTo) doSearch();
		}
	});

	const cityOptions = $derived(destinations.map((d) => ({ value: d.iata, label: `${isEn ? d.city.en : d.city.zh} (${d.iata})` })));
	const fromOptions = $derived([
		{ value: HUB.iata, label: `${isEn ? HUB.city.en : HUB.city.zh} (${HUB.iata})` },
		...cityOptions
	]);

	function todayISO() {
		return new Date().toISOString().slice(0, 10);
	}

	function doSearch() {
		error = '';
		if (from === to) {
			error = $t.booking.sameCity;
			return;
		}
		if (!depart) {
			error = $t.booking.noDate;
			return;
		}
		if (depart < todayISO()) {
			error = $t.booking.datePast;
			return;
		}
		result = searchFlights({ from, to, date: depart });
		if (!result || result.flights.length === 0) {
			result = result || { flights: [] };
		}
		fareSel = null;
		seatSel = null;
		step = 'results';
	}

	function chooseFare(flight, fare) {
		fareSel = { flight, fare };
		seatMap = buildSeatMap(flight.type, flight.no, depart);
		seatSel = null;
		step = 'seats';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function toConfirm() {
		step = 'confirm';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function confirmBooking(e) {
		e.preventDefault();
		if (!paxName.trim()) return;
		bookingRef = makeRef(fareSel.flight.no, depart);
		step = 'done';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function restart() {
		step = 'search';
		result = null;
		fareSel = null;
	}

	function swap() {
		[from, to] = [to, from];
	}

	function dateOffset(days) {
		const d = new Date(depart + 'T00:00:00Z');
		d.setUTCDate(d.getUTCDate() + days);
		return d.toISOString().slice(0, 10);
	}

	function shiftDate(days) {
		const d = new Date(depart + 'T00:00:00Z');
		d.setUTCDate(d.getUTCDate() + days);
		depart = d.toISOString().slice(0, 10);
		doSearch();
	}

	function fareName(f) {
		if (f === 'w') return $t.experience.cabinTabs.premium;
		if (f === 'j') return $t.booking.fares.business.name;
		return $t.booking.fares[f]?.name || f;
	}

	function fareTerms(f) {
		if (f === 'w') return $t.booking.fares.classic.change;
		return $t.booking.fares[f]?.change || '';
	}

	function fmtMoney(n) {
		return 'BOU ' + new Intl.NumberFormat(isEn ? 'en-GB' : 'zh-Hant').format(n);
	}

	function seatTypeClass(s) {
		return s.occupied ? 'occ' : s.paid ? 'paid' : s.exit ? 'exit' : 'free';
	}
</script>

<PageHero title={$t.booking.title} sub={$t.booking.intro} />

<section class="section">
	<div class="container-narrow booking-col">
		{#if step !== 'search'}		<div class="steps" aria-label="Step">
			{#each stepsArr as st (st.idx)}
				{@const cur = stepIdx === st.idx}
				<span class="step" class:cur class:done={stepIdx > st.idx}><i>{st.n}</i>{st.label}</span>
			{/each}
		</div>
		{/if}
		{#if step === 'search'}
			<!-- 检索表单 -->
			<form class="card search-form" onsubmit={(e) => { e.preventDefault(); doSearch(); }}>
				<div class="grid">
					<label class="field">
						<span>{$t.common.from}</span>
						<select bind:value={from}>
							{#each fromOptions as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
						</select>
					</label>
					<button type="button" class="swap-btn" onclick={swap} aria-label={$t.common.swap}>⇄</button>
					<label class="field">
						<span>{$t.common.to}</span>
						<select bind:value={to}>
							{#each cityOptions as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
						</select>
					</label>
					<label class="field">
						<span>{$t.common.departDate}</span>
						<input type="date" bind:value={depart} min={todayISO()} required />
					</label>
					<label class="field">
						<span>{$t.common.returnDate}</span>
						<input type="date" bind:value={ret} min={depart} />
					</label>
					<label class="field">
						<span>{$t.common.passengers}</span>
						<select bind:value={adults}>
							{#each [1, 2, 3, 4, 5, 6] as n (n)}<option value={n}>{n} × {$t.common.adult}</option>{/each}
						</select>
					</label>
				</div>
				{#if error}<p class="error" role="alert">{error}</p>{/if}
				<button class="btn btn--primary" type="submit">{$t.common.searchFlights}</button>
			</form>
		{:else if step === 'results'}
			<!-- 班期结果 -->
			{#if result && result.flights.length}
				<p class="crumb-line">
					{isEn ? result.route.origin.city.en : result.route.origin.city.zh} → {isEn ? result.route.dest.city.en : result.route.dest.city.zh}
					· {fmtDate(depart, $locale)} ({fmtWeekday(depart, $locale)})
					· {result.flights.length} {$t.common.classes}
					<button class="linklike" onclick={restart}>{$t.booking.changeSearch}</button>
				</p>
				{#each result.flights as flight (flight.no)}
					{@const fares = fareQuote(flight.km)}
					<article class="card flight">
						<div class="flight-head">
							<div class="seg">
								<span class="time">{flight.depLocal}</span>
								<span class="port">{isEn ? flight.from.iata : `${isEn ? flight.from.city.en : flight.from.city.zh}`}</span>
							</div>
							<div class="mid">
								<span class="dur">{formatDur(flight.block)}</span>
								<span class="line" aria-hidden="true"></span>
								<span class="direct">{$t.common.direct}</span>
							</div>
							<div class="seg">
								<span class="time">{flight.arrLocal}{#if flight.arrDay > flight.depDay}<small class="nx">+{flight.arrDay - flight.depDay}</small>{/if}</span>
								<span class="port">{isEn ? flight.to.city.en : flight.to.city.zh}</span>
							</div>
							<div class="meta">
								<span class="no">{flight.no}</span>
								<span class="type">{isEn ? flight.typeName.en : flight.typeName.zh}</span>
							</div>
						</div>
						<div class="fares">
							<button class="fare" onclick={() => chooseFare(flight, 'light')}>
								<span class="fare-name">{$t.booking.fares.light.name}</span>
								<span class="fare-bag">{$t.booking.fares.light.bag}</span>
								<strong>{fmtMoney(fares.light)}</strong>
							</button>
							<button class="fare" onclick={() => chooseFare(flight, 'classic')}>
								<span class="fare-name">{$t.booking.fares.classic.name}</span>
								<span class="fare-bag">{$t.booking.fares.classic.bag}</span>
								<strong>{fmtMoney(fares.classic)}</strong>
							</button>
							<button class="fare" onclick={() => chooseFare(flight, 'flex')}>
								<span class="fare-name">{$t.booking.fares.flex.name}</span>
								<span class="fare-bag">{$t.booking.fares.flex.bag}</span>
								<strong>{fmtMoney(fares.flex)}</strong>
							</button>
							{#if flight.seats.w > 0}
								<button class="fare" onclick={() => chooseFare(flight, 'w')}>
									<span class="fare-name">{$t.experience.cabinTabs.premium}</span>
									<span class="fare-bag">{$t.booking.fares.classic.bag}</span>
									<strong>{fmtMoney(fares.w)}</strong>
								</button>
							{/if}
							<button class="fare biz" onclick={() => chooseFare(flight, 'j')}>
								<span class="fare-name">{$t.booking.fares.business.name}</span>
								<span class="fare-bag">{$t.booking.fares.business.bag}</span>
								<strong>{fmtMoney(fares.j)}</strong>
							</button>
						</div>
					</article>
				{/each}
			{:else}
				<div class="empty">
					<p>{result ? $t.booking.noFlights : $t.common.loading}</p>
					{#if result}
						<div class="adj">
							<button class="chip" onclick={() => shiftDate(1)}>{fmtDate(dateOffset(1), $locale)}</button>
							<button class="chip" onclick={() => shiftDate(2)}>{fmtDate(dateOffset(2), $locale)}</button>
							<button class="chip" onclick={() => shiftDate(-1)}>{fmtDate(dateOffset(-1), $locale)}</button>
						</div>
					{/if}
					<button class="linklike" onclick={restart}>{$t.booking.changeSearch}</button>
				</div>
			{/if}
		{:else if step === 'seats' && fareSel}
			<!-- 选座 -->
			<div class="card seat-card">
				<h2>{$t.booking.seatTitle}</h2>
				<p class="crumb-line">
					{fareSel.flight.no} · {isEn ? fareSel.flight.to.city.en : fareSel.flight.to.city.zh} · {fareName(fareSel.fare)}
				</p>
				<div class="seat-legend">
					<span><i class="sw free"></i>{$t.booking.seatFree}</span>
					<span><i class="sw paid"></i>{$t.booking.seatCharged}</span>
					<span><i class="sw exit"></i>{$t.booking.seatExit}</span>
					<span><i class="sw occ"></i>{$t.booking.seatOccupied}</span>
				</div>
				<div class="seatmap-scroll">
					<div class="fuselage">
						{#each ['j', 'w', 'y'] as cab}
							{#if seatMap[cab]}
								<h4>{cab === 'j' ? $t.booking.fares.business.name : cab === 'w' ? $t.experience.cabinTabs.premium : $t.experience.cabinTabs.economy}</h4>
								{#each seatMap[cab] as row (row.no)}
									<div class="srow">
										<span class="rno">{row.no}</span>
										{#each row.seats as s (s.id)}
											<button
												class="seat {seatTypeClass(s)}"
												class:selected={seatSel?.id === s.id}
												disabled={s.occupied}
												onclick={() => (seatSel = seatSel?.id === s.id ? null : s)}
												aria-label="{s.id} {s.occupied ? $t.booking.seatOccupied : s.paid ? $t.booking.seatCharged : $t.booking.seatFree}"
											>
												{s.id}
											</button>
										{/each}
									</div>
								{/each}
							{/if}
						{/each}
					</div>
				</div>
				<div class="seat-actions">
					<p>
						{#if seatSel}
							{$t.booking.selectedSeat}: <strong>{seatSel.id}</strong>
						{:else}
							{$t.booking.noSeat}
						{/if}
					</p>
					<button class="btn btn--primary" onclick={toConfirm}>{$t.common.next}</button>
				</div>
			</div>
		{:else if step === 'confirm' && fareSel}
			<!-- 确认 -->
			<div class="confirm-grid">
				<div class="card confirm-itin">
					<h2>{$t.booking.doneItinerary}</h2>
					<table class="spec-table">
						<tbody>
							<tr><th>{$t.common.flightNo}</th><td>{fareSel.flight.no}</td></tr>
							<tr>
								<th>{$t.booking.title}</th>
								<td>
									{isEn ? fareSel.flight.from.city.en : fareSel.flight.from.city.zh} ({fareSel.flight.from.iata}) → {isEn ? fareSel.flight.to.city.en : fareSel.flight.to.city.zh} ({fareSel.flight.to.iata})
								</td>
							</tr>
							<tr><th>{$t.common.departDate}</th><td>{fmtDate(depart, $locale)} · {fareSel.flight.depLocal} – {fareSel.flight.arrLocal}</td></tr>
							<tr><th>{$t.common.aircraft}</th><td>{isEn ? fareSel.flight.typeName.en : fareSel.flight.typeName.zh}</td></tr>
							<tr><th>{$t.common.passengers}</th><td>{adults} × {$t.common.adult}</td></tr>
							<tr><th>{$t.booking.terms}</th><td>{fareTerms(fareSel.fare)}</td></tr>
							{#if seatSel}<tr><th>{$t.booking.selectedSeat}</th><td>{seatSel.id}</td></tr>{/if}
						</tbody>
					</table>
				</div>
				<form class="card confirm-form" onsubmit={confirmBooking}>
					<h2>{$t.booking.confirmTitle}</h2>
					<label class="field"><span>{$t.booking.passengerName}</span>
						<input bind:value={paxName} placeholder={$t.booking.passengerNamePh} required minlength="2" />
					</label>
					<label class="field"><span>{$t.booking.contactEmail}</span>
						<input type="email" bind:value={email} required placeholder="name@example.com" />
					</label>
					<label class="field"><span>{$t.booking.contactPhone}</span>
						<input type="tel" bind:value={phone} placeholder="+86 …" />
					</label>
					<fieldset class="pay">
						<legend>{$t.booking.paymentTitle}</legend>
						{#each [['card', $t.booking.payCard], ['clean', $t.booking.payClean], ['miles', $t.booking.payMiles]] as [v, label] (v)}
							<label class="pay-opt">
								<input type="radio" bind:group={payMethod} value={v} />
								<span>{label}</span>
							</label>
						{/each}
					</fieldset>
					<p class="total">
						{$t.common.total}
						<strong>
							{fmtMoney((fareQuote(fareSel.flight.km)[fareSel.fare] ?? 0) * adults + (seatSel ? 60 * adults : 0))}
						</strong>
					</p>
					<button class="btn btn--gold btn-block" type="submit">{$t.common.confirm}</button>
				</form>
			</div>
		{:else if step === 'done' && fareSel}
			<!-- 完成 -->
			<div class="card done">
				<div class="ok-badge" aria-hidden="true">
					<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</div>
				<h2>{$t.booking.doneTitle}</h2>
				<p class="ref">{$t.booking.doneRef}: <strong>{bookingRef}</strong></p>
				<p>{$t.booking.doneBody}</p>
				<table class="spec-table">
					<tbody>
						<tr><th>{$t.common.flightNo}</th><td>{fareSel.flight.no}</td></tr>
						<tr><th>{$t.booking.passengerName}</th><td>{paxName}</td></tr>
						<tr><th>{$t.common.departDate}</th><td>{fmtDate(depart, $locale)} · {fareSel.flight.depLocal}</td></tr>
					</tbody>
				</table>
				<div class="done-actions">
					<a class="btn btn--primary" href={`${base}${isEn ? '/en' : '/'}`}>{$t.common.backHome}</a>
					<button class="btn btn--ghost-dark" onclick={restart}>{$t.common.book}</button>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.search-form {
		max-width: 920px;
		margin: 0 auto;
		padding: 1.6rem 1.7rem;
		display: grid;
		gap: 1.1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr 1fr 1fr 1fr;
		gap: 0.7rem;
		align-items: end;
	}

	.swap-btn {
		border: 1.5px solid var(--line);
		background: #fff;
		border-radius: var(--radius-sm);
		height: 42px;
		width: 40px;
		cursor: pointer;
		color: var(--navy-700);
	}

	.error {
		color: var(--warn);
		margin: 0;
	}

	.crumb-line {
		color: var(--text-soft);
		font-size: 0.92rem;
		margin-bottom: 1.2rem;
	}

	.linklike {
		background: none;
		border: 0;
		color: var(--navy-600);
		font-weight: 650;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
		margin-left: 0.7em;
		padding: 0;
	}

	.flight {
		padding: 1.3rem 1.5rem;
		margin-bottom: 1.1rem;
	}

	.steps {
		display: flex;
		align-items: flex-start;
		gap: 0.2rem;
		margin-bottom: 1.8rem;
		flex-wrap: wrap;
	}
	.step {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-500);
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		opacity: 0.6;
	}
	.step i {
		width: 20px;
		height: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.68rem;
		font-style: normal;
		background: var(--paper-cool);
		color: var(--ink-500);
	}
	.step.cur {
		color: var(--navy-800);
		opacity: 1;
		background: var(--paper-cool);
	}
	.step.cur i {
		background: var(--navy-800);
		color: #fff;
	}
	.step.done {
		opacity: 1;
		color: var(--ink-700);
	}
	.step.done i {
		background: var(--gold-400);
		color: #fff;
	}
	.type {
		font-size: 0.8rem;
		color: var(--ink-700);
	}
	.nx {
		margin-left: 0.35rem;
		font-size: 0.68rem;
		color: var(--gold-600);
		font-weight: 700;
	}

	.booking-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.booking-col > :global(.card),
	.booking-col > .flight,
	.booking-col > form,
	.booking-col > .steps,
	.booking-col > .crumb-line,
	.booking-col > .empty {
		width: 100%;
		max-width: 820px;
	}
	.search-form {
		padding: 1.6rem 1.8rem !important;
	}
	.fares {
		grid-template-columns: repeat(5, 1fr);
	}
	.fares .fare {
		text-align: center;
	}

	.flight-head {
		display: grid;
		grid-template-columns: 1fr 1.4fr 1fr 1fr;
		gap: 1rem;
		align-items: center;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid var(--paper-cool);
	}

	.seg {
		display: grid;
	}

	.seg .time {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--navy-900);
	}

	.seg .port {
		color: var(--text-soft);
		font-size: 0.88rem;
	}

	.mid {
		display: grid;
		justify-items: center;
		gap: 0.15rem;
	}

	.mid .dur {
		font-size: 0.8rem;
		color: var(--text-soft);
	}

	.mid .line {
		width: 100%;
		max-width: 180px;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--gold-500), transparent);
		position: relative;
	}

	.mid .direct {
		font-size: 0.74rem;
		font-weight: 650;
		color: var(--ok);
	}

	.meta {
		display: grid;
		justify-items: end;
		font-size: 0.84rem;
		color: var(--text-soft);
	}

	.meta .no {
		font-weight: 750;
		color: var(--navy-800);
		letter-spacing: 0.04em;
	}

	.fares {
		display: grid;
		grid-template-columns: repeat(4, 1fr) 1.2fr;
		gap: 0.7rem;
		margin-top: 1.1rem;
	}

	.fare {
		border: 1.5px solid var(--line);
		background: #fff;
		border-radius: var(--radius-sm);
		padding: 0.8rem 0.9rem;
		display: grid;
		gap: 0.3rem;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.15s var(--ease), box-shadow 0.15s var(--ease), transform 0.15s var(--ease);
	}

	.fare:hover {
		border-color: var(--navy-500);
		transform: translateY(-2px);
		box-shadow: var(--shadow-1);
	}

	.fare.biz {
		background: linear-gradient(150deg, var(--navy-900), var(--navy-700));
		color: #fff;
		border-color: var(--navy-700);
	}

	.fare.biz .fare-bag {
		color: rgba(255, 255, 255, 0.75);
	}

	.fare-name {
		font-weight: 750;
		font-size: 0.9rem;
	}

	.fare-bag {
		font-size: 0.74rem;
		color: var(--text-soft);
	}

	.fare strong {
		font-size: 1.02rem;
		color: var(--navy-800);
	}

	.fare.biz strong {
		color: var(--gold-300);
	}

	.empty {
		padding: 3rem 0;
		text-align: center;
		color: var(--text-soft);
		display: grid;
		gap: 1rem;
		justify-items: center;
	}

	.adj {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.adj .chip {
		cursor: pointer;
		border: 1px solid var(--line);
		background: #fff;
	}

	/* ---------- seats ---------- */
	.seat-card {
		padding: 1.6rem 1.7rem;
	}

	.seat-card h2 {
		color: var(--navy-900);
	}

	.seat-legend {
		display: flex;
		gap: 1.4rem;
		flex-wrap: wrap;
		font-size: 0.8rem;
		color: var(--text-soft);
		margin-bottom: 1.2rem;
	}

	.seat-legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.sw {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		display: inline-block;
	}

	.sw.free { background: #dfe8f8; border: 1.5px solid var(--navy-500); }
	.sw.paid { background: #f3e9cf; border: 1.5px solid var(--gold-500); }
	.sw.exit { background: #ddf2e6; border: 1.5px solid var(--ok); }
	.sw.occ { background: #e5e8ef; border: 1.5px solid #c3c9d6; }

	.seatmap-scroll {
		overflow-x: auto;
		padding-bottom: 0.6rem;
	}

	.fuselage {
		border: 2px solid var(--line);
		border-radius: 26px;
		padding: 1.4rem 1.2rem;
		min-width: 380px;
		background: var(--bg-soft);
	}

	.fuselage h4 {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-soft);
		margin: 1rem 0 0.6rem;
	}

	.srow {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 6px;
	}

	.rno {
		width: 26px;
		font-size: 0.72rem;
		color: var(--ink-300);
		text-align: right;
		padding-right: 4px;
	}

	.seat {
		width: 40px;
		height: 32px;
		border-radius: 7px;
		border: 1.5px solid var(--navy-500);
		background: #dfe8f8;
		font-size: 0.66rem;
		font-weight: 650;
		color: var(--navy-800);
		cursor: pointer;
		transition: transform 0.12s var(--ease), box-shadow 0.12s var(--ease);
		padding: 0;
	}

	.seat:hover:not(:disabled) {
		transform: scale(1.08);
	}

	.seat.paid {
		background: #f3e9cf;
		border-color: var(--gold-500);
		color: var(--gold-600);
	}

	.seat.exit {
		background: #ddf2e6;
		border-color: var(--ok);
		color: var(--ok);
	}

	.seat.occ {
		background: #e5e8ef;
		border-color: #c3c9d6;
		color: #a6adbd;
		cursor: not-allowed;
	}

	.seat.selected {
		background: var(--navy-800);
		color: #fff;
		box-shadow: 0 0 0 3px rgba(0, 32, 91, 0.25);
	}

	.seat-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.2rem;
		gap: 1rem;
	}

	.seat-actions p {
		margin: 0;
		color: var(--text-soft);
	}

	/* ---------- confirm ---------- */
	.confirm-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 1.2rem;
		align-items: start;
	}

	.confirm-itin,
	.confirm-form {
		padding: 1.5rem 1.6rem;
	}

	.confirm-form .field {
		margin-bottom: 0.9rem;
	}

	.pay {
		border: 0;
		padding: 0;
		margin: 0.4rem 0 1rem;
	}

	.pay legend {
		font-size: 0.78rem;
		font-weight: 650;
		color: var(--text-soft);
		margin-bottom: 0.5rem;
	}

	.pay-opt {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.35rem 0;
	}

	.total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-top: 1px solid var(--line);
		padding-top: 0.9rem;
		font-size: 0.95rem;
	}

	.total strong {
		font-size: 1.35rem;
		color: var(--navy-900);
	}

	.btn-block {
		width: 100%;
	}

	/* ---------- done ---------- */
	.done {
		max-width: 640px;
		margin: 0 auto;
		padding: 2rem 2.2rem;
		text-align: center;
	}

	.ok-badge {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #ddf2e6;
		color: var(--ok);
		display: grid;
		place-items: center;
		margin: 0 auto 1rem;
	}

	.done .ref strong {
		color: var(--navy-800);
		letter-spacing: 0.12em;
	}

	.done-actions {
		display: flex;
		gap: 0.8rem;
		justify-content: center;
		margin-top: 1.4rem;
	}

	@media (max-width: 1020px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}

		.swap-btn {
			display: none;
		}

		.steps {
		display: flex;
		align-items: flex-start;
		gap: 0.2rem;
		margin-bottom: 1.8rem;
		flex-wrap: wrap;
	}
	.step {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-500);
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		opacity: 0.6;
	}
	.step i {
		width: 20px;
		height: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.68rem;
		font-style: normal;
		background: var(--paper-cool);
		color: var(--ink-500);
	}
	.step.cur {
		color: var(--navy-800);
		opacity: 1;
		background: var(--paper-cool);
	}
	.step.cur i {
		background: var(--navy-800);
		color: #fff;
	}
	.step.done {
		opacity: 1;
		color: var(--ink-700);
	}
	.step.done i {
		background: var(--gold-400);
		color: #fff;
	}
	.type {
		font-size: 0.8rem;
		color: var(--ink-700);
	}
	.nx {
		margin-left: 0.35rem;
		font-size: 0.68rem;
		color: var(--gold-600);
		font-weight: 700;
	}

	.booking-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.booking-col > :global(.card),
	.booking-col > .flight,
	.booking-col > form,
	.booking-col > .steps,
	.booking-col > .crumb-line,
	.booking-col > .empty {
		width: 100%;
		max-width: 820px;
	}
	.search-form {
		padding: 1.6rem 1.8rem !important;
	}
	.fares {
		grid-template-columns: repeat(5, 1fr);
	}
	.fares .fare {
		text-align: center;
	}

	.flight-head {
			grid-template-columns: 1fr 1fr;
		}

		.fares {
			grid-template-columns: 1fr 1fr;
		}

		.confirm-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
