<script lang="ts">
	export let padding = true;
	export let hover = false;
	export let glass = false;
</script>

<div
	class="rounded-2xl transition-all duration-300
		{padding ? 'p-6' : ''}
		{glass ? 'glass border border-white/20' : 'bg-white shadow-card border border-surface-100/60'}
		{hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
	"
>
	<slot />
</div>
