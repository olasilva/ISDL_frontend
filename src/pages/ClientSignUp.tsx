// src/pages/ClientSignUp.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from '../components/AuthLayout';

export default function ClientSignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(4); // 4 seconds timer

  const navigate = useNavigate();

  // When success is true, start the countdown to redirect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  // The Welcome Popup UI
  if (success) {
    return (
      <div className="modal" style={{ background: 'var(--navy)' }}>
        <div className="box" style={{ textAlign: 'center', maxWidth: '420px', padding: '40px 30px' }}>
          <div style={{ fontSize: '4rem', color: 'var(--check)', marginBottom: '10px' }}>
            <i className="bx bx-check-circle" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Welcome to ISDL!</h2>
          <p className="muted" style={{ marginBottom: '24px' }}>
            Hi {fullName}, your account has been created successfully.
          </p>
          
          <div style={{ background: 'var(--soft)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ fontSize: '0.9rem' }}>
              Please check your email (<b>{email}</b>) to verify your account.
            </p>
          </div>

          <p style={{ fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
            Redirecting to login in {countdown} seconds...
          </p>

          <Link to="/login" className="btn" style={{ width: '100%' }}>
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  // The Signup Form
  return (
    <AuthLayout title="Create an account" subtitle="Start tracking your project today.">
      {error && <div className="err" style={{ marginBottom: 16 }}>{error}</div>}
      
      <form onSubmit={handleSignUp}>
        <div className="field">
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem' }}>
        Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--navy)' }}>Log in</Link>
      </div>
    </AuthLayout>
  );
}