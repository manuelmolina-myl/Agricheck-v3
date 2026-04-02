<script lang="ts">
  export let columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[] = [];
  export let rows: Record<string, unknown>[] = [];
  export let emptyMessage = 'No hay datos disponibles';
</script>

<div class="overflow-x-auto rounded-lg border border-gray-200">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        {#each columns as col}
          <th
            class="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500"
            class:text-left={col.align !== 'center' && col.align !== 'right'}
            class:text-center={col.align === 'center'}
            class:text-right={col.align === 'right'}
          >
            {col.label}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      {#if rows.length === 0}
        <tr>
          <td colspan={columns.length} class="px-4 py-8 text-center text-sm text-gray-500">
            {emptyMessage}
          </td>
        </tr>
      {:else}
        {#each rows as row}
          <tr class="hover:bg-gray-50 transition-colors">
            {#each columns as col}
              <td
                class="whitespace-nowrap px-4 py-3 text-sm text-gray-900"
                class:text-left={col.align !== 'center' && col.align !== 'right'}
                class:text-center={col.align === 'center'}
                class:text-right={col.align === 'right'}
              >
                <slot name="cell" {col} {row}>
                  {row[col.key] ?? ''}
                </slot>
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
