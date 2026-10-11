<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { GitBranchIcon } from '@hugeicons/core-free-icons'
const { snapshot, path } = useWorkspace()
const search = ref('')
const access = ref('all')
const page = ref(1)
const pageSize = 8
const filtered = computed(() =>
  (snapshot.value?.repositories ?? []).filter(
    (repo) =>
      repo.fullName.toLowerCase().includes(search.value.trim().toLowerCase()) &&
      (access.value === 'all' || repo.access === access.value)
  )
)
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)
watch([search, access], () => {
  page.value = 1
})

function openPrCount(repoId: string): number {
  return (
    snapshot.value?.pullRequests.filter(
      (pr) => pr.repositoryId === repoId && pr.status === 'open'
    ).length ?? 0
  )
}
</script>

<template>
  <div>
    <WorkspacePageHeader
      eyebrow="Repository access"
      title="Repositories"
      description="Choose a repository to explore its pull requests and previous reviews."
    >
      <NuxtLink
        :to="path('/dashboard/settings')"
        class="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-xs font-medium hover:bg-paper"
      >
        Connection settings
      </NuxtLink>
    </WorkspacePageHeader>
    <div class="mb-5 flex flex-col gap-4 sm:flex-row">
      <div class="flex-1">
        <label for="repo-search" class="mb-2 block text-xs font-medium">Search repositories</label>
        <input
          id="repo-search"
          v-model="search"
          type="search"
          placeholder="Search by name…"
          class="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
      </div>
      <div>
        <label for="repo-access" class="mb-2 block text-xs font-medium">Access</label>
        <UiSelect
          id="repo-access"
          v-model="access"
          :options="[
            { value: 'all', label: 'All repositories' },
            { value: 'available', label: 'Available' },
            { value: 'revoked', label: 'Access removed' }
          ]"
          class="sm:w-42"
        />
      </div>
    </div>
    <p role="status" class="mb-3 text-[11px] text-muted">
      {{ filtered.length }} {{ filtered.length === 1 ? 'repository' : 'repositories' }}
    </p>
    <ul v-if="visible.length" class="grid gap-4 xl:grid-cols-2">
      <li v-for="repo in visible" :key="repo.id">
        <NuxtLink
          :to="path(`/dashboard/repositories/${repo.id}`)"
          class="group block h-full rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <div class="flex items-start justify-between gap-3">
            <HugeiconsIcon
              :icon="GitBranchIcon"
              :size="21"
              class="shrink-0 text-muted"
              aria-hidden="true"
            />
            <WorkspaceStatusBadge :status="repo.access" />
          </div>
          <h2 class="mt-4 text-sm font-semibold break-words group-hover:text-brand-dark">
            {{ repo.fullName }}
          </h2>
          <p class="mt-2 text-xs leading-6 text-muted">{{ repo.description }}</p>
          <p class="mt-5 text-[11px] text-muted">
            <span class="capitalize">{{ repo.visibility }}</span>
            · {{ repo.language ?? 'Language not specified' }} ·
            <strong class="font-semibold text-ink">{{ openPrCount(repo.id) }}</strong>
            {{ openPrCount(repo.id) === 1 ? 'open pull request' : 'open pull requests' }}
          </p>
        </NuxtLink>
      </li>
    </ul>
    <WorkspaceEmptyState
      v-else
      :title="
        snapshot?.repositories.length ? 'No matching repositories.' : 'No repositories connected.'
      "
      :description="
        snapshot?.repositories.length
          ? 'Try another name or access filter.'
          : 'Connect a GitHub App installation to make repositories available.'
      "
    />
    <nav
      v-if="filtered.length > pageSize"
      aria-label="Repository pages"
      class="mt-5 flex items-center justify-end gap-3 text-xs"
    >
      <button
        type="button"
        :disabled="page === 1"
        class="min-h-10 rounded-lg border border-border px-3 disabled:text-muted"
        @click="page--"
      >
        Previous
      </button>
      <span>Page {{ page }} of {{ Math.ceil(filtered.length / pageSize) }}</span>
      <button
        type="button"
        :disabled="page * pageSize >= filtered.length"
        class="min-h-10 rounded-lg border border-border px-3 disabled:text-muted"
        @click="page++"
      >
        Next
      </button>
    </nav>
  </div>
</template>
