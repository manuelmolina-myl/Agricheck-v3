import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	if (locals.userRole === 'admin') {
		throw redirect(303, '/admin');
	}

	return {
		session: locals.session,
		tenantId: locals.tenantId
	};
};
