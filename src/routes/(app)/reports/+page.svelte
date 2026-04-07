<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	export let data;
	$: attendances = data.attendances || [];
	$: ranches = data.ranches || [];
	$: workers = data.workers || [];
	$: workerSummary = data.workerSummary || [];
	$: dailySummary = data.dailySummary || [];
	$: dateRange = data.dateRange;

	let fromDate = dateRange.from;
	let toDate = dateRange.to;
	let selectedRanch = data.ranchFilter || '';
	let selectedWorker = data.workerFilter || '';
	let activeTab = data.tab || 'general';

	$: totalHours = attendances.reduce((sum: number, a: any) => sum + (a.total_hours || 0), 0);
	$: avgHours = attendances.length > 0 ? (totalHours / attendances.length).toFixed(1) : '0';
	$: verifiedCount = attendances.filter((a: any) => a.entry_verified).length;
	$: verificationRate = attendances.length > 0 ? Math.round((verifiedCount / attendances.length) * 100) : 0;
	$: uniqueWorkers = new Set(attendances.map((a: any) => a.worker_id)).size;

	// Daily chart bar heights
	$: maxDayCount = Math.max(...dailySummary.map((d: any) => d.count), 1);

	function formatDate(iso: string) {
		return new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
	}

	function formatDateFull(iso: string) {
		return new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' });
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
		if (selectedWorker) params.set('worker', selectedWorker);
		params.set('tab', activeTab);
		window.location.href = `/reports?${params.toString()}`;
	}

	function switchTab(tab: string) {
		activeTab = tab;
	}

	function exportCSV() {
		const headers = ['Fecha', 'Trabajador', 'Telefono', 'Rancho', 'Entrada', 'Salida', 'Horas', 'Verificado', 'Registrado por'];
		const rows = attendances.map((a: any) => [
			a.date,
			a.workers?.full_name || '',
			a.workers?.phone || '',
			a.ranches?.name || '',
			formatTime(a.entry_time),
			formatTime(a.exit_time),
			a.total_hours || '',
			a.entry_verified ? 'Si' : 'No',
			a.checked_in_by_name || 'Auto'
		]);
		const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `agricheck-reporte-${fromDate}-${toDate}.csv`;
		link.click();
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
	<div class="flex flex-col lg:flex-row gap-4 items-end">
		<div class="flex-1 min-w-0">
			<Input label="Desde" type="date" bind:value={fromDate} />
		</div>
		<div class="flex-1 min-w-0">
			<Input label="Hasta" type="date" bind:value={toDate} />
		</div>
		{#if ranches.length > 0}
			<div class="flex-1 min-w-0">
				<label class="block text-sm font-medium text-surface-700 mb-1.5">Rancho</label>
				<select bind:value={selectedRanch} class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
					<option value="">Todos</option>
					{#each ranches as ranch}
						<option value={ranch.id}>{ranch.name}</option>
					{/each}
				</select>
			</div>
		{/if}
		{#if workers.length > 0}
			<div class="flex-1 min-w-0">
				<label class="block text-sm font-medium text-surface-700 mb-1.5">Trabajador</label>
				<select bind:value={selectedWorker} class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
					<option value="">Todos</option>
					{#each workers as worker}
						<option value={worker.id}>{worker.full_name}</option>
					{/each}
				</select>
			</div>
		{/if}
		<Button on:click={applyFilters}>Filtrar</Button>
	</div>
</Card>

<!-- Stats -->
{#if attendances.length > 0}
	<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 my-6">
		<StatCard label="Registros" value={attendances.length} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" iconColor="primary" />
		<StatCard label="Trabajadores" value={uniqueWorkers} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" iconColor="accent" />
		<StatCard label="Horas Totales" value="{totalHours.toFixed(0)}h" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" iconColor="warning" />
		<StatCard label="Promedio/Dia" value="{avgHours}h" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" iconColor="primary" />
		<StatCard label="Verificacion" value="{verificationRate}%" icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" iconColor="accent" />
	</div>

	<!-- Tabs -->
	<div class="flex gap-1 bg-surface-100 p-1 rounded-xl mb-6 max-w-md">
		{#each [{ id: 'general', label: 'General' }, { id: 'workers', label: 'Por Trabajador' }, { id: 'daily', label: 'Por Dia' }] as tab}
			<button
				class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 {activeTab === tab.id ? 'bg-white text-surface-900 shadow-soft-xs' : 'text-surface-500 hover:text-surface-700'}"
				on:click={() => switchTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab content -->
	{#if activeTab === 'general'}
		<!-- Daily attendance chart -->
		{#if dailySummary.length > 1}
			<Card>
				<h3 class="text-sm font-semibold text-surface-900 mb-4">Asistencia Diaria</h3>
				<div class="flex items-end gap-1 h-32 overflow-x-auto pb-6">
					{#each dailySummary as day}
						<div class="flex flex-col items-center gap-1 min-w-[2rem] flex-1">
							<span class="text-[10px] font-medium text-surface-500 tabular-nums">{day.count}</span>
							<div
								class="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-500"
								style="height: {Math.max((day.count / maxDayCount) * 100, 4)}%"
							/>
							<span class="text-[9px] text-surface-400 -rotate-45 origin-top-left whitespace-nowrap">{formatDate(day.date)}</span>
						</div>
					{/each}
				</div>
			</Card>
		{/if}

		<!-- Attendance table -->
		<div class="mt-6 bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
			<div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
				<h3 class="text-sm font-semibold text-surface-900">Detalle de Asistencia</h3>
				<Badge variant="neutral">{attendances.length} registro{attendances.length !== 1 ? 's' : ''}</Badge>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Fecha</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trabajador</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Rancho</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Entrada</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Salida</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Horas</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Estado</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each attendances as att}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3 font-medium text-surface-900">{formatDate(att.date)}</td>
								<td class="px-5 py-3">
									<div class="flex items-center gap-2">
										<Avatar name={att.workers?.full_name || '?'} size="xs" />
										<span class="text-surface-700">{att.workers?.full_name || '—'}</span>
									</div>
								</td>
								<td class="px-5 py-3 text-surface-600">{att.ranches?.name || '—'}</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{formatTime(att.entry_time)}</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{formatTime(att.exit_time)}</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums font-medium">{att.total_hours ? `${att.total_hours}h` : '—'}</td>
								<td class="px-5 py-3">
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

	{:else if activeTab === 'workers'}
		<!-- Per-worker summary -->
		<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
			<div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
				<h3 class="text-sm font-semibold text-surface-900">Resumen por Trabajador</h3>
				<Badge variant="neutral">{workerSummary.length} trabajador{workerSummary.length !== 1 ? 'es' : ''}</Badge>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trabajador</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Dias</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Horas Total</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Prom/Dia</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Verificacion</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Asistencia</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each workerSummary as ws}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3">
									<div class="flex items-center gap-2">
										<Avatar name={ws.name} size="sm" />
										<span class="font-medium text-surface-900">{ws.name}</span>
									</div>
								</td>
								<td class="px-5 py-3 text-surface-700 tabular-nums font-medium">{ws.days}</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{ws.hours.toFixed(1)}h</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{ws.avgHours}h</td>
								<td class="px-5 py-3">
									{#if ws.total > 0}
										<div class="flex items-center gap-2">
											<div class="w-16 h-1.5 bg-surface-100 rounded-full overflow-hidden">
												<div class="h-full bg-primary-500 rounded-full" style="width:{Math.round((ws.verified / ws.total) * 100)}%" />
											</div>
											<span class="text-xs text-surface-500 tabular-nums">{Math.round((ws.verified / ws.total) * 100)}%</span>
										</div>
									{/if}
								</td>
								<td class="px-5 py-3">
									<!-- Mini attendance bar for visual -->
									<div class="flex gap-0.5">
										{#each Array(Math.min(ws.days, 20)) as _}
											<div class="w-1.5 h-4 bg-primary-400 rounded-sm" />
										{/each}
										{#if ws.days > 20}
											<span class="text-[10px] text-surface-400 ml-1">+{ws.days - 20}</span>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

	{:else if activeTab === 'daily'}
		<!-- Per-day summary -->
		<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
			<div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
				<h3 class="text-sm font-semibold text-surface-900">Resumen por Dia</h3>
				<Badge variant="neutral">{dailySummary.length} dia{dailySummary.length !== 1 ? 's' : ''}</Badge>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Fecha</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Asistencias</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Horas Total</th>
							<th class="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Grafico</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each [...dailySummary].reverse() as day}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3 font-medium text-surface-900">{formatDateFull(day.date)}</td>
								<td class="px-5 py-3 text-surface-700 tabular-nums">
									<span class="font-semibold">{day.count}</span>
									<span class="text-surface-400 text-xs ml-1">persona{day.count !== 1 ? 's' : ''}</span>
								</td>
								<td class="px-5 py-3 text-surface-600 tabular-nums">{day.hours.toFixed(1)}h</td>
								<td class="px-5 py-3">
									<div class="flex items-center gap-2">
										<div class="w-32 h-2 bg-surface-100 rounded-full overflow-hidden">
											<div class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all" style="width:{Math.round((day.count / maxDayCount) * 100)}%" />
										</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

{:else}
	<div class="mt-6">
		<Card>
			<EmptyState
				icon="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				title="Sin registros en este periodo"
				description="Ajusta las fechas o filtros para ver datos de asistencia."
			>
				<Button size="sm" on:click={() => { fromDate = ''; toDate = ''; selectedRanch = ''; selectedWorker = ''; applyFilters(); }}>
					Limpiar filtros
				</Button>
			</EmptyState>
		</Card>
	</div>
{/if}
