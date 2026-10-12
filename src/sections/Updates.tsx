// src/sections/Updates.tsx (or wherever this file lives)
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Update {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  published: boolean;
}

export default function Updates() {
  const [rows, setRows] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/updates/published');
        setRows(res.data.data);
      } catch (err) {
        console.error('Failed to load updates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  // Format date nicely
  const fmt = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <section id="updates" className="alt-bg">
      <div className="wrap">
        <h2>Latest updates</h2>
        <p className="sub">News, launches and offers from the studio.</p>

        {loading ? (
          <div className="grid">
            {[1, 2, 3].map((i) => (
              <div className="card update-card-skeleton" key={i}>
                <div className="skeleton-line skeleton-short" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            ))}
          </div>
        ) : rows.length ? (
          <div className="grid">
            {rows.map((u) => (
              <div className="card public-update-card" key={u.id}>
                {u.image_url && (
                  <div className="public-update-thumb">
                    <img src={u.image_url} alt={u.title} loading="lazy" />
                  </div>
                )}
                <div className="public-update-body">
                  <span className="muted public-update-date">
                    <i className="bx bx-calendar" />
                    {fmt(u.created_at)}
                  </span>
                  <h3>{u.title}</h3>
                  <p>{u.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No updates yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}