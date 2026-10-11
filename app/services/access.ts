import type {
  AccessService,
  GitHubConnectionState,
  GitHubIdentity,
  RepositoryAccess,
  SignInState
} from '~/types/access'

function getFetchHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (import.meta.server) {
    const reqHeaders = useRequestHeaders(['cookie'])
    if (reqHeaders.cookie) {
      const match = reqHeaders.cookie.match(/(?:^|;\s*)diffvera_session=([^;]+)/)
      if (match) {
        headers.cookie = `diffvera_session=${match[1]}`
      }
    }
  }
  return headers
}

interface HttpError {
  status?: number
  statusCode?: number
}

function isHttpError(err: unknown): err is HttpError {
  return typeof err === 'object' && err !== null && ('status' in err || 'statusCode' in err)
}

interface BackendUserSession {
  id: string
  githubUserId: number
  login: string
  name?: string
  email?: string
  avatarUrl?: string
}

interface BackendOnboardingStatus {
  status: 'ready' | 'needs_installation' | 'pending_approval'
  installationCount: number
  repositoryCount: number
  installUrl?: string
}

interface BackendRepository {
  id: string
  githubRepoId: number
  name: string
  fullName: string
  isPrivate: boolean
  language?: string | null
  defaultBranch: string
  accessStatus: string
}

async function fetchUserSession(): Promise<BackendUserSession | null> {
  try {
    const headers = getFetchHeaders()
    // If running on server without session cookie, don't query /session
    if (import.meta.server && !headers.cookie) {
      return null
    }
    const user = await $fetch<BackendUserSession>('/api/v1/auth/session', {
      headers,
      credentials: 'include'
    })
    return (user && user.id) ? user : null
  } catch {
    return null
  }
}

export function createAccessService(): AccessService {
  return {
    async getSignInState(mode: 'entry' | 'return'): Promise<SignInState> {
      // In entry mode, the user is arriving to sign in; never query /session upfront
      if (mode === 'entry') {
        return { status: 'ready' }
      }

      try {
        const user = await $fetch<BackendUserSession>('/api/v1/auth/session', {
          headers: getFetchHeaders(),
          credentials: 'include'
        })

        if (user && user.id) {
          return {
            status: 'verified',
            session: {
              user: {
                id: String(user.id),
                login: user.login,
                name: user.name || user.login
              },
              expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
            }
          }
        }

        return { status: 'cancelled' }
      } catch (error: unknown) {
        if (isHttpError(error) && (error.status === 401 || error.statusCode === 401)) {
          const route = useRoute()
          if (route.query.error === 'access_denied') {
            return { status: 'cancelled' }
          }
          if (route.query.error) {
            return { status: 'error' }
          }
          return { status: 'cancelled' }
        }

        return { status: 'unavailable' }
      }
    },

    async getConnectionState(mode: 'entry' | 'return'): Promise<GitHubConnectionState> {
      const user = await fetchUserSession()
      if (!user) {
        return { status: 'session-required' }
      }

      const identity: GitHubIdentity = {
        id: String(user.id),
        login: user.login,
        name: user.name || user.login
      }

      try {
        const route = useRoute()
        const queryParams = new URLSearchParams()
        if (route.query.installation_id) {
          queryParams.set('installation_id', String(route.query.installation_id))
        }
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''

        const onboarding = await $fetch<BackendOnboardingStatus>(`/api/v1/onboarding/status${queryString}`, {
          headers: getFetchHeaders(),
          credentials: 'include'
        })

        if (onboarding.status === 'needs_installation') {
          return {
            status: 'not-installed',
            account: identity
          }
        }

        if (onboarding.status === 'pending_approval') {
          return {
            status: 'pending-approval',
            organization: identity.login
          }
        }

        const repos = await $fetch<BackendRepository[]>('/api/v1/repositories', {
          headers: getFetchHeaders(),
          credentials: 'include'
        })

        const mappedRepositories: RepositoryAccess[] = (repos || []).map((r) => ({
          id: String(r.id),
          fullName: r.fullName,
          language: r.language ?? null,
          visibility: r.isPrivate ? 'private' : 'public'
        }))

        return {
          status: 'connected',
          account: identity,
          repositories: mappedRepositories
        }
      } catch {
        return { status: mode === 'return' ? 'error' : 'unavailable' }
      }
    }
  }
}
