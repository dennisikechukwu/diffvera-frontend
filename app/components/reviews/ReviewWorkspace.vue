<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowLeft01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import type { ChangedFile } from '~/types/workspace'

const { snapshot, path, requestReview, busy, isPending, actionError, loading } = useWorkspace()
const route = useRoute()
const review = computed(() =>
  snapshot.value?.reviews.find((item) => item.id === route.params.reviewId)
)
const pr = computed(() =>
  snapshot.value?.pullRequests.find((item) => item.id === review.value?.pullRequestId)
)
const repository = computed(() =>
  snapshot.value?.repositories.find((repo) => repo.id === pr.value?.repositoryId)
)
const category = ref('all')
const severity = ref('all')
const scope = ref<'all' | 'file'>('file')
const selectedFile = ref('')
const highlightedRange = ref<{ start: number; end: number } | null>(null)
const sourceError = ref('')

const detailedFiles = ref<ChangedFile[]>([])
const loadingDiffs = ref(false)

const allFiles = computed<ChangedFile[]>(() => {
  if (detailedFiles.value.length > 0) return detailedFiles.value
  return review.value?.files ?? []
})

const file = computed(
  () =>
    allFiles.value.find((item) => item.path === selectedFile.value) ?? allFiles.value[0]
)
function selectFile(path: string) {
  selectedFile.value = path
  highlightedRange.value = null
  sourceError.value = ''
}
const scopedFindings = computed(
  () =>
    review.value?.findings.filter(
      (item) => scope.value === 'all' || item.file === file.value?.path
    ) ?? []
)
const findings = computed(() =>
  scopedFindings.value.filter(
    (item) =>
      (category.value === 'all' || item.category === category.value) &&
      (severity.value === 'all' || item.severity === severity.value)
  )
)
async function resetFilters() {
  category.value = 'all'
  severity.value = 'all'
  await nextTick()
  document.getElementById('finding-category')?.focus()
}
async function showAllFindings() {
  scope.value = 'all'
  await nextTick()
  document.getElementById('finding-scope-all')?.focus()
}

async function loadReviewDiffs() {
  if (!review.value || ['queued', 'running', 'failed'].includes(review.value.status)) {
    return
  }
  if (detailedFiles.value.length > 0) return
  if (review.value.files && review.value.files.length > 0) {
    detailedFiles.value = review.value.files
    return
  }

  loadingDiffs.value = true
  try {
    const detail = await $fetch<{ files?: ChangedFile[] }>(
      `/api/v1/reviews/${route.params.reviewId}`,
      { credentials: 'include' }
    )
    if (detail?.files && detail.files.length > 0) {
      detailedFiles.value = detail.files
    }
  } catch {
    // Diff fetch fallback
  } finally {
    loadingDiffs.value = false
  }
}

onMounted(() => {
  loadReviewDiffs()
})

watch(
  () => [route.params.reviewId, review.value?.status],
  ([newId, newStatus], [oldId, oldStatus]) => {
    category.value = 'all'
    severity.value = 'all'
    scope.value = 'file'
    selectedFile.value = ''
    highlightedRange.value = null
    sourceError.value = ''
    if (newId !== oldId) {
      detailedFiles.value = []
    }
    if (newStatus === 'completed' && (oldStatus !== 'completed' || detailedFiles.value.length === 0)) {
      loadReviewDiffs()
    }
  }
)

async function showSource(filePath: string, start: number, end: number) {
  if (!allFiles.value.some((item) => item.path === filePath)) {
    sourceError.value = 'The code excerpt for this finding is not available.'
    return
  }
  sourceError.value = ''
  selectedFile.value = filePath
  highlightedRange.value = { start, end }
  await nextTick()
  const target = document.getElementById('changed-file')
  target?.focus({ preventScroll: true })
  const evidence = document.getElementById(`source-line-${start}`) ?? target
  evidence?.scrollIntoView({
    block: 'center',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  })
}
</script>

