<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Button from '$lib/components/Button.svelte';

	const features = [
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Verificacion Facial',
			description: 'Cada check-in requiere una selfie verificada con IA. Imposible falsificar la identidad.',
			gradient: 'from-blue-500/20 to-purple-500/20'
		},
		{
			icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
			title: 'Geofencing GPS',
			description: 'El trabajador debe estar fisicamente en el rancho. Verificamos coordenadas en cada registro.',
			gradient: 'from-emerald-500/20 to-cyan-500/20'
		},
		{
			icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			title: 'Tiempo Real',
			description: 'Dashboard con datos en vivo. Sabe quien esta presente, ausente y cuantas horas trabajaron.',
			gradient: 'from-amber-500/20 to-orange-500/20'
		},
		{
			icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
			title: 'PWA Movil',
			description: 'Los trabajadores usan su celular. Sin apps que instalar, funciona offline.',
			gradient: 'from-pink-500/20 to-rose-500/20'
		},
		{
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
			title: 'Multi-Tenant',
			description: 'Cada empresa tiene su espacio aislado. Roles, permisos y datos completamente separados.',
			gradient: 'from-violet-500/20 to-indigo-500/20'
		},
		{
			icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			title: 'Reportes & Exportacion',
			description: 'Genera reportes por fecha, rancho o trabajador. Exporta a CSV para tu nomina.',
			gradient: 'from-teal-500/20 to-green-500/20'
		}
	];

	const stats = [
		{ value: '10-15%', label: 'de nomina perdida por fraude' },
		{ value: '$1.3M', label: 'MXN costo anual promedio' },
		{ value: '100%', label: 'verificacion biometrica' },
		{ value: '30 dias', label: 'prueba gratuita' }
	];

	const steps = [
		{ num: '01', title: 'Registra tu empresa', desc: 'Crea tu cuenta en minutos. Sin tarjeta de credito.' },
		{ num: '02', title: 'Configura ranchos', desc: 'Define ubicaciones y geofences en un mapa interactivo.' },
		{ num: '03', title: 'Agrega trabajadores', desc: 'Registra jornaleros con foto facial para verificacion.' },
		{ num: '04', title: 'Listo', desc: 'Tus trabajadores hacen check-in diario con selfie + GPS.' }
	];
</script>

<svelte:head>
	<title>AgriCheck — Control de Asistencia Agricola con Verificacion Facial</title>
	<meta name="description" content="Elimina trabajadores fantasma con verificacion facial biometrica y geofencing GPS. SaaS para productores agricolas." />
</svelte:head>

<!-- Navigation -->
<nav class="fixed top-0 inset-x-0 z-50 glass-dark border-b border-white/5">
	<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
				<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			</div>
			<span class="text-lg font-bold text-white">Agri<span class="text-primary-400">Check</span></span>
		</div>
		<div class="hidden md:flex items-center gap-8 text-sm text-white/60">
			<a href="#features" class="hover:text-white transition-colors">Funciones</a>
			<a href="#how" class="hover:text-white transition-colors">Como Funciona</a>
			<a href="#pricing" class="hover:text-white transition-colors">Precios</a>
		</div>
		<div class="flex items-center gap-3">
			<a href="/login" class="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">Iniciar Sesion</a>
			<a href="/signup" class="px-4 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors">
				Comenzar Gratis
			</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-950">
	<!-- Background effects -->
	<div class="absolute inset-0">
		<div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary-600/8 blur-[128px]" />
		<div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/6 blur-[128px]" />
		<div class="absolute inset-0 bg-dot-pattern opacity-30" />
	</div>

	<div class="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20">
		<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8 animate-fade-in">
			<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
			Disponible ahora — 30 dias gratis
		</div>

		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-6 animate-fade-in-up">
			<span class="bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
				Elimina los trabajadores
			</span>
			<br />
			<span class="bg-gradient-to-br from-primary-300 via-primary-400 to-purple-400 bg-clip-text text-transparent">
				fantasma
			</span>
		</h1>

		<p class="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 animate-fade-in-up" style="animation-delay:0.1s">
			Control de asistencia con verificacion facial biometrica y geofencing GPS.
			Cada check-in es real, verificado e irrefutable.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style="animation-delay:0.2s">
			<a href="/signup" class="px-8 py-3.5 text-base font-semibold bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl shadow-glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]">
				Comenzar Gratis
			</a>
			<a href="#how" class="px-8 py-3.5 text-base font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all">
				Ver como funciona
			</a>
		</div>
	</div>

	<!-- Fade to next section -->
	<div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
</section>

<!-- Stats bar -->
<section class="bg-surface-950 border-y border-white/5 py-12">
	<div class="max-w-5xl mx-auto px-6">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each stats as stat, i}
				<div class="text-center animate-fade-in-up" style="animation-delay:{i * 0.05}s">
					<p class="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
					<p class="text-sm text-white/40">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features -->
