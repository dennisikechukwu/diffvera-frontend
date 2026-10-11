<template>
  <NuxtLink
    to="/"
    aria-label="Diffvera home"
    class="group inline-flex items-center gap-2.5 rounded-sm text-[24px] font-bold leading-none tracking-[-1.1px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
  >
    <BrandDiffveraLogo
      :size="28"
      variant="badge"
      class="shrink-0 transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none"
    />
    <span>Diffvera</span>
  </NuxtLink>
</template>
