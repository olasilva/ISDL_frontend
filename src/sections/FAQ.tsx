// src/sections/FAQ.tsx
import { FAQ as FAQ_DATA } from '../data/content';

export default function FAQ() {
  return (
    <section id="faq">
      <div className="wrap">
        <h2>Frequently asked</h2>
        <p className="sub">Answers to the questions we hear most often.</p>

        <div style={{ maxWidth: 720 }}>
          {FAQ_DATA.map((item, i) => (
            <details className="card" key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}