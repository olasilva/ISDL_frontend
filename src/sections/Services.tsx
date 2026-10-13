// src/sections/Services.tsx
import { SERVICES } from '../data/content';

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <h2>What we do</h2>
        <p className="sub">
          Everything you need to launch and grow online — built clean and built to last.
        </p>

        <div className="grid">
          {SERVICES.map((s) => (
            <div className="card" key={s.title}>
              <div className="ico">
                <i className={`bx ${s.icon}`} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}