export interface GitHubIdentity {
  id: string
  login: string
  name: string
  avatarUrl?: string | null
}

export interface Session {
  user: GitHubIdentity
  expiresAt: string
}

export type SignInState =
  | { status: 'ready' | 'checking' | 'unavailable' | 'cancelled' | 'expired' | 'error' }
  | { status: 'verified'; session: Session }

export interface RepositoryAccess {
  id: string
  fullName: string
  language: string | null
  visibility: 'private' | 'public'
}

export type GitHubConnectionState =
  | { status: 'session-required' | 'unavailable' | 'checking' | 'cancelled' | 'error' }
  | { status: 'not-installed'; account: GitHubIdentity }
  | { status: 'pending-approval'; organization: string }
  | { status: 'connected'; account: GitHubIdentity; repositories: RepositoryAccess[] }

export interface AccessService {
  getSignInState(mode: 'entry' | 'return'): Promise<SignInState>
  getConnectionState(mode: 'entry' | 'return'): Promise<GitHubConnectionState>
}
