<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowDown01Icon, GithubIcon } from '@hugeicons/core-free-icons'

function exploreSample() {
  const preview = document.getElementById('sample-review')
  if (!preview) return
  preview.focus({ preventScroll: true })
  preview.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start'
  })
}
</script>

<template>
  <section aria-labelledby="hero-heading" class="px-5 pt-9 pb-16 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
    <div class="relative mx-auto max-w-7xl">
      <MarketingHeroCodeAccents />
      <div class="relative mx-auto max-w-4xl text-center">
      <p class="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[11px] font-semibold tracking-wide text-ink motion-safe:animate-hero-enter sm:text-xs">
        <span class="size-1.5 rounded-full bg-brand" aria-hidden="true" />
        Small diff. Bigger picture.
      </p>

      <h1 id="hero-heading" class="mt-7 text-[42px] leading-[1.12] font-semibold tracking-[-1.9px] text-balance motion-safe:animate-hero-enter [animation-delay:70ms] sm:text-[60px] sm:tracking-[-2.8px] lg:text-[72px] lg:tracking-[-3.4px]">
        Understand every change <span class="text-brand-display sm:block">before you <span class="relative inline-block">merge.<span aria-hidden="true" class="absolute -bottom-1 inset-x-0 h-2 -rotate-2 rounded-[50%] border-b-[3px] border-brand/50 sm:-bottom-2 sm:border-b-4" /></span></span>
      </h1>

      <p class="mx-auto mt-6 max-w-160 text-[15px] leading-[1.85] text-pretty text-muted motion-safe:animate-hero-enter [animation-delay:130ms] sm:text-base">
        Review pull requests, spot potential issues, and check changes against your team’s architecture rules—with clear explanations grounded in your code.
      </p>

      <div class="mt-8 flex flex-col items-stretch justify-center gap-3 motion-safe:animate-hero-enter focus-within:animate-none [animation-delay:190ms] sm:flex-row sm:items-center">
        <NuxtLink to="/sign-in" class="flex min-h-13 items-center justify-center gap-2.5 rounded-lg bg-brand px-5 py-3.5 text-sm font-semibold text-ink transition-shadow duration-200 hover:shadow-sm motion-reduce:transition-none">
          <HugeiconsIcon :icon="GithubIcon" :size="19" aria-hidden="true" />
          Get started with GitHub
        </NuxtLink>
        <button type="button" class="group flex min-h-13 items-center justify-center gap-3 rounded-lg border border-border bg-surface px-5 py-3.5 text-sm font-semibold transition-[background-color,border-color,box-shadow,translate] duration-200 ease-out hover:border-brand/40 hover:bg-brand-soft hover:shadow-sm motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none" @click="exploreSample">
          Explore a sample review
          <HugeiconsIcon :icon="ArrowDown01Icon" :size="17" class="transition-[translate] duration-200 motion-safe:group-hover:translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </button>
      </div>

      <p class="mt-5 text-xs tracking-wide text-muted">Your code. Your rules. Your call.</p>
      </div>
    </div>

    <div data-reveal data-reveal-delay="80" class="mx-auto mt-12 max-w-6xl sm:mt-14 lg:mt-16">
      <MarketingHeroReviewPreview />
      <p class="mt-5 text-center text-[11px] leading-relaxed text-muted sm:text-xs">
        A sample of the review experience. Clear context, evidence, and a way forward.
      </p>
    </div>
  </section>
</template>
