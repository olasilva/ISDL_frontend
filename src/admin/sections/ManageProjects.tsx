// src/admin/sections/ManageProjects.tsx
import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Project {
  id: number;
  project_name: string;
  domain_name: string;
  status: string;
  progress: number;
  amount_due: number;
  is_paid: boolean;
  payment_claimed: boolean;
  payment_reference: string | null;
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [amount, setAmount] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/all');
      setProjects(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        client_email: email, project_name: name, domain_name: domain, amount_due: parseFloat(amount)
      });
      alert('Project created!');
      setShowForm(false);
      setEmail(''); setName(''); setDomain(''); setAmount('');
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create project.');
    }
  };

  const updateProject = async (id: number, data: any) => {
    await api.patch(`/projects/${id}`, data);
    fetchProjects();
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Manage Projects</h1>
          <p>Create and track client projects.</p>
        </div>
        <button className="btn-icon primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="modern-card" style={{ marginBottom: 24 }}>
          <h3>Create Project</h3>
          <div className="two" style={{ marginTop: 16 }}>
            <div className="modern-field">
              <label>Client Email (Must be registered)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="modern-field">
              <label>Project Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="modern-field">
              <label>Domain Name</label>
              <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. myclient.com" />
            </div>
            <div className="modern-field">
              <label>Amount Due ($)</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn-icon primary" style={{ marginTop: 16 }}>Create Project</button>
        </form>
      )}

      <div className="grid">
        {projects.map(p => (
          <div key={p.id} className="modern-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{p.project_name}</h3>
              <span className={`badge ${p.is_paid ? 'badge-approved' : 'badge-pending'}`}>
                {p.is_paid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Domain: {p.domain_name || 'None'}</p>
            
            {!p.is_paid && p.payment_claimed && (
              <div style={{ background: 'var(--soft)', padding: 12, borderRadius: 8, marginTop: 12, border: '1px solid var(--navy)' }}>
                <p style={{ fontSize: '0.85rem', marginBottom: 8 }}><b>Client claims paid!</b><br/>Ref: {p.payment_reference}</p>
                <button onClick={() => updateProject(p.id, { is_paid: true })} className="btn-icon primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="bx bx-check" /> Verify & Mark Paid
                </button>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status: </label>
              <select 
                value={p.status} 
                onChange={e => updateProject(p.id, { status: e.target.value })}
                style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--line)' }}
              >
                <option value="pending">Pending</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Progress: {p.progress}%</label>
              <input 
                type="range" min="0" max="100" value={p.progress} 
                onChange={e => updateProject(p.id, { progress: parseInt(e.target.value) })}
                style={{ width: '100%', marginTop: 8, accentColor: 'var(--navy)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}