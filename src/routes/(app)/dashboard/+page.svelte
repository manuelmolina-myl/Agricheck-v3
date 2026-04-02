<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import Card from '$lib/components/Card.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Badge from '$lib/components/Badge.svelte';

	const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
</script>

<svelte:head>
	<title>Dashboard - AgriCheck</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-display-sm font-bold text-surface-900">Dashboard</h1>
	<p class="text-surface-500 mt-1 capitalize">{today}</p>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
	<div class="animate-fade-in-up stagger-1">
		<StatCard
			label="Trabajadores Activos"
			value="0"
			icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
			iconColor="primary"
		/>
	</div>
	<div class="animate-fade-in-up stagger-2">
		<StatCard
			label="Presentes Hoy"
			value="0"
			icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			iconColor="accent"
		/>
	</div>
	<div class="animate-fade-in-up stagger-3">
		<StatCard
			label="Ausentes Hoy"
			value="0"
			icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			iconColor="danger"
		/>
	</div>
	<div class="animate-fade-in-up stagger-4">
		<StatCard
			label="Ranchos"
			value="0"
			icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			iconColor="warning"
		/>
	</div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
	<div class="animate-fade-in-up stagger-5">
		<Card>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-base font-semibold text-surface-900">Actividad Reciente</h2>
				<Badge variant="neutral">Hoy</Badge>
			</div>
			<EmptyState
				icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				title="Sin actividad"
				description="Los check-ins de tus trabajadores apareceran aqui."
				compact
			/>
		</Card>
	</div>
	<div class="animate-fade-in-up stagger-6">
		<Card>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-base font-semibold text-surface-900">Check-ins de Hoy</h2>
				<Badge variant="neutral">0 registros</Badge>
			</div>
			<EmptyState
				icon="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
				title="Sin check-ins"
				description="Cuando tus trabajadores hagan check-in, los veras aqui en tiempo real."
				compact
			/>
		</Card>
	</div>
</div>
