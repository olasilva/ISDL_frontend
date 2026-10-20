// src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { NAV } from '../data/content';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="wrap nav-in">
        <a href="/" className="logo">
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
          
          {/* Show login button on mobile menu */}
          <Link 
            to="/login" 
            className="btn sm mob-only" 
            style={{ marginTop: 10 }}
            onClick={() => setOpen(false)}
          >
            Client Login
          </Link>
        </div>

        <div className="nav-r">
          {/* New Client Login Button */}
          <Link to="/login" className="btn-icon hide-sm" style={{ border: 'none' }}>
            Client Login
          </Link>
          
          <Link to="/signup" className="btn sm hide-sm">
            Get Started
          </Link>

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