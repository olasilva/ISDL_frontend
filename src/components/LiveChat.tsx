// src/components/LiveChat.tsx
import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { supabase } from '../lib/supabaseClient';

interface ChatMessage {
  id: number;
  session_id: string;
  sender: 'visitor' | 'admin';
  sender_name: string | null;
  message: string;
  created_at: string;
}

const getGuestSessionId = () => {
  let id = localStorage.getItem('chat_session_id');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('chat_session_id', id);
  }
  return id;
};

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  const [sessionId, setSessionId] = useState<string>('');
  const [name, setName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);

  // Determine if it's a logged-in client or a guest
  useEffect(() => {
    const initChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Logged in client
        setSessionId(session.user.id);
        setName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Client');
        setNameSet(true);
      } else {
        // Guest
        setSessionId(getGuestSessionId());
        const savedName = localStorage.getItem('chat_name');
        if (savedName) {
          setName(savedName);
          setNameSet(true);
        }
      }
    };
    initChat();
  }, []);

  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const res = await api.get(`/chat/session/${sessionId}`);
      const data: ChatMessage[] = res.data.data;
      setMessages(data);
      
      if (!open) {
        const newAdminCount = data.filter(
          (m) => m.sender === 'admin' && new Date(m.created_at).getTime() > Date.now() - 60000
        ).length;
        setUnread(newAdminCount);
      }
      
      if (data.length > lastCountRef.current) {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        lastCountRef.current = data.length;
      }
    } catch (err) {
      console.error('Chat fetch error:', err);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    fetchMessages();
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, [sessionId, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !nameSet || !sessionId) return;
    setSending(true);

    try {
      await api.post('/chat', {
        session_id: sessionId,
        sender_name: name,
        message: input.trim(),
      });
      setInput('');
      await fetchMessages();
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem('chat_name', name.trim());
    setNameSet(true);
  };

  // Hide the chat if we are still loading the session ID
  if (!sessionId) return null;

  return (
    <>
      <button
        className="fab live-chat-btn"
        onClick={() => setOpen(!open)}
        aria-label="Open live chat"
      >
        <i className={`bx ${open ? 'bx-x' : 'bx-message-rounded-dots'}`} />
        {unread > 0 && !open && <span className="chat-badge">{unread}</span>}
      </button>

      {open && (
        <div className="live-chat-window">
          <div className="live-chat-header">
            <div className="live-chat-header-info">
              <div className="live-chat-avatar">
                <i className="bx bx-support" />
              </div>
              <div>
                <b>ISDL Team</b>
                <small>Typically replies in minutes</small>
              </div>
            </div>
            <button
              className="live-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <i className="bx bx-x" />
            </button>
          </div>

          {!nameSet ? (
            <form className="live-chat-name-form" onSubmit={saveName}>
              <p>Hi there! What's your name?</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
              />
              <button type="submit" className="btn">
                Start chat
              </button>
            </form>
          ) : (
            <>
              <div className="live-chat-messages">
                {messages.length === 0 && (
                  <div className="live-chat-empty">
                    <i className="bx bx-message-rounded" />
                    <p>Send a message to start the conversation.</p>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${m.sender === 'visitor' ? 'chat-mine' : 'chat-theirs'}`}
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
                <div ref={messagesEndRef} />
              </div>

              <form className="live-chat-input" onSubmit={send}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !input.trim()}>
                  <i className="bx bx-send" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}