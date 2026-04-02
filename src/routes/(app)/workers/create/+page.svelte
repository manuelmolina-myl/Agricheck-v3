<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Card from '$lib/components/Card.svelte';
	import Alert from '$lib/components/Alert.svelte';

	export let data;
	$: ranches = data.ranches || [];

	let fullName = '';
	let phone = '';
	let ranchId = '';
	let employeeNumber = '';
	let loading = false;
	let error = '';

	// Camera
	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let photoTaken = false;
	let cameraActive = false;
	let photoBlob: Blob | null = null;

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: 640, height: 480 }
			});
			video.srcObject = stream;
			cameraActive = true;
		} catch {
			error = 'No se pudo acceder a la camara.';
		}
	}

	function takePhoto() {
		const ctx = canvas.getContext('2d')!;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0);
		photoTaken = true;
		const stream = video.srcObject as MediaStream;
		stream?.getTracks().forEach((t) => t.stop());
		cameraActive = false;

		canvas.toBlob((b) => { photoBlob = b; }, 'image/jpeg', 0.8);
	}

	function retakePhoto() {
		photoTaken = false;
		photoBlob = null;
		startCamera();
	}

	async function handleSubmit() {
		if (!fullName || !phone) {
			error = 'Nombre y telefono son requeridos.';
			return;
		}
		loading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('full_name', fullName);
			formData.append('phone', phone);
			if (ranchId) formData.append('ranch_id', ranchId);
			if (employeeNumber) formData.append('employee_number', employeeNumber);
			if (photoBlob) formData.append('photo', photoBlob, 'registration.jpg');

			const response = await fetch('/api/workers', { method: 'POST', body: formData });
			const result = await response.json();

			if (!response.ok) {
				error = result.message || 'Error al crear el trabajador.';
				return;
			}

			window.location.href = '/workers';
		} catch {
			error = 'Error de conexion.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Agregar Trabajador - AgriCheck</title></svelte:head>

<div class="max-w-2xl">
	<a href="/workers" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
		Volver a Trabajadores
	</a>

	<h1 class="text-display-sm font-bold text-surface-900 mb-2">Agregar Trabajador</h1>
	<p class="text-surface-500 mb-8">Registra un nuevo jornalero con foto facial.</p>

	{#if error}
		<div class="mb-6"><Alert variant="danger" dismissible>{error}</Alert></div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-8">
		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Informacion Personal</h2>
			<div class="space-y-4">
				<Input label="Nombre completo" bind:value={fullName} placeholder="Juan Perez" required
					icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				<div class="grid grid-cols-2 gap-4">
					<Input label="Telefono" type="tel" bind:value={phone} placeholder="33 1234 5678" required
						icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
					<Input label="No. empleado (opcional)" bind:value={employeeNumber} placeholder="EMP-001" />
				</div>
				{#if ranches.length > 0}
					<div>
						<label class="block text-sm font-medium text-surface-700 mb-1.5">Rancho asignado</label>
						<select
							bind:value={ranchId}
							class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200"
						>
							<option value="">Sin asignar</option>
							{#each ranches as ranch}
								<option value={ranch.id}>{ranch.name}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</Card>

		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Foto de Registro</h2>
			<p class="text-sm text-surface-500 mb-4">La foto se usara para verificacion facial en cada check-in.</p>

			<div class="flex flex-col items-center">
				<div class="relative w-48 h-48 rounded-2xl overflow-hidden bg-surface-100 mb-4">
					{#if !photoTaken && !cameraActive}
						<div class="flex flex-col items-center justify-center h-full text-surface-400">
							<svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span class="text-xs">Sin foto</span>
						</div>
					{/if}
					<!-- svelte-ignore a11y-media-has-caption -->
					<video bind:this={video} autoplay playsinline class="w-full h-full object-cover" class:hidden={!cameraActive || photoTaken} />
					<canvas bind:this={canvas} class="w-full h-full object-cover" class:hidden={!photoTaken} />
				</div>

				{#if !cameraActive && !photoTaken}
					<Button type="button" variant="outline" on:click={startCamera}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
						Activar Camara
					</Button>
				{:else if cameraActive && !photoTaken}
					<Button type="button" on:click={takePhoto}>Tomar Foto</Button>
				{:else}
					<div class="flex gap-2">
						<Button type="button" variant="secondary" size="sm" on:click={retakePhoto}>Repetir</Button>
						<Badge variant="success" dot>Foto capturada</Badge>
					</div>
				{/if}
			</div>
		</Card>

		<div class="flex gap-3">
			<Button variant="secondary" href="/workers">Cancelar</Button>
			<Button type="submit" fullWidth size="lg" {loading}>Agregar Trabajador</Button>
		</div>
	</form>
</div>
