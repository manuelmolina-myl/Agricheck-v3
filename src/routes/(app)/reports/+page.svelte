<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head><title>Reportes - AgriCheck</title></svelte:head>

<div class="mb-6">
	<h1 class="text-display-sm font-bold text-surface-900">Reportes</h1>
	<p class="text-surface-500 mt-1">Analiza la asistencia de tu equipo.</p>
</div>

<Card>
	<EmptyState
		icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		title="Reportes en desarrollo"
		description="Pronto podras descargar reportes detallados de asistencia, horas trabajadas y mas."
	/>
</Card>
