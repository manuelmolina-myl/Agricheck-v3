<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Card from '$lib/components/Card.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	export let data;
	$: ranches = data.ranches || [];

	async function deleteRanch(id: string) {
		if (!confirm('Desactivar este rancho?')) return;
		await fetch(`/api/ranches/${id}`, { method: 'DELETE' });
		ranches = ranches.filter((r: { id: string }) => r.id !== id);
	}
</script>

<svelte:head><title>Ranchos - AgriCheck</title></svelte:head>

<div class="flex items-center justify-between mb-6">
	<div>
		<h1 class="text-display-sm font-bold text-surface-900">Ranchos</h1>
		<p class="text-surface-500 mt-1">Administra tus ubicaciones y geofences.</p>
	</div>
	<Button href="/ranches/create">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
		Agregar Rancho
	</Button>
</div>

{#if ranches.length === 0}
	<Card>
		<EmptyState
			icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			title="Sin ranchos"
			description="Agrega tu primer rancho para comenzar a registrar asistencia."
		>
			<Button href="/ranches/create" size="sm">Crear Rancho</Button>
		</EmptyState>
	</Card>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
		{#each ranches as ranch (ranch.id)}
			<Card hover>
				<div class="flex items-start justify-between mb-3">
					<div>
						<h3 class="font-semibold text-surface-900">{ranch.name}</h3>
						{#if ranch.lot_number}
							<p class="text-xs text-surface-400">Lote: {ranch.lot_number}</p>
						{/if}
					</div>
					<Badge variant={ranch.active ? 'success' : 'neutral'} dot>
						{ranch.active ? 'Activo' : 'Inactivo'}
					</Badge>
				</div>

				{#if ranch.address}
					<p class="text-sm text-surface-500 mb-3">{ranch.address}</p>
				{/if}

				<div class="flex items-center gap-4 text-xs text-surface-400 mb-4">
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
						{ranch.geofence_radius_meters}m radio
					</span>
					{#if ranch.supervisor_name}
						<span class="flex items-center gap-1">
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
							{ranch.supervisor_name}
						</span>
					{/if}
				</div>

				<div class="flex items-center gap-2 pt-3 border-t border-surface-100">
					<Button variant="ghost" size="xs" href="/ranches/create?edit={ranch.id}">Editar</Button>
					<Button variant="ghost" size="xs" on:click={() => deleteRanch(ranch.id)}>Desactivar</Button>
				</div>
			</Card>
		{/each}
	</div>
{/if}
