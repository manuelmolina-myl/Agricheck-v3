import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { attendances: [], workers: [], ranches: [], dateRange: { from: '', to: '' } };
	}

	const tenantId = locals.tenantId;

	// Default to current month
	const now = new Date();
	const defaultFrom = url.searchParams.get('from') || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
	const defaultTo = url.searchParams.get('to') || now.toISOString().split('T')[0];
	const ranchFilter = url.searchParams.get('ranch') || '';

	let query = locals.supabase
		.from('attendances')
		.select('*, workers(full_name, phone), ranches(name)')
		.eq('tenant_id', tenantId)
		.gte('date', defaultFrom)
		.lte('date', defaultTo)
		.order('date', { ascending: false });

	if (ranchFilter) {
		query = query.eq('ranch_id', ranchFilter);
	}

	const [attendancesResult, workersResult, ranchesResult] = await Promise.all([
		query,
		locals.supabase
			.from('workers')
			.select('id, full_name')
			.eq('tenant_id', tenantId)
			.eq('status', 'active')
			.order('full_name'),
		locals.supabase
			.from('ranches')
			.select('id, name')
			.eq('tenant_id', tenantId)
			.eq('active', true)
			.order('name')
	]);

	return {
		attendances: attendancesResult.data || [],
		workers: workersResult.data || [],
		ranches: ranchesResult.data || [],
		dateRange: { from: defaultFrom, to: defaultTo },
		ranchFilter
	};
};
