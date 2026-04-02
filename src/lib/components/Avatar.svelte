<script lang="ts">
	export let src: string | null = null;
	export let name = '';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let status: 'online' | 'offline' | 'away' | null = null;

	const sizes_cls = {
		xs: 'w-6 h-6 text-[10px]',
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base',
		xl: 'w-16 h-16 text-lg'
	};

	const statusColors = {
		online: 'bg-accent-500',
		offline: 'bg-surface-300',
		away: 'bg-warning-500'
	};

	const statusSizes = {
		xs: 'w-1.5 h-1.5',
		sm: 'w-2 h-2',
		md: 'w-2.5 h-2.5',
		lg: 'w-3 h-3',
		xl: 'w-3.5 h-3.5'
	};

	function getInitials(n: string): string {
		return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
	}
</script>

<div class="relative inline-flex shrink-0">
	{#if src}
		<img
			{src}
			alt={name}
			class="{sizes_cls[size]} rounded-full object-cover ring-2 ring-white"
		/>
	{:else}
		<div class="{sizes_cls[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center font-semibold text-white ring-2 ring-white">
			{getInitials(name || '?')}
		</div>
	{/if}

	{#if status}
		<span class="absolute bottom-0 right-0 {statusSizes[size]} {statusColors[status]} rounded-full ring-2 ring-white" />
	{/if}
</div>
