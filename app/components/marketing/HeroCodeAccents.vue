<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowTurnDownIcon, GitMergeIcon, Layers01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <div id="hero-decorations" aria-hidden="true" class="pointer-events-none absolute inset-0 hidden select-none xl:block">
    <div data-hero-drift class="absolute top-17 left-1 -rotate-4 rounded-xl border border-border bg-surface p-3.5 shadow-preview motion-safe:animate-hero-drift [animation-delay:-1.5s] [animation-duration:5.6s]">
      <p class="mb-2.5 flex items-center justify-between gap-10 font-mono text-[9px] text-muted">
        <span>the small things</span><span>±</span>
      </p>
      <div class="space-y-1 font-mono text-[11px]">
        <p class="rounded bg-accent-stone/60 px-2 py-1 text-muted">− trust the change</p>
        <p class="rounded bg-brand-soft px-2 py-1 text-brand-dark">+ understand it</p>
      </div>
    </div>

    <div data-hero-drift class="absolute top-22 right-9 rotate-5 motion-safe:animate-hero-drift [animation-delay:-3s] [animation-duration:6.4s]">
      <div class="flex size-21 items-center justify-center rounded-2xl border border-brand bg-brand shadow-preview">
        <HugeiconsIcon :icon="GitMergeIcon" :size="38" class="text-ink" :stroke-width="1.5" />
      </div>
      <span class="absolute -right-3 -bottom-3 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[9px] text-brand-dark">merge with context</span>
    </div>

    <div data-hero-drift class="absolute bottom-12 left-14 rotate-3 motion-safe:animate-hero-drift [animation-delay:-2s] [animation-duration:6s]">
      <div class="flex size-15 items-center justify-center rounded-xl border border-border bg-accent-slate text-ink shadow-preview">
        <HugeiconsIcon :icon="Layers01Icon" :size="28" :stroke-width="1.5" />
      </div>
      <p class="mt-2 font-mono text-[9px] text-muted">// keep the bigger picture</p>
    </div>

    <div data-hero-drift class="absolute right-8 bottom-0 rotate-3 text-brand-dark motion-safe:animate-hero-drift [animation-delay:-3.5s] [animation-duration:7s]">
      <p class="text-left text-sm leading-relaxed font-medium italic">A little context.<br>A better call.</p>
      <HugeiconsIcon :icon="ArrowTurnDownIcon" :size="46" :stroke-width="1.3" class="mt-2 ml-19 -rotate-10" />
    </div>
  </div>
</template>
