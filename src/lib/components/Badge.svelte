<script lang="ts">
	export let variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' = 'neutral';
	export let dot = false;
	export let size: 'sm' | 'md' = 'md';

	const variants = {
		success: 'bg-accent-50 text-accent-700 ring-accent-600/10',
		warning: 'bg-warning-50 text-warning-700 ring-warning-600/10',
		danger: 'bg-danger-50 text-danger-700 ring-danger-600/10',
		info: 'bg-primary-50 text-primary-700 ring-primary-600/10',
		neutral: 'bg-surface-100 text-surface-600 ring-surface-500/10',
		primary: 'bg-primary-600 text-white ring-primary-600/20'
	};

	const dotColors = {
		success: 'bg-accent-500',
		warning: 'bg-warning-500',
		danger: 'bg-danger-500',
		info: 'bg-primary-500',
		neutral: 'bg-surface-400',
		primary: 'bg-white'
	};

	const sizes_cls = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2.5 py-0.5 text-xs'
	};
</script>

<span class="inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset {variants[variant]} {sizes_cls[size]}">
	{#if dot}
		<span class="w-1.5 h-1.5 rounded-full {dotColors[variant]}" />
	{/if}
	<slot />
</span>
