import { useEffect, useState } from 'react'
import Icon from './Icon'
import { Mark } from './Logo'
import { wa } from '../lib/utils'
import { PHONE } from '../data/content'

export function Loader() {
  const [on, setOn] = useState(true)
  useEffect(() => { const t = setTimeout(() => setOn(false), 1600); return () => clearTimeout(t) }, [])
  if (!on) return null
  return <div id="loader" aria-hidden="true"><span><Mark s={54} />IS<b>DL</b></span></div>
}

export default function Extras() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const h = () => { const d = document.documentElement; setP(d.scrollHeight > innerHeight ? scrollY / (d.scrollHeight - innerHeight) * 100 : 0) }
    addEventListener('scroll', h, { passive: true }); h()
    return () => removeEventListener('scroll', h)
  }, [])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
    const tag = () => document.querySelectorAll('.card:not(.rv),section h2:not(.rv),.sub:not(.rv)').forEach(el => { el.classList.add('rv'); io.observe(el) })
    tag()
    const mo = new MutationObserver(tag); mo.observe(document.getElementById('root')!, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
  return (
    <>
      <Loader />
      <div className="prog" style={{ width: p + '%' }} />
      <a className="fab wa" href={wa(PHONE, 'Hi ISDL, I would like a website.')} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><Icon n="chat" /></a>
      {p > 12 && <button className="fab up" aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>}
    </>
  )
}
