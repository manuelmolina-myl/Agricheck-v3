<script lang="ts">
	import { onMount } from 'svelte';
	onMount(() => {
		window.location.href = '/check';
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-blue-50">
	<p class="text-gray-500">Cargando...</p>
</div>
