<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowDown01Icon, Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import type { Feedback, Finding } from '~/types/workspace'
const props = defineProps<{ finding: Finding; reviewId: string }>()
const emit = defineEmits<{ source: [file: string, start: number, end: number] }>()
const { snapshot, setFeedback, busy, isPending, actionError } = useWorkspace()
const ruleName = computed(
  () =>
    snapshot.value?.rules.find((rule) => rule.id === props.finding.ruleId)?.name ??
    props.finding.ruleId
)
const message = ref('')
const copying = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const actions: { label: string; value: Feedback }[] = [
  { label: 'Useful', value: 'useful' },
  { label: 'False positive', value: 'false-positive' },
  { label: 'Resolved', value: 'resolved' }
]

async function update(value: Feedback) {
  await setFeedback(
    props.reviewId,
    props.finding.id,
    props.finding.feedback === value ? null : value
  )
  message.value = actionError.value ? '' : 'Feedback updated.'
}
async function copySuggestion() {
  if (copying.value) return
  copying.value = true
  try {
    await navigator.clipboard.writeText(props.finding.correction)
    copied.value = true
    message.value = 'Suggestion copied to clipboard.'
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {
    message.value = 'Copy is unavailable. Select the suggestion text to copy it manually.'
  } finally {
    copying.value = false
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <article
    :aria-labelledby="`finding-${finding.id}`"
    class="overflow-hidden rounded-xl border border-border bg-surface"
  >
    <div class="p-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <WorkspaceStatusBadge :status="finding.severity" />
          <span class="text-[10px] text-muted capitalize">{{ finding.category }}</span>
        </div>
        <button
          type="button"
          class="min-h-8 rounded-sm text-[10px] font-medium text-muted hover:text-brand-dark"
          @click="emit('source', finding.file, finding.startLine, finding.endLine)"
        >
          L{{ finding.startLine }}–{{ finding.endLine }} · View code
        </button>
      </div>
      <h2
        :id="`finding-${finding.id}`"
        class="mt-4 text-base leading-6 font-semibold tracking-tight"
      >
        {{ finding.title }}
      </h2>
      <p class="mt-3 text-xs leading-6 text-muted">{{ finding.explanation }}</p>
      <p class="mt-3 font-mono text-[10px] break-all text-muted">{{ finding.file }}</p>
      <p v-if="finding.ruleId" class="mt-2 text-[10px] text-muted">
        Architecture rule: {{ ruleName }}
      </p>
      <details class="group mt-5 rounded-lg border border-border bg-paper">
        <summary
          class="flex min-h-11 items-center justify-between gap-3 px-3 text-xs font-medium marker:content-none"
        >
          <span>Suggested correction</span>
          <HugeiconsIcon
            :icon="ArrowDown01Icon"
            :size="15"
            class="text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </summary>
        <div class="border-t border-border p-3 motion-safe:animate-disclosure-in">
          <p class="text-xs leading-6 text-muted">{{ finding.suggestion }}</p>
          <div class="mt-3 overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
            <div class="flex items-center justify-between border-b border-border bg-paper/60 px-3 py-1.5 text-[10px] text-muted">
              <span class="font-mono">Suggested replacement</span>
              <button
                type="button"
                :disabled="copying"
                class="inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
                :class="copied ? 'text-success font-semibold' : 'text-muted'"
                :aria-label="copied ? 'Copied to clipboard' : 'Copy suggested code'"
                @click="copySuggestion"
              >
                <HugeiconsIcon
                  :icon="copied ? Tick02Icon : Copy01Icon"
                  :size="13"
                  class="transition-transform duration-200"
                  :class="copied ? 'scale-110 text-success' : 'text-muted'"
                  aria-hidden="true"
                />
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
            <pre
              class="overflow-x-auto p-3 text-[11px] leading-6 font-mono text-ink"
              tabindex="0"
              aria-label="Suggested code, scroll horizontally if needed"
            ><code>{{ finding.correction }}</code></pre>
          </div>
          <div class="mt-3.5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              :disabled="copying"
              class="group inline-flex min-h-9 items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold shadow-xs transition-all duration-200 motion-reduce:transition-none"
              :class="
                copied
                  ? 'border-success/30 bg-success-soft text-success shadow-none'
                  : 'border-border bg-surface text-ink hover:border-ink hover:bg-paper active:scale-[0.98]'
              "
              aria-live="polite"
              @click="copySuggestion"
            >
              <HugeiconsIcon
                :icon="copied ? Tick02Icon : Copy01Icon"
                :size="15"
                class="transition-transform duration-200"
                :class="copied ? 'scale-110 text-success' : 'text-muted group-hover:text-ink'"
                aria-hidden="true"
              />
              <span>{{ copied ? 'Copied to clipboard!' : 'Copy suggestion' }}</span>
            </button>
            <p class="text-[10px] leading-5 text-muted">
              Diffvera provides guidance; review and apply changes yourself.
            </p>
          </div>
        </div>
      </details>
    </div>
    <div class="border-t border-border px-5 py-4">
      <p class="mb-3 text-[10px] text-muted">How do you assess this finding?</p>
      <div class="flex flex-wrap gap-2">
        <UiAsyncButton
          v-for="action in actions"
          :key="action.label"
          type="button"
          :aria-pressed="finding.feedback === action.value"
          :disabled="busy"
          :loading="
            isPending(
              `feedback:${reviewId}:${finding.id}:${finding.feedback === action.value ? 'clear' : action.value}`
            )
          "
          loading-text="Saving…"
          class="min-h-9 rounded-md border px-3 text-[11px] font-medium transition-colors duration-200 disabled:opacity-60 motion-reduce:transition-none"
          :class="
            finding.feedback === action.value
              ? 'border-ink bg-ink text-white'
              : 'border-border bg-surface text-muted hover:bg-paper'
          "
          @click="update(action.value)"
        >
          {{ action.label }}
        </UiAsyncButton>
      </div>
      <p role="status" class="mt-2 text-[10px] text-muted">{{ message }}</p>
      <p v-if="actionError" role="alert" class="mt-2 text-xs text-brand-dark">{{ actionError }}</p>
    </div>
  </article>
</template>
