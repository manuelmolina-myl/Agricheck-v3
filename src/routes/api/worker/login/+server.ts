import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request }) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		return json({ message: 'Server not configured' }, { status: 503 });
	}

	const supabase = createClient(publicEnv.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const { phone } = await request.json();

	if (!phone) {
		return json({ message: 'Numero de telefono requerido.' }, { status: 400 });
	}

	// Clean phone: remove spaces, dashes, etc.
	const cleanPhone = phone.replace(/\D/g, '');

	// Search for worker by phone (could match multiple tenants, return first active)
	const { data: workers, error } = await supabase
		.from('workers')
		.select('id, full_name, phone, status, registered_at, tenant_id, ranch_id')
		.eq('status', 'active')
		.or(`phone.eq.${cleanPhone},phone.eq.${phone}`);

	if (error) {
		return json({ message: 'Error al buscar trabajador.' }, { status: 500 });
	}

	if (!workers || workers.length === 0) {
		return json({ message: 'No se encontro un trabajador con este numero.' }, { status: 404 });
	}

	// Return the first active worker found
	const worker = workers[0];

	if (!worker.registered_at) {
		return json({
			message: 'Tu cuenta aun no esta registrada. Pide a tu encargado el link de registro facial.',
			needsRegistration: true,
			workerId: worker.id
		}, { status: 403 });
	}

	return json({
		workerId: worker.id,
		workerName: worker.full_name,
		phone: worker.phone
	});
};
