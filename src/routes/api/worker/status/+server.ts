import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const GET: RequestHandler = async ({ url }) => {
	const workerId = url.searchParams.get('workerId');

	if (!workerId) {
		return json({ message: 'workerId requerido' }, { status: 400 });
	}

	if (!publicEnv.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const supabase = createClient(publicEnv.PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	// Get worker info
	const { data: worker, error: workerError } = await supabase
		.from('workers')
		.select('id, full_name, ranch_id, status, ranches(geofence_lat, geofence_lng, geofence_radius_meters)')
		.eq('id', workerId)
		.single();

	if (workerError || !worker) {
		return json({ message: 'Trabajador no encontrado' }, { status: 404 });
	}

	if (worker.status !== 'active') {
		return json({ message: 'Trabajador no activo' }, { status: 403 });
	}

	// Get today's attendance
	const today = new Date().toISOString().split('T')[0];
	const { data: attendance } = await supabase
		.from('attendances')
		.select('entry_time, exit_time')
		.eq('worker_id', workerId)
		.eq('date', today)
		.single();

	return json({
		workerName: worker.full_name,
		ranchId: worker.ranch_id,
		geofence: worker.ranches ? {
			lat: (worker.ranches as any).geofence_lat,
			lng: (worker.ranches as any).geofence_lng,
			radiusMeters: (worker.ranches as any).geofence_radius_meters
		} : null,
		entryTime: attendance?.entry_time || null,
		exitTime: attendance?.exit_time || null
	});
};
