export default defineNuxtRouteMiddleware(async (to) => {
  const sessionCookie = useCookie('diffvera_session')
  const isAuthenticated = useState<boolean>('isAuthenticated', () => Boolean(sessionCookie.value))

  // Synchronize state if the cookie is present
  if (sessionCookie.value) {
    isAuthenticated.value = true
  }

  const isAuthOrLandingPage = to.path === '/' || to.path === '/sign-in'
  const isProtectedRoute = to.path.startsWith('/dashboard') || to.path.startsWith('/onboarding')

  // 1. If logged in, the ONLY way to leave the dashboard is logging out.
  // Typing localhost:3000 (/) or visiting /sign-in redirects immediately to /dashboard.
  if (isAuthenticated.value && isAuthOrLandingPage) {
    return navigateTo('/dashboard')
  }

  // 2. If not logged in and attempting to access protected dashboard/onboarding routes:
  if (!isAuthenticated.value && isProtectedRoute) {
    // If running on client, double-check active session with backend before redirecting
    if (import.meta.client) {
      try {
        const user = await $fetch<{ id?: string }>('/api/v1/auth/session', {
          credentials: 'include'
        })
        if (user && user.id) {
          isAuthenticated.value = true
          return
        }
      } catch {
        // Unauthenticated
      }
    }
    return navigateTo('/sign-in')
  }
})
