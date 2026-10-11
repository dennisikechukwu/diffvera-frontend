<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
const { snapshot, path, busy, isPending, actionError, requestReview } = useWorkspace()
const route = useRoute()
const repository = computed(() =>
  snapshot.value?.repositories.find((repo) => repo.id === route.params.repositoryId)
)
const pr = computed(() =>
  snapshot.value?.pullRequests.find(
    (item) => item.id === route.params.pullRequestId && item.repositoryId === repository.value?.id
  )
)
const reviews = computed(
  () => snapshot.value?.reviews.filter((review) => review.pullRequestId === pr.value?.id) ?? []
)
</script>

<template>
  <div>
    <NuxtLink
      :to="path(`/dashboard/repositories/${route.params.repositoryId}`)"
      class="mb-5 inline-flex min-h-8 items-center gap-2 rounded-sm text-xs text-muted"
    >
      <HugeiconsIcon :icon="ArrowLeft01Icon" :size="15" aria-hidden="true" />
      Pull requests
    </NuxtLink>
    <WorkspaceEmptyState
      v-if="!pr || !repository"
      title="Pull request not found."
      description="This pull request is not available in the selected repository."
    />
    <template v-else>
      <WorkspacePageHeader
        :eyebrow="`${repository.fullName} / #${pr.number}`"
        :title="pr.title"
        :description="`${pr.author} · ${pr.branch} · ${pr.headSha}`"
      >
        <UiAsyncButton
          type="button"
          :disabled="busy || pr.status !== 'open' || repository.access !== 'available'"
          class="min-h-11 rounded-lg bg-ink px-4 text-xs font-semibold text-white disabled:opacity-60"
          :loading="isPending(`review:${pr.id}`)"
          loading-text="Requesting…"
          @click="requestReview(repository.id, pr.id)"
        >
          Request review
        </UiAsyncButton>
      </WorkspacePageHeader>
      <p
        v-if="actionError"
        role="alert"
        class="mb-5 rounded-lg bg-brand-soft p-3 text-xs text-brand-dark"
      >
        {{ actionError }}
      </p>
      <div
        class="mb-7 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5"
      >
        <WorkspaceStatusBadge :status="pr.status" />
        <p v-if="pr.additions || pr.deletions" class="font-mono text-xs text-muted">
          <span class="font-semibold text-success">+{{ pr.additions }} additions</span>
          <span class="mx-1.5 text-border">·</span>
          <span class="font-semibold text-brand-dark">−{{ pr.deletions }} deletions</span>
        </p>
        <p v-else class="text-xs text-muted">Diff ready for review</p>
        <p class="text-xs text-muted">Updated {{ pr.updatedAt.slice(0, 10) }}</p>
      </div>
      <p
        v-if="pr.status !== 'open' || repository.access !== 'available'"
        class="mb-5 text-xs leading-6 text-muted"
      >
        New reviews require an open pull request and repository access. Existing review history
        remains available.
      </p>
      <h2 class="mb-4 text-base font-semibold">Review history</h2>
      <WorkspaceReviewList v-if="reviews.length" :reviews="reviews" />
      <WorkspaceEmptyState
        v-else
        title="No reviews for this pull request."
        description="Request a review to assess this change against its code context and your architecture rules."
      />
    </template>
  </div>
</template>
