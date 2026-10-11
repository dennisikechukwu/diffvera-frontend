<script setup lang="ts">
useMarketingMotion()
</script>

<template>
  <div class="min-h-screen">
    <a href="#main-content" class="sr-only fixed top-3 left-3 z-50 rounded-lg bg-ink px-4 py-3 text-white focus:not-sr-only">
      Skip to content
    </a>
    <MarketingNavbar />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <MarketingFooter />
  </div>
</template>
