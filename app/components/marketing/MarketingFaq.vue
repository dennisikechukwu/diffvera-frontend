<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'

const questions = [
  {
    question: 'Which repositories can Diffvera access?',
    answer: 'Choose the repositories available to Diffvera when installing the GitHub App. Repository access follows the selection you make for your team.'
  },
  {
    question: 'How do I start a review?',
    answer: 'Select a pull request in a connected repository and manually request a review. You choose the change and when to review it.'
  },
  {
    question: 'Will Diffvera change my code or merge a pull request?',
    answer: 'Diffvera provides findings, explanations, and suggested corrections. It does not automatically modify code or merge pull requests. Your team decides which suggestions to apply and when to merge.'
  },
  {
    question: 'What does an architecture finding mean?',
    answer: 'It highlights a change that may conflict with a rule defined by your team, such as a dependency crossing a layer boundary. Assess the rule, the relevant code, and the explanation together.'
  },
  {
    question: 'What if I disagree with a finding?',
    answer: 'Use the evidence to assess the finding in context. Mark findings useful, false positives, or resolved as part of your review. The decision stays with your team.'
  }
]
</script>

<template>
  <section id="faq" tabindex="-1" aria-labelledby="faq-heading" class="scroll-mt-8 border-y border-border bg-surface px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div class="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
      <div data-reveal>
        <p class="mb-4 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">A few useful answers</p>
        <h2 id="faq-heading" class="max-w-80 text-[32px] leading-[1.15] font-semibold tracking-[-1.2px] text-balance sm:text-[42px] sm:tracking-[-1.7px]">Before you <span class="sm:block">dive in.</span></h2>
        <p class="mt-5 max-w-80 text-sm leading-7 text-muted">A clear workflow. A second perspective. Your team in control.</p>
      </div>

      <div data-reveal data-reveal-delay="80" class="min-w-0 border-t border-border">
        <details v-for="item in questions" :key="item.question" name="marketing-faq" class="group border-b border-border">
          <summary class="flex min-h-18 list-none items-center justify-between gap-5 rounded-sm py-5 text-sm leading-6 font-medium transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            {{ item.question }}
            <HugeiconsIcon :icon="ArrowDown01Icon" :size="17" class="shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
          </summary>
          <p class="max-w-150 pb-6 pr-5 text-[13px] leading-7 text-pretty text-muted motion-safe:group-open:animate-disclosure-in">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
