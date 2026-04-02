<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
</script>

<svelte:head><title>Ranchos - AgriCheck</title></svelte:head>

<div class="flex items-center justify-between mb-6">
	<div>
		<h1 class="text-display-sm font-bold text-surface-900">Ranchos</h1>
		<p class="text-surface-500 mt-1">Administra tus ubicaciones y geofences.</p>
	</div>
	<Button>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
		Agregar
	</Button>
</div>

<Table
	columns={['Nombre', 'Lote', 'Supervisor', 'Trabajadores', 'Radio', 'Estado']}
	rows={[]}
	emptyMessage="Configura tu primer rancho."
	emptyIcon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
/>
