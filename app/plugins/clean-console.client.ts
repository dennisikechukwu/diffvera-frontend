export default defineNuxtPlugin((nuxtApp) => {
  // Suppress Vue <Suspense> experimental warning in dev mode
  if (nuxtApp.vueApp.config) {
    const prevWarnHandler = nuxtApp.vueApp.config.warnHandler
    nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
      if (typeof msg === 'string' && msg.includes('<Suspense> is an experimental feature')) {
        return
      }
      if (prevWarnHandler) {
        prevWarnHandler(msg, instance, trace)
      } else {
        console.warn(`[Vue warn]: ${msg}`, trace)
      }
    }
  }

  // Intercept window error events originating from third-party browser extension scripts (e.g. inpage.js)
  if (typeof window !== 'undefined') {
    window.addEventListener(
      'error',
      (event) => {
        const msg = event.message || ''
        const filename = event.filename || ''
        if (
          msg.includes('IN_PAGE_CHANNEL_NODE_ID') ||
          msg.includes('Channel secret not available yet') ||
          filename.includes('inpage.js') ||
          filename.includes('contentscript.js')
        ) {
          event.stopImmediatePropagation()
          event.preventDefault()
        }
      },
      true
    )
  }
})
