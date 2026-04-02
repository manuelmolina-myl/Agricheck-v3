<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	type CheckState = 'loading' | 'ready' | 'capturing' | 'submitting' | 'done' | 'error';

	let state: CheckState = 'loading';
	let mode: 'entry' | 'exit' = 'entry';
	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let location: { lat: number; lng: number } | null = null;
	let locationError = '';
	let message = '';
	let errorMessage = '';
	let todayEntry: string | null = null;
	let todayExit: string | null = null;
	let workerName = '';
	let offlineQueue: Array<{ photo: Blob; location: { lat: number; lng: number }; mode: string; timestamp: string }> = [];

	onMount(async () => {
		// Load offline queue
		const stored = localStorage.getItem('agricheck_offline_queue');
		if (stored) offlineQueue = JSON.parse(stored);

		// Try to sync offline queue
		if (offlineQueue.length > 0 && navigator.onLine) {
			await syncOfflineQueue();
		}

		// Load today's status
		await loadStatus();

		state = 'ready';
	});

	async function loadStatus() {
		try {
			const workerId = localStorage.getItem('agricheck_worker_id');
			if (!workerId) return;

			const response = await fetch(`/api/worker/status?workerId=${workerId}`);
			if (response.ok) {
				const data = await response.json();
				workerName = data.workerName || '';
				todayEntry = data.entryTime;
				todayExit = data.exitTime;

				if (todayEntry && !todayExit) {
					mode = 'exit';
				} else if (todayEntry && todayExit) {
					state = 'done';
					message = 'Ya completaste tu jornada de hoy.';
				}
			}
		} catch {
			// Offline - continue with local state
		}
	}

	async function getLocation(): Promise<{ lat: number; lng: number }> {
		return new Promise((resolve, reject) => {
			if (!('geolocation' in navigator)) {
				reject(new Error('GPS no disponible'));
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
				(err) => reject(new Error(`Error GPS: ${err.message}`)),
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		});
	}

	async function startCapture() {
		state = 'capturing';
		locationError = '';

		try {
			// Get GPS first
			location = await getLocation();
		} catch (err) {
			locationError = (err as Error).message;
			state = 'ready';
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: 640, height: 480 }
			});
			video.srcObject = stream;
		} catch {
			errorMessage = 'No se pudo acceder a la cámara.';
			state = 'error';
		}
	}

	async function takePhotoAndSubmit() {
		state = 'submitting';

		const ctx = canvas.getContext('2d')!;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0);

		// Stop camera
		const stream = video.srcObject as MediaStream;
		stream?.getTracks().forEach((t) => t.stop());

		const blob = await new Promise<Blob>((resolve) =>
			canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
		);

		if (!navigator.onLine) {
			// Save to offline queue
			offlineQueue.push({
				photo: blob,
				location: location!,
				mode,
				timestamp: new Date().toISOString()
			});
			localStorage.setItem('agricheck_offline_queue', JSON.stringify(offlineQueue));
			state = 'done';
			message = `${mode === 'entry' ? 'Entrada' : 'Salida'} guardada offline. Se enviará cuando haya conexión.`;
			return;
		}

		try {
			const formData = new FormData();
			formData.append('photo', blob, 'check.jpg');
			formData.append('lat', String(location!.lat));
			formData.append('lng', String(location!.lng));
			formData.append('mode', mode);
			formData.append('workerId', localStorage.getItem('agricheck_worker_id') || '');

			const response = await fetch('/api/worker/check', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();

			if (!response.ok) {
				errorMessage = data.message || 'Error al registrar';
				state = 'error';
				return;
			}

			state = 'done';
			message = `${mode === 'entry' ? 'Entrada' : 'Salida'} registrada correctamente.`;

			if (mode === 'entry') {
				todayEntry = new Date().toISOString();
			} else {
				todayExit = new Date().toISOString();
			}
		} catch {
			errorMessage = 'Error de conexión.';
			state = 'error';
		}
	}

	async function syncOfflineQueue() {
		const queue = [...offlineQueue];
		offlineQueue = [];
		localStorage.removeItem('agricheck_offline_queue');

		for (const item of queue) {
			try {
				const formData = new FormData();
				formData.append('photo', item.photo, 'check.jpg');
				formData.append('lat', String(item.location.lat));
				formData.append('lng', String(item.location.lng));
				formData.append('mode', item.mode);
				formData.append('workerId', localStorage.getItem('agricheck_worker_id') || '');
				formData.append('timestamp', item.timestamp);

				await fetch('/api/worker/check', { method: 'POST', body: formData });
			} catch {
				offlineQueue.push(item);
			}
		}

		if (offlineQueue.length > 0) {
			localStorage.setItem('agricheck_offline_queue', JSON.stringify(offlineQueue));
		}
	}

	function reset() {
		state = 'ready';
		errorMessage = '';
		message = '';
	}

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('es-MX', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Check-in - AgriCheck</title>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
	<div class="max-w-sm w-full text-center">
		<h1 class="text-2xl font-bold text-primary-600 mb-1">AgriCheck</h1>
		{#if workerName}
			<p class="text-gray-600 mb-4">Hola, {workerName}</p>
		{/if}

		<!-- Status bar -->
		{#if todayEntry || todayExit}
			<div class="bg-white rounded-lg border p-3 mb-6 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-500">Entrada:</span>
					<span class="font-medium {todayEntry ? 'text-green-600' : 'text-gray-400'}">
						{todayEntry ? formatTime(todayEntry) : '---'}
					</span>
				</div>
				<div class="flex justify-between mt-1">
					<span class="text-gray-500">Salida:</span>
					<span class="font-medium {todayExit ? 'text-green-600' : 'text-gray-400'}">
						{todayExit ? formatTime(todayExit) : '---'}
					</span>
				</div>
			</div>
		{/if}

		{#if state === 'loading'}
			<div class="py-12">
				<svg class="animate-spin h-8 w-8 mx-auto text-primary-600" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
				<p class="text-gray-500 mt-4">Cargando...</p>
			</div>
		{:else if state === 'ready'}
			{#if locationError}
				<div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm">
					{locationError}
				</div>
			{/if}

			<div class="bg-white rounded-xl shadow-sm border p-8">
				<div class="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
					<svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h2 class="text-lg font-semibold mb-2">
					Registrar {mode === 'entry' ? 'Entrada' : 'Salida'}
				</h2>
				<p class="text-sm text-gray-500 mb-6">
					Se tomará una selfie y tu ubicación GPS.
				</p>
				<Button on:click={startCapture} fullWidth size="lg">
					{mode === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
				</Button>
			</div>

			{#if offlineQueue.length > 0}
				<p class="text-xs text-yellow-600 mt-4">
					{offlineQueue.length} registro(s) pendiente(s) de sincronizar.
				</p>
			{/if}

		{:else if state === 'capturing'}
			<div class="bg-white rounded-xl shadow-sm border p-6">
				<p class="text-sm text-gray-600 mb-4">Mira de frente a la cámara</p>
				<div class="relative mx-auto w-64 h-64 rounded-xl overflow-hidden bg-black mb-4">
					<!-- svelte-ignore a11y-media-has-caption -->
					<video bind:this={video} autoplay playsinline class="w-full h-full object-cover" />
					<canvas bind:this={canvas} class="hidden" />
				</div>
				{#if location}
					<p class="text-xs text-green-600 mb-4">
						GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
					</p>
				{/if}
				<Button on:click={takePhotoAndSubmit} fullWidth size="lg">Tomar Foto</Button>
			</div>

		{:else if state === 'submitting'}
			<div class="bg-white rounded-xl shadow-sm border p-8">
				<svg class="animate-spin h-8 w-8 mx-auto text-primary-600" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
				<p class="text-gray-600 mt-4">Verificando identidad...</p>
			</div>

		{:else if state === 'done'}
			<div class="bg-green-50 border border-green-200 rounded-xl p-8">
				<svg class="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-green-700 font-semibold">{message}</p>
			</div>

		{:else if state === 'error'}
			<div class="bg-red-50 border border-red-200 rounded-xl p-8">
				<svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-red-700 font-semibold mb-4">{errorMessage}</p>
				<Button on:click={reset} variant="secondary">Intentar de Nuevo</Button>
			</div>
		{/if}

		{#if !navigator.onLine}
			<div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
				<p class="text-yellow-700 text-sm font-medium">Sin conexión</p>
				<p class="text-yellow-600 text-xs">Los registros se guardarán y enviarán al reconectarse.</p>
			</div>
		{/if}
	</div>
</div>
