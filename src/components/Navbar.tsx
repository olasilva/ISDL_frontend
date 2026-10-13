// src/components/Navbar.tsx
import { useState } from 'react';
import { NAV } from '../data/content';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="wrap nav-in">
        <a href="#/" className="logo">
          <b>ISDL</b>
          <small>Built Better</small>
        </a>

        <div className={`links ${open ? 'open' : ''}`}>
          {NAV.map((item) => (
            <div className="li" key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </div>
          ))}
          <a
            href="#contact"
            className="btn sm mob-only"
            onClick={() => setOpen(false)}
          >
            Get a quote
          </a>
        </div>

        <div className="nav-r">
          <a href="#contact" className="btn sm hide-sm">
            Get a quote
          </a>
          <button
            className="burger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}