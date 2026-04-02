import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { ranches: [] };
	}

	const { data } = await locals.supabase
		.from('ranches')
		.select('*')
		.eq('tenant_id', locals.tenantId)
		.order('created_at', { ascending: false });

	return { ranches: data || [] };
};
