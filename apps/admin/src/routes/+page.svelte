<script lang="ts">
  let stats = {
    totalTenants: 47,
    activeTenants: 42,
    totalWorkers: 2340,
    mrr: 485000,
    trialConversion: 68.5,
    churnRate: 3.2
  };
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">AgriCheck Admin</h1>
      <span class="text-sm text-gray-500">Super Admin Panel</span>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-6 py-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">Tenants Totales</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{stats.totalTenants}</p>
        <p class="text-sm text-green-600 mt-2">{stats.activeTenants} activos</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">Trabajadores Registrados</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{stats.totalWorkers.toLocaleString()}</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">MRR</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">${stats.mrr.toLocaleString()} MXN</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">Conversion Trial</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{stats.trialConversion}%</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">Churn Rate</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{stats.churnRate}%</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p class="text-sm text-gray-500">Tenants en Trial</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{stats.totalTenants - stats.activeTenants}</p>
      </div>
    </div>
  </main>
</div>
