<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { GitBranchIcon, Search01Icon } from '@hugeicons/core-free-icons'
import type { RepositoryAccess } from '~/types/access'

const props = defineProps<{ repositories: RepositoryAccess[] }>()
const search = ref('')
const filtered = computed(() =>
  props.repositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(search.value.trim().toLowerCase())
  )
)
</script>

<template>
  <div class="mt-6">
    <label for="repository-search" class="mb-2 block text-xs font-medium">
      Repositories with access
    </label>
    <div class="relative">
      <HugeiconsIcon
        :icon="Search01Icon"
        :size="17"
        class="pointer-events-none absolute top-3.5 left-3 text-muted"
        aria-hidden="true"
      />
      <input
        id="repository-search"
        v-model="search"
        type="search"
        autocomplete="off"
        placeholder="Find a repository…"
        class="min-h-11 w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-10 text-sm placeholder:text-muted"
      >
    </div>
    <p role="status" class="mt-3 text-[11px] text-muted">
      {{ filtered.length }} {{ filtered.length === 1 ? 'repository' : 'repositories'
      }}{{ search.trim() ? ' matching your search' : ' available' }}
    </p>
    <ul
      v-if="filtered.length"
      class="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border"
    >
      <li v-for="repo in filtered" :key="repo.id" class="flex items-start gap-3 p-3.5">
        <HugeiconsIcon
          :icon="GitBranchIcon"
          :size="17"
          class="mt-0.5 shrink-0 text-muted"
          aria-hidden="true"
        />
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium break-words">{{ repo.fullName }}</p>
          <p class="mt-1.5 text-[11px] text-muted">
            <span class="capitalize">{{ repo.visibility }}</span>
            <span v-if="repo.language">· {{ repo.language }}</span>
          </p>
        </div>
      </li>
    </ul>
    <p
      v-else
      class="mt-3 rounded-lg border border-dashed border-border bg-paper p-5 text-xs leading-6 text-muted"
    >
      {{
        repositories.length
          ? 'No repositories match your search. Try a different name.'
          : 'No repositories are available. Check which repositories have access in your GitHub App installation.'
      }}
    </p>
  </div>
</template>
