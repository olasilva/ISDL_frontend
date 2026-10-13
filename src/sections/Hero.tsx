// src/sections/Hero.tsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-img" />
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      <div className="wrap">
        <div className="slide">
          <div className="eyebrow">
            <i />
            Web Design Studio
          </div>
          <h1>Websites that work as hard as you do.</h1>
          <p>
            Catalogues, carts and global payment gateways — built mobile-first
            and ready to grow with your business.
          </p>
          <div className="row">
            <a href="#work" className="btn">
              Discover more
            </a>
            <a href="#contact" className="link">
              Get a quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}