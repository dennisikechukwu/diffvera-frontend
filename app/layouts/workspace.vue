<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue'
import {
  DashboardSquare01Icon,
  GitBranchIcon,
  GitPullRequestIcon,
  Layers01Icon,
  Settings01Icon,
  Menu01Icon,
  Cancel01Icon,
  GithubIcon,
  Logout01Icon
} from '@hugeicons/core-free-icons'

const { snapshot, path, loading, error, refresh } = useWorkspace()
const isDev = import.meta.dev
const route = useRoute()
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const signingOut = ref(false)
const initials = computed(() =>
  (snapshot.value?.account.name ?? 'Your account')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
)

async function handleSignOut() {
  if (signingOut.value) return
  signingOut.value = true
  try {
    await $fetch('/api/v1/auth/sign-out', {
      method: 'POST',
      credentials: 'include'
    })
  } catch {
    // Continue navigation even if network fails
  } finally {
    const sessionCookie = useCookie('diffvera_session')
    sessionCookie.value = null
    const isAuthenticated = useState<boolean>('isAuthenticated')
    isAuthenticated.value = false
    await navigateTo('/sign-in')
    signingOut.value = false
  }
}
const navigation = [
  { name: 'Overview', to: '/dashboard', icon: DashboardSquare01Icon },
  { name: 'Repositories', to: '/dashboard/repositories', icon: GitBranchIcon },
  { name: 'Reviews', to: '/dashboard/reviews', icon: GitPullRequestIcon },
  { name: 'Architecture rules', to: '/dashboard/rules', icon: Layers01Icon },
  { name: 'Settings', to: '/dashboard/settings', icon: Settings01Icon }
]
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)
let ticker: ReturnType<typeof setInterval> | undefined
let isRefreshing = false

onMounted(() => {
  ticker = setInterval(async () => {
    if (route.query.fixture === '1') {
      for (const review of snapshot.value?.reviews ?? []) {
        if (!review.requestedAt) continue
        const age = Date.now() - review.requestedAt
        if (review.status === 'queued' && age >= 1200) review.status = 'running'
        if (review.status === 'running' && age >= 4500) review.status = 'completed'
      }
      return
    }

    const hasActive = snapshot.value?.reviews.some((r) =>
      ['queued', 'running'].includes(r.status)
    )
    if (!hasActive || isRefreshing) return

    isRefreshing = true
    try {
      await refresh()
    } catch {
      // Suppress polling network error to prevent cascading UI disruptions
    } finally {
      isRefreshing = false
    }
  }, 3500)
})
onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})
function dismissMenu() {
  if (menuOpen.value) {
    menuOpen.value = false
    menuButton.value?.focus()
  }
}

let desktopQuery: MediaQueryList | undefined
function handleDesktop(event: MediaQueryListEvent) {
  if (event.matches && menuOpen.value) {
    menuOpen.value = false
  }
}

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 1024px)')
  desktopQuery.addEventListener('change', handleDesktop)
})

onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', handleDesktop)
})
</script>

