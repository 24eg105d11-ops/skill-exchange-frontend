import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New Skill Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming',
    description: '',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const [skillsData, catsData] = await Promise.all([
        api.get('/api/admin/skills'),
        api.get('/api/skills/categories'),
      ]);
      setSkills(skillsData || []);
      setCategories(catsData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentActive, name) => {
    try {
      setActionLoading(id);
      setError('');
      const updated = await api.patch(`/api/admin/skills/${id}/status`);
      setSkills(skills.map((s) => (s.id === id ? updated : s)));
      setSuccess(`Skill "${name}" status toggled to ${updated.active ? 'ACTIVE' : 'DISABLED'}.`);
    } catch (err) {
      setError(err.message || 'Failed to toggle skill status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    try {
      setActionLoading('create');
      setError('');
      const created = await api.post('/api/skills', newSkill);
      setSkills([...skills, created]);
      setSuccess(`Skill "${created.name}" created and added to platform catalog!`);
      setShowAddForm(false);
      setNewSkill({ name: '', category: 'Programming', description: '' });
    } catch (err) {
      setError(err.message || 'Failed to create skill.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading catalog skills..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Skill Catalog Moderation</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review platform skills, disable inappropriate listings, and create new catalog items
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add Catalog Skill'}
          </button>
          <Link to="/admin" className="btn btn-secondary btn-sm">
            &larr; Admin Overview
          </Link>
        </div>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Add New Catalog Skill Collapsible Card */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.75rem', border: '2px solid var(--border-focus)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Create New Master Catalog Skill
          </h3>
          <form onSubmit={handleCreateSkill}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kubernetes, Rust, Public Speaking"
                  className="form-input"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Programming, Design, Languages"
                  className="form-input"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Overview of concepts covered under this skill..."
                className="form-textarea"
                style={{ minHeight: '75px' }}
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={actionLoading === 'create'}>
              {actionLoading === 'create' ? 'Saving...' : 'Save to Catalog'}
            </button>
          </form>
        </div>
      )}

      {/* Skills Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td><strong>{s.name}</strong></td>
                  <td>
                    <span className="badge badge-beginner">{s.category}</span>
                  </td>
                  <td style={{ maxWidth: '350px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {s.description || 'No description provided'}
                  </td>
                  <td>
                    <span className={`badge ${s.active ? 'badge-status-accepted' : 'badge-status-rejected'}`}>
                      {s.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(s.id, s.active, s.name)}
                      disabled={actionLoading === s.id}
                      className={`btn btn-sm ${s.active ? 'btn-danger' : 'btn-success'}`}
                    >
                      {actionLoading === s.id ? 'Saving...' : s.active ? 'Disable' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
