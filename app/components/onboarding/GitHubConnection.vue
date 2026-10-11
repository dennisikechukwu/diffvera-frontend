<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  GithubIcon,
  Shield01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon
} from '@hugeicons/core-free-icons'
import type { GitHubConnectionState } from '~/types/access'

const props = defineProps<{
  state: GitHubConnectionState
  workspaceDestination?: string
  pending?: boolean
}>()
const emit = defineEmits<{ refresh: [] }>()
const installing = ref(false)
function handleInstall() {
  if (installing.value) return
  installing.value = true
  window.location.href = 'https://github.com/apps/diffvera/installations/new'
}
const content = computed(() => {
  switch (props.state.status) {
    case 'checking':
      return {
        heading: 'Checking repository access',
        description:
          'Confirming your GitHub App installation and the repositories available to Diffvera.'
      }
    case 'not-installed':
      return {
        heading: 'Connect your repositories.',
        description:
          'Install the Diffvera GitHub App to choose the repositories you want to review.'
      }
    case 'pending-approval':
      return {
        heading: 'Waiting for approval.',
        description: `An owner of ${props.state.organization} needs to approve the GitHub App installation before repositories become available.`
      }
    case 'connected':
      return {
        heading: 'Repository access confirmed.',
        description: `Your GitHub App installation for ${props.state.account.login} is connected. Review the repositories available below.`
      }
    case 'cancelled':
      return {
        heading: 'Connection was cancelled.',
        description:
          'No new repository access was granted. You can return to GitHub to connect your repositories.'
      }
    case 'error':
      return {
        heading: 'We couldn’t check repository access.',
        description:
          'The connection could not be confirmed. Try checking again before making changes to your installation.'
      }
    case 'session-required':
      return {
        heading: 'Sign in to connect repositories.',
        description:
          'First, confirm your GitHub account. Then choose repository access through the Diffvera GitHub App.'
      }
    default:
      return {
        heading: 'Repository connection is unavailable.',
        description: 'We couldn’t reach the repository connection. Try checking again in a moment.'
      }
  }
})
</script>

