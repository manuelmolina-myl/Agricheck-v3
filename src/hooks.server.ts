import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Database } from '$lib/types/database.types';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = null;
	event.locals.tenantId = null;
	event.locals.tenantUserId = null;
	event.locals.assignedRanchId = null;
	event.locals.userRole = null;

	const SUPABASE_URL = publicEnv.PUBLIC_SUPABASE_URL;
	const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
	const ANON_KEY = publicEnv.PUBLIC_SUPABASE_ANON_KEY;
	const dbKey = SERVICE_ROLE_KEY || ANON_KEY;

	if (SUPABASE_URL && dbKey) {
		const supabase = createClient<Database>(SUPABASE_URL, dbKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});

		event.locals.supabase = supabase;

		try {
			const accessToken = event.cookies.get('sb-access-token');
			const refreshToken = event.cookies.get('sb-refresh-token');

			if (accessToken) {
				const {
					data: { user }
				} = await supabase.auth.getUser(accessToken);

				if (user) {
					event.locals.session = {
						user,
						access_token: accessToken,
						refresh_token: refreshToken || ''
					} as any;

					// Check if platform admin
					const { data: admin } = await supabase
						.from('admins')
						.select('id, role')
						.eq('id', user.id)
						.single();

					if (admin) {
						event.locals.userRole = 'admin';
					} else {
						// Query tenant_users — use * to be resilient to missing columns
						const { data: tenantUser } = await supabase
							.from('tenant_users')
							.select('*')
							.eq('auth_user_id', user.id)
							.single();

						if (tenantUser) {
							event.locals.tenantId = tenantUser.tenant_id;
							event.locals.tenantUserId = tenantUser.id;
							event.locals.assignedRanchId =
								(tenantUser as any).assigned_ranch_id || null;

							const mappedRole =
								tenantUser.role === 'admin' ? 'tenant_admin' : tenantUser.role;
							event.locals.userRole = mappedRole as App.Locals['userRole'];
						}
					}
				}
			}
		} catch {
			// Auth resolution failed — continue without session
			// locals.supabase is still available for page loads
		}
	}

	const { pathname } = event.url;

	if (pathname.startsWith('/admin')) {
		if (!event.locals.session) throw redirect(303, '/login');
		if (event.locals.userRole !== 'admin') throw redirect(303, '/dashboard');
	}

	if (pathname.startsWith('/check-supervisor')) {
		if (!event.locals.session) throw redirect(303, '/login');
		if (event.locals.userRole !== 'encargado') throw redirect(303, '/dashboard');
	}

	if (
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/workers') ||
		pathname.startsWith('/ranches') ||
		pathname.startsWith('/reports') ||
		pathname.startsWith('/settings')
	) {
		if (!event.locals.session) throw redirect(303, '/login');
	}

	if (pathname.startsWith('/settings/billing')) {
		if (event.locals.userRole !== 'owner') throw redirect(303, '/dashboard');
	}

	if (pathname.startsWith('/settings/team')) {
		if (event.locals.userRole !== 'owner' && event.locals.userRole !== 'tenant_admin') {
			throw redirect(303, '/dashboard');
		}
	}

	return resolve(event);
};
