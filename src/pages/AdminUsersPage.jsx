import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/admin/users');
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch registered users.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentActive, name) => {
    const actionName = currentActive ? 'DEACTIVATE' : 'REACTIVATE';
    if (!window.confirm(`Are you sure you want to ${actionName} user account "${name}"?`)) return;

    try {
      setActionLoading(id);
      setError('');
      const updated = await api.patch(`/api/admin/users/${id}/status`);
      setUsers(users.map((u) => (u.id === id ? updated : u)));
      setSuccess(`User "${name}" status updated to ${updated.active ? 'ACTIVE' : 'DEACTIVATED'}.`);
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user directory..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Account Management</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Review registered students and control account active status
          </p>
        </div>
        <Link to="/admin" className="btn btn-secondary btn-sm">
          &larr; Admin Overview
        </Link>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Skills (Offered / Wanted)</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>
                    <Link to={`/users/${u.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {u.fullName}
                    </Link>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-expert' : 'badge-intermediate'}`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td>
                    {u.skillsOffered?.length || 0} offered &bull; {u.skillsWanted?.length || 0} wanted
                  </td>
                  <td>
                    <span className={`badge ${u.active ? 'badge-status-accepted' : 'badge-status-rejected'}`}>
                      {u.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'ROLE_ADMIN' ? (
                      <button
                        onClick={() => handleToggleStatus(u.id, u.active, u.fullName)}
                        disabled={actionLoading === u.id}
                        className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                      >
                        {actionLoading === u.id ? 'Saving...' : u.active ? 'Disable' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protected</span>
                    )}
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
