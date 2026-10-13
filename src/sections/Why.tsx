// src/sections/Why.tsx
import { WHY } from '../data/content';

export default function Why() {
  return (
    <section id="why">
      <div className="wrap">
        <h2>Why choose ISDL</h2>
        <p className="sub">
          We build websites that are fast, secure, and easy to maintain.
        </p>

        <div className="card" style={{ maxWidth: 640 }}>
          <ul className="ticks">
            {WHY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}