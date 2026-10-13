import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { StatusBadge } from '../components/StatusBadge';

export function ExchangeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExchangeDetails();
  }, [id]);

  const fetchExchangeDetails = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/exchanges/${id}`);
      setExchange(data);
    } catch (err) {
      setError(err.message || 'Failed to load exchange details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionPath, successMessage) => {
    try {
      setActionLoading(true);
      setError('');
      const updated = await api.patch(`/api/exchanges/${id}/${actionPath}`);
      setExchange(updated);
      setSuccess(successMessage);
    } catch (err) {
      setError(err.message || `Failed to ${actionPath} exchange.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading exchange details..." />;

  const isRequester = exchange?.requesterId === user?.id;
  const isReceiver = exchange?.receiverId === user?.id;

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/requests/incoming" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
          &larr; Back to Requests
        </Link>
        <StatusBadge status={exchange?.status} />
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h1 className="card-title">Skill Barter Exchange #{exchange?.id}</h1>
            <p className="card-subtitle">
              Initiated on {new Date(exchange?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Requester {isRequester && '(You)'}
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
              <Link to={`/users/${exchange?.requesterId}`} style={{ color: 'var(--text-main)' }}>
                {exchange?.requesterName}
              </Link>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exchange?.requesterEmail}</p>
          </div>

          <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Recipient {isReceiver && '(You)'}
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
              <Link to={`/users/${exchange?.receiverId}`} style={{ color: 'var(--text-main)' }}>
                {exchange?.receiverName}
              </Link>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exchange?.receiverEmail}</p>
          </div>
        </div>

        {/* Skills Involved */}
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Mutual Exchange Terms</h3>

          <div className="grid-cols-2">
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                Skill Taught by {exchange?.requesterName}:
              </span>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1e3a8a', marginTop: '0.2rem' }}>
                {exchange?.offeredSkill?.name}
              </div>
              <span className="badge badge-beginner">{exchange?.offeredSkill?.category}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                Skill Taught by {exchange?.receiverName}:
              </span>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#713f12', marginTop: '0.2rem' }}>
                {exchange?.wantedSkill?.name}
              </div>
              <span className="badge badge-beginner">{exchange?.wantedSkill?.category}</span>
            </div>
          </div>
        </div>

        {/* Proposal Note */}
        {exchange?.message && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Introductory Message
            </h4>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.5, background: '#ffffff', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              {exchange.message}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          {exchange?.status === 'PENDING' && isReceiver && (
            <>
              <button
                onClick={() => handleAction('accept', 'Exchange accepted successfully!')}
                disabled={actionLoading}
                className="btn btn-success"
              >
                Accept Exchange Request
              </button>
              <button
                onClick={() => handleAction('reject', 'Exchange request declined.')}
                disabled={actionLoading}
                className="btn btn-danger"
              >
                Decline Request
              </button>
            </>
          )}

          {exchange?.status === 'PENDING' && isRequester && (
            <button
              onClick={() => handleAction('cancel', 'Exchange request cancelled.')}
              disabled={actionLoading}
              className="btn btn-secondary"
            >
              Cancel Outgoing Request
            </button>
          )}

          {(exchange?.status === 'ACCEPTED' || exchange?.status === 'COMPLETED') && (
            <Link to={`/conversations`} className="btn btn-primary">
              Open Direct Chat Room &rarr;
            </Link>
          )}

          {exchange?.status === 'ACCEPTED' && (
            <button
              onClick={() => handleAction('complete', 'Exchange marked as COMPLETED! Congratulations on your learning exchange.')}
              disabled={actionLoading}
              className="btn btn-success"
            >
              Mark Exchange as Completed &#10003;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
