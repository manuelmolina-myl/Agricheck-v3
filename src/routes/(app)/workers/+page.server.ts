import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { workers: [], ranches: [] };
	}

	const [workersResult, ranchesResult] = await Promise.all([
		locals.supabase
			.from('workers')
			.select('*, ranches(name)')
			.eq('tenant_id', locals.tenantId)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('ranches')
			.select('id, name')
			.eq('tenant_id', locals.tenantId)
			.eq('active', true)
			.order('name')
	]);

	return {
		workers: workersResult.data || [],
		ranches: ranchesResult.data || []
	};
};
