// src/admin/sections/Inbox.tsx
import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await api.get('/inbox');
      setMessages(res.data.data);
    } catch (err: any) {
      console.error('Failed to fetch messages', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/inbox/${id}/read`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/inbox/${id}`);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const filtered = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages;

  if (loading) return <div className="spinner" />;
  if (error) return <p className="err">{error}</p>;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Inbox</h1>
          <p>Manage messages from your contact form.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-envelope" /> Total Messages
          </span>
          <span className="stat-value">{messages.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-envelope" /> Unread
          </span>
          <span className="stat-value">{unreadCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-check-circle" /> Read
          </span>
          <span className="stat-value">{messages.length - unreadCount}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn-icon ${filter === 'all' ? 'primary' : ''}`}
        >
          <i className="bx bx-list-ul" /> All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn-icon ${filter === 'unread' ? 'primary' : ''}`}
        >
          <i className="bx bx-envelope" /> Unread ({unreadCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bx bx-inbox" />
          </div>
          <h3>No messages</h3>
          <p>
            {filter === 'unread'
              ? 'You have no unread messages.'
              : 'Your inbox is empty.'}
          </p>
        </div>
      ) : (
        filtered.map((msg) => (
          <div key={msg.id} className={`msg-item ${!msg.is_read ? 'unread' : ''}`}>
            <div className="msg-avatar">{msg.name.substring(0, 1).toUpperCase()}</div>
            <div className="msg-body">
              <div className="msg-head">
                <div>
                  <div className="msg-name">{msg.name}</div>
                  <div className="msg-email">{msg.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!msg.is_read && <span className="badge badge-pending">New</span>}
                  <span className="msg-time">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {/* Preserve line breaks in the message */}
              <p className="msg-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
              <div className="msg-actions">
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="btn-icon primary">
                    <i className="bx bx-check" /> Mark as Read
                  </button>
                )}
                <a
                  href={`mailto:${msg.email}?subject=Re: your project enquiry`}
                  className="btn-icon"
                >
                  <i className="bx bx-reply" /> Reply
                </a>
                <button onClick={() => deleteMessage(msg.id)} className="btn-icon danger">
                  <i className="bx bx-trash" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}