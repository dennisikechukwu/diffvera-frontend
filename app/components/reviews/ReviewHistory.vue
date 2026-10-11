<script setup lang="ts">
const { snapshot } = useWorkspace()
const search = ref('')
const status = ref('all')
const page = ref(1)
const size = 8
const filtered = computed(() =>
  (snapshot.value?.reviews ?? []).filter((review) => {
    const pr = snapshot.value?.pullRequests.find((item) => item.id === review.pullRequestId)
    const repo = snapshot.value?.repositories.find((item) => item.id === pr?.repositoryId)
    return (
      (status.value === 'all' || review.status === status.value) &&
      `${pr?.title} ${pr?.number} ${repo?.fullName} ${review.headSha}`
        .toLowerCase()
        .includes(search.value.trim().toLowerCase())
    )
  })
)
watch([search, status], () => {
  page.value = 1
})
</script>

<template>
  <div>
    <WorkspacePageHeader
      eyebrow="Review history"
      title="Reviews"
      description="Every review is tied to a specific commit. Return to the evidence and your team’s feedback."
    />
    <div class="mb-5 flex flex-col gap-4 sm:flex-row">
      <div class="flex-1">
        <label for="review-search" class="mb-2 block text-xs font-medium">Search reviews</label>
        <input
          id="review-search"
          v-model="search"
          type="search"
          placeholder="Pull request, repository, or commit…"
          class="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm"
        >
      </div>
      <div>
        <label for="review-status" class="mb-2 block text-xs font-medium">Status</label>
        <UiSelect
          id="review-status"
          v-model="status"
          :options="[
            { value: 'all', label: 'All statuses' },
            { value: 'queued', label: 'Queued' },
            { value: 'running', label: 'Running' },
            { value: 'completed', label: 'Completed' },
            { value: 'failed', label: 'Failed' }
          ]"
          class="sm:w-40"
        />
      </div>
    </div>
    <p role="status" class="mb-3 text-[11px] text-muted">
      {{ filtered.length }} {{ filtered.length === 1 ? 'review' : 'reviews' }}
    </p>
    <WorkspaceReviewList
      v-if="filtered.length"
      :reviews="filtered.slice((page - 1) * size, page * size)"
    />
    <WorkspaceEmptyState
      v-else
      :title="
        snapshot?.reviews.length ? 'No matching reviews.' : 'Your review history starts here.'
      "
      :description="
        snapshot?.reviews.length
          ? 'Try another search or status filter.'
          : 'Choose an open pull request from a connected repository and request a review.'
      "
    />
    <nav
      v-if="filtered.length > size"
      aria-label="Review pages"
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
      <span>Page {{ page }} of {{ Math.ceil(filtered.length / size) }}</span>
      <button
        type="button"
        :disabled="page * size >= filtered.length"
        class="min-h-10 rounded-lg border border-border px-3 disabled:text-muted"
        @click="page++"
      >
        Next
      </button>
    </nav>
  </div>
</template>
