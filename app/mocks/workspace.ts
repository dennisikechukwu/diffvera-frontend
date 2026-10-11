import type { WorkspaceService, WorkspaceSnapshot, Finding } from '~/types/workspace'

const ownership: Finding = {
  id: 'ownership',
  title: 'An order ID isn’t an ownership check.',
  category: 'security',
  severity: 'high',
  file: 'src/services/orders.ts',
  startLine: 25,
  endLine: 28,
  explanation:
    'The authenticated user ID is passed into this function but is not used in the lookup. A caller who knows another order ID could retrieve an order belonging to someone else.',
  suggestion:
    'Include the server-authenticated user ID in the query and handle an order that does not exist or is not accessible.',
  correction: 'return db.order.findFirst({\n  where: { id: orderId, ownerId: userId },\n});',
  feedback: null
}
const boundary: Finding = {
  id: 'boundary',
  title: 'The service imports a controller.',
  category: 'architecture',
  severity: 'medium',
  file: 'src/services/orders.ts',
  startLine: 12,
  endLine: 13,
  ruleId: 'service-boundary',
  explanation:
    'Your service-boundary rule says that service modules must not depend on controllers. This import reverses that direction and ties business logic to the HTTP layer.',
  suggestion:
    'Read orders through the repository layer. Keep controllers responsible for calling services.',
  correction:
    "import { orderRepository } from '../repositories/orders';\n\nreturn orderRepository.findById(orderId);",
  feedback: null
}
const snapshot: WorkspaceSnapshot = {
  account: { id: 'fixture-user', name: 'Alex Morgan', login: 'alex-morgan' },
  repositories: [
    {
      id: 'orders',
      fullName: 'northstar/order-service',
      language: 'TypeScript',
      visibility: 'private',
      description: 'Order processing and customer access.',
      access: 'available',
      defaultBranch: 'main'
    },
    {
      id: 'worker',
      fullName: 'northstar/event-worker',
      language: 'Python',
      visibility: 'private',
      description: 'Background event processing.',
      access: 'available',
      defaultBranch: 'main'
    },
    {
      id: 'sdk',
      fullName: 'northstar/client-sdk',
      language: 'Go',
      visibility: 'public',
      description: 'Client library and API types.',
      access: 'revoked',
      defaultBranch: 'main'
    }
  ],
  pullRequests: [
    {
      id: 'pr-42',
      repositoryId: 'orders',
      number: 42,
      title: 'Add order details endpoint',
      author: 'alex-morgan',
      status: 'open',
      headSha: 'f9b21a7',
      branch: 'feat/order-details',
      updatedAt: '2026-10-07T09:20:00Z',
      additions: 34,
      deletions: 8
    },
    {
      id: 'pr-39',
      repositoryId: 'orders',
      number: 39,
      title: 'Move order lookup into the service',
      author: 'sam-lee',
      status: 'open',
      headSha: 'b7c40d2',
      branch: 'refactor/order-lookup',
      updatedAt: '2026-10-06T16:10:00Z',
      additions: 22,
      deletions: 16
    },
    {
      id: 'pr-35',
      repositoryId: 'orders',
      number: 35,
      title: 'Normalize order timestamps',
      author: 'alex-morgan',
      status: 'merged',
      headSha: '6eab401',
      branch: 'fix/order-timestamps',
      updatedAt: '2026-10-05T10:00:00Z',
      additions: 12,
      deletions: 6
    },
    {
      id: 'pr-18',
      repositoryId: 'worker',
      number: 18,
      title: 'Handle missing event payloads',
      author: 'sam-lee',
      status: 'open',
      headSha: '8bc10e2',
      branch: 'fix/event-payload',
      updatedAt: '2026-10-06T12:30:00Z',
      additions: 18,
      deletions: 4
    },
    {
      id: 'pr-17',
      repositoryId: 'worker',
      number: 17,
      title: 'Preserve retry delay for transient failures',
      author: 'alex-morgan',
      status: 'open',
      headSha: '32fc191',
      branch: 'fix/retry-delay',
      updatedAt: '2026-10-05T14:30:00Z',
      additions: 9,
      deletions: 3
    }
  ],
  reviews: [
    {
      id: 'review-42',
      pullRequestId: 'pr-42',
      headSha: 'a8f19c3',
      status: 'completed',
      createdAt: '2026-10-07T08:00:00Z',
      findings: [ownership],
      files: [
        {
          path: 'src/services/orders.ts',
          lines: [
            { number: 24, text: 'export async function getOrder(' },
            { number: 25, text: '  orderId: string, userId: string' },
            { number: 26, text: ') {' },
            { number: 27, text: '  return db.order.findUnique({', kind: 'added' },
            { number: 28, text: '    where: { id: orderId },', kind: 'added' },
            { number: 29, text: '  });' },
            { number: 30, text: '}' }
          ]
        },
        {
          path: 'src/routes/orders.ts',
          lines: [
            { number: 10, text: "router.get('/orders/:id', async (req, res) => {" },
            { number: 11, text: '  const userId = req.session.userId;' },
            {
              number: 12,
              text: '  const order = await getOrder(req.params.id, userId);',
              kind: 'added'
            },
            { number: 13, text: '  res.json(order);', kind: 'added' },
            { number: 14, text: '});' }
          ]
        }
      ]
    },
    {
      id: 'review-39',
      pullRequestId: 'pr-39',
      headSha: 'b7c40d2',
      status: 'completed',
      createdAt: '2026-10-06T16:15:00Z',
      findings: [boundary],
      files: [
        {
          path: 'src/services/orders.ts',
          lines: [
            {
              number: 12,
              text: "import { orderController } from '../controllers/orders';",
              kind: 'added'
            },
            { number: 13, text: 'return orderController.findById(orderId);', kind: 'added' }
          ]
        }
      ]
    },
    {
      id: 'review-18',
      pullRequestId: 'pr-18',
      headSha: '8bc10e2',
      status: 'failed',
      createdAt: '2026-10-06T12:40:00Z',
      findings: [],
      files: [
        {
          path: 'worker/events.py',
          lines: [
            { number: 18, text: 'def handle_event(event):' },
            { number: 19, text: '    payload = event.get("payload")', kind: 'added' },
            { number: 20, text: '    if payload is None:', kind: 'added' },
            { number: 21, text: '        return', kind: 'added' },
            { number: 22, text: '    process(payload)' }
          ]
        }
      ]
    },
    {
      id: 'review-17',
      pullRequestId: 'pr-17',
      headSha: '32fc191',
      status: 'completed',
      createdAt: '2026-10-05T14:40:00Z',
      findings: [
        {
          id: 'zero-delay',
          title: 'A zero-second delay is replaced by the default.',
          category: 'correctness',
          severity: 'medium',
          file: 'worker/retry.py',
          startLine: 18,
          endLine: 19,
          explanation:
            'The comment documents zero as an immediate retry. Python treats zero as false, so the or expression replaces that valid value with DEFAULT_DELAY.',
          suggestion: 'Use the default only when retry_after is None. Preserve an explicit zero.',
          correction: 'delay = DEFAULT_DELAY if retry_after is None else retry_after',
          feedback: null
        }
      ],
      files: [
        {
          path: 'worker/retry.py',
          lines: [
            { number: 17, text: 'def schedule_retry(retry_after=None):' },
            { number: 18, text: '    # retry_after=0 requests an immediate retry' },
            { number: 19, text: '    delay = retry_after or DEFAULT_DELAY', kind: 'added' },
            { number: 20, text: '    enqueue_retry(delay=delay)' }
          ]
        }
      ]
    }
  ],
  rules: [
    {
      id: 'service-boundary',
      name: 'Keep services independent of controllers',
      description:
        'Modules in src/services must not import modules in src/controllers. Controllers call services; services use repositories.',
      repositoryId: 'orders',
      enabled: true
    },
    {
      id: 'worker-boundary',
      name: 'Keep event handlers independent of transport',
      description:
        'Event handlers must not import HTTP routing modules. Transport adapters should call the handler layer.',
      repositoryId: 'worker',
      enabled: true
    }
  ]
}

