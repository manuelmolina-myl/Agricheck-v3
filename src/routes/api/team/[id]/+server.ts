import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canManageTeam, canAssignRole } from '$lib/permissions';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.session || !locals.tenantId) return json({ message: 'No autorizado' }, { status: 401 });
	if (!canManageTeam(locals.userRole)) return json({ message: 'Sin permisos' }, { status: 403 });

	const body = await request.json();
	const updates: Record<string, unknown> = {};

	if (body.role) {
		const dbRole = body.role === 'tenant_admin' ? 'admin' : body.role;
		if (!canAssignRole(locals.userRole || '', body.role)) {
			return json({ message: 'No puedes asignar este rol.' }, { status: 403 });
		}
		updates.role = dbRole;
	}

	if ('assigned_ranch_id' in body) {
		updates.assigned_ranch_id = body.assigned_ranch_id || null;
	}

	const { data, error } = await locals.supabase
		.from('tenant_users')
		.update(updates)
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId)
		.select()
		.single();

	if (error) return json({ message: error.message }, { status: 500 });
	return json({ member: data });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.tenantId) return json({ message: 'No autorizado' }, { status: 401 });
	if (!canManageTeam(locals.userRole)) return json({ message: 'Sin permisos' }, { status: 403 });

	if (params.id === locals.tenantUserId) {
		return json({ message: 'No puedes eliminarte a ti mismo.' }, { status: 400 });
	}

	// Check if it's the last owner
	const { data: target } = await locals.supabase
		.from('tenant_users')
		.select('role')
		.eq('id', params.id)
		.single();

	if (target?.role === 'owner') {
		const { count } = await locals.supabase
			.from('tenant_users')
			.select('id', { count: 'exact', head: true })
			.eq('tenant_id', locals.tenantId)
			.eq('role', 'owner');
		if ((count || 0) <= 1) {
			return json({ message: 'No puedes eliminar al ultimo propietario.' }, { status: 400 });
		}
	}

	const { error } = await locals.supabase
		.from('tenant_users')
		.delete()
		.eq('id', params.id)
		.eq('tenant_id', locals.tenantId);

	if (error) return json({ message: error.message }, { status: 500 });
	return json({ message: 'Miembro eliminado' });
};
