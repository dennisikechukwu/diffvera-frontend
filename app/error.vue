<script setup lang="ts">
import type { NuxtError } from '#app'
import { HugeiconsIcon } from '@hugeicons/vue'
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
const recovering = ref(false)
useSeoMeta({
  title: () => `${notFound.value ? 'Page not found' : 'Unable to open page'} — Diffvera`,
  robots: 'noindex, nofollow'
})
async function returnHome() {
  if (recovering.value) return
  recovering.value = true
  try {
    await clearError({ redirect: '/' })
  } finally {
    recovering.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col px-5 sm:px-8">
    <header class="mx-auto w-full max-w-6xl border-b border-border py-6">
      <span class="text-[28px] font-semibold tracking-[-1.3px]">Diffvera</span>
    </header>
    <main class="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center py-16">
      <span
        class="mb-6 flex size-12 items-center justify-center rounded-xl border border-brand/15 bg-brand-soft text-brand-dark"
      >
        <HugeiconsIcon :icon="AlertCircleIcon" :size="24" aria-hidden="true" />
      </span>
      <p class="mb-3 text-[11px] font-medium tracking-widest text-muted uppercase">
        {{ notFound ? 'Page not found · 404' : 'Page unavailable' }}
      </p>
      <h1 class="text-[32px] leading-tight font-semibold tracking-[-1px] sm:text-[40px]">
        {{ notFound ? 'This page isn’t here.' : 'We couldn’t open this page.' }}
      </h1>
      <p class="mt-4 text-sm leading-7 text-muted">
        {{
          notFound
            ? 'The address may be incorrect, or the page may have moved. Return to Diffvera to continue.'
            : 'Something went wrong while opening this page. Return to Diffvera and try again.'
        }}
      </p>
      <UiAsyncButton
        type="button"
        :loading="recovering"
        loading-text="Returning…"
        class="mt-7 min-h-11 rounded-lg bg-ink px-4 text-xs font-semibold text-white"
        @click="returnHome"
      >
        <span class="inline-flex items-center gap-2">
          <HugeiconsIcon :icon="ArrowLeft01Icon" :size="16" aria-hidden="true" />
          Return to Diffvera
        </span>
      </UiAsyncButton>
    </main>
  </div>
</template>
