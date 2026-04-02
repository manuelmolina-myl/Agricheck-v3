# AgriCheck V3

> SaaS multi-tenant para control de asistencia de trabajadores agricolas con verificacion facial biometrica y geofencing GPS.

## El Problema

Los productores agricolas en Mexico pierden **10-15% de su nomina** debido a:
- **Trabajadores fantasma**: personas que no existen pero aparecen en nomina
- **Buddy punching**: companeros que marcan asistencia por otros
- **Fraude de capataces**: supervisores complices que reportan asistencias falsas

**Costo anual**: $1.3M MXN promedio por productor con 100 trabajadores.

## La Solucion

AgriCheck elimina el fraude mediante:
- **Verificacion facial biometrica** (Google Cloud Vision)
- **Geofencing GPS** (el trabajador debe estar en el rancho)
- **PWA movil** (cada trabajador hace su propio check-in)
- **Dashboard en tiempo real** para productores
- **Multi-tenant SaaS** con self-service signup

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| Framework | SvelteKit (TypeScript) |
| Monorepo | Turborepo |
| Database | Supabase (PostgreSQL + RLS + Auth) |
| Facial Recognition | Google Cloud Vision API |
| Storage | Cloudflare R2 |
| Payments | Stripe |
| Deploy | Vercel |
| Styling | TailwindCSS |

## Estructura del Monorepo

```
agricheck-v3/
├── apps/
│   ├── admin/          # Super Admin Dashboard (localhost:5173)
│   ├── dashboard/      # Tenant Dashboard (localhost:5174)
│   └── worker/         # PWA Worker App (localhost:5175)
├── packages/
│   ├── database/       # Supabase client + types
│   ├── ui/             # Shared Svelte components
│   └── lib/            # Business logic (facial, geofence, billing)
└── supabase/
    └── migrations/     # Database migrations
```

## Setup Rapido

### Prerequisitos

- Node.js 18+
- npm
- Cuenta Supabase
- Cuenta Google Cloud (Vision API)
- Cuenta Stripe

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/agricheck-v3.git
cd agricheck-v3
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Variables requeridas:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `STRIPE_SECRET_KEY`

Ver `.env.example` para la lista completa.

### 4. Aplicar migrations a Supabase

```bash
# Opcion A: Supabase CLI
supabase db push

# Opcion B: Dashboard SQL Editor
# Ejecutar supabase/migrations/20240101000000_initial_schema.sql
```

### 5. Generar tipos TypeScript

```bash
npx supabase gen types typescript --project-id [tu-project-id] > packages/database/src/types.ts
```

### 6. Iniciar desarrollo

```bash
npm run dev
```

Las 3 apps estaran disponibles en:
- **Admin**: http://localhost:5173
- **Dashboard**: http://localhost:5174
- **Worker PWA**: http://localhost:5175

## Scripts Disponibles

```bash
npm run dev        # Inicia todas las apps en modo desarrollo
npm run build      # Build de produccion de todas las apps
npm run lint       # Lint de codigo
npm run clean      # Limpia node_modules y builds
```

## Arquitectura

### Admin App (Super Admin)
- Dashboard global de todos los tenants
- Analytics (MRR, churn, growth)
- Gestion de clientes
- Feature flags
- Billing management

### Dashboard App (Productor/Cliente)
- Self-service signup con trial 30 dias
- Dashboard de asistencias del dia
- Gestion de trabajadores y ranchos
- Reportes y analytics
- Configuracion y billing

### Worker App (Jornalero)
- PWA instalable
- Registro facial inicial
- Check-in/out diario con selfie + GPS
- Historial personal de asistencias
- Offline-capable

## Roadmap

### Fase 1 (Actual)
- [x] Monorepo setup
- [x] Database schema con RLS
- [x] Auth multi-tenant
- [x] Facial recognition (Google Cloud Vision)
- [x] Geofencing (Haversine)
- [x] Stripe billing helpers
- [x] Worker PWA check-in/out
- [x] Self-service signup
- [ ] Dashboard completo

### Fase 2
- [ ] Stripe billing completo
- [ ] Reportes avanzados
- [ ] Notificaciones push
- [ ] Export a Excel/PDF
- [ ] API publica

### Fase 3
- [ ] App movil nativa
- [ ] Analytics ML para deteccion de patrones
- [ ] Integracion con ERPs
- [ ] Multi-idioma

## Seguridad

- Row Level Security (RLS) en todas las tablas
- Credentials NUNCA en codigo (usar `.env`)
- Google credentials en `.gitignore`
- Stripe webhooks firmados
- HTTPS obligatorio en produccion
- Aislamiento multi-tenant por RLS policies

## Licencia

MIT License

---

**Hecho para la agricultura mexicana**
