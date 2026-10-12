import { useState } from 'react'
import { Logo } from './Logo'
import Icon from './Icon'
import { go } from '../lib/utils'
import { SERVICES } from '../data/content'

const ITEMS = [
  { label: 'Home', id: 'top' },
  { label: 'Services', id: 'services', kids: SERVICES.map(s => s.title) },
  { label: 'Projects', id: 'work' },
  { label: 'Packages', id: 'packages' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')
  const nav = (id: string) => { setOpen(false); setActive(id); go(id) }
  return (
    <nav>
      <div className="wrap nav-in">
        <Logo />
        <div className={'links' + (open ? ' open' : '')}>
          {ITEMS.map(i => (
            <div className="li" key={i.id}>
              <a href="#/" className={active === i.id ? 'on' : ''} onClick={e => { e.preventDefault(); nav(i.id) }}>
                {i.label}{i.kids && <Icon n="down" size={12} />}
              </a>
              {i.kids && <div className="drop">{i.kids.map(k => <a key={k} href="#/" onClick={e => { e.preventDefault(); nav('services') }}>{k}</a>)}</div>}
            </div>
          ))}
          <a className="btn sm mob-only" href="#/" onClick={e => { e.preventDefault(); nav('contact') }}>Free quote</a>
        </div>
        <div className="nav-r">
          <button className="ico-btn" aria-label="Search services" onClick={() => nav('services')}><Icon n="search" size={16} /></button>
          <a className="btn sm hide-sm" href="#/" onClick={e => { e.preventDefault(); nav('contact') }}>Free quote</a>
          <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </nav>
  )
}
