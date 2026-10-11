import { createWorkspaceService } from '~/services/workspace'
import type {
  ArchitectureRule,
  Feedback,
  WorkspaceService,
  WorkspaceSnapshot
} from '~/types/workspace'

export function useWorkspace() {
  const route = useRoute()
  const customHeaders: Record<string, string> = {}
  if (import.meta.server) {
    try {
      const raw = useRequestHeaders(['cookie']).cookie
      if (raw) {
        const match = raw.match(/(?:^|;\s*)diffvera_session=([^;]+)/)
        if (match) {
          customHeaders.cookie = `diffvera_session=${match[1]}`
        }
      }
    } catch {
      // Safe fallback if called outside request context
    }
  }

  const isPreview = computed(() => false)
  const scenario = computed(() =>
    route.query.state === 'empty'
      ? 'empty'
      : route.query.state === 'large'
        ? 'large'
        : 'default'
  )
  const snapshot = useState<WorkspaceSnapshot | null>(`workspace-${scenario.value}`, () => null)
  const actionError = ref('')
  const pendingAction = useState<string | null>(
    `workspace-pending-action-${scenario.value}`,
    () => null
  )
  const busy = computed(() => pendingAction.value !== null)

  async function service(): Promise<WorkspaceService> {
    if (route.query.fixture === '1') {
      const fixtures = await import('~/mocks/workspace')
      if (!snapshot.value) {
        snapshot.value = fixtures.createWorkspaceFixture(scenario.value === 'empty')
        if (scenario.value === 'large') {
          const { addLargeReviewFixture } = await import('~/mocks/large-review')
          addLargeReviewFixture(snapshot.value)
        }
      }
      return fixtures.createMockWorkspaceService(() => toRaw(snapshot.value!))
    }
    return createWorkspaceService(customHeaders)
  }

  const request = useAsyncData(`workspace-load-${scenario.value}`, async () => {
    if (import.meta.dev && route.query.state === 'error')
      throw new Error('Unable to load the workspace.')
    const data = await (await service()).load()
    snapshot.value = data
    return true
  })

  function path(destination: string) {
    return destination
  }

  async function action(
    key: string,
    run: (gateway: WorkspaceService) => Promise<WorkspaceSnapshot>
  ) {
    if (busy.value) return
    pendingAction.value = key
    actionError.value = ''
    try {
      snapshot.value = await run(await service())
    } catch (error) {
      actionError.value =
        error instanceof Error ? error.message : 'The action could not be completed.'
    } finally {
      pendingAction.value = null
    }
  }

  async function requestReview(repositoryId: string, pullRequestId: string) {
    await action(`review:${pullRequestId}`, async (gateway) => {
      const next = await gateway.requestReview(repositoryId, pullRequestId)
      const id = next.reviews.find(
        (review) =>
          review.pullRequestId === pullRequestId && ['queued', 'running'].includes(review.status)
      )?.id
      snapshot.value = next
      if (id) await navigateTo(path(`/dashboard/reviews/${id}`))
      return next
    })
  }

  return {
    snapshot,
    isPreview,
    path,
    busy,
    isPending: (key: string) => pendingAction.value === key,
    actionError,
    loading: computed(() => request.status.value === 'pending'),
    error: computed(() => request.error.value?.message ?? ''),
    refresh: request.refresh,
    requestReview,
    setFeedback: (reviewId: string, findingId: string, feedback: Feedback) =>
      action(`feedback:${reviewId}:${findingId}:${feedback ?? 'clear'}`, (gateway) =>
        gateway.setFeedback(reviewId, findingId, feedback)
      ),
    saveRule: (rule: ArchitectureRule) =>
      action(`rule:${rule.id}`, (gateway) => gateway.saveRule(rule)),
    createRule: (rule: Omit<ArchitectureRule, 'id'>) =>
      action('rule:create', (gateway) => gateway.createRule(rule))
  }
}
