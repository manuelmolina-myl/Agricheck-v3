export type TenantRole = 'owner' | 'tenant_admin' | 'rh' | 'encargado' | 'viewer';

const MANAGE_ROLES = ['owner', 'tenant_admin', 'rh'];
const INVITE_ROLES = ['owner', 'tenant_admin'];

export function canManageWorkers(role: string | null): boolean {
	return MANAGE_ROLES.includes(role ?? '');
}

export function canManageRanches(role: string | null): boolean {
	return MANAGE_ROLES.includes(role ?? '');
}

export function canViewReports(role: string | null): boolean {
	return ['owner', 'tenant_admin', 'rh', 'viewer'].includes(role ?? '');
}

export function canManageSettings(role: string | null): boolean {
	return role === 'owner';
}

export function canManageBilling(role: string | null): boolean {
	return role === 'owner';
}

export function canInviteUsers(role: string | null): boolean {
	return INVITE_ROLES.includes(role ?? '');
}

export function canManageTeam(role: string | null): boolean {
	return INVITE_ROLES.includes(role ?? '');
}

export function isEncargado(role: string | null): boolean {
	return role === 'encargado';
}

export function canAssignRole(assignerRole: string, targetRole: string): boolean {
	if (assignerRole === 'owner') return true;
	if (assignerRole === 'tenant_admin') return targetRole !== 'owner';
	return false;
}

export function roleLabel(role: string | null): string {
	switch (role) {
		case 'owner': return 'Propietario';
		case 'tenant_admin': return 'Administrador';
		case 'rh': return 'Recursos Humanos';
		case 'encargado': return 'Encargado';
		case 'viewer': return 'Visor';
		case 'admin': return 'Super Admin';
		default: return 'Usuario';
	}
}

export function roleBadgeVariant(role: string | null): 'primary' | 'info' | 'success' | 'warning' | 'neutral' {
	switch (role) {
		case 'owner': return 'primary';
		case 'tenant_admin': return 'info';
		case 'rh': return 'success';
		case 'encargado': return 'warning';
		case 'viewer': return 'neutral';
		default: return 'neutral';
	}
}
