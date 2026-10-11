<script setup lang="ts">
import type { ArchitectureRule } from '~/types/workspace'
const { snapshot, path, saveRule, createRule, busy, isPending, actionError } = useWorkspace()
const editing = ref<string | null>(null)
const draft = ref<ArchitectureRule | null>(null)
const message = ref('')
const saving = computed(() =>
  isPending(editing.value === 'new' ? 'rule:create' : `rule:${editing.value}`)
)
const availableRepositories = computed(
  () => snapshot.value?.repositories.filter((repo) => repo.access === 'available') ?? []
)
const displayedRules = computed(() =>
  editing.value === 'new' && draft.value
    ? [draft.value, ...(snapshot.value?.rules ?? [])]
    : (snapshot.value?.rules ?? [])
)
const valid = computed(
  () =>
    !!draft.value?.name.trim() &&
    !!draft.value?.description.trim() &&
    availableRepositories.value.some((repo) => repo.id === draft.value?.repositoryId)
)
async function edit(rule: ArchitectureRule) {
  draft.value = { ...rule }
  editing.value = rule.id
  message.value = ''
  await nextTick()
  document.getElementById(`rule-name-${rule.id}`)?.focus()
}
async function add() {
  draft.value = {
    id: 'new',
    name: '',
    description: '',
    repositoryId: availableRepositories.value[0]?.id ?? '',
    enabled: true
  }
  editing.value = 'new'
  message.value = ''
  await nextTick()
  document.getElementById('rule-name-new')?.focus()
}
async function cancel() {
  const id = editing.value
  editing.value = null
  await nextTick()
  document.getElementById(id === 'new' ? 'add-rule' : `rule-edit-${id}`)?.focus()
}
async function save() {
  if (!draft.value || !valid.value) return
  const fields = {
    name: draft.value.name.trim(),
    description: draft.value.description.trim(),
    repositoryId: draft.value.repositoryId,
    enabled: draft.value.enabled
  }
  if (editing.value === 'new') await createRule(fields)
  else await saveRule({ id: draft.value.id, ...fields })
  if (!actionError.value) {
    const id = editing.value === 'new' ? snapshot.value?.rules.at(-1)?.id : editing.value
    editing.value = null
    message.value = 'Rule saved.'
    await nextTick()
    document.getElementById(`rule-edit-${id}`)?.focus()
  }
}
</script>

<template>
  <div>
    <WorkspacePageHeader
      eyebrow="Architecture governance"
      title="Architecture rules"
      description="Define the boundaries your team expects reviews to consider. Changes apply to future review requests."
    >
      <button
        id="add-rule"
        type="button"
        :disabled="!availableRepositories.length || busy || !!editing"
        class="min-h-11 rounded-lg bg-ink px-4 text-xs font-semibold text-white disabled:opacity-60"
        @click="add"
      >
        Add rule
      </button>
    </WorkspacePageHeader>
    <p role="status" class="mb-4 text-xs text-muted">{{ message }}</p>
    <p v-if="actionError" role="alert" class="mb-4 text-xs text-brand-dark">{{ actionError }}</p>
    <WorkspaceEmptyState
      v-if="!displayedRules.length"
      title="No architecture rules yet."
      :description="
        availableRepositories.length
          ? 'Add a rule to describe your team’s architecture boundaries.'
          : 'Connect repositories before defining their architecture boundaries.'
      "
    />
    <div v-else class="space-y-4">
      <article
        v-for="rule in displayedRules"
        :key="rule.id"
        class="rounded-xl border border-border bg-surface p-5 sm:p-6"
      >
        <template v-if="editing === rule.id && draft">
          <form @submit.prevent="save">
            <fieldset :disabled="saving" class="min-w-0">
              <template v-if="editing === 'new'">
                <label for="rule-repository" class="mb-2 block text-xs font-medium">
                  Repository
                </label>
                <UiSelect
                  id="rule-repository"
                  v-model="draft.repositoryId"
                  :options="
                    availableRepositories.map((repo) => ({ value: repo.id, label: repo.fullName }))
                  "
                  class="mb-4"
                />
              </template>
              <label :for="`rule-name-${rule.id}`" class="mb-2 block text-xs font-medium">
                Rule name
              </label>
              <input
                :id="`rule-name-${rule.id}`"
                v-model="draft.name"
                placeholder="For example: Keep services independent of controllers"
                required
                maxlength="120"
                class="min-h-11 w-full rounded-lg border border-border px-3 text-sm"
              >
              <label
                :for="`rule-description-${rule.id}`"
                class="mt-4 mb-2 block text-xs font-medium"
              >
                Boundary description
              </label>
              <textarea
                :id="`rule-description-${rule.id}`"
                v-model="draft.description"
                :aria-describedby="`rule-hint-${rule.id}`"
                placeholder="Modules in src/services must not import modules in src/controllers. Controllers call services."
                required
                maxlength="2000"
                rows="4"
                class="w-full resize-y rounded-lg border border-border p-3 text-sm leading-6"
              />
              <p :id="`rule-hint-${rule.id}`" class="mt-2 text-[11px] leading-5 text-muted">
                Name the modules or paths involved, the dependency to avoid, and the expected
                direction.
              </p>
              <label class="mt-4 flex min-h-10 items-center gap-3 text-xs">
                <input v-model="draft.enabled" type="checkbox" class="size-4 accent-ink" >
                Use this rule in future reviews
              </label>
              <div class="mt-4 flex flex-wrap gap-3">
                <UiAsyncButton
                  type="submit"
                  :disabled="busy || !valid"
                  :loading="isPending(editing === 'new' ? 'rule:create' : `rule:${rule.id}`)"
                  loading-text="Saving…"
                  class="min-h-10 rounded-lg bg-ink px-4 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Save rule
                </UiAsyncButton>
                <button
                  type="button"
                  :disabled="busy"
                  class="min-h-10 rounded-lg border border-border px-4 text-xs"
                  @click="cancel"
                >
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        </template>
        <template v-else>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold break-words">{{ rule.name }}</h2>
              <NuxtLink
                :to="path(`/dashboard/repositories/${rule.repositoryId}`)"
                class="mt-2 inline-block rounded-sm text-[11px] text-muted hover:text-ink"
              >
                {{ snapshot?.repositories.find((repo) => repo.id === rule.repositoryId)?.fullName }}
              </NuxtLink>
            </div>
            <WorkspaceStatusBadge :status="rule.enabled ? 'enabled' : 'disabled'" />
          </div>
          <p class="mt-4 max-w-180 text-xs leading-6 break-words text-muted">
            {{ rule.description }}
          </p>
          <button
            :id="`rule-edit-${rule.id}`"
            type="button"
            :disabled="
              busy ||
              !!editing ||
              !availableRepositories.some((repo) => repo.id === rule.repositoryId)
            "
            class="mt-5 min-h-10 rounded-lg border border-border px-4 text-xs font-medium hover:bg-paper"
            @click="edit(rule)"
          >
            Edit rule
          </button>
        </template>
      </article>
    </div>
    <p class="mt-6 text-xs leading-6 text-muted">
      Architecture findings reflect your team’s rules and the reviewed code. They require human
      assessment.
    </p>
  </div>
</template>
