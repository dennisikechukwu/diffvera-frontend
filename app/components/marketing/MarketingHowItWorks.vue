<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowRight01Icon, CheckmarkCircle02Icon, File01Icon, GithubIcon, GitPullRequestIcon, Search01Icon } from '@hugeicons/core-free-icons'

const steps = [
  {
    id: 'connect',
    title: 'Bring your repository.',
    description: 'Connect GitHub and choose which repositories Diffvera can access. Keep the review close to the code.',
    icon: GithubIcon,
    illustration: 'An example GitHub repository selected for access'
  },
  {
    id: 'choose',
    title: 'Choose the change.',
    description: 'Pick a pull request and request a review when you need one. Your team sets the pace.',
    icon: GitPullRequestIcon,
    illustration: 'An example pull request ready for a manually requested review'
  },
  {
    id: 'review',
    title: 'Make an informed call.',
    description: 'Read the findings, follow the evidence, and assess the suggested corrections. You decide what happens next.',
    icon: Search01Icon,
    illustration: 'An example review finding with its file and line reference'
  }
]
</script>

<template>
  <section id="how-it-works" tabindex="-1" aria-labelledby="how-it-works-heading" class="scroll-mt-8 border-t border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div class="mx-auto max-w-6xl">
      <div data-reveal class="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end lg:gap-16">
        <div>
          <p class="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
            <span class="h-px w-6 bg-brand" aria-hidden="true" />How it works
          </p>
          <h2 id="how-it-works-heading" class="max-w-145 text-[32px] leading-[1.15] font-semibold tracking-[-1.2px] text-balance sm:text-[42px] sm:tracking-[-1.7px]">
            From pull request <span class="sm:block">to a clearer next step.</span>
          </h2>
        </div>
        <p class="max-w-80 text-sm leading-7 text-pretty text-muted lg:pb-1">
          A second perspective on your code.<br class="hidden lg:block"> A decision that stays with your team.
        </p>
      </div>

      <ol class="grid overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-3">
        <li v-for="(step, index) in steps" :key="step.id" data-reveal :data-reveal-delay="index * 80" class="group flex min-w-0 flex-col gap-6 p-6 transition-colors duration-250 hover:bg-paper/60 motion-reduce:transition-none sm:p-7" :class="index > 0 ? 'border-t border-border md:border-t-0 md:border-l' : ''">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-muted tabular-nums">0{{ index + 1 }}</span>
            <HugeiconsIcon :icon="step.icon" :size="22" :stroke-width="1.6" class="text-ink transition-colors duration-250 group-hover:text-brand-dark motion-reduce:transition-none" aria-hidden="true" />
          </div>
          <div>
            <h3 class="text-lg font-semibold tracking-[-0.4px]">{{ step.title }}</h3>
            <p class="mt-3 text-[13px] leading-6 text-pretty text-muted">{{ step.description }}</p>
          </div>

          <div role="img" :aria-label="step.illustration" class="mt-auto flex min-h-30 flex-col justify-center rounded-lg border border-border bg-paper/60 p-4">
            <template v-if="step.id === 'connect'">
              <p class="mb-3 text-[10px] text-muted">Repository access</p>
              <div class="flex items-center gap-2.5">
                <HugeiconsIcon :icon="GithubIcon" :size="17" class="shrink-0" aria-hidden="true" />
                <span class="min-w-0 truncate font-mono text-[11px]">example / storefront</span>
                <HugeiconsIcon :icon="CheckmarkCircle02Icon" :size="16" class="ml-auto shrink-0 text-brand-dark" aria-hidden="true" />
              </div>
              <p class="mt-3 text-[10px] text-muted">Access to the repositories you select.</p>
            </template>
            <template v-else-if="step.id === 'choose'">
              <div class="mb-3 flex items-center justify-between gap-2 text-[10px] text-muted">
                <span>Pull request</span><span class="font-mono">#42</span>
              </div>
              <p class="text-xs font-medium">Add order details endpoint</p>
              <p class="mt-3 flex items-center gap-1.5 text-[10px] text-brand-dark">
                <span class="size-1.5 rounded-full bg-brand" aria-hidden="true" />Manually requested review
              </p>
            </template>
            <template v-else>
              <p class="mb-3 flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <HugeiconsIcon :icon="File01Icon" :size="12" aria-hidden="true" />orders.ts :28
              </p>
              <p class="text-xs font-medium">Missing ownership check</p>
              <p class="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-brand-dark">Evidence <HugeiconsIcon :icon="ArrowRight01Icon" :size="12" aria-hidden="true" /> explanation <HugeiconsIcon :icon="ArrowRight01Icon" :size="12" aria-hidden="true" /> correction</p>
            </template>
          </div>
        </li>
      </ol>

      <p class="mt-6 text-center text-xs leading-6 text-muted">
        You review the suggestions. Your team owns the merge.
      </p>
    </div>
  </section>
</template>
