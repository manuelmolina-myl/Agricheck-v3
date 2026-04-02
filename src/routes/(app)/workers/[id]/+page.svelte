<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';

	$: workerId = $page.params.id;
</script>

<svelte:head>
	<title>Detalle Trabajador - AgriCheck</title>
</svelte:head>

<div class="mb-6">
	<a href="/workers" class="text-primary-600 hover:text-primary-700 text-sm">&larr; Volver</a>
</div>

<h1 class="text-2xl font-bold mb-6">Detalle del Trabajador</h1>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<Card>
		<h2 class="text-lg font-semibold mb-4">Información</h2>
		<p class="text-gray-500 text-sm">Worker ID: {workerId}</p>
	</Card>
	<Card>
		<h2 class="text-lg font-semibold mb-4">Foto de Registro</h2>
		<div class="w-32 h-32 bg-gray-200 rounded-lg" />
	</Card>
	<Card>
		<h2 class="text-lg font-semibold mb-4">Asistencia</h2>
		<p class="text-gray-500 text-sm">Sin registros.</p>
	</Card>
</div>
