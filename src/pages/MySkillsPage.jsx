import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';

export function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/user-skills/me');
      setSkills(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, skillName) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from your profile?`)) {
      return;
    }

    try {
      await api.delete(`/api/user-skills/${id}`);
      setSuccess(`Removed "${skillName}" from your profile.`);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete skill.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading your skills..." />;

  const offered = skills.filter((s) => s.skillType === 'OFFERED');
  const wanted = skills.filter((s) => s.skillType === 'WANTED');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage My Skills</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Configure the skills you can teach and the skills you are seeking to learn
          </p>
        </div>
        <Link to="/my-skills/add" className="btn btn-primary">
          + Add New Skill
        </Link>
      </div>

      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <AlertBanner message={error} onClose={() => setError('')} />

      <div className="grid-cols-2">
        {/* Skills I Can Teach */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Skills I Teach (Offered)</h2>
              <p className="card-subtitle">{offered.length} skills listed</p>
            </div>
            <span className="badge badge-offered">Teaching</span>
          </div>

          {offered.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p className="empty-desc">You have not added any skills you can teach.</p>
              <Link to="/my-skills/add" className="btn btn-primary btn-sm">Add Offered Skill</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {offered.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.skillName}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span className="badge badge-beginner">{item.category}</span>
                      <span className="badge badge-advanced">{item.proficiencyLevel}</span>
                    </div>
                    {item.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, item.skillName)}
                    className="btn btn-danger btn-sm"
                    title="Remove skill"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills I Want to Learn */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Skills I Want (Wanted)</h2>
              <p className="card-subtitle">{wanted.length} skills listed</p>
            </div>
            <span className="badge badge-wanted">Learning</span>
          </div>

          {wanted.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p className="empty-desc">You have not added any skills you wish to learn.</p>
              <Link to="/my-skills/add" className="btn btn-primary btn-sm">Add Wanted Skill</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {wanted.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.skillName}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span className="badge badge-beginner">{item.category}</span>
                      <span className="badge badge-intermediate">{item.proficiencyLevel}</span>
                    </div>
                    {item.notes && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, item.skillName)}
                    className="btn btn-danger btn-sm"
                    title="Remove skill"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
