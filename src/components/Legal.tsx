// src/components/Legal.tsx
import { useEffect, useState } from 'react';
import { LEGAL } from '../data/content';

type LegalKey = 'privacy' | 'terms';

export default function Legal() {
  const [open, setOpen] = useState<LegalKey | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ key: LegalKey }>).detail;
      if (detail?.key) setOpen(detail.key);
    };
    window.addEventListener('openLegal', handler);
    return () => window.removeEventListener('openLegal', handler);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const data = LEGAL[open];

  return (
    <div
      className="modal"
      onClick={() => setOpen(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
    >
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2 id="legal-title" style={{ fontSize: '1.4rem', margin: 0 }}>
            {data.title}
          </h2>
          <button
            onClick={() => setOpen(null)}
            className="btn-icon"
            aria-label="Close"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        <p className="muted" style={{ marginBottom: 16 }}>
          {data.updated}
        </p>

        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            fontSize: '0.94rem',
            color: 'var(--text)',
          }}
        >
          {data.body}
        </div>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button onClick={() => setOpen(null)} className="btn-icon primary">
            <i className="bx bx-check" />
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}