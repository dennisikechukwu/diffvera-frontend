<script setup lang="ts">
const { isLoading } = useLoadingIndicator({ throttle: 100, hideDelay: 0 })
</script>

<template>
  <div
    v-if="isLoading"
    role="status"
    class="fixed top-3 right-3 z-90 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted shadow-card"
  >
    <UiSpinner :size="15" />
    <span>Loading…</span>
  </div>
</template>
