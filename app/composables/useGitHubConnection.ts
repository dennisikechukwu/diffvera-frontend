import { createAccessService } from '~/services/access'
import type { GitHubConnectionState } from '~/types/access'

export function useGitHubConnection(mode: 'entry' | 'return') {
  const service = createAccessService()
  const request = useAsyncData(`github-connection-${mode}`, () => service.getConnectionState(mode))
  const state = computed<GitHubConnectionState>(() => {
    if (request.status.value === 'pending' && !request.data.value) return { status: 'checking' }
    if (request.error.value) return { status: 'error' }
    return request.data.value ?? { status: 'session-required' }
  })
  return {
    state,
    refresh: request.refresh,
    loading: computed(() => request.status.value === 'pending')
  }
}
