<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'GitHub sign-in — Diffvera', robots: 'noindex, nofollow' })
const { state, refresh, loading } = useSignInFlow('return')
</script>

<template>
  <AuthReturnStatus
    :state="state"
    :pending="loading"
    @retry="refresh()"
    @continue="navigateTo('/onboarding/github')"
  />
</template>
