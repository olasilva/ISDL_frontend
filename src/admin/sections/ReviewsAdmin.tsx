// src/admin/sections/ReviewsAdmin.tsx
import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    await api.patch(`/reviews/${id}/approve`, { is_approved: !currentStatus });
    setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: !currentStatus } : r));
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter(r => r.id !== id));
  };

  const pending = reviews.filter(r => !r.is_approved).length;
  const approved = reviews.filter(r => r.is_approved).length;
  const avgRating = reviews.length 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const filtered = filter === 'all' 
    ? reviews 
    : reviews.filter(r => filter === 'pending' ? !r.is_approved : r.is_approved);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Reviews</h1>
          <p>Approve or reject reviews submitted by users.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-star" /> Total Reviews
          </span>
          <span className="stat-value">{reviews.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-time" /> Pending Approval
          </span>
          <span className="stat-value">{pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">
            <i className="bx bx-trending-up" /> Average Rating
          </span>
          <span className="stat-value">{avgRating}</span>
          <span className="star-rating">{'★'.repeat(Math.round(Number(avgRating)))}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')} className={`btn-icon ${filter === 'all' ? 'primary' : ''}`}>
          <i className="bx bx-list-ul" />
          All ({reviews.length})
        </button>
        <button onClick={() => setFilter('pending')} className={`btn-icon ${filter === 'pending' ? 'primary' : ''}`}>
          <i className="bx bx-time" />
          Pending ({pending})
        </button>
        <button onClick={() => setFilter('approved')} className={`btn-icon ${filter === 'approved' ? 'primary' : ''}`}>
          <i className="bx bx-check-circle" />
          Approved ({approved})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bx bx-star" />
          </div>
          <h3>No reviews</h3>
          <p>{filter === 'pending' ? 'No reviews waiting for approval.' : 'No reviews to show.'}</p>
        </div>
      ) : (
        filtered.map(r => (
          <div key={r.id} className="modern-card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div className="msg-name">{r.author}</div>
                <div className="star-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
              <span className={`badge ${r.is_approved ? 'badge-approved' : 'badge-pending'}`}>
                {r.is_approved 
                  ? <><i className="bx bx-check" /> Approved</> 
                  : <><i className="bx bx-time" /> Pending</>
                }
              </span>
            </div>
            {r.comment && <p style={{ marginBottom: '14px', color: 'var(--text)', fontSize: '.92rem' }}>{r.comment}</p>}
            <div className="msg-actions">
              <button 
                onClick={() => toggleApproval(r.id, r.is_approved)} 
                className={`btn-icon ${r.is_approved ? '' : 'primary'}`}
              >
                <i className={`bx ${r.is_approved ? 'bx-x' : 'bx-check'}`} />
                {r.is_approved ? 'Unapprove' : 'Approve'}
              </button>
              <button onClick={() => deleteReview(r.id)} className="btn-icon danger">
                <i className="bx bx-trash" />
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}