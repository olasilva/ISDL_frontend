import Icon from '../components/Icon'
import Count from '../components/Count'
import { SERVICES, STATS } from '../data/content'
export default function Services() {
  return (
    <section id="services"><div className="wrap">
      <h2>What we build</h2><p className="sub">Everything you need to get online and grow, handled by one team.</p>
      <div className="grid">{SERVICES.map(s => <div className="card" key={s.title}><div className="ico"><Icon n={s.icon} /></div><h3>{s.title}</h3><p>{s.text}</p></div>)}</div>
      <div className="grid" style={{ marginTop: 40 }}>{STATS.map(x => <div className="card" key={x[1]}><div className="num"><Count v={x[0]} /></div><p>{x[1]}</p></div>)}</div>
    </div></section>
  )
}
