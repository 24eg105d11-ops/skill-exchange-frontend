import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { StatusBadge } from '../components/StatusBadge';

export function IncomingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchIncoming();
  }, []);

  const fetchIncoming = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/exchanges/incoming');
      setRequests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load incoming requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);
      const updated = await api.patch(`/api/exchanges/${id}/accept`);
      setSuccess('Exchange request ACCEPTED! You can now chat and coordinate learning sessions.');
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message || 'Failed to accept request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this exchange proposal?')) return;

    try {
      setActionLoading(id);
      const updated = await api.patch(`/api/exchanges/${id}/reject`);
      setSuccess('Exchange request declined.');
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading incoming requests..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Skill Exchange Requests</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review proposals sent to you by other peers
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <span className="btn btn-primary btn-sm">
            Received ({requests.length})
          </span>
          <Link to="/requests/outgoing" className="btn btn-secondary btn-sm" style={{ border: 'none' }}>
            Sent Requests
          </Link>
        </div>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📬</div>
          <h3 className="empty-title">No incoming exchange requests</h3>
          <p className="empty-desc">
            When other students propose to barter skills with you, their requests will appear here for your review.
          </p>
          <Link to="/discovery" className="btn btn-primary">
            Discover Peers to Exchange With
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
                      <Link to={`/users/${req.requesterId}`} style={{ color: 'var(--text-main)' }}>
                        {req.requesterName}
                      </Link>
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Received on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAccept(req.id)}
                        disabled={actionLoading === req.id}
                        className="btn btn-success btn-sm"
                      >
                        {actionLoading === req.id ? 'Accepting...' : 'Accept Exchange'}
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoading === req.id}
                        className="btn btn-danger btn-sm"
                      >
                        Decline
                      </button>
                    </>
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
                    They will TEACH you:
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {req.offeredSkill?.name} ({req.offeredSkill?.category})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    They want you to TEACH them:
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
