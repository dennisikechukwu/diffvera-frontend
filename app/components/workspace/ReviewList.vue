<script setup lang="ts">
import type { Review } from '~/types/workspace'
defineProps<{ reviews: Review[]; embedded?: boolean }>()
const { snapshot, path } = useWorkspace()
function details(review: Review) {
  const pr = snapshot.value?.pullRequests.find((item) => item.id === review.pullRequestId)
  return { pr, repo: snapshot.value?.repositories.find((item) => item.id === pr?.repositoryId) }
}
</script>

<template>
  <ul
    class="divide-y divide-border overflow-hidden bg-surface"
    :class="embedded ? '' : 'rounded-xl border border-border'"
  >
    <li v-for="review in reviews" :key="review.id">
      <NuxtLink
        :to="path(`/dashboard/reviews/${review.id}`)"
        class="group flex flex-col justify-between gap-3 px-5 py-5 transition-all duration-200 hover:bg-paper/80 motion-reduce:transition-none sm:flex-row sm:items-center"
        :class="embedded ? 'sm:px-6' : ''"
      >
        <div class="min-w-0">
          <p class="text-sm font-medium break-words group-hover:text-brand-dark">
            {{ details(review).pr?.title ?? 'Pull request review' }}
            <span class="text-muted">#{{ details(review).pr?.number }}</span>
          </p>
          <p class="mt-2 text-[11px] break-words text-muted">
            {{ details(review).repo?.fullName }} ·
            <span class="font-mono">{{ review.headSha }}</span>
            ·
            {{ review.createdAt.slice(0, 10) }}
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <p v-if="review.status === 'completed'" class="text-xs text-muted">
            {{ review.findings.length }} {{ review.findings.length === 1 ? 'finding' : 'findings' }}
            <span v-if="review.findings.some((finding) => finding.feedback)">
              · {{ review.findings.filter((finding) => finding.feedback).length }} assessed
            </span>
          </p>
          <WorkspaceStatusBadge :status="review.status" />
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>
