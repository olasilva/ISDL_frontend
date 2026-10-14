// src/sections/Hero.tsx
import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgRef.current;
    if (!hero || !bg) return;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      bg.style.transform = `scale(1.05) translate(${x * 15}px, ${y * 15}px)`;
    };

    const onLeave = () => {
      bg.style.transform = 'scale(1.05) translate(0, 0)';
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Parallax background layer */}
      <div className="hero-parallax" ref={bgRef} />
      <div className="hero-grid-overlay" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      {/* Rising particles */}
      <div className="hero-particles" aria-hidden="true">
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
      </div>

      {/* Floating chips */}
      <div className="hero-chip hero-chip-1" aria-hidden="true">
        <i className="bx bx-code-alt" /> Clean code
      </div>
      <div className="hero-chip hero-chip-2" aria-hidden="true">
        <i className="bx bx-rocket" /> Fast delivery
      </div>
      <div className="hero-chip hero-chip-3" aria-hidden="true">
        <i className="bx bx-shield-quarter" /> Secure by default
      </div>

      {/* Content */}
      <div className="wrap">
        <div className="slide">
          <div className="eyebrow">
            <i />
            Web Design Studio
          </div>
          <h1>
            Websites that work as hard as <span className="accent">you do</span>.
          </h1>
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

      <div className="hero-scroll" aria-hidden="true">
        Scroll
      </div>
    </section>
  );
}