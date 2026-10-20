// src/pages/ClientDashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import LiveChat from '../components/LiveChat';

interface Project {
  id: number;
  project_name: string;
  domain_name: string;
  status: string;
  progress: number;
  amount_due: number;
  is_paid: boolean;
  payment_claimed: boolean;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export default function ClientDashboard() {
  const [project, setProject] = useState<Project | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Request Form State (Covers all 4 request types)
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState('New Website');
  const [requestDetails, setRequestDetails] = useState('');
  const [domainName, setDomainName] = useState('');
  const [domainRegistrar, setDomainRegistrar] = useState('GoDaddy');
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Payment Claim State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [reference, setReference] = useState('');
  const [claiming, setClaiming] = useState(false);

  // Format current date
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Client';
      setUserName(name);

      try {
        const res = await api.get('/projects/my-project');
        setProject(res.data.data);
        setBank(res.data.bankDetails);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleClaimPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setClaiming(true);
    
    try {
      await api.post('/projects/claim-payment', { 
        project_id: project.id, 
        payment_reference: reference 
      });
      setProject({ ...project, payment_claimed: true });
      setShowClaimForm(false);
    } catch (err) {
      alert('Failed to submit claim. Please contact support.');
    } finally {
      setClaiming(false);
    }
  };

  const handleServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSending(true);
    
    // Build the message based on the selected request type
    let messageBody = `--- NEW REQUEST: ${requestType} ---\n\n`;
    
    if (requestType === 'Buy a Domain') {
      messageBody += `Desired Domain: ${domainName}\n`;
    } else if (requestType === 'Connect Existing Domain') {
      messageBody += `Domain Name: ${domainName}\nRegistrar: ${domainRegistrar}\n`;
    }
    
    messageBody += `\nDetails:\n${requestDetails}`;

    try {
      await api.post('/inbox', {
        name: userName,
        email: (await supabase.auth.getUser()).data.user?.email,
        message: messageBody
      });
      setRequestSuccess(true);
      setShowRequestForm(false);
      setRequestDetails('');
      setDomainName('');
    } catch (err) {
      alert('Failed to send request. Please try the live chat.');
    } finally {
      setRequestSending(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="spinner" style={{ marginTop: '20vh' }} />;

  return (
    <div className="admin-shell">
      {/* --- POLISHED HEADER WITH DATE & ACTION BUTTON --- */}
      <header className="admin-topbar" style={{ 
        background: 'rgba(10, 27, 51, 0.95)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="admin-brand-mark" style={{ fontSize: '1.2rem', borderRadius: 12 }}>IS</div>
            <div style={{ lineHeight: 1.2 }}>
              <b style={{ display: 'block', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>ISDL Studio</b>
              <div style={{ fontSize: '0.75rem', color: '#8fa8d1', fontWeight: 600 }}>
                {today}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* New Request Button */}
            <button 
              onClick={() => { setShowRequestForm(true); setRequestSuccess(false); }}
              className="btn-icon primary" 
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <i className="bx bx-plus" /> New Request
            </button>

            <div className="admin-avatar" style={{ width: 38, height: 38, fontSize: '1rem', background: 'linear-gradient(135deg, #2a5fa8, #0a1b33)' }}>
              {userName.substring(0, 1).toUpperCase()}
            </div>
            
            <button 
              onClick={handleLogout} 
              className="btn-icon" 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px' }}
            >
              <i className="bx bx-log-out" /> <span className="hide-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- PAGE CONTENT --- */}
      <div className="admin-content" style={{ paddingTop: 40 }}>
        
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.2rem', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Welcome back, <span style={{ color: 'var(--navy)' }}>{userName}</span> 👋
          </h1>
          <p className="muted" style={{ fontSize: '1rem' }}>
            {project ? 'Here is the latest update on your project.' : 'Ready to start your next big project?'}
          </p>
        </div>

        {!project ? (
          /* --- STATE 1: NO PROJECT YET --- */
          <div className="grid" style={{ gridTemplateColumns: '1fr 340px' }}>
            <div className="modern-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '60px 20px', border: '2px dashed var(--line)', background: 'transparent', boxShadow: 'none' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--soft)', display: 'grid', placeItems: 'center', marginBottom: 20 }}>
                <i className="bx bx-rocket" style={{ fontSize: '2.5rem', color: 'var(--navy)' }} />
              </div>
              <h2 style={{ marginBottom: 10 }}>Let's build something great</h2>
              <p className="muted" style={{ maxWidth: 400, marginBottom: 30 }}>
                You don't have an active project yet. Use the "New Request" button above to get started.
              </p>
              <button className="btn" onClick={() => setShowRequestForm(true)} style={{ padding: '14px 28px', fontSize: '0.9rem' }}>
                Make a Request
              </button>
            </div>
            
            <div className="modern-card" style={{ background: 'var(--navy)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="bx bx-chat" style={{ fontSize: '2.5rem', marginBottom: 16, color: '#8fa8d1' }} />
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: 8 }}>Have questions?</h3>
              <p style={{ fontSize: '0.9rem', color: '#9fb0cc', lineHeight: 1.6 }}>Use the chat bubble in the bottom right corner to message us directly. We usually reply within minutes.</p>
            </div>
          </div>
        ) : (
          /* --- STATE 2: ACTIVE PROJECT --- */
          <div className="grid" style={{ gridTemplateColumns: '1fr 340px' }}>
            
            {/* Left Column: Project Tracker */}
            <div className="modern-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                <div>
                  <h2 style={{ marginBottom: 6, fontSize: '1.6rem' }}>{project.project_name}</h2>
                  <p className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bx bx-globe" /> {project.domain_name || 'Domain pending connection'}
                  </p>
                </div>
                <span className={`badge ${project.status === 'completed' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                  {project.status.toUpperCase()}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ marginBottom: 40, background: 'var(--soft)', padding: 24, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontWeight: 700, fontSize: '0.9rem' }}>
                  <span>Build Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar-bg" style={{ height: 16, background: 'var(--line)' }}>
                  <div className="progress-bar-fill" style={{ width: `${project.progress}%`, background: 'linear-gradient(90deg, #2a5fa8, #0a1b33)' }} />
                </div>
              </div>

              {/* Milestones */}
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Project Timeline</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { label: 'Discovery & Planning', min: 10 },
                  { label: 'UI/UX Design', min: 30 },
                  { label: 'Development', min: 60 },
                  { label: 'Review & Launch', min: 90 },
                ].map(step => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: project.progress >= step.min ? 1 : 0.4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: project.progress >= step.min ? 'var(--check)' : 'var(--line)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.9rem' }}>
                      {project.progress >= step.min ? <i className="bx bx-check" /> : <i className="bx bx-time" />}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Billing & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Billing Card */}
              <div className="modern-card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Billing</h3>
                  <i className="bx bx-receipt" style={{ fontSize: '1.5rem', color: 'var(--muted)' }} />
                </div>
                <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 4 }}>Amount Due</p>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.03em' }}>
                  ${project.amount_due.toFixed(2)}
                </div>

                {project.is_paid ? (
                  <div className="badge badge-approved" style={{ padding: '12px 16px', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <i className="bx bx-check-circle" /> Paid in Full
                  </div>
                ) : project.payment_claimed ? (
                  <div className="badge badge-pending" style={{ padding: '12px 16px', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <i className="bx bx-time" /> Verifying Transfer
                  </div>
                ) : !showClaimForm ? (
                  <button className="btn" onClick={() => setShowClaimForm(true)} style={{ width: '100%', padding: '12px' }}>
                    Pay via Bank Transfer
                  </button>
                ) : (
                  <div style={{ background: 'var(--soft)', padding: 20, borderRadius: 12 }}>
                    <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>Bank Transfer Details</h4>
                    <div style={{ fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.8 }}>
                      <div><span className="muted">Bank:</span> <b>{bank?.bankName}</b></div>
                      <div><span className="muted">Name:</span> <b>{bank?.accountName}</b></div>
                      <div><span className="muted">Acct:</span> <b>{bank?.accountNumber}</b></div>
                    </div>
                    
                    <form onSubmit={handleClaimPayment}>
                      <div className="field">
                        <label style={{ fontSize: '0.75rem' }}>Transfer Reference</label>
                        <input required value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. TRX-12345" style={{ fontSize: '0.9rem', padding: '10px' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="btn-icon" onClick={() => setShowClaimForm(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                        <button type="submit" className="btn-icon primary" disabled={claiming} style={{ flex: 2, justifyContent: 'center' }}>
                          {claiming ? 'Sending...' : 'I have paid'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Support Card */}
              <div className="modern-card" style={{ background: 'var(--navy)', color: '#fff', padding: '28px' }}>
                <i className="bx bx-support" style={{ fontSize: '2.2rem', marginBottom: 16, color: '#8fa8d1' }} />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: 8 }}>Need updates?</h3>
                <p style={{ fontSize: '0.85rem', color: '#9fb0cc', lineHeight: 1.6 }}>Use the chat bubble in the bottom right to message us directly.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- COMPREHENSIVE REQUEST MODAL --- */}
      {showRequestForm && (
        <div className="modal" onClick={() => setShowRequestForm(false)}>
          <div className="box" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h2 style={{ marginBottom: 20 }}>Make a Request</h2>
            
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <i className="bx bx-check-circle" style={{ fontSize: '3.5rem', color: 'var(--check)', marginBottom: 16 }} />
                <h3>Request Sent!</h3>
                <p className="muted" style={{ marginBottom: 24 }}>We have received your request and will reply via email or chat shortly.</p>
                <button className="btn" onClick={() => { setRequestSuccess(false); setShowRequestForm(false); }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleServiceRequest}>
                <div className="field">
                  <label>What do you need?</label>
                  <select value={requestType} onChange={e => setRequestType(e.target.value)}>
                    <option value="New Website">Build a New Website</option>
                    <option value="Website Maintenance">Website Maintenance</option>
                    <option value="Buy a Domain">Buy a Domain for me</option>
                    <option value="Connect Existing Domain">Connect an Existing Domain</option>
                  </select>
                </div>

                {/* Conditional Fields based on Request Type */}
                {requestType === 'Buy a Domain' && (
                  <div className="field">
                    <label>Desired Domain Name</label>
                    <input required value={domainName} onChange={e => setDomainName(e.target.value)} placeholder="e.g. mybusiness.com" />
                  </div>
                )}

                {requestType === 'Connect Existing Domain' && (
                  <>
                    <div className="field">
                      <label>Domain Name</label>
                      <input required value={domainName} onChange={e => setDomainName(e.target.value)} placeholder="e.g. mybusiness.com" />
                    </div>
                    <div className="field">
                      <label>Where did you buy it?</label>
                      <select value={domainRegistrar} onChange={e => setDomainRegistrar(e.target.value)}>
                        <option>GoDaddy</option>
                        <option>Namecheap</option>
                        <option>Google Domains</option>
                        <option>Cloudflare</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="field">
                  <label>Tell us more</label>
                  <textarea 
                    value={requestDetails} 
                    onChange={e => setRequestDetails(e.target.value)} 
                    placeholder={
                      requestType === 'New Website' ? 'Describe the website you want to build...' :
                      requestType === 'Website Maintenance' ? 'What needs fixing or updating on your current site?' :
                      'Any extra details we should know?'
                    } 
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" className="btn-icon" onClick={() => setShowRequestForm(false)}>Cancel</button>
                  <button type="submit" className="btn-icon primary" disabled={requestSending}>
                    {requestSending ? 'Sending...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* The Chat Widget */}
      <LiveChat />
    </div>
  );
}