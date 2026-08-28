<script>
	/** 订座挂件：出发/到达/日期/舱等 → GET 跳转到订座页（使用可复用 Field 组件 + 图标控件） */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { t, locale } from '$lib/stores/locale.js';
	import { withBase } from '$lib/paths.js';
	import { destinations, HUB } from '$data/destinations.js';
	import Field from './Field.svelte';
	let tripType = $state('return');
	let from = $state(HUB.iata);
	let to = $state('HKG');
	let depart = $state('');
	let ret = $state('');
	let cabin = $state('economy');
	let adults = $state(1);
	let error = $state('');

	const cityOptions = $derived(
		destinations.map((d) => ({
			value: d.iata,
			label: `${$locale === 'zh' ? d.city.zh : d.city.en} (${d.iata})`
		}))
	);
	const allFromOptions = $derived([
		{ value: HUB.iata, label: `${$locale === 'zh' ? HUB.city.zh : HUB.city.en} (${HUB.iata})` },
		...cityOptions
	]);

	$effect(() => {
		if (!depart) {
			const d = new Date(Date.now() + 14 * 86400000);
			depart = d.toISOString().slice(0, 10);
		}
	});
	function todayISO() {
		return new Date().toISOString().slice(0, 10);
	}
	function swap() {
		[from, to] = [to, from];
	}
	function submit(e) {
		e.preventDefault();
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
		const bookingHref = withBase($locale === 'en' ? '/en/booking' : '/booking');
		const params = new URLSearchParams({ from, to, depart, trip: tripType, cabin, adults: String(adults) });
		if (tripType === 'return' && ret) params.set('return', ret);
		goto(`${bookingHref}?${params.toString()}`);
	}

	let { compact = false } = $props();
</script>

<form class="widget" class:compact onsubmit={submit}>
	<div class="tabs" role="tablist" aria-label="{$t.common.searchFlights}">
		<button type="button" class:active={tripType === 'return'} onclick={() => (tripType = 'return')} role="tab" aria-selected={tripType === 'return'}>
			{$t.common.returnTrip}
		</button>
		<button type="button" class:active={tripType === 'oneway'} onclick={() => (tripType = 'oneway')} role="tab" aria-selected={tripType === 'oneway'}>
			{$t.common.oneWay}
		</button>
	</div>

	<div class="grid">
		<Field label={$t.common.from} id="wf-from">
			<div class="control">
				<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8.5 15 3l-3 5.3L5.5 10 2 13l.6-3.2L1 8.5Z" fill="currentColor"/></svg></span>
				<select id="wf-from" bind:value={from} onchange={() => from === to && (to = from === HUB.iata ? 'HKG' : HUB.iata)}>
					{#each allFromOptions as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</Field>

		<button type="button" class="swap" onclick={swap} aria-label={$t.common.swap}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
		</button>

		<Field label={$t.common.to} id="wf-to">
			<div class="control">
				<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11.5 4.5 2 12l4-1 2.5-2.5M9.5 6.5 15 1l-6.5 3 1 2.5Z" fill="currentColor"/></svg></span>
				<select id="wf-to" bind:value={to}>
					{#each cityOptions as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
				</select>
			</div>
		</Field>

		<Field label={$t.common.departDate} id="wf-dep" required>
			<div class="control">
				<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M2 6.5h12M5.5 1.8v2.7M10.5 1.8v2.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>
				<input id="wf-dep" type="date" bind:value={depart} min={todayISO()} required />
			</div>
		</Field>

		{#if tripType === 'return'}
			<Field label={$t.common.returnDate} id="wf-ret">
				<div class="control">
					<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M2 6.5h12M5.5 1.8v2.7M10.5 1.8v2.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>
					<input id="wf-ret" type="date" bind:value={ret} min={depart} />
				</div>
			</Field>
		{:else}
			<Field label={$t.common.passengers} id="wf-pax">
				<div class="control">
					<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="5" r="2.6" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M2.8 13.5c.6-2.4 2.6-3.7 5.2-3.7s4.6 1.3 5.2 3.7Z" fill="currentColor"/></svg></span>
					<select id="wf-pax" bind:value={adults}>
						{#each [1, 2, 3, 4, 5, 6] as n (n)}<option value={n}>{n} × {$t.common.adult}</option>{/each}
					</select>
				</div>
			</Field>
		{/if}

		<Field label={$t.common.cabin} id="wf-cabin">
			<div class="control">
				<span class="ico"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 10h12M4 13h8M6 4c0-1 1-2 2-2s2 1 2 2v3H6V4Z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg></span>
				<select id="wf-cabin" bind:value={cabin}>
					<option value="economy">{$t.experience.cabinTabs.economy}</option>
					<option value="premium">{$t.experience.cabinTabs.premium}</option>
					<option value="business">{$t.experience.cabinTabs.business}</option>
				</select>
			</div>
		</Field>

		<button class="btn btn--gold submit" type="submit">{$t.common.searchFlights}</button>
	</div>

	{#if error}<p class="error" role="alert">{error}</p>{/if}
</form>

<style>
	.widget {
		background: #fff;
		border-radius: var(--radius);
		box-shadow: var(--shadow-2);
		padding: 1.1rem 1.2rem 1.3rem;
		width: 100%;
	}
	.tabs {
		display: inline-flex;
		gap: 0.25rem;
		background: var(--paper-cool);
		border-radius: 999px;
		padding: 0.25rem;
		margin-bottom: 1rem;
	}
	.tabs button {
		border: 0;
		background: transparent;
		padding: 0.4rem 1.1rem;
		border-radius: 999px;
		font-weight: 650;
		font-size: 0.86rem;
		color: var(--ink-500);
		cursor: pointer;
		transition: background 0.15s var(--ease), color 0.15s var(--ease);
	}
	.tabs button.active {
		background: var(--navy-800);
		color: #fff;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr 1fr 1fr 1fr auto;
		gap: 0.7rem;
		align-items: end;
	}
	.swap {
		border: 1px solid var(--line);
		background: #fff;
		color: var(--navy-700);
		width: 38px;
		height: 42px;
		border-radius: var(--radius-sm);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: border-color 0.15s var(--ease), transform 0.2s var(--ease);
	}
	.swap:hover {
		border-color: var(--navy-500);
		transform: rotate(180deg);
	}
	.submit {
		height: 42px;
	}
	.error {
		grid-column: 1 / -1;
		color: var(--warn);
		font-size: 0.85rem;
		margin: 0.4rem 0 0;
	}
	.widget.compact .grid {
		grid-template-columns: 1fr 1fr;
	}
	@media (max-width: 1080px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
		.swap {
			display: none;
		}
		.submit {
			grid-column: 1 / -1;
		}
	}
</style>
