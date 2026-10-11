import type { GitHubIdentity, RepositoryAccess } from '~/types/access'

export interface Repository extends RepositoryAccess {
  description: string
  access: 'available' | 'revoked'
  defaultBranch: string
  updatedAt?: string
  pushedAt?: string
}
export interface PullRequest {
  id: string
  repositoryId: string
  number: number
  title: string
  author: string
  status: 'open' | 'merged' | 'closed'
  headSha: string
  branch: string
  updatedAt: string
  additions: number
  deletions: number
}
export interface CodeLine {
  number: number
  text: string
  kind?: 'added' | 'removed'
}
export interface ChangedFile {
  path: string
  lines: CodeLine[]
}
export type Feedback = 'useful' | 'false-positive' | 'resolved' | null
export interface Finding {
  id: string
  title: string
  category: 'security' | 'correctness' | 'architecture'
  severity: 'high' | 'medium' | 'low'
  file: string
  startLine: number
  endLine: number
  explanation: string
  suggestion: string
  correction: string
  ruleId?: string
  feedback: Feedback
}
export interface Review {
  id: string
  pullRequestId: string
  headSha: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  createdAt: string
  requestedAt?: number
  findings: Finding[]
  files: ChangedFile[]
  failureReason?: string
}
export interface ArchitectureRule {
  id: string
  name: string
  description: string
  repositoryId: string
  enabled: boolean
}
export interface WorkspaceSnapshot {
  account: GitHubIdentity
  repositories: Repository[]
  pullRequests: PullRequest[]
  reviews: Review[]
  rules: ArchitectureRule[]
}
export interface WorkspaceService {
  load(): Promise<WorkspaceSnapshot>
  requestReview(repositoryId: string, pullRequestId: string): Promise<WorkspaceSnapshot>
  setFeedback(reviewId: string, findingId: string, feedback: Feedback): Promise<WorkspaceSnapshot>
  saveRule(rule: ArchitectureRule): Promise<WorkspaceSnapshot>
  createRule(rule: Omit<ArchitectureRule, 'id'>): Promise<WorkspaceSnapshot>
}
