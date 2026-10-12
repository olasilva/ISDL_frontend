import { STEPS } from '../data/content'
export default function Process() {
  return (
    <section className="alt-bg"><div className="wrap">
      <h2>How it works</h2><p className="sub">Clear steps, clear pricing, no surprises.</p>
      <div className="grid">{STEPS.map((s, i) => <div className="card" key={s}><div className="num">0{i + 1}</div><h3>{s}</h3></div>)}</div>
    </div></section>
  )
}
