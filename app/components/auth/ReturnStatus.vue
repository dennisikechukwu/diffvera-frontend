<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import { AlertCircleIcon, CheckmarkCircle02Icon, GithubIcon } from '@hugeicons/core-free-icons'
import type { SignInState } from '~/types/access'

const props = defineProps<{ state: SignInState; pending?: boolean }>()
const { isLoading: navigating } = useLoadingIndicator()
const emit = defineEmits<{ retry: []; continue: [] }>()
const content = computed(() => {
  switch (props.state.status) {
    case 'checking':
      return {
        heading: 'Confirming your sign-in',
        description:
          'Checking your GitHub account. Keep this page open while we confirm your session.',
        icon: GithubIcon
      }
    case 'verified':
      return {
        heading: 'You’re signed in.',
        description: `Welcome, ${props.state.session.user.name}. Next, choose the repositories Diffvera can access.`,
        icon: CheckmarkCircle02Icon
      }
    case 'cancelled':
      return {
        heading: 'Sign-in was cancelled.',
        description:
          'Your GitHub account has not been connected. You can start again whenever you’re ready.',
        icon: GithubIcon
      }
    case 'expired':
      return {
        heading: 'Your session has expired.',
        description:
          'Sign in again to continue securely. Your repository access settings are unchanged.',
        icon: AlertCircleIcon
      }
    case 'error':
      return {
        heading: 'We couldn’t confirm your sign-in.',
        description: 'Try checking again, or return to sign in and restart the connection.',
        icon: AlertCircleIcon
      }
    default:
      return {
        heading: 'Sign-in could not be completed.',
        description:
          'GitHub sign-in is currently unavailable. Return to sign in to continue when the connection is available.',
        icon: GithubIcon
      }
  }
})
</script>

<template>
  <section
    aria-labelledby="auth-return-heading"
    :aria-busy="state.status === 'checking' || pending"
    class="rounded-2xl border border-border bg-surface p-6 shadow-preview sm:p-9"
  >
    <div
      class="mb-7 flex size-12 items-center justify-center rounded-xl border"
      :class="getStatusAppearance(state.status).badge"
    >
      <UiSpinner v-if="state.status === 'checking' || pending" :size="24" />
      <HugeiconsIcon v-else :icon="content.icon" :size="24" aria-hidden="true" />
    </div>
    <div role="status" aria-live="polite" aria-atomic="true">
      <p class="mb-3 text-[10px] font-medium tracking-[0.15em] text-muted uppercase">
        GitHub sign-in
      </p>
      <h1
        id="auth-return-heading"
        class="text-[28px] leading-tight font-semibold tracking-[-0.8px] text-balance sm:text-[32px]"
      >
        {{ content.heading }}
      </h1>
      <p class="mt-4 text-sm leading-7 break-words text-muted">{{ content.description }}</p>
    </div>
    <UiAsyncButton
      v-if="state.status === 'verified'"
      type="button"
      :loading="navigating"
      loading-text="Continuing…"
      class="mt-7 min-h-12 w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-editor motion-reduce:transition-none"
      @click="emit('continue')"
    >
      Choose repository access
    </UiAsyncButton>
    <UiAsyncButton
      v-if="state.status === 'error'"
      type="button"
      :loading="pending"
      loading-text="Checking…"
      class="mt-7 min-h-12 w-full rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-editor motion-reduce:transition-none"
      @click="emit('retry')"
    >
      Check again
    </UiAsyncButton>
    <NuxtLink
      v-if="state.status !== 'verified'"
      to="/sign-in"
      class="mt-5 flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-paper motion-reduce:transition-none"
    >
      Back to sign in
    </NuxtLink>
  </section>
</template>
