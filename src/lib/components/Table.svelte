<script lang="ts">
	import EmptyState from './EmptyState.svelte';

	export let columns: string[] = [];
	export let rows: Record<string, unknown>[][] = [];
	export let emptyMessage = 'No hay datos disponibles.';
	export let emptyIcon = 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4';
</script>

<div class="bg-white rounded-2xl shadow-card border border-surface-100/60 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-surface-100">
					{#each columns as col}
						<th class="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-surface-50">
				{#if rows.length === 0}
					<tr>
						<td colspan={columns.length}>
							<EmptyState icon={emptyIcon} title={emptyMessage} compact />
						</td>
					</tr>
				{:else}
					{#each rows as row}
						<tr class="hover:bg-primary-50/30 transition-colors">
							{#each row as cell}
								<td class="px-5 py-3.5 text-surface-700">{cell}</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
