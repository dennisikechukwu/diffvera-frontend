<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowRight01Icon, Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons'

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const header = ref<HTMLElement | null>(null)

function closeMenu(returnFocus = false) {
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}

function handleOutsideClick(event: PointerEvent) {
  if (event.target instanceof Node && !header.value?.contains(event.target)) closeMenu()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) closeMenu(true)
}

function handleFocusOut(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && !header.value?.contains(event.relatedTarget)) closeMenu()
}

let desktopQuery: MediaQueryList | undefined
function handleDesktop(event: MediaQueryListEvent) {
  if (event.matches) closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)
  desktopQuery = window.matchMedia('(min-width: 768px)')
  desktopQuery.addEventListener('change', handleDesktop)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscape)
  desktopQuery?.removeEventListener('change', handleDesktop)
})
</script>

<template>
  <header ref="header" class="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12" @focusout="handleFocusOut">
    <nav aria-label="Main navigation" class="flex h-24 items-center justify-between gap-5 md:h-28">
      <BrandDiffveraWordmark />

      <div class="hidden items-center gap-8 rounded-full border border-border/70 bg-surface/80 px-7 py-3.5 md:flex">
        <a href="#how-it-works" class="rounded-sm text-[13px] font-medium text-muted transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none">How it works</a>
        <a href="#features" class="rounded-sm text-[13px] font-medium text-muted transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none">Features</a>
      </div>

      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink to="/sign-in" class="rounded-sm text-[13px] font-semibold text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none">Sign in</NuxtLink>
        <NuxtLink to="/sign-in" class="flex items-center gap-3 rounded-lg border border-ink bg-ink px-4 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-editor motion-reduce:transition-none">
          Get started
          <HugeiconsIcon :icon="ArrowRight01Icon" :size="16" aria-hidden="true" />
        </NuxtLink>
      </div>

      <button
        ref="menuButton"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        class="flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-ink transition-colors duration-200 hover:bg-brand-soft motion-reduce:transition-none md:hidden"
        @click="menuOpen = !menuOpen"
      >
        <HugeiconsIcon :icon="menuOpen ? Cancel01Icon : Menu01Icon" :size="22" aria-hidden="true" />
      </button>
    </nav>

    <Transition
      enter-active-class="transition-[opacity,translate] duration-180 ease-out motion-reduce:transition-none"
      enter-from-class="motion-safe:opacity-0 motion-safe:-translate-y-1"
      enter-to-class="motion-safe:opacity-100 motion-safe:translate-y-0"
      leave-active-class="transition-[opacity,translate] duration-150 ease-out motion-reduce:transition-none"
      leave-from-class="motion-safe:opacity-100 motion-safe:translate-y-0"
      leave-to-class="motion-safe:opacity-0 motion-safe:-translate-y-1"
    >
    <div v-show="menuOpen" id="mobile-navigation" :aria-hidden="!menuOpen" :inert="!menuOpen" class="absolute inset-x-5 top-21 z-20 rounded-xl border border-border bg-surface p-5 shadow-preview sm:inset-x-8 md:hidden" :class="!menuOpen ? 'pointer-events-none' : ''">
      <nav aria-label="Mobile navigation" class="flex flex-col gap-4">
        <a href="#how-it-works" class="flex min-h-10 items-center rounded-sm text-sm font-medium text-muted hover:text-brand-dark" @click="closeMenu()">How it works</a>
        <a href="#features" class="flex min-h-10 items-center rounded-sm text-sm font-medium text-muted hover:text-brand-dark" @click="closeMenu()">Features</a>
        <div class="flex items-center gap-4 border-t border-border pt-4">
          <NuxtLink to="/sign-in" class="flex-1 rounded-lg border border-border py-3 text-center text-sm text-muted" @click="closeMenu()">Sign in</NuxtLink>
          <NuxtLink to="/sign-in" class="flex-1 rounded-lg bg-ink py-3 text-center text-sm font-semibold text-white" @click="closeMenu()">Get started</NuxtLink>
        </div>
      </nav>
    </div>
    </Transition>
  </header>
</template>
