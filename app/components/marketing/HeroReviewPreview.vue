<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { Alert02Icon, ArrowDown01Icon, ArrowRight01Icon, File01Icon, GitPullRequestIcon, Layers01Icon, Shield01Icon } from '@hugeicons/core-free-icons'

const codeLines = [
  { number: 24, parts: [{ text: 'export async function ', tone: 'keyword' }, { text: 'getOrder(', tone: 'normal' }] },
  { number: 25, parts: [{ text: '  orderId: ', tone: 'normal' }, { text: 'string', tone: 'type' }, { text: ', userId: ', tone: 'normal' }, { text: 'string', tone: 'type' }] },
  { number: 26, parts: [{ text: ') {', tone: 'normal' }] },
  { number: 27, parts: [{ text: '  return ', tone: 'keyword' }, { text: 'db.order.findUnique({', tone: 'normal' }] },
  { number: 28, parts: [{ text: '    where: { id: orderId },', tone: 'normal' }], highlighted: true },
  { number: 29, parts: [{ text: '  });', tone: 'normal' }] },
  { number: 30, parts: [{ text: '}', tone: 'normal' }] }
]

const tokenClasses: Record<string, string> = {
  normal: 'text-code',
  keyword: 'text-code-keyword',
  type: 'text-code-type',
}
</script>

<template>
  <article id="sample-review" tabindex="-1" aria-labelledby="sample-title" class="scroll-mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-preview sm:rounded-2xl">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4 sm:px-7">
      <div class="flex items-center gap-2.5">
        <BrandDiffveraLogo :size="18" variant="badge" aria-hidden="true" />
        <span class="text-sm font-extrabold tracking-[-0.6px] text-ink">Diffvera</span>
        <span class="h-4 w-px bg-border" aria-hidden="true" />
        <span class="text-[11px] text-muted sm:text-xs">Pull request review</span>
      </div>
      <span class="rounded-full border border-border bg-paper px-2.5 py-1 text-[10px] font-semibold text-muted sm:text-[11px]">Sample review</span>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
      <div class="flex min-w-0 items-start gap-3.5">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
          <HugeiconsIcon :icon="GitPullRequestIcon" :size="21" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="mb-1 text-[10px] font-medium tracking-wide text-muted sm:text-[11px]">EXAMPLE REPOSITORY / ORDER SERVICE</p>
          <h2 id="sample-title" class="text-sm font-semibold sm:text-base">Add order details endpoint <span class="ml-1 font-normal text-muted">#42</span></h2>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 pl-13.5 text-[10px] sm:gap-3 sm:pl-0 sm:text-[11px]">
        <span class="rounded-md border border-border px-2 py-1 text-muted">TypeScript</span>
        <span class="flex items-center gap-1.5 rounded-md bg-severity-soft px-2 py-1 font-medium text-severity">
          <HugeiconsIcon :icon="Alert02Icon" :size="13" aria-hidden="true" />
          1 potential issue
        </span>
      </div>
    </div>

    <div class="grid border-t border-border lg:grid-cols-[1.1fr_1fr]">
      <section aria-label="Changed file and code excerpt" class="min-w-0 bg-editor text-code">
        <div class="flex items-center justify-between gap-2 border-b border-editor-border px-5 py-3.5 sm:px-6">
          <div class="flex min-w-0 items-center gap-2 text-xs">
            <HugeiconsIcon :icon="File01Icon" :size="15" class="shrink-0 text-editor-muted" aria-hidden="true" />
            <span class="truncate">orders.ts</span>
          </div>
          <span class="shrink-0 rounded border border-editor-border px-1.5 py-0.5 text-[9px] text-editor-muted">Changed file</span>
        </div>
        <p class="truncate border-b border-editor-border px-5 py-3 font-mono text-[10px] text-editor-muted sm:px-6" title="src/services/orders.ts">
          src/services/orders.ts
        </p>

        <div class="py-5 sm:py-6">
          <p class="sr-only">TypeScript code excerpt, lines 24 to 30. Line 28 looks up an order by ID without checking user ownership.</p>
          <pre class="font-mono text-[11px] leading-[2.5] sm:text-xs" aria-label="orders.ts code"><code><span v-for="line in codeLines" :key="line.number" class="flex min-w-0 gap-3 pr-4 sm:gap-4" :class="line.highlighted ? 'border-l-2 border-code-type bg-code-highlight' : 'border-l-2 border-transparent'"><span class="w-10 shrink-0 text-right text-editor-muted" aria-hidden="true">{{ line.number }}</span><span class="min-w-0 whitespace-pre-wrap break-words"><span v-for="(part, index) in line.parts" :key="index" :class="tokenClasses[part.tone]">{{ part.text }}</span></span></span></code></pre>
        </div>

        <div class="flex items-center gap-2 border-t border-editor-border px-5 py-3.5 text-[10px] text-editor-muted sm:px-6">
          <HugeiconsIcon :icon="Layers01Icon" :size="14" aria-hidden="true" />
          Architecture context: service <HugeiconsIcon :icon="ArrowRight01Icon" :size="12" aria-hidden="true" /> data layer
        </div>
      </section>

      <section id="review-finding" tabindex="-1" aria-labelledby="finding-title" class="min-w-0 scroll-mt-6 px-5 py-5 sm:px-7 sm:py-6">
        <div class="mb-4 flex items-center gap-2.5 text-[10px] font-semibold">
          <span class="rounded-md bg-severity-soft px-2 py-1 text-severity">High severity</span>
          <span class="flex items-center gap-1.5 text-muted">
            <HugeiconsIcon :icon="Shield01Icon" :size="13" aria-hidden="true" />
            Security
          </span>
          <span class="ml-auto font-mono text-muted">L28</span>
        </div>

        <h3 id="finding-title" class="text-base font-semibold tracking-[-0.3px]">An order ID isn’t an ownership check.</h3>
        <p class="mt-3 text-xs leading-[1.85] text-muted sm:text-[13px]">
          This query filters by <code class="font-mono text-[11px] text-ink">orderId</code> alone. If the caller can supply another order ID, this endpoint could expose another customer’s order.
        </p>

        <div class="mt-4 border-l-2 border-border pl-3 text-[11px] leading-relaxed text-muted">
          <span class="font-semibold text-ink">Evidence</span> · <code class="font-mono">userId</code> is accepted at line 25 but never used in the lookup at line 28.
        </div>

        <details open class="group mt-5 rounded-lg border border-border bg-suggestion">
          <summary class="flex min-h-11 list-none items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-[11px] font-semibold text-brand-dark transition-colors duration-200 hover:bg-brand-soft/70 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            Suggested correction
            <HugeiconsIcon :icon="ArrowDown01Icon" :size="14" class="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
          </summary>
          <div class="px-3.5 pb-3.5 motion-safe:group-open:animate-disclosure-in">
            <p class="text-[11px] leading-relaxed text-muted">Scope the lookup to the authenticated owner:</p>
            <pre class="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.9] text-ink"><code>db.order.findFirst({
  where: { id: orderId, ownerId: userId },
});</code></pre>
            <p class="mt-2 text-[10px] leading-relaxed text-muted">Get userId from the server session and handle a missing order before returning a response.</p>
          </div>
        </details>
      </section>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-paper/60 px-5 py-3 text-[10px] text-muted sm:px-7">
      <span>Grounded in the diff. Explained in context.</span>
      <span>Suggestions for your team to review.</span>
    </div>
  </article>
</template>
