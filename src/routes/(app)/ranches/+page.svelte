<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
</script>

<svelte:head>
	<title>Ranchos - AgriCheck</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold">Ranchos</h1>
	<Button>+ Agregar Rancho</Button>
</div>

<Table
	columns={['Nombre', 'Lote', 'Supervisor', 'Trabajadores', 'Radio Geofence', 'Estado']}
	rows={[]}
	emptyMessage="No hay ranchos registrados."
/>
