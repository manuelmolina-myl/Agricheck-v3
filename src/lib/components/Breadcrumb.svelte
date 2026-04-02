<script lang="ts">
	export let items: Array<{ label: string; href?: string }> = [];
</script>

<nav class="flex items-center gap-1.5 text-sm">
	{#each items as item, i}
		{#if i > 0}
			<svg class="w-3.5 h-3.5 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		{/if}
		{#if i === items.length - 1}
			<span class="font-medium text-surface-900">{item.label}</span>
		{:else if item.href}
			<a href={item.href} class="text-surface-400 hover:text-surface-600 transition-colors">{item.label}</a>
		{:else}
			<span class="text-surface-400">{item.label}</span>
		{/if}
	{/each}
</nav>
