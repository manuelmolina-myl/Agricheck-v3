import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export * from './types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Tenant = Tables<'tenants'>;
export type TenantUser = Tables<'tenant_users'>;
export type Ranch = Tables<'ranches'>;
export type Worker = Tables<'workers'>;
export type Attendance = Tables<'attendances'>;
export type AuditLog = Tables<'audit_logs'>;
export type Admin = Tables<'admins'>;

export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseKey: string
) => {
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const createSupabaseAdminClient = (
  supabaseUrl: string,
  serviceRoleKey: string
) => {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
