import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { StatusBadge } from '../components/StatusBadge';

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/dashboard/user');
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to load user dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome, {dashboard?.userFullName}!
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Overview of your active skill barter requests, recommendations, and learning progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/my-skills/add" className="btn btn-primary">
            + Add New Skill
          </Link>
          <Link to="/matches" className="btn btn-secondary">
            View Smart Matches &rarr;
          </Link>
        </div>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Skills Offered</span>
          <span className="stat-value">{dashboard?.skillsOfferedCount || 0}</span>
          <Link to="/my-skills" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage offered &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-label">Skills Wanted</span>
          <span className="stat-value">{dashboard?.skillsWantedCount || 0}</span>
          <Link to="/my-skills" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage wanted &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending Requests</span>
          <span className="stat-value" style={{ color: 'var(--warning)' }}>
            {dashboard?.pendingExchangesCount || 0}
          </span>
          <Link to="/requests/incoming" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {dashboard?.incomingRequestsCount} incoming &bull; {dashboard?.outgoingRequestsCount} outgoing
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed Exchanges</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>
            {dashboard?.completedExchangesCount || 0}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {dashboard?.acceptedExchangesCount || 0} currently active
          </span>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid-cols-2">
        {/* Recommended Partners Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Top Partner Recommendations</h2>
              <p className="card-subtitle">Algorithmic suggestions matching your learning goals</p>
            </div>
            <Link to="/matches" className="btn btn-secondary btn-sm">
              See All
            </Link>
          </div>

          {(!dashboard?.topRecommendations || dashboard.topRecommendations.length === 0) ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p className="empty-desc">
                No matching partners found yet. Try adding more skills to your 'Wanted' or 'Offered' lists!
              </p>
              <Link to="/my-skills/add" className="btn btn-primary btn-sm">
                Add Skill
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboard.topRecommendations.map((match, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#faf5ff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <Link to={`/users/${match.user.id}`} style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
                        {match.user.fullName}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Learning mode: {match.user.preferredLearningMode}
                      </div>
                    </div>
                    <span className="badge badge-advanced" style={{ fontWeight: 800 }}>
                      {match.matchScore}% Match
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#581c87', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    &ldquo;{match.matchReason}&rdquo;
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span className="badge badge-offered">Teaches: {match.matchedOfferedSkill?.name}</span>
                    </div>
                    <Link to={`/users/${match.user.id}`} className="btn btn-primary btn-sm">
                      Propose Exchange
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Exchanges Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Exchange Activity</h2>
              <p className="card-subtitle">Your active and past exchange requests</p>
            </div>
            <Link to="/requests/incoming" className="btn btn-secondary btn-sm">
              All Requests
            </Link>
          </div>

          {(!dashboard?.recentExchanges || dashboard.recentExchanges.length === 0) ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p className="empty-desc">
                You have no active skill exchanges yet. Search for peers and send a request!
              </p>
              <Link to="/discovery" className="btn btn-primary btn-sm">
                Discover Peers
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {dashboard.recentExchanges.map((ex) => (
                <div
                  key={ex.id}
                  style={{
                    padding: '0.9rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    backgroundColor: 'white'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {ex.requesterName} &harr; {ex.receiverName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Offer: <strong>{ex.offeredSkill?.name}</strong> | Want: <strong>{ex.wantedSkill?.name}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <StatusBadge status={ex.status} />
                    <Link to={`/exchanges/${ex.id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
