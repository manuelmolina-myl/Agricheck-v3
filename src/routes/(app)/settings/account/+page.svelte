<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';

	export let data;
	$: session = data.session;

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordLoading = false;
	let passwordError = '';
	let passwordSuccess = false;

	async function changePassword() {
		if (newPassword.length < 8) { passwordError = 'Minimo 8 caracteres.'; return; }
		if (newPassword !== confirmPassword) { passwordError = 'Las contrasenas no coinciden.'; return; }

		passwordLoading = true;
		passwordError = '';
		passwordSuccess = false;

		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword, newPassword })
			});

			if (!response.ok) {
				const d = await response.json();
				passwordError = d.message || 'Error al cambiar contrasena.';
				return;
			}

			passwordSuccess = true;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch {
			passwordError = 'Error de conexion.';
		} finally {
			passwordLoading = false;
		}
	}
</script>

<svelte:head><title>Cuenta - AgriCheck</title></svelte:head>

<div class="max-w-2xl">
	<div class="mb-6">
		<h1 class="text-display-sm font-bold text-surface-900">Configuracion de Cuenta</h1>
		<p class="text-surface-500 mt-1">Administra tu perfil y seguridad.</p>
	</div>

	<div class="space-y-6">
		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Informacion de la Cuenta</h2>
			<div class="space-y-3">
				<div class="flex justify-between items-center py-2">
					<span class="text-sm text-surface-500">Correo</span>
					<span class="text-sm font-medium text-surface-900">{session?.user?.email || '—'}</span>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="text-sm text-surface-500">ID de usuario</span>
					<code class="text-xs bg-surface-50 px-2 py-1 rounded-lg text-surface-600">{session?.user?.id?.slice(0, 8) || '—'}...</code>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="text-sm text-surface-500">Autenticacion</span>
					<Badge variant="success" dot>Activa</Badge>
				</div>
			</div>
		</Card>

		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Cambiar Contrasena</h2>

			{#if passwordError}
				<div class="mb-4"><Alert variant="danger" dismissible>{passwordError}</Alert></div>
			{/if}
			{#if passwordSuccess}
				<div class="mb-4"><Alert variant="success" dismissible>Contrasena actualizada correctamente.</Alert></div>
			{/if}

			<form on:submit|preventDefault={changePassword} class="space-y-4">
				<Input
					label="Contrasena actual"
					type="password"
					bind:value={currentPassword}
					placeholder="Tu contrasena actual"
					icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					required
				/>
				<Input
					label="Nueva contrasena"
					type="password"
					bind:value={newPassword}
					placeholder="Minimo 8 caracteres"
					required
				/>
				<Input
					label="Confirmar nueva contrasena"
					type="password"
					bind:value={confirmPassword}
					placeholder="Repite la nueva contrasena"
					required
				/>
				<Button type="submit" loading={passwordLoading}>Cambiar Contrasena</Button>
			</form>
		</Card>

		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-2">Zona de Peligro</h2>
			<p class="text-sm text-surface-500 mb-4">Acciones irreversibles para tu cuenta.</p>
			<Button variant="danger" size="sm" disabled>Eliminar Cuenta</Button>
			<p class="text-xs text-surface-400 mt-2">Contacta soporte para eliminar tu cuenta y todos tus datos.</p>
		</Card>
	</div>
</div>
