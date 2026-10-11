<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { Tick02Icon, AlertCircleIcon, Clock01Icon } from '@hugeicons/core-free-icons'
const props = defineProps<{ status: string }>()
const label = computed(() => props.status.replaceAll('-', ' '))
const appearance = computed(() => getStatusAppearance(props.status))
const spinning = computed(() => ['running', 'checking'].includes(props.status))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium capitalize"
    :class="appearance.badge"
    :aria-busy="spinning"
  >
    <UiSpinner v-if="spinning" :size="12" />
    <HugeiconsIcon
      v-else-if="appearance.tone === 'success'"
      :icon="Tick02Icon"
      :size="12"
      aria-hidden="true"
    />
    <HugeiconsIcon
      v-else-if="appearance.tone === 'danger'"
      :icon="AlertCircleIcon"
      :size="12"
      aria-hidden="true"
    />
    <HugeiconsIcon
      v-else-if="['queued', 'pending-approval'].includes(status)"
      :icon="Clock01Icon"
      :size="12"
      aria-hidden="true"
    />
    <span v-else class="size-1 rounded-full bg-current" aria-hidden="true" />
    {{ label }}
  </span>
</template>
