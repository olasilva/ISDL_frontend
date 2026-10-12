// src/admin/sections/Outreach.tsx
import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'lost'];

export default function Outreach() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/outreach');
      setContacts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/outreach/${id}`, { status });
    setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Delete this contact?')) return;
    await api.delete(`/outreach/${id}`);
    setContacts(contacts.filter(c => c.id !== id));
  };

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = contacts.filter(c => c.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Outreach</h1>
          <p>Track and manage your outreach pipeline.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-group" /> Total
          </span>
          <span className="stat-value">{contacts.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-plus-circle" /> New
          </span>
          <span className="stat-value">{counts.new || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-message-rounded-dots" /> Contacted
          </span>
          <span className="stat-value">{counts.contacted || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-trophy" /> Converted
          </span>
          <span className="stat-value">{counts.converted || 0}</span>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bx bx-group" />
          </div>
          <h3>No contacts yet</h3>
          <p>Your outreach list is empty.</p>
        </div>
      ) : (
        contacts.map(c => (
          <div key={c.id} className="modern-card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div className="msg-name">{c.name}</div>
                <div className="msg-email">{c.email}</div>
                {c.company && (
                  <div className="meta-row" style={{ marginTop: '6px' }}>
                    <i className="bx bx-buildings" />
                    {c.company}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--card)',
                    color: 'var(--text)',
                    fontSize: '.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button onClick={() => deleteContact(c.id)} className="btn-icon danger">
                  <i className="bx bx-trash" />
                </button>
              </div>
            </div>
            <div className="msg-time" style={{ marginTop: '10px', fontSize: '.72rem' }}>
              Added {new Date(c.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}