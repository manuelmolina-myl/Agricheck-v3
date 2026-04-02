<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Card from '$lib/components/Card.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import MapPicker from '$lib/components/MapPicker.svelte';

	let mapLat = 0;
	let mapLng = 0;
	let mapRadius = 500;

	let name = '';
	let lotNumber = '';
	let address = '';
	let geofenceLat = '';
	let geofenceLng = '';
	let geofenceRadius = '500';
	let supervisorName = '';
	let supervisorPhone = '';
	let loading = false;
	let error = '';
	let gettingLocation = false;

	function getCurrentLocation() {
		if ('geolocation' in navigator) {
			gettingLocation = true;
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					geofenceLat = pos.coords.latitude.toFixed(8);
					geofenceLng = pos.coords.longitude.toFixed(8);
					mapLat = pos.coords.latitude;
					mapLng = pos.coords.longitude;
					gettingLocation = false;
				},
				() => { gettingLocation = false; error = 'No se pudo obtener la ubicacion.'; }
			);
		}
	}

	function handleMapLocationChange(e: CustomEvent<{ lat: number; lng: number }>) {
		geofenceLat = e.detail.lat.toFixed(8);
		geofenceLng = e.detail.lng.toFixed(8);
		mapLat = e.detail.lat;
		mapLng = e.detail.lng;
	}

	// Sync map radius with form input
	$: mapRadius = parseInt(geofenceRadius) || 500;

	// Sync map position when user types in lat/lng fields
	$: if (geofenceLat && geofenceLng) {
		const parsedLat = parseFloat(geofenceLat);
		const parsedLng = parseFloat(geofenceLng);
		if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== mapLat && parsedLng !== mapLng) {
			mapLat = parsedLat;
			mapLng = parsedLng;
		}
	}

	async function handleSubmit() {
		if (!name || !geofenceLat || !geofenceLng) {
			error = 'Nombre y coordenadas son requeridos.';
			return;
		}
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/ranches', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					lot_number: lotNumber || null,
					address: address || null,
					geofence_lat: parseFloat(geofenceLat),
					geofence_lng: parseFloat(geofenceLng),
					geofence_radius_meters: parseInt(geofenceRadius),
					supervisor_name: supervisorName || null,
					supervisor_phone: supervisorPhone || null
				})
			});

			const data = await response.json();
			if (!response.ok) {
				error = data.message || 'Error al crear el rancho.';
				return;
			}

			window.location.href = '/ranches';
		} catch {
			error = 'Error de conexion.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Crear Rancho - AgriCheck</title></svelte:head>

<div class="max-w-2xl">
	<a href="/ranches" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
		Volver a Ranchos
	</a>

	<h1 class="text-display-sm font-bold text-surface-900 mb-2">Crear Rancho</h1>
	<p class="text-surface-500 mb-8">Define la ubicacion y geofence del rancho.</p>

	{#if error}
		<div class="mb-6"><Alert variant="danger" dismissible>{error}</Alert></div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-8">
		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Informacion General</h2>
			<div class="space-y-4">
				<Input label="Nombre del rancho" bind:value={name} placeholder="Rancho San Jose" required
					icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
				<div class="grid grid-cols-2 gap-4">
					<Input label="Numero de lote" bind:value={lotNumber} placeholder="A-123" />
					<Input label="Direccion" bind:value={address} placeholder="Carretera a..." />
				</div>
			</div>
		</Card>

		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Geofence</h2>
			<p class="text-sm text-surface-500 mb-4">Area donde los trabajadores pueden registrar asistencia.</p>
			<div class="space-y-4">
				<Button type="button" variant="outline" on:click={getCurrentLocation} fullWidth loading={gettingLocation}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
					Usar mi ubicacion actual
				</Button>

				<!-- Interactive Map -->
				<MapPicker
					bind:lat={mapLat}
					bind:lng={mapLng}
					radius={mapRadius}
					height="350px"
					on:locationChange={handleMapLocationChange}
				/>

				<div class="grid grid-cols-2 gap-4">
					<Input label="Latitud" bind:value={geofenceLat} placeholder="20.12345678" required />
					<Input label="Longitud" bind:value={geofenceLng} placeholder="-103.12345678" required />
				</div>
				<Input label="Radio (metros)" type="number" bind:value={geofenceRadius} placeholder="500" min="100" max="5000" helperText="Entre 100 y 5,000 metros. El circulo azul en el mapa muestra el area." />
			</div>
		</Card>

		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Supervisor (opcional)</h2>
			<div class="grid grid-cols-2 gap-4">
				<Input label="Nombre" bind:value={supervisorName} placeholder="Carlos Ramirez" />
				<Input label="Telefono" bind:value={supervisorPhone} placeholder="33 1234 5678" />
			</div>
		</Card>

		<div class="flex gap-3">
			<Button variant="secondary" href="/ranches">Cancelar</Button>
			<Button type="submit" fullWidth size="lg" {loading}>Crear Rancho</Button>
		</div>
	</form>
</div>
