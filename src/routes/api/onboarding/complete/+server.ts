import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	// Try locals first, fall back to resolving from cookie
	let tenantId = locals.tenantId;

	if (!tenantId) {
		const accessToken = cookies.get('sb-access-token');
		const refreshToken = cookies.get('sb-refresh-token');

		if (!accessToken || !refreshToken) {
			return json({ message: 'No autorizado' }, { status: 401 });
		}

		// Resolve session with service role
		const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
		if (!user) {
			return json({ message: 'Sesion invalida' }, { status: 401 });
		}

		// Find tenant for this user
		const { data: tenantUser } = await supabaseAdmin
			.from('tenant_users')
			.select('tenant_id')
			.eq('auth_user_id', user.id)
			.single();

		if (!tenantUser) {
			return json({ message: 'Usuario sin empresa asignada' }, { status: 400 });
		}

		tenantId = tenantUser.tenant_id;
	}

	const data = await request.json();

	const { error } = await supabaseAdmin
		.from('tenants')
		.update({
			settings: {
				onboarding_completed: true,
				industry: data.industry || null,
				state: data.state || null,
				city: data.city || null,
				total_ranches_estimate: data.total_ranches || 0,
				total_workers_estimate: data.total_workers || 0,
				has_supervisors: data.has_supervisors ?? false,
				main_problem: data.main_problem || null,
				current_method: data.current_method || null
			}
		})
		.eq('id', tenantId);

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ message: 'Onboarding completado' });
};
