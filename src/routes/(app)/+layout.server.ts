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
		const { data: tenant } = await locals.supabase
			.from('tenants')
			.select('settings')
			.eq('id', locals.tenantId)
			.single();

		const settings = tenant?.settings as Record<string, unknown> | null;
		if (!settings || !settings.onboarding_completed) {
			throw redirect(303, '/onboarding');
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
