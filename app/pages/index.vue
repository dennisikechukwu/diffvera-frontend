<script setup lang="ts">
definePageMeta({ layout: 'marketing' })

useSeoMeta({
  description: 'Review pull requests, spot potential issues, and check changes against your team’s architecture rules—with clear explanations grounded in your code.'
})
</script>

<template>
  <div>
    <MarketingHero />
    <MarketingHowItWorks />
    <MarketingFeatures />
    <MarketingArchitectureRules />
    <MarketingFaq />
    <MarketingFinalCta />
  </div>
</template>
