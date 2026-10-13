// src/sections/Packages.tsx
import { PACKAGES } from '../data/content';

export default function Packages() {
  return (
    <section id="packages" className="alt-bg">
      <div className="wrap">
        <h2>Packages</h2>
        <p className="sub">Simple, transparent pricing. No surprises.</p>

        <div className="grid">
          {PACKAGES.map((pkg) => (
            <div className={`card ${pkg.featured ? 'pop' : ''}`} key={pkg.name}>
              {pkg.featured && <span className="pill">Most popular</span>}
              <h3>{pkg.name}</h3>
              <div className="num" style={{ fontSize: '1.6rem', marginBottom: 14 }}>
                {pkg.price}
              </div>
              <ul className="ticks">
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p style={{ marginTop: 16 }}>
                <a href="#contact" className="btn sm alt">
                  Get started
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}