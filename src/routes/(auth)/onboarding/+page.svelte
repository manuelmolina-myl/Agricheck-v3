<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let step = 1;
	let loading = false;
	let ranchName = '';
	let ranchAddress = '';
	let geofenceLat = '';
	let geofenceLng = '';
	let geofenceRadius = '500';
	let gettingLocation = false;

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
			if (response.ok) window.location.href = '/dashboard';
		} finally {
			loading = false;
		}
	}

	function getCurrentLocation() {
		if ('geolocation' in navigator) {
			gettingLocation = true;
			navigator.geolocation.getCurrentPosition(
				(position) => {
					geofenceLat = position.coords.latitude.toFixed(8);
					geofenceLng = position.coords.longitude.toFixed(8);
					gettingLocation = false;
				},
				() => { gettingLocation = false; }
			);
		}
	}
</script>

<svelte:head>
	<title>Configuracion Inicial - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
	<div class="w-full max-w-lg animate-fade-in-up">
		<div class="text-center mb-10">
			<Logo size="lg" />
			<h1 class="mt-8 text-display-sm font-bold text-surface-900">Configura tu primer rancho</h1>
			<p class="mt-2 text-surface-500">Solo toma 2 minutos. Podras agregar mas despues.</p>
		</div>

		<!-- Progress bar -->
		<div class="flex items-center gap-3 mb-8 max-w-xs mx-auto">
			<div class="flex-1 h-1.5 rounded-full bg-primary-600 transition-all duration-500" />
			<div class="flex-1 h-1.5 rounded-full transition-all duration-500 {step >= 2 ? 'bg-primary-600' : 'bg-surface-200'}" />
		</div>

		<div class="bg-white rounded-3xl shadow-soft-lg border border-surface-100/60 p-8 animate-fade-in">
			{#if step === 1}
				<div class="flex items-center gap-3 mb-6">
					<div class="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">1</div>
					<h2 class="text-lg font-semibold text-surface-900">Informacion del Rancho</h2>
				</div>
				<div class="space-y-4">
					<Input
						label="Nombre del rancho"
						bind:value={ranchName}
						placeholder="Rancho San Jose"
						icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						required
					/>
					<Input
						label="Direccion (opcional)"
						bind:value={ranchAddress}
						placeholder="Carretera a..."
						icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
					<div class="pt-2">
						<Button on:click={() => (step = 2)} fullWidth size="lg" disabled={!ranchName}>
							Siguiente
						</Button>
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-3 mb-6">
					<div class="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">2</div>
					<h2 class="text-lg font-semibold text-surface-900">Geofence del Rancho</h2>
				</div>
				<p class="text-sm text-surface-500 mb-5">
					Define el area donde los trabajadores pueden hacer check-in.
				</p>
				<div class="space-y-4">
					<Button variant="outline" on:click={getCurrentLocation} fullWidth loading={gettingLocation}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						Usar mi ubicacion actual
					</Button>
					<div class="grid grid-cols-2 gap-4">
						<Input label="Latitud" bind:value={geofenceLat} placeholder="20.12345678" required />
						<Input label="Longitud" bind:value={geofenceLng} placeholder="-103.12345678" required />
					</div>
					<Input
						label="Radio (metros)"
						type="number"
						bind:value={geofenceRadius}
						placeholder="500"
						min="100"
						max="5000"
						helperText="Entre 100 y 5,000 metros"
					/>
					<div class="flex gap-3 pt-2">
						<Button variant="secondary" on:click={() => (step = 1)}>Atras</Button>
						<Button on:click={handleComplete} fullWidth size="lg" {loading}>
							Completar Configuracion
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
