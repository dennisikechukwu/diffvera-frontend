<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Sign in — Diffvera', robots: 'noindex, nofollow' })
const { state, refresh, loading } = useSignInFlow('entry')
</script>

<template>
  <div>
    <AuthSignInPanel v-if="state.status === 'ready'" />
    <AuthReturnStatus
      v-else
      :state="state"
      :pending="loading"
      @retry="refresh()"
      @continue="navigateTo('/onboarding/github')"
    />
  </div>
</template>
