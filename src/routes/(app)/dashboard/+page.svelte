<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head>
	<title>Dashboard - AgriCheck</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Dashboard</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
	<Card>
		<p class="text-sm text-gray-500">Trabajadores Activos</p>
		<p class="text-3xl font-bold text-gray-900">0</p>
	</Card>
	<Card>
		<p class="text-sm text-gray-500">Presentes Hoy</p>
		<p class="text-3xl font-bold text-green-600">0</p>
	</Card>
	<Card>
		<p class="text-sm text-gray-500">Ausentes Hoy</p>
		<p class="text-3xl font-bold text-red-600">0</p>
	</Card>
	<Card>
		<p class="text-sm text-gray-500">Ranchos</p>
		<p class="text-3xl font-bold text-primary-600">0</p>
	</Card>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
	<Card>
		<h2 class="text-lg font-semibold mb-4">Actividad Reciente</h2>
		<p class="text-gray-500 text-sm">No hay actividad registrada aún.</p>
	</Card>
	<Card>
		<h2 class="text-lg font-semibold mb-4">Check-ins de Hoy</h2>
		<p class="text-gray-500 text-sm">No hay check-ins hoy.</p>
	</Card>
</div>
