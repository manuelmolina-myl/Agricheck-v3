<script lang="ts">
	export let variant: 'text' | 'circle' | 'rect' | 'card' = 'text';
	export let width = '';
	export let height = '';
</script>

{#if variant === 'text'}
	<div class="skeleton h-4 rounded {width || 'w-full'}" style={height ? `height:${height}` : ''} />
{:else if variant === 'circle'}
	<div class="skeleton rounded-full {width || 'w-10'} {height || 'h-10'}" />
{:else if variant === 'rect'}
	<div class="skeleton rounded-xl {width || 'w-full'} {height || 'h-24'}" />
{:else if variant === 'card'}
	<div class="bg-white rounded-2xl shadow-card p-6 space-y-4">
		<div class="flex items-center gap-3">
			<div class="skeleton w-10 h-10 rounded-xl" />
			<div class="flex-1 space-y-2">
				<div class="skeleton h-3 w-24 rounded" />
				<div class="skeleton h-4 w-16 rounded" />
			</div>
		</div>
		<div class="skeleton h-3 w-full rounded" />
		<div class="skeleton h-3 w-3/4 rounded" />
	</div>
{/if}
