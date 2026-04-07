import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export function getSupabase() {
	return createClient<Database>(
		publicEnv.PUBLIC_SUPABASE_URL!,
		publicEnv.PUBLIC_SUPABASE_ANON_KEY!
	);
}

export function getSupabaseAdmin() {
	return createClient<Database>(
		publicEnv.PUBLIC_SUPABASE_URL!,
		env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		}
	);
}
