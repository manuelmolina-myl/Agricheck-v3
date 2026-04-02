<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

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
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Correo inválido';
		if (!phone.trim()) errors.phone = 'Teléfono requerido';
		else if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Mínimo 10 dígitos';
		if (!password) errors.password = 'Contraseña requerida';
		else if (password.length < 8) errors.password = 'Mínimo 8 caracteres';
		if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';

		return Object.keys(errors).length === 0;
	}

	function generateSlug(name: string): string {
		return name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

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
			error = 'Error de conexión. Intenta de nuevo.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Crear Cuenta - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-primary-600">AgriCheck</h1>
			<p class="text-gray-500 mt-2">Elimina los trabajadores fantasma</p>
		</div>

		<div class="bg-white rounded-xl shadow-sm border p-8">
			<h2 class="text-xl font-semibold mb-2">Crear Cuenta</h2>
			<p class="text-sm text-gray-500 mb-6">30 días de prueba gratis. Sin tarjeta de crédito.</p>

			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={handleSignup} class="space-y-4">
				<Input
					label="Nombre de la empresa / rancho"
					bind:value={companyName}
					placeholder="Rancho San José"
					error={errors.companyName}
					required
				/>

				<Input
					label="Nombre completo"
					bind:value={ownerName}
					placeholder="Juan Pérez"
					error={errors.ownerName}
					required
				/>

				<Input
					label="Correo electrónico"
					type="email"
					bind:value={email}
					placeholder="tu@email.com"
					error={errors.email}
					required
				/>

				<Input
					label="Teléfono"
					type="tel"
					bind:value={phone}
					placeholder="33 1234 5678"
					error={errors.phone}
					required
				/>

				<Input
					label="Contraseña"
					type="password"
					bind:value={password}
					placeholder="Mínimo 8 caracteres"
					error={errors.password}
					required
				/>

				<Input
					label="Confirmar contraseña"
					type="password"
					bind:value={confirmPassword}
					placeholder="Repite tu contraseña"
					error={errors.confirmPassword}
					required
				/>

				<Button type="submit" fullWidth {loading}>Crear Cuenta Gratis</Button>
			</form>

			<p class="text-center text-sm text-gray-500 mt-6">
				¿Ya tienes cuenta?
				<a href="/login" class="text-primary-600 hover:text-primary-700 font-medium">
					Inicia sesión
				</a>
			</p>
		</div>

		<p class="text-center text-xs text-gray-400 mt-4">
			Al crear tu cuenta aceptas los Términos de Servicio y la Política de Privacidad.
		</p>
	</div>
</div>
