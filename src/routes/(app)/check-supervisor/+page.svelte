<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';

	export let data;
	$: workers = data.workers || [];
	$: attendanceMap = data.attendanceMap || {};
	$: ranch = data.ranch;
	$: tenantUserId = data.tenantUserId;

	type State = 'list' | 'capturing' | 'submitting' | 'done' | 'error';
	let state: State = 'list';
	let selectedWorker: any = null;
	let search = '';
	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let location: { lat: number; lng: number } | null = null;
	let message = '';
	let errorMessage = '';
	let verifyProgress = 0;

	$: filteredWorkers = search
		? workers.filter((w: any) => w.full_name.toLowerCase().includes(search.toLowerCase()) || w.phone.includes(search))
		: workers;

	function getStatus(workerId: string): 'not_checked' | 'entry' | 'complete' {
		const att = attendanceMap[workerId];
		if (!att) return 'not_checked';
		if (att.entry && att.exit) return 'complete';
		if (att.entry) return 'entry';
		return 'not_checked';
	}

	function getMode(workerId: string): 'entry' | 'exit' {
		const status = getStatus(workerId);
		return status === 'entry' ? 'exit' : 'entry';
	}

	async function selectWorker(worker: any) {
		selectedWorker = worker;
		const workerStatus = getStatus(worker.id);
		if (workerStatus === 'complete') return;

		state = 'capturing';

		// Get GPS
		try {
			const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
			});
			location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
		} catch {
			errorMessage = 'No se pudo obtener ubicacion GPS.';
			state = 'error';
			return;
		}

		// Start camera
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 640, height: 480 } });
			video.srcObject = stream;
		} catch {
			errorMessage = 'No se pudo acceder a la camara.';
			state = 'error';
		}
	}

	async function takePhotoAndSubmit() {
		if (!selectedWorker || !location) return;
		state = 'submitting';
		verifyProgress = 0;

		const ctx = canvas.getContext('2d')!;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0);
		const stream = video.srcObject as MediaStream;
		stream?.getTracks().forEach((t) => t.stop());

		const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8));

		const progressInterval = setInterval(() => { verifyProgress = Math.min(verifyProgress + 2, 90); }, 50);

		try {
			const mode = getMode(selectedWorker.id);
			const formData = new FormData();
			formData.append('photo', blob, 'check.jpg');
			formData.append('lat', String(location.lat));
			formData.append('lng', String(location.lng));
			formData.append('mode', mode);
			formData.append('workerId', selectedWorker.id);
			formData.append('supervisorId', tenantUserId || '');
			formData.append('supervisorName', 'Encargado');

			const response = await fetch('/api/worker/check', { method: 'POST', body: formData });
			clearInterval(progressInterval);
			verifyProgress = 100;

			const result = await response.json();
			if (!response.ok) {
				errorMessage = result.message || 'Error al registrar';
				state = 'error';
				return;
			}

			message = `${mode === 'entry' ? 'Entrada' : 'Salida'} de ${selectedWorker.full_name} registrada.`;
			state = 'done';

			// Update local attendance map
			if (mode === 'entry') {
				attendanceMap[selectedWorker.id] = { entry: new Date().toISOString(), exit: null };
			} else {
				attendanceMap[selectedWorker.id] = { ...attendanceMap[selectedWorker.id], exit: new Date().toISOString() };
			}
			attendanceMap = attendanceMap;
		} catch {
			clearInterval(progressInterval);
			errorMessage = 'Error de conexion.';
			state = 'error';
		}
	}

	function backToList() {
		state = 'list';
		selectedWorker = null;
		message = '';
		errorMessage = '';
		verifyProgress = 0;
	}

	function formatTime(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head>
	<title>Check-in Supervisor - AgriCheck</title>
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>

{#if state === 'list'}
	<div class="mb-6">
		<h1 class="text-display-sm font-bold text-surface-900">Check-in Supervisor</h1>
		{#if ranch}
			<p class="text-surface-500 mt-1">
				<Badge variant="info" dot>{ranch.name}</Badge>
			</p>
		{:else}
			<p class="text-surface-500 mt-1">Todos los ranchos</p>
		{/if}
	</div>

	<div class="mb-5 max-w-sm">
		<Input placeholder="Buscar trabajador..." bind:value={search} icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredWorkers as worker (worker.id)}
			{@const status = getStatus(worker.id)}
			{@const att = attendanceMap[worker.id]}
			<button
				class="bg-white rounded-2xl shadow-card border border-surface-100/60 p-4 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 {status === 'complete' ? 'opacity-60' : ''}"
				on:click={() => selectWorker(worker)}
				disabled={status === 'complete'}
			>
				<div class="flex items-center gap-3 mb-3">
					<Avatar name={worker.full_name} size="md" src={worker.registration_photo_url?.startsWith('http') ? worker.registration_photo_url : null} />
					<div class="flex-1 min-w-0">
						<p class="font-semibold text-surface-900 truncate">{worker.full_name}</p>
						<p class="text-xs text-surface-400">{worker.phone}</p>
					</div>
					{#if status === 'complete'}
						<Badge variant="success" dot>Completo</Badge>
					{:else if status === 'entry'}
						<Badge variant="warning" dot>En rancho</Badge>
					{:else}
						<Badge variant="neutral">Sin registro</Badge>
					{/if}
				</div>

				{#if att}
					<div class="flex gap-4 text-xs text-surface-500">
						<span>Entrada: {formatTime(att.entry)}</span>
						<span>Salida: {formatTime(att.exit)}</span>
					</div>
				{/if}

				{#if status !== 'complete'}
					<div class="mt-3 pt-3 border-t border-surface-100">
						<span class="text-sm font-medium text-primary-600">
							Registrar {status === 'entry' ? 'salida' : 'entrada'} &rarr;
						</span>
					</div>
				{/if}
			</button>
		{/each}
	</div>

{:else if state === 'capturing'}
	<div class="flex flex-col items-center py-8 animate-scale-in">
		<button on:click={backToList} class="self-start mb-4 text-sm text-surface-500 hover:text-surface-700 flex items-center gap-1">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
			Volver
		</button>

		<p class="text-sm font-medium text-surface-600 mb-2">Tomando foto de:</p>
		<p class="text-lg font-bold text-surface-900 mb-4">{selectedWorker?.full_name}</p>

		<div class="relative w-64 h-64 rounded-2xl overflow-hidden ring-4 ring-primary-500 shadow-glow-primary mb-4">
			<!-- svelte-ignore a11y-media-has-caption -->
			<video bind:this={video} autoplay playsinline class="w-full h-full object-cover" />
			<canvas bind:this={canvas} class="hidden" />
		</div>

		{#if location}
			<p class="text-xs text-surface-400 mb-6 tabular-nums">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
		{/if}

		<button
			on:click={takePhotoAndSubmit}
			class="w-16 h-16 rounded-full bg-white shadow-soft-lg border-4 border-surface-200 hover:border-primary-300 active:scale-90 transition-all flex items-center justify-center"
		>
			<div class="w-10 h-10 rounded-full bg-gradient-to-b from-primary-500 to-primary-600" />
		</button>
	</div>

{:else if state === 'submitting'}
	<div class="flex flex-col items-center py-16 animate-fade-in">
		<ProgressRing value={verifyProgress} size={140} strokeWidth={6}>
			<svg class="w-10 h-10 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		</ProgressRing>
		<p class="text-surface-600 font-medium mt-6">Verificando...</p>
	</div>

{:else if state === 'done'}
	<div class="flex flex-col items-center py-16 animate-bounce-in">
		<div class="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center mb-5">
			<svg class="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<p class="text-lg font-bold text-surface-900 mb-2">{message}</p>
		<Button on:click={backToList} variant="secondary" size="lg">Siguiente Trabajador</Button>
	</div>

{:else if state === 'error'}
	<div class="flex flex-col items-center py-16 animate-shake">
		<div class="w-20 h-20 rounded-full bg-danger-50 flex items-center justify-center mb-5">
			<svg class="w-10 h-10 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<p class="text-lg font-bold text-surface-900 mb-4">{errorMessage}</p>
		<Button on:click={backToList} variant="secondary">Volver a la Lista</Button>
	</div>
{/if}
