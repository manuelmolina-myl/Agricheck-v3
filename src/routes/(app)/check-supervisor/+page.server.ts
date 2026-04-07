import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || locals.userRole !== 'encargado') {
		throw redirect(303, '/dashboard');
	}

	const tenantId = locals.tenantId;
	const today = new Date().toISOString().split('T')[0];

	// Load workers — filter by assigned ranch if set
	let workersQuery = locals.supabase
		.from('workers')
		.select('id, full_name, phone, registration_photo_url, status')
		.eq('tenant_id', tenantId!)
		.eq('status', 'active')
		.order('full_name');

	if (locals.assignedRanchId) {
		workersQuery = workersQuery.eq('ranch_id', locals.assignedRanchId);
	}

	const [workersResult, attendancesResult, ranchResult] = await Promise.all([
		workersQuery,
		locals.supabase
			.from('attendances')
			.select('worker_id, entry_time, exit_time')
			.eq('tenant_id', tenantId!)
			.eq('date', today),
		locals.assignedRanchId
			? locals.supabase.from('ranches').select('name, geofence_lat, geofence_lng, geofence_radius_meters').eq('id', locals.assignedRanchId).single()
			: Promise.resolve({ data: null })
	]);

	// Build attendance map
	const attendanceMap: Record<string, { entry: string | null; exit: string | null }> = {};
	for (const att of attendancesResult.data || []) {
		attendanceMap[att.worker_id] = { entry: att.entry_time, exit: att.exit_time };
	}

	return {
		workers: workersResult.data || [],
		attendanceMap,
		ranch: ranchResult.data,
		tenantUserId: locals.tenantUserId,
		supervisorName: '' // Will be filled from session email
	};
};
