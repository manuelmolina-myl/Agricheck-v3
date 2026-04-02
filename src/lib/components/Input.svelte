<script lang="ts">
	export let label = '';
	export let type = 'text';
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let error = '';
	export let helperText = '';
	export let name = '';
	export let min: string | undefined = undefined;
	export let max: string | undefined = undefined;
	export let icon: string | null = null;

	function setType(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<div>
	{#if label}
		<label class="block text-sm font-medium text-surface-700 mb-1.5">
			{label}
			{#if required}<span class="text-danger-500">*</span>{/if}
		</label>
	{/if}
	<div class="relative">
		{#if icon}
			<div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
				<svg class="w-4.5 h-4.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
					<path d={icon} />
				</svg>
			</div>
		{/if}
		<input
			use:setType
			{name}
			{placeholder}
			{required}
			{disabled}
			{min}
			{max}
			bind:value
			class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 placeholder:text-surface-400
				transition-all duration-200
				focus:outline-none focus:ring-4 focus:border-primary-500
				disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed
				{icon ? 'pl-10' : ''}
				{error
					? 'border-danger-300 bg-danger-50/30 focus:ring-danger-500/10'
					: 'border-surface-200 bg-white hover:border-surface-300 focus:ring-primary-500/10'
				}"
			style="border-width: 1px; border-style: solid;"
		/>
		{#if error}
			<div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
				<svg class="w-4.5 h-4.5 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" /></svg>
			</div>
		{/if}
	</div>
	{#if error}
		<p class="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
	{:else if helperText}
		<p class="mt-1.5 text-xs text-surface-400">{helperText}</p>
	{/if}
</div>
