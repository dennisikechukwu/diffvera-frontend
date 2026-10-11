<script setup lang="ts">
defineProps<{ fileCount: number; findingCount: number }>()
const scope = defineModel<'all' | 'file'>('scope', { required: true })
const category = defineModel<string>('category', { required: true })
const severity = defineModel<string>('severity', { required: true })
</script>

<template>
  <div class="mb-4 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p class="mb-3 text-xs text-muted">
        {{ fileCount }} changed {{ fileCount === 1 ? 'file' : 'files' }}
        <span aria-hidden="true" class="mx-1">·</span>
        {{ findingCount }} {{ findingCount === 1 ? 'finding' : 'findings' }} in this review
      </p>
      <div
        role="group"
        aria-label="Finding scope"
        class="inline-flex rounded-lg border border-border bg-surface p-1"
      >
        <button
          v-for="option in [
            { value: 'file' as const, label: 'Current file' },
            { value: 'all' as const, label: 'All files' }
          ]"
          :id="`finding-scope-${option.value}`"
          :key="option.value"
          type="button"
          :aria-pressed="scope === option.value"
          class="min-h-9 rounded-md px-3 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none"
          :class="
            scope === option.value
              ? 'bg-ink text-white'
              : 'text-muted hover:bg-paper hover:text-ink'
          "
          @click="scope = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    <div class="grid w-full grid-cols-2 gap-3 sm:w-auto">
      <div class="min-w-0 sm:w-40">
        <label for="finding-category" class="mb-2 block text-xs font-medium">Category</label>
        <UiSelect
          id="finding-category"
          v-model="category"
          :options="[
            { value: 'all', label: 'All categories' },
            { value: 'security', label: 'Security' },
            { value: 'correctness', label: 'Correctness' },
            { value: 'architecture', label: 'Architecture' }
          ]"
        />
      </div>
      <div class="min-w-0 sm:w-36">
        <label for="finding-severity" class="mb-2 block text-xs font-medium">Severity</label>
        <UiSelect
          id="finding-severity"
          v-model="severity"
          :options="[
            { value: 'all', label: 'All severities' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ]"
        />
      </div>
    </div>
  </div>
</template>
