// src/sections/Work.tsx
import { useEffect, useState } from 'react';
import { WORK } from '../data/content';
import { updatesApi, type UpdateRow } from '../lib/db';

export default function Work() {
  const [updates, setUpdates] = useState<UpdateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const data = await updatesApi.listPublished();
        setUpdates(data);
      } catch (err) {
        console.error('Failed to load updates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

  return (
    <section id="work">
      <div className="wrap">
        <h2>Recent work</h2>
        <p className="sub">A few things we have shipped.</p>

        <div className="grid">
          {/* Static work items from content file */}
          {WORK.map((w) => (
            <div className="card" key={w.title}>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
              {w.url && (
                <p style={{ marginTop: 12 }}>
                  <a
                    className="btn sm alt"
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live demo
                  </a>
                </p>
              )}
            </div>
          ))}

          {/* Dynamic updates from admin panel */}
          {updates.map((u) => (
            <div className="card work-update-card" key={`admin-${u.id}`}>
              {u.image_url && (
                <div className="work-update-thumb">
                  <img src={u.image_url} alt={u.title} loading="lazy" />
                </div>
              )}
              <div className="work-update-date">
                <i className="bx bx-calendar" />
                {new Date(u.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <h3>{u.title}</h3>
              <p>{u.content}</p>
            </div>
          ))}

          {/* Loading skeleton */}
          {loading && (
            <div className="card work-update-skeleton">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-short" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}