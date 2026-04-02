<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Card from '$lib/components/Card.svelte';
</script>

<svelte:head><title>Cuenta - AgriCheck</title></svelte:head>

<div class="mb-6">
	<h1 class="text-display-sm font-bold text-surface-900">Configuracion de Cuenta</h1>
	<p class="text-surface-500 mt-1">Administra tu perfil y preferencias.</p>
</div>

<Card>
	<EmptyState
		icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
		title="Configuracion en desarrollo"
		description="Pronto podras editar tu perfil, cambiar contrasena y mas."
	/>
</Card>
