<script lang="ts">
	export let columns: string[] = [];
	export let rows: Record<string, unknown>[][] = [];
	export let emptyMessage = 'No data available.';
</script>

<div class="bg-white rounded-xl shadow-sm border overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="bg-gray-50 border-b">
					{#each columns as col}
						<th class="text-left px-4 py-3 font-medium text-gray-500">{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if rows.length === 0}
					<tr>
						<td colspan={columns.length} class="px-4 py-8 text-center text-gray-400">
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{#each rows as row}
						<tr class="border-b hover:bg-gray-50">
							{#each row as cell}
								<td class="px-4 py-3">{cell}</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
