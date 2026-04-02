<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' = 'button';
	export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' = 'primary';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let fullWidth = false;
	export let loading = false;
	export let disabled = false;
	export let href: string | null = null;

	const dispatch = createEventDispatcher();

	const variants = {
		primary: 'bg-gradient-to-b from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-soft-sm hover:shadow-glow-primary focus-visible:ring-primary-500/50 active:from-primary-700 active:to-primary-800',
		secondary: 'bg-white text-surface-700 ring-1 ring-surface-200 hover:bg-surface-50 hover:ring-surface-300 shadow-soft-xs focus-visible:ring-primary-500/50',
		danger: 'bg-gradient-to-b from-danger-500 to-danger-600 text-white hover:from-danger-600 hover:to-danger-700 shadow-soft-sm focus-visible:ring-danger-500/50',
		ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus-visible:ring-primary-500/50',
		outline: 'text-primary-600 ring-1 ring-primary-200 hover:bg-primary-50 hover:ring-primary-300 focus-visible:ring-primary-500/50'
	};

	const sizes_cls = {
		xs: 'px-2.5 py-1 text-xs gap-1.5',
		sm: 'px-3 py-1.5 text-sm gap-1.5',
		md: 'px-4 py-2.5 text-sm gap-2',
		lg: 'px-5 py-3 text-base gap-2',
		xl: 'px-6 py-3.5 text-base gap-2.5'
	};
</script>

{#if href}
	<a
		{href}
		class="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] {variants[variant]} {sizes_cls[size]} {fullWidth ? 'w-full' : ''}"
	>
		<slot />
	</a>
{:else}
	<button
		{type}
		class="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] {variants[variant]} {sizes_cls[size]} {fullWidth ? 'w-full' : ''}"
		disabled={disabled || loading}
		on:click={() => dispatch('click')}
	>
		{#if loading}
			<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
			</svg>
		{/if}
		<slot />
	</button>
{/if}
