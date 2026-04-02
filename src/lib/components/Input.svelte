<script lang="ts">
	export let label = '';
	export let type = 'text';
	export let value = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let error = '';
	export let name = '';
	export let min: string | undefined = undefined;
	export let max: string | undefined = undefined;

	function setType(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<div>
	{#if label}
		<label class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}<span class="text-red-500">*</span>{/if}
		</label>
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
		class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed {error ? 'border-red-300' : 'border-gray-300'}"
	/>
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
