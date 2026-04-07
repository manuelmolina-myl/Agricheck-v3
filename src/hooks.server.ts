import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Database } from '$lib/types/database.types';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = null;
	event.locals.tenantId = null;
	event.locals.tenantUserId = null;
	event.locals.assignedRanchId = null;
	event.locals.userRole = null;

	if (SUPABASE_URL && SERVICE_ROLE_KEY) {
		// Always use service role for server-side queries (bypasses RLS)
		const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
			auth: { autoRefreshToken: false, persistSession: false }
		});

		event.locals.supabase = supabase;

		const accessToken = event.cookies.get('sb-access-token');
		const refreshToken = event.cookies.get('sb-refresh-token');

		if (accessToken) {
			// Resolve user from token
			const { data: { user } } = await supabase.auth.getUser(accessToken);

			if (user) {
				// Set a minimal session object for compatibility
				event.locals.session = { user, access_token: accessToken, refresh_token: refreshToken || '' } as any;

				// Check if platform admin
				const { data: admin } = await supabase
					.from('admins')
					.select('id, role')
					.eq('id', user.id)
					.single();

				if (admin) {
					event.locals.userRole = 'admin';
				} else {
					// Check tenant user
					const { data: tenantUser } = await supabase
						.from('tenant_users')
						.select('id, tenant_id, role, assigned_ranch_id')
						.eq('auth_user_id', user.id)
						.single();

					if (tenantUser) {
						event.locals.tenantId = tenantUser.tenant_id;
						event.locals.tenantUserId = tenantUser.id;
						event.locals.assignedRanchId = (tenantUser as any).assigned_ranch_id || null;

						const mappedRole = tenantUser.role === 'admin' ? 'tenant_admin' : tenantUser.role;
						event.locals.userRole = mappedRole as App.Locals['userRole'];
					}
				}
			}
		}
	}

	const { pathname } = event.url;

	// Protect admin routes
	if (pathname.startsWith('/admin')) {
		if (!event.locals.session) throw redirect(303, '/login');
		if (event.locals.userRole !== 'admin') throw redirect(303, '/dashboard');
	}

	// Protect supervisor check-in route
	if (pathname.startsWith('/check-supervisor')) {
		if (!event.locals.session) throw redirect(303, '/login');
		if (event.locals.userRole !== 'encargado') throw redirect(303, '/dashboard');
	}

	// Protect app routes
	if (
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/workers') ||
		pathname.startsWith('/ranches') ||
		pathname.startsWith('/reports') ||
		pathname.startsWith('/settings')
	) {
		if (!event.locals.session) throw redirect(303, '/login');
	}

	// Protect billing settings (owner only)
	if (pathname.startsWith('/settings/billing')) {
		if (event.locals.userRole !== 'owner') throw redirect(303, '/dashboard');
	}

	// Protect team settings (owner + tenant_admin)
	if (pathname.startsWith('/settings/team')) {
		if (event.locals.userRole !== 'owner' && event.locals.userRole !== 'tenant_admin') {
			throw redirect(303, '/dashboard');
		}
	}

	return resolve(event);
};
