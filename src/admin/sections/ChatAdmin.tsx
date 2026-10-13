// src/admin/sections/ChatAdmin.tsx
import { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';

interface Session {
  session_id: string;
  sender_name: string;
  last_message: string;
  last_at: string;
  unread: number;
}

interface ChatMessage {
  id: number;
  session_id: string;
  sender: 'visitor' | 'admin';
  sender_name: string | null;
  message: string;
  created_at: string;
}

export default function ChatAdmin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data.data);
    } catch (err) {
      console.error('Sessions fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await api.get(`/chat/admin/session/${sessionId}`);
      setMessages(res.data.data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('Messages fetch error:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    const id = setInterval(fetchSessions, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession);
      const id = setInterval(() => fetchMessages(activeSession), 5000);
      return () => clearInterval(id);
    }
  }, [activeSession]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSession) return;
    setSending(true);
    try {
      await api.post('/chat/admin/reply', {
        session_id: activeSession,
        message: input.trim(),
      });
      setInput('');
      await fetchMessages(activeSession);
      await fetchSessions();
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSending(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Delete this entire chat?')) return;
    try {
      await api.delete(`/chat/admin/session/${sessionId}`);
      if (activeSession === sessionId) setActiveSession(null);
      fetchSessions();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Live Chat</h1>
          <p>Reply to visitors in real time.</p>
        </div>
      </div>

      <div className="chat-admin-layout">
        {/* Session list */}
        <aside className="chat-sessions">
          <h3>Conversations ({sessions.length})</h3>
          {sessions.length === 0 ? (
            <p className="muted">No chats yet.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.session_id}
                className={`chat-session-item ${activeSession === s.session_id ? 'active' : ''}`}
                onClick={() => setActiveSession(s.session_id)}
              >
                <div className="chat-session-avatar">
                  {s.sender_name.substring(0, 1).toUpperCase()}
                </div>
                <div className="chat-session-info">
                  <div className="chat-session-name">
                    {s.sender_name}
                    {s.unread > 0 && <span className="chat-session-badge">{s.unread}</span>}
                  </div>
                  <div className="chat-session-preview">{s.last_message}</div>
                  <div className="chat-session-time">
                    {new Date(s.last_at).toLocaleString()}
                  </div>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Conversation */}
        <main className="chat-conversation">
          {!activeSession ? (
            <div className="chat-empty-state">
              <i className="bx bx-message-rounded-dots" />
              <h3>Select a conversation</h3>
              <p>Pick a chat from the left to start replying.</p>
            </div>
          ) : (
            <>
              <div className="chat-conversation-head">
                <b>
                  {sessions.find((s) => s.session_id === activeSession)?.sender_name ||
                    'Visitor'}
                </b>
                <button
                  className="btn-icon danger"
                  onClick={() => deleteSession(activeSession)}
                >
                  <i className="bx bx-trash" /> Delete
                </button>
              </div>

              <div className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${m.sender === 'admin' ? 'chat-mine' : 'chat-theirs'}`}
                  >
                    <div className="chat-bubble-text">{m.message}</div>
                    <div className="chat-bubble-time">
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form className="chat-input" onSubmit={sendReply}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your reply..."
                  disabled={sending}
                />
                <button type="submit" className="btn-icon primary" disabled={sending}>
                  <i className="bx bx-send" /> Send
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}