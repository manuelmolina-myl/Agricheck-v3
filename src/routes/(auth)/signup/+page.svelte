<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let companyName = '';
	let ownerName = '';
	let email = '';
	let phone = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let errors: Record<string, string> = {};

	function validate(): boolean {
		errors = {};
		if (!companyName.trim()) errors.companyName = 'Nombre de empresa requerido';
		if (!ownerName.trim()) errors.ownerName = 'Nombre completo requerido';
		if (!email.trim()) errors.email = 'Correo requerido';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Correo invalido';
		if (!phone.trim()) errors.phone = 'Telefono requerido';
		else if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Minimo 10 digitos';
		if (!password) errors.password = 'Contrasena requerida';
		else if (password.length < 8) errors.password = 'Minimo 8 caracteres';
		if (password !== confirmPassword) errors.confirmPassword = 'Las contrasenas no coinciden';
		return Object.keys(errors).length === 0;
	}

	function generateSlug(name: string): string {
		return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}

	$: passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
	$: strengthColors = ['bg-surface-200', 'bg-danger-500', 'bg-warning-500', 'bg-primary-500', 'bg-accent-500'];
	$: strengthLabels = ['', 'Debil', 'Regular', 'Buena', 'Fuerte'];

	async function handleSignup() {
		if (!validate()) return;
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					companyName: companyName.trim(),
					slug: generateSlug(companyName),
					ownerName: ownerName.trim(),
					email: email.trim().toLowerCase(),
					phone: phone.trim(),
					password
				})
			});
			const data = await response.json();
			if (!response.ok) {
				error = data.message || 'Error al crear la cuenta';
				return;
			}
			window.location.href = '/onboarding';
		} catch {
			error = 'Error de conexion. Intenta de nuevo.';
		} finally {
			loading = false;
		}
	}

	const highlights = [
		'Verificacion facial biometrica',
		'Geofencing GPS por rancho',
		'Dashboard en tiempo real',
		'Reportes de asistencia'
	];
</script>

<svelte:head>
	<title>Crear Cuenta - AgriCheck</title>
</svelte:head>

<div class="min-h-screen flex">
	<!-- Left panel -->
	<div class="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-accent-700 via-primary-600 to-primary-800 relative overflow-hidden">
		<div class="absolute inset-0 bg-dot-pattern" />
		<div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
		<div class="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/5" />

		<div class="relative z-10 flex flex-col justify-between p-12 text-white">
			<div>
				<div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						<path d="M9 12l2 2 4-4" />
					</svg>
				</div>
				<h1 class="text-display-md font-bold text-white mb-4">
					Empieza a controlar<br />tu nomina hoy
				</h1>
				<p class="text-lg text-white/70 mb-8">
					Los productores pierden 10-15% de su nomina por fraude. AgriCheck lo elimina.
				</p>

				<div class="space-y-3">
					{#each highlights as h}
						<div class="flex items-center gap-3">
							<div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
								<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							</div>
							<span class="text-sm text-white/80">{h}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="glass-dark rounded-2xl p-5 border border-white/10">
				<p class="text-sm text-white/90 font-medium mb-1">"Redujimos 12% en costos de nomina el primer mes."</p>
				<p class="text-xs text-white/50">— Productor en Jalisco, 200 trabajadores</p>
			</div>
		</div>
	</div>

	<!-- Right panel -->
	<div class="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50 overflow-y-auto">
		<div class="w-full max-w-md animate-fade-in-up">
			<div class="mb-8">
				<Logo size="lg" />
				<div class="flex items-center gap-3 mt-8">
					<h2 class="text-display-sm font-bold text-surface-900">Crear Cuenta</h2>
					<Badge variant="success" dot>30 dias gratis</Badge>
				</div>
				<p class="mt-2 text-surface-500">Sin tarjeta de credito. Configura en 5 minutos.</p>
			</div>

			{#if error}
				<div class="mb-6">
					<Alert variant="danger" dismissible>{error}</Alert>
				</div>
			{/if}

			<form on:submit|preventDefault={handleSignup} class="space-y-4">
				<Input
					label="Nombre de la empresa / rancho"
					bind:value={companyName}
					placeholder="Rancho San Jose"
					icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					error={errors.companyName}
					required
				/>

				<Input
					label="Nombre completo"
					bind:value={ownerName}
					placeholder="Juan Perez"
					icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					error={errors.ownerName}
					required
				/>

				<Input
					label="Correo electronico"
					type="email"
					bind:value={email}
					placeholder="tu@email.com"
					icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					error={errors.email}
					required
				/>

				<Input
					label="Telefono"
					type="tel"
					bind:value={phone}
					placeholder="33 1234 5678"
					icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
					error={errors.phone}
					required
				/>

				<div>
					<Input
						label="Contrasena"
						type="password"
						bind:value={password}
						placeholder="Minimo 8 caracteres"
						icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						error={errors.password}
						required
					/>
					{#if password.length > 0}
						<div class="flex items-center gap-2 mt-2">
							<div class="flex gap-1 flex-1">
								{#each [1, 2, 3, 4] as i}
									<div class="h-1 flex-1 rounded-full transition-colors duration-300 {passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-surface-200'}" />
								{/each}
							</div>
							<span class="text-xs font-medium {passwordStrength <= 1 ? 'text-danger-500' : passwordStrength === 2 ? 'text-warning-500' : passwordStrength === 3 ? 'text-primary-500' : 'text-accent-500'}">
								{strengthLabels[passwordStrength]}
							</span>
						</div>
					{/if}
				</div>

				<Input
					label="Confirmar contrasena"
					type="password"
					bind:value={confirmPassword}
					placeholder="Repite tu contrasena"
					icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					error={errors.confirmPassword}
					required
				/>

				<div class="pt-2">
					<Button type="submit" fullWidth size="lg" {loading}>Crear Cuenta Gratis</Button>
				</div>
			</form>

			<p class="text-center text-sm text-surface-500 mt-8">
				Ya tienes cuenta?
				<a href="/login" class="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
					Inicia sesion
				</a>
			</p>
		</div>
	</div>
</div>
