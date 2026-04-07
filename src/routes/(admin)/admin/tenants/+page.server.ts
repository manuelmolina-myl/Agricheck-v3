import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async () => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		return { tenants: [] };
	}

	const supabase = createClient(publicEnv.PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
		auth: { autoRefreshToken: false, persistSession: false }
	});

	const { data } = await supabase
		.from('tenants')
		.select('*, tenant_users(id)')
		.order('created_at', { ascending: false });

	// Get worker counts per tenant
	const tenants = await Promise.all(
		(data || []).map(async (tenant) => {
			const { count } = await supabase
				.from('workers')
				.select('id', { count: 'exact', head: true })
				.eq('tenant_id', tenant.id);
			return { ...tenant, workerCount: count || 0 };
		})
	);

	return { tenants };
};
