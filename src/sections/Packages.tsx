import { PACKAGES } from '../data/content'
import { go } from '../lib/utils'
export default function Packages() {
  return (
    <section id="packages"><div className="wrap">
      <h2>Packages</h2><p className="sub">Every project is quoted to fit. Pick a starting point and we will tailor it.</p>
      <div className="grid">{PACKAGES.map((p, i) => (
        <div className={'card' + (i === 1 ? ' pop' : '')} key={p.name}>
          {i === 1 && <span className="pill" style={{ margin: 0 }}>Popular</span>}
          <h3>{p.name}</h3><p>{p.note}</p>
          <ul className="ticks">{p.items.map(x => <li key={x}>{x}</li>)}</ul>
          <button className="btn sm" style={{ marginTop: 16 }} onClick={() => go('contact')}>Get a quote</button>
        </div>))}
      </div>
    </div></section>
  )
}
