import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ params }) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		return { worker: null, error: 'Server not configured' };
	}

	const supabase = createClient(publicEnv.PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const { data: worker } = await supabase
		.from('workers')
		.select('id, full_name, registered_at, tenant_id')
		.eq('registration_token', params.token)
		.single();

	if (!worker) {
		return { worker: null, error: 'Token invalido' };
	}

	if (worker.registered_at) {
		return { worker, error: 'already_registered' };
	}

	return { worker, error: null };
};
