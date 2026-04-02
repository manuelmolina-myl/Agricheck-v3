import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { worker: null, attendances: [] };
	}

	const [workerResult, attendancesResult] = await Promise.all([
		locals.supabase
			.from('workers')
			.select('*, ranches(name, id)')
			.eq('id', params.id)
			.eq('tenant_id', locals.tenantId)
			.single(),
		locals.supabase
			.from('attendances')
			.select('*')
			.eq('worker_id', params.id)
			.order('date', { ascending: false })
			.limit(30)
	]);

	return {
		worker: workerResult.data,
		attendances: attendancesResult.data || []
	};
};
