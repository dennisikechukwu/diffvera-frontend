<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description?: string }>()
</script>

<template>
  <header class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div class="min-w-0">
      <p class="mb-2 text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
        {{ eyebrow }}
      </p>
      <h1
        class="text-[28px] leading-tight font-semibold tracking-[-0.9px] break-words sm:text-[32px]"
      >
        {{ title }}
      </h1>
      <p v-if="description" class="mt-3 max-w-155 text-sm leading-6 break-words text-muted">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.default" class="shrink-0"><slot /></div>
  </header>
</template>
