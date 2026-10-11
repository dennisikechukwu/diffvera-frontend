<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import type { PullRequest } from '~/types/workspace'

const { snapshot, path, busy, isPending, actionError, requestReview } = useWorkspace()
const route = useRoute()
const repository = computed(() =>
  snapshot.value?.repositories.find((repo) => repo.id === route.params.repositoryId)
)
const search = ref('')
const status = ref('open')
const loadingPrs = ref(false)

const pullRequests = computed(() =>
  (snapshot.value?.pullRequests ?? []).filter(
    (pr) =>
      pr.repositoryId === repository.value?.id &&
      (status.value === 'all' || pr.status === status.value) &&
      `${pr.title} ${pr.number}`.toLowerCase().includes(search.value.trim().toLowerCase())
  )
)
function latestReview(id: string) {
  return snapshot.value?.reviews.find((review) => review.pullRequestId === id)
}

async function refreshRepositoryPullRequests() {
  const repoId = route.params.repositoryId as string
  if (!repoId) return
  loadingPrs.value = true
  try {
    const fetched = await $fetch<PullRequest[]>(`/api/v1/repositories/${repoId}/pull-requests`, {
      credentials: 'include'
    })
    if (fetched && snapshot.value) {
      const remaining = (snapshot.value.pullRequests ?? []).filter((p) => p.repositoryId !== repoId)
      snapshot.value.pullRequests = [...remaining, ...fetched]
    }
  } catch {
    // Graceful fallback to existing snapshot PRs
  } finally {
    loadingPrs.value = false
  }
}

onMounted(() => {
  refreshRepositoryPullRequests()
})

watch(
  () => route.params.repositoryId,
  (newId) => {
    if (newId) refreshRepositoryPullRequests()
  }
)
</script>

<template>
  <div>
    <NuxtLink
      :to="path('/dashboard/repositories')"
      class="mb-5 inline-flex min-h-8 items-center gap-2 rounded-sm text-xs text-muted hover:text-ink"
    >
      <HugeiconsIcon :icon="ArrowLeft01Icon" :size="15" aria-hidden="true" />
      Repositories
    </NuxtLink>
    <WorkspaceEmptyState
      v-if="!repository"
      title="Repository not found."
      description="It may no longer be available in this workspace."
    />
    <template v-else>
      <WorkspacePageHeader
        eyebrow="Pull requests"
        :title="repository.fullName"
        :description="repository.description"
      >
        <WorkspaceStatusBadge :status="repository.access" />
      </WorkspacePageHeader>
      <WorkspaceEmptyState
        v-if="repository.access === 'revoked'"
        title="Repository access was removed."
        description="Check the GitHub App installation before requesting more reviews."
      >
        <NuxtLink
          :to="path('/dashboard/settings')"
          class="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 text-xs font-semibold text-white"
        >
          Check connection settings
        </NuxtLink>
      </WorkspaceEmptyState>
      <template v-else>
        <div class="mb-5 flex flex-col gap-4 sm:flex-row">
          <div class="flex-1">
            <label for="pr-search" class="mb-2 block text-xs font-medium">
              Find a pull request
            </label>
            <input
              id="pr-search"
              v-model="search"
              type="search"
              placeholder="Title or number…"
              class="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm"
            >
          </div>
          <div>
            <label for="pr-status" class="mb-2 block text-xs font-medium">Status</label>
            <UiSelect
              id="pr-status"
              v-model="status"
              :options="[
                { value: 'open', label: 'Open' },
                { value: 'merged', label: 'Merged' },
                { value: 'closed', label: 'Closed' },
                { value: 'all', label: 'All statuses' }
              ]"
              class="sm:w-36"
            />
          </div>
        </div>
        <p
          v-if="actionError"
          role="alert"
          class="mb-4 rounded-lg border border-brand/20 bg-brand-soft p-3 text-xs text-brand-dark"
        >
          {{ actionError }}
        </p>
        <ul
          v-if="pullRequests.length"
          class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface"
        >
          <li
            v-for="pr in pullRequests"
            :key="pr.id"
            class="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
          >
            <div class="min-w-0">
              <NuxtLink
                :to="path(`/dashboard/repositories/${repository.id}/pull-requests/${pr.id}`)"
                class="rounded-sm text-sm font-semibold break-words hover:text-brand-dark"
              >
                {{ pr.title }}
                <span class="text-muted">#{{ pr.number }}</span>
              </NuxtLink>
              <p class="mt-2 text-[11px] break-words text-muted">
                {{ pr.author }} · {{ pr.branch }} · {{ pr.updatedAt.slice(0, 10) }}
              </p>
              <div class="mt-3 flex items-center gap-2">
                <WorkspaceStatusBadge :status="pr.status" />
                <span v-if="pr.additions || pr.deletions" class="font-mono text-[10px] text-muted">
                  <span class="font-medium text-success">+{{ pr.additions }}</span>
                  <span class="mx-1 text-border">/</span>
                  <span class="font-medium text-brand-dark">−{{ pr.deletions }}</span>
                </span>
                <span v-else class="text-[10px] text-muted">
                  Diff ready
                </span>
              </div>
            </div>
            <div class="flex shrink-0 flex-col gap-2">
              <NuxtLink
                v-if="latestReview(pr.id)"
                :to="path(`/dashboard/reviews/${latestReview(pr.id)!.id}`)"
                class="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-3 text-xs hover:bg-paper"
              >
                View last review
              </NuxtLink>
              <UiAsyncButton
                v-if="pr.status === 'open'"
                type="button"
                :disabled="busy"
                class="min-h-10 rounded-lg bg-ink px-3 text-xs font-semibold text-white disabled:opacity-60"
                :loading="isPending(`review:${pr.id}`)"
                loading-text="Requesting…"
                @click="requestReview(repository.id, pr.id)"
              >
                Request review
              </UiAsyncButton>
            </div>
          </li>
        </ul>
        <div
          v-else-if="loadingPrs && !pullRequests.length"
          role="status"
          class="flex min-h-48 items-center justify-center rounded-xl border border-border bg-surface p-8 text-xs text-muted"
        >
          <div class="flex items-center gap-2.5">
            <UiSpinner :size="16" />
            <span>Checking GitHub for pull requests…</span>
          </div>
        </div>
        <WorkspaceEmptyState
          v-else
          title="No matching pull requests."
          description="Try another search or status. Reviews start with an open pull request."
        />
      </template>
    </template>
  </div>
</template>
