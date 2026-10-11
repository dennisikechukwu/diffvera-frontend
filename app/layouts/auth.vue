<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <a
      href="#auth-content"
      class="sr-only fixed top-3 left-3 z-50 rounded-lg bg-ink px-4 py-3 text-white focus:not-sr-only"
    >
      Skip to content
    </a>
    <header
      class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-7 sm:px-8 lg:px-12"
    >
      <BrandDiffveraWordmark />
      <NuxtLink
        to="/"
        class="group flex min-h-11 items-center gap-2 rounded-md text-xs font-medium text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none"
      >
        <HugeiconsIcon
          :icon="ArrowLeft01Icon"
          :size="15"
          class="transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
        Back to website
      </NuxtLink>
    </header>
    <main
      id="auth-content"
      tabindex="-1"
      class="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-16"
    >
      <div class="w-full max-w-120"><slot /></div>
    </main>
    <footer
      class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-[11px] text-muted sm:flex-row sm:px-8 lg:px-12"
    >
      <p>Diffvera · Code review. Architectural clarity.</p>
      <p>AI assistance. Human decisions.</p>
    </footer>
  </div>
</template>
