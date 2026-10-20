// src/pages/ClientLogin.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from '../components/AuthLayout';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to track your project.">
      {error && <div className="err" style={{ marginBottom: 16 }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="field">
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--navy)', textDecoration: 'underline' }}>Forgot?</Link>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem' }}>
        Don't have an account? <Link to="/signup" style={{ fontWeight: 700, color: 'var(--navy)' }}>Sign up</Link>
      </div>
    </AuthLayout>
  );
}