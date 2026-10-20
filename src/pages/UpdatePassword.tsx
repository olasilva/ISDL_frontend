// src/pages/UpdatePassword.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from '../components/AuthLayout';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Password updated successfully! Please log in.');
      navigate('/login');
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Enter a new password for your account.">
      {error && <div className="err" style={{ marginBottom: 16 }}>{error}</div>}
      
      <form onSubmit={handleUpdate}>
        <div className="field">
          <label>New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        
        <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthLayout>
  );
}