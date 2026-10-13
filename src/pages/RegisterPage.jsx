import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertBanner } from '../components/AlertBanner';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    preferredLearningMode: 'ONLINE',
    bio: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="brand-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            New Student Account
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Join Skill Exchange
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Create your account to start offering and learning skills with peers
          </p>
        </div>

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
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <span className="form-helper">Must be unique; used to sign in to your account.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength="6"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
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
            <label className="form-label" htmlFor="bio">About You / Short Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="form-textarea"
              placeholder="Tell others what topics you are passionate about, your college year, and learning goals..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register & Create Profile'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
