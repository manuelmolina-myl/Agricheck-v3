<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { roleLabel, roleBadgeVariant, canInviteUsers } from '$lib/permissions';

	export let data;
	$: members = data.members || [];
	$: ranches = data.ranches || [];
	$: currentUserId = data.currentUserId;
	$: userRole = $page.data.userRole;

	let showInviteForm = false;
	let inviteEmail = '';
	let inviteName = '';
	let inviteRole = 'viewer';
	let inviteRanchId = '';
	let inviteLoading = false;
	let inviteError = '';
	let inviteSuccess = '';
	let tempPassword = '';

	function mapRole(dbRole: string): string {
		return dbRole === 'admin' ? 'tenant_admin' : dbRole;
	}

	const roleOptions = [
		{ value: 'viewer', label: 'Visor' },
		{ value: 'rh', label: 'Recursos Humanos' },
		{ value: 'tenant_admin', label: 'Administrador' },
		{ value: 'encargado', label: 'Encargado' }
	];

	async function inviteUser() {
		if (!inviteEmail || !inviteName || !inviteRole) {
			inviteError = 'Todos los campos son requeridos.';
			return;
		}
		inviteLoading = true;
		inviteError = '';
		inviteSuccess = '';
		tempPassword = '';

		try {
			const response = await fetch('/api/team', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: inviteEmail,
					full_name: inviteName,
					role: inviteRole,
					assigned_ranch_id: inviteRole === 'encargado' ? inviteRanchId || null : null
				})
			});

			const result = await response.json();
			if (!response.ok) {
				inviteError = result.message;
				return;
			}

			tempPassword = result.tempPassword;
			inviteSuccess = `Usuario ${inviteName} creado exitosamente.`;
			members = [...members, result.member];
			inviteEmail = '';
			inviteName = '';
			inviteRole = 'viewer';
			inviteRanchId = '';
		} catch {
			inviteError = 'Error de conexion.';
		} finally {
			inviteLoading = false;
		}
	}

	async function removeMember(id: string, name: string) {
		if (!confirm(`Eliminar a ${name} del equipo?`)) return;
		const response = await fetch(`/api/team/${id}`, { method: 'DELETE' });
		if (response.ok) {
			members = members.filter((m: any) => m.id !== id);
		}
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head><title>Equipo - AgriCheck</title></svelte:head>

<div class="max-w-4xl">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-display-sm font-bold text-surface-900">Equipo</h1>
			<p class="text-surface-500 mt-1">{members.length} miembro{members.length !== 1 ? 's' : ''}</p>
		</div>
		{#if canInviteUsers(userRole)}
			<Button on:click={() => { showInviteForm = !showInviteForm; inviteSuccess = ''; tempPassword = ''; }}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
				Invitar Usuario
			</Button>
		{/if}
	</div>

	{#if showInviteForm}
		<Card>
			<h2 class="text-base font-semibold text-surface-900 mb-4">Invitar Nuevo Usuario</h2>

			{#if inviteError}
				<div class="mb-4"><Alert variant="danger" dismissible>{inviteError}</Alert></div>
			{/if}
			{#if inviteSuccess}
				<div class="mb-4">
					<Alert variant="success">{inviteSuccess}</Alert>
					{#if tempPassword}
						<div class="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-xl">
							<p class="text-sm font-medium text-warning-800 mb-1">Contrasena temporal (compartir con el usuario):</p>
							<code class="text-sm bg-white px-3 py-1.5 rounded-lg border block font-mono select-all">{tempPassword}</code>
							<p class="text-xs text-warning-600 mt-2">El usuario debe cambiar esta contrasena al iniciar sesion.</p>
						</div>
					{/if}
				</div>
			{/if}

			<form on:submit|preventDefault={inviteUser} class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<Input label="Nombre completo" bind:value={inviteName} placeholder="Carlos Ramirez" required />
					<Input label="Correo electronico" type="email" bind:value={inviteEmail} placeholder="carlos@email.com" required />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-surface-700 mb-1.5">Rol</label>
						<select bind:value={inviteRole} class="w-full px-3.5 py-2.5 rounded-xl text-sm border border-surface-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
							{#each roleOptions as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</div>
					{#if inviteRole === 'encargado' && ranches.length > 0}
						<div>
							<label class="block text-sm font-medium text-surface-700 mb-1.5">Rancho asignado</label>
							<select bind:value={inviteRanchId} class="w-full px-3.5 py-2.5 rounded-xl text-sm border border-surface-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
								<option value="">Todos los ranchos</option>
								{#each ranches as ranch}
									<option value={ranch.id}>{ranch.name}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>
				<div class="flex gap-3">
					<Button variant="secondary" on:click={() => (showInviteForm = false)}>Cancelar</Button>
					<Button type="submit" loading={inviteLoading}>Crear Usuario</Button>
				</div>
			</form>
		</Card>
		<div class="my-6" />
	{/if}

	<!-- Team members table -->
	<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-surface-100">
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Usuario</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Rol</th>
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Desde</th>
						{#if canInviteUsers(userRole)}
							<th class="px-5 py-3.5"></th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-50">
					{#each members as member (member.id)}
						<tr class="hover:bg-primary-50/30 transition-colors">
							<td class="px-5 py-3.5">
								<div class="flex items-center gap-3">
									<Avatar name={member.full_name} size="sm" />
									<div>
										<p class="font-medium text-surface-900">{member.full_name}</p>
										<p class="text-xs text-surface-400">{member.email}</p>
									</div>
								</div>
							</td>
							<td class="px-5 py-3.5">
								<Badge variant={roleBadgeVariant(mapRole(member.role))}>{roleLabel(mapRole(member.role))}</Badge>
							</td>
							<td class="px-5 py-3.5 text-surface-500 text-xs">{formatDate(member.created_at)}</td>
							{#if canInviteUsers(userRole)}
								<td class="px-5 py-3.5 text-right">
									{#if member.id !== currentUserId && member.role !== 'owner'}
										<Button variant="ghost" size="xs" on:click={() => removeMember(member.id, member.full_name)}>Eliminar</Button>
									{/if}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
