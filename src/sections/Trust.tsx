import { TECH } from '../data/content'
export default function Trust() {
  return (
    <div className="trust"><div className="wrap">
      <span className="muted">Built with modern, proven technology</span>
      {TECH.map(t => <b key={t}>{t}</b>)}
    </div></div>
  )
}
