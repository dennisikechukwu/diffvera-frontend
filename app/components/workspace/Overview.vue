<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { GitPullRequestIcon, ArrowUpRight01Icon, Layers01Icon } from '@hugeicons/core-free-icons'
const { snapshot, path } = useWorkspace()
const completed = computed(
  () => snapshot.value?.reviews.filter((review) => review.status === 'completed') ?? []
)
const findings = computed(() => completed.value.flatMap((review) => review.findings))
const awaiting = computed(() => findings.value.filter((finding) => !finding.feedback))
const high = computed(() => awaiting.value.filter((finding) => finding.severity === 'high').length)
const connected = computed(
  () => snapshot.value?.repositories.filter((repo) => repo.access === 'available').length ?? 0
)
const rules = computed(() => snapshot.value?.rules.filter((rule) => rule.enabled).length ?? 0)
const metrics = computed(() => [
  {
    kind: 'reviews' as const,
    name: 'Completed reviews',
    value: completed.value.length,
    note: 'Recorded review runs',
    detail: `${completed.value.length} of ${snapshot.value?.reviews.length ?? 0} requests complete`,
    segments: [
      completed.value.length,
      (snapshot.value?.reviews.length ?? 0) - completed.value.length
    ],
    to: '/dashboard/reviews'
  },
  {
    kind: 'findings' as const,
    name: 'Findings to assess',
    value: awaiting.value.length,
    note: 'Awaiting your assessment',
    detail: `${high.value} high severity · ${awaiting.value.length - high.value} other findings`,
    segments: [high.value, awaiting.value.length - high.value],
    to: '/dashboard/reviews'
  },
  {
    kind: 'repositories' as const,
    name: 'Connected repositories',
    value: connected.value,
    note: 'Available for pull request review',
    detail: `${(snapshot.value?.repositories.length ?? 0) - connected.value} with access removed`,
    segments: [connected.value, (snapshot.value?.repositories.length ?? 0) - connected.value],
    to: '/dashboard/repositories'
  },
  {
    kind: 'rules' as const,
    name: 'Architecture rules',
    value: rules.value,
    note: 'Enabled for future reviews',
    detail: `${rules.value} enabled · ${(snapshot.value?.rules.length ?? 0) - rules.value} disabled`,
    segments: [rules.value, (snapshot.value?.rules.length ?? 0) - rules.value],
    to: '/dashboard/rules'
  }
])
</script>

<template>
  <div>
    <WorkspacePageHeader
      eyebrow="Workspace intelligence"
      title="Overview"
      description="A clearer picture of your code, your reviews, and the decisions ahead."
    >
      <NuxtLink
        :to="path('/dashboard/repositories')"
        class="inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition-[background-color,box-shadow] duration-200 hover:bg-editor hover:shadow-card motion-reduce:transition-none"
      >
        <HugeiconsIcon :icon="GitPullRequestIcon" :size="17" aria-hidden="true" />
        Review a pull request
      </NuxtLink>
    </WorkspacePageHeader>
    <WorkspaceEmptyState
      v-if="!snapshot?.repositories.length"
      title="Connect your first repository."
      description="Choose repository access through the Diffvera GitHub App, then select a pull request to review."
    >
      <NuxtLink
        :to="path('/onboarding/github')"
        class="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 text-xs font-semibold text-white"
      >
        Connect repositories
      </NuxtLink>
    </WorkspaceEmptyState>
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WorkspaceMetricCard
          v-for="metric in metrics"
          :key="metric.name"
          :destination="path(metric.to)"
          :kind="metric.kind"
          :label="metric.name"
          :value="metric.value"
          :note="metric.note"
          :detail="metric.detail"
          :segments="metric.segments"
        />
      </div>
      <div class="mt-4 grid items-start gap-4 xl:grid-cols-4">
        <div class="min-w-0 space-y-4 xl:col-span-3">
          <WorkspaceReviewActivity :reviews="snapshot.reviews" />
          <section
            aria-labelledby="recent-reviews-heading"
            class="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div
              class="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 sm:p-6"
            >
              <div>
                <h2 id="recent-reviews-heading" class="text-sm font-semibold">Recent reviews</h2>
                <p class="mt-2 text-[11px] text-muted">
                  Latest requests and their recorded commits
                </p>
              </div>
              <NuxtLink
                :to="path('/dashboard/reviews')"
                class="group flex min-h-10 items-center gap-2 rounded-sm text-xs font-medium text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none"
              >
                View history
                <HugeiconsIcon
                  :icon="ArrowUpRight01Icon"
                  :size="16"
                  class="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
            <WorkspaceReviewList
              v-if="snapshot.reviews.length"
              :reviews="snapshot.reviews.slice(0, 5)"
              embedded
            />
            <WorkspaceEmptyState
              v-else
              class="mt-4"
              title="No reviews yet."
              description="Open a repository and manually request your first pull request review."
            />
          </section>
        </div>

        <div class="min-w-0 space-y-4 xl:col-span-1">
          <WorkspaceReviewAttention />
          <div class="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div>
              <h2 class="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon
                  :icon="Layers01Icon"
                  :size="17"
                  class="text-muted"
                  aria-hidden="true"
                />
                Architecture context
              </h2>
              <p class="mt-2 text-xs leading-6 text-muted">
                {{ rules }} enabled {{ rules === 1 ? 'rule' : 'rules' }} guide future reviews. Keep
                your team’s boundaries up to date.
              </p>
            </div>
            <NuxtLink
              :to="path('/dashboard/rules')"
              class="group mt-3 inline-flex min-h-10 items-center gap-2 rounded-sm text-xs font-semibold text-brand-dark"
            >
              Review your rules
              <HugeiconsIcon
                :icon="ArrowUpRight01Icon"
                :size="16"
                class="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
