import type {
  ArchitectureRule,
  Feedback,
  WorkspaceService,
  WorkspaceSnapshot
} from '~/types/workspace'

export function createWorkspaceService(customHeaders?: Record<string, string>): WorkspaceService {
  const headers = customHeaders ?? {}
  return {
    async load(): Promise<WorkspaceSnapshot> {
      return await $fetch<WorkspaceSnapshot>('/api/v1/workspace', {
        headers,
        credentials: 'include'
      })
    },

    async requestReview(_repositoryId: string, pullRequestId: string): Promise<WorkspaceSnapshot> {
      await $fetch('/api/v1/reviews/trigger', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: { pullRequestId }
      })
      return await this.load()
    },

    async setFeedback(_reviewId: string, findingId: string, feedback: Feedback): Promise<WorkspaceSnapshot> {
      if (feedback) {
        await $fetch(`/api/v1/findings/${findingId}/feedback`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: { feedback }
        })
      }
      return await this.load()
    },

    async createRule(rule: Omit<ArchitectureRule, 'id'>): Promise<WorkspaceSnapshot> {
      await $fetch(`/api/v1/repositories/${rule.repositoryId}/rules`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: {
          name: rule.name,
          boundary: rule.description
        }
      })
      return await this.load()
    },

    async saveRule(rule: ArchitectureRule): Promise<WorkspaceSnapshot> {
      await $fetch(`/api/v1/rules/${rule.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: {
          name: rule.name,
          boundary: rule.description,
          isEnabled: rule.enabled
        }
      })
      return await this.load()
    }
  }
}
