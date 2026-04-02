<script lang="ts">
  export let label = '';
  export let name: string;
  export let type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' = 'text';
  export let placeholder = '';
  export let value = '';
  export let error = '';
  export let required = false;
  export let disabled = false;
</script>

<div class="space-y-1">
  {#if label}
    <label for={name} class="block text-sm font-medium text-gray-700">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}
  <input
    {type}
    {name}
    id={name}
    {placeholder}
    {required}
    {disabled}
    bind:value
    class="block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 {error ? 'border-red-500' : 'border-gray-300'}"
    on:input
    on:blur
    on:focus
  />
  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {/if}
</div>
