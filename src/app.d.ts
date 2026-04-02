import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			session: Session | null;
			tenantId: string | null;
			userRole: 'admin' | 'owner' | 'manager' | 'viewer' | 'worker' | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
