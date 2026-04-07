import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	if (locals.userRole === 'admin') {
		throw redirect(303, '/admin');
	}

	// Check onboarding completion
	if (locals.tenantId && locals.supabase) {
		try {
			const { data: tenant } = await locals.supabase
				.from('tenants')
				.select('settings')
				.eq('id', locals.tenantId)
				.single();

			const settings = (tenant?.settings ?? null) as Record<string, unknown> | null;
			if (!settings || !settings.onboarding_completed) {
				throw redirect(303, '/onboarding');
			}
		} catch (e) {
			// If it's a redirect, re-throw it
			if (e && typeof e === 'object' && 'status' in e && (e as any).status === 303) {
				throw e;
			}
			// Otherwise swallow — allow access if DB query fails
		}
	}

	return {
		session: locals.session,
		tenantId: locals.tenantId,
		userRole: locals.userRole,
		tenantUserId: locals.tenantUserId,
		assignedRanchId: locals.assignedRanchId
	};
};
