<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'full' | 'icon' = 'full';

	const sizes = { sm: 'h-6', md: 'h-8', lg: 'h-10' };
	const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
</script>

<div class="flex items-center gap-2">
	<div class="{sizes[size]} aspect-square rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-sm">
		<svg class="w-[60%] h-[60%] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="M9 12l2 2 4-4" />
		</svg>
	</div>
	{#if variant === 'full'}
		<span class="{textSizes[size]} font-bold tracking-tight">
			<span class="text-surface-900">Agri</span><span class="text-primary-600">Check</span>
		</span>
	{/if}
</div>
