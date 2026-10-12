// src/sections/Reviews.tsx
import { useEffect, useState, type FormEvent } from 'react';
import { reviewsApi } from '../lib/db';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadApproved = async () => {
    try {
      const data = await reviewsApi.listApproved();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApproved();
  }, []);

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setDone(false);

    try {
      await reviewsApi.create({
        author: author.trim(),
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });

      // Reset + show success
      setAuthor('');
      setRating(5);
      setComment('');
      setDone(true);
      setShowForm(false);

      // Reload approved list (new review won't be there yet — it needs approval)
      loadApproved();
    } catch (err: any) {
      console.error('Submit review error:', err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        'Could not submit review. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="reviews" className="alt-bg">
      <div className="wrap">
        <h2>What clients say</h2>
        <p className="sub">Real feedback from real projects.</p>

        {/* Toggle Form Button */}
        <button
          className="btn"
          onClick={() => {
            setShowForm(!showForm);
            setDone(false);
            setError('');
          }}
          style={{ marginBottom: 24 }}
        >
          {showForm ? 'Cancel' : 'Leave a review'}
        </button>

        {/* Submission Form */}
        {showForm && (
          <form
            className="card"
            onSubmit={submitReview}
            style={{ maxWidth: 640, marginBottom: 32 }}
          >
            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="field">
              <label>Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>★★★★★ — Excellent</option>
                <option value={4}>★★★★☆ — Good</option>
                <option value={3}>★★★☆☆ — Average</option>
                <option value={2}>★★☆☆☆ — Poor</option>
                <option value={1}>★☆☆☆☆ — Bad</option>
              </select>
            </div>

            <div className="field">
              <label>Your review (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
              />
            </div>

            <button className="btn" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Submit review'}
            </button>
          </form>
        )}

        {/* Success / Error messages */}
        <div aria-live="polite" style={{ marginBottom: 20 }}>
          {done && (
            <p className="ok">
              Thank you! Your review has been submitted and is awaiting approval.
            </p>
          )}
          {error && <p className="err">{error}</p>}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="spinner" />
        ) : reviews.length === 0 ? (
          <p className="muted">
            No reviews yet. Be the first to leave one!
          </p>
        ) : (
          <div className="grid">
            {reviews.map((r) => (
              <div className="card" key={r.id}>
                <div className="stars">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
                {r.comment && <p style={{ marginTop: 10 }}>{r.comment}</p>}
                <p className="muted" style={{ marginTop: 12 }}>
                  — {r.author}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}