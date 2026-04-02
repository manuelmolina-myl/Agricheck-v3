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
- Verificacion facial biometrica (Google Cloud Vision)
- Geofencing GPS (el trabajador debe estar en el rancho)
- PWA movil (cada trabajador hace su propio check-in)
- Dashboard en tiempo real para productores
- Multi-tenant SaaS con self-service signup

## Stack Tecnologico

- **Framework**: SvelteKit (TypeScript)
- **Database**: Supabase (PostgreSQL + RLS + Auth)
- **Facial Recognition**: Google Cloud Vision API
- **Storage**: Cloudflare R2
- **Payments**: Stripe
- **Deploy**: Vercel
- **Styling**: TailwindCSS
- **PWA**: Vite PWA Plugin

## Estructura del Proyecto

```
agricheck/
├── src/
│   ├── routes/
│   │   ├── (admin)/           # Super Admin Dashboard
│   │   ├── (auth)/            # Login/Signup
│   │   ├── (app)/             # Tenant Dashboard
│   │   └── (worker)/          # Worker PWA
│   ├── lib/
│   │   ├── server/           # Server-only logic
│   │   ├── components/       # Shared components
│   │   └── types/           # TypeScript types
│   └── app.html
├── supabase/
│   └── migrations/          # Database migrations
├── static/
│   └── manifest.json        # PWA manifest
└── package.json
```

## Setup Rapido

### Prerequisitos

- Node.js 18+
- Cuenta Supabase
- Cuenta Google Cloud (Vision API)
- Cuenta Stripe

### 1. Clonar repositorio

```bash
git clone https://github.com/[tu-usuario]/agricheck-v3.git
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

### 4. Aplicar migrations a Supabase

En Supabase Dashboard > SQL Editor, ejecutar `supabase/migrations/*.sql`

### 5. Iniciar desarrollo

```bash
npm run dev
```

App disponible en: http://localhost:5173

## Scripts Disponibles

```bash
npm run dev        # Desarrollo
npm run build      # Build produccion
npm run preview    # Preview build
npm run check      # Type checking
npm run lint       # Lint codigo
npm run format     # Format codigo
```

## Arquitectura de Rutas

### (admin) - Super Admin
- `/admin` - Dashboard global
- `/admin/tenants` - Gestion clientes
- `/admin/analytics` - Analytics
- `/admin/billing` - Billing

### (auth) - Autenticacion
- `/login` - Login
- `/signup` - Registro self-service
- `/onboarding` - Wizard onboarding

### (app) - Dashboard Productor
- `/dashboard` - Vista principal
- `/workers` - Gestion trabajadores
- `/ranches` - Gestion ranchos
- `/reports` - Reportes
- `/settings` - Configuracion

### (worker) - PWA Trabajador
- `/register/[token]` - Registro facial
- `/check` - Check-in/out diario

## Roadmap

### Fase 1 (Actual)
- [x] Setup proyecto
- [x] Database schema
- [x] Auth multi-tenant
- [ ] Self-service signup
- [ ] Worker check-in/out
- [ ] Dashboard basico

### Fase 2
- [ ] Stripe billing
- [ ] Reportes avanzados
- [ ] Notificaciones push
- [ ] API publica

### Fase 3
- [ ] App movil nativa
- [ ] Analytics ML
- [ ] Integracion ERPs

## Seguridad

- Row Level Security (RLS) en Supabase
- Credentials en .env (nunca en codigo)
- Google credentials en .gitignore
- HTTPS en produccion

## Licencia

MIT License

---

**Hecho para la agricultura mexicana**
