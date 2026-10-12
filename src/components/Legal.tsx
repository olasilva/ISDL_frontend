import { useEffect, useRef, useState } from 'react'
import { LEGAL } from '../data/content'
export default function Legal() {
  const [k, setK] = useState<string | null>(null)
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const o = (e: Event) => setK((e as CustomEvent<string>).detail)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setK(null)
    window.addEventListener('legal', o); window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('legal', o); window.removeEventListener('keydown', esc) }
  }, [])
  useEffect(() => { if (k) ref.current?.focus() }, [k])
  if (!k) return null
  const [title, paras] = LEGAL[k]
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && setK(null)}>
      <div className="box" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3><p className="muted">Last updated 12 October 2026</p>
        {paras.map((p, i) => <p key={i} style={{ margin: '12px 0' }}>{p}</p>)}
        <button className="btn" ref={ref} onClick={() => setK(null)}>Close</button>
      </div>
    </div>
  )
}
