<script lang="ts">
	export let label = '';
	export let value: string | number = 0;
	export let change: string | null = null;
	export let changeType: 'up' | 'down' | 'neutral' = 'neutral';
	export let icon: string = '';
	export let iconColor: 'primary' | 'accent' | 'warning' | 'danger' = 'primary';

	const iconBg = {
		primary: 'bg-primary-50 text-primary-600',
		accent: 'bg-accent-50 text-accent-600',
		warning: 'bg-warning-50 text-warning-600',
		danger: 'bg-danger-50 text-danger-600'
	};

	const changeColors = {
		up: 'text-accent-600',
		down: 'text-danger-600',
		neutral: 'text-surface-400'
	};
</script>

<div class="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group">
	<div class="flex items-start justify-between mb-4">
		<div class="w-11 h-11 rounded-xl {iconBg[iconColor]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
			{#if icon}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d={icon} />
				</svg>
			{:else}
				<slot name="icon" />
			{/if}
		</div>
		{#if change}
			<span class="text-xs font-medium {changeColors[changeType]} flex items-center gap-0.5">
				{#if changeType === 'up'}
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17l5-5 5 5M7 7l5 5 5-5" /></svg>
				{:else if changeType === 'down'}
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 7l-5 5-5-5m0 10l5-5 5 5" /></svg>
				{/if}
				{change}
			</span>
		{/if}
	</div>
	<p class="text-sm font-medium text-surface-500 mb-1">{label}</p>
	<p class="text-display-sm font-bold text-surface-900 tabular-nums">{value}</p>
</div>
