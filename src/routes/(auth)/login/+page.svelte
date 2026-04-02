<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleLogin() {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.message || 'Error al iniciar sesión';
				return;
			}

			window.location.href = '/dashboard';
		} catch {
			error = 'Error de conexión. Intenta de nuevo.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-primary-600">AgriCheck</h1>
			<p class="text-gray-500 mt-2">Control de asistencia agrícola</p>
		</div>

		<div class="bg-white rounded-xl shadow-sm border p-8">
			<h2 class="text-xl font-semibold mb-6">Iniciar Sesión</h2>

			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={handleLogin} class="space-y-4">
				<Input
					label="Correo electrónico"
					type="email"
					bind:value={email}
					placeholder="tu@email.com"
					required
				/>

				<Input
					label="Contraseña"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					required
				/>

				<Button type="submit" fullWidth {loading}>Iniciar Sesión</Button>
			</form>

			<p class="text-center text-sm text-gray-500 mt-6">
				¿No tienes cuenta?
				<a href="/signup" class="text-primary-600 hover:text-primary-700 font-medium">
					Regístrate gratis
				</a>
			</p>
		</div>
	</div>
</div>
