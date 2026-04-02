<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	type CheckState = 'idle' | 'capturing' | 'processing' | 'success' | 'error';

	let state: CheckState = 'idle';
	let videoEl: HTMLVideoElement;
	let canvasEl: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let capturedPhoto: string | null = null;
	let errorMessage = '';

	let location: { lat: number; lng: number } | null = null;
	let locationError = '';
	let gpsLoading = true;

	let todayEntry: string | null = null;
	let todayExit: string | null = null;

	// Check what type of action is needed
	$: actionType = !todayEntry ? 'entry' : !todayExit ? 'exit' : 'done';
	$: actionLabel =
		actionType === 'entry' ? 'Registrar Entrada' : actionType === 'exit' ? 'Registrar Salida' : 'Completado';

	onMount(async () => {
		await startCamera();
		await getLocation();
	});

	onDestroy(() => {
		stopCamera();
	});

	async function startCamera() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: 640, height: 480 }
			});
			if (videoEl) {
				videoEl.srcObject = stream;
			}
		} catch (err) {
			errorMessage = 'No se pudo acceder a la camara. Verifica los permisos.';
			state = 'error';
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	async function getLocation() {
		gpsLoading = true;
		locationError = '';

		if (!navigator.geolocation) {
			locationError = 'GPS no disponible en este dispositivo';
			gpsLoading = false;
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				gpsLoading = false;
			},
			(err) => {
				locationError = 'No se pudo obtener la ubicacion. Activa el GPS.';
				gpsLoading = false;
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	function capturePhoto() {
		if (!videoEl || !canvasEl) return;

		state = 'capturing';
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		canvasEl.width = videoEl.videoWidth;
		canvasEl.height = videoEl.videoHeight;
		ctx.drawImage(videoEl, 0, 0);
		capturedPhoto = canvasEl.toDataURL('image/jpeg', 0.8);
		state = 'idle';
	}

	function retakePhoto() {
		capturedPhoto = null;
		state = 'idle';
	}

	async function submitCheckin() {
		if (!capturedPhoto || !location) return;

		state = 'processing';
		try {
			// TODO: Send to API
			// 1. Upload photo to R2
			// 2. Compare face with registered encoding
			// 3. Verify geofence
			// 4. Create attendance record

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			if (actionType === 'entry') {
				todayEntry = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
			} else {
				todayExit = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
			}

			capturedPhoto = null;
			state = 'success';
			setTimeout(() => {
				state = 'idle';
			}, 3000);
		} catch (err) {
			errorMessage = 'Error al procesar. Intenta de nuevo.';
			state = 'error';
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-blue-600 text-white px-4 py-3">
		<div class="flex items-center justify-between">
			<h1 class="text-lg font-bold">AgriCheck</h1>
			<span class="text-sm text-blue-200">
				{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
			</span>
		</div>
	</header>

	<main class="max-w-lg mx-auto px-4 py-6">
		<!-- Today status -->
		<div class="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
			<h2 class="text-sm font-medium text-gray-500 mb-3">Asistencia de hoy</h2>
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center">
					<p class="text-xs text-gray-400 uppercase">Entrada</p>
					<p class="text-lg font-bold {todayEntry ? 'text-green-600' : 'text-gray-300'}">
						{todayEntry || '--:--'}
					</p>
				</div>
				<div class="text-center">
					<p class="text-xs text-gray-400 uppercase">Salida</p>
					<p class="text-lg font-bold {todayExit ? 'text-green-600' : 'text-gray-300'}">
						{todayExit || '--:--'}
					</p>
				</div>
			</div>
		</div>

		{#if actionType === 'done'}
			<!-- All done -->
			<div class="text-center py-12">
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-gray-900">Asistencia completa</h2>
				<p class="text-gray-500 mt-2">Tu entrada y salida ya fueron registradas hoy.</p>
			</div>
		{:else}
			<!-- GPS Status -->
			<div class="flex items-center gap-2 mb-4 px-1">
				{#if gpsLoading}
					<div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
					<span class="text-sm text-gray-500">Obteniendo ubicacion...</span>
				{:else if location}
					<div class="w-3 h-3 bg-green-500 rounded-full"></div>
					<span class="text-sm text-green-700">GPS activo</span>
				{:else}
					<div class="w-3 h-3 bg-red-500 rounded-full"></div>
					<span class="text-sm text-red-600">{locationError}</span>
					<button on:click={getLocation} class="text-sm text-blue-600 underline ml-auto">Reintentar</button>
				{/if}
			</div>

			<!-- Camera / Photo -->
			<div class="bg-black rounded-xl overflow-hidden mb-6 aspect-[4/3] relative">
				{#if capturedPhoto}
					<img src={capturedPhoto} alt="Foto capturada" class="w-full h-full object-cover" />
				{:else}
					<video bind:this={videoEl} autoplay playsinline muted class="w-full h-full object-cover mirror" />
				{/if}

				{#if state === 'processing'}
					<div class="absolute inset-0 bg-black/60 flex items-center justify-center">
						<div class="text-center text-white">
							<svg
								class="animate-spin h-10 w-10 mx-auto mb-3"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								></path>
							</svg>
							<p class="text-sm">Verificando identidad...</p>
						</div>
					</div>
				{/if}
			</div>

			<canvas bind:this={canvasEl} class="hidden" />

			<!-- Actions -->
			<div class="space-y-3">
				{#if !capturedPhoto}
					<button
						on:click={capturePhoto}
						disabled={!stream || state !== 'idle'}
						class="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Tomar Foto
					</button>
				{:else}
					<button
						on:click={submitCheckin}
						disabled={!location || state === 'processing'}
						class="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{state === 'processing' ? 'Procesando...' : actionLabel}
					</button>
					<button
						on:click={retakePhoto}
						disabled={state === 'processing'}
						class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
					>
						Tomar otra foto
					</button>
				{/if}
			</div>

			<!-- Success message -->
			{#if state === 'success'}
				<div class="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-center">
					<p class="font-medium">
						{actionType === 'exit' ? 'Salida' : 'Entrada'} registrada correctamente
					</p>
				</div>
			{/if}

			<!-- Error message -->
			{#if state === 'error' && errorMessage}
				<div class="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-center">
					<p class="font-medium">{errorMessage}</p>
				</div>
			{/if}
		{/if}
	</main>
</div>

<style>
	.mirror {
		transform: scaleX(-1);
	}
</style>
