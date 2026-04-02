<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
</script>

<svelte:head><title>Admin - AgriCheck</title></svelte:head>

<div class="min-h-screen bg-surface-50">
	<header class="bg-surface-900 text-white">
		<div class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
			<div>
				<h1 class="text-display-sm font-bold">AgriCheck Admin</h1>
				<p class="text-surface-400 text-sm mt-1">Panel de administracion global</p>
			</div>
			<Badge variant="primary">Super Admin</Badge>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-6 py-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
			<div class="animate-fade-in-up stagger-1">
				<StatCard label="Total Tenants" value="0" icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" iconColor="primary" />
			</div>
			<div class="animate-fade-in-up stagger-2">
				<StatCard label="Activos" value="0" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" iconColor="accent" />
			</div>
			<div class="animate-fade-in-up stagger-3">
				<StatCard label="En Trial" value="0" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" iconColor="warning" />
			</div>
			<div class="animate-fade-in-up stagger-4">
				<StatCard label="MRR" value="$0" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" iconColor="primary" />
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<div class="flex items-center justify-between mb-5">
					<h2 class="text-base font-semibold text-surface-900">Ultimos Registros</h2>
					<Badge variant="neutral">Hoy</Badge>
				</div>
				<EmptyState icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" title="Sin registros" description="Nuevos tenants apareceran aqui." compact />
			</Card>
			<Card>
				<div class="flex items-center justify-between mb-5">
					<h2 class="text-base font-semibold text-surface-900">Estado del Sistema</h2>
					<Badge variant="success" dot>Operativo</Badge>
				</div>
				<div class="space-y-3">
					{#each ['Supabase', 'Google Vision', 'Cloudflare R2', 'Stripe'] as service}
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-700">{service}</span>
							<Badge variant="success" size="sm">OK</Badge>
						</div>
					{/each}
				</div>
			</Card>
		</div>
	</main>
</div>
