<script>
	/** 可复用表单字段：label + 控件插槽 + hint/error（无障碍 label-for 接线）
	   用法：<Field label="出發地" id="from">…<select id="from">…</select></Field> */
	import { getContext } from 'svelte';

	let { label = '', id = '', hint = '', error = '', required = false, children } = $props();
</script>

<div class="field" class:has-error={!!error}>
	<label for={id} class="flabel">
		{label}
		{#if required}<span class="req" aria-hidden="true">*</span>{/if}
	</label>
	{@render children?.()}
	{#if hint}<span class="hint" id={id ? `${id}-hint` : undefined}>{hint}</span>{/if}
	{#if error}<span class="msg" id={id ? `${id}-err` : undefined} role="alert">{error}</span>{/if}
</div>
