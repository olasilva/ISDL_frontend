// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { MAIL, PHONE, PHONE_DISPLAY } from '../data/content';
import { openLegal } from '../lib/utils';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link to="/" className="logo" style={{ marginBottom: 12 }}>
              <b>ISDL</b>
              <small>Built Better</small>
            </Link>
            <p style={{ marginTop: 12 }}>
              We design, build and maintain websites and web apps for businesses and individuals worldwide.
            </p>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#services">Services</a>
            <a href="#work">Projects</a>
            <a href="#packages">Packages</a>
            <a href="#faq">FAQ</a>
          </div>

          <div>
            <h4>Contact</h4>
            <a href={`mailto:${MAIL}`}>{MAIL}</a>
            <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
            <span>Mon–Fri · WAT (GMT+1)</span>
          </div>

          <div>
            <h4>Legal</h4>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                openLegal('privacy');
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                openLegal('terms');
              }}
            >
              Terms of Service
            </a>
            {/* NEW: Client Portal Link */}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--yel)' }}>
              Client Portal
            </Link>
            <a href="/admin/login">Admin login</a>
          </div>
        </div>

        <div className="fbar">
          <span>© {year} ISDL. All rights reserved.</span>
          <span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            {' · '}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </span>
        </div>
      </div>
    </footer>
  );
}