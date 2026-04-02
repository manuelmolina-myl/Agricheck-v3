<script lang="ts">
  // Landing page - redirects to dashboard if logged in
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
  <nav class="px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <span class="text-xl font-bold text-green-800">AgriCheck</span>
      <div class="flex gap-4">
        <a href="/login" class="text-sm text-green-700 hover:text-green-900 font-medium">Iniciar Sesion</a>
        <a href="/signup" class="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">Prueba Gratis</a>
      </div>
    </div>
  </nav>

  <main class="max-w-4xl mx-auto px-6 py-20 text-center">
    <h1 class="text-5xl font-bold text-gray-900 mb-6">
      Elimina el fraude de <span class="text-green-600">trabajadores fantasma</span>
    </h1>
    <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
      Control de asistencia con verificacion facial biometrica y geofencing GPS.
      Ahorra 10-15% de tu nomina.
    </p>
    <a href="/signup" class="inline-block bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
      Comenzar prueba gratuita de 30 dias
    </a>
  </main>
</div>
