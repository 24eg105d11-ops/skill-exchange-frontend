import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { StatusBadge } from '../components/StatusBadge';

export function OutgoingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOutgoing();
  }, []);

  const fetchOutgoing = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/exchanges/outgoing');
      setRequests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load outgoing requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this outgoing exchange request?')) return;

    try {
      setActionLoading(id);
      const updated = await api.patch(`/api/exchanges/${id}/cancel`);
      setSuccess('Exchange request cancelled.');
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message || 'Failed to cancel request.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading outgoing requests..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Skill Exchange Requests</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Proposals you have sent to other peers
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <Link to="/requests/incoming" className="btn btn-secondary btn-sm" style={{ border: 'none' }}>
            Received Requests
          </Link>
          <span className="btn btn-primary btn-sm">
            Sent ({requests.length})
          </span>
        </div>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📤</div>
          <h3 className="empty-title">No sent exchange requests</h3>
          <p className="empty-desc">
            You haven't initiated any skill exchange requests yet. Find a learning partner to get started!
          </p>
          <Link to="/matches" className="btn btn-primary">
            View Partner Matches
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      To: <Link to={`/users/${req.receiverId}`} style={{ color: 'var(--text-main)' }}>
                        {req.receiverName}
                      </Link>
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Sent on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {req.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      disabled={actionLoading === req.id}
                      className="btn btn-secondary btn-sm"
                    >
                      {actionLoading === req.id ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <Link to="/conversations" className="btn btn-primary btn-sm">
                      Open Chat &rarr;
                    </Link>
                  )}

                  <Link to={`/exchanges/${req.id}`} className="btn btn-secondary btn-sm">
                    Details
                  </Link>
                </div>
              </div>

              {/* Barter Proposal Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                    You offered to TEACH:
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {req.offeredSkill?.name} ({req.offeredSkill?.category})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    You requested to LEARN:
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {req.wantedSkill?.name} ({req.wantedSkill?.category})
                  </div>
                </div>
              </div>

              {req.message && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', background: '#ffffff', padding: '0.6rem 0.85rem', borderLeft: '3px solid var(--border-focus)', borderRadius: 'var(--radius-sm)' }}>
                  &ldquo;{req.message}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
