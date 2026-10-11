<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    loadingText?: string
    spinnerSize?: number
  }>(),
  { loading: false, disabled: false, type: 'button', loadingText: '', spinnerSize: 16 }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed motion-reduce:transition-none"
    :class="loading ? 'cursor-wait opacity-90' : ''"
  >
    <span class="grid items-center justify-items-center">
      <span
        class="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
        :class="loading ? 'invisible' : ''"
        :aria-hidden="loading"
      >
        <slot />
      </span>
      <span
        class="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
        :class="!loading ? 'invisible' : ''"
        :aria-hidden="!loading"
      >
        <UiSpinner v-if="loading" :size="spinnerSize" />
        <span v-else class="size-4" aria-hidden="true" />
        <span v-if="loadingText">{{ loadingText }}</span>
        <slot v-else />
      </span>
    </span>
  </button>
</template>
