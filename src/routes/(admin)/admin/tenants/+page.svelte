<script lang="ts">
	import Table from '$lib/components/Table.svelte';
</script>

<svelte:head>
	<title>Tenants - AgriCheck Admin</title>
</svelte:head>

<div class="p-6">
	<h1 class="text-2xl font-bold mb-6">Tenant Management</h1>
	<Table
		columns={['Company', 'Owner', 'Plan', 'Status', 'Workers', 'Created']}
		rows={[]}
		emptyMessage="No tenants registered yet."
	/>
</div>
