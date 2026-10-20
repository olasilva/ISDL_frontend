// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) setError(error.message);
    else setSuccess(true);
    
    setLoading(false);
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We sent a password reset link.">
        <div className="ok" style={{ textAlign: 'center', padding: '20px 0' }}>
          Check <b>{email}</b> for a link to reset your password.
        </div>
        <Link to="/login" className="btn" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Back to Login</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link.">
      {error && <div className="err" style={{ marginBottom: 16 }}>{error}</div>}
      
      <form onSubmit={handleReset}>
        <div className="field">
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem' }}>
        Remembered it? <Link to="/login" style={{ fontWeight: 700, color: 'var(--navy)' }}>Log in</Link>
      </div>
    </AuthLayout>
  );
}