<section id="features" class="bg-surface-950 py-24">
	<div class="max-w-6xl mx-auto px-6">
		<div class="text-center mb-16">
			<p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Funciones</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Todo lo que necesitas para controlar asistencia</h2>
			<p class="text-lg text-white/40 max-w-2xl mx-auto">
				Desde verificacion facial hasta reportes de nomina. Una plataforma completa.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each features as feature, i}
				<div class="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up" style="animation-delay:{i * 0.05}s">
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br {feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d={feature.icon} />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
					<p class="text-sm text-white/40 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- How it works -->
<section id="how" class="bg-surface-950 py-24 border-t border-white/5">
	<div class="max-w-5xl mx-auto px-6">
		<div class="text-center mb-16">
			<p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Proceso</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Listo en minutos, no semanas</h2>
			<p class="text-lg text-white/40">Configura tu sistema de asistencia en 4 pasos simples.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each steps as step, i}
				<div class="relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 animate-fade-in-up" style="animation-delay:{i * 0.08}s">
					<span class="text-5xl font-bold text-white/[0.04] absolute top-4 right-6">{step.num}</span>
					<div class="relative">
						<h3 class="text-lg font-semibold text-white mb-2">{step.title}</h3>
						<p class="text-sm text-white/40">{step.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing -->
<section id="pricing" class="bg-surface-950 py-24 border-t border-white/5">
	<div class="max-w-5xl mx-auto px-6">
		<div class="text-center mb-16">
			<p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Precios</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Simple y transparente</h2>
			<p class="text-lg text-white/40">Comienza gratis. Escala cuando quieras.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Starter -->
			<div class="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
				<h3 class="text-lg font-semibold text-white mb-1">Starter</h3>
				<p class="text-sm text-white/40 mb-4">Para productores pequenos</p>
				<p class="text-3xl font-bold text-white mb-1">$8,000 <span class="text-sm font-normal text-white/40">MXN/mes</span></p>
				<p class="text-xs text-white/30 mb-6">Hasta 50 trabajadores, 1 rancho</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 hover:border-white/20 transition-colors">
					Comenzar Trial
				</a>
			</div>

			<!-- Professional -->
			<div class="p-6 rounded-2xl bg-gradient-to-b from-primary-600/10 to-primary-600/5 border border-primary-500/20 relative">
				<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded-full">Popular</div>
				<h3 class="text-lg font-semibold text-white mb-1">Professional</h3>
				<p class="text-sm text-white/40 mb-4">Para operaciones medianas</p>
				<p class="text-3xl font-bold text-white mb-1">$12,000 <span class="text-sm font-normal text-white/40">MXN/mes</span></p>
				<p class="text-xs text-white/30 mb-6">Hasta 200 trabajadores, 5 ranchos</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
					Comenzar Trial
				</a>
			</div>

			<!-- Enterprise -->
			<div class="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
				<h3 class="text-lg font-semibold text-white mb-1">Enterprise</h3>
				<p class="text-sm text-white/40 mb-4">Para grandes productores</p>
				<p class="text-3xl font-bold text-white mb-1">$15,000 <span class="text-sm font-normal text-white/40">MXN/mes</span></p>
				<p class="text-xs text-white/30 mb-6">Trabajadores y ranchos ilimitados</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 hover:border-white/20 transition-colors">
					Comenzar Trial
				</a>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="bg-surface-950 py-24 border-t border-white/5">
	<div class="max-w-3xl mx-auto px-6 text-center">
		<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
			Deja de perder dinero en nomina fantasma
		</h2>
		<p class="text-lg text-white/40 mb-8 max-w-xl mx-auto">
			Unete a los productores que ya eliminaron el fraude de asistencia.
			30 dias gratis, sin tarjeta de credito.
		</p>
		<a href="/signup" class="inline-flex px-8 py-3.5 text-base font-semibold bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl shadow-glow-primary transition-all hover:scale-[1.02]">
			Crear Cuenta Gratis
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="bg-surface-950 border-t border-white/5 py-12">
	<div class="max-w-6xl mx-auto px-6">
		<div class="flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-2">
				<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
					<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
				</div>
				<span class="text-sm font-bold text-white/60">AgriCheck</span>
			</div>
			<p class="text-sm text-white/30">Hecho para la agricultura mexicana</p>
			<div class="flex items-center gap-6 text-sm text-white/30">
				<a href="/login" class="hover:text-white/60 transition-colors">Login</a>
				<a href="/signup" class="hover:text-white/60 transition-colors">Registro</a>
			</div>
		</div>
	</div>
</footer>
