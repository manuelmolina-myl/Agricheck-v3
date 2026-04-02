<script lang="ts">
  let step = 1;
  let loading = false;
  let errors: Record<string, string> = {};

  let form = {
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  function validateStep1(): boolean {
    errors = {};
    if (!form.companyName.trim()) errors.companyName = 'Nombre de empresa requerido';
    if (!form.ownerName.trim()) errors.ownerName = 'Nombre del propietario requerido';
    return Object.keys(errors).length === 0;
  }

  function validateStep2(): boolean {
    errors = {};
    if (!form.email.trim()) errors.email = 'Email requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalido';
    if (!form.phone.trim()) errors.phone = 'Telefono requerido';
    if (!form.password) errors.password = 'Contrasena requerida';
    else if (form.password.length < 8) errors.password = 'Minimo 8 caracteres';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contrasenas no coinciden';
    return Object.keys(errors).length === 0;
  }

  function nextStep() {
    if (step === 1 && validateStep1()) {
      step = 2;
    }
  }

  async function handleSignup() {
    if (!validateStep2()) return;

    loading = true;
    try {
      // 1. Create Supabase Auth user
      // 2. Create tenant record
      // 3. Create tenant_user record
      // 4. Create Stripe customer
      // 5. Start trial subscription
      // 6. Redirect to onboarding

      // TODO: Implement with real Supabase client
      console.log('Signup:', form);
      alert('Signup exitoso! Redirigiendo...');
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Crear cuenta</h1>
      <p class="text-gray-500 mt-2">Prueba gratuita de 30 dias. Sin tarjeta de credito.</p>
    </div>

    <!-- Progress -->
    <div class="flex items-center justify-center gap-3 mb-8">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium {step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}">1</div>
        <span class="text-sm {step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}">Empresa</span>
      </div>
      <div class="w-8 h-px bg-gray-300"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium {step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}">2</div>
        <span class="text-sm {step >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}">Cuenta</span>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {#if step === 1}
        <form on:submit|preventDefault={nextStep} class="space-y-4">
          <div>
            <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa / rancho</label>
            <input
              id="companyName"
              type="text"
              bind:value={form.companyName}
              placeholder="Ej: Rancho El Porvenir"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.companyName ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.companyName}<p class="text-sm text-red-600 mt-1">{errors.companyName}</p>{/if}
          </div>

          <div>
            <label for="ownerName" class="block text-sm font-medium text-gray-700 mb-1">Nombre del propietario</label>
            <input
              id="ownerName"
              type="text"
              bind:value={form.ownerName}
              placeholder="Ej: Juan Perez"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.ownerName ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.ownerName}<p class="text-sm text-red-600 mt-1">{errors.ownerName}</p>{/if}
          </div>

          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Siguiente
          </button>
        </form>
      {:else}
        <form on:submit|preventDefault={handleSignup} class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              bind:value={form.email}
              placeholder="correo@empresa.com"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.email ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.email}<p class="text-sm text-red-600 mt-1">{errors.email}</p>{/if}
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input
              id="phone"
              type="tel"
              bind:value={form.phone}
              placeholder="+52 614 123 4567"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.phone ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.phone}<p class="text-sm text-red-600 mt-1">{errors.phone}</p>{/if}
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input
              id="password"
              type="password"
              bind:value={form.password}
              placeholder="Minimo 8 caracteres"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.password ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.password}<p class="text-sm text-red-600 mt-1">{errors.password}</p>{/if}
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmar contrasena</label>
            <input
              id="confirmPassword"
              type="password"
              bind:value={form.confirmPassword}
              placeholder="Repite tu contrasena"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 {errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}"
            />
            {#if errors.confirmPassword}<p class="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>{/if}
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              on:click={() => step = 1}
              class="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Atras
            </button>
            <button
              type="submit"
              disabled={loading}
              class="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      {/if}
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      Ya tienes cuenta? <a href="/login" class="text-green-600 hover:text-green-700 font-medium">Iniciar sesion</a>
    </p>
  </div>
</div>
