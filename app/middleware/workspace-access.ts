import { createAccessService } from '~/services/access'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.dev) return
  const state = await createAccessService().getSignInState('entry')
  if (state.status !== 'verified') return navigateTo('/sign-in')
})
