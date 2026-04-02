<script lang="ts">
	export let padding = true;
</script>

<div class="bg-white rounded-xl shadow-sm border {padding ? 'p-6' : ''}">
	<slot />
</div>
