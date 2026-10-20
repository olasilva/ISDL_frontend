// src/components/AuthLayout.tsx
import { ReactNode } from 'react';

export default function AuthLayout({ title, subtitle, children }: { title: string, subtitle: string, children: ReactNode }) {
  return (
    <div className="adm-login" style={{ background: 'var(--soft)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a href="/" className="logo" style={{ justifyContent: 'center', marginBottom: '16px', display: 'flex', textDecoration: 'none' }}>
            <b style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>ISDL</b>
          </a>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{title}</h2>
          <p className="muted" style={{ fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}