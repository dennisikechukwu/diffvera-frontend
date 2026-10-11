import type { GitHubConnectionState, SignInState } from '~/types/access'

const account = { id: 'fixture-user', login: 'alex-morgan', name: 'Alex Morgan' }

export const signInScenarios = {
  checking: { status: 'checking' },
  verified: { status: 'verified', session: { user: account, expiresAt: '2099-01-01T00:00:00Z' } },
  cancelled: { status: 'cancelled' },
  expired: { status: 'expired' },
  error: { status: 'error' },
  unavailable: { status: 'unavailable' }
} satisfies Record<string, SignInState>

export const connectionScenarios = {
  'session-required': { status: 'session-required' },
  'not-installed': { status: 'not-installed', account },
  checking: { status: 'checking' },
  'pending-approval': { status: 'pending-approval', organization: 'Northstar Engineering' },
  connected: {
    status: 'connected',
    account,
    repositories: [
      {
        id: 'repo-orders',
        fullName: 'northstar/order-service',
        language: 'TypeScript',
        visibility: 'private'
      },
      {
        id: 'repo-worker',
        fullName: 'northstar/event-worker',
        language: 'Python',
        visibility: 'private'
      },
      { id: 'repo-sdk', fullName: 'northstar/client-sdk', language: 'Go', visibility: 'public' }
    ]
  },
  empty: { status: 'connected', account, repositories: [] },
  cancelled: { status: 'cancelled' },
  error: { status: 'error' },
  unavailable: { status: 'unavailable' }
} satisfies Record<string, GitHubConnectionState>
