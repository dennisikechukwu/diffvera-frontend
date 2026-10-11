<script setup lang="ts">
// Keep existing workspace links working while /dashboard is the canonical route.
definePageMeta({
  layout: false,
  middleware: (to) =>
    navigateTo(
      {
        path: `/dashboard${to.path.slice('/app'.length)}`,
        query: to.query,
        hash: to.hash
      },
      { replace: true, redirectCode: 301 }
    )
})
</script>

<template><span aria-hidden="true" /></template>
