<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
</script>

<svelte:head>
	<title>Trabajadores - AgriCheck</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold">Trabajadores</h1>
	<Button>+ Agregar Trabajador</Button>
</div>

<Table
	columns={['Nombre', 'Teléfono', 'Rancho', 'Estado', 'Último Check-in']}
	rows={[]}
	emptyMessage="No hay trabajadores registrados. Agrega el primero."
/>
