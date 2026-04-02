<script lang="ts">
	export let variant: 'info' | 'success' | 'warning' | 'danger' = 'info';
	export let dismissible = false;
	let visible = true;

	const styles = {
		info: 'bg-primary-50/60 border-primary-500 text-primary-800',
		success: 'bg-accent-50/60 border-accent-500 text-accent-800',
		warning: 'bg-warning-50/60 border-warning-500 text-warning-800',
		danger: 'bg-danger-50/60 border-danger-500 text-danger-800'
	};

	const icons = {
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
		danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
	};
</script>

{#if visible}
	<div class="flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 {styles[variant]} animate-fade-in-down" role="alert">
		<svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
			<path d={icons[variant]} />
		</svg>
		<div class="flex-1 text-sm font-medium">
			<slot />
		</div>
		{#if dismissible}
			<button on:click={() => (visible = false)} class="shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>
		{/if}
	</div>
{/if}
