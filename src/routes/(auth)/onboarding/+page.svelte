<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Card from '$lib/components/Card.svelte';

	let step = 1;
	let loading = false;

	let ranchName = '';
	let ranchAddress = '';
	let geofenceLat = '';
	let geofenceLng = '';
	let geofenceRadius = '500';

	async function handleComplete() {
		loading = true;
		try {
			const response = await fetch('/api/onboarding/complete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					ranch: {
						name: ranchName,
						address: ranchAddress,
						geofence_lat: parseFloat(geofenceLat),
						geofence_lng: parseFloat(geofenceLng),
						geofence_radius_meters: parseInt(geofenceRadius)
					}
				})
			});

			if (response.ok) {
				window.location.href = '/dashboard';
			}
		} finally {
			loading = false;
		}
	}

	function getCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				geofenceLat = position.coords.latitude.toFixed(8);
				geofenceLng = position.coords.longitude.toFixed(8);
			});
		}
	}
</script>

<svelte:head>
	<title>Configuración Inicial - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="max-w-lg w-full">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-primary-600">AgriCheck</h1>
			<p class="text-gray-500 mt-2">Configura tu primer rancho</p>
		</div>

		<div class="flex items-center justify-center gap-2 mb-8">
			{#each [1, 2] as s}
				<div
					class="w-3 h-3 rounded-full {step >= s ? 'bg-primary-500' : 'bg-gray-300'}"
				/>
			{/each}
		</div>

		<Card>
			{#if step === 1}
				<h2 class="text-lg font-semibold mb-4">Información del Rancho</h2>
				<div class="space-y-4">
					<Input label="Nombre del rancho" bind:value={ranchName} placeholder="Rancho San José" required />
					<Input label="Dirección" bind:value={ranchAddress} placeholder="Carretera a..." />
					<Button on:click={() => (step = 2)} fullWidth disabled={!ranchName}>
						Siguiente
					</Button>
				</div>
			{:else}
				<h2 class="text-lg font-semibold mb-4">Geofence del Rancho</h2>
				<p class="text-sm text-gray-500 mb-4">
					Define el área donde los trabajadores pueden hacer check-in.
				</p>
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<Input label="Latitud" bind:value={geofenceLat} placeholder="20.12345678" required />
						<Input label="Longitud" bind:value={geofenceLng} placeholder="-103.12345678" required />
					</div>
					<Button variant="secondary" on:click={getCurrentLocation} fullWidth>
						Usar mi ubicación actual
					</Button>
					<Input
						label="Radio (metros)"
						type="number"
						bind:value={geofenceRadius}
						placeholder="500"
						min="100"
						max="5000"
					/>
					<div class="flex gap-3">
						<Button variant="secondary" on:click={() => (step = 1)}>Atrás</Button>
						<Button on:click={handleComplete} fullWidth {loading}>
							Completar Configuración
						</Button>
					</div>
				</div>
			{/if}
		</Card>
	</div>
</div>