<template>
  <div class="min-h-svh lg:grid lg:grid-cols-[224px_minmax(0,1fr)]" @keydown.esc="dismissMenu">
    <a
      href="#workspace-content"
      class="sr-only fixed top-3 left-3 z-50 rounded-lg bg-ink px-4 py-3 text-white focus:not-sr-only"
    >
      Skip to content
    </a>

    <!-- Mobile Navigation Overlay (Backdrop + Floating Drawer) -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="menuOpen"
        class="fixed inset-0 top-16 z-40 bg-ink/35 backdrop-blur-[2px] lg:hidden"
        aria-hidden="true"
        @click="dismissMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition-[opacity,transform] duration-200 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 -translate-y-2 scale-[0.99]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-[opacity,transform] duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-[0.99]"
    >
      <div
        v-if="menuOpen"
        id="workspace-mobile-menu"
        class="fixed inset-x-0 top-16 z-50 max-h-[calc(100svh-4.5rem)] overflow-y-auto border-b border-border bg-surface px-4 py-4 shadow-dropdown lg:hidden"
      >
        <div class="mb-3 flex items-center justify-between rounded-xl border border-border/80 bg-paper px-3.5 py-2.5">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-ink">Personal workspace</p>
            <p class="truncate text-[11px] text-muted">
              {{ snapshot?.account.login ?? 'GitHub account' }}
            </p>
          </div>
          <span class="inline-flex items-center rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
            Connected
          </span>
        </div>

        <nav aria-label="Mobile workspace navigation" class="space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="path(item.to)"
            :aria-current="
              (item.to === '/dashboard' ? route.path === item.to : route.path.startsWith(item.to))
                ? 'page'
                : undefined
            "
            class="flex min-h-11 items-center gap-3 rounded-lg px-3.5 text-xs font-medium transition-colors duration-150"
            :class="
              (item.to === '/dashboard' ? route.path === item.to : route.path.startsWith(item.to))
                ? 'bg-ink text-white'
                : 'text-muted hover:bg-paper hover:text-ink'
            "
            @click="dismissMenu"
          >
            <HugeiconsIcon :icon="item.icon" :size="18" aria-hidden="true" />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </nav>

        <div class="mt-4 border-t border-border pt-3.5">
          <div class="flex items-center justify-between gap-3 px-1">
            <div class="flex min-w-0 items-center gap-3">
              <img
                v-if="snapshot?.account.avatarUrl"
                :src="snapshot.account.avatarUrl"
                :alt="snapshot?.account.name ?? 'Account avatar'"
                class="size-8 shrink-0 rounded-full border border-border object-cover"
              >
              <span
                v-else
                class="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand/10 bg-brand-soft text-[10px] font-semibold text-brand-dark"
                aria-hidden="true"
              >
                {{ initials }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-xs font-medium text-ink">
                  {{ snapshot?.account.name ?? 'Your account' }}
                </p>
                <p class="truncate text-[10px] text-muted">
                  @{{ snapshot?.account.login ?? 'github' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              :disabled="signingOut"
              aria-label="Sign out"
              class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-paper/60 text-muted transition-colors hover:border-brand/40 hover:bg-paper hover:text-ink disabled:opacity-60"
              @click="handleSignOut"
            >
              <HugeiconsIcon v-if="!signingOut" :icon="Logout01Icon" :size="16" aria-hidden="true" />
              <UiSpinner v-else :size="14" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <aside
      class="border-b border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-r lg:border-b-0"
    >
      <div class="flex h-16 items-center justify-between border-b border-border px-5">
        <BrandDiffveraWordmark />
        <button
          ref="menuButton"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="workspace-mobile-menu"
          :aria-label="menuOpen ? 'Close workspace navigation' : 'Open workspace navigation'"
          class="flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-paper motion-reduce:transition-none lg:hidden"
          @click="menuOpen = !menuOpen"
        >
          <HugeiconsIcon
            :icon="menuOpen ? Cancel01Icon : Menu01Icon"
            :size="20"
            aria-hidden="true"
          />
        </button>
      </div>
      <div class="hidden border-b border-border px-5 py-5 lg:block">
        <p class="text-xs font-semibold">Personal workspace</p>
        <p class="mt-1 text-[11px] break-words text-muted">
          {{ snapshot?.account.login ?? 'GitHub account' }}
        </p>
      </div>
      <nav
        id="workspace-navigation"
        aria-label="Workspace navigation"
        class="hidden px-3 pb-4 lg:block lg:pt-5"
      >
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="path(item.to)"
          :aria-current="
            (item.to === '/dashboard' ? route.path === item.to : route.path.startsWith(item.to))
              ? 'page'
              : undefined
          "
          class="mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors duration-200 motion-reduce:transition-none"
          :class="
            (item.to === '/dashboard' ? route.path === item.to : route.path.startsWith(item.to))
              ? 'bg-ink text-white hover:bg-editor'
              : 'text-muted hover:bg-paper hover:text-ink'
          "
        >
          <HugeiconsIcon :icon="item.icon" :size="18" aria-hidden="true" />
          {{ item.name }}
        </NuxtLink>
      </nav>
      <div class="mt-auto hidden border-t border-border px-5 py-5 lg:block">
        <div class="flex items-center gap-3">
          <img
            v-if="snapshot?.account.avatarUrl"
            :src="snapshot.account.avatarUrl"
            :alt="snapshot?.account.name ?? 'Account avatar'"
            class="size-9 shrink-0 rounded-full border border-border object-cover"
          >
          <span
            v-else
            class="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/10 bg-brand-soft text-[11px] font-semibold text-brand-dark"
            aria-hidden="true"
          >
            {{ initials }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-xs font-medium text-ink">
              {{ snapshot?.account.name ?? 'Your account' }}
            </p>
            <p class="mt-0.5 truncate text-[11px] text-muted">
              @{{ snapshot?.account.login ?? 'github' }}
            </p>
          </div>
        </div>
        <button
          type="button"
          :disabled="signingOut"
          aria-label="Sign out of Diffvera"
          class="mt-3.5 flex min-h-9 w-full items-center justify-between rounded-lg border border-border bg-paper/60 px-3 text-xs font-medium text-muted transition-colors duration-200 hover:border-brand/40 hover:bg-paper hover:text-ink disabled:opacity-60 motion-reduce:transition-none"
          @click="handleSignOut"
        >
          <span class="inline-flex items-center gap-2">
            <HugeiconsIcon :icon="Logout01Icon" :size="15" aria-hidden="true" />
            <span>{{ signingOut ? 'Signing out…' : 'Sign out' }}</span>
          </span>
          <UiSpinner v-if="signingOut" :size="14" />
        </button>
      </div>
    </aside>
    <div class="min-w-0">
      <header
        class="flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-5 sm:px-8"
      >
        <p class="text-xs text-muted">
          Workspace
          <span aria-hidden="true" class="mx-2 text-border">/</span>
          <span class="font-medium text-ink">
            {{
              navigation.find((item) =>
                item.to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(item.to)
              )?.name ?? 'Overview'
            }}
          </span>
        </p>
        <NuxtLink
          :to="path('/dashboard/settings')"
          class="flex min-h-9 items-center gap-2 rounded-sm text-xs text-muted transition-colors duration-200 hover:text-ink motion-reduce:transition-none"
        >
          <HugeiconsIcon :icon="GithubIcon" :size="16" aria-hidden="true" />
          GitHub connection
        </NuxtLink>
      </header>
      <main id="workspace-content" tabindex="-1" class="w-full px-5 py-7 sm:px-8 lg:py-8">
        <div
          v-if="(loading && !snapshot) || (isDev && route.query.state === 'loading')"
          role="status"
          class="flex items-center gap-3 rounded-xl border border-border bg-surface p-8 text-sm text-muted"
        >
          <UiSpinner :size="20" />
          Loading your workspace…
        </div>
        <WorkspaceEmptyState
          v-else-if="error"
          title="Your workspace could not be loaded."
          description="Try loading it again. Your repository settings have not been changed."
        >
          <UiAsyncButton
            type="button"
            :loading="loading"
            loading-text="Loading…"
            :disabled="loading"
            class="min-h-11 rounded-lg bg-ink px-5 text-xs font-semibold text-white"
            @click="refresh()"
          >
            Try again
          </UiAsyncButton>
        </WorkspaceEmptyState>
        <slot v-else />
      </main>
    </div>
  </div>
</template>
