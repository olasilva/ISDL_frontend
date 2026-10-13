// src/sections/Process.tsx
import { PROCESS } from '../data/content';

export default function Process() {
  return (
    <section id="process" className="alt-bg">
      <div className="wrap">
        <h2>How we work</h2>
        <p className="sub">A simple, transparent process from idea to launch.</p>

        <div className="grid">
          {PROCESS.map((p) => (
            <div className="card" key={p.step}>
              <div className="num">{p.step}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}