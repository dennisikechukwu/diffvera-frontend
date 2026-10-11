<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { Bug01Icon, File01Icon, Layers01Icon, Shield01Icon } from '@hugeicons/core-free-icons'

const features = [
  {
    title: 'Follow the logic.',
    category: 'Correctness',
    description: 'Look at how the change behaves, including the edge cases that are easy to miss in a busy pull request.',
    icon: Bug01Icon,
    examples: ['Boundary conditions', 'Missing checks', 'Failure paths']
  },
  {
    title: 'Question the access.',
    category: 'Security',
    description: 'Examine who can reach the data and which assumptions the code makes about identity and input.',
    icon: Shield01Icon,
    examples: ['Ownership checks', 'Input handling', 'Data exposure']
  },
  {
    title: 'Respect the boundaries.',
    category: 'Architecture',
    description: 'Check the change against your team’s rules, so a small shortcut doesn’t become a lasting dependency.',
    icon: Layers01Icon,
    examples: ['Layer dependencies', 'Module boundaries', 'Team conventions']
  }
]
</script>

<template>
  <section id="features" tabindex="-1" aria-labelledby="features-heading" class="scroll-mt-8 border-y border-border bg-surface px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div class="mx-auto max-w-6xl">
      <div data-reveal class="mx-auto mb-12 max-w-170 text-center sm:mb-16">
        <p class="mb-4 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">A closer look at the change</p>
        <h2 id="features-heading" class="text-[32px] leading-[1.15] font-semibold tracking-[-1.2px] text-balance sm:text-[42px] sm:tracking-[-1.7px]">A review you can reason with.</h2>
        <p class="mx-auto mt-5 max-w-130 text-sm leading-7 text-pretty text-muted">Correctness, security, and architecture—with the context to understand why a finding matters.</p>
      </div>

      <div class="grid gap-9 md:grid-cols-3 md:gap-0">
        <article v-for="(feature, index) in features" :key="feature.category" data-reveal :data-reveal-delay="index * 80" class="group flex min-w-0 flex-col" :class="index > 0 ? 'border-t border-border pt-9 md:border-t-0 md:border-l md:pt-0 md:pl-8 lg:pl-10' : 'md:pr-8 lg:pr-10'">
          <div class="mb-6 flex items-center gap-2.5 text-brand-dark">
            <HugeiconsIcon :icon="feature.icon" :size="20" :stroke-width="1.6" aria-hidden="true" />
            <p class="text-xs font-medium">{{ feature.category }}</p>
          </div>
          <h3 class="text-xl font-semibold tracking-[-0.6px] transition-colors duration-250 group-hover:text-brand-dark motion-reduce:transition-none">{{ feature.title }}</h3>
          <p class="mt-3 max-w-85 text-[13px] leading-6 text-pretty text-muted" :class="index === 1 ? 'md:pr-8 lg:pr-10' : ''">{{ feature.description }}</p>
          <ul class="mt-auto grid gap-2.5 pt-6" :class="index === 1 ? 'md:pr-6' : ''">
            <li v-for="example in feature.examples" :key="example" class="flex items-center gap-2 text-xs text-muted"><span class="size-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />{{ example }}</li>
          </ul>
        </article>
      </div>

      <div data-reveal class="mt-12 flex flex-col justify-between gap-5 rounded-xl border border-border bg-paper/60 p-5 sm:mt-14 sm:flex-row sm:items-center sm:p-6">
        <div class="flex items-start gap-3">
          <HugeiconsIcon :icon="File01Icon" :size="20" class="mt-0.5 shrink-0 text-brand-dark" aria-hidden="true" />
          <div>
            <p class="text-sm font-medium">Context you can follow back to the code.</p>
            <p class="mt-1.5 text-xs leading-6 text-muted">File paths, line references, explanations, and suggested corrections.</p>
          </div>
        </div>
        <a href="#sample-review" class="shrink-0 self-start rounded-sm text-xs font-semibold text-brand-dark underline decoration-brand/40 underline-offset-4 transition-colors duration-200 hover:decoration-brand-dark motion-reduce:transition-none sm:self-auto">See it in the sample review</a>
      </div>
    </div>
  </section>
</template>
