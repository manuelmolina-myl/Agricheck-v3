import { createClient } from '@supabase/supabase-js';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Database } from '$lib/types/database.types';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createClient<Database>(
		process.env.PUBLIC_SUPABASE_URL!,
		process.env.PUBLIC_SUPABASE_ANON_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		}
	);

	event.locals.supabase = supabase;
	event.locals.session = null;
	event.locals.tenantId = null;
	event.locals.userRole = null;

	const accessToken = event.cookies.get('sb-access-token');
	const refreshToken = event.cookies.get('sb-refresh-token');

	if (accessToken && refreshToken) {
		const {
			data: { session }
		} = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (session) {
			event.locals.session = session;

			// Check if admin
			const { data: admin } = await supabase
				.from('admins')
				.select('id, role')
				.eq('id', session.user.id)
				.single();

			if (admin) {
				event.locals.userRole = 'admin';
			} else {
				// Check tenant user
				const { data: tenantUser } = await supabase
					.from('tenant_users')
					.select('tenant_id, role')
					.eq('auth_user_id', session.user.id)
					.single();

				if (tenantUser) {
					event.locals.tenantId = tenantUser.tenant_id;
					event.locals.userRole = tenantUser.role as App.Locals['userRole'];
				}
			}
		}
	}

	const { pathname } = event.url;

	// Protect admin routes
	if (pathname.startsWith('/admin')) {
		if (!event.locals.session) {
			throw redirect(303, '/login');
		}
		if (event.locals.userRole !== 'admin') {
			throw redirect(303, '/dashboard');
		}
	}

	// Protect app routes
	if (
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/workers') ||
		pathname.startsWith('/ranches') ||
		pathname.startsWith('/reports') ||
		pathname.startsWith('/settings')
	) {
		if (!event.locals.session) {
			throw redirect(303, '/login');
		}
	}

	// Worker routes are public (token-based auth)

	return resolve(event);
};
