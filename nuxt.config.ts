import tailwindcss from '@tailwindcss/vite'

const backendUrl = process.env.BACKEND_URL || process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon/module'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  routeRules: {
    '/dashboard': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/onboarding': { ssr: false },
    '/onboarding/**': { ssr: false },
    '/api/v1/auth/github': { redirect: `${backendUrl}/api/v1/auth/github` },
    '/api/**': { proxy: `${backendUrl}/api/**` }
  },
  runtimeConfig: {
    public: {
      apiBase: backendUrl
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Diffvera — Understand every change before you merge',
      meta: [{ name: 'theme-color', content: '#faf9f6' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=2' },
        { rel: 'preload', href: '/fonts/geist-latin-wght-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
      ],
      script: process.env.NODE_ENV !== 'production' ? [
        {
          innerHTML: `(function(){try{var o=console.error;console.error=function(){var m=arguments[0];if(typeof m==='string'&&(m.indexOf('IN_PAGE_CHANNEL_NODE_ID')!==-1||m.indexOf('Channel secret not available yet')!==-1||m.indexOf('in-page-channel-node-id')!==-1))return;if(m&&m.message&&(m.message.indexOf('IN_PAGE_CHANNEL_NODE_ID')!==-1||m.message.indexOf('Channel secret not available yet')!==-1))return;o.apply(console,arguments);};}catch(e){}})();`
        }
      ] : []
    }
  }
})
