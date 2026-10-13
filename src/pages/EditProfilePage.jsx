import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    preferredLearningMode: 'ONLINE',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/users/me');
      setFormData({
        fullName: data.fullName || '',
        bio: data.bio || '',
        preferredLearningMode: data.preferredLearningMode || 'ONLINE',
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch current profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updated = await api.put('/api/users/me', formData);
      updateUser({ fullName: updated.fullName });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile editor..." />;

  return (
    <div className="container-narrow">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Edit Profile</h1>
            <p className="card-subtitle">Update your personal information and learning preferences</p>
          </div>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            Cancel
          </Link>
        </div>

        <AlertBanner type="success" message={success} />
        <AlertBanner message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              required
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="preferredLearningMode">Preferred Learning Mode</label>
            <select
              id="preferredLearningMode"
              name="preferredLearningMode"
              className="form-select"
              value={formData.preferredLearningMode}
              onChange={handleChange}
            >
              <option value="ONLINE">Online (Video Call / Google Meet / Discord)</option>
              <option value="IN_PERSON">In Person (Campus / Library / Lab)</option>
              <option value="HYBRID">Hybrid (Flexible)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">Biography / Interests</label>
            <textarea
              id="bio"
              name="bio"
              className="form-textarea"
              placeholder="Describe your background, areas of study, and goals..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
            <Link to="/profile" className="btn btn-secondary">
              Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
