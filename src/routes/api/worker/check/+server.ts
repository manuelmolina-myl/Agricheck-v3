import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { isInsideGeofence } from '$lib/server/geofence';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request }) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const supabase = createClient(publicEnv.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const formData = await request.formData();
	const photo = formData.get('photo') as File | null;
	const lat = parseFloat(formData.get('lat') as string);
	const lng = parseFloat(formData.get('lng') as string);
	const mode = formData.get('mode') as string; // 'entry' or 'exit'
	const workerId = formData.get('workerId') as string;
	const timestamp = formData.get('timestamp') as string | null;
	const supervisorId = formData.get('supervisorId') as string | null;
	const supervisorName = formData.get('supervisorName') as string | null;

	if (!workerId || !mode || isNaN(lat) || isNaN(lng)) {
		return json({ message: 'Datos incompletos' }, { status: 400 });
	}

	// 1. Validate worker
	const { data: worker, error: workerError } = await supabase
		.from('workers')
		.select('*, ranches(geofence_lat, geofence_lng, geofence_radius_meters)')
		.eq('id', workerId)
		.single();

	if (workerError || !worker) {
		return json({ message: 'Trabajador no encontrado' }, { status: 404 });
	}

	if (worker.status !== 'active') {
		return json({ message: 'Trabajador no activo' }, { status: 403 });
	}

	// 2. Check geofence
	let distanceMeters = 0;
	let insideGeofence = true;

	if (worker.ranches) {
		const ranch = worker.ranches as any;
		const result = isInsideGeofence(
			{ lat, lng },
			{ center: { lat: parseFloat(ranch.geofence_lat), lng: parseFloat(ranch.geofence_lng) }, radiusMeters: ranch.geofence_radius_meters }
		);
		distanceMeters = result.distance;
		insideGeofence = result.inside;
	}

	if (!insideGeofence) {
		return json({
			message: `Fuera del area permitida. Estas a ${distanceMeters}m del rancho.`,
			distance: distanceMeters
		}, { status: 403 });
	}

	// 3. Upload photo to R2
	let photoUrl = '';
	if (photo && photo.size > 0) {
		const path = `${worker.tenant_id}/checkins/${workerId}/${Date.now()}.jpg`;
		const R2_ENDPOINT = publicEnv.PUBLIC_R2_ENDPOINT;
		const R2_TOKEN = env.R2_AUTH_TOKEN;
		const R2_PUBLIC = publicEnv.PUBLIC_R2_PUBLIC_URL;

		if (R2_ENDPOINT && R2_TOKEN) {
			try {
				const response = await fetch(`${R2_ENDPOINT}/${path}`, {
					method: 'PUT',
					headers: { 'X-Custom-Auth-Key': R2_TOKEN },
					body: photo
				});
				if (response.ok) photoUrl = `${R2_PUBLIC}/${path}`;
			} catch { /* continue without photo URL */ }
		}
	}

	// 4. Compare face (if encoding exists and Google Vision is configured)
	let faceConfidence = 100; // Default to 100 if no face verification available
	let faceVerified = true;

	if (worker.face_encoding && photo && photo.size > 0 && env.GOOGLE_APPLICATION_CREDENTIALS) {
		try {
			const { compareFaces } = await import('$lib/server/facial');
			const buffer = Buffer.from(await photo.arrayBuffer());
			const result = await compareFaces(buffer, worker.face_encoding);
			faceConfidence = result.confidence;
			faceVerified = result.match;
		} catch {
			// Face comparison failed — allow check-in but flag it
			faceConfidence = 0;
			faceVerified = false;
		}
	}

	// 5. Create or update attendance
	const today = new Date().toISOString().split('T')[0];
	const now = timestamp || new Date().toISOString();

	if (mode === 'entry') {
		// Check if already checked in today
		const { data: existing } = await supabase
			.from('attendances')
			.select('id')
			.eq('worker_id', workerId)
			.eq('date', today)
			.single();

		if (existing) {
			return json({ message: 'Ya registraste entrada hoy.' }, { status: 409 });
		}

		const { error: insertError } = await supabase
			.from('attendances')
			.insert({
				tenant_id: worker.tenant_id,
				worker_id: workerId,
				ranch_id: worker.ranch_id,
				date: today,
				entry_time: now,
				entry_photo_url: photoUrl || null,
				entry_location_lat: lat,
				entry_location_lng: lng,
				entry_distance_meters: distanceMeters,
				entry_face_confidence: faceConfidence,
				entry_verified: faceVerified,
				checked_in_by: supervisorId || null,
				checked_in_by_name: supervisorName || null
			});

		if (insertError) {
			return json({ message: insertError.message }, { status: 500 });
		}
	} else {
		// Exit — update existing attendance
		const { data: existing } = await supabase
			.from('attendances')
			.select('id, entry_time')
			.eq('worker_id', workerId)
			.eq('date', today)
			.single();

		if (!existing) {
			return json({ message: 'No hay entrada registrada hoy.' }, { status: 400 });
		}

		const { error: updateError } = await supabase
			.from('attendances')
			.update({
				exit_time: now,
				exit_photo_url: photoUrl || null,
				exit_location_lat: lat,
				exit_location_lng: lng,
				exit_distance_meters: distanceMeters,
				exit_face_confidence: faceConfidence,
				exit_verified: faceVerified
			})
			.eq('id', existing.id);

		if (updateError) {
			return json({ message: updateError.message }, { status: 500 });
		}
	}

	// 6. Update worker last_checkin_at
	await supabase
		.from('workers')
		.update({ last_checkin_at: now })
		.eq('id', workerId);

	return json({
		message: mode === 'entry' ? 'Entrada registrada' : 'Salida registrada',
		faceConfidence,
		faceVerified,
		distance: distanceMeters,
		insideGeofence
	});
};
