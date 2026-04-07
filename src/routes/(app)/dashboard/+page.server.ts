import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase || !locals.tenantId) {
		return { stats: null, recentCheckins: [], tenant: null };
	}

	const tenantId = locals.tenantId;
	const today = new Date().toISOString().split('T')[0];

	const [
		workersResult,
		ranchesResult,
		todayAttendancesResult,
		recentCheckinsResult,
		tenantResult
	] = await Promise.all([
		locals.supabase
			.from('workers')
			.select('id, status', { count: 'exact' })
			.eq('tenant_id', tenantId)
			.eq('status', 'active'),
		locals.supabase
			.from('ranches')
			.select('id', { count: 'exact' })
			.eq('tenant_id', tenantId)
			.eq('active', true),
		locals.supabase
			.from('attendances')
			.select('id, entry_time, exit_time', { count: 'exact' })
			.eq('tenant_id', tenantId)
			.eq('date', today),
		locals.supabase
			.from('attendances')
			.select('*, workers(full_name, phone)')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(10),
		locals.supabase
			.from('tenants')
			.select('company_name, owner_name, plan, status, trial_ends_at')
			.eq('id', tenantId)
			.single()
	]);

	const activeWorkers = workersResult.count || 0;
	const presentToday = todayAttendancesResult.count || 0;
	const absentToday = Math.max(0, activeWorkers - presentToday);
	const totalRanches = ranchesResult.count || 0;

	return {
		stats: {
			activeWorkers,
			presentToday,
			absentToday,
			totalRanches
		},
		recentCheckins: recentCheckinsResult.data || [],
		tenant: tenantResult.data
	};
};
