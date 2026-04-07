<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	export let data;
	$: attendances = data.attendances || [];
	$: ranches = data.ranches || [];
	$: dateRange = data.dateRange;

	let fromDate = dateRange.from;
	let toDate = dateRange.to;
	let selectedRanch = data.ranchFilter || '';

	$: totalHours = attendances.reduce((sum: number, a: any) => sum + (a.total_hours || 0), 0);
	$: avgHours = attendances.length > 0 ? (totalHours / attendances.length).toFixed(1) : '0';
	$: verifiedCount = attendances.filter((a: any) => a.entry_verified).length;
	$: verificationRate = attendances.length > 0 ? Math.round((verifiedCount / attendances.length) * 100) : 0;

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
	}

	function formatTime(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}

	function applyFilters() {
		const params = new URLSearchParams();
		if (fromDate) params.set('from', fromDate);
		if (toDate) params.set('to', toDate);
		if (selectedRanch) params.set('ranch', selectedRanch);
		window.location.href = `/reports?${params.toString()}`;
	}

	function exportCSV() {
		const headers = ['Fecha', 'Trabajador', 'Telefono', 'Rancho', 'Entrada', 'Salida', 'Horas', 'Verificado'];
		const rows = attendances.map((a: any) => [
			a.date,
			a.workers?.full_name || '',
			a.workers?.phone || '',
			a.ranches?.name || '',
			formatTime(a.entry_time),
			formatTime(a.exit_time),
			a.total_hours || '',
			a.entry_verified ? 'Si' : 'No'
		]);

		const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `reporte-asistencia-${fromDate}-${toDate}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head><title>Reportes - AgriCheck</title></svelte:head>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
	<div>
		<h1 class="text-display-sm font-bold text-surface-900">Reportes</h1>
		<p class="text-surface-500 mt-1">Analiza la asistencia de tu equipo.</p>
	</div>
	{#if attendances.length > 0}
		<Button variant="secondary" on:click={exportCSV}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
			Exportar CSV
		</Button>
	{/if}
</div>

<!-- Filters -->
<Card>
	<div class="flex flex-col sm:flex-row gap-4 items-end">
		<div class="flex-1">
			<Input label="Desde" type="date" bind:value={fromDate} />
		</div>
		<div class="flex-1">
			<Input label="Hasta" type="date" bind:value={toDate} />
		</div>
		{#if ranches.length > 0}
			<div class="flex-1">
				<label class="block text-sm font-medium text-surface-700 mb-1.5">Rancho</label>
				<select
					bind:value={selectedRanch}
					class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200"
				>
					<option value="">Todos</option>
					{#each ranches as ranch}
						<option value={ranch.id}>{ranch.name}</option>
					{/each}
				</select>
			</div>
		{/if}
		<Button on:click={applyFilters}>Filtrar</Button>
	</div>
</Card>

<!-- Stats -->
{#if attendances.length > 0}
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-5 my-6">
		<StatCard label="Total Registros" value={attendances.length} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" iconColor="primary" />
		<StatCard label="Horas Totales" value="{totalHours.toFixed(0)}h" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" iconColor="accent" />
		<StatCard label="Promedio Horas/Dia" value="{avgHours}h" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" iconColor="warning" />
		<StatCard label="Tasa Verificacion" value="{verificationRate}%" icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" iconColor="primary" />
	</div>
{/if}

<!-- Attendance table -->
<div class="mt-6">
	{#if attendances.length === 0}
		<Card>
			<EmptyState
				icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				title="Sin registros en este periodo"
				description="Ajusta las fechas o el rancho para ver datos."
			/>
		</Card>
	{:else}
		<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Fecha</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trabajador</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Rancho</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Entrada</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Salida</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Horas</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Estado</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each attendances as att}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3.5 font-medium text-surface-900">{formatDate(att.date)}</td>
								<td class="px-5 py-3.5 text-surface-700">{att.workers?.full_name || '—'}</td>
								<td class="px-5 py-3.5 text-surface-600">{att.ranches?.name || '—'}</td>
								<td class="px-5 py-3.5 text-surface-600 tabular-nums">{formatTime(att.entry_time)}</td>
								<td class="px-5 py-3.5 text-surface-600 tabular-nums">{formatTime(att.exit_time)}</td>
								<td class="px-5 py-3.5 text-surface-600 tabular-nums">{att.total_hours ? `${att.total_hours}h` : '—'}</td>
								<td class="px-5 py-3.5">
									{#if att.entry_verified}
										<Badge variant="success" size="sm">Verificado</Badge>
									{:else}
										<Badge variant="warning" size="sm">Pendiente</Badge>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
