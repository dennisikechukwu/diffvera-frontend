<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  Shield01Icon,
  AlertCircleIcon,
  GitBranchIcon,
  ArrowUpRight01Icon
} from '@hugeicons/core-free-icons'

const { snapshot, path } = useWorkspace()
interface AttentionItem {
  id: string
  title: string
  detail: string
  label: string
  kind: 'finding' | 'failed' | 'access'
  to: string
}
const icons = { finding: Shield01Icon, failed: AlertCircleIcon, access: GitBranchIcon }
const items = computed(() => {
  const result: AttentionItem[] = []
  const visited = new Set<string>()
  for (const review of snapshot.value?.reviews ?? []) {
    if (visited.has(review.pullRequestId)) continue
    visited.add(review.pullRequestId)
    const pr = snapshot.value?.pullRequests.find((item) => item.id === review.pullRequestId)
    const repo = snapshot.value?.repositories.find((item) => item.id === pr?.repositoryId)
    const detail = `${repo?.fullName.split('/').at(-1) ?? 'Repository'} · #${pr?.number ?? ''} · ${review.headSha}`
    const finding =
      review.status === 'completed'
        ? review.findings.find((item) => item.severity === 'high' && !item.feedback)
        : undefined
    if (finding)
      result.push({
        id: review.id,
        title: finding.title,
        detail,
        label: 'High severity',
        kind: 'finding',
        to: `/dashboard/reviews/${review.id}`
      })
    else if (review.status === 'failed')
      result.push({
        id: review.id,
        title: 'A review needs another attempt.',
        detail,
        label: 'Failed review',
        kind: 'failed',
        to: `/dashboard/reviews/${review.id}`
      })
  }
  for (const repo of snapshot.value?.repositories ?? []) {
    if (repo.access === 'revoked')
      result.push({
        id: repo.id,
        title: 'Repository access was removed.',
        detail: repo.fullName,
        label: 'Connection',
        kind: 'access',
        to: `/dashboard/repositories/${repo.id}`
      })
  }
  return result
})
</script>

<template>
  <section
    aria-labelledby="attention-heading"
    class="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface"
  >
    <div class="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
      <div>
        <h2 id="attention-heading" class="text-sm font-semibold">Needs attention</h2>
        <p class="mt-2 text-[11px] leading-5 text-muted">Clear next steps for your workspace.</p>
      </div>
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-md bg-paper text-[11px] font-semibold tabular-nums"
      >
        {{ items.length }}
      </span>
    </div>
    <ul v-if="items.length" class="divide-y divide-border/70">
      <li v-for="item in items.slice(0, 3)" :key="item.id">
        <NuxtLink
          :to="path(item.to)"
          class="group flex items-start gap-3 px-5 py-4 transition-colors duration-200 hover:bg-paper motion-reduce:transition-none sm:px-6"
        >
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-lg border"
            :class="
              item.kind === 'access'
                ? 'border-border bg-paper text-muted'
                : 'border-brand/10 bg-brand-soft text-brand-dark'
            "
          >
            <HugeiconsIcon :icon="icons[item.kind]" :size="16" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p
              class="text-[9px] font-medium tracking-wide"
              :class="item.kind === 'access' ? 'text-muted' : 'text-brand-dark'"
            >
              {{ item.label }}
            </p>
            <h3 class="mt-1.5 text-xs leading-5 font-medium text-ink">{{ item.title }}</h3>
            <p class="mt-1.5 text-[10px] leading-5 break-words text-muted">{{ item.detail }}</p>
          </div>
          <HugeiconsIcon
            :icon="ArrowUpRight01Icon"
            :size="14"
            class="mt-1 shrink-0 text-muted/60 transition-colors group-hover:text-ink motion-reduce:transition-none"
            aria-hidden="true"
          />
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="px-5 py-6 text-xs leading-6 text-muted sm:px-6">
      No urgent review or connection issues to show.
    </p>
    <NuxtLink
      :to="path('/dashboard/reviews')"
      class="flex min-h-13 items-center justify-between gap-3 border-t border-border px-5 text-[11px] font-medium text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none sm:px-6"
    >
      Explore review history
      <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="15" aria-hidden="true" />
    </NuxtLink>
  </section>
</template>
