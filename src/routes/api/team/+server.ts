import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { canManageTeam, canAssignRole } from '$lib/permissions';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.tenantId) return json({ message: 'No autorizado' }, { status: 401 });

	const { data, error } = await locals.supabase
		.from('tenant_users')
		.select('*, ranches:assigned_ranch_id(name)')
		.eq('tenant_id', locals.tenantId)
		.order('created_at', { ascending: true });

	if (error) return json({ message: error.message }, { status: 500 });
	return json({ members: data });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.tenantId) return json({ message: 'No autorizado' }, { status: 401 });
	if (!canManageTeam(locals.userRole)) return json({ message: 'Sin permisos' }, { status: 403 });

	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ message: 'Server not configured' }, { status: 503 });

	const { email, full_name, role, assigned_ranch_id } = await request.json();

	if (!email || !full_name || !role) {
		return json({ message: 'Email, nombre y rol son requeridos.' }, { status: 400 });
	}

	// Map tenant_admin back to DB 'admin'
	const dbRole = role === 'tenant_admin' ? 'admin' : role;

	if (!canAssignRole(locals.userRole || '', role)) {
		return json({ message: 'No puedes asignar este rol.' }, { status: 403 });
	}

	const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	// Generate temp password
	const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';

	// Create auth user
	const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password: tempPassword,
		email_confirm: true
	});

	if (authError) {
		if (authError.message.includes('already')) {
			return json({ message: 'Ya existe un usuario con este correo.' }, { status: 409 });
		}
		return json({ message: authError.message }, { status: 400 });
	}

	// Create tenant_user
	const { data, error } = await supabaseAdmin
		.from('tenant_users')
		.insert({
			tenant_id: locals.tenantId,
			email,
			full_name,
			role: dbRole,
			auth_user_id: authData.user.id,
			assigned_ranch_id: assigned_ranch_id || null
		})
		.select()
		.single();

	if (error) {
		await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
		return json({ message: error.message }, { status: 500 });
	}

	return json({ member: data, tempPassword }, { status: 201 });
};
