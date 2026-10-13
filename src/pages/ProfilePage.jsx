import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertBanner } from '../components/AlertBanner';
import { SkillBadge } from '../components/SkillBadge';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/users/me');
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your profile..." />;

  return (
    <div className="container-narrow">
      <AlertBanner message={error} onClose={() => setError('')} />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{profile?.fullName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile?.email}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-beginner">Learning Mode: {profile?.preferredLearningMode}</span>
              <span className="badge badge-intermediate">Role: {profile?.role}</span>
            </div>
          </div>
          <Link to="/profile/edit" className="btn btn-secondary">
            Edit Profile
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Biography</h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {profile?.bio || 'No biography provided yet. Click Edit Profile to add one.'}
          </p>
        </div>
      </div>

      {/* Skills Offered Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Skills I Can Teach (Offered)</h2>
            <p className="card-subtitle">Skills you share with others in barter exchanges</p>
          </div>
          <Link to="/my-skills/add" className="btn btn-primary btn-sm">
            + Add Offered Skill
          </Link>
        </div>

        {(!profile?.skillsOffered || profile.skillsOffered.length === 0) ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p className="empty-desc">You haven't listed any skills to teach yet.</p>
            <Link to="/my-skills/add" className="btn btn-primary btn-sm">Add Skill</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skillsOffered.map((s) => (
              <SkillBadge
                key={s.id}
                name={s.skillName}
                category={s.category}
                proficiency={s.proficiencyLevel}
                type="OFFERED"
              />
            ))}
          </div>
        )}
      </div>

      {/* Skills Wanted Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Skills I Want to Learn (Wanted)</h2>
            <p className="card-subtitle">Skills you wish to learn from other peers</p>
          </div>
          <Link to="/my-skills/add" className="btn btn-primary btn-sm">
            + Add Wanted Skill
          </Link>
        </div>

        {(!profile?.skillsWanted || profile.skillsWanted.length === 0) ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p className="empty-desc">You haven't listed any skills you want to learn yet.</p>
            <Link to="/my-skills/add" className="btn btn-primary btn-sm">Add Skill</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skillsWanted.map((s) => (
              <SkillBadge
                key={s.id}
                name={s.skillName}
                category={s.category}
                proficiency={s.proficiencyLevel}
                type="WANTED"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
