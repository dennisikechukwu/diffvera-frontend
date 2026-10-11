import type { ChangedFile, WorkspaceSnapshot } from '~/types/workspace'

// Authored inspection data only; this does not run a review or generate findings.
export function addLargeReviewFixture(snapshot: WorkspaceSnapshot) {
  const files: ChangedFile[] = [
    {
      path: 'src/services/orders/cancel-order.ts',
      lines: [
        {
          number: 31,
          text: 'export async function cancelOrder(orderId: string, userId: string) {'
        },
        { number: 32, text: '  return db.order.update({', kind: 'added' },
        { number: 33, text: '    where: { id: orderId },', kind: 'added' },
        { number: 34, text: "    data: { status: 'cancelled' },", kind: 'added' },
        { number: 35, text: '  });' },
        { number: 36, text: '}' }
      ]
    },
    {
      path: 'src/services/orders/refund-order.ts',
      lines: [
        {
          number: 7,
          text: "import { refundController } from '../../controllers/refunds';",
          kind: 'added'
        },
        { number: 8, text: 'export async function refundOrder(orderId: string) {' },
        { number: 9, text: '  return refundController.create(orderId);', kind: 'added' },
        { number: 10, text: '}' }
      ]
    },
    {
      path: 'src/jobs/orders/retry-refund.ts',
      lines: [
        { number: 18, text: 'export function retryRefund(delay?: number) {' },
        { number: 19, text: '  // Zero means retry immediately.' },
        { number: 20, text: '  const retryDelay = delay || DEFAULT_DELAY;', kind: 'added' },
        { number: 21, text: '  return refundQueue.schedule(retryDelay);' },
        { number: 22, text: '}' }
      ]
    },
    {
      path: 'src/routes/orders/cancel-order.ts',
      lines: [
        {
          number: 12,
          text: "router.post('/orders/:id/cancel', requireSession, async (req, res) => {"
        },
        {
          number: 13,
          text: '  const order = await cancelOrder(req.params.id, req.session.userId);',
          kind: 'added'
        },
        { number: 14, text: '  res.json(order);' },
        { number: 15, text: '});' }
      ]
    },
    {
      path: 'src/types/orders/order-status.ts',
      lines: [
        {
          number: 1,
          text: "export type OrderStatus = 'pending' | 'paid' | 'cancelled';",
          kind: 'added'
        }
      ]
    },
    {
      path: 'src/repositories/orders/order-repository.ts',
      lines: [
        { number: 44, text: 'export function findOwnedOrder(orderId: string, ownerId: string) {' },
        {
          number: 45,
          text: '  return db.order.findFirst({ where: { id: orderId, ownerId } });',
          kind: 'added'
        },
        { number: 46, text: '}' }
      ]
    },
    {
      path: 'tests/integration/orders/cancellation/returns-the-cancelled-order-to-the-authenticated-customer.test.ts',
      lines: [
        { number: 21, text: "test('returns the cancelled order', async () => {" },
        {
          number: 22,
          text: '  const result = await cancelOrder(ownedOrder.id, customer.id);',
          kind: 'added'
        },
        { number: 23, text: "  expect(result.status).toBe('cancelled');", kind: 'added' },
        { number: 24, text: '});' }
      ]
    },
    {
      path: 'docs/orders/cancellation.md',
      lines: [
        { number: 1, text: '# Order cancellation', kind: 'added' },
        {
          number: 3,
          text: 'Cancellation marks an order as cancelled and schedules its refund.',
          kind: 'added'
        }
      ]
    }
  ]
  snapshot.pullRequests.unshift({
    id: 'pr-56',
    repositoryId: 'orders',
    number: 56,
    title: 'Add order cancellation and refunds',
    author: 'alex-morgan',
    status: 'open',
    headSha: 'c4a19d2',
    branch: 'feat/order-cancellation',
    updatedAt: '2026-10-07T11:20:00Z',
    additions: 137,
    deletions: 31
  })
  snapshot.reviews.unshift({
    id: 'review-56',
    pullRequestId: 'pr-56',
    headSha: 'c4a19d2',
    status: 'completed',
    createdAt: '2026-10-07T11:25:00Z',
    files,
    findings: [
      {
        id: 'cancellation-ownership',
        title: 'Cancellation does not check the order owner.',
        category: 'security',
        severity: 'high',
        file: files[0]!.path,
        startLine: 31,
        endLine: 34,
        explanation:
          'The authenticated user ID is accepted but omitted from the update condition. An order identifier alone does not establish permission to cancel it.',
        suggestion:
          'Restrict the update to an order belonging to the authenticated user and handle an inaccessible order.',
        correction:
          "return db.order.updateMany({\n  where: { id: orderId, ownerId: userId },\n  data: { status: 'cancelled' },\n});",
        feedback: null
      },
      {
        id: 'refund-boundary',
        title: 'Refund logic depends on an HTTP controller.',
        category: 'architecture',
        severity: 'medium',
        file: files[1]!.path,
        startLine: 7,
        endLine: 9,
        ruleId: 'service-boundary',
        explanation:
          'The service imports a controller, crossing the configured service boundary. Transport handlers should call the service layer.',
        suggestion:
          'Call the refund repository from the service; keep the controller responsible for HTTP input and output.',
        correction:
          "import { refundRepository } from '../../repositories/refunds';\n\nreturn refundRepository.create(orderId);",
        feedback: null
      },
      {
        id: 'refund-zero-delay',
        title: 'An immediate retry becomes a delayed retry.',
        category: 'correctness',
        severity: 'medium',
        file: files[2]!.path,
        startLine: 19,
        endLine: 20,
        explanation:
          'The comment defines zero as an immediate retry. The logical OR expression replaces zero with the default delay.',
        suggestion: 'Use the default only when delay is null or undefined.',
        correction: 'const retryDelay = delay ?? DEFAULT_DELAY;',
        feedback: null
      }
    ]
  })
  const zeroFindingsFile: ChangedFile = {
    path: 'src/utils/order-timestamps.ts',
    lines: [
      { number: 4, text: 'export function normalizeTimestamp(value: string) {' },
      { number: 5, text: '  return new Date(value).toISOString();', kind: 'added' },
      { number: 6, text: '}' }
    ]
  }
  snapshot.reviews.push(
    {
      id: 'review-35',
      pullRequestId: 'pr-35',
      headSha: '6eab401',
      status: 'completed',
      createdAt: '2026-10-05T10:05:00Z',
      files: [zeroFindingsFile],
      findings: []
    },
    {
      id: 'review-queued',
      pullRequestId: 'pr-42',
      headSha: 'f9b21a7',
      status: 'queued',
      createdAt: '2026-10-07T10:00:00Z',
      files: [],
      findings: []
    },
    {
      id: 'review-running',
      pullRequestId: 'pr-18',
      headSha: '8bc10e2',
      status: 'running',
      createdAt: '2026-10-07T10:05:00Z',
      files: [],
      findings: []
    }
  )
  snapshot.reviews.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
