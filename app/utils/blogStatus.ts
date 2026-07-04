// Shared status vocabulary for the blog's "status-page" visual language.
// Every tool in the native-toolchain post is tagged with one of these, so the
// StatusBoard and the per-section ToolStatus cards read the same badge for the
// same thing. Status colors are reserved (never reused as decoration) and always
// ship with a label + icon, so state never rides on color alone.

export type BlogStatusKey
  = | 'stable'
    | 'rc'
    | 'beta'
    | 'preview'
    | 'partial'
    | 'experimental'
    | 'planned'

type BadgeColor = 'success' | 'info' | 'warning' | 'primary' | 'neutral'

interface BlogStatusMeta {
  label: string
  color: BadgeColor
  icon: string
}

const STATUS: Record<BlogStatusKey, BlogStatusMeta> = {
  stable: { label: 'Stable', color: 'success', icon: 'i-lucide-circle-check' },
  rc: { label: 'Release candidate', color: 'info', icon: 'i-lucide-circle-dot' },
  beta: { label: 'Beta', color: 'warning', icon: 'i-lucide-circle-dashed' },
  preview: { label: 'Preview', color: 'warning', icon: 'i-lucide-circle-dashed' },
  partial: { label: 'Partial', color: 'warning', icon: 'i-lucide-loader' },
  experimental: { label: 'Experimental', color: 'primary', icon: 'i-lucide-flask-conical' },
  planned: { label: 'Planned', color: 'neutral', icon: 'i-lucide-circle' }
}

export function blogStatus(key: string | undefined): BlogStatusMeta {
  return STATUS[(key ?? 'planned') as BlogStatusKey] ?? STATUS.planned
}
