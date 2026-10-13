import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function NotificationsPage() {
  const { refreshUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/notifications');
      setNotifications(data || []);
      refreshUnreadCount();
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      refreshUnreadCount();
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      refreshUnreadCount();
    } catch (err) {
      setError(err.message || 'Failed to mark all as read.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container-narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>In-App Notifications</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Real-time alerts for requests, acceptances, and messages
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <AlertBanner message={error} onClose={() => setError('')} />

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3 className="empty-title">No notifications yet</h3>
          <p className="empty-desc">
            You'll receive notifications when another user sends you an exchange request, accepts your proposal, or sends you a chat message.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: n.isRead ? 'white' : '#f0fdf4',
                borderLeft: n.isRead ? '1px solid var(--border-color)' : '4px solid var(--success)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span className="badge badge-status-accepted" style={{ fontSize: '0.65rem' }}>
                      NEW
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {n.message}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {n.referenceId && (
                  <Link
                    to={n.type === 'NEW_MESSAGE' ? '/conversations' : `/exchanges/${n.referenceId}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View
                  </Link>
                )}

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="btn btn-outline-primary btn-sm"
                    title="Mark as read"
                  >
                    &#10003;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
