<script lang="ts">
	import { onMount } from 'svelte';

	// Scroll-triggered animation observer
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-scale').forEach((el) => {
			observer.observe(el);
		});

		// Parallax on mouse move for hero
		const hero = document.getElementById('hero');
		if (hero) {
			hero.addEventListener('mousemove', (e) => {
				const rect = hero.getBoundingClientRect();
				const x = (e.clientX - rect.left) / rect.width - 0.5;
				const y = (e.clientY - rect.top) / rect.height - 0.5;
				const layers = hero.querySelectorAll('.parallax-layer');
				layers.forEach((layer, i) => {
					const speed = (i + 1) * 12;
					(layer as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
				});
			});
		}

		return () => observer.disconnect();
	});

	const features = [
		{ icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Verificacion Facial', description: 'Cada check-in requiere una selfie verificada con IA. Imposible falsificar la identidad.', gradient: 'from-primary-500/20 to-emerald-500/20' },
		{ icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', title: 'Geofencing GPS', description: 'El trabajador debe estar fisicamente en el rancho. Verificamos coordenadas en cada registro.', gradient: 'from-accent-500/20 to-amber-500/20' },
		{ icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Tiempo Real', description: 'Dashboard con datos en vivo. Sabe quien esta presente, ausente y cuantas horas trabajaron.', gradient: 'from-earth-500/20 to-orange-500/20' },
		{ icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'PWA Movil', description: 'Los trabajadores usan su celular. Sin apps que instalar, funciona offline.', gradient: 'from-primary-500/20 to-teal-500/20' },
		{ icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Roles y Encargados', description: 'Owner, Admin, RH, Encargado, Visor. Los encargados registran a trabajadores sin celular.', gradient: 'from-violet-500/20 to-purple-500/20' },
		{ icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Reportes & CSV', description: 'Filtra por fecha, rancho o trabajador. Exporta directo para tu nomina.', gradient: 'from-earth-400/20 to-earth-600/20' }
	];

	const stats = [
		{ value: '10-15%', label: 'de nomina perdida por fraude' },
		{ value: '$1.3M', label: 'MXN costo anual promedio' },
		{ value: '100%', label: 'verificacion biometrica' },
		{ value: '30 dias', label: 'prueba gratuita' }
	];

	const steps = [
		{ num: '01', title: 'Registra tu empresa', desc: 'Crea tu cuenta en minutos. Sin tarjeta de credito.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' },
		{ num: '02', title: 'Configura tus ranchos', desc: 'Define ubicaciones y geofences en un mapa interactivo.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
		{ num: '03', title: 'Agrega trabajadores', desc: 'Registra jornaleros con foto facial para verificacion.', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
		{ num: '04', title: 'Listo', desc: 'Cada trabajador hace su propio check-in con selfie y GPS.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
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
			<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
				<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					<path d="M9 12l2 2 4-4" />
				</svg>
			</div>
			<span class="text-lg font-bold text-white">Agri<span class="text-primary-400">Check</span></span>
		</div>
		<div class="hidden md:flex items-center gap-8 text-sm text-white/50">
			<a href="#features" class="hover:text-white transition-colors duration-300">Funciones</a>
			<a href="#how" class="hover:text-white transition-colors duration-300">Proceso</a>
			<a href="#pricing" class="hover:text-white transition-colors duration-300">Precios</a>
		</div>
		<div class="flex items-center gap-3">
			<a href="/login" class="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Iniciar Sesion</a>
			<a href="/signup" class="px-4 py-2 text-sm font-semibold bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white rounded-xl transition-all duration-300 shadow-glow-primary hover:shadow-glow-primary/80">
				Comenzar Gratis
			</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-950">
	<!-- Animated background -->
	<div class="absolute inset-0">
		<div class="parallax-layer absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary-600/6 blur-[100px] animate-pulse-glow" />
		<div class="parallax-layer absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/5 blur-[100px] animate-pulse-glow" style="animation-delay:1.5s" />
		<div class="parallax-layer absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-earth-500/4 blur-[80px] animate-pulse-glow" style="animation-delay:3s" />
		<div class="absolute inset-0 bg-dot-pattern opacity-20" />
	</div>

	<!-- Floating decorative elements -->
	<div class="absolute top-24 right-[15%] w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/10 animate-float-slow parallax-layer" />
	<div class="absolute bottom-32 left-[12%] w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/10 animate-float" style="animation-delay:1s" />
	<div class="absolute top-1/2 right-[8%] w-20 h-20 rounded-3xl bg-earth-500/5 border border-earth-500/5 animate-float-slow parallax-layer" style="animation-delay:2s" />

	<div class="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-24">
		<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm text-primary-300 mb-8 animate-fade-in">
			<span class="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
			Para la agricultura mexicana
		</div>

		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-display-xl font-bold leading-[0.95] tracking-tight mb-6 animate-fade-in-up">
			<span class="text-gradient-hero">
				Elimina los trabajadores fantasma
			</span>
		</h1>

		<p class="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
			Control de asistencia con verificacion facial y geofencing GPS.
			Disenado para el campo mexicano.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
			<a href="/signup" class="group px-8 py-4 text-base font-semibold bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white rounded-2xl shadow-glow-primary transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2">
				Comenzar Gratis
				<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
			</a>
			<a href="#how" class="px-8 py-4 text-base font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/5">
				Ver como funciona
			</a>
		</div>

		<!-- Trust signal -->
		<p class="text-sm text-surface-600 mt-8 animate-fade-in stagger-4">30 dias gratis &middot; Sin tarjeta de credito &middot; Setup en 5 min</p>
	</div>

	<div class="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-surface-950 to-transparent" />
</section>

<!-- Stats -->
<section class="bg-surface-950 py-16 border-y border-white/5">
	<div class="max-w-5xl mx-auto px-6">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each stats as stat, i}
				<div class="text-center scroll-animate" style="transition-delay:{i * 0.1}s">
					<p class="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</p>
					<p class="text-sm text-surface-500">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features -->
<section id="features" class="bg-surface-950 py-28">
	<div class="max-w-6xl mx-auto px-6">
		<div class="text-center mb-16 scroll-animate">
			<p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Funciones</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Todo lo que necesitas para el campo</h2>
			<p class="text-lg text-surface-500 max-w-2xl mx-auto">
				Desde verificacion facial hasta reportes de nomina. Una plataforma completa para la agricultura.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each features as feature, i}
				<div class="card-3d group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.05] transition-all duration-500 scroll-animate" style="transition-delay:{i * 0.08}s">
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br {feature.gradient} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
						<svg class="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d={feature.icon} />
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
					<p class="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- How it works -->
<section id="how" class="bg-surface-950 py-28 border-t border-white/5 relative overflow-hidden">
	<!-- Background accent -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-600/3 blur-[150px]" />

	<div class="max-w-5xl mx-auto px-6 relative z-10">
		<div class="text-center mb-16 scroll-animate">
			<p class="text-sm font-semibold text-accent-400 uppercase tracking-widest mb-3">Proceso</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Listo en minutos, no semanas</h2>
			<p class="text-lg text-surface-500">4 pasos para eliminar el fraude de nomina.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each steps as step, i}
				<div class="relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary-500/20 transition-all duration-500 scroll-animate group" style="transition-delay:{i * 0.1}s">
					<div class="flex items-start gap-4">
						<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
							<svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d={step.icon} /></svg>
						</div>
						<div>
							<p class="text-xs font-bold text-primary-500/60 mb-1">PASO {step.num}</p>
							<h3 class="text-lg font-semibold text-white mb-1">{step.title}</h3>
							<p class="text-sm text-surface-500">{step.desc}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Social proof -->
<section class="bg-surface-950 py-20 border-t border-white/5">
	<div class="max-w-4xl mx-auto px-6">
		<div class="scroll-animate-scale">
			<div class="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-950/80 to-surface-900 border border-primary-800/30 overflow-hidden">
				<div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-600/5 blur-[80px]" />
				<div class="relative z-10">
					<svg class="w-10 h-10 text-accent-500/40 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
					<p class="text-lg md:text-xl text-white/90 font-medium leading-relaxed mb-6">
						En el primer mes redujimos 12% los costos de nomina. Los trabajadores fantasma desaparecieron por completo.
					</p>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-gradient-to-br from-earth-400 to-earth-600 flex items-center justify-center text-white font-bold text-sm">JP</div>
						<div>
							<p class="text-sm font-semibold text-white">Productor en Jalisco</p>
							<p class="text-xs text-surface-500">200 trabajadores, 3 ranchos</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Pricing -->
<section id="pricing" class="bg-surface-950 py-28 border-t border-white/5">
	<div class="max-w-5xl mx-auto px-6">
		<div class="text-center mb-16 scroll-animate">
			<p class="text-sm font-semibold text-accent-400 uppercase tracking-widest mb-3">Precios</p>
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Simple y transparente</h2>
			<p class="text-lg text-surface-500">Comienza gratis. Escala cuando quieras.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-500 scroll-animate card-3d">
				<h3 class="text-lg font-semibold text-white mb-1">Starter</h3>
				<p class="text-sm text-surface-500 mb-4">Productores pequenos</p>
				<p class="text-3xl font-bold text-white mb-1">$8,000 <span class="text-sm font-normal text-surface-500">MXN/mes</span></p>
				<p class="text-xs text-surface-600 mb-6">Hasta 50 trabajadores, 1 rancho</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-300">Comenzar Trial</a>
			</div>

			<div class="p-6 rounded-2xl bg-gradient-to-b from-primary-600/10 to-primary-800/5 border border-primary-500/20 relative scroll-animate card-3d" style="transition-delay:0.1s">
				<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold rounded-full shadow-glow-primary">Popular</div>
				<h3 class="text-lg font-semibold text-white mb-1">Professional</h3>
				<p class="text-sm text-surface-500 mb-4">Operaciones medianas</p>
				<p class="text-3xl font-bold text-white mb-1">$12,000 <span class="text-sm font-normal text-surface-500">MXN/mes</span></p>
				<p class="text-xs text-surface-600 mb-6">Hasta 200 trabajadores, 5 ranchos</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white transition-all duration-300 shadow-glow-primary">Comenzar Trial</a>
			</div>

			<div class="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-500 scroll-animate card-3d" style="transition-delay:0.2s">
				<h3 class="text-lg font-semibold text-white mb-1">Enterprise</h3>
				<p class="text-sm text-surface-500 mb-4">Grandes productores</p>
				<p class="text-3xl font-bold text-white mb-1">$15,000 <span class="text-sm font-normal text-surface-500">MXN/mes</span></p>
				<p class="text-xs text-surface-600 mb-6">Ilimitados trabajadores y ranchos</p>
				<a href="/signup" class="block text-center py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-300">Comenzar Trial</a>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="bg-surface-950 py-28 border-t border-white/5 relative overflow-hidden">
	<div class="absolute inset-0">
		<div class="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full bg-primary-600/5 blur-[120px]" />
		<div class="absolute bottom-0 right-1/3 w-[400px] h-[300px] rounded-full bg-accent-500/5 blur-[100px]" />
	</div>
	<div class="max-w-3xl mx-auto px-6 text-center relative z-10 scroll-animate">
		<h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
			Deja de perder dinero<br />en <span class="text-gradient">nomina fantasma</span>
		</h2>
		<p class="text-lg text-surface-500 mb-10 max-w-xl mx-auto">
			Unete a los productores que ya eliminaron el fraude.
			30 dias gratis, sin compromiso.
		</p>
		<a href="/signup" class="group inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white rounded-2xl shadow-glow-primary transition-all duration-300 hover:scale-[1.03]">
			Crear Cuenta Gratis
			<svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="bg-surface-950 border-t border-white/5 py-12">
	<div class="max-w-6xl mx-auto px-6">
		<div class="flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-2">
				<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
					<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
				</div>
				<span class="text-sm font-bold text-white/50">AgriCheck</span>
			</div>
			<p class="text-sm text-surface-600">Hecho para la agricultura mexicana</p>
			<div class="flex items-center gap-6 text-sm text-surface-600">
				<a href="/login" class="hover:text-white/60 transition-colors duration-300">Login</a>
				<a href="/signup" class="hover:text-white/60 transition-colors duration-300">Registro</a>
			</div>
		</div>
	</div>
</footer>
