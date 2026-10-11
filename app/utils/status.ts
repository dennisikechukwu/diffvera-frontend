const appearances = {
  success: {
    tone: 'success',
    badge: 'border-success/20 bg-success-soft text-success',
    fill: 'bg-success'
  },
  progress: {
    tone: 'progress',
    badge: 'border-progress/20 bg-progress-soft text-progress',
    fill: 'bg-progress'
  },
  danger: {
    tone: 'danger',
    badge: 'border-brand/20 bg-brand-soft text-brand-dark',
    fill: 'bg-brand'
  },
  neutral: { tone: 'neutral', badge: 'border-border bg-paper text-muted', fill: 'bg-accent-slate' }
} as const

export function getStatusAppearance(status: string) {
  if (
    [
      'completed',
      'verified',
      'connected',
      'enabled',
      'available',
      'resolved',
      'open',
      'merged'
    ].includes(status)
  )
    return appearances.success
  if (['running', 'checking', 'pending-approval', 'medium'].includes(status))
    return appearances.progress
  if (['failed', 'error', 'expired', 'revoked', 'high'].includes(status)) return appearances.danger
  return appearances.neutral
}
