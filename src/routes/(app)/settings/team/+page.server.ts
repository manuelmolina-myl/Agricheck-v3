import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { members: [], ranches: [] };
	}

	const [membersResult, ranchesResult] = await Promise.all([
		locals.supabase
			.from('tenant_users')
			.select('*')
			.eq('tenant_id', locals.tenantId)
			.order('created_at', { ascending: true }),
		locals.supabase
			.from('ranches')
			.select('id, name')
			.eq('tenant_id', locals.tenantId)
			.eq('active', true)
			.order('name')
	]);

	return {
		members: membersResult.data || [],
		ranches: ranchesResult.data || [],
		currentUserId: locals.tenantUserId
	};
};
