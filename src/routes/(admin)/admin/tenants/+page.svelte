<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Card from '$lib/components/Card.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	export let data;
	$: tenants = data.tenants || [];

	function planBadge(plan: string) {
		switch (plan) {
			case 'starter': return { variant: 'neutral' as const, label: 'Starter' };
			case 'professional': return { variant: 'info' as const, label: 'Professional' };
			case 'enterprise': return { variant: 'primary' as const, label: 'Enterprise' };
			default: return { variant: 'neutral' as const, label: plan };
		}
	}

	function statusBadge(status: string) {
		switch (status) {
			case 'trial': return { variant: 'warning' as const, label: 'Trial' };
			case 'active': return { variant: 'success' as const, label: 'Activo' };
			case 'suspended': return { variant: 'danger' as const, label: 'Suspendido' };
			case 'canceled': return { variant: 'neutral' as const, label: 'Cancelado' };
			default: return { variant: 'neutral' as const, label: status };
		}
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head><title>Tenants - AgriCheck Admin</title></svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<div class="mb-6">
		<h1 class="text-display-sm font-bold text-surface-900">Gestion de Tenants</h1>
		<p class="text-surface-500 mt-1">{tenants.length} empresa{tenants.length !== 1 ? 's' : ''} registrada{tenants.length !== 1 ? 's' : ''}</p>
	</div>

	{#if tenants.length === 0}
		<Card>
			<EmptyState
				icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
				title="Sin tenants"
				description="Aun no hay empresas registradas en la plataforma."
			/>
		</Card>
	{:else}
		<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-surface-100">
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Empresa</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Propietario</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Plan</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Estado</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trabajadores</th>
							<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Creado</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-surface-50">
						{#each tenants as tenant (tenant.id)}
							<tr class="hover:bg-primary-50/30 transition-colors">
								<td class="px-5 py-3.5">
									<p class="font-medium text-surface-900">{tenant.company_name}</p>
									<p class="text-xs text-surface-400">{tenant.slug}</p>
								</td>
								<td class="px-5 py-3.5">
									<p class="text-surface-700">{tenant.owner_name}</p>
									<p class="text-xs text-surface-400">{tenant.owner_email}</p>
								</td>
								<td class="px-5 py-3.5">
									<Badge variant={planBadge(tenant.plan).variant}>{planBadge(tenant.plan).label}</Badge>
								</td>
								<td class="px-5 py-3.5">
									<Badge variant={statusBadge(tenant.status).variant} dot>{statusBadge(tenant.status).label}</Badge>
								</td>
								<td class="px-5 py-3.5 text-surface-700 tabular-nums">{tenant.workerCount}</td>
								<td class="px-5 py-3.5 text-surface-500 text-xs">{formatDate(tenant.created_at)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
