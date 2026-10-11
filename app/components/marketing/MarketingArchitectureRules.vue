<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowDown01Icon, ArrowRight01Icon, File01Icon, Layers01Icon } from '@hugeicons/core-free-icons'

const exampleLines = [
  { number: 12, text: 'import { orderController }', highlighted: true },
  { number: 13, text: "  from '../controllers/orders'", highlighted: true },
  { number: 14, text: '' },
  { number: 15, text: 'export async function loadOrder(id: string) {' },
  { number: 16, text: '  return orderController.findById(id)' },
  { number: 17, text: '}' }
]
</script>

<template>
  <section id="architecture-rules" tabindex="-1" aria-labelledby="architecture-heading" class="scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div class="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div data-reveal>
        <p class="mb-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
          <span class="h-px w-6 bg-brand" aria-hidden="true" />Your architecture, in the review
        </p>
        <h2 id="architecture-heading" class="max-w-115 text-[32px] leading-[1.15] font-semibold tracking-[-1.2px] text-balance sm:text-[42px] sm:tracking-[-1.7px]">Good boundaries deserve a second look.</h2>
        <p class="mt-5 max-w-105 text-sm leading-7 text-pretty text-muted">Make your team’s architecture rules part of the conversation. Trace a potential violation to the change that introduced it, with an explanation you can act on.</p>

        <div class="mt-8 max-w-105 border-l-2 border-brand pl-5">
          <p class="mb-2 text-[10px] tracking-wide text-muted uppercase">Example team rule</p>
          <p class="text-sm leading-6 font-medium">Service modules must not import controller modules.</p>
          <p class="mt-2 text-xs leading-6 text-muted">Keep business logic independent of the HTTP layer.</p>
        </div>

        <p class="mt-7 text-xs leading-6 text-muted">Your team defines the boundary. The review brings the evidence.</p>
      </div>

      <article data-reveal data-reveal-delay="80" aria-labelledby="architecture-example-heading" class="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-preview">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4 sm:px-6">
          <h3 id="architecture-example-heading" class="flex items-center gap-2 text-xs font-medium">
            <HugeiconsIcon :icon="Layers01Icon" :size="16" class="text-brand-dark" aria-hidden="true" />Architecture example
          </h3>
          <span class="rounded-full border border-border px-2 py-1 text-[10px] text-muted">Sample finding</span>
        </div>

        <div class="bg-editor py-4 text-code">
          <p class="mb-4 flex items-center gap-2 px-5 font-mono text-[10px] text-editor-muted sm:px-6">
            <HugeiconsIcon :icon="File01Icon" :size="13" aria-hidden="true" />src/services/orders.ts
          </p>
          <pre class="font-mono text-[11px] leading-[2.2]" aria-label="Example service importing a controller"><code><span v-for="line in exampleLines" :key="line.number" class="flex gap-3 border-l-2 pr-4" :class="line.highlighted ? 'border-code-type bg-code-highlight' : 'border-transparent'"><span class="w-9 shrink-0 text-right text-editor-muted" aria-hidden="true">{{ line.number }}</span><span class="min-w-0 whitespace-pre-wrap break-words">{{ line.text || ' ' }}</span></span></code></pre>
        </div>

        <div class="p-5 sm:p-6">
          <div class="mb-3 flex items-center justify-between gap-3 text-[10px]">
            <span class="rounded bg-brand-soft px-2 py-1 font-medium text-brand-dark">Layer dependency</span>
            <span class="font-mono text-muted">L12–13</span>
          </div>
          <h4 class="text-sm font-semibold">The service reaches into the controller.</h4>
          <p class="mt-2.5 text-xs leading-6 text-muted">This import makes business logic depend on the HTTP layer, crossing the boundary defined by the team’s rule.</p>

          <details open class="group mt-4 rounded-lg border border-border bg-paper/60">
            <summary class="flex min-h-11 list-none items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-[11px] font-semibold text-ink transition-colors duration-200 hover:bg-brand-soft/50 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
              Suggested direction
              <HugeiconsIcon :icon="ArrowDown01Icon" :size="14" class="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <div class="px-3.5 pb-3.5 motion-safe:group-open:animate-disclosure-in">
              <p class="text-[11px] leading-6 text-muted">Move the lookup behind a repository. Let the controller call the service.</p>
              <pre class="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-6 text-ink"><code>import { orderRepository }
  from '../repositories/orders'</code></pre>
              <p class="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3 font-mono text-[10px] leading-5 text-brand-dark">controller <HugeiconsIcon :icon="ArrowRight01Icon" :size="12" aria-hidden="true" /> service <HugeiconsIcon :icon="ArrowRight01Icon" :size="12" aria-hidden="true" /> repository</p>
            </div>
          </details>
        </div>
      </article>
    </div>
  </section>
</template>
