import { QA } from '../data/content'
export default function FAQ() {
  return (
    <section id="faq" className="alt-bg"><div className="wrap" style={{ maxWidth: 760 }}>
      <h2>Questions, answered</h2><p className="sub">Still unsure? Send us a message.</p>
      {QA.map(q => <details className="card" key={q[0]}><summary>{q[0]}</summary><p>{q[1]}</p></details>)}
    </div></section>
  )
}
