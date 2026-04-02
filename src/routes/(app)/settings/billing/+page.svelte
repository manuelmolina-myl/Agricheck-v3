<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head><title>Facturacion - AgriCheck</title></svelte:head>

<div class="mb-6">
	<h1 class="text-display-sm font-bold text-surface-900">Facturacion</h1>
	<p class="text-surface-500 mt-1">Gestiona tu plan y metodos de pago.</p>
</div>

<Card>
	<EmptyState
		icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
		title="Facturacion en desarrollo"
		description="Pronto podras administrar tu suscripcion, descargar facturas y actualizar tu metodo de pago."
	/>
</Card>
