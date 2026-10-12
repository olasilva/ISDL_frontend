// src/admin/sections/PostUpdates.tsx
import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';

interface Update {
  id: number;
  title: string;
  content: string;
  published: boolean;
  image_url: string | null;
  created_at: string;
}

export default function PostUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUpdates = async () => {
    try {
      const res = await api.get('/updates');
      setUpdates(res.data.data);
    } catch (err) {
      console.error('Fetch updates error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    removeImage();
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('published', 'true');
      if (imageFile) formData.append('image', imageFile);

      // ✅ Let axios set the Content-Type (with boundary) automatically
      const res = await api.post('/updates', formData);

      setUpdates([res.data.data, ...updates]);
      resetForm();
      showToast('Update published successfully!');
    } catch (err: any) {
      console.error('Publish error:', err.response?.data || err.message);
      showToast(
        err.response?.data?.error || 'Failed to publish. Check console.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUpdate = async (id: number) => {
    if (!confirm('Delete this update? This will also remove the image.')) return;
    try {
      await api.delete(`/updates/${id}`);
      setUpdates(updates.filter(u => u.id !== id));
      showToast('Update deleted');
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Site Updates</h1>
          <p>Publish news, announcements, and updates with images.</p>
        </div>
        <button 
          className="btn-icon primary" 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '12px 20px', fontSize: '.85rem' }}
        >
          <i className={`bx ${showForm ? 'bx-x' : 'bx-plus'}`} />
          {showForm ? 'Cancel' : 'New Update'}
        </button>
      </div>

      {showForm && (
        <div className="modern-card" style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '20px' }}>Create New Update</h3>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="modern-field">
              <label>Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter a compelling title..."
                required 
              />
            </div>

            <div className="modern-field">
              <label>Cover Image (Optional)</label>
              {imagePreview ? (
                <div className="upload-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button"
                    className="upload-preview-remove" 
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    <i className="bx bx-x" />
                  </button>
                </div>
              ) : (
                <div 
                  className={`upload-area ${dragging ? 'dragging' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">
                    <i className="bx bx-image-add" />
                  </div>
                  <p><strong>Click to upload</strong> or drag and drop</p>
                  <p style={{ fontSize: '.75rem', marginTop: '6px' }}>PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            <div className="modern-field">
              <label>Content</label>
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="Write your update here..."
                required
                style={{ minHeight: '150px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-icon" onClick={resetForm}>
                <i className="bx bx-x" />
                Cancel
              </button>
              <button type="submit" className="btn-icon primary" disabled={submitting}>
                <i className="bx bx-send" />
                {submitting ? 'Publishing...' : 'Publish Update'}
              </button>
            </div>
          </form>
        </div>
      )}

      {updates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bx bx-news" />
          </div>
          <h3>No updates yet</h3>
          <p>Click "New Update" to publish your first post.</p>
        </div>
      ) : (
        updates.map(u => (
          <div key={u.id} className="update-card">
            <div className="update-thumb">
              {u.image_url ? (
                <img src={u.image_url} alt={u.title} />
              ) : (
                <i className="bx bx-image bx-lg" />
              )}
            </div>
            <div className="update-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <h3>{u.title}</h3>
                <span className={`badge ${u.published ? 'badge-published' : 'badge-draft'}`}>
                  {u.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="msg-time">
                {new Date(u.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              <p>{u.content.length > 160 ? u.content.substring(0, 160) + '...' : u.content}</p>
              <div className="msg-actions">
                <button onClick={() => deleteUpdate(u.id)} className="btn-icon danger">
                  <i className="bx bx-trash" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {toast && (
        <div className={`toast show ${toast.type}`}>
          <i className={`bx ${toast.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}`} />
          {' '}{toast.msg}
        </div>
      )}
    </div>
  );
}