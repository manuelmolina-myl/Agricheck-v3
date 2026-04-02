<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	export let data;
	$: allWorkers = data.workers || [];
	let search = '';

	$: workers = search
		? allWorkers.filter((w: any) =>
			w.full_name.toLowerCase().includes(search.toLowerCase()) ||
			w.phone.includes(search)
		)
		: allWorkers;

	function statusBadge(status: string) {
		switch (status) {
			case 'active': return { variant: 'success' as const, label: 'Activo' };
			case 'inactive': return { variant: 'neutral' as const, label: 'Inactivo' };
			case 'suspended': return { variant: 'danger' as const, label: 'Suspendido' };
			default: return { variant: 'neutral' as const, label: status };
		}
	}

	function formatDate(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head><title>Trabajadores - AgriCheck</title></svelte:head>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
	<div>
		<h1 class="text-display-sm font-bold text-surface-900">Trabajadores</h1>
		<p class="text-surface-500 mt-1">{allWorkers.length} registrado{allWorkers.length !== 1 ? 's' : ''}</p>
	</div>
	<Button href="/workers/create">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
		Agregar
	</Button>
</div>

{#if allWorkers.length === 0}
	<Card>
		<EmptyState
			icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
			title="Sin trabajadores"
			description="Agrega tu primer trabajador para comenzar a registrar asistencia."
		>
			<Button href="/workers/create" size="sm">Agregar Trabajador</Button>
		</EmptyState>
	</Card>
{:else}
	<!-- Search -->
	<div class="mb-5 max-w-sm">
		<Input
			placeholder="Buscar por nombre o telefono..."
			bind:value={search}
			icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</div>

	<!-- Worker list -->
	<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-surface-100">
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trabajador</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Telefono</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Rancho</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Estado</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Ultimo Check-in</th>
						<th class="px-5 py-3.5"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-50">
					{#each workers as worker (worker.id)}
						<tr class="hover:bg-primary-50/30 transition-colors">
							<td class="px-5 py-3.5">
								<div class="flex items-center gap-3">
									<Avatar name={worker.full_name} size="sm" src={worker.registration_photo_url?.startsWith('http') ? worker.registration_photo_url : null} />
									<div>
										<p class="font-medium text-surface-900">{worker.full_name}</p>
										{#if worker.employee_number}
											<p class="text-xs text-surface-400">#{worker.employee_number}</p>
										{/if}
									</div>
								</div>
							</td>
							<td class="px-5 py-3.5 text-surface-600">{worker.phone}</td>
							<td class="px-5 py-3.5 text-surface-600">{worker.ranches?.name || '—'}</td>
							<td class="px-5 py-3.5">
								<Badge variant={statusBadge(worker.status).variant} dot>{statusBadge(worker.status).label}</Badge>
							</td>
							<td class="px-5 py-3.5 text-surface-500 text-xs">{formatDate(worker.last_checkin_at)}</td>
							<td class="px-5 py-3.5">
								<a href="/workers/{worker.id}" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">Ver</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
