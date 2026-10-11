<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import type { RouteLocationRaw } from 'vue-router'
import {
  GitBranchIcon,
  GitPullRequestIcon,
  Shield01Icon,
  Layers01Icon,
  ArrowUpRight01Icon
} from '@hugeicons/core-free-icons'

defineProps<{
  kind: 'reviews' | 'findings' | 'repositories' | 'rules'
  label: string
  value: number
  note: string
  detail: string
  segments: number[]
  destination: RouteLocationRaw
}>()
const icons = {
  reviews: GitPullRequestIcon,
  findings: Shield01Icon,
  repositories: GitBranchIcon,
  rules: Layers01Icon
}
</script>

<template>
  <NuxtLink
    :to="destination"
    class="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-[border-color,box-shadow,translate] duration-200 hover:border-ink/20 hover:shadow-card motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="text-[11px] font-medium text-muted">{{ label }}</p>
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-md border"
        :class="
          kind === 'findings'
            ? 'border-brand/10 bg-brand-soft text-brand-dark'
            : 'border-success/10 bg-success-soft text-success'
        "
      >
        <HugeiconsIcon :icon="icons[kind]" :size="14" aria-hidden="true" />
      </span>
    </div>
    <div class="mt-2 flex items-end justify-between gap-3">
      <p class="text-[30px] leading-none font-semibold tracking-[-1px] tabular-nums">{{ value }}</p>
      <HugeiconsIcon
        :icon="ArrowUpRight01Icon"
        :size="14"
        class="text-muted/60 transition-[translate,color] duration-200 group-hover:text-ink motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </div>
    <p class="sr-only">{{ note }}</p>
    <div class="mt-3 flex h-1 overflow-hidden rounded-full bg-paper" aria-hidden="true">
      <span
        v-for="(segment, index) in segments"
        :key="index"
        class="h-full transition-[width] duration-500 motion-reduce:transition-none"
        :class="
          kind === 'findings' && index === 0
            ? 'bg-brand'
            : index === 0
              ? getStatusAppearance('completed').fill
              : kind === 'findings'
                ? getStatusAppearance('running').fill
                : 'bg-accent-slate'
        "
        :style="{
          width: `${segments.reduce((total, item) => total + item, 0) ? (segment / segments.reduce((total, item) => total + item, 0)) * 100 : 0}%`
        }"
      />
    </div>
    <p
      class="mt-2 text-[10px] leading-4 font-medium"
      :class="kind === 'findings' && value ? 'text-brand-dark' : 'text-muted'"
    >
      {{ detail }}
    </p>
  </NuxtLink>
</template>
