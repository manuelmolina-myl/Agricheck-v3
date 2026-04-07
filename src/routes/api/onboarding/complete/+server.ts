import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const data = await request.json();

	// Store onboarding info in tenant settings
	const { error } = await locals.supabase
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
		.eq('id', locals.tenantId);

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ message: 'Onboarding completado' });
};
