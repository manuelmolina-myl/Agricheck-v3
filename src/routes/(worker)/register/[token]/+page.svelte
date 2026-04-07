<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Alert from '$lib/components/Alert.svelte';

	export let data;
	$: workerData = data.worker;
	$: serverError = data.error;

	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let photoTaken = false;
	let loading = false;
	let registered = false;
	let error = '';

	$: token = $page.params.token;
	$: if (workerData?.id) {
		localStorage.setItem('agricheck_worker_id', workerData.id);
	}

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: 640, height: 480 }
			});
			video.srcObject = stream;
		} catch {
			error = 'No se pudo acceder a la cámara.';
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
	}

	function retakePhoto() {
		photoTaken = false;
		startCamera();
	}

	async function register() {
		loading = true;
		error = '';
		try {
			const blob = await new Promise<Blob>((resolve) =>
				canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
			);

			const formData = new FormData();
			formData.append('photo', blob, 'registration.jpg');
			formData.append('token', token);

			const response = await fetch('/api/worker/register', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				error = data.message || 'Error en el registro';
				return;
			}

			registered = true;
		} catch {
			error = 'Error de conexión.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Registro Facial - AgriCheck</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full text-center">
		<h1 class="text-2xl font-bold text-primary-600 mb-2">AgriCheck</h1>
		<p class="text-gray-500 mb-6">Registro Facial</p>

		{#if registered}
			<div class="bg-green-50 border border-green-200 rounded-xl p-8">
				<p class="text-green-700 text-lg font-semibold">Registro exitoso</p>
				<p class="text-green-600 text-sm mt-2">Ya puedes hacer check-in diario.</p>
				<a href="/check" class="inline-block mt-4 text-primary-600 font-medium">Ir a Check-in</a>
			</div>
		{:else}
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
					{error}
				</div>
			{/if}

			<div class="bg-white rounded-xl shadow-sm border p-6">
				<p class="text-sm text-gray-600 mb-4">
					Toma una foto clara de tu rostro mirando de frente.
				</p>

				<div class="relative mx-auto w-64 h-64 rounded-xl overflow-hidden bg-black mb-4">
					<!-- svelte-ignore a11y-media-has-caption -->
					<video
						bind:this={video}
						autoplay
						playsinline
						class="w-full h-full object-cover"
						class:hidden={photoTaken}
					/>
					<canvas
						bind:this={canvas}
						class="w-full h-full object-cover"
						class:hidden={!photoTaken}
					/>
				</div>

				{#if !photoTaken}
					<Button on:click={takePhoto} fullWidth>Tomar Foto</Button>
				{:else}
					<div class="flex gap-3">
						<Button variant="secondary" on:click={retakePhoto}>Repetir</Button>
						<Button on:click={register} fullWidth {loading}>Registrar</Button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<svelte:window on:load={startCamera} />
