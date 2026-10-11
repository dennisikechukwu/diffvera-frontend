<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ChartColumnIcon, Cancel01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import type { Review } from '~/types/workspace'

const props = defineProps<{ reviews: Review[] }>()
const period = ref('7')
const hover = ref<number | null>(null)
const focused = ref<number | null>(null)
const active = computed(() => hover.value ?? focused.value)
const dataDialog = ref<HTMLDialogElement | null>(null)
const dataTrigger = ref<HTMLButtonElement | null>(null)
let previousOverflow: string | null = null
function showData() {
  if (!dataDialog.value || dataDialog.value.open) return
  hover.value = null
  focused.value = null
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dataDialog.value.showModal()
}
function restoreScroll() {
  if (previousOverflow !== null) document.body.style.overflow = previousOverflow
  previousOverflow = null
}
function closeData() {
  restoreScroll()
  dataTrigger.value?.focus({ preventScroll: true })
}
onBeforeUnmount(() => {
  dataDialog.value?.close()
  restoreScroll()
})
const dayMs = 86400000
const reportDay = useState('workspace-report-day', () => new Date().toISOString().slice(0, 10))
const format = (value: number) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(value)
  )
const days = computed(() => {
  const last = props.reviews.length
    ? Math.max(...props.reviews.map((review) => Date.parse(review.createdAt)))
    : Date.parse(reportDay.value)
  const end = Math.floor(last / dayMs) * dayMs
  return Array.from({ length: Number(period.value) }, (_, index) => {
    const timestamp = end - (Number(period.value) - index - 1) * dayMs
    const date = new Date(timestamp).toISOString().slice(0, 10)
    const records = props.reviews.filter((review) => review.createdAt.startsWith(date))
    return {
      date,
      timestamp,
      label: format(timestamp),
      completed: records.filter((review) => review.status === 'completed').length,
      failed: records.filter((review) => review.status === 'failed').length,
      running: records.filter((review) => review.status === 'running').length,
      queued: records.filter((review) => review.status === 'queued').length,
      total: records.length
    }
  })
})
const ceiling = computed(() => Math.max(3, ...days.value.map((day) => day.total)))
const ticks = computed(() => [
  ...new Set([0, Math.ceil(ceiling.value / 3), Math.ceil((ceiling.value * 2) / 3), ceiling.value])
])
const total = computed(() => days.value.reduce((sum, day) => sum + day.total, 0))
const statuses = [
  { key: 'completed', label: 'Completed', color: getStatusAppearance('completed').fill },
  { key: 'failed', label: 'Failed', color: getStatusAppearance('failed').fill },
  { key: 'running', label: 'Running', color: getStatusAppearance('running').fill },
  { key: 'queued', label: 'Queued', color: getStatusAppearance('queued').fill }
] as const
watch(period, () => {
  hover.value = null
  focused.value = null
})
</script>

