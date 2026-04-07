<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let phone = '';
	let loading = false;
	let error = '';

	onMount(() => {
		// If already identified, go to check-in
		const workerId = localStorage.getItem('agricheck_worker_id');
		if (workerId) {
			window.location.href = '/check';
		}
	});

	async function handleLogin() {
		if (!phone || phone.replace(/\D/g, '').length < 10) {
			error = 'Ingresa un numero de telefono valido (minimo 10 digitos).';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/worker/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ phone: phone.trim() })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.message;
				return;
			}

			// Store worker identity
			localStorage.setItem('agricheck_worker_id', data.workerId);
			localStorage.setItem('agricheck_worker_name', data.workerName);
			localStorage.setItem('agricheck_worker_phone', data.phone);

			window.location.href = '/check';
		} catch {
			error = 'Error de conexion. Intenta de nuevo.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Identificarse - AgriCheck</title>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<div class="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4">
	<div class="w-full max-w-sm animate-fade-in-up">
		<div class="text-center mb-8">
			<Logo variant="icon" size="lg" />
			<h1 class="mt-6 text-display-sm font-bold text-surface-900">AgriCheck</h1>
			<p class="text-surface-500 mt-2">Ingresa tu numero de telefono para identificarte.</p>
		</div>

		{#if error}
			<div class="mb-6"><Alert variant="danger" dismissible>{error}</Alert></div>
		{/if}

		<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 p-6">
			<form on:submit|preventDefault={handleLogin} class="space-y-5">
				<Input
					label="Numero de telefono"
					type="tel"
					bind:value={phone}
					placeholder="33 1234 5678"
					icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
					required
				/>

				<Button type="submit" fullWidth size="lg" {loading}>
					Continuar
				</Button>
			</form>
		</div>

		<p class="text-center text-xs text-surface-400 mt-6">
			Usa el numero que tu empresa registro para ti.
		</p>
	</div>
</div>