export function createWorkspaceFixture(empty = false): WorkspaceSnapshot {
  return structuredClone(
    empty ? { ...snapshot, repositories: [], pullRequests: [], reviews: [], rules: [] } : snapshot
  )
}

export function createMockWorkspaceService(read: () => WorkspaceSnapshot): WorkspaceService {
  return {
    async load() {
      return structuredClone(read())
    },
    async requestReview(repositoryId, pullRequestId) {
      const next = structuredClone(read())
      const repo = next.repositories.find((item) => item.id === repositoryId)
      const pr = next.pullRequests.find(
        (item) => item.id === pullRequestId && item.repositoryId === repositoryId
      )
      if (!repo || repo.access !== 'available' || !pr || pr.status !== 'open')
        throw new Error('This pull request is not available for review.')
      const active = next.reviews.find(
        (item) => item.pullRequestId === pr.id && ['queued', 'running'].includes(item.status)
      )
      if (active) return next
      const source = next.reviews.find((item) => item.pullRequestId === pr.id)
      if (!source) throw new Error('No authored review fixture is available for this pull request.')
      next.reviews.unshift({
        ...structuredClone(source),
        id: `review-request-${next.reviews.length + 1}`,
        headSha: pr.headSha,
        status: 'queued',
        createdAt: new Date().toISOString(),
        requestedAt: Date.now(),
        findings: source.findings
          .filter(
            (item) =>
              !item.ruleId || next.rules.some((rule) => rule.id === item.ruleId && rule.enabled)
          )
          .map((item) => ({ ...item, feedback: null }))
      })
      return next
    },
    async setFeedback(reviewId, findingId, feedback) {
      const next = structuredClone(read())
      const review = next.reviews.find((item) => item.id === reviewId)
      const finding = review?.findings.find((item) => item.id === findingId)
      if (!finding || review?.status !== 'completed')
        throw new Error('This finding is not available for feedback.')
      finding.feedback = feedback
      return next
    },
    async createRule(rule) {
      const next = structuredClone(read())
      if (
        !next.repositories.some(
          (repo) => repo.id === rule.repositoryId && repo.access === 'available'
        )
      ) {
        throw new Error('Repository access is required to create this rule.')
      }
      next.rules.push({ ...rule, id: `rule-${next.rules.length + 1}` })
      return next
    },
    async saveRule(rule) {
      const next = structuredClone(read())
      if (
        !next.repositories.some(
          (repo) => repo.id === rule.repositoryId && repo.access === 'available'
        )
      )
        throw new Error('Repository access is required to update this rule.')
      const index = next.rules.findIndex((item) => item.id === rule.id)
      if (index < 0) throw new Error('This rule no longer exists.')
      next.rules[index] = { ...rule }
      return next
    }
  }
}
