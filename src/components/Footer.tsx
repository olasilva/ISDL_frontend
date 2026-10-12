import { Logo } from './Logo'
import { go, openLegal } from '../lib/utils'
import { MAIL } from '../data/content'

const L = (id: string, t: string) => <a href="#/" onClick={e => { e.preventDefault(); go(id) }}>{t}</a>
const LG = (k: 'privacy' | 'terms', t: string) => <a href="#/" onClick={e => { e.preventDefault(); openLegal(k) }}>{t}</a>

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div><Logo /><p style={{ marginTop: 12, maxWidth: 300 }}>We design, build and maintain websites and web apps for businesses and individuals worldwide.</p></div>
          <div><h4>Company</h4>{L('services', 'Services')}{L('work', 'Projects')}{L('packages', 'Packages')}{L('faq', 'FAQ')}</div>
          <div><h4>Contact</h4><a href={'mailto:' + MAIL}>{MAIL}</a><a href="tel:+2348136319393">+234 813 631 9393</a><span>Mon–Fri · WAT (GMT+1)</span></div>
          <div><h4>Legal</h4>{LG('privacy', 'Privacy Policy')}{LG('terms', 'Terms of Service')}<a href="#/admin">Admin login</a></div>
        </div>
        <div className="fbar">
          <span>© 2026 ISDL. All rights reserved.</span>
          <span>
            <a href="https://github.com/olasilva3" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="https://www.linkedin.com/in/silva-ola-bbb1b4276" target="_blank" rel="noopener noreferrer">LinkedIn</a> · <a href="https://x.com/immanuel_p303" target="_blank" rel="noopener noreferrer">X</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
