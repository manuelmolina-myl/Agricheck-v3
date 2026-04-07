import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
	const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
	const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
		return { tenants: [] };
	}

	const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
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
