<script setup lang="ts">
const { snapshot, path } = useWorkspace()
</script>

<template>
  <div>
    <WorkspacePageHeader
      eyebrow="Workspace settings"
      title="Settings"
      description="Your GitHub identity and repository connection."
    />
    <section
      aria-labelledby="account-heading"
      class="rounded-xl border border-border bg-surface p-5 sm:p-6"
    >
      <h2 id="account-heading" class="text-sm font-semibold">GitHub account</h2>
      <dl class="mt-5 grid gap-5 text-xs sm:grid-cols-2">
        <div>
          <dt class="text-muted">Name</dt>
          <dd class="mt-2 font-medium">{{ snapshot?.account.name }}</dd>
        </div>
        <div>
          <dt class="text-muted">GitHub username</dt>
          <dd class="mt-2 font-medium">{{ snapshot?.account.login }}</dd>
        </div>
      </dl>
    </section>
    <section
      aria-labelledby="connection-settings-heading"
      class="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6"
    >
      <h2 id="connection-settings-heading" class="text-sm font-semibold">Repository connection</h2>
      <p class="mt-3 text-xs leading-6 text-muted">
        {{ snapshot?.repositories.filter((repo) => repo.access === 'available').length ?? 0 }}
        repositories have access. Repository permissions are managed through the GitHub App
        installation.
      </p>
      <NuxtLink
        :to="path('/dashboard/repositories')"
        class="mt-5 inline-flex min-h-10 items-center rounded-lg border border-border px-4 text-xs font-medium hover:bg-paper"
      >
        View repositories
      </NuxtLink>
      <a
        href="https://github.com/apps/diffvera/installations/new"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 ml-0 inline-flex min-h-10 items-center rounded-lg border border-border px-4 text-xs font-medium text-ink transition-colors hover:bg-paper sm:ml-3"
      >
        Manage on GitHub
      </a>
    </section>
    <p class="mt-6 text-xs leading-6 text-muted">
      Diffvera does not edit repository code or merge pull requests.
    </p>
  </div>
</template>
