<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	export let data;
	$: worker = data.worker;
	$: attendances = data.attendances || [];
	$: thisMonthCount = attendances.filter((a: Record<string, string>) => new Date(a.date).getMonth() === new Date().getMonth()).length;

	function statusBadge(status: string) {
		switch (status) {
			case 'active': return { variant: 'success' as const, label: 'Activo' };
			case 'inactive': return { variant: 'neutral' as const, label: 'Inactivo' };
			case 'suspended': return { variant: 'danger' as const, label: 'Suspendido' };
			default: return { variant: 'neutral' as const, label: status };
		}
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
	}

	function formatTime(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}

	async function toggleStatus() {
		if (!worker) return;
		const newStatus = worker.status === 'active' ? 'suspended' : 'active';
		if (!confirm(`${newStatus === 'suspended' ? 'Suspender' : 'Activar'} este trabajador?`)) return;
		const response = await fetch(`/api/workers/${worker.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus })
		});
		if (response.ok) {
			const result = await response.json();
			worker = result.worker;
		}
	}
</script>

<svelte:head><title>{worker?.full_name || 'Trabajador'} - AgriCheck</title></svelte:head>

<a href="/workers" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6">
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
	Volver a Trabajadores
</a>

{#if !worker}
	<Card>
		<EmptyState title="Trabajador no encontrado" description="El trabajador no existe o no tienes acceso." icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</Card>
{:else}
	<!-- Header -->
	<div class="flex flex-col sm:flex-row items-start gap-6 mb-8">
		<Avatar
			name={worker.full_name}
			size="xl"
			src={worker.registration_photo_url?.startsWith('http') ? worker.registration_photo_url : null}
		/>
		<div class="flex-1">
			<div class="flex items-center gap-3 mb-1">
				<h1 class="text-display-sm font-bold text-surface-900">{worker.full_name}</h1>
				<Badge variant={statusBadge(worker.status).variant} dot>{statusBadge(worker.status).label}</Badge>
			</div>
			<p class="text-surface-500">{worker.phone}</p>
			{#if worker.employee_number}
				<p class="text-sm text-surface-400 mt-1">Empleado #{worker.employee_number}</p>
			{/if}
		</div>
		<Button variant="secondary" size="sm" on:click={toggleStatus}>
			{worker.status === 'active' ? 'Suspender' : 'Activar'}
		</Button>
	</div>

	<!-- Info cards -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
		<Card>
			<h2 class="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Informacion</h2>
			<div class="space-y-3">
				<div class="flex justify-between">
					<span class="text-sm text-surface-500">Rancho</span>
					<span class="text-sm font-medium text-surface-900">{worker.ranches?.name || 'Sin asignar'}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-surface-500">Registrado</span>
					<span class="text-sm font-medium text-surface-900">{worker.registered_at ? formatDate(worker.registered_at) : 'Pendiente'}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-surface-500">Ultimo check-in</span>
					<span class="text-sm font-medium text-surface-900">{worker.last_checkin_at ? formatDate(worker.last_checkin_at) : '—'}</span>
				</div>
				{#if worker.registration_token && !worker.registered_at}
					<div class="pt-2 border-t border-surface-100">
						<p class="text-xs text-surface-400 mb-1">Link de registro facial:</p>
						<code class="text-xs bg-surface-50 p-2 rounded-lg block break-all text-primary-600">
							/register/{worker.registration_token}
						</code>
					</div>
				{/if}
			</div>
		</Card>

		<Card>
			<h2 class="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Foto de Registro</h2>
			{#if worker.registration_photo_url?.startsWith('http')}
				<img src={worker.registration_photo_url} alt={worker.full_name} class="w-full h-40 object-cover rounded-xl" />
			{:else}
				<div class="w-full h-40 bg-surface-100 rounded-xl flex items-center justify-center">
					<span class="text-surface-400 text-sm">Sin foto</span>
				</div>
			{/if}
			<p class="text-xs text-surface-400 mt-2">
				Face encoding: {worker.face_encoding ? 'Registrado' : 'Pendiente'}
			</p>
		</Card>

		<Card>
			<h2 class="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Resumen</h2>
			<div class="space-y-3">
				<div class="flex justify-between">
					<span class="text-sm text-surface-500">Total asistencias</span>
					<span class="text-sm font-bold text-surface-900">{attendances.length}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-surface-500">Este mes</span>
					<span class="text-sm font-bold text-surface-900">
						{thisMonthCount}
					</span>
				</div>
			</div>
		</Card>
	</div>

	<!-- Attendance history -->
	<Card padding={false}>
		<div class="px-6 py-4 border-b border-surface-100">
			<h2 class="text-base font-semibold text-surface-900">Historial de Asistencia</h2>
		</div>
		{#if attendances.length === 0}
			<EmptyState
				icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				title="Sin registros"
				description="Las asistencias de este trabajador apareceran aqui."
				compact
			/>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Fecha</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Entrada</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Salida</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Horas</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Verificado</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each attendances as att}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3 font-medium text-surface-900">{formatDate(att.date)}</td>
								<td class="px-5 py-3 text-surface-600">{formatTime(att.entry_time)}</td>
								<td class="px-5 py-3 text-surface-600">{formatTime(att.exit_time)}</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{att.total_hours ? `${att.total_hours}h` : '—'}</td>
								<td class="px-5 py-3">
									{#if att.entry_verified}
										<Badge variant="success" size="sm">Si</Badge>
									{:else}
										<Badge variant="danger" size="sm">No</Badge>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card>
{/if}