<template>
  <div>
    <NuxtLink
      :to="path('/dashboard/reviews')"
      class="mb-5 inline-flex min-h-8 items-center gap-2 rounded-sm text-xs text-muted"
    >
      <HugeiconsIcon :icon="ArrowLeft01Icon" :size="15" aria-hidden="true" />
      Review history
    </NuxtLink>
    <div
      v-if="loading && (!review || !pr || !repository)"
      role="status"
      class="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface p-12 text-sm text-muted"
    >
      <div class="flex flex-col items-center gap-3">
        <UiSpinner :size="24" />
        <span>Loading review workspace…</span>
      </div>
    </div>
    <WorkspaceEmptyState
      v-else-if="!review || !pr || !repository"
      title="Review not found."
      description="This review is not available in your workspace. Return to review history to find another review."
    />
    <template v-else>
      <WorkspacePageHeader
        :eyebrow="`${repository.fullName} / #${pr.number}`"
        :title="pr.title"
        :description="`${review.status === 'completed' ? 'Reviewed' : 'Requested'} commit ${review.headSha} · ${review.createdAt.slice(0, 10)}`"
      >
        <WorkspaceStatusBadge :status="review.status" />
      </WorkspacePageHeader>
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <NuxtLink
          :to="path(`/dashboard/repositories/${repository.id}/pull-requests/${pr.id}`)"
          class="inline-flex items-center gap-2 rounded-sm text-xs font-medium text-muted hover:text-ink"
        >
          View pull request and history
          <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="15" aria-hidden="true" />
        </NuxtLink>
        <UiAsyncButton
          v-if="!['queued', 'running'].includes(review.status)"
          type="button"
          :disabled="busy || pr.status !== 'open' || repository.access !== 'available'"
          class="min-h-10 rounded-lg bg-ink px-4 text-xs font-semibold text-white disabled:opacity-60"
          :loading="isPending(`review:${pr.id}`)"
          loading-text="Requesting…"
          @click="requestReview(repository.id, pr.id)"
        >
          {{
            review.status === 'failed'
              ? 'Retry review'
              : review.headSha !== pr.headSha
                ? 'Review latest commit'
                : 'Request another review'
          }}
        </UiAsyncButton>
      </div>
      <p
        v-if="actionError"
        role="alert"
        class="mb-4 rounded-lg bg-brand-soft p-3 text-xs text-brand-dark"
      >
        {{ actionError }}
      </p>
      <p
        v-if="review.headSha !== pr.headSha"
        class="mb-5 rounded-lg border border-border bg-surface p-4 text-xs leading-6 break-words text-muted"
      >
        New commits have been added since this review. These findings cover
        <span class="font-mono text-ink">{{ review.headSha }}</span>
        ; the pull request now points to
        <span class="font-mono text-ink">{{ pr.headSha }}</span>
        .
      </p>
      <div
        v-if="review.status === 'queued' || review.status === 'running'"
        role="status"
        class="rounded-xl border border-border bg-surface p-8"
      >
        <div class="mb-5 flex items-center gap-3">
          <span
            class="flex size-11 items-center justify-center rounded-xl border"
            :class="getStatusAppearance(review.status).badge"
          >
            <UiSpinner :size="22" />
          </span>
          <WorkspaceStatusBadge :status="review.status" />
        </div>
        <p class="text-lg font-semibold">
          {{ review.status === 'queued' ? 'Your review is queued.' : 'Reviewing the change.' }}
        </p>
        <p class="mt-3 text-sm leading-6 text-muted">
          {{
            review.status === 'queued'
              ? 'The review request has been added to the queue.'
              : 'Assessing the changed code and the repository’s architecture rules.'
          }}
          You can return to history while this review progresses.
        </p>
        <ol class="mt-6 flex flex-wrap gap-3 text-xs text-muted">
          <li class="rounded-md border border-border px-3 py-2">1. Queued</li>
          <li
            class="rounded-md border border-border px-3 py-2"
            :class="
              review.status === 'running' ? 'border-progress/20 bg-progress-soft text-progress' : ''
            "
          >
            2. Reviewing
          </li>
          <li class="rounded-md border border-border px-3 py-2">3. Findings ready</li>
        </ol>
      </div>
      <WorkspaceEmptyState
        v-else-if="review.status === 'failed'"
        title="The review could not be completed."
        :description="review.failureReason || 'No findings were produced. Retry the review, or return to the pull request to check its current state.'"
      />
      <div
        v-else-if="loadingDiffs"
        role="status"
        class="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface p-12 text-sm text-muted"
      >
        <div class="flex flex-col items-center gap-3">
          <UiSpinner :size="24" />
          <span>Loading changed files and code diffs…</span>
        </div>
      </div>
      <template v-else>
        <ReviewsFindingFilters
          v-model:scope="scope"
          v-model:category="category"
          v-model:severity="severity"
          :file-count="allFiles.length"
          :finding-count="review.findings.length"
        />
        <p v-if="sourceError" role="alert" class="mb-4 text-xs text-brand-dark">
          {{ sourceError }}
        </p>
        <div
          class="grid items-start gap-4 xl:grid-cols-2 2xl:grid-cols-[220px_minmax(0,1.05fr)_minmax(0,1fr)]"
        >
          <ReviewsFileNavigator
            :key="review.id"
            :files="allFiles"
            :findings="review.findings"
            :selected-path="file?.path ?? ''"
            class="xl:col-span-2 2xl:col-span-1 2xl:sticky 2xl:top-5"
            @select="selectFile"
          />
          <ReviewsCodePane
            v-if="file"
            :file="file"
            :highlighted-range="highlightedRange"
            class="min-w-0 xl:sticky xl:top-5"
          />
          <WorkspaceEmptyState
            v-else
            title="No code excerpt available."
            description="Changed code is not available for this review. Return to the pull request to inspect the change."
          />
          <div class="min-w-0">
            <p role="status" class="mb-3 text-xs text-muted">
              {{ findings.length }} {{ findings.length === 1 ? 'finding' : 'findings' }} shown
              <span v-if="scope === 'file'">for the current file</span>
              <span v-else>across all files</span>
            </p>
            <div v-if="findings.length" class="space-y-5">
              <ReviewsFindingCard
                v-for="finding in findings"
                :key="finding.id"
                :finding="finding"
                :review-id="review.id"
                @source="showSource"
              />
            </div>
            <WorkspaceEmptyState
              v-else
              :title="
                !review.findings.length
                  ? 'No findings reported.'
                  : !scopedFindings.length
                    ? 'No findings for this file.'
                    : 'No findings match these filters.'
              "
              :description="
                !review.findings.length
                  ? 'No findings were reported for this commit. Review the change with your team before merging.'
                  : !scopedFindings.length
                    ? 'Other files have findings. Choose another file or view all files to continue reviewing.'
                    : 'Try another category or severity.'
              "
            >
              <button
                v-if="category !== 'all' || severity !== 'all'"
                type="button"
                class="min-h-10 rounded-lg border border-border bg-surface px-3 text-xs font-medium"
                @click="resetFilters"
              >
                Clear finding filters
              </button>
              <button
                v-else-if="review.findings.length && !scopedFindings.length"
                type="button"
                class="min-h-10 rounded-lg border border-border bg-surface px-3 text-xs font-medium"
                @click="showAllFindings"
              >
                View findings in all files
              </button>
            </WorkspaceEmptyState>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
