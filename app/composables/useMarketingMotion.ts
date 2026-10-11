export function useMarketingMotion() {
  const animations = new Set<Animation>()
  const revealed = new WeakSet<HTMLElement>()
  let observer: IntersectionObserver | undefined
  let preference: MediaQueryList | undefined

  function cancelAnimations() {
    for (const animation of animations) animation.cancel()
    animations.clear()
  }

  function reveal(element: HTMLElement, immediate = false) {
    if (revealed.has(element)) return
    revealed.add(element)
    observer?.unobserve(element)

    // Content is visible by default, including before hydration and without JS.
    if (immediate || preference?.matches || document.visibilityState !== 'visible' || !element.animate) return
    if (element.contains(document.activeElement) || element.closest('section') === document.activeElement) return

    const requestedDelay = Number(element.dataset.revealDelay || 0)
    const delay = Number.isFinite(requestedDelay) ? Math.min(240, Math.max(0, requestedDelay)) : 0
    const animation = element.animate(
      [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }],
      { id: 'diffvera-reveal', duration: 540, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
    )
    animations.add(animation)
    void animation.finished.then(() => animations.delete(animation), () => animations.delete(animation))
  }

  function handlePreference() {
    if (preference?.matches) cancelAnimations()
  }

  function handleVisibility() {
    if (document.visibilityState !== 'visible') cancelAnimations()
  }

  function handleFocus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return
    const focused = event.target
    for (const animation of animations) {
      const target = (animation.effect as KeyframeEffect | null)?.target
      if (target instanceof Element && (target.contains(focused) || focused.contains(target))) animation.cancel()
    }
  }

  onMounted(() => {
    preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    preference.addEventListener('change', handlePreference)
    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('focusin', handleFocus)

    if (!('IntersectionObserver' in window)) return
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          // Fast scrolling and anchor jumps must never hide content already on screen.
          reveal(entry.target, entry.boundingClientRect.top < window.innerHeight)
        }
      }
    }, { rootMargin: '0px 0px 160px 0px', threshold: 0 })

    for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
      const bounds = element.getBoundingClientRect()
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
        reveal(element, true)
      } else {
        observer.observe(element)
      }
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    preference?.removeEventListener('change', handlePreference)
    document.removeEventListener('visibilitychange', handleVisibility)
    document.removeEventListener('focusin', handleFocus)
    cancelAnimations()
  })
}
