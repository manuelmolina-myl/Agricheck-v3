<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let step = 1;
	let loading = false;

	// Step 1 — Company info
	let industry = 'agricultura';
	let state = '';
	let city = '';

	// Step 2 — Scale
	let totalRanches = '';
	let totalWorkers = '';
	let hasSupervisors = 'si';

	// Step 3 — Goals
	let mainProblem = '';
	let currentMethod = '';

	const industries = [
		{ value: 'agricultura', label: 'Agricultura' },
		{ value: 'ganaderia', label: 'Ganaderia' },
		{ value: 'agroindustria', label: 'Agroindustria' },
		{ value: 'otro', label: 'Otro' }
	];

	const problems = [
		{ value: 'fantasma', label: 'Trabajadores fantasma', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
		{ value: 'buddy', label: 'Buddy punching', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
		{ value: 'control', label: 'Falta de control de horas', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ value: 'nomina', label: 'Errores en nomina', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
	];

	const methods = [
		{ value: 'papel', label: 'Listas en papel' },
		{ value: 'excel', label: 'Excel / hojas de calculo' },
		{ value: 'reloj', label: 'Reloj checador' },
		{ value: 'capataz', label: 'Reporte del capataz' },
		{ value: 'ninguno', label: 'No hay control' }
	];

	async function handleComplete() {
		loading = true;
		try {
			const response = await fetch('/api/onboarding/complete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					industry,
					state,
					city,
					total_ranches: parseInt(totalRanches) || 0,
					total_workers: parseInt(totalWorkers) || 0,
					has_supervisors: hasSupervisors === 'si',
					main_problem: mainProblem,
					current_method: currentMethod
				})
			});
			if (response.ok) window.location.href = '/dashboard';
		} finally {
			loading = false;
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
			<h1 class="mt-8 text-display-sm font-bold text-surface-900">Cuentanos sobre tu empresa</h1>
			<p class="mt-2 text-surface-500">Esto nos ayuda a personalizar tu experiencia.</p>
		</div>

		<!-- Progress bar -->
		<div class="flex items-center gap-2 mb-8 max-w-xs mx-auto">
			{#each [1, 2, 3] as s}
				<div class="flex-1 h-1.5 rounded-full transition-all duration-500 {step >= s ? 'bg-primary-600' : 'bg-surface-200'}" />
			{/each}
		</div>

		<div class="bg-white rounded-3xl shadow-soft-lg border border-surface-100/60 p-8 animate-fade-in">
			{#if step === 1}
				<div class="flex items-center gap-3 mb-6">
					<div class="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">1</div>
					<div>
						<h2 class="text-lg font-semibold text-surface-900">Informacion General</h2>
						<p class="text-xs text-surface-400">Sobre tu empresa</p>
					</div>
				</div>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-surface-700 mb-1.5">Tipo de industria</label>
						<select bind:value={industry} class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
							{#each industries as ind}
								<option value={ind.value}>{ind.label}</option>
							{/each}
						</select>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<Input label="Estado" bind:value={state} placeholder="Jalisco" icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<Input label="Ciudad / Municipio" bind:value={city} placeholder="Guadalajara" />
					</div>
					<div class="pt-2">
						<Button on:click={() => (step = 2)} fullWidth size="lg">Siguiente</Button>
					</div>
				</div>

			{:else if step === 2}
				<div class="flex items-center gap-3 mb-6">
					<div class="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">2</div>
					<div>
						<h2 class="text-lg font-semibold text-surface-900">Escala de Operacion</h2>
						<p class="text-xs text-surface-400">Nos ayuda a configurar tu plan</p>
					</div>
				</div>
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<Input label="Cuantos ranchos/ubicaciones?" type="number" bind:value={totalRanches} placeholder="3" min="1" icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<Input label="Cuantos trabajadores?" type="number" bind:value={totalWorkers} placeholder="100" min="1" icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</div>

					<div>
						<label class="block text-sm font-medium text-surface-700 mb-1.5">Tienes supervisores/encargados en campo?</label>
						<div class="flex gap-3">
							<button
								type="button"
								class="flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all {hasSupervisors === 'si' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'}"
								on:click={() => (hasSupervisors = 'si')}
							>
								Si, tengo encargados
							</button>
							<button
								type="button"
								class="flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all {hasSupervisors === 'no' ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'}"
								on:click={() => (hasSupervisors = 'no')}
							>
								No
							</button>
						</div>
					</div>

					<div class="flex gap-3 pt-2">
						<Button variant="secondary" on:click={() => (step = 1)}>Atras</Button>
						<Button on:click={() => (step = 3)} fullWidth size="lg">Siguiente</Button>
					</div>
				</div>

			{:else}
				<div class="flex items-center gap-3 mb-6">
					<div class="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">3</div>
					<div>
						<h2 class="text-lg font-semibold text-surface-900">Tu Principal Reto</h2>
						<p class="text-xs text-surface-400">Para enfocarnos en lo que importa</p>
					</div>
				</div>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-surface-700 mb-2">Cual es tu principal problema?</label>
						<div class="grid grid-cols-2 gap-3">
							{#each problems as prob}
								<button
									type="button"
									class="flex flex-col items-center gap-2 p-4 rounded-xl text-sm border transition-all {mainProblem === prob.value ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'}"
									on:click={() => (mainProblem = prob.value)}
								>
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d={prob.icon} /></svg>
									<span class="text-xs font-medium text-center">{prob.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-surface-700 mb-1.5">Como controlas la asistencia actualmente?</label>
						<select bind:value={currentMethod} class="w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-900 border border-surface-200 bg-white hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
							<option value="">Selecciona una opcion</option>
							{#each methods as m}
								<option value={m.value}>{m.label}</option>
							{/each}
						</select>
					</div>

					<div class="flex gap-3 pt-2">
						<Button variant="secondary" on:click={() => (step = 2)}>Atras</Button>
						<Button on:click={handleComplete} fullWidth size="lg" {loading}>
							Comenzar a Usar AgriCheck
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<p class="text-center text-xs text-surface-400 mt-6">
			Puedes cambiar esta informacion despues en Configuracion.
		</p>
	</div>
</div>
