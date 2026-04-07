<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import NavItem from '$lib/components/NavItem.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { canManageSettings, canInviteUsers, canViewReports, isEncargado, roleLabel, roleBadgeVariant } from '$lib/permissions';

	let sidebarOpen = false;

	$: userRole = $page.data.userRole as string | null;
	$: pathname = $page.url.pathname;
	$: encargado = isEncargado(userRole);

	const mainNavFull = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/workers', label: 'Trabajadores', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
		{ href: '/ranches', label: 'Ranchos', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
		{ href: '/reports', label: 'Reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
	];

	const encargadoNav = [
		{ href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/check-supervisor', label: 'Check-in Supervisor', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' }
	];

	$: mainNav = encargado ? encargadoNav : mainNavFull;

	$: settingsNav = [
		{ href: '/settings/account', label: 'Cuenta', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', show: true },
		...(canManageSettings(userRole) ? [{ href: '/settings/billing', label: 'Facturacion', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', show: true }] : []),
		...(canInviteUsers(userRole) ? [{ href: '/settings/team', label: 'Equipo', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', show: true }] : [])
	];

	function closeSidebar() { sidebarOpen = false; }
</script>

<div class="min-h-screen bg-surface-50">
	{#if sidebarOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<div class="fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in" on:click={closeSidebar} />
	{/if}

	<aside class="fixed inset-y-0 left-0 w-sidebar bg-white border-r border-surface-100 z-50 flex flex-col
		transition-transform duration-300 ease-out
		{sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
	>
		<div class="px-5 py-6 border-b border-surface-100/60">
			<Logo />
		</div>

		<nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
			<div>
				<p class="px-3 mb-2 text-[11px] font-semibold text-surface-400 uppercase tracking-widest">Principal</p>
				<div class="space-y-0.5">
					{#each mainNav as item}
						<NavItem href={item.href} icon={item.icon} active={pathname.startsWith(item.href)} on:click={closeSidebar}>
							{item.label}
						</NavItem>
					{/each}
				</div>
			</div>

			{#if !encargado}
				<div>
					<p class="px-3 mb-2 text-[11px] font-semibold text-surface-400 uppercase tracking-widest">Configuracion</p>
					<div class="space-y-0.5">
						{#each settingsNav as item}
							<NavItem href={item.href} icon={item.icon} active={pathname.startsWith(item.href)} on:click={closeSidebar}>
								{item.label}
							</NavItem>
						{/each}
					</div>
				</div>
			{/if}
		</nav>

		<div class="px-4 py-4 border-t border-surface-100/60">
			<div class="flex items-center gap-3">
				<Avatar name="Usuario" size="sm" status="online" />
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-surface-900 truncate">Mi Cuenta</p>
					<Badge variant={roleBadgeVariant(userRole)} size="sm">{roleLabel(userRole)}</Badge>
				</div>
				<a href="/api/auth/logout" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors" title="Cerrar sesion">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
				</a>
			</div>
		</div>
	</aside>

	<div class="lg:pl-sidebar">
		<header class="sticky top-0 z-30 glass border-b border-surface-100/60">
			<div class="flex items-center justify-between px-6 h-16">
				<button
					class="lg:hidden p-2 -ml-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors"
					on:click={() => (sidebarOpen = !sidebarOpen)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
				</button>

				<div class="flex items-center gap-3">
					<button class="relative p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
						<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
					</button>
					<Avatar name="Usuario" size="sm" />
				</div>
			</div>
		</header>

		<main class="p-6 lg:p-8 animate-fade-in">
			<slot />
		</main>
	</div>
</div>
