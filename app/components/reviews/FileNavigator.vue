<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { File01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import type { ChangedFile, Finding } from '~/types/workspace'

const props = defineProps<{
  files: ChangedFile[]
  findings: Finding[]
  selectedPath: string
}>()
defineEmits<{ select: [path: string] }>()
const search = ref('')
const visible = computed(() =>
  props.files.filter((file) => file.path.toLowerCase().includes(search.value.trim().toLowerCase()))
)
const counts = computed(() => {
  const result = new Map<string, number>()
  for (const finding of props.findings)
    result.set(finding.file, (result.get(finding.file) ?? 0) + 1)
  return result
})
watch(
  () => props.selectedPath,
  (path) => {
    if (!path.toLowerCase().includes(search.value.trim().toLowerCase())) search.value = ''
  }
)
async function clearSearch() {
  search.value = ''
  await nextTick()
  document.getElementById('changed-files-search')?.focus()
}
</script>

<template>
  <section
    aria-labelledby="changed-files-heading"
    class="min-w-0 overflow-hidden rounded-xl border border-border bg-surface"
  >
    <div class="border-b border-border p-4">
      <div class="flex items-center justify-between gap-3">
        <h2 id="changed-files-heading" class="text-xs font-semibold">Changed files</h2>
        <span class="rounded-md bg-paper px-2 py-1 text-[10px] text-muted tabular-nums">
          {{ files.length }}
        </span>
      </div>
      <div class="relative mt-3">
        <label for="changed-files-search" class="sr-only">Search changed files</label>
        <HugeiconsIcon
          :icon="Search01Icon"
          :size="15"
          class="pointer-events-none absolute top-3 left-3 text-muted"
          aria-hidden="true"
        />
        <input
          id="changed-files-search"
          v-model="search"
          type="search"
          placeholder="Find a file…"
          class="min-h-10 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-xs"
        >
      </div>
      <p role="status" class="sr-only">{{ visible.length }} of {{ files.length }} files shown</p>
    </div>
    <nav
      v-if="visible.length"
      aria-label="Changed files"
      class="max-h-72 overflow-y-auto 2xl:max-h-[60svh]"
    >
      <ul class="grid gap-1 p-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-1">
        <li v-for="file in visible" :key="file.path" class="min-w-0">
          <button
            type="button"
            :aria-pressed="selectedPath === file.path"
            aria-controls="changed-file"
            :aria-label="`${file.path} · ${counts.get(file.path) ?? 0} ${(counts.get(file.path) ?? 0) === 1 ? 'finding' : 'findings'}`"
            class="flex min-h-14 w-full items-start gap-2 rounded-lg border p-2.5 text-left transition-colors duration-150 motion-reduce:transition-none"
            :class="
              selectedPath === file.path
                ? 'border-ink/10 bg-paper text-ink'
                : 'border-transparent text-muted hover:bg-paper/70 hover:text-ink'
            "
            @click="$emit('select', file.path)"
          >
            <HugeiconsIcon
              :icon="File01Icon"
              :size="15"
              class="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1">
              <span class="block text-[11px] leading-5 font-medium break-all">
                {{ file.path.split('/').at(-1) }}
              </span>
              <span
                v-if="file.path.includes('/')"
                class="block text-[9px] leading-4 break-all text-muted"
              >
                {{ file.path.slice(0, file.path.lastIndexOf('/')) }}
              </span>
            </span>
            <span
              class="mt-0.5 min-w-5 shrink-0 rounded px-1 text-center text-[10px] leading-5 tabular-nums"
              :class="
                counts.get(file.path) ? 'bg-brand-soft text-brand-dark' : 'bg-surface text-muted'
              "
              aria-hidden="true"
            >
              {{ counts.get(file.path) ?? 0 }}
            </span>
          </button>
        </li>
      </ul>
    </nav>
    <div v-else class="p-4">
      <p class="text-xs font-medium">
        {{ files.length ? 'No matching files.' : 'No changed files available.' }}
      </p>
      <button
        v-if="search"
        type="button"
        class="mt-2 min-h-9 rounded-sm text-[11px] font-medium text-brand-dark"
        @click="clearSearch"
      >
        Clear file search
      </button>
    </div>
  </section>
</template>
