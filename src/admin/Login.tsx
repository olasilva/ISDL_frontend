// src/admin/Login.tsx
import { useState } from 'react';
import api from '../lib/api';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { session } = response.data;
      
      // Store the JWT token
      localStorage.setItem('admin_token', session.access_token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      
      onLogin(); // Tell the parent component we are logged in
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2>Admin Portal</h2>
          <p className="muted">Sign in to manage your site</p>
        </div>

        {error && <div className="err">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}