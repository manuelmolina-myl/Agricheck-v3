<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Alert from '$lib/components/Alert.svelte';

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
				error = data.message || 'Error al iniciar sesion';
				return;
			}
			window.location.href = '/dashboard';
		} catch {
			error = 'Error de conexion. Intenta de nuevo.';
		} finally {
			loading = false;
		}
	}

	const features = [
		{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Verificacion facial biometrica' },
		{ icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', text: 'Geofencing GPS en tiempo real' },
		{ icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', text: 'Reportes y analytics detallados' },
		{ icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Seguridad multi-tenant con RLS' }
	];
</script>

<svelte:head>
	<title>Iniciar Sesion - AgriCheck</title>
</svelte:head>

<div class="min-h-screen flex">
	<!-- Left panel - brand -->
	<div class="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 relative overflow-hidden">
		<div class="absolute inset-0 bg-dot-pattern" />

		<!-- Floating decorative cards -->
		<div class="absolute top-20 right-12 w-48 h-32 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 animate-float" />
		<div class="absolute bottom-32 left-12 w-40 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 animate-float" style="animation-delay: 1.5s" />
		<div class="absolute top-1/2 right-32 w-32 h-24 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 animate-float" style="animation-delay: 0.8s" />

		<div class="relative z-10 flex flex-col justify-between p-12 text-white">
			<div>
				<div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						<path d="M9 12l2 2 4-4" />
					</svg>
				</div>
				<h1 class="text-display-md font-bold text-white mb-4">
					Control de asistencia<br />sin trabajadores fantasma
				</h1>
				<p class="text-lg text-white/70 max-w-md">
					Elimina el fraude de nomina con verificacion facial y GPS en tiempo real.
				</p>
			</div>

			<div class="space-y-4">
				{#each features as feature}
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
							<svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
								<path d={feature.icon} />
							</svg>
						</div>
						<span class="text-sm text-white/80">{feature.text}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Right panel - form -->
	<div class="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50">
		<div class="w-full max-w-md animate-fade-in-up">
			<div class="mb-10">
				<Logo size="lg" />
				<h2 class="mt-8 text-display-sm font-bold text-surface-900">Bienvenido de vuelta</h2>
				<p class="mt-2 text-surface-500">Ingresa tus credenciales para continuar.</p>
			</div>

			{#if error}
				<div class="mb-6">
					<Alert variant="danger" dismissible>{error}</Alert>
				</div>
			{/if}

			<form on:submit|preventDefault={handleLogin} class="space-y-5">
				<Input
					label="Correo electronico"
					type="email"
					bind:value={email}
					placeholder="tu@email.com"
					icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					required
				/>

				<Input
					label="Contrasena"
					type="password"
					bind:value={password}
					placeholder="Ingresa tu contrasena"
					icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					required
				/>

				<Button type="submit" fullWidth size="lg" {loading}>Iniciar Sesion</Button>
			</form>

			<p class="text-center text-sm text-surface-500 mt-8">
				No tienes cuenta?
				<a href="/signup" class="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
					Registrate gratis
				</a>
			</p>
		</div>
	</div>
</div>
