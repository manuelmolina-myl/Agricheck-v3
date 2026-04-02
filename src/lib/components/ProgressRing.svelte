<script lang="ts">
	export let value = 0;
	export let size = 120;
	export let strokeWidth = 8;
	export let color = '#0D3FFF';

	$: radius = (size - strokeWidth) / 2;
	$: circumference = 2 * Math.PI * radius;
	$: offset = circumference - (value / 100) * circumference;
</script>

<div class="relative inline-flex items-center justify-center" style="width:{size}px;height:{size}px">
	<svg class="transform -rotate-90" width={size} height={size}>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="currentColor"
			class="text-surface-100"
			stroke-width={strokeWidth}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			class="transition-all duration-700 ease-out"
		/>
	</svg>
	<div class="absolute inset-0 flex items-center justify-center">
		<slot>
			<span class="text-lg font-bold text-surface-900 tabular-nums">{Math.round(value)}%</span>
		</slot>
	</div>
</div>
