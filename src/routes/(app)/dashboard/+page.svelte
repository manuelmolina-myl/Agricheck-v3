<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import Card from '$lib/components/Card.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	export let data;
	$: stats = data.stats;
	$: recentCheckins = data.recentCheckins || [];
	$: tenant = data.tenant;

	const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

	function formatTime(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}

	function timeAgo(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'Ahora';
		if (mins < 60) return `Hace ${mins}m`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `Hace ${hrs}h`;
		return `Hace ${Math.floor(hrs / 24)}d`;
	}
</script>

<svelte:head>
	<title>Dashboard - AgriCheck</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-display-sm font-bold text-surface-900">
		{#if tenant?.owner_name}Hola, {tenant.owner_name.split(' ')[0]}{:else}Dashboard{/if}
	</h1>
	<p class="text-surface-500 mt-1 capitalize">{today}</p>
	{#if tenant?.status === 'trial' && tenant?.trial_ends_at}
		<div class="mt-3">
			<Badge variant="warning" dot>
				Trial - vence {new Date(tenant.trial_ends_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
			</Badge>
		</div>
	{/if}
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
	<div class="animate-fade-in-up stagger-1">
		<StatCard
			label="Trabajadores Activos"
			value={stats?.activeWorkers ?? 0}
			icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
			iconColor="primary"
		/>
	</div>
	<div class="animate-fade-in-up stagger-2">
		<StatCard
			label="Presentes Hoy"
			value={stats?.presentToday ?? 0}
			icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			iconColor="accent"
		/>
	</div>
	<div class="animate-fade-in-up stagger-3">
		<StatCard
			label="Ausentes Hoy"
			value={stats?.absentToday ?? 0}
			icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			iconColor="danger"
		/>
	</div>
	<div class="animate-fade-in-up stagger-4">
		<StatCard
			label="Ranchos"
			value={stats?.totalRanches ?? 0}
			icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			iconColor="warning"
		/>
	</div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
	<div class="animate-fade-in-up stagger-5">
		<Card>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-base font-semibold text-surface-900">Check-ins Recientes</h2>
				<Badge variant="neutral">{recentCheckins.length} registro{recentCheckins.length !== 1 ? 's' : ''}</Badge>
			</div>
			{#if recentCheckins.length === 0}
				<EmptyState
					icon="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
					title="Sin check-ins"
					description="Cuando tus trabajadores hagan check-in, los veras aqui."
					compact
				/>
			{:else}
				<div class="space-y-3">
					{#each recentCheckins as checkin}
						<div class="flex items-center gap-3 py-2">
							<Avatar name={checkin.workers?.full_name || '?'} size="sm" />
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-surface-900 truncate">{checkin.workers?.full_name || 'Trabajador'}</p>
								<p class="text-xs text-surface-400">
									{#if checkin.exit_time}
										Salida {formatTime(checkin.exit_time)}
									{:else if checkin.entry_time}
										Entrada {formatTime(checkin.entry_time)}
									{/if}
								</p>
							</div>
							<div class="text-right shrink-0">
								{#if checkin.entry_verified}
									<Badge variant="success" size="sm">Verificado</Badge>
								{:else}
									<Badge variant="warning" size="sm">Sin verificar</Badge>
								{/if}
								<p class="text-[10px] text-surface-400 mt-1">{timeAgo(checkin.created_at)}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card>
	</div>
	<div class="animate-fade-in-up stagger-6">
		<Card>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-base font-semibold text-surface-900">Acciones Rapidas</h2>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<a href="/workers/create" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-50 hover:bg-primary-50 border border-surface-100 hover:border-primary-200 transition-all group">
					<div class="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
					</div>
					<span class="text-xs font-medium text-surface-700">Agregar Trabajador</span>
				</a>
				<a href="/ranches/create" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-50 hover:bg-accent-50 border border-surface-100 hover:border-accent-200 transition-all group">
					<div class="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
					</div>
					<span class="text-xs font-medium text-surface-700">Nuevo Rancho</span>
				</a>
				<a href="/workers" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-50 hover:bg-warning-50 border border-surface-100 hover:border-warning-200 transition-all group">
					<div class="w-10 h-10 rounded-xl bg-warning-100 text-warning-600 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
					</div>
					<span class="text-xs font-medium text-surface-700">Ver Trabajadores</span>
				</a>
				<a href="/reports" class="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-100 hover:border-surface-200 transition-all group">
					<div class="w-10 h-10 rounded-xl bg-surface-200 text-surface-600 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
					</div>
					<span class="text-xs font-medium text-surface-700">Reportes</span>
				</a>
			</div>
		</Card>
	</div>
</div>
