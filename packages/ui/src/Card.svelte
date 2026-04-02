<script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let shadow = true;

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
</script>

<div class="bg-white rounded-xl border border-gray-200 {paddings[padding]} {shadow ? 'shadow-sm' : ''}">
  <slot />
</div>