<template>
  <section aria-labelledby="connection-heading" :aria-busy="state.status === 'checking' || pending">
    <ol
      aria-label="Connection steps"
      class="mb-7 flex items-center gap-3 text-[11px] font-medium text-muted"
    >
      <li
        class="flex items-center gap-2"
        :aria-current="state.status === 'session-required' ? 'step' : undefined"
      >
        <span
          class="flex size-5 items-center justify-center rounded-full border border-border bg-surface text-ink"
        >
          1
        </span>
        Sign in
      </li>
      <li aria-hidden="true" class="h-px w-7 bg-border" />
      <li
        class="flex items-center gap-2"
        :aria-current="state.status === 'session-required' ? undefined : 'step'"
      >
        <span
          class="flex size-5 items-center justify-center rounded-full border border-border"
          :class="
            state.status === 'session-required'
              ? 'bg-surface text-muted'
              : 'border-ink bg-ink text-white'
          "
        >
          2
        </span>
        Repository access
      </li>
    </ol>
    <div class="overflow-hidden rounded-2xl border border-border bg-surface shadow-preview">
      <div class="p-6 sm:p-8">
        <div
          class="mb-6 flex size-12 items-center justify-center rounded-xl border"
          :class="getStatusAppearance(state.status).badge"
        >
          <UiSpinner v-if="state.status === 'checking' || pending" :size="24" />
          <HugeiconsIcon
            v-else
            :icon="state.status === 'connected' ? CheckmarkCircle02Icon : GithubIcon"
            :size="24"
            aria-hidden="true"
          />
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h1
            id="connection-heading"
            class="text-[28px] leading-[1.2] font-semibold tracking-[-0.8px] text-balance sm:text-[32px]"
          >
            {{ content.heading }}
          </h1>
          <p class="mt-4 text-sm leading-7 break-words text-muted">{{ content.description }}</p>
        </div>

        <div
          v-if="state.status === 'not-installed'"
          class="mt-5 flex items-center gap-3 rounded-lg border border-border bg-paper px-3 py-3"
        >
          <HugeiconsIcon :icon="GithubIcon" :size="18" aria-hidden="true" />
          <div class="min-w-0">
            <p class="text-[10px] text-muted">Signed in as</p>
            <p class="mt-0.5 text-xs font-medium break-words">{{ state.account.login }}</p>
          </div>
        </div>
        <OnboardingRepositoryAccessList
          v-if="state.status === 'connected'"
          :repositories="state.repositories"
        />

        <NuxtLink
          v-if="state.status === 'session-required'"
          to="/sign-in"
          class="group mt-6 flex min-h-12 items-center justify-center gap-3 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-editor motion-reduce:transition-none"
        >
          Continue to sign in
          <HugeiconsIcon :icon="ArrowRight01Icon" :size="16" aria-hidden="true" />
        </NuxtLink>
        <template v-else-if="state.status === 'not-installed' || state.status === 'cancelled'">
          <button
            type="button"
            :disabled="installing"
            class="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-editor disabled:opacity-85 disabled:cursor-wait motion-reduce:transition-none"
            @click="handleInstall"
          >
            <UiSpinner v-if="installing" :size="18" class="text-white" />
            <HugeiconsIcon v-else :icon="GithubIcon" :size="18" aria-hidden="true" />
            <span>{{ installing ? 'Opening GitHub…' : 'Install GitHub App' }}</span>
          </button>
          <p
            class="mt-3 text-center text-[11px] leading-5 text-muted"
          >
            Select repositories on GitHub to enable automated AI code reviews.
          </p>
        </template>
        <template v-else-if="state.status === 'connected'">
          <NuxtLink
            v-if="workspaceDestination"
            :to="workspaceDestination"
            class="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white"
          >
            Continue to workspace
          </NuxtLink>
          <button
            v-else
            disabled
            aria-describedby="workspace-availability"
            class="mt-6 min-h-12 w-full rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white"
          >
            Continue to workspace
          </button>
          <p
            v-if="!workspaceDestination"
            id="workspace-availability"
            class="mt-3 text-center text-[11px] leading-5 text-muted"
          >
            Workspace access is currently unavailable.
          </p>
          <a
            href="https://github.com/apps/diffvera/installations/new"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg border border-border px-4 text-xs font-medium text-muted transition-colors hover:text-ink hover:border-ink"
          >
            Manage access on GitHub
          </a>
        </template>
        <UiAsyncButton
          v-if="['pending-approval', 'error', 'unavailable', 'connected'].includes(state.status)"
          type="button"
          :loading="pending"
          loading-text="Checking…"
          class="mt-4 min-h-11 w-full rounded-lg border border-border px-4 text-xs font-medium transition-colors duration-200 hover:bg-paper motion-reduce:transition-none"
          @click="emit('refresh')"
        >
          Check access again
        </UiAsyncButton>
      </div>
      <div class="border-t border-border bg-paper/60 px-6 py-5 sm:px-8">
        <p class="flex items-center gap-2 text-xs font-medium">
          <HugeiconsIcon
            :icon="Shield01Icon"
            :size="16"
            class="text-brand-dark"
            aria-hidden="true"
          />
          You control repository access
        </p>
        <p class="mt-2 text-xs leading-6 text-muted">
          Repository selection and permissions are handled on GitHub. Diffvera does not edit your
          code or merge pull requests.
        </p>
      </div>
    </div>
    <NuxtLink
      v-if="state.status !== 'session-required'"
      to="/sign-in"
      class="mx-auto mt-4 flex min-h-11 w-fit items-center rounded-sm px-2 text-xs text-muted transition-colors hover:text-ink motion-reduce:transition-none"
    >
      Back to sign in
    </NuxtLink>
  </section>
</template>
