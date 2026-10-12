import { PHONE } from '../data/content'
export const fmt = (t?: number) => t ? new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''
export const go = (id: string) => {
  if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
export const wa = (n?: string, t = '') => `https://wa.me/${String(n || PHONE).replace(/\D/g, '')}?text=${encodeURIComponent(t)}`
export const openLegal = (k: 'privacy' | 'terms') => window.dispatchEvent(new CustomEvent('legal', { detail: k }))
