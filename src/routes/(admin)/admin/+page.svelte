<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head>
	<title>Admin Dashboard - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<h1 class="text-2xl font-bold text-gray-900">AgriCheck Admin</h1>
			<span class="text-sm text-gray-500">Super Admin</span>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card>
				<p class="text-sm text-gray-500">Total Tenants</p>
				<p class="text-3xl font-bold text-gray-900">0</p>
			</Card>
			<Card>
				<p class="text-sm text-gray-500">Active Tenants</p>
				<p class="text-3xl font-bold text-green-600">0</p>
			</Card>
			<Card>
				<p class="text-sm text-gray-500">Trial Tenants</p>
				<p class="text-3xl font-bold text-yellow-600">0</p>
			</Card>
			<Card>
				<p class="text-sm text-gray-500">MRR</p>
				<p class="text-3xl font-bold text-primary-600">$0</p>
			</Card>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<h2 class="text-lg font-semibold mb-4">Recent Signups</h2>
				<p class="text-gray-500 text-sm">No tenants yet.</p>
			</Card>
			<Card>
				<h2 class="text-lg font-semibold mb-4">System Health</h2>
				<p class="text-gray-500 text-sm">All systems operational.</p>
			</Card>
		</div>
	</main>
</div>
