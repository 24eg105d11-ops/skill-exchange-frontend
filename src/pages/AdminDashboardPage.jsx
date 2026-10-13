import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { StatusBadge } from '../components/StatusBadge';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/dashboard/admin');
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load administrator metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading platform analytics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Administration</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            System-wide analytics, user account status, and skill moderation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-secondary">
            Manage Users
          </Link>
          <Link to="/admin/skills" className="btn btn-primary">
            Moderate Skills
          </Link>
        </div>
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {/* Analytics KPI Row */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{stats?.totalUsers || 0}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
            {stats?.activeUsers || 0} currently active
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Catalog Skills</span>
          <span className="stat-value" style={{ color: '#0ea5e9' }}>
            {stats?.totalSkills || 0}
          </span>
          <Link to="/admin/skills" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage catalog &rarr;
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Exchanges</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>
            {(stats?.pendingRequests || 0) + (stats?.acceptedExchanges || 0) + (stats?.completedExchanges || 0)}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {stats?.pendingRequests || 0} pending &bull; {stats?.acceptedExchanges || 0} active
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed Barters</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>
            {stats?.completedExchanges || 0}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {stats?.totalMessages || 0} chat messages sent
          </span>
        </div>
      </div>

      {/* Recent System Activity Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Recent System-Wide Exchange Proposals</h2>
            <p className="card-subtitle">All barter activity across registered users</p>
          </div>
        </div>

        {(!stats?.recentSystemExchanges || stats.recentSystemExchanges.length === 0) ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p className="empty-desc">No exchanges registered yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requester</th>
                  <th>Recipient</th>
                  <th>Offered &harr; Wanted</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSystemExchanges.map((ex) => (
                  <tr key={ex.id}>
                    <td>#{ex.id}</td>
                    <td><strong>{ex.requesterName}</strong></td>
                    <td><strong>{ex.receiverName}</strong></td>
                    <td>
                      {ex.offeredSkill?.name} &harr; {ex.wantedSkill?.name}
                    </td>
                    <td>
                      <StatusBadge status={ex.status} />
                    </td>
                    <td>{new Date(ex.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/exchanges/${ex.id}`} className="btn btn-secondary btn-sm">
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
