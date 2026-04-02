import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

export const supabase = createClient<Database>(
	process.env.PUBLIC_SUPABASE_URL!,
	process.env.PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient<Database>(
	process.env.PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
