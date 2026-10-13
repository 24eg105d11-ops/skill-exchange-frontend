import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { SkillBadge } from '../components/SkillBadge';

export function SkillDiscoveryPage() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    searchPeers();
  }, [category, proficiency]);

  const loadCategories = async () => {
    try {
      const cats = await api.get('/api/skills/categories');
      setCategories(cats || []);
    } catch {
      // Ignore category load error
    }
  };

  const searchPeers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.append('query', query.trim());
      if (category) params.append('category', category);
      if (proficiency) params.append('proficiency', proficiency);

      const data = await api.get(`/api/discovery/users?${params.toString()}`);
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to search learning peers.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchPeers();
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Skill Discovery &amp; Peer Search</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Discover learning partners by searching for specific skills, topics, or categories
        </p>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label className="form-label" htmlFor="searchQuery">Search Keyword</label>
            <input
              id="searchQuery"
              type="text"
              placeholder="e.g. Java, React, French, Graphic Design..."
              className="form-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="filterCategory">Skill Category</label>
            <select
              id="filterCategory"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="filterProficiency">Min Proficiency</label>
            <select
              id="filterProficiency"
              className="form-select"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
            >
              <option value="">Any Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching registered learning partners..." />
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">No matching peers found</h3>
          <p className="empty-desc">
            Try adjusting your search keywords, clearing the category filter, or check the Smart Matches tab.
          </p>
          <button
            onClick={() => { setQuery(''); setCategory(''); setProficiency(''); searchPeers(); }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-cols-2">
          {users.map((peer) => (
            <div key={peer.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      <Link to={`/users/${peer.id}`} style={{ color: 'var(--text-main)' }}>
                        {peer.fullName}
                      </Link>
                    </h3>
                    <span className="badge badge-beginner" style={{ marginTop: '0.2rem' }}>
                      Mode: {peer.preferredLearningMode || 'Online'}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {peer.bio || 'Active learning peer on Skill Exchange.'}
                </p>

                {/* Skills they teach */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Can Teach:
                  </div>
                  {peer.skillsOffered?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {peer.skillsOffered.map((s) => (
                        <SkillBadge key={s.id} name={s.skillName} proficiency={s.proficiencyLevel} type="OFFERED" />
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None listed</span>
                  )}
                </div>

                {/* Skills they want */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Wants to Learn:
                  </div>
                  {peer.skillsWanted?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {peer.skillsWanted.map((s) => (
                        <SkillBadge key={s.id} name={s.skillName} proficiency={s.proficiencyLevel} type="WANTED" />
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None listed</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <Link to={`/users/${peer.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  View Full Profile
                </Link>
                <Link to={`/users/${peer.id}#exchange`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Propose Exchange
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
