<script setup lang="ts">
const year = new Date().getFullYear()
const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Architecture', href: '#architecture-rules' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sample review', href: '#sample-review' }
]
</script>

<template>
  <footer class="border-t border-border px-5 pt-10 pb-7 sm:px-8 sm:pt-12 lg:px-12">
    <div class="mx-auto max-w-6xl">
      <div data-reveal class="flex flex-col justify-between gap-8 md:flex-row md:items-start md:gap-12">
        <div>
          <BrandDiffveraWordmark />
          <p class="mt-3 text-xs leading-6 text-muted">Code review with the bigger picture in mind.</p>
        </div>
        <nav aria-label="Footer navigation" class="md:pt-3">
          <ul class="flex flex-wrap gap-x-7 gap-y-4 md:justify-end">
            <li v-for="link in links" :key="link.href">
              <a :href="link.href" class="rounded-sm text-xs font-medium text-muted transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="mt-9 flex flex-col justify-between gap-3 border-t border-border pt-5 text-[10px] leading-5 text-muted sm:flex-row">
        <p>© {{ year }} Diffvera.</p>
        <p>Your code. Your rules. Your call.</p>
      </div>
    </div>
  </footer>
</template>
