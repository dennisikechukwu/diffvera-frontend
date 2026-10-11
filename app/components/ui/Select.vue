<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'

interface Option {
  value: string
  label: string
  disabled?: boolean
}
const props = defineProps<{
  id: string
  modelValue: string
  options: readonly Option[]
  disabled?: boolean
  placeholder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const open = ref(false)
const active = ref(-1)
const above = ref(false)
const position = ref<Record<string, string>>({})
const selected = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue)
)
const label = computed(
  () => props.options[selected.value]?.label ?? props.placeholder ?? 'Choose an option'
)
const listId = computed(() => `${props.id}-options`)
let typed = ''
let typedAt = 0

function place() {
  if (!open.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const width = Math.min(Math.max(rect.width, 180), window.innerWidth - 24)
  const below = window.innerHeight - rect.bottom - 12
  const top = rect.top - 12
  above.value = below < 180 && top > below
  position.value = {
    left: `${Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))}px`,
    width: `${width}px`,
    maxHeight: `${Math.max(60, Math.min(288, above.value ? top : below))}px`,
    ...(above.value
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` })
  }
}
async function show() {
  if (props.disabled || !props.options.some((option) => !option.disabled)) return
  active.value =
    selected.value >= 0 && !props.options[selected.value]?.disabled
      ? selected.value
      : props.options.findIndex((option) => !option.disabled)
  open.value = true
  place()
  await nextTick()
  scrollActive()
}
function close() {
  open.value = false
  typed = ''
}
function scrollActive() {
  document
    .getElementById(`${props.id}-option-${active.value}`)
    ?.scrollIntoView({ block: 'nearest' })
}
async function move(direction: number) {
  for (let offset = 1; offset <= props.options.length; offset++) {
    const index = (active.value + direction * offset + props.options.length) % props.options.length
    if (!props.options[index]?.disabled) {
      active.value = index
      break
    }
  }
  await nextTick()
  scrollActive()
}
function choose(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return
  emit('update:modelValue', option.value)
  close()
  trigger.value?.focus({ preventScroll: true })
}
async function keydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) return
  if (event.key === 'Tab') {
    close()
    return
  }
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    event.stopPropagation()
    close()
    return
  }
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    if (open.value) choose(active.value)
    else await show()
    return
  }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const wasOpen = open.value
    if (!wasOpen) await show()
    if (event.key === 'Home') active.value = props.options.findIndex((option) => !option.disabled)
    else if (event.key === 'End')
      active.value = props.options.findLastIndex((option) => !option.disabled)
    else if (wasOpen) await move(event.key === 'ArrowDown' ? 1 : -1)
    await nextTick()
    scrollActive()
    return
  }
  if (event.key.length === 1 && event.key.trim()) {
    event.preventDefault()
    if (!open.value) await show()
    const now = Date.now()
    typed = now - typedAt > 600 ? event.key : typed + event.key
    typedAt = now
    const query = [...typed].every(
      (character) => character.toLowerCase() === event.key.toLowerCase()
    )
      ? event.key
      : typed
    for (let offset = 1; offset <= props.options.length; offset++) {
      const index = (active.value + offset) % props.options.length
      if (
        !props.options[index]?.disabled &&
        props.options[index]?.label.toLowerCase().startsWith(query.toLowerCase())
      ) {
        active.value = index
        break
      }
    }
    await nextTick()
    scrollActive()
  }
}
function outside(event: PointerEvent) {
  if (
    event.target instanceof Node &&
    !trigger.value?.contains(event.target) &&
    !panel.value?.contains(event.target)
  )
    close()
}
watch(
  () => props.disabled,
  (value) => {
    if (value) close()
  }
)
watch(
  () => props.modelValue,
  () => {
    if (open.value) active.value = selected.value
  }
)
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  window.addEventListener('resize', place)
  window.addEventListener('scroll', place, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  window.removeEventListener('resize', place)
  window.removeEventListener('scroll', place, true)
})
</script>

<template>
  <div class="min-w-0">
    <button
      :id="id"
      ref="trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-activedescendant="open && active >= 0 ? `${id}-option-${active}` : undefined"
      :disabled="disabled || !options.length"
      class="flex min-h-11 w-full min-w-0 items-center justify-between gap-4 rounded-lg border bg-surface px-3 text-left text-xs font-medium transition-[border-color,box-shadow,background-color] duration-200 hover:border-ink/25 disabled:text-muted motion-reduce:transition-none"
      :class="open ? 'border-ink/30 shadow-sm' : 'border-border'"
      @click="open ? close() : show()"
      @keydown="keydown"
      @blur="close"
    >
      <span class="truncate">{{ label }}</span>
      <HugeiconsIcon
        :icon="ArrowDown01Icon"
        :size="17"
        class="shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none"
        :class="open ? 'rotate-180' : ''"
        aria-hidden="true"
      />
    </button>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-[opacity,scale] duration-160 ease-out motion-reduce:transition-none"
        enter-from-class="motion-safe:opacity-0 motion-safe:scale-[0.97]"
        enter-to-class="motion-safe:opacity-100 motion-safe:scale-100"
        leave-active-class="transition-[opacity,scale] duration-120 ease-in motion-reduce:transition-none"
        leave-from-class="motion-safe:opacity-100 motion-safe:scale-100"
        leave-to-class="motion-safe:opacity-0 motion-safe:scale-[0.97]"
      >
        <div
          v-show="open"
          :id="listId"
          ref="panel"
          role="listbox"
          :aria-labelledby="id"
          :aria-hidden="!open"
          :inert="!open"
          :style="position"
          class="fixed z-100 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1.5 shadow-dropdown"
          :class="[above ? 'origin-bottom' : 'origin-top', !open ? 'pointer-events-none' : '']"
          @pointerdown.prevent
        >
          <div
            v-for="(option, index) in options"
            :id="`${id}-option-${index}`"
            :key="option.value"
            role="option"
            :aria-selected="option.value === modelValue"
            :aria-disabled="option.disabled || undefined"
            class="flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-xs transition-colors duration-100 motion-reduce:transition-none"
            :class="[
              active === index ? 'bg-paper text-ink' : 'text-muted',
              option.disabled ? 'cursor-not-allowed opacity-45' : ''
            ]"
            @pointermove="!option.disabled && (active = index)"
            @click="choose(index)"
          >
            <span class="min-w-0 break-words">{{ option.label }}</span>
            <HugeiconsIcon
              v-if="option.value === modelValue"
              :icon="Tick02Icon"
              :size="15"
              class="shrink-0 text-ink"
              aria-hidden="true"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
