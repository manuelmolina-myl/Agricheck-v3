import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: RequestHandler = async ({ request }) => {
	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const formData = await request.formData();
	const photo = formData.get('photo') as File | null;
	const token = formData.get('token') as string;

	if (!token || !photo) {
		return json({ message: 'Token y foto son requeridos' }, { status: 400 });
	}

	// 1. Find worker by registration token
	const { data: worker, error: workerError } = await supabase
		.from('workers')
		.select('id, tenant_id, full_name, registered_at')
		.eq('registration_token', token)
		.single();

	if (workerError || !worker) {
		return json({ message: 'Token invalido o ya usado' }, { status: 404 });
	}

	if (worker.registered_at) {
		return json({ message: 'Este trabajador ya esta registrado' }, { status: 409 });
	}

	// 2. Upload photo to R2
	let photoUrl = '';
	const path = `${worker.tenant_id}/workers/${worker.id}/registration.jpg`;
	const R2_ENDPOINT = process.env.PUBLIC_R2_ENDPOINT;
	const R2_TOKEN = process.env.R2_AUTH_TOKEN;
	const R2_PUBLIC = process.env.PUBLIC_R2_PUBLIC_URL;

	if (R2_ENDPOINT && R2_TOKEN) {
		try {
			const response = await fetch(`${R2_ENDPOINT}/${path}`, {
				method: 'PUT',
				headers: { 'X-Custom-Auth-Key': R2_TOKEN },
				body: photo
			});
			if (response.ok) photoUrl = `${R2_PUBLIC}/${path}`;
		} catch { /* continue */ }
	}

	if (!photoUrl) {
		photoUrl = `placeholder://${path}`;
	}

	// 3. Detect face and store encoding
	let faceEncoding: string | null = null;
	if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		try {
			const { detectFace } = await import('$lib/server/facial');
			const buffer = Buffer.from(await photo.arrayBuffer());
			const result = await detectFace(buffer);
			faceEncoding = result.encoding;
		} catch {
			// Face detection not available — continue without encoding
		}
	}

	// 4. Update worker record
	const { error: updateError } = await supabase
		.from('workers')
		.update({
			registration_photo_url: photoUrl,
			face_encoding: faceEncoding,
			registered_at: new Date().toISOString()
		})
		.eq('id', worker.id);

	if (updateError) {
		return json({ message: updateError.message }, { status: 500 });
	}

	return json({
		message: 'Registro facial exitoso',
		workerId: worker.id,
		workerName: worker.full_name
	});
};
