import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.userRole === 'admin') {
		throw redirect(303, '/admin');
	}

	if (locals.userRole === 'encargado') {
		throw redirect(303, '/check-supervisor');
	}

	if (locals.session) {
		throw redirect(303, '/dashboard');
	}

	throw redirect(303, '/login');
};
