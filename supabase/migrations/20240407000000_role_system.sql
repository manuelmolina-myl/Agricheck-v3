-- ============================================
-- ROLE SYSTEM MIGRATION
-- ============================================

-- 1. Migrate existing manager roles to admin
UPDATE tenant_users SET role = 'admin' WHERE role = 'manager';

-- 2. Update tenant_users role constraint
ALTER TABLE tenant_users DROP CONSTRAINT IF EXISTS tenant_users_role_check;
ALTER TABLE tenant_users ADD CONSTRAINT tenant_users_role_check
  CHECK (role IN ('owner', 'admin', 'rh', 'encargado', 'viewer'));

-- 3. Add assigned_ranch_id for encargados
ALTER TABLE tenant_users
  ADD COLUMN IF NOT EXISTS assigned_ranch_id UUID REFERENCES ranches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tenant_users_ranch ON tenant_users(tenant_id, assigned_ranch_id);

-- 4. Add checked_in_by fields to attendances
ALTER TABLE attendances
  ADD COLUMN IF NOT EXISTS checked_in_by UUID REFERENCES tenant_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS checked_in_by_name TEXT;
