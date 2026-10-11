<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { GithubIcon, GitPullRequestIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

const connecting = ref(false)

function handleSignIn() {
  if (connecting.value) return
  connecting.value = true
  window.location.href = '/api/v1/auth/github'
}
</script>

<template>
  <section aria-labelledby="sign-in-heading">
    <p
      class="mb-5 flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] text-muted uppercase"
    >
      <span class="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      Your review workspace
    </p>
    <h1
      id="sign-in-heading"
      class="text-[36px] leading-[1.15] font-semibold tracking-[-1.4px] text-balance sm:text-[42px]"
    >
      A clearer view
      <br >
      of every change.
    </h1>
    <p class="mt-4 max-w-100 text-sm leading-7 text-muted">
      Sign in to review pull requests and keep your team’s architecture in focus.
    </p>

    <div class="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-preview">
      <div class="p-6 sm:p-8">
        <h2 class="text-base font-semibold tracking-tight">Continue to Diffvera</h2>
        <p class="mt-2 text-xs leading-6 text-muted">
          Use your GitHub account. You’ll choose repository access separately.
        </p>
        <button
          type="button"
          :disabled="connecting"
          class="mt-6 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-lg bg-ink px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-editor active:scale-[0.99] disabled:cursor-wait disabled:opacity-85 motion-reduce:transition-none"
          @click="handleSignIn"
        >
          <UiSpinner v-if="connecting" :size="18" class="text-white" />
          <HugeiconsIcon v-else :icon="GithubIcon" :size="19" aria-hidden="true" />
          <span>{{ connecting ? 'Connecting to GitHub…' : 'Continue with GitHub' }}</span>
        </button>
        <p class="mt-3 text-center text-[11px] leading-5 text-muted">
          Diffvera requests read-only identity access to verify your account.
        </p>
      </div>
      <div class="border-t border-border bg-paper/60 p-6 sm:px-8">
        <div class="flex items-center gap-2 text-xs font-medium">
          <HugeiconsIcon
            :icon="GitPullRequestIcon"
            :size="16"
            class="text-brand-dark"
            aria-hidden="true"
          />
          Review with context
        </div>
        <p class="mt-2 text-xs leading-6 text-muted">
          Findings connected to the code, with evidence and an explanation you can assess.
        </p>
        <NuxtLink
          to="/#sample-review"
          class="group mt-3 inline-flex min-h-10 items-center gap-2 rounded-sm text-xs font-semibold transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none"
        >
          Explore the sample review
          <HugeiconsIcon
            :icon="ArrowRight01Icon"
            :size="15"
            class="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </div>
    <p class="mt-6 text-center text-[11px] leading-6 text-muted">
      Diffvera does not change your code or merge pull requests.
    </p>
  </section>
</template>
