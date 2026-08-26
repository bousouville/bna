<script>
	/** 订座挂件：出发/到达/日期/舱等 → GET 跳转到订座页 */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { t, locale } from '$lib/stores/locale.js';
	import { destinations, HUB } from '$data/destinations.js';
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

	/* 默认日期：两周后 */
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
		const params = new URLSearchParams({
			from,
			to,
			depart,
			trip: tripType,
			cabin,
			adults: String(adults)
		});
		if (tripType === 'return' && ret) params.set('return', ret);
		goto(`${bookingHref}?${params.toString()}`);
	}


	let { compact = false } = $props();</script>

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
		<label class="field">
			<span>{$t.common.from}</span>
			<select bind:value={from} onchange={() => from === to && (to = from === HUB.iata ? 'HKG' : HUB.iata)}>
				{#each allFromOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</select>
		</label>

		<button type="button" class="swap" onclick={swap} aria-label={$t.common.swap}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<label class="field">
			<span>{$t.common.to}</span>
			<select bind:value={to}>
				{#each cityOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</select>
		</label>

		<label class="field">
			<span>{$t.common.departDate}</span>
			<input type="date" bind:value={depart} min={todayISO()} required />
		</label>

		{#if tripType === 'return'}
			<label class="field">
				<span>{$t.common.returnDate}</span>
				<input type="date" bind:value={ret} min={depart} />
			</label>
		{:else}
			<label class="field">
				<span>{$t.common.passengers}</span>
				<select bind:value={adults}>
					{#each [1, 2, 3, 4, 5, 6] as n (n)}
						<option value={n}>{n} × {$t.common.adult}</option>
					{/each}
				</select>
			</label>
		{/if}

		<label class="field">
			<span>{$t.common.cabin}</span>
			<select bind:value={cabin}>
				<option value="economy">{$t.experience.cabinTabs.economy}</option>
				<option value="premium">{$t.experience.cabinTabs.premium}</option>
				<option value="business">{$t.experience.cabinTabs.business}</option>
			</select>
		</label>

		<button class="btn btn--gold submit" type="submit">{$t.common.searchFlights}</button>
	</div>

	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}
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

	.grid > .field:nth-of-type(2) {
		grid-column: 3;
	}

	.swap {
		border: 1.5px solid var(--line);
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
