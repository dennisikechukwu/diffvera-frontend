import { defineEventHandler, getQuery, appendResponseHeader, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8080'
  const url = new URL(`${apiBase}/api/v1/auth/callback/github`)
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v))
    }
  }

  const response = await fetch(url.toString(), {
    redirect: 'manual'
  })

  // Forward Set-Cookie headers from Spring Boot response to browser
  const rawCookies = (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.()
    || [response.headers.get('set-cookie')].filter((c): c is string => Boolean(c))

  for (const cookie of rawCookies) {
    if (cookie) {
      appendResponseHeader(event, 'set-cookie', cookie)
    }
  }

  const location = response.headers.get('location') || '/dashboard'
  return sendRedirect(event, location, 302)
})
