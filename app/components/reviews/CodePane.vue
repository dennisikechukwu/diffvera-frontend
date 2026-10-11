<script setup lang="ts">
import type { ChangedFile } from '~/types/workspace'
defineProps<{ file: ChangedFile; highlightedRange: { start: number; end: number } | null }>()
</script>

<template>
  <div
    id="changed-file"
    role="region"
    :aria-label="`${file.path} diff excerpt`"
    tabindex="-1"
    class="overflow-hidden rounded-xl border border-editor-border bg-editor text-code"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-2 border-b border-editor-border px-4 py-4"
    >
      <p class="text-xs font-medium break-all">{{ file.path }}</p>
      <span class="text-[10px] text-editor-muted">
        {{
          highlightedRange
            ? `Evidence L${highlightedRange.start}–${highlightedRange.end}`
            : 'Diff excerpt'
        }}
      </span>
    </div>
    <div
      class="max-h-[65svh] overflow-auto py-4"
      tabindex="0"
      aria-label="Changed code, scroll horizontally if needed"
    >
      <pre
        class="min-w-max text-[11px] leading-7"
      ><code><span v-for="line in file.lines" :id="`source-line-${line.number}`" :key="line.number" class="block pr-5" :class="highlightedRange && line.number >= highlightedRange.start && line.number <= highlightedRange.end ? 'bg-code-highlight' : line.kind === 'added' ? 'bg-code-highlight/40' : ''"><span class="inline-block w-11 px-2 text-right text-editor-muted select-none">{{ line.number }}</span><span class="inline-block w-5 text-editor-muted select-none">{{ line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : ' ' }}</span>{{ line.text }}</span></code></pre>
    </div>
    <p class="border-t border-editor-border px-4 py-3 text-[10px] text-editor-muted">
      Code is shown for review. Suggestions do not edit your repository.
    </p>
  </div>
</template>
