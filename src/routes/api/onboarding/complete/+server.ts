import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { ranch } = await request.json();

	if (!ranch || !ranch.name || ranch.geofence_lat == null || ranch.geofence_lng == null) {
		return json({ message: 'Datos del rancho incompletos.' }, { status: 400 });
	}

	const { data, error } = await locals.supabase
		.from('ranches')
		.insert({
			tenant_id: locals.tenantId,
			name: ranch.name,
			address: ranch.address || null,
			geofence_lat: ranch.geofence_lat,
			geofence_lng: ranch.geofence_lng,
			geofence_radius_meters: ranch.geofence_radius_meters || 500
		})
		.select()
		.single();

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ ranch: data });
};
