<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center">
    <h2 class="text-base font-semibold">{{ title }}</h2>
    <p class="mx-auto mt-2 max-w-100 text-sm leading-6 text-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5"><slot /></div>
  </div>
</template>
