import { WHY } from '../data/content'
export default function Why() {
  return (
    <section id="why" className="alt-bg"><div className="wrap">
      <h2>Why work with ISDL</h2><p className="sub">Professional standards, whether you are across town or across the world.</p>
      <div className="grid">{WHY.map(w => <div className="card" key={w[0]}><h3>{w[0]}</h3><p>{w[1]}</p></div>)}</div>
    </div></section>
  )
}
