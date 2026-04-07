<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';

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
	let verifyProgress = 0;
	let offlineQueue: Array<{ photo: Blob; location: { lat: number; lng: number }; mode: string; timestamp: string }> = [];
	let currentTime = '';

	onMount(async () => {
		// Check if worker is identified
		const workerId = localStorage.getItem('agricheck_worker_id');
		if (!workerId) {
			window.location.href = '/check/login';
			return;
		}

		workerName = localStorage.getItem('agricheck_worker_name') || '';

		updateClock();
		setInterval(updateClock, 1000);

		const stored = localStorage.getItem('agricheck_offline_queue');
		if (stored) offlineQueue = JSON.parse(stored);
		if (offlineQueue.length > 0 && navigator.onLine) await syncOfflineQueue();
		await loadStatus();
		state = 'ready';
	});

	function workerLogout() {
		localStorage.removeItem('agricheck_worker_id');
		localStorage.removeItem('agricheck_worker_name');
		localStorage.removeItem('agricheck_worker_phone');
		window.location.href = '/check/login';
	}

	function updateClock() {
		currentTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}

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
				if (todayEntry && !todayExit) mode = 'exit';
				else if (todayEntry && todayExit) { state = 'done'; message = 'Jornada completada.'; }
			}
		} catch { /* offline */ }
	}

	async function getLocation(): Promise<{ lat: number; lng: number }> {
		return new Promise((resolve, reject) => {
			if (!('geolocation' in navigator)) { reject(new Error('GPS no disponible')); return; }
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
		try { location = await getLocation(); } catch (err) { locationError = (err as Error).message; state = 'ready'; return; }
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
			video.srcObject = stream;
		} catch { errorMessage = 'No se pudo acceder a la camara.'; state = 'error'; }
	}

	async function takePhotoAndSubmit() {
		state = 'submitting';
		verifyProgress = 0;

		const ctx = canvas.getContext('2d')!;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0);
		const stream = video.srcObject as MediaStream;
		stream?.getTracks().forEach((t) => t.stop());

		const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8));

		// Animate progress
		const progressInterval = setInterval(() => { verifyProgress = Math.min(verifyProgress + 2, 90); }, 50);

		if (!navigator.onLine) {
			clearInterval(progressInterval);
			offlineQueue.push({ photo: blob, location: location!, mode, timestamp: new Date().toISOString() });
			localStorage.setItem('agricheck_offline_queue', JSON.stringify(offlineQueue));
			verifyProgress = 100;
			state = 'done';
			message = `${mode === 'entry' ? 'Entrada' : 'Salida'} guardada offline.`;
			return;
		}

		try {
			const formData = new FormData();
			formData.append('photo', blob, 'check.jpg');
			formData.append('lat', String(location!.lat));
			formData.append('lng', String(location!.lng));
			formData.append('mode', mode);
			formData.append('workerId', localStorage.getItem('agricheck_worker_id') || '');
			const response = await fetch('/api/worker/check', { method: 'POST', body: formData });
			clearInterval(progressInterval);
			verifyProgress = 100;
			const data = await response.json();
			if (!response.ok) { errorMessage = data.message || 'Error al registrar'; state = 'error'; return; }
			state = 'done';
			message = `${mode === 'entry' ? 'Entrada' : 'Salida'} registrada.`;
			if (mode === 'entry') todayEntry = new Date().toISOString();
			else todayExit = new Date().toISOString();
		} catch { clearInterval(progressInterval); errorMessage = 'Error de conexion.'; state = 'error'; }
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
			} catch { offlineQueue.push(item); }
		}
		if (offlineQueue.length > 0) localStorage.setItem('agricheck_offline_queue', JSON.stringify(offlineQueue));
	}

	function reset() { state = 'ready'; errorMessage = ''; message = ''; verifyProgress = 0; }

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head>
	<title>Check-in - AgriCheck</title>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-surface-50 to-surface-100 flex flex-col items-center px-4 py-8 safe-area-inset">
	<div class="max-w-sm w-full flex flex-col items-center">
		<!-- Header -->
		<div class="mb-8 text-center animate-fade-in w-full">
			<div class="flex items-center justify-between w-full mb-4">
				<Logo variant="icon" size="md" />
				<button on:click={workerLogout} class="text-xs text-surface-400 hover:text-surface-600 transition-colors flex items-center gap-1">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
					Salir
				</button>
			</div>
			{#if workerName}
				<p class="text-surface-700 font-medium">Hola, {workerName}</p>
			{/if}
			<p class="text-2xl font-bold text-surface-900 tabular-nums mt-1">{currentTime}</p>
		</div>

		<!-- Status bar -->
		{#if todayEntry || todayExit}
			<div class="w-full glass rounded-2xl border border-surface-200/60 p-4 mb-8 animate-fade-in-up">
				<div class="grid grid-cols-2 gap-4">
					<div class="text-center">
						<p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Entrada</p>
						<p class="text-lg font-bold tabular-nums {todayEntry ? 'text-accent-600' : 'text-surface-300'}">
							{todayEntry ? formatTime(todayEntry) : '--:--'}
						</p>
					</div>
					<div class="text-center border-l border-surface-200/60">
						<p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">Salida</p>
						<p class="text-lg font-bold tabular-nums {todayExit ? 'text-accent-600' : 'text-surface-300'}">
							{todayExit ? formatTime(todayExit) : '--:--'}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- States -->
		{#if state === 'loading'}
			<div class="py-16 animate-fade-in">
				<div class="w-16 h-16 rounded-full border-4 border-surface-200 border-t-primary-600 animate-spin mx-auto" />
				<p class="text-surface-500 mt-6 text-sm">Cargando...</p>
			</div>

		{:else if state === 'ready'}
			<div class="flex flex-col items-center animate-scale-in">
				{#if locationError}
					<div class="w-full mb-6 bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-xl text-sm">
						{locationError}
					</div>
				{/if}

				<!-- Big circular button -->
				<button
					on:click={startCapture}
					class="relative w-48 h-48 rounded-full bg-gradient-to-b from-primary-500 to-primary-600 shadow-soft-lg hover:shadow-glow-primary active:scale-95 transition-all duration-300 flex items-center justify-center group"
				>
					<!-- Ping ring -->
					<span class="absolute inset-0 rounded-full bg-primary-400 animate-ping-slow opacity-20" />

					<div class="relative z-10 text-center text-white">
						<svg class="w-12 h-12 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="text-sm font-semibold opacity-90">
							{mode === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
						</span>
					</div>
				</button>

				<!-- GPS indicator -->
				<div class="mt-6 flex items-center gap-2">
					<span class="relative flex h-2.5 w-2.5">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-500"></span>
					</span>
					<span class="text-xs font-medium text-surface-500">GPS listo</span>
				</div>

				{#if offlineQueue.length > 0}
					<div class="mt-4">
						<Badge variant="warning" dot>{offlineQueue.length} pendiente(s)</Badge>
					</div>
				{/if}
			</div>

		{:else if state === 'capturing'}
			<div class="flex flex-col items-center animate-scale-in">
				<p class="text-sm font-medium text-surface-600 mb-4">Mira de frente a la camara</p>

				<!-- Circular camera viewport -->
				<div class="relative w-64 h-64 rounded-full overflow-hidden ring-4 ring-primary-500 shadow-glow-primary mb-4">
					<!-- svelte-ignore a11y-media-has-caption -->
					<video bind:this={video} autoplay playsinline class="w-full h-full object-cover" />
					<canvas bind:this={canvas} class="hidden" />

					<!-- Corner guides -->
					<div class="absolute inset-4 pointer-events-none">
						<div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
						<div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
						<div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
						<div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
					</div>
				</div>

				{#if location}
					<p class="text-xs text-surface-400 mb-6 tabular-nums">
						{location.lat.toFixed(6)}, {location.lng.toFixed(6)}
					</p>
				{/if}

				<!-- Shutter button -->
				<button
					on:click={takePhotoAndSubmit}
					class="w-16 h-16 rounded-full bg-white shadow-soft-lg border-4 border-surface-200 hover:border-primary-300 active:scale-90 transition-all duration-200 flex items-center justify-center"
				>
					<div class="w-10 h-10 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
				</button>
			</div>

		{:else if state === 'submitting'}
			<div class="flex flex-col items-center py-8 animate-fade-in">
				<ProgressRing value={verifyProgress} size={140} strokeWidth={6}>
					<svg class="w-10 h-10 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</ProgressRing>
				<p class="text-surface-600 font-medium mt-6">Verificando identidad...</p>
				<p class="text-xs text-surface-400 mt-1">Comparando rostro y ubicacion</p>
			</div>

		{:else if state === 'done'}
			<div class="flex flex-col items-center py-8 animate-bounce-in">
				<!-- Confetti -->
				<div class="relative">
					{#each Array(8) as _, i}
						<div
							class="absolute w-2 h-2 rounded-full"
							style="
								background: {['#0D3FFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'][i]};
								animation: confetti-{i % 4} 0.8s ease-out forwards;
								top: 50%; left: 50%;
							"
						/>
					{/each}

					<div class="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center">
						<svg class="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>

				<p class="text-lg font-bold text-surface-900 mt-5">{message}</p>
				<p class="text-sm text-surface-500 mt-1">
					{new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
				</p>
			</div>

		{:else if state === 'error'}
			<div class="flex flex-col items-center py-8 animate-shake">
				<div class="w-20 h-20 rounded-full bg-danger-50 flex items-center justify-center mb-5">
					<svg class="w-10 h-10 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<p class="text-lg font-bold text-surface-900 mb-2">{errorMessage}</p>
				<Button on:click={reset} variant="secondary" size="lg">Intentar de Nuevo</Button>
			</div>
		{/if}
	</div>

	<!-- Offline bar -->
	{#if typeof navigator !== 'undefined' && !navigator.onLine}
		<div class="fixed bottom-0 inset-x-0 glass border-t border-warning-200/60 bg-warning-50/80 px-4 py-3 z-50">
			<div class="flex items-center justify-center gap-2 text-sm">
				<svg class="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-2.828-2.828a5 5 0 010-7.072" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6" /></svg>
				<span class="font-medium text-warning-700">Sin conexion</span>
				{#if offlineQueue.length > 0}
					<Badge variant="warning" size="sm">{offlineQueue.length}</Badge>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes confetti-0 { to { transform: translate(-30px, -40px) rotate(90deg); opacity: 0; } }
	@keyframes confetti-1 { to { transform: translate(30px, -35px) rotate(-60deg); opacity: 0; } }
	@keyframes confetti-2 { to { transform: translate(-25px, 30px) rotate(120deg); opacity: 0; } }
	@keyframes confetti-3 { to { transform: translate(35px, 25px) rotate(-90deg); opacity: 0; } }
</style>
