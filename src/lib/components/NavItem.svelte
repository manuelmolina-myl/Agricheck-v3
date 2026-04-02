<script lang="ts">
	export let href = '';
	export let icon = '';
	export let active = false;
	export let count: number | null = null;
</script>

<a
	{href}
	class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
		{active
			? 'bg-primary-50 text-primary-700'
			: 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
		}"
>
	{#if active}
		<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-600" />
	{/if}
	<svg
		class="w-5 h-5 shrink-0 transition-colors {active ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600'}"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d={icon} />
	</svg>
	<span class="flex-1"><slot /></span>
	{#if count !== null}
		<span class="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-surface-100 text-surface-500 text-xs font-medium flex items-center justify-center {active ? 'bg-primary-100 text-primary-700' : ''}">
			{count}
		</span>
	{/if}
</a>
