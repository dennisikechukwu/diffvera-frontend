<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { Loading03Icon } from '@hugeicons/core-free-icons'
withDefaults(defineProps<{ size?: number }>(), { size: 16 })
</script>

<template>
  <HugeiconsIcon
    :icon="Loading03Icon"
    :size="size"
    class="shrink-0 motion-safe:animate-spin"
    aria-hidden="true"
  />
</template>
