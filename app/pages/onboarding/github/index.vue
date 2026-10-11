<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Repository access — Diffvera', robots: 'noindex, nofollow' })
const { state, refresh, loading } = useGitHubConnection('entry')
</script>

<template>
  <OnboardingGitHubConnection
    :state="state"
    workspace-destination="/dashboard"
    :pending="loading"
    @refresh="refresh()"
  />
</template>
