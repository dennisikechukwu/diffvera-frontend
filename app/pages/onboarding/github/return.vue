<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Confirm repository access — Diffvera', robots: 'noindex, nofollow' })
const { state, refresh, loading } = useGitHubConnection('return')
</script>

<template>
  <OnboardingGitHubConnection
    :state="state"
    workspace-destination="/dashboard"
    :pending="loading"
    @refresh="refresh()"
  />
</template>
