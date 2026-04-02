<script lang="ts">
	export let icon = 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4';
	export let title = '';
	export let description = '';
	export let compact = false;
</script>

<div class="flex flex-col items-center justify-center {compact ? 'py-8' : 'py-16'} animate-fade-in">
	<div class="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
		<svg class="w-7 h-7 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<path d={icon} />
		</svg>
	</div>
	{#if title}
		<h3 class="text-sm font-semibold text-surface-900 mb-1">{title}</h3>
	{/if}
	{#if description}
		<p class="text-sm text-surface-500 text-center max-w-sm mb-4">{description}</p>
	{/if}
	<slot />
</div>
