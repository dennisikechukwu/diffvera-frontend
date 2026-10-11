import { createAccessService } from '~/services/access'
import type { SignInState } from '~/types/access'

export function useSignInFlow(mode: 'entry' | 'return') {
  const service = createAccessService()
  const request = useAsyncData(`sign-in-${mode}`, () => service.getSignInState(mode))
  const state = computed<SignInState>(() => {
    if (request.status.value === 'pending' && !request.data.value) return { status: 'checking' }
    if (request.error.value) return { status: 'error' }
    return request.data.value ?? { status: 'ready' }
  })
  return {
    state,
    refresh: request.refresh,
    loading: computed(() => request.status.value === 'pending')
  }
}
