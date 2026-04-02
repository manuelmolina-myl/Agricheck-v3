-- ============================================
-- AgriCheck V3 - Initial Database Schema
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ADMINS
-- ============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'support', 'billing')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TENANTS (Productores/Clientes)
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacion
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Contacto
  owner_name TEXT NOT NULL,
  owner_email TEXT UNIQUE NOT NULL,
  owner_phone TEXT,

  -- Plan & Status
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'canceled')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  -- Stripe
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,

  -- Limites segun plan
  max_workers INTEGER DEFAULT 50,
  max_ranches INTEGER DEFAULT 1,

  -- Features
  features JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_stripe_customer ON tenants(stripe_customer_id);

-- ============================================
-- TENANT USERS
-- ============================================
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,

  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'manager', 'viewer')),

  -- Supabase Auth reference
  auth_user_id UUID UNIQUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_auth ON tenant_users(auth_user_id);

-- ============================================
-- RANCHES
-- ============================================
CREATE TABLE ranches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,

  name TEXT NOT NULL,
  lot_number TEXT,
  address TEXT,

  -- Geofence (circulo)
  geofence_lat DECIMAL(10, 8) NOT NULL,
  geofence_lng DECIMAL(11, 8) NOT NULL,
  geofence_radius_meters INTEGER DEFAULT 500 CHECK (geofence_radius_meters >= 100 AND geofence_radius_meters <= 5000),

  -- Supervisor
  supervisor_name TEXT,
  supervisor_phone TEXT,

  active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ranches_tenant ON ranches(tenant_id);
CREATE INDEX idx_ranches_active ON ranches(tenant_id, active) WHERE active = true;

-- ============================================
-- WORKERS (Jornaleros)
-- ============================================
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  ranch_id UUID REFERENCES ranches(id) ON DELETE SET NULL,

  -- Identificacion
  phone TEXT NOT NULL,
  full_name TEXT NOT NULL,
  employee_number TEXT,

  -- Facial Recognition (Google Cloud Vision)
  registration_photo_url TEXT NOT NULL,
  face_encoding TEXT, -- JSON con landmarks de Google Vision

  -- PWA Auth
  registration_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  registered_at TIMESTAMPTZ,
  last_checkin_at TIMESTAMPTZ,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, phone)
);

CREATE INDEX idx_workers_tenant ON workers(tenant_id);
CREATE INDEX idx_workers_ranch ON workers(ranch_id) WHERE status = 'active';
CREATE INDEX idx_workers_phone ON workers(phone);
CREATE INDEX idx_workers_token ON workers(registration_token) WHERE registered_at IS NULL;
CREATE INDEX idx_workers_status ON workers(tenant_id, status);

-- ============================================
-- ATTENDANCES (Check-ins diarios)
-- ============================================
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  ranch_id UUID REFERENCES ranches(id) ON DELETE CASCADE NOT NULL,

  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- ENTRADA
  entry_time TIMESTAMPTZ,
  entry_photo_url TEXT,
  entry_location_lat DECIMAL(10, 8),
  entry_location_lng DECIMAL(11, 8),
  entry_distance_meters DECIMAL(10, 2),
  entry_face_confidence DECIMAL(5, 2),
  entry_verified BOOLEAN DEFAULT TRUE,
  entry_notes TEXT,

  -- SALIDA
  exit_time TIMESTAMPTZ,
  exit_photo_url TEXT,
  exit_location_lat DECIMAL(10, 8),
  exit_location_lng DECIMAL(11, 8),
  exit_distance_meters DECIMAL(10, 2),
  exit_face_confidence DECIMAL(5, 2),
  exit_verified BOOLEAN DEFAULT TRUE,
  exit_notes TEXT,

  -- CALCULADO
  total_hours DECIMAL(5, 2),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(worker_id, date)
);

CREATE INDEX idx_attendances_tenant_date ON attendances(tenant_id, date DESC);
CREATE INDEX idx_attendances_worker_date ON attendances(worker_id, date DESC);
CREATE INDEX idx_attendances_ranch_date ON attendances(ranch_id, date DESC);
CREATE INDEX idx_attendances_entry_time ON attendances(entry_time) WHERE entry_time IS NOT NULL;

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Quien
  user_id UUID,
  user_email TEXT,
  user_role TEXT,

  -- Que
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,

  -- Detalles
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant_created ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranches ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tenant Users solo ven su tenant
CREATE POLICY "Users see own tenant" ON tenants
  FOR ALL
  USING (
    id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users see own tenant users" ON tenant_users
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users see own ranches" ON ranches
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users see own workers" ON workers
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users see own attendances" ON attendances
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users see own audit logs" ON audit_logs
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE auth_user_id = auth.uid()
    )
  );

-- Admins ven todo
CREATE POLICY "Admins see all tenants" ON tenants
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins)
  );

CREATE POLICY "Admins see all ranches" ON ranches
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins)
  );

CREATE POLICY "Admins see all workers" ON workers
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins)
  );

CREATE POLICY "Admins see all attendances" ON attendances
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins)
  );

CREATE POLICY "Admins see all audit logs" ON audit_logs
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ranches_updated_at
  BEFORE UPDATE ON ranches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate total hours
CREATE OR REPLACE FUNCTION calculate_total_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.exit_time IS NOT NULL AND NEW.entry_time IS NOT NULL THEN
    NEW.total_hours = ROUND(
      EXTRACT(EPOCH FROM (NEW.exit_time - NEW.entry_time)) / 3600,
      2
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_attendance_hours
  BEFORE INSERT OR UPDATE ON attendances
  FOR EACH ROW
  EXECUTE FUNCTION calculate_total_hours();
