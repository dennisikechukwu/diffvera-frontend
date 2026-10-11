<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowRight01Icon, GithubIcon, GitPullRequestIcon } from '@hugeicons/core-free-icons'
</script>

<template>
  <section aria-labelledby="final-cta-heading" class="px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
    <div data-reveal class="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-surface shadow-preview">
      <div class="h-px bg-brand/60" aria-hidden="true" />
      <div class="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-16 lg:p-12">
        <div>
          <p class="mb-5 flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
            <HugeiconsIcon :icon="GitPullRequestIcon" :size="15" class="text-brand-dark" aria-hidden="true" />Your next pull request
          </p>
          <h2 id="final-cta-heading" class="text-[32px] leading-[1.14] font-semibold tracking-[-1.2px] text-balance sm:text-[42px] sm:tracking-[-1.7px]">Bring clarity <span class="sm:block">to your next merge.</span></h2>
          <p class="mt-4 max-w-115 text-sm leading-7 text-pretty text-muted">Review the change. Understand the reasoning.<br class="hidden sm:block"> Decide with your team.</p>
        </div>
        <div class="w-full sm:max-w-85 lg:w-75">
          <NuxtLink to="/sign-in" class="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-lg bg-brand px-5 py-3.5 text-sm font-semibold text-ink transition-shadow duration-200 hover:shadow-sm motion-reduce:transition-none">
            <HugeiconsIcon :icon="GithubIcon" :size="19" aria-hidden="true" />Get started with GitHub
          </NuxtLink>
          <a href="#sample-review" class="group mt-3 flex min-h-13 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-5 py-3.5 text-sm font-semibold transition-[background-color,border-color,box-shadow,translate] duration-200 ease-out hover:border-brand/40 hover:bg-brand-soft hover:shadow-sm motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none">
            See the sample review
            <HugeiconsIcon :icon="ArrowRight01Icon" :size="16" class="transition-[translate] duration-200 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </a>
          <p class="mt-4 text-center text-[11px] text-muted">AI assistance. Human decisions.</p>
        </div>
      </div>
    </div>
  </section>
</template>
