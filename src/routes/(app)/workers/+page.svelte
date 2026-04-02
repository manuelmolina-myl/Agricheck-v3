<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
</script>

<svelte:head><title>Trabajadores - AgriCheck</title></svelte:head>

<div class="flex items-center justify-between mb-6">
	<div>
		<h1 class="text-display-sm font-bold text-surface-900">Trabajadores</h1>
		<p class="text-surface-500 mt-1">Gestiona tu equipo de trabajo.</p>
	</div>
	<Button>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
		Agregar
	</Button>
</div>

<Table
	columns={['Nombre', 'Telefono', 'Rancho', 'Estado', 'Ultimo Check-in']}
	rows={[]}
	emptyMessage="Agrega tu primer trabajador para comenzar."
	emptyIcon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
/>
