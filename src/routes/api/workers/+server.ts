import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canManageWorkers } from '$lib/permissions';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}

	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const ranchId = url.searchParams.get('ranch_id') || '';

	let query = locals.supabase
		.from('workers')
		.select('*, ranches(name)')
		.eq('tenant_id', locals.tenantId)
		.order('created_at', { ascending: false });

	if (status) {
		query = query.eq('status', status);
	}

	if (ranchId) {
		query = query.eq('ranch_id', ranchId);
	}

	if (search) {
		query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
	}

	const { data, error } = await query;

	if (error) {
		return json({ message: error.message }, { status: 500 });
	}

	return json({ workers: data });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.tenantId) {
		return json({ message: 'No autorizado' }, { status: 401 });
	}
	if (!canManageWorkers(locals.userRole)) {
		return json({ message: 'Sin permisos para gestionar trabajadores.' }, { status: 403 });
	}

	const formData = await request.formData();
	const fullName = formData.get('full_name') as string;
	const phone = formData.get('phone') as string;
	const ranchId = formData.get('ranch_id') as string | null;
	const employeeNumber = formData.get('employee_number') as string | null;
	const photo = formData.get('photo') as File | null;

	if (!fullName || !phone) {
		return json({ message: 'Nombre y telefono son requeridos.' }, { status: 400 });
	}

	let registrationPhotoUrl = '';

	// Upload photo to R2 if provided
	if (photo && photo.size > 0) {
		const path = `${locals.tenantId}/workers/${Date.now()}-${phone.replace(/\D/g, '')}.jpg`;

		try {
			const R2_ENDPOINT = process.env.PUBLIC_R2_ENDPOINT;
			const R2_TOKEN = process.env.R2_AUTH_TOKEN;
			const R2_PUBLIC = process.env.PUBLIC_R2_PUBLIC_URL;

			if (R2_ENDPOINT && R2_TOKEN) {
				const response = await fetch(`${R2_ENDPOINT}/${path}`, {
					method: 'PUT',
					headers: { 'X-Custom-Auth-Key': R2_TOKEN },
					body: photo
				});

				if (response.ok) {
					registrationPhotoUrl = `${R2_PUBLIC}/${path}`;
				}
			}

			if (!registrationPhotoUrl) {
				// Fallback: store as placeholder URL
				registrationPhotoUrl = `placeholder://${path}`;
			}
		} catch {
			registrationPhotoUrl = `placeholder://photo-${Date.now()}`;
		}
	} else {
		registrationPhotoUrl = `placeholder://no-photo-${Date.now()}`;
	}

	// Detect face encoding if Google Vision is configured
	let faceEncoding: string | null = null;
	if (photo && photo.size > 0 && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
		try {
			const { detectFace } = await import('$lib/server/facial');
			const buffer = Buffer.from(await photo.arrayBuffer());
			const result = await detectFace(buffer);
			faceEncoding = result.encoding;
		} catch {
			// Face detection not available or failed — continue without it
		}
	}

	const { data, error } = await locals.supabase
		.from('workers')
		.insert({
			tenant_id: locals.tenantId,
			full_name: fullName,
			phone,
			ranch_id: ranchId || null,
			employee_number: employeeNumber || null,
			registration_photo_url: registrationPhotoUrl,
			face_encoding: faceEncoding
		})
		.select('*, ranches(name)')
		.single();

	if (error) {
		if (error.message.includes('duplicate') || error.code === '23505') {
			return json({ message: 'Ya existe un trabajador con este telefono.' }, { status: 409 });
		}
		return json({ message: error.message }, { status: 500 });
	}

	return json({ worker: data }, { status: 201 });
};
