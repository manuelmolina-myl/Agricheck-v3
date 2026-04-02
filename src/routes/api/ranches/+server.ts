import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const { data, error } = await locals.supabase
		.from('ranches')
		.select('*')
		.eq('tenant_id', locals.tenantId)
		.order('created_at', { ascending: false });

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ ranches: data });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const body = await request.json();
	const { name, lot_number, address, geofence_lat, geofence_lng, geofence_radius_meters, supervisor_name, supervisor_phone } = body;

	if (!name || geofence_lat == null || geofence_lng == null) {
		return json({ message: 'Nombre y coordenadas son requeridos.' }, { status: 400 });
	}

	const { data, error } = await locals.supabase
		.from('ranches')
		.insert({
			tenant_id: locals.tenantId,
			name,
			lot_number: lot_number || null,
			address: address || null,
			geofence_lat,
			geofence_lng,
			geofence_radius_meters: geofence_radius_meters || 500,
			supervisor_name: supervisor_name || null,
			supervisor_phone: supervisor_phone || null
		})
		.select()
		.single();

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ ranch: data }, { status: 201 });
};