<template>
  <section
    aria-labelledby="activity-heading"
    class="flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 id="activity-heading" class="flex items-center gap-2.5 text-sm font-semibold">
          <HugeiconsIcon :icon="ChartColumnIcon" :size="18" class="text-muted" aria-hidden="true" />
          Review activity
        </h2>
        <p class="mt-2 text-[11px] text-muted">
          {{ days[0]?.label }}–{{ days.at(-1)?.label }} · Reviews by request date
        </p>
      </div>
      <div class="w-36">
        <label for="activity-period" class="sr-only">Activity period</label>
        <UiSelect
          id="activity-period"
          v-model="period"
          :options="[
            { value: '7', label: 'Last 7 days' },
            { value: '14', label: 'Last 14 days' }
          ]"
        />
      </div>
    </div>
    <div class="mt-6 flex flex-wrap items-end justify-between gap-3">
      <p class="text-[30px] leading-none font-semibold tracking-[-1px] tabular-nums">
        {{ total }}
        <span class="text-xs font-normal tracking-normal text-muted">
          {{ total === 1 ? 'review' : 'reviews' }} recorded
        </span>
      </p>
      <p class="text-[10px] text-muted">{{ Number(period) }}-day view</p>
    </div>
    <div class="relative mt-6 h-48 pl-7" aria-label="Review activity chart">
      <div class="pointer-events-none absolute inset-y-0 right-0 left-7" aria-hidden="true">
        <div
          v-for="tick in ticks"
          :key="tick"
          class="absolute right-0 left-0 border-t border-dashed border-border/80"
          :style="{ bottom: `${(tick / ceiling) * 100}%` }"
        >
          <span class="absolute -left-7 -top-1.5 text-[10px] text-muted tabular-nums">
            {{ tick }}
          </span>
        </div>
      </div>
      <ol
        class="relative grid h-full gap-1 sm:gap-2"
        :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }"
      >
        <li v-for="(day, index) in days" :key="day.date" class="h-full min-w-0">
          <button
            type="button"
            class="group flex h-full w-full items-end justify-center rounded-md px-1 transition-colors duration-150 hover:bg-paper/70 motion-reduce:transition-none"
            :aria-label="`${day.label}: ${day.completed} completed, ${day.failed} failed, ${day.running} running, ${day.queued} queued reviews`"
            :aria-describedby="active === index ? 'activity-tooltip' : undefined"
            @pointerenter="hover = index"
            @pointerleave="hover = null"
            @focus="focused = index"
            @blur="focused = null"
          >
            <span
              v-if="day.total"
              class="flex w-full max-w-9 origin-bottom flex-col-reverse overflow-hidden rounded-t-md transition-[height] duration-400 motion-safe:animate-chart-bar motion-reduce:transition-none"
              :style="{
                height: `${(day.total / ceiling) * 100}%`,
                animationDelay: `${index * 25}ms`
              }"
              aria-hidden="true"
            >
              <span
                v-for="status in statuses"
                :key="status.key"
                :class="status.color"
                class="block w-full"
                :style="{ height: `${(day[status.key] / day.total) * 100}%` }"
              />
            </span>
            <span v-else class="h-0.5 w-full max-w-9 rounded-full bg-border" aria-hidden="true" />
          </button>
        </li>
      </ol>
      <Transition
        enter-active-class="transition-[opacity,translate] duration-150 motion-reduce:transition-none"
        enter-from-class="motion-safe:opacity-0 motion-safe:translate-y-1"
        leave-active-class="transition-opacity duration-100 motion-reduce:transition-none"
        leave-to-class="motion-safe:opacity-0"
      >
        <div
          v-if="active !== null && days[active]"
          id="activity-tooltip"
          role="tooltip"
          class="pointer-events-none absolute -top-4 z-10 w-44 -translate-x-1/2 rounded-lg bg-ink px-3 py-2.5 text-white shadow-dropdown"
          :style="{
            left: `clamp(100px, ${((active + 0.5) / days.length) * 100}%, calc(100% - 88px))`
          }"
        >
          <p class="text-[11px] font-semibold">{{ days[active]?.label }}</p>
          <p class="mt-1 text-[10px] leading-5 text-white/75">
            {{ days[active]?.completed }} completed · {{ days[active]?.failed }} failed
            <br >
            {{ days[active]?.running }} running · {{ days[active]?.queued }} queued
          </p>
        </div>
      </Transition>
    </div>
    <div
      class="mt-3 grid pl-7 text-center text-[9px] text-muted sm:text-[10px]"
      :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }"
      aria-hidden="true"
    >
      <span v-for="(day, index) in days" :key="day.date">
        {{
          days.length <= 7 || index % 2 === 0 || index === days.length - 1
            ? new Date(day.timestamp).getUTCDate()
            : ''
        }}
      </span>
    </div>
    <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
      <span
        v-for="status in statuses"
        :key="status.key"
        class="flex items-center gap-2 text-[10px] text-muted"
      >
        <span class="size-2 rounded-sm" :class="status.color" aria-hidden="true" />
        {{ status.label }}
      </span>
    </div>
    <button
      ref="dataTrigger"
      type="button"
      aria-haspopup="dialog"
      aria-controls="activity-data-dialog"
      class="group mt-3 inline-flex min-h-9 items-center gap-2 rounded-sm text-[10px] font-medium text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none"
      @click="showData"
    >
      View chart data
      <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="13" aria-hidden="true" />
    </button>
    <dialog
      id="activity-data-dialog"
      ref="dataDialog"
      aria-labelledby="chart-data-heading"
      class="m-auto max-h-[80svh] w-[calc(100%-32px)] max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface p-0 text-ink shadow-dropdown backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] motion-safe:open:animate-disclosure-in"
      @close="closeData"
      @keydown.esc.stop
      @click="
        (event) => {
          if (event.target === dataDialog) dataDialog?.close()
        }
      "
    >
      <div class="flex max-h-[80svh] flex-col">
        <div class="flex shrink-0 items-start justify-between gap-4 p-5 sm:p-6">
          <div>
            <h2 id="chart-data-heading" class="text-base font-semibold">Review activity data</h2>
            <p class="mt-2 text-xs text-muted">
              {{ days[0]?.label }}–{{ days.at(-1)?.label }} · {{ total }} reviews
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chart data"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border transition-colors hover:bg-paper motion-reduce:transition-none"
            @click="dataDialog?.close()"
          >
            <HugeiconsIcon :icon="Cancel01Icon" :size="18" aria-hidden="true" />
          </button>
        </div>
        <div
          class="min-h-0 overflow-auto border-y border-border px-5 sm:px-6"
          tabindex="0"
          aria-label="Review activity data, scroll if needed"
        >
          <table class="w-full min-w-md text-left text-xs">
            <caption class="sr-only">Daily review activity for the selected period</caption>
            <thead class="sticky top-0 bg-surface">
              <tr class="border-b border-border text-muted">
                <th scope="col" class="py-2 font-medium">Date</th>
                <th
                  v-for="status in statuses"
                  :key="status.key"
                  scope="col"
                  class="px-2 py-2 font-medium"
                >
                  {{ status.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in days" :key="day.date" class="border-b border-border/60">
                <th scope="row" class="py-2 font-normal whitespace-nowrap">{{ day.label }}</th>
                <td v-for="status in statuses" :key="status.key" class="px-2 py-2 tabular-nums">
                  {{ day[status.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="shrink-0 px-5 py-4 text-[10px] text-muted sm:px-6">
          Dates are shown in UTC. Counts reflect the selected review period.
        </p>
      </div>
    </dialog>
  </section>
</template>
