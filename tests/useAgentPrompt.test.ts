import test from 'node:test'
import assert from 'node:assert/strict'
import {
  detectCodeLanguage,
  buildFindingPrompt,
  buildBatchReviewPrompt
} from '../app/composables/useAgentPrompt.ts'

test('detectCodeLanguage maps file extensions correctly', () => {
  assert.equal(detectCodeLanguage('src/index.ts'), 'typescript')
  assert.equal(detectCodeLanguage('components/App.vue'), 'vue')
  assert.equal(detectCodeLanguage('src/Main.java'), 'java')
  assert.equal(detectCodeLanguage('scripts/deploy.py'), 'python')
  assert.equal(detectCodeLanguage('server/main.go'), 'go')
  assert.equal(detectCodeLanguage('backend/Cargo.rs'), 'rust')
  assert.equal(detectCodeLanguage('unknown.xyz'), 'text')
})

test('buildFindingPrompt produces structured prompt with verification checklist', () => {
  const finding = {
    id: 'f-1',
    title: 'Cross-layer dependency in Service',
    category: 'architecture' as const,
    severity: 'high' as const,
    file: 'src/services/OrderService.ts',
    startLine: 42,
    endLine: 45,
    explanation: 'OrderService directly imports UserController, violating Clean Architecture.',
    suggestion: 'Inject UserRepository or a domain service instead.',
    correction: 'const user = await this.userRepo.findById(userId);',
    ruleName: 'Clean Architecture Boundary',
    feedback: null
  }

  const prompt = buildFindingPrompt(finding, { repositoryName: 'acme/orders' })

  assert.match(prompt, /TASK: Remediate Code Review Finding in acme\/orders/)
  assert.match(prompt, /Target File.*src\/services\/OrderService\.ts/)
  assert.match(prompt, /Lines.*L42–L45/)
  assert.match(prompt, /Category.*ARCHITECTURE/)
  assert.match(prompt, /Severity.*HIGH/)
  assert.match(prompt, /Architecture Rule.*Clean Architecture Boundary/)
  assert.match(prompt, /Cross-layer dependency in Service/)
  assert.match(prompt, /Explore Full Workspace Scope/)
  assert.match(prompt, /```typescript\nconst user = await this\.userRepo\.findById\(userId\);\n```/)
  assert.match(prompt, /REPORT FORMAT \(produce exactly this\)/)
  assert.match(prompt, /## Verification Checklist/)
  assert.match(prompt, /- \[ \] Resolved Cross-layer dependency in Service in src\/services\/OrderService\.ts:42–45/)
})

test('buildBatchReviewPrompt produces consolidated prompt for all findings', () => {
  const findings = [
    {
      id: 'f-1',
      title: 'Missing authorization check',
      category: 'security' as const,
      severity: 'high' as const,
      file: 'src/api/orders.ts',
      startLine: 12,
      endLine: 14,
      explanation: 'No auth check before deleting order',
      suggestion: 'Add requireAuth middleware',
      correction: 'app.delete("/orders/:id", requireAuth, handler)',
      feedback: null
    },
    {
      id: 'f-2',
      title: 'Uncached database call in loop',
      category: 'correctness' as const,
      severity: 'medium' as const,
      file: 'src/jobs/sync.ts',
      startLine: 88,
      endLine: 95,
      explanation: 'N+1 query pattern',
      suggestion: 'Batch query IDs',
      correction: 'const users = await findUsersBatch(ids);',
      feedback: null
    }
  ]

  const batchPrompt = buildBatchReviewPrompt(findings, {
    repositoryName: 'acme/orders',
    prNumber: 42,
    prTitle: 'feat: add delete order'
  })

  assert.match(batchPrompt, /TASK: Remediate 2 Code Review Findings in acme\/orders \(PR #42: feat: add delete order\)/)
  assert.match(batchPrompt, /Finding 1: Missing authorization check/)
  assert.match(batchPrompt, /Finding 2: Uncached database call in loop/)
  assert.match(batchPrompt, /REPORT FORMAT \(produce exactly this\)/)
  assert.match(batchPrompt, /- \[ \] Finding 1: Missing authorization check \(src\/api\/orders\.ts:L12\)/)
  assert.match(batchPrompt, /- \[ \] Finding 2: Uncached database call in loop \(src\/jobs\/sync\.ts:L88\)/)
})
