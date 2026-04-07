import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	if (locals.userRole === 'admin') {
		throw redirect(303, '/admin');
	}

	// Check onboarding completion
	let tenantId = locals.tenantId;

	if (!tenantId && SUPABASE_URL && SERVICE_ROLE_KEY) {
		// Fallback: resolve tenant from cookie (same as onboarding fix)
		const accessToken = cookies.get('sb-access-token');
		if (accessToken) {
			const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
				auth: { autoRefreshToken: false, persistSession: false }
			});
			const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
			if (user) {
				const { data: tenantUser } = await supabaseAdmin
					.from('tenant_users')
					.select('tenant_id')
					.eq('auth_user_id', user.id)
					.single();
				if (tenantUser) tenantId = tenantUser.tenant_id;
			}
		}
	}

	if (tenantId) {
		// Use service role to bypass RLS
		if (SUPABASE_URL && SERVICE_ROLE_KEY) {
			const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
				auth: { autoRefreshToken: false, persistSession: false }
			});
			const { data: tenant } = await supabaseAdmin
				.from('tenants')
				.select('settings')
				.eq('id', tenantId)
				.single();

			const settings = tenant?.settings as Record<string, unknown> | null;
			if (!settings || !settings.onboarding_completed) {
				throw redirect(303, '/onboarding');
			}
		}
	}

	return {
		session: locals.session,
		tenantId: tenantId || locals.tenantId,
		userRole: locals.userRole,
		tenantUserId: locals.tenantUserId,
		assignedRanchId: locals.assignedRanchId
	};
};
