import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { SkillBadge } from '../components/SkillBadge';

export function MatchesPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/matches/recommendations');
      setRecommendations(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load matching recommendations.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating complementary skill matches..." />;

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Smart Match Recommendations</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Pairs determined by our Java complementarity algorithm based on your wanted skills and other peers' offerings.
        </p>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Algorithm Explainer Box */}
      <div style={{
        backgroundColor: '#eef2ff',
        border: '1px solid #c7d2fe',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        fontSize: '0.875rem',
        color: '#3730a3'
      }}>
        <strong>How Matching Works:</strong> A <strong>100% Perfect Match</strong> occurs when you can teach what the other student wants, and they can teach what you want (Reciprocal barter). A <strong>75% Match</strong> occurs when they teach a skill you specifically want to learn.
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h3 className="empty-title">No Recommendations Available</h3>
          <p className="empty-desc">
            To generate recommendations, please make sure you have listed at least one skill you can teach (Offered) and one skill you want to learn (Wanted).
          </p>
          <Link to="/my-skills/add" className="btn btn-primary">
            + Add Skills Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recommendations.map((match, idx) => (
            <div key={idx} className="card" style={{ borderLeft: match.matchScore >= 100 ? '4px solid var(--primary)' : '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    <Link to={`/users/${match.user.id}`} style={{ color: 'var(--text-main)' }}>
                      {match.user.fullName}
                    </Link>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {match.user.email} &bull; Mode: {match.user.preferredLearningMode}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      backgroundColor: match.matchScore >= 100 ? '#dcfce7' : '#e0e7ff',
                      color: match.matchScore >= 100 ? '#15803d' : '#4338ca',
                      padding: '0.35rem 0.8rem'
                    }}
                  >
                    {match.matchScore}% Compatibility
                  </span>
                </div>
              </div>

              {/* Rationale explanation banner */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderLeft: '3px solid var(--primary)',
                padding: '0.75rem 1rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-main)'
              }}>
                <strong>Recommendation Reason:</strong> {match.matchReason}
              </div>

              {/* Barter details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                    What they teach you:
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e3a8a', marginTop: '0.2rem' }}>
                    {match.matchedOfferedSkill ? match.matchedOfferedSkill.name : 'Flexible Offer'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: '#fefce8', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                    What you can teach them:
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#713f12', marginTop: '0.2rem' }}>
                    {match.matchedWantedSkill ? match.matchedWantedSkill.name : 'Select from your offered skills'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Link to={`/users/${match.user.id}`} className="btn btn-secondary">
                  View Full Profile
                </Link>
                <Link to={`/users/${match.user.id}#exchange`} className="btn btn-primary">
                  Propose Skill Exchange &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
